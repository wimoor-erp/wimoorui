<template>
	<div class='pag-radius-bor '>
	 <el-tabs v-model="activeName"  @tab-click="handleClick">
	    <el-tab-pane label="广告数据分析" name="1"></el-tab-pane>
	    <el-tab-pane label="广告报表统计" name="2"></el-tab-pane>
	  </el-tabs>
	  <div class="con-header">
		  <div  v-if="activeName=='1'">
	  <el-row class="flex-center-between " >
		  <el-space>
		  <Datepicker ref="datepickersRef" :days="1" class="date-picker-width"   @changedate="changedate" />
		    <el-radio-group class="el-radio-group-button" v-model="times" @change="changeTimes">
		       <el-radio-button label="昨天" />
		       <el-radio-button label="近7天" />
		       <el-radio-button label="近30天" />
		     </el-radio-group>
			 <AdGroup  :border="true"/>
		 </el-space>
		 <el-radio-group class="el-radio-group-button" v-model="times" @change="changeTimes">
		    <el-radio-button label="美元" />
		    <el-radio-button label="人民币" />
		  </el-radio-group>
	  </el-row>
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
	  	  <div id="adchart" style='height:320px;width:100%'>
	  		  
	  	  </div>
	  </el-row>
	  </div>
	  <div v-else>
		  <el-row>
			  <el-col :span="24">
			<div class='flex-center-between'>
				<el-space>
			  <Datepicker  type="monthrange"  ref="datepickersRef" :days="1" class="date-picker-width"   @changedate="changedate" />
			  <AdGroup  :border="true"/>
			  </el-space>
			  <el-radio-group class="el-radio-group-button" v-model="times" @change="changeTimes">
			     <el-radio-button label="美元" />
			     <el-radio-button label="人民币" />
			   </el-radio-group>
			  </div>	  
			  </el-col>
		  </el-row>
		  <table class="sd-table" cellpadding="0" cellspacing="0">
			  <thead>
				  <tr>
				    <th>项目</th>
					<th>2023-05</th>
					<th >合计</th>
				  </tr>
			  </thead>
			  <tbody>
				  <tr v-for="(item,index) in rows">
					 <td>
						 <el-space>
						 <span class="circle" :class="'text-'+item.group"></span>{{item.name}}
						 </el-space>
						 </td> 
					 <td>￥152</td> 
					 <td class="font-bold">￥152</td> 
				  </tr>
				  
			  </tbody>
		  </table>
	  </div>
	  </div>
	</div>
</template>

<script setup>
	import{ref,reactive,toRefs,onMounted}from'vue'
	import Datepicker from '@/components/header/datepicker.vue';
	import '@/assets/css/packbox_table.css'
	import AdGroup from '@/components/header/ad_group.vue';
	import * as echarts from 'echarts';
	const state = reactive({
		activeName:'1',
		adList:[
			{name:'销售额',value:'$456,120',rate:'+1.0',date:'昨日',},
			{name:'广告销售额',value:'$456,120',rate:'+1.0',date:'昨日',},
			{name:'曝光量',value:'456,120',rate:'+1.0',date:'昨日',},
			{name:'花费',value:'$89,120.02',rate:'',date:'昨日',},
			{name:'销量',value:'999',rate:'-0.2',date:'昨日',},
			{name:'点击量',value:'2,896',rate:'-6.5',date:'昨日',},
			{name:'点击率',value:'21.25%',rate:'',date:'昨日',},
			{name:'ACOS',value:'36.55%',rate:'',date:'昨日',},
			{name:'ACOAS',value:'15.55%',rate:'',date:'昨日',},
			{name:'ROAS',value:'92.14%',rate:'',date:'昨日',},
			{name:'转化率',value:'92.14%',rate:'',date:'昨日',},
			{name:'每次点击费用',value:'$2.02',rate:'+2.3',date:'昨日',},
		],
		dataSort:['曝光量','点击率'],
		rows:[
			{name:'广告销售额',group:"yellow"},
			{name:'有广告的ASIN数量' ,group:"yellow"},
			{name:'有广告的ASIN数量占比',group:"yellow"},
			{name:'广告组数量',group:"blue"},
			{name:'广告贡献的销售额',group:"blue"},
			{name:'广告贡献的销售额占比',group:"blue"},
			{name:'点击/展示比率(CTR)',group:"blue"},
			{name:'广告点击量',group:"green"},
		],
	})
	const{	
		activeName,
		adList,
		dataSort,
		rows,
	}=toRefs(state)
	const loadSelect = function(){
		state.adList.forEach((item)=>{
			if(state.dataSort[0]==item.name||state.dataSort[1]==item.name){
				item.check = true
			}
		})
		adChart()
	}
	onMounted(()=>{
		loadSelect()
	})
	function getSelectData(item){
				 /* 不点击自己 */
				     if(state.dataSort.some(a=>a==item.name)){
						 return;
					 } 
					  item.check = true
					  state.dataSort.push(item.name)
					  state.adList.forEach((i)=>{
					  				if(i.name == state.dataSort[0]){
					  					i.check = false
					  				}
					  })
					  state.dataSort.shift()
					  adChart()
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
			    data: [state.dataSort[0],state.dataSort[1],],
				icon: "circle",
				itemWidth:6,
				itemHeight:6,
			   },
		   	    xAxis: {
		   	       type: 'category',
		   	       data: ['7-22','7-23','7-24','7-25','7-26','7-27',],
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
					 name:state.dataSort[0], 
		   	         data: [1558,880,860,310,330,100,180,],
		   	         type: 'line',
					 smooth:true,
		   	       },
				   {
					 yAxisIndex: 1,
				   	 name:state.dataSort[1], 
				     data: [0.25,0.36,0.46,0.28,0.33,0.18,0.36],
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
		font-size:14px;
	}
    .circle{
		width:6px;
		height:6px;
		border:2px solid;
		border-radius: 4px;
	}
</style>