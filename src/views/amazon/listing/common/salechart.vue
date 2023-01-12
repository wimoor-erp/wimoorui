<template>
	<div class="saledialog">
	<el-dialog v-model="saleVisable" :title="productData.sku" :modal="false" :lock-scroll="false"    draggable>
		  <template #header>
			<el-tabs
			   v-model="activeMarket"
			   class="markets-tabs-dialog"
			   @tab-change="handleClick"
			 >
			  <el-tab-pane  v-for = "(item,index) in marketList" :label="item.name" :name="item.marketplaceid"  >
				  
			  </el-tab-pane>
			 </el-tabs>
		  </template>
			<div class="flex-center">
				 <div class="font-Small" >  <span class="font-extraSmall">总销量：</span>{{totalsales}} </div>
						 <el-radio-group v-model="radiotime" @change="changeTimeType" size="small">
						       <el-radio-button label="30天" />
						       <el-radio-button label="60天" />
						       <el-radio-button label="90天" />
						     </el-radio-group>
			</div>
		<div id='salechart' style='height:160px;width:100%'>
		 
		</div>
	</el-dialog>
	</div>
</template>

<script setup>
	import * as echarts from 'echarts'
	import { ElDivider } from 'element-plus'
	import {ref,reactive,onMounted,watch,h} from 'vue';
	import marketApi from '@/api/amazon/market/marketApi.js';
	import saleschartApi from '@/api/amazon/order/saleschartApi.js';
		let activeMarket = ref();
		let saleVisable = ref(false)
		let productData = reactive({})
		let radiotime =ref("30天")
		let spacer = h(ElDivider, { direction: 'vertical' })
		let marketList=ref([]);
		let chart;
		let skuname=ref("");
		let totalsales=ref(0);
	    function saleChart(){
				var myChart = echarts.init(document.getElementById('salechart'));
				var myseries=[];
				totalsales.value=0;
				chart.lines.forEach(line=>{
					skuname.value=line.name;
					totalsales.value=totalsales.value+line.summary;
					myseries.push({
									smooth: 0.5,
									type: 'line',
									data: line.data,
									name:line.name,
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
				     },  
				      xAxis: {
								boundaryGap:false,
								data: chart.labels,
								axisLine:{   show: false },
								axisTick:{ show: false },
								axisLabel:{  color:"#acb0b9" },
							},
							grid:{
								right:32,
								left:32,
				                 bottom:20,
								 top:28,
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
				 initVisualMapPieces(option,chart);//此处使用分段红色线条表示连续无货，代替markpoint
				 myChart.setOption(option);
				 window.addEventListener('resize',()=>{
						   myChart.resize();
				 })
			}
			function initVisualMapPieces(option,chart){
				chart.lines.forEach(line=>{
					if(line.markpoint.length>0){
						var labelsmap={};
							for(var m in line.markpoint){
								if(chart.labels.includes(line.markpoint[m].xaxis)){
									labelsmap[line.markpoint[m].xaxis]=1;
								}
							}
						var p = 0;
						for(var i = 0; i < chart.labels.length; i++){
							if(labelsmap[chart.labels[i]]==1&&labelsmap[chart.labels[i+1]]==1) {
								option.visualMap.pieces[p] = {gte:i,lt:i+1}; 
								p++; 
							}
						}
					}
				})
				if(option.visualMap.pieces.length==0){
					 option.visualMap.inRange.color='#ffa400';
				}
			}
			function handleClick(){
				productData.marketplaceid=activeMarket.value;
				handleChartSaleLine();
			}
			function handleChartSaleLine(){
				saleschartApi.salesLine(productData).then((res)=>{
					if(res.data){
						 chart=res.data;
						 saleChart();
					}
				});
			}
			function show(groupid,marketplaceid,amazonAuthId,sku,msku){
				saleVisable.value=true;
				radiotime.value="30天";
				productData.groupid=groupid;
				productData.marketplaceid=marketplaceid;
				productData.daysize=30;
				productData.amazonAuthId=amazonAuthId;
				productData.sku=sku;
				productData.msku=msku;
				if(sku==null||sku==""){
					marketApi.getByMSku({"msku":msku,"groupid":groupid}).then((res)=>{
						marketList.value=res.data;
						if(marketplaceid==null||marketplaceid==""){
							activeMarket.value=res.data[0].marketplaceid;
							productData.marketplaceid=res.data[0].marketplaceid;
						}else{
							activeMarket.value=marketplaceid;
						}
						handleChartSaleLine();
					});
				}else{
					marketApi.getBySku({"sku":sku,"groupid":groupid}).then((res)=>{
						marketList.value=res.data;
						activeMarket.value=marketplaceid;
						handleChartSaleLine();
					});
				}
				
			}
			defineExpose({
			  show
			}) 
			function changeTimeType(){
				if(radiotime.value=="30天"){
					productData.daysize=30;
				}else if(radiotime.value=="60天"){
					productData.daysize=60;
				}else if(radiotime.value=="90天"){
					productData.daysize=90;
				}
				handleClick();
			}
			 
</script>

<style >
	.saledialog .el-overlay-dialog{
		text-align: right;
	}
	.saledialog .el-dialog{
/* 		margin: inherit;
		display: inline-block; */
		text-align: left;
		box-shadow: var(--el-box-shadow-light)
	}
	.saledialog .flex-center{
		display: flex;
		justify-content: space-between;
	}
	.markets-tabs-dialog .el-tabs__header{
		margin:0;
	}
	.saledialog .el-dialog__header,.saledialog .el-dialog__body{
		padding-top:5px !important;
	} 
</style>

