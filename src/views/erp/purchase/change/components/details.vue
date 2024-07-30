<template>
	<div class="el-white-bg">
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>换货单详情</h3>
						 <div>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 </div>
						 <div class="fill-from-body" >
							<el-descriptions :column="2">
							    <el-descriptions-item label="单据编码">{{warehouseform.number}}</el-descriptions-item>
								<el-descriptions-item v-if="pnumber" label="采购单编码">{{pnumber}}</el-descriptions-item>
							    <el-descriptions-item label="操作仓库">{{warehouse.name}}</el-descriptions-item>
							    <el-descriptions-item label="供应商">
									<span  >{{supplier.name}}</span>
								</el-descriptions-item>
								<el-descriptions-item label="创建人">{{warehouseform.creator}}</el-descriptions-item>
								<el-descriptions-item label="状态">
									<el-tag v-if="warehouseform.auditstatus==1" type="warning" >进行中</el-tag>
									<el-tag v-else type="success" >已完成</el-tag>
								</el-descriptions-item>
								<el-descriptions-item label="创建时间">{{dateTimesFormat(warehouseform.createtime)}}</el-descriptions-item>
								<el-descriptions-item label="备注">
								 {{warehouseform.remark}}
								</el-descriptions-item>
								
							  </el-descriptions>
							  <el-col :span="12" v-if="warehouseform.auditstatus==1">
							  <el-row class="m-b-24">
							  <el-col :span="12" class="text-center">
							  	<div >
							  	<p class="font-bold">{{warehouseform.totalin}}</p>
							  	<span class="font-extraSmall">已入库</span>
							  	</div>
							  </el-col>
							  <el-col :span="12" class="text-center">
							  	<el-popover
							  	   placement="bottom"
							  	   title="产品入库"
							  	   :width="200"
							  	   trigger="click"
							  	 >
							  	  <el-input-number v-model="stockAmount" :min="1" :step="1" :precision="0" placeholder="数量" />
							  		<el-button  @click="handleInstock"
							  		 class="m-t-8"
							  		 type="primary">确认</el-button>
							  	   <template #reference>
							  	  <el-button v-if="warehouseform.auditstatus==1" size="large" type="primary" class="m-t-8" >入库</el-button>
							  	   </template>
							  	 </el-popover>
								 <el-button v-if="warehouseform.auditstatus==1" size="large" @click="confrimSave"   class="m-t-8" >终止</el-button>
							  </el-col>
							  </el-row> 
							     <el-progress
							  	 :text-inside="true"
							  	      :stroke-width="8"
							  	      :percentage="(warehouseform.totalin/warehouseform.amount)*100"
							  	     >
							         <span></span>
							      </el-progress>
							  	<div class="flex-center-between m-t-8">
							  		<span class="font-extraSmall">处理进度</span>
							  		<span class="font-extraSmall">{{warehouseform.totalin+"/"+warehouseform.amount}}</span>
							  	</div>
							  </el-col>
						 <el-divider></el-divider>
						 <div class="mark-re">
							<div>
						   <h5 >换货商品 </h5>
						   </div>
						 </div>
						 <el-table border :data="materialList">
							 <el-table-column  prop="image" label="图片"  width="70" >
							    <template #default="scope" >
							     <el-image v-if="scope.row.image" :src="scope.row.image"   class="product-img"  ></el-image>
							 	<el-image v-else :src="$require('empty/noimage40.png')"   class="product-img"   ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column  prop="product" label="名称/SKU"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column prop="name" label="换货数量" >
								 <template #default="scope">
								 <span>{{warehouseform.amount}}</span>
								 </template>
							 </el-table-column> 
							 <el-table-column prop="name" label="可用库存">
							 	 <template #default="scope">
							 		 <span>{{inventory.fulfillable}}</span>
							 	 </template>
							 </el-table-column>
								 <el-table-column prop="name" label="待入库">
									<template #default="scope">
										<span>{{inventory.inbound}}</span>
									 </template>
								</el-table-column>	
						 </el-table>
						 <el-divider></el-divider>
						 <div class="mark-re">
						 							<div>
						   <h5 >入库记录 </h5>
						   </div>
						 </div>
						 <el-table border :data="recordList">
							 <el-table-column label="操作时间" prop="opttime" >
								   <template #default="scope">
									{{dateTimesFormat(scope.row.opttime)}}
									</template>
							 </el-table-column>
							 <el-table-column label="操作人"  prop="operator"/>
							 <el-table-column label="入库数量" prop="amount" />
							 <el-table-column label="备注" prop="remark" />
							 <el-table-column label="操作" >
								  <template #default="scope" >
									<el-button v-if="scope.row.disable==0"  
									 link type="primary"  @click.stop="cancelStock(scope.row)">撤销入库</el-button>
									<span v-else  class="font-extraSmall" >已撤销入库</span>
								  </template>
							 </el-table-column> 
							
							 </el-table> 
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16' >
							 <el-button type="primary" v-if="warehouseform.auditstatus==0"  @click="resetForm">重启单据</el-button>
							 <el-button type="" @click="closePage">关闭</el-button>
						</div>
						</div>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage,ElMessageBox } from 'element-plus'
	import { useRoute,useRouter } from 'vue-router';
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import changeApi from '@/api/erp/purchase/change/changeApi.js';
	const MaterialRef = ref()
	const router = useRouter();
	const id = router.currentRoute.value.query.id;
	const emitter = inject("emitter"); // Inject `emitter`
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	const state = reactive({
		warehouseform:{},
		recordList:[],
		supplier:{},
		warehouse:{},
		materialList:[],
		inventory:{},
		stockAmount:null,
		pnumber:'',
	})
	const {
		warehouseform,
		recordList,
		supplier,
		warehouse,
		materialList,
		inventory,
		stockAmount,
		pnumber,
	}=toRefs(state)
	
	function handleInstock(){
		if(state.stockAmount>0){
			changeApi.saveRecord({"remark":"","changeid":id,"amount":state.stockAmount}).then((res)=>{
				if(res.data){
					ElMessage.success("入库成功!");
					load();
				}
			});
		}
	}
	
	function resetForm(){
		changeApi.resetForm({"id":id}).then((res)=>{
			if(res.data){
				ElMessage.success( "单据重启成功!");
				load();
			}
		});
	}
	
	function cancelStock(row){
		if(state.warehouseform.auditstatus==1){
			changeApi.cancelInstock({"receiveid":row.id}).then((res)=>{
				if(res.data){
					ElMessage.success( "撤销成功!");
					load();
				}
			});
		}else{
				ElMessage.error( "单据已完成,不支持撤销!");
		}
	}
	
	function load(){
		changeApi.getData({"id":id}).then((res)=>{
			if(res.data){
				state.warehouseform=res.data.warehouseform;
				state.supplier=res.data.supplier;
				state.warehouse=res.data.warehouse;
				state.recordList=res.data.recordList;
				state.materialList=res.data.material;
				state.inventory=res.data.inventory;
				state.pnumber=res.data.pnumber;
			}
		});
	}
	 
	function closePage(){
			var refreshvalue="";
			if(router.currentRoute.value.query.replace){
				refreshvalue=true;
			}
			router.push({
				path:"/erp/purchase/change",
				query:{
					title:'换货单',
					path:"/erp/purchase/change",
					replace:true,
					refresh:refreshvalue,
				},
			})
	}
	function confrimSave(){
		var titleStr="您确定要直接完成换货单吗？";
		var title="完成换货单";
		ElMessageBox.confirm(
					titleStr,
					title,
					{
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning',
					}
		 )
					.then(() => {
							changeApi.examine({"ids":id}).then((res)=>{
								  if(res.data){
									  ElMessage.success(res.data);
									  load();
								  }else{
									  ElMessage.error("操作失败");
								  }
							  });
					})
					.catch(() => {
					  ElMessage.info('取消操作');
					})
	}
	
	onMounted(()=>{
		load();
	});
</script>

<style scoped>
	.font-12{font-size: 12px;margin-right:4px;}
		.he-scr-car{
			height:calc(100vh - 150px);
			margin-bottom: 20px;
		}
	.in-wi-24{
			width: 400px;
		}
		.mark-re{
			margin-top: 16px;
			margin-bottom:16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	.mark-re h5::before{
		content: "";
		display: inline-block;
		height: 13px;
		width: 4px;
		margin-right:8px;
		background-color: #FF6700;
	}
	.fill-from-body{
		margin:16px 24px;
	}
	.m-b-t-24{
		margin-bottom:24px;
		margin-top:24px;
	}
	.m-b-24{
		margin-bottom: 24px;
	}
	.m-b-16{
		margin-bottom: 16px;
	}
</style>
