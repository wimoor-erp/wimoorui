<template>
	<el-table :data="tableData" border>
	     <el-table-column prop="amount" label="入库数量" >
			  <template #default="scope">
				  <div style="padding-left:5px">{{scope.row.amount}}</div>
			      <shelfInvOpt  
				   v-if="scope.row.ftype!='clear'"
				  :materialid="entry.materialid"
				  :formid="scope.row.id"
				  :warehouseid="scope.row.warehouseid"
				  :amount="scope.row.amount"
				  :opt="scope.row.ftype=='in'?'1':'0'"
				   formtype="purchase"></shelfInvOpt>
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
			   v-if="scope.row.ftype!='clear'"
	           @click.stop="returnReceive(scope.row.id,scope.row)"
	          >
			  <span v-if="scope.row.ftype=='in'">撤销入库</span>
			  <span v-if="scope.row.ftype=='out'">撤销出库</span>
	         </el-button></p>
	        <p> 
			 <el-button
			   type="info"
			   link
			   @click.stop="lookRecord(scope.row.id)"
			  >预览
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
	import shelfInvOpt from "@/views/erp/components/shelfInvOpt.vue"
	const emit = defineEmits(['change']);
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
		entry,
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
	
 
	function loadtable(){
		purchaselistApi.getRecdetail({"id":state.nowid,"ftype":"rec","paytype":state.ftype}).then((res)=>{
			if(res.data && res.data.receivelist){
				state.tableData=res.data.receivelist;
			}
		});
	}
	function returnReceive(rowid,row){
		purchaselistApi.clearRec({"recid":rowid}).then((res)=>{
			if(res.data && res.data !=""){
				ElMessage({
				  type: 'success',
				  message: '撤销成功',
				})
				row.ftype="clear";
				row.remark="已撤销【通过撤销入库操作】";
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
