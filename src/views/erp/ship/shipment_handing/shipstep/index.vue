<template>
	<div class="main-sty">
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
	  <div class="con-body">
		  <OnePicking @stepdata="stepChanges" ref="oneRef"  v-show="step==0"/>
		  <TwoBox @stepdata="stepChanges" ref="twoRef"  @change="stepLoad(1)" v-show="step==1" />
		  <ThreeDeliver @stepdata="stepChanges" ref="threeRef" @change="stepLoad(3)" v-show="step==2" />
		  <FourReceive ref="fourRef" v-show="step==3"/>
	  </div>
	 <el-divider />
	  <div class="con-footer">
		  <ShipmentInfo ref="shipmentRef" />
	  </div>
	</div>  
</template>

<script>
	import { ref,reactive,onMounted } from 'vue'
	import { useRoute,useRouter } from 'vue-router'
	import OnePicking from"./components/one_picking.vue"
	import TwoBox from"./components/two_box.vue"
	import ThreeDeliver from"./components/three_deliver.vue"
	import FourReceive from"./components/four_receive.vue"
	import ShipmentInfo from"./components/shipment_info.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	export default{
		name:"Index",
		components:{
			OnePicking,ShipmentInfo,TwoBox,ThreeDeliver,FourReceive
		},
		setup(){
			let router = useRouter()
			let oneRef =ref()
			let shipmentRef =ref()
			let step =ref(0)
			let threeRef=ref()
			let fourRef=ref()
			let twoRef=ref()
			onMounted(()=>{
				setTimeout(()=>{
					loadshipmentData()
				},1000)
			})
			function loadshipmentData(){
				let shipmentid = router.currentRoute.value.query.shipmentid;
				shipmenthandlingApi.getShipment(shipmentid).then((res)=>{
					oneRef.value.productData.list = res.data.itemList;
					shipmentRef.value.shipmentInfo=res.data;
					if(res.data.status=="0"){
						step.value=0;
					}else if(res.data.status=="2"){
						step.value=0;
					}else if(res.data.status=="3"){
						step.value=1;
					}else if(res.data.status=="4"){
						step.value=2;
					}else if(res.data.status=="5"){
						step.value=3;
					}else if(res.data.status=="6"){
						step.value=3;
					}
					handleStep(step.value,res);
				})
			}
			function handleStep(val,res){
				oneRef.value.productData.list = res.data.itemList;
				shipmentRef.value.shipmentInfo=res.data;
				if(val==0){
					oneRef.value.loadOptData(res.data);
				}else if(val==1){
					twoRef.value.loadOptData(res.data);
				}else if(val==2){
					threeRef.value.loadOptData(res.data);
				}else if(val==3){
					fourRef.value.productData.list=res.data.itemList;
				}
				shipmentRef.value.getBaseInfo();
				step.value=val;
			}
			function stepLoad(val){
				let shipmentid = router.currentRoute.value.query.shipmentid;
				shipmenthandlingApi.getShipment(shipmentid).then((res)=>{
					handleStep(val,res)
					
				});
				
			}
			function stepChange(val){
				step.value=val;
				 stepLoad(val);
			}
			function stepChanges(val){
				step.value=val;
				 stepLoad(val);
			}
			return{
				step,stepChange,loadshipmentData,oneRef,shipmentRef,threeRef,fourRef,twoRef,
				stepChanges,stepLoad
			}
		}
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
