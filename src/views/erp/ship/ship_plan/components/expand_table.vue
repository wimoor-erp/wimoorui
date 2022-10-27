<template>
	<el-table   :data="expendtableData"  size="small">
		<el-table-column label="FBA仓库" prop="warehouse"  sortable  >
			<template #default="scope">
				<el-link >{{scope.row.warehouse}}</el-link>
			</template>
		</el-table-column>
		<el-table-column label="亚马逊sku"  prop="sku" ></el-table-column>
		<el-table-column label="7天/30天销量汇总" min-width="120"  prop="sales" ></el-table-column>
		<el-table-column label="预估日均销量" min-width="90">
			<template #default="scope">
				<div class="table-edit-flex" @click="adjustSale(scope.row)">	
				<span>{{scope.row.Average}}</span>
				<span class="font-extraSmall"> ({{scope.row.sysAverage}})</span>
				<el-icon ><Calendar/></el-icon>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="备货周期">
			<template #default="scope">
				 <el-popover
				    placement="top-start"
				    title="备货周期"
				    :width="200"
					trigger="click"
				  >
				  <p class="font-extraSmall m-b-8">
					  备货周期:68天=安全库存周期20天+头程周期45天+上架周期3天
				  </p>
				  <el-input class="m-b-8" v-model="scope.row.cycle2">
					  <template #prepend>安全库存周期</template>
				  </el-input>
				  <el-button type="primary">确定</el-button>
				   <el-button >取消</el-button>
				    <template #reference>
				     <div class="table-edit-flex" @click="editRemarks">
				     	<span>{{scope.row.cycle}}</span>
				     	<el-icon ><Edit/></el-icon>
				     </div>
				    </template>
				  </el-popover>
			</template>
		</el-table-column>
		<el-table-column label="FBA库存" >
			<template #default="scope">
				<el-popover    placement="top" width="240px"  >
				<template  #reference>	
				 <span>{{scope.row.FBAinventory}}</span>
				</template>
				 <ul class="border-line">
					<li class="flex-center-between "><span>可用库存</span><el-tag type="success">0</el-tag></li>
					 <li class="flex-center-between"><span>预留库存<span class="font-extraSmall"> (买家订单)</span></span><el-tag >0</el-tag></li>
					 <li class="flex-center-between"><span>预留库存<span class="font-extraSmall"> (运营中心转运)</span></span><el-tag type="warning">0</el-tag></li>
					 <li class="flex-center-between"><span>预留库存<span class="font-extraSmall"> (运营中心处理中)</span></span><el-tag type="warning">0</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (正在发货)</span></span><el-tag type="info">0</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (待接收)</span></span><el-tag type="info">0</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (正在接收)</span></span><el-tag type="info">0</el-tag></li>
				 </ul>
				</el-popover>
			</template>
		</el-table-column>
		<el-table-column label="建议发货量" >
			<template #default="scope">
				{{scope.row.suggestshipnum}}
			</template>
		</el-table-column>
		<el-table-column label="FBA实际发货量"  min-width="100">
			<template #default="scope">
				<span v-if="state">{{scope.row.shipnum}}</span>
				<el-input v-else  size="small" v-model="scope.row.shipnum"></el-input>
			</template>
		</el-table-column>
		<el-table-column label="可销售天数">
			<template #default="scope">
				<el-tooltip
				        effect="dark"
				        content="断货时间:2022-02-22"
				        placement="top"
				      >
				       {{scope.row.saleday}}
				      </el-tooltip>
			</template>
		</el-table-column>
		<el-table-column label="发货后可销售天数" min-width="115">
			<template #default="scope">
				{{scope.row.saleday}}
			</template>
		</el-table-column>
		<el-table-column label="近期发货记录" min-width="185">
			<template #default="scope">
				<el-space>
				<span class="pointer" @click="shipHistory">{{scope.row.shiphistory.time}}</span>
				<el-tag  type="success" round>{{scope.row.shiphistory.state}}</el-tag>
				</el-space>
			</template>
		</el-table-column>
		<el-table-column label="商品详情" >
			<template #default="scope">
				<el-icon @click="showProductDeatils" class="font-medium ic-cen"><View /></el-icon>
			</template>
		</el-table-column>
	</el-table>
	<SaleAdjust ref="saleAdjustRef"/>
	<el-dialog title="发货记录" v-model="historyVisable" :append-to-body="true" width="80%">
		<el-table border :data="historyTable">
			<el-table-column label="货件编码/创建日期">
				<template #default="scope">
					<el-link :underline="false" type="primary" class="font-small">FBA16XK8LXWX</el-link>
					<p>2022-10-11</p>
				</template>
			</el-table-column>
			<el-table-column label="SKU">
				<template #default="scope">
					<span>FPWJBA3001SL</span>
				</template>
			</el-table-column>
			<el-table-column label="渠道">
				<template #default="scope">
					<span>D-美森限时达(赛航)</span>
				</template>
			</el-table-column>
			<el-table-column label="数量" width="65">
				<template #default="scope">
					<span>165</span>
				</template>
			</el-table-column>
			<el-table-column label="已接收/状态">
				<template #default="scope">
					<p>0</p>
					<el-tag type="success">已发货</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="发货日期">
				<template #default="scope">
					<span>2022-11-29</span>
				</template>
			</el-table-column>
			<el-table-column label="进出港日期" width="160">
				<template #default="scope">
					<p v-if="scope.row.state">进港:2022/2/23</p>
					<div v-else class="flex-center m-b-8">
						<span style="width: 75px;">进港:</span>
					 <el-date-picker
					        v-model="value1"
					        type="date"
							size="small"
					        placeholder="选择时间"
					        :default-value="new Date(2010, 9, 1)"
					      />
					</div>
					<p v-if="scope.row.state">出港:2022/2/23</p>
					<div v-else class="flex-center">
						<span style="width: 75px;">进港:</span>
					 <el-date-picker
					        v-model="value1"
					        type="date"
							size="small"
					        placeholder="选择时间"
					        :default-value="new Date(2010, 9, 1)"
					      />
					</div>
				</template>
			</el-table-column>
			<el-table-column label="预期到货时间">
				<template #default="scope">
					<span v-if="scope.row.state">2022-11-29</span>
					<div  class="flex-center" v-else>
					<el-date-picker
					       v-model="value1"
					       type="date"
							size="small"
					       placeholder="选择时间"
					       :default-value="new Date(2010, 9, 1)"
					     /></div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="65">
				<template #default="scope">
					<el-button v-if="scope.row.state" type="primary" @click="editShipHistory(scope.row)" link>修改</el-button>
					<el-button v-else @click="saveShipHistory"  type="primary" link>保存</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
	<GoodsDeatils ref="goodsDeatilsRef" :productInfoData="productInfoData"/>
