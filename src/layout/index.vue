<template>
	  <el-container>
	      <el-aside>
			  <AsideMenu  ref="leftMenu"/>
			  </el-aside>
	      <el-container>
	        <el-header>
				<div class="top-nav">
				<!-- <HeaderNavbtn/> -->
				<HeaderTab ref="headerTab" @clear="clearCache"/>
				<HeaderAvatar  @changeSKin="changeSKin"/>
				</div>
			</el-header>
	        <el-main  style="flex: 1;height:100%">
				  <router-view v-slot="{ Component }" >
				      <keep-alive ref="keepAlive"  >
				        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.query.title" />
				      </keep-alive>
				      <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.query.title"/>
				  </router-view>
				   <el-backtop :right="50" :bottom="50" />
			</el-main>
	      </el-container>
	    </el-container>
</template>
<script setup>

/* import HeaderNavbtn from "./components/Header/HeaderNavbtn"; */
 import { ref,reactive,onMounted ,inject,getCurrentInstance} from 'vue'
 import HeaderTab from "./components/Header/HeaderTab";
 import HeaderAvatar from "./components/Header/HeaderAvatar";
 import AsideMenu from "./components/Aside/AsideMenu";
 import { useRoute,useRouter } from 'vue-router'
 const emitter = inject("emitter"); // Inject `emitter`
 const headerTab=ref(HeaderTab);
 const keepAlive=ref();
 const leftMenu=ref();
 let router = useRouter();
 
function clearCache(activeName){
			  removeCache(activeName);
			 router.replace({ 'path':"/blank",
									 'query':{"refresh":new Date(),"title":"blank"},
							});
			  setTimeout(function(){
				  headerTab.value.showTab(activeName);
			  },500)
		}
	
function removeCache(activeName){
		  keepAlive.value.$pruneCacheEntry(activeName);
	}
			
function changeSKin(){
				 leftMenu.value.goHome()
				
			}
	  
emitter.on("removeCache", (value) => { // 监听事件
   removeCache(value);
});

 
</script>
<style>
.el-header{height:34px!important;
}
.el-aside{width:64px!important;
}
.el-main{padding:0px!important;min-width:1280px}
#menubar{
    position: fixed;
    left: 0;
    z-index: 999;
}
#menubar .el-overlay{
   left:64px!important;
}
#menubar .el-drawer{
    min-width:176px;
}
.top-nav{
    position: fixed;
    top: 0px;
    right: 0px;
	left: 64px;
    z-index:998;
	padding:0px 24px;
}
.top-nav{
    display: flex;
    background-color:#fff;  
    align-items: center;
    box-shadow: 0px 1px 6px rgba(0,0,0,0.1);
}
.dark .top-nav{
    display: flex;
    background-color:#313131 ;  
    align-items: center;
    box-shadow: 0px 1px 6px rgba(0,0,0,0.1);
}
.el-backtop{
	color:#fff;
	background-color:rgb(0 0 0 / 62%);
}
.el-backtop:hover{
	background-color:rgb(0 0 0 / 80%);
}
</style>