<template>
	<div class="main-sty">
		<div class="con-body">
			 <el-row >
				<el-col :span="24">
					<div style="margin-bottom: 10px;" >
						<el-tabs v-model="queryParam.status" @tab-change="handleQuery">
							<el-tab-pane label="全部"   name=""   ></el-tab-pane>
							<el-tab-pane label="未成单" :name="0"   ></el-tab-pane>
							<el-tab-pane label="已成单" :name="1"   ></el-tab-pane>
							<el-tab-pane label="已结束" :name="5"   ></el-tab-pane>
							<el-tab-pane label="已删除" :name="6"   ></el-tab-pane>
						</el-tabs>	
						<el-space>
						<el-button  type="primary" @click="showOrderDialog" >生成询价订单</el-button>
						<el-button  @click="handleDelect" >删除</el-button>
						<Datepicker ref="datepickers" @changedate="changedate"  :shortIndex="1"/>
						<el-input  v-model="queryParam.search" style="width:600px" clearable   @clear="handleQuery" placeholder="请输入货件号,询价单号,SKU,地址,国家,店铺,备注" class="input-with-select" >
						   <template #append>
						     <el-button @click.stop="handleQuery">
						        <el-icon class="ic-cen font-medium">
						         <search />
						      </el-icon>
						     </el-button>
						   </template>
						 </el-input>
						</el-space>
					</div>
					 <GlobalTable ref="globalTable"
					  :tableData="tableData"  
					    height="calc(100vh - 250px)"  
					  :defaultSort="{ prop: 'shipmentid', order: 'descending' }"  @loadTable="loadTableData" :stripe="true"  
					  style="width: 100%;margin-bottom:16px;"
					  @selectionChange='selectChange' 
					  >
					  <template #field>
						 <el-table-column fixed type="selection" width="38" />
						  <el-table-column label="货件信息" prop="shipmentid"   sortable="custom"  width="220"   >
						  			<template #default="scope">
										  {{scope.row.shipmentid}}
										 <div class="font-extraSmall">{{scope.row.name}}</div> 
						  			</template>
						   </el-table-column>
						 
						  <el-table-column label="状态" prop="number"  sortable="custom"   width="150"   >
						  			<template #default="scope">
										<el-tag type="danger" v-if="scope.row.status===0">未询价</el-tag>
										<el-tag type="info" v-else-if="scope.row.status===5">已结束</el-tag>
										<el-tag type="info" v-else-if="scope.row.status===6">已删除</el-tag>
										<el-popover
										title="对应订单"
										placement="right"
										trigger="click"
										width="600px"
										>
										<el-table :data="scope.row.orderList">
											<el-table-column label="订单号" prop="number"></el-table-column>
											<el-table-column label="状态" >
												<template #default="scope">
													<el-tag
													 v-if="!scope.row.quotationPriceList.length"
													type="danger" effect="plain">未报价</el-tag>
													<el-tag v-else type="success" effect="plain">已报价</el-tag>
												</template>
											</el-table-column>
											<el-table-column label="备注" prop="remark"></el-table-column>
											<el-table-column label="报价" ></el-table-column>
										</el-table>
										<template #reference>
										<el-space
										class="pointer"
										v-if="scope.row.status===1"> 
										<el-tag  type="success">已询价</el-tag>
										<el-icon><View /></el-icon>
										</el-space> 
										</template>
										</el-popover>
										<div><span class="font-extraSmall">编码:{{scope.row.number}}</span>  </div>
						  			</template>
						   </el-table-column>
						   
						   <el-table-column label="地址信息" prop="destination"  sortable="custom"   width="175"    show-overflow-tooltip>
						   			<template #default="scope">
						   				 <div>{{scope.row.destination}}({{scope.row.country}}<span v-if="scope.row.area">-{{scope.row.area}}</span>
										 <span v-if="scope.row.address.stateOrProvinceCode">-{{scope.row.address.stateOrProvinceCode}}</span>)</div> 
										  <div class="font-extraSmall">{{scope.row.groupname}}
										  <el-tag v-if="scope.row.isfar" type="danger" size="small">偏远</el-tag>
										  </div> 
						   			</template>
						    </el-table-column>
						   <el-table-column label="询价人" prop="destination"  sortable="custom"   width="118"    show-overflow-tooltip  >
								<template #default="scope">
									 <div v-show="scope.row.buyername">{{scope.row.buyername}}</div> 
									  <div class="font-extraSmall">{{scope.row.buyerothername}}</div> 
								</template>
						    </el-table-column>
							<el-table-column label="仓库" prop="destination"  sortable="custom"   width="120"      >
										<template #default="scope">
											 <div>{{scope.row.warehousename}} </div> 
										</template>
							 </el-table-column>
							<el-table-column label="重量" prop="weight"     width="90" sortable="custom"   >
								<template #default="scope">
									 <div>{{scope.row.weight}}(kg)</div> 
								</template>		 
							 </el-table-column>
							 <el-table-column label="体积" prop="volume" width="120"    sortable="custom"   >
							 	<template #default="scope">
							 		 <div>{{scope.row.volume}}(cm³)</div> 
									 <div>{{formatFloat(scope.row.volume/1000000.0)}}(m³)</div> 
							 	</template>		 
							  </el-table-column>
							  <el-table-column label="SKU数量" prop="num"   width="100"  sortable="custom"    >
							  	<template #default="scope">
							  		 <div>{{scope.row.num}} </div> 
							  	</template>		 
							   </el-table-column>
							 <el-table-column label="地址" prop="address"  show-overflow-tooltip >
								 <template  #default="scope">
									 <p>{{scope.row.address.addressLine1}}</p>
									 <p>{{scope.row.address.city}}<span v-if="scope.row.address.stateOrProvinceCode">,{{scope.row.address.stateOrProvinceCode}}</span>,{{scope.row.address.postalCode}},{{scope.row.address.countryCode}}</p>
								 </template>
							 </el-table-column>
							<el-table-column label="备注" prop="remark"  sortable="custom"    >
								<template #default="scope">
									
									<el-tooltip placement="left-start"   >
											 <template #content><div style="max-width:400px;"  v-html="scope.row.remark"></div></template>
											 <div @click="showRemark(scope.row)" class="table-edit-flex">
									             <span class="text-omit-3" v-html="scope.row.remark"> </span>
											     <el-icon class="pointer" ><Edit/></el-icon>
										    </div>
									      </el-tooltip>
												
								</template>
							</el-table-column>
							<el-table-column label="操作时间" prop="opttime"  sortable="custom"   width="120" >
								<template  #default="scope">
									{{dateFormat(scope.row.opttime)}}
								</template>
							</el-table-column>
							
							<el-table-column label="操作" prop="remark"   width="200" >
								<template #default="scope">
									<el-space wrap>
										<el-popover
										    title="箱子信息"
											placement="left" 
											:width="550"
										    trigger="click"
										  >
										  <el-table :data="scope.row.boxList" height="250px">
												 <el-table-column label="ID" prop="boxid"      >
												 </el-table-column>			
												 <el-table-column label="长(cm)" prop="length"  width="70"     >
												 </el-table-column>			
												 <el-table-column label="宽(cm)" prop="width"   width="70"    >
												 </el-table-column>			
												 <el-table-column label="高(cm)" prop="height"   width="70"    >
												 </el-table-column>			
												 <el-table-column label="重(kg)" prop="weight"     width="70"  >
												 </el-table-column>	
										  </el-table>
										    <template #reference>
										      <el-button type="primary" link class="m-2">箱子详情</el-button>
										    </template>
										  </el-popover>
										<el-popover
										    title="产品详情"
											placement="left" 
											:width="550"
										    trigger="click"
										  >
										 <el-table :data="scope.row.itemList" height="250px">
													<el-table-column label="图片" prop="sku"    width="70"     >
															<template #default="shipscope">
																<el-image  style="width:45px;height:45px" :src="shipscope.row.image" />
																</template>
													</el-table-column>	
															<el-table-column label="品名" prop="name"         >
																<template #default="shipscope">
																	<div>{{shipscope.name}}</div>
																	<div>{{shipscope.ename}}</div>
																	</template>
															</el-table-column>	
																	<el-table-column label="SKU" prop="sku"         >
																	</el-table-column>			
															<el-table-column label="材质" prop="material"      >
															</el-table-column>	
															<el-table-column label="数量" prop="quantity"    width="70"    >
															</el-table-column>
										 </el-table>
										    <template #reference>
										      <el-button type="primary" link class="m-2" v-hasPerm="'erp:pi:list:item'" v-if="isowner">产品详情</el-button>
										    </template>
										  </el-popover>
									</el-space>
								</template>	
							</el-table-column>
					  </template>
				</GlobalTable>
				</el-col>
			 </el-row>
		</div>
	</div>
	
	<el-dialog v-model="quoteVisiable" title="询价订单信息" width="600px">
			<el-form-item label="报价类型"> 
				<el-select v-model="quoteOrder.ftype">
					<el-option label="批量报价" value="2"  key="2"></el-option>
					<el-option label="地址报价" value="3" key="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="结束时间">
					 <el-date-picker v-model="quoteOrder.closetime"
						type="date"
						placeholder="选择日期"
						:size="size">
					 </el-date-picker>
			</el-form-item>
			<el-form-item label="是否竞价">
					 <el-checkbox v-model="quoteOrder.isbidding" label="" size="large" />
			</el-form-item>
			  
			<el-form-item label="订单备注">
				<el-input   v-model="quoteOrder.remark"></el-input>
			</el-form-item>
		  <template #footer>
		  		<el-button @click="saveOrder"   type="primary">确认生成</el-button>
		  	<el-button @click="quoteVisiable=false"  >关闭</el-button>
		  </template>
	</el-dialog>
	
	<el-dialog v-model="remarksVisable" title="货件备注" :destroy-on-close='true' width="400px"  >
			<el-row :gutter="32">
				<el-col :span="24"  >
					<el-input v-model="selectRow.editremark" placeholder="输入备注" :rows="8"  type="textarea"  />
				</el-col>
			</el-row>
	  <template #footer>
	  	<span class="dialog-footer">
			<el-button   type="primary" @click.stop="submitRemark" >提交</el-button>
	  		<el-button @click="remarksVisable = false"> 关闭</el-button>
	  	</span>
	  </template>
	</el-dialog>
	
	<Supplier ref="supplierRef" @change="handleOrderQuery"></Supplier>
