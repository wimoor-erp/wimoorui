<template>
	<h5>入库记录</h5>
	<el-card class="m-t-8" v-for="item in tableData" v-if="tableData.length>0">
		<div class="flex-center-between font-extraSmall">
			<span v-if="item.ftype=='in'">收货</span>
			<span v-if="item.ftype=='out'">退货</span>
			<span v-if="item.ftype=='clear'">撤销</span>
			<span>{{item.opttime}}</span>
		</div>
		<div class="flex-center-between m-t-8" >
			<span class="font-bold">
				{{item.warehousename}}
			</span>
		  </div>
			<div class="flex-center-between m-t-8" >
				<span class="font-extraSmall">数量：</span>
			<span class="font-bold">
				<div style="padding-left:5px">{{item.amount}}</div>
			</span>
		</div>
		<div class="flex-center-between m-t-8" >
		 <span class="font-extraSmall">货架：</span>
		<shelfInvOpt
		 v-if="item.ftype!='clear'"
		:materialid="materialid"
		:formid="item.id"
		:warehouseid="item.warehouseid"
		:amount="item.amount"
		:opt="item.ftype=='in'?'1':'0'"
		 formtype="purchase"></shelfInvOpt>
		 	</div>
		<div class="flex-center-between m-t-8" >
			<span class="font-extraSmall">
				操作人：
			</span>
			<span>{{item.operator}}</span>
		 </div>
		 <div class="flex-center-between m-t-8" >
		<div class="font-extraSmall">备注：</div>
		<div>{{item.remark}}</div>
		</div>
		<div class=" m-t-8" >
		 <el-button
		 size="small"
		   @click.stop="lookRecord(item.id)"
		  >详情
		 </el-button>
		 <el-button
		  size="small"
		   v-if="item.ftype!='clear'"
		   @click.stop="returnReceive(item.id,item)"
		  >
		  <span v-if="item.ftype=='in'">撤销入库</span>
		  <span v-if="item.ftype=='out'">撤销出库</span>
		 </el-button>
		</div>
	</el-card>
	 <el-empty v-else :image-size="100" description="暂无记录!"/>
	 
	
	<el-dialog
	    v-model="visible"
	    title="入库单详情"
	    width="50%"
	    :before-close="handleClose"
	  >
				<div id="printPage">
					<el-card shadow="never" >
						<div class="flex-center">
							<div>
						 <el-image v-if="dataMap.image" :src="dataMap.image" class="img-60"  width="60" height="60"  ></el-image>
						 <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="img-60"  width="60" height="640"  ></el-image>
						  <p class="m-t-8">{{dataMap.sku}} </p>
						  </div>
						  <div class="m-l-16">
							 <p>操作数量:{{dataMap.amount }}</p>
							 <p>订单编码:{{dataMap.orderNumber}}</p>
							 <p>订单时间:{{dataMap.ordertime }}</p>
							 <p>采购数量:{{dataMap.buyamount }}</p>
							 <p>运单号:{{dataMap.logisticsNo }}</p>
							 <p>供应商:{{dataMap.supplier }}</p>
							 <p>操作人:{{dataMap.operator }}</p>
							 <p>操作时间:{{dataMap.opttime }}</p> 
						  </div>
						</div>  
					</el-card> 
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
		materialid:"",
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
		materialid,
		visible,
		dataMap,
		content
	}=toRefs(state)
	function show(materialid,receivelist){
		state.materialid=materialid;
		state.tableData=receivelist;
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
	.m-l-16{
		margin-left:16px;
	}
</style>
