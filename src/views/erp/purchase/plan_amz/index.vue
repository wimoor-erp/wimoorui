<template>
 
	 <Header ref="myHeaderRef" @change = "handleQuery"/>
	 	 
	 <div class=" expand-table">
		 <GlobalTable ref="globalTableRef"
		 :tableData="tableData"  
		 :size="10"
		 @loadTable="loadTableData" 
		 :defaultSort="{ prop: 'marketneedpurchase', order: 'descending' }"  
		 rowKey="id"
		 @row-click="tableRowClick"
		 :rowClassName="handleRowClassName"
		 @expandChange="handleExpandChange"
		 >
		<template #field>
		<el-table-column type="expand" width="45">
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
		<el-table-column prop="img" label="图片" width="65" >
		   <template #default="scope">
		    <el-image :src="scope.row.image" class="product-img" ></el-image>
		  </template>
		</el-table-column>
		<el-table-column prop="sku" label="名称/SKU" :sort-orders="sortOrders" sortable='custom' min-width="250" >
		   <template #default="scope">
			   <el-tooltip  placement="top" :content="scope.row.name" :show-after="200">
		      <div class='font-name text-omit-1'>{{scope.row.name}}</div>
			  </el-tooltip>
			  <div @mouseenter.stop="handleEmtpy">
			  <el-space :size="8">
		        <el-link  @click.stop="productDetails(scope.row)" class="font-sku">{{scope.row.sku}} </el-link>
				<span v-if="scope.row.issfg=='1'" @click.stop="handleEmtpy" >
				<AssemblyDialog @change="getAssembliyList(scope.row)" :loading="scope.row.assloading" :assemblyList="scope.row.assemblyList">
										  <template #field>
											  <el-tag 
											  title="组合产品"
											  type="warning" class="pointer" v-if="scope.row.issfg=='1'"
											  size="small" 
											 >组合</el-tag>
										  </template>
				</AssemblyDialog>
				</span>
				<el-tag v-if="scope.row.tagNameList" effect="plain" :type="item.color"  v-for="item in scope.row.tagNameList" size="small" >
					{{item.name}}
				</el-tag>
			  </el-space>
			  <el-row>
			  <el-space  class="font-extraSmall"  :size="4" :spacer="spacer">
				  
				  <div @click.stop="handleEmtpy" >
					  <el-popover
					      placement="top"
					      title="阶梯采购价"
					      :width="200"
					  	  trigger="click"
					  	  @show="getWisePriceList(scope.row)"
					    >
					      <template #reference>
					       <span v-if="scope.row.price" class="pointer " >￥{{scope.row.price}}</span> 
					  				   <span v-else >-</span> 
					      </template>
					  	<el-table :data="pricelist" v-loading="loading">
					  		<el-table-column label="起订量" prop="amount"></el-table-column>
					  		<el-table-column label="单价" prop="price"></el-table-column>
					  	</el-table>
					    </el-popover>
				  	</div>
				 <el-select class="plan-warehouse-list "  v-model="scope.row.warehouseid" @change="handleChangeWarehouse(scope.row)"  size="small"  placeholder="入库仓库"  abort="">
				       <el-option  v-for="item in plan.warehouseList"   :key="item.warehouseid"  :label="item.name" :value="item.warehouseid"   >
				       </el-option>
				 </el-select>
			
			  </el-space>
			  </el-row>
			  </div>
		  </template>
		</el-table-column>
		<el-table-column label="报表" width="80">
			<template #default="scope">
				<el-link :underline="false" style='margin-right:12px;' type="warning" @click.stop="handlesaleChart(scope.row)">
				 <el-tooltip content="销量报表" placement="top" :hide-after="0" :show-after="200">
				 <chart-histogram class="ic-cen" theme="outline" size="16" fill="#ff6700" :strokeWidth="4"/>
				 </el-tooltip>
				 </el-link>   
				 
				 <el-link :underline="false" type="danger" @click.stop="handlarrivalChart(scope.row)">
									   <el-tooltip content="预计到货报表" placement="top" :hide-after="0" :show-after="200">
				<chart-line class="ic-cen" theme="filled" size="15" fill="#529b2e"/>
				 </el-tooltip>
				 </el-link>
			</template>
		</el-table-column>
		<el-table-column label="公告"  min-width="220" >
			<template #default="scope">
					<span class="table-edit-flex" >
						<el-tooltip :content="scope.row.notice" placement="top" :hide-after="0" :show-after="200">
							<span class=" line2">{{scope.row.notice}}</span>
						</el-tooltip>
					
						<el-icon @click.stop="editRemarks(scope.row)"><Edit/></el-icon>
					</span>
			</template>
		</el-table-column>
		<el-table-column  label="采购记录" width="100">
			<template  #default="scope">
				<div  @click.stop="handleEmtpy">
			<el-popover
			    placement="top"
			    title="补货记录"
			    :width="520"
				trigger="click"
				@show="getRecordList(scope.row)"
			  >
			    <template #reference>
			      <div class="font-extraSmall pointer" v-if="scope.row.last!=''" style="width:67px;" v-html="scope.row.last"></div>
				   <span v-else>-</span>
			    </template>
				<el-table :data="recordlist" >
					<el-table-column label="日期" prop="createdate" width="120">
										<template #default="scope">
										   {{dateFormat(scope.row.createdate)}}
										</template>
									</el-table-column>
					<el-table-column label="数量" prop="amount"></el-table-column>
									<el-table-column v-if="scope.row.issfg=='1'"  label="状态" prop="auditstatusName">
									</el-table-column>
									<el-table-column v-else label="状态"  prop="auditstatusname">
									</el-table-column>
									<el-table-column label="已入库" v-if="scope.row.issfg!='1'"  prop="totalin"></el-table-column>
									<el-table-column label="已付款" v-if="scope.row.issfg!='1'"  prop="totalpay"></el-table-column>
									<el-table-column label="类型" v-if="scope.row.issfg=='1'" >
										 <template #default="scope">
										    组装单
										 </template>
									</el-table-column>
									<el-table-column label="类型"  v-else>
										 <template #default="scope">
										    采购单
										 </template>
									</el-table-column>
									
				</el-table>
			  </el-popover>
				  </div>
			  </template>
		</el-table-column>	
		
		<el-table-column label="库存" prop="quantity"  :sort-orders="sortOrders" sortable='custom'  width="110">
			<template #default="scope">
					<div @click.stop="handleEmtpy">
			       <div>
					
					<el-popover   trigger="click" @show="handleQueryInventoryQty(scope.row)" placement="top" width="400"  >
					<template  #reference>	
					   <div class=" pointer" >
							<span class="font-bold" v-if="scope.row.quantity">{{scope.row.quantity}}</span>
					        <span  class="font-bold" v-else >0</span>
					 </div>
					</template>
					 <ul class="border-line">
						 <li class="flex-center-between"><span>待入库库存</span>
						                                  <el-tag v-if="scope.row.inbound"> {{scope.row.inbound}}</el-tag>
														  <el-tag v-else> 0</el-tag>
							 </li>
						 <li class="flex-center-between"><span>可用库存</span>
						                                <el-tag type="success" v-if="scope.row.fulfillable">{{scope.row.fulfillable}}</el-tag>
														<el-tag type="success" v-else>0</el-tag>
														</li>
						 <li class="flex-center-between"><span>待出库库存</span>
						                                <el-tag type="warning"  v-if="scope.row.outbound">{{scope.row.outbound}}</el-tag>
														<el-tag type="warning"  v-else>0</el-tag>
														</li>
						 <li class="flex-center-between" v-if="scope.row.canAssembly"><span>可组装库存</span><el-tag type="info">{{scope.row.canAssembly}}</el-tag></li>
					 </ul>
					</el-popover>
					  <div class="font-extraSmall" >供货周期 {{scope.row.delivery_cycle}} 天</div>
				  </div>
				  </div>
				</template>
		</el-table-column>
       
	<el-table-column label="总需求量"
		prop="marketneedpurchase"  
		:sort-orders="sortOrders" sortable='custom' 
		 width="110">
	 	<template #default="scope">
			 <div v-if="queryParams.plansimple">
				<div class="font-bold">{{scope.row.marketneedpurchase}}</div>
			 </div>
			 <div v-else>
				<div class="font-bold">{{scope.row.needpurchase}}</div>
			 </div>
			         <span v-if="scope.row.rowstatue.isplan==false&&scope.row.prereallyamount&&parseInt(scope.row.marketneedpurchase)!=parseInt(scope.row.prereallyamount)"
			         class="font-extraSmall">建议采购:{{scope.row.prereallyamount}}</span>
	 	</template>
	 </el-table-column>
 
		<el-table-column label="实际采购量"   :sort-orders="sortOrders" sortable='custom' prop="amount" width="110">
			<template #default="scope">
				<div v-if="scope.row.rowstatue.isPEdit" @click.stop="handleEmtpy">
					<el-input v-model.number="scope.row.reallyamount"
					 @input="scope.row.reallyamount=CheckInputInt(scope.row.reallyamount)"
					  ></el-input>
					<!-- <span class="font-extraSmall">本地需求:228</span> -->
				</div>
				<div class="font-bold" v-else-if="scope.row.rowstatue.isplan">{{scope.row.amount}}
				</div>
				<div v-else><span  class="font-bold">0 </span> </div>
			</template>
		</el-table-column>

		
	 
		<el-table-column label="操作" width="150">
			<template #default="scope">
				<div class="flex-center-bew" @click.stop="handleEmtpy" >
				<el-link @click.stop="handleEmtpy"  :underline="false" type="primary" class="font-small">
					<div v-if="scope.row.rowstatue.isPEdit"  class="opt-td-div">
						<span  @click.stop="submitForm(scope.row)">保存</span>
						<span  @click.stop="handleCancel(scope.row)" style="margin-left:20">取消</span> 
					</div>
					<div v-else class="opt-td-div">
						<span   @click.stop="handleAdd(scope.row)" >编辑</span>
						<span v-if="scope.row.rowstatue.isplan" 
						       @click.stop="handleDelete(scope.row)" > 移除</span> 
					</div>
				</el-link>
				<el-dropdown  :hide-on-click="false" trigger="click">
				  <span class="el-dropdown-link" >
				    <more-one class="ic-cen" theme="outline" size="20" fill="#333" :strokeWidth="3"/>
				  </span>
				   <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item >
						  <span v-if="scope.row.ishide=='1'" @click.stop="showProduct(scope.row)">显示产品</span>
						  <span v-else  @click.stop="hideProduct(scope.row)">隐藏产品</span>
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
	<ShipRecordDialog ref="shipRecordDialogRef"></ShipRecordDialog>
	<SalechartDialog ref="salechartRef"/>
	<ArrivalDialog ref="arrivalchartRef"/>
	<RemarksDialog ref="remarksRef" @confirm="remarkConfirm"/>
    <SaleAdjustDialog ref="saleAdjustDialogRef" @confirm="loadDetail"></SaleAdjustDialog>
	<GoodsDeatils ref="goodsDeatilsRef"  />
