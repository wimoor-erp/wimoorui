<template>
	<el-row>
	  <GlobalTable ref="globalTable" :tableData="tableData"  @loadTable="loadtableData" :defaultSort="{ prop: 'createdate', order: 'descending' }" :stripe="true"  height="calc(100vh - 300px)" style="width: 100%;margin-bottom:16px;">
	    <template #field>
		   <el-table-column type="selection" width="38" />
		   <el-table-column prop="orderNum" label="货件编码/货件名称" width='160'>
		      <template #default="scope">
			     <span class='sku' @click="toFormApprove(scope.row)">{{scope.row.shipmentid}}</span>
				  <p>{{scope.row.name}}</p>
			  </template>
		    </el-table-column>
	    <el-table-column prop="plan" label="店铺/发货仓库" width='180'>
		<template #default="scope">
		     <span >{{scope.row.groupname}}</span>
			  <p class="text-gray" v-if="scope.row.syncinv!=1">{{scope.row.warehouse}}</p>
			  <div style="margin-left:-5px" v-else>
				  <el-button key="primary" @click="showSyncDailog(scope.row)" type="primary" link >本地出库 <span class="font-extraSmall">（同步货件）</span></el-button>
				 
			  </div>
		  </template>
		</el-table-column>
		 <el-table-column prop="address" label="配送中心" width="120" >
			 <template #default="scope">
			      <span >{{scope.row.country}}</span>
				  <p class="text-gray">{{scope.row.centerId}}({{scope.row.countryCode}})</p>
			   </template>
		 </el-table-column>
		  <el-table-column prop="createdate" label="创建日期" width="160"  sortable="custom">
		  <template #default="scope">
		       <span >{{dateTimesFormat(scope.row.createdate)}}</span>
			   <span v-if="scope.row.delayDays>0&&scope.row.status==5" style="padding-left:2px;">
			   <el-tooltip  placement="top">
			   					   <template #content>
			   					         <div >超期：{{scope.row.delayDays}} 天</div>
			   					    </template>
			       <el-icon  color="#F56C6C"><WarningFilled /></el-icon>
			   </el-tooltip>
			   </span>
			  <p class="font-extraSmall" v-if="scope.row.arrivalTime">到货日期:
					  <el-tooltip  placement="top">
						   <template #content>
								 <div >发货日期:{{dateFormat(scope.row.status5date)}}</div>
							</template>
						 <span>{{dateFormat(scope.row.arrivalTime)}}</span>
					  </el-tooltip>
			  </p>
		    </template>
		 </el-table-column> 
	    <el-table-column prop="skuamount" label="SKU个数" width="100"    sortable="custom">
					<template #default="scope">  
					<div>{{scope.row.skuamount}}
					
					 <el-icon class="text-orange pointer" title="物流跟踪编码待处理" v-if="scope.row.traceupstatus==0"><Ship /></el-icon>
					 <el-icon class="text-green pointer" title="物流跟踪编码已处理" v-if="scope.row.traceupstatus==1"><Ship /></el-icon>
					 <el-icon class="text-red pointer" title="物流跟踪编码处理失败" v-if="scope.row.traceupstatus==2"><Ship /></el-icon>
					 </div>
					 </template>
		</el-table-column>
		 <el-table-column prop="sumQuantity" label="实际配货数量" width="125"  sortable="custom">
			<template #default="scope">
			     <span >{{scope.row.sumshipped}}</span>
				  <p class="font-extraSmall">拟发货数量:{{scope.row.sumQuantity}}</p>
			  </template> 
		 </el-table-column> 
		  <el-table-column  label="发货渠道" width="270">
			   <template #default="scope">
			      <span >{{scope.row.company}}</span>
			 	  <p class="font-extraSmall">{{scope.row.channame}}
				  <el-button v-if="scope.row.apiSystem" 
				             @click="showTransInfoDailog(scope.row)" 
							 key="primary" 
							 type="primary" 
							 link >查看物流</el-button>
				  </p>
				  
			   </template> 
		   </el-table-column> 
		   <el-table-column prop="satus" label="状态" width="110" align="center"  >
			   <template #default="scope">
				   <el-tooltip  placement="top">
					   <template #content>
					         <div v-if="scope.row.status0date">取消日期：{{dateTimesFormat(scope.row.status0date)}}</div>
							 <div v-if="scope.row.status1date">创建日期：{{dateTimesFormat(scope.row.status1date)}}</div>
							 <div v-if="scope.row.status2date">审核日期：{{dateTimesFormat(scope.row.status2date)}}</div>
							 <div v-if="scope.row.status3date">配货日期：{{dateTimesFormat(scope.row.status3date)}}</div>
							 <div v-if="scope.row.status4date">装箱日期：{{dateTimesFormat(scope.row.status4date)}}</div>
							 <div v-if="scope.row.shipedDate"> 出库日期：{{dateTimesFormat(scope.row.shipedDate)}}</div>
							 <div v-if="scope.row.status5date">物流发货：{{dateTimesFormat(scope.row.status5date)}}</div>
							 <div v-if="scope.row.receivedate">接收日期：{{dateTimesFormat(scope.row.receivedate)}}</div>
							 <div v-if="scope.row.status6date">结束日期：{{dateTimesFormat(scope.row.status6date)}}</div>
					    </template>
			            <el-tag :type="tranStatusType(scope.row)" v-if="scope.row.status">{{tranStatus(scope.row)}}</el-tag>
				   </el-tooltip>
				     <span v-if="(scope.row.status==5||scope.row.status==0)&&(scope.row.shipmentstatus!='状态异常')" 
					 @click="refreshShipmentRec(scope.row.shipmentid)"
					 style="padding-left:2px;cursor:pointer;color:#67C23A"> 
					 <el-icon><Refresh /></el-icon>
					 </span>
					 <span v-if="(scope.row.sumrec!=scope.row.sumshipped
					             &&scope.row.status==6
								 &&!scope.row.ignorerec)||(scope.row.shipmentstatus=='状态异常')"
					 @click="refreshShipmentDialog(scope.row.shipmentid)"
					 style="padding-left:2px;cursor:pointer;color:#F56C6C"> 
					<el-icon><CircleClose /></el-icon>
					 </span>
				      <div v-if="scope.row.status>=5"><span class="font-extraSmall"> 已收货:</span>
				   			 <span class="font-extraSmall" v-if="scope.row.sumrec==scope.row.sumshipped||scope.row.ignorerec">{{scope.row.sumrec}}</span>
				   			 <span style="color:#F56C6C" v-else>{{scope.row.sumrec}}</span>
				   		 </div> 
			   </template> 
			</el-table-column>    
		   <el-table-column prop="remark" label="备注"  />
	    <el-table-column prop="operate" label="操作"  width="120"  fixed="right" >
	        <template #default="scope">
	          <el-space>
	            <el-button type="primary"  @click="shipmentfollow(scope.row)">跟踪发货</el-button>
	          </el-space>
	        </template>
	    </el-table-column>
		</template>
	  </GlobalTable>
	  
	</el-row>
	<el-dialog v-model="dialogVisible" title="确认信息" width="50%" center >
	     <div style="width:100%;text-align:center">请选择忽略此异常或是重新同步</div>
	  <template #footer>
	    <span class="dialog-footer">
	      <el-button @click="ignoreShipmentWarn()">忽略异常</el-button>
	      <el-button type="primary" @click="refreshShipmentRec()" >重新同步</el-button >
	    </span>
	  </template>
	</el-dialog>
	<TransInfoDailog ref="transInfoDailog"></TransInfoDailog>
	<AsyncDailog ref="asyncDailog" @change="loadTable"></AsyncDailog>
