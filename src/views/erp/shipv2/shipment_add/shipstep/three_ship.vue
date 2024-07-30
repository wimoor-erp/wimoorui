<template>
	<div class="box-margin">
		<div class="pag-radius-bor mar-bot" >
			
			<div class="con-body three-ship" v-if="planData.invtype=='1'">
				<Header ref="headerRef" ></Header>
				<el-card class="text-center" >虚拟发货，可以直接出库</el-card>
				<el-button  style="width:49%;margin-top:20px">耗材与箱子出库</el-button>  
				<el-button type="primary" style="width:49%;margin-top:20px">确认发货</el-button>
			</div>
			<div v-else class="con-body three-ship"  > 
			  <Header ref="headerRef" ></Header>
			  <div class="title-name">运送方式</div>
			  <!-- 					  <div><el-checkbox v-model="shipall" label="所有货件都使用相同的运输方式" size="large" /></div> -->
			  					  
			  					   <RadioCardGroup v-model="planData.transtyle">
			  							   <RadioCard  value="SP" shadow="hover"   >
			  								   <div>小包裹快递(SPD) </div>
			  							   </RadioCard>
			  							   <RadioCard  value="LTL"  shadow="hover"  >
			  								     <div>托盘配送</div>
			  							   </RadioCard>
			  					  	</RadioCardGroup>
			  					   
			  				   </div>
