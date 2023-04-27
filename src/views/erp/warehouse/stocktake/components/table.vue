<template>
	<GlobalTable ref="globalTable" :defaultSort="defaultSort"  :tableData="tableData" height="calc(100vh - 220px)" :stripe="true"  @loadTable="loadTableData" style="width: 100%;margin-bottom:16px;">
		<template #field>
		<el-table-column type="selection"></el-table-column>
		<el-table-column label="盘点单编码" prop="number" sortable="custom"></el-table-column>
		<el-table-column label="盘点仓库" prop="warehouse"></el-table-column>
		<el-table-column label="库存总数" prop="whtotalamount" sortable="custom"></el-table-column>
		<el-table-column label="库存总金额(¥)" align="right" prop="whtotalprice" sortable="custom"></el-table-column>
		<el-table-column label="盘盈金额(¥)" align="right" prop="overprice" sortable="custom">
			<template #default="scope">
				<span v-if="scope.row.overprice" style="color: #51aa41;">+{{scope.row.overprice}}</span>
				<span v-else  >-</span>
			</template>
		</el-table-column>
		<el-table-column label="盘亏金额(¥)" align="right" prop="lossprice" sortable="custom">
			<template #default="scope">
				<span v-if="scope.row.lossprice"  style="color: #ff1c51;">-{{scope.row.lossprice}}</span>
				<span v-else  >-</span>
			</template>
		</el-table-column>
		<el-table-column label="盘点状态" prop="isworking">
			<template #default="scope">
				<el-tag v-if="scope.row.isworking==false" type="success">盘点完成</el-tag>
				<el-tag v-else type="warning">正在盘点</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="创建时间" prop="createdate">
			<template #default="scope">
				{{dateFormat(scope.row.createdate)}}
			</template>
		</el-table-column>
		<el-table-column label="备注" prop="remark"></el-table-column>
		<el-table-column label="操作">
			<template #default='scope'>
			<el-space>
				<el-button @click="handleDetails(scope.row)" type="primary" link>详情</el-button>
			  </el-space>	
			</template>
		</el-table-column>
	</template>
	</GlobalTable>
</template>

<script setup>
	import {h,ref,reactive,toRefs,defineExpose} from 'vue'
	import {Download,Edit} from '@element-plus/icons-vue';
	import {MoreOne} from '@icon-park/vue-next';
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import { useRoute,useRouter } from 'vue-router';
	import stocktakingApi from '@/api/erp/inventory/stocktakingApi.js';
	const router = useRouter()
	let detailsRef = ref()
	let globalTable=ref();
	let state = reactive({
		tableData:{records:[],total:0},
		queryParams:{},
		defaultSort:{"prop": 'opttime', "order": 'descending' }
	})
	let {
		tableData,queryParams,defaultSort
	} = toRefs(state)
	function handleDetails(row){
		router.push({
			path:"/e/w/s/d",
			query:{
				title:'盘点单详情',
				path:"/e/w/s/d",
				id:row.id
			},
		})
	}
	function load(params){
		state.queryParams=params;
		globalTable.value.loadTable(params);
	}
	function loadTableData(params){
		stocktakingApi.list(params).then((res)=>{
			state.tableData.records = res.data.records;
			state.tableData.total =res.data.total;
		})
	}
	defineExpose({
	  load,
	})
</script>

<style>

</style>
