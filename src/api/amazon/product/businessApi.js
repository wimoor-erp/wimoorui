import request from "@/utils/request";
 function getPageViewsList(data){
 	 return request.post("/amazon/api/v1/report/product/amzProductPageviews/getPageViewsList",data)
 }
 export default{
 	getPageViewsList
 }