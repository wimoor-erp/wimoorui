<template>
     <div class="gird-line-right">
		<el-card >
			<el-row gutter="16" >
				<el-col :span="16">
				<div class="p-b-h">
				<div><el-image class="img-size" src="https://wimoor-file.oss-cn-shenzhen.aliyuncs.com/amz/photos/productImg/26138972975530085/26138972975530169/ATVPDKIKX0DER/1657993154268189.jpg"></el-image></div>
				<div>
					<div class="name">
						FAWFW 350 PCS Autumn Table Decorations Scatters Set, 300 Pieces Artificial Maple Leaves Fall Leaves with 50 Pieces Artificial Acorns for Autumn Fall Party Decorations Thanksgiving Day Decorations
					</div>
					<div class="sku">
						A2432KQJYA
					</div>
					<el-space class="font-extraSmall m-t-8" >
						<span>ASIN:B07FSH6YK</span>
						<el-divider direction="vertical"></el-divider>
						<span>首次上架日期:2022-02-20</span>
					</el-space>
					<div class="m-t-8" v-if="textarea!==''">
						<p>备注:{{textarea}}</p>
					</div>
				</div>
				</div>
				</el-col>
				<el-col :span="8" class="text-right">
					<el-space :size="16">
					<el-link @click="editRemarks" title="编辑备注" class="flex-center" :underline="false" >
						 <el-icon class="font-medium"><Edit /> </el-icon>&nbsp;备注
					</el-link>
					<el-link title="跳转亚马逊" class="flex-center" :underline="false" >
						 <el-icon class="font-medium"><Link/></el-icon>&nbsp;跳转
					</el-link>
					</el-space>
				</el-col>
				</el-row>
		</el-card>
		<el-tabs
		    v-model="activeName"
		    type="card"
		    class="card-top-tabs m-t-16"
		    @tab-click="handleClick"
		  >
		    <el-tab-pane label="指标数据" name="first"></el-tab-pane>
		    <el-tab-pane label="销售详情" name="third"></el-tab-pane>
			<el-tab-pane label="成本费用" name="second"></el-tab-pane>
		    <el-tab-pane label="库存详情" name="fourth"></el-tab-pane>
		    <el-tab-pane label="商品评价" name="five"></el-tab-pane>
		  </el-tabs>
		<el-card class="p-a-card">
			    <template #header>
			      <div class="flex-center-between ">
					  <el-space>
			       <el-radio-group v-model="radio">
			             <el-radio-button label="昨天" />
			             <el-radio-button label="近7天" />
			             <el-radio-button label="近30天" />
			             <el-radio-button label="近90天" />
			           </el-radio-group>
					   <Datepicker ref="datepickers" @changedate="changedate" />
					   </el-space>
					    <div>
					      <el-checkbox v-model="checked3" label="同期同比" />
					      <el-checkbox v-model="checked4" label="同期环比" />
					    </div>
			      </div>
			    </template>
				<div class="p-a-body">
					  <div class="p-a-left" >
						  <el-card shadow="hover" class="m-b-8" v-for="item in datas" :class="{'active':item.value}">
							  <div class="flex-center-between">
								  <div>
									  <div class="title">{{item.label}}</div>
									  <div class="data">{{item.num}}</div>
								  </div>
								  <div class="text-right">
									  <el-checkbox style="height:14px;margin-bottom:12px;"  v-model="item.value" />
									  <div class="font-extraSmall" >环比前{{item.day}}天</div>
									  <div class="font-12" :class="'text-'+color(item.rate)">{{rate(item.rate)}}</div>
								  </div>
							  </div>
						  </el-card>
					  </div>
					  <div class="p-a-right">
						<el-radio-group v-model="radio2">
						      <el-radio-button label="复合图" />
						      <el-radio-button label="单独图" />
						 </el-radio-group>
						 <div id="salechart" class="my-chart">
							 
						 </div>
					  </div>
				</div>
		</el-card>
	 </div>
	 <el-dialog v-model="remarkVisable" title="备注">
		 <el-input v-model="textarea" type="textarea"  :rows="3"></el-input>
		 <template #footer>
			 <el-button @click="remarkVisable=false">取消</el-button>
			 <el-button type="primary">确认</el-button>
		 </template>
	 </el-dialog>
</template>

