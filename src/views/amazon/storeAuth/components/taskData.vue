<template>
	<el-dialog
	title="报表任务抓取详情"
	v-model="visible"
	width="70%"
	>
	<el-tabs
	   v-model="activeName"
	   class="markets-tabs-dialog"
	   @tab-change="handleClick"
	   
	 >
	  <el-tab-pane  v-for = "(item,index) in groupData.countrysList" :label="item.countryname" :name="item.marketplaceid"  >
		  
	  </el-tab-pane>
	 </el-tabs>
	 <el-table :data="tableData">
		 <el-table-column prop="cname" label="报表名称">
			 <template #default="scope">
			 	  {{scope.row.cname}}
			 </template>
		 </el-table-column>
		 <el-table-column   label="报表申请状态" prop="report_processing_status" >
			<template #default="scope">
				  <el-tag v-if="scope.row.report_processing_status=='success'" type="success">成功</el-tag>
				  <el-tag v-if="scope.row.report_processing_status=='FATAL'" type="warning">创建失败</el-tag>
				  <el-tag v-if="scope.row.report_processing_status=='CANCELLED'" type="warning">取消</el-tag>
				  <el-tag v-if="scope.row.report_processing_status=='error'" type="danger">失败</el-tag>
			</template>	
		 </el-table-column>
		 <el-table-column   label="报表最后更新时间" prop="lastupdate" >
					<template #default="scope">
		 			 	  {{dateTimesFormat(scope.row.lastupdate)}}
		 			 </template>
		 </el-table-column>
	 </el-table>
	 
	<template #footer>
		<el-button @click="visible=false">关闭</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,computed} from 'vue'
	import {Search,ArrowDownBold,Download,Upload,InfoFilled} from '@element-plus/icons-vue';
    import '@/assets/css/packbox_table.css';
	import {dateFormat,dateTimesFormat,formatFloat} from '@/utils/index';
	import groupApi from '@/api/amazon/group/groupApi.js';
	const  state=reactive({
		isload:true,
		tableData: []  ,
		queryParams:{},
		visible:false,
		groupData:{},
		activeName:null,
	})
	const{
		isload,
		tableData,
		queryParams,
		visible,
		groupData,
		activeName,
	}=toRefs(state)
	
	 
	 
	 function handleQuery(){
	 	 groupApi.selectTaskInfoList(state.queryParams).then(res=>{
			 if(res.data){
				 state.tableData=res.data;
			 }else{
				 state.tableData=[];
			 }
	 	 })
	 }
	 function handleClick(val){
		 state.queryParams.marketplaceid=val;
		 handleQuery();
	 }
	function show(data){
		state.visible=true;
		if(data && data.countrysList && data.countrysList.length>0){
			state.groupData=data;
			state.activeName=data.countrysList[0].marketplaceid;
			state.queryParams.sellerid=data.sellerid;
			state.queryParams.marketplaceid=data.countrysList[0].marketplaceid;
			handleQuery();
		}
	}
	 defineExpose({ show })
	 
</script>

<style scoped >
	 
</style>