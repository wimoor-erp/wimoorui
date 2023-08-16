<template>
	<div class="con-body">
		<el-table ref="tableRef"
					  :data="tableData.records" 
					  height="calc(100vh - 180px)" 
					  v-loading="loading" 
					  border style="width: 100%;margin-bottom:16px;">
		        <el-table-column type="selection" width="55" align="center" />
				<el-table-column  prop="name" label="名称" show-overflow-tooltip>
				    <template #default="scope">
				           <div>{{scope.row.name}}</div>  
					       <div>
							   <el-space>
							   <div><span class="font-extraSmall">状态:</span>{{scope.row.state}}</div>
							   <div><span class="font-extraSmall">预算:</span>{{scope.row.budget}} {{scope.row.budgettype}}</div>
						       </el-space>
						   </div>
						
				   </template>
				   </el-table-column>
		 	    <el-table-column   label="日期" width="120">
		 	     <template #default="scope">
				    <div><span class="font-extraSmall">开始:</span>{{dateFormat(scope.row.startdate)}}</div>
					<div><span class="font-extraSmall">结束:</span>{{dateFormat(scope.row.enddate)}}</div>
		 	   </template>
		 	   </el-table-column>
			   <el-table-column   label="创意" width="140" show-overflow-tooltip>
			     <template #default="scope">
					 <div v-if="scope.row.creative">
					 		 <span class="font-extraSmall">创意:</span>
							 <span v-for="asin,index in scope.row.creative.asins">
							   <span v-if="index>0">,</span>{{asin}}
							 </span>
					 </div>
			   					<div v-if="scope.row.landingPage"><span class="font-extraSmall">页面:</span>{{scope.row.landingPage.pageType}}</div>
			   </template>
			   </el-table-column>
			    <el-table-column prop="impressions" label="表现信息" width="493" >
				<template #default="scope">
					<el-space>
							 <div class="row-cell">
								 <div><span class="font-extraSmall">展示:</span>{{scope.row.impressions}}</div>
								 <div><span class="font-extraSmall">CTR:</span>{{formatPercent(scope.row.CTR)}}%</div>
							 </div>
							 <div class="row-cell">
								 <div><span class="font-extraSmall">点击:</span>{{scope.row.clicks}}</div>
								 <div><span class="font-extraSmall">ACOS:</span>
								 <span v-if="scope.row.ACOS==10000000000">--</span>
								 <span v-else>{{formatPercent(scope.row.ACOS)}}%</span></div>
							 </div>
							 <div class="row-cell">
								  <div><span class="font-extraSmall">花费:</span>{{scope.row.cost}}</div>
								  <div><span class="font-extraSmall">CPC:</span>{{formatFloat(scope.row.avgcost)}}</div>
							 </div>
							 <div class="row-cell">
							 		<div><span class="font-extraSmall">订单:</span>{{scope.row.attributedConversions}}</div>
							 		<div><span class="font-extraSmall">CR:</span>{{formatFloat(scope.row.CSRT)}}</div>
							 </div>
							 <div class="row-cell">
							 		<div><span class="font-extraSmall">销量:</span>{{scope.row.sumUnits}}</div>
							 		<div><span class="font-extraSmall">销售额:</span>{{formatFloat(scope.row.attributedSales)}}</div>
							 </div>
							   </el-space>
				   </template>
				   </el-table-column>
		 	   <el-table-column prop="videoFirstQuartileViews" label="播放次数"   width="305">
			   <template #default="scope">
				   <el-space>
					   <div class="row-cell">
						    <div><span class="font-extraSmall">进度1/4:</span>{{scope.row.videoFirstQuartileViews}}</div>
					   		<div><span class="font-extraSmall">无声:</span>{{scope.row.videoUnmutes}}</div>
					   </div>
					   <div class="row-cell">
					       <div><span class="font-extraSmall">进度2/4:</span>{{scope.row.videoMidpointViews}}</div>
						   <div><span class="font-extraSmall">5秒:</span>{{scope.row.video5SecondViews}}</div>
					   </div>
					   <div class="row-cell">
						   
						   <div><span class="font-extraSmall">进度3/4:</span>{{scope.row.videoThirdQuartileViews}}</div>
					       <div><span class="font-extraSmall">完成:</span>{{scope.row.videoCompleteViews}}</div>
					   </div>
				   </el-space>
			   </template>
			   </el-table-column>
		 </el-table>
		  <el-button-group>
		     <el-button type="primary" @click="previousPage" :icon="ArrowLeft" :disabled="queryParam.currentpage==0">上一页</el-button>
		     <el-button type="primary" @click="nextPage" :disabled="tableData.records.length==0">
		       下一页<el-icon class="el-icon--right"><ArrowRight /></el-icon>
		     </el-button>
		   </el-button-group>

		 </div>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,ArrowLeft,ArrowRight,} from '@element-plus/icons-vue'
	import { ElDivider } from 'element-plus'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Header from  "./header.vue";
	import {dateFormat,dateTimesFormat,formatPercent,formatFloat} from '@/utils/index.js';
	import campaignsApi from "@/api/amazon/advertisement/sb/campaignsApi.js"
	const tableRef=ref();
	let state=reactive({type:"campaigns",tableData:{records:[],total:0},queryParam:{currentpage:0},loading:false});
	let {type,tableData,queryParam,loading} =toRefs(state);
	function handleQuery(){
		state.loading=true;
		campaignsApi.getCampaignList(state.queryParam).then(res=>{
			if(res.data){
				res.data.forEach(item=>{
					if(item.creative){
						item.creative= JSON.parse(item.creative);
					}
					if(item.landingPage){
						item.landingPage= JSON.parse(item.landingPage);
					}
				})
			}
			state.loading=false;
			state.tableData.records=res.data;
			state.tableData.total=1000;
		}).catch(error=>{
			state.loading=false;
		})
	}
	function previousPage(){
		state.queryParam.currentpage=state.queryParam.currentpage-1;
		handleQuery();
	}
	function nextPage(){
		state.queryParam.currentpage=state.queryParam.currentpage+1;
		handleQuery();
	}
	function show(queryParams){
		 state.queryParam=queryParams;
		 state.queryParam.currentpage=0;
		 state.queryParam.pagesize=10;
		 handleQuery();
	}
	 defineExpose({ show })
</script>

<style scoped="scoped">
	.row-cell{
		width:85px;
	}
</style>
