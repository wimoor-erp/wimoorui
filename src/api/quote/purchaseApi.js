import request from "@/utils/request.js";
 
function save(data){
	return request.post('/quote/api/v1/quote/purchase/save',data);
}
 
 export default{
 	 save
 }