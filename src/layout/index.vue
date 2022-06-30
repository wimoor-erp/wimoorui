<template>
<el-container>
<el-header>
 <div class="top-nav">
 <HeaderNavbtn/>
 <HeaderLogo/>
 <HeaderTab/>
 <HeaderAvatar/>
 </div>
</el-header>
<el-container >
 <el-aside>
        <AsideMenu/>
 </el-aside>
 <el-main>
       <router-view style="flex: 1;height:100%" />
 </el-main>
  </el-container>
 </el-container>
</template>
<script>

 import HeaderNavbtn from "./components/Header/HeaderNavbtn";
 import HeaderLogo from "./components/Header/HeaderLogo";
 import HeaderTab from "./components/Header/HeaderTab";
 import HeaderAvatar from "./components/Header/HeaderAvatar";
 import AsideMenu from "./components/Aside/AsideMenu";
  export default {
        name: "Index",
        components:{
            
            HeaderNavbtn,
            HeaderLogo,
            HeaderTab,
            HeaderAvatar,
            AsideMenu
        }
    }
</script>
<style>
.el-header{height:56px!important;}
.el-aside{width:64px!important;
}
.el-main{padding:0px!important;min-width:1280px}
#menubar{
    position: fixed;
    top: 56px;
    left: 0;
    z-index: 2;
}
#menubar .el-overlay{
   top:56px!important;
   left:64px!important;
}
#menubar .el-drawer{
    min-width:176px;
}
.top-nav{
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    z-index: 2006;
}
.top-nav{
    
    display: flex;
    background-color:#fff;
    align-items: center;
    box-shadow: 0px 1px 8px rgba(0,0,0,0.1);
}
</style>