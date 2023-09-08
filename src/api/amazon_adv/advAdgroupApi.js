
import request from "@/utils/request";

function getAdGroupList(data){
	return request.post('/amazonadv/api/v1/advAdgroupManager/getAdGroupList',data);
}
function getSumAdGroup(data){
	return request.post('/amazonadv/api/v1/advAdgroupManager/getSumAdGroup',data);
}
function getAdGroupSuggestBid(data){
	return request.get('/amazonadv/api/v1/advAdgroupManager/getAdGroupSuggestBid',{params:data});
}
function getAdGroupChart(data){
	return request.post('/amazonadv/api/v1/advAdgroupManager/getAdGroupChart',data);
}
 
export default{
	getAdGroupList,getSumAdGroup,getAdGroupSuggestBid,getAdGroupChart,
}