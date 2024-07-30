<template>
	<el-row>
	  <GlobalTable ref="globalTable" 
	  :tableData="tableData"  
	  @loadTable="loadtableData" 
	  :defaultSort="{ prop: 'createdate,shipmentid', order: 'descending' }" 
	  :stripe="true" 
	  :nopage="nopage"
	   @selection-change = "selectChange"
	   height="calc(100vh - 300px)" 
	   style="width: 100%;margin-bottom:16px;">
	    <template #field>
		   <el-table-column type="selection" width="38" />
		   <el-table-column prop="orderNum" label="货件编码/货件名称" width='180'>
		      <template #default="scope">
			     <span class='sku' style="padding-right:3px;" @click="toFormApprove(scope.row)">{{scope.row.shipmentid}}</span>
				 <el-tooltip v-if="scope.row.referenceid"  >
					  <template #content>
					  <div >内部编码(Reference ID):{{scope.row.referenceid}}</div>
					  </template>
					 <el-icon  :size="15"class="pointer font-extraSmall text-green" style="vertical-align: middle;"><HelpFilled></HelpFilled></el-icon>
				 </el-tooltip>
				 
				 <el-tooltip v-else content="请填写内部编码:referenceid">
				 					 <el-icon  :size="15"class="pointer font-extraSmall text-gray" style="vertical-align: middle;"><HelpFilled></HelpFilled></el-icon>
				 </el-tooltip>
				  
				 <el-tooltip v-if="scope.row.tracknumber"  >
					 <template #content>
					       <div >跟踪编码:{{scope.row.tracknumber}}</div>
						   <div v-if="scope.row.traceupstatus==0">物流跟踪编码待处理</div>
						   <div v-if="scope.row.traceupstatus==1">物流跟踪编码已处理</div>
						   <div v-if="scope.row.traceupstatus==2">物流跟踪编码处理失败</div>
					  </template>
				 </el-tooltip>
				 <el-tooltip v-else content="请填写追踪编码">
				 	 <el-icon   :size="15"class="pointer font-extraSmall text-gray" style="vertical-align: middle;margin-left:5px;"><Van></Van></el-icon>
				 </el-tooltip>
				  
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
			      <div class="pointer"  @click="handleCountryChange(scope.row.marketplaceid)">{{scope.row.country}}</div>
				   <el-badge class="centerIditem" v-if="(scope.row.status<=5&&scope.row.status>=2)&&scope.row.centerNumber&&scope.row.centerNumber>'1'"   title="待出库货件在此配送中心个数" :value="scope.row.centerNumber" size="small" type="info">
				      <div class="text-gray pointer" @click="handleCenterChange(scope.row.centerId)" >
				      {{scope.row.centerId}}({{scope.row.countryCode}})  </div>
				    </el-badge>
					 <div  v-else class="text-gray pointer" @click="handleCenterChange(scope.row.centerId)"  >
					 {{scope.row.centerId}}({{scope.row.countryCode}})  </div>
			   </template>
		 </el-table-column>
		  <el-table-column prop="createdate" label="创建日期" width="175"  sortable="custom">
		  <template #default="scope">
		       <span >{{dateTimesFormat(scope.row.createdate)}}</span>
			  <p class="font-extraSmall" v-if="scope.row.arrivalTime">到货日期:
					  <el-tooltip  placement="top">
						   <template #content>
								 <div >发货日期:{{dateFormat(scope.row.status5date)}}
								 </div>
							</template>
						 <span>{{dateFormat(scope.row.arrivalTime)}} </span>
					  </el-tooltip>
					  <span v-if="scope.row.delayDays>0&&scope.row.status==5" style="padding-left:2px;">
					  <el-tooltip  placement="top">
					  					   <template #content>
					  					         <div >超期：{{scope.row.delayDays}} 天</div>
					  					    </template>
					      <el-icon  color="#F56C6C"><WarningFilled /></el-icon>
					  </el-tooltip>
					  </span>
			  </p>
		    </template>
		 </el-table-column> 
	    <el-table-column prop="skuamount" label="SKU个数" width="100"    sortable="custom">
					<template #default="scope">  
					 <div>{{scope.row.skuamount}} </div>
					 <div v-if="scope.row.areCasesRequired"><el-tag size="small">原装</el-tag></div>
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
			      <div class="table-edit-flex">{{scope.row.company}} 
				    <el-icon class="pointer" @click.stop="showTransEdit(scope.row)"><Edit ></Edit></el-icon>
				   </div>
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
			        <el-tag :type="tranStatusType(scope.row)" v-if="scope.row.status">{{tranStatus(scope.row)}}</el-tag>
				    <span v-if="(scope.row.status==5||scope.row.status==0)&&(scope.row.shipmentstatus!='状态异常')" 
					 @click="refreshShipmentRec(scope.row.shipmentid)"
					 style="padding-left:2px;cursor:pointer;color:#67C23A"> 
					 <el-icon><Refresh /></el-icon>
					 </span>
					 <span v-if="(scope.row.sumrec!=scope.row.sumshipped
					             &&scope.row.status==7
								 &&!scope.row.ignorerec)||(scope.row.shipmentstatus=='状态异常')"
					 @click="refreshShipmentDialog(scope.row.shipmentid)"
					 style="padding-left:2px;cursor:pointer;color:#F56C6C"> 
					<el-icon><CircleClose /></el-icon>
					</span>
				    <div v-if="scope.row.status>=5"><span class="font-extraSmall"> 已收货:</span>
				   			 <span class="font-extraSmall" v-if="scope.row.sumrec==scope.row.sumshipped||scope.row.ignorerec">{{scope.row.sumrec}}</span>
				   			 <span style="color:#F56C6C" v-else>{{scope.row.sumrec}}</span>
				   	</div>
					<div v-if="scope.row.status>0&&scope.row.status<5&&scope.row.checkinv&&scope.row.checkinv.length>5" class="font-extraSmall text-green">
						 <el-button :type="scope.row.tagtype" :title="'已下架，下架ID:'+scope.row.checkinv" @click="handleSearchCheckInv(scope.row)" link>可拣货</el-button>
					</div>
			   </template> 
			</el-table-column>    
		   <el-table-column prop="remark" label="备注"  >
			   <template #default="scope">
			      <div class="table-edit-flex">{{scope.row.remark}} 
			   				    <el-icon class="pointer" @click.stop="showRemarkEdit(scope.row)"><Edit ></Edit></el-icon>
			   				   </div>
							   
			   </template> 
			 </el-table-column>  
	    <el-table-column prop="operate" label="操作"  width="180"   >
	        <template #default="scope">
				<el-space>
					<el-button type="primary" link v-if="scope.row.status==3 && !scope.row.boxtime"  @click="shipmentfollow(scope.row,1)">装箱打标</el-button>
					<el-button type="warning" link v-else-if="scope.row.status==3 && scope.row.boxtime"  @click="shipmentfollow(scope.row,1)">装箱打标</el-button>
					<el-button type="success" link v-else-if="scope.row.status==4"  @click="shipmentfollow(scope.row,1)">装箱打标</el-button>
					<el-button type="info" link v-else  @click="shipmentfollow(scope.row,1)">装箱打标</el-button>
					
					<el-button type="primary" v-if="scope.row.status==5" link   @click="shipmentfollow(scope.row,2)">物流出库</el-button>
					<el-button type="info" link v-else   @click="shipmentfollow(scope.row,2)">物流出库</el-button>
				</el-space>
	            <el-space style="padding-top:10px">
					<el-button type="primary" v-if="scope.row.status==6" link   @click="shipmentfollow(scope.row,3)">海关申报</el-button>
					<el-button type="info" link v-else   @click="shipmentfollow(scope.row,3)">海关申报</el-button>
					<el-button type="primary" v-if="scope.row.status>=7" link   @click="shipmentfollow(scope.row,4)">接收详情</el-button>
					<el-button type="info" link v-else   @click="shipmentfollow(scope.row,4)">接收详情</el-button>
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
	<el-dialog v-model="remarkVisible" title="编辑备注" width="30%"   >
		 <el-input v-model="localRow.remark" placeholder="请输入备注" ></el-input>
		  <template #footer>
			<el-button @click="updateShipmentRemark" type="primary" style="margin-right: 10px;">确认</el-button>
		  	<el-button @click="remarkVisible=false">关闭</el-button>
		  </template>
	</el-dialog>
	<el-dialog v-model="referenceidVisible" :title="editRow.shipmentid+' 提交后台内部编码(reference ID)'" width="50%" center >
	    <el-input v-model="editRow.referenceidEdit"></el-input>
	  <template #footer>
	    <span class="dialog-footer">
	      <el-button @click="referenceidVisible=false">关闭</el-button>
	      <el-button type="primary" @click="submitShipmentReferenceid()" >提交</el-button >
	    </span>
	  </template>
	</el-dialog>
	<TransInfoDailog ref="transInfoDailog"></TransInfoDailog>
	<AsyncDailog ref="asyncDailog" @change="loadTable"></AsyncDailog>
	
	    <ShipDetail ref="shipDetailRef" @change="shipChange" ></ShipDetail>
	<Trans ref="transRef" @change="loadTable" ></Trans>
