import request from "@/utils/request";
function findPortfolios(data){
	return request.get('/amazonadv/api/v1/AdvertPortfolios/findPortfoliosForProfileId',{params:data});
}

export default{findPortfolios}
