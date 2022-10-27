<template>
<div v-for="(item,index) in itemlist.list">
	<el-card shadow="hover" style="margin-bottom: 10px;">
		<template #header>
			<div class="card-header">
				<el-space>
					<el-tag class="ml-2" type="info">货件{{index+1}}</el-tag>
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
						<el-popover v-model:visible="item.remarkVis" placement="top" :width="240" trigger="click">
							<el-input 	rows="3"  maxlength="100"
								type="textarea" v-model="item.remark"  
								class='inp-box' placeholder="货件备注" />
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="item.remarkVis = false">取消</el-button>
								<el-button size="small" type="primary"
									@click="submitShipmentRemark(item.shipmentId,item.remark)">确认</el-button>
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
				<span v-if="planData.auditstatus==1"  class="font-extraSmall">{{item.shipmentId}}</span>
				<el-button v-if="planData.auditstatus==3" type="primary" link   @click="toTraceShipment(item.shipmentId)">{{item.shipmentId}}</el-button>
				<span v-if="planData.auditstatus==3 && item.status==1"   class="pointer" style="color: crimson;font-size: 12px;"    @click="reApprove(item.shipmentId)">审核失败
				</span>
				<div class="font-small">
				<span >物流:</span> 
				<el-select style="margin-left: 5px;" v-model="item.companyid" @change="companyChange(index)">
					<el-option  v-for="company in item.companylist"   :key="company.id"  :label="company.name" :value="company.id"   >
					</el-option>
				</el-select>
				 <el-select v-model="item.channelid"  style="margin-left: 5px;">
				 	<el-option  v-for="chan in item.channellist"   :key="chan.id"  :label="chan.channame" :value="chan.id"   >
				 	</el-option>
				 </el-select>
				 <el-button style="margin-left: 5px;"  v-if="planData.auditstatus==1"  @click="saveTrans(item.companyid,item.channelid,item.shipmentId)">保存</el-button>
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
		      <el-image :src="scope.row.image"  class="product-img" ></el-image>
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
	<el-dialog v-model="splitVisible" title="货件拆分" destroy-on-close='true' width="80%" @close='closeDialog'>
			<div class="sh-con-tw">
				<div class="sh-ri">
					<el-table :data="splittableData" border>
						<el-table-column label="图片" width="68">
							<template #default="scope">
								<el-image :src="scope.row.image" class="product-img">
								</el-image>
							</template>
						</el-table-column>
						<el-table-column label="名称/SKU" :show-overflow-tooltip="true">
								<template #default="scope">
									<div >{{scope.row.pname}}</div>
									<div class="sku">{{scope.row.sellersku}}</div>
								</template>
						</el-table-column>
						<el-table-column label="发货数量" width="90" prop="copshipnum">
							<template #default="scope">
							<div class="table-edit-flex">
							<span>{{scope.row.copshipnum}}</span>
							<el-popover  v-model:visible="scope.row.itemshow" placement="top" width="180px" trigger="click" title="发货数量" >
							<template  #reference>	
							<el-icon ><Edit/></el-icon>
							</template>
							<el-input-number   v-model="scope.row.copshipnum" placeholder="发货数量"  />
							<el-button  class="m-t-8" type="primary" @click="scope.row.itemshow=false" >确定</el-button>
							</el-popover>
							</div>
							</template>
						</el-table-column>
						<el-table-column label="材积重" width="90" prop="volume">
							<template #default="scope">
									<div >{{scope.row.dimweight}}<span class="font-extraSmall"> kg</span></div>
							</template>
						</el-table-column>
						<el-table-column label="体积" width="90" prop="volume">
							<template #default="scope">
									<div >{{scope.row.volume}}<span class="font-extraSmall"> m³</span></div>
							</template>
						</el-table-column>
						<el-table-column label="重量" width="90" prop="weight">
							<template #default="scope">
									<div v-if="scope.row.weight">{{scope.row.weight}}<span class="font-extraSmall"> kg</span></div>
									<div v-else>0kg</div>
							</template>
						</el-table-column>
						<el-table-column label="分组"   >
							<template #default="scope">
							<el-radio-group v-model="scope.row.checkGroup" @change="groupSwitch(scope.row)" >
								 <el-radio 
								v-for="item in scope.row.groups"
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
				<div class="sh-le">
					   <h4 class="ma-bo-16">拆分结果</h4>
					    <div  v-for="item in splitResult">
						<el-divider></el-divider>	
						<el-space>
							<h5>{{item.name}}</h5>
							<el-tag size="small" type="primary">组{{item.group}}</el-tag>
							<el-tag v-if="false" size="small" type="danger">重现提交</el-tag>
						</el-space>
						<div>
						 <el-space :size="64">
							 <div>
								 <span class="font-extraSmall">发货重量</span>
								 <p>{{formatFloat(item.weight)}}kg</p>
							 </div>
							 <div>
								 <span class="font-extraSmall">体积</span>
								 <p>{{formatFloat(item.volume)}}m³</p>
							 </div>
							 <div>
							 	  <span class="font-extraSmall">材积重</span>
							 	  <p>{{formatFloat(item.dimweight)}}m³</p>
							 </div>
						 </el-space>
						 	 </div>
							 <div>
						 <el-space :size="64">
							 <div>
							 	  <span class="font-extraSmall">SKU数量</span>
							 	  <p>{{item.skunum}}</p>
							 </div>
							 <div>
							 	 <span class="font-extraSmall">发货数量</span>
							 	  <p>{{item.shipnum}}</p>
							 </div>
							 <div>
								 <span class="font-extraSmall">状态</span>
								 <div>
									 <el-tag v-if="item.splitstr==0" size="small" type="info">待提交</el-tag>
									 <el-tag v-if="item.splitstr==1" size="small" type="info">提交中</el-tag>
									 <el-tag v-if="item.splitstr==2" size="small" type="info">已提交</el-tag>
									 <el-tag v-if="item.splitstr==3" @click="submitPlan(item)" size="small" type="info">(提交失败)点击重新提交</el-tag>
								</div>
							 </div>
							 
						 </el-space>
						 </div>
					</div>
				</div>
			</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="splitVisible = false">取消</el-button>
				<el-button type="primary" @click="saveSplit" >提交</el-button>
			</span>
		</template>
	</el-dialog>
	 <GoodsDeatiles ref="goodsDeatilsRef" :productInfoData="productInfoData"/>
