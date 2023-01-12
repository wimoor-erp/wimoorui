import request from "@/utils/request";
 function getShipPlanList(data){
 	 return request.post("/amazon/api/v1/product/salesplan/getShipPlanModel",data)
 }
 function refreshDataByGroup(data){
 	 return request.get("/amazon/api/v1/product/salesplan/refreshDataByGroup",{params:data});
 }
 function save(data){
 	 return request.post("/amazon/api/v1/product/salesplan/shipItem/save",data);
 }
 function batch(data){
 	 return request.post("/amazon/api/v1/product/salesplan/shipItem/batch",data);
 }
 function remove(data){
 	 return request.delete("/amazon/api/v1/product/salesplan/shipItem/remove",{params:data});
 }
 function getExpandCountryData(data){
	  return request.get("/amazon/api/v1/product/salesplan/getExpandCountryData",{params:data});
 }
 function getSummary(data){
 	  return request.get("/amazon/api/v1/product/salesplan/shipItem/getSummary",{params:data});
 }
 function clear(data){
 	  return request.get("/amazon/api/v1/product/salesplan/shipItem/clear",{params:data});
 }
 function list(data){
 	  return request.get("/amazon/api/v1/product/salesplan/shipItem/list",{params:data});
 }
 function subsplit(data){ 
 	  return request.post("/amazon/api/v1/product/salesplan/shipItem/subsplit",data);
 }
 function batchList(data){
 	  return request.get("/amazon/api/v1/product/salesplan/shipItem/getBatchList",{params:data});
 }
 export default{
 	getShipPlanList,
	refreshDataByGroup,
	getExpandCountryData,save,remove,getSummary,clear,list,batch,batchList,subsplit
 }