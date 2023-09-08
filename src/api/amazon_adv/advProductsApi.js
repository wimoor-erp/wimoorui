import request from "@/utils/request";

function getProductAdList(data){
	return request.post('/amazonadv/api/v1/advProductAdsManager/getProductAdList',data);
}
function getSumProductAd(data){
	return request.post('/amazonadv/api/v1/advProductAdsManager/getSumProductAd',data);
}
function getProductAdChart(data){
	return request.post('/amazonadv/api/v1/advProductAdsManager/getProductAdChart',data);
}
function getProductAdotherAsin(data){
	return request.get('/amazonadv/api/v1/advProductAdsManager/getProductAdotherAsin',{params:data});
}
 
export default{
	getProductAdList,getSumProductAd,getProductAdChart,getProductAdotherAsin,
}