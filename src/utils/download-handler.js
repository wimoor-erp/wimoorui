import {ElMessage} from 'element-plus';
function downloadSuccess(res,filename){
	ElMessage({ message: '导出成功！',  type: 'success', })
	const blob = new Blob([res]);
	if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
		 navigator.msSaveBlob(blob, filename)
	}else{
		 var link=document.createElement("a");
		 link.href=window.URL.createObjectURL(blob);
		 link.download=filename;
		 link.click();
		 window.URL.revokeObjectURL(link.href);
	}
}
 
function downloadFail(res,filename){
	if(res&&res.response.data){
		var reader = new FileReader();
		reader.readAsText(res.response.data, 'utf-8');
		reader.onload = function (e) {
			 var result=JSON.parse(reader.result);
			 ElMessage({  message: '导出失败！'+result.msg,   type: 'error', })
		}
	}
	else if(res&&res.msg){
		 ElMessage({  message: '导出失败！'+res.msg,   type: 'error', })
	}else if(res&&res.message){
	    ElMessage({  message: '导出失败！'+res.message,   type: 'error', })
	}else{
	     ElMessage({  message: '导出失败！',   type: 'error', })
	}
	
}
export default{
	downloadSuccess,downloadFail
}