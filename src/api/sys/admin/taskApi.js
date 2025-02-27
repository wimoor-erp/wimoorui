import request from "@/utils/request.js";

function getTaskList(){
	return request.get('/admin/api/v1/task/getTaskList');
}
function runApi(data){
	return request.post('/admin/api/v1/task/runApi',data);
}
function disableApi(data){
	return request.post('/admin/api/v1/task/disableApi',data);
}
function enableApi(data){
	return request.post('/admin/api/v1/task/enableApi',data);
}


export default{
	getTaskList,runApi,enableApi,disableApi
}