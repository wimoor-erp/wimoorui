<template>
	<div class="pag-radius-bor">
		<div class="flex-center-between">
			<h4>收支统计</h4>
			<el-popover
			    :visible="visible"
			    placement="left"
			    :width="250"
			  >
			  <template #reference>
			    <el-button size="small" @click="visible = !visible" >
			     {{dateVal}}
				  <el-icon><ArrowDown /></el-icon>
				  </el-button >
			  </template>
			      <el-radio-group v-model="radio" @change="radio=='年'?dateType='year':dateType='month'">
			        <el-radio-button label="年" />
			        <el-radio-button label="月" />
			      </el-radio-group>
				  <el-date-picker
				    class="m-t-16"
					@change="handleChange"
					v-model="dateVal"
					:type="dateType"
					:editable="false"
					:clearable="false"
				  />
			   
			  </el-popover>
		</div>
		<div class="m-t-16">
			<el-row :gutter="16">
				<el-col :span="12">
					<el-card shadow="never" >
						<div class="flex-center ">
							<div class="round-b-32">
							<bank-card class="ic-cen"
							 theme="filled" size="16" fill="#55aaff" :strokeWidth="3"/>
							</div>
							<div class="m-l-16">
								<p class="font-bold font-18">3,013,793.54</p>
								<p class="font-extraSmall">本月支出（元）</p>
							</div>
							</div>
					</el-card>
				</el-col>
				<el-col :span="12">
					<el-card shadow="never">
						<div class="flex-center ">
							<div class="round-y-32">
							<finance class="ic-cen"
							 theme="filled" size="17" fill="#ffaa00" :strokeWidth="3"/>
							</div>
							<div class="m-l-16">
								<p class="font-bold font-18">3,276,821.79</p>
								<p class="font-extraSmall">本月收入（元）</p>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<div id='chart' style='height:291px;width:100%'>
				 
				</div>
			</el-row>
		</div>
	</div>
</template>

<script setup>
	import {BankCard,Finance} from '@icon-park/vue-next';
	import {ArrowDown} from '@element-plus/icons-vue'
	import {dateYearFormat,dateMonthFormat} from '@/utils/index';
	import * as echarts from "echarts";
	import { ref,reactive,onMounted,watch,toRefs} from 'vue'
	const nowDate=dateYearFormat(new Date());
	const state = reactive({
		visible:false,
		radio:'年',
		dateType:"year",
		dateVal:nowDate,
		series: [
		    {
			  name: '收入',
			   smooth: true,
		      data: [150, 230, 268, 218, 135, 147, 260],
		      type: 'line',
			  lineStyle:{
			  	color:'#FF6700',
			  },
			  itemStyle:{
			  	color:'#FF6700',
			  }
		    },
			{
			  name: '支出',
			  smooth: true,
			  data: [243, 187, 256, 198, 174, 226, 197],
			  type: 'line',
			  lineStyle:{
			  	color:'#3094ff',
			  },
			  itemStyle:{
			  	color:'#3094ff',
			  }
			}
		  ],
		dates:['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07'], 
	})
	const {
		series,
		dates,
		visible,
		radio,
		dateVal,
		dateType,
	}= toRefs(state)
	function generalChart(series,dates){
		  var myChart = echarts.init(document.getElementById('chart'));
		  var option = {
	         tooltip : {
				trigger : 'axis',
			     },
	          legend:{
					data:['支出','收入'],
					icon: "circle",
					itemWidth:6,
					itemHeight:6,
                    show: true ,
					top:16,
	          },
	          xAxis: {
					boundaryGap:false,
					data:dates,
					axisLine:{
	              show: false
					},
					axisTick:{
					show: false
					},
					axisLabel:{
	               color:"#acb0b9"
					},
					
				},
				grid:{
					right:32,
					left:45,
	              bottom:32
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
	          series: series
		  }
		   
		   myChart.setOption(option);
		   window.addEventListener('resize',()=>{
			   myChart.resize();
		   })
	}
	function handleChange(val){
		state.visible = false
		formatDate(val)
	}
	onMounted(()=>{
		generalChart(state.series,state.dates)
	})
	
	function formatDate(date){
		if(state.radio=='年'){
			state.dateVal = dateYearFormat(date)
			console.log(123)
		}else{
			state.dateVal = dateMonthFormat(date)
		}
	}
</script>

<style scoped="scoped">
	.pag-radius-bor{
		    border-radius: var(--el-border-radius-base);
		    width: 100%;
		    padding: 16px 24px;
	}
	.round-b-32{
		display: flex;
		align-items: center;
		justify-content: center;
		height:40px;
		width:40px;
		border-radius:32px;
	}
	.round-y-32{
		display: flex;
		align-items: center;
		justify-content: center;
		height:40px;
		width:40px;
		border-radius:32px;
	}
	.m-t-16{
		margin-top:16px;
	}
	.m-b-32{
		margin-bottom: 32px;
	}
	.m-b-16{
		margin-bottom: 16px;
	}
	.font-18{
		font-size:20px;
		color: #333;
		font-family:DIN Alternate,Helvetica Neue,Helvetica,Arial, SF Pro Display;
	}
	.m-l-16{
		margin-left: 16px;
	}
</style>
