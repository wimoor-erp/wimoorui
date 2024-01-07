 
 import {ElMessage } from 'element-plus';
 import {downloadLabel} from '@/hooks/amazon/listing/label.js';
 import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
 export  function checkFile(file){
 				 if (file.type != "" || file.type != null || file.type != undefined){
 				     //截取文件的后缀，判断文件类型
 				 	const FileExt = file.name.replace(/.+\./, "").toLowerCase();
 				 	//计算文件的大小
 				 	const isLt5M = file.size / 1024/1024  < 5; //这里做文件大小限制
 				 	//如果大于50M
 				 	if (!isLt5M) {
 				 		ElMessage({
 				 		    message: '上传文件大小不能超过 5MB!!',
 				 		    type: 'error'
 				 		  })
 				 		return false;
 				 	}
 				 	else {
 				 	   return true;
 				 	}
 				 }
 			 }
 export  function printProductlabel(state){
 				 //打印当前 产品标签
 				 if(state.productlist && state.productlist.length>0){
 					  var data=[];
 					  state.productlist.forEach(function(item){
						  var nowitem={};
						   nowitem.title=item.pname;
						   nowitem.quantity=item.quantity;
						   nowitem.pid=item.pid;
						   nowitem.marketplaceid=item.marketplaceid;
						   nowitem.fnsku=item.fnsku;
						   nowitem.sku=item.sku;
						   if(item.fnsku){
								data.push(nowitem);
						   }else{
							   ElMessage({
									message: item.sku+'无FNSKU！',
									type: 'error',
							   })
						   }
 					  }); 
					 downloadLabel('','excel',data)
 				 }else{
 					 ElMessage({
 							message: '请选择至少一个产品！',
 							type: 'error',
 					 })
 				 }
 			 }
			 
 export function downloadtemplate(){
 				 shipmentplanApi.downExcelTemp().then(res => {
 				 		ElMessage({
 				 		    message: '下载模板成功！',
 				 		    type: 'success',
 				 		  })
 				 	 const blob = new Blob([res]);
 				 	 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
 				 		navigator.msSaveBlob(blob, "ship-template.xlsx")
 				 	 }else{
 				 		 var link=document.createElement("a");
 				 		 link.href=window.URL.createObjectURL(blob);
 				 		 link.download="ship-template.xlsx";
 				 		 link.click();
 				 		 window.URL.revokeObjectURL(link.href);
 				 	 }
 				 
 				 })
 			 }
			 
export	 function handleRemove(){
 				 
 			 }
 			 //超出文件个数的回调
export	function handleExceed(){
 			 	ElMessage({
 			 	    message: '超出最大上传文件数量的限制！',
 			 	    type: 'error'
 			 	  })
 			 	 return
 			 }