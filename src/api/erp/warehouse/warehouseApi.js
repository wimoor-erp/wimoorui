import request from "@/utils/request";
function getWarehouseList(data){
	 return request.get("/erp/api/v1/warehouse/list",{params:data})
}
function getWarehouseUseable(){
	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_usable"} })
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
export default{
	getWarehouseList,getWarehouseUseable,getWarehouseUnUseable,getWarehouseTest,getSelfWarehouseById
}