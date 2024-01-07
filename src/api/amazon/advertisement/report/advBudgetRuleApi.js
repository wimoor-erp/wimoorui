import request from "@/utils/request";

function budgetRulesRecommendation(profileid,type,data){
	return request.post('/amazonadv/api/v1/campaign/budgetRules/budgetRulesRecommendation/'+profileid+"/"+type,data);
}

function amzCreateBudgetRules(profileid,type,data){
	return request.post('/amazonadv/api/v1/campaign/budgetRules/amzCreateBudgetRules/'+profileid+"/"+type,data);
}

function initialBudgetRecommendation(profileid,type,data){
	return request.post('/amazonadv/api/v1/advCampaignManager/initialBudgetRecommendation/'+profileid+"/"+type,data);
}
function list(profileid,type,data){
	return request.post('/amazonadv/api/v1/campaign/budgetRules/list/'+profileid+"/"+type,data);
}



export default{
	budgetRulesRecommendation,amzCreateBudgetRules,initialBudgetRecommendation,list
}