<!-- 添加产品时，共用的产品弹窗 -->
<template>
  <div>
  	<el-dialog v-model="dialog.visible"  title="账期详情"  width="80%" top="6vh" :before-close="handleClose">
		<el-row :gutter="24">
			<el-col :span="16">
				<el-card class="m-t-16 bg-card-orange">
						 <h2 class="m-b-16">销售汇总</h2>
								 <el-row>
								 <el-col :span="6">
						<el-space direction="vertical" alignment="left">
								  <span class="text-gray">销售额</span>
								  <span class="font-bold font-large">{{outputmoney(skusum.in_principal)}}</span>
							    </el-space>
								</el-col>
								 <el-col :span="6" >
						<el-space  direction="vertical" alignment="left">
								  <span class="text-gray">销量</span>
								  <span class="font-bold font-large">{{skusum.sales}}</span>
								</el-space>
								</el-col>
								<el-col :span="6">
						<el-space direction="vertical" alignment="left"><span class="text-gray">订单量</span>
								<span class="font-bold font-large">{{skusum.order_amount}}</span>
								</el-space>
								</el-col>
								<el-col :span="6">
						<el-space direction="vertical" alignment="left"><span class="text-gray">结算金额</span>
								<span class="font-bold font-large">{{outputmoney(skusum.amount)}}</span>
								</el-space>
								</el-col>
								</el-row>
				</el-card>
				  			<el-row :gutter="24"   >
								    <el-col   :span="size" v-for="(tvalue, tkey) in data"  >
										<el-card  v-if="tvalue"  shadow="never">
											<h3  v-if="tvalue.cname">{{tvalue.cname}}</h3>
											<h3  v-else>{{tvalue.name}}</h3>
											<div v-for="(avalue,akey) in tvalue"> 
												<div  v-if="akey&&akey!='cname'&&akey!='name'">
												<div class="avalue-name" v-if="avalue.cname">
												{{avalue.cname}}</div>
												<div class="avalue-name" v-else>{{avalue.name}}</div>
												<ul class="ul-list" v-if="avalue" >
													<li   v-for="(value,key) in avalue.item"> 
														<span class="font-extraSmall" v-if="value.cname">{{value.cname}}:</span>
														<span class="font-extraSmall" v-else>{{value.name}}:</span>
														{{outputmoney(value.amount)}}
													</li>
												</ul>
												</div>
											</div>
										</el-card>
								    </el-col>
				  			</el-row>
			</el-col>
			<el-col :span="8" v-show="shopfee.length>0">
				<el-card shadow="never" >
								 		  		 <h2 style="margin-bottom:8px;">店铺费用</h2>
								 				 <ul class="ul-list">
								 		  			<li   v-for="value in shopfee" > 
								 					<span>
								 		  				<span   v-if="value.ctransaction_type">
								 						<span v-if="value.ctransaction_type!=value.camount_type">{{value.ctransaction_type}}-</span>	
								 						</span>
								 		  				<span   v-else>{{value.transaction_type}}-</span>
								 		  				<span   v-if="value.camount_type">{{value.camount_type}}</span>
								 		  				<span   v-else>{{value.amount_type}}</span>
								 		  				<span   v-if="value.camount_description">-{{value.camount_description}}</span>
								 		  				<span   v-else>-{{value.amount_description}}</span>
								 		  				</span ><span class="font-bold">{{outputmoney(value.amount)}}</span>
								 		  			</li>
								 					</ul>
				</el-card> 
			</el-col>
		</el-row>
  		 
  		<template #footer>
  			<span class="dialog-footer">
  				<el-button @click="dialog.visible = false">关闭</el-button>
  			</span>
  		</template>
  	</el-dialog>
  </div>    
</template>

<script setup> 
	import { ref, reactive, onMounted,toRefs ,watch} from 'vue'
	import { Search, ArrowDown, } from '@element-plus/icons-vue'
	import { ElDivider, ElMessageBox, ElMessage } from 'element-plus'
		import {dateFormat,outputmoney} from '@/utils/index';
	import settlementAccRptApi from '@/api/amazon/finances/settlementAccRptApi.js';
	const state=reactive({
		dialog:{visible:false},
		loading:false,
		activeName:"detail",
		data:{},
		skusum:{},
		shopfee:[],
		size:24,
		queryParams:{}
	});
	const { loading,
	         data,
			 size,
			 shopfee,
			 activeName,
			queryParams,
			skusum,
			dialog,
		  } = toRefs(state);
	let props = defineProps({ type:""});
	const {  type } = toRefs(props);
	const emit = defineEmits(['change']);
	function handleClose(){
		state.dialog.visible=false;
	}
	function show(params,queryParams){
		state.dialog.visible=true;
		var data={settlement_id:params.settlement_id};
		data.currency=queryParams.currency;
		data.amazonAuthId=params.amazonauthid;
		//data.fromDate=params.startDate;
		//data.endDate=params.endDate;
		settlementAccRptApi.getSettmentDetail(data).then(res=>{
			state.data=res.data.detail;
			var i=0;
			for(let item in res.data.detail){
                    i++;
			}
			state.size=parseInt(24/i);
			if(state.size<12){
				state.size=12;
			}
			if(res.data.list){
				state.shopfee=[];
				res.data.list.forEach(item=>{
					if(item.transaction_type=='sku'){
						state.skusum=item;
					}else{
						state.shopfee.push(item);
					}
				})
			}
		})
	}
	defineExpose({
	  show,
	})
</script>

<style scoped>
	 h3{
		 margin-bottom:16px;
	 }
	 .el-card{
		 margin-bottom:24px;
	 }
	 .m-b-16{
		 margin-bottom:16px;
	 }
	 .text-gray{
		opacity:0.8;
	 }
	 .ul-list li{
		 border-bottom: 1px solid #eee;
		 padding:8px 0px;
	 }
	 .avalue-name{
		 padding:8px 0px;
		 border-top:1px solid #eee;
	 }

</style>
<style>
	.bg-card-orange .el-card__body{
			background-image: linear-gradient(270deg, #ffa400 0, #ff7315 97%);
			color:#fff;
	}
</style>