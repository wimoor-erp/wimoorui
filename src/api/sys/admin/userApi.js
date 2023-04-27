import request from "@/utils/request";
function unbindAccount(data){
	 return request.get('/admin/api/v1/users/unbindAccount',{params:data});
}
function userinfo(data){
	 return request.get('​/admin​/api​/v1​/users​/info',{params:data});
}
function limitData(type){
	 return request({ url:'/admin/api/v1/users/limitData?type='+type,method: 'get'});
}
function getInfo() {
  return request({ url: '/admin/api/v1/users/info',method: 'get'})
}
function updatePassword(data) {
  return request.post('/admin/api/v1/users/updatePassword' ,data)
}
function getSmsCode(data) {
   return request.get( '/admin/api/v1/sms/getSmsCode' ,{params:data});
}
function checkSmsCode(data) {
   return request.get( '/admin/api/v1/sms/checkSmsCode' ,{params:data});
}
function findOwnerAll(){
	 return request.get('/admin/api/v1/users/findOwnerAll');
}
function detail(){
	 return request.get('/admin/api/v1/users/detail');
}
export default{
	unbindAccount,userinfo,findOwnerAll,limitData,detail,
	getInfo,updatePassword,getSmsCode,checkSmsCode,
}