<template>
	<el-row>
		<el-col :span="24">
			<div class="gird-line-head el-white-bg">
				<div class="order-title">
					<h3>发货单详情</h3>
					<div class="font-extraSmall">
						<el-space :spacer="spacer">
							<span>计划编码：{{plandata.number}}</span>
							<el-link title="复制新增"  class="icon-text-center" 
							:underline="false" @click="copyPlan(plandata.id)">
								 <el-icon  style="font-size: 16px;"><CopyDocument /> </el-icon>&nbsp;复制
							</el-link>
							<div class="font-extraSmall text-red" :title="'预估配置费:$'+totalInplaceUSD" v-if="totalInplaceCny">预估配置费：￥{{totalInplaceCny}}</div>
						</el-space>
					</div>
				</div>
				<div class="rt-btn-group">
					<el-button  @click="splitHandel" >拆分</el-button>
					<el-button  @click="closePage" >关闭</el-button>
					<el-button type="primary" v-if="plandata.auditstatus==1" :loading="submitLoading"  @click="approvePlan">
						<el-icon><Stamp /> </el-icon> 审核</el-button>
					<el-button type="success"   disabled v-if="plandata.auditstatus!=7 && plandata.auditstatus!=11&& plandata.auditstatus!=1  &&!plandata.iserror"  >已审核</el-button>
					<el-button type="info"   disabled v-if="plandata.auditstatus==11"  >已驳回</el-button>
					<el-button type="danger"   disabled v-if="plandata.auditstatus!=7 && plandata.auditstatus!=11&& plandata.auditstatus!=1  &&plandata.iserror"   >审核失败</el-button>
					<el-button   class='ic-btn' title='帮助文档'>
					  <help theme="outline" size="16" :strokeWidth="3"/>
					</el-button>
				</div>
				
			</div>
		</el-col>
	</el-row>
	<el-row >
		<el-col :span="18" class="gird-line-left">
				<Table ref="tableRef" @change="handleChange" />
		</el-col>
		<el-col :span="6" class="gird-line-right el-white-bg">
			<List ref="listRef" />
		</el-col>
	</el-row>
	<el-dialog v-model="approveVisible" title="发货货件审核"  :destroy-on-close='true' width="60%" @close='closeDialog'>
			 <div class="from-body">
			 <el-table :data="shipmentList" border style="width: 100%;margin-top:16px;" >
				 <el-table-column prop="name" label="货件名称"   >
					 <template #default="scope">
					 			<div>{{scope.row.name}}</div>		
								<div><span class="font-extraSmall">sku数量 </span>{{scope.row.skucount}} </div>	
					  </template>
					 </el-table-column>
				 <el-table-column prop="toquantity" label="发货数量" width="120" >
					 <template #default="scope">
					 			<div>{{scope.row.toquantity}}</div>		
					 		   <div><span class="font-extraSmall">重量(kg) </span> {{formatFloat(scope.row.weight)}}</div>	
					  </template>
					 </el-table-column>
				 <el-table-column prop="readweight" label="预估(重量/体积)" width="160" >
					 <template #default="scope">
					 			<div><span class="font-extraSmall">运输重量(kg) </span> {{scope.row.readweight}}</div>		
					 		   <div><span class="font-extraSmall">箱子体积(m³) </span>
							   <span v-if="scope.row.boxvolume!='0E-10'">{{formatFloat(scope.row.boxvolume)}}</span>
							   <span v-else>0</span>
							   </div>	
					  </template>
					 </el-table-column>
				 <el-table-column prop="itemprice" label="货值(￥)" width="100" />
				 <el-table-column prop="itemprice" label="收货城市"  width="100">
					 <template #default="scope">
					    <div>{{scope.row.addressTo.countrycode}} </div>
						<div>{{scope.row.destinationFulfillmentCenterId}}</div>
					 </template>
				 </el-table-column>
				 <el-table-column prop="itemprice" label="操作" width="180" >
						 <template #default="scope">
							 <el-radio-group  size="large" v-model="scope.row.approve">
								 <el-radio
								 v-for="item in approves"
								 :key="item.value"
								 :label="item.value"
								
								 :value="item.value"
								  >{{item.label}}
								 </el-radio>
							 </el-radio-group>
						 </template>
				 </el-table-column>
			  </el-table>
			</div>
				<el-checkbox style="float: right;" v-model="approveSelected" @change="changeAllCancel" >全选驳回</el-checkbox>
				<el-alert class="m-t-16" title="亚马逊规定同一订单中的货件需要同时通过或者驳回，若发生某个货件审核失败，建议将其他已通过货件取消" type="warning" show-icon />
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="approveVisible = false">取消</el-button>
					<el-button @click="submitplan" type="primary" :loading="confirmloading">确认</el-button>
				</span>
			</template>
	</el-dialog>
	<SplitDialog ref="splitDialogRef" />
