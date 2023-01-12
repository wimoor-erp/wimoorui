import { createRouter, createWebHistory ,addRoutes} from 'vue-router'
import Layout from '@/layout'
import {menuApi} from '@/api/sys/admin/menuApi';
import store from '@/store/index'
import sysRouter from './modules/sysRouter'
import erp from './modules/erp'
import amazon from './modules/amazon'
const routes = [
  {
    path: '/',
    name: 'index',
    component: Layout,
    redirect:"/ssologin",
    children:[
      {
        path: 'home',
        name: 'Home',
		meta:{ keepAlive: true },
        component: ()=>import("@/views/dashboard")
      },
	  {
	  	  path:"usercenter",
	  	  name:"UserCenter",
	  	  component: ()=>import("@/views/sys/userCenter/index")
	  },
	...erp,
	...amazon,
    ]
  },
...sysRouter
]

const router = createRouter({
  mode:'hash',
  history: createWebHistory(process.env.BASE_URL),
  routes
}) 
const loadflog={hasload:false}
const whitePath = ["/ssologin", "/authresult",'/login',"/register","/resetPassword"]

router.beforeEach(async(to,from,next)=>{
  //跳转前 获取到当前页面的路由
   if (whitePath.includes(to.path)) {  // 判断该路由是否需要登录权限
       if(!sessionStorage.getItem("old_url_before_login")){
		     sessionStorage.setItem("old_url_before_login",from.path);
	   }
	   next(); 
   }else{
	   let jsessionid = sessionStorage.getItem("jsessionid");
		if(loadflog.hasload) {
			next(); 
		}else if(store&&store.state.routerStore.router.length==0){
			    loadflog.hasload=true;
	   	       let result=await menuApi.getRoute();
			   if (result==undefined || result.code == 'A0231'||result.code == 'A0200'||result.code == 'S0003'||result.code == 'S0002'||result.code == 'S0001') {
					localStorage.removeItem("jsessionid");
					if(!sessionStorage.getItem("old_url_before_login")){
					   sessionStorage.setItem("old_url_before_login",window.location.pathname+window.location.search);
					}
				    router.push("/ssologin");
				} else{
					store.dispatch("routerStore/setRouter",result.data);
					addRoute(router,result.data);
				}  
	   	   next({...to,replace:true});  
	   }else{
	   	  next(); 
	   }
   }

   
  
})
function addRoute(router,data,routerData){
	 data.forEach(v=>{
		 let item={};
		 var needroute=false;
		 item.path= 'home';
		 item.name= v.name;
		 if(v["redirect"]){
			 if(v.redirect.indexOf(".do")>0||v.redirect.indexOf(".jsp")>0){
				//这种属于外部菜单与本系统路由无关 item.path= 'https://erp.wimoor.com'+v.redirect; 
			 }else{
				 item.redirect=v.redirect;
				 needroute=true;
			 }
		 }
		 if(v["path"]){
			item.path= v.path;
			needroute=true;
		 }
		 if(v["component"]){
		    item.component= ()=>import("@/views/"+v.component);	 
		 }
		 item.meta=v.meta;
		 if(needroute){
			 if(item.meta){
				 item.meta.keepAlive=true;
			 }else{
				 item.meta={ keepAlive: true, };
			 }
			 router.addRoute('index',item);
			 router.options.routes.push(item);
		 }
		 if(v["children"]){
			 addRoute(router,v.children);
		 }
	 });
}
export default router
