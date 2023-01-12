<template>
	<div class="main-sty">
		<div class="con-header">
	   <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
	     <el-tab-pane v-for="(item,index) in orderState" :label="item.label" :name="item.name" :key="item.name">
	     </el-tab-pane> 
	   </el-tabs>
	   <el-row>
		   <el-form ref="queryFormRef" :model="queryParams" :inline="true">
		   	<el-form-item prop="Shipment">
				<el-select v-model="queryParams.shipment" placeholder="发货仓库" clearable>
					<el-option v-for="item in warehouseData"></el-option>
				</el-select>
		   	</el-form-item>
		   	<el-form-item prop="receipt">
				<el-select v-model="queryParams.Receipt" placeholder="海外仓库" clearable>
					<el-option v-for="item in warehouseData"></el-option>
				</el-select>
		   	</el-form-item>
		   	<el-form-item prop="date">
				<div class="date-picker-group">
					<el-select v-model="queryParams.date.dateType">
						<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<Datepicker ref="datepickers" @changedate="changedate" />
				</div>
		   	</el-form-item>
		   	<el-form-item prop="search">
				<el-input  v-model="queryParams.search.keywords" @input="changeData" placeholder="请输入" class="input-with-select" >
				   <template #prepend>
				     <el-select v-model="queryParams.search.searchType" placeholder="SKU" style="width: 110px">
				       <el-option label="备货单号" value="sku"></el-option>
				       <el-option label="SKU" value="name"></el-option>
				       <el-option label="物流渠道" value="supplier"></el-option>
				        <el-option label="备注" value="remark"></el-option>
				     </el-select>
				   </template>
				   <template #append>
				     <el-button @click.stop="changeData">
				        <el-icon class="ic-cen font-medium">
				         <search />
				      </el-icon>
				     </el-button>
				   </template>
				 </el-input>
		   	</el-form-item>
			<el-form-item>
				 <el-button  @click="resetQuery"> 重置 </el-button>
			</el-form-item>
		   </el-form>
	   </el-row>
	   <el-row>
		   <el-button type="primary" class="im-but-one" @click="handleAdd">
				<plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
				<span >添加备货单</span>
		   </el-button>
		   <el-button>删除</el-button>
		</el-row>
		<el-row>
			<Table :queryParams="queryParams"/>
		</el-row>
	   </div>
	</div>
</template>

<script setup>
	import {ref,reactive,toRefs,onMounted,computed} from"vue"
	import {Search,} from '@element-plus/icons-vue'
	import {Plus,Help} from '@icon-park/vue-next';
	import Datepicker from '@/components/header/datepicker.vue';
	import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
	import Table from"./components/table.vue"
	import {useRouter } from 'vue-router'
	const queryFormRef = ref(ElForm);
	const router = useRouter()
	const state = reactive({
		orderState:[
			{label:'全部',name:'0'},
			{label:'待审核',name:'1'},
			{label:'配货中',name:'2'},
			{label:'已发货',name:'3'},
			{label:'已完成',name:'4'},
			{label:'已驳回',name:'5'},
		],
		dateType:'0',
		dateOptions:[
			{label:'创建日期',value:'0',},
			{label:'发货日期',value:'1',},
			{label:'到货日期',value:'2',},
		],
		//查询参数
		queryParams:{
			searchType:'sku',
			date:{dateType:'0',},
			search:{keywords:'',searchType:'sku'},
		} ,
	})
	function handleAdd(){
		router.push({
			path:"/e/w/o/s",
			query:{
				title:'添加备货单',
				path:"/e/w/o/s",
			},
		})
	}
	const {
		dateType,
		dateOptions,
		orderState,
		queryParams,
	}=toRefs(state)
	function resetQuery(){
		queryFormRef.value.resetFields();
	}
</script>

<style scoped>
	.el-form--inline .el-form-item{
		margin-right:8px;
	}
	.el-form-item--default{
		margin-bottom: 0px;
	}
</style>
