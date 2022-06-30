import request from "@/utils/request";
 import axios from 'axios';
function getPurchaseList(data){
	 return request.get('/erp/api/v1/purchase_form/list',{params:data});
}
function getReceiveReport(data){
	 return request.post("/erp/api/v1/purchase_form/getReceiveReport",data)
}
function getWarehouseList(data){
	 return request.get("/erp/api/v1/warehouse/list",{params:data})
}
function getReceiveReportExcel(data){
	let jsessionid = sessionStorage.getItem("jsessionid");
	  return axios({url:"/erp/api/v1/purchase_form/getReceiveReportExcel",
	                responseType:"blob",
					params:data,
					headers:{"jsessionid":jsessionid},  
					method:'get'});
}
export default{
	getPurchaseList,
	getReceiveReport,
	getWarehouseList,
	getReceiveReportExcel,
}