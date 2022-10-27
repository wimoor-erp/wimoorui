	<template>
		<el-dialog v-model="costVisable" title="其他成本" destroy-on-close='true' width="800px"  >
				<el-row>
					<el-space >
			         <el-button type="primary" @click="addCost">添加成本</el-button>
					 <Datepicker ref="datepickers" @changedate="changedate" />
					 <el-button> 费用类型管理</el-button>
					</el-space>
				</el-row>
				<el-table border class="m-t-16" :data="tableData">
					<el-table-column label="费用类型">
						<template #default="scope">
							<el-select v-model="scope.row.costType"></el-select>
						</template>
					</el-table-column>
					<el-table-column label="分摊日期" width="250">
						<template #default="scope">
						<el-date-picker
						        v-model="scope.row.date"
						        type="date"
						        placeholder="请选择"
						      />
						</template>
					</el-table-column>
					<el-table-column label="金额" >
						<template #default="scope">
							<el-input v-model="scope.row.price">
								<template #append>
									<el-select v-model="scope.row.currenty">
										<el-option label="USD" :value="1"></el-option>
									</el-select>
								</template>
							</el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button v-if="true" type="primary" link>编辑</el-button>
							<el-button v-else type="primary" link>保存</el-button>
							<el-button type="primary" link>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
		  <template #footer>
		  	<span class="dialog-footer">
		  		<el-button @click="costVisable = false"> 关闭</el-button>
		  	</span>
		  </template>
		</el-dialog>
	</template>
	
	<script setup>
		import {ref,reactive,onMounted,defineExpose } from "vue"
		import Datepicker from '@/components/header/datepicker.vue';
        let costVisable = ref(false)
		let tableData = reactive([{
			costType:'',
			data:'',
			price:'',
		}])
     	defineExpose({
	    costVisable
	})
	function addCost(){
		tableData.push({
			costType:'',
			data:'',
			price:'',
		})
	}
	</script>
	
	<style>
	</style>
	
