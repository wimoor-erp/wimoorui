<template>
    <div id="menubar">
        <el-menu style="min-height: calc(100vh - 56px);"
                :default-active="activeIndex"
                class="el-menu-vertical"
                :default-openeds="[1]">
              <!--主菜单-->  
            <el-menu-item  @mouseleave="laveMenu"   @mouseenter="changeMenu(item.id,index)" @click="changeDrawer(item)" v-for="(item,index) in menuData.list" :key="item.id" :index='index+""' >
                <icon-park :type="item.iconName" theme="outline" size="20" :strokeWidth="3"/>
                <span>{{item.name}}</span>
            </el-menu-item>
           
        </el-menu>
       <!--弹出层!-->
	   
       <el-drawer v-model="drawer"  size="" direction="ltr" title="I am the title" :with-header="false" destroy-on-close='true'>
		  <el-scrollbar height="calc(100vh - 80px)" >   
            <div v-show='submenu.isShow' v-for="submenu in submenus.list" :key="submenu.id">
                 <div class="item" v-for="subgroup in submenu.menugroup" :key="subgroup.id" style="margin-bottom:20px;">
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
import {Commodity,SalesReport,ShoppingBag,Home,Ship,Ad,Finance,HeadsetOne,Config,Workbench,Calculator} from '@icon-park/vue-next';
import { defineComponent,ref,reactive,watch,onMounted } from 'vue'
import {  useRoute } from 'vue-router'
import {menuApi} from '@/api/sys/admin/menuApi';
import {menuDataModel,submenulistModel,allMenuModel} from '@/model/sys/admin/menu';
import router from "@/router";
export default defineComponent({
        name: "AsideMenu",
        components:{
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
								   activeIndex.value=currentIndex;
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
			 activeIndex.value=menuindex;	
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
    }
  },

})
 
</script>

<style scoped>
.meun-hide{display:none;}
 .text{
      text-decoration:none;
	  color:var(--el-text-color-primary);
	  font-size:14px;
	  padding:8px 16px;
	  border-radius: 2px;
	  cursor: pointer;
	  transition: background-color var(--el-transition-duration),color var(--el-transition-duration);
      display:flex;
  }
    .text:hover{
     background-color: var(--el-bg-color);
	}
 .item .active{
         color:var(--el-color-primary);
	}
#menubar{
width:64px;
background:var( --el-bg-color);
}
.el-menu{
    background-color: var(--el-bg-color);
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
.el-menu-item:hover{
    background-color: var(--el-border-color-light);
}
.el-menu-vertical{
    padding-top:16px;
}

.el-menu-item.is-active{
     background-color: var(--el-border-color-light);
}
/*过渡动画*/
</style>