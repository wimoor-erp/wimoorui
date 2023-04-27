/**
 * 盘点
 */
import request from "@/utils/request";

function view(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/view', {params:data});
}
function edit(data){
	return request.get('/erp/api/v1/inventory/stockTaking/edit', {params:data});
}
function list(data){
	 return request.post('/erp/api/v1/inventory/stockTaking/list', data);
}
function searchCondition(data){
	 return request.post('/erp/api/v1/inventory/stockTaking/searchCondition', data);
}
function changeWarehouse(data){
	return request.get('/erp/api/v1/inventory/stockTaking/changeWarehouse', {params:data});
}
function saveItem(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/saveItem', {params:data});
}
function removeItem(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/removeItem', {params:data});
}
function startAction(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/startAction', {params:data});
}
function continueAction(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/continueAction', {params:data});
}
function endAction(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/endAction', {params:data});
}
function cancelAction(data){
	 return request.get('/erp/api/v1/inventory/stockTaking/cancelAction', {params:data});
}

export default{
	view,edit,list,searchCondition,changeWarehouse,saveItem,removeItem,startAction,continueAction,endAction,cancelAction
}