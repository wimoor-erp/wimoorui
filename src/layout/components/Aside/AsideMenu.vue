<template>
    <div id="menubar" :class="theme" >
		 <el-scrollbar height="calc(100vh)" >
			 <div class="aside-flex" style="height:calc(100vh)">
			 <div>
			 <div class="logo pointer" @click="goHome">
			 <el-image 
			   :src="require('@/assets/image/common/color-logo.png')"
			 ></el-image>
			 </div>
		   <el-menu 
		           :default-active="activeIndex"
		           class="el-menu-vertical"
		           :default-openeds="[1]">
		         <!--主菜单-->  
		       <el-menu-item  
			       @mouseleave="laveMenu"   
			       @mouseenter="changeMenu(item.id,index)" 
				   @click="changeDrawer(item)" 
				   v-for="(item,index) in menuData.list" 
				   :key="item.id" :index='index+""' >
				   
		                     <icon-park 
							    v-if="theme=='themeLight'"
							    :type="item.iconName" 
				                 theme="outline" 
							     :size="18" 
							    :strokeWidth="3"/>
								<icon-park
								   v-else
								   :type="item.iconName" 
								    theme="outline" 
								    :size="18" 
								   :strokeWidth="4"/>
		           <span>{{item.name}}</span>
		       </el-menu-item>
		      
		   </el-menu>
		   </div>
		   <div>  
			<HeaderPlatform/>
		   </div>
		    </div>
		  </el-scrollbar>
       <!--弹出层!-->
       <el-drawer v-model="drawer"  size="" direction="ltr" title="子菜单列表" :with-header="false" :destroy-on-close='true'>
		  <el-scrollbar height="calc(100vh - 80px)" >   
            <div v-show='submenu.isShow' v-for="submenu in submenus.list" :key="submenu.id">
                 <div class="item" v-for="subgroup in submenu.menugroup" :key="subgroup.id" style="margin-bottom:20px;">
                   <!--  <span class="font-extraSmall">{{subgroup.name}}</span> -->
					 <div v-for='sub in subgroup.namegroup' :key='sub.id'>
					 <a class="text" v-if="((sub.isout))" :href="sub.path" target="_blank">
						 {{sub.name}}
					 </a>	 
                     <router-link v-if="(!(sub.isout))" class="text"  active-class="active" :to="{
                          path:sub.path,
                          query:{
                              title:sub.name,
                              path:sub.path,
                          }
                      }">{{sub.name}}</router-link> 
                    </div>
                 </div>
           </div>
	      </el-scrollbar>
       </el-drawer>
    </div>
</template>

<script>
import {IconPark} from '@icon-park/vue-next/es/all';
import {Commodity,SalesReport,ShoppingBag,Home,Ship,Ad,Finance,HeadsetOne,Config,Workbench,Calculator,Cruise,HomeTwo} from '@icon-park/vue-next';
import { defineComponent,ref,reactive,watch,onMounted } from 'vue'
import {  useRoute } from 'vue-router'
import {menuApi} from '@/api/sys/admin/menuApi';
import {menuDataModel,submenulistModel,allMenuModel} from '@/model/sys/admin/menu';
 import HeaderPlatform from "../Header/HeaderPlatform";
