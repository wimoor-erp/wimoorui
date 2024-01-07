<template>
	<div class="main-sty">
		<el-card class="box-card">
		    <template #header>
		      <div class="card-header">
		        <span>广告报表下载</span>
		        <el-button class="button" @click="handleDownload"  type="success">下载报表</el-button>
		      </div>
		    </template>
		   <el-form :model="queryParams" label-width="120px">
		       <el-form-item label="店铺">
		         <AdGroup   :border="true"   @change="changeGroup" />
		       </el-form-item>
			   <el-form-item label="日期">
			    <Datepicker ref="datepickersRef" :days="1" class="date-picker-width"   @changedate="changedate" />
			   </el-form-item>
			   <el-form-item label="汇总方式">
			     <el-select  v-model="queryParams.dateType"    placeholder="汇总方式"   >
			           <el-option key="daily"  label="Daily" value="daily"></el-option>
					   <el-option key="total"  label="Total" value="total"></el-option>
			     </el-select>
			   </el-form-item>
			   <el-form-item label="广告类型">
			     <el-select  v-model="queryParams.campaigntype"    placeholder="广告类型"   >
			           <el-option key="Sponsored Products"  label="Sponsored Products" value="Sponsored Products"></el-option>
			   		   <el-option key="Sponsored Brands"  label="Sponsored Brands" value="Sponsored Brands"></el-option>
			     </el-select>
			   </el-form-item>
			   <el-form-item label="报表类型">
			     <el-select  v-model="queryParams.reporttype"    placeholder="报表类型"   >
					 <el-option key="Campaign"  label="Campaign" value="Campaign"></el-option>
					 <el-option key="Campaign-placement"  label="Campaign-placement" value="Campaign-placement" ></el-option>
					 <el-option key="Targeting-Keyword"  label="Targeting-Keyword" value="Targeting-Keyword"></el-option>
					 <el-option key="Targeting-ProductTarget"  label="Targeting-ProductTarget" value="Targeting-ProductTarget"></el-option>
					 <el-option key="Advertised product"  label="Advertised product" value="Advertised product"></el-option>
					 <el-option key="Purchased product"  label="Purchased product" value="Purchased product"></el-option>
					 <el-option key="Search term-Keyword"  label="Search term-Keyword" value="Search term-Keyword"></el-option>
					 <el-option key="Search term-ProductTarget"  label="Search term-ProductTarget" value="Search term-ProductTarget"></el-option>
			     </el-select>
			   </el-form-item>
		     </el-form>
		  </el-card>
	</div>
</template>

<script setup>
	import{ref,reactive,toRefs}from'vue';
	import AdGroup from '@/components/header/ad_group.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import summaryApi from '@/api/amazon/advertisement/summary/summaryApi.js';
	import {formatFloat,dateFormat,dateTimesFormat,outputmoney} from '@/utils/index';
	const state = reactive({
		queryParams:{dateType:"Daily",reporttype:"Campaign",campaigntype:"Sponsored Products"},
	})
	const{	
		 queryParams
	}=toRefs(state)
	 function changedate(dates,value,opt){
	 	state.queryParams.fromDate=dates.start;
	 	state.queryParams.endDate=dates.end;
	 }
	 function changeGroup(data){
	 		state.queryParams.groupid=data.groupid;
	 		state.queryParams.profileid=data.profileid;
	 		state.queryParams.marketplaceid=data.profile.marketplaceid;
	 		state.queryParams.profile=data.profile;
	 }
	 function handleDownload(){
		 summaryApi.downExcelDate(state.queryParams);
	 }
</script>

<style>
	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}

</style>