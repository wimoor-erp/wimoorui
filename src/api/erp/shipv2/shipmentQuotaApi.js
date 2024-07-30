import request from "@/utils/request.js";
import downloadhandler from "@/utils/download-handler.js";

function downPDFShipForm(ftype,data){
	return request({url:"/amazon/api/v2/shipInboundPlan/quota/downPDFShipForm/"+ftype,
			responseType:"blob",
			data:data,
			method:'post'}).then(res => {
					downloadhandler.downloadSuccess(res,"shipFormItem.pdf")
			}).catch(e=>{
					downloadhandler.downloadFail(e);
			});
	 
}

function downPDFLabel(data){
	return request({url:"/amazon/api/v2/shipInboundPlan/quota/downPDFLabel",
			responseType:"blob",
			params:data,
			method:'get'}).then(res => {
					downloadhandler.downloadSuccess(res,"labeltemplate.pdf")
			}).catch(e=>{
					downloadhandler.downloadFail(e);
			});
	 
}


function downExcelLabel(data){
	return request({url:"/amazon/api/v2/shipInboundPlan/quota/downExcelLabel",
			responseType:"blob",
			params:data,
			method:'get'}).then(res => {
					downloadhandler.downloadSuccess(res,"labeltemplate.xlsx")
			}).catch(e=>{
					downloadhandler.downloadFail(e);
			});
	 
}
function info(id){
	return request.get('/amazon/api/v2/shipInboundPlan/quota/info/'+id);
}
function checkinv(id,data){
	return request.post('/amazon/api/v2/shipInboundPlan/quota/checkinv/'+id,data);
}


 
 

export default{
	 downPDFShipForm,downPDFLabel,downExcelLabel,info,checkinv,
}

