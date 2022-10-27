<template>
	<div class="con-header">
	<el-dialog v-model="consumVisable"  title="辅料选择">
		<el-row>
		<el-input   v-model="searchSku"  placeholder="搜索辅料">
			<template #suffix >
				<el-icon :size="16"><Search/></el-icon>
			</template>
		</el-input>
		</el-row>
		<el-row>
	 
		<GlobalTable ref="globalTable" :tableData="tableData"  @loadTable="loadTableData" border
		 @selectionChange = "selectRow">
		  <template #field>
			<el-table-column type="selection" width="40"/>
			<el-table-column prop="img" label="图片" width="60"> 
				<template #default="scope">
					<el-image :src="scope.row.img" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="product" label="辅料名称/辅料SKU" width="400" show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sku}} </div>
				</template>
			</el-table-column>
			<el-table-column prop="amount" label="可用库存" width="100"   />
			<el-table-column prop="supplier" label="供应商"  >
			</el-table-column>
		</template>
		</GlobalTable>
		</el-row>
		<Pagination :total="total" :pagesize ="pagesize" :currentPage="currentPage"/>
	
		<template #footer>
			<el-button @click="consumVisable=false">取消</el-button>
			<el-button type="primary" @click="submitconsum" >提交</el-button>
		</template>
	</el-dialog>
	</div>
</template>

<script>
	import {ref,reactive} from 'vue'
	import {Plus,Minus,} from '@icon-park/vue-next';
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {ElMessage} from 'element-plus';
    import GlobalTable from "@/components/Table/GlobalTable/index";
	export default{
		components: {
			Plus,Minus,GlobalTable,
			Search,
		},
		emits:["consumChecked"],
		setup(props,context){
			let consumVisable = ref(false)
			let rows =ref()
			let tableData=reactive({records:[
				{
					img:'',
					name:'箱子',
					sku:'BGA029',
					amount:'200',
					supplier:'东莞市浩天纸业有限公司',
				},
			],total:1})
			function selectRow(selection, row){
				rows.value = row
			}
			function submitconsum(){
				context.emit("consumChecked",rows.value)
				consumVisable.value=false
			}
		
			return{
			rows,
			consumVisable,
			tableData,
			submitconsum,
			selectRow,
			}
		}
		}
</script>

<style>
</style>
