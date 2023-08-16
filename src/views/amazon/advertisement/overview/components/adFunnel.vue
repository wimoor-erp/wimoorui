<template>
	<div class='pag-radius-bor '>
		<div class="flex-center-between">
			<h4 >最近七天广告转化数据</h4>
            <AdGroup :selectSize="'small'" :border="true"/>
		</div>
		<div class="funnel-chart">
			<div class="funnel-item">
				<div class="ad-funnel-data">2716419</div>
				<span>曝光量</span>
				<div class="ad-funnel-rate">
					<p>点击率:<span> 20.5%</span></p>
				</div>
			</div>
			<div class="funnel-item">
				<div class="ad-funnel-data">10695</div>
				<span>点击次数</span>
				<div class="ad-funnel-rate">
					<p>转化率:<span> 20.5%</span></p>
				</div>
			</div>
			<div class="funnel-item">
				<div class="ad-funnel-data">1174</div>
				<span>订单数</span>
			</div>
		</div>
		<div class="data-center ">
		  <div class="ad-data-item " style="margin-right:8px">
			  <el-card shadow="never">
			  <h5 class="text-red">￥41212.21</h5>
			  <p class="name">广告花费</p>
			  </el-card>
		  </div>
		  <div class="ad-data-item " style="margin-left:4px;margin-right:4px">
			  <el-card shadow="never">
			  <h5 class="text-green">￥127136.01</h5>
			  <p class="name">广告贡献销售额</p>
			  </el-card>
		  </div>
		  <div class="ad-data-item " style="margin-left:8px">
			  <el-card shadow="never">
			  <h5>32.42%</h5>
			  <p class="name">ACOS</p>
			  </el-card>
		  </div>
		</div>
	</div>	
</template>

<script setup>
	import{ref,reactive,toRefs}from'vue';
	import AdGroup from '@/components/header/ad_group.vue';
</script>

<style scoped>
	.funnel-chart{
		margin-top:24px;
	}
	.funnel-item{
		    position:relative;
		    border-top: 80px solid;
		    border-left: 50px solid transparent;
		    border-right: 50px solid transparent;
			margin: 20px auto;
	}
	.funnel-item:first-child {
	    border-top-color: #ff6700;
	    width: 420px;
	}
	.funnel-item:nth-child(2){
		border-top-color: #409eff;
		width: 300px;
	}
	.funnel-item:nth-child(3) {
	    border-top-color: #67c23a;
	    width: 180px;
	}
	.funnel-item>span::after {
	    content: "";
	    position: absolute;
	    left: 52px;
	    top: 6px;
	    height: 2px;
	    width: 40px;
	    background-color: #ddd;
		}
	
	.ad-funnel-data{
		position:absolute;
		left: 0px;
		right: 0px;
		top: -52px;
		color: #fff;
		text-align:center;
		font-size:24px;
	}
	.funnel-item>span{
		    position: absolute;
		    left: -120px;
		    top: -44px;
		    font-size: 12px;
		    color: #333;
	}
	.ad-funnel-rate p{
		    position: absolute;
		    right: -120px;
		    top: 2px;
		    font-size: 12px;
		    color: #333;
	}
	.ad-funnel-rate p::before{
		    content: "";
		    position: absolute;
		    left: -50px;
		    top: 6px;
		    height: 2px;
		    width: 40px;
		    background-color: #ddd;
	}
	.data-center{
		display:flex;
		align-items: center;
		justify-content:center;
	}
	.ad-data-item {
		flex-grow:1;
		margin-top:24px;
		margin-bottom:16px;
		text-align:center;
	}
	.ad-data-item h5{
		font-size:20px;
		font-weight:700;
		font-family: DIN Alternate,Helvetica Neue,Helvetica,Arial,SF Pro Display;
		margin-bottom:8px;
	}
	.ad-data-item .name{
		font-size:14px;
		color:#999;
	}
	.text-green{
		color:#53a52a;
	}
	.text-red{
		color:#df4f4f;
	}
</style>