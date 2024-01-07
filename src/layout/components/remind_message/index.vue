<template>
	  <el-badge :value="number"  :max="100" class="item"  @click="handleMessage" >
	    <remind theme="outline" style="padding-top:3px;" class="pointer" size="16" />
	  </el-badge>
	 
	<el-drawer  v-model="drawer" class="remindmessage" custom-class="remindmessage">
	   <template #header="{ close, titleId, titleClass }">
			 <el-tabs :id="titleId" :class="titleClass" v-model="activeName" class="demo-tabs" @tab-change="handleQuery">
			    <el-tab-pane label="系统消息" name="sys">
					<template #label>
					        <span class="custom-tabs-label">
					          <span>系统消息</span>
					        </span>
					      </template>
				</el-tab-pane>
			    <el-tab-pane label="我的提醒" name="nti">
					<template #label>
					        <span class="custom-tabs-label">
					          <span>我的提醒</span>
					        </span>
					      </template>
				</el-tab-pane>
			    <el-tab-pane label="我的私信" name="mes">
					<template #label>
					        <span class="custom-tabs-label">
					          <span>我的私信</span>
					        </span>
					      </template>
				</el-tab-pane>
				<el-tab-pane label="全部已读" name="dis" :disabled="true">
					<template #label>
					        <span class="font-extraSmall pointer" @click="handleRead">
					          <span>全部已读</span>
							    <el-icon style="padding-top:2px;padding-left:8px" >
									     <message-success  class="font-extraSmall" theme="outline" size="24" fill="#333"/>
								</el-icon>
					        </span>
					      </template>
				</el-tab-pane>
			  </el-tabs>
	          <el-icon   @click="close"><CircleCloseFilled /></el-icon>
	      </template>
	    <GlobalTable :inDialog="true" height="calc(100vh - 140px)" ref="globalTableRef" :tableData="tableData"   @loadTable="loadTableData" 
	     :defaultSort="{ prop: 'createdAt', order: 'descending' }"  
		 :showHeader="false"
		 :stripe="true"
	     rowKey="id"
	     >
	    <template #field>
			<el-table-column label="title"  prop="title" >
					 <template #default="scope">
						  <h3 v-html="scope.row.title"></h3>
						  <div class="font-extraSmall message-content">{{scope.row.createdAt}}
						  <span style="padding-left:20px;" v-if="scope.row.isRead">已读</span>
						  <span style="padding-left:20px;" v-else>未读</span>
						  </div>
						  <div class="message-body message-content" v-html="scope.row.content"></div>
				     </template>
			</el-table-column>
		</template>
		</GlobalTable>
	  </el-drawer>
	  
	 <el-dialog
	    v-model="visible"
	    title="提醒"
	    width="50%"
		top="6vh"
		class="skusearchdialog"
		:destroy-on-close='true' 
	  >
	   <el-table :show-header="false" :data="listNotify" height="calc(100vh - 450px)">
		   <el-table-column label="title"  prop="title" >
		   		 <template #default="scope">
		   			  <h3 v-html="scope.row.title"></h3>
		   			  <div class="font-extraSmall message-content">{{dateTimesFormat(scope.row.createdat)}}
					  <span style="padding-left:20px;" v-if="scope.row.isRead">已读</span>
					  <span style="padding-left:20px;" v-else>未读</span>
					  </div>
		   			  <div class="message-body message-content" v-html="scope.row.content"></div>
		   	     </template>
		   </el-table-column>
	   </el-table>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button type="primary" @click="visible = false">关闭</el-button>
	      </span>
	    </template>
	  </el-dialog> 
</template>

<script setup>
	import {Remind,MessageUnread,MessageSuccess} from '@icon-park/vue-next';
	import {ref,reactive,onMounted,watch,inject,toRefs,nextTick} from 'vue';
	import { ElMessage } from 'element-plus';
	import notify from "@/api/sys/admin/notify.js";
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	const globalTableRef=ref();
	const state = reactive({
		drawer:false,
		visible:false,
		activeName:"sys",
		typenoread:{sys:false,nti:false,mes:false},
		userinfo:{},
		queryParams:{},
		listNotify:[],
		number:0,
		tableData:{records:[],total:0},
	})
	const {
		drawer,activeName,tableData,queryParams,number,typenoread,visible,listNotify
	}=toRefs(state)
	function loadMessage(){
		notify.findNoReadByUserAll().then(res=>{
			if(res&&res.data&&res.data.length>0){
				var needshow=false;
				console.log(res.data);
				res.data.forEach(item=>{
					if(item.action=="timely"){
						needshow=true;
					}
				})
				console.log(needshow);
				if(needshow){
					state.visible=true;
					 nextTick(()=>{
					     state.listNotify=res.data;
					 })
				}
			}
		})
	}
	function show(userinfo){
		state.userinfo=userinfo;
		notify.pullMessage().then(res=>{
			loadMessage();
		});
        setInterval(function(){
			loadMessage();
		},100000);
		notify.findNitofyNums().then(res=>{
			var num=0;
			res.data.forEach(item=>{
				if(item.ftype==2){
					num=item.nums;
				}
			});
			state.number=parseInt(num);
		}) 
	}
	function handleRead(){
		notify.updateAllTargets().then(res=>{
			 ElMessage.success('提交成功!');
		})
	}
	function loadTableData(param){
		   if(state.activeName=="sys"){
			   notify.getAnnounce(param).then(res=>{
					state.tableData.records=res.data.records;
					state.tableData.total=res.data.total;
			   })
		   }
		   else if(state.activeName=="nti"){
			   notify.getRemind(param).then(res=>{
					 state.tableData.records=res.data.records;
					 state.tableData.total=res.data.total;
			   })
		   }
		  else if(state.activeName=="mes"){
			 notify.getMessage(param).then(res=>{
					state.tableData.records=res.data.records;
					state.tableData.total=res.data.total;
			 }) 
		  }
	}
	function handleQuery(){
		globalTableRef.value.loadTable(state.queryParams);
	}
	function handleMessage(){
		state.drawer=true;
		var timer=setTimeout(function(){
					handleQuery();
		},300)
	}
	defineExpose({show});
</script>
<style>
	.remindmessage .el-tabs__header {
		margin: 0 0 1px !important;
	}
	.remindmessage .el-drawer__header{
		margin-bottom:10px !important;
	}
	.remindmessage .el-drawer__body{
		padding-top:0px !important;
	}

   .message .el-badge__content{
    position: absolute;
    top: 9px !important;
    right: calc(7px + var(--el-badge-size)/ 2) !important;
    transform: translateY(-50%) translateX(100%);
}
	.skusearchdialog .el-dialog__body{
		padding:0 0 10px 0;
	}
</style>
<style scoped>

	.skusearchdialog {
			 margin: var(--el-dialog-margin-top,15vh) auto 10px !important;
	}
.remindmessage .el-tabs {
   --el-tabs-header-height: 1px !important;
}
.message-content{
	padding-left:10px;
	padding-right:10px;
}
.message-body{
	color:var(--el-text-color-regular);
}
.dark .message-body{
	color:var(--el-text-color-regular);
}
.item{

}

.remindmessage .el-drawer__header{
	padding-top:5px !important;
}
</style>