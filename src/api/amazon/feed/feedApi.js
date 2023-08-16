import request from "@/utils/request";
function submitfeedInfo(data){
	return request.get('/amazon/api/v0/feed/submitfeedInfo',{params:data});
}
function downloadFeedFile(data){
	return request({url:"/amazon/api/v0/feed/downloadFeedFile",
				    responseType:"blob",
				    params:data,
				    method:'get'});
}

export default{
	submitfeedInfo,downloadFeedFile
	}