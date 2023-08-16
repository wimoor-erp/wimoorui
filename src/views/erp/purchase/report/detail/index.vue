<template>
    <div class="main-sty">
        <div class="con-header">
        <el-row>
            <el-space >
                <el-button @click="downLoadExcel">
                    <span>导出</span>
                </el-button>
				 <Warehouse    @changeware="wareChange" defaultValue="all" />
				 	<Datepicker longtime="ok" ref="datepickers" @changedate="changedate" />
                <el-input  v-model="queryParams.search" @clear="handleQuery" placeholder="请输入" class="input-with-select" clearable>
                    <template #prepend>
                        <el-select v-model="queryParams.ftype" @change='handleQuery'  placeholder="SKU" style="width: 110px">
                            <el-option label="SKU" value="sku"></el-option>
                            <el-option label="订单编号" value="number"></el-option>
							<el-option label="供应商名称" value="supplier"></el-option>
                        </el-select>
                    </template>
                    <template #append>
                        <el-button @click="handleQuery">
                            <el-icon style="font-size: 16px;align-itmes:center">
                                <search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
            </el-space>
            <div class='rt-btn-group'>
				<el-button   class='ic-btn' title='帮助文档'>
                    <help theme="outline" size="16" :strokeWidth="3"/>
                </el-button>
            </div>
        </el-row>
        </div>
        <!--表单-->
        <el-row>
			<GlobalTable ref="globalTable"  show-summary
			:summary-method="getSummaries"
			 :tableData="tableData"  height="calc(100vh - 200px)" 
			 :defaultSort="{ prop: 'createdate', order: 'descending' }"  @loadTable="loadTableData" :stripe="true"  
			 style="width: 100%;margin-bottom:16px;">
				<template #field>
			    <el-table-column prop="number"  label="订单编号" width="220" sortable="custom" show-overflow-tooltip>
					<template #default="scope">
					   <div >{{scope.row.number}}  
					   <el-tag v-if="scope.row.paystatus==1" type="success">已付款</el-tag>
					   <el-tag v-if="scope.row.paystatus==0" type="info">未付款</el-tag></div>
					   <div class='font-extraSmall'>{{scope.row.wname}}</div>
					 </template>
					</el-table-column>
				<el-table-column prop="image" label="图片" width="65" >
				   <template #default="scope">
				    <el-image v-if="scope.row.image" :src="scope.row.image"   style="width:40px;height:40px;"  ></el-image>
					<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   style="width:40px;height:40px;"  ></el-image>
				  </template>
				</el-table-column>
			    <el-table-column prop="sku" label="名称/SKU"  sortable="custom" show-overflow-tooltip>
			       <template #default="scope">
			          <div class='mname'>{{scope.row.name}}</div>
			          <div class='sku'>{{scope.row.sku}}  </div>
			      </template>
			    </el-table-column>
				 <el-table-column prop="supplier"  width="220" label="供应商" sortable="custom" >
				 <template #default="scope">
						<div >{{scope.row.supplier}}</div>
					</template>
				 </el-table-column>
				  <el-table-column prop="itemprice"  label="单价"  sortable="custom" />
				 <el-table-column prop="createdate"  width="150" label="创建时间" sortable="custom" >
						<template #default="scope">
				 						<div >{{dateFormat(scope.row.createdate)}}</div>
				 		</template>
				 </el-table-column>
				 <el-table-column prop="deliverydate"  width="150" label="预计到货时间" sortable="custom" >
				 		<template #default="scope">
				 						<div >{{dateFormat(scope.row.deliverydate)}}</div>
				 		</template>
				 </el-table-column>
				<el-table-column prop="amount" width="120" label="采购数量"  sortable="custom" >
					<template #default="scope">
					    <div >{{scope.row.amount}}</div>
					    <div class='font-extraSmall' v-if="scope.row.totalin">入库:{{scope.row.totalin}}  </div>
					</template>
				</el-table-column>
				 <el-table-column prop="orderprice"  width="120" label="采购金额" sortable="custom" >
				<template #default="scope">
					    <div >{{scope.row.orderprice}}</div>
					    <div class='font-extraSmall' v-if="scope.row.totalpay">已付:{{scope.row.totalpay}}  </div>
					</template>
				</el-table-column>
				<el-table-column prop="orderprice"  width="120" label="待付款金额" sortable="custom" >
				<template #default="scope">
					    <div v-if="scope.row.orderprice>=scope.row.totalpay">{{formatFloat(scope.row.orderprice-scope.row.totalpay)}}</div>
						 <div v-else>0</div>
					</template>
				</el-table-column>
				  <el-table-column prop="shipfee"  label="运费"  sortable="custom" />
				    <el-table-column prop="otherfee"  label="其它费用"  sortable="custom" />
				   <el-table-column prop="orderRemark"  label="备注"  sortable="custom" />
			</template>
			</GlobalTable>
        </el-row>

    </div>
</template>
<script setup>
    import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
    import { ref,reactive,onMounted,toRefs} from 'vue'
    import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import listApi from '@/api/erp/purchase/form/listApi.js';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi';
	import { ElMessageBox,ElMessage } from 'element-plus';
	import Warehouse from '@/components/header/warehouse.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import {format,dateFormat,dateTimesFormat,formatFloat} from '@/utils/index';
	 let globalTable=ref();
	 const state = reactive({
	 		tableData:{records:[],total:0},
	 		queryParams:{
	 			ftype:"sku",
	 			search:""
	 		},
			summary:{
				
			},
	 });
	 const { queryParams,tableData,summary } = toRefs(state);
	  function handleQuery(){
	 	  globalTable.value.loadTable(state.queryParams);
	  }
	  function loadTableData(params){
	  		  listApi.getPayRecSumReport(params).then(res=>{
	  				 state.tableData.records=res.data.records;
	  				 state.tableData.total=res.data.total;
					 if(params.currentpage==1){
							 if(res.data.total>0){
								 state.summary=res.data.records[0].summary;
							 }else{
								 state.summary={};
							 }
					 }
					 
	  		  })
	  }
	  
	 function downLoadExcel(){
		state.queryParams.auditstatus="15";
		state.queryParams.hasStatus=null;
	 	listApi.downExcelReports(state.queryParams); 
	 }
	 
	 function wareChange(val){
		 state.queryParams.warehouseid=val;
		 handleQuery();
	 }
	 //日期改变
	 function changedate(dates){
	 	state.queryParams.fromDate=dates.start;
	 	state.queryParams.toDate=dates.end;
	 	 handleQuery();
	 	 
	 }
	 
	 /* 合计行数据 */
	 function getSummaries(){
	 	var arr = ["合计"]
	 	arr[7]=state.summary.amount;
		arr[8]=state.summary.orderprice;
		arr[9]=state.summary.waitPay;
		arr[10]=state.summary.shipfee;
		arr[11]=state.summary.otherfee;
	 	return  arr
	 }
	 
	 
</script>
<style>
</style>