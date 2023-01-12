<template>
	  <div class="main-sty">
			<el-descriptions :column="2">
			    <el-descriptions-item label="单据编码">{{warehouseform.number}}</el-descriptions-item>
				<el-descriptions-item label="收件人">{{warehouseform.customer}}</el-descriptions-item>
			    <el-descriptions-item label="出库仓库">{{warehouseform.warehouse}}</el-descriptions-item>
			    <el-descriptions-item label="快递物流">{{warehouseform.express}}</el-descriptions-item>
				<el-descriptions-item label="出库申请人">{{warehouseform.creator}}</el-descriptions-item>
			    <el-descriptions-item label="物流单号">{{warehouseform.expressno}}</el-descriptions-item>
				<el-descriptions-item label="出库时间">{{dateTimesFormat(warehouseform.opttime)}}</el-descriptions-item>
			    <el-descriptions-item label="发货地址">{{warehouseform.toaddress}}</el-descriptions-item>
				<el-descriptions-item label="备注">
				 {{warehouseform.remark}}
				</el-descriptions-item>
			  </el-descriptions>
			  <el-divider></el-divider>
			  	 <div class="mark-re">
			  	   <h5 >出库商品 </h5>
				   </div>
			  	 <el-table border :data="outFormEntryList">
			  		 <el-table-column label="序号" type="index" width="50"/> 
			  		 <el-table-column  prop="image" label="图片"  width="65">
			  		    <template #default="scope">
			  		     <el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
			  		 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
			  		   </template>
			  		 </el-table-column>
			  		 <el-table-column  prop="name" label="名称/SKU" width="350"  show-overflow-tooltip>
			  		    <template #default="scope">
			  		       <div class='name'>{{scope.row.name}}</div>
			  		       <div class='sku'>{{scope.row.sku}}
			  		       </div>
			  		   </template>
			  		 </el-table-column>
			  		 <el-table-column label="出库数量" prop="amount">
			  			  <!-- <template #default="scope">
			  				  <el-input v-model="scope.row.amount">
			  				  </el-input>
			  			  </template>  -->
			  		 </el-table-column>
			  		 <el-table-column label="可用库存" prop="fulfillable">
			  		 </el-table-column>
			  	 </el-table>
				  <div style="float: right;margin-top: 10px;">
					<el-button  @click.stop="closePage">关闭</el-button>
				  </div>
	 
	</div>
</template>
<script setup>
	import {ArrowDown,Edit,View,Upload,Download} from '@element-plus/icons-vue';
	import { ref,reactive,onMounted,watch,defineExpose,toRefs,inject } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus';
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import outApi from '@/api/erp/inventory/outApi.js';
	import {useRouter } from 'vue-router';
	const emitter = inject("emitter"); // Inject `emitter`
	const router = useRouter();
	const id = router.currentRoute.value.query.id;
	const state = reactive({
		warehouseform:{},
		outFormEntryList:[],
	})
	const{
		warehouseform,
		outFormEntryList,
	}=toRefs(state)
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
    function load(){
		outApi.getData({"id":id}).then((res)=>{
			if(res.data){
				state.warehouseform=res.data.warehouseform;
				state.outFormEntryList=res.data.outFormEntryList;
			}
		});
	}
	function closePage(){
		closeTab();
		setTimeout(function(){
			router.push({
				path:"/erp/warehouse/outbound",
				query:{
					title:'出库单详情',
					path:"/erp/warehouse/outbound",
				},
			})
		},500)
	}
	
	defineExpose({
		 
	})
	onMounted(()=>{
		load();
	});
</script>

<style>

</style>
