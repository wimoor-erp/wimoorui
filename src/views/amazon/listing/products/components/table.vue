<template>
 <div class="listing-table">
	 <GlobalTable  ref="globalTable" :tableData="tableData"  :size="20" @loadTable="loadtableData" 
	 :stripe="true" :height="tableheight"
	 :cellClassName="cellClassName"
	 :defaultSort="defaultSort" @selectionChange = "selectRow"    >
		  <template #field>
		 <el-table-column  type="selection" width="38" />
		 <el-table-column label="图片" width="85">
			 <template #default="scope">
			   <img v-if="scope.row.image" :src="scope.row.image" :title="'本地SKU:'+scope.row.msku"  @click.stop="handleToMaterial(scope.row)" class="pointer" style="width:80px; height:80px"  />
			   <img v-else :src="require('@/assets/image/empty/noimage40.png')" :title="'本地SKU:'+scope.row.msku" style="width:80px; height:80px"/>
			  <div v-if="scope.row.inSnl=='1'" class='image-title'>
			  	  低价
			  </div>
			 </template>
		 </el-table-column>
		 <el-table-column label="产品信息" min-width="400" >
		 			 <template #default="scope">
		 			 <div class="sku-name font-small">{{scope.row.name}}</div>
					 <el-space>
					<span class="font-bold font-medium " style="text-decoration: line-through" v-if="scope.row.disable">{{scope.row.sku}}  </span>
					<span class="font-bold font-medium " v-else>{{scope.row.sku}}  </span>
					 <span class=" flex-center"><span class="font-extraSmall">ASIN:</span><el-link  class="font-small"   @click.stop="openUrl(scope.row.pointName,scope.row.asin)" type="primary"  >{{scope.row.asin}} </el-link></span>
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
							<el-tag size="small" effect="dark" :type="scope.row.optstatuscolor" v-if="scope.row.optstatusname">{{scope.row.optstatusname}}</el-tag>
							<el-tag v-if="scope.row.tagNameList" effect="plain" :type="item.color"  v-for="item in scope.row.tagNameList" size="small" >
								{{item.name}}
							</el-tag>
							<el-tag size="small" 
							v-if="parseInt(scope.row.flownnumber)>1&&parseInt(scope.row.notread)==0" 
							@click.stop="handleShowFlow(scope.row)" 
							class="pointer" type="danger">{{parseInt(scope.row.flownnumber)-1}}人跟卖</el-tag>
							<el-tag size="small"
							  effect="dark"
							v-else-if="parseInt(scope.row.flownnumber)>1&&parseInt(scope.row.notread)>0" 
							@click.stop="handleShowFlow(scope.row)" 
							class="pointer" type="danger">{{parseInt(scope.row.flownnumber)-1}}人跟卖</el-tag>
							<el-icon class="pointer text-red" v-else-if="scope.row.flownnumber" 
							@click.stop="handleShowFlow(scope.row)" ><Avatar /></el-icon>
					</el-space>
					</div>
					 <el-space class="font-extraSmall m-t-8"  :size="16">
						 <span class="">上架日期：{{scope.row.opendate}} </span>
						 <span class="pointer" @click.stop="handleSearchSku(scope.row)">站点：{{scope.row.groupname}} - {{scope.row.marketplacename}} </span>
					</el-space>
		 			 </template>
		 </el-table-column>
		 <el-table-column  prop="price" label="售价" width="100">
		            <template #default="scope">
						<div v-if="scope.row.fulfillchannel=='DEFAULT'" class="table-edit-flex">
								  <span v-if="scope.row.landedAmount">
								  {{scope.row.landedCurrency}}{{scope.row.landedAmount}} </span>
								  <span v-else>0 </span>
								  <el-icon @click="changeFBMPrice(scope.row)"><Edit/></el-icon>
						</div>
						<div v-else class="table-edit-flex" >
							<el-popover placement="right" :width="260" trigger="click" @show.stop="showPrice(scope.row.id)">
							      <template #reference>
							       <span class="sale-price">
							       	{{scope.row.landedCurrency}}{{scope.row.landedAmount}}
							       </span>
							      </template>
							      <el-table  :data="priceList">
							        <el-table-column width="110" prop="ptype" label="类型" >
										<template #default="scopesub">
											<span v-if="scopesub.row.ptype=='BUYP'">您的售价</span>
											<span v-if="scopesub.row.ptype=='BOXP'">购物车售价</span>
											<span v-if="scopesub.row.ptype=='LOWP'">最低售价</span>
										</template>
								    </el-table-column>
							        <el-table-column width="120" prop="landedAmount"
									   label="价格" >
									   <template #header>
										   <el-space><div>价格</div> <el-button size="small" @click.stop="updatePrice(scope.row.id)">更新</el-button></el-space>
									   </template>
										<template #default="scopesub">
											{{scopesub.row.landedCurrency}} {{scopesub.row.landedAmount}}
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
						  <span class="pointer"  @click="handlesaleChart(scope.row)">
						    {{NullTransform(scope.row.averageSalesDay)}} 
							<span v-if="scope.row.summonth && scope.row.sales15">
								<span :title="avgrateCalc(scope.row.summonth,scope.row.sales15)" v-if="avgrateCalc(scope.row.summonth,scope.row.sales15) && avgrateCalc(scope.row.summonth,scope.row.sales15)>=25">
									<up-two theme="filled" size="11" fill="#00aa00" />
								</span>
								<span :title="avgrateCalc(scope.row.summonth,scope.row.sales15)" v-if="avgrateCalc(scope.row.summonth,scope.row.sales15) && avgrateCalc(scope.row.summonth,scope.row.sales15)<=-25">
									<down-two theme="filled" size="11" fill="#ff1044" />
								</span>
							</span>
							<el-link  :underline="false"  title="销量图表" >
							<chart-histogram  theme="outline" size="15" :strokeWidth="3"/>
							</el-link>
							</span>
						  </div>
						  <div class="m-t-8">
						  <div class="font-extraSmall">销量排名</div>
						    <el-popover
						       placement="top-start"
						       title="排名详情"
						       :width="300"
						       trigger="click"
							   @show="showRankInfo(scope.row)"
						     >
								<table class="sd-table el-table" v-if="scope.row.rankData&&scope.row.rankData.length>0">
								 <tr  v-for="item in scope.row.rankData">
									 <td>
										 <span v-if="item.name">{{item.name}}</span>
										<span v-else>{{item.categoryId}}</span>
									 </td>
									 <td width="100px;"> {{item.rank}}</td>
								 </tr>
								</table>
								<div v-else-if="scope.row.rankDataloading!=false">加载中...</div>
								<div v-else>
									<el-divider></el-divider>
									暂无数据！</div>
						       <template #reference>
						        <span class="pointer"> {{NullTransform(scope.row.rank)}} </span>
						       </template>
						     </el-popover>
						    
						  </div>
						  </div>
					 </el-col>
					 <el-col :span="6">
						 <div class="flex-v-bet">
						  <div>
						  <div class="font-extraSmall">七天销量</div>
							{{NullTransform(scope.row.sumweek)}} 
						  </div>
						  <div class="m-t-8">
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
							  <el-tooltip v-if="scope.row.unitsordered7">
								 <template #content>数据来自流量报表，对应销量{{scope.row.unitsordered7}} ,注意流量报表数据延迟两日</template>
								<span class="font-extraSmall"><el-icon><InfoFilled /></el-icon></span>
							  </el-tooltip>
						  </div>
						  <div class="m-t-8">
						  <div class="font-extraSmall">购物车比例</div>
						   {{formatFloat(scope.row.buybox)}}%
						  </div>
						  </div>
					 </el-col>
					 <el-col :span="5">
						 <div class="flex-v-bet" >
						  <div>
						  <div class="font-extraSmall">可售库存 </div>
						  <div v-if="scope.row.fulfillchannel=='DEFAULT'" class="table-edit-flex">
							  <span v-if="scope.row.fulfillmentAvailability">{{scope.row.fulfillmentAvailability}} </span>
							  <span v-else>0 </span>
							  <el-icon @click="changeFBMInventory(scope.row)"><Edit/></el-icon>
							  <span class="font-extraSmall"> FBM</span>
						  </div>
						  <el-popover title="库存详情" v-else placement="bottom" trigger="click" :width="500">
								   <el-row :gutter="16">
											 <el-col :span="8">
															<ul class="list-style-type li-be" v-if="FBAInvData">
																<li ><span>可用库存</span><el-tag type="success">{{FBAInvData.afnFulfillableQuantity}}</el-tag></li>
																 <li><span>预留</span><el-tag>{{FBAInvData.afnReservedQuantity}}</el-tag></li>
																 <li><span>正在发货</span><el-tag>{{FBAInvData.afnInboundWorkingQuantity}}</el-tag></li>
																<li><span>待接收</span><el-tag>{{FBAInvData.afnInboundShippedQuantity}}</el-tag></li>	 
																<li><span>已接收</span><el-tag>{{FBAInvData.afnInboundReceivingQuantity}}</el-tag></li>
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
														 <el-tag
														      effect="plain"
														      round
															  type="warning"
															  v-if="scope.row.fulfillchannel=='DEFAULT'"
														    >
														    自发货
														    </el-tag>
												 	</template>
						</el-popover>
						<el-popover v-if="scope.row.mregion=='EU'" title="EU库存详情"  placement="bottom" trigger="click" :width="226">
							<el-table :data="FBAEUlist">
								<el-table-column>
									<el-table-column prop="country" label="国家" width="100" >
										<template #default="scope">
											<span v-if="scope.row.country=='GB'">UK</span>
											<span v-else>{{scope.row.country}}</span>
										</template>
									</el-table-column>
									<el-table-column prop="quantity" label="库存数量" width="100" />
								</el-table-column>
							</el-table>
							<template #reference>
								<span class="font-extraSmall pointer" @click="loadEUInventory(scope.row)">
									<span v-if="scope.row.country=='DE' || scope.row.country=='PL'">
										(DE+PL+CZ:{{NullTransform(scope.row.czinv)}})  
									</span>
									<span v-else>({{scope.row.country}}:{{NullTransform(scope.row.countryinv)}})</span>
								</span>
							</template>
						</el-popover>
						  </div>
						  <div class="m-t-8">
						  <div class="font-extraSmall">可售天数</div>
							<span >
								{{formatInteger(scope.row.dayfulfilla)}}
							</span>
							<span v-if="scope.row.dayinbound">
							   +{{formatInteger(scope.row.dayinbound)}}
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
						  <div class="m-t-8">
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
									  <div  class="m-t-8">
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
									  <div  class="m-t-8">
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
									  <div  class="m-t-8">
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
						  <div  class="m-t-8">
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
						  				  <div  class="m-t-8">
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
						  				  <div  class="m-t-8">
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
		   <el-table-column  prop="remark" label="备注" min-width="150">
		   <template #default="scope">
			   <div class="table-edit-flex" @click="editRemarks(scope.row)">
				   <el-tooltip placement="left-start"   >
						 <template #content><div style="max-width:400px;"  v-html="scope.row.htmlremark"></div></template>
				          <span class="text-omit-3" v-html="scope.row.htmlremark"> </span>
				         </el-tooltip>
						   <el-icon ><Edit/></el-icon>
			   </div>
		        </template>
		   </el-table-column>
			<el-table-column prop="operate"  label="操作" width="60" >
			   <template #default="scope">
				   <el-space direction="vertical">
					
				   <slide class="ic-cen pointer" title="趋势分析"  @click="handleAnalysis(scope.row)"  theme="outline" size="18" fill="#FF6700" :strokeWidth="3"/>
			   	<el-dropdown>
			   	    <el-link type="danger" class="font-Small font-400"  :underline="false">
			   	     <el-icon class="ic-cen"><MoreFilled /></el-icon>
			   	    </el-link>
			   	    <template #dropdown>
			   	      <el-dropdown-menu>
			   	         <el-dropdown-item @click="matching(scope.row)">配对</el-dropdown-item>
			   			<el-dropdown-item  @click="refreshProduct(scope.row)">同步商品</el-dropdown-item>
						<el-dropdown-item v-if="scope.row.disable==true"  @click="undisable(scope.row)">显示产品</el-dropdown-item>
						<el-dropdown-item v-else  @click="disable(scope.row)">隐藏产品</el-dropdown-item>
					    <el-dropdown-item v-if="scope.row.invalid=='1'||scope.row.invalid==1"  @click="recover(scope.row)">恢复产品</el-dropdown-item>
						
						<el-dropdown-item   @click="showOwner(scope.row)">负责人</el-dropdown-item>
						<el-dropdown-item  @click="EditStatus(scope.row)">编辑状态</el-dropdown-item>
						<el-dropdown-item  @click="editTags(scope.row)">编辑标签</el-dropdown-item>
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
	  <el-cascader v-model="tagsValue" placeholder="请选择标签" :options="tagsList"  @change="changeTags" :popper-append-to-body="false" :props="markprops" clearable />
	 </el-space>
	  <template #footer>
	  	<span class="dialog-footer">
	  		<el-button @click="markVisable = false">取消</el-button>
	  		<el-button type="primary" @click.stop="submitTags">提交</el-button>
	  	</span>
	  </template>
 </el-dialog>
  <!-- 显示产品负责人 -->
