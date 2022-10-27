import request from "@/utils/request";
function refreshShipmentRec(data){ 
	 return request.get('/amazon/api/v1/shipForm/refreshShipmentRec',{params:data});
}
function ignoreShipment(data){ 
	 return request.get('/amazon/api/v1/shipForm/ignoreShipment',{params:data});
}
function getSyncList(data){ 
	 return request.get('/amazon/api/v1/shipForm/getSyncList',{params:data});
}
function shipLine(data){ 
	 return request.post('/amazon/api/v1/shipForm/shipLine',data);
}

export default{
	refreshShipmentRec,ignoreShipment,getSyncList,shipLine
}