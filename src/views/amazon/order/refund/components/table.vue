<template>
	<el-row>
	<GlobalTable  ref="globalTable" :tableData="tableData"   height="calc(100vh - 246px)" @loadTable="loadTableData" :stripe="true"  style="width: 100%;margin-bottom:16px;">
		 <template #field>
		  <el-table-column prop="groupname"  label="店铺" width="120"  />
		  <el-table-column prop="marketname" label="国家"  width="70" />
		   <el-table-column prop="orderId" label="订单号" width='180' />
	      <el-table-column prop="image" label="图片" width="60" >
	       <template #default="scope">
	        <el-image :src="scope.row.image"   width="40" height="40"  ></el-image>
	      </template>
	    </el-table-column>
	    <el-table-column prop="name" label="商品信息"  show-overflow-tooltip>
	       <template #default="scope">
	          <div class='name'>{{scope.row.name}}</div>
	          <div class='sku'>{{scope.row.sku}} 
	            <copy title='复制' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
				<span style="color: #000000;">ASIN:{{scope.row.asin}}</span>
	          </div>
			 
	      </template>
	    </el-table-column>
	    <el-table-column prop="returnDate" label="退款时间" width="120"   >
			<template #default="scope">
			    {{dateFormat(scope.row.returnDate)}} 
			</template>
		</el-table-column>	
	    <el-table-column prop="quantity" label="退货数量" width="100"    />
		<el-table-column prop="reason" label="退货原因"  width="160" />
		<el-table-column prop="customerComments" label="退货留言"  width="200" />
		<el-table-column prop="reason" label="生成发票"  width="160" />
	  </template>
	 </GlobalTable>
	</el-row>
</template>

<script>
	import { ref ,watch,reactive,onMounted,onUpdated} from 'vue'
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import orderListApi from "@/api/amazon/order/orderListApi.js";
	import {format,dateFormat} from '@/utils/index';
	import {ElMessage } from 'element-plus'
	export default{
		name:'Table',
		components:{
			GlobalTable
		},
		setup(props){
			let fromDate =ref()
			let toDate =ref()
			let globalTable=ref(GlobalTable);
			let tableData=reactive({records:[],total:0})
			let queryparams=ref();
			onMounted(()=>{
			 
			})
		 
			function loadData(params){
				if(params.startDate==undefined || params.startDate==null || params.startDate==""){
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					params.startDate =dateFormat(start);
					params.endDate =dateFormat(end);
				} 
				globalTable.value.loadTable(params);
			}
			
			function loadTableData(params){
				queryparams.value=params;
				orderListApi.getOrderReturnList(params).then((res)=>{
					tableData.records = res.data.records
					tableData.total =res.data.total
				})
			}
			function downloadList(){
				orderListApi.downloadReturnlist(queryparams.value); 
			}
			return{
				toDate,fromDate,loadData,tableData,globalTable,dateFormat,loadTableData,queryparams,downloadList
			}
		}
	}
</script>

<style>
</style>
