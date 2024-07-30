
import request from "@/utils/request.js";
 
function saveInboundPlan(data){
	return request.post('/amazon/api/v2/shipInboundPlan/saveInboundPlan',data);
}
function approveInboundPlan(data){
	return request.get('/amazon/api/v2/shipInboundPlan/approveInboundPlan',{params:data });
}
function rejectInboundPlan(data){
	return request.get('/amazon/api/v2/shipInboundPlan/rejectInboundPlan',{params:data });
}
function getPlanList(data){
	return request.post('/amazon/api/v2/shipInboundPlan/getPlanList',data);
}
function getPlanInfo(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getPlanInfo',{params:data});
}
function savePackingInformation(data){
	return request.post('/amazon/api/v2/shipInboundPlan/savePackingInformation',data);
}

function getBoxDetail(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getBoxDetail',{params:data});
}
function changeInboundPlan(data){
	return request.post('/amazon/api/v2/shipInboundPlan/changeInboundPlan',data);
}
function cancelInboundPlan(data){
	return request.get('/amazon/api/v2/shipInboundPlan/cancelInboundPlan',{params:data});
}

function changeAddress(data){
	return request.get('/amazon/api/v2/shipInboundPlan/changeAddress',{params:data});
}
function updatePlanItem(data){
	return request.post('/amazon/api/v2/shipInboundPlan/updatePlanItem',data);
}
function confirmInboundPlan(data){
	return request.get('/amazon/api/v2/shipInboundPlan/confirmInboundPlan',{params:data});
}
function getOperation(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getOperation/ignoreRepeat',{params:data});
}

function getOperationById(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getOperationById/ignoreRepeat',{params:data});
}
function getApproveInvParam(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getApproveInvParam',{params:data});
}
function setApproveInvDone(data){
	return request.get('/amazon/api/v2/shipInboundPlan/setApproveInvDone',{params:data});
}
function setInvStatus(data){
	return request.get('/amazon/api/v2/shipInboundPlan/setInvStatus',{params:data});
}
function shippedInboundPlan(data){
	return request.get('/amazon/api/v2/shipInboundPlan/shippedInboundPlan',{params:data});
}
function getInvParam(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getInvParam',{params:data});
}
function outBoundShipInventory(data){
	return request.post('/erp/api/v2/shipForm/outBoundShipInventory',data);
}
function outShipInventory(data){
	return request.post('/erp/api/v2/shipForm/outShipInventory',data);
}
function updateDisable(data){
	return request.post('/erp/api/v2/shipForm/updateDisable',data);
}

function subFulfillable(data){
	return request.post('/erp/api/v2/shipForm/subFulfillable',data);
}

function guidance(data){
	return request.get('/amazon/api/v1/shipForm/guidance',{params:data});
}

function getItemlistByFormId(data){
	return request.get('/amazon/api/v2/shipInboundPlan/getItemlistByFormId',{params:data});
}


export default{
	 saveInboundPlan,approveInboundPlan,rejectInboundPlan,getPlanList,getPlanInfo,savePackingInformation,getBoxDetail,
	 changeInboundPlan,cancelInboundPlan,changeAddress,updatePlanItem,confirmInboundPlan,getOperation,getOperationById,
	 getApproveInvParam,setApproveInvDone,outBoundShipInventory,setInvStatus,shippedInboundPlan,getInvParam,outShipInventory,
	 guidance,subFulfillable,updateDisable,getItemlistByFormId
	 
}