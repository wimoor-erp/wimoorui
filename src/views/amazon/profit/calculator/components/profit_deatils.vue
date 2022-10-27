 <template>
 <el-drawer
    v-model="drawer"
    title="各国成本明细"
    direction="ltr"
	class="card-tabs"
  
  >
     <el-tabs
       v-model="activeName"
       type="card"
       tab-position="right" 
       @tab-click="handleClick"
     >
       <el-tab-pane v-for="market in countryOptions" :label="market.name" :name="market.market">
		   <div v-if="tableData.country&&tableData.country[market.market]&&tableData.country[market.market].productTier">
			   <el-table :data="loadData(tableData.country[market.market])" size="small"  v-loading="loading"     show-summary>
					  <el-table-column label="序号"  width="50" type="index" />
					  <el-table-column label="费用项">
						  <template #default = "scope">
							<div>{{scope.row.name}} <span class="font-extraSmall">{{scope.row.enname}}</span> </div>
						  </template>
					  </el-table-column>
					  <el-table-column label="金额" width="70" prop="cost" >
					  <template #default = "scope">
							<div>
							   <span  class="font-extraSmall" v-if="scope.row.cost">{{tableData.country[market.market].currency}}</span>
							    {{scope.row.cost}}
								<span  class="font-extraSmall" v-if="scope.row.cost">{{scope.row.suffix}}</span>
								</div>
					  </template>
					  </el-table-column>
			   </el-table>
		   </div>
	   </el-tab-pane>
        
     </el-tabs>
  </el-drawer>
  </template>
