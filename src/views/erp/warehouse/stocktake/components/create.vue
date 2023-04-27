<template>
	<div >
			 
						 <div class="gird-line-head">
						 <h3 v-if="iswork==false">创建盘点单</h3>
						 <h3 v-else>编辑盘点单</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							
						 <el-form :model="form"
						   :rules="rules"
						   label-width="120px">
							  <el-row>
							 <el-col :span="12">
							 <el-form-item label="单据编码"   >
							 	<el-input class="in-wi-24" disabled  v-model="form.number" placeholder="请输入"> </el-input>
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
							 <el-form-item label="备注"  >
							 	<el-input class="in-wi-24" type="textarea" v-model="form.remark" placeholder="备注"> </el-input>
							 </el-form-item>
						  </el-col>
							 <el-col :span="12">
								 <el-form-item label="库位"   prop="warehouse">
									 <el-cascader
									       v-model="warehouseCheck"
									       :options="warehouseData"
									 	   :value = "name"
									 	   :label="name"
									       :props="props"
									       @change="warehouseChange"
									 	  placeholder="全部仓库"
										  :disabled="iswork"
									 	  clearable
									     />
								 </el-form-item>
							 </el-col>
							 <el-col :span="12"  v-if="iswork">
							  <el-form-item label="状态"  >
							     <el-tag type="success" effect="dark" >盘点中</el-tag>
							  </el-form-item>
							  </el-col>
							  </el-row>
						 </el-form>
						
						 <el-divider></el-divider>
						 <div class="mark-re">
						   <h5 >产品列表</h5>
						   <div style="margin-left: 700px;">
							   <el-radio-group v-model="hasinv" @change="loadItemList"  >
							     <el-radio label="1" >库存为零参与盘点 </el-radio>
							     <el-radio label="2" >库存为零不参与盘点</el-radio>
							   </el-radio-group>
							</div>
							 <div>
							    <el-input v-model="searchKeywords" @input="loadItemList"  placeholder="搜索SKU" clearable />
						    </div>
						 </div>
						 <GlobalTable ref="globalTable" :tableData="tableData"   height="calc(100vh - 440px)"  border @loadTable="loadTableData" >
						 	<template #field>
							 <el-table-column  prop="image" label="图片"  width="70px">
							    <template #default="scope">
							     <el-image v-if="scope.row.image" :src="scope.row.image"  class="product-img"></el-image>
							 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"    class="product-img"  ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column  prop="name" label="名称/SKU" sortable="custom"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column label="成本单价(￥)" prop="price" sortable="custom"/>
							 <el-table-column label="可用库存" prop="fulfillable" sortable="custom"/>
							 <el-table-column label="待出库" prop="outbound" sortable="custom"/>
							 <el-table-column label="盘点数量">
								  <template #default="scope">
									  <el-input :disabled="!iswork" clearable  @blur="saveItem(scope.row)" @clear="removeItem(scope.row)"  @input="scope.row.amount=CheckInputInt(scope.row.amount)"  v-model="scope.row.amount">
									  </el-input>
								  </template>  
							 </el-table-column>
							  <el-table-column label="账面数量"  >
								  <template #default="scope">
									  {{handleNums(scope.row)}}
								   </template>
							 </el-table-column>  
							  <el-table-column label="盘盈数量" prop="overamount" />
							  <el-table-column label="盘亏数量" prop="lossamount" />
						 </template>
						 </GlobalTable>
						</div>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button type="" @click="closeTab">关闭</el-button>
									<el-button type="primary" v-if="iswork==false&&!id" @click="startForm">开始盘点</el-button>
									<el-button type="primary" v-if="iswork==true" @click="cancelForm">取消盘点</el-button>
									<el-button type="primary" v-if="iswork==true" @click="endForm">盘点完成</el-button>
								</el-space>
							</div>
						</div>
	</div>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage,ElMessageBox } from 'element-plus'
	import { useRoute,useRouter } from 'vue-router';
	import stocktakingApi from '@/api/erp/inventory/stocktakingApi.js';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi';
	import {CheckInputFloat,CheckInputInt} from '@/utils/index';
	import serialnumberApi from '@/api/erp/common/serialnumberApi.js';
	const emitter = inject("emitter"); // Inject `emitter`
	const props = {
	  expandTrigger: 'hover',
	  value:'id',
	  label:'name',
	}
	let globalTable=ref();
	function closeTab(){
		router.push({
			path:"/erp/warehouse/stocktake",
			query:{
				title:'库存盘点',
				path:"/erp/warehouse/stocktake",
			    replace:true,
				refresh:true
			},
		})
	};
	window.onbeforeunload = function () {
	    return '确认要关闭当前窗口？';
	}
	const router = useRouter()
	var id = router.currentRoute.value.query.id;
	const state = reactive({
		warehouseCheck:null,
		iswork:false,
		tableData:{records:[],total:0},
		form:{
			
		},
		rules: {
			warehouse: [{ required: true, message: '出库仓库不能为空', trigger: 'blur' }],
		},
		hasinv:'2',
		warehouseData:[],
		searchKeywords:'',
	})
	const {
		iswork,
		form,
		tableData,
		rules,
		warehouseData,
		warehouseCheck,
		searchKeywords,
		hasinv,
	}=toRefs(state)
	
	function saveItem(row){
		if(row.amount && row.amount>0){
			var data={};
			data.id=id;
			data.warehouseid=state.warehouseCheck;
			data.materialid=row.materialid;
			data.amount=row.amount;
			if(row.itemid){
				data.itemid=row.itemid;
			}else{
				data.itemid="";
			}
			var fulfillable=0;
			var outbound=0;
			if(row["fulfillable"]) {
				fulfillable=row.fulfillable;
			}
			if(row["outbound"]) {
				outbound=row.outbound;
			}
			var overamount =parseInt(row.amount)- parseInt(fulfillable+outbound);
			data.overamount=overamount;
			stocktakingApi.saveItem(data).then((res)=>{
				if(res.data.isok==true){
					ElMessage({
					  type: 'success',
					  message: "添加成功！",
					})
				}
			});
		}
	}
	function removeItem(row){
		if(row.itemid){
			var data={};
			data.id=id;
			if(row.itemid){
				data.itemid=row.itemid;
			}else{
				data.itemid="";
			}
			stocktakingApi.removeItem(data).then((res)=>{
				if(res.data.isok==true){
					ElMessage({
					  type: 'success',
					  message: "删除成功！",
					})
				}
			});
		}
	}
	function startForm(){
		stocktakingApi.startAction({"id":id,"warehouseid":state.warehouseCheck}).then((res)=>{
			 if(res.data && res.data.isok==true){
				 
				router.push({
					path:"/e/w/s",
					query:{
						title:'编辑盘点单',
						path:"/e/w/s",
						id:id,
					},
				})
				load();
			 }
		});
	}
	function endForm(){
		var data={};
		data.id=id;
		data.warehouseid=state.warehouseCheck;
		data.remark=state.form.remark;
		stocktakingApi.endAction(data).then((res)=>{
			if(res.data.isok==true){
				ElMessage({
				  type: 'success',
				  message: "盘点完成！",
				})
				router.push({
					path:"/e/w/s/d",
					query:{
						title:'盘点单详情',
						path:"/e/w/s/d",
						id:id,
						replace:true
					},
				})
			}
		});
	}
	function cancelForm(){
		ElMessageBox.confirm('确认取消盘点吗?', '警告', {
		 				confirmButtonText: '确定',
		 				cancelButtonText: '取消',
		 				type: 'warning',
		 })
		.then(() => {
		   stocktakingApi.cancelAction({"id":id,"warehouseid":state.warehouseCheck}).then((res)=>{
		   	 if(res.data && res.data.isok==true){
		   		ElMessage({
		   		  type: 'success',
		   		  message: res.data.msg,
		   		})
		   			router.push({
		   				path:"/erp/warehouse/stocktake",
		   				query:{
		   					title:'库存盘点',
		   					path:"/erp/warehouse/stocktake",
		   				    replace:true,
							refresh:true
						},
		   			})
		   	 }else{
		   		 ElMessage({
		   		   type: 'error',
		   		   message: res.data.msg,
		   		 })
		   	 }
		   });
		})
		.catch(() => ElMessage.info('已取消操作'));
	}
	 
	function warehouseChange(val){
		var warehouseid =''
		if(val){
			state.warehouseData.forEach((item)=>{
				if(item.children && item.children.length>0){
					item.children.forEach((sub)=>{
						if(sub.id == val[1]){
							warehouseid =sub.id;
						}
					})
				}
			})
		}else{
			warehouseid =''
		}
		state.warehouseCheck=warehouseid;
		//每次改变仓库 变换list
		if(warehouseid!=''){
			loadItemList();
		}
	}
	function loadItemList(){
		var data={};
		data.search=state.searchKeywords;
		data.warehouseid=state.warehouseCheck;
		if(state.hasinv=="2"){
			data.hasInv=true;
		}else{
			data.hasInv=false;
		}
		if(id){
			data.id=id;
		}else{
			data.id="";
		}
		globalTable.value.loadTable(data);
	} 
	function loadTableData(params){
		stocktakingApi.searchCondition(params).then((res)=>{
			state.tableData.records = res.data.records;
			state.tableData.total =res.data.total;
		});
	}
	function handleNums(row){
		var amount=0,overamount=0,lossamount=0,fulfillable=0,outbound=0;
		if(row.amount2) {
			amount=row.amount2;
		}
		if(row.overamount) {
			overamount=row.overamount;
		}
		if(row.lossamount) {
			lossamount=row.lossamount;
		}
		if(row.fulfillable) {
			fulfillable=row.fulfillable;
		}
		if(row.outbound) {
			outbound=row.outbound;
		}
		if(row.amount2!=undefined) {
			return amount-overamount+lossamount;
		}else {
			return fulfillable+outbound;
		}
	}
	function load(){
		warehouseApi.getWarehouseList().then(function(res){
			state.warehouseData = res.data;
		})
		stocktakingApi.edit({"id":id}).then((res)=>{
			if(res.data){
				 state.warehouseCheck=res.data.warehouseid;
				 state.form=res.data;
				 if(res.data.isworking){
				 	 state.iswork=res.data.isworking;
				 }else{
					 serialnumberApi.getSerialNumber({"ftype":"K","isfind":"true"}).then((res)=>{
					 	if(res.data){
					 		state.form.number=res.data;
					 	}
					 });
				 }
				 state.hasinv='2';
				 if(res.data.id){
					 id=res.data.id;
				 }
				 console.log(res);
				 loadItemList();
			}
		});
	}
	onMounted(()=>{
		load();
	});
</script>

<style>
	.font-12{font-size: 12px;margin-right:4px;}
		.he-scr-car{
			height:calc(100vh - 176px);
			margin-bottom: 20px;
		}
	.in-wi-24{
			width: 400px;
		}
		.mark-re{
			margin-top: 16px;
			margin-bottom:16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	.mark-re h5::before{
		content: "";
		display: inline-block;
		height: 13px;
		width: 4px;
		margin-right:8px;
		background-color: #FF6700;
	}
	.fill-from-body{
		margin:16px 24px;
	}
</style>
