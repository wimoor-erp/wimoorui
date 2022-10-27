import request from "@/utils/request";

function showProfitDetial(data){
	return request.get('/amazon/api/v1/profit/detail/showProfitDetial',{params:data});
}
 function showProfitPage(){
 	return request.get('/amazon/api/v1/profit/profitParam/showProfitPage');
 }
 function showCost(data){
 	return request.post('/amazon/api/v1/profit/calculateCost/showCost',data);
 }
 function showProfit(data){
 	return request.post('/amazon/api/v1/profit/detail/showProfit',data);
 }
export default{
	showProfitDetial,showProfitPage,showCost,showProfit
}