<script setup>
	 import {ref,reactive,defineProps,toRefs,onMounted, defineEmits,defineExpose}from"vue"
	 import countryFee from '@/model/amazon/profit/countryFee.json';
	 import {formatFloat} from '@/utils/index';
	let drawer = ref(false)
	let activeName =ref("US")
	let props = defineProps({
	   tableData:{country:[{currency:"",resultList:[{}]}]},
	   countryOptions:[],
	})
	const state=reactive({
	    activeCard:[1],
	})
	defineExpose({
	  drawer
	})
	 function loadData(datas){
	 	var data={};
	 			var arrs=[];
	 			var shiptitle="";
	 			var row1={"name":"采购成本","enname":"Purchase cost","cost":formatFloat(datas.purchase),"prefix":datas.currency,"suffix":""};
	 			var row2={"name":"运费","enname":"Shipment","cost":formatFloat(datas.shipment),"prefix":datas.currency,"suffix":""};
	 			var row3={"name":"平台佣金","enname":"Amazon Referral Fee","cost":formatFloat(datas.referralFee),"prefix":datas.currency,"suffix":""};
	 			var row4={"name":"变动结算费","enname":"Variable Closing Fee","cost":formatFloat(datas.vcfee),"prefix":datas.currency,"suffix":""};
	 			var row5={"name":"FBA处理费","enname":"FBA","cost":formatFloat(datas.fba),"prefix":datas.currency,"suffix":""};
	 			var row5_1={};
	 			if(datas.country=='IN'){
	 				row5_1={"name":"固定结算费","enname":"Fixed Closing Fee","cost":formatFloat(datas.closingFee),"prefix":datas.currency,"suffix":""};
	 			}
	 			var row5_2={};
	 			if(datas.country=='IN' || datas.country=='CA'){
	 				row5_2={"name":"FBA GST/HST 税率","enname":"FBA GST/HST Taxes","cost":formatFloat(datas.fbaTaxFee),"prefix":"","suffix":""};
	 			}
	 			var row6={"name":"仓储费","enname":"Inventory Storage Fee","cost":formatFloat(datas.storageFee),"prefix":datas.currency,"suffix":"" };
	 		
	 			var row7={};
	 			if(datas.country=='US' || datas.country=='JP'){
	 				row7={"name":"库存配置费","enname":"Inventory Placement Service Fee","cost":formatFloat(datas.inPlaceFee),"prefix":datas.currency,"suffix":"" };
	 			}
	 			var row8={"name":"标签费","enname":"Label Service Fee","cost":formatFloat(datas.labelServiceFee),"prefix":datas.currency,"suffix":"" };
	 			var row9={};
	 			if(datas.country=='US'){
	 				row9={"name":"人工处理费","enname":"Manual Processing Fee","cost":formatFloat(datas.manualProcessingFee),"prefix":datas.currency,"suffix":"" };
	 			}
	 			var row10={"name":"进口关税","enname":"Import Duty Tax","cost":formatFloat(datas.tax),"prefix":datas.currency,"suffix":"" };
	 			
	 			var row10_1={};
	 			if(datas.country=='IN'){
	 				row10_1={"name":"进口GST税率","enname":"Import GST Tax","cost":formatFloat(datas.import_GST) ,"prefix":"","suffix":""};
	 			}
	 			var row11={"name":"汇率损耗","enname":"Currency Transport Fee","cost":formatFloat(datas.currencyTransportFee) ,"prefix":"","suffix":""};
	 			var row12={"name":"市场营销费用","enname":"Marketing","cost":formatFloat(datas.marketing) ,"prefix":datas.currency,"suffix":""};
	 			var row13={"name":"其它每单销售固定费用","enname":"Others","cost":formatFloat(datas.others) ,"prefix":datas.currency,"suffix":""};
	 			var row14={"name":"其它每单销售固定成本","enname":"Other rate Fee","cost":formatFloat(datas.othersFee) ,"prefix":datas.currency,"suffix":""};
	 			var row15={"name":"按件收费，适用个人版","enname":"Per-Item Fee","cost":formatFloat(datas.perItemFee) ,"prefix":datas.currency,"suffix":""};
	 			var row15_1={};
	 			if(datas.country=='UK' || datas.country=='DE' || datas.country=='IT' || datas.country=='ES'|| datas.country=='FR'|| datas.country=='NL'){
	 				row15_1={"name":"欧洲增值税","enname":"Vat Tax Fee","cost":formatFloat(datas.vatFee),"prefix":"","suffix":"%"};
	 			}
	 			var row15_2={};
	 			var row15_3={};
	 			if(datas.country=='IN'){
	 				row15_2={"name":"销售GST税率","enname":"Selling GST Tax","cost":formatFloat(datas.selling_GST) ,"prefix":"","suffix":"%"};
	 				row15_3={"name":"企业所得税率","enname":"Corporate Income Tax","cost":formatFloat(datas.corporateInFee) ,"prefix":"","suffix":"%"};
	 			}
	 			arrs.push(row1);arrs.push(row2);arrs.push(row3);arrs.push(row4);arrs.push(row5);
	 			if(row5_1 && row5_1.name){
	 				arrs.push(row5_1);
	 			}
	 			if(row5_2 && row5_2.name){
	 				arrs.push(row5_2);
	 			}
	 			arrs.push(row6);
	 			if(row7 && row7.name){
	 				arrs.push(row7);
	 			}
	 			arrs.push(row8);
	 			if(row9 && row9.name){
	 				arrs.push(row9);
	 			}
	 			arrs.push(row10);
	 			if(row10_1 && row10_1.name){
	 				arrs.push(row10_1);
	 			}
	 			arrs.push(row11);arrs.push(row12);
	 			arrs.push(row13);arrs.push(row14);arrs.push(row15);
	 			if(row15_1 && row15_1.name){
	 				arrs.push(row15_1);
	 			}
	 			if(row15_2 && row15_2.name){
	 				arrs.push(row15_2);
	 			}
	 			if(row15_3 && row15_3.name){
	 				arrs.push(row15_3);
	 			}
	 			return arrs;
	 		}
</script>

<style>
	.el-table__footer{
		font-weight: 600;
	}
	.el-drawer__header{
		margin-bottom: 10px;
		padding-top:10px;
	}
</style>
