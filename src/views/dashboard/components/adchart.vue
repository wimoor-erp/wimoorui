<template>
 <el-col :span='12'>
		  <el-space style='margin-bottom:8px;'>
		    <span class='pag-title'>广告表现</span><span class='pag-small-Extra'>{{chartTitle}}</span>
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
import { ref,reactive,onMounted,watch } from 'vue'
import reportApi from '@/api/amazon_adv/report/reportApi'
import {formatFloat} from '@/utils/index';
export default{
	 name: 'Adchart',
	 components:{},
     props:["parameter"],
     setup(prop,context){
	  let chartTitle =ref();
	  let adData = ref([{
	  		  label:'广告销售额($)',
	  		  data:'',
	  		  checked:true,
	  },
	  {
	  		  label:'广告花费',
	  		  data:'',
	  		  checked:true,
	  },
	  {
	  		  label:'广告订单量',
	  		  data:'',
	  },
	  {
	  		  label:'ACOS',
	  		  data:'0.0%',
	  },
	  ]);
	  function generateChart(label,title,series){
	  	  var myChart = echarts.init(document.getElementById('adchart'))
	  	  var option = {
	           tooltip : {
	  			trigger : 'axis',
	  		},
	            legend: {
	  				data:title,
	  				right:0,
	  				top:16,
	  				icon: "circle",
	  				itemWidth:6,
	  				itemHeight:6
	  				
	            },
	            xAxis: {
	  				boundaryGap:false,
	  				data: label,
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
	            series:series
	  	  }
	  	   
	  	   myChart.setOption(option);
	  	   window.addEventListener('resize',()=>{
	  		   myChart.resize();
	  	   })
	  }
	  
		 watch(prop.parameter,(val)=>{
		 	      chartTitle.value=prop.parameter.beginDate+ " ~ "+prop.parameter.endDate.substring(0,10);
				   let myparam=prop.parameter;
			 
				  myparam.profileid="all";
				  reportApi.getsumproduct(myparam).then((res)=>{
				       adData.value[0].data=res.data.summary.attributedSales;
					   adData.value[1].data=res.data.summary.cost;
					   adData.value[2].data=res.data.summary.attributedUnitsOrdered;
					   adData.value[3].data=formatFloat(res.data.summary.acos)+"%";
		 			   let label=res.data.impressions.listLabel;
					   let title=['广告销售额','广告花费'];
					   let series=[{
					       smooth: 0.5,
					       name: '广告销售额',
					       type: 'line',
							data: res.data.attributedSales.listData,
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
							data:res.data.cost.listData,
							lineStyle:{
								color:'#FF6700',
							},
							itemStyle:{
								color:'#FF6700',
							}
					      }]
					   generateChart(label,title,series);
		 		  });
		 });
		
   
           //返回数据
		 return{
          adData,chartTitle
		 }
		 
	 },
	  
}
</script>
<style>
.ch-da-toggle {margin:8px 0px;}
.ch-da-toggle .el-checkbox{margin-left:auto;}
.ch-da-toggle .el-space{display:flex}
.ch-da-toggle .el-space__item{width:100%}
.ch-da-toggle span{color:var(--el-border-color-base)}
</style>
