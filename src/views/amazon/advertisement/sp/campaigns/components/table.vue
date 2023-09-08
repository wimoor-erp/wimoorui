<template>
 <div class="summary-top expend-table">
	 <GlobalTable  ref="globalTable" :tableData="tableData"
	   @loadTable="loadTableData" :stripe="false" 
	   @selectionChange = "selectChange"
	   :defaultSort="defaultSort"
	   show-summary
	   :lazy="false"
	   :load="handleExpandChange"
	   :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
	   :summary-method="getSummaries"
	    rowKey="id"
	   :defaultExpandAll="true"
	   >
		  <template #field>
		 <el-table-column  fixed type="selection" width="60" />
		 <el-table-column fixed  v-if="activeName=='adcams'" label="广告活动"  width="200" >
		 			   <template #default="scope">
		 				   <span v-if="scope.row.status=='none'"  style="font-size: 12px;"  >{{scope.row.name}}</span>
						   <el-link  @click.stop="bindAdvCams(scope.row.id,scope.row.name)" v-else :underline="false" type="primary">{{scope.row.name}}</el-link>
		 			   </template>
		  </el-table-column>
		  <el-table-column fixed  v-if="activeName=='adgroups'" label="广告组"  width="200" >
		  			   <template #default="scope">
		  				   <el-link @click.stop="bindAdvGpds(scope.row.id,scope.row.name,scope.row.campaignId,scope.row.campaignName)" :underline="false" type="primary" v-if="scope.row.status!='none'">{{scope.row.name}}</el-link>
						    <span  v-else>{{scope.row.name}}</span>
		  			   </template>
		   </el-table-column>
		    <el-table-column fixed  v-if="activeName=='adproducts'" label="图片"  width="50" >
				 <template #default="scope">
					<div  v-if="!scope.row.statustype && scope.row.status!='none'">
						<el-image v-if="scope.row.image" :src="scope.row.image" style="height:40px;width:40px;"></el-image>
						<el-image v-else :src="require('@/assets/image/empty/noimage40.png')" style="height:40px;width:40px;"></el-image>
					</div>	
					<div v-if="scope.row.status=='none'">
						
					</div>
				 </template>
			</el-table-column>
		   <el-table-column fixed  v-if="activeName=='adproducts'" label="商品信息"  width="170" show-overflow-tooltip>
				   <template #default="scope">
					   <div v-if="scope.row.statustype=='product'">
						   售价:{{scope.row.landed_amount}}
					   </div>
					   <div v-else>
						   <div v-if="scope.row.status!='none'">
							<div  class='name'>{{scope.row.productname}}</div>
							<div class='sku'>{{scope.row.sku}} <span class="font-extraSmall">{{scope.row.groupname}}-{{scope.row.market}}</span></div>
						  </div>
						  <div v-else>
							  	<div  class='name'>{{scope.row.name}}</div>
						  </div>
						</div>
				   </template>
		    </el-table-column>
			<el-table-column fixed  v-if="activeName=='adkey'" label="关键词"  width="200" show-overflow-tooltip>
					   <template #default="scope">
						   <div v-if="scope.row.status!='none'">
							<div  class='name'>{{scope.row.keywordText}}</div>
							<div  > <span class="font-extraSmall">{{scope.row.groupname}}-{{scope.row.market}}</span></div>
						  </div>
						  <div v-else>
								<div  class='name'>{{scope.row.name}}</div>
						  </div>
					   </template>
			 </el-table-column>
			 <el-table-column fixed  v-if="activeName=='adtarget'" label="商品投放"  width="200" show-overflow-tooltip>
			 		   <template #default="scope">
			 			   <div v-if="scope.row.status!='none'">
			 				<div  class='name' v-html="targetnameFormatter(scope.row)"></div>
			 				<!-- <div  > <span class="font-extraSmall">{{scope.row.groupname}}-{{scope.row.market}}</span></div> -->
			 			  </div>
			 			  <div v-else>
			 					<div  class='name'>{{scope.row.name}}</div>
			 			  </div>
			 		   </template>
			  </el-table-column>
			  <el-table-column fixed  v-if="activeName=='adsearch' || activeName=='adtargetquery'" label="Search Terms"  width="230" show-overflow-tooltip>
			  		   <template #default="scope">
			  			   <div>{{scope.row.query}}</div>
			  		   </template>
			   </el-table-column>
			 <el-table-column    v-if="activeName=='adnkey'" label="否定关键词"    show-overflow-tooltip>
			 		   <template #default="scope">
			 			   <div>{{scope.row.keywordText}}</div>
			 		   </template>
			  </el-table-column>
			  <el-table-column    v-if="activeName=='adntarget'" label="否定表达式"    show-overflow-tooltip>
			  		   <template #default="scope">
			  			   <div v-html="faltngatargetFormatter(scope.row)"></div>
			  		   </template>
			   </el-table-column>

		   <el-table-column v-if="activeName!='adsearch' && activeName!='adtargetquery'"  label="状态"  >
			   <template #default="scope">
				   <div v-if="activeName=='adnkey'">
					   <span v-if="scope.row.status=='deleted'|| scope.row.status=='archived'">存档</span>
					   <span v-if="scope.row.status=='enabled' ">已启动</span>
					   <span v-if="scope.row.status=='pending'">待审核</span>
				   </div>
				   <div v-else-if="activeName=='adntarget'">
					   <span>{{scope.row.status}}</span>
				   </div>
				   <div v-else>
				    <el-switch v-if="scope.row.status=='archived'" disabled
				       v-model="scope.row.checkstatus"
					    inline-prompt
						width="45px"
					   active-text="开启"
					   inactive-text="归档"
				       size="small"
				     />
					 <el-switch v-else-if="scope.row.status=='enabled' || scope.row.status=='paused'"  
					    v-model="scope.row.checkstatus"
						 inline-prompt
						 width="45px"
						active-text="开启"
						inactive-text="暂停"
					    size="small"
					  />
					  <span v-else></span>
					  </div>
			   </template>
			</el-table-column>
			<el-table-column v-if="activeName=='adcams'"  label="投资组合" width="120 "  prop="portfolioid">
				<template #default="scope">
				   		 <span v-if="scope.row.status!='none'">{{getValue(scope.row.portfoliosName)}}</span>
				  </template>
			</el-table-column>
			<el-table-column   label="分时策略" v-if="activeName=='adcams'" width="100 "  prop="set">
			<template #default="scope">
				   <span v-if="scope.row.status!='none'" class="table-edit-flex" @click="scheduleSet">
				   		 <span>{{scope.row.set}}</span>
				   		<el-icon ><Edit/></el-icon>
				   </span>
				  </template>
			</el-table-column>
			<el-table-column  v-if="activeName=='adcams'" label="投放"  width="60" >
			 			   <template #default="scope">
							   <span v-if="scope.row.status!='none'">
								   <span v-if="scope.row.targetingType=='auto'">自动</span>
								   <span v-else>手动</span>
							   </span>
			 			   </template>
			  </el-table-column>
			<el-table-column v-if="activeName=='adcams'"  label="开始日期"  width="120 "  >
				<template #default="scope">
							<span v-if="scope.row.status!='none'" >{{dateFormat(scope.row.startDate)}} </span>
				</template>
			</el-table-column>
			<el-table-column  v-if="activeName=='adcams'" label="结束日期" width="120 "  >
				<template #default="scope">
				   <span v-if="scope.row.status!='none'" class="table-edit-flex" @click="e=>pickDate(e,scope.row)">
				   		 <span>{{dateFormat(scope.row.endtime)}}</span>
				   		<el-icon ><Edit/></el-icon>
				   </span>
				  </template>
			</el-table-column>
			<el-table-column  v-if="activeName=='adcams'"  label="预算"  width="80" prop="budget">
			<template #default="scope">
				  <el-link v-if="scope.row.status!='none'" type="primary" @click="e=>budgetEdit(e,scope.row)" :underline="false">
					  ${{scope.row.budget}}
				  </el-link>
				  </template>
			</el-table-column>
			<el-table-column v-if="activeName=='adcams'"  label="竞价策略" width="190 "  prop="bidding">
				<template #default="scope">
					<span v-if="scope.row.status!='none'" class="table-edit-flex" @click="biddingEdit(scope.row)">
						 <span class="font-extraSmall" v-html="bidplusFormatter(scope.row)"></span>
						 <el-icon ><Edit/></el-icon>
					</span>
				</template>
			</el-table-column>
			<el-table-column   v-if="activeName!='adcams'" label="广告活动"  width="200" >
				   <template #default="scope">
					   <span v-if="scope.row.status=='none'&& !scope.row.statustype"  style="font-size: 12px;"  >
					     <span v-if="activeName=='adgroups'|| activeName=='adproducts' ||  activeName=='adkey'||  activeName=='adtarget'"></span>
						 <span v-else>{{scope.row.name}}</span>
					   </span>
					    <span  v-else-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
							7/30日销量图表:
							<el-icon class="pointer" @click.stop="showOrderby(scope.row)"><Histogram /></el-icon>
						</span>
						   <el-link v-else :underline="false" type="primary">
						   <span @click.stop="bindAdvCams(scope.row.campaignId,scope.row.campaignName)" v-if="scope.row.campaignName">
							   {{scope.row.campaignName}}
						   </span>
						   <span v-else>
							   <span >{{scope.row.name}}</span>
						   </span>
						   </el-link>
				   </template>
			 </el-table-column>
			 <el-table-column   v-if="activeName!='adcams' && activeName!='adgroups'" label="广告组"  width="200" >
			 	   <template #default="scope">
			 		   <span v-if="scope.row.status=='none'&& !scope.row.statustype"  style="font-size: 12px;"  >
						  <span v-if="activeName=='adgroups'|| activeName=='adproducts' ||  activeName=='adkey'||  activeName=='adtarget'"></span>
						  <span v-else>{{scope.row.name}}</span>
					   </span>
					   <span  v-else-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
					   	7日转化率:
					  <span v-if="scope.row.advctr"> {{formatPercent(scope.row.advctr)}}</span>
					   </span>
			 				   <el-link v-else :underline="false" type="primary">
			 				   <span v-if="scope.row.adGroupName"  
							   @click.stop="bindAdvGpds(scope.row.adGroupId,scope.row.adGroupName,scope.row.campaignId,scope.row.campaignName)">
			 					   {{scope.row.adGroupName}}
			 				   </span>
			 				   </el-link>
			 	   </template>
				   
			  </el-table-column>
			  <el-table-column   v-if="activeName=='adsearch'" label="关键词"  width="220" >
			  		   <template #default="scope">
			  			<div v-if="scope.row.status!='none'">
			  					<div  class='name'>{{scope.row.keywordText}}</div>
			  					<div  > <span class="font-extraSmall">{{scope.row.groupname}}-{{scope.row.market}}</span></div>
			  			</div>
			  		   </template>
			   </el-table-column>
			   <el-table-column   v-if="activeName=='adntarget'" label="表达式类型"  width="120" >
			   		   <template #default="scope">
			   			 {{scope.row.expressionType}}
			   		   </template>
			    </el-table-column>
			  <el-table-column   v-if="activeName=='adkey' || activeName=='adsearch' || activeName=='adnkey'" label="匹配类型"  width="200" >
			  	   <template #default="scope">
			  				<span v-if="scope.row.matchType=='broad'">广泛匹配</span>
							<span v-else-if="scope.row.matchType=='phrase'">词组匹配</span>
							<span v-else-if="scope.row.matchType=='exact'">精确匹配</span>
							<span v-else-if="scope.row.matchType=='negativeExact'">精确匹配</span>
							<span v-else-if="scope.row.matchType=='negativePhrase'">词组匹配</span>
			  	   </template>
			   </el-table-column>
			   <el-table-column   v-if="activeName=='adtarget'" label="匹配类型"  width="200" >
			   	   <template #default="scope">
			   				<span v-if="scope.row.expressionType=='auto'">自动</span>
							<span v-else-if="scope.row.expressionType=='manual'">手动</span>
			   	   </template>
			    </el-table-column>
			   <el-table-column   v-if="activeName=='adkey'" label="建议竞价"  width="120" >
			   	   <template #default="scope">
			   	   			<span class="font-extraSmall" v-html="keysuggestFormatter(scope.row)"></span>
			   	   </template>
			    </el-table-column>
				<el-table-column   v-if="activeName=='adtarget'" label="建议竞价"  width="200" >
					   <template #default="scope">
							 <span class="font-extraSmall" v-html="targetsuggestFormatter(scope.row)"></span>
					   </template>
				 </el-table-column>
				 <el-table-column   v-if="activeName=='adtarget'" label="商品投放竞价"  width="130" >
				 	   <template #default="scope">
				 				<span v-if="scope.row.bid">{{scope.row.bid}}</span>
				 	   </template>
				  </el-table-column>
			   <el-table-column   v-if="activeName=='adkey'" label="关键词竞价"  width="120" >
			   	   <template #default="scope">
			   				<span v-if="scope.row.bid">{{scope.row.bid}}</span>
			   	   </template>
			    </el-table-column>
			 <el-table-column   v-if="activeName=='adgroups'" label="建议竞价"  width="200" >
			 	   <template #default="scope">
					    <span class="font-extraSmall" v-html="adgroupsuggestFormatter(scope.row)"></span>
			 	   </template>
			  </el-table-column>
			  <el-table-column   v-if="activeName=='adgroups'" label="默认竞价"  width="200" >
			  	   <template #default="scope">
			  		  {{scope.row.defaultBid}}
			  	   </template>
			   </el-table-column>
			<el-table-column   label="曝光量" width="140 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="impressions">
				 <template #default="scope">
				<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
				 	亚马逊库存:
				<span v-if="scope.row.afn_fulfillable_quantity"> {{ scope.row.afn_fulfillable_quantity}}</span>
				</div>
				<span v-else > {{scope.row.impressions}}</span>
				</template>
			</el-table-column>
			<el-table-column   label="点击次数" width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="clicks">
				<template #default="scope">
				<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
					广告总花费:
				<span v-if="scope.row.advspend"> {{ scope.row.advspend}}</span>
				</div>
				<span v-else > {{scope.row.clicks}}</span>
				</template>
			</el-table-column>
			<el-table-column   label="点击率" width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="CTR" >
				<template #default="scope">
					<span v-if="scope.row.status!='none'">{{formatPercent(scope.row.CTR)+"%"}}</span>
					<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
						其它成本:
					<span v-if="scope.row.othercost"> {{ scope.row.othercost}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column   label="每次点击费用" width="130" v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="avgcost">
				<template #default="scope">
					<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
						利润率:
					<span v-if="scope.row.prorate"> {{ formatFloat(scope.row.prorate/100)}}%</span>
					</div>
					<span v-else>{{formatFloat(scope.row.avgcost)}}</span>
			 		
			 	</template>
			 </el-table-column>
			<el-table-column   label="广告费"  width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="cost">
				<template #default="scope">
				<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
					利润:
				<span v-if="scope.row.profits"> {{ formatFloat(scope.row.profits)}}</span>
				</div>
				<span v-else > {{scope.row.cost}}</span>
				</template>
			 </el-table-column>
			<el-table-column   label="广告销售额" width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="sumSales">
					<template #default="scope">
							<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
								净利润率:
							<span v-if="scope.row.proprate"> {{ formatFloat(scope.row.proprate)}}</span>
							</div>
							<span v-else > {{scope.row.sumSales}}</span>
					</template>
			</el-table-column>
			<el-table-column   label="销量" width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="sumUnits" >
				<template #default="scope">
							<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
								净利润:
							<span v-if="scope.row.profitall"> {{ formatFloat(scope.row.profitall)}}</span>
							</div>
							<span v-else > {{scope.row.sumUnits}}</span>
					</template>
			</el-table-column>
			<el-table-column   label="订单量" width="130 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="attributedUnitsOrdered" >
				<template #default="scope">
							<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
								ACoAS:
							<span v-if="scope.row.acoas"> {{ formatFloat(scope.row.acoas)}}</span>
							</div>
							<span v-else > {{scope.row.attributedUnitsOrdered}}</span>
					</template>
			</el-table-column>
			<el-table-column   label="Acos" width="140 " v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="ACOS">
				<template #default="scope">
					<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
						<span>购物车比例:<span v-if="scope.row.buybox"></span>{{scope.row.buybox}}%</span>
					 </div>
					<span v-else>{{formatPercent(scope.row.ACOS)+"%"}}</span>
				</template>
			</el-table-column>
			<el-table-column   label="RoAS" width="120 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="ROAS">
				<template #default="scope">
					<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
					 </div>
					<span v-else>{{formatFloat(scope.row.ROAS)}}</span>
				</template>
			</el-table-column>
			<el-table-column   label="转化率" width="120 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="CSRT">
				<template #default="scope">
					<div  v-if="scope.row.status=='none' && scope.row.statustype=='product'"    >
					 </div>
					<span v-else>{{formatPercent(scope.row.CSRT)+"%"}}</span>
					</template>
			</el-table-column>
			<el-table-column   label="广告贡献销售额-目标商品" width="180 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="attributedSalesSameSKU"/>
			<el-table-column   label="广告贡献销售额-其它商品" width="180 " v-if="activeName!='adnkey' && activeName!='adntarget'" prop="attributedSales"/>
			<el-table-column   label="广告转化量-目标商品" width="160" v-if="activeName!='adnkey' && activeName!='adntarget'" prop="attributedConversionsSameSKU"/>
			<el-table-column   label="广告转化量-其它商品"  width="160" v-if="activeName!='adnkey' && activeName!='adntarget'"  prop="attributedConversions"/>
 
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
	import {Search,ArrowDown,Edit,Histogram} from '@element-plus/icons-vue';
	import BiddingDialog from '@/views/amazon/advertisement/common/bidding_dialog.vue';
	import AdOrderCycle from '@/views/amazon/advertisement/common/ad_order_cycle.vue';
	import SchedulePlan from '@/views/amazon/advertisement/common/schedule_plan.vue';
	import advertApi from '@/api/amazon_adv/advertApi.js';
	import advCampaignApi from '@/api/amazon_adv/advCampaignApi.js';
	import advAdgroupApi from '@/api/amazon_adv/advAdgroupApi.js';
	import advProductsApi from '@/api/amazon_adv/advProductsApi.js';
	import productAnysApi from '@/api/amazon/product/productAnysApi.js';
	import advKeywordsApi from '@/api/amazon_adv/advKeywordsApi.js';
	import advTargetApi from '@/api/amazon_adv/advTargetApi.js';
	import {dateFormat,formatFloat,getValue,formatPercent} from '@/utils/index';
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
		],total:0},
		summary:{},
		expandType:"",
		queryParams:{},
		defaultSort:undefined,
		bindParams:{},
	})
	const{
		tableData,
		visible,
		budgetVisible,
		editRow,
		summary,
		expandType,
		queryParams,
		defaultSort,
		bindParams,
	}=toRefs(state)
	const emits = defineEmits(['selectRow','change','bindData']);
	function showOrderby(row){
		//展示图表
	}
	function bindAdvCams(id,name){
		state.bindParams.campaignid=id;
		state.bindParams.camname=name;
		state.bindParams.adgroupid=null;
		state.bindParams.adgroupname=null;
		emits("bindData",state.bindParams);
	}
	function bindAdvGpds(adid,adname,camid,camname){
		state.bindParams.campaignid=camid;
		state.bindParams.camname=camname;
		state.bindParams.adgroupid=adid;
		state.bindParams.adgroupname=adname;
		emits("bindData",state.bindParams);
	}
	function faltngatargetFormatter(row) {
		var value=row.expression;
		var html = "";
		var iconlight = "icon-lightbulb-o";
		var region = "(" + row.groupname + "/" + row.market + ")";
		var txtval = getValue(value);
		var expressionType = row.expressionType;
		if (expressionType) {
			if (expressionType == "manual") {
				if (value) {
					value = value.replace("[", "").replace("]", "").replaceAll("{","").replaceAll("}", "").replaceAll("\"", "")
							.replaceAll("type:", "").replaceAll("value", "").replaceAll(",:", "=").toUpperCase().replaceAll("ASINSAMEAS", "asin");
					txtval = txtval.replace("[", "").replace("]", "").replaceAll("{", "").replaceAll("}", "").replaceAll("\"", "")
							.replaceAll("type:", "").replaceAll("value", "").replaceAll(",:", "=").toUpperCase().replaceAll("ASINSAMEAS", "asin");
					if (value.length > 40) {
						txtval = value.substring(0, 35) + "...";
					}
				}
			} else {
				if (value) {
					value = value.replace("]", "").replace("}", "").split(":")[1].replaceAll("\"", "").toUpperCase().replaceAll("ASINSAMEAS", "asin");
					txtval = txtval.replace("]", "").replace("}", "").split(":")[1].replaceAll("\"", "").toUpperCase().replaceAll("ASINSAMEAS", "asin");
					if (value.indexOf("queryHighRelMatches")>=0) {
						value = "Close-match"
					}
					if (value.indexOf("queryBroadRelMatches")>=0) {
						value = "Loose-match"
					}
					if (value.indexOf("asinSubstituteRelated")>=0) {
						value = "Substitutes"
					}
					if (value.indexOf("asinAccessoryRelated")>=0) {
						value = "Complements"
					}
					txtval = value;
					if (value.length > 40) {
						txtval = value.substring(0, 35) + "...";
					}
				}
			}
		}
		if (txtval.indexOf("queryHighRelMatches")>=0) {
			txtval = "Close-match"
		}
		if (txtval.indexOf("queryBroadRelMatches")>=0) {
			txtval = "Loose-match"
		}
		if (txtval.indexOf("asinSubstituteRelated")>=0) {
			txtval = "Substitutes"
		}
		if (txtval.indexOf("asinAccessoryRelated")>=0) {
			txtval = "Complements"
		}
		html = "<div style='width:300px;margin:0;' class='row'><div "
				+ " class='col-lg-9 padding0'>"
				+ "<span targetid='"
				+ row.id
				+ "'   class='pointer'   title='"
				+ getValue(value)
				+ "'>"
				+ txtval
				+ "</span>"
				+ "&nbsp;&nbsp; "
				+ "</div><div class='padding0' style='float:right;margin-right:20px;'><span  class='" + iconlight
				+ " text-red'></span></div></div>"
				+ "<div class='light-font' style='font-size:10px;' >" + region
				+ "</div>";
		return html;
	}
	function targetnameFormatter(row) {
	var value=row.expression;
	var html = "";
	var iconlight = "icon-lightbulb-o";
	var region = "(" + row.groupname + "/" + row.market + ")";
	var expressionType = row.expressionType;
	var targetingText = row.targetingText;
	var txtval = getValue(value);
	if (targetingText != null && targetingText != "" && targetingText != undefined&&targetingText.indexOf("{")<0) {
		value = targetingText;
		txtval = getValue(value);
		if (value.length > 40) {
			txtval = value.substring(0, 35) + "...";
		}
	} else {
		if (expressionType) {
			if (expressionType == "manual") {
				if (value) {
					value = value.replace("[", "").replace("]", "").replaceAll("{", "").replaceAll("}", "").replaceAll("\"", "")
							.replaceAll("type:", "").replaceAll("value", "").replaceAll(",:", "=").replaceAll("asinSameAs", "asin");
					txtval = txtval.replace("[", "").replace("]", "").replaceAll("{", "").replaceAll("}", "").replaceAll("\"", "").replaceAll("type:", "")
							.replaceAll("value", "").replaceAll(",:", "=").replaceAll("asinSameAs", "asin");
					if (value.length > 40) {
						txtval = value.substring(0, 35) + "...";
					}
					if (value.indexOf("queryHighRelMatches")>=0) {
						value = "Close-match"
					}
					if (value.indexOf("queryBroadRelMatches")>=0) {
						value = "Loose-match"
					}
					if (value.indexOf("asinSubstituteRelated")>=0) {
						value = "Substitutes"
					}
					if (value.indexOf("asinAccessoryRelated")>=0) {
						value = "Complements"
					}
					txtval = value;
					if (value.length > 40) {
						txtval = value.substring(0, 35) + "...";
					}
				}
			} else {
				if (value) {
					value = value.replace("]", "").replace("}", "").split(":")[1].replaceAll("\"", "").replaceAll("asinSameAs", "asin");
					txtval = txtval.replace("]", "").replace("}", "").split(":")[1].replaceAll("\"", "").replaceAll("asinSameAs", "asin");
					if (value.indexOf("queryHighRelMatches")>=0) {
						value = "Close-match"
					}
					if (value.indexOf("queryBroadRelMatches")>=0) {
						value = "Loose-match"
					}
					if (value.indexOf("asinSubstituteRelated")>=0) {
						value = "Substitutes"
					}
					if (value.indexOf("asinAccessoryRelated")>=0) {
						value = "Complements"
					}
					txtval = value;
					if (value.length > 40) {
						txtval = value.substring(0, 35) + "...";
					}
				}
			}
		}
	}
	 
	if (txtval.indexOf("queryHighRelMatches")>=0) {
		txtval = "Close-match"
	}
	if (txtval.indexOf("queryBroadRelMatches")>=0) {
		txtval = "Loose-match"
	}
	if (txtval.indexOf("asinSubstituteRelated")>=0) {
		txtval = "Substitutes"
	}
	if (txtval.indexOf("asinAccessoryRelated")>=0) {
		txtval = "Complements"
	}
	html = "<div style='width:300px;margin:0;' class='row'><div "
			+ " class='col-lg-9 padding0'>"
			+ "<span targetid='"
			+ row.id
			+ "'   class='pointer'   title='"
			+ getValue(value)
			+ "'>"
			+ txtval
			+ "</span>"
			+ "&nbsp;&nbsp; "
			+ "</div><div class='padding0'  style='float:right;margin-right:20px;'><span onclick='showAdgroupRemaindModal(\""
			+ row.id + "\");' class='" + iconlight
			+ " text-red'></span></div></div>"
			+ "<div class='light-font' style='font-size:10px;' >" + region
			+ "</div>";
	return html;
}

