import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
 function findFBA(data){
 	 return request.get("/amazon/api/v0/inventry/findFBA",{params:data})
 }
 function syncInventorySupply(data){
	 return request.get("/amazon/api/v0/inventry/syncInventorySupply",{params:data})
 }
 function getInventorySupply(data){
 	 return request.get("/amazon/api/v0/inventry/getInventorySupply",{params:data})
 }
 function findEUFBA(data){
 	 return request.get("/amazon/api/v0/inventry/findEUFBA",{params:data})
 }
 function list(data){
 	 return request.get("/amazon/api/v1/inventoryRpt/list",{params:data})
 }
 function updateStockByChange(data){
 	 return request.get("/amazon/api/v1/skucycle/updateStockByChange",{params:data})
 }
 function planninglist(data){
 	 return request.post("/amazon/api/v1/inventoryRpt/planninglist", data)
 }
 function summaryPlanning(data){
 	 return request.post("/amazon/api/v1/inventoryRpt/summaryPlanning", data)
 }
 
 function downloadPlanList(data){
 	return request({url:"/amazon/api/v1/inventoryRpt/downloadPlanList",
 				                    responseType:"blob",
 									params:data,
 									method:'get'}).then(res => {
 											downloadhandler.downloadSuccess(res,"planningReport.xlsx")
 									}).catch(e=>{
 											downloadhandler.downloadFail(e);
 									}); 
 }

 
 
 export default{
 	findFBA,syncInventorySupply,getInventorySupply,findEUFBA,list,updateStockByChange,planninglist,downloadPlanList,
	summaryPlanning
 }