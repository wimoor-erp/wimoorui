<template>
	 <div class="expand-table">
	<el-table border  height="calc(100vh - 260px)"  row-key="id" :data="tableData" :row-class-name="tableRowClassName" ref="tableRef">
		<el-table-column type="expand" width="38">
			 <template #default="props">
				<!-- 展开的table -->
				<Expandtable :expendtableData="props.row.expendTable" :state="props.row.state"/>
			 </template>
		</el-table-column>
		<el-table-column prop="img" label="图片" width="60" >
		   <template #default="scope">
		    <el-image :src="scope.row.img"   width="40" height="40"  ></el-image>
		  </template>
		</el-table-column>
		<el-table-column prop="product" label="名称/SKU" width="240" show-overflow-tooltip>
		   <template #default="scope">
		      <div class='name'>{{scope.row.name}}</div>
		      <el-link type="primary" class="font-small">{{scope.row.sku}} </el-link>
		  </template>
		</el-table-column>
		<el-table-column label="建议发货总量" prop="suggestshipnum"  sortable  width="125"></el-table-column>
		<el-table-column label="实际发货总量" sortable prop="shipnum" width="125"></el-table-column>
		<el-table-column label="可用库存" sortable prop="inventory" width="100">
			<template #default="scope">
					<el-popover    placement="top" width="400"  >
					<template  #reference>	
			         <span>{{scope.row.inventory}}</span>
					</template>
					 <ul class="border-line">
						<li class="flex-center-between "><span>待入库库存</span><el-tag >0</el-tag></li>
						 <li class="flex-center-between"><span>可售库存</span><el-tag type="success">0</el-tag></li>
						 <li class="flex-center-between"><span>待出库库存</span><el-tag type="warning">0</el-tag></li>
						 <li class="flex-center-between"><span>可组装库存</span><el-tag type="info">0</el-tag></li>
					 </ul>
					</el-popover>
			</template>
		</el-table-column>
		<el-table-column label="公告">
			<template #default="scope">
					<div class="table-edit-flex" @click="editRemarks">
						<span>{{scope.row.remarks}}</span>
						<el-icon ><Edit/></el-icon>
					</div>
			</template>
		</el-table-column>
		<el-table-column label="报表" width="90">
			<template #default="scope">
			   <el-space :size="12">
				   <el-link :underline="false" type="warning" @click="handlesaleChart(scope.row)">
					   <el-tooltip content="销量报表" placement="top" :hide-after="0" :show-after="200">
				   <chart-histogram class="ic-cen" theme="outline" size="19" :strokeWidth="4"/>
				   </el-tooltip>
				   </el-link>   
				   
				   <el-link :underline="false" type="danger" @click="handlarrivalChart(scope.row)">
					   <el-tooltip content="预计到货报表" placement="top" :hide-after="0" :show-after="200">
				  <chart-line class="ic-cen" theme="filled" size="18" fill="#67c23a"/>
				   </el-tooltip>
				   </el-link>
			</el-space>	
			</template>
		</el-table-column>
		<el-table-column label="计划发货" width="80">
			<template #default="scope">
				<el-switch
				    v-model="scope.row.plan"
				    inline-prompt
				    active-text="是"
				    inactive-text="否"
				  />
			</template>
		</el-table-column>
		<el-table-column label="操作" width="80">
			<template #default="scope">
				<div class="flex-center-bew">
				<el-link @click="expendRow(scope.row)"  :underline="false" type="primary" class="font-small">
					<span @click="editPlan(scope.row)" v-if="scope.row.state">编辑</span>
					<span v-else @click="savePlan(scope.row)">保存</span>
				</el-link>
				<el-dropdown :hide-on-click="false" trigger="click">
				  <span class="el-dropdown-link" >
				    <more-one class="ic-cen" theme="outline" size="20" fill="#333" :strokeWidth="3"/>
				  </span>
				   <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item >
						  <span v-if="scope.row.displayState" @click="hideProduct(scope.row)">隐藏产品</span>
						  <span v-else @click="showProduct(scope.row)">显示产品</span>
					  </el-dropdown-item>
				    </el-dropdown-menu>
				</template>
				</el-dropdown>
				</div>
			</template>
		</el-table-column>
	</el-table>
	</div>
	<SalechartDialog ref="salechartRef"/>
	<ArrivalDialog ref="arrivalchartRef"/>
	<RemarksDialog ref="remarksRef"/>
</template>
<script setup>
	import { ref ,watch,reactive,onMounted} from 'vue'
	import Expandtable from "./expand_table";
	import SalechartDialog from "./salechart_dialog.vue"
	import ArrivalDialog from "./arrival_dialog.vue"
	import RemarksDialog from "./remarks_dialog.vue"
	import {Edit} from '@element-plus/icons-vue';
	import { ElMessage } from 'element-plus'
	import {Help,MoreOne,ChartHistogram,ChartLine} from '@icon-park/vue-next';
	let tableData =reactive([
			   {
				  id:1,
				  img:require('@/assets/image/testpic.png'),
				  name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
				  sku:'kq002',
				  mark:'圣诞节',
				  suggestshipnum:200,
				  shipnum:250,
				  inventory:600,
				  plan:false,
				  remarks:'应季4-8月2022备货：UK350',
				  state:true,
				  displayState:true,
				  expendTable:[
					  {
					  warehouse: '美国',
					  sku:'KQ301',
					  sales:'685 | 1636',
					  Average: 100,
					  sysAverage:60,
					  cycle:48,
					  FBAinventory:200,
					  suggestshipnum:250,
					  shipnum:250,
					  saleday:63,
					  shiphistory:{time:"2022-08-29 762",state:'已发货',},
					  }
				  ]
			   }
		   ])
		   let salechartRef =ref()
		   let arrivalchartRef =ref()
		   let tableRef =ref() 
		   let remarksRef =ref()
		   /* 销量报表 */
		   function handlesaleChart(){
			   salechartRef.value.salechartVisible = true
		   }
		   /* 预计到货报表 */
		   function handlarrivalChart(){
			   arrivalchartRef.value.arrivalVisible =true
		   }
		   /* 选中样式 */
           function tableRowClassName({row,rowIndex}){
			   if(row.plan==true){
				   return 'waring-bg'
			   }
		   }
		   function expendRow(row){
			  tableRef.value.toggleRowExpansion(row,true)
		   }
		  function editPlan(row){
			  row.state =false
		  }
		   function savePlan(row){
			  row.state =true
		   }
		   /* 隐藏产品 */
		   function hideProduct(row){
			   row.displayState = false
			   ElMessage({
				    message: '产品已隐藏！',
				    type: 'success',
			   })
		   }
		   function showProduct(row){
			   row.displayState = true
		   }
		   /* 编辑公告 */
		   function editRemarks(row){
			   remarksRef.value.remarksVisable = true
		   }
</script>

<style>
	.flex-center-bew{
		display: flex;
		align-items: center;
	}
	.flex-center-bew .el-link{
		margin-right:8px;
	}
	.border-line li{
		line-height:40px;
     }
	 .waring-bg{background-color: var(--el-color-primary-light-9)!important;}
</style>
