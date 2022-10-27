import request from '@/utils/request';
function getMsgLimit(data){
	return request.get('/admin/api/v1/notify/getMsgLimit',{params:data });
}
export default{
	getMsgLimit
}

