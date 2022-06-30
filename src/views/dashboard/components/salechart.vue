<template>
 <el-col :span='12'>
		  <el-space style='margin-bottom:8px;'>
		    <span class='pag-title'>销售趋势</span><span class='pag-small-Extra'>2022-02-11 ~ 2022-02-17</span>
		  </el-space>
		  <div class='pag-radius-bor'>
		<div class='ch-da-toggle'>
			<el-space :size="16" spacer="|">
                <div v-for='(h,index) in hissaleData' :key='index' class="data-group">
			   <div >
               <div style='font-size:12px;color:#666'>{{h.label}}</div>
               <div class='pag-data-num' style='margin:0'>{{h.data}}</div>
			   </div>
			   <el-checkbox v-model="h.checked"  label="" size="large"></el-checkbox>
            </div>
			</el-space>
		 </div>
			  <div id='salechart' style='height:304px;width:100%'>
               
			  </div>
		  </div>
	 </el-col>
</template>
<script>
import * as echarts from 'echarts'
export default{
	 name: 'Salechart',
	 components:{},
	 setup(){
      let hissaleData = [{
		  label:'销售金额($)',
		  data:'495,156,98.00',
	  },
	  {
		  label:'销量',
		  data:'89415',
		  checked:true,
	  },
	  {
		  label:'订单量',
		  data:'71988',
	  },
	  {
		  label:'退货量',
		  data:'65',
	  },
	  ]
           //返回数据
		 return{
          hissaleData,
		 }
		 
	 },
	  mounted(){
	  var myChart = echarts.init(document.getElementById('salechart'))
	  var option = {
           tooltip : {
			trigger : 'axis',
		},
            legend: {
				data:['销量'],
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
                name: '销量',
                type: 'line',
				data: [15, 25, 30, 20, 18, 24,18],
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