import router from "@/router";
export default defineComponent({
        name: "AsideMenu",
        components:{
			Cruise, HeaderPlatform,
			HomeTwo, 
            Commodity,
            SalesReport,
			Calculator,
            ShoppingBag,
            Home,
            Ship,Ad,Finance,
            HeadsetOne,Config,Workbench,
            IconPark,menuApi,menuDataModel,submenulistModel
        },
    setup() {
		   let timer = ''
           let drawer = ref(false);
		   let activeIndex=ref();
		   let theme=ref("themeBlack");
           let menuData=reactive({list:menuDataModel});
           let submenus=reactive({list:submenulistModel});
        	   menuApi.getMenuALL(response=>{
  	      	     menuData.list=response.menuData;
  	      	     submenus.list=response.submenus;
  	          });
           //监听路由
           let route = useRoute();
	       watch(() =>route.path,()=>{
	            drawer.value = false
	        });
			function changeDrawer(menu){
				if(menu.path){
					  router.replace({name:menu.id});
				}else{
				      drawer.value=true;
				}
			}
        //方法
		if( localStorage.getItem("theme")){
			theme.value=localStorage.getItem("theme");
		}
		 function goHome(){
			 if(theme.value=="themeBlack"){
				  theme.value="themeLight";
				  localStorage.setItem("theme","themeLight");
			 }else{
				 theme.value="themeBlack";
			     localStorage.setItem("theme","themeBlack");
			 }
			 router.push({ 'path':'/home',
							 query: {
								title: "首页",
								path: "/home",
								name: 'Home',
								closable:false,
								replace:false
							 },
							 closable:false,
							 replace:false,
							 meta:{ keepAlive: true }
						   });
						   drawer.value = false
		 }
         function changeMenu(id,currentIndex){
            timer =setTimeout(()=>{
			 submenus.list.forEach(submenu => {
			            submenu.isShow = false
			       });
			         const index = submenus.list.findIndex((submenu)=>submenu.id === id)
			 				 if(index>=0){
			 					 const nowstaus = submenus.list[index].isShow
			 						  submenus.list[index].isShow = !nowstaus
			 				 }else{
			 					 drawer.value = false
			 				 }
			 				 //hover当前的激活状态
							 if(drawer.value == true){
								   activeIndex.value=currentIndex+'';
							 }
		 },250)   
       }
	   //离开
	  function laveMenu(){
		  clearInterval(timer)
	  }
	  //通过路由记住菜单激活状态
	  function getMenuactive(){
		  let arr = submenus.list.filter((submenu)=>{
		       return submenu.menugroup.filter((subgroup)=>{
		       return subgroup.namegroup.filter((sub)=>{
		  	   return sub.path == route.path 
		   }).length>0
		   }).length>0
		   })
		 if(arr.length>0){
			let menuindex  =  menuData.list.findIndex((item)=>item.id === arr[0].id)
			 activeIndex.value=menuindex+'';	
		 }
	  }
	  //刷新页面记住当前菜单激活状态
	  onMounted(()=>{
	    getMenuactive()
	  })
       //返回一个对象
       return {
		   getMenuactive,
		   laveMenu,
		   timer,
           changeMenu,
		   changeDrawer,
           menuData,
		   activeIndex,
           submenus,
           drawer,
		   goHome,
		   theme
    }
  },

})
 
</script>
<style>
.dark .el-drawer{
	 background-color: #363636 !important;
}
</style>
<style scoped>
.meun-hide{display:none;}
.themeBlack,.themeBlack  #menubar,.themeBlack .el-menu-vertical{
		background:#131921 !important;
	}
.themeBlack	 .el-menu-item:hover{
    background-color:  #37475a;
}	
.themeBlack .el-menu-item{
	color:#dedede !important;
	opacity: 0.8;
}
.themeBlack	.el-menu-item.is-active{
	 background-color: #07090c;
	 color:#ff6700 !important;
}
.themeBlack	 .text{
      text-decoration:none;
	  color:#fff;
	  font-size:14px;
	  padding:8px 16px;
	  border-radius: 4px;
	  cursor: pointer;
	  transition: background-color var(--el-text-color-primary),color var(--el-text-color-primary);
	  color: var(--el-text-color-primary);
      display:flex;
  }
.themeBlack	 .text:hover{
     background-color:var(--el-bg-color);
	}
.themeBlack	 .item .active{
		 background-color:var(--el-color-primary-light-9);
		 color: var(--el-color-primary);
	}

/* ---------------------白色主题-------------------------------*/
.themeLight,.themeLight .el-menu{
	    background: var(--el-bg-color);
}
 
.themeLight	 .el-menu-item:hover{
    background-color: var(--el-border-color-light);
}	
.themeLight	.el-menu-item.is-active{
	 background-color: var(--el-border-color-light);
}

