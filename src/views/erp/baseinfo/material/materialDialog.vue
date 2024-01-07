<!-- 添加产品时，共用的产品弹窗 -->
<template>
  <div>
  	<el-dialog v-model="dialog.visible" title="添加产品"  width="80%" top="6vh" :before-close="handleClose">
  		<div class="con-header">
  			<el-row>
  				<el-input v-model="queryParams.search" @input="loadData" placeholder="搜索产品SKU">
  					<template #suffix>
  						<el-icon :size="16">
  							<Search />
  						</el-icon>
  					</template>
  				</el-input>
  			</el-row>
  		</div>
  		<GlobalTable ref="globalTableRef" 
  		    :inDialog="true" 
			height="calc(100vh*0.55)"
  		    :tableData="tableData" 
  			@loadTable="loadTableData"
  			@selectionChange='selectChange' 
			@row-click="rowClick" 
  			border 
  			style="width: 100%;">
  			<template #field>
  				<el-table-column type="selection" :reserve-selection="false" width="38" />
  				<el-table-column prop="imgage" label="图片" width="60">
  					<template #default="scope">
  						<el-image v-if="scope.row.image" :src="scope.row.image" width="40" height="40"></el-image>
						<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
  					</template>
  				</el-table-column>
  				<el-table-column prop="sku" label="名称/SKU" show-overflow-tooltip>
  					<template #default="scope">
  						<div class='name'>{{scope.row.name}}</div>
  	 				<div class='sku'>{{scope.row.sku}} </div>
  					</template>
  				</el-table-column>
  				<el-table-column prop="fulfillable" label="可用库存" width="100"  sortable="custom">
  					<template #default="scope">
  						<div class='name'>{{scope.row.fulfillable}}</div>
  						<span v-if="scope.row.willfulfillable>0">
  							可组装:{{scope.row.willfulfillable}} 
  						</span>
  					</template>
  				</el-table-column>
  				<el-table-column prop="supplier" label="供应商">
  				</el-table-column>
				<el-table-column prop="price" label="单价">
				</el-table-column>
				<el-table-column prop="operator" label="操作数量"  width="180"   v-if="hasInput" >
					<template #default="scope">
						 <el-input-number 
						   min=0 
						   :precision="0"
						   v-model.number="scope.row.optquantity" 
						   @change="optQuantityChange(scope.row)">
						 </el-input-number>
					</template>
				</el-table-column>
  			</template>
  	 </GlobalTable>
  		<template #footer>
  			<span class="dialog-footer">
  				<el-button @click="dialog.visible = false">取消</el-button>
  				<el-button type="primary" @click="submitFunc">确认</el-button>
  			</span>
  		</template>
  	</el-dialog>
  </div>    
</template>

<script setup> 
	import { ref, reactive, onMounted,toRefs ,watch} from 'vue'
	import { Search, ArrowDown, } from '@element-plus/icons-vue'
	import { ElDivider, ElMessageBox, ElMessage } from 'element-plus'
	import materialApi from '@/api/erp/material/materialApi.js';
	import GlobalTable from "@/components/Table/GlobalTable/index";
	const state=reactive({
		tableData:{records: [],total: 0},
		ids:[],
		dialog:{visible:false},
		loading:false,
		supplierid:"",
		queryParams:{ftype:'shipment',search:"",searchtype:"sku",issfg:""}
	});
	const { loading,
			tableData,
			queryParams,
			dialog,
			search,
			ids,
			 supplierid
		  } = toRefs(state);
	let props = defineProps({hasInput:false,isAssemblyItem:false,isAssemblySKU:false,isfulfillable:false,warehouseid:"",type:""});
	const { hasInput,isAssemblyItem,isfulfillable,warehouseid,isAssemblySKU,type } = toRefs(props);
	let globalTableRef = ref(GlobalTable);
	const emit = defineEmits(['getdata']);
	function handleClose(){
		state.dialog.visible=false;
	}
	
	function loadData() {
		if (globalTableRef.value && globalTableRef.value["loadTable"]) {
			   state.queryParams.searchtype="sku";
			   globalTableRef.value.loadTable(state.queryParams);
		} else{
			setTimeout(function() {   globalTableRef.value.loadTable(state.queryParams);}, 100); 
		}
	}
	
	function rowClick(row){
			  globalTableRef.value.toggleRowSelection(row,true);
	}
	
	function loadTableData(data) {
		if(props.isAssemblyItem==true){
			data.issfg="0,2";
		}
		if(props.isAssemblySKU==true){
			data.issfg="1";
		}
		if(props.isfulfillable==true ){
			data.ftype="shipment";
		}else{
			data.ftype=undefined;
		}
		if(props.type&&props.type!=""){
			data.mtype=props.type;
		}
		if(props.warehouseid!=undefined && props.warehouseid!=null && props.warehouseid!=""){
				data.warehouseid=props.warehouseid;
		}else{
				data.warehouseid=undefined;
		}
		data.withoutTags=true;
		data.withPriceHis=true;
		materialApi.getMaterialList(data).then((res) => {
				state.tableData.records = res.data.records;
				state.tableData.total = res.data.total;
		})
	 }
	function submitFunc() {
		if (state.ids.length > 0) {
			state.dialog.visible = false;
			emit("getdata",state.ids);
		} else {
			ElMessage.error('提交的行数不能小于1！')
			state.dialog.visible = true;
		}
	}
	function selectChange(selection) {
		state.ids = selection;
	}
	function show(params){
		if(params){
			state.queryParams=params;
		}else{
			state.queryParams.supplier="";
		}
		state.dialog.visible=true;
		loadData();
	}
	function optQuantityChange(row){
		globalTableRef.value.toggleRowSelection(row,true);
	}
	defineExpose({
	  show,
	})
</script>

<style>
	.el-input__suffix {
		display: flex;
		align-items: center;
		font-size: 16px;
		padding-right: 8px;
	}
	.el-dialog__body{
		padding-top:4px;
		padding-bottom:4px;
	}
</style>
