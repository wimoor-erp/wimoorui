<template >
	<div class="main-sty con-header "> 
	<el-row>
		<Group @change="getGroup"    ref="groupRef" />
	 <el-space>
		 <el-select style="width:100px;" v-model="queryParams.currency" @change="handleQuery">
		 	<el-option label="人民币" value="CNY"></el-option>
		 	<el-option label="美元" value="USD"></el-option>
		 	<el-option label="站点币种" value="market"></el-option>
		 </el-select>
		 <div class="date-picker-group">
		 	<el-select v-model="queryParams.datetype" @change="handleQuery">
		 		<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
		 	</el-select>
			<Datepicker :shortIndex="1"  @changedate="changedate" />
		 </div> 
		<Owner  ref="ownerRef" @owner="getOwner" />
		 <el-input v-model="queryParams.search" @input="handleQuery" placeholder="搜索平台SKU" clearable></el-input>
		 <el-button type="primary" @click="handleQuery">查询</el-button>
		 <el-button type="primary" plain @click="showAccDialog" title="用于锁定汇率">结账</el-button>
	  </el-space>
	  <div class='rt-btn-group' >
		  <el-button    @click="recalculation" > 重算 </el-button>
		<el-button   @click="downloadList" :loading="downloading">导出</el-button>
	  </div>
	  </el-row>
	<GlobalTable
	 :tableData="tableData"
	 show-summary
	 :summary-method="getSummaries"
	   @loadTable="loadTableData" 
	 ref="globalTable"
	 
	 >
	 <template #field>
		<el-table-column label="商品信息"  width="270px" fixed="left"  show-overflow-tooltip  prop="sku" >
			<template #default="scope">
				<div class="flex-center">
				<img v-if="scope.row.image" :src="scope.row.image" class="product-img" />
				<img v-else :src="require('@/assets/image/empty/noimage40.png')"   class="product-img"/>
					<div style="margin-left:5px;">
					 <div class="sku">{{scope.row.sku}}</div>
					 <div class="font-extraSmall">{{scope.row.pname}}</div>
					 <el-space> <span class="font-extraSmall">ASIN:{{scope.row.asin}} </span>
					 <span class="font-extraSmall">{{scope.row.groupname}}-{{scope.row.marketname}}</span></el-space>
					 </div>
				 </div>
			</template>
		</el-table-column>
		<el-table-column label="销售额"  width="120"  sortable="custom"   prop="principal" />
		<el-table-column label="销量"  width="80"  sortable="custom"   prop="salenum" />
		<el-table-column label="订单量"  width="90"  sortable="custom"   prop="ordernum" />
		<el-table-column label="平均售价"  width="80"     prop="avgprice" />
		<el-table-column label="退款数量"  width="100"    sortable="custom"  prop="refundsales" />
		<el-table-column label="退款金额"  width="100"    sortable="custom"  prop="refund" />
		<el-table-column label="退款率"  width="90"    sortable="custom"  prop="refundrate" />
		<el-table-column label="FBA费用"   prop="fbafee" width="100"/>
		<el-table-column label="销售佣金"    prop="commission" width="100"/>
		<el-table-column label="运费"   prop="shipping" width="90"/>
		<el-table-column label="促销费"    prop="promotion" width="100"/>
		<el-table-column label="其它收支"    prop="otherfee" width="90"/>
		<el-table-column label="SKU结算" header-align="center"   width="100"  sortable="custom"   prop="setincome" />
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_storage_fee">
			  <template #header>
					<p class="l-h-none ">店铺分摊</p>
					<p class="l-h-none">仓储费</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_long_storage_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">长期仓储费</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_coupon_redemption_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">coupon</p>
			  </template>	
			</el-table-column>			
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_adv_spend_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">广告花费</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_reserve_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">预留金</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_reimbursement_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">赔偿金</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺分摊" label-class-name="bg-group-y" width="100" prop="share_shop_other_fee">
			  <template #header>
					<p class="l-h-none ">&nbsp;</p>
					<p class="l-h-none">其他费</p>
			  </template>	
			</el-table-column>	
			<el-table-column label="店铺结算"  header-align="center"   width="100"  sortable="custom"   prop="income" />
			<el-table-column label="市场费用"    width="100"  prop="profit_marketfee" />
			<el-table-column label="VAT"    width="100"  prop="profit_vat" />
			<el-table-column label="所得税"    width="100"   prop="profit_companytax" />
			<el-table-column label="关税"    width="100"   prop="profit_customstax" />
			<el-table-column label="汇率损耗"    width="100"  prop="profit_exchangelost" />
			<el-table-column label="固定费用"    width="100"  prop="profit_lostrate" />
			<el-table-column label="其它费用"    width="100"   prop="profit_otherfee" />	 
            <el-table-column label=" 预估运费"    width="100" sortable="custom"   prop="profit_local_shipmentfee" />  
			<el-table-column label="采购成本"  sortable="custom"    width="100"  prop="local_price" />
			<el-table-column label="自定义费用"    width="100"   prop="local_other_cost" />
			<el-table-column label="退税"    width="60"   prop="local_return_tax" />
		   <el-table-column label="利润"  	fixed="right"   width="110" sortable="custom"   prop="profit" >
			<template #header>
			<el-space :size="4">
			  <span>利润</span>
			   <el-tooltip
			          effect="dark"
			          content=""
			          placement="top-start"
			        >
					 <template #content> 
					 <div>利润=店铺结算-本地成本预估-采购成本-采购其他成本+退税</div>
					  <div>本地成本预估=预估运费+预估市场费用+预估VAT+预估所得税+预估关税+预估汇率损耗+预估固定费用+预估其他费用</div>
					  <div>店铺结算=销售额-退款-平台费用-店铺费用</div>
					   <div>店铺费用（含分摊广告费，仓储费，长期仓储费，赔偿费，预留金，其他）</div>
					   <div>平台费用（含分FBA费用，佣金，运费，促销，其他）</div>
					   <div>所有平台费用与分摊费用，减项目自动显示为负数</div>
					  </template>
			          <el-icon class="ic-cen font-small"><InfoFilled /></el-icon>
			        </el-tooltip>
			</el-space>
			</template>
			<template #default="scope">
				 <span :class="scope.row.profit<0?'text-red':''">{{scope.row.profit}}</span>
		    </template>
		</el-table-column>	
		<el-table-column label="毛利润率"  fixed="right" width="100"   prop="profitrate" />
		 </template>
	</GlobalTable> 
	 
	</div>
	<AccDialog   ref="accDialogRef"></AccDialog>
	<RefreshDataDialog ref="refreshDataDialogRef" @change="handleQuery" :needdeep="true"  ></RefreshDataDialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,computed} from 'vue'
	import {Search,ArrowDownBold,Download,Upload,InfoFilled} from '@element-plus/icons-vue';
	import Datepicker from '@/components/header/datepicker.vue';
    import '@/assets/css/packbox_table.css';
	import {dateFormat,dateTimesFormat,outputmoney} from '@/utils/index';
	import Group from '@/views/amazon/listing/common/group.vue';
	import Owner from '@/components/header/owner.vue';
	import AccDialog from './account_dialog.vue';

	import RefreshDataDialog from '@/views/amazon/payment/common/refresh_data_dialog.vue';
	import settlementSkuRptApi from '@/api/amazon/finances/settlementSkuRptApi.js';
	const globalTable=ref();
	const ownerRef=ref();
    const accDialogRef=ref();
	const calcDialogRef=ref();
	const refreshDataDialogRef=ref();
	const  state=reactive({
		isload:true,
		dateOptions:[{label:'结算日期',value:''},{label:'转账日期',value:'acc'}],
		loading:false,
		tableData: {records:[],total:0}  ,
		queryParams:{datetype:"acc",currency:"CNY"},
		summary:{},
		downloading:false,
	})
	const{
		isload,
		loading,
		dateOptions,
		tableData,
		queryParams,
		summary,
		downloading,
	}=toRefs(state)
	
	function showAccDialog(){
		accDialogRef.value.show(state.queryParams);
	}

	
	 function downloadList(){
	 	state.downloading=true;
	 	settlementSkuRptApi.downDataExcel(state.queryParams,()=>{
	 		state.downloading=false;
	 	})
	 }
	 function recalculation(){
	 	refreshDataDialogRef.value.show();
	 }
	 function handleQuery(){
	 	globalTable.value.loadTable(state.queryParams);
		state.isload=false;
	 }
	 function formatData(row){
		 row.principa=outputmoney(row.principa);
		 row.avgprice=outputmoney(row.avgprice);
 	     row.principal=outputmoney(row.principal);
	 	 row.refund=outputmoney(row.refund);
		 row.fbafee=outputmoney(row.fbafee);
		 row.commission=outputmoney(row.commission);
		 row.shipping=outputmoney(row.shipping);
	     row.promotion=outputmoney(row.promotion);
		 row.otherfee=outputmoney(row.otherfee);
         row.setincome=outputmoney(row.setincome);
		 row.share_storage_fee=outputmoney(row.share_storage_fee);
		 row.share_long_storage_fee=outputmoney(row.share_long_storage_fee);
		 row.share_adv_spend_fee=outputmoney(row.share_adv_spend_fee);
		 row.share_coupon_redemption_fee=outputmoney(row.share_coupon_redemption_fee);
		 row.share_reserve_fee=outputmoney(row.share_reserve_fee);
		 row.share_reimbursement_fee=outputmoney(row.share_reimbursement_fee);
		 row.share_shop_other_fee=outputmoney(row.share_shop_other_fee);
		 row.income=outputmoney(row.income);
		 row.profit_local_shipmentfee=outputmoney(row.profit_local_shipmentfee);
		 row.profit_marketfee=outputmoney(row.profit_marketfee);
		 row.profit_vat=outputmoney(row.profit_vat);
		 row.profit_companytax=outputmoney(row.profit_companytax);
		 row.profit_customstax=outputmoney(row.profit_customstax);
		 row.profit_exchangelost=outputmoney(row.profit_exchangelost);
		 row.profit_lostrate=outputmoney(row.profit_lostrate);
		 row.profit_otherfee=outputmoney(row.profit_otherfee);
		 row.local_price=outputmoney(row.local_price);
		 row.local_other_cost=outputmoney(row.local_other_cost);
		 row.local_return_tax=outputmoney(row.local_return_tax);
		 row.profit=outputmoney(row.profit);
		 	 
	 }
	 function loadTableData(params){
	 	 settlementSkuRptApi.proCommodity(params).then(res=>{
			 if(res.data){
				 res.data.records.forEach(row=>{
					 formatData(row);
				 })
				 state.tableData.records=res.data.records;
				 state.tableData.total=res.data.total;
				 if(params.currentpage==1){
				 	if(res.data.records&&res.data.records.length>0){
				 		state.summary=res.data.records[0].summary;
				 	}else{
				 		state.summary={};
				 	}
				 }
			 }else{
				 state.tableData.records=[];
				 state.tableData.total=0;
				 state.summary={};
			 }
	 	 })
	 }
	 
	 
	//日期改变
	function changedate(dates){
		state.queryParams.fromDate=dates.start;
		state.queryParams.endDate=dates.end;
		if(state.isload==false){
			handleQuery();
		}
		 
	}
	function getOwner(id){
		state.queryParams.ownerid=id;
		if(state.isload==false){
			handleQuery();
		}
	}
	function getGroup(obj){
		console.log(obj);
		state.queryParams.groupid=obj.groupid;
		state.queryParams.marketplaceid=obj.marketplaceid;
		handleQuery();
	}  
     function parseFloatValue(value){
		 if(value)return parseFloat(value);
		 else return 0.0;
	 }
		  
	 /* 合计行数据 */
	 function getSummaries({columns,data}){
	 	var arr = ["合计"];
	 	columns.forEach((item,index)=>{
	 		if(index>=1){
	 			 var fee=0.0;
	 				 fee=state.summary[item.property];
	 				 if(item.property=='salenum'||item.property=='ordernum'||item.property=='refundsales'){
	 					 arr[index]=fee;
	 				 }else if(item.property=='avgprice'||item.property=='refundrate'||item.property=='profitrate'){
	 					  arr[index]='-';
	 				 }else{
	 					arr[index]=outputmoney(fee);
	 				 }
	 		}
	 	})
	 	return  arr
	 }
</script>
<style>
	.bg-group-y{
		background-color:#efefef !important;
	}
</style>
<style scoped >
	 .l-h-none{
	 	line-height:14px;
	 }

</style>