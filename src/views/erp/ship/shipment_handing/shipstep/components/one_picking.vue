<template>
	<div>
		<el-table :data="productData.list" border style="width: 100%;margin-bottom:16px;">
			<el-table-column prop="image" label="图片" width="60">
				<template #default="scope">
					<el-image :src="scope.row.image" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column label="名称/SKU"  show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.pname}}</div>
					<div class='sku'>{{scope.row.sellersku}} </div>
				</template>
			</el-table-column>
						<el-table-column prop="quantity" label="拟发货数量" width="100"   />
						<el-table-column prop="invquantity" label="库存" width="100"   />
						<el-table-column prop="outbound" label="待出库" width="100"   />
			<el-table-column  label="实际配货数量" width="200">
				<template #default="scope">
					<el-input :disabled="piceDisable" v-model.number="scope.row.quantityShipped"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<el-row :gutter="16" class="mar-bot">
			<el-col :span="8">
				<el-card  shadow="never" class="text-center">
					<el-dropdown>
						<div class="icon-prin">
						<printer theme="outline" size="24" fill="#FF6700" :strokeWidth="2"/>
					    <span class="el-dropdown-link">
					     打印配货单
					      <el-icon class="el-icon--right">
					        <arrow-down />
					      </el-icon>
					    </span>
						</div>
					    <template #dropdown>
					      <el-dropdown-menu>
					        <el-dropdown-item @click="openShipmentInfo('mobile')">移动版配货单</el-dropdown-item>
					        <el-dropdown-item @click="openShipmentInfo('simple')">简洁版配货单</el-dropdown-item>
					        <el-dropdown-item @click="openShipmentInfo('detail')">详细版配货单</el-dropdown-item>
					      </el-dropdown-menu>
					    </template>
					  </el-dropdown>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card  shadow="never" class="text-center">
					<el-dropdown>
						<div class="icon-prin">
						<add-print theme="outline" size="24" fill="#FF6700" :strokeWidth="2"/>
					    <span class="el-dropdown-link">
					     打印产品标签
					      <el-icon class="el-icon--right">
					        <arrow-down />
					      </el-icon>
					    </span>
						</div>
					    <template #dropdown>
					      <el-dropdown-menu>
					        <el-dropdown-item @click="downloadLabel('pdf')">PDF格式</el-dropdown-item>
					        <el-dropdown-item @click="downloadLabel('excel')">Excel格式</el-dropdown-item>
					      </el-dropdown-menu>
					    </template>
					  </el-dropdown>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card  shadow="never" class="text-center">
					<el-dropdown>
						<div class="icon-prin">
						<inbox-out theme="outline" size="24" fill="#FF6700" :strokeWidth="2"/>
						<span class="el-dropdown-link">
						    {{boxconName}}
						  <el-icon class="el-icon--right">
						    <arrow-down />
						  </el-icon>
						</span>
						</div>
					    <template #dropdown>
					      <el-dropdown-menu>
					        <el-dropdown-item @click="changeboxcontents('FEED')">系统提交装箱</el-dropdown-item>
					        <el-dropdown-item @click="changeboxcontents('NONE')">亚马逊后台提交装箱</el-dropdown-item>
					      </el-dropdown-menu>
					    </template>
					  </el-dropdown>
				</el-card>
			</el-col>
		</el-row>
		  <el-alert   type="info " show-icon class="mar-bot">
			  <template #default>
				 <p>1．点击发货前请确保发货实物的SKU和数量完全与创建的货件一致，不然会影响您的卖家绩效和商品销售，可点击上方“打印配货单” 打印纸质清单与实物核对。</p>
				<p>2．若不一致，需要在点击发货前请修改已有商品发货数量； （修改的数量浮动只能在 5% 或 6 个SKU）</p>	
			  </template>  
		  </el-alert>
		   <el-row class="mar-bot">
		  <el-space>
			    <ShipmentOpt ref="optRef"  />
				 <el-button @click="validateShipment" >验证货件是否正确</el-button>	 
		  </el-space>
		  <div class="rt-btn-group">
		  	 <el-button :disabled="piceDisable"  type="primary" @click="qtyconfirm">确认配货数</el-button>
			  <el-button type="primary"  @click="stepclick(1)" plain>下一步</el-button>
		  </div>
		  </el-row>
		  
		   
	</div>
</template>

