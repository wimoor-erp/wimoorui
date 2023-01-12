<!-- 添加供应商时，共用的弹窗 -->

<template>
	<div >
		<el-dialog
		    v-model="suplierVisible"
		    title="选择供应商"
		    width="40%"
		    :before-close="handleClose"
		  >
		  <div class="con-header">
			  <el-row>
			<el-input   v-model="search"  @input="loadData" placeholder="搜索供应商名称或编码">
				<template #suffix >
					<el-icon :size="16" @click="loadData"><Search/></el-icon>
				</template>
			</el-input>
			</el-row>
			</div>
		   <GlobalTable ref="globalTable" :tableData="tableData" @loadTable="loadTableData" @selectionChange="selectRows" border >
			    <template #field>
			<el-table-column  type="selection" width="38" />
		   	<el-table-column prop="number" label="编码" width="120"/> 
		   	<el-table-column prop="product" label="名称" width="400" show-overflow-tooltip>
		   		<template #default="scope">
		   			<div class='name'>{{scope.row.name}}</div>
		   		</template>
		   	</el-table-column>
		   	<el-table-column prop="operator2" label="操作人"     />
			</template>
		   </GlobalTable>
		    <template #footer>
		      <span class="dialog-footer">
		        <el-button @click="suplierVisible = false">取消</el-button>
		        <el-button type="primary" @click="submit"
		          >提交</el-button >
		      </span>
		    </template>
		  </el-dialog>
	</div>
</template>

<script setup>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,watch,onMounted,toRefs,defineEmits,defineExpose } from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
    import customerApi from '@/api/erp/material/customerApi.js';
	import {ElMessage } from 'element-plus';
	const globalTable=ref();	
	const emit = defineEmits(['getdata']);
	 
	let state = reactive({
		search:'',
		tableData:{records:[],total:0},
		suplierVisible:false,
		selectRows:[],
	})    
	 let {search,tableData,suplierVisible}=toRefs(state)


	function show(){
		state.suplierVisible=true;
		setTimeout(()=>{
			loadData();
		},100);
	}
	
	function loadData(){
		globalTable.value.loadTable({"search":state.search});
	}
	function submit(){
		if(state.selectRows.length!=1){
			ElMessage({
			     message: '请提交1个供应商！',
			     type: 'error'
			})
		}else{
			state.suplierVisible=false;
			emit('getdata',state.selectRows);
		}
	}
	function selectRows(rows){
		 state.selectRows=rows;
	}
	function loadTableData(data){
		 //根据 params去查
		 customerApi.list(data).then((res)=>{
			state.tableData.records = res.data.records
			state.tableData.total =res.data.total
		 })
		 
	}
	//方法
	defineExpose({
	  show
	});
	onMounted(()=>{
		
	});
</script>

<style>
	.el-input__suffix{
		display: flex;
		align-items: center;
		font-size: 16px;
		padding-right:8px;
	}
</style>
