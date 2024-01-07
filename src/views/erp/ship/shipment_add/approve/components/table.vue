<template>
<div v-for="(item,index) in itemlist.list">
	<el-card shadow="hover" style="margin-bottom: 10px;">
		<template #header>
			<div class="card-header">
				<el-space>
					<el-tag class="ml-2" type="info" @click.stop="showExceptionDialog(item.shipmentId)">货件{{index+1}}</el-tag>
					<span>{{item.name}}</span>
					<el-popover v-if="planData.auditstatus==1" v-model:visible="item.nameVis" placement="top" trigger="click" :width="240">
						<el-input v-model="item.name"  
							class='inp-box' placeholder="货件名称" />
						<div style="text-align: right; margin: 0">
							<el-button size="small" type="text" @click="item.nameVis = false">取消</el-button>
							<el-button size="small" type="primary"
								@click="submitShipmentName(item.shipmentId,item.name)">确认</el-button>
						</div>
						<template #reference>
						 <el-icon class="edit-icon"  @click="editShipmentName"><Edit /></el-icon>
						</template>
					</el-popover>
				</el-space>
				<div class="rt-btn-group">
					<el-space :size="24">
						<el-popover v-model:visible="item.remarkVis" placement="top" @show="handleItemRemark(item)" :width="240" trigger="click">
							<el-input 	rows="3"  maxlength="100" :clearable="true"
								type="textarea" v-model="item.editremark"  
								class='inp-box' placeholder="货件备注" />
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="info" @click="item.editremark=''">清空内容</el-button>
								<el-button size="small"   @click="item.remarkVis = false">关闭</el-button>
								<el-button size="small" type="primary"
									@click="submitShipmentRemark(item.shipmentId,item.editremark)">确认</el-button>
							</div>
							<template #reference>
								<el-link title="编辑备注" class="icon-text-center"  :underline="false" >
									 <el-icon  style="font-size: 16px;"><Edit /> </el-icon>&nbsp;备注
								</el-link>
							</template>
						</el-popover>
						<el-link title="复制新增"  class="icon-text-center" :underline="false" @click="copyPlan(item.shipmentId)">
							 <el-icon  style="font-size: 16px;"><CopyDocument /> </el-icon>&nbsp;复制
						</el-link>
						<el-link title="拆分新增"  class="icon-text-center" :underline="false" @click="splitHandel(item)">
							 <el-icon style="font-size: 16px;"><Crop /> </el-icon>&nbsp;拆分
						</el-link>
					</el-space>
				</div>
			</div>
			<div class="subtext">
			<el-space :spacer="spacer">
				<span v-if="planData.auditstatus==1||planData.auditstatus==2"  class="font-extraSmall">{{item.shipmentId}}</span>
				<el-button v-if="planData.auditstatus==3" type="primary" link   @click="toTraceShipment(item.shipmentId)">{{item.shipmentId}}</el-button>
				<el-button v-if="planData.auditstatus==3 && item.status==1" 
				  :loading="reApproveloading"
				  type="danger"
				  link
				  @click="reApprove(item.shipmentId)">审核失败
				</el-button>
				<div class="font-small">
					<el-space wrap>
				<span >物流:</span> 
				<el-select size="small" style="margin-left: 5px;" v-model="item.companyid" :disabled="planData.auditstatus!=1" @change="companyChange(index)">
					<el-option  v-for="company in item.companylist"   :key="company.id"  :label="company.name" :value="company.id"   >
					</el-option>
				</el-select>
				 <el-select size="small" v-model="item.channelid" :disabled="planData.auditstatus!=1" style="margin-left: 5px;">
				 	<el-option  v-for="chan in item.channellist"   :key="chan.id"  :label="chan.channame" :value="chan.id"   >
				 	</el-option>
				 </el-select>
				 <div style="padding-left:10px; padding-top:2px;">
					 <el-radio-group size="small" v-model="item.transtyle" :disabled="planData.auditstatus!=1"  >
					 	<el-radio  label="SP">
					 	<p>小包裹快递</p>
					 	</el-radio>
					 	<el-radio   label="LTL" >
					 	<p>汽车零担</p>
					 	</el-radio>
					 </el-radio-group>
				 </div>
					
				<el-button style="margin-left: 10px;"   size="small"    
				v-if="planData.auditstatus==1"  
				@click="saveTrans(item)">保存</el-button>
				</el-space>
			</div>
			</el-space>
			</div>
		</template>
		<div  class="remark font-small">备注:{{item.remark}}</div>
		<div>
			<el-descriptions
			    class="margin-top"
			    :column="4"
			    :size="size"
			    border
			  >
			    <el-descriptions-item>
			      <template #label>
			        <div class="cell-item"> sku数量 </div>
			      </template>
			     {{item.skucount}}
			    </el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item">  预估发货重量(kg) </div>
				  </template>
				  <span v-if="item.weight && item.weight!=''"> {{formatFloat(item.weight)}}</span>
				  <span v-else>--</span>
				</el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item"> 预估箱子体积(m³)
					<el-tooltip content="当维护箱规后此处是箱子体积,没有维护则使用产品体积预估总体积">
						<el-icon>
							<Warning></Warning>
						</el-icon>
					</el-tooltip>
					</div>
				  </template>
				  <span v-if="item.boxvolume && item.boxvolume!='0E-10'"> {{formatFloat(item.boxvolume)}}</span>
				  <span v-else>--</span>
				</el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item">货值</div>
				  </template>
				  ￥{{item.itemprice}}
				</el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item"> 发货数量</div>
				  </template>
				  {{item.toquantity}}
				</el-descriptions-item>
			    <el-descriptions-item>
			      <template #label>
			        <div class="cell-item"> 预估运输重量(kg)</div>
			      </template>
				  <span v-if="item.readweight && item.readweight!=''"> {{formatFloat(item.readweight)}}</span>
				  <span v-else>--</span>
			    </el-descriptions-item>
			    <el-descriptions-item v-if="item.addressTo">
			      <template #label>
			        <div class="cell-item">  收货城市 </div>
			      </template>
				  {{item.addressTo.addressline1}},{{item.addressTo.city}},{{item.addressTo.countrycode}}({{item.destinationFulfillmentCenterId}})
			    </el-descriptions-item>
			  </el-descriptions>
		</div>
		<el-table :data="item.itemlist" border style="width: 100%;margin-top:16px;">
		    <el-table-column prop="image" label="图片" width="68" >
		     <template #default="scope">
		      <el-image :src="scope.row.image"  class="product-img"   ></el-image>
		    </template>
		  </el-table-column>
		  <el-table-column prop="name" label="名称/SKU"  show-overflow-tooltip>
		     <template #default="scope">
		        <div class='name'>{{scope.row.pname}}</div>
		        <div class='sku'>{{scope.row.sellersku}}
		          <copy title='复制' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
		        </div>
		    </template>
		  </el-table-column>
		  <el-table-column prop="sku"  label="本地SKU" width="140"  />
		  <el-table-column prop="typename" label="分类"  show-overflow-tooltip width="160" />
		  <el-table-column prop="invquantity" label="可用库存"  width="100" />
		 <!--  <el-table-column prop="time" label="备货周期"  width="100" /> -->
		    <el-table-column prop="avgsales" label="预估日均销量"  width="140" />
		  <el-table-column prop="quantity" label="发货数量"   width="100" />
		  <el-table-column prop="quantity" label="商品详情"  width="120"   sortable>
		      <template #default="scope">
		          <el-button class='el-button--blue' @click="showProductModal(scope.row.sellersku)">查看</el-button>
		      </template>
		  </el-table-column>
		</el-table>
	</el-card>
	 </div>
	
	 <GoodsDeatiles ref="goodsDeatilsRef"  />
	 <SplitDialog ref="splitDialogRef" />
