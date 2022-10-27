import request from "@/utils/request";
 function getInventoryByMaterialSKU(data){
 	 return request.get("/erp/api/v1/inventory/getInventoryByMaterialSKU",{params:data})
 }
 
 export default{
 	getInventoryByMaterialSKU
 }