.el-menu-vertical{
	 padding-top:16px;
}
.themeLight	 .text{
      text-decoration:none;
	  color:var(--el-text-color-primary);
	  font-size:14px;
	  padding:8px 16px;
	  border-radius: 4px;
	  cursor: pointer;
	  transition: background-color var(--el-transition-duration),color var(--el-transition-duration);
      display:flex;
  }
.themeLight	 .text:hover{
     background-color: var(--el-bg-color);
	}
.themeLight	 .item .active{
         color:var(--el-color-primary);
		 background-color: var(--el-color-primary-light-9);
	}
/*-----------------dark主题------------------------*/
.dark .themeBlack,.dark .themeBlack  #menubar,.dark .themeBlack .el-menu-vertical,
.dark .themeLight,.dark .themeLight  #menubar,.dark .themeLight .el-menu-vertical
{
		background:#000000 !important;
}
.dark .themeBlack .el-menu-item:hover,.dark .themeLight .el-menu-item:hover{
    background-color:  #000000;
}	
.dark .themeBlack .el-menu-item,.dark .themeLight .el-menu-item{
	color:#dedede !important;
	opacity: 0.8;
}
.dark .themeBlack	.el-menu-item.is-active,.dark .themeLight .el-menu-item.is-active{
	 background-color: #000000;
	 color:#ff6700 !important;
}

.dark .themeBlack .text,.dark .themeLight .text{
      text-decoration:none;
	  color:#fff;
	  font-size:14px;
	  padding:8px 16px;
	  border-radius: 4px;
	  cursor: pointer;
	  transition: background-color var(--el-text-color-primary),color var(--el-text-color-primary);
	  color: var(--el-text-color-primary);
      display:flex;
  }
.dark .themeBlack .text:hover,.dark .themeLight	.text:hover{
     background-color:var(--el-bg-color);
	}
.dark .themeBlack	 .item .active,.dark .themeLight	 .item .active{
		 background-color:#272727;
		 color: var(--el-color-primary);
	}
#menubar{
width:64px;
}
#menubar {
	z-index:1999;
}
.el-menu{
	border-right: 0;
}
.el-menu-item{
    flex-direction: column;
    justify-content: center;
	
}
.el-menu-item .i-icon{
  margin-bottom:2px;
}
.el-menu-item span{
    line-height:16px;
}
.el-menu-item{
    height:64px;
}
.el-menu-item .i-icon{
    display:  none;
}

.el-menu-item {
     height: 30px;
 }
 .el-menu-item.is-active {
     color: var(--el-menu-active-color);
	 font-weight: 700;
 }
@media(min-height:300px) {
 .el-menu-item {
      height: 24px;
 	  font-size:12px;
  }
 }
@media(min-height:500px) {
 .el-menu-item {
      height: 30px;
	  font-size:12px;
  }
 }
 @media(min-height:600px) {
 .el-menu-item .i-icon{
     display:inherit;
 }
 .el-menu-item {
      height: 48px;
 	  font-size:12px;
  }
 }
 @media(min-height:700px) {
 .el-menu-item .i-icon{
     display:inherit;
 }
 .el-menu-item {
      height: 53px;
	  font-size:12px;
  }
 }
 @media(min-height:800px) {
 .el-menu-item .i-icon{
     display:inherit;
 }
 .el-menu-item {
      height: 60px;
	  font-size:14px;
  }
 }
@media(min-height:900px) {
.el-menu-item .i-icon{
	display:inherit;
}

 .el-menu-item {
      height:65px;
	  font-size:14px;
  }
 }


/*过渡动画*/

.logo{
	display: flex;
	justify-content: center;
	align-items: center;
}

.logo .el-image{
	height:28px;
	width: 28px;
	margin-top:16px;
}
.aside-flex {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-right: solid 1px #e6e6e6;
}
.dark .aside-flex {
 	border-right: solid 1px #3e3e3e;
 }
      
</style>
<style>
	.themeBlack .el-button--primary.is-plain{
		--el-button-border-color:#37475a;
		--el-button-bg-color: #1f2936;
		color: #fff;
	}
</style>