<template>
	<el-dialog v-model="salechartVisible"
	 custom-class="chart-tabs-dialog"
	 width="70%" :modal="false" :lock-scroll="false"  @opened = "saleChart" draggable>
		  <template #header>
			<el-tabs
			   v-model="activeName"
			   type="card"
			   @tab-click="handleClick"
			 >
			   <el-tab-pane label="美国" name="us"></el-tab-pane>
			   <el-tab-pane label="英国" name="en"></el-tab-pane>
			 </el-tabs>
		  </template>
			<div class="flex-center-between">
						   <el-space :size="0" direction="vertical">
							<div class="sum-data">456</div>
							<span class="font-extraSmall">总销量</span>
						   </el-space>
						   <el-radio-group v-model="radiotime" size="small">
						         <el-radio-button label="30天" />
						         <el-radio-button label="60天" />
						         <el-radio-button label="90天" />
						       </el-radio-group>
			</div>
		<div id='salechart' style='height:160px;width:100%'>
		 
		</div>
	</el-dialog>
</template>

<script>
	import * as echarts from 'echarts'
	import { ElDivider } from 'element-plus'
	import {ref,reactive,onMounted,watch,h} from 'vue'
	export default{
		setup(){
			let radiotime=ref("30天")
			let activeName = ref('us')
			let salechartVisible = ref(false)
			let productData = reactive({})
			let spacer = h(ElDivider, { direction: 'vertical' })
			onMounted(()=>{
			})
			function saleChart(){
				var myChart = echarts.init(document.getElementById('salechart'))
				var option = {
				     tooltip : {
							trigger : 'axis',
						},
				      legend:{
						  type: "plain",
						  icon: "circle",
						   itemWidth: 8,
					  },
				      xAxis: {
								boundaryGap:false,
								data: ["02-11","02-12","02-13","02-14","02-15","02-16","02-17"],
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
				      series: [{
				          smooth: 0.5,
				          name: 'kq002',
				          type: 'line',
								data: [15, 25, 30, 20, 18, 24,18],
								lineStyle:{
									color:'#FF6700',
								},
								itemStyle:{
									color:'#FF6700',
								},
								label:{
									show: true,
								}, 
								 markLine: {
								      data: [{
								        type: "average"
								      }],
								    },
				      }]
				}
				 
				 myChart.setOption(option);
				 window.addEventListener('resize',()=>{
						   myChart.resize();
				 })
			}
			return{
				salechartVisible,productData,saleChart,activeName,spacer,
				radiotime,
			}
		}
	}
</script>

<style >
.chart-tabs-dialog	.sum-data{
		font-size: 18px;
		font-weight: 600;
		color:var(--el-text-color-primary);
	}
</style>