<script>
	import {Search,ArrowDown} from '@element-plus/icons-vue'
	import {Printer,AddPrint,InboxOut} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import {format,dateFormat,dateTimesFormat} from '@/utils/index';
	import { ElMessage,ElMessageBox } from 'element-plus';
	import { useRoute,useRouter } from 'vue-router'
	import ShipmentOpt from"./shipment_operator.vue"
	export default{
		name:"One_picking",
		components:{Search,ArrowDown,Printer,AddPrint,InboxOut,ShipmentOpt},
		emits:["stepdata"],
		setup(props,context){
			let router = useRouter()
			let productData=reactive({list:[]})
			let shipInfo=ref({})
			let boxcontents=ref("FEED")
			let optRef=ref();
			let piceDisable=ref(false);
			let boxconName=ref("系统提交装箱");
			function openShipmentInfo(ftype){
					if(ftype=="mobile"){
						var path={path:"/shipment_handing/pehuo","query":{"shipmentid":shipInfo.value.shipmentid, title:"配货单",path:"/shipment_handing/pehuo"}};
						router.push(path);
					}else{
						//下载pdf
						shipmenthandlingApi.downPDFShipForm({
							"shipmentid":shipInfo.value.shipmentid,
							"ftype":ftype
						}).then(res => {
								ElMessage({
								    message: '导出成功！',
								    type: 'success',
								  })
							 const blob = new Blob([res]);
							 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
								navigator.msSaveBlob(blob, "shipmentDdetail.pdf")
							 }else{
								 var link=document.createElement("a");
								 link.href=window.URL.createObjectURL(blob);
								 link.download="shipmentDdetail.pdf";
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
			function downloadLabel(ftype){
				if(ftype=="pdf"){
					shipmenthandlingApi.downPDFLabel({
						"shipmentid":shipInfo.value.shipmentid,
						"ftype":"0",
						"paramStr":''
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "shipmentLabel.pdf")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="shipmentLabel.pdf";
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
						"shipmentid":shipInfo.value.shipmentid,
						"ftype":"0",
						"paramStr":''
					}).then(res => {
							ElMessage({
							    message: '导出成功！',
							    type: 'success',
							  })
						 const blob = new Blob([res]);
						 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
							navigator.msSaveBlob(blob, "shipmentLabel.xlsx")
						 }else{
							 var link=document.createElement("a");
							 link.href=window.URL.createObjectURL(blob);
							 link.download="shipmentLabel.xlsx";
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
			function changeboxcontents(value){
				boxcontents.value=value;
				if(value=="FEED"){
					boxconName.value="系统提交装箱";
				}else{
					boxconName.value="亚马逊后台提交装箱";
				}
			}
			function qtyconfirm(){
				var lists=[];
				productData.list.forEach(function(item,index){
					var map={};
					map.sellersku=item.sellersku;
					map.quantityshipped=item.quantityShipped;
					map.shipmentid=shipInfo.value.shipmentid;
					lists.push(map);
				})
				shipmenthandlingApi.updateShipment({
					"shipmentid":shipInfo.value.shipmentid,
					"intendedBoxContentsSource":boxcontents.value,
					"itemList":lists
				}).then(res=>{
					console.log(res)
				})
			}
			
			
			
			function validateShipment(){
				shipmenthandlingApi.validateShipment({
					"shipmentid":shipInfo.value.shipmentid
				}).then(res=>{
					 ElMessage({
					     message: '验证成功,该货件未发现问题！',
					     type: 'success',
					   })
				})
			}
			function loadOptData(datas){
				optRef.value.shipDatas=datas;
				shipInfo.value=datas;
				if(shipInfo.value.status=="2" || shipInfo.value.status=="3" || shipInfo.value.status=="4"){
					piceDisable.value=false;
				}else{
					piceDisable.value=true;
				}
				if(shipInfo.value.intendedBoxContentsSource=="NONE"){
					boxconName.value="亚马逊后台提交装箱";
				}else{
					boxconName.value="系统提交装箱";
				}
			}
			function stepclick(step){
				context.emit("stepdata",step);
			}
			return{
				productData,openShipmentInfo,shipInfo,downloadLabel,changeboxcontents,boxcontents,qtyconfirm,
				validateShipment,loadOptData,optRef,stepclick,piceDisable,boxconName
			}
		}
	}
</script>

<style>
	.icon-prin{
		display: flex;
		align-items: center;
	}
	.icon-prin .el-dropdown-link{
		margin-left: 8px;
		color: var(--el-color-primary);
	}
</style>
