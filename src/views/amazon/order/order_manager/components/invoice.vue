<template>
	<!-- 发票详情 -->
	<el-dialog v-model="vatVisible" title="发票详情"  @close='closeDialog'>
		<el-descriptions size="default">
		    <el-descriptions-item :span="2"  label="店铺名称">{{orderData.groupname}}</el-descriptions-item>
			 <el-descriptions-item :span="2" label="订单号"> {{orderData.orderid}}</el-descriptions-item>
			<el-descriptions-item :span="2" label="发票类型">
				<el-radio-group v-model="vattype" class="ml-4">
					  <el-radio label="Vat" size="large">Vat发票</el-radio>
					  <el-radio label="normal" size="large">普通发票</el-radio>
				</el-radio-group>
			</el-descriptions-item>
			<el-descriptions-item :span="2" label="订单类型">
				<el-radio-group v-model="ordertype" class="ml-4">
					  <el-radio label="refund" size="large">退款</el-radio>
					  <el-radio label="normal" size="large">购买</el-radio>
				</el-radio-group>
			</el-descriptions-item>
			<el-descriptions-item v-if="ordertype=='refund'" :span="2" label="原始发票号">
				 <el-input style="width:150px;"  v-model="invoiceNo"></el-input>
			</el-descriptions-item>
			<el-descriptions-item :span="2" label="发票格式">
				<el-radio-group v-model="vatlabel" class="ml-4">
					  <el-radio label="PDF" size="large">PDF</el-radio>
					  <el-radio label="Word" size="large">Word(可编辑)</el-radio>
				</el-radio-group>
			</el-descriptions-item>
		 
			<el-descriptions-item :span="2"  label="提交状态">
				    <FeedStatus :feedid="feedid" filename="tax.pdf" class="ml-4"> </FeedStatus>
			</el-descriptions-item>
	 
		  </el-descriptions>
		  <template #footer>
		  	<span class="dialog-footer btn-betwn">
				<div>
				<el-button @click="editInvoiceInfo()" size="mini">编辑发票信息</el-button>
				<el-button @click="openInvoiceInfo()" size="mini">预览发票信息</el-button>
				</div>
				<div>
				<el-button @click="vatVisible = false">关闭</el-button>
				<el-button @click="downloadVatInfo">下载</el-button>
				<el-button @click="submitFBAVat" type="primary" title="需在亚马逊后台开启‘我将上传自己的增值税发票’功能才能使用！">上传FBA发票</el-button>
				</div>
		  	</span>
		  </template>
	</el-dialog>
		<InvoiceTemplate ref="invoiceTemplateRef"></InvoiceTemplate>
		<InvoiceView ref="invoiceViewRef"></InvoiceView>
		<InvoiceRefundView ref="invoiceRefundViewRef"></InvoiceRefundView>
</template>