</template>
<script>
	import { ElDivider } from 'element-plus'
	import {CopyDocument,Crop,Plus,Edit,Warning} from '@element-plus/icons-vue'
	import {h, ref ,watch,reactive,onMounted,computed} from 'vue'
	import { useRoute,useRouter } from 'vue-router'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
	import transportationApi from '@/api/erp/ship/transportationApi';
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	import GoodsDeatiles from "./goods_deatils.vue"
	import {ElMessage } from 'element-plus'
	import {formatFloat} from '@/utils/index';
	export default {
		name: 'index',
		components: {CopyDocument,Crop,Plus,Edit,Warning,GoodsDeatiles},
		setup() {
			let router = useRouter()
			let spacer = h(ElDivider, {direction: 'vertical'})
			let planData=ref();
			let itemlist=reactive({list:[]});
			let companylist=ref([]);
			let channellist=ref([]);
			let goodsDeatilsRef =ref()
			let splitName=ref("");
			let nowshipment=ref({});
			let productInfoData=ref({});
			let splitVisible=ref(false);
			let splittableData =ref([]);
			function splitHandel(items){
				nowshipment.value=items;
				items.itemlist.forEach(function(item){
					item.itemshow=false;
					item.copshipnum=item.quantity;
					item.checkGroup='1';
					item.groups=[{label:'组1',value:'1'},
									{label:'组2',value:'2'},
									{label:'组3',value:'3'},
									{label:'组4',value:'4'},
									{label:'组5',value:'5'},
									{label:'组6',value:'6'},
								];
				});
				splittableData.value=items.itemlist;
				splitVisible.value =true;
			}
			function rollbackShipnum(row){
				  row.copshipnum = row.quantity
			}
			function groupSwitch(row){
			}
			//计算属性
			let splitResult = computed(()=>{
					var nowDate=new Date();
					let arr=[]
					let checkGroups = splittableData.value.map((item)=>{
						return item.checkGroup
					})
					checkGroups = Array.from(new Set(checkGroups))
					checkGroups.forEach((checkGroup,index)=>{
						let sameGroupArr = splittableData.value.filter((item)=>item.checkGroup === checkGroup)
						 arr[index] = sameGroupArr
					})
					
					let newArr=[]
					arr.forEach((group,index)=>{
						let obj={}
						obj.shipnum = 0;
						obj.weight = 0;
						obj.dimweight = 0;
						obj.volume = 0;
						obj.skunum = 0;
						obj.splitstr=0;
						var tablist=[];
						group.forEach((item)=>{
							var tab={};
							obj.name="PLN"+"("+(nowDate.getMonth()+1)+"/"+(nowDate.getDate())+"/"+nowDate.getFullYear()+" "+nowDate.getHours()+":"+nowDate.getMinutes()+")-"+item.checkGroup;
							tab.sku=item.sellersku;
							tab.quantity=item.copshipnum;
							tab.mid=item.materialid;
							obj.shipnum += item.copshipnum;
							obj.weight += item.weight;
							obj.volume += item.volume;
							obj.dimweight += item.dimweight;
							obj.skunum++
							obj.group = item.checkGroup;
							tablist.push(tab);
						})
						obj.skulist=tablist;
						newArr.push(obj)
					})
						return newArr
			})
			function submitShipmentName(id,name){
				//ajax修改名字
				updateShipmentRemark(id,'',name);
			}
			function submitShipmentRemark(id,remark){
				//ajax修改备注
				updateShipmentRemark(id,remark,'');
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
				goodsDeatilsRef.value.productVisible=true;
				var groupid=planData.value.amazongroupid;
				var marketplaceid=planData.value.marketplaceid;
				var data={};
				data.groupid=groupid;
				data.marketplace=marketplaceid;
				data.sku=sku;
				productinfoApi.productList(data).then((res)=>{
					console.log(res.data.records[0]);
					if(res.data.records && res.data.total>0){
						productInfoData.value=res.data.records[0];
						productInfoData.value.sku=sku;
					}
				});
				
				
			}
			function copyPlan(shipmentid){
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
						 })
					 }else{
						 ElMessage({
						    message: '修改失败！',
						    type: 'error'
						  })
					 }
				});
			}
			function submitPlan(item){
				item.splitstr=1;
					var params={};var tranPara={};var itemlist=[];
					params.name=item.name;
					params.number='';
					params.shipfromaddressid=planData.value.addressid;
					params.arecasesrequired=planData.value.areCasesRequired;
					params.amazongroupid=planData.value.amazongroupid;
					params.marketplaceid=planData.value.marketplaceid;
					params.warehouseid=planData.value.warehouseid;
					params.plansubid=null;
					params.remark=planData.value.remark;
					params.issplit=false;
					tranPara.company=nowshipment.value.companyid;
					tranPara.channel=nowshipment.value.channelid;
					item.skulist.forEach(function(spt){
							 var row={};
							 row.quantity=spt.quantity;
							 row.QuantityShipped=spt.quantity;
							 row.materialid=spt.mid;
							 row.sellersku=spt.sku;
							 itemlist.push(row);
					});
					params.planitemlist=itemlist;
					params.transinfo=tranPara;
					shipmentplanApi.saveInboundPlan(params).then((res)=>{
						if(res.data){
							ElMessage({
							   message: '提交成功！',
							   type: 'success'
							 })
							item.splitstr=2;
						}
					}).catch(e=>{
						item.splitstr=3;
					})
				
			}
			function saveSplit(){
				// console.log(splitResult.value);
				// console.log(nowshipment.value);
				// console.log(planData.value);
				splitResult.value.forEach(function(item){
					submitPlan(item);
				});
			}
			function saveTrans(companyid,channelid,shipmentid){
				if(channelid!=null && channelid!=undefined && channelid!=''){
					shipmentplanApi.saveTrans({"company":companyid,"channel":channelid,"shipmentid":shipmentid}).then((res)=>{
						if(res.data && res.data=="success"){
							ElMessage({
							   message: '修改成功！',
							   type: 'success'
							 })
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
				shipmentplanApi.createShipment({"shipmentid":shipmentid}).then(res=>{
					 ElMessage({
					   message: '审核成功！',
					   type: 'success'
					 })
				})
			}
			return {
				spacer,splitName,percentformat,goodsDeatilsRef,
				splitHandel,splittableData,splitVisible,saveSplit,nowshipment,productInfoData,
				groupSwitch,rollbackShipnum,splitResult,planData,itemlist,submitShipmentName,submitShipmentRemark,
				companylist,channellist,companyChange,showProductModal,
				copyPlan,updateShipmentRemark,saveTrans,initData,
				submitPlan,formatFloat,toTraceShipment,reApprove
			}
		}
	}
</script>

<style>

.subtext{
	margin-top:8px;
}
.edit-icon{opacity: 0;cursor: pointer;}
.el-card:hover .edit-icon{
	opacity:1
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
