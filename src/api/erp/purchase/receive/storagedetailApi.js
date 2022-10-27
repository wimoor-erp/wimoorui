import request from "@/utils/request";
 import axios from 'axios';
function getPurchaseList(data){
	 return request.get('/erp/api/v1/purchase_form/list',{params:data});
}

function getReceiveReport(data){
	 return request.post("/erp/api/v1/purchase_form/getReceiveReport",data)
}
function getReceiveReportExcel(data){
	  return request({url:"/erp/api/v1/purchase_form/getReceiveReportExcel",
	                responseType:"blob",
					params:data,
					method:'get'});
} 
export default{
	getPurchaseList,
	getReceiveReport,
	getReceiveReportExcel,
}