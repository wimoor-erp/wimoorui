import axios from 'axios'
import router from "@/router";
import { ElMessage } from 'element-plus';
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
"/admin/api/v1/sms/getSmsCode",
"/admin/api/v1/sms/checkSmsCode",
"/admin/api/v1/users/updatePassword",
"/amazon/api/v1/amzauthority/authSeller"
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
		if(error.response&&error.response.data){
			let code=error.response.data.code;
			if (code === '401'||code == 'A0231'||code == 'A0200'||code == 'S0003'||code == 'S0002'||code == 'S0001') {
				localStorage.removeItem("jsessionid");
				if(!sessionStorage.getItem("old_url_before_login")){
				   sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
				}
			    router.push("/ssologin");
			}else{
				ElMessage.error(error.response.data.msg);
				return Promise.reject(error);
			}
		}else{
			ElMessage.error("系统异常，请联系管理员");
            return Promise.reject(error);
		}
    }
)


export default request