<template>
 <div>
	 <GlobalTable  ref="globalTable" :tableData="tableData"  @loadTable="loadtableData" 
	 :stripe="true" height="calc(100vh - 220px)"
	 :defaultSort="defaultSort" @selectionChange = "selectRow"    >
		  <template #field>
		 <el-table-column  type="selection" width="38" />
		 <el-table-column label="图片" width="85">
			 <template #default="scope">
			   <el-image :src="scope.row.image"    style="width:60px; height:60px"  ></el-image>
			 </template>
		 </el-table-column>
		 <el-table-column label="产品信息" min-width="400" >
		 			 <template #default="scope">
		 			 <div class="sku-name ">{{scope.row.name}}</div>
					 <el-space>
					<el-link type="primary" link class="font-base"> {{scope.row.sku}}  </el-link>
					 <span class="font-extraSmall">ASIN:{{scope.row.asin}}</span>
					 <span v-if="scope.row.parentAsin" class="font-extraSmall">  ParentASIN:{{scope.row.parentAsin}}</span>
					 </el-space>
					 <div>
					 <el-space class="font-extraSmall" v-if="scope.row.positiveFeedbackRating>0">
						 <el-rate
							v-model="scope.row.positiveFeedbackRating"
							disabled
							score-template="{value} 星"
						  />
						  <span class="font-extraSmall">共{{scope.row.feedbackCount}}人评论</span>
					 </el-space>
					 </div>
					 <div>
					<el-space :size="8" class=" icon-text-center">
							<el-tag size="small" type="danger" v-if="scope.row.optstatusname">{{scope.row.optstatusname}}</el-tag>
							<!-- <el-tag size="small" type="warning" effect="dark">黄</el-tag> -->
							<!-- <el-tag size="small" type="info">圣诞节</el-tag>
							<el-tag size="small" type="info">会员促销</el-tag> -->
							<el-tag size="small" v-if="scope.row.flownnumber" type="danger">{{scope.row.flownnumber}}人跟卖</el-tag>
					</el-space>
					</div>
					 <el-space class="font-extraSmall" :size="16">
						 <span class="">上架日期：{{scope.row.opendate}} </span>
						 <span class="">店铺：{{scope.row.groupname}} </span>
						 <span class="">国家：{{scope.row.marketplacename}} </span>
					</el-space>
		 			 </template>
		 </el-table-column>
		 <el-table-column  prop="price" label="售价" width="90">
		            <template #default="scope">
						<div class="table-edit-flex" >
							<el-popover placement="right" :width="230" trigger="click" @show.stop="showPrice(scope.row.id)">
							      <template #reference>
							       <span class="sale-price">
							       	${{scope.row.landedAmount}}
							       </span>
							      </template>
							      <el-table  :data="priceList">
							        <el-table-column width="110" prop="ptype" label="类型" >
										<template #default="scope">
											<span v-if="scope.row.ptype=='BUYP'">您的售价</span>
											<span v-if="scope.row.ptype=='BOXP'">购物车售价</span>
											<span v-if="scope.row.ptype=='LOWP'">最低售价</span>
										</template>
								    </el-table-column>
							        <el-table-column width="90" prop="landedAmount" label="价格" >
										<template #default="scope">
											{{scope.row.landedCurrency}} {{scope.row.landedAmount}}
										</template>
									</el-table-column>	
							      </el-table>
							    </el-popover>
						
						<el-icon @click.stop="modifyPrice(scope.row)" ><Edit/></el-icon>
						</div>
						<div @click.stop="viewProfitDetails(scope.row,'has')" class="pointer m-t-8">
							<div  class="font-extraSmall ">利润率</div>	
							<div  class="font-extraSmall l-h-0">{{scope.row.newprorate}}</div>
						</div>
		            </template>
		</el-table-column>
		    <el-table-column   label="销售数据" min-width="420px" class-name="datas-style">
				<template #header>
				 <el-tabs v-model="activeName" class="table-tabs" >
				     <el-tab-pane label="销售数据" name="first"></el-tab-pane>
				     <el-tab-pane label="近七天广告数据" name="second"></el-tab-pane>
				     <el-tab-pane label="近七天成本利润" name="third"></el-tab-pane>
				   </el-tabs>
				</template>
			 <template #default="scope">
				 <el-row v-if="activeName=='first'">
					 <el-col :span="6">
						 <div class="flex-v-bet" >
						  <div>
						  <div class="font-extraSmall">日均销量</div>
						    {{NullTransform(scope.row.averageSalesDay)}} 
						  </div>
						  <div class="m-t-16">
						  <div class="font-extraSmall">销量排名</div>
						    {{NullTransform(scope.row.rank)}}  
						  </div>
						  </div>
					 </el-col>
					 <el-col :span="6">
						 <div class="flex-v-bet">
						  <div>
						  <div class="font-extraSmall">七天销量</div>
							{{NullTransform(scope.row.sumweek)}} 
						  </div>
						  <div class="m-t-16">
						  <div class="font-extraSmall">三十日销量</div>
						  {{NullTransform(scope.row.summonth)}}({{NullTransform(scope.row.ordermonth)}}orders)
						  </div>
						  </div>
					 </el-col>
					 <el-col :span="7">
						 <div class="flex-v-bet" >
						  <div>
						  <div class="font-extraSmall">七日访问量|转化率</div>
						  {{NullTransform(scope.row.sessions)}}|{{formatPercent(scope.row.sessionrate)}}%
						  </div>
						  <div class="m-t-16">
						  <div class="font-extraSmall">购物车比例</div>
						   {{formatFloat(scope.row.buybox)}}%
						  </div>
						  </div>
					 </el-col>
					 <el-col :span="5">
						 <div class="flex-v-bet" >
						  <div>
						  <div class="font-extraSmall">可售库存 </div>
						 <el-popover title="库存详情"  v-model:visible="scope.row.itemshow" placement="bottom" trigger="click" :width="500">
														 <el-row :gutter="16">
														<el-col :span="8">
															<ul class="list-style-type li-be" v-if="FBAInvData">
																<li ><span>可用库存</span><el-tag type="success">{{FBAInvData.afnFulfillableQuantity}}</el-tag></li>
																 <li><span>预留</span><el-tag>{{FBAInvData.afnReservedQuantity}}</el-tag></li>
																 <li><span>正在发货</span><el-tag>{{FBAInvData.afnInboundWorkingQuantity}}</el-tag></li>
																<li><span>待接收</span><el-tag>{{FBAInvData.afnInboundShippedQuantity}}</el-tag></li>	 
																<li><span>已接受</span><el-tag>{{FBAInvData.afnInboundReceivingQuantity}}</el-tag></li>
																<li><span>不可用</span><el-tag type="info">{{FBAInvData.afnUnsellableQuantity}}</el-tag></li>
																<li><span>异常</span><el-tag type="danger">{{FBAInvData.afnResearchingQuantity}}</el-tag></li>
																<li v-if="scope.row.mregion=='EU'"><span>站点库存</span><el-tag type="warning">{{scope.row.countryinv}}</el-tag></li>
															</ul>
															<el-button class="m-t-8" type="primary" @click.stop="refreshInventory(scope.row)">更新</el-button>
														</el-col>
														<el-col :span="14">
															<table class="sd-table"    border="0" cellpadding="0" cellspacing="0">
																<thead>
																	<tr>
																		<th  width="130">仓库名称</th>
																		<th  width="50">可用</th>
																		<th width="60">待出库</th>
																		<th width="60">待入库</th>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for = "(item,index) in localInvData" :key="index" >
																		<td>{{item.warehousename}}</td>
																		<td>{{item.fulfillable}}</td>
																		<td>{{item.outbound}}</td>
																		<td>{{item.inbound}}</td>
																    </tr>
																	<tr v-if="localInvData.length<=0">
																		<td colspan="4"> <el-empty :image-size="80" description="暂无数据" /></td>
																	</tr>
																</tbody>
																</table>
														</el-col>
														</el-row>
												 	<template #reference>
														<span class="pointer" @click="loadInventory(scope.row)">
															{{NullTransform(scope.row.afnFulfillableQuantity)}}  
														</span>
												 	</template>
												 </el-popover>
						  </div>
						  <div class="m-t-16">
						  <div class="font-extraSmall">可售天数</div>
							<span v-if="scope.row.dayfulfilla">
								{{formatInteger(scope.row.dayfulfilla)}}
							</span>
							<span v-else-if="scope.row.dayinbound">
								+{{formatInteger(scope.row.dayinbound)}}
							</span>
							<span v-else>
								--
							</span>
							&nbsp;<el-link :underline="false" type="info" @click="handlarrivalChart(scope.row)">
								<el-tooltip content="预计到货报表" placement="top" :hide-after="0" :show-after="200">
						   <chart-line class="ic-cen" theme="filled" size="14" />
							</el-tooltip>
							</el-link>
						  </div>
						  </div>
					 </el-col>
				 </el-row>
				<el-row v-else-if="activeName=='second'">
					<el-col :span="6">
						 <div class="flex-v-bet">
						  <div>
						  <div class="font-extraSmall">IMPR</div>
							{{NullTransform(scope.row.advimpr)}} 
						  </div>
						  <div class="m-t-16">
						  <div class="font-extraSmall">CTR</div>
							{{formatPercent(scope.row.advctr)}}%
						  </div>
						  </div>
					</el-col>
					<el-col :span="6">
									 <div class="flex-v-bet">
									  <div>
									  <div class="font-extraSmall">CLICKS</div>
										{{NullTransform(scope.row.advclick)}} 
									  </div>
									  <div  class="m-t-16">
									  <div class="font-extraSmall">CPC</div>
										{{NullTransform(scope.row.advcpc)}}  
									  </div>
									  </div>
					</el-col>
					<el-col :span="6">
									 <div class="flex-v-bet">
									  <div>
									  <div class="font-extraSmall">Sale_Order</div>
										{{NullTransform(scope.row.advsales)}} 
									  </div>
									  <div  class="m-t-16">
									  <div class="font-extraSmall">CR</div>
										{{formatPercent(scope.row.advspc)}}%  
									  </div>
									  </div>
					</el-col>
					<el-col :span="6">
									 <div class="flex-v-bet">
									  <div>
									  <div class="font-extraSmall">SPEND</div>
										{{scope.row.landedCurrency}}{{NullTransform(scope.row.advspend)}} 
									  </div>
									  <div  class="m-t-16">
									  <div class="font-extraSmall">ACOS</div>
										{{formatPercent(scope.row.advacos)}}%  
									  </div>
									  </div>
					</el-col>
				</el-row>		