</template>

<script setup>
	import { ref,reactive,onMounted ,inject,toRefs} from 'vue'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
	import shipmentApi from '@/api/erp/shipv2/shipmentPlacementApi.js';
	import {ElMessage } from 'element-plus'
	import { useRoute,useRouter } from 'vue-router'
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import GlobalTable from "@/components/Table/GlobalTable/index.vue";
	import {Refresh,CircleClose,WarningFilled,Ship,HelpFilled,Van,Edit} from '@element-plus/icons-vue'
	import TransInfoDailog from "./transinfo.vue"
	import ShipDetail from "@/views/erp/shipv2/shipment_handing/shipstep/index.vue";
	import Trans from "@/views/erp/shipv2/shipment_add/shipstep/components/trans.vue";
	import AsyncDailog from './asyncdailog.vue'
	import {tranStatus,tranStatusType} from "@/hooks/erp/shipment/shipment_status.js"
	const emitter = inject("emitter");
	const emit = defineEmits(["change"]);
	let props = defineProps({
							   nopage:undefined,
	                       });
	const { nopage,} = toRefs(props);
	let router = useRouter()
	let tableData=reactive({records:[],total:0})
	let orderStatus =ref("")
	let parmashead = ref({})
	const shipDetailRef=ref();
	const transRef=ref();
	let editRow=ref({});
	let dialogVisible=ref(false);
    let remarkVisible=ref(false);
	let referenceidVisible=ref(false);
	let transInfoDailog=ref(TransInfoDailog);
	let asyncDailog=ref(AsyncDailog);
	let globalTable=ref(GlobalTable);
	let optShipmentid="";
	let localRow=ref({});
	function refreshShipmentDialog(shipmentid){
		optShipmentid=shipmentid;
		dialogVisible.value=true;
	}
	function handleSearchCheckInv(row){
		  parmashead.value.checkinv=row.checkinv;
		  loadTable()
	}
	function showSyncDailog(row){
		let params={};
		params.shipmentid=row.shipmentid;
		params.groupid=row.groupid;
		params.marketplaceid=row.marketplaceid;
		asyncDailog.value.showDailog(params);
	}
	 
	var oldcheckinv={};
	
	function getshipmentData(params){
		parmashead.value=params;
		parmashead.value.checkinv="";
		oldcheckinv={};
		globalTable.value.loadTable();
	}
	function showTransInfoDailog(row){ 
		transInfoDailog.value.loadTransDetialInfo(row.companyid,row.shipmentid,row.ordernum);
	}
	function loadTable(){
		globalTable.value.loadTable();
	}
	function handleCenterChange(centerid){
		parmashead.value.fbacenter=centerid;
		loadTable();
	}
	function handleCountryChange(marketplaceid){
		parmashead.value.country=marketplaceid;
		loadTable();
	}
	function loadtableData(params){
		params.groupid = parmashead.value.store;
		params.marketplaceid =parmashead.value.country;
		params.warehouseid =parmashead.value.warehouse;
		params.formid=parmashead.value.formid;
		params.fbacenter=parmashead.value.fbacenter;
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
		params.checkdown=parmashead.value.checkdown;
		params.checkinv=parmashead.value.checkinv;
		params.areCasesRequired=parmashead.value.areCasesRequired;
		params.hasexceptionnum=parmashead.value.hasexceptionnum;
		params.hasreferenceid=parmashead.value.hasreferenceid;
		var tagtypes=["primary","success","info","warning","danger"];
		shipmentApi.list(params).then((res)=>{
			var indexv=0;
			res.data.records.forEach(itemv=>{
				if(oldcheckinv[itemv.checkinv]==undefined){
					indexv=(indexv+1)%5;
					itemv.tagtype=tagtypes[indexv];
					oldcheckinv[itemv.checkinv]=indexv;
				}else{
					itemv.tagtype=tagtypes[oldcheckinv[itemv.checkinv]];
				}
			});
			tableData.records = res.data.records;
			tableData.total =res.data.total;
		})
	}

	function showReferenceidDailog(row){
		referenceidVisible.value=true;
		editRow.value=row;
		editRow.value.referenceidEdit=editRow.value.referenceid;
	}
 
	//跟踪货件
	function shipmentfollow(row,step){
		shipDetailRef.value.show(row,step);
	}
	function toFormApprove(row){
		router.push({
			path: '/newshipmentdetails',
			query: {
				id: row.id,
				title: "新货件详情",
				path: '/newshipmentdetails',
			}
		})
	}
	
	function shipChange(){
		loadTable();
	}
	
   function selectChange(rows){
	   emit("change",rows);
   }
	function showTransEdit(row){
		transRef.value.show(row);
	}
	function showRemarkEdit(row){
		localRow.value=row;
		remarkVisible.value=true;
	}
	function updateShipmentRemark(){
		remarkVisible.value=false;
		shipmentApi.updateRemarkByShipment({"shipmentid":localRow.value.reallyShipmentid,"remark":localRow.value.remark}).then((res)=>{
			ElMessage.success("操作成功!");
			loadTable();
		});
	}
    defineExpose({getshipmentData});

</script>

<style>
	.ship-detail-dialog .el-dialog__body{
		padding:0px;
	}
	.centerIditem {
	 
	}
	.sku{
		cursor:pointer;
	}
	.text-gray{
		color:#999;
	}
</style>
<style scoped>
	.el-button+.el-button{
		margin-left: 0px;
		margin-right:0px;
	}
</style>
