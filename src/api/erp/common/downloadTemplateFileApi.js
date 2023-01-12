
import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
function downExcelTemp(data){
	return request({url:"/erp/api/v1/common/excelDownload/downExcelTemp",
				                    responseType:"blob",
									params:data,
									method:'get'}).then(res => {
						downloadhandler.downloadSuccess(res,data.ftype+".xlsx");
				}).catch(e=>{
					    downloadhandler.downloadFail(e);
				});
}
export default{
	downExcelTemp,
}