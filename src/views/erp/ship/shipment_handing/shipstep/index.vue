<template>
	<div class="main-sty" >
	<div class="con-header">
		<el-row>
	  <el-col :span="24">
	  <el-steps :active="step" align-center  > 
	    <el-step  @click="stepChange(0)" title="配货" />
	    <el-step  @click="stepChange(1)" title="装箱"  />
	    <el-step  @click="stepChange(2)" title="发货出库" />
	    <el-step  @click="stepChange(3)" title="亚马逊接收" />
	  </el-steps>
	  </el-col>
	  </el-row>
	 </div>	
	  <div class="con-body"  v-loading="loading">
		  <OnePicking @stepdata="stepChange" ref="oneRef"  v-show="step==0"/>
		  <TwoBox @stepdata="stepChange" ref="twoRef"  @change="stepChange(1)" v-show="step==1" />
		  <ThreeDeliver @stepdata="stepChange" ref="threeRef" @change="stepChange(3)" v-show="step==2" />
		  <FourReceive ref="fourRef" v-show="step==3"/> 
	  </div>
	 <el-divider />
	  <div class="con-footer"  v-loading="loading">
		  <ShipmentInfo ref="shipmentRef" @change="handleShipmentInfo" />
	  </div>
	</div>  
</template>

<script setup>
	import { ref,reactive,onMounted } from 'vue'
	import { useRoute,useRouter } from 'vue-router'
	import OnePicking from"./components/one_picking.vue"
	import TwoBox from"./components/two_box.vue"
	import ThreeDeliver from"./components/three_deliver.vue"
	import FourReceive from"./components/four_receive.vue"
	import ShipmentInfo from"./components/shipment_info.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	let router = useRouter()
	let oneRef =ref()
	let shipmentRef =ref()
	let step =ref(-1)
	let threeRef=ref()
	let fourRef=ref()
	let twoRef=ref()
	let loading=ref(false);
	const shipmentid = router.currentRoute.value.query.shipmentid;
			loading.value=true;
			onMounted(()=>{
				setTimeout(()=>{
					shipmentRef.value.getBaseInfo(shipmentid);
				},1000)
			})
			
			function handleShipmentInfo(data){
				loading.value=false;
				    if(step.value==-1){
						if(data.shipmentAll.status=="0"){
							step.value=0;
						}else if(data.shipmentAll.status=="2"){
							step.value=0;
						}else if(data.shipmentAll.status=="3"){
							step.value=1;
						}else if(data.shipmentAll.status=="4"){
							step.value=2;
						}else if(data.shipmentAll.status=="5"){
							step.value=3;
						}else if(data.shipmentAll.status=="6"){
							step.value=3;
						}
						handleStep(data);
					}else{
						handleStep(data);
					}
			}
			
			function handleStep(data){
				if(step.value==0){
					oneRef.value.loadOptData(data.shipmentAll);
				}else if(step.value==1){
					twoRef.value.loadOptData(data);
				}else if(step.value==2){
					threeRef.value.loadOptData(data);
				}else if(step.value==3){
					fourRef.value.loadOptData(data.shipmentAll.itemList);
				}
			}
			
			function stepChange(val){
				step.value=val;
				loading.value=true;
				shipmentRef.value.getBaseInfo(shipmentid);
			}
</script>

<style>
	.is-success .el-step__line{
		background-color: var(--el-color-success);
	}
	.is-finish .el-step__line{
		background-color: #FF6700;
	}
	.con-footer{margin-top:16px;}
	.mar-bot{
		margin-bottom:16px;
	}
</style>
