import request from "@/utils/request";
 
export function sublit(data){
	return request.get('/erp/api/v1/assembly/sublit',{params:data});
}
 
 