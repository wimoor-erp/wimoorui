/**
 * 产品
 */
import request from "@/utils/request";
function getMaterialList(data){
	 return request.get('/erp/api/v1/material',{params:data});
}
function uploadImage(FormData){
	return request({'method':'POST',
	                'url':"/erp/api/v1/material/uploadimg",
				    'data':FormData,
					'headers':{'Content-Type':"multipart/form-data"},
				
	});
}
function getMaterialInventoryInfo(data){
	return request.get('/erp/api/v1/material/getMaterialInventoryInfo',{params:data});
}
function getMaterialInfo(data){
	return request.get('/erp/api/v1/material/getMaterialInfo',{params:data});
}
function getCategory(data){
	return request.get('/erp/api/v1/material/getCategory',{params:data});
}
function getMaterialByInfo(data){
	return request.get('/erp/api/v1/material/getMaterialByInfo',{params:data});
}



 
export default{
	getMaterialList,uploadImage,getMaterialInventoryInfo,getMaterialInfo,getCategory,getMaterialByInfo
}