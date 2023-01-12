/**
 * 分类
 */
import request from "@/utils/request";

function saveNotice(data){
	return request.post('/erp/api/v1/material/mark/saveNotice',data);
}
function showNotice(data){
	return request.get('/erp/api/v1/material/mark/showNotice',{params:data});
}
function show(data){
	return request.post('/erp/api/v1/material/mark/show',data);
}
function hide(data){
	return request.post('/erp/api/v1/material/mark/hide',data);
} 
 
export default{
	  saveNotice,showNotice,show,hide
}