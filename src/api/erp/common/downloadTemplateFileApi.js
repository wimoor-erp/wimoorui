
import request from "@/utils/request";
import downloadhandler from "@/utils/download-handler";
function downExcelTemp(data,action){
	var myActionUrl="/erp/api/v1/common/excelDownload/downExcelTemp";
	if(action&&action.indexOf("/")>=0){
		 myActionUrl=action;
	} 
	return request({url:myActionUrl,
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