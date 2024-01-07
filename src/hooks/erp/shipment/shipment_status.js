export function tranStatus(row){
				let val = row.status;
				if(val==0){
					return "已取消";
				}else if(val==1){
					 return "待确认";
				}else if(val>=5){
					let status=  row.shipmentstatus;
					if(status=="已删除"||status=="已取消"){
						return "异常";
					}else if(val==6){
						return "已完成"
				    }else{
						return status;
					}
				}else if(val==2){
					return "配货";
				}else if(val==4){
					return "发货出库";
				}else if(val==3){
					return "装箱";
				}else if(val==-1){
					return "已驳回";
				}
 }
 
 export  function tranStatusType(row){
				let val = row.status
				if(val==0){
					return "danger"
				}else if(val==1){
					 return "warning"
				}else if(val>=5){
					let status=  row.shipmentstatus;
					if(status=="已删除"||status=="已取消"||status=="状态异常"){
						return "danger";
					}else if(val==6){
						return "success"
				    }else{
						return "success"
					}
				}else if(val==2){
					return "info"
				}else if(val==4){
					return "warning"
				}else if(val==3){
					return "info"
				}
			}