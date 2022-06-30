import { createRouter, createWebHistory ,addRoutes} from 'vue-router'
import Layout from '@/layout'
import {menuApi} from '@/api/sys/admin/menuApi';
import store from '@/store/index'
import sysRouter from './modules/sysRouter'
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
        component: ()=>import("@/views/dashboard")
      },
    ]
  },
...sysRouter
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
}) 
const loadflog={hasload:false}

router.beforeEach(async(to,from,next)=>{
  //跳转前 获取到当前页面的路由
   if (to.path=="/ssologin") {  // 判断该路由是否需要登录权限
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
	   	       store.dispatch("routerStore/setRouter",result.data);
	   	       addRoute(router,result.data);
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
			 router.addRoute('index',item);
			 router.options.routes.push(item);
		 }
		 if(v["children"]){
			 addRoute(router,v.children);
		 }
	 });
}
export default router
