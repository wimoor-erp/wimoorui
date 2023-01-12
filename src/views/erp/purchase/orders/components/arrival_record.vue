<template>
	<GlobalTable
	border
	:queryParams="queryParams"
	:inDialog = 'true'
	@loadTable="loadtableData" >
		<template #field>
		<el-table-column  prop="code" label="订单编码" width="130"/>
		<el-table-column prop="time" label="订单时间"  />
	     <el-table-column prop="detail" label="入库数量" />
	     <el-table-column prop="postcode" label="供应商"  />
		  <el-table-column prop="phone" label="采购数量"  />
		  <el-table-column prop="landlord" label="操作人" />
		  <el-table-column prop="remark" label="操作时间"  show-overflow-tooltip   />
	     <el-table-column fixed="right" label="操作" width="80">
	       <template #default="scope">
	         <el-button
	           type="primary"
			   link
	           @click.stop="handleUpdate(scope.row)"
	          >撤销入库
	         </el-button>
	       </template>
	     </el-table-column>
	    </template>
	</GlobalTable>
</template>

<script setup>
	import { ref,reactive,onMounted,} from 'vue'
	function loadtableData(params,callback){
		callback({
			records:[
				{
			code:'PF202212010075',
			}
		],
			total:1,
		})
	}
</script>

<style>
</style>
