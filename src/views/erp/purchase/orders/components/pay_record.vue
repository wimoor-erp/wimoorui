<template>
	<el-table :data="tableData" border>
		<el-table-column  prop="methodname" label="付款方式" >
			<template #default="scope">
			{{NullTransform(scope.row.methodname)}}
			</template>
		</el-table-column>	
		<el-table-column prop="projectname" label="费用类型" />
	    <el-table-column prop="payprice" label="支付金额(￥)"/>
		<el-table-column prop="remark" label="备注"  />
		<el-table-column prop="operator" label="操作人" />
		<el-table-column prop="opttime" label="操作时间"  />
	</el-table>
</template>

<script setup>
	import {ref,reactive,onMounted,toRefs,defineExpose} from 'vue';
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import NullTransform from"@/utils/null-transform";
	const state = reactive({
		tableData:[],
	})
	const {
		tableData,
	}=toRefs(state)
	function show(id,ftype){
		 ftype="all";
		 purchaselistApi.getRecdetail({"id":id,"ftype":"pay","paytype":ftype}).then((res)=>{
		 	if(res.data && res.data.paylist){
				state.tableData=res.data.paylist;
		 	}
		 });
	}
	defineExpose({
		show,
	})
</script>

<style>
</style>
