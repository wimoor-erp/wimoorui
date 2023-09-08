import request from "@/utils/request";

function getKeywordList(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getKeywordList',data);
}
function getSumAdvKeywords(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getSumAdvKeywords',data);
}
function getKeywordChart(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getKeywordChart',data);
}
function getKeywordSuggestBid(data){
	return request.get('/amazonadv/api/v1/advKeywordManager/getKeywordSuggestBid',{params:data});
}
function getKeywordQueryList(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getKeywordQueryList',data);
}
function getKeywordQueryChart(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getKeywordQueryChart',data);
}
function getNegativaKeywordsList(data){
	return request.post('/amazonadv/api/v1/advKeywordManager/getNegativaKeywordsList',data);
}
 
export default{
	getKeywordList,getSumAdvKeywords,getKeywordChart,getKeywordSuggestBid,getKeywordQueryList,getKeywordQueryChart,
	getNegativaKeywordsList,
}