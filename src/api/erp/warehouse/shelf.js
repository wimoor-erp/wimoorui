import request from "@/utils/request";
 import axios from 'axios';
function getWarehouseShelf() {
  return request.get('/erp/api/v1/warehouse/shelf/list');
}
function saveWarehouseShelf(data) {
  return request.post('/erp/api/v1/warehouse/shelf/add',data); 
}
function detailWarehouseShelf(parentid) {
  return request.get('/erp/api/v1/warehouse/shelf/'+parentid+'/detail');
}
function deleteWarehouseShelf(ids) {
  return request.delete('/erp/api/v1/warehouse/shelf/del',{params:{"ids":ids} });
}
function modifyWarehouseShelf(data) {
  return request.put('/erp/api/v1/warehouse/shelf/modify',data);
}
const getShelfInfo=(data)=>{
	return request.get('/erp/api/v1/warehouse/shelf/getShelfInfo',{params:data });
}
function getQRCode(id){
  return request({url:'/erp/api/v1/warehouse/shelf/getQRCode/'+id,
                responseType:"blob",
				method:'post'});
}
function getQRCodePdf(shelfid,parentshelfid){
  return request({url:'/erp/api/v1/warehouse/shelf/getQRCodePdf',
                responseType:"blob",
				params:{"shelfid":shelfid,"parentshelfid":parentshelfid},
				method:'get'});
}
export default{getWarehouseShelf ,saveWarehouseShelf,
detailWarehouseShelf,deleteWarehouseShelf,modifyWarehouseShelf,
getQRCode,getQRCodePdf,getShelfInfo}