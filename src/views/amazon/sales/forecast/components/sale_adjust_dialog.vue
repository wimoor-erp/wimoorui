<template>
	<el-dialog title="日均销量干预" v-model="dialog.visible" @close="handleClose" @opened = "handleOpen" :append-to-body="true" width="65%">
		<el-row :gutter="24">
			<el-col :span="10">
           <div class="flex-center-between">
			   <el-image class="product-img" :src="data.image"></el-image>
			   <div class="pro-message">
				   <div class="name">{{data.name}}</div>
				   <div class="sku">{{data.sku}}</div>
					   <el-space class="data-group" :size="32">
						   <div>{{data.summonth}}<p >月销 </p></div>
						   <div>{{data.sumseven}}<p >周销</p></div>
						   <div>{{data.sysavgsales}}<p >日均</p></div>
					   </el-space>
			   </div>
		   </div>		
			</el-col>
			<el-col :span="14">
				<div class="gary-bg  p-16">
					<el-tabs  tab-position="left" style="height: 200px" class="demo-tabs">
					    <el-tab-pane label="近期">
							<el-form label-width="120px"  >
											 <el-form-item   label="预计日均销量">
												 <div class="flex-center-between" style="flex: 1;">
													 <el-input   
													 ref="preinputRef" clearable 
													 autofocus  v-model="presale" 
													 @input="presale=CheckInputInt(presale)"
													 style="width: 120px;"></el-input>
												 </div>
											 </el-form-item>
											  <el-form-item>
												 <el-radio-group v-model="lastType" size="small">
												       <el-radio-button :label="30" >近1个月</el-radio-button>
												       <el-radio-button :label="60" >近2个月</el-radio-button>
												       <el-radio-button :label="90" >近3个月</el-radio-button>
												       <el-radio-button :label="180" >近半年</el-radio-button>
													   <el-radio-button :label="365" >近1年</el-radio-button>
												     </el-radio-group>
										 </el-form-item>
											 
											 <el-form-item>
											 	 <el-button type="primary" :loading="saveloading" @click="submitFormLast" >保存</el-button> 
											 </el-form-item>
							</el-form>
	
						</el-tab-pane>
					    <el-tab-pane label="区间">
							<el-form label-width="120px"  >
											 <el-form-item   label="预计日均销量">
												 <div class="flex-center-between" style="flex: 1;">
													 <el-input autofocus  
													   clearable v-model="presaleRange" 
													   	@input="presaleRange=CheckInputInt(presaleRange)"
													   style="width: 120px;"></el-input>
												 </div>
											 </el-form-item>
											 <el-form-item label="预估时间段">
											 		 <el-date-picker
											 		        v-model="dateRange"
											 		        type="daterange"
											 		        unlink-panels
											 		        range-separator="至"
											 		        start-placeholder="结束时间"
											 		        end-placeholder="开始时间"
															:disabled-date="disableDate"
											 		        :shortcuts="shortcuts"
											 		        :size="size"
											 		      />
											 <p class="font-extraSmall line-h-16">不选择时间段，则干预时间默认360天！</p>			  
											 </el-form-item>
											 <el-form-item >
												 
											 			<el-button :loading="saveloading" @click="submitFormRange" >添加时间段区间</el-button>
											 </el-form-item>
							</el-form>
						</el-tab-pane>
					    <el-tab-pane label="按月">
							 <el-space wrap>
							 <div v-for="item in listPresale">
								 <span v-if="item.month>=10">{{item.month}}</span>
								 <span v-else style="padding-left:8px;">{{item.month}}</span>月
								 <el-input type="number" autofocus 
								 v-model="item.amount" 
								@input="item.amount=CheckInputInt(item.amount)"
								 clearable style="width: 80px;"></el-input>
							 </div>
							   </el-space>     
							 
						   <el-button type="primary" :loading="saveloading" @click="submitFormMonth" style="margin-top:5px;margin-right:40px;float:right">保存</el-button>
						</el-tab-pane>
					  </el-tabs>
			 
				 </div>
			</el-col>
		</el-row>
		<el-row class="m-t-16">
			<el-col :span="24">
				    <el-radio-group v-model="radiotype" @change="handleQuery" size="small">
				       <el-radio-button label="预估销量" />
				       <el-radio-button label="往年同期" />
				     </el-radio-group>
				<div v-if="radiotype=='预估销量'" :id="chartid" style='height:160px;width:100%'>
				 
				</div>
				<div v-else id="calendar" style='height:300px;width:100%'></div>
			</el-col>
		</el-row>
	<template #footer>
		<el-button @click="handleClose">关闭</el-button>
		<el-button @click="handleDelete">清空干预</el-button>
	</template>	
	</el-dialog>