<el-row v-else-if="activeName=='third'">
					<el-col :span="6">
						 <div class="flex-v-bet">
						  <div>
						  <div class="font-extraSmall flex-center">利润率 <el-icon class="pointer" @click="viewProfitDetails(scope.row,'')"><CaretTop  /></el-icon></div>
							{{NullTransform(scope.row.prorate)}}% 
						  </div>
						  <div  class="m-t-16">
						  <div class="font-extraSmall">利润</div>
							{{scope.row.landedCurrency}}{{formatFloat(scope.row.profits)}} 
						  </div>
						  </div>
						  </el-col>
						  <el-col :span="6">
						  				 <div class="flex-v-bet">
						  				  <div>
						  				  <div class="font-extraSmall">广告费</div>
						  					{{scope.row.landedCurrency}}{{NullTransform(scope.row.advspend)}} 
						  				  </div>
						  				  <div  class="m-t-16">
						  				  <div class="font-extraSmall">其它成本</div>
										  <div class="table-edit-flex" @click="showCostModal(scope.row)">
										   <span>{{NullTransform(scope.row.othercost)}} </span>
										  <el-icon ><Edit/></el-icon>
										  </div>
						  					
						  				  </div>
						  				  </div>
						  </el-col>
						  <el-col :span="6">
						  				 <div class="flex-v-bet">
											 <div>
											 <div class="font-extraSmall">净利润率</div>
											 	 {{formatPercent(scope.row.proprate)}}%  
											 </div>
						  				  <div  class="m-t-16">
						  				  <div class="font-extraSmall">净利润</div>
						  					{{scope.row.landedCurrency}}{{formatFloat(scope.row.profitall)}} 
						  				  </div>
						  				  </div>
						  </el-col>
						  <el-col :span="6">
						  				 <div class="flex-v-bet">
						  				  <div>
						  				  <div class="font-extraSmall">ACOAS</div>
						  					{{formatPercent(scope.row.acoas)}}% 
						  				  </div>
						  				  </div>
						  </el-col>
					
				</el-row>
			  </template>
			</el-table-column>
		   <el-table-column  prop="remark" label="备注" width="150">
		   <template #default="scope">
			   <div class="table-edit-flex" @click="editRemarks(scope.row)">
				   <el-tooltip placement="left-start"   >
						 <template #content><div style="max-width:400px;">{{scope.row.remark}}</div></template>
				          <span>{{stringText(scope.row.remark)}}</span>
				         </el-tooltip>
						   <el-icon ><Edit/></el-icon>
			   </div>
		        </template>
		   </el-table-column>
			<el-table-column prop="operate"  label="操作" width="60" >
			   <template #default="scope">
				   <el-space direction="vertical">
					<el-link :underline="false" type="danger" title="销量图表"  @click="handlesaleChart(scope.row)"> 
				   <chart-histogram  theme="outline" size="18" :strokeWidth="3"/>
				   </el-link>
				   <slide class="ic-cen" title="趋势分析"   theme="outline" size="18" fill="#FF6700" :strokeWidth="3"/>
			   	<el-dropdown>
			   	    <el-link type="danger" class="font-Small font-400"  :underline="false">
			   	     <el-icon class="ic-cen"><MoreFilled /></el-icon>
			   	    </el-link>
			   	    <template #dropdown>
			   	      <el-dropdown-menu>
			   	         <el-dropdown-item @click="matching(scope.row)">配对</el-dropdown-item>
			   			<el-dropdown-item  @click="refreshProduct(scope.row)">同步商品</el-dropdown-item>
						<el-dropdown-item  @click="EditStatus(scope.row)">编辑状态</el-dropdown-item>
						<el-dropdown-item  @click="editMark">编辑标签</el-dropdown-item>
			   	      </el-dropdown-menu>
			   	    </template>
			   	  </el-dropdown>
				  </el-space>
			   </template>	
			</el-table-column>
			 </template>
	 </GlobalTable>
 </div>
 <el-dialog v-model="markVisable" title="编辑标签" width="600px">
	  <el-space>
	  <span>标签</span>
	  <el-cascader :options="markoptions"  :popper-append-to-body="false" :props="markprops" clearable />
	 </el-space>
	  <template #footer>
	  	<span class="dialog-footer">
	  		<el-button @click="markVisable = false">取消</el-button>
	  		<el-button type="primary" @click="">提交</el-button>
	  	</span>
	  </template>
 </el-dialog>
 <!-- 销量折线图 -->
 <Salechart ref="salechartRef"/>
 <!-- 操作日志 -->
 <Matching ref ="matchingRef" />
 <!-- 调价弹窗 -->
 <ModifyPriceDialog ref="modifypriceRef"/>
 <!-- 备注弹窗 -->
 <RemarksDialog ref="remarksRef"/>
