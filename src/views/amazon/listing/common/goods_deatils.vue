<template>
<el-dialog v-model="visible" title="商品销售信息"   destroy-on-close='true' :append-to-body="true" width="50%" @close='closeDialog'>
		<div class="from-body" 	 v-loading="loading">
			
			    <div class="flex-center font-small m-b-24">
			 	   <el-image class="product-img" :src="productInfoData.image"></el-image>
			 	   <div class="pro-message">
			 		   <div class="name">{{productInfoData.name}}</div>
			 		   <div class="sku">{{productInfoData.sku}}
					    <span class="pad10 font-extraSmall">ASIN:{{productInfoData.asin}}</span>
					    <span class="pad10 font-extraSmall">上架日期:{{productInfoData.opendate}}</span>
						<span class="pad10 font-extraSmall">站点:{{productInfoData.groupname}}-{{productInfoData.marketplacename}}</span>
						
						<span v-if="productInfoData.landedAmount">
						{{productInfoData.landedCurrency}}{{productInfoData.landedAmount}}</span> 
					   </div>
			 			<div >备注:{{productInfoData.remark}}</div>
			 	   </div>
			    </div>		
			<el-divider ></el-divider>
		   <el-descriptions class="m-t-24 item-font">
			    <el-descriptions-item label="销售排名"> {{productInfoData.rank}}</el-descriptions-item>
				<el-descriptions-item label="七日访问量"> {{productInfoData.sessions}}</el-descriptions-item>
				<el-descriptions-item label="七日转化率"> {{percentformat(productInfoData.sessionrate)}}</el-descriptions-item>
				<el-descriptions-item label="SPEND"> {{productInfoData.advspend}}</el-descriptions-item>
				<el-descriptions-item label="ACOS"> {{percentformat(productInfoData.advacos)}}</el-descriptions-item>
				<el-descriptions-item label="CTR"> {{percentformat(productInfoData.advctr)}}</el-descriptions-item>
				<el-descriptions-item label="CLICKS"> {{productInfoData.advclick}}</el-descriptions-item>
				<el-descriptions-item label="IMPR"> {{productInfoData.advimpr}}</el-descriptions-item>
				<el-descriptions-item label="CPC"> {{productInfoData.advcpc}}</el-descriptions-item>
				<el-descriptions-item label="CR"> {{percentformat(productInfoData.advspc)}}</el-descriptions-item>
				<el-descriptions-item label="利润率"> {{productInfoData.prorate}}%</el-descriptions-item>
			    <el-descriptions-item label="净利润率"> {{percentformat(productInfoData.proprate)}}</el-descriptions-item>
				<el-descriptions-item label="ACOAS"> {{percentformat(productInfoData.acoas)}}</el-descriptions-item>
				<el-descriptions-item label="利润"> {{productInfoData.profits}}</el-descriptions-item>
				<el-descriptions-item label="净利润">{{productInfoData.profitall}}</el-descriptions-item>
		   </el-descriptions>
		</div>	
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
	</template>
<script setup>
	import {ref, reactive,} from 'vue'
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	let visible=ref(false);
	let loading=ref(false);
	let productInfoData=ref([]);
	function percentformat(value){
		if(value && value!=0){
			return (value*100).toFixed(2)+'%';
		}else{
			return 0;
		}
	}
	function show(param){
		visible.value=true;
		loading.value=true;
		productinfoApi.productList(param).then((res)=>{
			if(res.data.records && res.data.total>0){
				productInfoData.value=res.data.records[0];
				productInfoData.value.sku=param.sku;
			}
			loading.value=false;
		});	 
	}
	defineExpose({
	  show
	}) 
</script>

<style>
	.product-img{
		width: 60px;
		height:60px;
		margin-right:8px;
	}
	.pro-message .sku{
		color: var(--el-color-blue);
		margin-top:8px;
		margin-bottom:16px;
	}
	.m-t-24{
		margin-top:24px;
	}
	.m-b-24{
		margin-bottom:24px;
	}
	.item-font .el-descriptions__label{
		color:var(--el-text-color-secondary)
	}
	.item-font .el-descriptions__content{
		font-weight: 600;
	}
	.pad10{
		padding-left:10px;
	}
</style>
