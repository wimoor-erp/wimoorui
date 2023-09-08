<template>
	<el-dialog title="采购详情" v-model="dialogVisable" width="60%">
		<div  class="product-box">
			 <el-image v-if="entry.image" :src="entry.image" class="img-40"  width="40" height="40"  ></el-image>
			 <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="img-40"  width="40" height="40"  ></el-image>
			<div>
				<p class="name">{{entry.mname}}</p>
				<p class="sku">{{entry.sku}}</p>
			</div>
		</div>
		 <el-tabs
		    v-model="activeName"
		    type="card"
		    @tab-change="handleClick"
		  >
		    <el-tab-pane label="收货记录" name="1">
				<!-- 到货记录 -->
				 <ArrivalRecord ref="arrivalRef" />
			</el-tab-pane>
		    <el-tab-pane label="物流信息" name="2">
			    <!-- 物流信息 -->
			    <LogisticsRecord ref="logisRef" />
			</el-tab-pane>
			<el-tab-pane label="付款记录" name="3">
				<!-- 付款记录 -->
				<PayRecord ref="payRef" />
			</el-tab-pane>
			<el-tab-pane label="交易记录" name="4">
				<!-- 交易订单记录 -->
				<OrderRecord ref="orderRef" />
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
	import OrderRecord from "./order_record.vue";
	const arrivalRef=ref();
	const logisRef=ref();
	const payRef=ref();
	const orderRef=ref();
	const state = reactive({
		dialogVisable:false,
		activeName:'1',
		entry:{},
	})
	const {
		activeName,
		dialogVisable,
		entry,
	}=toRefs(state)

	function show(entrys){
		state.activeName="1";
		state.entry=entrys;
		state.dialogVisable = true;
		if(state.entry){
			setTimeout(function(){
				arrivalRef.value.show(state.entry,"all");
			},400);
		}
	}
	function handleClick(val){
		if(val=="1"){
			arrivalRef.value.show(state.entry,"all");
		}else if(val=="2"){
			logisRef.value.show(state.entry.id);
		}else if(val=="3"){
			payRef.value.show(state.entry.id,"all");
		}else{
			orderRef.value.show(state.entry);
		}
	}
	defineExpose({
		show,
	})
</script>

<style scoped>

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
.img-40{width: 40px;
height: 40px;flex: none;
margin-right: 8px;}
</style>
