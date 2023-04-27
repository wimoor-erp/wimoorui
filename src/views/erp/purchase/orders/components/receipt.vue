<template>
	<el-dialog :title="operateType.dialogTitle" v-model="dialogVisable" width="60%">
	
		<div  class="product-box">
			<el-image v-if="queryParams.entry.image" :src="queryParams.entry.image" class="img-40"  width="40" height="40"  ></el-image>
			<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="img-40"  width="40" height="40"  ></el-image>
			<div>
				<p class="name">{{queryParams.entry.mname}}</p>
				<p class="sku">{{queryParams.entry.sku}}</p>
			</div>
		</div>
		 <el-tabs
		    v-model="activeName"
		    type="card"
		    @tab-change="handleClick"
		  >
		    <el-tab-pane :label="operateType.tabsType" name="1">
				<el-row class="m-t-32">
					<el-col :span="12">
					<el-form label-width="100px">
						<el-form-item :label="operateType.warehouseType">
							 <Warehouse ref="warehouseRef" @changeware="getWarehouse" :defaultid="warehouseid"
							   warehouseType="self_usable" defaultValue="only" />
						</el-form-item>
						<el-form-item :label="operateType.tabsType+'数量'">
							<el-input
							v-model="formData.amount" @input="formData.amount=CheckInputInt(formData.amount)">
							</el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input v-model="formData.remark"  :rows="2"
								type="textarea"></el-input>
						</el-form-item>
						<el-form-item >
						<el-button type="primary" v-if="queryParams.entry.inwhstatus==0" @click.stop="receive" >提交{{operateType.tabsType}}</el-button>
						<el-button type="primary" v-if="queryParams.entry.inwhstatus==1" disabled >提交{{operateType.tabsType}}</el-button>
						</el-form-item>
					</el-form>
					</el-col>
					<!-- v-if="operateType.tabsType=='收货'" -->
					<el-col  :span="12" class="text-center">
						 <el-progress type="dashboard" v-if="recMap.entry.amount>0" :percentage="myformatFloat(recMap.entry.totalin/recMap.entry.amount*100)">
						       <template #default="{ percentage }">
						         <p class="font-large font-bold">{{ percentage }}%</p>
						         <span class="font-extraSmall">收货进度</span>
						       </template>
						     </el-progress>
							 <div>
								 <el-space  :spacer="spacer">
									 <span v-if="recMap.entry.amount>=recMap.entry.totalin">{{recMap.entry.amount-recMap.entry.totalin}}<p class="font-extraSmall">待收货</p></span>
									  <span v-else><span style="color: #ff0f47;">已超收{{recMap.entry.totalin-recMap.entry.amount}}</span><p class="font-extraSmall">待收货</p></span>
									 <span>{{recMap.entry.totalin}}<p class="font-extraSmall">已收货</p></span>
								 </el-space>
							 </div>
					</el-col>
			</el-row>
			</el-tab-pane>
		    <el-tab-pane :label="operateType.tabsType+'记录'" name="2">
				<!-- 到货记录 -->
			     <ArrivalRecord @change="changeDelete" ref="arrRecordRef" />
			</el-tab-pane>
			<el-tab-pane label="物流信息" name="3">
				<!-- 物流信息 -->
				<LogisticsRecord ref="logisticsRef" />
			</el-tab-pane>	
		  </el-tabs>
		  <template #footer>
			  <el-button @click="dialogVisable=false">关闭</el-button>
			  <el-button type="primary" v-if="queryParams.entry.inwhstatus==0" @click="stopReceive" plain>结束收货</el-button>
			  <el-button type="primary" v-if="queryParams.entry.inwhstatus==1" @click="startReceive" plain>继续收货</el-button>
		  </template>
	</el-dialog>
</template>

