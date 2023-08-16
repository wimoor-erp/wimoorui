import request from "@/utils/request";

function getCampaignList(data){
	return request.post('/amazonadv/api/v1/advCampaignManager/getCampaignList',data);
}

export default{
	getCampaignList,
}