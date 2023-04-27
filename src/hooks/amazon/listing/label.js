import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
import { ElMessage } from 'element-plus';
	
export function downloadLabel(shipment,ftype,skuinfo){
				if(ftype=="pdf"){
					shipmenthandlingApi.downPDFLabel({
						"shipmentid":shipment,
						"ftype":"1",
						"skuinfo":skuinfo
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "productLabel.pdf")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="productLabel.pdf";
							 link.click();
							 window.URL.revokeObjectURL(link.href);
						 }
					
					}).catch(e=>{
							ElMessage({
							    message: '导出失败！',
							    type: 'error',
							  })
					})
				}else{
					shipmenthandlingApi.downExcelLabel({
						"shipmentid":shipment,
						"ftype":"1",
						"skuinfo":skuinfo
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "productLabel.xlsx")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="productLabel.xlsx";
							 link.click();
							 window.URL.revokeObjectURL(link.href);
						 }
					
					}).catch(e=>{
							ElMessage({
							    message: '导出失败！',
							    type: 'error',
							  })
					})
				}
				
			}

export function downloadShipmentLabel(shipment,ftype,skuinfo){
				if(ftype=="pdf"){
					shipmenthandlingApi.downPDFLabel({
						"shipmentid":shipment,
						"ftype":"0",
						"skuinfo":skuinfo
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "productLabel.pdf")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="productLabel.pdf";
							 link.click();
							 window.URL.revokeObjectURL(link.href);
						 }
					
					}).catch(e=>{
							ElMessage({
							    message: '导出失败！',
							    type: 'error',
							  })
					})
				}else{
					shipmenthandlingApi.downExcelLabel({
						"shipmentid":shipment,
						"ftype":"0",
						"skuinfo":skuinfo
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "productLabel.xlsx")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="productLabel.xlsx";
							 link.click();
							 window.URL.revokeObjectURL(link.href);
						 }
					
					}).catch(e=>{
							ElMessage({
							    message: '导出失败！',
							    type: 'error',
							  })
					})
				}
				
			}