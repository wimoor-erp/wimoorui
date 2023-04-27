<template>
	<el-scrollbar class="he-scr-car" @scroll="scroll">
	<div class="main-sty">
		<div class="con-header">
			<el-row>
				 <el-alert title="可以对未关联发货单的商品成本进行重置,
				 修改后将会影响财务模块的利润报表与销售模块的利润统计的成本数据,
				 系统数据次日生效.
				 " type="warning" show-icon />
			</el-row>
			<el-row>
				<el-button
				 @click="handleAdd"
				 type="primary">添加</el-button>
			</el-row>
		</div>
		<div class="con-body">
			
			<el-row>
				<el-table :data="tableData">
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
							<el-table-column label="单据号" width="140" prop="orderCode">	</el-table-column>
							<el-table-column label="货件号" width="140" prop="shipmentCode" >	</el-table-column>
							<el-table-column label="数量"  width="80" prop="number" >	</el-table-column>
							<el-table-column label="采购成本" prop="price" >
								<template #default="scope">
									<el-input type="number"
									 @change="changePrice(scope.row)"
									 v-model="scope.row.price" clearable>
										<template #prefix>
											￥
										</template>
									</el-input>
								</template>
							</el-table-column>
							<el-table-column label="采购总成本"   prop="sumPrice"  >
							<template #default="scope">
									<el-input
									 @change="changeSumPrice(scope.row)"
									 v-model="scope.row.sumPrice" type="number" clearable>
										<template #prefix>
											￥
										</template>
									</el-input>
								</template>
							</el-table-column>
							<el-table-column label="头程费用"  prop="InitialCost"  >
							<template #default="scope">
									<el-input 
									@change="changeInitialCost(scope.row)"
									v-model="scope.row.InitialCost" type="number" clearable>
										<template #prefix>
											￥
										</template>
									</el-input>
								</template>
							</el-table-column>
							<el-table-column label="头程总费用"  prop="InitialCosts"  >
							<template #default="scope">
									<el-input
									@change="changeSumInitialCost(scope.row)"
									 v-model="scope.row.SumInitialCost" type="number" clearable>
										<template #prefix>
											￥
										</template>
									</el-input>
								</template>
							</el-table-column>
							<el-table-column label="操作"  width="65" prop="image" >
								<template #default="scope">
									<el-button type="primary" link>删除</el-button>
								</template>
							</el-table-column>
				</el-table>
			</el-row>
		</div>
	</div>
	</el-scrollbar>
	<div class='text-center mar-top-16'>
		 <div style="padding-top:10px;">
			<el-space>
				<el-button type="" @click="closeTab">关闭</el-button>
				<el-button type="primary" @click="submitForm">提交</el-button>
			</el-space>
		</div>
	</div>
	<ResetAddDialog ref="dialogRef" @getRowData="getRowData" />
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,inject} from 'vue'
	import ResetAddDialog from "./resetAddDialog.vue"
	import {useRouter } from 'vue-router'
	const emitter = inject("emitter"); // Inject `emitter`
	const router = useRouter()
	const dialogRef = ref()
	const state =reactive({
		tableData:[
		]
	})
	const {
		tableData,
	}=toRefs(state)
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	function changePrice(row){
		row.sumPrice = row.price*row.number
	}
	function changeSumPrice(row){
		row.price = row.sumPrice/row.number
	}
	function changeInitialCost(row){
		row.SumInitialCost = row.InitialCost*row.number
	}
	function changeSumInitialCost(row){
		row.InitialCost = row.SumInitialCost/row.number
	}
	
	function handleAdd(){
		dialogRef.value.show()
	}
	
	function getRowData(selection){
		 selection.forEach((item)=>{
			state.tableData.push(item)
		})
	}
	
	function putData(){
		const arr = JSON.parse(router.currentRoute.value.query.rows)
		arr.forEach((item)=>{
			state.tableData.push(item)
		})
	}
	onMounted(()=>{
		putData()
	})
</script>

<style>
	.he-scr-car{
		height:calc(100vh - 150px);
		margin-bottom: 20px;
	}
</style>
