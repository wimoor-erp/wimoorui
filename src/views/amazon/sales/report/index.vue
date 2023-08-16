<template>
	<div class="main-sty">
		<div class="con-header" >
			<el-row>
				<el-space >
				<span class="font-extraSmall">销售渠道:</span>
				  <el-checkbox-group
				    v-model="queryParam.salechannel"
				     @change="handleQuery"
				  >
				  <div>
				    <el-checkbox v-for="item in channelNormallist" :key="item.sales_channel" :label="item.sales_channel">
					  <el-tooltip :content="item.domain">
					   {{item.name}} 
					  </el-tooltip>
					</el-checkbox>
					</div>
					<el-checkbox v-for="item in channelDifflist" :key="item.sales_channel" :label="item.sales_channel">
					  <el-tooltip :content="item.domain">
					  <span   class="text-orange">{{item.name}}</span>
					  </el-tooltip>
					</el-checkbox>
				  </el-checkbox-group>
				 </el-space >
			</el-row>	
			<el-row>
				<el-space >
					
						<div class="font-extraSmall">配送方式:</div>
						<el-checkbox-group
						  v-model="queryParam.fulfillmentChannel"
						  @change="handleQuery"
						>
						<el-checkbox  key="Merchant" label="Merchant"> 卖家自配送</el-checkbox>
						<el-checkbox  key="Amazon" label="Merchant"> 亚马逊配送</el-checkbox>
						</el-checkbox-group>
				</el-space >	
				<div class='rt-btn-group'> <el-button   @click.stop="showMoreSelect">更多条件筛选</el-button>
				</div>
			</el-row>
			<el-row v-if="showmore==true">
				<el-space >
					<div class="font-extraSmall">客户类型:</div>
					<el-checkbox-group
					  v-model="queryParam.isBusinessOrder"
					  @change="handleQuery"
					>
					<el-checkbox v-for="item in isBusinesslist" :key="item.value" :label="item.value">
					  <span   >{{item.name}}</span>
					</el-checkbox>
				   </el-checkbox-group>
				 </el-space >	 
			</el-row>
			<el-row v-if="showmore==true">
				<el-space >
					<span class="font-extraSmall">促销订单:</span>
					<div class="slider-block">					 
						<el-slider v-model="queryParam.discountrate" range  show-input />
					</div>
					<span class="font-extraSmall text-red"  style="margin-left: 10px;">折扣金额占原价</span>
				 </el-space >	 
			</el-row>
			<el-row v-if="showmore==true">
				<el-space >
					<div class="font-extraSmall">订单状态:</div>
					
					<el-checkbox-group
					  v-model="queryParam.orderStatus"
					  @change="handleQuery"
					>
					<el-checkbox v-for="item in statuslist" :key="item.value" :label="item.value">
					  <span    >{{item.name}}</span>
					</el-checkbox>
					</el-checkbox-group>
					 
				 </el-space >	 
			</el-row>
		  <el-row>
		    <el-space >
		  <Group @change="getGroup"></Group>
		  <Datepicker ref="datepickers" :days="1" :shortIndex="1"  @changedate="changeDate" />
		 <el-input  v-model="queryParam.search" @input="handleQuery" clearable placeholder="请输入SKU" style="width: 250px;" class="input-with-select" >
		    <template #append>
		      <el-button @click="handleQuery" >
		         <el-icon class="ic-cen font-medium">
		          <search/>
		       </el-icon>
		      </el-button>
		    </template>
		  </el-input>
		   </el-space>
		   <div class='rt-btn-group'>
		   <el-button class='ic-btn'  title='列配置'>
		      <setting-two theme="outline" size="16"  :strokeWidth="3"/>
		   </el-button>
		    <el-button   class='ic-btn' title='帮助文档'>
		     <help theme="outline" size="16" :strokeWidth="3"/>
		   </el-button>
		   </div>
		</el-row>
		</div>
			 <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
				<el-tab-pane label="units" name="units">
						  <template #label>
										Units 
										<span class="font-extraSmall">
											销量:{{chartData.unitsum}} <span style="margin-left: 10px;">环比上期:
											<span v-if="chartData.lastunitsum>=0">+</span><span v-else>-</span>
											{{chartData.lastunitsum}}</span>
											<span v-if="chartData.lastunitsum>=0">
												<el-icon color="#1e660b"><CaretTop  /></el-icon>
											</span><span v-else><el-icon color="#e80000"><CaretBottom /></el-icon></span>
										</span>
					</template>
				</el-tab-pane>
				<el-tab-pane label="orders" name="orders">
					 <template #label>
					Orders 
					<span class="font-extraSmall">
						订单数:{{chartData.ordersum}} <span style="margin-left: 10px;">环比上期:
						<span v-if="chartData.lastordersum>=0">+</span><span v-else>-</span>
						{{chartData.lastordersum}}</span>
						<span v-if="chartData.lastordersum>=0">
							<el-icon color="#1e660b"><CaretTop  /></el-icon>
						</span><span v-else><el-icon color="#e80000"><CaretBottom /></el-icon></span>
					</span>
				</template>
				</el-tab-pane>
				  </el-tabs>
				<div class="pull-right" style="position: relative;left:0;top:0">
								<el-radio-group v-model="queryParam.bytime"  @change="handleQuery">
								      <el-radio-button label="Daily" >每日</el-radio-button>
									  <el-radio-button label="Weekly" >每周</el-radio-button>
									  <el-radio-button label="Monthly" >每月</el-radio-button>
								</el-radio-group>
				</div>
				<div id='salechart' style='height:360px;width:100%;margin-top:20px;'>
				 
				</div>
			
 
  </div>
	 
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs,getCurrentInstance} from 'vue'
	import {Search,ArrowDown,CaretTop,CaretBottom} from '@element-plus/icons-vue'
	import { ElDivider } from 'element-plus'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import summaryChartApi from '@/api/amazon/order/summaryChartApi.js';
	import {dateFormat,getCurrencyMark} from '@/utils/index';
	import {ElMessage } from 'element-plus';
	import Group from '@/components/header/group_select.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import * as echarts from 'echarts'
	const globalTable=ref();
	const { proxy } = getCurrentInstance();
	let state=reactive({
		 downLoading:false,
		 queryParam:{
			 startDate:"",
			 endDate:"",
			 groupid:'',
			 search:"",
			 bytime:"Daily",
			 discountrate:[0,100],
			 fulfillmentChannel:["Merchant","Amazon"],
			 isBusinessOrder:[],
			 orderStatus:[],
			 salechannel:[],
		 },
		 totalsales:0,
		 totalsalesrate:0,
		 totalorders:0,
		 totalordersrate:0,
		 statuslist:[],
		 channelNormallist:[],
		 channelDifflist:[],
		 isBusinesslist:[],
		 activeName:'units',
		 isload:true,
		 chartData:{},
		 showmore:true,
	});
	let {
	   queryParam,
	   isload,
	   downLoading,
	   statuslist,
	   showmore,
	   totalsales,
	   totalsalesrate,
	   totalorders,
	   totalordersrate,
	   activeName,
	   chartData,
	   channelNormallist,
	   isBusinesslist,
	   channelDifflist,
	} =toRefs(state);
	var orderdata=[];
	var listdata=[];
	var labels=[];
	 function saleChart(){
	 		var myChart = echarts.init(document.getElementById('salechart'));
	 		var myseries=[];
	 		var legends=[];
	 			myseries.push({
	 							smooth: 0.5,
	 							type: 'line',
	 							data: listdata,
	 							lineStyle:{
	 								color:'#ffa400',
	 							},
	 							itemStyle:{
	 								color:'#ffa400',
	 							},
	 							label:{
	 								show:true,
	 							},
	 							showAllSymbol:true,
	 							markLine:{
	 											data : [ {
	 												silent:false,  
	 												type : 'average',
	 												name : '平均值'
	 											} ],
	 											itemStyle : {
	 												normal : {
	 													color : '#ffa400',
	 													lineStyle : {
	 														color : '#ffa400'
	 													},
	 													label : {
	 														show : true,
	 														textStyle : {
	 															color : '#ffa400',
	 															fontWeight : 'bold',
	 														}
	 													},
	 												},
	 											}
	 										},
	 		                   })
 
	 		var option = {
	 			visualMap : {
	 						show: false,
	 						dimension: 0,
	 						pieces: [],  //pieces的值由动态数据决定
	 						outOfRange: {
	 					    				color: '#ffa400'
	 					    			},
	 						inRange:{                               //定义 在选中范围中 的视觉元素
	 							color: '#f1f2f4'
	 						}
	 					},
	 		     tooltip : { trigger : 'axis', },
	 		     legend:{
	 			  type: "plain",
	 			  icon: "circle",
	 			  itemWidth: 8,
	 			  selected: {
	 						legendsfirst: true
	 					},
	 			  selectedMode:"single"
	 		     },  
	 		      xAxis: {
	 						boundaryGap:false,
	 						data: labels,
	 						axisLine:{   show: false },
	 						axisTick:{ show: false },
	 						axisLabel:{  color:"#acb0b9" },
	 					},
	 					grid:{
	 						right:62,
	 						left:62,
	 		                bottom:20,
	 						top:18,
	 					},
	 		      yAxis: {
	 						axisLabel:{
	 		                    color:"#acb0b9"
	 						},
	 						splitLine:{
	 							lineStyle:{
	 							color:"#F2F3F6"
	 							}
	 						}
	 					},
	 		      series: myseries
	 		}
	 		 myChart.setOption(option,true);
	 		 window.addEventListener('resize',()=>{
	 				   myChart.resize();
	 		 })
	 	}
	function orderChart(){
			var myChart = echarts.init(document.getElementById('salechart'));
			var myseries=[];
			var legends=[];
				myseries.push({
								smooth: 0.5,
								type: 'line',
								data: orderdata,
								lineStyle:{
									color:'#409EFF',
								},
								itemStyle:{
									color:'#409EFF',
								},
								label:{
									show:true,
								},
								showAllSymbol:true,
								markLine:{
												data : [ {
													silent:false,  
													type : 'average',
													name : '平均值'
												} ],
												itemStyle : {
													normal : {
														color : '#409EFF',
														lineStyle : {
															color : '#409EFF'
														},
														label : {
															show : true,
															textStyle : {
																color : '#409EFF',
																fontWeight : 'bold',
															}
														},
													},
												}
											},
			                   })
	 
			var option = {
				visualMap : {
							show: false,
							dimension: 0,
							pieces: [],  //pieces的值由动态数据决定
							outOfRange: {
						    				color: '#409EFF'
						    			},
							inRange:{                               //定义 在选中范围中 的视觉元素
								color: '#f1f2f4'
							}
						},
			     tooltip : { trigger : 'axis', },
			     legend:{
				  type: "plain",
				  icon: "circle",
				  itemWidth: 8,
				  selected: {
							legendsfirst: true
						},
				  selectedMode:"single"
			     },  
			      xAxis: {
							boundaryGap:false,
							data: labels,
							axisLine:{   show: false },
							axisTick:{ show: false },
							axisLabel:{  color:"#acb0b9" },
						},
						grid:{
							right:62,
							left:62,
			                bottom:20,
							top:18,
						},
			      yAxis: {
							axisLabel:{
			                    color:"#acb0b9"
							},
							splitLine:{
								lineStyle:{
								color:"#F2F3F6"
								}
							}
						},
			      series: myseries
			}
			 
			 myChart.setOption(option,true);
			 window.addEventListener('resize',()=>{
					  myChart.resize(); 
			 })
		}
	function showMoreSelect(){
		if(state.showmore==false){
			state.showmore=true;
		}else{
			state.showmore=false;
		}
		
	}
	function handleClick(){
		if(state.activeName=="units"){
		    setTimeout(function(){saleChart();},100);
		}else{
			setTimeout(function(){orderChart();},100);
		}
		
	}
	function getGroup(val){
		state.queryParam.groupid=val;
	}
	function changeDate(value){
		state.queryParam.enddate=value.end;
		state.queryParam.fromdate=value.start;
	}
	function handleQuery(){
		state.queryParam.sku=state.queryParam.search;
		state.queryParam.discountfrom =state.queryParam.discountrate[0];
		state.queryParam.discountto =state.queryParam.discountrate[1];
		summaryChartApi.search(state.queryParam).then((res)=>{
			if(res.data){
				orderdata=res.data.orderdata;
				labels=res.data.labels;
				listdata=res.data.listdata;
				state.chartData.lastordersum=res.data.lastordersum;
				state.chartData.lastunitsum=res.data.lastunitsum;
				state.chartData.ordersum=res.data.ordersum;
				state.chartData.unitsum=res.data.unitsum;
			}else{
				orderdata=[];
				labels=[];
				listdata=[];
				state.chartData.lastordersum=0;
				state.chartData.lastunitsum=0;
				state.chartData.ordersum=0;
				state.chartData.unitsum=0;
			}
			
			 handleClick();
		});
	}
	 
	async function load(){
		await proxy.listDictsByCode("order_status").then(res=>{
			res.data.forEach(function(item){
				if(item.name!="Cancelled"){
					state.queryParam.orderStatus.push(item.value);
				} 
			});
			 state.statuslist=res.data;
		});
		await proxy.listDictsByCode("is_business_order").then(res=>{
			 state.isBusinesslist=res.data;
			 res.data.forEach(item=>{
				  state.queryParam.isBusinessOrder.push(item.value);
			 })
		});
		 
		state.channelNormallist=[];
		state.channelDifflist=[];
		state.queryParam.salechannel=[];
		await summaryChartApi.getOrderChannel().then((res)=>{
			 res.data.forEach(item=>{
				 if(item.isdifferent){
					 state.channelDifflist.push(item);
				 }else{
					  state.queryParam.salechannel.push(item.sales_channel);
					  state.channelNormallist.push(item);
				 }
			 });
		});
		handleQuery();
	}
	onMounted(async ()=>{
		load()
	})
	 
</script>

<style scoped>
	.slider-block {
	  display: flex;
	  align-items: center;
	  width: 500px;
	}
	.slider-block .el-slider {
	  margin-top: 0;
	  margin-left: 12px;
	}
	.pull-right{
		float:right
	}
</style>
