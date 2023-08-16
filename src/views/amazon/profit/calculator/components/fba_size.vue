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
		     {{market.name}} Product Tier:  {{tableData.country[market.market].productTier}} 
			 <span v-if="isSmlAndLight=='true'">{{tableData.country[market.market].outboundWeight}} oz</span>
			 <span v-else>{{tableData.country[market.market].outboundWeight*16}} oz</span>
			 </el-link>
		<el-link  :href="countryFee[market.market]"  target="_blank" v-else-if="market.market=='US'">
		     {{market.name}} Product Tier:  {{tableData.country[market.market].productTier}} 
			 {{tableData.country[market.market].outboundWeight}}  
			 <span style="padding-left:5px" v-if="isSmlAndLight=='true'"> oz</span>
			 <span style="padding-left:5px"  v-else> lb</span>
			 </el-link>
		<el-link  :href="countryFee[market.market]"  target="_blank" v-else>
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
	   isSmlAndLight:"",
	   countryOptions:[],
	})
   let {tableData,countryOptions,isSmlAndLight} =toRefs(props);
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
