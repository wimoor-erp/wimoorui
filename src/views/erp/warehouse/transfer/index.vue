<template>
	<div class="main-sty">
		<div class="con-header">
	    	<Header/>
		</div>
		<div class="con-body">
			<GlobalTable
					height="calc(100vh - 220px)" 
					:queryParams="queryParams"
					@loadTable="loadtableData" 
					@selectionChange="handleSelectionChange"
			         >
				<template #field>
				<el-table-column label="调库单编码" prop="code" />
				<el-table-column label="调出仓库" prop="warhouse"/>
				<el-table-column label="调入仓库" prop="warhouse_in"/>
				<el-table-column label="状态" width="120">
					<template #default="scope">
						<el-tag :type="scope.row.state.style">{{scope.row.state.label}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作人" prop="operator"/>
				<el-table-column label="操作时间" prop="opttime">
					<template #default="scope">
						<span>{{scope.row.opttime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark"/>
				<el-table-column label="操作">
					<template #default='scope'>
					<el-space>
						<el-button @click="handleDetail(scope.row)" type="primary" link>详情</el-button>
					  </el-space>	
					</template>
				</el-table-column>
				</template>
			</GlobalTable>
		</div>
	</div>
</template>

<script setup>
	import Header from"./components/header.vue"
	import {ref,reactive,toRefs,onMounted,defineEmits,defineProps}from"vue"
	import {MoreOne,} from '@icon-park/vue-next';
	import {Histogram} from '@element-plus/icons-vue'
	import { ElMessage, ElMessageBox, ElDivider } from 'element-plus'
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const state = reactive({
		queryParams:{},
		
	})
	const {
		queryParams
	}=toRefs(state)
	function loadtableData(params,callback){
		callback({records:[
			{
				code: "PD202212300001",
				warhouse: '东莞外包仓-正品仓',
				warhouse_in: '清湖仓-正品仓',
				state:{label:"已发货",style:"success"},
				operator:'张三',
				opttime:'2020-02-20',
				remark:'',
			},
		],total:1})
	}
	function handleQuery(){
		state.queryParams.searchSession=new Date();
	}
	function handleDetail(){
		router.push({
			path:"/e/w/t/d",
			query:{
				title:'调库单详情',
				path:"/e/w/t/d",
			},
		})
	}
	onMounted(() => {
	  handleQuery();
	});
</script>

<style>
</style>
