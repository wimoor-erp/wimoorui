<template>
	<div class="ama-rec">
		<el-table :data="productData.list" border  show-summary >
			<el-table-column prop="image" label="图片" width="60">
				<template #default="scope">
					<el-image :src="scope.row.image" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="sku" label="名称/SKU" min-width="200"  show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.pname}}</div>
					<div class='sku'>{{scope.row.sellersku}} </div>
				</template>
			</el-table-column>
		  <el-table-column prop="quantityShipped" label="已发出" width="100"  />
		  <el-table-column prop="quantityReceived" label="已接收" width="100"  />
		  <el-table-column prop="sellersku" label="状态"  width="120"   >
			<template #default="scope">
						<div v-if="scope.row.quantityReceived>0 && scope.row.quantityShipped==scope.row.quantityReceived">
								  <el-tag type="success">完成</el-tag>
						</div>
				  <div v-else>
				  	    <el-tag type="warning">待接收</el-tag> 
				  </div>
		      </template>
		  </el-table-column>
		</el-table>
	</div>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,computed} from 'vue'
			let productData=reactive({list:[]})
			function loadOptData(datas){
				productData.list=datas;
			}
	 	    defineExpose({loadOptData})
</script>

<style>
	.ama-rec .el-table{
		width:100%;
	}
</style>
