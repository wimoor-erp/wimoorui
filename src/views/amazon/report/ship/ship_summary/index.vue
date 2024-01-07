<template>
	<div   class="main-sty ">
		<el-tabs v-model="queryParam.type"  @tab-change="handleQuery">
		  <el-tab-pane  label="物流承运商(汇总)" name="logitics" key="logitics">
		  </el-tab-pane>
		  <el-tab-pane  label="FBA仓库(汇总)" name="warehouse" key="warehouse">
		  </el-tab-pane>
		  <el-tab-pane  label="SKU(汇总)" name="sku" key="sku">
		  </el-tab-pane>
		</el-tabs>
		<div class="con-header">
		<el-row>
			  	<div >
					<el-space >
				  <Warehouse @changeware="getWarehouse" defaultValue="all"  />
				 <el-select v-model="queryParam.datetype" style="width:100px">
					 <el-option value="createdate" key="createdate" label="创建日期"></el-option>
					 <el-option value="deliverydate" key="deliverydate"  label="发货日期"> </el-option>
				 </el-select>
				  <Datepicker longtime="ok" ref="datepickers" @changedate="changedate" />
				  <el-select v-model="queryParam.companyid" placeholder="选择承运商" @change="companyChange">
							 <el-option v-for="item in companylist" :value="item.id" :key="item.id" :label="item.name"></el-option>
				  </el-select>
				  <el-select v-model="queryParam.channelid" placeholder="选择物流渠道">
							  <el-option v-for="item in channellist" :value="item.id" :key="item.id" :label="item.channame"></el-option>
				  </el-select>
				 <el-input  v-model="queryParam.search" clearable @input="handleQuery" placeholder="请输入" class="input-with-select" >
					<template #prepend> 
					  <el-select v-model="queryParam.searchtype"  placeholder="SKU" style="width: 90px">
						<el-option label="承运商" value="company"></el-option>
						<el-option label="FBA仓库" value="fba"></el-option>
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
		   	</div>
	
		   <div class='rt-btn-group ' >
			   <el-button @click.stop="downloadList" :loading="downLoading">导出</el-button>
		   <el-button class='ic-btn'  title='自定义列'>
		      <setting-two theme="outline" size="16"  :strokeWidth="3"/>
		   </el-button>
		    <el-button   class='ic-btn' title='帮助文档'>
		     <help theme="outline" size="16" :strokeWidth="3"/>
		   </el-button>
		   </div>
		</el-row>
		
		<el-row class="gary-bg pie-chart">
			<el-col :span="24">
				<el-space class="pie-title">
		<div class="font-extraSmall">汇总指标:</div>
		<el-select v-model="fieldkey.value"  >
		  	  <el-option v-for="item in fieldoptions" :value="item.key" :key="item.key" :label="item.name"></el-option>
		  </el-select>
		  </el-space>
		  <div class="flex-center" style="flex-wrap: wrap;">
			   <div  v-for="(value,key) in chartdata.value">
					<PieChart :name="key" :data="value" :keyvalue="fieldkey" :chartdata="chartdata"></PieChart>
			   </div>
		  </div>
		  </el-col>
		</el-row>
		</div>
	<GlobalTable
	  show-summary
	  :summary-method="getSummaries"
	  ref="globalTable" 
	  :tableData="tableData"   
	  @loadTable="loadTableData" 
	  :stripe="true"  
	  :border="false"
	  style="width: 100%;margin-bottom:16px;">
		 <template #field>
		 <el-table-column prop="logitics"    v-if="queryParam.type=='logitics'" fixed="left"   label="物流承运商" width="180"  sortable="custom" />
		 <el-table-column prop="channame"    v-if="queryParam.type=='logitics'"  fixed="left" label="物流渠道" min-width="180"  sortable="custom" >
			  <template #default="scope">
				  <div>{{scope.row.channame}}</div>
				  <div class="font-extraSmall"><span>{{scope.row.subarea}} </span>-<span>{{scope.row.channelname}}</span>-<span>{{scope.row.transtype}} </span></div>
			  </template>
		  </el-table-column>
		  <el-table-column prop="warehouse"  v-if="queryParam.type=='warehouse'"  fixed="left" label="FBA仓库" min-width="120"  sortable="custom" />
		  <el-table-column prop="sku"        v-if="queryParam.type=='sku'"  fixed="left" label="SKU" min-width="120"  sortable="custom" />
		   <el-table-column   label="发货信息" >
		    <el-table-column prop="totalqty" v-if="queryParam.type=='sku'"  label="计划发货" min-width="100"  sortable="custom" />
		    <el-table-column prop="totalout"   label="实际发货" min-width="100"  sortable="custom" >
				<template #header>
					 <el-tooltip placement="top" content="已发货出库的货件上的发货数量.(等于 实际接收数量 + 待接收数量 +接收差值)">
					  <span>实际发货</span>  
					  </el-tooltip>
				</template>
			</el-table-column>
		 
		    <el-table-column prop="totalrec"   label="实际接收" min-width="100"  sortable="custom" >
				<template #header>
						 <el-tooltip placement="top" content="已发货出库的货件中, 亚马逊已接收的产品数量, 包括正在接收和接收完成的货件">
						  <span>实际接收</span>  
						  </el-tooltip>
					</template>
				</el-table-column>
		    <el-table-column prop="lessrec"    label="接收差值" min-width="100" sortable="custom"  >
		    <template #header>
		    		 <el-tooltip placement="top" content="已发货出库且已完成的货件中, 实际发货数量与亚马逊接收数量的差值">
		    		  <span>接收差值</span>  
		    		  </el-tooltip>
		    	</template>
		    </el-table-column>
		    <el-table-column prop="needout"    label="待发货" min-width="100"  sortable="custom" >
				<template #header>
						 <el-tooltip placement="top" content="已发货出库且已完成的货件中, 实际发货数量与亚马逊接收数量的差值">
						  <span>接收差值</span>  
						  </el-tooltip>
					</template>
				</el-table-column>
		     <el-table-column prop="needrec"   label="待接收" min-width="90"  sortable="custom" />
			 <el-table-column prop="worth"      label="实际发货货值" min-width="125"  sortable="custom" >
				 <template #header>
				 		 <el-tooltip placement="top" content="已发货出库的货件上的产品的货值">
				 		  <span>实际发货货值</span>  
				 		  </el-tooltip>
				 	</template>
		    </el-table-column>
			 </el-table-column>
		   <el-table-column   label="运输信息"   v-if="queryParam.type!='sku'">
			  <el-table-column prop="readweight"      v-if="queryParam.type!='sku'"  label="预估运输重量(KG)" min-width="150"  sortable="custom" >
				  <template #header>
				  	 		 <el-tooltip placement="top" content="产品的重量*发货数量">
				  	 		  <span>预估运输重量(KG)</span>  
				  	 		  </el-tooltip>
				  	 	</template>
				  </el-table-column>
			  <el-table-column prop="transweight_kg"  v-if="queryParam.type!='sku'"  label="发货运输重量(KG)" min-width="150"  sortable="custom" >
				  <template #header>
				  	 		 <el-tooltip placement="top" content="货件计费重量">
				  	 		  <span>发货运输重量(KG)</span>  
				  	 		  </el-tooltip>
				  	 	</template>
				  </el-table-column>
			  <el-table-column prop="transweight_cbm" v-if="queryParam.type!='sku'"  label="发货运输重量(CBM)" min-width="160"  sortable="custom" >
				  <template #header>
				  	 		 <el-tooltip placement="top" content="货件计费体积">
				  	 		  <span>发货运输重量(CBM)</span>  
				  	 		  </el-tooltip>
				  	 	</template>
			   </el-table-column>
			  <el-table-column prop="totalbox"        v-if="queryParam.type!='sku'"  label="货件箱数" min-width="100"  sortable="custom" >
				  <template #header>
						 <el-tooltip placement="top" content="货件中包含的箱子数量">
						  <span>货件箱数</span>  
						  </el-tooltip>
					</template>
				  </el-table-column>
			  <el-table-column prop="shipfee"         v-if="queryParam.type!='sku'"  label="运输费用" min-width="100"  sortable="custom" >
				  <template #header>
						 <el-tooltip placement="top" content="货件运费">
						  <span>运输费用</span>  
						  </el-tooltip>
					</template>
				  </el-table-column>
			  <el-table-column prop="totalotherfee"   v-if="queryParam.type!='sku'"  label="关税/其他费用" min-width="140"  sortable="custom" >
				  <template #header>
						 <el-tooltip placement="top" content="货件的税费和其它费用">
						  <span>关税/其他费用</span>  
						  </el-tooltip>
					</template>
				  </el-table-column>
			  <el-table-column prop="avgtime"         v-if="queryParam.type!='sku'"  label="平均物流时效(天)" min-width="150"  sortable="custom" >
				      <template #header>
						 <el-tooltip placement="top" content="货件从确认出库到开始接收的平均时效">
						  <span>平均物流时效(天)</span>  
						  </el-tooltip>
					</template>
			  </el-table-column>
			  </el-table-column>
			 <el-table-column   label="货件信息" v-if="queryParam.type!='sku'">
				  <el-table-column prop="shipmentnum"     v-if="queryParam.type!='sku'"  label="货件票数" min-width="100"  sortable="custom" />
				  <el-table-column prop="problem"  v-if="queryParam.type!='sku'" label="异常货件票数 " min-width="140"  sortable="custom" />
		     </el-table-column>
	  </template>
	 </GlobalTable>
 </div>

