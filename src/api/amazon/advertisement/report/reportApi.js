import request from "@/utils/request";
function getsumproduct(data){
	 return request.post('/amazonadv/api/v1/advReport/getsumproduct',data);
}

export default{
	getsumproduct,
 
}