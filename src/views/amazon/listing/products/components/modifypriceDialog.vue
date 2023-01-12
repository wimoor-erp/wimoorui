<template>
	<el-dialog v-model="modifyPriceVisable" title="产品调价" destroy-on-close='true' width="80%"  >
		<el-row>
		<el-col :span="10">
		<div class="flex-center dialog-pro">
			<el-image :src="localData.image"></el-image>
			<div>
				<div class="name">{{localData.name}}</div>
				<div class="sku">{{localData.sku}}</div>
				<div class="name">
					备注:
					<span v-if="localData.priceremark && localData.priceremark!=''">
						{{localData.priceremark}}
					</span>
					<span v-else>无</span>
				</div>
				<el-space>
				
				<el-popover  v-model:visible="remarkvisible" placement="top" :width="250" trigger="click">
					 <el-space direction="vertical">
				       <el-input v-model="localData.priceremark" placeholder="请输入改价备注"></el-input>
				      <el-button size="small" type="primary" @click="submitRemark" >提交</el-button  >
				       </el-space>
				    
				    <template #reference>
				  <el-button  text bg>
				  	<el-icon class="font-base">
				  		 <edit></edit>								
				  	</el-icon>
				  	 调价公告
				  </el-button>
				    </template>
				  </el-popover>
				
				 <el-popover  v-model:visible="visible" placement="top" :width="250" trigger="click">
					 <el-space direction="vertical">
				<span style="font-size: 12px;">注：提交冻结调价后，此SKU在设定的时间内调价功能暂时无法使用。</span>
				 <div v-if="localData.haslocked==false">
				 <el-date-picker
					v-model="lockedDate"
					type="date"
					placeholder="选择日期"
					:size="size"
					:teleported="false"
				  />
				      <el-button size="small" type="primary" @click="submitTime" >提交</el-button  >
					  </div>
					  <div v-else>
						  <el-button size="small" type="primary" @click="cancelTime" >确认取消</el-button  >
					  </div>
				       </el-space>
				    
				    <template #reference>
				   <el-button  text bg>
				   	<el-icon class="font-base"><Lock /></el-icon>
				   	<span v-if="localData.haslocked==false">冻结调价</span> 
				   	<span v-else >取消冻结</span> 
				   </el-button>
				    </template>
				  </el-popover>
				  <feed-status ref="feedStatus" :feedid="feedid" filename="priceFeedFile.xlsx"></feed-status>
				</el-space>
			</div>
		</div>
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
		    <el-tab-pane label="售价" name="isForever">
				<el-row>
					<el-col :span="12">
				<el-form :model="form" label-width="120px"  label-position="top">
					 <el-form-item label="产品售价">
					      <el-input v-model="localData.changeprice" >
							  <template #prepend>
								  {{localData.landedCurrency}}
							  </template>
						  </el-input>
						  <span v-if="localData.haslocked==true">
						 冻结期限至：{{dateFormat(localData.lockedtime)}}
						 </span>
					    </el-form-item>
				 </el-form>
				 </el-col>
				 </el-row>
			</el-tab-pane>
		    <el-tab-pane label="限时售价" name="isFortime">
				<el-row>
					<el-col :span="12">
				<el-form :model="form" label-width="120px"  label-position="top">
					 <el-form-item label="优惠价">
					      <el-input v-model="localData.changeprice" >
							  <template #prepend>
								   {{localData.landedCurrency}}
							  </template>
						  </el-input>
					    </el-form-item>
					 <el-form-item label="优惠日期">
					      <el-date-picker
					             v-model="discountDate"
					             type="daterange"
					             range-separator="-"
					             start-placeholder="开始日期"
					             end-placeholder="结束日期"
					             :size="size"
					           />
					    </el-form-item>
				 </el-form>
				 </el-col>
				 </el-row>
			</el-tab-pane>
		    <el-tab-pane label="企业售价" name="isBusiness">
				<el-row>
					<el-col :span="24">
				<el-form :model="form" label-width="120px"  label-position="top">
					 <el-col :span="12">
					 <el-form-item label="企业售价">
					      <el-input v-model="localData.changeprice" >
							  <template #prepend>
								   {{localData.landedCurrency}}
							  </template>
						  </el-input>
					    </el-form-item>
						<el-form-item label="折扣类型">
							 <el-radio-group v-model="bussinesstype" class="ml-4">
							      <el-radio label="percent" size="large">比例</el-radio>
							      <el-radio label="fixed" size="large">固定价格</el-radio>
							    </el-radio-group>
						</el-form-item>
						 </el-col>
						 <el-col :span="24">
						<el-form-item label="折扣类型">
							<table>
								<tr><th>销售数量</th><th>优惠折扣/价格</th><th>售价</th><th>操作</th></tr>
								<tr v-for="(row,index) in bussinessPrice">
									<td>
										 <el-input @input="changeBusPrice(row)" v-model="row.amount"></el-input>
									</td>
									<td>
										<el-input @input="changeBusPrice(row)" v-model="row.discount">
											<template #append>
													<span v-if="bussinesstype=='percent'">%</span>
													<span v-else>{{localData.landedCurrency}}</span>
											</template>
										</el-input>
									
									</td>
									<td>
										{{row.price}}
									</td>
									<td>
											<el-button type="primary" @click="deleteBusPrice(index)" link>删除</el-button>
									</td>
								</tr>
								
							</table>
							 
							 <el-button @click="addBussRow"  class="add-table-row">
								 <el-icon>
									 <plus></plus>
								 </el-icon>
								 添加</el-button>
						</el-form-item>
						 </el-col>
				 </el-form>
				  </el-col>
				 </el-row>
			</el-tab-pane>
		  </el-tabs>
		  </el-col>
		  <el-col :span="14" style="padding-left:60px;">
		 
			    <PriceTable ref="priceTableRef" :isDailog="true"></PriceTable>
			 
		  </el-col>
		</el-row>
	  <template #footer>
	  	<span class="dialog-footer">
	  		<el-button @click="modifyPriceVisable = false">取消</el-button>
	  		<el-button @click="modifyPriceQueue">调价详情</el-button>
	  		<el-button type="primary" @click="submitPrice">提交</el-button>
	  	</span>
	  </template>
	</el-dialog>
