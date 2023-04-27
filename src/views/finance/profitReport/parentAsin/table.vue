<template >
	<GlobalTable
	:defaultSort="defaultSort" 
	 show-summary
	 @selectionChange='selectChange'
	 :tableData="tableData"
	 height="calc(100vh - 270px)"  @loadTable="loadTableData" >
	 <template #field>
	  <el-table-column label="图片"  fixed width="65" prop="image" type="expand">
	  	<template #default="props">
	  	    <Child/>
	  	</template>
	  </el-table-column>
	  <el-table-column label="父ASIN" fixed prop="parentAsin" width="120"></el-table-column>
		<el-table-column label="名称/SKU"   width="200" show-overflow-tooltip>
				 <template #default="scope">
				 <span class="name">{{scope.row.name}}</span>
				 <p class="sku">{{scope.row.msku}}</p>
				 </template>
		</el-table-column>
		<el-table-column label="店铺/国家"  width="100" prop="sale" >
			<template #default="scope">
				<p>{{scope.row.group}}</p>
				<p class="font-extraSmall">{{scope.row.market}}</p>
			</template>
		</el-table-column>
		<el-table-column label="销量" class-name="yellow-column"  width="100" prop="sale" sortable="custom">
			<template #default="scope">
				 <el-popover
				    placement="right"
				    title="销量详情"
				    :width="200"
				    trigger="click"
				  >
				  <div class="list-item">
					  <p class ="flex-center-between">
						  <span class="text-gray">FBA销量</span>
						  <span>{{scope.row.sale}}</span>
						</p>
						 <p class ="flex-center-between">
						  <span class="text-gray">FBM销量</span>
						  <span>{{scope.row.fbmSale}}</span>
						</p>
						 <p class ="flex-center-between">
						  <span class="text-gray">多渠道销量</span>
						  <span>{{scope.row.otherSale}}</span>
						</p>
						 <p class ="flex-center-between font-bold">
						  <span >合计</span>
						  <span>{{scope.row.otherSale}}</span>
						</p>
						
				  </div>
				    <template #reference>
				     <el-space class="pointer" :size="4">
				     <span >
				     {{scope.row.sale}} 
				     </span>	
				     <el-icon class="font-extraSmall"><ArrowDownBold /></el-icon>
				     </el-space>
				    </template>
				  </el-popover>
			</template>	
		</el-table-column>
		<el-table-column label="订单量"  class-name="yellow-column"   width="100" prop="order" sortable="custom"></el-table-column>
		<el-table-column label="销售额"  class-name="yellow-column"  width="120" prop="salesVolume" sortable="custom">
			<template #default="scope">
				<el-popover
				   placement="right"
				   title="销售额详情"
				   :width="200"
				   trigger="click"
				 >
				 <div class="list-item">
				  <p class ="flex-center-between">
					  <span class="text-gray">FBA销售额</span>
					  <span>{{scope.row.currency}}{{scope.row.fbaSalesVolume}}</span>
					</p>
					 <p class ="flex-center-between">
					  <span class="text-gray">FBM销售额</span>
					  <span>{{scope.row.currency}}{{scope.row.fbmSalesVolume}}</span>
					</p>
					 <p class ="flex-center-between font-bold">
					  <span >合计</span>
					  <span>{{scope.row.currency}}{{scope.row.salesVolume}}</span>
					</p>
										
				 </div>
				   <template #reference>
				    <el-space class="pointer" :size="4">
				    <span >
				    {{scope.row.currency}}{{scope.row.salesVolume}} 
				    </span>	
				    <el-icon class="font-extraSmall"><ArrowDownBold /></el-icon>
				    </el-space>
				   </template>
				 </el-popover>
			</template>
		</el-table-column>
		<el-table-column label="广告销量"  class-name="yellow-column"   width="120" prop="adSales" sortable="custom" >	</el-table-column>
		<el-table-column label="广告销售额"   class-name="yellow-column"  width="120" prop="adSalesVolume" sortable="custom">	</el-table-column>
		<el-table-column label="FBA赔偿"  class-name="yellow-column"  width="120" prop="fbaCompensation" sortable="custom" />
		<el-table-column label="买家运费"  class-name="yellow-column"  width="120" prop="shippingCredits" sortable="custom" >
		<template #default="scope">
			{{scope.row.currency}}{{scope.row.shippingCredits}}
		</template>	
		</el-table-column>
		<el-table-column label="其他收入"  class-name="yellow-column"  width="120" prop="otherFee" sortable="custom" >
		<template #default="scope">
			{{scope.row.currency}}{{scope.row.otherFee}}
		</template>	
		</el-table-column>
		<el-table-column label="平台费"  width="120" class-name="green-column" prop="commission" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.commission}}
			</template>	
		</el-table-column>
		<el-table-column label="销售佣金"  width="120" class-name="green-column" prop="sellingFees" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.sellingFees}}
			</template>	
		</el-table-column>
		<el-table-column label="促销折扣"  width="120" class-name="green-column" prop="promotionalRebates" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.promotionalRebates}}
			</template>	
		</el-table-column>
		<el-table-column label="退款量" width="100"  class-name="green-column"   prop="refundAmount" sortable="custom">	</el-table-column>
		<el-table-column label="退款率" width="100" class-name="green-column" prop="refundRate" sortable="custom">	</el-table-column>
		<el-table-column label="采购成本"  width="120" class-name="green-column" prop="procuremenCost" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.procuremenCost}}
			</template>	
		</el-table-column>
		<el-table-column label="广告花费"  width="120" class-name="green-column" prop="adCost" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.adCost}}
			</template>	
		</el-table-column>
		<el-table-column label="推广费"  width="100" class-name="green-column" prop="promotionFee" sortable="custom">
			<template #default="scope">
				{{scope.row.currency}}{{scope.row.promotionFee}}
			</template>	
		</el-table-column>
		<el-table-column label="FBA配送费" class-name="green-column"  width="120" prop="InitialCost" sortable="custom" >
		<template #default="scope">
				{{scope.row.currency}}{{scope.row.InitialCost}}
			</template>	
		</el-table-column>
		<el-table-column label="仓储费" class-name="green-column" width="120" prop="storageFee" sortable="custom"  >
		<template #default="scope">
				{{scope.row.currency}}{{scope.row.storageFee}}
			</template>	
		</el-table-column>
		<el-table-column label="物流运费" class-name="green-column" width="120" prop="storageFee" sortable="custom"  >
		<template #default="scope">
				{{scope.row.currency}}{{scope.row.transportationFee}}
			</template>	
		</el-table-column>
		<el-table-column label="其他费用"  class-name="green-column"  width="120" prop="salesVolume" sortable="custom">
			<template #default="scope">
				<el-popover
				   placement="right"
				   title="其他费用详情"
				   :width="200"
				   trigger="click"
				 >
				 <div class="list-item">
				  <p class ="flex-center-between">
					  <span class="text-gray">调整费用</span>
					  <span>{{scope.row.currency}}{{scope.row.Adjustments}}</span>
					</p>
					 <p class ="flex-center-between">
					  <span class="text-gray">店铺服务费</span>
					  <span>{{scope.row.currency}}{{scope.row.serviceFees}}</span>
					</p>
					<p class ="flex-center-between">
					  <span class="text-gray">自定义费用</span>
					  <span>{{scope.row.currency}}{{scope.row.diyfee}}</span>
					</p>
					 <p class ="flex-center-between font-bold">
					  <span >合计</span>
					  <span>{{scope.row.currency}}{{scope.row.otherCost}}</span>
					</p>
										
				 </div>
				   <template #reference>
				    <el-space class="pointer" :size="4">
				    <span >
				    {{scope.row.currency}}{{scope.row.otherCost}} 
				    </span>	
				    <el-icon class="font-extraSmall"><ArrowDownBold /></el-icon>
				    </el-space>
				   </template>
				 </el-popover>
			</template>
		</el-table-column>
		<el-table-column label="毛利润" fixed="right"  width="120" prop="grossProfit" sortable="custom"  />
		<el-table-column label="毛利率"  fixed="right" width="100" prop="grossProfitMargin" sortable="custom"  />
		</template>
	</GlobalTable>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDownBold,Download,Upload} from '@element-plus/icons-vue';
	import Child from"./child.vue"
	const state = reactive({
		tableData:{
			records:[
			{
				parentAsin:'01-JTXR-84SB',
				diyfee:'-0.22',
				sellingFees:'-268.36',
				transportationFee:'-2.36',
				otherCost:'-26.56',
				serviceFees:'-2.56',
				Adjustments:'-1.02',
				currency:'￥',
				image:require('@/assets/image/testpic.png'),
				name:'Pin The Horn on The Unicorn Birth.',
				msku:'ADWD15AWD',
				group:'DAKKKWA',
				market:'美国',
				sale:'154',
				fbmSale:'0',
				otherSale:'0',
				order:'150',
				fbaSalesVolume:'56465.00',
				fbmSalesVolume:'0',
				salesVolume:'56465.00',
				shippingCredits:'156.00',
				otherFee:'66.00',
				adSales:'122',
				adSalesVolume:'￥19655.00',
				refundAmount:'15',
				refundRate:'1.2%',
				procuremenCost:'-2656.50',
				adCost:'-18588.50',
				promotionFee:'-0.00',
				commission:'-79.84',
				fbaCompensation:'￥2179.84',
				storageFee:'-458.25',
				InitialCost:'-4143.25',
				grossProfit:'￥156564.85',
				promotionalRebates:'-564.05',
				grossProfitMargin:'30.5%',
			}
		],total:1}
	})
	const{
		tableData,
	}=toRefs(state)
</script>

<style >
	th.yellow-column {
		background-color: var(--el-color-warning-light-9)!important;
	}
	th.green-column{
		background-color: var(--el-color-success-light-9)!important;
	}
	.text-gray{
		color: #999999;
	}
	.list-item p{
		line-height: 32px;
	}
</style>
 