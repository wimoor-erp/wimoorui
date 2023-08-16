import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
function getInboundItemBatchList(data){ 
	 return request.post('/amazon/api/v1/shipInboundItem/getInboundItemBatchList',data);
}
function findDetailByShipment(data){ 
	 return request.get('/amazon/api/v1/shipInboundItem/findDetailByShipment',{params:data});
}
function updateFeeByShipment(data){ 
	 return request.post('/amazon/api/v1/shipInboundItem/updateFeeByShipment',data);
}

 function downloadList(data,callback){
 	return request({url:"/amazon/api/v1/shipInboundItem/downloadList",
 				                    responseType:"blob",
 									data:data,
 									method:'post'}).then(res => {
 											downloadhandler.downloadSuccess(res,"downloadItemBatchList.xlsx")
 											if(callback){
 												callback();
 											}
 									}).catch(e=>{
 											downloadhandler.downloadFail(e);
 											if(callback){
 												callback();
 											}
 									}); 
 }




export default{
	 getInboundItemBatchList,findDetailByShipment,downloadList,updateFeeByShipment
}