</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import { ElDivider } from 'element-plus'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import reportApi from '@/api/amazon/inbound/reportApi.js';
	import {dateFormat,getCurrencyMark} from '@/utils/index';
	import {ElMessage } from 'element-plus';
	import Warehouse from '@/components/header/warehouse.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import PieChart from './component/piechart.vue';
	import transportationApi from '@/api/erp/ship/transportationApi';
	const globalTable=ref();
	let state=reactive({
		 downLoading:false,
		 queryParam:{
			 search:"",
			 marketplaceid:"",
			 searchtype:"company",
			 datetype:"createdate",
			 type:"logitics",
			 companyid:"",
			 channelid:"",
		 },
		 isload:true,
		 tableData:{records:[],total:0},
		 snapshotDate:'',
		 summary:{},
		 fieldkey:{value:"transweight_kg"},
		chartdata:{value:[]},
		companylist:[],
		channellist:[],
		fieldoptions:[
					 {name:"预估运输重量",key:'readweight'},
		             {name:"计划发货",key:'totalqty'},
					 {name:"实际发货",key:'totalout'}, 
					 {name:"实际接收",key:'totalrec'},
					 {name:"接收差值",key:'lessrec'}, 
					 {name:"实际发货货值",key:'worth'},
					 {name:"待接收",key:'needrec'},
					 {name:"待发货",key:'needout'},
					 {name:"发货运输重量(KG)",key:'transweight_kg'},
					 {name:"发货运输重量(CBM)",key:'transweight_cbm'},
					 {name:"运输费用",key:'shipfee'},
					 {name:"货件箱数",key:'totalbox'},
					 {name:"关税/其他费用",key:'totalotherfee'},
					 {name:"货件票数",key:'shipmentnum'},
					 {name:"平均物流时效(天)",key:'avgtime'},
					  ],
	});
	let {
	   queryParam,
	   fieldkey,
	   isload,
	   fieldoptions,
	   tableData,
	   chartdata,
	   summary,
	   downLoading,
	   companylist,
	   channellist
	} =toRefs(state);
 
	function getWarehouse(val){
		state.queryParam.warehouseid=val;
		handleQuery();
	}
	//日期改变
	function changedate(dates){
		state.queryParam.fromDate=dates.start;
		state.queryParam.toDate=dates.end;
		if(state.isload==false){
			handleQuery();
		}
		 
	}
	function handleQuery(){
		globalTable.value.loadTable(state.queryParam);
	}
	 
	function loadTableData(params){
		reportApi.getShipmentReportByLoistics(params).then((res)=>{
			state.isload=false;
			state.tableData.records = res.data.records;
			state.tableData.total =res.data.total;
			if(params.currentpage==1){
				 if(res.data.total>0){
					  state.summary=res.data.records[0].summary;
				 }
			}
		});
		reportApi.getShipmentReportByWarehouseLoistics(params).then((res)=>{
			state.chartdata.value=res.data;
		});
	}
	function downloadList(){
		state.downLoading=true
		if(state.queryParam.type=='logitics'){
			reportApi.downExcelShipmentReportByLoistics(state.queryParam,()=>{
				state.downLoading=false;
			});
		}else{
			reportApi.downExcelShipmentReportByLoistics(state.queryParam,()=>{
				state.downLoading=false;
			});
		}
		
	}
	 
	/* 合计行数据 */
	function getSummaries({columns,data}){
		var arr = ["合计"];
		columns.forEach((item,index)=>{
			if(index>=2){
				 arr[index]=state.summary[item.property];
				 
			}
		})
		return  arr
	}
	function loadCompany(){
		transportationApi.getTranlist().then((res)=>{
			res.data.push({"id":"","name":"全部"})
			state.companylist=res.data;
		})
	}
	function getchannelList(val){
		var companyid=val;
		var market="";
		state.queryParam.channelid="";
		if(val!=""){
			transportationApi.getChannel({"company":companyid,"marketplaceid":market,"transtype":""}).then((res)=>{
				res.data.push({"id":"","channame":"全部"});
				state.channellist=res.data;
			})
		}else{
			state.channellist=[];
		}
	}
	function companyChange(val){
		getchannelList(val);
		handleQuery();
	}
	onMounted(()=>{
		loadCompany()
	})
</script>

<style scoped>
	.pie-chart{
		padding:16px 8px 8px 8px;
	}
	.pie-title{
		padding-left:8px;
		padding-bottom:8px;
	}
	@media screen and (max-width:1600px){
	 .rt-btn-group{
		 margin-top:8px;
	 }
		}
</style>
