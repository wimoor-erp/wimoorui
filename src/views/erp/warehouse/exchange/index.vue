<template>
	<div class="main-sty">
		<div class="con-header">
	    	<Header/>
		</div>
		<div class="con-body">
			<GlobalTable
					height="calc(100vh - 170px)" 
					:queryParams="queryParams"
					@loadTable="loadtableData" 
					@selectionChange="handleSelectionChange"
					border
			         >
				<template #field>
				<el-table-column type="selection"></el-table-column>
				<el-table-column label="单据编码" prop="code" />
				<el-table-column label="调出SKU" prop="sku"/>
				<el-table-column label="调入SKU" prop="sku2"/>
				<el-table-column label="调动数量" prop="num"/>
				<el-table-column label="操作仓库" prop="warhouse"/>
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
				sku:'kq005',
				sku2:'kq006',
				num:'123',
				warhouse: '东莞外包仓-正品仓',
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
			path:"/e/w/e/d",
			query:{
				title:'产品互调详情',
				path:"/e/w/e/d",
			},
		})
	}
	onMounted(() => {
	  handleQuery();
	});
</script>

<style>
</style>
