<template>
	<el-dialog title="日均销量干预" v-model="salevisable"  @opened = "saleChart" :append-to-body="true" width="60%">
		<el-row :gutter="24">
			<el-col :span="10">
           <div class="flex-center-between">
			   <el-image class="product-img" src="https://photo.wimoor.com/materialImg/a01224a9-ab15-11e6-bab5-00e04c023f0e/1537930888405_after.jpeg"></el-image>
			   <div class="pro-message">
				   <div class="name">防潮包要拿掉 万圣节蛋糕插牌套装（双面纸卡） 60个/包 美国用BXA022方白盒，欧洲用FP开窗 彩盒</div>
				   <div class="sku">B2029FPJJB-60</div>
					   <el-space class="data-group" :size="32">
						   <div>4165<p >月销 </p></div>
						   <div>256<p >周销</p></div>
						   <div>36<p >日均</p></div>
					   </el-space>
			   </div>
		   </div>		
			</el-col>
			<el-col :span="14">
				<div class="gary-bg  p-16">
			 <el-form label-width="120px" :form="formData">
				 <div v-for="(item,index) in formData.saleAera">
				 <el-form-item required label="预计日均销量">
					 <div class="flex-center-between" style="flex: 1;">
						 <el-input v-model="item.sale" style="width: 120px;"></el-input>
						 <el-icon @click="removeSaleAera(index)" class="font-base"><Close /></el-icon>
					 </div>
					 
				 </el-form-item>
				 <el-form-item label="预估时间段">
				 		 <el-date-picker
				 		        v-model="item.time"
				 		        type="daterange"
				 		        unlink-panels
				 		        range-separator="至"
				 		        start-placeholder="开始时间"
				 		        end-placeholder="结束时间"
				 		        :shortcuts="shortcuts"
				 		        :size="size"
				 		      />
				 <p class="font-extraSmall line-h-16">不选择时间段，则干预时间默认360天！</p>			  
				 </el-form-item>
				  </div>
				 <el-form-item >
				 			<el-button @click="addTimeAera">添加时间段区间</el-button>
				 </el-form-item>
			 </el-form>
				 </div>
			</el-col>
		</el-row>
		<el-row class="m-t-16">
			<el-col :span="24">
				<h5>预估销量趋势</h5>
				<div id='salechart' style='height:160px;width:100%'>
				 
				</div>
			</el-col>
		</el-row>
	<template #footer>
		<el-button @click="salevisable=false">取消</el-button>
		<el-button >清空干预</el-button>
		<el-button type="primary">保存</el-button>
	</template>	
	</el-dialog>
</template>

<script setup>
	import{ref,defineExpose,reactive}from"vue"
	import {Close} from '@element-plus/icons-vue';
	import * as echarts from 'echarts'
	let salevisable =ref(false)
	defineExpose({
	  salevisable
	})
	let formData=reactive({
		state:true,
		saleAera:[
			{sale:'',time:'',}
		],
	})
	function saleChart(){
		var myChart = echarts.init(document.getElementById('salechart'))
		var option = {
		     tooltip : {
					trigger : 'axis',
				},
		      xAxis: {
				       type: 'category',
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
		          step: 'middle',
		          name: 'kq002',
		          type: 'line',
						data: [5, 5, 20, 20, 45, 45,45],
						lineStyle:{
							color:'#FF6700',
						},
						itemStyle:{
							color:'#FF6700',
						},
						label:{
							show: true,
						},
		      },
			  ]
		}
		 
		 myChart.setOption(option);
		 window.addEventListener('resize',()=>{
				   myChart.resize();
		 })
	}
	const shortcuts= [
	  {
	    text: '未来7天',
	    value: () => {
	      const end = new Date()
	      const start = new Date()
	      start.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
	      return [start, end]
	    },
	  },
	  {
	    text: '未来30天',
	    value: () => {
	      const end = new Date()
	      const start = new Date()
	      start.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
	      return [start, end]
	    },
	  },
	  {
	    text: '未来90天',
	    value: () => {
	      const end = new Date()
	      const start = new Date()
	      start.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
	      return [start, end]
	    },
	  },
	]
	function addTimeAera(){
		formData.saleAera.push({
			sale:'',
			time:'',
		})
	}
	function removeSaleAera(index){
		formData.saleAera.splice(index, 1)
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
		padding: 16px;
	}
	.m-t-16{margin-top:16px;}
	.m-c{background-color:#fff!important;line-height:16px;}
</style>
