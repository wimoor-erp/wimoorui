<template>
	<GlobalTable  :defaultSort="defaultSort" 
	 show-summary
	 @selectionChange='selectChange' :tableData="tableData"
	 height="calc(100vh - 230px)" border @loadTable="loadTableData" >
		<template #field>
		<el-table-column label="图片" width="65" prop="number"></el-table-column>
		<el-table-column label="名称/SKU" prop="wtoname" show-overflow-tooltip>
			<template #default="scope" >
				<div class="name">{{scope.row.name}}</div>
				<div class="sku">{{scope.row.sku}}</div>
			</template>
		</el-table-column>
		<el-table-column label="库存" sortable="custom"  prop="a">
			<template #header>
				<el-space :size="4">
				  <span>库存</span>
				   <el-tooltip
				          effect="dark"
				          content="可用+待出库"
				          placement="top-start"
				        >
				          <el-icon class="ic-cen font-small"><InfoFilled /></el-icon>
				        </el-tooltip>
				</el-space>
			</template>
		</el-table-column>
		<el-table-column label="待入库库存" sortable="custom" prop="c"></el-table-column>
		<el-table-column label="采购单价(￥)" prop="d"></el-table-column>
		<el-table-column label="总货值(￥)" prop="e"></el-table-column>
		<el-table-column label="在途货值(￥)" sortable="custom" prop="b"></el-table-column>
		<el-table-column label="采购待付款(￥)" sortable="custom" prop="b"></el-table-column>
		<el-table-column label="其他费用(￥)" prop="f"></el-table-column>
		<el-table-column label="头程运费(￥)" prop="g">	</el-table-column>
		<el-table-column label="备注" prop="h">
		</el-table-column>
		</template>
	</GlobalTable>
</template>

<script setup>
	import {h,ref,reactive,toRefs,defineExpose,defineEmits} from 'vue';
	import outApi from '@/api/erp/inventory/outApi.js';
	import {InfoFilled,} from '@element-plus/icons-vue'
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	const state=reactive({
		tableData:{records:[
			{
				image:'',
				name:'12m/39ft Christmas Pine Garland Artificial Pine Wreath Xmas Decorations with 12 Pcs Holiday',
				sku:'DAWDAWD',a:22,b:2,c:0,d:2.90,e:5565.05,f:0,g:0,h:"-",
			},
		],total:1},
	})
	const{
		tableData,
	}=toRefs(state)
</script>

<style>

</style>
