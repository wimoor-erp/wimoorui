<template>
	<div class="box-margin">
	<div class="pag-radius-bor mar-bot" >
	<div class="con-body " > 
	<Header ref="headerRef" ></Header>
	   <el-row>
		   <el-col :span="6">
		   <el-space>
			<el-icon  ><Location /></el-icon>发货地址
		   </el-space>
		   <div v-if="planData.address" style="margin-top: 10px;">
			   {{planData.address.addressline1}},{{planData.address.addressline2}},{{planData.address.stateorprovincecode}},{{planData.address.city}}
		   ,{{planData.address.districtorcounty}},{{planData.address.countrycode}},{{planData.address.postalcode}}
		   </div>
		   <div>
			   <el-link type="primary" @click="showAddressModal">选择其它地址</el-link>
		   </div>
		   </el-col>
		   <el-col :span="18">
		   <el-space>
		   	 <el-icon><Van /></el-icon>收货国家
		   </el-space>
		   <div style="margin-top: 10px;">
		   		{{planData.destination}} 
		   </div>
		   </el-col>
	   </el-row>	
		<el-divider></el-divider>
		<el-row>
			<el-table :data="planData.itemlist" border style="width: 100%;margin-bottom:16px;">
				<el-table-column prop="image" label="图片" width="70">
					<template #default="scope">
						<img :src="scope.row.image" @click.stop="handleToMaterial(scope.row)" style="width:40px;height:40px" />
					</template>
				</el-table-column>
				<el-table-column label="名称/SKU"  show-overflow-tooltip>
					<template #default="scope"> 
						<div class='name text-omit-1'>{{scope.row.name}}</div>
						<div class='sku'>{{scope.row.sku}} <el-tag v-if="scope.row.boxnum">单箱：{{scope.row.boxnum}}</el-tag>
						<span v-if="scope.row.prep&&scope.row.prep.prepInstructionList&&scope.row.prep.prepInstructionList.length>0">
							<el-tag style="margin-left:3px;" v-for="prepitem in scope.row.prep.prepInstructionList">
								 <span v-if="PrepInstruction[prepitem]" >{{PrepInstruction[prepitem]}}</span>
								 [{{prepitem}}]
							</el-tag>
						</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="invquantity" label="库存" width="100"   />
				<el-table-column prop="outbound" label="待出库" width="100"   />
				<el-table-column  label="信息/操作" width="120">
					<template #default="scope">
						 <div  ><el-link  type="primary" @click="showInfoDialog(scope.row)">预处理信息</el-link></div>
					</template>
				</el-table-column>
				<el-table-column  label="计划发货数量" prop="quantity" width="110"></el-table-column>
				<el-table-column  label="实际发货数量" width="120">
					<template #default="scope">
						<el-input :disabled="piceDisable" v-model.number="scope.row.confirmQuantity"></el-input>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<div>
			<el-row>
			<el-col :span="12" >
				<span>共{{itemcount}}条</span>
			</el-col>
			<el-col :span="4" >
				<span  ><span class="font-extraSmall">预处理费用和贴标费用总金额：</span>{{totalfee}}</span>
			</el-col>
			<el-col :span="8" >
					<Operation ref="operationRef" @change="handleOperationChange"></Operation>
			</el-col>
			
			</el-row>
		</div>
		<el-row style="margin-top: 10px;">
			<el-col :span="10">
				<el-row>
					<el-col :span="3">
						<el-button type="primary" v-if="planData.auditstatus!=12" @click="cancelPlan">取消计划</el-button>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="14" >
				<div class="pull-right">
					<el-button @click="handleShelf" style="margin-right: 10px;" :icon="ShoppingCart">下架SKU</el-button>
					  <el-dropdown split-button  @click.stop="openShipmentInfo('simple')" style="margin-right: 10px;">
						  <el-icon    > <document theme="outline" size="24" fill="#FF6700" :strokeWidth="3"/></el-icon>
						<span  >打印配货单(简洁版)</span>
						<template #dropdown>
						  <el-dropdown-menu>
							<el-dropdown-item @click.stop="openShipmentInfo('detail')">打印配货单(详细版)</el-dropdown-item>
							<el-dropdown-item @click.stop="openShipmentInfo('mobile')">打印配货单(移动版)</el-dropdown-item>
						  </el-dropdown-menu>
						</template>
					  </el-dropdown>
					  <el-dropdown split-button @click.stop="downloadLabel('excel')" style="margin-right: 10px;" >
							  <el-icon  > <printer theme="outline" size="24" fill="#FF6700" :strokeWidth="3"/></el-icon>
							<span    >打印所有SKU标签(Excel)</span>
							<template #dropdown>
							  <el-dropdown-menu>
								<el-dropdown-item @click.stop="downloadLabel('pdf')">打印所有SKU标签(PDF)</el-dropdown-item>
							  </el-dropdown-menu>
							</template>
					  </el-dropdown>
					  <el-space v-if="planData.auditstatus==2">
						   <el-button :loading="btnStatus.submitForm" v-if="piceDisable"  @click.stop="piceDisable=false">修改配货数量</el-button>
						  <el-button type="primary" :loading="btnStatus.submitForm"  v-else   @click.stop="submitForm">保存配货数量</el-button>
						  <el-button type="primary" :loading="btnStatus.submitStep" v-if="piceDisable"   @click.stop="submitStep" >完成配货</el-button>
						   <el-button type="primary" :loading="btnStatus.submitStep" v-else    :disabled="true" >完成配货</el-button>
					  </el-space>
					<el-space v-else>
							  <el-button type="primary" disabled="true">完成配货</el-button>
						  <el-button     @click.stop="toStep" >下一步</el-button>
					</el-space>
				</div>
			</el-col>
		</el-row>
	</div>
	</div>
	
	
	 <Footer  ref="footerRef"></Footer>
	</div>
	
	<el-dialog
	title="修改发货地址"
	v-model="addressVisiable"
	width="50%"
	
	>
	<GlobalTable :inDialog="true" ref="globalTable" :tableData="tableData"  @loadTable="loadTableData" :stripe="true"  style="width: 100%;margin-bottom:16px;">
		  <template #field>
		    <el-table-column type="selection" width="38" />
		    <el-table-column prop="name"  label="名称" sortable='custom' >
				<template #default="scope">
								<span>{{scope.row.name}}</span>
								&nbsp;&nbsp;&nbsp; <el-tag class="ml-2" v-if="scope.row.isdefault" type="info">默认</el-tag>  
				</template>
				
			</el-table-column>
		    <el-table-column prop="city"  label="所在发货地"  sortable='custom' />
			<el-table-column prop="addressline1" label="街道/详细地址" sortable='custom' >
			   <template #default="scope">
				<span>{{scope.row.addressline1}}</span>
				<span v-if="scope.row.addressline2">,{{scope.row.addressline2}}</span>
			  </template>
			</el-table-column>
		    <el-table-column prop="postalcode"  label="邮政编码"  sortable='custom' />
			<el-table-column prop="phone"  label="电话"  sortable='custom' />
			<el-table-column prop="operator"  label="操作人"  sortable='custom' />
	    </template>
	</GlobalTable>
	<template #footer>
		<el-button @click="addressVisiable=false"  >关闭</el-button>
		<el-button @click="changeAddress" type="primary">确认</el-button>
	</template>
	</el-dialog>
	
	<el-dialog
	title="预处理信息设置"
	v-model="operatorVisiable"
	width="30%"
	>
	 <el-form label-width="auto"  label-position="left">
		  <el-form-item   label="预备信息处理人">
			  <el-select :disabled="piceDisable" v-model="operatorRow.prepOwner">
				 <el-option value="SELLER" key="SELLER" label="卖家"></el-option> 
				 <el-option value="AMAZON" key="AMAZON" label="亚马逊"></el-option> 
			  </el-select>
		  </el-form-item>
		  <el-form-item   label="贴标人">
		  			  <el-select :disabled="piceDisable" v-model="operatorRow.labelOwner">
						  <el-option value="SELLER" key="SELLER" label="卖家"></el-option>
						  <el-option value="AMAZON" key="AMAZON" label="亚马逊"></el-option> 
					  </el-select>
		  </el-form-item>
		  <el-form-item   label="保质期">
				<el-date-picker :disabled="piceDisable"
					  v-model="operatorRow.expiration"
					  type="date"
					  placeholder="选择日期"
					/>
		  </el-form-item>
	 </el-form>
	<template #footer>
		<el-button @click="operatorVisiable=false" >关闭</el-button>
		<el-button @click="saveItem" :disabled="piceDisable" type="primary">确认</el-button>
	</template>
	</el-dialog>
	 <PlanCancel ref="planCancelRef" @change="handleStatusChange"></PlanCancel>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs } from 'vue';
	import { useRoute,useRouter } from 'vue-router';
	import {Location,Van,ShoppingCart,Printer,Document} from '@element-plus/icons-vue';
	import Footer from "./components/footer.vue";
	import Header from "./components/header.vue";
	import PlanCancel from "./components/planCancel.vue";
	import PlanCreate from "./components/planCreate.vue";
	import { ElMessage,ElMessageBox } from 'element-plus';
	import addressApi from '@/api/amazon/inbound/addressApi.js';
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import shipmentQuotaApi from '@/api/erp/shipv2/shipmentQuotaApi.js';
	import Operation from "./components/operation.vue";
	let router = useRouter();
	const planid=router.currentRoute.value.query.id;
	const footerRef=ref();
	const headerRef=ref();
	const globalTable=ref();
	const operationRef=ref();
	const planCancelRef=ref();
	const planCreateRef=ref();
	let state =reactive({
		planData:{}, 
		tableData:{records:[],total:0},
		step:0,
		piceDisable:true,
		itemcount:0,
		addressVisiable:false,
		operatorVisiable:false,
		operatorRow:null,
		btnStatus:{
			"submitForm":false,
			"submitStep":false,
			"number":1,
		},
		totalfee:0,
		
	})
	let{planData,step,piceDisable,itemcount,tableData,addressVisiable,operatorVisiable,operatorRow,btnStatus,totalfee}=toRefs(state);
	
	function loadData(){
		shipmentplanApi.getPlanInfo({"formid":planid}).then((res)=>{
			state.planData=res.data;
			state.itemcount=state.planData.itemlist.length;
			if(state.planData.auditstatus!=2){
				state.piceDisable=true;
			}
			headerRef.value.show(state.planData,0);
			footerRef.value.show(state.planData);
			if(state.planData.auditstatus>2&&state.planData.auditstatus<7){
			   operationRef.value.show(state.planData.id,"createInboundPlan");
			}
			loadGuidance();
		});
	}
	function handleStatusChange(status){
		if(status=="success"){
			loadData();
		}
	}
	function handleToMaterial(row){
		 router.push({
			path:'/material/details',
			query:{
			  title:"产品详情",
			  path:'/material/details',
			  details:row.materialid,
			}
		 })
	}
	
	function handleShelf(){
		router.push({
			path:'/erp/shipv2/quota',
			query:{
			  formid:state.planData.id,
			  title:"配货单下架",
			  path:'/erp/shipv2/quota',
			}
		})
	}
	
	function submitForm(){
		//确认配货数
		state.btnStatus.submitForm=true;
		state.piceDisable=true;
		state.planData.planitemlist=state.planData.itemlist;
		shipmentplanApi.changeInboundPlan(state.planData).then((res)=>{
			state.btnStatus.submitForm=false;
			if(res.data){
				ElMessage.success("确认配货数量成功！");
			}
		}).catch(()=>{
			state.btnStatus.submitForm=false;
		});
		
	}
	
	function cancelPlan(){
		ElMessageBox.confirm('确认取消此发货计划?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
		}).then(() => {
				planCancelRef.value.show(state.planData);
		}).catch(() => ElMessage.info('操作已取消'));
	}
	
	function openShipmentInfo(ftype){
		if(ftype=="mobile"){
			var path={path:"/shipment_handing/pehuo","query":{"shipmentid":state.planData.id, title:"配货单",path:"/shipment_handing/pehuo"}};
			router.push(path);
		}else{
			//下载pdf
			var formids=[];
			formids.push(state.planData.id+'');
			shipmentQuotaApi.downPDFShipForm(ftype,formids);
		}
	}
	
	function downloadLabel(ftype){
		if(ftype=='pdf'){
			shipmentQuotaApi.downPDFLabel({"formid":state.planData.id});
		}else{
			shipmentQuotaApi.downExcelLabel({"formid":state.planData.id});
		}
	}
	
	function loadTableData(params){
		if(!params){
			params={isdisable:""};
		}
		params.groupid=state.planData.amazongroupid;
		addressApi.getAddress(params).then((res)=>{
			state.tableData.records = res.data.records;
			state.tableData.total =res.data.total;
		})
	}
	
	function showAddressModal(){
		state.addressVisiable=true;
	}
	
	function changeAddress(){
	   var rows=globalTable.value.getSelectionRows();
	   if(rows && rows.length==1){
		   shipmentplanApi.changeAddress({"formid":state.planData.id,"addressid":rows[0].id}).then((res)=>{
			   state.addressVisiable=false;
			   ElMessage.success("操作成功！");
			   loadData();
		   });
	   }else{
		   ElMessage.warning("请正确选择地址！");
	   }
	}
	
	function showInfoDialog(row){
		state.operatorVisiable=true;
		state.operatorRow=JSON.parse(JSON.stringify(row));
	}
	
	function saveItem(){
		shipmentplanApi.updatePlanItem(state.operatorRow).then((res)=>{
			 ElMessage.success("操作成功！");
			 state.operatorVisiable=false;
			 loadData();
		});
	}
	function toStep(){
		var timer1=setTimeout(function(){
				router.push({
					path:'/e/s/s/two',
					query:{
					  id:state.planData.id,
					  title:"发货处理_装箱",
					  path:'/e/s/s/two',
					  replace:true
					}
				})		 
				clearTimeout(timer1);
		},500);
	}
	function handleOperationChange(data){
		//跳转路由至第二步
		if(data && data.operationStatus=="SUCCESS" && state.btnStatus.submitStep==true){
		   state.btnStatus.submitStep=false;
			var timer1=setTimeout(function(){
					router.push({
						path:'/e/s/s/two',
						query:{
						  id:state.planData.id,
						  title:"发货处理_装箱",
						  path:'/e/s/s/two',
						  replace:true
						}
					})		 
					clearTimeout(timer1);
			},500);
		}
		
	}
 
	function submitStep(){
		state.btnStatus.number=1;
		state.btnStatus.submitStep=true;
		shipmentplanApi.confirmInboundPlan({"formid":state.planData.id}).then((res)=>{
			if(res.data&&res.data.operationid){
				 ElMessage.warning("完成配货，同步亚马逊...");
				 operationRef.value.show(res.data.operationid);
			}else if(state.planData.invtype!="1"&&state.planData.invtype!=1){
				  ElMessage.warning("完成配货，同步亚马逊异常！");
			 	  state.btnStatus.submitStep=false;
			}else{
				 ElMessage.success("完成配货");
				  state.btnStatus.submitStep=false;
			}
		}).catch(()=>{
		   		 state.btnStatus.submitStep=false;
		});
		 
	}
	
	//预处理费用和贴标费用总金额
	function loadGuidance(){
	  var skulist="";
	  state.planData.itemlist.forEach(item=>{
		  skulist=skulist+item.sku+",";
	  });
	  shipmentplanApi.guidance({"groupid":state.planData.amazongroupid,
	  "marketplaceid":state.planData.marketplaceid,
						   "skulist":skulist}).then((res)=>{
			 var totalfee=0; 
			 var data=res.data.guidance;
			 var prepInstructions=res.data.prepInstructions;
			 state.planData.itemlist.forEach(item=>{
				  if(prepInstructions[item.sku] && prepInstructions[item.sku].amazonPrepFeesDetailsList &&
				  prepInstructions[item.sku].amazonPrepFeesDetailsList.length>0){
					 var fee= prepInstructions[item.sku].amazonPrepFeesDetailsList[0].feePerUnit.value;
					 totalfee=totalfee+fee; 
				  }
			 });
			 state.totalfee=totalfee;
			 // if(data&&data.skUInboundGuidanceList){
				//  data.skUInboundGuidanceList.forEach(function(items){
				// 	 if(items.sellerSKU==item.sku){
				// 		item.asin=items.asin;	
				// 		 if(items.inboundGuidance=="INBOUNDOK"){
				// 			 var msg="";
				// 			 if(items.guidanceReasonList){
				// 				 items.guidanceReasonList.forEach(reason=>{
				// 					 if(reason =="NOAPPLICABLEGUIDANCE"){
				// 						 msg=msg+"【无适用指南】";
				// 					 }else{
				// 						 msg=msg+"【库存足，销售慢】";
				// 					 }
				// 				 })
				// 			 }
				// 			 item.msg=msg;
				// 			 item.guidance="success";									  
				// 		 }else{
				// 			 item.guidance="error";
				// 		 }
						
				// 	 }
				//  })
			 // }
			 
		})
	}
	
	onMounted(()=>{
		loadData();
		
	})
</script>

<style scoped>
	.pull-right{
		float: right;
	}
	.mar-bot{
		font-size:14px;
	}
	.mar-bot{
		margin-bottom:16px;
	}
	.box-margin{
		padding:16px;
		min-height:calc(100vh - 36px)
	}
</style>
