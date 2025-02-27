<template>
	<el-scrollbar class="localoversea">
						  <el-row style="padding-bottom:20px">
							  <div class='rt-btn-group'>
								<el-space>
									<div class="font-extraSmall">更新时间：{{refreshtime}}</div>
								<el-input clearable  placeholder="请输入SKU" v-model="queryParam.sku" @input="handleQueryInv"/>
								<el-button @click="handleSyncInv">同步库存</el-button>
								</el-space>
								</div>
						    </el-row>
							<GlobalTable ref="globalTableRef"  :tableData="tableData" height="calc(100vh - 300px)" :stripe="true"  @loadTable="loadTableData" style="width: 100%;margin-bottom:16px;">
								<template #field>
										  <el-table-column   prop="image" label="图片" width="60" >
										     <template #default="scope">
										  	<el-popover
										  	    placement="top-start"
										  	    :width="200"
										  	    trigger="hover"
										  		v-if="scope.row.info&&scope.row.info.image"
										  	  >
										  	    <template #reference>
										  	      <el-image  :src="scope.row.info.image"   width="40" height="40"  ></el-image>
										  	    </template>
										  		<el-image  :src="scope.row.info.image"    ></el-image>
										  	  </el-popover>
										  	<el-image v-else :src="$require('empty/noimage40.png')"   width="40" height="40"  ></el-image>
										    </template>
										  </el-table-column>
										  <el-table-column prop="sku" label="SKU编码"  sortable    >
											 <template #default="scope"> 
											   <div class='name'>{{scope.row.productName}}</div>
											   <div class='sku'>{{scope.row.sku}}
											     <copy class="" @click="CopyText(scope.row.sku)" title='复制名称' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
												 </div>
											 </template>
										  </el-table-column>
										  <el-table-column prop="whName" label="仓库名称"    width="180" />
										  <el-table-column prop="productTotalAmount" label="库存"   width="280"  sortable  >
										  <template #default="scope">
										  											   <div class='font-bold'>{{scope.row.productTotalAmount}}</div>
										  	 <el-space v-if="scope.row.productStockDtl">
												 <div><span class="font-extraSmall">可用：</span>{{scope.row.productStockDtl.availableAmount}}  </div>
												 <div><span class="font-extraSmall">待出库：</span>{{scope.row.productStockDtl.lockAmount}}  </div>
												 <div><span class="font-extraSmall">待入库：</span>{{scope.row.productStockDtl.transportAmount}}  </div>
											 </el-space> 
										  											 </template>
										  </el-table-column>
										 
										<el-table-column prop="fbaReturnTotalAmount" label="FBA退回库存"   width="280"  sortable  >
										<template #default="scope">
																					   <div class='font-bold'>{{scope.row.fbaReturnTotalAmount}}</div>
											 <el-space v-if="scope.row.fbaReturnStockDtl">
																						 <div><span class="font-extraSmall">可用：</span>{{scope.row.fbaReturnStockDtl.availableAmount}}  </div>
																						 <div><span class="font-extraSmall">待出库：</span>{{scope.row.fbaReturnStockDtl.lockAmount}}  </div>
																						 <div><span class="font-extraSmall">待入库：</span>{{scope.row.fbaReturnStockDtl.transportAmount}}  </div>
																					 </el-space> 
																					 </template>
										</el-table-column>
								</template>
								</GlobalTable>
	  </el-scrollbar>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,nextTick } from 'vue';
	import {Copy} from '@icon-park/vue-next';
	import { Plus,Search, Edit, Refresh, Delete,MoreFilled,Setting } from '@element-plus/icons-vue';
	import { ElMessage, ElMessageBox } from 'element-plus';
	import CopyText from"@/utils/copy_text.js";
	import thirdpartyApi from "@/api/erp/thirdparty/thirdpartyApi.js";
	import thirdpartyWarehouseApi from "@/api/erp/thirdparty/thirdpartyWarehouseApi.js";
	import { useRoute,useRouter } from 'vue-router';
	let router = useRouter();
	const globalTableRef=ref();
	const state = reactive({tableData:{records:[],total:0},apiid:"",refreshtime:"无",warehouselist:[],defaultActive:1,queryParam:{},apilist:[]});
	const { tableData,apiid,warehouselist,defaultActive,queryParam,apilist,refreshtime} = toRefs(state);
	function query(queryParam){
		state.queryParam=queryParam;
		handleQueryInv();
	}
	function handleQueryInv(){
		 globalTableRef.value.loadTable(state.queryParam);
	}
	function loadTableData(param){
		thirdpartyWarehouseApi.searchStock(param).then(res=>{
			if(res.data.data){
				console.log(res.data.data.records)
				state.tableData.records=res.data.data.records;
				state.tableData.total=res.data.data.total;
			}else{
				state.tableData.records=[];
				state.tableData.total=0;
			}
			
		});
	}
	function handleSyncInv(){
		 globalTableRef.value.loadTable(state.queryParam);
	}
	defineExpose({query})
</script>

<style>
</style>