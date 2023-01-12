<template>
	<GlobalTable
	border
	:queryParams="queryParams"
	:inDialog = 'true'
	@loadTable="loadtableData" >
		<template #field>
		<el-table-column  prop="pay" label="付款方式" />
		<el-table-column prop="type" label="费用类型" />
	     <el-table-column prop="price" label="支付金额"/>
		  <el-table-column prop="remarks" label="备注"  />
		  <el-table-column prop="operate" label="操作人" />
		  <el-table-column prop="time" label="操作时间"  />
	    </template>
	</GlobalTable>
</template>

<script setup>
	import {ref,reactive,onMounted,toRefs,defineExpose} from 'vue'
	const state = reactive({
		queryParams: {} ,
	})
	const {
		queryParams,
	}=toRefs(state)
	function loadtableData(params,callback){
		callback({
			records:[
			{
			pay:'支付宝支付',
			type:'运费',
			}
		],
			total:2,
		})
	}
</script>

<style>
</style>
