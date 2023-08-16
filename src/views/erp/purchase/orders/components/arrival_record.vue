<template>
	<el-table :data="tableData" border>
	     <el-table-column prop="amount" label="入库数量" >
			  <template #default="scope">
				  <div style="padding-left:5px">{{scope.row.amount}}</div>
			 <el-popover
			     placement="left"
			     title="上架"
			     :width="240"
			     :visible="scope.row.showshelf"
			 	  @show="getOptionsData(scope.row.warehouseid)"
			   >
			     <template #reference>
			  
			        <el-button
			        type="primary"
					@click="scope.row.showshelf=!scope.row.showshelf"
			        link
			       >上架
			      </el-button> 
			     </template>
			 				   <el-form>
			 					   <el-form-item label="库位选择">
			 						   <el-cascader
			 						    :teleported = "false"
			 						    :options="optionsShelf" :props="props1" v-model="scope.row.shelf" filterable clearable placeholder="可搜索" />
			 					   </el-form-item>
			 					   <el-form-item label="上架数量">
			 						   <el-input type="number" v-model="scope.row.shelfNum"></el-input>
			 					   </el-form-item>
			 				   </el-form>
			 				    
			 					<el-button class="m-t-8" @click="submitShelfUp(scope.row)" type="primary">提交</el-button>
			   </el-popover>
			   <el-popover
			       placement="left"
			       title="上架"
			       :width="340"
			       trigger="click"
			   	   @show="loadShefRecord(scope.row)" >
			       <template #reference>
			    
			          <el-button
			          type="primary"
			          link
					  v-if="scope.row.recordlist&&scope.row.recordlist.length>0"
			         >  查看记录
			        </el-button> 
					<el-button
					  type="info"
					  link
					  v-else
					 >  暂无记录
					</el-button> 
			       </template>
				   <el-table :data="scope.row.recordlist" size="small" border>
				   	<el-table-column label="库位" >
				   		<template #default="scope">
				   		      {{scope.row.shelfname}}
				   		</template>
				   	</el-table-column>
				   	<el-table-column label="操作" prop="quantity">
				   		<template #default="scope">
				   			<span v-if="scope.row.opt==0">下架：</span>
				   			<span v-else>上架：</span>
				   			    {{scope.row.quantity}}
				   			<p class="font-extraSmall">
				   			    {{scope.row.opttime}}
				   			</p>
				   		</template>
				   	</el-table-column>
				   </el-table>
			     </el-popover>
			   </template>
			   </el-table-column>
	     <el-table-column prop="warehousename" label="操作仓库"  />
		 <el-table-column prop="ftype" label="操作类型"  >
			 <template #default="scope">
				<span v-if="scope.row.ftype=='in'">收货</span>
				<span v-if="scope.row.ftype=='out'">退货</span>
				<span v-if="scope.row.ftype=='clear'">撤销</span>
			</template>
		 </el-table-column>
		  <el-table-column prop="operator" label="操作人" />
		  <el-table-column prop="remark" label="备注" />
		  <el-table-column prop="opttime" label="操作时间"    >
			   <template #default="scope">
			  {{dateTimesFormat(scope.row.opttime)}}
			  </template>
			</el-table-column>
	     <el-table-column fixed="right" label="操作" width="80">
	       <template #default="scope">
			   <p> 
			   <el-button
	           type="primary"
			   link
	           @click.stop="returnReceive(scope.row.id)"
	          >撤销入库
	         </el-button></p>
	        <p> 
			 <el-button
			   type="info"
			   link
			   @click.stop="lookRecord(scope.row.id)"
			  >在线预览
			 </el-button>
			 </p>
	       </template>
	     </el-table-column>
	</el-table>
	
	<el-dialog
	    v-model="visible"
	    title="入货单详情"
	    width="50%"
	    :before-close="handleClose"
	  >
				<div id="printPage">
			 <h3>入货单</h3>
	    	 <p>
				 <el-image v-if="dataMap.image" :src="dataMap.image" class="img-60"  width="60" height="60"  ></el-image>
				 <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="img-60"  width="60" height="640"  ></el-image>
			 </p>
	    	 <p>SKU:{{dataMap.sku }}</p>
	    	 <p>操作数量:{{dataMap.amount }}</p>
	     	 <p>订单编码:{{dataMap.orderNumber}}</p>
	     	 <p>订单时间:{{dataMap.ordertime }}</p>
	     	 <p>采购数量:{{dataMap.buyamount }}</p>
	     	 <p>运单号:{{dataMap.logisticsNo }}</p>
	     	 <p>供应商:{{dataMap.supplier }}</p>
	     	 <p>操作人:{{dataMap.operator }}</p>
	     	 <p>操作时间:{{dataMap.opttime }}</p>
			 </div>
			 <template #footer>
			   <span class="dialog-footer">
			     <el-button @click="visible= false">取消</el-button>
			 	   
				 <el-button type="primary" v-print="content">
				   打印
				 </el-button>
			   </span>
			 </template>
	  </el-dialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue';
	import NullTransform from"@/utils/null-transform";
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import shelfApi from '@/api/erp/warehouse/shelf';
	import {dateFormat,dateTimesFormat} from '@/utils/index';
	import { ElMessage, ElMessageBox } from 'element-plus';
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi';
	const emit = defineEmits(['change']);
	const props1 = {
	  checkStrictly: true,
	  value:'id',
	  label:'name'
	}
	const state = reactive({
		tableData:[],
		optionsShelf:[],
		nowid:null,
		ftype:'in',
		entry:{},
		visible:false,
		dataMap:{},
		content:{id:"printPage",popTitle:""},
	})
	const {
		tableData,
		optionsShelf,
		nowid,
		ftype,
		visible,
		dataMap,
		content
	}=toRefs(state)
	function show(entry,ftype){
		state.nowid=entry.id;
		state.entry=entry;
		if(ftype=="收货"){
			state.ftype="in";
		}else{
			state.ftype="out";
		}
		state.ftype=null;
		loadtable();
	}
	function loadShefRecord(row){
		var data={};
		data.materialid=state.entry.materialid;
		data.formid=row.id;
		data.formtype="purchase";
		shelfproductApi.shelfInventoryOptProList(data).then(res=>{
			row.recordlist=res.data;
		});
	}
	function submitShelfUp(row){
		var data=[];
		var item={};
		if(row.shelf&&row.shelf.length>0){
     		item.shelfid=row.shelf[0];
		}else{
			ElMessage({
			  type: 'error',
			  message: '必须选择库位',
			})
			return;
		}
		item.materialid=state.entry.materialid;
		item.formid=row.id;
		item.formtype="purchase";
		item.quantity=row.shelfNum;
		data.push(item);
		if(row.recordlist&&row.recordlist.length>0){
			var hasqty=0;
			row.recordlist.forEach(shelfrecord=>{
				hasqty=hasqty+parseInt(shelfrecord.quantity);
			})
		}
		if(hasqty+parseInt(row.shelfNum)>parseInt(row.amount)){
			ElMessageBox.confirm(
			   '您的上架数量将大于收货数量，请确认是否继续?',
			   'Warning',
			   {
			     confirmButtonText: '确认',
			     cancelButtonText: '取消',
			     type: 'warning',
			   }
			 )
			   .then(() => {
				   shelfproductApi.addShelfInventory(data).then(res=>{
				   	loadShefRecord(row);
				   	row.showshelf=false;
				   	ElMessage({
				   	  type: 'success',
				   	  message: '上架成功',
				   	})
				   });
			   })
		}else{
			shelfproductApi.addShelfInventory(data).then(res=>{
				loadShefRecord(row);
				row.showshelf=false;
				ElMessage({
				  type: 'success',
				  message: '上架成功',
				})
			});
		}
	
	}
	function shelfname(value){
		if(value&&value.length>0){
			value.forEach(item=>{
					item.name=item.number+"-"+item.name;
					if(item.children){
						shelfname(item.children);
					}
			})
		}
	}
	function getOptionsData(warehouseid){
		shelfApi.getWarehouseShelf(warehouseid).then(function(res){
						 if(res){
							 if(res.data&&res.data.length==1){
								 state.optionsShelf=res.data[0].children;
								 shelfname(state.optionsShelf);
							 }else{
								 state.optionsShelf=[];
							 }
			            }
		});
	}
	
	function loadtable(){
		purchaselistApi.getRecdetail({"id":state.nowid,"ftype":"rec","paytype":state.ftype}).then((res)=>{
			if(res.data && res.data.receivelist){
					state.tableData=res.data.receivelist;
					state.tableData.forEach(row=>{
						loadShefRecord(row);
					})
			}
		});
	}
	function returnReceive(rowid){
		purchaselistApi.clearRec({"recid":rowid}).then((res)=>{
			if(res.data && res.data !=""){
				ElMessage({
				  type: 'success',
				  message: '撤销成功',
				})
				loadtable();
				emit("change");
			}
		});
	}
	function lookRecord(rowid){
		purchaselistApi.reviewPruchaseStockPage({"recid":rowid}).then((res)=>{
			if(res.data){
				 state.visible=true;
				 state.dataMap=res.data;
			}
		});
		
	}
	defineExpose({
		show,
	})
</script>

<style scoped>
	.img-60{width: 60px;
	height: 60px;flex: none;
	margin-right: 8px;}
</style>
