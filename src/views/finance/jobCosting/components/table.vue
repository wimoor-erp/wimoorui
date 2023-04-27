<template >
	<GlobalTable
	:defaultSort="defaultSort" 
	 @selectionChange='selectChange'
	 :tableData="tableData"
	 height="calc(100vh - 220px)"  @loadTable="loadTableData" >
	 <template #field>
		 <el-table-column type="selection" />
	   <el-table-column label="仓库名称" prop="warehouse" width="160"></el-table-column>
		<el-table-column label="批次号 "  width="120" prop="batch" />
		<el-table-column label="发货日期" width="100" prop="shipTime" sortable="custom"></el-table-column>
		<el-table-column label="图片"  width="65" prop="image" >
			<template #default="scope">
				<el-image class="product-image" :src="scope.row.image"></el-image>
			</template>
		</el-table-column>
		<el-table-column label="Msku" width="120" prop="msku" >
		</el-table-column>
		<el-table-column label="入库日期"  width="120" prop="arriveTime"  sortable="custom">	</el-table-column>
		<el-table-column label="状态"  width="80" prop="status" >
			<template #default="scope">
				<el-tag :type="scope.row.status.type">{{scope.row.status.label}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="单据号" width="140" prop="orderCode">	</el-table-column>
		<el-table-column label="货件号" width="140" prop="shipmentCode" >	</el-table-column>
		<el-table-column label="类型" width="100" prop="type" >	</el-table-column>
		<el-table-column label="数量"  width="80" prop="number" >	</el-table-column>
		<el-table-column label="扣减量"  width="80" prop="deduct" >	</el-table-column>
		<el-table-column label="剩余量"  width="80" prop="surplus" >	</el-table-column>
		<el-table-column label="采购成本"  width="100" prop="price" >	</el-table-column>
		<el-table-column label="采购总成本"  width="110" prop="sumPrice"  />
		<el-table-column label="头程费用"  width="100" prop="InitialCost"  />
		<el-table-column label="头程总费用"  width="110" prop="InitialCosts"  />
		</template>
	</GlobalTable>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,Histogram,Download,Upload} from '@element-plus/icons-vue';
	const state = reactive({
		tableData:{
			records:[
			{
				warehouse:'AB-NA北美仓',
				batch:'PC20220011',
				shipTime:'2023-02-23',
				image:require('@/assets/image/testpic.png'),
				msku:'A2008FPJYB',
				arriveTime:'2023-03-23',
				status:{label:'已扣完',type:'info'},
				orderCode:'PF202211140008',
				shipmentCode:'PF202211140008',
				type:'订单发货',
				number:'21',
				deduct:'21',
				surplus:'0',
				price:'￥9.84',
				sumPrice:'￥58.25',
				InitialCost:'￥43.25',
				InitialCosts:'￥1564.85',
			}
		],total:1},
		selectRow:[],
	})
	const{
		tableData,
		selectRow,
	}=toRefs(state)
	
	function selectChange(selection){
		state.selectRow = selection
	}
	defineExpose({
		state,
	})
</script>

<style >
	.m-l-8{
		margin-left: 8px;
	}
</style>
 