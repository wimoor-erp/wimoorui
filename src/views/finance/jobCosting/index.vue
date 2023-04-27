<template>
	<div class="main-sty">
		<div class="con-header">
		<el-row>
			<el-space>
		<WarehouseFba />
		<el-select v-model="orderType" @change="handleQuery" placeholder="全部类型" clearable>
			<el-option v-for="item in orderOptions" :label="item.label" :value="item.value"></el-option>
		</el-select>
		<div class="date-picker-group">
			<el-select v-model="dateType" @change="handleQuery">
				<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<DatepickerMonth ref="datepickers" @changedate="changedate" />
		</div>
		<el-select v-model="status" @change="handleQuery" placeholder="状态" clearable>
			<el-option v-for="item in statusOptions" :label="item.label" :value="item.value"></el-option>
		</el-select>
		<el-input  v-model="searchKeywords" @input="searchConfirm" placeholder="请输入" class="input-with-select" >
		  <template #prepend>
		    <el-select v-model="selectlabel" @change='searchTypeChange' style="width: 110px">
		      <el-option label="MSKU" value="sku"></el-option>
		      <el-option label="单据号" value="code"></el-option>
		      <el-option label="货件号" value="shipmentCode"></el-option>
		    </el-select>
		  </template>
		  <template #append>
		    <el-button @click="searchConfirm">
		       <el-icon class="ic-cen font-medium">
		        <search />
		     </el-icon>
		    </el-button>
		  </template>
		</el-input>
		<el-button @click="clearSearch">重置</el-button>
		</el-space>
		</el-row>	
		<el-row>
			<el-space>
				<el-button @click="handleEdit" type="primary">重置成本</el-button>
				<el-button >导出</el-button>
				</el-space>
			<div class="rt-btn-group">
				<el-button   class='ic-btn' title='帮助文档'>
					<help theme="outline" size="16" :strokeWidth="3"/>
				</el-button>
			</div>
		</el-row>
		</div>
		<div class="con-body">
			<Table ref="tableRef"/>
		</div>
	</div>
</template>

<script setup>
	import DatepickerMonth from '@/components/header/datepicker_month.vue';
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue'
	import {Help,} from '@icon-park/vue-next';
	import Table from"./components/table.vue"
	import WarehouseFba from '@/components/header/warehouse_fba.vue';
	import {useRouter } from 'vue-router'
	const tableRef = ref()
	const router = useRouter()
	const state=reactive({
		queryParam:{},
		dateOptions:[
			{label:'发货日期',value:'1',},
			{label:'入库日期',value:'2',}
		],
		dateType:'1',
		orderOptions:[
			{label:'货件补货',value:'1',},
			{label:'订单发货',value:'2',},
			{label:'买家退货',value:'3',},
			{label:'期初库存',value:'4',},
			{label:'库存调整',value:'5',},
			{label:'库存调整',value:'6',},
		],
		statusOptions:[
			{label:'未开始',value:'1',},
			{label:'扣减中',value:'2',},
			{label:'已扣完',value:'3',},
		],
		status:'',
		orderType:'',
		selectlabel:"sku",
	})
	const {
		dateType,
		queryParam,
		dateOptions,
		orderOptions,
		orderType,
		statusOptions,
		status,
		selectlabel,
	}=toRefs(state)
	
	function handleEdit(){
		router.push({
			path:"/f/j/e",
			query:{
				title:'重置成本',
				path:"/f/j/e",
				rows:JSON.stringify(tableRef.value.state.selectRow)
			},
		})
	}
	
</script>

<style>
	.font-32{
		font-size:32px;
	}
</style>
