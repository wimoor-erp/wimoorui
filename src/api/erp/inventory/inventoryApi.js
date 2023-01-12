import request from "@/utils/request";
 function getInventoryByMaterialSKU(data){
 	 return request.get("/erp/api/v1/inventory/getInventoryByMaterialSKU",{params:data})
 }
 function getInventoryByMaterial(data){
 	 return request.get("/erp/api/v1/inventory/getInventoryByMaterial",{params:data})
 }
 function list(data){
 	 return request.get("/erp/api/v1/inventory/list",{params:data})
 }
 function getInventory(data){
 	 return request.get("/erp/api/v1/inventory/getInventory",{params:data})
 }

 
 export default{
 	getInventoryByMaterialSKU,getInventoryByMaterial,list,getInventory
 }