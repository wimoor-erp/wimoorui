import request from "@/utils/request.js";
import downloadhandler from "@/utils/download-handler.js";

function list(data){
	 return request.post('/erp/api/v1/purchase/purchaseFormEntryChange/list', data);
}
function getData(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/getData', {params:data});
}
function deleteData(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/deleteData', {params:data});
}
function saveData(data){
	 return request.post('/erp/api/v1/purchase/purchaseFormEntryChange/saveData', data);
}
function saveRecord(data){
 	return request.get('/erp/api/v1/purchase/purchaseFormEntryChangeReceive/saveRecord',{params:data});
}
function examine(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/examine',{params:data});
}
function cancelInstock(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChangeReceive/cancelInstock',{params:data});
}
function resetForm(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/resetForm',{params:data});
}


export default{
	 list,getData,deleteData,saveData,saveRecord,examine,cancelInstock,resetForm,
}