</template>

<script setup>
	import {Search,ArrowDown,Edit,View} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne, Form} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,toRefs,nextTick } from 'vue'
	import thirdpartyApi from "@/api/erp/thirdparty/thirdpartyApi.js";
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import shipmentPlacementApi from '@/api/erp/shipv2/shipmentPlacementApi.js';
	import orderApi from '@/api/quote/orderApi.js';
	import Datepicker from '@/components/header/datepicker.vue';
    import {ElMessage,ElMessageBox } from 'element-plus';
	import {dateFormat,dateTimesFormat,CheckInputFloat,formatFloat} from '@/utils/index';
	import Supplier from './supplier.vue';
	import supplierApi from '@/api/quote/supplierApi.js';
	const globalTable=ref();
	const orderGlobalTable=ref();
	const supplierRef=ref();
	const buyerRef=ref();
	const state = reactive({
		tableData:{records:[],total:0},
		queryParam:{
			 token:null,
			 status:0,
		},
		selectRows:null,
		selectRow:null,
		selectOrderRows:null,
		quoteVisiable:false,
		remarksVisable:false,
		isowner:false,
		quoteOrder:{
			ftype:"2",
			closetime:null,
			remark:null,
			shipmentids:null,
		},
		
	})
	const{
		 queryParam,tableData,selectRows,selectRow,quoteVisiable,quoteOrder,selectOrderRows,remarksVisable,isowner,
	}=toRefs(state)
	

	function showDetail(){
		
	}
 function showRemark(row){
 	state.selectRow=row;
	state.selectRow.editremark=row.remark;
 	state.remarksVisable=true;
 }
 //日期改变
 function changedate(dates,value,type){
 	state.queryParam.fromDate=dates.start;
 	state.queryParam.toDate=dates.end;
	if(type!="load"){
 	    handleQuery();
	}
 }
 function submitRemark(){
 	orderApi.updateShipmentRemark({"shipmentid":state.selectRow.shipmentid,"remark":state.selectRow.editremark}).then(res=>{
		state.remarksVisable=false;
		handleQuery();
	})
 }
	function handleQuery(){
		 globalTable.value.loadTable(state.queryParam);
	}
	function loadTableData(params){
		  orderApi.listShipment(params).then(res=>{
				 state.tableData.records=res.data.records;
				 state.tableData.total=res.data.total;
		  }).catch(e=>{
			  state.tableData.records=[];
			  state.tableData.total=0;
		  })
	}
	function selectChange(selection) {
		 state.selectRows=selection;
	}
	function selectOrderChange(selection){
		 state.selectOrderRows=selection;
	}
	
	function saveOrder(){
		if(state.selectRows&& state.selectRows.length>0){
			var lists=[];
			state.selectRows.forEach(item=>{
				lists.push(item.shipmentid);
			});
			state.quoteOrder.shipmentids=lists;
			orderApi.saveOrder(state.quoteOrder,state.queryParam.token).then(res=>{
				 ElMessage.success("生成订单成功!");
				 state.quoteVisiable=false;
				 handleQuery();
			})
		}else{
			 ElMessage.error("至少选择一行数据!");
		}
	}
	function handleDelect(){
		if(state.selectRows&& state.selectRows.length>0){
			var lists=[];
			state.selectRows.forEach(item=>{
				lists.push(item.shipmentid);
			});
			orderApi.deleteShipment(lists).then(res=>{
				 ElMessage.success("删除成功!");
				 handleQuery();
			})
		}else{
			 ElMessage.error("至少选择一行数据!");
		}
	}
	function showOrderDialog(){
		if(state.selectRows&& state.selectRows.length>0){
			state.quoteVisiable=true;
		}else{
			 ElMessage.error("至少选择一行数据!");
		}
	}
	function showSupplierDialog(){
		if(state.selectOrderRows&& state.selectOrderRows.length>0){
			supplierRef.value.show(state.queryParam.token,state.selectOrderRows,"list");
		}else{
			 ElMessage.error("至少选择一行数据!");
		}
	}
	 
	  function loadToken(){
		  thirdpartyApi.getQuoteToken().then((res)=>{
			state.queryParam.token=res.data.buyertoken;
			state.isowner=res.data.isowner;
			if(state.queryParam.token){
				handleQuery();
			}else{
				state.tableData={records:[],total:0};
				state.orderTableData={records:[],total:0};
			}
		});
	}
	onMounted(()=>{
		      loadToken();
	});
	
</script>

<style>
</style>