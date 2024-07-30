<template>
	<el-steps
			:active="step"
			v-show="titles&&titles.length>0&&msg"
			finish-status="success"
		  >
			 <el-step v-for="(title,index) in titles" :title="index==step?title+msg:title" />
	</el-steps>
	<el-alert v-show="!titles&&msg" :title="msg" :type="msgtype" />
	
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs } from 'vue';
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	let state =reactive({ msg:"", msgtype:"warning",number:1, step:0,});
	let{msg,msgtype,step}=toRefs(state);
	let props = defineProps({titles:undefined });
	const {titles} = toRefs(props);
	const emit = defineEmits(['change']);
	function handleResult(data){
		if(data && data.operationStatus=='IN_PROGRESS'){
			 var timer=setTimeout(function(){
				  state.msg="处理中，进度:"+state.number;
				  state.msgtype="warning";
				  state.number++;
				 getOperatorStatus(data.operationid);
				 clearTimeout(timer);
			 },1200);
		}else if(data.operationStatus=="FAILED"){
						   state.msg=("操作失败！"+data.operationProblem);
						   state.msgtype="error";
						   emit("change",data);
		}else if(data.operationStatus=="SUCCESS"){
						  state.msgtype="success";
						  if(!props.titles){
							  state.msg="成功";
						  }
						  emit("change",data);
						  state.step=state.step+1;
		}
	}
	
	function getOperatorStatus(operationid){
		//查询操作是否成功
		shipmentplanApi.getOperationById({"operationid":operationid}).then((res)=>{
			handleResult(res.data);
		}).catch(()=>{
			  emit("change",{operationStatus:'FAILED'});
		});
	}	  
	
	function show(operationid,operation,step){
		    state.number=1;
			state.msg="处理中..";
			if(operationid&&operationid.operationid){
				state.step=operation;
				handleResult(operationid);
			}else if(operation&&typeof operation=="string"){
				    state.step=step;
					state.msg="提交状态加载中......";
					state.msgtype="warning";
					shipmentplanApi.getOperation({"formid":operationid,"operation":operation}).then((res)=>{
						if(res.data&&res.data.operationid){
						   getOperatorStatus(res.data.operationid);
						}else{
							state.msg="";
						}
					});
			}else if(operationid){
			   state.step=operation;
		 	   getOperatorStatus(operationid);
			}else{
				state.msg="提交中..";
			}
	}
	
	defineExpose({ show })
</script>

<style>
</style>