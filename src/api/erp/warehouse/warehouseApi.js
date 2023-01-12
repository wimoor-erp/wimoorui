import request from "@/utils/request";
function getWarehouseList(data){
	 return request.get("/erp/api/v1/warehouse/list",{params:data})
}
function getWarehouseListPage(data){
	 return request.post("/erp/api/v1/warehouse/listpage",data)
}
function getWarehouseUseable(){
	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_usable"} })
}
function getOversaWarehouseUseable(){
	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"oversea_usable"} })
}
function getWarehouseUnUseable(){
	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_unusable"} })
}
function getWarehouseTest(){
	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_test"} })
}
function getSelfWarehouseById(data){
	 return request.get("/erp/api/v1/warehouse/getSelfWarehouseById",{params:data})
}
function getWarehouseNameList(data){
	 return request.get("/erp/api/v1/warehouse/getNamelist",{params:data})
}
function deleteInfo(ids){
	return request.get("/erp/api/v1/warehouse/deleteInfo",{params:{ids:ids}});
}
function saveData(data){
	return request.post("/erp/api/v1/warehouse/saveData",data);
}
function updateData(id,data){ 
	return request.post("/erp/api/v1/warehouse/updateData/"+id,data);
}
function detail(id){
	return request.get("/erp/api/v1/warehouse/detail/"+id);
}
function updateDefault(id){
	return request.post("/erp/api/v1/warehouse/updateDefault/"+id);
}
function updateIndex(data){
	return request.post("/erp/api/v1/warehouse/updateIndex",data);
}
function updateStockByChange(data){
	return request.get("/erp/api/v1/warehouse/updateStockByChange",{params:data});
}
export default{
	getWarehouseList,getWarehouseUseable,getWarehouseUnUseable,
	getWarehouseTest,getSelfWarehouseById,getWarehouseNameList,
	getWarehouseListPage,deleteInfo,saveData,detail,updateData,updateDefault,
	updateIndex,updateStockByChange,getOversaWarehouseUseable
}