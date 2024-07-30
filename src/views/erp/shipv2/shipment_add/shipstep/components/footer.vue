<template>
	 <el-row>
		<el-col :span="8"  >
			<div class="pag-radius-bor pad10 my-div" ref="infoRef"   >
				<el-descriptions title="单据信息" column="1">
				    <el-descriptions-item  label="状态">
						<el-tag v-if="planData.auditstatus==1" type="warning">待审核</el-tag> 
						<el-tag v-if="planData.auditstatus==2" type="warning">待配货</el-tag> 
						<el-tag v-if="planData.auditstatus==3" type="warning">待装箱</el-tag>
						<el-tag v-if="planData.auditstatus==4" type="warning">待发货</el-tag>
						<el-tag v-if="planData.auditstatus==7" type="success">已发货</el-tag>
						<el-tag v-if="planData.auditstatus==11" type="danger">已驳回</el-tag>
						<el-tag v-if="planData.auditstatus==12" type="info">已取消</el-tag>
					</el-descriptions-item>
				    <el-descriptions-item label="店铺">{{planData.groupname}}</el-descriptions-item>
				    <el-descriptions-item label="收货国家">{{planData.destination}}</el-descriptions-item>
				    <el-descriptions-item label="发货仓库">
				     {{planData.warename}}
				    </el-descriptions-item>
				    <el-descriptions-item label="申请日期">
				     {{dateTimesFormat(planData.createtime)}}
				    </el-descriptions-item>
					<el-descriptions-item label="备注">
					 {{planData.remark}}
					</el-descriptions-item>
				  </el-descriptions>
			 </div>
		</el-col> 
		<el-col :span="8" class="pad15">
			
			<div class="pag-radius-bor pad10 my-div" ref="transRef"  >
				<el-descriptions title="物流信息" column="1">
				    <el-descriptions-item  label="总货值">￥{{plansummary.itemprice}}</el-descriptions-item>
				    <el-descriptions-item label="物流总费用">0</el-descriptions-item>
				    <el-descriptions-item label="实际发货总数">{{plansummary.toquantity}}</el-descriptions-item>
				    <el-descriptions-item label="SKU个数">
				      {{plansummary.skucount}}
				    </el-descriptions-item>
				    <el-descriptions-item label="装箱箱数">
				       {{plansummary.skucount}}
				    </el-descriptions-item>
					<el-descriptions-item label="发货重量">
					   {{formatFloat(plansummary.weight)}}
					</el-descriptions-item>
					<el-descriptions-item label="体积">
					   {{formatFloat(plansummary.boxvolume)}}
					</el-descriptions-item>
					<el-descriptions-item label="亚马逊运输方式">
					  LTL
					</el-descriptions-item>
				  </el-descriptions>
			 </div>
			
		</el-col> 
		<el-col :span="8"  >
			<div class="pag-radius-bor pad10 my-div" ref="questionRef"   >
				<el-descriptions title="提醒及常见问题" column="1">
				    <el-descriptions-item   ><el-card shadow="never">
					<el-row>
						<el-col :span="2" style="padding-top: 15px;"><el-icon size="40"><Warning /></el-icon></el-col>
						<el-col :span="22">
							自2024年4月15起,对于标准尺寸商品
							，每件商品的亚马逊物流费用将降低$0.20，对于大号大件商品，每件商品的亚马逊物流费用将降低$0.61，从同一日开始,将收取入库配置服务费用。
						</el-col>
					</el-row>
					</el-card>
					</el-descriptions-item>
					 <el-descriptions-item   >
						 <el-select style="width: 100%;" placeholder="什么是装箱组"></el-select>
					</el-descriptions-item>
					<el-descriptions-item   >
						 <el-select style="width: 100%;" placeholder="在货件数量确认之前进行装箱有什么好处"></el-select>
					</el-descriptions-item>
					
				  </el-descriptions>
			 </div>
			
		</el-col> 
		 
	 </el-row>
	
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,nextTick } from 'vue';
	import {Warning} from '@element-plus/icons-vue';
	import {dateFormat,formatFloat,dateTimesFormat} from '@/utils/index.js';
	const questionRef=ref();
	const infoRef=ref();
	const transRef=ref();
	let state =reactive({
		planData:{}, 
		plansummary:{},
	})
	let{planData,plansummary}=toRefs(state);
	function show(infoData){
		state.planData=infoData;
		state.plansummary=state.planData.plansummary;
		 nextTick(() => {  
		      var maxHeight = Math.max(
		        questionRef.value.offsetHeight,
		        infoRef.value.offsetHeight,
		        transRef.value.offsetHeight
		      );
			  infoRef.value.style.cssText="min-height:"+maxHeight+"px;";
			  questionRef.value.style.cssText="min-height:"+maxHeight+"px;";
			  transRef.value.style.cssText="min-height:"+maxHeight+"px;";
		});
	}
	
	 defineExpose({ show })
</script>

<style scoped>
	.pad15{
		padding:0px 15px 15px 15px;
	}
	/* .pad10{
		padding:10px;
	}
	.my-div{
		padding:10px;
	} */
</style>