<template>
	<el-dialog title="发货库存不足列表" 
	           v-model="dialog.visible"
	           :append-to-body="true" 
			   width="60%">
			<el-table border :data="tableData"  height="calc(100vh - 350px)">
				 <el-table-column prop="img" label="图片" width="60" >
				    <template #default="scope">
				     <el-image :src="scope.row.image"   width="40" height="40"  ></el-image>
				   </template>
				 </el-table-column>
				 <el-table-column prop="product" label="名称/SKU"   show-overflow-tooltip>
				    <template #default="scope">
				       <div class='name'>{{scope.row.name}}</div>
				       <el-link type="primary" class="font-small">{{scope.row.sku}} </el-link>
				 	  <AssemblyDialog @change="getAssembliyList(scope.row)" :loading="scope.row.assloading" :assemblyList="scope.row.assemblyList">
						  <template #field>
							  <el-link type="warning" class="font-small" v-if="scope.row.issfg=='1'"
							  size="small" 
							  style="margin-left:3px;" >组</el-link>
						  </template>
					  </AssemblyDialog>
				   </template>
				 </el-table-column>
				 <el-table-column label="建议发货总量" prop="needship"  sortable='custom'  width="125"></el-table-column>
				 <el-table-column label="实际发货总量" sortable prop="amount" width="125">
				 	<template #default="scope">
				 		<div v-if="scope.row.amount">{{scope.row.amount}}</div>
				 		<div v-else>0</div>
				 	</template>
				 </el-table-column>
				 <el-table-column label="可用库存" sortable prop="quantity" width="100">
				 	<template #default="scope">
				 	         <div class="text-center pointer" >
				 					<span v-if="scope.row.quantity">{{scope.row.quantity}}</span>
				 			        <span  v-else >0</span>
				 			 </div>
				 			<div v-if="scope.row.canAssembly">
				 			  <span class="font-extraSmall" >可组装:{{scope.row.canAssembly}} </span>
				 			</div>
				 	</template>
				 </el-table-column>
				 <el-table-column label="提示" sortable prop="quantity" width="100">
				 	<template #default="scope">
				 	       <div>库存不足</div>
				 	</template>
				 </el-table-column>
			</el-table>
			<template #footer>
				<el-button @click="dialog.visible=false">关闭</el-button>
				<el-button @click="handleAdd" type="primary" >确认发货</el-button>
			</template>	
		</el-dialog>
</template>

<script setup>
	import{ref,defineExpose,reactive,toRefs,onMounted}from"vue"
	import {Close} from '@element-plus/icons-vue';
	import AssemblyDialog from "./assembly_dialog";
	import { ElMessage, ElMessageBox } from 'element-plus';
	import {sublit} from "@/api/erp/assembly/assemblyApi";
	const state=reactive({
		  dialog:{visible:false},tableData:[] ,warehouseid:"",
	})
	const emit = defineEmits(['change']);
	const {
	   dialog ,tableData,loading,warehouseid,
	} = toRefs(state);
	function show(warehouseid,data){
		state.dialog.visible=true;
		state.warehouseid=warehouseid;
		state.tableData=data;
	}
	function getAssembliyList(row){
		if(!row["assemblyList"]){
			row.assloading=true;
			sublit({materialid:row.id,warehouseid:state.warehouseid}).then(res=>{
				row.assemblyList=res.data;
				row.assloading=false;
			});
		}
	}
	function handleAdd(){
		state.dialog.visible=false;
		emit("change");
	}
	defineExpose({
	  show
	})
</script>

<style>
	.badShip{
		 background-color: #fff3ec;
	}
</style>