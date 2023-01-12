<template>
	<el-row :gutter="24">
		<el-col  :span="10">
			<el-card shadow="never">
			<el-descriptions title="物流单" size="small" :column="1">
			   <el-descriptions-item label="物流编号">LP00548058489179</el-descriptions-item>
			   <el-descriptions-item label="物流公司">安能物流</el-descriptions-item>
			   <el-descriptions-item label="运单号码">760092350786</el-descriptions-item>
			   <el-descriptions-item label="发货时间">2022-12-05 13:12:53</el-descriptions-item>
			 </el-descriptions>
			 <el-divider></el-divider>
			 <h4 class="m-b-16 m-t-16">商品清单</h4>
			 <div class="flex-center product-list">
				 <el-image  src="https://cbu01.alicdn.com/img/ibank/O1CN01BuGgN21Bs2mgVE03f_!!0-0-cib.80x80.jpg"></el-image>
			     <div class="font-small">
					 <p class="name">批发拍立得小卡收纳册 明星专辑3寸照片相册本影集插袋卡片纪念册</p>
					 <el-space class="m-t-8" :size="24">
						 <span><span class="font-extraSmall">单位重量: </span> -</span>
						 <span><span class="font-extraSmall">数量: </span>  50本</span>
					 </el-space>
				 </div>
			 </div>
			 </el-card>
			 <el-button type="primary" class="m-t-16">打印订单详情</el-button>
		</el-col>
	<el-col  :span="14">
		<el-card class="gray-bg" shadow="never">
		    <template #header>
		        <span>物流跟踪</span>
		    </template>
		    <el-timeline>
		       <el-timeline-item
		         v-for="(item, index) in logisticsData"
		         :key="index"
		         :timestamp="item.time"
				  :color="item.color"
		       >
		         {{ item.content }}
		       </el-timeline-item>
		     </el-timeline>
		  </el-card>
	</el-col>
	</el-row>
</template>

<script setup>
	import {ref,reactive,onMounted,watch,toRefs} from 'vue'
	const state =reactive({
		logisticsData:[
			{
			    content: '安能快运临沂中转仓已揽收',
			    time: '2022-12-05 17:16:10',
			  },
			  {
			    content: '订单已到达临沂分拨中心',
			    time: '2022-12-05 20:57:06',
			  },
			  {
			    content: '订单已从临沂分拨中心发出，准备发往深圳分拨中心',
			    time: '2022-12-06 02:13:38',
				color:'#ff6700',
			  },
		]
	})
	const {
		logisticsData
	}=toRefs(state)
</script>

<style>
	.product-list .el-image img{
		width:64px;
		height:64px;
		margin-right:16px;
		overflow:inherit;
	}
	
	.gray-bg{
		background-color: var(--el-bg-color);
	}
	.el-timeline-item__node--normal{
		width: 8px;
		height: 8px;
		left:1px;
	}
</style>
