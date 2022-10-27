<template>
 <el-col :span='12'>
		  <el-space style='margin-bottom:8px;'>
		    <span class='pag-title'>销售趋势</span><span class='pag-small-Extra'>{{chartTitle}}</span>
		  </el-space>
		  <div class='pag-radius-bor'>
		<div class='ch-da-toggle'>
			<el-space :size="16" spacer="|">
                <div v-for='(h,index) in summarysaleData' :key='index' class="data-group">
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
import { ref,reactive,onMounted,watch } from 'vue'
import summaryDataApi from '@/api/amazon/summary/summaryDataApi'
export default{
	 name: 'Salechart',
	 components:{},
	 props:["parameter"],
	 setup(prop,context){
      let summarysaleData =ref([
	  {
		  label:'销量',
		  data:'0',
		  checked:true,
	  },
	  {
		  label:'订单量',
		  data:'0',
	  },
	  {
		  label:'退货量',
		  data:'0',
	  },
	  ]);
	  let chartTitle=ref("2022-02-11 ~ 2022-02-17");
	  function generalChart(series,label,titles){
	  	  var myChart = echarts.init(document.getElementById('salechart'));
	   
	  	  var option = {
	           tooltip : {
	  			trigger : 'axis',
	  		},
	            legend: {
	  				data:titles,
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
	            series: series
	  	  }
	  	   
	  	   myChart.setOption(option);
	  	   window.addEventListener('resize',()=>{
	  		   myChart.resize();
	  	   })
	  }
	 watch(prop.parameter,(val)=>{
		      prop.parameter.bytime="Daily";
			  chartTitle.value=prop.parameter.beginDate+ " ~ "+prop.parameter.endDate.substring(0,10);
	 		  summaryDataApi.queryChartSales(prop.parameter).then(async (res)=>{
				 let label=res.data.labels;
				 let quantity=res.data.quantityList;
				 let ordernumber=res.data.orderNumberList;
				 let mres=await summaryDataApi.queryChartReturn(prop.parameter);
				 let returnOrder=mres.data.quantityList;
				 let titles=['销量','订单量','退货量'];
				 let series=[];
				 var serieQuantity={
				           smooth: 0.5,
				           name: '销量',
				           type: 'line',
				 				data:quantity,
				 				lineStyle:{
				 					color:'#FF6700',
				 				},
				 				itemStyle:{
				 					color:'#FF6700',
				 				}
				       };
				 var serieoOrdernumber={
					             smooth: 0.5,
					             name: '订单量',
					             type: 'line',
					   				data:ordernumber,
					   				lineStyle:{
					   					color:'#ffff00',
					   				},
					   				itemStyle:{
					   					color:'#ffff00',
					   				}
					         };
			      var serieReturn={
									 smooth: 0.5,
									 name: '退货数量',
									 type: 'line',
										data:returnOrder,
										lineStyle:{
											color:'#ffaaff',
										},
										itemStyle:{
											color:'#ffaaff',
										}
								 };
				series.push(serieQuantity); 
				series.push(serieoOrdernumber); 
				series.push(serieReturn); 
				generalChart(series,label,titles);
			 });
			summaryDataApi.queryChartSalesSummary(prop.parameter).then(async (res)=>{ 
				let mres=await summaryDataApi.queryChartReturnSummary(prop.parameter);
				if(res.data&&res.data.quantity){
					summarysaleData.value[0].data=res.data.quantity;
				}else{
					summarysaleData.value[0].data=0;
				}
				if(res.data&&res.data.ordernumber){
					summarysaleData.value[1].data=res.data.ordernumber;
				}else{
					summarysaleData.value[1].data=0;
				}
				if(mres.data&&mres.data.quantity){
					summarysaleData.value[2].data=mres.data.quantity;
				}else{
					summarysaleData.value[2].data=0;
				}
				 
			});
			  
	 })
           //返回数据
		 return{
          summarysaleData,chartTitle
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
