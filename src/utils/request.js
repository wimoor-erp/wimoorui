import axios from 'axios'
import router from "@/router";
import { ElMessage } from 'element-plus';

const CancelToken = axios.CancelToken;
let cancelMap = new Map();
const request = axios.create({
    timeout: 600000,
	headers:{'Content-Type':'application/json;charset=utf-8'}
})

// 请求白名单，如果请求在白名单里面，将不会被拦截校验权限
const whiteUrls = [
"/user/add", 
'/user/getUserList',
'/api/auth/login',
'/api/auth/ssologinisrun',
"/user/update",
"/user/deleteUser",
"/admin/api/v1/sms/checkSmsCode",
"/admin/api/v1/users/updatePassword",
"/amazon/api/v1/amzauthority/authSeller",
"/admin/api/v1/users/getSmsCode",
"/admin/api/v1/users/getEmailCode",
"/admin/api/v1/users/register",
"/admin/api/v1/users/updatePasswordForget",
"/api/auth/verifySmsCode",
]
const whiteMutiUrls=[
	"/amazon/api/v0/feed/submitfeedInfo",
	"/admin/api/v1/dict-items",
	"/amazon/api/v1/shipInboundPlan/getShipRecordByMarket",
	"/erp/api/v1/material/getMaterialInventoryInfo",
	"/amazon/api/v1/shipForm/guidance",
	"/erp/api/v1/purchase/plan/getLast",
	"/amazon/api/v1/product/salesplan/getExpandCountryData",
	"/erp/api/v1/warehouse/getlist",
	"/erp/api/v1/assembly/getSubForm",
	"/erp/api/v1/purchase_form/getPriceBySupplier",
	"/admin/api/v1/sysprogress",
]
// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密 

 request.interceptors.request.use(config => {
     // 取出sessionStorage里面缓存的用户信息
     let jsessionid = localStorage.getItem("jsessionid");
     if (!whiteUrls.includes(config.url)) {  // 校验请求白名单
         if(!jsessionid) {
        	 localStorage.getItem("jsessionid")
		     if(!sessionStorage.getItem("old_url_before_login")){
		        sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
		     }
             router.push("/ssologin");
         } else {
             config.headers['jsessionid'] =jsessionid;  // 设置请求头
         }
     }
   if (cancelMap.has(config.url)) {
	    if (!whiteMutiUrls.includes(config.url)) { 
			    console.log(config.url);
			    cancelMap.get(config.url)();// 取消请求
			 }
			 cancelMap.delete(config.url); // 仓库里删除链接
		 }
		 // 统一在请求前添加 cancelToken 方法
		 config.cancelToken = new CancelToken(function executor(c) {
			 // executor 函数接收一个 cancel 函数作为参数
			 cancelMap.set(config.url, c)
		 })
	 
 
     return config
 }, error => {
     return Promise.reject(error)
 });

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
		if (cancelMap.has(response.config.url)) {
		     cancelMap.delete(response.config.url);
		 }

        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
	        if(res=="noauth"){
		       localStorage.removeItem("jsessionid");
			   if(!sessionStorage.getItem("old_url_before_login")){
				 sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
			   }
		       router.push("/ssologin");
	        }
            res = res ? JSON.parse(res) : res
        }
        // 验证token
		if(res&&res.data){
			if (res.code === '401') {
				localStorage.removeItem("jsessionid");
				if(!sessionStorage.getItem("old_url_before_login")){
				   sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
				}
			    router.push("/ssologin");
			}
			else if (res.data.code == 'A0231'||res.data.code == 'A0200'||res.data.code == 'S0003'||res.data.code == 'S0002'||res.data.code == 'S0001') {
				localStorage.removeItem("jsessionid");
				if(!sessionStorage.getItem("old_url_before_login")){
				   sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
				}
			    router.push("/ssologin");
			}
		}
        if(res.code=="201"){
            return res;
		}else{
			if(res&&res.msg){
			   ElMessage.error(res.msg);
			}
			return Promise.reject(res);
		}
    },
    error => {
		if (error.config&&cancelMap.has(error.config.url)) {
		     cancelMap.delete(error.config.url);
		 }
		if(error.response&&error.response.data){
			let code=error.response.data.code;
			if (code === '401'||code == 'A0231'||code == 'A0200'||code == 'S0003'||code == 'S0002'||code == 'S0001') {
				localStorage.removeItem("jsessionid");
				if(!sessionStorage.getItem("old_url_before_login")){
				   sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
				}
			    router.push("/ssologin");
			}else if(error.response&&error.response.data.msg){
				ElMessage.error(error.response.data.msg);
				return Promise.reject(error);
			}else{
				console.log(error);
				return Promise.reject(error);
			}
		}else{
            return Promise.reject(error);
		}
    }
)


export default request