<!-- 				   <div>
					   <div class="title-name">
						承运商选择   
					   </div> 
					   <RadioCardGroup v-model="planData.shippingSolution" @change="handleTranstyleChange">
					   							   <RadioCard  value="AMAZON_PARTNERED_CARRIER" shadow="hover"   >
					   								  SEND 亚马逊合作承运商<br>
					   								  <span class="font-extraSmall">空运：7-15天；海运：25-40天</span>
													  <template #colfooter>
														  <div style="background-color: #FFFAE6;color:#F1A826;margin-top: 3px;padding:5px;border-radius:1ch;">
														   <gift theme="outline" size="14" fill="#F1A826"/> 配送后 30 天支付</div>
													  </template>
					   							   </RadioCard>
					   							   <RadioCard  value="USE_YOUR_OWN_CARRIER"  shadow="hover"  >
					   								    非合作承运商<br>
					   								   <span class="font-extraSmall">选择shipTrack承运商或者其他承运商</span>
					   							   </RadioCard>
					   					  	</RadioCardGroup>
						    
				   </div> -->
				   <div>
				   <div class="title-name">发货日期</div>
				   <el-date-picker
				          v-model="planData.shippingDate"
				          type="date"
				          placeholder="选择日期"
				        />
				   </div>
				    <div class="placementOption">
				   <div class="title-name" v-loading="optionsloading"  element-loading-text="加载入库配置方案...">选择入库配置服务</div>
					    <RadioCardGroup v-model="placementOptionId" @change="handlePlacementChange" :isspace="true">
					    							   <RadioCard  v-for="item in options" :value="item.placementOptionId" shadow="hover"   style="width:400px" >
															   <div>{{item.shipmentIds.length}}个货件</div>
															   <div class="font-extraSmall" v-if="item.shipmentIds.length>3">亚马逊优化货件拆分</div>
															   <div  v-else>部分货件拆分</div>
															   <el-divider />
															   <div v-for="fee in item.fees">  
															   <strong v-if="fee.value.amount>0">起价 ${{fee.value.amount}}</strong>
															   <span v-else><strong >0 </strong> <el-tag round  type='warning' effect="dark">无配置服务费</el-tag></span> 
															   </div>
															   <div class="font-extraSmall" v-if="item.shipmentIds.length>3">可以将库存发往多个位置</div>
															   <div class="font-extraSmall" v-else> 可以将库存发往较少位置,亚马逊会分拨库存</div>
					    							   </RadioCard>
					 </RadioCardGroup>
				   </div>
				   <div>

				   <div class="shipmentlist" v-loading="shipmentloading" element-loading-text="加载货件信息...">
					   <div class="title-name">货件数量：{{shipments.length}}</div>
					   <div>
					   <el-space wrap>
						   <el-card v-for="(shipment,index) in shipments"   style="margin-top: 15px;width:400px;padding-bottom:0px" shadow="false">
							  <template #header>
								<div>
									 货件{{index+1}}
								</div>
							  </template>
							 
								<div style="padding:5px 5px 0px 5px;">	收获地址：
								{{shipment.destination.address.addressLine1}} 
								{{shipment.destination.address.addressLine2}}
								{{shipment.destination.address.city}}
								{{shipment.destination.address.countryCode}}
								{{shipment.destination.address.name}}
								{{shipment.destination.address.postalCode}}
								{{shipment.destination.address.stateOrProvinceCode}}
								
								</div>
								<el-divider  />	
								<div class="shipment-body">
								 <div>货件内商品   <el-link  style="padding-left:10px;" type="primary" @click="showDetailInfo(shipment)">(查看详情)</el-link></div>
								 <div>
								 <el-row class="shipment-body-title">
								 <el-col :span="8"  v-if="shipment.boxinfo&&shipment.boxinfo.boxes">箱数： {{shipment.boxinfo.boxes.length}}</el-col>
								 <el-col :span="8"  class="text-center">sku:{{shipment.skunum}}</el-col>
								 <el-col :span="8" class="text-right">商品总数:{{shipment.totalqty}}</el-col>
								 </el-row>
								 </div>
								  <el-space>
								 <div v-for="item in shipment.items">
									 <img :src="item.skuinfo.image"  style="width:40px;height:40px" />
									 <p>x{{item.quantity}}</p>
									 </div>
								 </el-space>
								 </div>
								 <div v-if="planData.hasSubmitPackage"  > 
								<el-descriptions    class="margin-top" :column="1"  border v-if="planData.auditstatus==7" >
									 <el-descriptions-item v-if="carrierData">
									   <template #label>
										 <div class="cell-item">
										   打印标签
										 </div>
									   </template>
									   <el-space>
										   <el-select v-model="shipment.printType">
												<el-option v-if="planData.transtyle=='SP'" v-for="value,key,index in paper.pkgpaper" :value="key" :label="value"></el-option>	
												<el-option v-else v-for="value,key,index in paper.pkgpaperltl" :value="key" :label="value"></el-option>	
												 
										   </el-select>
										     <el-dropdown>
										       <span class="el-dropdown-link">
										       下载
										         <el-icon class="el-icon--right">
										           <arrow-down />
										         </el-icon>
										       </span>
										       <template #dropdown>
										        <el-dropdown-menu>
														 <el-dropdown-item @click="downloadLabel('SELLER_LABEL',shipment)">下载箱子标签</el-dropdown-item>
														 <el-dropdown-item @click="downloadLabel('BARCODE_2D',shipment)">下载2D条形码</el-dropdown-item>
														 <el-dropdown-item @click="downloadLabel('PALLET',shipment)">下载托盘标签</el-dropdown-item>
										        </el-dropdown-menu>
										       </template>
										     </el-dropdown>
										 
									   </el-space>
									 </el-descriptions-item>
									 
								</el-descriptions>
								 <el-descriptions  v-else  class="margin-top"  :column="1"  border  >
								    <el-descriptions-item v-if="transportation">
								      <template #label>
								        <div class="cell-item">
								          配送商
								        </div>
								      </template>
								    <el-select v-model="shipment.selectedTransportationOptionId" >
										 <el-option 
												v-for="item in transportation[shipment.shipmentId]" 
												 :key="item.transportationOptionId"
												 :label="item.carrier.name+'----'+item.shippingMode"
												 :value="item.transportationOptionId">
										 </el-option>
								    </el-select>
								    </el-descriptions-item>
								    <el-descriptions-item v-if="deliveryWindowOptions">
								      <template #label>
								        <div class="cell-item">
								          预计到货时间
								        </div>
								      </template>
								   <el-select v-model="shipment.deliveryWindowOptionId" >
												 <el-option 
													v-for="item in deliveryWindowOptions[shipment.shipmentId]" 
													 :key="item.deliveryWindowOptionId"
													 :label="item.startDate.year+'-'+item.startDate.monthValue+'-'+item.startDate.dayOfMonth+'----'+item.endDate.year+'-'+item.endDate.monthValue+'-'+item.endDate.dayOfMonth"
													 :value="item.deliveryWindowOptionId">
												 </el-option>
								   </el-select>
								    </el-descriptions-item>
								  </el-descriptions>
								 </div>
								 <div v-else style="padding-top:10px">  </div>
							</el-card>
					   </el-space>
					   </div>
				  </div>
					   <el-row >
						   <el-col :span="6" :offset="18">
					<!-- 		  <div class="fee-item"><span >预计处理费用和贴标费用总金额</span><div class="pull-right"><strong >$0.00</strong></div></div>
							  <div class="fee-item"><span >总配置费</span><div class="pull-right"><strong >$0.00</strong></div></div>
							  <div class="fee-item"><span > 预计运费总金额</span><div class="pull-right"><strong >$0.00</strong></div></div>
							  <div class="fee-item"><strong > 合计</strong><div class="pull-right text-yellow"><strong >$0.00</strong></div></div> -->
							  <div>
								  <el-row>
									  <el-col :span="12">
										  <el-button  v-if="planData.auditstatus>=7" style="width:80%" @click="showConsumable('isshow')">查看耗材出库</el-button>
										  <el-button  v-else style="width:80%" @click="showConsumable('isopt')">耗材出库</el-button>
									  </el-col>
							          <el-col :span="12"> 
									  <el-button type="primary" v-if="planData.auditstatus>=7" style="width:100%" @click="nextStep">下一步</el-button>
									  <el-button type="primary" v-else style="width:100%" @click="handleShipped">接受费用并确认发货方案</el-button></el-col>
								  </el-row>
							  </div>
						  </el-col>
						</el-row>
				
				<el-row style="margin-top: 20px;">
					<Operation ref="operationRef" @change="handleOperationChange"></Operation>
				</el-row>
			</div>
		</div>
		<Footer  ref="footerRef"></Footer>
		<Consumable  ref="consumableRef"  ></Consumable>
		<PlanShipped ref="planShippedRef" @change="loadData()"></PlanShipped>
		<Table ref="tableRef" ></Table>
	</div>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,computed } from 'vue';
	import { useRoute,useRouter } from 'vue-router';
	import {Location,Van,ShoppingCart,Printer,Document,ArrowDown} from '@element-plus/icons-vue';
	import {Gift} from '@icon-park/vue-next';
	import Footer from "./components/footer.vue";
	import Header from "./components/header.vue";
	import Table  from "./components/table.vue";
	import PlanShipped from "./components/planShipped.vue";
	import Consumable from "./components/consumable.vue";
	import RadioCard from "@/components/Radio/RadioCard/radio_card.vue";
	import RadioCardGroup from "@/components/Radio/RadioCard/radio_card_group.vue";
	import Operation from "./components/operation.vue";
	import { ElMessage,ElMessageBox } from 'element-plus';
	import addressApi from '@/api/amazon/inbound/addressApi.js';
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import shipmentPlacementApi from '@/api/erp/shipv2/shipmentPlacementApi.js';
	import shipmentPlacementV1Api from '@/api/erp/ship/shipmenthandlingApi.js';
	import Trans from "./components/trans.vue";
	import shipmentTransportationApi from '@/api/erp/shipv2/shipmentTransportationApi.js';
	let router = useRouter();
	const planid=router.currentRoute.value.query.id;
	const footerRef=ref();
	const headerRef=ref();
	const consumableRef=ref();
	const globalTable=ref();
	const operationRef=ref();
	const planShippedRef=ref();
	const tableRef=ref();
	let state =reactive({
		planData:{}, 
		shipments:[],
		carrierData:[],
		tableData:{records:[],total:0},
		options:[],
		transportation:{},
		deliveryWindowOptions:{},
		paper:{},
		shipall:true,
		shipmentloading:false,
		optionsloading:false,
		placementOptionId:"",
		 
	})
	let{planData,tableData,transportation,paper,shipall,deliveryWindowOptions,options,placementOptionId,shipments,shipmentloading,optionsloading,carrierData}=toRefs(state);
	function nextStep(){
		router.push({
			path:'/e/s/s/end',
			query:{
			  id:planid,
			  title:"发货处理_结束",
			  path:'/e/s/s/end',
			  replace:true
			}
		})	
	}
    function showConsumable(ftype){
		consumableRef.value.show(ftype,state.planData);
	}
	function handleShipped(){
		state.planData.placementOptionId=state.placementOptionId;
		planShippedRef.value.show(state.planData,state.option,state.shipments);
	}
	function generatePlacementOptions(){
		shipmentPlacementApi.generatePlacementOptions({"formid":planid}).then(res=>{
			if(res.data.operationid){
				operationRef.value.show(res.data.operationid);
			}
		})
	}
	function generateDeliveryWindowOptions(shipmentid){
		  shipmentPlacementApi.generateDeliveryWindowOptions({"formid":planid,"shipmentId":shipmentid}).then(res=>{
			if(res.data.operationid){
				state.deliveryWindowOptions[res.data.operationid]=shipmentid;
				operationRef.value.show(res.data.operationid);
			}
		});
	}
	function handleOperationChange(data){
		state.shipmentloading=false;
		if(data && data.operationStatus=="SUCCESS" && data.operation=="generatePlacementOptions" ){
				listPlacementOptions();
		}else if(data && data.operationStatus=="SUCCESS" && data.operation=="generateTransportationOptions" ){
			    loadShipment();
		}else if(data && data.operationStatus=="SUCCESS" && data.operation=="generateDeliveryWindowOptions" ){
			    loadDeliverWindow(state.deliveryWindowOptions[data.operationid]);
		}
	}
	function handlePlacementChange(){
		state.shipmentloading=true;
		var filter_options =state.options.filter((option) => option.placementOptionId == state.placementOptionId);
		if(filter_options&&filter_options.length>0){
		     state.option=filter_options[0];
			 state.planData.placementOptionId=state.placementOptionId;
		     state.planData.shipmentids=state.option.shipmentIds;
		}
		if(state.planData.hasSubmitPackage){
			 generateTransportationOptions();
		}else{
			 loadShipment();
		}
	
	}
	function showDetailInfo(shipment){
		tableRef.value.show(state.planData,shipment);
	}
	async function loadShipment(){
		var skuMap={};
		state.planData.itemlist.forEach(item=>{  skuMap[item.sku]=item; });
		if(state.option){
			state.shipments=[];
			state.shipmentloading=true;
			state.option.shipmentIds.forEach(async shipmentid=>{
				if(state.planData.hasSubmitPackage){
					generateDeliveryWindowOptions(shipmentid);
				}
				await shipmentPlacementApi.getShipment({"planid":planid,"shipmentId":shipmentid}).then(async res=>{
					var shipment=res.data;
					if(shipment.selectedDeliveryWindow&&shipment.selectedDeliveryWindow.deliveryWindowOptionId){
						shipment.deliveryWindowOptionId=shipment.selectedDeliveryWindow.deliveryWindowOptionId;
					}
					if(state.planData.hasSubmitPackage){
						await shipmentPlacementApi.listShipmentBoxes({"formid":planid,"shipmentid":shipmentid}).then(mres=>{
							shipment.boxinfo=mres.data;
						})
					}
					await shipmentPlacementApi.getShipmentItems({"formid":planid,"shipmentid":shipmentid}).then(mres=>{
						var total=0;
						if(mres&&mres.data&&mres.data.items&&mres.data.items.length>0){
							for(var i=0;i<mres.data.items.length;i++){
								var item=mres.data.items[i]
								total=total+item.quantity;
							    item.skuinfo= skuMap[item.msku];
							}
							state.shipmentloading=false;
							shipment.skunum=mres.data.items.length;
							shipment.items=mres.data.items;
							shipment.totalqty=total;
						}
					})
					if(shipment.placementOptionId==state.placementOptionId){
						state.shipments.push(shipment);
					}
				})
			})
		   state.transportation={};
		  if(state.planData.hasSubmitPackage){
		       loadTransportation();
		  }else{
			  shipmentTransportationApi.saveTransportationNeedInfo(state.planData).then((res)=>{
				  
			  });
		  }
		}
		
		
	}
	function loadDeliverWindow(shipmentid){
		if(shipmentid){
			shipmentPlacementApi.listDeliveryWindowOptions({"formid":planid,"shipmentid":shipmentid}).then(res=>{
				state.deliveryWindowOptions[shipmentid]=res.data.deliveryWindowOptions;
			});
		}
	}
	function loadTransportation(paginationToken){
		shipmentTransportationApi.listTransportationOptions({
		"formid":planid,
		"placementOptionId":state.placementOptionId,
		"paginationToken":paginationToken}).then((res)=>{
			if(res&&res.data&&res.data.pagination&&res.data.pagination.nextToken){
				 res.data.transportationOptions.forEach(item=>{
					if(state.transportation[item.shipmentId]&&state.transportation[item.shipmentId].length>0){
						state.transportation[item.shipmentId].push(item);
					}else{
						state.transportation[item.shipmentId]=[item];
					}
					
				 });
				loadTransportation(res.data.pagination.nextToken);
			}else{
				res.data.transportationOptions.forEach(item=>{
									if(state.transportation[item.shipmentId]&&state.transportation[item.shipmentId].length>0){
										state.transportation[item.shipmentId].push(item);
									}else{
										state.transportation[item.shipmentId]=[item];
									}
									
				});
			}
		});	
		
	}
	function listPlacementOptions(){
		state.optionsloading=true;
		shipmentPlacementApi.listPlacementOptions({"formid":planid}).then(res=>{
			state.optionsloading=false;
			if(res.data.options&&res.data.options.length>0){
				 state.options=res.data.options;
				 state.placementOptionId=state.options[0].placementOptionId;
				 handlePlacementChange();
			}else{
				 generatePlacementOptions();
			}
		});
	}
	
	function loadData(){
		shipmentplanApi.getPlanInfo({"formid":planid}).then((res)=>{
			if(!res.data.shippingDate){
				const start = new Date()
				start.setTime(start.getTime() + 3600 * 1000 * 24 );
				res.data.shippingDate=start;
			}
			state.planData=res.data;
			state.itemcount=state.planData.itemlist.length;
			state.placementOptionId=state.planData.placementOptionId;
			headerRef.value.show(state.planData,2);
			footerRef.value.show(state.planData);
			if(!state.planData.transtyle){
				state.planData.transtyle="SP";
			}
			if(!state.planData.shippingSolution){
				state.planData.shippingSolution="USE_YOUR_OWN_CARRIER";
			}
			shipmentPlacementV1Api.getCarrier({
									"country":state.planData.country,
									"transtyle":planData.transtyle
			}).then(res=>{
					state.carrierData=res.data;
			})
			listPlacementOptions();
			getPaper();
		});
	}
	function getPaper(){
		shipmentPlacementApi.getPaper().then(res=>{
			state.paper=res.data;
		})
	}
	function downloadLabel(labeltype,shipment){
		var data={};
		data.shipmentid=shipment.shipmentId;
		data.pagetype=shipment.printType;
		data.labeltype=labeltype;
		data.pannum=0;
		shipmentPlacementApi.downLabel(data);
	}
 
	function generateTransportationOptions(){
		if(state.planData.hasSubmitPackage){
			shipmentTransportationApi.generateTransportationOptions(state.planData).then((res)=>{
				 if(res.data.operationid){
					operationRef.value.show(res.data.operationid);
				 }
			});
		}
	}
	 
	
	onMounted(()=>{
		loadData();
		
	})
</script>
<style scoped>
	.three-ship{
		font-size:14px;
	}
	.fee-item{
		 width:100%;
		 padding-bottom:10px;
	}
	.title-name{
		padding-top:15px;
		padding-bottom:10px;
		padding-left:3px;
	}
	.pull-right{
		float: right;
	}
	.shipment-body{
		padding-left:10px;
		padding-right:10px;
	}
	.shipment-body-title{
		padding-top:5px;
		padding-bottom:5px;
	}
	.shipmentlist{
		padding-bottom:20px;
	}
	.mar-bot{
		margin-bottom:16px;
	}
</style>
<style>
	.three-ship .el-card__header {
	    padding: 5px;
	    border-bottom: 1px solid var(--el-card-border-color);
	    box-sizing: border-box;
	    background-color: #F8F8F8;
	}
	
	.three-ship .el-card__header {
	    padding: 5px;
	    border-bottom: 1px solid var(--el-card-border-color);
	    box-sizing: border-box;
	    background-color: #F8F8F8;
	}
	
	.placementOption .el-space--horizontal{
		align-items: normal !important;
	}
	.shipmentlist .el-card__body{
		padding:0px;
	}
	
	.box-margin{
		padding:16px;
		min-height:calc(100vh - 36px)
	}
</style>