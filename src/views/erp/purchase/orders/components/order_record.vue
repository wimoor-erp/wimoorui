<template>
 
	<el-form :inline="true">
		<el-form-item label="已绑定的1688账号" class="margin-b">
			<el-select v-model="formData.alibabaAuthid" :disabled="formData.hasbind" @change="handleAuthChange">
				<el-option   v-for="item in authList"  :key="item.id"  :label="item.name" :value="item.id"   >
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="1688订单号" class="margin-b">
			<el-input v-model="formData.alibabaOrderid" :disabled="formData.hasbind"></el-input>
		</el-form-item>
		<el-form-item class="margin-b">
			<el-button v-if="formData.hasbind" @click="handleUnBind" type="info">解除关联</el-button>
			<el-button v-else type="primary" @click="handleBind">确认关联</el-button>
		</el-form-item>
	</el-form>
	<el-divider></el-divider>
	<div v-if="orderInfo.baseInfo">
	<el-row :gutter="24">
		<el-col :span="14">
			 <el-descriptions title="收货信息" size="small" :column="1">
				 <el-descriptions-item label="订单号">{{orderInfo.baseInfo.id}}
				 <el-button size="small" @click="dialog.visible=true" type="primary" link v-if="orderInfo.baseInfo.status=='waitbuyerpay'">[取消订单]</el-button>
				 <el-button size="small" @click="handleBind"  circle ><el-icon><Refresh /></el-icon></el-button>
				 </el-descriptions-item> 
				 <el-descriptions-item   label="订单状态"  >
				 	<span v-if="OrderStatus[orderInfo.baseInfo.status]">{{OrderStatus[orderInfo.baseInfo.status]}}</span>
				     <span v-else>orderInfo.baseInfo.status</span>
				 	<span v-if="orderInfo.baseInfo.refundStatus" class="font-extraSmall">
				 		 (<span v-if="OrderStatus[orderInfo.baseInfo.refundStatus]">{{OrderStatus[orderInfo.baseInfo.refundStatus]}}</span>
				 	     <span v-else>orderInfo.baseInfo.refundStatus</span>
				 		 )
				 	</span>
				 	<el-button style="margin-left:5px" size="small" @click="handlePay" type="warning" link v-if="orderInfo.baseInfo.status=='waitbuyerpay'">付款</el-button>
				 	<el-button style="margin-left:5px" size="small" @click="handleRefund" circle  type="warning"   v-if="orderInfo.baseInfo.status=='waitsellersend'">退</el-button>
				 </el-descriptions-item>
			    <el-descriptions-item label="收货人">{{orderInfo.baseInfo.receiverInfo.toFullName}}</el-descriptions-item>
			    <el-descriptions-item label="收货地址">{{orderInfo.baseInfo.receiverInfo.toArea}}</el-descriptions-item>
			    <el-descriptions-item label="手机">{{orderInfo.baseInfo.receiverInfo.toMobile}}</el-descriptions-item>
			    <el-descriptions-item label="邮编">{{orderInfo.baseInfo.receiverInfo.toPost}}</el-descriptions-item>
			  </el-descriptions>
		</el-col>
		<el-col :span="10">
			<el-descriptions title="卖家信息" size="small" :column="1">
			   <el-descriptions-item label="供应商">{{orderInfo.baseInfo.sellerContact.companyName}}</el-descriptions-item>
			   <el-descriptions-item label="会员登陆名">{{orderInfo.baseInfo.sellerContact.imInPlatform}}</el-descriptions-item>
			   <el-descriptions-item label="支付宝账户">{{orderInfo.baseInfo.sellerID}}</el-descriptions-item>
			   <el-descriptions-item label="手机">{{orderInfo.baseInfo.sellerContact.mobile}}</el-descriptions-item>
			   <el-descriptions-item label="电话">{{orderInfo.baseInfo.sellerContact.phone}}</el-descriptions-item>
			 </el-descriptions>
		</el-col>
		<el-col :span="24">
				<el-descriptions title="买家留言" size="small" :column="1">
			<el-descriptions-item  >
					<div style="margin-top:-20px;" >{{orderInfo.baseInfo.buyerFeedback}}</div>
				    <div v-if="edit.visible">
					<el-input   type="textarea" maxlength="498"
			                   show-word-limit v-model="formData.remark"></el-input> 
					<div style="padding-top:10px;">
					<el-button size="small" @click.stop="edit.visible=false">取消</el-button>
					<el-button size="small" @click.stop="submitNotice" type="primary">补充留言</el-button>
					</div>
				</div>
				  
				<div v-else class="pointer" @click.stop="edit.visible=true">
					<el-button  type="primary" link  >[补充留言]</el-button>
				</div>
			 
			</el-descriptions-item>
			</el-descriptions>
		</el-col>
	</el-row>
	<el-table :data="orderInfo.productItems"   >
		<el-table-column prop="type" label="图片" width="65">
			<template #default="scope">
				<el-image :src="scope.row.productImgUrl[0]" class="product-img"></el-image>
		</template>
		</el-table-column>
		<el-table-column  prop="name" label="商品名称" />
		<el-table-column prop="price" label="单价" width="60">
					<template #default="scope">
					<div >{{scope.row.price}}</div>	
						<div ><el-button type="primary" plain @click="bind1688(scope.row)" size="small">
						绑定
						</el-button></div>	
			</template>
			</el-table-column>
		 <el-table-column prop="quantity" label="数量" width="60"/>
		  <el-table-column prop="entryDiscount" label="优惠(元)" width="70">
			  <template #default="scope">
			  					   <div >{{scope.row.entryDiscount/100}}</div>
			  </template>
		  </el-table-column>
		  <el-table-column prop="logisticsStatus" label="状态" width="140">
		  <template #default="scope">
		  	 <el-tag v-if="scope.row.logisticsStatus==1"  type="info">未发货</el-tag>
		  	 <el-tag v-if="scope.row.logisticsStatus==2"  type="warning">已发货</el-tag>
		  	 <el-tag v-if="scope.row.logisticsStatus==3"  type="success">已收货</el-tag>
		  	 <el-tag v-if="scope.row.logisticsStatus==4"  type="info">已经退货</el-tag>
		  	 <el-tag v-if="scope.row.logisticsStatus==5"  type="warning">部分发货</el-tag>
		  	 <el-tag v-if="scope.row.logisticsStatus==8"  type="error">还未创建物流订单</el-tag>
		  	</template>
		  </el-table-column>
		  <el-table-column prop="itemAmount" label="总价"  width="60"/>
	</el-table>
	<div class="m-t-8  sum-p-t">
		<div>
		   <p class="font-small"><span >运费</span><span >￥{{orderInfo.baseInfo.shippingFee}}</span></p>
		   <p  class="font-small"><span >退款</span><span >￥{{orderInfo.baseInfo.refund}}</span></p>
		   <p ><span>总付款</span><span class="text-red-18">￥{{orderInfo.baseInfo.totalAmount}}</span></p>
		   </div>
	</div>
	</div>
	<div v-else>
		<Open1688Order ref="open1688OrderRef" @confirm="handleBindOrder"></Open1688Order>
	</div>
	<el-dialog
	    v-model="dialog.visible"
	    title="取消原因"
	    width="30%"
	    :before-close="handleClose"
	  >
	  <el-form :inline="true">
	  	<el-form-item label="取消原因"  >
	    <el-radio-group v-model="formData.cancelReason" size="small">
	          <el-radio-button label="buyerCancel" >买家取消订单 </el-radio-button>
	          <el-radio-button label="sellerGoodsLack" >卖家库存不足</el-radio-button>
	          <el-radio-button label="other" >其它</el-radio-button>
	        </el-radio-group>
		</el-form-item >
		<el-form-item label="原因描述">
			 <el-input
			    v-model="formData.remark"
			    :autosize="{ minRows: 2, maxRows: 4 }"
			    type="textarea"
			    placeholder="请输入取消原因"
			  />
		</el-form-item >
		</el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialog.visible = false">取消</el-button>
	        <el-button type="primary" @click="cancelOrder">
	          确认
	        </el-button>
	      </span>
	    </template>
	  </el-dialog>  
	  
	<el-dialog
	    v-model="paydialog.visible"
	    title="付款"
	    width="30%"
	    :before-close="handleClose"
	  >
	  <el-form  >
	  	<el-form-item label="付款订单"  >
			{{payWay.orderId}}
	    </el-form-item >
	    <el-form-item label="付款费用"  >
			{{payWay.payFee/100}}
	    </el-form-item >
		<el-form-item label="失效日期"  >
			{{payWay.timeout}}
		</el-form-item >
			
		<el-form-item label="付款方式">
			<el-radio-group v-model="payWay.code" size="small">
				  <el-radio-button :label="channels.code"  v-for="channels in payWay.channels">
					  {{channels.name}} 
				   </el-radio-button>
				</el-radio-group>
		</el-form-item >
		</el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="paydialog.visible = false">取消</el-button>
	        <el-button type="primary" @click="orderPay">
	          确认
	        </el-button>
	      </span>
	    </template>
	  </el-dialog> 
	  
	  <el-dialog
	      v-model="refunddialog.visible"
	      title="退款退货"
	      width="30%"
	      :before-close="handleClose"
	    >
	    <el-form  >
	  	<el-form-item label="货物状态">
	  		<el-radio-group v-model="refund.goodsStatus" size="small" @change="loadRefundReason">
	  			  <el-radio v-for="goodstatus in refund.goodStatusList" :label="goodstatus.value" >
	  				                 {{goodstatus.name}}
	  			   </el-radio>
	  			</el-radio-group>
	  	</el-form-item >
			<el-form-item label="退款内容">
				<el-radio-group v-model="refund.disputeRequest" size="small"  >
					  <el-radio  label="refund" >   退款 </el-radio>
					  <el-radio  label="returnRefund" >   退款退货 </el-radio>
					</el-radio-group>
			</el-form-item >
			
			<el-form-item label="退货理由"  >
				  <el-radio-group v-model="refund.applyReasonId" size="small">
				  	  <el-radio v-for="reason in refund.reasons" :label="reason.id" >
				  		                 {{reason.name}}
				  	   </el-radio>
				  	</el-radio-group>	 
			</el-form-item >
			<el-form-item label="描述"  >
					<el-input
					   v-model="refund.description"
					   :autosize="{ minRows: 2, maxRows: 4 }"
					   type="textarea"
					   placeholder="请输入取消原因"
					 />
			</el-form-item >
	  	</el-form>
	      <template #footer>
	        <span class="dialog-footer">
	          <el-button @click="refunddialog.visible = false">取消</el-button>
	          <el-button type="primary" @click="refundOrderSumbit">
	            确认
	          </el-button>
	        </span>
	      </template>
	    </el-dialog> 
	  
