<template>
 <div class="summary-top expend-table">
	 <GlobalTable  ref="globalTable" :tableData="tableData"
	   show-summary
	   @loadTable="loadTableData" :stripe="false" 
	   @selectionChange = "selectChange"
	   :defaultSort="{ prop: 'startDate', order: 'descending' }"
	 
	   >
	   <!--
	   select CAST(tc.campaignId AS CHAR) campaignId, CAST(tc.profileid AS CHAR) profileid,
	   				CAST(tc.campaignId AS CHAR) id, tc.portfolioid portfolioid,
	   				tc.targetingType targetingType, tc.premiumBidAdjustment premiumBidAdjustment,
	   				tc.bidding bidding, tc.name,'' budgetType,tc.dailyBudget budget,''
	   				servingStatus, '' spendingPolicy,'' bidOptimization,tc.state status,tc.startDate
	   				startDate,tc.endDate endDate, 'SP' campaignType,tc.opttime opttime, '' bidMultiplier, t.`*`
	   				, mk.name market,tg.name groupname,tr.iswarn iswarn,p.marketplaceId marketplaceid,
	   			tk.remark remark,a.groupid groupid, tr.cycle,tr.fcondition,tr.subtrahend,
	   			tr.quota,tr.amount, tps.name portfoliosName
	   			from t_amz_adv_campaigns tc
	   			left join(
	   				select t.campaignId campaignId1,t.profileid profileid1, sum(t.impressions) impressions,sum(t.clicks) clicks,
	   					sum(t.cost) cost, ifnull((sum(t.cost) / sum(t.clicks)),0) avgcost,
	   					ifnull((sum(t.clicks) / sum(t.impressions)),0) CTR,
	   					case when ifnull(sum(t.cost),0)>0 and ifnull(sum(d.attributedSales7d),0)=0
	   					then 10000000000
	   					else ifnull((sum(t.cost) / sum(d.attributedSales7d)),0)
	   					end ACOS,
	   					ifnull((sum(d.attributedSales7d) / sum(t.cost)),0) ROAS,
	   					ifnull(sum(d.attributedSales7d),0) sumSales,
	   					ifnull(sum(d.attributedUnitsOrdered7d),0) sumUnits,
	   					ifnull((sum(d.attributedConversions7d) / sum(t.clicks)),0) CSRT,
	   					ifnull(sum(d.attributedConversions7d) - sum(ts.attributedConversions7dSameSKU),0) attributedConversions,
	   					ifnull(sum(ts.attributedConversions7dSameSKU),0) attributedConversionsSameSKU,
	   					ifnull(sum(d.attributedConversions7d),0) attributedUnitsOrdered,
	   					ifnull(sum(ts.attributedSales7dSameSKU),0) attributedSalesSameSKU,
	   					ifnull(sum(d.attributedSales7d) - sum(ts.attributedSales7dSameSKU),0) attributedSales,
	   		
	   					case when ifnull(sum(t.cost),0)>0 and ifnull(sum(d.attributedSales1d),0)=0
	   					then 10000000000
	   					else ifnull((sum(t.cost) / sum(d.attributedSales1d)),0)
	   					end ACOS1d,
	   					ifnull((sum(d.attributedSales1d) / sum(t.cost)),0) ROAS1d,
	   					ifnull(sum(d.attributedSales1d),0) sumSales1d,
	   					ifnull(sum(d.attributedUnitsOrdered1d),0) sumUnits1d,
	   					ifnull((sum(d.attributedConversions1d) / sum(t.clicks)),0) CSRT1d,
	   					ifnull(sum(d.attributedConversions1d) - sum(ts.attributedConversions1dSameSKU),0) attributedConversions1d,
	   					ifnull(sum(attributedConversions1dSameSKU),0) attributedConversionsSameSKU1d,
	   					ifnull(sum(d.attributedConversions1d),0) attributedUnitsOrdered1d,
	   					ifnull(sum(ts.attributedSales1dSameSKU),0) attributedSalesSameSKU1d,
	   					ifnull(sum(d.attributedSales1d) - sum(ts.attributedSales1dSameSKU),0) attributedSales1d,
	   		
	   					case when ifnull(sum(t.cost),0)>0 and ifnull(sum(d.attributedSales7d),0)=0
	   					then 10000000000
	   					else ifnull((sum(t.cost) / sum(d.attributedSales7d)),0)
	   					end ACOS7d,
	   					ifnull((sum(d.attributedSales7d) / sum(cost)),0) ROAS7d,
	   					ifnull(sum(d.attributedSales7d),0) sumSales7d,
	   					ifnull(sum(d.attributedUnitsOrdered7d),0) sumUnits7d,
	   					ifnull((sum(d.attributedConversions7d) / sum(clicks)),0) CSRT7d,
	   					ifnull(sum(d.attributedConversions7d) - sum(ts.attributedConversions7dSameSKU),0) attributedConversions7d,
	   					ifnull(sum(ts.attributedConversions7dSameSKU),0) attributedConversionsSameSKU7d,
	   					ifnull(sum(d.attributedConversions7d),0) attributedUnitsOrdered7d,
	   					ifnull(sum(ts.attributedSales7dSameSKU),0) attributedSalesSameSKU7d,
	   					ifnull(sum(d.attributedSales7d) - sum(ts.attributedSales7dSameSKU),0) attributedSales7d,
	   		
	   					case when ifnull(sum(t.cost),0)>0 and ifnull(sum(d.attributedSales14d),0)=0
	   					then 10000000000
	   					else ifnull((sum(t.cost) / sum(d.attributedSales14d)),0)
	   					end ACOS14d,
	   					ifnull((sum(d.attributedSales14d) / sum(t.cost)),0) ROAS14d,
	   					ifnull(sum(d.attributedSales14d),0) sumSales14d,
	   					ifnull(sum(d.attributedUnitsOrdered14d),0) sumUnits14d,
	   					ifnull((sum(d.attributedConversions14d) / sum(t.clicks)),0) CSRT14d,
	   					ifnull(sum(d.attributedConversions14d) - sum(ts.attributedConversions14dSameSKU),0) attributedConversions14d,
	   					ifnull(sum(ts.attributedConversions14dSameSKU),0) attributedConversionsSameSKU14d,
	   					ifnull(sum(d.attributedConversions14d),0) attributedUnitsOrdered14d,
	   					ifnull(sum(ts.attributedSales14dSameSKU),0) attributedSalesSameSKU14d,
	   					ifnull(sum(d.attributedSales14d) - sum(ts.attributedSales14dSameSKU),0)
	   					attributedSales14d,
	   		
	   					case when ifnull(sum(t.cost),0)>0 and ifnull(sum(d.attributedSales30d),0)=0
	   					then 10000000000
	   					else ifnull((sum(t.cost) / sum(d.attributedSales30d)),0)
	   					end ACOS30d,
	   					ifnull((sum(d.attributedSales30d) / sum(t.cost)),0) ROAS30d,
	   					ifnull(sum(d.attributedSales30d),0) sumSales30d,
	   					ifnull(sum(d.attributedUnitsOrdered30d),0) sumUnits30d,
	   					ifnull((sum(d.attributedConversions30d) / sum(t.clicks)),0) CSRT30d,
	   					ifnull(sum(d.attributedConversions30d) - sum(ts.attributedConversions30dSameSKU),0) attributedConversions30d,
	   					ifnull(sum(ts.attributedConversions30dSameSKU),0) attributedConversionsSameSKU30d,
	   					ifnull(sum(d.attributedConversions30d),0) attributedUnitsOrdered30d,
	   					ifnull(sum(ts.attributedSales30dSameSKU),0) attributedSalesSameSKU30d,
	   					ifnull(sum(d.attributedSales30d) - sum(ts.attributedSales30dSameSKU),0)
	   					attributedSales30d
	   
	   -->
		  <template #field>
		 <el-table-column fixed type="selection" width="60" />
		 <el-table-column fixed  v-if="activeName==1" label="广告活动"  width="200" >
		 			   <template #default="scope">
		 				   <el-link :underline="false" type="primary">{{scope.row.name}}</el-link>
		 			   </template>
		  </el-table-column>
		  <el-table-column fixed  v-if="activeName==2" label="广告组"  width="200" >
		  			   <template #default="scope">
		  				   <el-link :underline="false" type="primary">{{scope.row.name}}</el-link>
		  			   </template>
		   </el-table-column>
		  <el-table-column  v-if="activeName==1" label="类型"  width="60" >
		   			   <template #default="scope">
		   				    {{scope.row.campaignType}} 
		   			   </template>
		    </el-table-column>
		   <el-table-column   label="状态"  >
			   <template #default="scope">
				    <el-switch
				       v-model="scope.row.status"
				       size="small"
				     />
			   </template>
			</el-table-column>
			<el-table-column   label="广告组合" width="120 "  prop="portfolio"/>
			<el-table-column   label="分时策略" width="100 "  prop="set">
			<template #default="scope">
				   <span class="table-edit-flex" @click="scheduleSet">
				   		 <span>{{scope.row.set}}</span>
				   		<el-icon ><Edit/></el-icon>
				   </span>
				  </template>
			</el-table-column>
			<el-table-column   label="类型" width="80"  prop="type"/>
			<el-table-column   label="开始日期"  width="120 " prop="startime"/>
			<el-table-column   label="结束日期" width="120 "  prop="endtime">
				<template #default="scope">
				   <span class="table-edit-flex" @click="e=>pickDate(e,scope.row)">
				   		 <span>{{scope.row.endtime}}</span>
				   		<el-icon ><Edit/></el-icon>
				   </span>
				  </template>
			</el-table-column>
			<el-table-column   label="预算"  width="80" prop="budget">
			<template #default="scope">
				  <el-link type="primary" @click="e=>budgetEdit(e,scope.row)" :underline="false">
					  ${{scope.row.budget}}
				  </el-link>
				  </template>
			</el-table-column>
			<el-table-column   label="竞价策略" width="160 "  prop="Bidding">
				<template #default="scope">
					<span class="table-edit-flex" @click="biddingEdit(scope.row)">
						 <span>{{scope.row.Bidding}}</span>
						 <el-icon ><Edit/></el-icon>
					</span>
					<p class="font-extraSmall" v-if="false">首页:0% | 商品页面:0%</p>
				</template>
			</el-table-column>
			<el-table-column   label="曝光量" width="120 "  prop="IMPR"/>
			<el-table-column   label="点击次数" width="120 "  prop="CLICKS"/>
			<el-table-column   label="点击率" width="120 "  prop="ctr"/>
			<el-table-column   label="每次点击费用" width="120 " prop="cpc"/>
			<el-table-column   label="广告费"  width="120 " prop="spend"/>
			<el-table-column   label="广告销售额" width="120 " prop="adsales"/>
			<el-table-column   label="销量" width="120 "  prop="sales"/>
			<el-table-column   label="订单量" width="120 " prop="orders"/>
			<el-table-column   label="Acos" width="120 "  prop="acos"/>
			<el-table-column   label="RoAS" width="120 " prop="roas"/>
			<el-table-column   label="转化率" width="120 " prop="cr"/>
			<el-table-column   label="广告贡献销售额-目标商品" width="180 " prop=""/>
			<el-table-column   label="广告贡献销售额-其它商品" width="180 " prop=""/>
			<el-table-column   label="广告转化量-目标商品" width="160 " prop=""/>
			<el-table-column   label="广告转化量-其它商品" width="160 " prop=""/>
			<el-table-column label="展开" type="expand">
			 <template #default="props">
				<AdOrderCycle/>
			 </template>
			</el-table-column>
	 </template>
	 </GlobalTable>
 </div>
 <SchedulePlan  ref="scheduleRef" />
 <BiddingDialog ref="biddingRef"/>
<!-- 结束日期选择 -->
   <el-popover
    :visible="visible"
    :virtual-ref="endtimeRef"
    trigger="click"
    virtual-triggering
	width="246px"
   >
    <el-date-picker
        v-model="editRow.enddate"
        type="date"
        placeholder="选择日期"
      />
	  <div class="popover-footer ">
		  <el-button @click="visible=false">关闭</el-button>
		  <el-button type="primary" @click="visible=false,handleSubmit">确认</el-button>
	  </div>
</el-popover>
<!-- 预算设置 -->
   <el-popover
    :visible="budgetVisible"
    :virtual-ref="budgetRefRef"
    trigger="click"
    virtual-triggering
	width="246px"
   >
   <el-input v-model="editRow.budget" type="number">
	   <template #suffix>$</template>
   </el-input>
	  <div class="popover-footer">
		  <el-button @click="budgetVisible=false">关闭</el-button>
		  <el-button type="primary" @click="budgetVisible=false,handleSubmit">确认</el-button>
	  </div>
</el-popover>
</template>

<script setup>
	import {ref,reactive,onMounted,watch,toRefs,computed} from 'vue';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,Edit} from '@element-plus/icons-vue';
	import BiddingDialog from '@/views/amazon/advertisement/common/bidding_dialog.vue';
	import AdOrderCycle from '@/views/amazon/advertisement/common/ad_order_cycle.vue';
	import SchedulePlan from '@/views/amazon/advertisement/common/schedule_plan.vue';
	import advertApi from '@/api/amazon_adv/advertApi.js';
	import advCampaignApi from '@/api/amazon_adv/advCampaignApi.js';
	const endtimeRef = ref()
	const budgetRefRef = ref()
	const biddingRef = ref()
	const globalTable =ref()
	const scheduleRef = ref()
	let props = defineProps({ activeName:"" })
	const { activeName } = toRefs(props);
	const state = reactive({
		visible:false,
		budgetVisible:false,
		editRow:{enddate:'',budget:''},
		tableData:{records:[
			// {
			// 	status:true,IMPR:'16585',set:'-',
			// 	adgroup:'SP_MA_A3069FPWJASL_Pin The Horn_20',
			// 	portfolio:'-',Bidding:"固定竞价",
			// 	type:'自动',budget:'3.00',
			// 	startime:'2022-02-25',
			// 	endtime:'2022-02-26',
			// },
			// {
			// 	status:true,IMPR:'16585',set:'-',
			// 	adgroup:'SP_MA_A3069FPWJASL_Pin The Horn_20',
			// 	portfolio:'-',Bidding:"固定竞价",
			// 	type:'自动',budget:'3.00',
			// 	startime:'2022-02-25',
			// 	endtime:'2022-02-26',
			// },
		],total:0},
	})
	const{
		tableData,
		visible,
		budgetVisible,
		editRow,
	}=toRefs(state)
	const emits = defineEmits(['selectRow'])
	function pickDate(e,row){
		endtimeRef.value = e.currentTarget
		state.editRow.enddate = row.endtime
		state.visible=true
	}
	function budgetEdit(e,row){
		budgetRefRef.value = e.currentTarget
		state.editRow.budget = row.budget
		state.budgetVisible=true
	}
	
	function biddingEdit(row){
		biddingRef.value.show()
	}
	function scheduleSet(){
		scheduleRef.value.show()
	}
	function selectChange(seletion){
		emits('selectRow',seletion)
	}
	
	function expandAll(){
		state.tableData.records.forEach((row)=>{
			globalTable.value.toggleRowExpansion(row)
		})
	}
	function loadTableData(params){
		advCampaignApi.getCampaignList(params).then((res)=>{
			state.tableData.records =  res.data.records
			state.tableData.total = res.data.total
		})
	}
	function handleQuery(params){
		setTimeout(function(){
			globalTable.value.loadTable(params);
		},500)
	}
	defineExpose({
		expandAll,handleQuery,
	})
</script>

<style>
.popover-footer{
	margin-top:16px;
}
 .summary-top .el-table__body-wrapper {
  order: 1;
}
</style>