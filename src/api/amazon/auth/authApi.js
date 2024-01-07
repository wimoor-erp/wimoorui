import request from "@/utils/request";

function getAuthUrl(data){
	return request.get('/amazon/api/v1/amzauthority/getAuthUrl',{params:data });
}
function getBindSeller(){
	return request.get('/amazon/api/v1/amzauthority/getBindSeller');
}
function deleteByLogic(data){
	return request.get('/amazon/api/v1/amzauthority/deleteByLogic',{params:data });
}
function authSeller(data){
	return request.get('/amazon/api/v1/amzauthority/authSeller',{params:data });
}
function getRegionByGroup(data){
	return request.get('/amazon/api/v1/amzauthority/getRegionByGroup',{params:data });
}
function saveAuth(data){
	return request.post('/amazon/api/v1/amzauthority/saveAuth',data);
}
function getAuthMaketplace(data){
	return request.get('/amazon/api/v1/amzauthority/getAuthMaketplace',{params:data});
}

export default{
	getAuthUrl,getBindSeller,deleteByLogic,authSeller,getRegionByGroup,saveAuth,getAuthMaketplace
}