import {ElMessage} from 'element-plus';

function uploadResult(res,callback){
	if(res.type=="application/json"){
		var reader = new FileReader();
		reader.readAsText(res, 'utf-8');
		reader.onload = function (e) {
			 var result=JSON.parse(reader.result);
			 if(result.code==201){
				 ElMessage({
				   type: 'success',
				   message: '上传成功,'+result.msg,
				 });
				 if(callback){
					 callback();
				 }
			 }else{
				 ElMessage({  message: '导出失败！'+result.msg,   type: 'error', })
			 }
		}
	}else if(res.type=="application/force-download"){
		const blob = new Blob([res]);
		if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
			 navigator.msSaveBlob(blob, "error.xlsx");
		}else{
			 var link=document.createElement("a");
			 link.href=window.URL.createObjectURL(blob);
			 link.download="error.xlsx";
			 link.click();
			 window.URL.revokeObjectURL(link.href);
		}
	}else{
		ElMessage({
		  type: 'success',
		  message: '上传成功',
		});
	}
}
 
export default{
	 uploadResult
}