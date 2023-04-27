import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
 function list(data){
 	 return request.post("/erp/api/v1/inventoryRecord/list",data)
 }
 function getFormTypeList(data){
 	 return request.get("/erp/api/v1/inventoryRecord/getFormTypeList",{params:data})
 }
 function downloadRecordsExcel(data){
 	return request({url:"/erp/api/v1/inventoryRecord/downloadRecordsExcel",
 			responseType:"blob",
 			data:data,
 			method:'post'}).then(res => {
 					downloadhandler.downloadSuccess(res,"inventoryFormRecords.xlsx")
 			}).catch(e=>{
 					downloadhandler.downloadFail(e);
 			}); 
 }
 function findInvDayList(data){
 	 return request.post("/erp/api/v1/inventoryRecord/findInvDayList",data)
 }
 
 
 export default{
 	list,getFormTypeList,downloadRecordsExcel,findInvDayList,
 }