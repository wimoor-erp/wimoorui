import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";

function list(data){
	 return request.post('/erp/api/v1/inventory/inwform/list', data);
}
function getData(data){
	return request.get('/erp/api/v1/inventory/inwform/getData', {params:data});
}
function deleteData(data){
	return request.get('/erp/api/v1/inventory/inwform/deleteData', {params:data});
}
function saveData(data){
	 return request.post('/erp/api/v1/inventory/inwform/saveData', data);
}
function downExcelTemp(data){
	return request({url:"/erp/api/v1/inventory/inwform/downExcelTemp",
				                    responseType:"blob",
									params:data,
									method:'get'}).then(res => {
											downloadhandler.downloadSuccess(res,"inFormTemplate.xlsx")
									}).catch(e=>{
											downloadhandler.downloadFail();
									}); 
}
function uploadExcel(FormData){
	return request({'method':'POST',
	                'url':"/erp/api/v1/inventory/inwform/uploadExcel",
				    'data':FormData,
					'headers':{'Content-Type':"multipart/form-data"},
				
	});
}





export default{
	 list,getData,deleteData,downExcelTemp,uploadExcel,saveData
}