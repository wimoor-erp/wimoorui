import request from "@/utils/request";

function getCampaignList(data){
	return request.post('/amazonadv/api/v1/advCampaignManager/getCampaignList',data);
}
function getSumCampaign(data){
	return request.post('/amazonadv/api/v1/advCampaignManager/getSumCampaign',data);
}
function getCampaignChart(data){
	return request.post('/amazonadv/api/v1/advCampaignManager/getCampaignChart',data);
}
function getCampaignPlacement(data){
	return request.get('/amazonadv/api/v1/advCampaignManager/getCampaignPlacement',{params:data});
}
export default{
	getCampaignList,getSumCampaign,getCampaignChart,getCampaignPlacement,
}