</template>

<script setup>
	import{ref,reactive,toRefs,onMounted,nextTick}from"vue"
	import {Close} from '@element-plus/icons-vue';
	import * as echarts from 'echarts';
	import {getSales,save,clear,getProductPreSalesByMonth,getProductPreSales} from "@/api/amazon/listing/preSalesApi.js";
	import {CheckInputInt} from "@/utils/index.js";
	import { ElMessage, ElMessageBox } from 'element-plus'
	const preinputRef=ref()
	const emit = defineEmits(['confirm']);
	const state=reactive({
		  dialog:{visible:false},
		  lastType:90,
		  presale:"",
		  presaleRange:"",
		  chartid:"adjustchart",
		  radiotype:"预估销量",
		  itemrow:{},
		  dateRange:{},
		  saveloading:false,
		  listPresale:[],
		  parentrow:{},
		  data:{name:"",sku:"",image:""},
	})
	const {
	  formData,radiotype,dialog,data,lastType,chartid,presale,listPresale,presaleRange,dateRange,saveloading
	} = toRefs(state);
	var myChart =null ;
	function show(itemrow,parentrow){
		state.data.name=parentrow.name;
		state.data.sku=itemrow.sku;
		state.parentrow=parentrow;
		state.data.summonth=itemrow.summonth;
		state.data.sumseven=itemrow.sumseven;
		state.data.sysavgsales=itemrow.sysavgsales;
		state.data.image=parentrow.image;
		if(itemrow.shipday){
		   state.data.shipday=parseInt(itemrow.shipday);
		   state.data.avgsales=parseInt(itemrow.avgsales);
		}
		state.itemrow=itemrow;
		state.dialog.visible=true;
	}
	onMounted(()=>{
		var date=new Date();
		state.chartid="adjustchart"+date.getTime();
		for(var i=1;i<=12;i++){
			var month=date.format("yy-MM");
			state.listPresale.push({month:month,amount:"",index:i,date:date});
			date=date.clone();
			date=date.setMonth(date.getMonth() +1);
			date=new Date(date); 
			date=date.setDate(1);
			date=new Date(date); 
		}
		 
	})
	
	defineExpose({
	  show
	})
	 function handleOpen(){
		 
		 setTimeout(()=>{
		       preinputRef.value.focus();
			    handleQuery();
		 },500);
		
	 }
	 function handleClose(){
		 if(myChart!=null){
			 myChart.dispose();
		 }
		 state.dialog.visible=false;
	 }
	 function disableDate(date){
		 var value=new Date(date);
		  value=value.setDate(date.getDate()+1);
		  value=new Date(value);
		 if(value>new Date())return false;
		 return true;
	 }
	 function handleSave(preSaleList){
		 state.saveloading=true;
		 save(preSaleList).then(res=>{
			         state.saveloading=false;
		 			 ElMessage({ message: "保存成功", type: 'success', });
					 emit("confirm",state.parentrow);
		 			 handleQuery()
		 }).catch(e=>{
			  state.saveloading=false;
		 })
	 }
	 function submitFormMonth(){
		 var preSaleList=[];
		 var monthdata={};
		 state.listPresale.forEach(item=>{
			 monthdata[item.index]=item;
		 });
		 for(var i=1;i<=12;i++){
		 			 var amount=monthdata[i].amount;
		 			 if(amount!=""){
		 				 var start= monthdata[i].date.clone();
		 				 var end = start.clone();
		 				 end=end.setMonth(end.getMonth() +1);
		 				 end=new Date(end); 
		 				 end=end.setDate(1);
		 				 end=new Date(end); 
						 var daynum=0;
		 				 while(start<end){
							  start=start.clone();
							  start=start.setDate(start.getDate()+1);
							  start=new Date(start);
		 					 daynum++;	  
		 				 }
						monthdata[i].daynum=daynum; 
		 			 }
		 }
		 for(var i=1;i<=12;i++){
			 var amount=monthdata[i].amount;
			 if(amount!=""){
				 var sub=amount%monthdata[i].daynum;
				 var myamount=parseInt(amount/monthdata[i].daynum);
				 var start= monthdata[i].date.clone();
				 var end = start.clone();
				 end=end.setMonth(end.getMonth() +1);
				 end=new Date(end); 
				 end=end.setDate(1);
				 end=new Date(end); 
				 while(start<end){
				 			  var param={};
				 			  param.sku=state.itemrow.sku;
				 			  param.groupid=state.itemrow.groupid;
				 			  param.amazonauthid=state.itemrow.amazonauthid;
				 			  param.marketplaceid=state.itemrow.marketplaceid;
				 			  param.quantity=myamount;
							  if(sub>0){
								   param.quantity=param.quantity+1;
								   sub=sub-1;
							  }
				 			  param.date=start;
				 			  preSaleList.push(param);
							  start=start.clone();
				 			  start=start.setDate(start.getDate()+1);
				 			  start=new Date(start);
							  
				 }
			 }
		 }
		 handleSave(preSaleList);
	 }
	 function submitFormRange(){
	       var start=state.dateRange[0];
		   var end=state.dateRange[1];
		   var preSaleList=[];
		   if(state.presaleRange==""){
		   			  ElMessage({ message: "预设销量不能为空", type: 'error', });
		   			  return ;
		   }
		   if(!state.dateRange || !state.dateRange[0]){
		   			  ElMessage({ message: "预估时间段不能为空", type: 'error', });
		   			  return ;
		   }
		   while(start<=end){
			  var param={};
			  param.sku=state.itemrow.sku;
			  param.groupid=state.itemrow.groupid;
			  param.amazonauthid=state.itemrow.amazonauthid;
			  param.marketplaceid=state.itemrow.marketplaceid;
			  param.quantity=state.presaleRange;
			  param.date=start;
			  preSaleList.push(param);
			  start=start.clone();
			  start=start.setDate(start.getDate()+1);
			  start=new Date(start); 
		   }
		 handleSave(preSaleList);
	 }
	 function submitFormLast(){
		 var preSaleList=[];
		 var date=new Date();
		 if(state.presale==""){
			  ElMessage({ message: "预设销量不能为空", type: 'error', });
			  return ;
		 }
		 for(var i=1;i<=state.lastType;i++){
			 var param={};
			 param.sku=state.itemrow.sku;
			 param.groupid=state.itemrow.groupid;
			 param.amazonauthid=state.itemrow.amazonauthid;
			 param.marketplaceid=state.itemrow.marketplaceid;
			 param.quantity=state.presale;
			 param.date=date;
			 preSaleList.push(param);
			 date=date.clone();
			 date=date.setDate(date.getDate()+1);
			 date=new Date(date);
		 }
		handleSave(preSaleList);
	 }
	 function handleDelete(){
		 var param={};
		 param.sku=state.itemrow.sku;
		 param.groupid=state.itemrow.groupid;
		 param.amazonauthid=state.itemrow.amazonauthid;
		 param.marketplaceid=state.itemrow.marketplaceid;
		 clear(param).then(res=>{
		 			 ElMessage({ message: "清除成功", type: 'success', });
		 			 handleQuery();
					 emit("confirm",state.parentrow);
		 })
	 }
	 function handleQuery(){
	 		 var data={};
	 		 data.marketplaceid=state.itemrow.marketplaceid;
	 		 data.amazonauthid=state.itemrow.amazonauthid;
	 		 data.sku=state.itemrow.sku;
	 		 if(state.radiotype=="预估销量"){
	 			 getSales(data).then(res=>{
	 			 	 saleChart(res.data);
	 			 })
	 		 }else{
	 			 data.groupid=state.itemrow.groupid;
	 			 //加载月度图表
	 			 getProductPreSalesByMonth(data).then((res)=>{
					 chartPreSale(res.data,"month");
	 			 })
	 		 }
	 		
	 	 }
	function saleChart(chart){
		nextTick(()=>{
			var saleschart=document.getElementById(state.chartid);
			if(myChart!=null){
			   myChart.dispose();
			}
			myChart = echarts.init(saleschart);
			var myseries=[];
			 chart.lines.forEach(line=>{
			 	 var point1=[];
				 var yAxisList=[];
			 	 if(line.markpoint&&line.markpoint.length>0){
			 		 line.markpoint.forEach(item=>{
			 		 							point1.push({
			 		 								value:item.value,
			 		 								name:item.name,
			 		 								xAxis:item.xaxis,
			 		 								yAxis:item.yaxis,
			 										 label:{
			 												 color:"#fff",
			 											},
			 											color:"#333",
			 		 							}) 
												yAxisList.push(item.xaxis);
			 		 						 })
			 	 }
				 
				window.yAxisList=yAxisList;
				 
				var line={
			           smooth: 0.5,
			           name: line.name,
			 		   showAllSymbol:false,
			           type: 'line',
			 				data: line.data,
			 				lineStyle:{
			 					color:'#FF6700',
			 				},
			 				itemStyle:{
			 					color:'#FF6700',
			 				},
			 				label:{
			 					show: true,
			 				},
			       };
				if(point1&&point1.length>0){
					 line.markPoint={
									   symbolSize:5, 
									   itemStyle : {
											normal : {
												color : '#FF6700',
												label : {
													show: false,
												}
											}
										},
										data :point1,
			 		               };
				}
				var startday="";
				var endday="";
				if(state.data.shipday){
					chart.labels.forEach((item,index)=>{
						if(index==0){
						   startday=item;
						}
						if(index==state.data.shipday){
							endday=item;
						}
					});
					line.markArea= {
					  itemStyle: {
					    color: 'rgba(255, 220, 213, 0.4)'
					  },
					
					  label:{
						  position: ['50%', '50%']
					  },
					     emphasis: {
					         label:{
					         	 position: ['50%', '50%']
					         },
							 itemStyle: {
							   color: 'rgba(255, 195, 180, 0.4)'
							 },
					        },
					  data: [
					    [
					      {
					        name: '备货周期'+state.data.shipday+"天",
							value:state.data.avgsales,
					        xAxis: startday
					      },
					      {
					        xAxis: endday
					      }
					    ],
					  ]
					}
				}
				
			 	myseries.push(line);
			 }) 
			 var option = {
			     tooltip : {
			     				backgroundColor:'rgba(0,0,0,0.8)',
			     				show: true ,
			     				position: 'bottom',
			     				formatter : function(params){
			     					if(params != null){
										if(params.name.indexOf("备货周期")>=0){
											
											 return params.name +"<br>"+"平均日销量："+params.value ;
										}else{
											var title="系统预估销量";
											if(window.yAxisList&&window.yAxisList.includes(params.name)){
											  title="手动预估销量";	
											}
											return "日期:  "+params.name +"<br>"+title+": "+ params.value;
										}
										
			     					}
			     				},
			 					label:{
			 						show:true,
			 					    color:"#333",
			 					 },
			 					 textStyle:{
			 						 color:"#fff"
			 					 },
			 					borderColor:"#000",
			     				trigger: 'item',
			     				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			     					type : 'line', 
			     					axis: 'auto' ,// 默认为直线，可选为：'line' | 'shadow'
			     			        lineStyle : {          // 直线指示器样式设置
			     			        	color: '#333',
			     			            width: 1,
			     			            type: 'solid'
			     			        },
			     			    }
			     			},
			       legend:{
			 		  type: "plain",
			 		  icon: "circle",
			 		   itemWidth: 8,
			 	  },
			       xAxis: {
			 		boundaryGap : true, 
			 						data : chart.labels,
			 						axisLabel:{
			 							show : true,
			 							textStyle:{
			 								color:'#999'
			 							}
			 						},
			 						splitLine:{
			 							 show:false
			 				        } ,
			 						axisLine:{
			 							lineStyle:{
			 								color:'#eee',
			 								width:1,// 这里是为了突出显示加上的
			 							}
			 						}
			 				
			 			},
			 		
			 			grid : {
			 					x:50,
			 					x2:45,
			 					y : 30,
			 					y2: 30,
			 					borderWidth : 0,
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
		});
	}
	const shortcuts= [
	  {
	    text: '未来7天',
	    value: () => {
	      const start = new Date()
	      const end = new Date()
	      end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
	      return [start, end]
	    },
	  },
	  {
	    text: '未来30天',
	    value: () => {
	      const start = new Date()
	      const end = new Date()
	      end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
	      return [start, end]
	    },
	  },
	  {
	    text: '未来90天',
	    value: () => {
	      const start = new Date()
	      const end = new Date()
	      end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
	      return [start, end]
	    },
	  },
	]
 
 
 var isdown=false;
 var yAx=[];
 var calendarMyChart=null;
 var olddata=[];
 var moveindex=null;
 var stopplus=false;
 function chartPreSale(data,type){
 	//initCalendar(groupid,marketplaceid,sku,rowid,data);
 	calendarMyChart = echarts.init(document.getElementById("calendar"));
 	document.getElementById("calendar").oncontextmenu=function(){return false;}
 	  var symbolSize = 8;
 	  var labeldata=[];
 	  var color=[];
 	  olddata=data;
 	  var serialdata = [];
 	  var oldserialdata  =[]
 	  for(var i=0;i<data.length;i++){
 	      var holiday="";
 		  if(data[i]["holiday"]){
 			  holiday=data[i].holiday;
 		  } 
 		  if(data[i].value){
 			  var item={value:data[i].value,date:data[i].date,holiday:holiday, itemStyle:{normal:{color:'#00a65a'}}};
 			  serialdata.push(item);
 		  }else{
 			  var item={value:data[i].oldvalue,date:data[i].date,holiday:holiday, itemStyle:{normal:{color:'#808080'}}};
 			  serialdata.push(item);
 		  }
 		  if(data[i].oldvalue){
 			  var item={value:data[i].oldvalue,date:data[i].date,holiday:holiday, itemStyle:{normal:{color:'#808080'}}};
 			  oldserialdata.push(item);
 		  }else{
 			  var item={value:0,date:data[i].date,holiday:holiday, itemStyle:{normal:{color:'#808080'}}};
 			  oldserialdata.push(item);
 		  }
 		  yAx.push(0);
 	      labeldata.push(data[i].date);
 	  }
 	  var option = {
 	      tooltip: {
 	            trigger: 'axis',
 	            formatter: function (option) {
 	            	var holiday="";
 	            	if(option[0].data["holiday"]){
 	            		holiday="<br/>节日："+option[0].data["holiday"];
 	            	}
 	            	  if(option[0].data.itemStyle.color=="#00a65a"){
 	            		  return  "日期:"+option[0].name+"<br>当前预估:"+parseInt(option[0].value)+"<br/>去年同期:"+parseInt(option[1].value)+holiday;
 	            	  }else if(option[0].data.itemStyle.color=="#FA8072"){
 	            		  return  "日期:"+option[0].name+"<br>当前预估:"+parseInt(option[0].value)+"<br/>去年同期:"+parseInt(option[1].value)+holiday;
 	            	  }else{
 	            		  return  "日期:"+option[0].name+"<br>去年同期:"+parseInt(option[1].value)+holiday;
 	            	  }
 		          },
 			  axisPointer: {
 			        lineStyle: {
 			            type: 'dashed'
 			        } 
 			    }
 	        },
 	      grid: {
 	          top:'30px',
 	          bottom:'30px',
 	          left:'50px',
 	          right:'30px'
 	      },
 	      xAxis: {
 	          type: 'category',
 	          data: labeldata,
 	          splitLine:{show:true},
			  
 	      },
 	 
 	      yAxis: {
 	          type: 'value',
 	          axisLabel:{
 	        	  formatter: function (value) {
 	        	      return parseInt(value);
 	        	  }
 	          },
 	          splitLine:{show:false},
 	          scale:false,
 	          minInterval:1
 	      },
 	      series: [
 	          {   id: 'a',
 	              type: 'line',
 	              smooth: false,
 	              symbolSize: symbolSize,
 	              showAllSymbol:true,
 	              data: serialdata,
 	      		  itemStyle:{
 	      		 		normal: {
 	      		 			lineStyle:{
 	                              width:1,
 	                              color:'#ffa400',  
 	                              type:'solid'  //'dotted'虚线 'solid'实线
 	                          },
 	      		 			 label:{
 	      		 		     formatter: function (option) {
 	      			              return  parseInt(option.data.value);
 	      			          },
 	      		 				show: true,
 	      		 				textStyle:{
 	      		 					color:'#999'
 	      		 				},
 	      		 			},
 	      		  
 	      		 		}       
 	      		 	}
 	          },
 	          {   id: 'old',
 	              type: 'line',
 	              smooth: false,
 	              symbolSize: 0,
 	              showAllSymbol:true,
 	              data: oldserialdata,
 	      		  itemStyle:{
 	      		 		normal: {
 	      		 			lineStyle:{
 	                              width:1,
 	                              color:'#b1b1b1',  
 	                              type:'dotted'  //'dotted'虚线 'solid'实线
 	                          },
 	      		 			 label:{
 	      		 		     formatter: function (option) {
 	      			              return  parseInt(option.data.value);
 	      			          },
 	      		 				show: false,
 	      		 				textStyle:{
 	      		 					color:'#797979'
 	      		 				},
 	      		 			},
 	      		  
 	      		 		}       
 	      		 	}
 	          }
 	      ]
 	  };
  
 	 
 	  setTimeout(function () {
 	      // Add shadow circles (which is not visible) to enable drag.
 		  calendarMyChart.setOption(option);
 		  for(var i=0;i<labeldata.length;i++){
 			  // calendarMyChart.on('mousemove', {seriesIndex: 0, name: labeldata[i]}, function (params) {
 				 //   var chartheight=this._coordSysMgr._coordinateSystems[0]._rect.height;
 				 //   var maxchartvalue=this._coordSysMgr._coordinateSystems[0]._axesMap.y[0].scale._extent[1];
 				 //   var moveindex=params.dataIndex;
 		   //  	    if(yAx[moveindex]!=0){
 		   //  	        var movepx=(yAx[moveindex]-params.event.offsetY);
 		   //  	        var movevalue=(movepx/chartheight*maxchartvalue);
 		   //  	          option.series[0].data[moveindex].value=option.series[0].data[moveindex].value+movevalue;
 		   //  	          if(option.series[0].data[moveindex].value<0){
 		   //  	        	  option.series[0].data[moveindex].value=0;
 		   //  	          }
 		   //  	    	  option.series[0].data[moveindex].itemStyle.normal.color="#FA8072";
 		   //  	    	  calendarMyChart.setOption(option);
 			  //   		  yAx[params.dataIndex]=params.event.offsetY;
 			  //   		  moveindex=params.dataIndex;
 			  //   	  }
 		   //  	    stopplus=true;
 		   //  	});
 		 
 			   
 			  // calendarMyChart.on('mousedown', {seriesIndex: 0, name: labeldata[i]}, function (params) {
 		   //  	    yAx[params.dataIndex]=params.event.offsetY;
 		   //  	    stopplus=true;
 		   //  	});
 			  // calendarMyChart.on('mouseout', {seriesIndex: 0, name: labeldata[i]}, function (params) {
 		   //  	    if(moveindex!=null&&params.dataIndex==moveindex){
 		   //  	    	if(maxchartvalue!=this._coordSysMgr._coordinateSystems[0]._axesMap.y[0].scale._extent[1]){
 		   //  	    		maxchartvalue=this._coordSysMgr._coordinateSystems[0]._axesMap.y[0].scale._extent[1];
 		   //  	    	}
 		   //  	    }
 		   //  	});
 		
 		
 			  calendarMyChart.on('contextmenu', {seriesIndex: 0, name: labeldata[i]}, function (params) {
 				  if(olddata[params.dataIndex].oldvalue&& option.series[0].data[params.dataIndex].itemStyle.normal.color!="#808080"){
 			    	       option.series[0].data[params.dataIndex].value=olddata[params.dataIndex].oldvalue;
 			    	       option.series[0].data[params.dataIndex].itemStyle.normal.color="#808080";
 				  }else{
 					  if(olddata[params.dataIndex]["value"]&&params.value!=olddata[params.dataIndex]["value"]){
 						    option.series[0].data[params.dataIndex].value=olddata[params.dataIndex].value;
 				    	    option.series[0].data[params.dataIndex].itemStyle.normal.color="#00a65a";
 					  }else{
 						    if(olddata[params.dataIndex].oldvalue){
 						    	option.series[0].data[params.dataIndex].value=olddata[params.dataIndex].oldvalue;
 						    }else{
 						    	option.series[0].data[params.dataIndex].value=0;	
 						    }
 				    	    option.series[0].data[params.dataIndex].itemStyle.normal.color="#808080";
 					  }
 					    
 				  }
 		    	    calendarMyChart.setOption(option);
 		    	});
  
 			  calendarMyChart.on('click', {seriesIndex: 0, name: labeldata[i]}, function (params) {
 		    	    if("month"==type){
 		    	    	showCalendarByDay(params.name);
 		    	    }else{
						handleQuery();
					}
 		    	});
 		  }
 
 	  },1000);
 }
 
 function showCalendarByDay(month){
 	 var param={};
	 param.sku=state.itemrow.sku;
	 param.groupid=state.itemrow.groupid;
	 param.marketplaceid=state.itemrow.marketplaceid;
	 param.month=month;
 	getProductPreSales(param).then((res)=>{
		chartPreSale(res.data,"day");
	});
 }
    
</script>

<style>
	.line-h-16{
		line-height: 16px;
	}
	.flex-center-between .product-img{
		height: 60px;
		width: 60px;
		overflow:visible;
		margin-right: 16px;
	}
	.flex-center-between .product-img img{
		height: 60px;
		width: 60px;
	}
	.pro-message .sku{color: var(--el-color-blue);margin-top:8px;margin-bottom:16px;}
	.data-group p{
		font-size: 12px;
		color: var(--el-text-color-placeholder);
	}
	.data-group div{
		text-align: center;
	}
	.p-16{
		padding-top: 16px;
	}
	.m-t-16{margin-top:16px;}
	.m-c{background-color:#fff!important;line-height:16px;}
</style>
