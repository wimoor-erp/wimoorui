import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";

function list(data){
	 return request.post('/erp/api/v1/inventory/dispatch/oversea/list', data);
}
function getData(data){
	return request.get('/erp/api/v1/inventory/dispatch/oversea/getData', {params:data});
}
function deleteData(data){
	return request.get('/erp/api/v1/inventory/dispatch/oversea/deleteData', {params:data});
}
function examine(data){
	return request.get('/erp/api/v1/inventory/dispatch/oversea/examine', {params:data});
}
function saveData(data){
	 return request.post('/erp/api/v1/inventory/dispatch/oversea/saveData', data);
}
function downPDFShipForm(data){
	return request({url:"/erp/api/v1/inventory/dispatch/oversea/downPDFShipForm",
				                    responseType:"blob",
									params:data,
									method:'get'}).then(res => {
											downloadhandler.downloadSuccess(res,"shipform.pdf")
									}).catch(e=>{
											downloadhandler.downloadFail();
									}); 
}

function downExcelTemp(data){
	return request({url:"/erp/api/v1/inventory/dispatch/oversea/downExcelTemp",
				                    responseType:"blob",
									params:data,
									method:'get'}).then(res => {
											downloadhandler.downloadSuccess(res,"dispatchFormTemplate.xlsx")
									}).catch(e=>{
											downloadhandler.downloadFail();
									}); 
}
function uploadExcel(FormData){
	return request({'method':'POST',
	                'url':"/erp/api/v1/inventory/dispatch/oversea/uploadExcel",
				    'data':FormData,
					'headers':{'Content-Type':"multipart/form-data"},
				
	});
}
function getInfo(data){
	return request.get('/erp/api/v1/inventory/dispatch/overseaTrans/getInfo', {params:data});
}
function saveInfo(data){
	return request.post('/erp/api/v1/inventory/dispatch/overseaTrans/saveInfo', data);
}
function updateRemark(data){
	return request.get('/erp/api/v1/inventory/dispatch/oversea/updateRemark', {params:data});
}


export default{
	 list,getData,deleteData,downExcelTemp,uploadExcel,updateRemark,
	 saveData,examine,downPDFShipForm,getInfo,saveInfo
}