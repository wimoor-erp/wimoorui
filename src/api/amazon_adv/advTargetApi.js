import request from "@/utils/request";

function getProductTargeList(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getProductTargeList',data);
}
function getSumProductTarge(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getSumProductTarge',data);
}
function getProductTargeChart(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getProductTargeChart',data);
}
function getTargetBidRecommendations(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getTargetBidRecommendations',data);
}
function getNegativaTargeList(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getNegativaTargeList',data);
}
function getProductTargeQueryList(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getProductTargeQueryList',data);
}
function getProductTargeQueryChart(data){
	return request.post('/amazonadv/api/v1/advProductTargeManager/getProductTargeQueryChart',data);
}
 
 
export default{
	getProductTargeList,getSumProductTarge,getProductTargeChart,getTargetBidRecommendations,getNegativaTargeList,
	getProductTargeQueryList,getProductTargeQueryChart,
}