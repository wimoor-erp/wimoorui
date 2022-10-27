import request from "@/utils/request";
function unbindAccount(data){
	 return request.get('/admin/api/v1/users/unbindAccount',{params:data});
}
function userinfo(data){
	 return request.get('​/admin​/api​/v1​/users​/info',{params:data});
}

function getInfo() {
  return request({
    url: '/api/admin/api/v1/users/info',
    method: 'get'
  })
}
export default{
	unbindAccount,userinfo,
	getInfo,
}