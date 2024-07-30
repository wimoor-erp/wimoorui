<template>
	<el-card shadow="hover" style="margin-bottom: 10px;">
		<div>
			<el-descriptions
			    class="margin-top"
			    :column="4"
			    border
			  >
			    <el-descriptions-item>
			      <template #label>
			        <div class="cell-item"> sku数量 </div>
			      </template>
			     {{plansummary.skucount}}
			    </el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item">  预估发货重量(kg) </div>
				  </template>
				  <span v-if="plansummary.weight && plansummary.weight!=''"> {{formatFloat(plansummary.weight)}}</span>
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
				  <span v-if="plansummary.boxvolume && plansummary.boxvolume!='0E-10'"> {{formatFloat(plansummary.boxvolume)}}</span>
				  <span v-else>--</span>
				</el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item">货值</div>
				  </template>
				  ￥{{plansummary.itemprice}}
				</el-descriptions-item>
				<el-descriptions-item>
				  <template #label>
				    <div class="cell-item"> 发货数量</div>
				  </template>
				  {{plansummary.toquantity}}
				</el-descriptions-item>
			    <el-descriptions-item>
			      <template #label>
			        <div class="cell-item"> 预估运输重量(kg)</div>
			      </template>
				  <span v-if="plansummary.readweight && plansummary.readweight!=''"> {{formatFloat(plansummary.readweight)}}</span>
				  <span v-else>--</span>
			    </el-descriptions-item>
			  </el-descriptions>
		</div>
		<el-table :data="itemlist" border style="width: 100%;margin-top:16px;">
		    <el-table-column prop="image" label="图片" width="68" >
		     <template #default="scope">
		      <el-image :src="scope.row.image"  class="product-img"   ></el-image>
		    </template>
		  </el-table-column>
		  <el-table-column prop="name" label="名称/SKU"  show-overflow-tooltip>
		     <template #default="scope">
		        <div class='name'>{{scope.row.name}}</div>
		        <div class='sku'>{{scope.row.sku}}
		          <copy title='复制' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
		        </div>
		    </template>
		  </el-table-column>
		  <el-table-column prop="msku"  label="本地SKU" width="150"  />
		  <el-table-column prop="msku" label="分类"  show-overflow-tooltip width="160" />
		  <el-table-column prop="invquantity" label="可用库存"  width="100" />
		    <el-table-column prop="avgsales" label="预估日均销量"  width="140" />
		  <el-table-column prop="quantity" label="发货数量"   width="100" >
			  <template #default="scope">
				  {{scope.row.quantity}}
				  <!-- <div class="font-extraSmall" :title="'预估配置费:￥'+scope.row.inplacefeeCny" v-if="scope.row.inplacefee">预估:${{scope.row.inplacefee}}</div> -->
			  </template>
			  </el-table-column>
		  <el-table-column prop="quantity" label="商品详情"  width="110"   sortable>
		      <template #default="scope">
		          <el-button class='el-button--blue' @click="showProductModal(scope.row.sku)">查看</el-button>
		      </template>
		  </el-table-column>
		</el-table>
	</el-card>
	 
	
	 <GoodsDeatiles ref="goodsDeatilsRef"  />
	 <SplitDialog ref="splitDialogRef" />
</template>
<script setup>
	import { ElDivider } from 'element-plus';
	import {CopyDocument,Crop,Plus,Edit,Warning} from '@element-plus/icons-vue';
	import {h, ref ,watch,reactive,onMounted,computed,inject } from 'vue';
	import { useRoute,useRouter } from 'vue-router';
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
	import transportationApi from '@/api/erp/ship/transportationApi.js';
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	import GoodsDeatiles from "@/views/amazon/listing/common/goods_deatils.vue";
	import SplitDialog from "./split_dialog.vue";
	import {ElMessage,ElMessageBox } from 'element-plus';
	import {formatFloat} from '@/utils/index.js';

			const emit = defineEmits(['change']);
			let router = useRouter()
			let spacer = h(ElDivider, {direction: 'vertical'})
			let planData=ref();
			let itemlist=ref([]);
			let userchannelList=ref([]);
			let companylist=ref([]);
			let channellist=ref([]);
			let goodsDeatilsRef =ref()
			let splitDialogRef=ref();
			let productInfoData=ref({});
			let splitVisible=ref(false);
			let reApproveloading=ref(false);
			let expclicks=0;
			let localshipmentid="";
			let plansummary=ref({});
		    const emitter = inject("emitter"); // Inject `emitter`
			
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
			
			function getchannelList(){
				transportationApi.channelList().then((res)=>{
					userchannelList=res.data;
				});
			}
			
			function toTraceShipment(shipmentid){
					router.push({
						path:'/shipment_handing/shipstep',
						query:{
						  'shipmentid':shipmentid,
						  title:"发货流程"+shipmentid,
						  path:'/shipment_handing/shipstep',
						}
					});
			}
			async function initData(shipitem){
				itemlist.value=shipitem.itemlist;
				plansummary.value=shipitem.plansummary;
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
			function submitShipmentReferenceid(id,referenceid){
				shipmentplanApi.updateShipmentReferenceid({"shipmentid":id,"referenceid":referenceid}).then((res)=>{
					 if(res.data && res.data=="ok"){
						ElMessage.success( '修改成功！');
							itemlist.list.forEach(item=>{
								if(item.shipmentId==id){
									item.referenceid=referenceid;
									item.referenceidVis=false;
								}
							}) 
					 }else{
						 ElMessage.error('修改失败！');
					 }
				});
			}
			function updateShipmentRemark(id,remark,name){
				shipmentplanApi.updateShipmentRemark({"shipmentid":id,"remark":remark,"name":name}).then((res)=>{
					 if(res.data && res.data=="ok"){
						ElMessage.success( '修改成功！');
							itemlist.list.forEach(item=>{
								if(item.shipmentId==id){
									item.remark=remark;
									item.remarkVis=false;
								}
							}) 
					 }else{
						 ElMessage.error('修改失败！');
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
						item.remarkVis=false;
						if(res.data && res.data=="success"){
							 ElMessage.success('修改成功！');
							 emit("change");
						}else{
							ElMessage.error('修改失败！');
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
					 ElMessage.success('审核成功！');
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
										  ElMessage.success("操作成功!");
										  expclicks=0;
									  }else{
										  ElMessage.error( "操作失败");
									  }
								  });
					   })
					   .catch(() => {
					     ElMessage.info( '取消删除');
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
