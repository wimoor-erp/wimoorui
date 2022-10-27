<template>
	  <el-dialog
	     v-model="dialogVisible"
	    :title="title"
	     width="80%"
	  >
	  <el-row>
		   <el-col :span="24" style="padding-bottom:10px;">
			  <el-space>
				<Warehouse ref="warehouses" @changeware="getWarehouse" defaultValue="only" />
				</el-space>
			</el-col>
		</el-row>
		<el-table :data="tableData" v-loading="loading"  style="width: 100%">
		 <el-table-column prop="image" label="图片" width="60" >
			 <template #default="scope">
			 	<el-image :src="scope.row.image" width="40" height="40"></el-image>
			 </template>
		 </el-table-column>
		 <el-table-column prop="name" label="名称" show-overflow-tooltip  />
		 <el-table-column prop="sellersku" label="平台SKU" width="180" />
		 <el-table-column prop="sku" label="本地SKU" width="180" />
		 <el-table-column prop="quantityShipped" label="发货数量" width="180" />
		 <el-table-column prop="invquantity" label="本地库存" width="180" />
		 <el-table-column prop="outbound" label="待出库" width="180" />
		</el-table>
		<template #footer>
		  <span class="dialog-footer">
		    <el-button @click="dialogVisible = false">关闭</el-button>
		    <el-button type="primary"  @click="submitDialog">确认出库</el-button
		    >
		  </span>
		</template>
   </el-dialog>
</template>
<script>
   import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
   import {vue,reactive,ref,watch,onMounted} from "vue";
   import Warehouse from '@/components/header/warehouse.vue';
   import {ElMessage } from 'element-plus'
	export default{
		name:'shipAsyncDailog',
		components:{Warehouse},
		emits:["submit"],
		setup(props,context){
		   let dialogVisible=ref(false);
		   let tableData=ref([]);
		   let myParams={};
		   let warehouseid="";
		   let title=ref("");
		   let loading =ref(false);
		   function showDailog(params){
			   myParams=params;
			   params.warehouseid=warehouseid;
			    loading.value=true;
			   shipmenthandlingApi.getUnSyncShipmentDetial(params).then(res=>{
			   		dialogVisible.value=true;   
					title.value="货件信息:"+params.shipmentid;
					tableData.value=res.data.itemList;
					loading.value=false;
			   });
		   }
		   function submitDialog(){
			   let params=myParams;
			   params.warehouseid=warehouseid;
			   let haserror=false;
			   tableData.value.forEach(item=>{
				   if(!item.invquantity){
					   item.invquantity=0;
				   }
				   if(item.quantityShipped> item.invquantity){
					   haserror=true;
				   }
			   });
			   if(haserror){
				   ElMessage({
				      message: '库存不够，请确认库存',
				      type: 'error'
				    });
				   return ;
			   }
			   params.needsubinv="true";
			   shipmenthandlingApi.saveShipmentItemAndPlanBath(params).then(res=>{
				   dialogVisible.value= false;
				   ElMessage({
				      message: '同步成功！',
				      type: 'success'
				    });
					context.emit("submit",getData())
			   })
			   
		   }
		   function getWarehouse(value){
			   warehouseid=value;
			   showDailog(myParams)
		   }
		   return {
			   dialogVisible, //ref
			   showDailog, submitDialog, getWarehouse,  //function
			   title,tableData,loading,//value
		   }
		  }
		}
</script>

<style>
	.el-dialog__body{
		padding-top:0px;
	}
</style>