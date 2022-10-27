<template>
	<h3 id="consumables" class="tab-scroll">辅料关联</h3>
	<el-form-item label="辅料">
	 <el-table border :data="tableData">
		 <el-table-column width="50"  type="index"> 
		 			 <template #header>
		 				   <el-link :underline="false" type="primary" @click="addConsumables">
		 				   <plus  class="ic-cen" theme="outline" size="24" :strokeWidth="3"/>
		 				   </el-link>
		 			 </template>
		 </el-table-column>
		 <el-table-column width="80" label="图片">
			 <template #default="scope">
			 	<el-image :src="scope.row.img" width="40" height="40"></el-image>
			 </template>
		 </el-table-column>
		 <el-table-column label="辅料名称/辅料SKU" width="400">
			 <template #default="scope">
			 	<div class='name'>{{scope.row.name}}</div>
			 	<div class='sku'>{{scope.row.sku}} </div>
			 </template>
		 </el-table-column>
		 <el-table-column label="单价">
			  <template #default="scope">
			 <el-input v-model="scope.row.price"></el-input>
			  </template>
		 </el-table-column>
		 <el-table-column label="关联数量">
			 <template #default="scope">
			 <el-input v-model="scope.row.bindnum"></el-input>
			  </template>
		 </el-table-column>
		 <el-table-column label="操作">
			 <template #default="scope">
			 	<el-link title="删除"  type="primary" :underline="false" @click="removeConsum(scope.$index)">
			 		<minus  class="ic-cen" theme="outline" size="24"  :strokeWidth="3"/>
			 	</el-link>
			 </template>
		 </el-table-column>
	 </el-table>
	</el-form-item>
	<!-- 辅料选择弹窗 -->
	<ConsumablesDialog ref="conDiaRef" @consumChecked="consumChecked"/>
</template>

<script>
	import {} from '@element-plus/icons-vue'
	import {Plus,Minus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	import ConsumablesDialog from"./consumables_select_dialog"
	export default{
		components: {
		Plus,ConsumablesDialog,Minus,
		},
		setup(){
			let tableData = reactive([])
			let conDiaRef =ref()
			function addConsumables(){
				conDiaRef.value.consumVisable =true
			}
			function consumChecked(rows){
				console.log("rows",rows)
				tableData.push(rows)
			}
			function removeConsum(index){
				tableData.splice(index,1)
			}
			return{
				tableData,
				conDiaRef,
				addConsumables,
				consumChecked,
				removeConsum,
			}
		}
		}
</script>

<style>
</style>
