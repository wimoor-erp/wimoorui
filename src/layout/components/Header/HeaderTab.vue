<template>
   <div style="flex-grow: 1;">
	 <el-tabs v-model="editableTabsValue" type="card" tab-position="bottom" @tab-click="pushShow"    @tab-remove="removeTab"  style="margin-left:32px;">
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
import { useRoute,useRouter } from 'vue-router'
import { defineComponent,ref,reactive,watch,onMounted } from 'vue'
export default defineComponent({
     setup(){
         let editableTabsValue =ref('/home')
         let editableTabs =ref([
             {
                 title: '首页',
                 name: '/home',
                 closable:false
             },
         ])
         let route = useRoute()
         let router = useRouter()
         router.afterEach((to,from)=>{
             //如果to.path该页签存在于当前数组中---就执行激活当前页签---否则就新增加页签
             let newarr =[]
             editableTabs.value.forEach((item)=>{
                 newarr.push(item.name)
             })
            if(newarr.indexOf(to.path)>-1){
                editableTabsValue.value =to.path
            }else{
                addTab()
            }
         })
         function pushShow(target) {
             router.push({
                 path:target.props.name,
             })
         }
         function addTab(){
             editableTabs.value.push({
                 title:route.query.title,
                 name:route.query.path,
                 closable:true
             })
             editableTabsValue.value = route.query.path
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
                 })
                 router.push({
                     //删除自己时路由切换到隔壁
                    path:activeName,
                 })
             }

             editableTabsValue.value = activeName
             editableTabs.value =tabs.filter((tab) => tab.name !== targetName)


         }
         return{
             pushShow,
             removeTab,
             editableTabsValue,
             editableTabs
         }
     },
})
</script>
 <style>
 .el-tabs__item.is-active{
	 background:var(--el-bg-color);
	 border-bottom: 1px solid var(--el-bg-color)!important;
 }
   .el-tabs--bottom .el-tabs__header.is-bottom{
	   margin-top: 22px!important;
   }
     .el-tabs__item{
	border-bottom: 1px solid #fff!important;
	height:32px !important;
	line-height:32px !important;
   }
   .el-tabs--card>.el-tabs__header{
     border-bottom: 0px  !important;
   }
</style>
