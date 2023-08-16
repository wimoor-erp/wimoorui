import request from "@/utils/request";

function loadProfile(data){
	return request.get('/amazonadv/api/v1/advert/loadProfile',{params:data});
}

export default{
	loadProfile,
}


