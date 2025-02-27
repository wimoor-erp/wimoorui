<template>
	<el-dialog   v-model="visiable" title="报价供应商信息" width="600px">
		<div>
			<table class="sd-table m-b-16 " style="border-left:none"  border="0" cellpadding="0" cellspacing="0">
				<thead>
					<th>货件</th>
					<th v-for="price in quotationPriceList">
						{{price.supplier.name}}
					</th>
				</thead>
				<tbody>
					<template v-for="address in order.addressList">
						<tr v-for="shipment in address.shipmentList" >
							<td >
								{{shipment.shipmentid}}
								<div>
									<span class="font-extraSmall">重量:{{shipment.weight}} kg </span>
									<span class="font-extraSmall"> 体积:{{formatFloat(shipment.volume/1000000)}}  m³</span>
								</div>
							</td>
							<td v-for="price in shipment.quotationPriceList">
								<div><span :title="price.supplier.name"> {{price.totalfee}}</span></div>
								<div><span class="font-extraSmall" v-if="price.unitprice">单价:{{price.unitprice}} </span>
								     <span class="font-extraSmall" v-if="price.tax"> 附加费:{{price.tax}} </span>
									 <span class="font-extraSmall" v-if="price.otherfee"> 其他费用:{{price.otherfee}} </span>
								</div>
							</td>
						</tr>
						
					</template>
					<tr>
						<td>合计</td>
						<td v-for="price in quotationPriceList">
							<span :title="price.supplier.name"> {{price.totalfee}}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		  <template #footer>
		  	    <el-button @click="visiable=false"  >关闭</el-button>
		  </template>
	</el-dialog>
	 
</template>

<script setup>
	import '@/assets/css/packbox_table.css';
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,toRefs,nextTick } from 'vue'
	import supplierApi from '@/api/quote/supplierApi.js';
	import {ElMessage, ElMessageBox } from 'element-plus';
	import {dateFormat,dateTimesFormat,CheckInputFloat,formatFloat} from '@/utils/index';
	
	const state = reactive({ 
		order:{},
		quotationPriceList:[],
	    visiable:false, 
	})
	const{order,visiable,quotationPriceList}=toRefs(state)
	function show(order){
		 state.visiable=true;
		 state.order=order;
		 state.quotationPriceList=state.order.quotationPriceList;
	 }
	defineExpose({ show })
</script>

<style>
</style>