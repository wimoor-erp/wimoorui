<template>
	<el-dialog
	title="广告图表"
	v-model="visible"
	width="80%"
	>
   <el-row :gutter="16">
	   <el-col :span="5" class="data-item" :class="{'active':item.check}"  v-for="item in adList">
		   <el-card shadow="hover" @click.stop="getSelectData(item)">
			  <div class='flex-center-between'>
				  <div>
					  <p class="text-gray">{{item.name}}</p>
					  <span class="font-large font-bold">{{item.value}}</span>
				  </div>
				  <div class="font-extraSmall text-right">
					  <p v-if="item.rate" :class="item.rate>0?'text-green':'text-red'">{{item.rate}}%</p>
					  <p v-else>-</p>
					<span> 较{{item.date}}</span>
				  </div>
			  </div>
		   </el-card>
	   </el-col>
  </el-row>
  <el-row>
	   <el-radio-group v-model="radio">
	        <el-radio-button label="日" />
	        <el-radio-button label="周" />
	        <el-radio-button label="月" />
	      </el-radio-group>
	  <div id="adchart" style='height:320px;width:100%'>
		  
	  </div>
  </el-row>
	<template #footer>
		<el-button @click="visible=false">关闭</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import {ref,reactive,toRefs,nextTick} from"vue"
	import * as echarts from 'echarts';
	const state = reactive({
		radio:'日',
		visible:false,
		adList:[
			{name:'曝光量',value:'456,120',rate:'+1.0',date:'昨日',},
			{name:'花费',value:'$89,120.02',rate:'',date:'昨日',},
			{name:'销量',value:'999',rate:'-0.2',date:'昨日',},
			{name:'点击量',value:'2,896',rate:'-6.5',date:'昨日',},
			{name:'点击率',value:'21.25%',rate:'',date:'昨日',},
			{name:'ACOS',value:'36.55%',rate:'',date:'昨日',},
			{name:'ROAS',value:'92.14%',rate:'',date:'昨日',},
			{name:'转化率',value:'92.14%',rate:'',date:'昨日',},
			{name:'每次点击费用',value:'$2.02',rate:'+2.3',date:'昨日',},
		],
	})
	const{
		visible,
		adList,
		radio,
	}=toRefs(state)
	defineExpose({
		show,
	})
	const dataSort = ref(['曝光量','点击率'])
	const loadSelect = function(){
		state.adList.forEach((item)=>{
			if(dataSort.value[0]==item.name||dataSort.value[1]==item.name){
				item.check = true
			}
		})
	}
	function getSelectData(item){
				 /* 不点击自己 */
				     if(dataSort.value.some(a=>a==item.name)){
						 return;
					 } 
					  item.check = true
					  dataSort.value.push(item.name)
					  state.adList.forEach((i)=>{
					  				if(i.name == dataSort.value[0]){
					  					i.check = false
					  				}
					  })
					  dataSort.value.shift()
	}
   function show(){
	   state.visible = true
	   loadSelect()
	  nextTick(()=>{
	 	adChart()
	 })
   }
   
   function adChart(){
	   var myChart = echarts.init(document.getElementById('adchart'));
	    var option = {
			grid:{
				left:'0%',
				right:'2%',
				containLabel: true,
			},
			  tooltip:{
			    trigger: 'axis'
			  },
		   legend: {
		    data: [dataSort.value[0],dataSort.value[1],],
			icon: "circle",
			itemWidth:6,
			itemHeight:6,
		   },
	   	    xAxis: {
	   	       type: 'category',
	   	       data: ['7-22',],
			   axisLine:{
			   show: false
			   },
		       axisTick: {
		        show: true
		      },
			   axisLabel:{
			    color:"#acb0b9"
			   },
	   	     },
	   	     yAxis: [{
				  type: 'value',
				position: 'left',
	   	       axisLabel:{
	   	        color:"#acb0b9"
	   	       },
	   	       splitLine:{
	   	       	lineStyle:{
	   	       	color:"#F2F3F6"
	   	       	}
	   	       }
	   	     },
			 {
				  type: 'value',
			       position: 'right',
			       axisLabel:{
			        color:"#acb0b9"
			       },
			       splitLine:{
					    show: false,  
			       },
			       axisLabel: {
					   formatter: function (value) {
					       return value* 100 + '%';
					   }
			       }
			     },
			 ],
			  color:['#409eff','#FF6700',],
	   	     series: [
				 
	   	       {
				 name:dataSort.value[0], 
	   	         data: [1558,],
	   	         type: 'line'
	   	       },
			   {
				 yAxisIndex: 1,
			   	 name:dataSort.value[1], 
			     data: [0.25,],
			     type: 'bar'
			   }
	   	     ],
	    }
	    myChart.setOption(option);
	    window.addEventListener('resize',()=>{
	    myChart.resize();
	    })
   }
</script>
<style>
	.data-item .el-card__body{
		background-color:#f5f5f5;
		padding:16px;
	}
	
	.data-item.active .el-card__body{
		background-color:#fff5ee;
	}
	.data-item.active .el-card{
		border:1px solid #ffac73;
		color:#ff6700;
	}
	.data-item.active .text-gray{
		color:#ff9853;
	}
</style>
<style scope>
	.data-item{
		    max-width:20%;
		    flex: 0 0 20%;
			margin-bottom:16px;
			cursor:pointer;
	}
	.text-gray{
		color:#777;
	}

</style>