function targetsuggestFormatter(row) {
	var suggestedbid = "";
	var rangeEnd = "";
	var rangeStart = "";
	if (row["suggestedbid"])
		suggestedbid = row.suggestedbid;
	if (row["rangeEnd"])
		rangeEnd = row.rangeEnd;
	if (row["rangeStart"])
		rangeStart = row.rangeStart;
	if (row.expressionType != "manual"){
		return "<span title='自动类型,无建议竞价'>-</span>";
	}else{
		return "<div id='suggests" + row.id + "'>" + suggestedbid
				+ "<div class='light-font text-sm'>" + rangeStart + "-" + rangeEnd + "</div><div>";
	}
}
	
	function adgroupsuggestFormatter(row) {
		var suggestedbid = "";
		var rangeEnd = "";
		var rangeStart = "";
		if (row["targetingtype"] != "auto") {
			return "<span class='light-font' style='font-size:10px;' title='非自动广告活动下的广告组无建议竞价'>无建议竞价</span>";
		}
		if (row["suggestedbid"]) {
			suggestedbid = row.suggestedbid;
		}
		if (row["rangeEnd"]) {
			rangeEnd = row.rangeEnd;
		}
		if (row["rangeStart"]) {
			rangeStart = row.rangeStart;
		}
	    return  suggestedbid + "<div class='light-font text-sm'>" + rangeStart + "-" + rangeEnd + "</div>" ;
		  
	}
	
	function keysuggestFormatter(row) {
		var suggestedbid = "";
		var rangeEnd = "";
		var rangeStart = "";
		if (row["suggestedbid"]) {
			suggestedbid = row.suggestedbid;
		}
		if (row["rangeEnd"]) {
			rangeEnd = row.rangeEnd;
		}
		if (row["rangeStart"]) {
			rangeStart = row.rangeStart;
		}
		if (row.targetingType != "manual") {
			return "<span title='自动类型,无建议竞价'>无建议竞价</span>";
		}
		 
		return "<div id='suggest" + row.id + "'>" + suggestedbid
				+ "<div class='light-font text-sm'>" + rangeStart + "-" + rangeEnd + "</div><div>";
		 
	
	}
	
	function bidplusFormatter(row) {
		if(row.name == "汇总"){
			return "";
		}
		var value = row.bidding;
		var addhtml = "";
		if (value) {
			var data = JSON.parse(value);
			if (data["strategy"]) {
				value = data.strategy;
				if ("autoForSales" == value)
					value = "提高和降低";
				if ("legacyForSales" == value)
					value = "只降低";
				if ("manual" == value)
					value = "固定竞价";
				var just = data.adjustments;
				if (just.length > 0 && just) {
					var tophtml = "";
					var prohtml = "";
					for (var i = 0; i < just.length; i++) {
						var predicate = just[i].predicate;
						if (just.length == 2) {
							if (predicate == "placementTop") {
								tophtml += "<span class='light-font'>首页:</span>" + getValue(just[i].percentage) + "%";
							} else {
								prohtml += "<span class='light-font'>商品页面:</span>" + getValue(just[i].percentage) + "%";
							}
						}
						if (just.length == 1) {
							if (predicate == "placementTop") {
								tophtml += "<span class='light-font'>首页:</span>" + getValue(just[i].percentage) + "%";
								prohtml += "<span class='light-font'>商品页面:0%<span>";
							} else {
								prohtml += "<span class='light-font'>商品页面:</span>" + getValue(just[i].percentage) + "%";
								tophtml += "<span class='light-font'>首页:0%</span>";
							}
						}
					}
					addhtml = "<div class='text-sm'>" + tophtml + " | " + prohtml + "</div>";
				} else {
					addhtml = "<div  class='text-sm light-font'>首页:0%  |  商品页面:0%</div>";
				}
			}
		}
		var html = "<a  class='pointer text-blue' >" + getValue(value) + "</a>"
				+ addhtml;
		return html;
	}
	 
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
	
	function handleAdvDaysData(row,advData){
		advData.push({
			name:'1天内成交',
			attributedSalesSameSKU:row.attributedSalesSameSKU1d,
			sumUnits:row.sumUnits1d,
			sumSales:row.sumSales1d,
			attributedUnitsOrdered:row.attributedUnitsOrdered1d,
			ACOS:row.ACOS1d,
			ROAS:row.ROAS1d,
			CSRT:row.CSRT1d,
			attributedSalesSameSKU:row.attributedSalesSameSKU1d,
			attributedSales:row.attributedSales1d,
			attributedConversionsSameSKU:row.attributedConversionsSameSKU1d,
			attributedConversions:row.attributedConversions1d,
			status:'none',
		});
		advData.push({
			name:'7天内成交',
			attributedSalesSameSKU:row.attributedSalesSameSKU7d,
			sumUnits:row.sumUnits7d,
			sumSales:row.sumSales7d,
			attributedUnitsOrdered:row.attributedUnitsOrdered7d,
			ACOS:row.ACOS7d,
			ROAS:row.ROAS7d,
			CSRT:row.CSRT7d,
			attributedSalesSameSKU:row.attributedSalesSameSKU7d,
			attributedSales:row.attributedSales7d,
			attributedConversionsSameSKU:row.attributedConversionsSameSKU7d,
			attributedConversions:row.attributedConversions7d,
			status:'none',
		});
		advData.push({
			name:'14天内成交',
			attributedSalesSameSKU:row.attributedSalesSameSKU14d,
			sumUnits:row.sumUnits14d,
			sumSales:row.sumSales14d,
			attributedUnitsOrdered:row.attributedUnitsOrdered14d,
			ACOS:row.ACOS14d,
			ROAS:row.ROAS14d,
			CSRT:row.CSRT14d,
			attributedSalesSameSKU:row.attributedSalesSameSKU14d,
			attributedSales:row.attributedSales14d,
			attributedConversionsSameSKU:row.attributedConversionsSameSKU14d,
			attributedConversions:row.attributedConversions14d,
			status:'none',
		});
		advData.push({
			name:'30天内成交',
			attributedSalesSameSKU:row.attributedSalesSameSKU30d,
			sumUnits:row.sumUnits30d,
			sumSales:row.sumSales30d,
			attributedUnitsOrdered:row.attributedUnitsOrdered30d,
			ACOS:row.ACOS30d,
			ROAS:row.ROAS30d,
			CSRT:row.CSRT30d,
			attributedSalesSameSKU:row.attributedSalesSameSKU30d,
			attributedSales:row.attributedSales30d,
			attributedConversionsSameSKU:row.attributedConversionsSameSKU30d,
			attributedConversions:row.attributedConversions30d,
			status:'none',
		});
		return advData;
	}
	function handleAdvPlacementData(datas){
		if(datas && datas.length>0){
			datas.forEach(item=>{
				item.ACOS=item.ACOSPlacement;
				item.CTR=item.CTRPlacement;
				item.ROAS=item.ROASPlacement;
				item.attributedConversions=item.attributedConversionsPlacement;
				item.attributedConversionsSameSKU=item.attributedConversionsSameSKUPlacement;
				item.attributedSales=item.attributedSalesPlacement;
				item.attributedSalesSameSKU=item.attributedSalesSameSKUPlacement;
				item.attributedUnitsOrdered=item.attributedUnitsOrderedPlacement;
				item.avgcost=item.avgcostPlacement;
				item.clicks=item.clicksPlacement;
				item.cost=item.costPlacement;
				item.impressions=item.impressionsPlacement;
				item.sumSales=item.sumSalesPlacement;
				item.sumUnits=item.sumUnitsPlacement;
				item.status='none';
			});
		}
	}
	
	function handleExpandChange(row,treeNode,resolve){
		if(state.expandType==""){
			ElMessage.error("请在右上角先选择数据展开类型！");
			return;
		}
		row.children=[{status:'none',name:'暂无数据！'}];
		if(state.expandType=="days"){
			//处理广告周期数据
			var advData=[];
			advData=handleAdvDaysData(row,advData);
			row.children=advData;
		}else if(state.expandType=="placement"){
			var data={};
			data.profileid=state.queryParams.profileid;
			data.campaignId=row.id;
			data.campaignType="SP";
			data.fromDate=state.queryParams.fromDate;
			data.endDate=state.queryParams.endDate;
			advCampaignApi.getCampaignPlacement(data).then((res)=>{
				if(res.data && res.data.length>0){
					var datas=res.data;
					handleAdvPlacementData(datas);
					row.children=datas;
				}else{
					row.children=[{status:'none',name:'暂无数据！'}];
				}
				
			});
		}else if(state.expandType=="sumproducts"){
			var data={};
			data.sku=row.sku;
			data.marketplaceid=row.marketplaceid;
			data.sellerid=row.sellerId;
			data.groupid=row.groupid;
			productAnysApi.productdetailByInfo(data).then((res)=>{
				if(res.data){
					var datas=[];
					res.data.status="none";
					res.data.statustype="product";
					datas.push(res.data);
					row.children=datas;
				}else{
					row.children=[{status:'none',name:'暂无数据！'}];
				}
			});
		}else if(state.expandType=="otherproducts"){
			var data={};
			data.campaignid=row.campaignId;
			data.adGroupid=row.adGroupId;
			data.profileid=row.profileid;
			data.asin=row.asin;
			data.fromDate=state.queryParams.fromDate;
			data.endDate=state.queryParams.endDate;
			advProductsApi.getProductAdotherAsin(data).then((res)=>{
				if(res.data && res.data.length>0){
					var datas=res.data;
					datas.forEach(item=>{
						item.attributedSales=item.attributedSalesOtherSKU;
						item.attributedUnitsOrdered=item.attributedUnitsOrderedOtherSKU;
						item.status="none";
					});
					row.children=datas;
				}else{
					row.children=[{status:'none',name:'暂无数据！'}];
				}
			});
		}
		
	}
	function expandAll(ftype){
		if(ftype=="days"){
			//广告成交周期展开
			state.expandType="days";
		}else if(ftype=="placement"){
			//广告位置展开
			state.expandType="placement";
		}else if(ftype=="sumproducts"){
			//广告商品展开
			state.expandType="sumproducts";
		}else if(ftype=="otherproducts"){
			//广告贡献-其它商品展开
			state.expandType="otherproducts";
		}
		var records=JSON.parse(JSON.stringify(state.tableData.records)); 
		records.forEach(item=>{
			handleExpandChange(item);
		});
		state.tableData.records=[];
		var time=setTimeout(function(){
			state.tableData.records=records;
			clearTimeout(time);
		},1000);
		
		// state.tableData.records.forEach((row)=>{
		// 	globalTable.value.toggleRowExpansion(row);
		// })
	}
	function handleApiData(res){
		if(res.data.total>0){
			res.data.records.forEach(item=>{
				if(item.status=="enabled"){
					item.checkstatus=true;
				}else{
					item.checkstatus=false;
				}
			});
		}
		state.tableData.records =  res.data.records;
		state.tableData.total = res.data.total;
	}
	
	function loadApiData(params,ftype){
		state.summary={};
		if(ftype=='adcams'){
			//广告活动
			advCampaignApi.getCampaignList(params).then((res)=>{
				 handleApiData(res);
				if(params.currentpage==1){
					 if(state.tableData.total>0){
						 advCampaignApi.getSumCampaign(params).then((ress)=>{
							 state.summary=ress.data;
							 emits('change',state.summary)
						 });
					 }else{
						 state.summary={};
						  emits('change',state.summary)
					 }
					 
				}
			})
		}else if(ftype=='adgroups'){
			//广告组
			advAdgroupApi.getAdGroupList(params).then((res)=>{
				 handleApiData(res);
				 //加载广告组建议竞价
				 if(res.data.total>0){
					 state.tableData.records.forEach(item=>{
						 //String profileid,String adgroupid,String campaignid
						advAdgroupApi.getAdGroupSuggestBid({"profileid":params.profileid,"adgroupid":item.id,"campaignid":item.campaignId}).then((ress)=>{
							if (ress.data["suggestedBid"] && item) {
								item.suggestedbid = ress.data.suggestedBid.suggested;
								item.rangeEnd = ress.data.suggestedBid.rangeEnd;
								item.rangeStart = ress.data.suggestedBid.rangeStart;
							}
						}); 
					 });
				 }
				if(params.currentpage==1){
					 if(state.tableData.total>0){
						 advAdgroupApi.getSumAdGroup(params).then((ress)=>{
							 state.summary=ress.data;
							 emits('change',state.summary);
						 });
					 }else{
						 state.summary={};
						  emits('change',state.summary)
					 }
				}
			})
		}else if(ftype=='adproducts'){
			//广告商品
			advProductsApi.getProductAdList(params).then((res)=>{
				 handleApiData(res);
				if(params.currentpage==1){
					 if(state.tableData.total>0){
						 advProductsApi.getSumProductAd(params).then((ress)=>{
							 state.summary=ress.data;
							  emits('change',state.summary)
						 });
					 }else{
						 state.summary={};
						  emits('change',state.summary)
					 }
				}
			})
		}else if(ftype=='adkey'){
			//关键词
			advKeywordsApi.getKeywordList(params).then((res)=>{
				 handleApiData(res);
				 //加载关键词建议竞价
				 if(res.data.total>0){
						 state.tableData.records.forEach(item=>{
							advKeywordsApi.getKeywordSuggestBid({"profileid":params.profileid,"id":item.id}).then((ress)=>{
								if (ress.data["suggestedBid"] && item) {
									item.suggestedbid = ress.data.suggestedBid.suggested;
									item.rangeEnd = ress.data.suggestedBid.rangeEnd;
									item.rangeStart = ress.data.suggestedBid.rangeStart;
								}
							}); 
						 });
				 }
				if(params.currentpage==1){
					 if(state.tableData.total>0){
						 advKeywordsApi.getSumAdvKeywords(params).then((ress)=>{
							 state.summary=ress.data;
							  emits('change',state.summary)
						 });
					 }else{
						 state.summary={};
						  emits('change',state.summary)
					 }
				}
			})
			
		}else if(ftype=="adtarget"){
			//广告商品投放
			advTargetApi.getProductTargeList(params).then((res)=>{
				 handleApiData(res);
				 //加载商品投放建议竞价
				 if(res.data.total>0){
						 state.tableData.records.forEach(item=>{
							 var expressionObj = {};
							 var expressionsArray = [];
							 var dataArray = eval(item.expression);
							 expressionsArray.push(dataArray);
							 expressionObj.expressions = expressionsArray;
							var exstr=JSON.stringify(expressionObj);
							advTargetApi.getTargetBidRecommendations({"profileid":params.profileid,"adGroupid":item.adGroupId,"campaignId":item.campaignId,
							"expression":exstr,"adtype":"sp"}).then((ress)=>{
								//ress.data["suggestedBid"]
								if (ress.data[0].suggestedBid && item) {
									item.suggestedbid = ress.data[0].suggestedBid.suggested;
									item.rangeEnd = ress.data[0].suggestedBid.rangeEnd;
									item.rangeStart = ress.data[0].suggestedBid.rangeStart;
								}
							}); 
						 });
				 }
				if(params.currentpage==1){
					 if(state.tableData.total>0){
						 advTargetApi.getSumProductTarge(params).then((ress)=>{
							 state.summary=ress.data;
							  emits('change',state.summary)
						 });
					 }else{
						 state.summary={};
						  emits('change',state.summary)
					 }
				}
			})
		}else if(ftype=="adsearch"){
			//用户搜索词
			advKeywordsApi.getKeywordQueryList(params).then((res)=>{
				 handleApiData(res);
				 // if(params.currentpage==1){
				 // 	 if(state.tableData.total>0){
				 // 		 advKeywordsApi.getSumAdvKeywords(params).then((ress)=>{
				 // 			 state.summary=ress.data;
				 // 			  emits('change',state.summary)
				 // 		 });
				 // 	 }else{
				 // 		 state.summary={};
				 // 		  emits('change',state.summary)
				 // 	 }
				 // }
			})
		}else if(ftype=="adnkey"){
			//否定关键词
			advKeywordsApi.getNegativaKeywordsList(params).then((res)=>{
				 handleApiData(res);
			})
		}else if(ftype=="adntarget"){
			//否定投放
			advTargetApi.getNegativaTargeList(params).then((res)=>{
				 handleApiData(res);
			})
		}
		else if(ftype=="adtargetquery"){
			//用户投放搜索
			advTargetApi.getProductTargeQueryList(params).then((res)=>{
				 handleApiData(res);
			})
		}
	}
	
	function loadTableData(params){
		state.queryParams=params;
		loadApiData(params,params.ftype);
	}
	function handleQuery(params){
		if(params.ftype=='adcams'){
			state.defaultSort={ prop: 'startDate', order: 'descending' };
		}else{
			state.defaultSort=undefined;
		}
	    globalTable.value.loadTable(params);
	}
	function getSummaries({columns,data}){
		var arr = ["合计"];
				columns.forEach((item,index)=>{
					if(props.activeName=='adcams'){
						if(index>=10){
							arr[index]=state.summary[item.property];
						}
					}else if(props.activeName=='adgroups'){
						if(index>=6){
							arr[index]=state.summary[item.property];
						}
					}else if(props.activeName=='adproducts'){
						if(index>=6){
							arr[index]=state.summary[item.property];
						}
					}else if(props.activeName=='adkey'){
						if(index>=8){
							arr[index]=state.summary[item.property];
						}
					}else if(props.activeName=='adtarget'){
						if(index>=8){
							arr[index]=state.summary[item.property];
						}
					}
					
				})
		return  arr
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