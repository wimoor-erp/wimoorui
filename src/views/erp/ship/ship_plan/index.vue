<template>
 
	 <Header ref="myHeaderRef" @change = "handleQuery"/>
	 	 
	 <div class=" expand-table">
		 <GlobalTable ref="globalTableRef"
		 :tableData="tableData"  
		 :size="10"
		 @loadTable="loadTableData" 
		 :defaultSort="{ prop: 'needship', order: 'descending' }"  
		 rowKey="id"
		 @row-click="tableRowClick"
		 :rowClassName="handleRowClassName"
		 @expandChange="handleExpandChange"
		 >
		<template #field>
		<el-table-column type="expand" width="48">
			 <template #header>
				  <el-button v-if="isExpendAll" @click="expendAll()" key="true" :loading="exploading" type="info"  link
				       > <el-icon><ArrowDownBold /></el-icon></el-button>
				  <el-button v-else @click="expendAll()" :loading="closeloading" key="false" type="info"  link
				     > <el-icon><ArrowRightBold /></el-icon></el-button>
			 </template>
			 <template #default="scope">
				<!-- 展开的table -->
				 <Expandtable :tableData="scope.row.expendData"  
				             :row="scope.row"  
							 :transtypeOptions="transtypeOptions"
							 @reload="loadDetail"
							 @show-sales-adjust="handleShowSalesAdjust"
							 @show-product-detail="handleShowProductDetail"
							 @show-ship-record="handleShowShipRecord"
							 @show-eudata="handleShowEUData"
							 @show-split-row="showSplitRow"
							 :status="scope.row.rowstatue"/>  
			 </template>
		</el-table-column>
		<el-table-column prop="img" label="图片" width="60" >
		   <template #default="scope">
		    <el-image :src="scope.row.image"   width="40" height="40"  ></el-image>
		  </template>
		</el-table-column>
		<el-table-column prop="product" label="名称/SKU" width="240" show-overflow-tooltip>
		   <template #default="scope">
		      <div class='name'>{{scope.row.name}}</div>
		      <el-link type="primary" class="font-small">{{scope.row.sku}} </el-link>
			  <span v-if="scope.row.issfg=='1'" @click.stop="handleEmtpy" >
			  <AssemblyDialog @change="getAssembliyList(scope.row)" :loading="scope.row.assloading" :assemblyList="scope.row.assemblyList">
			  						  <template #field>
			  							  <el-link type="warning" class="font-small" v-if="scope.row.issfg=='1'"
			  							  size="small" 
			  							  style="margin-left:3px;" >组</el-link>
			  						  </template>
			  </AssemblyDialog>
			  </span>
		  </template>
		</el-table-column>
		<el-table-column label="建议发货总量" prop="needship"  sortable='custom'  width="125"></el-table-column>
		<el-table-column label="实际发货总量" sortable prop="amount" width="125">
			<template #default="scope">
				<div v-if="scope.row.amount">{{scope.row.amount}}</div>
				<div v-else>0</div>
			</template>
		</el-table-column>
		<el-table-column label="可用库存" sortable prop="quantity" width="100">
			<template #default="scope">
				<div @click.stop="handleEmtpy" >
					<el-popover   trigger="click" @show="handleQueryInventoryQty(scope.row)" placement="top" width="400"  >
					<template  #reference>	
			         <div class="text-center pointer" >
							<span v-if="scope.row.quantity">{{scope.row.quantity}}</span>
					        <span  v-else >0</span>
					 </div>
					</template>
					 <ul class="border-line">
						 <li class="flex-center-between"><span>待入库库存</span>
						                                  <el-tag v-if="scope.row.inbound"> {{scope.row.inbound}}</el-tag>
														  <el-tag v-else> 0</el-tag>
							 </li>
						 <li class="flex-center-between"><span>可售库存</span>
						                                <el-tag type="success" v-if="scope.row.fulfillable">{{scope.row.fulfillable}}</el-tag>
														<el-tag type="success" v-else>0</el-tag>
														</li>
						 <li class="flex-center-between"><span>待出库库存</span>
						                                <el-tag type="warning"  v-if="scope.row.outbound">{{scope.row.outbound}}</el-tag>
														<el-tag type="warning"  v-else>0</el-tag>
														</li>
						 <li class="flex-center-between" v-if="scope.row.canAssembly"><span>可组装库存</span><el-tag type="info">{{scope.row.canAssembly}}</el-tag></li>
						 <li class="flex-center-between" v-if="scope.row.canconsumable"><span>耗材齐套数</span><el-tag type="info">{{scope.row.canconsumable}}</el-tag></li>
					 </ul>
					</el-popover>
					</div>
					<div v-if="scope.row.canAssembly">
					  <span class="font-extraSmall" >可组装:{{scope.row.canAssembly}} </span>
					</div>
			</template>
		</el-table-column>
		<el-table-column label="公告">
			<template #default="scope">
					<span class="table-edit-flex" >
						<span>{{scope.row.notice}}</span>
						<el-icon @click.stop="editRemarks(scope.row)"><Edit/></el-icon>
					</span>
			</template>
		</el-table-column>
		<el-table-column label="报表" width="90">
			<template #default="scope">
			   <el-space :size="12">
				   <el-link :underline="false" type="warning" @click.stop="handlesaleChart(scope.row)">
					   <el-tooltip content="销量报表" placement="top" :hide-after="0" :show-after="200">
				   <chart-histogram class="ic-cen" theme="outline" size="19" :strokeWidth="4"/>
				   </el-tooltip>
				   </el-link>   
				   
				   <el-link :underline="false" type="danger" @click.stop="handlarrivalChart(scope.row)">
					   <el-tooltip content="预计到货报表" placement="top" :hide-after="0" :show-after="200">
				  <chart-line class="ic-cen" theme="filled" size="18" fill="#67c23a"/>
				   </el-tooltip>
				   </el-link>
			</el-space>	
			</template>
		</el-table-column>
		<el-table-column label="操作" width="160">
			<template #default="scope">
				<div class="flex-center-bew" @click.stop="handleEmtpy" >
				<el-link @click.stop="handleEmtpy"  :underline="false" type="primary" class="font-small">
					<div v-if="scope.row.rowstatue.isEdit"  class="opt-td-div">
						<span  @click.stop="handleCancel(scope.row)" style="margin-left:20">取消</span> 
						<span  @click.stop="submitForm(scope.row)">保存</span>
					</div>
					<div v-else class="opt-td-div">
						<span v-if="scope.row.rowstatue.isplan" 
						       @click.stop="handleDelete(scope.row)" >  移除</span> 
						<span v-else style="padding-left: 30px;">  </span> 
						<span   @click.stop="handleAdd(scope.row)" >编辑</span>
					</div>
				</el-link>
				<el-dropdown  :hide-on-click="false" trigger="click">
				  <span class="el-dropdown-link" >
				    <more-one class="ic-cen" theme="outline" size="20" fill="#333" :strokeWidth="3"/>
				  </span>
				   <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item >
						  <span v-if="scope.row.displayState" @click.stop="hideProduct(scope.row)">隐藏产品</span>
						  <span v-else @click.stop="showProduct(scope.row)">显示产品</span>
					  </el-dropdown-item>
				    </el-dropdown-menu>
				</template>
				</el-dropdown>
				</div>
			</template>
		</el-table-column>
     </template>
 </GlobalTable>
	</div>
	<SalechartDialog ref="salechartRef"/>
	<ArrivalDialog ref="arrivalchartRef"/>
	<RemarksDialog ref="remarksRef" @confirm="remarkConfirm"/>
    <SaleAdjustDialog ref="saleAdjustDialogRef"></SaleAdjustDialog>
	<GoodsDeatils ref="goodsDeatilsRef"  />
	<ShipRecordDialog ref="shipRecordDialogRef"></ShipRecordDialog>
	<SplitPlanDialog ref="splitPlanDialogRef" 
	                 :transtypeOptions="transtypeOptions"
	                 @change="handleSplitRow">
	</SplitPlanDialog>