</template>

<script setup>
	import {ref,reactive,onMounted,toRefs,} from 'vue'
	import purchasealibabaApi from '@/api/erp/purchase/open1688/purchasealibabaApi.js';
	import Open1688Order from "@/views/erp/purchase/open1688/order/open1688order.vue";
	import { ElMessage, ElMessageBox } from 'element-plus';
	import {Edit,Refresh} from '@element-plus/icons-vue';
	import OrderStatus from "@/model/erp/purchase/open1688/order_status.json"
	const open1688OrderRef=ref();
	const state = reactive({
		 authList:[],
		 formData:{alibabaAuthid:"",alibabaOrderid:"",purchaseEntryid:"",hasbind:false,cancelReason:"buyerCancel",entry:{}},
		 orderInfo:{},
		 payWay:{},
		 refund:{disputeRequest:"refund",
		         reasons:[],
				 goodStatusList:[
								 {value:"refundWaitSellerSend",name:"售中等待买家发货"},
								 {value:"refundWaitBuyerReceive",name:"售中等待买家收货"},
								 {value:"refundBuyerReceived",name:"售中已收货（未确认完成交易）"},
								 {value:"aftersaleBuyerNotReceived",name:"售后未收货"},
								 {value:"aftersaleBuyerReceived",name:"售后已收到货"},
								 ],
		 },
		 edit:{visible:false},
		 dialog:{visible:false},
		 paydialog:{visible:false},
		 refunddialog:{visible:false},
		 
	})
	const {
	   authList,formData,orderInfo,edit,dialog,paydialog,payWay,refund,refunddialog
	}=toRefs(state)
	const emit = defineEmits(['change','noauth']);
	function show(entry){
		 state.formData.purchaseEntryid=entry.id;
		 state.formData.entry=entry;
		 handleQuery();
	}
    function cancelOrder(){
		if(!state.formData.remark){
			state.formData.remark="";
		}
		if(!state.formData.cancelReason){
			state.formData.cancelReason="";
		}
		purchasealibabaApi.cancelOrder(state.formData).then(res=>{
			state.dialog.visible = false;
			handleBind();
		}); 
	}
	function submitNotice(){
		purchasealibabaApi.addFeedback(state.formData).then(res=>{
			state.edit.visible=false;
			handleBind();
		})
		
	}
	function refundOrderSumbit(){
		state.refund.applyPayment=state.orderInfo.baseInfo.sumProductPayment;
		state.refund.applyCarriage=state.orderInfo.baseInfo.shippingFee;
		if(!state.refund.description||state.refund.description.length<=2){
			ElMessage({
			  type: 'error',
			  message: '退款理由必须大于两个字符',
			});
			return;
		}
		purchasealibabaApi.createRefund(state.refund).then(res=>{
			if(res.result.success){
				ElMessage({
				  type: 'success',
				  message: '操作成功',
				})
				state.refunddialog.visible=false;
			   handleBind();
			}else{
				ElMessage({
				  type: 'error',
				  message: res.result.message,
				});
			}
		})
	}
	function loadRefundReason(){
		var orderEntryIds=[];
		orderEntryIds.push(state.formData.alibabaOrderid);
		state.refund.orderEntryIds=JSON.stringify(orderEntryIds);
		state.refund.alibabaOrderid=state.formData.alibabaOrderid;
		state.refund.alibabaAuthid=state.formData.alibabaAuthid;
		state.refund.purchaseEntryid=state.formData.purchaseEntryid;
		purchasealibabaApi.getRefundReasonList(state.refund).then(res=>{
			if(res.data&&res.data.result&&res.data.result.result){
			   state.refund.reasons=res.data.result.result.reasons;
			   if(state.refund.reasons&&state.refund.reasons.length>0){
				   state.refund.applyReasonId=state.refund.reasons[0].id;
			   }
			}
		})
	}
	function handleRefund(){
		state.refunddialog.visible=true;
		state.refund.goodStatusList.forEach(item=>{ 
			if(item.value.toLowerCase().includes(state.orderInfo.baseInfo.status)){
				state.refund.goodsStatus=item.value;
			}
		})
		 loadRefundReason();
	}
	function handlePay(){
		state.payWay={};
		purchasealibabaApi.payWay(state.formData).then(res=>{
			state.paydialog.visible=true;
			if(res.data&&res.data.resultList){
				state.payWay=res.data.resultList;
				state.payWay.code=res.data.resultList.channels[0].code;
			}
		});
	}
	function orderPay(){
		state.formData.channel=state.payWay.code;
		var orderIdList=[];
		orderIdList.push(state.formData.alibabaOrderid);
		state.formData.orderIdList=JSON.stringify(orderIdList);
		purchasealibabaApi.payUrl(state.formData).then(res=>{
			 window.open(res.data.payUrl, "_blank");
		});
	}
	function handleAuthChange(){
		if(state.formData.alibabaOrderid==""){
			if(open1688OrderRef.value&&open1688OrderRef.value.show){
			    open1688OrderRef.value.show(state.formData);
			}
		}
	}
	function bind1688(row){
		state.formData.productCode=row.productID;
		state.formData.specid=row.specId;
		purchasealibabaApi.bindProductInfoByEntry(state.formData).then(res=>{
			state.edit.visible=false;
		    ElMessage({
		      type: 'success',
		      message: '操作成功',
		    })
		})
	}
	function handleQuery(){
		purchasealibabaApi.getAlibabaOrder(state.formData).then(res=>{
			var fee={price:0,ship:0};
			if(res.data&&res.data.orderInfo){
				state.formData.alibabaAuthid=res.data.alibabaAuth;
				state.formData.alibabaOrderid=res.data.alibabaOrderid;
			    if(res.data.orderInfo){
						state.formData.hasbind=true;
						state.orderInfo=res.data.orderInfo.result;
						if(state.orderInfo.productItems.length==1){
							fee.price=state.orderInfo.productItems[0].itemAmount;
						}
						
				}
				fee.ship=state.orderInfo.baseInfo.shippingFee;
			}else{
				state.formData.alibabaAuthid=state.authList[0].id;
				state.formData.alibabaOrderid="";
				state.formData.hasbind=false;
				state.orderInfo={};
				if(open1688OrderRef.value&&open1688OrderRef.value.show){
				    open1688OrderRef.value.show(state.formData);
				}
			}
			emit("change",fee);
		})
	}
	function handleUnBind(){
		purchasealibabaApi.unbindAlibabaOrder(state.formData).then(res=>{
			handleQuery();
		});
	}
	function handleBindOrder(orderid){
		state.formData.alibabaOrderid=orderid;
		purchasealibabaApi.bindAlibabaOrder(state.formData).then(res=>{
			handleQuery();
		});
	}
 
	function handleBind(){
		purchasealibabaApi.bindAlibabaOrder(state.formData).then(res=>{
			handleQuery();
		});
	}
	defineExpose({
		show,
	})
	onMounted(async()=>{
		await purchasealibabaApi.getAuthData().then(res=>{
			state.authList=res.data;
			if(state.authList&&state.authList.length>0){
				state.formData.alibabaAuthid=state.authList[0].id;
				var noauth=true;
				state.authList.forEach(item=>{
					if(item.refreshToken&&noauth){
						noauth=false;
					}
				});
				if(noauth){
					emit("noauth");
				} 
			}else{
				emit("noauth");
				
			}
		})
	})
</script>

<style scoped>
	.sum-p-t p{
		display:flex;
		justify-content: space-between;
		width: 200px;
	}
	.sum-p-t{
		display: flex;
		justify-content: flex-end;
	}
	.text-red-18{
		color:var(--el-color-primary);
		font-size: 18px;
		font-weight: 700;
	}
	.margin-b{
		margin-bottom: 8px;
	}
</style>
