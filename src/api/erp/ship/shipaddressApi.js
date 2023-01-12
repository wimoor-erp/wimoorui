import request from "@/utils/request";
function getAddressByid(data){
	return request.get('/amazon/api/v1/shipaddress/getAddressByid',{params:data});
}
 
export default{
	getAddressByid,
}