import {h, ref ,watch,reactive,onMounted} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import groupApi from '@/api/amazon/group/groupApi';
import marketApi from '@/api/amazon/market/marketApi'
import warehouseApi from '@/api/erp/warehouse/warehouseApi'
import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
import shipaddressApi from '@/api/erp/ship/shipaddressApi.js';
import serialnumberApi from '@/api/erp/common/serialnumberApi.js';
import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';	
import transportationApi from '@/api/erp/ship/transportationApi';
import materialApi from '@/api/erp/material/materialApi.js';
import {CheckInputIntLGZero,CheckInputInt} from '@/utils/index';
import {ElMessage } from 'element-plus'
export default function(){
	        let totalproducts=ref(0)
			let addrIndex = ref(3)
			let radio1 = ref("")
			let showall = ref(true)
			let router = useRouter();
			let editRef=ref()
			let planname=ref("")
			let groupid=ref("")
			let warehouseid=ref()
			let marketplaceid=ref("")
			let groupList =ref([])
			let marketList =ref([])
			let warehouseList =ref([])
			let tranlist=ref([])
			let channellist=ref([])
			let tran=ref()
			let channel=ref()
			let arecase=ref("0")
			let remark=ref("")
			let number=ref("")
			let addressData = reactive({list:[]})
			let prodiaRef=ref()
			let productlist=reactive({list:[]})
			let downloadVisible=ref(false);
			let fileList=ref([])
			//请求头
			let headers=ref({"Content-Type": "multipart/form-data" }) 
			let logofile=ref()
			const planid=router.currentRoute.value.query.planid;
			let planwarehouseid=ref(router.currentRoute.value.query.warehouse);
			const planmarketplaceid=router.currentRoute.value.query.marketplaceid;
			const planissplit=router.currentRoute.value.query.issplit;
			const plangroupid=router.currentRoute.value.query.group;
			const planshipmentid=router.currentRoute.value.query.shipmentid;
			onMounted(()=>{
				loadShipName()
				loadNumber()
				getGroupData("init")
				getWarehouseData()
				getTranList()
			})
			function loadShipName(){
				var nowDate=new Date();
				planname.value="PLN"+"("+(nowDate.getMonth()+1)+"/"+(nowDate.getDate())+"/"+nowDate.getFullYear()+" "+nowDate.getHours()+":"+nowDate.getMinutes()+")-1"
			}
			function addAddress(param){
				editRef.value.showModel(param);
			}
		   function manageAlladdr(){				router.push({					path:'/amazon/address',					query:{						title:'发货地址',						path:'/amazon/address',					}				}) 			}
			function showAlladdr(){
				addrIndex.value = Infinity 
				showall.value =false
			}
			function radioChange(val){
				radio1.value= val
			}
			//获取店铺列表
			function getGroupData(type){
				groupApi.getAmazonGroup().then((res)=>{
					groupList.value=res.data;
					if(res.data&&res.data.length>0){
							if(!groupid.value || groupid.value==""){
								groupid.value=res.data[0].id;
							}
							getMarketData(groupid.value,type);
							loadAddress();
							loadPlanData();
					}
				})
			}
			//获取国家列表
			function getMarketData(id,type){
				marketApi.getMarketByGroup({'groupid':id}).then((res)=>{
					marketList.value=res.data;
					if(res.data&&res.data.length>0&&type!='init'){
						marketplaceid.value = res.data[0].marketplaceid;
					}else if(res.data&&res.data.length>0&&marketplaceid==""){
						marketplaceid.value = res.data[0].marketplaceid;
					}
				})
			}
			function groupChange(val,type){
				getMarketData(val,type);
				loadAddress();
				cancelPlan();
			}
			
			function marketChange(val){
				 marketplaceid.value=val;
				 var skulist="";
				 productlist.list.forEach(function(items){
				 	 skulist+=(items.sku+",");
				 }); 
				 validSkuList(skulist);
			}
			//获取仓库列表
			function getWarehouseData(){
				warehouseApi.getWarehouseUseable().then((res)=>{
					warehouseList.value=res.data;
					if(res.data&&res.data.length>0){
						warehouseList.value.forEach(function(item){
							if(item.isdefault==true){
								warehouseid.value = item.id;
							}
						});
						getReadyUseWarehouse();
					}
				})
				
			}
			
			function warehouseChange(val){
				warehouseid.value=val;
			}
			function tranChange(val){
				tran.value=val;
				getchannelList();
			}
			function getchannelList(){
				transportationApi.getChannel({"company":tran.value,"marketplaceid":marketplaceid.value,"transtype":""}).then((res)=>{
					res.data.push({"id":"","channame":"无"});
					channellist.value = res.data
				})
			}
			function channelChange(val){
				channel.value=val;
			}
			function getTranList(){
				transportationApi.getTranlist().then((res)=>{
					res.data.push({"id":"","name":"无"})
					tranlist.value = res.data;
				})
				
			}
			function loadAddress(){
				addressData.list=[];
				shipaddressApi.getAddressByid({"addressid":'',"groupid":groupid.value}).then((res)=>{
					if(res.data && res.data.length>0){
						res.data.forEach(function(item){
							if(item.isdefault==true){
								item.checked=true;
							}else{
								item.checked=false;
							}
						});
						addressData.list=res.data;
						radio1.value=res.data[0].id;
						if(addressData.list.length>3){
							showall.value = true
						}else{
							showall.value = false
						}
					}
				})
			}
			function loadNumber(){
				serialnumberApi.getSerialNumber({"ftype":'SF',"isfind":"true"}).then((res)=>{
					number.value=res.data;
				})
			}
			
			function getReadyUseWarehouse(){
				   if(planwarehouseid.value){
					   warehouseApi.getSelfWarehouseById({"id":planwarehouseid.value}).then((res)=>{
							if(res.data){
							   warehouseid.value=res.data;
							   planwarehouseid.value=res.data;
							}
					   });
				   }
			      
			}
			
			function addProduct(){
				prodiaRef.value.dialogVisible=true;
				var data={};
				data.search='';
				data.warehouseid=warehouseid.value;
				data.ftype='shipment';
				data.marketplaceid=marketplaceid.value;
				data.groupid=groupid.value;
				prodiaRef.value.ftype='shipment';
				prodiaRef.value.params=data;
				prodiaRef.value.loadData();
			}
			 function getdata(data){
				 if(data.length>0){
					 var skulist="";var oldskulist="";
					 if(productlist.list.length>0){
						 productlist.list.forEach(function(items){
						 	 oldskulist+=(items.sku+",");
						 }); 
					 }
					 data.forEach(function(item){
						 var haslength=oldskulist.indexOf(item.sku+",");
						 if(haslength<0||oldskulist==""){
							   skulist+=(item.sku+",");
							   if(item.msku==undefined || item.msku==null || item.msku==''){
							   	 item.msku=item.sku;
							   }
							   materialApi.getMaterialInventoryInfo({"sku":item.msku,"warehouseid":warehouseid.value}).then((ress)=>{
									if(ress.data){
										if(ress.data.canAssembly){
											item.canAssembly=ress.data.canAssembly;
										}
										if(ress.data.pkgDim){
											item.length=ress.data.pkgDim.length;
											item.width=ress.data.pkgDim.width;
											item.height=ress.data.pkgDim.height;
											item.weight=ress.data.pkgDim.weight;
										}
									}
							   })
							   productlist.list.push(item);
						 }
						
					 });
					 totalproducts.value=productlist.list.length;
					 if(skulist!=""){
						 validSkuList(skulist);
					 }
				 }
				  
			 }
			 function validSkuList(skulist){
				 if(skulist && skulist.indexOf(",")>=0){
					 shipmentplanApi.guidance({"groupid":groupid.value,"marketplaceid":marketplaceid.value,"skulist":skulist}).then((res)=>{
								 var data=res.data;
								 productlist.list.forEach(function(item){
									 if(data&&data.invalidSKUList&&data.invalidSKUList&&data.invalidSKUList.length>0){
											 data.invalidSKUList.forEach(function(items){
												 if(items.sellerSKU==item.sku){
													  item.guidance="error";
												 }
											 });
									 }else if(data == "" || data == null || data == undefined){
										if(skulist.indexOf(item.sku+",")){
											item.guidance="warn";
										}					 
									 }else{
										if(skulist.indexOf(item.sku+",")>=0){
											item.guidance="success";
										}							 
									 }
								 }); 
					 						 
					 })
				 }
			 }
			 function removeBind(row){
				 productlist.list.splice(row,1);
				 totalproducts.value=productlist.list.length;
			 }
			 function submitPlan(){
				 var params={};var tranPara={};var itemlist=[];
				 params.name=planname.value;
				 params.number=number.value;
				 params.shipfromaddressid=radio1.value;
				 if(arecase.value=="1"){
					 params.arecasesrequired=true;
				 }else{
					  params.arecasesrequired=false;
				 }
				 params.amazongroupid=groupid.value;
				 params.marketplaceid=marketplaceid.value;
				 params.planmarketplaceid=planmarketplaceid;
				 params.warehouseid=warehouseid.value;
				 params.planid=planid;
				 params.remark=remark.value;
				 params.issplit=planissplit;
				 tranPara.company=tran.value;
				 tranPara.channel=channel.value;
				 productlist.list.forEach(function(item){
					 var row=item;
					 row.QuantityShipped=item.quantity;
					 row.materialid=item.id;
					 row.sellersku=item.sku;
					 itemlist.push(row);
				 });
				 params.planitemlist=itemlist;
				 params.transinfo=tranPara;
				 shipmentplanApi.saveInboundPlan(params).then((res)=>{
					 ElMessage({
					    message: '已提交成功！',
					    type: 'success'
					  })
					  productlist.list=[];
					  totalproducts.value=0;
				 })
			 }
			 function cancelPlan(){
				 productlist.list=[];
				 totalproducts.value=0;
			 }
			 function loadPlanData(){
				 if(planmarketplaceid){
					 //发货规划点过来的
					 productlist.list=[];
					 totalproducts.value=0;
					 var data={};
					 data.warehouseid=planwarehouseid.value;
					 if(planmarketplaceid=="EU"){
							  data.marketplaceid="A1PA6795UKMFR9";
							  marketplaceid.value="A1PA6795UKMFR9";
							}else{
							   data.marketplaceid=planmarketplaceid;
							   marketplaceid.value=planmarketplaceid;
					 }
					 data.planid=planid;
					 data.issplit=planissplit;
					 data.groupid=plangroupid;
					 groupid.value=plangroupid;
					 groupChange(plangroupid,'init');
					 warehouseid.value=planwarehouseid.value;
					 shipmentplanApi.findPlanSubDetail(data).then((res)=>{
							 if(res.data && res.data.length>0){
								 res.data.forEach(function(item){
									 item.sku=item.psku;
									 item.quantity=item.amount;
									 item.id=item.materialid;
									 if(item.msku==undefined || item.msku==null || item.msku==''){
									 	 item.msku=item.sku;
									 }
									 materialApi.getMaterialInventoryInfo({"sku":item.msku,"warehouseid":warehouseid.value}).then((ress)=>{
												if(ress.data){
													if(ress.data.canAssembly){
														item.canAssembly=ress.data.canAssembly;
													}
													if(ress.data.pkgDim){
														item.length=ress.data.pkgDim.length;
														item.width=ress.data.pkgDim.width;
														item.height=ress.data.pkgDim.height;
														item.weight=ress.data.pkgDim.weight;
													}
												}
									 })
								 });
								 productlist.list=res.data;
								 totalproducts.value=productlist.list.length;
								 var skulist="";
								 if(productlist.list.length>0){
										 productlist.list.forEach(function(items){
											 skulist+=(items.sku+",");
										 }); 
								 }
								 if(skulist!=""){
										validSkuList(skulist);
								 }
							 }
					 })
				 }
				 if(planshipmentid){
					 //货件审核的时候 复制按钮 点进来的
					 productlist.list=[];
					 totalproducts.value=0;
					 shipmentplanApi.getItemlistByShipmentId({"shipmentid":planshipmentid}).then((res)=>{
						 if(res.data){
							 var data=res.data;
							 groupid.value=data.groupid;
							 marketplaceid.value=data.marketplaceid;
							 warehouseid.value=data.warehouseid;
							 groupChange(data.groupid,'init');
							 if(data.itemlist && data.itemlist.length>0){
								 data.itemlist.forEach(function(item){
									 item.sku=item.SellerSKU;
									 item.quantity=item.Quantity;
									 item.fulfillable=item.invquantity;
									 item.id=item.mid;
									 if(item.msku==undefined || item.msku==null || item.msku==''){
										 item.msku=item.SellerSKU;
									 }
									 materialApi.getMaterialInventoryInfo({"sku":item.msku,"warehouseid":warehouseid.value}).then((ress)=>{
											if(ress.data){
												if(ress.data.canAssembly){
													item.canAssembly=ress.data.canAssembly;
												}
												if(ress.data.pkgDim){
													item.length=ress.data.pkgDim.length;
													item.width=ress.data.pkgDim.width;
													item.height=ress.data.pkgDim.height;
													item.weight=ress.data.pkgDim.weight;
												}
											}
									 })
								 });
								productlist.list=data.itemlist;
								totalproducts.value=productlist.list.length;
								var skulist="";
								if(productlist.list.length>0){
									 productlist.list.forEach(function(items){
										 skulist+=(items.sku+",");
									 }); 
								}
								if(skulist!=""){
									 validSkuList(skulist);
								}
							 }
						 }
					 });
				 }
			 }
			 function printProductlabel(){
				 //打印当前 产品标签
				 if(productlist.list && productlist.list.length>0){
					  var skulist="";
					  productlist.list.forEach(function(items){
					  		skulist+=(items.sku+"="+items.quantity+",");
					  }); 
					  shipmentplanApi.downExcelLabelBySku({
					  	"groupid":groupid.value,
						"marketpalce":marketplaceid.value,
						"skuList":skulist
					  }).then(res => {
					  		ElMessage({
					  		    message: '导出成功！',
					  		    type: 'success',
					  		  })
					  	 const blob = new Blob([res]);
					  	 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
					  		navigator.msSaveBlob(blob, "productDetail.xlsx")
					  	 }else{
					  		 var link=document.createElement("a");
					  		 link.href=window.URL.createObjectURL(blob);
					  		 link.download="productDetail.xlsx";
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
					 ElMessage({
							message: '请选择至少一个产品！',
							type: 'error',
					 })
				 }
			 }
			 function showProductModal(){
				 downloadVisible.value=true;
			 }
			 function downloadtemplate(){
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
			 function submitProductList(){
				 let FormDatas = new FormData();
				 FormDatas.append('file',logofile.value);
				 FormDatas.append('warehouseid',warehouseid.value);
				 FormDatas.append('groupid',groupid.value);
				 FormDatas.append('marketplaceid',marketplaceid.value);
				 shipmentplanApi.uploadExcel(FormDatas).then((res)=>{
					 if(res.data && res.data.result && res.data.result.length>0){
						 downloadVisible.value = false;
						 productlist.list=[];
						 ElMessage({
						    message: '上传成功！',
						    type: 'success'
						  })
						 res.data.result.forEach(function(item){
							 if(item.msku==undefined || item.msku==null || item.msku==''){
							 	 item.msku=item.sku;
							 }
							 materialApi.getMaterialInventoryInfo({"sku":item.msku,"warehouseid":warehouseid.value}).then((ress)=>{
									if(ress.data){
										if(ress.data.canAssembly){
											item.canAssembly=ress.data.canAssembly;
										}
										if(ress.data.pkgDim){
											item.length=ress.data.pkgDim.length;
											item.width=ress.data.pkgDim.width;
											item.height=ress.data.pkgDim.height;
											item.weight=ress.data.pkgDim.weight;
										}
									}
							 })
						 });
						 productlist.list=res.data.result;
						 totalproducts.value=productlist.list.length;
						 var skulist="";
						 if(productlist.list.length>0){
							 productlist.list.forEach(function(items){
								 skulist+=(items.sku+",");
							 }); 
						 }
						 if(skulist!=""){
								validSkuList(skulist);
						 }
					 }else{
						 ElMessage({
						    message: '上传失败！',
						    type: 'error'
						  })
					 }
				 })
			 }
			 //上传文件的事件
			 function uploadFile(item){
			 	//上传文件的需要formdata类型;所以要转
			 	logofile.value=item.file;
			 }
			 function handleRemove(){
				 
			 }
			 //超出文件个数的回调
			 function handleExceed(){
			 	ElMessage({
			 	    message: '超出最大上传文件数量的限制！',
			 	    type: 'error'
			 	  })
			 	 return
			 }
			 function beforeUpload(file){
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
				 		// ElMessage({
				 		//     message: "上传文件格式不正确!",
				 		//     type: 'error'
				 		//   })
				 	   return true;
				 	}
				 }
			 }
			 function formatQuantity(row){
				 row.quantity=CheckInputInt(row.quantity);
			 }
			return {
				radio1,addressData,addrIndex,editRef,addAddress,groupid,warehouseid,marketplaceid,marketChange,printProductlabel,
				showAlladdr,radioChange,showall,manageAlladdr,planname,marketList,groupList,warehouseList,showProductModal,downloadVisible,
				tran,tranlist,tranChange,getchannelList,channel,channellist,getTranList,loadAddress,groupChange,arecase,
				remark,number,prodiaRef,addProduct,productlist,getdata,removeBind,submitPlan,cancelPlan,validSkuList,loadPlanData,getReadyUseWarehouse,
				downloadtemplate,submitProductList,fileList,uploadFile,handleExceed,beforeUpload,headers,logofile,totalproducts,handleRemove,
				formatQuantity,CheckInputIntLGZero,CheckInputInt
			}
			
}