<el-dialog v-model="ownerDialog" title="编辑平台商品负责人" destroy-on-close='true' width="600px" >
	<OwnerAll @owner="getOwner" notAll="isNotAll" ref="ownerRef"  />
	<template #footer>
		<span class="dialog-footer">
			<el-button @click="ownerDialog = false">取消</el-button>
			<el-button type="primary" @click.stop="updateOwner">提交</el-button>
		</span>
	</template>
</el-dialog>
 <!-- 销量折线图 -->
 <Salechart ref="salechartRef"/>
 <!-- 操作日志 -->
 <Matching ref ="matchingRef" />
 <!-- 调价弹窗 -->
 <ModifyPriceDialog ref="modifypriceRef" @change="handleAfterModifyPrice"/>
 <!-- 备注弹窗 -->
 <RemarksDialog ref="remarksRef"   />
<!-- 销售状态 -->
 <SaleStatusSelect ref="statusRef"/> 
<!-- 成本明细 -->
  <PorfitDetails ref="porfitRef"/>
  <ArrivalDialog ref="arrivalchartRef"/>
  <OtherCost ref="otherCostRef" />
  <FollowDialog ref="followDialogRef"></FollowDialog>
  </template>
<script>
	import {ref,reactive,onMounted,watch,h,inject} from 'vue'
	import {useRouter } from 'vue-router'
	import {Help,Plus,MenuUnfold,ChartHistogram,Slide,ChartLine,DownTwo,UpTwo} from '@icon-park/vue-next';
	import {ElMessage,ElMessageBox,ElDivider} from 'element-plus';
	import {Search,ArrowDown,Edit,MoreFilled,CaretTop,InfoFilled,Avatar} from '@element-plus/icons-vue';
	import listingApi from '@/api/amazon/listing/listingApi';
	import '@/assets/css/packbox_table.css'
	import OwnerAll from '@/components/header/ownerAll.vue';
	import Salechart from "@/views/amazon/listing/common/salechart.vue";
	import Matching from"./matching.vue";
	import ArrivalDialog from"@/views/amazon/listing/common/arrival_dialog.vue";
	import PorfitDetails from './profit_details.vue'
	import OtherCost from"@/views/amazon/payment/costSharing/cost_dialog.vue";
	import productinfoApi from '@/api/amazon/product/productinfoApi.js'
	import ModifyPriceDialog from "./modifypriceDialog.vue"
	import FollowDialog from "./follow_dialog.vue"
	import SaleStatusSelect from "./sale_status_select.vue"
	import RemarksDialog from "./remarks_dialog.vue"
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import {formatFloat,formatPercent,formatInteger,decodeText} from '@/utils/index';
	import NullTransform from"@/utils/null-transform";
	import inventoryApi from "@/api/erp/inventory/inventoryApi.js";
	import inventoryRptApi from "@/api/amazon/inventory/inventoryRptApi.js";
	import productRefreshApi from '@/api/amazon/product/productRefreshApi.js';
	import productinoptApi from '@/api/amazon/product/productinoptApi.js';
	import productRankApi from '@/api/amazon/product/productRankApi.js';
	import {getAllTags} from '@/api/sys/admin/tag.js';
	import userApi from '@/api/sys/admin/userApi.js';
	export default {
		name:'Table',
		components: {
			Edit,ChartHistogram,Slide,ArrowDown,MoreFilled,
			Salechart,Matching,GlobalTable,ModifyPriceDialog,
			RemarksDialog,SaleStatusSelect,PorfitDetails,InfoFilled,Avatar,
			CaretTop,ChartLine,ArrivalDialog,OtherCost,OwnerAll,FollowDialog,DownTwo,UpTwo
		},
		emits:["checkRow","searchsku"],
		props:["indialog"],
		setup(props,context) {			
			let defaultSort=ref({"prop": 'sku,marketindex', "order": 'ascending' });
			let modifypriceRef =ref()
			let followDialogRef=ref();
			let remarksRef =ref()
			let ownerRef=ref();
			let statusRef = ref()
			let porfitRef = ref()
			let otherCostRef = ref()
			let markprops = { multiple: true }
			let markVisable =ref(false)
			let ownerDialog=ref(false)
			let globalTable=ref(GlobalTable);
			let arrivalchartRef =ref()
			let stripe = ref(false)
			let priceList=ref([]);
			let router=useRouter()
			let FBAEUlist=ref([]);
			let tagsList = ref([]);
		    let matchingRef =ref()
			let salechartRef=ref()
			let star = ref(3.5)
			let activeName =ref("first")
            let tableData=reactive({records:[],total:0})
			let fulfillVis=ref(false);
			let localInvData=ref([]);
			let FBAInvData=ref({});
			let tagsValue=ref();
			let checkTags=ref("");
			let nowTagProRow=ref({});
			var queryParams={};
			let ownerid=ref();
			let ownerpid=ref();
		 
			let tableheight = ref(undefined);
			const emitter = inject("emitter");
		onMounted(()=>{
			
		})
		 function rollbackPrice(row){
			 row.copprice = row.price
		 }
		 function rollbackremark(row){
			 row.copremark = row.remark
		 }
		 function refreshTable(){
			 globalTable.value.refreshTable();
		 }
		 function selectRow(selection, row){
			 context.emit("checkRow",selection)
		 }
		 function  handleSearchSku(row){
			  context.emit("searchsku",row.sku);
		 }
		 function handlesaleChart(row){
			 salechartRef.value.show(row.groupid,row.marketplaceid,null,row.sku,row.msku);
		 }
		 function handleAfterModifyPrice(data){
			   if(data&&data.ftype=="1"){
				   var paramitem=null;
				   tableData.records.forEach(item=>{
				  	 if(item.id==data.pid){
				  	    item.landedAmount=data.price;
						paramitem=item;
				  	 }
				   });
				   if(paramitem!=null){
					   var data={"sku":paramitem.sku,"marketplace":paramitem.marketplaceid,"groupid":paramitem.groupid}
					   productinfoApi.productList(data).then((res)=>{
					   	if(res.data.records && res.data.total>0){
					   		 res.data.records.forEach(item=>{
								 if(item.id==paramitem.id){
									 paramitem.newprorate=item.newprorate;
								 }
							 })
					   	}
					   });	
				   }
			   }else{
			     refreshTable();
			   }
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
			data.taglist=params.taglist;
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
			if(params.sort){
				data.sort=params.sort;
				data.order=params.order;
				if(data.sort=="notread,followcount"){
					data.order=	data.order+","+	data.order;
				}
			}
			if(params.marketplace){
				data.marketplace=params.marketplace;
			}
			queryParams=data;
			globalTable.value.loadTable(data);
		}
		 function loadtableData(data){
			 //根据 params去查product
			 //看不到加载信息
			 tableheight.value = document.body.clientHeight -250
			 productinfoApi.productList(data).then((res)=>{
				 if(res.data&&res.data.records&&res.data.records.length>0){
				 	res.data.records.forEach(item=>{
						if(item.remark){
						    item.htmlremark=decodeText(item.remark);
						}else{
							item.htmlremark="";
						}
					});
				 }
			 	tableData.records = res.data.records
			 	tableData.total =res.data.total
				
				
				if(props.indialog=="true"){
					 tableheight.value = document.body.clientHeight -160
				}else{
					tableheight.value = '';
				}
				
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
			arrivalchartRef.value.show(row.groupid,row.marketplaceid,row.amazonAuthId,row.sku,row.msku);
		 }
		 function showCostModal(row){
			 otherCostRef.value.show(row);
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
		 function loadEUInventory(rows){
			 inventoryRptApi.findEUFBA({"sku":rows.sku,"authid":rows.amazonAuthId}).then((res)=>{
			 	if(res.data && res.data.length>0){
					FBAEUlist.value=res.data;
				}
			 })
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
					      message: row.sku+'同步成功！',
					      type: 'success'
					 });
					 refreshTable();
				 }else{
					 ElMessage({
					      message: row.sku+'同步失败！',
					      type: 'error'
					 })
				 }
			  });
		 }
		 function handleToMaterial(row){
			 router.push({
			 	path:'/material/details',
			 	query:{
			 	  title:"产品详情",
			 	  path:'/material/details',
				  type:"product",
			 	  details:row.mid,
			 	}
			 })
		 }
		 function recover(row){
			 productinfoApi.recover({"pid":row.id}).then((res)=>{
			 						 ElMessage({
			 							  message: '操作成功！',
			 							  type: 'success'
			 						 })
			 						 row.invalid="1";
									 refreshTable();
			 });
		 }
		 function showPrice(pid){
			 productinoptApi.findPriceById({"pid":pid}).then((res)=>{
				 if(res.data){
					 priceList.value=res.data;  
				 }
			 });
		 }
		 function openUrl(point,asin){
			 window.open("https://www."+point+"/dp/"+asin+"?th=1&psc=1", '_blank');
		 }
		 function handleAnalysis(row){
			 emitter.emit("removeCache", "趋势分析");
			 router.push({
				 path:'/amazon/listing/analysis',
				 query:{
					   title:'趋势分析',
					   path:'/amazon/listing/analysis',
					   marketplaceid:row.marketplaceid,
					   groupid:row.groupid,
					   pid:row.id,
					   sku:row.sku,
				 }
			 })
		 }
		 function editTags(rows){
			 nowTagProRow.value=rows;
			 getAllTags().then(res => {
				  tagsList.value=res.data;
				  //在通过id去找 选了哪些
				  var arrs=[];
				  productinoptApi.findProductTags({"pid":rows.id}).then((ress)=>{
					  if(ress.data && ress.data!=""){
						  var strs=ress.data.toString();
						  var list=strs.split(",");
						  list.forEach(function(item){
							  arrs.push(item);
						  });
						   tagsValue.value=arrs;
					  }else{
						   tagsValue.value=[];
					  }
				  });
				 
			 });
			 markVisable.value =true;
		 }
		 function submitTags(){
			 var pid=nowTagProRow.value.id;
			 var ids=checkTags.value;
			 productinoptApi.saveProductTags({"pid":pid,"ids":ids}).then((res)=>{
					 ElMessage({
					      message: '操作成功！',
					      type: 'success'
					 });
					 loadData(queryParams);
			 });
		 }
		 function changeTags(tags){
			 if(tags){
				 var items="";
				  tags.forEach(function(item){
					  items+=(item[1]+",");
				  });
				  checkTags.value=items;
			 }else{
				 checkTags.value="";
			 }
		 }
		 function undisable(row){
			 productinfoApi.undisable({"id":row.id}).then((res)=>{
					 if(res.data=="success"){
						 ElMessage({
							  message: '操作成功！',
							  type: 'success'
						 })
						 row.disable=false;
						 loadData(queryParams);
					 }else{
						 ElMessage({
							  message: '操作失败！',
							  type: 'error'
						 })
					 }
			 });
		 }
		 function disable(row){
		 		productinfoApi.disable({"id":row.id}).then((res)=>{
						 if(res.data=="success"){
							 ElMessage({
								  message: '操作成功！',
								  type: 'success'
							 })
							  row.disable=true;
							   loadData(queryParams);
						 }else{
							 ElMessage({
								  message: '操作失败！',
								  type: 'error'
							 })
						 }
		 		});	 
		 }
		 function showOwner(row){
			 ownerDialog.value=true;
			 ownerpid.value=row.id;
			 setTimeout(function(){
				 productinoptApi.findOwnerById({"pid":row.id}).then((res)=>{
					 if(res.data){
						ownerRef.value.ownerid=res.data;
						ownerid.value=res.data;
					 }
				 });
			 },500)
		 }
		 function updatePrice(id){
			 productinoptApi.refreshPrice(id).then(res=>{
				 
			 });
		 }
		 function getOwner(id){
			 ownerid.value=id;
		 }
		 function updateOwner(){
			 productinoptApi.updateOwnerById({"pid":ownerpid.value,"ownerid":ownerid.value}).then((res)=>{
				 if(res.data){
					 ElMessage({
							  message: '操作成功！',
							  type: 'success'
					 })
				 }
			 });
		 }
		 function handleShowFlow(row){
			 followDialogRef.value.show(row);
		 }
		 function cellClassName({ row, column, rowIndex, columnIndex }){
			 var cellclass="";
			 if(columnIndex==1){
				 cellclass=cellclass+ " wm-product-image";
			  }
			  if(row.invalid=="1"||row.invalid==1){
			  	cellclass=cellclass+ " rowinvalid";
			  }
			  return cellclass;
		 }
		 function avgrateCalc(monthsale,halfmonthsale){
			 var rate=0;
			 if(monthsale-halfmonthsale>halfmonthsale){
				 rate= formatFloat((monthsale-halfmonthsale*2)*100.0/(monthsale-halfmonthsale))*(-1) ;
			 }else{
				 rate = formatFloat((halfmonthsale*2-monthsale)*100.0/(monthsale-halfmonthsale)) ;
			 }
			 return rate;
		 }
		 function showRankInfo(row){
			 row.rankDataloading=true;
			 productRankApi.rank({"id":row.id}).then((res)=>{
				 row.rankDataloading=false;
				 if(res.data){
					 row.rankData=res.data;
				 }
			 });
		 }
		 function changeFBMPrice(row){
			 ElMessageBox.prompt('请输入价格', '设置价格', {
			    confirmButtonText: '确认',
			    cancelButtonText: '取消',
			    inputPattern:
			      /^-?(([0-9]*(\.[0-9]{1,3})$)|([0-9]+$))/,
			    inputErrorMessage: '无效价格',
			  })
			    .then(({ value }) => {
			 					 var data={};
			 					 data.sku=row.sku;
			 					 data.asin=row.asin;
			 					 data.amazonauthid=row.amazonAuthId;
			 					 data.price=value;
			 					 data.marketplaceids=[];
			 					 data.marketplaceids.push(row.marketplaceid);
			 					 listingApi.pushAsin(data).then(res=>{
			 						 row.landedAmount=value;
			 						 ElMessage({
			 						   type: 'success',
			 						   message: '设置成功',
			 						 })
			 					 })
			 				   
			    })
			    .catch(() => {
			      ElMessage({
			        type: 'info',
			        message:  '设置取消',
			      })
			    })
		 }
		 function changeFBMInventory(row){
			  ElMessageBox.prompt('请输入库存', '设置库存', {
			     confirmButtonText: '确认',
			     cancelButtonText: '取消',
			     inputPattern:
			       /^[+]{0,1}(\d+)$/,
			     inputErrorMessage: '无效库存',
			   })
			     .then(({ value }) => {
					 var data={};
					 data.sku=row.sku;
					 data.asin=row.asin;
					 data.amazonauthid=row.amazonAuthId;
					 data.filfullable=value;
					 data.marketplaceids=[];
					 data.marketplaceids.push(row.marketplaceid);
					 listingApi.pushAsin(data).then(res=>{
						 row.fulfillmentAvailability=value;
						 ElMessage({
						   type: 'success',
						   message: '设置成功',
						 })
					 })
				   
			     })
			     .catch(() => {
			       ElMessage({
			         type: 'info',
			         message:  '设置取消',
			       })
			     })
		 }
			return {
			//value
			tableData,star,activeName,markprops,tagsList,markVisable,globalTable,defaultSort,stripe,fulfillVis,
			localInvData,FBAInvData,priceList,FBAEUlist,tagsValue,checkTags,nowTagProRow,queryParams,ownerDialog,ownerid,ownerpid,
			tableheight,
			//function
			rollbackPrice,rollbackremark,selectRow,handlesaleChart,editTags,matching,loadtableData,formatPercent,formatFloat,
			formatInteger,modifyPrice,editRemarks,viewProfitDetails,handlarrivalChart,NullTransform,EditStatus,loadData,
			showCostModal,loadInventory,refreshInventory,refreshProduct,showPrice,openUrl,handleAnalysis,loadEUInventory,submitTags,
			changeTags,disable,undisable,showOwner,getOwner,updateOwner,cellClassName,handleToMaterial,handleShowFlow,avgrateCalc,
			showRankInfo,updatePrice,changeFBMInventory ,changeFBMPrice,refreshTable,handleSearchSku,handleAfterModifyPrice,recover,
			//ref
			salechartRef,matchingRef,modifypriceRef,remarksRef,followDialogRef,
			porfitRef,arrivalchartRef,statusRef,otherCostRef,ownerRef
			}
		},
	}
