<template>
	<div >
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>加工单详情</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							  <el-steps :active="active" finish-status="success" align-center class="m-b-t-24">
							    <el-step title="创建" />
							    <el-step title="待处理"  />
							    <el-step title="处理中"  />
							    <el-step title="完成"  />
							  </el-steps>
						 <el-row  :gutter="32">
							 <el-col :span="8">
						<el-descriptions :column="1">
						    <el-descriptions-item label="单据编码">AS202301040023</el-descriptions-item>
						    <el-descriptions-item label="操作类型">
								<el-tag effect="dark" type="warning">组装</el-tag>
							</el-descriptions-item>
						    <el-descriptions-item label="单据状态">
								<el-tag v-if="active==1" effect="light" type="warning">待处理</el-tag>
								<el-tag v-if="active==2" effect="light" type="success">处理中</el-tag>
								<el-tag v-if="active==3" effect="light" type="info">已完成</el-tag>
							</el-descriptions-item>
							<el-descriptions-item label="操作仓库">清湖仓-正品仓</el-descriptions-item>
							<el-descriptions-item label="备注">-</el-descriptions-item>
						 </el-descriptions>
						 </el-col>
						<el-col :span="8">
							<el-space class="pro-content m-b-16">
							 <el-image src="https://photo.wimoor.com/materialImg/26138972975530085/1651906144437_after.jpeg" class="product-img"></el-image>
							 <div>
								 <p class="name font-12">开斋节装饰拉花，
								 星星月亮纸串3.7米一条星星月亮纸串3.7米一条星星月亮纸串3.7米一条
								 星星月亮纸串3.7米一条。 A2133TKJJB， 和 A2136TKJJB 共用配件</p>
								 <p class="sku ">kq005</p>
							 </div>
							 </el-space>
							 <div >
								 <p class="font-bold">
									 <el-space>
								 <span>100</span>
								  <el-popover
								     placement="top-start"
								     title="修改加工数量"
								     :width="200"
								   >
								    <el-input-number v-model="num" :min="1" placeholder="请输入" />
									<el-button size="small"
									 class="m-t-8"
									 type="primary">确认</el-button>
								     <template #reference>
								      <el-icon class="ic-cen" v-if="active==1"><Edit /></el-icon>
								     </template>
								   </el-popover>
								 </el-space>
								 </p>
								 <span class="font-extraSmall">加工数量</span>
							 </div>
						</el-col>
						<el-col :span="8" v-if="active>1">
						<el-row class="m-b-24">
						<el-col :span="12" class="text-center">
							<div>
							<p class="font-bold">50</p>
							<span class="font-extraSmall">已处理</span>
							</div>
							<el-popover
							   placement="bottom"
							   title="产品组装"
							   :width="200"
							   trigger="click"
							 >
							 <el-alert class="m-b-16" title="子产品库存不足,最多可组装 1 个" :closable="false" type="error" />
							  <el-input-number v-model="num" :min="1" placeholder="数量" />
								<el-button 
								 class="m-t-8"
								 type="primary">确认</el-button>
							   <template #reference>
							   <el-button v-if="active==2" type="primary" class="m-t-8" @click="handleStart">
							    <span >组装</span>	
							   </el-button>
							   </template>
							 </el-popover>
						</el-col>
						<el-col :span="12" class="text-center">
							<div >
							<p class="font-bold">0</p>
							<span class="font-extraSmall">已入库</span>
							</div>
							<el-popover
							   placement="bottom"
							   title="产品入库"
							   :width="200"
							   trigger="click"
							 >
							  <el-input-number v-model="num" :min="1" placeholder="数量" />
								<el-button 
								 class="m-t-8"
								 type="primary">确认</el-button>
							   <template #reference>
							  <el-button v-if="active==2" type="primary" class="m-t-8" @click="handleStart">入库</el-button>
							   </template>
							 </el-popover>
						</el-col>
						</el-row> 
						   <el-progress
							 :text-inside="true"
							      :stroke-width="8"
							      :percentage="50"
							     >
						       <span></span>
						    </el-progress>
							<div class="flex-center-between m-t-8">
								<span class="font-extraSmall">处理进度</span>
								<span class="font-extraSmall">50/100</span>
							</div>
						</el-col>
						 </el-row>
						 <el-divider></el-divider>
						 <div class="mark-re">
							<div>
						   <h5 >子SKU列表</h5>
						   </div>
						 </div>
						 <el-table border :data="TableData">
							 <el-table-column label="序号" type="index" width="80"/> 
							 <el-table-column  prop="image" label="图片" width="80" >
							    <template #default="scope">
							    <el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
							 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column label="名称/SKU"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column label="单位数量" prop="unit"/>
							 <el-table-column label="需求数量">
							   <template #default="scope">
								  200
							   </template>
							 </el-table-column>
							 <el-table-column label="仓库" prop="warehouse"/>
							 <el-table-column label="可用库存" prop="fulfillable">
							 <template #default="scope">
								   {{scope.row.fulfillable}}
								    <el-tag size="small" type="danger">库存不足</el-tag>
							 </template>
							 </el-table-column>
							 <el-table-column label="待入库" prop="d"/>
							 <el-table-column label="操作" width="80">
								  <template #default="scope">
								    <el-button
									 link type="primary" >采购</el-button>
					        	  </template>
							 </el-table-column>
						 </el-table>
						 <el-row v-if="active==2">
						 	<div class="mark-re">
						 	   <div>
						 	  <h5 >入库记录</h5>
						 	  </div>
						 	</div>
							<el-table border>
							  <el-table-column label="操作时间" />
							  <el-table-column label="操作人" />
							  <el-table-column label="入库数量" />
							  <el-table-column label="备注" />
							  <el-table-column label="操作">
								  <template #default="scope">
									<el-button
									 link type="primary" >撤销入库</el-button>
								  </template>
							  </el-table-column>
							</el-table>
						 </el-row>
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button @click="closeTab">取消</el-button>
									<el-button v-if="active==2">终止单据</el-button>
									<el-button v-if="active==0" type="primary" @click="submitForm">提交</el-button>
									<el-button v-if="active==1" type="primary" @click="handleStart">开始加工</el-button>
								</el-space>
							</div>
						</div>
	</div>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage } from 'element-plus'
	import Warehouse from '@/components/header/warehouse.vue';
	import { useRoute,useRouter } from 'vue-router'
	const MaterialRef = ref()
	const emitter = inject("emitter"); // Inject `emitter`
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	const state = reactive({
		TableData:[],
		active:1,
	})
	const {
		TableData,
		active,
	}=toRefs(state)
			onMounted(()=>{
	
			});
	//
	function submitForm(){
		state.active = 1
	}
	//开始加工
	function handleStart(){
		state.active = 2
		console.log(12333)
	}
</script>

<style>
	.m-b-24{
		margin-bottom: 24px;
	}
		.he-scr-car{
			height:calc(100vh - 176px);
			margin-bottom: 20px;
		}
	.in-wi-24{
			width: 400px;
		}
		.mark-re{
			margin-top: 16px;
			margin-bottom:16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	.mark-re h5::before{
		content: "";
		display: inline-block;
		height: 13px;
		width: 4px;
		margin-right:8px;
		background-color: #FF6700;
	}
	.fill-from-body{
		margin:16px 24px;
	}
	.m-b-t-24{
		margin-bottom:24px;
		margin-top:24px;
	}
	.m-b-16{
		margin-bottom: 16px;
	}
	.pro-content{
		font-size: 12px;
	}
	.pro-content .sku{
		margin-top:4px;
		color: var(--el-color-blue);
	}
</style>
