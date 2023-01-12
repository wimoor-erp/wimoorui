<template>
	<el-dialog v-model="dialogVisable"
	title="近期采购记录"
	>
	<el-table border :data="tableData">
		<el-table-column label="单据编码" prop="code"></el-table-column>
		<el-table-column label="供应商"  prop="supplier"></el-table-column>
		<el-table-column label="订单状态"  prop="state">
			<template #default="scope">
				<el-tag :type="scope.row.state.type" >{{scope.row.state.label}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="数量"  prop="num" ></el-table-column>
		<el-table-column label="单价"  prop="price"></el-table-column>
		<el-table-column label="金额"  prop="amount"></el-table-column>
		<el-table-column label="收货详情"  prop="s"></el-table-column>
		<el-table-column label="付款详情"  prop="pay">
			<template #default="scope">
			 <el-tag :type="scope.row.pay.type"  effect="plain">{{scope.row.pay.label}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="采购日期"  prop="time"></el-table-column>
	</el-table>
	<template #footer>
		<el-button @click="dialogVisable=false">关闭</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import {reactive,toRefs,defineExpose}from"vue";
	const state = reactive({
		dialogVisable:false,
		tableData:[{
			code:'164daw4d8ad',
			supplier:'义乌市布荣皮革有限公司',
			state:{label:'完成',type:'success'},
			num:100,
			price:'￥10.00',
			amount:'￥1531.00',
			s:'80/100',
			pay:{label:'已付清',type:'info'},
			time:'2020-02-22',
		}]
	})
	const {
		dialogVisable,
		tableData,
	}=toRefs(state)
	function show(){
		state.dialogVisable =true
	}
	defineExpose({
		show,
	})
</script>

<style>
</style>