</script>

<style>
.wm-product-image .cell{
	padding:0;
	position:relative;
}
.wm-product-image img{
	 border-radius:4px;
}
.wm-product-image .image-title {
    position: absolute;
    z-index: 10;
    top: 0px;
    left: 0px;
    font-size: 12px;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
	background-color: #1fcc4f;
	line-height: 16px;
	color:#fff
}
.el-rate .el-rate__icon{
	margin-right:0
}
.el-rate{
	height:inherit;
}
.icon-text-center{
	margin-top:4px;
}
.table-tabs .el-tabs__nav-wrap::after{
	display: none;
}
.table-tabs .el-tabs__header{
	margin:1px;
}
.table-tabs  .el-tabs__item{
	height:27px;
	font-size: 12px;
	color:#666;
	line-height: 26px;
}
.table-tabs  .el-tabs__item.is-active{
	color: var(--el-color-primary);
	font-weight:700;
}
.m-t-8{
	margin-top:8px;
}
.m-t-16{
	margin-top:16px;
}
.sale-price{
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
.listing-table td.el-table__cell{
		padding:16px 0px!important;
	}
.rowinvalid {
	    filter: grayscale(100%);
	    -webkit-filter: grayscale(100%);
	    -moz-filter: grayscale(100%);
	    -ms-filter: grayscale(100%);
	    -o-filter: grayscale(100%);
 }
</style>
<style scoped>
	.flex-v-bet .font-extraSmall{
		margin-bottom:4px;
		color:#a3a3a3;
	}
	.sku-name{line-height: 16px;color:#666}
</style>