<script setup>
	import {h, ref,reactive,onMounted,watch,inject,toRefs,defineExpose} from 'vue'
	import { ElDivider,ElMessage, ElMessageBox } from 'element-plus';
	import NullTransform from"@/utils/null-transform";
	import ArrivalRecord from "./arrival_record.vue";
	import LogisticsRecord from "./logistics_record.vue";
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import Warehouse from '@/components/header/warehouse.vue';
	import {CheckInputFloat,CheckInputInt,dateFormat,dateTimesFormat,formatFloat} from '@/utils/index';
	const emit = defineEmits(['change']);
	const spacer = h(ElDivider, { direction: 'vertical'});
	const warehouseRef=ref();
	const arrRecordRef=ref();
	const logisticsRef=ref();
	const state = reactive({
		operateType:{
			dialogTitle:'',
			warehouseType:'',
			tabsType:''
		},
		dialogVisable:false,
		activeName:'1',
		// 查询参数
		queryParams: {
			entry:{totalin:0},
		} ,
		formData:{
			amount:"",
			remark:"",
		},
		warehouseid:null,
		recMap:{
			entry:{},
		},
		
	})
	const {
		activeName,
		dialogVisable,
		queryParams,
		operateType,
		formData,
		logisticsData,
		recMap,
		warehouseid,
	}=toRefs(state)
    function myformatFloat(value){
		if(value){
			return formatFloat(value);
		}else{
			return 0;
		}
	}
	function loadDetail(ftype){
		purchaselistApi.getRecdetail({"id":state.queryParams.entry.id,"ftype":"rec","paytype":"in"}).then((res)=>{
			if(res.data){
				state.recMap=res.data;
				if(ftype=="delete"){
					state.queryParams.entry.totalin=res.data.entry.totalin;
					state.queryParams.entry.inwhstatus=res.data.entry.inwhstatus;
					state.queryParams.entry.auditstatus=res.data.entry.auditstatus;
				}
			}
		});
	}
	function receive(){
		if(state.queryParams.entry.inwhstatus==1){
			ElMessage({
			  type: 'error',
			  message: '当前收货状态已完结！',
			})
			return;
		}
		var data={};
		data.recid=null;
		data.remark=state.formData.remark;
		data.amount=state.formData.amount;
		data.warehouseid=state.warehouseid;
		data.status="0";
		data.entryid=state.queryParams.entry.id;
		if(state.operateType.tabsType=="收货"){
			data.ftype="in";
		}else if(state.operateType.tabsType=="退货"){
			data.ftype="out";
		}
		if(state.formData.amount==null||state.formData.amount==undefined||
		state.formData.amount==""||parseFloat(state.formData.amount)<=0){
				ElMessage({
				  type: 'error',
				  message: '操作数量不能小于等于0！',
				})	
				return;
		 }
		 
		if(data.ftype=="out"){
			if(state.recMap.entry.totalin<state.formData.amount){
				ElMessage({
				  type: 'error',
				  message: '当前退货数量大于已经入库数量,不能继续操作！',
				})	
				return;
			}
		}
		purchaselistApi.receive(data).then((res)=>{
			if(res.data){
				ElMessage({
				  type: 'success',
				  message: '收货成功',
				})
				state.recMap=res.data;
				state.queryParams.entry.totalin=res.data.entry.totalin;
				state.queryParams.entry.inwhstatus=res.data.entry.inwhstatus;
				state.queryParams.entry.auditstatus=res.data.entry.auditstatus;
				emit("change");
				if(res.data.entry.inwhstatus==1){
					state.dialogVisable=false;
				}
			}
		});
	}
	function getWarehouse(val){
		state.warehouseid=val;
	}
	function show(type,entry){
		state.activeName="1";
		state.queryParams.entry=entry;
		if(type=="rec"){
			state.operateType.dialogTitle = "采购收货"
			state.operateType.warehouseType = "入库仓库"
			state.operateType.tabsType  ="收货"
		}else{
			state.operateType.dialogTitle = "采购退货"
			state.operateType.warehouseType = "出库仓库"
			state.operateType.tabsType  ="退货"
		}
		loadDetail();
		state.dialogVisable = true;
		state.warehouseid=entry.warehouseid;
		if(warehouseRef && warehouseRef.value){
			warehouseRef.value.warehouseid=entry.warehouseid;
		}
	}
	//结束收货
	function stopReceive(){
		ElMessageBox.confirm(
			'请确认是否结束收货？',
			{
			  confirmButtonText: '确认',
			  cancelButtonText: '取消',
			  type: 'warning',
			  callback:(action)=>{
				 if(action=="confirm"){
					 var data={};
					 data.recid=null;
					 data.remark=null;
					 data.amount=0;
					 data.warehouseid=state.warehouseid;
					 data.status="1";
					 data.entryid=state.queryParams.entry.id;
					 data.ftype="in";
					 purchaselistApi.receive(data).then((res)=>{
					 	if(res.data){
					 		ElMessage({
					 		  type: 'success',
					 		  message: '操作成功',
					 		})
					 		state.recMap=res.data;
					 		state.queryParams.entry.totalin=res.data.entry.totalin?res.data.entry.totalin:0;
					 		state.queryParams.entry.inwhstatus=res.data.entry.inwhstatus;
					 		state.queryParams.entry.auditstatus=res.data.entry.auditstatus;
					 		emit("change");
					 		state.dialogVisable=false;
					 	}
					 });
					  
				 }
			  }
			}
		  )
	}
	function changeDelete(){
		loadDetail("delete");
		emit("change");
	}
	function startReceive(){
		var data={};
		data.recid=null;
		data.remark=null;
		data.amount=0;
		data.warehouseid=state.warehouseid;
		data.status="2";
		data.entryid=state.queryParams.entry.id;
		data.ftype="in";
		purchaselistApi.receive(data).then((res)=>{
			if(res.data){
				ElMessage({
				  type: 'success',
				  message: '操作成功',
				})
				state.recMap=res.data;
				state.queryParams.entry.totalin=res.data.entry.totalin;
				state.queryParams.entry.inwhstatus=res.data.entry.inwhstatus;
				state.queryParams.entry.auditstatus=res.data.entry.auditstatus;
				emit("change");
				//state.dialogVisable=false;
			}
		});
	}
	function handleClick(val){
		if(val=="2"){
			arrRecordRef.value.show(state.queryParams.entry.id,state.operateType.tabsType);
		}
		if(val=="3"){
			logisticsRef.value.show(state.queryParams.entry.id);
		}
	}
	defineExpose({
		show,
	})
</script>

<style scoped="scoped">
.m-b-16{
		margin-bottom: 16px;
	}
.product-box{
	display: flex;
	margin-bottom: 24px;
}	
.product-box .el-image{
	margin-right: 16px;
}
.product-box .name{
font-size: 12px;
margin-bottom:8px;
}
.product-box .sku{
font-size: 12px;
color:var(--el-color-blue)
}
.m-t-32{
	margin-top: 32px;
}
.m-t-16{
	margin-top:16px;
}
.img-40{width: 40px;
height: 40px;flex: none;
margin-right: 8px;}
</style>