</template>
<script setup>
	import { ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import Expandtable from "./components/expand_table";
	import SalechartDialog from "@/views/amazon/listing/common/salechart.vue"
	import ArrivalDialog from"@/views/amazon/listing/common/arrival_dialog.vue";
	import ShipRecordDialog from "./components/ship_record.vue"
	import RemarksDialog from "./components/remarks_dialog.vue"
	import SaleAdjustDialog from "@/views/amazon/sales/forecast/components/sale_adjust_dialog";
	import AssemblyDialog from "./components/assembly_dialog";
	import SplitPlanDialog from "./components/split_plan_dialog"
	import GoodsDeatils from "@/views/amazon/listing/common/goods_deatils"
    import Header from "./components/header";
	// API依赖
	import planApi from '@/api/erp/ship/planApi.js';
	import inventoryApi from '@/api/erp/inventory/inventoryApi.js';
	import {Edit,ArrowRightBold,ArrowDownBold} from '@element-plus/icons-vue';
	import { ElMessage ,ElMessageBox} from 'element-plus'
	import transportationApi from '@/api/erp/ship/transportationApi';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import markApi from '@/api/erp/material/markApi';
	import {Help,MoreOne,ChartHistogram,ChartLine} from '@icon-park/vue-next';
	import {sublit} from "@/api/erp/assembly/assemblyApi";
   let globalTableRef=ref();
   let salechartRef =ref()
   let arrivalchartRef =ref()
   let saleAdjustDialogRef=ref();
   let goodsDeatilsRef=ref();
   let shipRecordDialogRef=ref();
   let splitPlanDialogRef=ref();
   let myHeaderRef =ref();
   let remarksRef =ref()
   let extendTableRefs=[];
   const state = reactive({
     // 表格树数据
     tableData: {records:[],total:0}  ,
     // 弹窗属性
     dialog: { visible: false }  ,
     // 查询参数
     queryParams: {} ,
	 expendRows:[],
	 isExpendAll:false,
	 exploading:false,
	 closeloading:false,
	 transtypeOptions:[],
     // 表单数据
     formData: { } ,
	 overseaOptions:[],
     // 表单参数校验
   });
   const {
     tableData,
     queryParams,
	 transtypeOptions,
	 exploading,
	 closeloading,
	 isExpendAll,
     formData,
   } = toRefs(state);
   function handleEmtpy(){
	   
   }
   function remarkConfirm(formdata){
	   state.tableData.records.forEach(row=>{
		   if(row.id==formdata.materialid){
			   row.notice=formdata.mark;
		   }
	   })
   }
    function getAssembliyList(row){
		if(!row["assemblyList"]){
			row.assloading=true;
			sublit({materialid:row.id,warehouseid:state.queryParams.warehouseid}).then(res=>{
				row.assemblyList=res.data;
				row.assloading=false;
			});
		}
	}
	function handleQuery(params){
		state.queryParams=params;
		state.tableData.records.forEach(item=>{
			if(state.expendRows.includes(item.id)){
				if(item.rowstatue){
				   item.rowstatue.isexpends=false;
				} 
				globalTableRef.value.toggleRowExpansion(item,false);
			}
		});
		
		globalTableRef.value.loadTable(params);
	}
	function handleQueryInventoryQty(row){
		if(!row["hasInvData"]){
			inventoryApi.getInventory({warehouseid:state.queryParams.warehouseid,materialid:row.id}).then(res=>{
				row.canconsumable=res.data.canconsumable;
				row.hasInvData=true;
			})
		}
	}
	function expendAll(){
		if(state.isExpendAll==true){
			state.closeloading=true;
			state.isExpendAll=false;
			state.tableData.records.forEach(row=>{
				   if(row.rowstatue.isexpends==true){
				      globalTableRef.value.toggleRowExpansion(row);
				   }
			});
		}else{
		   state.exploading=true;
		   state.isExpendAll=true;
		   state.tableData.records.forEach(row=>{
			     if(row.rowstatue.isexpends==false){
			        globalTableRef.value.toggleRowExpansion(row);
				 }
		   })
		}
	}
   /* 销量报表 */
   function handlesaleChart(row){
	   var groupid=row.groupid;
	   var marketplaceid="";
	   var amazonAuthId="";
	   var sku="";
	   var msku=row.sku;
	   salechartRef.value.show(groupid,marketplaceid,amazonAuthId,sku,msku);
   }
	function handleShipHistory(row){
		 
	}
    function handleShowEUData(itemrow,parentrow){
		 var row =parentrow;
			var subrow=[];
			if(row.rowstatue.showeu==true){
				row.rowstatue.showeu=false;
			}else{
				row.rowstatue.showeu=true;
			}
			 if(!row["expendEuData"]){
				var param={groupid:row.groupid,msku:row.sku,warehouseid:row.warehouseid,iseu:true};
				row.rowstatue.loading=true;
				 planApi.getExpandCountryData(param).then(res=>{
								row.rowstatue.loading=false;
								if(res.data){
									res.data.forEach(item=>{
										item.amount=item.reallyamount;
										item.visible=false;
										item.iseu=true;
										row.expendData.push(item);
									});
									row.expendEuData=res.data;
								}
				})
			 } 
	}
	function showSplitRow(itemrow,parentrow){
		splitPlanDialogRef.value.show(itemrow,parentrow,state.transtypeOptions,state.overseaOptions);
	}
	function handleShowProductDetail(itemrow,parentrow){
		goodsDeatilsRef.value.show(itemrow);
	}
	function handleShowSalesAdjust(itemrow,parentrow){
		saleAdjustDialogRef.value.show(itemrow,parentrow);
	}
	function handleShowShipRecord(itemrow,parentrow){
		shipRecordDialogRef.value.show(itemrow,parentrow);
	}
	function handleSplitRow(splitRows,itemrow,parentrow){
		  if(splitRows.length>0){
			   itemrow.subnum=2;
			   var sumamount=0;
			    splitRows.forEach(row=>{
			   	    sumamount+=parseInt(row.amount);
			    })
			   itemrow.reallyamount=sumamount;
			   itemrow.splitRows=splitRows;
		  }else{
			    itemrow.subnum=0;
				
		  }
		
		 
	}
	function showShipRecord(row){
	   
	}
   /* 预计到货报表 */
   function handlarrivalChart(row){
	   var groupid=row.groupid;
	   var marketplaceid="";
	   var amazonAuthId="";
	   var sku="";
	   var msku=row.sku;
	   arrivalchartRef.value.show(groupid,marketplaceid,amazonAuthId,sku,msku)
   }
 
   function loadTableData(params,callback){
	if(state.isExpendAll==true){
	   expendAll();
	   }
	   planApi.getShipPlanList(params).then(res=>{
		   state.tableData.records=res.data.records;
		   state.tableData.total=res.data.total;
		   if(res.data.records){
			   res.data.records.forEach(item=>{
				   item.rowstatue={
					   isplan:false,
					   isexpends:false,
					   isEdit:false,
					   loading:false,
					   showeu:false,
				   };
				   item.expendData=[];
				   if(item.amount){
						item.rowstatue.isplan=true;
				   }
			   });
		   }
	   }); 
   }
   function expendRow(row){
	  globalTableRef.value.toggleRowExpansion(row)
   }
  function handleAdd(row){
	  row.rowstatue.isEdit=true;
	   if(!state.expendRows.includes(row.id)){
			globalTableRef.value.toggleRowExpansion(row);
	   }
  }
  function handleCancel(row){
	  row.rowstatue.isEdit=false;
	  loadDetail(row);
  }
  function handleDelete(row){
	     if(row.rowstatue.isplan==true){
			 planApi.remove({warehouseid:row.warehouseid,msku:row.msku,groupid:row.groupid}).then(res=>{
			 	row.rowstatue.isplan=false;
			 	row.rowstatue.isEdit=false;
			 	ElMessage({ message: "删除成功", type: 'success', });
				loadDetail(row);
				myHeaderRef.value.handleQuerySummary();
			 });
		 }
  }
   function savePlanItem(planData,row){
	   planApi.save(planData).then(res=>{
		   if(res.data>0){
			   row.rowstatue.isplan=true;
			   row.rowstatue.isEdit=false;
			   ElMessage({ message: "加入计划并保存", type: 'success', });
		    }
	   		loadDetail(row);
	   		myHeaderRef.value.handleQuerySummary();
	   	});
   }
 
   function submitForm(row){
	   var planData=[];
	   var tableData=row.expendData;
	   var quantity=0;
	   if(row.quantity){
		   quantity=row.quantity;
	   }
	   if(row["canAssembly"]){
		  quantity=quantity+parseInt(row.canAssembly); 
	   }
	   var error="";
	   if(tableData&&tableData.length>0){
		   var haseu=false;
		   var boxerror=false;
		   tableData.forEach(item=>{
		   		   if(item.amount>0&&item.iseu==true){
		   			   haseu=true;
		   		   }
		   });
		   tableData.forEach(item=>{
			      if(item.subnum>0&&item.splitRows){
					   item.splitRows.forEach(subitem=>{
						   var row=JSON.parse(JSON.stringify(item));
						   if(row.boxnum>0&&subitem.amount%row.boxnum>0){
						   		 boxerror=true;
						    }
						    quantity=quantity-subitem.amount;
							row.amount=subitem.amount;
							row.transtype=subitem.transtype;
							row.subnum=0;
							row.overseaid=subitem.overseaid;
							planData.push(row); 
					   })
				  } else if(item.amount>0){
					   if(haseu==true){
						   if(item.marketplaceid=='EU'){
							 item.amount=0;
							 item.splitRows=[];
						   }
					   } 
					   if(row.boxnum>0&&item.amount%row.boxnum>0){
						   boxerror=true;
					   }
					 quantity=quantity-item.amount;
					 planData.push(item); 
		   		}
				   
		   });
		   if(quantity<0){
			   error=error+"库存不足，";
		   }
		   if(boxerror==true){
		   	  error=error+"不符合箱规【"+row.boxnum+"】，";
		   }
		   if(planData.length==0){
			   ElMessage({ message: '没有可以保存的发货计划', type: 'warning', });
			   return ;
		   }
		   if(error!=""){
			   ElMessageBox.confirm(
			   	    error+'您确定要加入发货计划吗?',
			   	    '加入计划',
			   	    {
			   	      confirmButtonText: '确定',
			   	      cancelButtonText: '取消',
			   	      type: 'warning',
			   	    }
			   	  ).then( () => {savePlanItem(planData,row);})
		   }else{
			   savePlanItem(planData,row);
		   }
	   }else{
		 row.rowstatue.isplan=false;
		 row.rowstatue.isEdit=false;  
	   }
	
   }
   function handleRowClassName({row,rowindex}){
	   if(row.rowstatue.isplan){
	   		   return 'selectedtr';
	   } else{
		   return '';
	   }
	  
   }
   function handleConfirm(status,row){
	    row.rowstatue.isEdit=status.isEdit;
		row.rowstatue.isplan=status.isplan;
   }
   /* 隐藏产品 */
   function hideProduct(row){
	   markApi.hide({materialid:row.id}).then(res=>{
	   		    row.displayState = true;
				ElMessage({
							message: '产品已隐藏！',
							type: 'success',
				})
	   })
   }
   
   function showProduct(row){
	   markApi.show({materialid:row.id}).then(res=>{
		    row.displayState = true
	   })
   }
   function tableRowClick(row){
	   globalTableRef.value.toggleRowExpansion(row);
   }
   function loadDetail(row){
			 	row.rowstatue.loading=true;
				var subrow=[];
				 var quantity=row.quantity;
				 if(row["canAssembly"]){
				 		  quantity=quantity+parseInt(row.canAssembly); 
				 }
				 row.rowstatue.showeu=false;
				 row.expendEuData=null;
			 	 var param={groupid:row.groupid,msku:row.sku,warehouseid:row.warehouseid,iseu:false};
				 planApi.getExpandCountryData(param).then(res=>{
			 	    row.rowstatue.loading=false;
			 		if(res.data){
						var reallyamount=0;
			 			res.data.forEach(item=>{
			 				if(!item.amount){
			 					item.amount=0;
			 				}
							if(item.reallyamount){
								item.amount=item.reallyamount;
								quantity=quantity-item.amount;
								reallyamount+=item.reallyamount;
							}else if(quantity-item.amount>0){
								item.amount=item.amount;
								quantity=quantity-item.amount;
							}else if(quantity>0){
								item.amount=quantity;
								quantity=0;
							}else{
								item.amount=0;
								quantity=0;
							}
							item.setstockingcycles=item.cycle.stockingCycle;
							item.iseu=false;
							item.visible=false;
							if(item.marketplaceid=='EU'&&item.subnum>1){
								handleShowEUData(item,row);
							}
							subrow.push(item);
			 			});
						row.amount=reallyamount;
						row.expendData=subrow;
			 		}
			 	 })
			 }
   function handleExpandChange(row,expandedRows){
		 state.expendRows=[];
		 expandedRows.forEach(item=>{
			 state.expendRows.push(item.id);
		 });
	    if(expandedRows.length==state.tableData.records.length){
			state.exploading=false;
		}
		if(expandedRows.length==0){
			state.closeloading=false;
		}
		 if(row.rowstatue.isexpends==false){
			 if(row.expendData.length>0){
				  row.rowstatue.isexpends=true
			 }else{
				 loadDetail(row);
				 row.rowstatue.isexpends=true
			 }
		 }else{
			  row.rowstatue.isexpends=false
		 }
   }
   function loadOverSeaWarehouse(){
	   warehouseApi.getOversaWarehouseUseable().then((res)=>{
	   		res.data.push({"id":"","name":"FBA仓"})
	   	    state.overseaOptions=res.data;
		});
   }
   function loadTransTypeAllList(){
   		transportationApi.getTransTypeAll().then((res)=>{
			if(res.data){
					state.transtypeOptions=res.data;
			}
   		});
   }
   onMounted(()=>{
	   loadTransTypeAllList();
	   loadOverSeaWarehouse();
   })
   /* 编辑公告 */
   function editRemarks(row){
	   remarksRef.value.show(row.id);
   }
</script>

<style>
	.r_active{
		background-color: var(--el-dropdown-menuItem-hover-fill);
	    color: var(--el-dropdown-menuItem-hover-color);
		}
	.expand-table{
		padding-left:24px;
		padding-right:24px;
	}
	.flex-center-bew{
		display: flex;
		align-items: center;
	}
	.flex-center-bew .el-link{
		margin-right:8px;
	}
	.border-line li{
		line-height:40px;
     }
	 .opt-td-div span{
		 padding-left:4px;
		 padding-right:4px;
		 margin-right:4px;
		 margin-left:4px;
	 }
	 .selectedtr {
	    
	 }
	 .selectedtr td:nth-child(n+1){
		  background-color: #fff3ec;
	 }
	 .selectedtr td:first-child{
		  background-image: url('~@/assets/image/pages/shipplan/ship_plan_checked.png');
	      background-color: #fff3ec;
		  background-repeat: no-repeat;
		  background-size: 42px 42px;
	 }
 
	 .waring-bg{background-color: var(--el-color-primary-light-9)!important;}
</style>
