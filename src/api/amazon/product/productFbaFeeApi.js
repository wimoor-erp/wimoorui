 import request from "@/utils/request";
 function getSizePro(data){
 	 return request.post("/amazon/api/v0/inventry/getSizePro",data)
 }
 export default{
 	getSizePro
 }