<script setup>
	import {Edit,Link} from '@element-plus/icons-vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import {ref,reactive,defineProps,toRefs,onMounted}from"vue"
	import * as echarts from 'echarts'
	let state=reactive({
		remarkVisable:false,
		textarea:'',
		activeName:"first",
		radio:"近7天",radio2:'复合图',
		datas:[
			{label:'销量',num:4564,value:true,day:7,rate:12.0,},
			{label:'访问人数',num:5000,value:false,day:7,rate:-25.0,},
			{label:'页面浏览量',num:10000,value:false,day:7,rate:0,},
			{label:'ACOS',num:0.37,value:false,day:7,rate:0,},
			{label:'广告花费',num:"$3668.54",value:true,day:7,rate:0.6,},
			{label:'广告点击率',num:"-",value:false,day:7,rate:"",},
			{label:'广告转化率',num:"-",value:false,day:7,rate:"",},
		]
	})
	let {activeName,radio,radio2,datas,remarkVisable,textarea,} =toRefs(state);
	onMounted(()=>{
		saleChart();
	})
	function editRemarks(){
		state.remarkVisable = true
	}
	function color(val){
		if(val>0){
			return "green"
		}else if(val<0){
			return "red"
		}else{
			return "info"
		}
	}
	function rate(val){
		console.log(val)
		if(val==''||val==undefined){
			return "-"
		}else{
			if(val>0){
				return "+"+val+'%'
			}else{
				return val+'%'
			}
		}
	}
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
				       type: 'category',
						boundaryGap:false,
						data: ["10-17","10-18","10-19","10-20","10-21","10-22","10-23"],
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
		                bottom:30,
						top:40,
						 
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
		          name: '销量',
				  smooth: 0.5,
		          type: 'line',
						data: [5, 5, 20, 20, 45, 45,45],
						lineStyle:{
							color:'#FF6700',
						},
						itemStyle:{
							color:'#FF6700',
						},
		      },
			  {
			      name: '广告花费',
			  				  smooth: 0.5,
			      type: 'line',
			  						data: [56, 23, 32, 54, 43, 25,32],
			  						lineStyle:{
			  							color:'#409eff',
			  						},
			  						itemStyle:{
			  							color:'#409eff',
			  						},
			  },
			  ]
		}
		 
		 myChart.setOption(option);
		 window.addEventListener('resize',()=>{
				   myChart.resize();
		 })
	}
</script>

<style>
	.my-chart{
		 height:320px;
		 width: 100%;
		 margin-top:16px;
	}
	.m-b-8{margin-bottom:8px;}
	.card-top-tabs .el-tabs__header{
		margin:0;
		margin-bottom: 1px;
		border-bottom:0px;
	}
	.card-top-tabs .el-tabs__header .el-tabs__item.is-active{
		border-bottom: 0px;
		background-color: var(--el-color-primary-light-9);
	}
	.card-top-tabs .el-tabs--card>.el-tabs__header{
		border-bottom:0px;
	}
	.card-top-tabs .el-tabs__item{
		background-color: #fff;
	}
.p-b-h{
	display: flex;
}
.p-b-h .sku{
	margin-top:8px;
	color: var(--el-color-blue);
}
.p-a-left {
	margin-top:16px;
	margin-bottom:16px;
	margin-right:16px;
	width: 240px;
}
.p-a-left .title{
	color: var(--el-text-color-secondary);
}
.p-a-left .data{
	margin-top:16px;
	font-weight: 700;
	font-size: 18px;
}
.p-a-left .text-green{
	color:var(--el-color-success)
}
.p-a-left .text-red{
	color:var(--el-color-danger)
}
.p-a-left .active{
	border-color:var(--el-color-primary-light-3)
}
.p-b-h .img-size{
	height:80px;
	width: 80px;
	margin-right:16px;
}
.m-t-16{
	margin-top: 16px;
}
.m-t-24{
	margin-top:24px;
}
.p-a-card .el-card__body{
	padding-top: 0;
	padding-bottom: 0;
}
.p-a-left .el-card__body{
	padding-top:8px;
	padding-bottom: 8px;
}
.p-a-body{
	display: flex;
}
.p-a-right{
	border-left:1px solid var(--el-border-color-base);
	padding:16px;
	padding-right:0px;
	flex:1;
}
</style>
