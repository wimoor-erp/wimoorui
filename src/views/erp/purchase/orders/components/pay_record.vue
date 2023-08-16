<template>
	<el-table :data="tableData" border>
		<el-table-column  prop="methodname" label="付款方式" >
			<template #default="scope">
			{{NullTransform(scope.row.methodname)}}
			</template>
		</el-table-column>	
		<el-table-column prop="projectname" label="费用类型" />
	    <el-table-column prop="payprice" label="支付金额(￥)">
			<template #default="scope">
				{{scope.row.payprice}}
				<el-button v-if="scope.row.auditstatus==0" link size="mini" type="info" disable   >已撤销</el-button> 
				<el-button v-else link size="mini" type="primary"   @click.stop="cancelAccItem(scope.row)">撤销</el-button> 
			</template>	 
		</el-table-column>
		<el-table-column prop="remark" label="备注"  />
		<el-table-column prop="operator" label="操作人" />
		<el-table-column prop="opttime" label="操作时间"  />
	</el-table>
</template>

<script setup>
	import {ref,reactive,onMounted,toRefs,defineExpose} from 'vue';
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
    import { ElMessage, ElMessageBox } from 'element-plus';
	import NullTransform from"@/utils/null-transform";
	const state = reactive({
		tableData:[],
		ftype:"all",
		entryid:"",
	})
	const {
		tableData,
	}=toRefs(state)
	function show(id,ftype){
		 state.ftype="all";
		 state.entryid=id;
		 handleQuery();
	}
	function handleQuery(){
		purchaselistApi.getRecdetail({"id":state.entryid,"ftype":"pay","paytype":state.ftype}).then((res)=>{
			if(res.data && res.data.paylist){
						state.tableData=res.data.paylist;
			}
		});
	}
	function cancelAccItem(row){
		ElMessageBox.confirm(
			'你确定要撤销该笔记录吗?',
			{
			  confirmButtonText: '确认',
			  cancelButtonText: '取消',
			  type: 'warning',
			  callback:(action)=>{
				 if(action=="confirm"){
						 purchaselistApi.cancelPayment({id:row.id}).then(res=>{
						  ElMessage({
							type: 'success',
							message: '撤销成功',
						  })
						  handleQuery();
						})  
				 }
			  }
			}
		  )
		
	}
	defineExpose({
		show,
	})
</script>

<style>
</style>
