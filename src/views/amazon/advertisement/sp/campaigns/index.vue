<template>
	<div class="wi-content ">
		<div class="wi-left-c">
			<AdTree @change="getData" />
		</div>
		<div class="wi-right-c el-white-bg">
			<div class="bread-head flex-center-between">
				<div class="bread-nav">
					<el-icon class="ad-home"><HomeFilled /></el-icon>
					  <el-breadcrumb separator="/">
					    <el-breadcrumb-item :to="{ path: '/' }">Campaign1</el-breadcrumb-item>
					    <el-breadcrumb-item>SP_MA_Group1</el-breadcrumb-item>
					  </el-breadcrumb>
				</div>
				<div class="font-extraSmall m-r-16">
					<span>太平洋时间 :2023-05-15 23:20:03</span>
				</div>
			</div>
			
			<div class="ad-body-c">
				<div class="con-header">
					<div>
						  <el-tabs v-model="activeName"  @tab-click="handleClick">
						    <el-tab-pane v-for="item in tabsData" :label="item.name" :name="item.value">
								<template #label>{{item.name}} &nbsp;<span>{{item.count}}</span></template>
							</el-tab-pane>
						  </el-tabs>
					</div>
					<el-row>
						<el-space>
							<el-select v-model="adstate" placeholder="广告状态" clearable>
								<el-option v-for="item in adStatesOptions" :label="item.name" :value="item.value"></el-option>
							</el-select>
							<el-select v-model="adType" placeholder="投放类型" clearable>
								<el-option v-for="item in adTypeOptions" :label="item.name" :value="item.value"></el-option>
							</el-select>
							
							 <Datepicker ref="datepickersRef" :days="1" class="date-picker-width"   @changedate="changedate" />
							   <el-radio-group class="el-radio-group-button" v-model="times" @change="changeTimes">
							      <el-radio-button label="昨天" />
							      <el-radio-button label="近7天" />
							      <el-radio-button label="近30天" />
							    </el-radio-group>
							<el-input placeholder="搜索广告活动...">
									 <template #suffix>
									  <el-icon><Search /></el-icon>
									 </template>
							</el-input>	
							<el-button>重置</el-button>
								<DataFilter/>
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
							<el-dropdown>
							    <el-button class='ic-btn'  title='其他'>
							      <el-icon><Menu /></el-icon>
							    </el-button>
							    <template #dropdown>
							      <el-dropdown-menu>
							        <el-dropdown-item @click="handleExpendAdcycle">广告成交周期</el-dropdown-item>
							        <el-dropdown-item>位置</el-dropdown-item>
							      </el-dropdown-menu>
							    </template>
							  </el-dropdown>
							  <el-button @click="showAdChart" class='ic-btn'  title='展示图表'>
							   <el-icon><Histogram /></el-icon>
							  </el-button>
							</el-space>
						</div>
					</el-row>
					<div>
						<Table ref="tableRef" :activeName="activeName" @selectRow="selectRow"/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<AdChart ref="adchartRef"/>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {HomeFilled,Search,Menu,Histogram,ArrowDown} from '@element-plus/icons-vue'
	import {Plus,} from '@icon-park/vue-next';
	import AdTree from '@/views/amazon/advertisement/common/ad_tree.vue'
	import DataFilter from '@/views/amazon/advertisement/common/data_filter.vue'
	import AdChart from '@/views/amazon/advertisement/common/ad_chart.vue'
	import Datepicker from '@/components/header/datepicker.vue';
	import Table from'./components/table.vue'
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const tableRef = ref()
	const adchartRef = ref()
	const state =reactive({
		tabsData:[
			{name:'广告活动',value:1,count:'4866',},
			{name:'广告组',value:2,count:'496',},
			{name:'商品',value:3,count:'265',},
			{name:'关键词',value:4,count:'18849',},
			{name:'否定关键词',value:5,},
			{name:'商品投放',value:6,},
			{name:'否定投放',value:7,},
			{name:'用户搜索词',value:8,},
		],
		activeName:1,
		adStatesOptions:[
				{name:'全部广告状态',value:'all',},
				{name:'已启动',value:'enabled',},
				{name:'已暂停',value:'paused',},
				{name:'已归档',value:'archived',},
			],
		adstate:'all',
		adTypeOptions:[
			{name:'自动投放',value:'auto',},
			{name:'手动投放',value:'manual',},
			{name:'手动及自动',value:'all',},
			
		],
		adType:'all',
		times:'昨天',
		disabled:true,
		batch:{text:'',input:false,value:'',},
		queryParams:{},
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
	}=toRefs(state)
	
	function getData(params){
		state.queryParams.groupid=params.groupid;
		state.queryParams.profileid=params.profileid;
		handleQuery();
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
	
	function handleBidding(name){
		state.batch.input = true;
		state.batch.text = name;
	}
	
	function handleExpendAdcycle(){
		tableRef.value.expandAll()
	}
	function showAdChart(){
		adchartRef.value.show()
	}
	//日期改变
	function changedate(dates){
		state.queryParams.fromDate=dates.start;
		state.queryParams.endDate=dates.end;
		handleQuery();
	}
	function handleQuery(){
		if(state.queryParams.profileid){
			tableRef.value.handleQuery(state.queryParams);
		}
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