</template>

<script>
	import {ref,reactive,onMounted,watch} from "vue"
	import {Lock} from '@element-plus/icons-vue';
	import {Plus,Edit} from '@icon-park/vue-next';
	import {useRouter} from 'vue-router'
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	import {dateFormat,formatFloat} from '@/utils/index';
	import {ElMessage} from 'element-plus';
	import FeedStatus from "@/components/feedstatus/index.vue"
	import PriceTable from "@/views/amazon/listing/price_adjust/components/table.vue"
	export default{
		components:{
			Plus,Edit,Lock,FeedStatus,PriceTable
		},
		setup(){
			let radio1 =ref("1")
			let activeName = ref('isForever')
			let router = useRouter()
            let form = reactive({
				price:18.00,
			})
			let priceTableRef =ref(PriceTable);
			let bussinessPrice = reactive([
				{
					amount:0,
					discount:0,
					price:0,
				},
			])
			let feedStatus=ref(FeedStatus);
			let feedid=ref("");
			let modifyPriceVisable =ref(false)
			let localData=ref({});
			let discountDate=ref();
			let lockedDate=ref();
			let hasLocked=ref(false);
			let bussinesstype=ref("percent");
			let pricetype=ref("isForever");
			let visible=ref(false);
			let remarkvisible=ref(false);
			function modifyPriceQueue(){
				router.push({
					path:'/amazon/sale/priceadjust',
					query:{
					  title:"调价队列",
					  path:'/amazon/sale/priceadjust',
					  details:{},
					}
				}) 
			}
			function submitPrice(){
				if(localData.value.haslocked==false){
					var param={};
					param.pid=localData.value.id;
					param.currency=localData.value.listingCurrency;
					param.changeprice=localData.value.changeprice;
					if(activeName.value=="isForever"){
						param.oldprice=localData.value.changeprice;
					}else{
						param.oldprice=localData.value.landedAmount;
					}
					param.ftype=activeName.value;
					param.submittype='save';
					//企业调价
					param.businessprice=localData.value.changeprice;
					param.businesstype=bussinesstype.value;
					param.standprice=localData.value.landedAmount;
					var list=[];
					bussinessPrice.forEach(function(item){
						if(item.amount>0 && item.discount>0){
							var row={};
							row.quantity=item.amount;
							row.price=item.discount;
							list.push(JSON.stringify(row));
						}
					});
					if(list && list.length>0){
						param.businesslist=list.toString();
					}else{
						param.businesslist=null;
					}
					//限时调价
					if(discountDate.value && discountDate.value.length>0){
						param.startTime=dateFormat(new Date(discountDate.value[0]));
						param.endTime=dateFormat(new Date(discountDate.value[1]));
					}else{
						param.startTime=null;
						param.endTime=null;
					}
					
					productinfoApi.changeProPrice(param).then((res)=>{
					   ElMessage({
					     message: res.data.msg,
					     type: 'success',
					   })
					   feedid.value=res.data.submissionid;
					   feedStatus.value.submitfeedInfo(res.data.submissionid);
					   modifyPriceVisable = false;
					});
				}else{
					ElMessage({
					  message: '当前存在调价冻结！',
					  type: 'error',
					})
				}
			}
			function submitTime(){
				if(new Date(lockedDate.value)>new Date()==true){
					var times=dateFormat(new Date(lockedDate.value));
					productinfoApi.ProductPriceLocked({"pid":localData.value.id,"price":localData.value.landedAmount,"days":times}).then((res)=>{
						if(res.data && res.data.isok=="true"){
							ElMessage({
							  message: "操作成功！",
							  type: 'success',
							})
							visible.value = false;
							localData.value.haslocked=true;
						}else{
							ElMessage({
							  message: "操作失败！",
							  type: 'error',
							})
						}
					});
				}else{
					ElMessage({
					  message: '请选择未来的日期！',
					  type: 'error',
					})
				}
			}
			function addBussRow(){
				var row={};
				row.amount=0;
				row.discount=0;
				row.price=0;
				bussinessPrice.push(row);
			}
			function changeBusPrice(row){
				if(bussinesstype.value=="fixed"){
					row.price=row.discount;
				}else{
					row.price=formatFloat(localData.value.changeprice-formatFloat((row.discount/100)*(localData.value.changeprice)));
				}
			}
			function submitRemark(){
				productinfoApi.updateRemark({"id":localData.value.id,"remark":localData.value.priceremark,"ftype":"price"}).then((res)=>{
					if(res.data && res.data.message=="success"){
						ElMessage({
						  message: "操作成功！",
						  type: 'success',
						})
						remarkvisible.value = false;
					}else{
						ElMessage({
						  message: res.data.msg,
						  type: 'error',
						})
					}
				});
				
			}
			function cancelTime(){
				productinfoApi.cancelProductPriceLocked({"pid":localData.value.id}).then((res)=>{
					if(res.data && res.data.isok=="true"){
						ElMessage({
						  message: "操作成功！",
						  type: 'success',
						})
						visible.value = false;
						localData.value.haslocked=false;
					}else{
						ElMessage({
						  message: res.data.msg,
						  type: 'error',
						})
					}
				});
				
			}
			function deleteBusPrice(index){
				if(bussinessPrice.length==1){
					ElMessage({
					  message: "请至少保留一行！",
					  type: 'error',
					})	;
					return;
				}
				 bussinessPrice.splice(index,1);
			}
			watch(modifyPriceVisable,value=>{
				if(value==true){
                 var queryParam={};
				queryParam.groupid=localData.value.groupid;
				queryParam.marketplaceid=localData.value.marketplaceid;
				queryParam.sku=localData.value.sku;
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 *720)
				queryParam.startDate=start.format("yyyy-MM-dd");
				queryParam.endDate=end.format("yyyy-MM-dd")+" 23:59:59";
					setTimeout(function(){
						priceTableRef.value.loadData(queryParam);
					},1000)
				}
			})
			
	 
			
			return{
				modifyPriceVisable,activeName,form,radio1,bussinessPrice,visible,localData,discountDate,lockedDate,hasLocked,
				bussinesstype,pricetype,remarkvisible,feedid,
				//value
				modifyPriceQueue,submitPrice,submitTime,dateFormat,addBussRow,changeBusPrice,submitRemark,cancelTime,
				deleteBusPrice,
				//function
				feedStatus,priceTableRef,
				//ref
				
			}
		}	
	}
</script>

<style>
	.add-table-row{
		width: 100%;
		margin-top: 8px;
	}
	.dialog-pro{
		margin-bottom:16px;
		align-items: flex-start!important;
	}
	.dialog-pro .el-image{
		overflow: visible;
		margin-right:16px;
	}
	.dialog-pro .el-image img{
		width:60px;
		height:60px;
	}
	.dialog-pro .name{
		font-size: 12px;
		margin-bottom:8px;
	}
	.dialog-pro .sku{
		color: #409eff;
		font-size: 12px;
		margin-bottom:8px;
	}
	
</style>
