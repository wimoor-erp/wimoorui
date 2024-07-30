<template>
	<el-dialog v-model="detailVisible" :title="'对应处理货件：'+shipmentid" class="ship-detail-dialog" top="3vh" width="85%" center >
	<div >
		<div   v-loading="loading">
	<div class="pag-radius-bor mar-bot" >
	  <div class="con-body">
		  <h3 class="m-b-8"> 
		  <span v-if="step==1">装箱</span>
		  <div v-if="step==2" style="height:25px;">
			  <div style="float:left">发货出库</div>
			  <div style="float:right">物流跟踪</div>
			  </div>
		  <span v-if="step==3">海关</span>
		  <span v-if="step==4">亚马逊接收</span>
		  </h3>
		  <TwoBox @stepdata="stepChange" ref="twoRef"  @change="stepChange(1)" v-if="step==1" />
		  <ThreeDeliver @stepdata="stepChange" ref="threeRef" @change="stepChange(3)" v-if="step==2" />
		  <CustomsPicking ref="customsPickingRef" v-if="step==3" @change="stepChange(4)"></CustomsPicking>
		  <FourReceive ref="fourRef" v-if="step==4"/> 
	  </div>
	</div>
	  <div class="pag-radius-bor"  >
	  		  <ShipmentInfo ref="shipmentRef" @change="handleShipmentInfo" />
	  </div>
</div>
</div>
	</el-dialog>
</template>
<script>
    export default{ name:"发货流程" };
</script>
<script setup>
	import { ref,reactive,onMounted,nextTick } from 'vue'
	import { useRoute,useRouter } from 'vue-router'
	import {Printer,AddPrint,InboxOut,ShoppingCartDel} from '@icon-park/vue-next';
	import CustomsPicking from"./components/customs_picking.vue"
	import TwoBox from"./components/two_box.vue"
	import ThreeDeliver from"./components/three_deliver.vue"
	import FourReceive from"./components/four_receive.vue"
	import ShipmentInfo from"./components/shipment_info.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	const emit = defineEmits(['change']);
	let router = useRouter()
	const oneRef =ref();
	const shipmentRef =ref();
	const twoRef=ref();
	const threeRef=ref();
	const customsPickingRef=ref();
	const fourRef=ref();
	let step =ref(-1);
	let detailVisible=ref(false);
	let loading=ref(false);
	let shipmentid = ref("");
	let localRow=ref({});
			function show(row,mstep){
				localRow.value=row;
				shipmentid.value=row.shipmentid;
				detailVisible.value=true;
				step.value=mstep;
				loading.value=true;
				nextTick(()=>{
					var timer=setTimeout(()=>{
						shipmentRef.value.getBaseInfo(row.shipmentid);
					},200);
				});
			}
			defineExpose({show})
			function handleShipmentInfo(data){
				loading.value=false;
				    if(step.value==-1){
						if(data.shipment.status=="3"||data.shipment.status==3){
							step.value=1;
						}else if(data.shipment.status=="4"||data.shipment.status==4){
							step.value=2;
						}else if(data.shipment.status=="5"||data.shipment.status==5){
							step.value=3;
						}else if(data.shipment.status=="6"||data.shipment.status==6){
							step.value=4;
						}else{
							step.value=4;
						}
					} 
					nextTick(()=>{
					     handleStep(data);
					});
			}
			
			function handleStep(data){
			  if(step.value==1){
					if(twoRef.value){
						twoRef.value.loadOptData(data);
					}else{
						setTimeout(function(){twoRef.value.loadOptData(data);},300);
					}
				}else if(step.value==2){
					if(threeRef.value){
						threeRef.value.loadOptData(data);
					}else{
						setTimeout(function(){threeRef.value.loadOptData(data);},300);
					}
					
				}else if(step.value==3){
					if(customsPickingRef.value){
						customsPickingRef.value.loadOptData(data);
					}else{
						setTimeout(function(){customsPickingRef.value.loadOptData(data);},300);
					}
					
				}else if(step.value==4){
					if(fourRef.value){
						fourRef.value.loadOptData(data);
					}else{
						setTimeout(function(){fourRef.value.loadOptData(data.itemlist);},300);
					}
					
				}
			}
			
			function stepChange(val){
				emit("change");
				loading.value=true;
				shipmentRef.value.getBaseInfo(shipmentid.value);
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
 
</style>
