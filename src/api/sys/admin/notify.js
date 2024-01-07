import request from '@/utils/request';
function getMsgLimit(data){
	return request.get('/admin/api/v1/notify/getMsgLimit',{params:data });
}
function getRemind(data){
	return request.post('/admin/api/v1/notify/getRemind',data );
}
function getAnnounce(data){
	return request.post('/admin/api/v1/notify/getAnnounce',data );
}
function getMessage(data){
	return request.post('/admin/api/v1/notify/getMessage',data );
}
function findNitofyNums(data){
	return request.get('/admin/api/v1/notify/findNitofyNums' );
}
function addAnnounce(data){
	return request.post('/admin/api/v1/notify/addAnnounce',data );
}
function pullMessage(data){
	return request.get('/admin/api/v1/notify/pullMessage');
}
function findNoReadByUserAll(){
	return request.get('/admin/api/v1/notify/findNoReadByUserAll');
}
function updateAllTargets(){
	return request.get('/admin/api/v1/notify/updateAllTargets');
}

export default{
	getMsgLimit,getRemind,getAnnounce,getMessage,findNitofyNums,addAnnounce,pullMessage,findNoReadByUserAll,updateAllTargets
}

