import request from "@/utils/request";

function loadMyField(data){
	 return request.get('/admin/api/v1/sysQueryField/loadMyField',{params:data});
}
function getMyVersionFieldByUser(data){
	 return request.get('/admin/api/v1/sysQueryField/getMyVersionFieldByUser',{params:data});
}
function deleteMyVersionField(data){
	 return request.get('/admin/api/v1/sysQueryField/deleteMyVersionField',{params:data});
}
function saveMyVersionFieldWithName(data){
	 return request.post('/admin/api/v1/sysQueryField/saveMyVersionFieldWithName',data);
}


export default{
	 loadMyField,getMyVersionFieldByUser,deleteMyVersionField,
	 saveMyVersionFieldWithName,
}