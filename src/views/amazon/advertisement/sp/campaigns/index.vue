<template>
	<div class="wi-content ">
		<div class="wi-left-c">
			<AdTree @change="getData" />
		</div>
		<div class="wi-right-c el-white-bg">
			<div class="bread-head flex-center-between">
				<div class="bread-nav">
					<el-icon class="ad-home"><HomeFilled /></el-icon>
					  <el-breadcrumb separator="/" >
						<!--  :to="{ path: '/' }" -->
					    <el-breadcrumb-item    @click.stop="handleQuery" >portfolios({{portfoliostitle}})</el-breadcrumb-item>
					    <el-breadcrumb-item>广告活动({{advcamstitle}})</el-breadcrumb-item>
						<el-breadcrumb-item>广告组({{advgroupstitle}})</el-breadcrumb-item>
					  </el-breadcrumb>
					   <el-icon class="pointer" style="padding-left: 5px;" @click.stop="clearBtn"><Close></Close></el-icon>
				</div>
				<div class="font-extraSmall m-r-16">
					<span>太平洋时间 :2023-05-15 23:20:03</span>
				</div>
			</div>
			
			<div class="ad-body-c">
				<div class="con-header">
					<div>
						  <el-tabs v-model="activeName"     @tab-change="handleClick">
							  <span v-for="(item,index) in tabsData" >
						    <el-tab-pane v-if="item.visable" :key="index" :label="item.name" :name="item.value">
								<template #label>{{item.name}} &nbsp;<span>{{item.count}}</span></template>
							</el-tab-pane>
							</span>
						  </el-tabs>
					</div>
					<el-row>
						<el-space>
							<el-select v-model="adstate" placeholder="广告状态" @change="handleQuery" clearable>
								<el-option v-for="item in adStatesOptions" :label="item.name" :value="item.value"></el-option>
							</el-select>
							<el-select v-if="activeName=='adcams'" v-model="adType" placeholder="投放类型" @change="handleQuery" clearable>
								<el-option v-for="item in adTypeOptions" :label="item.name" :value="item.value"></el-option>
							</el-select>
							
							 <Datepicker ref="datepickersRef" :days="1" class="date-picker-width"   @changedate="changedate" />
							   <el-radio-group class="el-radio-group-button" v-model="times" @change="changeTimes">
							      <el-radio-button label="昨天" />
							      <el-radio-button label="近7天" />
							      <el-radio-button label="近30天" />
							    </el-radio-group>
							<el-input v-model="queryParams.search" @input="handleQuery" placeholder="搜索名称/SKU">
									 <template #suffix>
									  <el-icon @click.stop="handleQuery"><Search /></el-icon>
									 </template>
							</el-input>	
							<el-button @click="clearSearch">重置</el-button>
								<DataFilter :activeName="activeName"  @change="changeDataFilter"/>
						</el-space>
					</el-row>
					<el-row class="flex-center-between">
						<el-space>
						<el-button type="primary"  class="im-but-one" @click="handleAdd">
						  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
						  <span>新建广告活动</span>
						</el-button>
						<el-dropdown trigger="click">
						  <el-button :disabled="disabled">
						             批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
						  </el-button>
						  <template #dropdown>
						    <el-dropdown-menu >
						      <el-dropdown-item  @click="handleBidding('调整预算')">调整预算</el-dropdown-item>
							  <el-dropdown-item  >启用</el-dropdown-item>
							  <el-dropdown-item  >暂停</el-dropdown-item>
						      <el-dropdown-item  >调整结束日期</el-dropdown-item>
						      <el-dropdown-item  >移入广告组合</el-dropdown-item>
						      <el-dropdown-item  >移出广告组合</el-dropdown-item>
							  <el-dropdown-item  >备注</el-dropdown-item>
							  <el-dropdown-item  >分时策略</el-dropdown-item>
						    </el-dropdown-menu>
						  </template>
						</el-dropdown>
						<el-space v-show="batch.input">
							<el-button @click="batch.input=false">取消</el-button>
							<el-text class="font-base">{{batch.text}}</el-text>
							<el-input v-model="batch.value"></el-input>
							<el-button type="primary">确认</el-button>
						</el-space>
						</el-space>
						<div class='icon-group'>
							<el-space>
							<el-dropdown v-if="activeName!='adsearch' && activeName!='adtargetquery' && activeName!='adnkey'  && activeName!='adntarget'">
							    <el-button class='ic-btn'  title='其他'>
							      <el-icon><Menu /></el-icon>
							    </el-button>
							    <template #dropdown>
							      <el-dropdown-menu>
									  <el-dropdown-item v-if="activeName=='adproducts'" @click="handleExpendAdContent('sumproducts')">商品汇总</el-dropdown-item>
							        <el-dropdown-item v-if="activeName=='adcams' || activeName=='adgroups' || activeName=='adproducts'
									|| activeName=='adkey' || activeName=='adtarget'" @click="handleExpendAdContent('days')">广告成交周期</el-dropdown-item>
							        <el-dropdown-item v-if="activeName=='adcams'" @click="handleExpendAdContent('placement')">位置</el-dropdown-item>
									<el-dropdown-item v-if="activeName=='adproducts'" @click="handleExpendAdContent('otherproducts')">广告贡献-其它商品</el-dropdown-item>
							      </el-dropdown-menu>
							    </template>
							  </el-dropdown>
							  <el-button v-if="activeName!='adnkey'  && activeName!='adntarget'" @click="showAdChart" class='ic-btn'  title='展示图表'>
							   <el-icon><Histogram /></el-icon>
							  </el-button>
							</el-space>
						</div>
					</el-row>
					<div>
						<Table ref="tableRef" :activeName="activeName" @selectRow="selectRow" @change="getSummary" @bindData="getBindData" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<AdChart ref="adchartRef" :summary="summaryData" />
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue';
	import {HomeFilled,Search,Menu,Histogram,ArrowDown,Close} from '@element-plus/icons-vue';
	import {Plus,} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import AdTree from '@/views/amazon/advertisement/common/ad_tree.vue';
	import DataFilter from '@/views/amazon/advertisement/common/data_filter.vue';
	import AdChart from '@/views/amazon/advertisement/common/ad_chart.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import Table from'./components/table.vue';
	import {useRouter } from 'vue-router';
	import advertApi from '@/api/amazon_adv/advertApi.js';
	import advCampaignApi from '@/api/amazon_adv/advCampaignApi.js';
	import advProductsApi from '@/api/amazon_adv/advProductsApi.js';
	const router = useRouter();
	const tableRef = ref();
	const adchartRef = ref();
	const datepickersRef=ref();
	const state =reactive({
		portfoliostitle:"无",
		advcamstitle:"无",
		advgroupstitle:"无",
		summaryData:{},
		tabsData:[
			{name:'广告活动',value:'adcams',count:'4866',visable:true},
			{name:'广告组',value:'adgroups',count:'496',visable:true},
			{name:'商品',value:'adproducts',count:'265',visable:true},
			{name:'关键词',value:'adkey',count:'18849',visable:false},
			{name:'否定关键词',value:'adnkey',visable:false},
			{name:'用户搜索词',value:'adsearch',visable:false},
			{name:'商品投放',value:'adtarget',visable:false},
			{name:'否定投放',value:'adntarget',visable:false},
			{name:'用户投放搜索',value:'adtargetquery',visable:false},
		],
		activeName:'adcams',
		adStatesOptions:[
				{name:'全部广告状态',value:'all',},
				{name:'已启动',value:'enabled',},
				{name:'已暂停',value:'paused',},
				{name:'已归档',value:'archived',},
				// {name:'运行中',value:'runing',},
				// {name:'停止中',value:'stoping',},
			],
		adstate:'all',
		adTypeOptions:[
			{name:'自动投放',value:'auto',},
			{name:'手动投放',value:'manual',},
			{name:'手动及自动',value:'all',},
			
		],
		adType:'all',
		times:'近7天',
		disabled:true,
		batch:{text:'',input:false,value:'',},
		queryParams:{search:'',},
		bindParams:{},
	})

	const {
		tabsData,
		activeName,
		adStatesOptions,
		adstate,
		adTypeOptions,
		adType,
		times,
		disabled,
		batch,
		queryParams,
		portfoliostitle,
		advcamstitle,
		advgroupstitle,
		summaryData,
		bindParams,
	}=toRefs(state)
	function getBindData(params){
		state.advgroupstitle='无';
		state.advcamstitle='无';
		state.portfoliostitle='无';
		state.queryParams.search='';
		state.bindParams=params;
		if(state.bindParams.campaignid){
			state.tabsData.forEach(item=>{
				item.visable=true;
			});
			state.advcamstitle=state.bindParams.camname;
			if(params.adgroupname){
				state.advgroupstitle=params.adgroupname;
			}
			state.queryParams.campaignid=params.campaignid;
			if(params.adgroupid){
				state.queryParams.adGroupid=params.adgroupid;
			}
			handleQuery();
		}
		if(state.bindParams.portfoliosid){
			state.portfoliostitle=state.bindParams.poloname;
			state.queryParams.portfolios=state.bindParams.portfoliosid;
			handleQuery();
		}
	}
	
	function handleLeave(newactiveName,oldactiveName){
		console.log(newactiveName);
		console.log(oldactiveName);
		return true;
		// if(newactiveName>3 && state.advcamstitle=='无'){
		// 	return false;
		// }else{
		// 	return true;
		// }
	}
	
	function handleClick(val){
		 if(state.advcamstitle=='无' && val!='adcams' && val!='adgroups' && val!='adproducts'){
		 	ElMessage.error("请先锁定某个广告活动或广告组");
			return;
		 }else{
			 handleQuery();
		 }
	}
	
	function changeDataFilter(paralist){
		if(paralist!="" && paralist!=undefined && paralist!=null){
			state.queryParams.paralist=paralist;
			handleQuery();
		}else{
			state.queryParams.paralist=null;
			handleQuery();
		}
	}
	function getData(params){
		state.queryParams.groupid=params.groupid;
		state.queryParams.profileid=params.profileid;
		if(params.portfoliosid||params.campaignid||params.adgroupid){
			getBindData(params);
		}else{
			handleQuery();
		}
	}
	function handleAdd(){
		router.push({
			path:"/a/a/sp",
			query:{
				title:'创建商品广告',
				path:"/a/a/sp",
			},
		})
	}
	function selectRow(seletions){
		if(seletions.length>0){
			state.disabled = false
		}else{
			state.disabled = true
		}
	}
	function getSummary(data){
		state.summaryData=data;
	}
	
	
	function handleBidding(name){
		state.batch.input = true;
		state.batch.text = name;
	}
	
	function handleExpendAdContent(ftype){
		tableRef.value.expandAll(ftype)
	}
 
	function showAdChart(){
		var ftype=state.activeName;
		if(state.queryParams.profileid){
			state.queryParams.campaignType='SP';
			if(ftype=='adcams'){
				state.queryParams.campaignStatus=state.adstate;
				state.queryParams.targetingType=state.adType;
				state.queryParams.campaignName=state.queryParams.search;
			}else if(ftype=='adgroups'){
				state.queryParams.adGroupsName=state.queryParams.search;
				state.queryParams.adGroupsStatus=state.adstate;
			}
			adchartRef.value.show(ftype,state.queryParams);
		}
	}
	//日期改变
	function changedate(dates){
		state.queryParams.fromDate=dates.start;
		state.queryParams.endDate=dates.end;
		handleQuery();
	}
	function changeTimes(val){
		var end = new Date();
		var start = new Date();
		var beforedays=0;
		end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1));
		var array=[start, end];
		if(val=="近7天"){
			 start.setTime(start.getTime() - 3600 * 1000 * 24 * (7+beforedays))
		}
		if(val=="近30天"){
			 start.setTime(start.getTime() - 3600 * 1000 * 24 * (30+beforedays))
		}
		if(val=="近90天"){
			start.setTime(start.getTime() - 3600 * 1000 * 24 * (90+beforedays))
		}
		if(val=="昨天"){
			start.setTime(start.getTime() - 3600 * 1000 * 24 * (1+beforedays))
		}
		datepickersRef.value.dateValue=array;
		datepickersRef.value.dateChange(array);
	}
	function handleQuery(){
		state.queryParams.ftype=state.activeName;
		if(state.queryParams.profileid){
			state.queryParams.campaignStatus=state.adstate;
			state.queryParams.targetingType=state.adType;
			if(state.activeName=='adcams'){
				state.queryParams.campaignName=state.queryParams.search;
			}
			if(state.activeName=='adgroups'){
				state.queryParams.adGroupsName=state.queryParams.search;
			}
			if(state.activeName=='adproducts'){
				state.queryParams.sku=state.queryParams.search;
			}
			state.queryParams.campaignType='SP';
			tableRef.value.handleQuery(state.queryParams);
		}
	}
	function clearBtn(){
		state.portfoliostitle='无';
		state.advgroupstitle='无';
		state.advcamstitle='无';
		state.queryParams.campaignid=null;
		state.queryParams.adGroupid=null;
		state.queryParams.portfolios=null;
		state.tabsData.forEach(function(item,index){
			if(index==0 || index==1 || index==2){
				item.visable=true;
			}else{
				item.visable=false;
			}
		});
		state.activeName="adcams";
		handleQuery();
	}
	
	function clearSearch(){
		state.adstate='all';
		state.adType='all';
		state.queryParams.search='';
		state.bindParams={};
		handleQuery();
	}
</script>

<style>
	.el-tabs__item{
		color:#999
	}
	.m-r-16{
		margin-right:16px;
	}
	.ad-body-c{
		padding:0px 16px;
	}
	.wi-content{
		display:flex;
		margin:16px;
		margin-left:0px;
	}
	.bread-head{
		border-bottom:1px solid #eee;
	}
	.bread-nav{
		display:flex;
		align-items: center;
	}
	.ad-home{
		    display: flex;
		    height: 48px;
		    width: 48px;
		    color:#999;
			border-right:1px solid #eee;
			cursor:pointer;
			margin-right:16px;
	}
	.ad-home:hover{
		background-color: #f5f5f5;
	}
	.wi-left-c{
	}
	.wi-right-c{
		flex-grow:1;
		box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
		margin-left:16px;
		overflow:hidden;
	}
	.date-picker-width{
		width:268px!important;
	}
</style>