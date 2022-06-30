<template>
 <el-col :span='12'>
		  <el-space style='margin-bottom:8px;'>
		    <span class='pag-title'>广告表现</span><span class='pag-small-Extra'>2022-02-11 ~ 2022-02-17</span>
		  </el-space>
		  <div class='pag-radius-bor'>
		<div class='ch-da-toggle'>
			<el-space :size="16" spacer="|">
                <div v-for='(a,index) in adData' :key='index' class="data-group">
			   <div >
               <div style='font-size:12px;color:#666'>{{a.label}}</div>
               <div class='pag-data-num' style='margin:0'>{{a.data}}</div>
			   </div>
			   <el-checkbox v-model="a.checked"  label="" size="large"></el-checkbox>
            </div>
			</el-space>
		 </div>
			  <div id='adchart' style='height:306px;width:100%'>
			  </div>
		  </div>
	 </el-col>
</template>
<script>
import * as echarts from 'echarts'
export default{
	 name: 'Adchart',
	 components:{},
	 setup(){
      let adData = [{
		  label:'广告销售额($)',
		  data:'845,788,78.38',
		  checked:true,
	  },
	  {
		  label:'广告花费',
		  data:'78,344,64.78',
		  checked:true,
	  },
	  {
		  label:'广告订单量',
		  data:'29478',
	  },
	  {
		  label:'ACOS',
		  data:'36.5%',
	  },
	  ]
           //返回数据
		 return{
          adData,
		 }
		 
	 },
	  mounted(){
	  var myChart = echarts.init(document.getElementById('adchart'))
	  var option = {
           tooltip : {
			trigger : 'axis',
		},
            legend: {
				data:['广告销售额','广告花费'],
				right:0,
				top:16,
				icon: "circle",
				itemWidth:6,
				itemHeight:6
				
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
            series: [{
                smooth: 0.5,
                name: '广告销售额',
                type: 'line',
				data: [22452, 27564, 18958,19861, 28994, 21859,23648],
				lineStyle:{
					color:'#409eff',
				},
				itemStyle:{
					color:'#409eff',
				}
			},
			{
                smooth: 0.5,
                name: '广告花费',
                type: 'line',
				data: [2452, 7564, 8958,9861, 8994, 1859,3648],
				lineStyle:{
					color:'#FF6700',
				},
				itemStyle:{
					color:'#FF6700',
				}
            }]
	  }
	   
	   myChart.setOption(option);
	   window.addEventListener('resize',()=>{
		   myChart.resize();
	   })
  }
}
</script>
<style>
.ch-da-toggle {margin:8px 0px;}
.ch-da-toggle .el-checkbox{margin-left:auto;}
.ch-da-toggle .el-space{display:flex}
.ch-da-toggle .el-space__item{width:100%}
.ch-da-toggle span{color:var(--el-border-color-base)}
</style>
