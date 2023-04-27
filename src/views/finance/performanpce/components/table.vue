<template >
	<GlobalTable
	:defaultSort="defaultSort" 
	 show-summary
	 @selectionChange='selectChange'
	 :tableData="tableData"
	 height="calc(100vh - 220px)"  @loadTable="loadTableData" >
	 <template #field>
	   <el-table-column label="序号" fixed type="index" width="65"></el-table-column>
		<el-table-column label="负责人 " fixed width="120" prop="operator" />
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
		<el-table-column label="月报表" fixed="right" width="80">
			<template #default="scope">
				<el-link @click="monthSales(scope.row)"
				type="warning" >
				<el-icon class="ic-cen"><Histogram /></el-icon>
				</el-link>
			</template>
		</el-table-column>
		</template>
	</GlobalTable>
	<MonthReport ref="mrRef"/>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,Histogram,Download,Upload} from '@element-plus/icons-vue';
	import MonthReport from"./monthReport.vue"
	const mrRef = ref()
	const state = reactive({
		tableData:{
			records:[
			{
				sale:'50',
				order:'49',
				salesVolume:'￥56465.00',
				adSales:'122',
				adSalesVolume:'￥19655.00',
				operator:'张三',
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
	const{
		tableData,
	}=toRefs(state)
	
	function monthSales(){
		mrRef.value.show() 
	}
</script>

<style >
	.m-l-8{
		margin-left: 8px;
	}
</style>
 