import request from "@/utils/request";
 function salesLine(data){
 	 return request.post("/amazon/api/v1/report/order/salesLine",data)
 }
  
 export default{
 	salesLine
 }