<template>
	<el-col :span="8"   class="m-b-16"> 
	                   <el-collapse class="collapse-card" v-model="activeCard" @change="handleChange">
							<el-collapse-item title="Consistency" :name="1">
								 <template #title>
									 <el-space>
									<el-image class="flex-center" :src="require('@/assets/image/country/'+country.market+'-flag-small.jpg')">
									</el-image> 
									<span>{{country.name}}</span>
									</el-space>
									<el-space :size="2"  v-if="country.market=='IN'">
										 <el-divider direction="vertical" />
										 <el-popover
										     placement="top-start"
										     title="税率配置"
										     :width="300"
										   > 
										   <el-form label-width="100px">
											   <el-form-item label="佣金比率">
												   <el-input placeholder="默认按照所选品类匹配"> <template #append>%</template></el-input>
											   </el-form-item>
											   <el-form-item  label="进口税率">
												   <el-input ><template #append>%</template></el-input>
											   </el-form-item>
											   <el-form-item  label="进口GST税率">
												   <el-input ><template #append>%</template></el-input>
											   </el-form-item>
											   <el-form-item label="销售GST税率">
												   <el-input ><template #append>%</template></el-input>
											   </el-form-item>
										   </el-form>
										     <template #reference>
	                                     <el-button link>
										<el-icon class="font-base" >
											<Coin/>
										</el-icon>
										<span >自定义</span>	
										</el-button>	
										     </template>
										   </el-popover>
										
									</el-space>								
								</template>	
								<table style="width:100%;text-align:center;" class="el-table table  table-striped table-bordered" v-if="tableData.country&&tableData.country[country.market]">
									<tbody>
									<tr><th>利润率</th><th>售价({{tableData.country[country.market].currency}})</th><th>利润</th></tr>
									<tr><td>{{tableData.country[country.market].margin}}</td>
									    <td><el-input 
										v-if="tableData.country&&tableData.country[country.market]"
										@input="marketPriceInput()" 
										style="width:60px;" size="small"
										v-model="tableData.country[country.market].sellingPrice"/>	
										</td>
										<td>{{tableData.country[country.market].profit}}</td>
									</tr>
								 	<tr v-for="item in tableData.country[country.market].resultList" >
										<td>{{item.margin}}</td>
										<td>{{item.sellingPrice}}</td>
										<td>{{item.profit}}</td>
									</tr>
									 </tbody>
								 </table>
								 <table style="width:100%;text-align:center;" class="el-table table  table-striped table-bordered" v-else>
								 	<tbody>
									<tr><th>利润率</th><th>售价</th><th>利润</th></tr>
								 	<tr><td></td>
								 	    <td><el-input style="width:60px;" size="small" disabled/></td>
								 		<td></td>
								 	</tr>
								  	<tr v-for="item in marginOptions">
								 		<td>{{item*100}}%</td>
								 		<td></td>
								 		<td></td>
								 	</tr>	
									</tbody>
								  </table>
							</el-collapse-item>
						</el-collapse>
					</el-col>
	 
</template>

<script setup>
	import {ref,reactive,defineProps,toRefs,onMounted, defineEmits}from"vue"
	import {CheckInputFloat,CheckInputInt} from '@/utils/index';
    const emit = defineEmits(['dataChange']);
	let props = defineProps({
	   loading:false,
	   country:"",
	   marginOptions:[],
	   tableData:{country:[{currency:"",resultList:[{}]}]},
	})
	const state=reactive({
        activeCard:[1],
	})
	function handleChange(){
		
	}
	function marketPriceInput(){
		emit('dataChange',props.tableData);
	}
	onMounted(()=>{
		 
	})
	let {loading,country,tableData,marginOptions} =toRefs(props);
	let {activeCard } =toRefs(state);
</script>

<style>
	.table-striped > tbody > tr:nth-of-type(odd) {
	    background-color: #fbfbfb;
	}
	.table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
	    border: 1px solid #f4f4f4;
	}
</style>