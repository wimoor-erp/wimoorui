import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
function getShelfInventoryList(data){ 
	 return request.post('/erp/api/v1/warehoue/shelfInventory/getShelfInventoryList',data);
}
function getShelfInventoryStockingList(data){ 
	 return request.post('/erp/api/v1/warehoue/shelfInventory/getShelfInventoryStockingList',data);
}

function getShelfList(data){
	return request.post('/erp/api/v1/warehoue/shelfInventory/getShelfList',data)
}
function addShelfInventory(data){
	return request.post("/erp/api/v1/warehoue/shelfInventory/add",data)
}
function subShelfInventory(data){
	return request.post("/erp/api/v1/warehoue/shelfInventory/sub",data)
}
function shelfInventoryOptProList(data){
	return request.get("/erp/api/v1/warehouse/shelfInventoryOptPro/list",{params:data})
}
 function downloadList(data,callback){
 	  return request({url:"/erp/api/v1/warehoue/shelfInventory/downloadShelfInventoryStockingList",
 	                responseType:"blob",
 					data:data,
 					method:'post'}).then(res => {
 						downloadhandler.downloadSuccess(res,"shelfInventoryStockingList.xlsx");
 						if(callback){
 							callback();
 						}
 				}).catch(e=>{
 					    downloadhandler.downloadFail(e);
 						if(callback){
 							callback(e);
 						}
 				});;
 } 


export default{
	subShelfInventory,
	getShelfInventoryList,
	getShelfInventoryStockingList,
	getShelfList,
	addShelfInventory,
	shelfInventoryOptProList,
	downloadList,
}