</template>
<script setup>
	import {h, ref ,watch,reactive,onMounted,inject,nextTick} from 'vue'
	import {Help,} from '@icon-park/vue-next';
	import { ElDivider } from 'element-plus'
	import List from"./components/list.vue"
	import Table from"./components/table.vue"
	import { useRoute,useRouter } from 'vue-router'
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import {formatFloat} from '@/utils/index.js';
	import {ElMessage,ElMessageBox } from 'element-plus';
	import SplitDialog from "./components/split_dialog.vue";
	import {CopyDocument,Stamp} from '@element-plus/icons-vue'
	import calculateApi from "@/api/amazon/profit/calculateApi";
			let spacer = h(ElDivider, {direction: 'vertical'})
			let router = useRouter();
			let splitDialogRef=ref();
			let tableRef=ref();
			let listRef=ref();
			let  confirmloading=ref(false);
			let plandata=ref({});
			let approveVisible=ref(false);
			let  submitLoading=ref(false);
			let approveSelected=ref(false);
			let shipmentList=ref([]);
			let approves=reactive([{label:'通过',value:true},
									{label:'驳回',value:false}
								]);
			const planid=router.currentRoute.value.query.id;
			const totalInplaceCny=ref(0);
			const totalInplaceUSD=ref(0);
			onMounted(()=>{
				loadData()
			})
			function changeAllCancel(){
				if(approveSelected.value==true){
					//全选所有到驳回
					shipmentList.value.forEach(item=>{
						item.approve=false;
					});
				}
			}
			
			const emitter = inject("emitter"); // Inject `emitter`
			function closeTab(){
				emitter.emit("removeTab", 100);
			};
			
			function splitHandel(){
				splitDialogRef.value.show(plandata.value.itemlist,plandata.value,plandata.value);
			}
			
			function closePage(){
				var query= { title: "新发货单",
						    path: '/erp/shipv2/shipment_add/list', 
							refresh:new Date().getTime(),
							replace:true}
				router.push({
					path: '/erp/shipv2/shipment_add/list',
					query:query,
					
				})
			}
			function copyPlan(shipmentid){
				emitter.emit("removeCache", "添加新版货件");
				router.push({
					path:'invoice/new/addshipment',
					query:{
						formid:shipmentid,
						title:'添加新版货件',
						path:'invoice/new/addshipment',
					}
				}) 
			}
			async function summaryTotalPrice(shipment){
					var placetype=null;
					if(shipment.addressarea=="美西"){placetype="west";}
					if(shipment.addressarea=="美中"){placetype="mid";}
					if(shipment.addressarea=="美东"){placetype="east";}
					if(placetype){
						if(shipment.shipmentNum>=4){
							placetype="more-"+placetype;
						}else if(shipment.shipmentNum>1){
							placetype="two-"+placetype;
						}else{
							placetype="one-"+placetype;
						}
					var paramlist=[];
					shipment.totalinplace=0;
					shipment.itemlist.forEach(item=>{
					var param={
							      sku:item.sku,
							      inplace:placetype,
								  length:item.pkglength,
								  width:item.pkgwidth,
								  height:item.pkgheight,
								  weight:item.pkgweight};
						paramlist.push(param);
					 })
					
					var totalinplace=0;
					var totalinplaceCny=0;
					var skufee={};
					var skufeeCny={};
					await calculateApi.inplacefee(paramlist).then(res=>{
						 res.data.forEach(feeitem=>{
							 if(feeitem.amount){
								 skufee[feeitem.sku]=feeitem.amount;
								 skufeeCny[feeitem.sku]=feeitem.amountCny;
							 }
						 });
						
						shipment.itemlist.forEach(item=>{
							 if(skufee[item.sku]){
								item.inplacefee=formatFloat(skufee[item.sku]*item.quantityShipped);
								totalinplace=totalinplace+item.inplacefee;
								
								item.inplacefeeCny=formatFloat(skufeeCny[item.sku]*item.quantityShipped);
								totalinplaceCny=totalinplaceCny+item.inplacefeeCny;
							 }
						 });
						shipment.totalinplace=formatFloat(totalinplace);
						shipment.totalinplaceCny=formatFloat(totalinplaceCny);
						totalInplaceCny.value=formatFloat(totalInplaceCny.value+shipment.totalinplaceCny);
						totalInplaceUSD.value=formatFloat(totalInplaceUSD.value+shipment.totalinplace);
					});
				}
			}
			function loadData(){
				if(planid){
					//重新查询新的plan
					shipmentplanApi.getPlanInfo({"formid":planid}).then((res)=>{
							if(res.data){
							    res.data.iserror=false;
								plandata.value=res.data;
							    var item=res.data;
									var nowDate=new Date();
									item.nameVis=false;
									item.remarkVis=false;
									if(item.name=='' || item.name==undefined || item.name==null){
										item.name="FBA"+"("+(nowDate.getMonth()+1)+"/"+(nowDate.getDate())+"/"+nowDate.getFullYear()+" "+nowDate.getHours()+":"+nowDate.getMinutes()+")-"+(index+1)
									} 
									if(res.data.auditstatus==3 && item.status==1){
										res.data.iserror=true;
									}
								 
								tableRef.value.planData=res.data;
								summaryTotalPrice(item);
								tableRef.value.initData(item);
								listRef.value.planData=res.data;
								listRef.value.remark=res.data.remark;
								
							}
					});
				}
			}
			function approvePlan(){
				 ElMessageBox.confirm('确认审核该计划?', '警告', {
					    distinguishCancelAndClose: true,
				 		confirmButtonText: '通过',
				 		cancelButtonText: '驳回',
				 		type: 'warning',
						center: true,
				 })
				 		.then(() => {
							 submitLoading.value=true;
				 		  shipmentplanApi.approveInboundPlan({"id":plandata.value.id}).then(res=>{
				 			ElMessage.success('通过成功');
							 submitLoading.value=false;
				 			 loadData();
				 		  }).catch(error=>{
							   submitLoading.value=false;
				 		  	 console.log(error);
				 		  });
				 		})
				 		.catch((action) => {
							if(action=='cancel'){
								 submitLoading.value=true;
								  shipmentplanApi.rejectInboundPlan({"id":plandata.value.id}).then(res=>{
										ElMessage.success('驳回成功');
										 loadData();
										  submitLoading.value=false;
								  }).catch(error=>{
									 submitLoading.value=false;
								  });   
							}
				 		})
			}
			async function submitplan(){
				confirmloading.value=true;
				for(var i=0;i<shipmentList.value.length;i++){
					var item=shipmentList.value[i];
					if(item.approve==true){
						await shipmentplanApi.createShipment({"shipmentid":item.shipmentId}).then(res=>{
							ElMessage.success( item.shipmentId+'审核成功！');
						}).catch(error=>{
						});
					}else{
						await shipmentplanApi.cancelShipment({"shipmentid":item.shipmentId}).then(res=>{
								ElMessage.success(item.shipmentId+'驳回成功！');
						}).catch(error=>{
						});
					}
				}
				nextTick(()=>{
					confirmloading.value=false;
				})
				nextTick(()=>{
					approveVisible.value=false;
				})
				var timer=setTimeout(function(){
					nextTick(()=>{
						loadData();
					})
				},300);
			}
			function handleChange(){
				var timer=setTimeout(function(){
					nextTick(()=>{
						loadData();
					})
				},300);
			}
			 
</script>

<style scoped="scoped">
	.gird-line-left{
		background-color: var(--el-color-info-lighter);
	}
	.dark .gird-line-left{
		background-color: var(--el-color-black);
	}
	.m-t-16{
		margin-top: 16px;
	}
</style>
