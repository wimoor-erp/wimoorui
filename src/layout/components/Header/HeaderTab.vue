<template>
   <div class="tab-head"  style="width:600px;">
	 <el-tabs v-model="editableTabsValue" type="card" tab-position="bottom" @tab-click="pushShow"    @tab-remove="removeTab" >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
	<template #label> 
		<span>{{item.title}}</span>
		<el-dropdown trigger="click" class="closeTab">
		        <span >
		         <el-icon><arrow-down /></el-icon>
		        </span>
		        <template #dropdown>
		          <el-dropdown-menu>
		            <el-dropdown-item @click="closeOther()">关闭其他页签</el-dropdown-item>
		            <el-dropdown-item @click="closeRight()">关闭右边</el-dropdown-item>
		            <el-dropdown-item @click="closeLeft()">关闭左边</el-dropdown-item>
		          </el-dropdown-menu>
		        </template>
		      </el-dropdown>
	</template>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
import { useRoute,useRouter } from 'vue-router'
import { defineComponent,ref,reactive,watch,onMounted,inject } from 'vue'
import {ArrowDown,} from '@element-plus/icons-vue'
export default defineComponent({
	components:{ArrowDown},
     setup(){
         let editableTabsValue =ref('/home')
         let editableTabs =ref([
             {
                 title: '首页',
                 name: '/home',
				 path: '/home',
                 closable:false,
				 meta:{ keepAlive: true }
             },
         ])
         let route = useRoute()
         let router = useRouter()
         router.afterEach((to,from)=>{
             //如果to.path该页签存在于当前数组中---就执行激活当前页签---否则就新增加页签
             let newarr =[]
			 let oldname=editableTabsValue.value;
             editableTabs.value.forEach((item)=>{
                 newarr.push(item.name)
             })
			 let replace=false;
			 if(route.query.replace){
			 	  replace=route.query.replace;
			 }
            if(newarr.indexOf(to.path)>-1){
                editableTabsValue.value =to.path;
				let tab=route.query;
				tab.title=route.query.title;
				tab.name=route.query.path;
				tab.closable=true;
				tab.meta=route.meta;
				var tabquery=editableTabs.value[newarr.indexOf(to.path)] ;
				editableTabs.value[newarr.indexOf(to.path)]=Object.assign(tabquery, tab);
            }else{
                addTab()
            }
			if(replace&&oldname!="/home"){
				 removeTab(oldname);
			}
         })
		 onMounted(()=>{
			 if(route.query.title){
				 addTab()
			 }
		 })
		 
		 function closeOther(){
			 closeRight();
			 closeLeft();
		 }
		 function closeRight(){
			 let tabs = editableTabs.value
			 let activeName = editableTabsValue.value
			 let activeIndex=0;
			     tabs.forEach((tab, index)=>{
			         if (tab.name === activeName) {
			              activeIndex=index;
			         }
			     });
			  if(activeIndex+1<tabs.length){
				  editableTabs.value =tabs.slice(0,activeIndex+1);
			  }
			  
		 }
		 function closeLeft(){
			 let tabs = editableTabs.value
			 let activeName = editableTabsValue.value
			 let activeIndex=0;
			     tabs.forEach((tab, index)=>{
			         if (tab.name === activeName) {
			              activeIndex=index;
			         }
			     });
			  if(activeIndex>1){
				   let mytabs=[tabs[0]];
				   tabs.slice(activeIndex,tabs.length).forEach((item)=>{
					   mytabs.push(item);
				   })
			 	   editableTabs.value =mytabs; 
			  }
		 }
         function pushShow(target) {
			 showTab(target.props.name)
         }
		 
		 const emitter = inject("emitter"); // Inject `emitter`
		 emitter.on("removeTab", (value) => { // 监听事件
		    removeTab(editableTabsValue.value);
		 });
		 function showTab(activeName){
			 let tabs = editableTabs.value;
			 let query=null;
			 if(tabs){
				 query=tabs[0];
			 }
			 tabs.forEach((tab, index)=>{
			     if (tab.name === activeName) {
			          query=tab;
			     }
			 });
			 let meta=query.meta;
			 query.meta="";
			 router.push({
						 //删除自己时路由切换到隔壁
						'path':query.path,
						'query':query,
						'meta':meta,
					 })
		 }
         function addTab(){
			 let tab=route.query;
			 if(route.query.path=="/home"){
				 return;
			 }
			 tab.title=route.query.title;
			 tab.name=route.query.path;
			 tab.closable=true;
			 tab.meta=route.meta;
             editableTabs.value.push(tab)
             editableTabsValue.value = route.query.path;
         }
         function removeTab(targetName){
             let tabs = editableTabs.value
             let activeName = editableTabsValue.value
             if(activeName === targetName){
                 tabs.forEach((tab, index)=>{
                     if (tab.name === targetName) {
                         const nextTab = tabs[index + 1] || tabs[index - 1]
                         if (nextTab) {
                             activeName = nextTab.name
                         }
                     }
                 });
				editableTabsValue.value = activeName
				showTab(activeName);
				editableTabs.value =tabs.filter((tab) => tab.name !== targetName)
             }else{
				editableTabsValue.value = activeName;
				editableTabs.value =tabs.filter((tab) => tab.name !== targetName)
			 }
         }
         return{
             pushShow,
             removeTab,
             editableTabsValue,
             editableTabs,
			 closeOther,closeLeft,closeRight
         }
     },
})
</script>
 <style >
 .tab-head{
	 flex-grow: 1
 }
  .tab-head .el-tabs{
	 --el-tabs-header-height: inherit;
 }
 .tab-head .el-tabs__item.is-active{
	 background:var(--el-bg-color);
	 border-bottom: 1px solid var(--el-bg-color)!important;
 }
  .tab-head .el-tabs--bottom .el-tabs__header.is-bottom{
	   margin-top:4px!important;
   }
 .tab-head .el-tabs__item{
	border-bottom: 1px solid #fff!important;
	height:28px !important;
	line-height:28px !important;
	font-size: 12px;
   }
 .tab-head .el-tabs--card>.el-tabs__header{
     border-bottom: 0px  !important;
   }
 .tab-head .el-tabs__item{
	   display: flex;
	   align-items: center;
   }
   .tab-head  .el-tabs__nav{
	     display: flex;
   } 
   .closeTab{
	   opacity: 0;
	  width:0;
	   height:0;
	   
   }
 .el-tabs__item:hover .closeTab{
   	   opacity:1;
   	   width:14px;
   	   height:14px;
	   margin-left:8px;
	   color: #FF6700;
   }
</style>