<script setup>
	import {ref ,watch,reactive,onMounted,onUpdated} from 'vue';
	import orderListApi from '@/api/amazon/order/orderListApi';
	import groupApi from '@/api/amazon/group/groupApi';
	import {formatFloat,dateFormat,dateTimesFormat} from '@/utils/index';
	import {ElMessage,ElLoading} from 'element-plus';
	import {View,Refresh} from '@element-plus/icons-vue'
	import myUtil from "@/hooks/amazon/order/financial";
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import FeedStatus from "@/components/feedstatus/index";
	import InvoiceTemplate from "./invoice_template.vue";
	import InvoiceView from "./invoice_view.vue";
	import InvoiceRefundView from "./invoice_view_refund.vue";
	const invoiceTemplateRef=ref();
	const invoiceViewRef=ref();
	const invoiceRefundViewRef=ref();
    let vatVisible=ref(false)
	let invoiceNo=ref("");
	let vattype=ref("normal")
	let ordertype=ref("normal")
	let vatlabel=ref("Word")
	let vathidden=ref("hide")
	let productData=reactive({list:[]});
	let finlist=reactive({list:[]});
	let invoiceModel={logourl:"",
	                      company:"",
	                      country:"",
						  province:"",
						  city:"",
	                      address:"",
		                  phone:"",postalcode:"",email:"",
	                     }
	 let totalorderprice=ref("")
	let orderData=ref(invoiceModel);
	let feedid=ref("");
	function editInvoiceInfo(){
		 invoiceTemplateRef.value.show(orderData.value,vattype.value);
	}
	function openInvoiceInfo(){
		if(ordertype.value=='normal'){
		    invoiceViewRef.value.show(orderData.value,vattype.value,vatlabel.value,ordertype.value);
		}else{
			invoiceRefundViewRef.value.show(orderData.value,vattype.value,vatlabel.value,ordertype.value,invoiceNo.value);
		}
	}
	 
	function handlerMarket(market){
		if (market == "Amazon.fr"){
			market = "fr";
		}
		if (market == "Amazon.co.uk"){
			market = "uk";
		}
		if (market == "Amazon.de"){
			market = "de";
		}
		if (market == "Amazon.es"){
			market = "es";
		}
		if (market == "Amazon.it"){
			market = "it";
		}
		return market;
	}
	function downloadVatInfo(){
		//下载pdf或者word
		orderListApi.downloadOrderVatInvoice({
			"orderid":orderData.value.orderid,
			"groupid":orderData.value.groupid,
			"vatlabel":vatlabel.value,
			"vattype":vattype.value,
			"country":handlerMarket(orderData.value.market),
			"itemstatus":orderData.value.itemstatus,
			"postDate":dateTimesFormat(orderData.value.buydate),
			"ordertype":ordertype.value,
			"invoiceno":invoiceNo.value
		}).then(res => {
				ElMessage({
				    message: '导出成功！',
				    type: 'success',
				  })
			 const blob = new Blob([res]);
			 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
				 if(vatlabel.value=="PDF"){
					 navigator.msSaveBlob(blob, "ordersVatInfo.pdf")
				 }else{
					  navigator.msSaveBlob(blob, "ordersVatInfo.doc")
				 }
			 		  
			 }else{
				 var link=document.createElement("a");
				 link.href=window.URL.createObjectURL(blob);
				 if(vatlabel.value=="PDF"){
					link.download="ordersVatInfo.pdf";
				 }else{
					 link.download="ordersVatInfo.doc";
				 }
				 link.click();
				 window.URL.revokeObjectURL(link.href);
			 }
		
		}).catch(e=>{
				ElMessage({
				    message: '导出失败！',
				    type: 'error',
				  })
		})
	}
	

	function submitFBAVat(){
		if(vattype.value!="Vat"){
			ElMessage({
			    message: "自动上传的发票类型只支持VAT",
			    type: 'error',
			  });
			  return;
		}else{
			orderListApi.sendAmzVatInvoince({
				"groupid":orderData.value.groupid,
				"country":handlerMarket(orderData.value.market),
				"orderid":orderData.value.orderid,
				"itemstatus":orderData.value.itemstatus,
				"postDate":dateTimesFormat(orderData.value.buydate),
				"vatlabel":vatlabel.value,
				"vattype":vattype.value
			}).then(function(res){
				if(res.data){ 
					if(res.data.isOk=="true"){
						feedid.value=res.data.feedid;
						ElMessage({
						    message: res.data.msg,
						    type: 'success',
						  })
					}else{
						ElMessage({
						    message: res.data.msg,
						    type: 'error',
						  })
					}
				}
			})
		}
	}
	function closeDialog(){
		vatVisible.value=false;
	}
	function show(row){
		 vatVisible.value=true;
		if(row.marketname=="英国" || row.marketname=="法国" || row.marketname=="德国" || row.marketname=="西班牙" || row.marketname=="意大利"){
			vathidden.value=" ";
		}
		var rows=JSON.parse(JSON.stringify(row));
		orderData.value=rows;
		feedid.value="";
		feedid.value=rows.feedid
	}
	defineExpose({show})
</script>

<style>
</style>