</template>
<script setup>
	import { ElDivider } from 'element-plus'
	import {CopyDocument,Crop,Plus,Edit,Warning} from '@element-plus/icons-vue'
	import {h, ref ,watch,reactive,onMounted,computed,inject } from 'vue'
	import { useRoute,useRouter } from 'vue-router'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
	import transportationApi from '@/api/erp/ship/transportationApi';
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	import GoodsDeatiles from "@/views/amazon/listing/common/goods_deatils.vue"
	import SplitDialog from "./split_dialog.vue"
	import {ElMessage,ElMessageBox } from 'element-plus'
	import {formatFloat} from '@/utils/index';
 
			const emit = defineEmits(['change']);
			let router = useRouter()
			let spacer = h(ElDivider, {direction: 'vertical'})
			let planData=ref();
			let itemlist=reactive({list:[]});
			let companylist=ref([]);
			let channellist=ref([]);
			let goodsDeatilsRef =ref()
			let splitDialogRef=ref();
			let productInfoData=ref({});
			let splitVisible=ref(false);
			let reApproveloading=ref(false);
			let expclicks=0;
			let localshipmentid="";
		    const emitter = inject("emitter"); // Inject `emitter`
			function splitHandel(items){
				var nowshipment=items;
				splitDialogRef.value.show(items.itemlist,planData.value,nowshipment);
			}
			function rollbackShipnum(row){
				  row.copshipnum = row.quantity
			}
		
			
			function submitShipmentName(id,name){
				//ajax修改名字
				updateShipmentRemark(id,'',name);
			}
			function submitShipmentRemark(id,remark){
				//ajax修改备注
				updateShipmentRemark(id,remark,'');
			}
			function handleItemRemark(item){
				item.editremark=item.remark;
				if(!item.editremark){
					item.editremark=planData.value.remark;
				}
			}
			function toTraceShipment(shipmentid){
					router.push({
						path:'/shipment_handing/shipstep',
						query:{
						  'shipmentid':shipmentid,
						  title:"发货流程",
						  path:'/shipment_handing/shipstep',
						}
					});
			}
			 function initData(shipmentlist){
				    itemlist.list=shipmentlist;
					itemlist.list.forEach(async function(shipment){
						let res=await transportationApi.getTranlist();
						if(!shipment.transtyle){
							shipment.transtyle="SP";
						}
						if(res.data&&res.data.length>0){
							shipment.companylist=res.data;
						}
						 if(shipment.companyid){
							let res2=await transportationApi.getChannel({"company":shipment.companyid,"marketplaceid":planData.value.marketplaceid,"transtype":""});
							if(res2.data&&res2.data.length>0){
								shipment.channellist=res2.data;
							}
						 }
					})
			 }
		 
			
			function companyChange(index){
					 let shipment=itemlist.list[index];
					 if(shipment.companyid){
						transportationApi.getChannel({"company":shipment.companyid,"marketplaceid":planData.value.marketplaceid,"transtype":""}).then((res)=>{
							let channelid="";
							if(res.data&&res.data.length>0){
								 shipment.channellist=res.data;
								 shipment.chang=new Date();
								 itemlist.list[index]=shipment;
								 channelid=res.data[0].id;
							}else{
								shipment.channellist=[];
								shipment.chang=new Date();
								itemlist.list[index]=shipment;
							}
							shipment.channelid=channelid;
						})
					 }
					
			}
			function showProductModal(sku){
				//根据 groupid marketplaceid sku去查product
				var groupid=planData.value.amazongroupid;
				var marketplaceid=planData.value.marketplaceid;
				var data={};
				data.groupid=groupid;
				data.marketplace=marketplaceid;
				data.sku=sku;
			    goodsDeatilsRef.value.show(data);
			}
			function copyPlan(shipmentid){
				emitter.emit("removeCache", "添加货件");
				router.push({
					path:'/invoice/addshipment',
					query:{
						shipmentid:shipmentid,
						title:'添加货件',
						path:'/invoice/addshipment',
					}
				}) 
			}
			function updateShipmentRemark(id,remark,name){
				shipmentplanApi.updateShipmentRemark({"shipmentid":id,"remark":remark,"name":name}).then((res)=>{
					 if(res.data && res.data=="ok"){
						ElMessage({
						   message: '修改成功！',
						   type: 'success'
						 });
						 if(remark){
							itemlist.list.forEach(item=>{
								if(item.shipmentId==id){
									item.remark=remark;
								}
							}) 
						 }
					 }else{
						 ElMessage({
						    message: '修改失败！',
						    type: 'error'
						  })
					 }
				});
			}
			
			
			function saveTrans(item){
				var companyid=item.companyid?item.companyid:"";
				var channelid=item.channelid?item.channelid:"";
				var transtyle=item.transtyle?item.transtyle:"";
				var shipmentid=item.shipmentId;
				if(channelid || transtyle){
					shipmentplanApi.saveTrans({
					"company":companyid,
					"channel":channelid,
					"transtyle":transtyle,
					"shipmentid":shipmentid}).then((res)=>{
						if(res.data && res.data=="success"){
							ElMessage({
							   message: '修改成功！',
							   type: 'success'
							 })
							 emit("change");
						}else{
							ElMessage({
							   message: '修改失败！',
							   type: 'error'
							 })
						}
					});
				}
			}
			function percentformat(value){
				if(value && value!=0){
					return (value*100).toFixed(2)+'%';
				}else{
					return 0;
				}
			}
			function reApprove(shipmentid){
				reApproveloading.value=true;
				shipmentplanApi.createShipment({"shipmentid":shipmentid}).then(res=>{
					 ElMessage({
					   message: '审核成功！',
					   type: 'success'
					 });
					 reApproveloading.value=false;
					 planData.auditstatus=3;
				}).catch(error=>{
					 reApproveloading.value=false;
				})
			}
			
			function showExceptionDialog(shipid){
				localshipmentid=shipid;
				if(localshipmentid==shipid){
					expclicks++;
				}else{
					expclicks=1;
				}
				if(expclicks>=3){
					ElMessageBox.confirm(
					   '处理后产品待出库会增加，货件号:'+shipid+'，确定操作吗？',
					   '处理未扣待出库货件',
					   {
					     confirmButtonText: '确定',
					     cancelButtonText: '取消',
					     type: 'warning',
					   }
					 )
					   .then(() => {
					     shipmentplanApi.handlerExpShipment({"shipmentid":shipid}).then((res)=>{
									  if(res.data){
										  ElMessage({
										    type: 'success',
										    message: "操作成功!",
										  });
										  expclicks=0;
									  }else{
										  ElMessage({
										    type: 'error',
										    message: "操作失败",
										  })
									  }
								  });
					   })
					   .catch(() => {
					     ElMessage({
					       type: 'info',
					       message: '取消删除',
					     })
					   })
				}
			}
			
			 defineExpose({initData,planData });
	 
</script>

<style>
.subtext{
	margin-top:8px;
}
.remark{margin-bottom:16px;}
.card-header{
	display: flex;
	justify-content: space-between;
}
.inp-box{
	margin-bottom:8px;
}
.sh-ri{
	flex:1;
}
.sh-le{
	padding-left:16px;
	width:400px;
	border-left: 1px solid var(--el-border-color-base);
	margin-left:16px;
}
.sh-le p{
	font-size: 12;
	font-weight: 600;
}
.sh-con-tw{
	display: flex;
}
.ma-bo-16{
	margin-bottom:16px;
}
.m-t-8{
	margin-top: 8px;
}
</style>
