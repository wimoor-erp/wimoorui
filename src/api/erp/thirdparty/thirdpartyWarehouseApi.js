import request from "@/utils/request.js";
function saveStock(data){
  return request.get('/erp/api/v1/thirdparty/warehouse/saveStock',{params:data});
}
function list(data){
  return request.get('/erp/api/v1/thirdparty/warehouse/list',{params:data});
}
function searchStock(data){
  return request.post('/erp/api/v1/thirdparty/warehouse/searchStock',data);
}

export default{
	 saveStock,list,searchStock
}