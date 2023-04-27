<template>
	<el-table :data="tableData" border>
	     <el-table-column prop="amount" label="入库数量" />
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
	import {dateFormat,dateTimesFormat} from '@/utils/index';
	import { ElMessage, ElMessageBox } from 'element-plus';
	const emit = defineEmits(['change']);
	const state = reactive({
		tableData:[],
		nowid:null,
		ftype:'in',
		visible:false,
		dataMap:{},
		content:{id:"printPage",popTitle:""},
	})
	const {
		tableData,
		nowid,
		ftype,
		visible,
		dataMap,
		content
	}=toRefs(state)
	function show(id,ftype){
		state.nowid=id;
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
