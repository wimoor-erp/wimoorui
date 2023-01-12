import request from "@/utils/request";
 function updateOptMsku(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/updateOptMsku",{params:data})
 }
 function updateOptProfitId(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/updateOptProfitId",{params:data})
 }
 function getProRemarkHis(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/getProRemarkHis",{params:data})
 }
 function updateRemark(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/updateRemark",{params:data})
 }
 function updateOptStatus(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/updateOptStatus",{params:data})
 }
 function getOptStatusById(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/getOptStatusById",{params:data})
 }
 function findPriceById(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/findPriceById",{params:data})
 }
 function saveProductTags(data){
	 return request.get("/amazon/api/v1/report/product/productInOpt/saveProductTags",{params:data})
 }
 function findProductTags(data){
 	 return request.get("/amazon/api/v1/report/product/productInOpt/findProductTags",{params:data})
 }
 
 export default{
 	updateOptMsku,updateOptProfitId,getProRemarkHis,updateRemark,updateOptStatus,getOptStatusById,
	findPriceById,saveProductTags,findProductTags,
 }