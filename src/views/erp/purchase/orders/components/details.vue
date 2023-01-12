<template>
	<el-dialog title="采购详情" v-model="dialogVisable" width="60%">
		<div  class="product-box">
			<el-image :src="require('@/assets/image/testpic.png')"></el-image>
			<div>
				<p class="name">血手印桌布+血刀八件套+血手印红色4张（2款）+脚掌印红色4张（2款）（B1024TKJJC+FP301+FP350）（BGA029，28*50 OPP袋 </p>
				<p class="sku">C3422KQWJA</p>
			</div>
		</div>
		 <el-tabs
		    v-model="activeName"
		    type="card"
		    @tab-click="handleClick"
		  >
		    <el-tab-pane label="收货记录" name="1">
				<!-- 到货记录 -->
				 <ArrivalRecord/>
			</el-tab-pane>
		    <el-tab-pane label="物流信息" name="2">
			    <!-- 物流信息 -->
			    <LogisticsRecord/>
			</el-tab-pane>
			<el-tab-pane label="付款记录" name="3">
				<!-- 付款记录 -->
				<PayRecord />
			</el-tab-pane>
			<el-tab-pane label="交易记录" name="4">
				<!-- 交易订单记录 -->
				<OrderRecord/>
			</el-tab-pane>
		  </el-tabs>
		  <template #footer>
			  <el-button @click="dialogVisable=false">关闭</el-button>
		  </template>
	</el-dialog>
</template>

<script setup>
	import {h, ref,reactive,onMounted,watch,inject,toRefs,defineExpose} from 'vue'
    import {Close,Plus,Edit} from '@element-plus/icons-vue';
	import ArrivalRecord from "./arrival_record.vue"
	import LogisticsRecord from "./logistics_record.vue"
	import PayRecord from "./pay_record.vue"
	import OrderRecord from "./order_record.vue"
	const state = reactive({
		dialogVisable:false,
		activeName:'1',
	})
	const {
		activeName,
		dialogVisable,
	}=toRefs(state)

	function show(){
		state.dialogVisable = true;
	}
	defineExpose({
		show,
	})
</script>

<style >

.product-box{
	display: flex;
	margin-bottom: 24px;
}	
.product-box .el-image{
	margin-right: 16px;
}
.product-box .name{
font-size: 12px;
margin-bottom:8px;
}
.product-box .sku{
font-size: 12px;
color:var(--el-color-blue)
}
.m-t-32{
	margin-top: 32px;
}
</style>
