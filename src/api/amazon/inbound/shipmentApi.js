import request from "@/utils/request";
function refreshShipmentRec(data){ 
	 return request.get('/amazon/api/v1/shipFormSync/refreshShipmentRec',{params:data});
}
function ignoreShipment(data){ 
	 return request.get('/amazon/api/v1/shipForm/ignoreShipment',{params:data});
}
function getSyncList(data){ 
	 return request.get('/amazon/api/v1/shipFormSync/getSyncList',{params:data});
}
function shipLine(data){ 
	 return request.post('/amazon/api/v1/shipForm/shipLine',data);
}
function updateTransInfo(data){
	return request.post('/amazon/api/v1/shipForm/updateTransInfo',data);
}
function getShipRecord(data){
	return request.get('/amazon/api/v1/shipInboundPlan/getShipRecord',{params:data});
}
function getShipRecordByMarket(data){
	return request.get('/amazon/api/v1/shipInboundPlan/getShipRecordByMarket',{params:data});
}

export default{
	refreshShipmentRec,ignoreShipment,getSyncList,shipLine,updateTransInfo,getShipRecord,getShipRecordByMarket
}