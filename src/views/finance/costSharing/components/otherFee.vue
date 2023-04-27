<template>
	<el-dialog v-model="visable" title="费用类型管理">
		<el-button @click="handleAdd"   class="m-b-8">添加费用类型</el-button>
	    <el-table :data="tableData">
	      <el-table-column  label="费用名称"  >
		  <template #default="scope">
		  		<el-input clearable placeholder="请输入" v-model="scope.row.name" ></el-input>
		  </template>
		  </el-table-column>
	      <el-table-column  label="操作"  >
		     <template #default="scope">
				 <el-button v-if="scope.$index>0" type="primary"
				  @click="handleDelete(scope.$index)"
				  link>删除</el-button>
			 </template>
		  </el-table-column>
	    </el-table>
		 <template #footer>
		        <el-button @click="visable = false">取消</el-button>
		        <el-button type="primary" @click="handleConfirm">
		          保存
		        </el-button>
		    </template>
	  </el-dialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import { ElMessage, ElMessageBox} from 'element-plus'
	const state=reactive({
		tableData:[{
			name:'',
		}],
	  visable:false,
	})
	const {
		visable,
		tableData,
	}=toRefs(state)
	
	function show(){
		state.visable = true
	}
	function handleAdd(){
		state.tableData.push({
			name:'',
		})
	}
	function handleDelete(index){
		state.tableData.splice(index)
	}
	
	function handleConfirm(){
		ElMessage({
			message:'保存成功',
			type:"success"
		})
	}
	defineExpose({
		show,
	})
</script>

<style>
	.m-b-8{
		margin-bottom: 8px;
	}
</style>
