<!-- 添加产品时，共用的产品弹窗 -->
<template>
  <div>
  	<el-dialog v-model="dialog.visible"  title="账期详情"  width="80%" top="6vh" :before-close="handleClose">
		  <el-card style="margin-bottom:20px;background:var(--el-color-primary-light-3);padding-top:0px;margin-top:0px" >
		  	<el-row :gutter="20"   >
		  	 <el-col   :span="12"  >
		  		 <h3>销售汇总</h3>
		  		<div><span  >SKU销售额</span> ：{{outputmoney(skusum.in_principal)}}</div>
		  		<div><span  >SKU销量</span> ：{{skusum.sales}}</div>
		  		<div><span  >SKU订单量</span> ：{{skusum.order_amount}}</div>
		  		<div><span  >SKU结算金额</span> ：{{outputmoney(skusum.amount)}}</div>
		  	 </el-col>
		  	 <el-col   :span="12"  >
		  		 <h3>店铺费用</h3>
		  			<div   v-for="value in shopfee" > 
		  				<span   v-if="value.ctransaction_type">{{value.ctransaction_type}}</span>
		  				<span   v-else>{{value.transaction_type}}</span>
		  				<span   v-if="value.camount_type">-{{value.camount_type}}</span>
		  				<span   v-else>-{{value.amount_type}}</span>
		  				<span   v-if="value.camount_description">-{{value.camount_description}}</span>
		  				<span   v-else>-{{value.amount_description}}</span>
		  				：{{outputmoney(value.amount)}}
		  			</div>
		  	 </el-col>
		  	    </el-row>
		  </el-card>
		  	  
  			<el-row :gutter="20"   >
				    <el-col   :span="size" v-for="(tvalue, tkey) in data"  >
						<el-card style="margin-bottom:20px;" v-if="tvalue">
							<h3 style="padding-bottom:20px;" v-if="tvalue.cname">{{tvalue.cname}}</h3>
							<h3 style="padding-bottom:20px;" v-else>{{tvalue.name}}</h3>
							<div style="margin-bottom:20px;" v-for="(avalue,akey) in tvalue"> 
								<div  v-if="akey&&akey!='cname'&&akey!='name'">
								<div v-if="avalue.cname">{{avalue.cname}}</div>
								<div v-else>{{avalue.name}}</div>
								
								<div v-if="avalue">
									<div style="padding-left:20px;" v-for="(value,key) in avalue.item"> 
										<span class="font-extraSmall" v-if="value.cname">{{value.cname}}:</span>
										<span class="font-extraSmall" v-else>{{value.name}}:</span>
										{{outputmoney(value.amount)}}
									</div>
								</div>
								</div>
							</div>
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
			if(state.size<6){
				state.size=6;
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

<style>
	 
</style>
