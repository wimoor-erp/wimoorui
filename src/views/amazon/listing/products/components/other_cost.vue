	<template>
		<el-dialog v-model="costVisable" :title="title" destroy-on-close='true' width="800px"  >
				<el-row>
					<el-space >
					 <el-select v-model="feed" placeholder="请选择费用项目">
						 <el-option v-for="item in feeList" :value="item.id" :label="item.name">{{item.name}}</el-option>
					 </el-select>
					 <el-input type="text" v-model="amount" @input="amount=CheckInputFloat(amount)"  placeholder="请输入金额"></el-input>
					 <el-select v-model="currency" placeholder="请选择币种">
						  <el-option v-for="item in currencyList" :value="item.id" :label="item.name">{{item.name}}</el-option>
					 </el-select>
			         <el-button type="primary" @click="submitCost">添加</el-button>
					 <!-- <Datepicker  @changedate="changedate" /> -->
					 
					<!-- <el-button> 费用类型管理</el-button> -->
					</el-space>
				</el-row>
		  <template #footer>
		  	<span class="dialog-footer">
		  		<el-button @click="costVisable = false"> 关闭</el-button>
		  	</span>
		  </template>
		</el-dialog>
	</template>
	
	<script setup>
		import {ref,reactive,onMounted,defineExpose,toRefs } from "vue"
		import Datepicker from '@/components/header/datepicker.vue';
		import financesApi from '@/api/amazon/finances/financesApi.js';
		import {CheckInputFloat,CheckInputInt} from '@/utils/index';
		import {ElMessage} from 'element-plus';
		const state=reactive({
			costVisable:false,
			tableData:[],
			queryParam:{},
			feeList:[],
			feed:"",
			title:'',
			amount:0,
			currencyList:[{"id":"USD","name":"美元"},{"id":"EUR","name":"欧元"},{"id":"GBP","name":"英镑"},{"id":"CAD","name":"加元"},
			{"id":"HKD","name":"港元"},{"id":"JPY","name":"日元"},{"id":"AUD","name":"澳元"},{"id":"CNY","name":"人民币"},
			{"id":"SEK","name":"瑞典元"},{"id":"NOK","name":"挪威克朗"},{"id":"BRL","name":"巴西雷亚尔"},{"id":"MXN","name":"墨西哥元"},
			{"id":"SGD","name":"新加坡元"},{"id":"KRW","name":"韩元"},{"id":"MOP","name":"澳门元"}],
			currency:'',
		})
		 const {
		   costVisable,
		   tableData,
		   queryParam,
		   feed,
		   feeList,
		   title,
		   amount,
		   currencyList,
		   currency,
		 } = toRefs(state);
     	defineExpose({
			loadData,
		})
	function submitCost(){
		 var data={};
		 data.sku=state.queryParam.sku;
		 data.marketplaceid=state.queryParam.marketplaceid;
		 data.groupid=state.queryParam.groupid;
		 var times = new Date();
		 data.byday=times.format("yyyy-MM-dd");
		 data.currency=state.currency;
		 data.itemid=state.feed;
		 data.amount=state.amount;
		 financesApi.saveFinItemData(data).then((res)=>{
		 	if(res.data.status=="success"){
				if(res.data){
					 ElMessage({
						  message: '添加成功！',
						  type: 'success'
					 })
					 state.costVisable=true;
				}else{
					 ElMessage({
						  message: '添加失败！',
						  type: 'error'
					 })
				}
			}
		 });
	}
	// function changedate(val){
	// 	state.queryParam.fromDate=val.start;
	// 	state.queryParam.endDate=val.end;
	// }
	
	function loadData(row){
		state.costVisable=true;
		state.queryParam=row;
		state.title=row.sku+"其它成本";
		financesApi.findFinItemByUser().then((res)=>{
			if(res.data && res.data.length>0){
				state.feeList=res.data;
				state.feed=res.data[0].id;
			}
			
		});
		// if(state.queryParam.fromDate){
		// 	data.fromDate=state.queryParam.fromDate;
		// 	data.endDate=state.queryParam.endDate;
		// }else{
		// 	var start = new Date();
		// 	var end=new Date();
		// 	data.fromDate=start.format("yyyy-MM-dd");
		// 	end.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
		// 	data.endDate=end.format("yyyy-MM-dd")+" 23:59:59";
		// }
		// productinoptApi.getFinDataList(data).then((res)=>{
		// 	state.tableData=res.data.records;
		// });
	}
	</script>
	
	<style>
	</style>
	
