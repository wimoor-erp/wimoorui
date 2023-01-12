import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
function getOrderSumField(data){
	 return request.post('/amazon/api/v1/salessum/getOrderSumField',data);
}
function getOrderData(data){
	return request.post('/amazon/api/v1/salessum/getOrderData',data);
}
function downloadSalesDetail(data){
	return request({url:"/amazon/api/v1/salessum/downloadDate",
				                    responseType:"blob",
									data:data,
									method:'post'}).then(res => {
											downloadhandler.downloadSuccess(res,"ProductSalas.xlsx")
									}).catch(e=>{
											downloadhandler.downloadFail(e);
									}); 
}

export default{
	 getOrderSumField,getOrderData,downloadSalesDetail
}