</template>

<script>
	import { ref,reactive,onMounted ,inject} from 'vue'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentApi from '@/api/amazon/inbound/shipmentApi.js';
	import {ElMessage } from 'element-plus'
	import { useRoute,useRouter } from 'vue-router'
	import {format,dateFormat,dateTimesFormat} from '@/utils/index';
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import {Refresh,CircleClose,WarningFilled,Ship} from '@element-plus/icons-vue'
	import TransInfoDailog from "./transinfo"
	import AsyncDailog from './asyncdailog.vue'
	import {tranStatus,tranStatusType} from "@/hooks/erp/shipment/shipment_status.js"
	export default{
		name:'Table',
		components:{
			GlobalTable,Refresh,ElMessage,CircleClose,TransInfoDailog,WarningFilled,AsyncDailog,Ship
		},
		setup(props){
			const emitter = inject("emitter");
			let router = useRouter()
			let tableData=reactive({records:[],total:0})
			let orderStatus =ref("")
			let parmashead = ref({})
			let dialogVisible=ref(false);
			let transInfoDailog=ref(TransInfoDailog);
			let asyncDailog=ref(AsyncDailog);
			let globalTable=ref(GlobalTable);
			let optShipmentid="";
			function refreshShipmentDialog(shipmentid){
				optShipmentid=shipmentid;
				dialogVisible.value=true;
			}
			function showSyncDailog(row){
				let params={};
				params.shipmentid=row.shipmentid;
				params.groupid=row.groupid;
				params.marketplaceid=row.marketplaceid;
				asyncDailog.value.showDailog(params);
			}
			function ignoreShipmentWarn(){
				shipmentApi.ignoreShipment({'shipmentid':optShipmentid}).then(res=>{
					ElMessage({
					   message: '忽略成功！',
					   type: 'success'
					 });
					 if(dialogVisible.value){
						 dialogVisible.value=false;
					 }
					 globalTable.value.loadTable();
				})
			}
			function getshipmentData(params){
				parmashead.value=params;
				globalTable.value.loadTable();
			}
			function showTransInfoDailog(row){ 
				transInfoDailog.value.loadTransDetialInfo(row.companyid,row.shipmentid,row.ordernum);
			}
			function loadTable(){
				globalTable.value.loadTable();
			}
			function loadtableData(params){
				params.groupid = parmashead.value.store;
				params.marketplaceid =parmashead.value.country;
				params.warehouseid =parmashead.value.warehouse;
				if(parmashead.value.start!==undefined){
					params.fromdate = parmashead.value.start;
					params.enddate =parmashead.value.end;
				}else{
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					params.fromdate =dateFormat(start);
					params.enddate =dateFormat(end);
				}
				params.auditstatus = parmashead.value.orderStatus;
				if(parmashead.value.seachtype!==undefined){
					params.searchtype =parmashead.value.seachtype;
				}else{
					params.searchtype ="sku";
				}
				params.search = parmashead.value.searchwords;
				params.company =parmashead.value.company;
				params.channel= parmashead.value.channel;
				params.transtype =parmashead.value.transtype;
				params.hasexceptionnum=parmashead.value.hasexceptionnum;
				shipmenthandlingApi.getshipList(params).then((res)=>{
					tableData.records = res.data.records
					tableData.total =res.data.total
				})
			}
	        function refreshShipmentRec(shipmentid){
				if(!shipmentid&&optShipmentid){
					shipmentid=optShipmentid;
				}
				shipmentApi.refreshShipmentRec({'shipmentid':shipmentid}).then(res=>{
					ElMessage({
					   message: '同步成功！',
					   type: 'success'
					 });
					 if(dialogVisible.value){
						 dialogVisible.value=false;
					 }
					 globalTable.value.loadTable();
				})
			}
			//跟踪货件
			function shipmentfollow(row){
				emitter.emit("removeCache", "发货流程"+row.shipmentid);
				router.push({
					path:'/shipment_handing/shipstep',
					query:{
					  shipmentid:row.shipmentid,
					  title:"发货流程"+row.shipmentid,
					  path:'/shipment_handing/shipstep',
					}
				})
			}
			function toFormApprove(row){
				router.push({
					path: '/shipmentdetails',
					query: {
						id: row.planid,
						title: "货件详情",
						path: '/shipmentdetails',
					}
				})
			}
		 
			return{
				tableData,shipmentfollow,getshipmentData,dateFormat,globalTable,
				tranStatus,orderStatus,parmashead,loadtableData,
				tranStatusType,refreshShipmentRec,dialogVisible,refreshShipmentDialog,
				ignoreShipmentWarn,showTransInfoDailog,transInfoDailog,toFormApprove,
				showSyncDailog,asyncDailog,loadTable,dateTimesFormat,
			}
		}
	}
</script>

<style>
	.sku{
		cursor:pointer;
	}
	.text-gray{
		color:#999;
	}
</style>
