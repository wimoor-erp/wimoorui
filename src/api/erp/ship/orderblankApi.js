import request from "@/utils/request";
function getQuotainfo(shipmentid){ 
	 return request.get('/erp/api/v1/shipForm/quotainfo/'+shipmentid);
}
function getQRCode(shipmentid){
  return request({url:'/erp/api/v1/shipForm/getQRCode/'+shipmentid+"/3",
                responseType:"blob",
				method:'post'});
}
export default{
	getQuotainfo,
	getQRCode,
}