import request from "@/utils/request";
 function findFBA(data){
 	 return request.get("/amazon/api/v0/inventry/findFBA",{params:data})
 }
 function syncInventorySupply(data){
	 return request.get("/amazon/api/v0/inventry/syncInventorySupply",{params:data})
 }
 function getInventorySupply(data){
 	 return request.get("/amazon/api/v0/inventry/getInventorySupply",{params:data})
 }
 
 export default{
 	findFBA,syncInventorySupply,getInventorySupply
 }