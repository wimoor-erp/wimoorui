import request from "@/utils/request";
 
function getSerialNumber(data){
	return request.get('/erp/api/v1/material/getSerialNumber',{params:data});
}
 
export default{
	getSerialNumber,
}