<template>
	<div class="el-white-bg">
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>填写换货单</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							  <!-- <el-steps :active="0" finish-status="success" align-center class="m-b-t-24">
							    <el-step title="创建" />
							    <el-step title="进行中"  />
							    <el-step title="完成"  />
							  </el-steps> -->
						 <el-form :model="form"
						   :rules="rules"
						   label-width="120px">
							  <el-row>
							 <el-col :span="12">
							 <el-form-item label="单据编码"   >
							 	<el-input class="in-wi-24" disabled  v-model="form.number" placeholder="请输入"> </el-input>
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
									<el-form-item label="采购单"  >
										 <el-space>
											 <el-input @click="selectPurchase" v-model="form.entryNumber" placeholder="选择关联采购单" ></el-input>
										 </el-space>
									</el-form-item>
							 </el-col>
							 <el-col :span="12">
								<el-form-item label="操作仓库" prop="fromwarehouse">
									 <el-space>
										 <Warehouse ref="warehouseRef" :defaultid="warehouseid" :warehouseType="warehouseFromType"    @changeware="getfromWarehouse" defaultValue="only" :isform="true" />
									 </el-space>
								</el-form-item>
							 </el-col>
							 <el-col :span="12">
								<el-form-item label="供应商" prop="formsupplier">
									 <el-space>
										 <el-input @click="selectSupplier" v-model="form.suppliername" placeholder="选择供应商" ></el-input>
									 </el-space>
								</el-form-item>
							 </el-col>
							
							 <el-col :span="12">
								  <el-form-item label="备注"  >
									<el-input class="in-wi-24" type="textarea" v-model="form.remark" placeholder="输入备注"> </el-input>
								  </el-form-item>
							 </el-col>
							  </el-row>
						 </el-form>
						
						 <el-divider></el-divider>
						 <div class="mark-re">
							<div>
						   <h5 >换货商品 </h5>
						   </div>
						   <el-button @click="handleAdd" type="primary">添加商品</el-button>
						 </div>
						 <el-table border :data="tableData">
							 <el-table-column label="序号" type="index" width="80"/> 
							 <el-table-column  prop="image" label="图片" width="80" >
							    <template #default="scope">
							    <el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
							 	<el-image v-else :src="$require('empty/noimage40.png')"  class="product-img"  ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column label="名称/SKU"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column label="可用库存" prop="fulfillable"/>
							 <el-table-column label="换货数量">
								  <template #default="scope">
									  <el-input v-model="scope.row.amount" @input="scope.row.amount=CheckInputInt(scope.row.amount)">
									  </el-input>
								  </template>  
							 </el-table-column>
							 <el-table-column label="操作" width="80">
								  <template #default="scope">
								    <el-button @click="handleDelete(scope.$index)" link type="primary" >删除</el-button>
					        	  </template>
							 </el-table-column>
						 </el-table>
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button type="" @click="closeTab">取消</el-button>
									<el-button type="primary" @click.stop="submitForm('submit')">提交</el-button>
								</el-space>
							</div>
						</div>
	</div>
	<MaterialDialog @getdata="getRows" :isfulfillable="true" :warehouseid="form.fromwarehouseid" ref = "MaterialRef"/>
	<SupplierDialog ref='supDiaRef' @getdata="getSupplierRows" />
	<OrderDialog ref='orderDiaRef' @change="getChangeRow" />
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs,getCurrentInstance } from 'vue'
	import {ElMessage } from 'element-plus'
	import MaterialDialog from "@/views/erp/baseinfo/material/materialDialog.vue";
	import OrderDialog from "@/views/erp/purchase/orders/order_dialog.vue";
	import SupplierDialog from "@/views/erp/baseinfo/supplier/supplier_dialog.vue";
	import { useRoute,useRouter } from 'vue-router';
	import {getDictItemsByTypeCode} from "@/api/sys/admin/dict.js";
	import {CheckInputFloat,CheckInputInt} from '@/utils/index.js';
	import Warehouse from '@/components/header/warehouse.vue';
	import serialnumberApi from '@/api/erp/common/serialnumberApi.js';
	import changeApi from '@/api/erp/purchase/change/changeApi.js';
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import inventoryApi from "@/api/erp/inventory/inventoryApi.js";
	const MaterialRef = ref();
	const supDiaRef =ref();
	const orderDiaRef=ref();
	const warehouseRef=ref();
	const router = useRouter();
	const purchaseentryid = router.currentRoute.value.query.purchaseentryid;
	const { proxy } = getCurrentInstance();
	const emitter = inject("emitter"); // Inject `emitter`
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	function selectPurchase(){
		orderDiaRef.value.show();
	}
	const state = reactive({
		form:{
			number:'',
			fromwarehouseid:'',
			towarehouseid:'',
			remark:'',
			arrivaltime:new Date(),
			ftype:0,
			suppliername:'',
			supplierid:null,
			entryNumber:'',
			entryid:null,
		},
		warehouseid:"",
		warehouseFromType:"self_usable",
		warehouseToType:"self_usable",
		rules: {
			fromwarehouse: [{ required: true, message: '发货仓库不能为空', trigger: 'blur' }],
			formsupplier: [{ required: true, message: '供应商不能为空', trigger: 'focus' }],
		},
		tableData:[],
		skulist:{},
		dispatchFormTypeOptions:[],
	})
	const {
		form,
		rules,
		warehouseid,
		dispatchFormTypeOptions,
		warehouseFromType,
		warehouseToType,
		tableData,
		skulist,
	}=toRefs(state)
	
	function getSupplierRows(row){
		 state.form.suppliername=row.name;
		 state.form.supplierid=row.id; 
	}
	
	function selectSupplier(){
		supDiaRef.value.show();
	}
	function handleFtype(){
		if(state.form.ftype==0){
			state.warehouseFromType="self_usable";
			state.warehouseToType="self_usable";
		}
		if(state.form.ftype==1){
			state.warehouseFromType="self_usable";
			state.warehouseToType="self_unusable";
		}
		if(state.form.ftype==2){
			state.warehouseFromType="self_unusable";
			state.warehouseToType="self_usable";
		}
		if(state.form.ftype==3){
			state.warehouseFromType="self_usable";
			state.warehouseToType="self_test";
		}
		if(state.form.ftype==4){
			state.warehouseFromType="self_test";
			state.warehouseToType="self_usable";
		}
		if(state.form.ftype==5){
			state.warehouseFromType="self_usable";
			state.warehouseToType="oversea_usable";
		}
		if(state.form.ftype==6){
			state.warehouseFromType="oversea_usable";
			state.warehouseToType="self_usable";
		}
	}		 
    function handleAdd(){
		MaterialRef.value.show();
		MaterialRef.value.loadData();
	}
	function getChangeRow(row){
		state.form.entryid=row.id;
		state.tableData=[];
		row.id=row.materialid;
		state.tableData.push(row);
		state.form.fromwarehouseid=row.warehouseid;
		state.warehouseid=row.warehouseid;
		state.form.entryNumber=row.number+"-"+row.sku;
		state.form.suppliername=row.suppliername;
		state.form.supplierid=row.supplier;
	}
	function getRows(rows){
		if(rows && rows.length>0){
			if(state.tableData && state.tableData.length>0){
				var skus="";
				state.tableData.forEach(function(datas){
					 skus+=(datas.sku)+(",");
				});
				rows.forEach(function(item){
					if(skus.indexOf((item.sku+","))<0){
						state.tableData.push(item);
					}
				});
			}else{
				state.tableData=rows;
			}
		}
	}
	function handleDelete(index){
		state.tableData.splice(index,1)
	}
	function getfromWarehouse(wid){
		state.form.fromwarehouseid=wid;
		state.tableData.forEach(function(item){
			 inventoryApi.getSelfInvDetail({ warehosueid:wid, materialid:item.materialid}).then(res=>{
				  item.fulfillable=res.data.fulfillable;
			 })
		});
	}
	function getSKUList() {
		    state.skulist={};
			var flag=true;
			state.tableData.forEach(function(item){
				var sku = item.id;
				var amount = item.amount;
				if(state.skulist[sku]){
					ElMessage.error( "不能重复添加SKU！ ");
					flag=false;
				}
				if (typeof(sku)!="undefined"&&sku!=""&&amount!="" && amount>0) {
					state.skulist[sku]=amount;
				}
			});
			if(isEmptyObject(state.skulist)){
				ElMessage.error("请至少输入一个产品SKU及其数量！ ");
				flag= false;
			}
			return flag;
	} 
	function submitForm(ftype){
		var isok=getSKUList();
		if(isok==true){
			var data={};
			data.skumapstr=JSON.stringify(state.skulist);
			data.remark=state.form.remark;
			data.warehouseid=state.form.fromwarehouseid;
			data.supplierid=state.form.supplierid;
			data.entryid=state.form.entryid;
			data.id="";
			changeApi.saveData(data).then((res)=>{
				isok=true;
				if(res.data){
					ElMessage.success( "添加成功！");
					if(res.data){
						router.push({
							path:"/erp/purchase/change",
							query:{
								title:'换货单',
								path:"/erp/purchase/change",
								replace:true,
								refresh:true,
							},
						})
					}
				}else{
					ElMessage.error(res.data);
				}
			});
		}
	}
	function load(){
		getDictItemsByTypeCode('dispatch_form_type').then((response) => {
			   if(response.data){
				   response.data.forEach(item=>{item.value=parseInt(item.value);})
			   }
					state.dispatchFormTypeOptions = response.data;
		});
		
		serialnumberApi.getSerialNumber({"ftype":"SO","isfind":"true"}).then((res)=>{
			if(res.data){
				state.form.number=res.data;
			}
		});
		if(purchaseentryid!="" && purchaseentryid!=undefined && purchaseentryid!=null){
			setTimeout(function(){
				purchaselistApi.list({"entryid":purchaseentryid,"needinventory":true}).then((res)=>{
					if(res.data && res.data.records && res.data.records.length>0){
						 getChangeRow(res.data.records[0]);
					}
				});
			},800)
		}
	}
	function isEmptyObject(e) {  //判断一个Object对象{}是否为空
	    var t;  
	    for (t in e)  
	        return !1;  
	    return !0  
	} 
	onMounted(()=>{
		load();
	});
</script>

<style scoped>
		.he-scr-car{
			height:calc(100vh - 176px);
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
</style>
