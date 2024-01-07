import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";

function getListByOrder(data){
	return request.post('/erp/api/v1/purchase_form/getListByOrder',data);
}
function list(data){
	return request.post('/erp/api/v1/purchase_form/list',data);
}
function getdetail(data){
	return request.get('/erp/api/v1/purchase_form/getdetail',{params:data});
}
function getRecdetail(data){
	return request.get('/erp/api/v1/purchase_form/getRecdetail',{params:data});
}
function getPurchaseNumAllStatus(data){
	return request.get('/erp/api/v1/purchase_form/getPurchaseNumAllStatus',{params:data});
}
function getAssemblyInfo(data){
	return request.get('/erp/api/v1/purchase_form/getAssemblyInfo',{params:data});
}
function payment(data){
	return request.post('/erp/api/v1/purchase_form/payment',data);
}
function cancelPayment(data){
	return request.get('/erp/api/v1/purchase_form/cancelPayment',{params:data});
}
function paymentApply(data){
	return request.post('/erp/api/v1/purchase_form/paymentApply',data);
}
function updatePrice(data){
	return request.get('/erp/api/v1/purchase_form/updatePrice',{params:data});
}
function approval(data){
	return request.get('/erp/api/v1/purchase_form/approval',{params:data});
}
function purchaseReturn(data){
	return request.get('/erp/api/v1/purchase_form/purchaseReturn',{params:data});
}
function updateNotice(data){
	return request.get('/erp/api/v1/purchase_form/updateNotice',{params:data});
}
function receive(data){
	return request.post('/erp/api/v1/purchase_form/rec',data);
}
function clearRec(data){
	return request.get('/erp/api/v1/purchase_form/clearRec',{params:data});
}
function downExcelReports(data){
	return request({url:"/erp/api/v1/purchase_form/downExcelReports",
			responseType:"blob",
			data:data,
			method:'post'}).then(res => {
					downloadhandler.downloadSuccess(res,"purchaseDetailRecords.xlsx")
			}).catch(e=>{
					downloadhandler.downloadFail(e);
			}); 
}
function recallEntry(data){
	return request.get('/erp/api/v1/purchase_form/recallEntry',{params:data});
}
function deleteEntry(data){
	return request.get('/erp/api/v1/purchase_form/deleteEntry',{params:data});
}
function getEntryData(data){
	return request.get('/erp/api/v1/purchase_form/getEntryData',{params:data});
}
function downloadPurchaseInfo(data){
	return request({url:"/erp/api/v1/purchase_form/downloadPurchaseInfo",
				                    responseType:"blob",
									data:data,
									method:'post'}).then(res => {
											downloadhandler.downloadSuccess(res,"PurchaseContractRecords.xlsx")
									}).catch(e=>{
											downloadhandler.downloadFail(e);
									}); 
}
function autopay(data,type,acct){
	return request.post('/erp/api/v1/purchase_form/autopay/'+type+"/"+acct,data);
}
function autorec(data){
	return request.post('/erp/api/v1/purchase_form/autorec',data);
}
function updateWarehouse(data){
	return request.get('/erp/api/v1/purchase_form/updateWarehouse',{params:data});
}
function uploadPaymentFile(FormData){
	return request({'method':'POST',
	                 'url':"/erp/api/v1/purchase_form/uploadPaymentFile",
				    'data':FormData,
					'headers':{'Content-Type':"multipart/form-data"},
				
	});
}

function changeDeliveryDate(data){
	return request.get('/erp/api/v1/purchase_form/changeDeliveryDate',{params:data});
}
function updateCycle(data){
	return request.get('/erp/api/v1/purchase_form/updateCycle',{params:data});
}
function reviewPruchaseStockPage(data){
	return request.get('/erp/api/v1/purchase_form/reviewPruchaseStockPage',{params:data});
}
function getPaymentReport(data){
	return request.post('/erp/api/v1/purchase_form/getPaymentReport',data);
}
function getPaymentReportExcel(data){
	return request({url:"/erp/api/v1/purchase_form/getPaymentReportExcel",
				                    responseType:"blob",
									data:data,
									method:'post'}).then(res => {
											downloadhandler.downloadSuccess(res,"PurchasePaymentRecords.xlsx")
									}).catch(e=>{
											downloadhandler.downloadFail(e);
									}); 
}

function getPayRecSumReport(data){
	return request.post('/erp/api/v1/purchase_form/getPayRecSumReport',data);
}
function getPurchaseFormReport(data){
	return request.post('/erp/api/v1/purchase_form/getPurchaseFormReport',data);
}
 function downExcelPurchaseFormReport(data,callback){
 	return request({url:"/erp/api/v1/purchase_form/downExcelPurchaseFormReport",
 				                    responseType:"blob",
 									data:data,
 									method:'post'}).then(res => {
 											downloadhandler.downloadSuccess(res,"PurchaseFormReport.xlsx");
											if(callback){
												callback();
											}
 									}).catch(e=>{
 											downloadhandler.downloadFail();
											if(callback){
												callback();
											}
 									}); 
 }




export default{
	 getListByOrder,list,getdetail,getRecdetail,getPurchaseNumAllStatus,getAssemblyInfo,payment,updatePrice,
	 approval,purchaseReturn,getAssemblyInfo,updateNotice,receive,clearRec,downExcelReports,paymentApply,
	 recallEntry,deleteEntry,getEntryData,downloadPurchaseInfo,autopay,autorec,updateWarehouse, uploadPaymentFile,changeDeliveryDate,
	 updateCycle,reviewPruchaseStockPage,getPaymentReport,getPaymentReportExcel,getPayRecSumReport,getPurchaseFormReport,
	 downExcelPurchaseFormReport,cancelPayment,
	 
}