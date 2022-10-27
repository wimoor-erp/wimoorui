import request from "@/utils/request";
function getOrderSumField(data){
	 return request.post('/amazon/api/v1/salessum/getOrderSumField',data);
}
function getOrderData(data){
	return request.post('/amazon/api/v1/salessum/getOrderData',data);
}
export default{
	 getOrderSumField,getOrderData
}