<!-- 销售状态 -->
 <SaleStatusSelect ref="statusRef"/> 
<!-- 成本明细 -->
  <PorfitDetails ref="porfitRef"/>
  <ArrivalDialog ref="arrivalchartRef"/>
  <OtherCost ref="otherCostRef" />
  </template>
<script>
	import {ref,reactive,onMounted,watch,h} from 'vue'
	import {Help,Plus,MenuUnfold,ChartHistogram,Slide,ChartLine} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,Edit,MoreFilled,CaretTop} from '@element-plus/icons-vue';
	import listingApi from '@/api/amazon/listing/listingApi';
	import '@/assets/css/packbox_table.css'
	import Salechart from"./salechart.vue"
	import Matching from"./matching.vue";
	import ArrivalDialog from"./arrival_dialog.vue";
	import PorfitDetails from './profit_details.vue'
	import OtherCost from"./other_cost.vue";
	import productinfoApi from '@/api/amazon/product/productinfoApi.js'
	import ModifyPriceDialog from "./modifypriceDialog.vue"
	import SaleStatusSelect from "./sale_status_select.vue"
	import RemarksDialog from "./remarks_dialog.vue"
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import {formatFloat,formatPercent,formatInteger} from '@/utils/index';
	import NullTransform from"@/utils/null-transform";
	import inventoryApi from "@/api/erp/inventory/inventoryApi.js";
	import inventoryRptApi from "@/api/amazon/inventory/inventoryRptApi.js";
	import productRefreshApi from '@/api/amazon/product/productRefreshApi.js';
	import productinoptApi from '@/api/amazon/product/productinoptApi.js'
	export default {
		name:'Table',
		components: {
			Edit,ChartHistogram,Slide,ArrowDown,MoreFilled,
			Salechart,Matching,GlobalTable,ModifyPriceDialog,
			RemarksDialog,SaleStatusSelect,PorfitDetails,
			CaretTop,ChartLine,ArrivalDialog,OtherCost,
		},
		emits:["checkRow"],
		setup(props,context) {
			let defaultSort=ref({"prop": 'averageSalesDay', "order": 'descending' });
			let modifypriceRef =ref()
			let remarksRef =ref()
			let statusRef = ref()
			let porfitRef = ref()
			let otherCostRef = ref()
			let markprops = { multiple: true }
			let markVisable =ref(false)
			let globalTable=ref(GlobalTable);
			let arrivalchartRef =ref()
			let stripe = ref(false)
			let priceList=ref([]);
			let markoptions = [
			{
			    value: 1,
			    label: '颜色',
			    children: [
			      {
			        value: 2,
			        label: '红',
			      },
				  {
				    value: 3,
				    label: '黄',
				  },
				  ]
		},
		{
			    value: 2,
			    label: '节日',
			    children: [
			      {
			        value: 2,
			        label: '圣诞节',
			      },
				  {
				    value: 3,
				    label: '万圣节',
				  },
				  ]
		},
		{
			    value: 3,
			    label: '策略',
			    children: [
			      {
			        value: 2,
			        label: '促销',
			      },
				  {
				    value: 3,
				    label: '提价',
				  },
				  ]
		},
		]
		    let matchingRef =ref()
			let salechartRef=ref()
			let star = ref(3.5)
			let activeName =ref("first")
            let tableData=reactive({records:[],total:0})
			let fulfillVis=ref(false);
			let localInvData=ref([]);
			let FBAInvData=ref({});
		onMounted(()=>{
			
		})
		function stringText(val){
			let value =""
				if(val && val.length>50){
					 value = val.substring(0,50)+'...'
				}else{
					 value = val
				}
			return value
		}
		 function rollbackPrice(row){
			 row.copprice = row.price
		 }
		 function rollbackremark(row){
			 row.copremark = row.remark
		 }
		 
		 function selectRow(selection, row){
			 context.emit("checkRow",selection)
		 }
		 function handlesaleChart(row){
			 salechartRef.value.loadChart(row.groupid,row.marketplaceid,row.amazonAuthId,row.sku,row.msku);
		 }
		 function editMark(){
			 markVisable.value =true
		 }
		 function matching(row){
			 var msku=row.sku;
			 if(row.msku){
			 	 msku=row.msku;
			 }
			 matchingRef.value.matchingVisable =true;
			 matchingRef.value.title="产品配对(当前平台SKU:"+row.sku+",本地SKU:"+msku+")";
			 matchingRef.value.loadData(msku,row.sku,row.id);
		 }
		function loadData(params){
			var data={};
			data.groupid=params.groupid;
			data.marketplace=params.marketplaceid;
			data.search=params.search;
			data.searchtype=params.searchtype;
			data.isfba=params.isfba;
			data.ownerid=params.owner;
			data.isparent=params.isparent;
			if(params.salestatus==""){
				 params.salestatus="all";
			}
			data.salestatus=params.salestatus;
			data.disable=params.disable;
			data.changeRate=params.changeRate;
			data.remark=params.remark;
			data.category=params.category;
			data.isbadreview=params.isbadreview;
			data.name=params.name;
			data.paralist=params.paralist;
			data.sort=params.sort;
			data.order=params.order;
			globalTable.value.loadTable(data);
		}
		 function loadtableData(data){
			 //根据 params去查product
			 productinfoApi.productList(data).then((res)=>{
			 	tableData.records = res.data.records
			 	tableData.total =res.data.total
			 });
		 }
		 function modifyPrice(row){
			 modifypriceRef.value.localData=row;
			 modifypriceRef.value.modifyPriceVisable = true
		 }
		 function editRemarks(row){
			 remarksRef.value.loadData(row);
		 }
		 function EditStatus(row){
			 statusRef.value.loadData(row);
		 }
		 function viewProfitDetails(row,type){
			porfitRef.value.loadData(row.id,row.landedAmount,type);
		}
		 function handlarrivalChart(row){
			arrivalchartRef.value.loadChart(row.groupid,row.marketplaceid,row.amazonAuthId,row.sku,row.msku);
		 }
		 function showCostModal(){
			 otherCostRef.value.costVisable = true
		 }
		 function loadInventory(rows){
			 var msku=rows.sku;
			 if(rows.msku){
				 msku=rows.msku;
			 }
			 if(rows.itemshow==false){
				 //本地库存
				 inventoryApi.getInventoryByMaterialSKU({"sku":msku}).then((ress)=>{
				 	localInvData.value=ress.data;
				 })
				 //fba库存
				 inventoryRptApi.findFBA({"sku":rows.sku,"groupid":rows.groupid,"marketplaceid":rows.marketplaceid}).then((res)=>{
				 	 FBAInvData.value=res.data[0];
				 })
			 }
		 }
		 function refreshInventory(rows){
			 //刷新fba库存
			 inventoryRptApi.syncInventorySupply({"skus":rows.sku,"groupid":rows.groupid,"marketplaceid":rows.marketplaceid}).then((res)=>{
				 if(res.data){
					 rows.afnFulfillableQuantity=res.data.afnFulfillableQuantity;
					 ElMessage({
					     message: '更新成功！',
					     type: 'success'
					})
					rows.itemshow=false;
				 }else{
					 ElMessage({
					      message: '更新失败！',
					      type: 'error'
					 })
				 }
			 })
			 
		 }
		 //同步产品
		 function refreshProduct(row){
			  productRefreshApi.refreshItemBySKU({"groupid":row.groupid,"marketplaceid":row.marketplaceid,"sku":row.sku}).then((res)=>{
				 if(res.data){
					 ElMessage({
					      message: '同步成功！',
					      type: 'success'
					 })
				 }else{
					 ElMessage({
					      message: '同步失败！',
					      type: 'error'
					 })
				 }
			  });
		 }
		 function showPrice(pid){
			 productinoptApi.findPriceById({"pid":pid}).then((res)=>{
				 if(res.data){
					 console.log(res.data);
					priceList.value=res.data; 
				 }
			 });
		 }
		 
			return {
			//value
			tableData,star,activeName,markprops,markoptions,markVisable,globalTable,defaultSort,stripe,fulfillVis,
			localInvData,FBAInvData,priceList,
			//function
			rollbackPrice,rollbackremark,selectRow,handlesaleChart,editMark,matching,loadtableData,formatPercent,formatFloat,
			formatInteger,stringText,modifyPrice,editRemarks,viewProfitDetails,handlarrivalChart,NullTransform,EditStatus,loadData,
			showCostModal,loadInventory,refreshInventory,refreshProduct,showPrice,
			//ref
			salechartRef,matchingRef,modifypriceRef,remarksRef,
			porfitRef,arrivalchartRef,statusRef,otherCostRef,
			}
		},
	}
</script>

<style>
.el-rate .el-rate__icon{
	margin-right:0
}
.el-rate{
	height:inherit;
}
.icon-text-center{
	margin-top:4px;
}
.sku-name{line-height: 16px;}
.table-tabs .el-tabs__nav-wrap::after{
	display: none;
}
.table-tabs .el-tabs__header{
	margin:0;
}
.table-tabs  .el-tabs__item{
	height:30px;
	font-size: 12px;
	color:#666;
	line-height: 26px;
	font-weight: 500;
}
.el-tabs__item.is-active{
	color: var(--el-color-primary);
}
.m-t-8{
	margin-top:8px;
}
.m-t-16{
	margin-top:16px;
}
.sale-price{
	font-size:12px;
	font-weight: 600;
	color:#f5a20c;
}

.flex-v-bet{
	display: flex;
	flex-direction: column;
}

.datas-style .cell{
	line-height: inherit;
}
.l-h-0{
	line-height:12px;
}
.list-style-type{
	list-style-type:none;
}
.li-be li{
	display: flex;
	align-items: center;
	justify-content: space-between;
	line-height: 32px;
	border-bottom: 1px solid var(--el-border-color-extra-light);
}
</style>