</template>
<script setup>
	import { ref ,defineProps,reactive,onMounted,toRefs} from 'vue'
	import {Calendar,Edit,View} from '@element-plus/icons-vue';
	import SaleAdjust from"./sale_adjust"
	import GoodsDeatils from"../../shipment_add/approve/components/goods_deatils"
	let props = defineProps({
		expendtableData:{
			default:[],
		},
		state:{
			default:"",
		}
	})
	let goodsDeatilsRef = ref()
	let productInfoData =reactive({})
	let historyVisable =ref(false)
	let {expendtableData,state} =toRefs(props)
	let saleAdjustRef = ref()
	let historyTable =reactive([
		{
			code:"",
			sku:"",
			state:true,
		}
	])
    function adjustSale(row){
		saleAdjustRef.value.salevisable = true
		console.log(123)
	}
	function shipHistory(){
		historyVisable.value = true
	}
	function editShipHistory(row){
		row.state = false
	}
	
	function showProductDeatils(){
		goodsDeatilsRef.value.productVisible = true
	}
</script>

<style>
	.expand-table .el-table__expanded-cell{
		padding:0px;
	}
	.expand-table .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
	
	.expand-table .el-table__expanded-cell .el-table__inner-wrapper::before{background-color:var(--el-fill-color-lighter)}
	.m-b-8{
		margin-bottom:8px;
	}
</style>
