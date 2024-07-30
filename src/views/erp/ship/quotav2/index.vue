<template>
		<div class="gary-bg main-sty height-screen" >
			<el-row :gutter="16">
				<el-col :span="6">
					<el-card >
						<template #header>
						     <span class="font-small">单据信息</span>
						 </template>
						<div class="flex-center-between">
							<el-space direction="vertical" alignment="flex-start">
								<h3>{{shipPlan.number}}</h3>
								<span class="font-extraSmall">
									创建于{{dateFormat(shipPlan.createtime)}}
								</span>
							</el-space>
							<span class="font-extraSmall">{{dateFormat(shipPlan.auditime)}}审核</span>
						</div>
						 <div v-if="shipments" class="flex gap-2" v-for="shipmentid in shipments" style="padding-bottom:10px">
							 <el-tag type="success" >{{shipPlan.number}}</el-tag> 
						 </div>
						<el-timeline class="m-t-24" v-else>
						    <el-timeline-item 
						       v-for="(activity, index) in activities"
						      :key="index"
						      :icon="activity.icon"
						      :type="activity.type"
						      :color="activity.color"
						      :hollow="activity.hollow"
						      :timestamp="activity.timestamp"
						    >
						      {{ activity.content }}
						    </el-timeline-item>
						  </el-timeline>
						 
						  <el-row  class="m-t-24">
							  <!--el-col :span="12" >
								  <el-space direction="vertical" alignment="flex-start">
									  <span class="font-bold">
										 {{orderData.skuamount}}
									  </span>
									  <span class="font-extraSmall">SKU</span>
								  </el-space>
							  </el-col-->
							  <el-col :span="12" >
								  <el-space direction="vertical" alignment="flex-start">
									  <span class="font-bold">
										 {{shipPlan.sumquantity}}
									  </span>
									  <span class="font-extraSmall">发货数量</span>
								  </el-space>
							  </el-col>
						  </el-row>
						  <el-divider class="m-t-16"></el-divider>
						  <el-row class="m-t-16">
							  <el-col :span="4">
								  <span class="font-base-nine">备注</span>
							  </el-col>
							  <el-col :span="20">
								  <span v-if="shipPlan.remark" class="font-base">
									  {{shipPlan.remark}}</span>
									  <span v-else>-</span>
							  </el-col>
						  </el-row>
					</el-card>
				</el-col>
				<el-col :span="18">
					<el-card>
						<ShelfProduct  ref="shelfProductRef"  @change="handleSubmit"/>
					</el-card>
				</el-col>
			</el-row>
		</div>
</template>

<script setup>
	import { ref,reactive,onMounted, toRefs} from 'vue'
	import orderblankApi from '@/api/erp/ship/orderblankApi.js'
	import ShelfProduct from "./components/shelfproduct.vue"
	import {dateFormat} from '@/utils/index.js';
	import { useRoute } from "vue-router";
	import shipmentQuotaApi from '@/api/erp/shipv2/shipmentQuotaApi.js';
	const route = useRoute();
	const shelfProductRef=ref();
	const planid=route.query.formid;
	const planids=route.query.planids;
	const state = reactive({
		activities:[
			{
				content: '-',
			    timestamp: '发货仓库',
			    type: 'primary',
			    hollow: true,
			},
			{
			    content: '-',
			    timestamp: '目的仓库',
			    type: 'primary',
			    hollow: true,
			},
		],
		formid:undefined,
		skuList:[],
		shipPlan:{},
		quatoInfo:{},
	})
	const {
		activities,
		skuList,
		shipPlan,
		quatoInfo
	} = toRefs(state)
	onMounted(()=>{
		getshipFormData()
	})
	function handleSubmit(){
		   if(planids){
		       shipmentQuotaApi.checkinv(state.quatoInfo.formid,planids).then(res=>{ getshipFormData(); })
		   }else{
			   var list=[];
			   list.push(state.quatoInfo.formid);
			   shipmentQuotaApi.checkinv(state.quatoInfo.formid,list).then(res=>{ getshipFormData(); })
		   }
			getshipFormData();
	}
	const getshipFormData = function(){
		if(planid){
			shipmentQuotaApi.info(planid).then((res)=>{
				console.log(res.data);
				if(res.data){
					state.shipPlan=res.data.shipPlan;
					state.quatoInfo=res.data.quatoInfo;
					state.activities[0].content = state.shipPlan.warename
					state.activities[1].content = state.shipPlan.groupname+'-'+state.shipPlan.country;
					//+'('+state.shipPlan.center+')'
					state.skuList = state.quatoInfo.list;
					
					var time=setTimeout(function(){
						shelfProductRef.value.show(state.skuList,state.quatoInfo.formid);
						clearTimeout(time);
					},200);
				}
			});
		}
		
	}
</script>

<style scoped="scoped">
	.height-screen{
		height: calc(100vh - 36px)!important;
	}
	.m-t-24{
		margin-top: 24px;
	}
	.m-t-16{
		margin-top:16px!important;
	}
</style>
