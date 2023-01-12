 <template>
 <el-drawer
    v-model="drawer"
    title="FBA费用各国标准尺寸对照"
    direction="ltr"	
  >
<ul class="card-tabs"  v-if="countryOptions" >
	<li v-for="market in countryOptions" >
		<span v-if="tableData.country&&tableData.country[market.market]&&tableData.country[market.market].productTier">
		<el-link :href="countryFee[market.market]" v-if="market.market=='US'&&tableData.country[market.market].outboundWeight<1">
		     {{market.name}} Product Tier:  {{tableData.country[market.market].productTier}} {{tableData.country[market.market].outboundWeight*16}} oz</el-link>
		<el-link  :href="countryFee[market.market]" v-else-if="market.market=='US'">
		     {{market.name}} Product Tier:  {{tableData.country[market.market].productTier}} {{tableData.country[market.market].outboundWeight}} lb</el-link>
		<el-link  :href="countryFee[market.market]" v-else>
			{{market.name}} Product Tier:  {{tableData.country[market.market].productTier}}</el-link>  
			</span>
		 </li>
		
</ul>
  </el-drawer>
  </template>
<script setup>
	import {ref,reactive,toRefs,onMounted, defineEmits,defineExpose}from"vue"
		import countryFee from '@/model/amazon/profit/countryFee.json';
	let drawer = ref(false)
    let props = defineProps({
	   tableData:{country:[{currency:"",resultList:[{}]}]},
	   countryOptions:[],
	})
   let {tableData,countryOptions} =toRefs(props);
	defineExpose({
	  drawer
	})
	
</script>

<style>
 .card-tabs li::marker{
            color: #FF6700;
			line-height: 32px;
        }
 .card-tabs{
	 margin-left: 16px;
 }
</style>
