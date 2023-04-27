 import request from "@/utils/request";
function getProject(data){
	return request.get('/erp/api/v1/faccount/getProject',{params:data});
}
function getPaymentMethod(data){
	return request.get('/erp/api/v1/faccount/getPaymentMethod',{params:data});
}

 
 
 export default{
 	getProject,getPaymentMethod,
 }