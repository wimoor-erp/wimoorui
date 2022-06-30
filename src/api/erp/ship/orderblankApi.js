import request from "@/utils/request";
 import axios from 'axios';
function getQuotainfo(shipmentid){ 
	 return request.get('/erp/api/v1/shipForm/quotainfo/'+shipmentid);
}
function getQRCode(shipmentid){
	let jsessionid = sessionStorage.getItem("jsessionid");
  return axios({url:'/erp/api/v1/shipForm/getQRCode/'+shipmentid+"/3",
                responseType:"blob",
				headers:{"jsessionid":jsessionid},
				method:'post'});
}
export default{
	getQuotainfo,
	getQRCode,
}