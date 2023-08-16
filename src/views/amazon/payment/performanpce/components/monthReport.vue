<template>
	<el-dialog 
	v-model="visable"
	width="90%"
	title="月度业绩">
		<div class="con-header">
			<el-row>
				<el-space>
				 <Owner @owner="changeOwner" ref="ownerRef" ></Owner>
				 <Currency ref="currencyRef" @change="getData" />
				 <DatepickerMonth ref="datepickers" @changedate="changedate" />
				 <el-button @click="clearSearch">重置</el-button>
				</el-space>
			</el-row>
		</div>
		<div class="con-body">
			<GlobalTable
			:defaultSort="defaultSort" 
			 show-summary
			 @selectionChange='selectChange'
			 :tableData="tableData"
			 height="calc(100vh - 400px)"  @loadTable="loadTableData" >
			 <template #field>
			   <el-table-column label="序号" fixed type="index" width="65"></el-table-column>
				<el-table-column label="月份 " fixed width="120" prop="month" />
				<el-table-column label="销量" width="100" prop="sale" sortable="custom"></el-table-column>
				<el-table-column label="订单量"  width="100" prop="order" sortable="custom"></el-table-column>
				<el-table-column label="销售额" width="120" prop="salesVolume" sortable="custom">
					<template #default="scope">
						{{scope.row.salesVolume}}
					</template>
				</el-table-column>
				<el-table-column label="广告销量"  width="120" prop="adSales" sortable="custom" >	</el-table-column>
				<el-table-column label="广告销售额"  width="120" prop="adSalesVolume" sortable="custom">	</el-table-column>
				<el-table-column label="退款量" width="100" prop="refundAmount" sortable="custom">	</el-table-column>
				<el-table-column label="退款率" width="100" prop="refundRate" sortable="custom">	</el-table-column>
				<el-table-column label="ASOAS" width="100" prop="asoas" sortable="custom">	</el-table-column>
				<el-table-column label="采购成本"  width="120" prop="procuremenCost" sortable="custom">	</el-table-column>
				<el-table-column label="广告花费"  width="120" prop="adCost" sortable="custom">	</el-table-column>
				<el-table-column label="推广费"  width="120" prop="promotionFee" sortable="custom">	</el-table-column>
				<el-table-column label="平台费"  width="120" prop="platformFee" sortable="custom">	</el-table-column>
				<el-table-column label="FBA赔偿"  width="120" prop="fbaCompensation" sortable="custom" />
				<el-table-column label="仓储费"  width="120" prop="storageFee" sortable="custom"  />
				<el-table-column label="FBA配送费"  width="120" prop="InitialCost" sortable="custom" />
				<el-table-column label="毛利润"  width="120" prop="grossProfit" sortable="custom"  />
				<el-table-column label="毛利率"  width="120" prop="grossProfitMargin" sortable="custom"  />
				</template>
			</GlobalTable>
		</div>
	</el-dialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import Owner from '@/components/header/owner.vue';
	import Currency from '@/components/header/currency.vue';
	import DatepickerMonth from '@/components/header/datepicker_month.vue';
	const state=reactive({
		visable:false,
		tableData:{
			records:[
			{
				month:'2023-03',
				sale:'50',
				order:'49',
				salesVolume:'￥56465.00',
				adSales:'122',
				adSalesVolume:'￥19655.00',
				refundAmount:'15',
				refundRate:'1.2%',
				asoas:'21.5%',
				procuremenCost:'￥2656.50',
				adCost:'￥18588.50',
				promotionFee:'￥0.00',
				platformFee:'￥79.84',
				fbaCompensation:'￥2179.84',
				storageFee:'￥6458.25',
				InitialCost:'￥24143.25',
				grossProfit:'￥156564.85',
				grossProfitMargin:'30.5%',
			}
		],total:1}
	})
	const {
		visable,
		tableData,
	}= toRefs(state)
	function show(){
		state.visable = true
	}
	defineExpose({
		show,
	})
</script>

<style>
</style>
