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
	        <el-main>
				  <router-view v-slot="{ Component }" style="flex: 1;height:100%" >
				      <keep-alive ref="keepAlive"  >
				        <component :is="Component"
				                    v-if="$route.meta.keepAlive"
				                   :key="$route.query.title" />
				      </keep-alive>
				      <component :is="Component"   v-if="!$route.meta.keepAlive" />
				  </router-view>
			</el-main>
	      </el-container>
	    </el-container>
</template>
<script>

/* import HeaderNavbtn from "./components/Header/HeaderNavbtn"; */

 import HeaderTab from "./components/Header/HeaderTab";
 import HeaderAvatar from "./components/Header/HeaderAvatar";
 import AsideMenu from "./components/Aside/AsideMenu";
  export default {
        name: "Index",
        components:{
            
          /*  HeaderNavbtn, */
            HeaderTab,
            HeaderAvatar,
            AsideMenu
        },
		
		methods:{
			clearCache(activeName){
				  this.$refs.keepAlive.$pruneCacheEntry(activeName);
				  this.$router.replace({ 'path':"/blank",
				 				         'query':{"refresh":new Date(),"title":"blank"},
				 					    });
				var self=this;
				setTimeout(function(){
					 self.$refs.headerTab.showTab(activeName);
				},500)
			},
			changeSKin(){
				this.$refs.leftMenu.goHome()
				
			}
		},
		
    }
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
</style>