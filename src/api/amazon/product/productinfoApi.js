import request from "@/utils/request";
import axios from 'axios';
 function productList(data){
 	 return request.post("/amazon/api/v1/report/product/productInfo/productList",data)
 }
 function getOwnerList(data){
	 return request.get("/amazon/api/v1/report/product/productInfo/getOwnerList",{params:data})
 }
 function getProStatusList(data){
	 return request.get("/amazon/api/v1/report/product/productInfo/getProStatusList",{params:data})
 }
 function changeProPrice(data){
 	 return request.get("/amazon/api/v1/report/product/productInfo/changeProPrice",{params:data})
 }
 function updateRemark(data){
	  return request.get("/amazon/api/v1/report/product/productInfo/updateRemark",{params:data})
 }
 function ProductPriceLocked(data){
 	  return request.get("/amazon/api/v1/report/product/productInfo/ProductPriceLocked",{params:data})
 }
 function cancelProductPriceLocked(data){
 	  return request.get("/amazon/api/v1/report/product/productInfo/cancelProductPriceLocked",{params:data})
 }
 function priceQueue(data){
 	  return request.post("/amazon/api/v1/report/product/productInfo/priceQueue",data)
 }
 function getDim(data){
 	  return request.get("/amazon/api/v1/report/product/productInfo/getDim",{params:data})
 }
 
 
 export default{
 	productList,getOwnerList,getProStatusList,changeProPrice,updateRemark,ProductPriceLocked,
	cancelProductPriceLocked,priceQueue,getDim
 }