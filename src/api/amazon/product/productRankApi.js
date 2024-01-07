import request from "@/utils/request";

 function rank(data){
	 return request.get("/amazon/api/v1/report/product/productRank/rank",{params:data})
 }

 export default{
	rank
 }
