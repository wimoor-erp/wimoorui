<template>
	<el-table :show-header="false" :data='tableData'>
		<el-table-column label="周期" prop="cycle"/>
		<el-table-column label="广告组"/>
		<el-table-column label="状态"/>
		<el-table-column label="广告组合"/>
		<el-table-column label="分时策略"/>
		<el-table-column label="类型"/>
		<el-table-column label="开始日期"/>
		<el-table-column label="结束日期"/>
		<el-table-column label="预算"/>
		<el-table-column label="竞价策略"/>
		<el-table-column label="曝光量"/>
		<el-table-column label="点击次数"/>
		<el-table-column label="点击率"/>
		<el-table-column label="每次点击费用"/>
		<el-table-column label="广告费"/>
		<el-table-column label="广告销售额"/>
		<el-table-column label="销量"/>
		<el-table-column label="订单量"/>
		<el-table-column label="ACOS"/>
		<el-table-column label="ROAS"/>
		<el-table-column label="转化率"/>
		<el-table-column label="广告贡献销售额-目标商品"/>
		<el-table-column label="广告贡献销售额-其它商品"/>
		<el-table-column label="广告转化量-目标商品"/>
		<el-table-column label="广告转化量-其它商品"/>
		<el-table-column label="展开"/>
	</el-table>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	const state = reactive({
		tableData:[
			{cycle:'1天内成交'},
			{cycle:'7天内成交'},
			{cycle:'14天内成交'},
			{cycle:'30天内成交'},
			
		],
	})
	const{
		tableData,
	}=toRefs(state)
</script>

<style>
	 .el-table__expanded-cell{
		padding:0px!important;
	}
	 .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
</style>