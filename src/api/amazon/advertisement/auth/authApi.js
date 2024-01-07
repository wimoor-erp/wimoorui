import request from "@/utils/request";
function getAuthUrl(data){
	return request.get('/amazonadv/api/v1/advert/bindUrl',{params:data });
}
function authSeller(data){
	return request.get('/amazonadv/api/v1/advert/bindAdvAuthData',{params:data });
}
function disableAuth(data){
	return request.get('/amazonadv/api/v1/advert/disableAuth',{params:data });
}
function getGroup(data){
	return request.get('/amazonadv/api/v1/advManager/getGroup');
}
function loadProfile(data){
	return request.get('/amazonadv/api/v1/advert/loadProfile',{params:data});
}
function captureProfileById(data){
	return request.get('/amazonadv/api/v1/advert/captureProfileById',{params:data});
}

export default{
	getAuthUrl,authSeller,disableAuth,getGroup,loadProfile,captureProfileById
}