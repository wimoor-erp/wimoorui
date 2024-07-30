<template>
	<el-dialog
	title="物流信息修改"
	v-model="visible"
	width="30%"
	
	>
 <el-descriptions class="margin-top"  :column="1"  border  >
	<el-descriptions-item>
	  <template #label>
	    <div class="cell-item">
	      物流公司
	    </div>
	  </template>
	<el-select  style="margin-left: 5px;" filterable v-model="companyid" :disabled="needDisabled" @change="companyChange()">
		<el-option  v-for="company in companylist"   :key="company.id"  :label="company.name" :value="company.id"   >
		</el-option>
	</el-select>
	</el-descriptions-item>
	<el-descriptions-item>
	  <template #label>
	    <div class="cell-item">
	      物流渠道
	    </div>
	  </template>
	<el-select  v-model="channelid" filterable  :disabled="needDisabled" style="margin-left: 5px;">
		<el-option  v-for="chan in channellist"   :key="chan.id"  :label="chan.channame" :value="chan.id"   >
		</el-option>
	</el-select>
	</el-descriptions-item>
	<el-descriptions-item>
	  <template #label>
	    <div class="cell-item">
	      操作
	    </div>
	  </template>
	<el-button :disabled="needDisabled" @click="saveTrans" type="primary">保存</el-button>
	</el-descriptions-item>
	</el-descriptions>
	
	<template #footer>
		<el-button @click="visible=false">关闭</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
		import { ref,reactive,onMounted,toRefs,nextTick } from 'vue';
		import { ElMessage,ElMessageBox } from 'element-plus';
		import transportationApi from '@/api/erp/ship/transportationApi.js';
		import shipmentTransportationApi from '@/api/erp/shipv2/shipmentTransportationApi.js';
	 const emit = defineEmits(["change"]);
	let state =reactive({
		visible:false,
		planData:{},
		companyid:"",
		channelid:"",
		channellist:[],
		companylist:[],
		needDisabled:false,
		 
	})
	let{companyid,channelid,channellist,companylist,planData,needDisabled,visible}=toRefs(state);
	function companyChange(){
				transportationApi.getChannel({"company":state.companyid,"marketplaceid":state.planData.marketplaceid,"transtype":""}).then((res)=>{
					state.channelid="";
					if(res.data&&res.data.length>0){
						 state.channellist=res.data;
						 state.channelid=res.data[0].id;
						 if(state.planData.channelid){
							  state.channelid=state.planData.channelid;
						 }
					}else{
						state.channellist=[];
					}
				})
	}
	function saveTrans(){
			shipmentTransportationApi.saveTransCompany({
			"company":state.companyid,
			"channel":state.channelid,
			"shipmentid":state.planData.reallyShipmentid}).then(res=>{
					 ElMessage.success('保存成功！');
					 emit("change");
			});
	}
	
	function show(row){
		console.log(row);
		state.visible=true;
		state.planData=row;
		if(parseInt(state.planData.status)>5){
			state.needDisabled=true;
		}else{
			state.needDisabled=false;
		}
		transportationApi.getTranlist().then(res=>{
			 if(res.data&&res.data.length>0){
				 state.companylist=res.data;
				 state.companyid="";
				 if(state.planData.companyid){
					 state.companyid=state.planData.companyid;
					 companyChange();
				 }
			 }else{
				state.companylist=[];
			 }
		});
	}
	defineExpose({
		show
	})
</script>

<style>
</style>