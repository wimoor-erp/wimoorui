import request from "@/utils/request"; 
function getAuthData(data){
	 return request.get('/erp/api/v1/purchase1688/getAuthData',{params:data});
}
function get1688Url(data){
	 return request.get("/erp/api/v1/purchase1688/get1688Url",{params:data})
}
function logicDelete(data){
	 return request.get("/erp/api/v1/purchase1688/delete",{params:data})
}
function refreshAuthData(data){
	 return request.get("/erp/api/v1/purchase1688/refreshAuthData",{params:data})
}
function bindAuthData(data){
	 return request.get("/erp/api/v1/purchase1688/bindAuthData",{params:data})
}
function submitname(data){
	 return request.post("/erp/api/v1/purchase1688/submitname",data)
}
function updateName(data){
	 return request.get("/erp/api/v1/purchase1688/updateName",{params:data})
}
export default{
	getAuthData,
	get1688Url,
	logicDelete,
	bindAuthData,
	updateName,
	submitname,
	refreshAuthData,
}