</template>
<script setup>
	import { ref ,watch,reactive,onMounted,toRefs,h} from 'vue'
	import Expandtable from "./components/expand_table";
	import SalechartDialog from "@/views/amazon/listing/common/salechart.vue"
	import ArrivalDialog from"@/views/amazon/listing/common/arrival_dialog.vue";
	import RemarksDialog from "@/views/erp/ship/ship_plan/components/remarks_dialog.vue"
	import SaleAdjustDialog from "@/views/amazon/sales/forecast/components/sale_adjust_dialog";
	import AssemblyDialog from "@/views/erp/components/assembly_dialog";
	import ShipRecordDialog from "@/views/erp/ship/ship_plan/components/ship_record.vue"
	import GoodsDeatils from "@/views/amazon/listing/common/goods_deatils"
    import Header from "./components/header";
	// API依赖
	import planApi from '@/api/erp/ship/planApi.js';
	import inventoryApi from '@/api/erp/inventory/inventoryApi.js';
	import {Edit,ArrowRightBold,ArrowDownBold} from '@element-plus/icons-vue';
	import { ElMessage ,ElMessageBox,ElDivider} from 'element-plus'
	import transportationApi from '@/api/erp/ship/transportationApi';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import markApi from '@/api/erp/material/markApi';
	import {Help,MoreOne,ChartHistogram,ChartLine} from '@icon-park/vue-next';
	import {sublit} from "@/api/erp/assembly/assemblyApi";
	import {changeWarehouse,saveItem,deleteItem,getLast3} from '@/api/erp/purchase/plan/planApi';
	import { useRouter } from 'vue-router'
	import {CheckInputInt,dateFormat} from "@/utils/index";
	import materialApi from '@/api/erp/material/materialApi.js';
	const spacer = h(ElDivider, { direction: 'vertical' })
   let router = useRouter();
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
	   loading:true,
     // 表格树数据
     tableData: {records:[],total:0}  ,
     // 弹窗属性
     dialog: { visible: false }  ,
     // 查询参数
     queryParams: {plansimple:false} ,
	 expendRows:[],
	 isExpendAll:false,
	 exploading:false,
	 closeloading:false,
	 transtypeOptions:[],
	 sortOrders:[ 'descending','ascending', null],
     // 表单数据
     formData: { } ,
	 overseaOptions:[],
	 pricelist:[],
	 recordlist:[],
	 plan:{},
     // 表单参数校验
   });
   const {
     tableData,
     queryParams,
	 transtypeOptions,
	 exploading,
	 closeloading,
	 loading,
	 plan,
	 recordlist,
	 sortOrders,
	 isExpendAll,
	 pricelist,
     formData,
   } = toRefs(state);
   function handleEmtpy(){
	   
   }
   function statusFormatter(value) {
   	if (value == 0) {
   		return "未提交";
   	}
   	if (value == 1) {
   		return "待组装";
   	}
   	if (value == 2) {
   		return "组装中";
   	}
   	if (value == 3) {
   		return "已完成";
   	}
   	if (value == 4) {
   		return "已终止";
   	}
   	if (value == 5) {
   		return "已撤销";
   	}
   	return "";
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
			sublit({materialid:row.id,warehouseid:""}).then(res=>{
				row.assemblyList=res.data;
				row.assloading=false;
			});
		}
	}
	function getWisePriceList(row){
		state.loading= true
		materialApi.getWisePriceList({"mid":row.id}).then((res)=>{
			state.pricelist=res.data;
			state.loading= false
		});
	}
	function getRecordList(row){
		getLast3({"id":row.id}).then((res)=>{
			state.recordlist=res.data.list;
		});
	}
	function productDetails(row){
				  router.push({
				  	path:'/material/details',
				  	query:{
				  	  title:"产品详情",
				  	  path:'/material/details',
					  details:row.id
				  	}
				  })
	}
	function handleChangeWarehouse(row){
		changeWarehouse({"planid": state.plan.id,"materialid":row.id,"warehouseid":row.warehouseid}).then(res=>{
			ElMessage({ message: "修改成功", type: 'success', });
			globalTableRef.value.loadTable(params);
		});
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
				row.hasInvData=true;
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
	   salechartRef.value.show("",marketplaceid,amazonAuthId,sku,msku);
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
				var param={"groupid":itemrow.groupid,
				           "sku":itemrow.sku,
						   "warehouseid":"",
						   "plantype":"purchase",
						   "marketplaceids":state.queryParams.marketplaceids,
						   "plansimple":state.queryParams.plansimple,
						   "iseu":true,
						   "amount":0
						   };
				row.rowstatue.loading=true;
				 planApi.getExpandCountryData(param).then(res=>{
								row.rowstatue.loading=false;
								if(res.data){
									res.data.forEach(item=>{
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
 var rownum=0;
   function loadTableData(params,callback){
	if(state.isExpendAll==true){
	       expendAll();
	   }
	   params.plantype="purchase";
	   state.plan=params.plan;
	  
	   planApi.getPlanList(params).then(res=>{
		   if(res.data){
			   if(res.data.records){
			   			   rownum=0;
			   			   res.data.records.forEach(async item=>{
			   				   item.rowstatue={
			   					   isplan:false,
			   					   isexpends:false,
			   					   isPEdit:false,
			   					   loading:false,
			   					   showeu:false,
			   				   };
			   					if(!item.amount||parseInt(item.amount)<=0){
			   						       item.reallyamount=parseInt(item.needpurchase)-parseInt(item.quantity);
										   if(item.reallyamount<0){
											   item.reallyamount=0;
										   }
			   						   }
			   				   item.expendData=[];
			   				   if(item.amount&&parseInt(item.amount)>0){
			   						item.rowstatue.isplan=true;
			   				   }
							   item.prereallyamount=item.reallyamount;
			   			   });
			   }
			   state.tableData.records=res.data.records;
			   state.tableData.total=res.data.total;
		   }else{
			   state.tableData.records=[];
			   state.tableData.total=0;
		   }
		   
	   }); 
   }
   function expendRow(row){
	  globalTableRef.value.toggleRowExpansion(row)
   }
  function handleAdd(row){
	  row.rowstatue.isPEdit=true;
	   if(!state.expendRows.includes(row.id)){
			globalTableRef.value.toggleRowExpansion(row);
	   }
  }
  function handleCancel(row){
	  row.rowstatue.isPEdit=false;
	  loadDetail(row);
  }
  function handleDelete(row){
	     if(row.rowstatue.isplan==true){
			  deleteItem({"planid":state.plan.id,"materialid":row.id,"groupid":state.queryParams.groupid}).then(res=>{
			 	row.rowstatue.isplan=false;
			 	row.rowstatue.isPEdit=false;
				row.amount=0;
			 	ElMessage({ message: "删除成功", type: 'success', });
				loadDetail(row);
				myHeaderRef.value.handleQuerySummary();
			 });
		 }
  }
 function savePlanItem(plan,row){
	       if(parseInt(row.reallyamount)<=0){
			   ElMessage({ message: "计划采购量不能为0 ", type: 'error', });
			   return ;
		   }
	       saveItem({"planid":plan.id,
	                 "materialid":row.id,
					 "warehouseid":row.warehouseid,
					 "groupid":state.queryParams.groupid,
					 "amount":row.reallyamount}).then(res=>{
					row.rowstatue.isplan=true;
					row.rowstatue.isPEdit=false;
					row.amount=row.reallyamount;
					ElMessage({ message: "加入计划并保存", type: 'success', });
					loadDetail(row);
					myHeaderRef.value.handleQuerySummary();
	   	});
   }
 
   function submitForm(row){
	   var error="";
	   if(row.reallyamount){
		   if(row.boxnum&&row.reallyamount%row.boxnum>0){
		   	  error=error+"不符合箱规【"+row.boxnum+"】，";
		   }
		   if(!state.plan){
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
			   	  ).then( () => {savePlanItem(state.plan,row);})
		   }else{
			   savePlanItem(state.plan,row);
		   }
	   }else{
		 row.rowstatue.isplan=false;
		 row.rowstatue.isPEdit=false;  
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
	    row.rowstatue.isPEdit=status.isPEdit;
		row.rowstatue.isplan=status.isplan;
   }
/* 隐藏产品 */
   function hideProduct(row){
	   if(row.rowstatue.isplan){
		   ElMessage({
		   			message: '当前产品已加入计划，无法隐藏！',
		   			type: 'error',
		   });
		   return ;
	   }
	   markApi.hide({materialid:row.id}).then(res=>{
	   		    row.displayState = true;
				ElMessage({
							message: '产品已隐藏！',
							type: 'success',
				});
				handleQuery();
	   })
   }
   function showProduct(row){
   	   markApi.show({materialid:row.id}).then(res=>{
   		    row.displayState = true;
   			ElMessage({
   						message: '产品显示成功！',
   						type: 'success',
   			})
   			handleQuery();
   	   })
   }
   function tableRowClick(row){
	   globalTableRef.value.toggleRowExpansion(row);
   }
   function loadDetail(row){
			 	row.rowstatue.loading=true;
				var subrow=[];
				 row.rowstatue.showeu=false;
				 row.expendEuData=null;
			 	 var param={"groupid":"",
				            "warehouseid":"",
							"msku":row.sku,
							"plantype":"purchase",
							"marketplaceids":state.queryParams.marketplaceids,
							"plansimple":state.queryParams.plansimple,
							"iseu":false,
							"amount":row.amount};
				 planApi.getExpandCountryData(param).then(res=>{
			 	    row.rowstatue.loading=false;
			 		if(res.data){
						var needpurchase=0;
			 			res.data.forEach(item=>{
							item.setstockingcycles=item.cycle.stockingCycle;
							item.iseu=false;
							item.visible=false;
							if(item&&item.needpurchase){
							   needpurchase=needpurchase+item.needpurchase;
							}
							if(item.marketplaceid=='EU'&&item.subnum>1){
								handleShowEUData(item,row);
							}
							subrow.push(item);
			 			});
						row.needpurchase=needpurchase;
						if(row.rowstatue.isplan==false){
							row.reallyamount=parseInt(row.needpurchase)-parseInt(row.quantity);
							if(row.reallyamount<0){
							   row.reallyamount=0;
							}
						}
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

   function loadTransTypeAllList(){
   		transportationApi.getTransTypeAll().then((res)=>{
			if(res.data){
					state.transtypeOptions=res.data;
			}
   		});
   }
   onMounted(()=>{
	   loadTransTypeAllList();
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
	 .dark .selectedtr td:nth-child(n+1){
	 		  background-color: #302d2c;
	 }
	 .dark .selectedtr td:first-child{
	 		  background-image: url('~@/assets/image/pages/shipplan/ship_plan_checked.png');
	      background-color: #302d2c;
	 		  background-repeat: no-repeat;
	 		  background-size: 42px 42px;
	 }
     .local-price{
		     font-size: 14px;
		     font-weight: 600;
		     color: #f5a20c;
	 }
	 .waring-bg{background-color: var(--el-color-primary-light-9)!important;}
	 .line2{
	 	text-overflow: -o-ellipsis-lastline;
	 	overflow: hidden;				 
	 	text-overflow: ellipsis;		 
	 	display: -webkit-box;		 
	 	-webkit-line-clamp: 2;			 
	 	line-clamp: 2;					
	 	-webkit-box-orient: vertical;	 
		color: #888;
	 }
	.plan-warehouse-list .el-input__wrapper {
		 background-color: inherit;
	     box-shadow: 0 0 0 0px var(--el-input-border-color,var(--el-border-color)) inset;
	 }
	 .plan-warehouse-list .el-input__wrapper .el-input__inner{
		 color: var(--el-text-color-placeholder);
	 }
	 .plan-warehouse-list .el-input__wrapper:hover {
		background-color: var(--el-input-bg-color,var(--el-fill-color-blank));
		 background-image: none;
	  }
	 .plan-warehouse-list  .el-input__suffix{
		 opacity: 0;
	 }
	 
	.plan-warehouse-list .el-input__wrapper:hover  .el-input__suffix{
		 opacity: 1;
	 }
</style>
<style scoped="scoped">
	.font-sku{
		font-weight: 700!important;
		color: #333;
		font-size: 16px;
	}
	.font-name{
		color: #666;
	}
</style>