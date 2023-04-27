<template>
  <GlobalTable ref="globalTable"   @selectionChange='selectChange' :tableData="tableData" height="calc(100vh - 280px)"  :stripe="true" @loadTable="loadTableData"  >
	<template #field>
	  <el-table-column type="selection" width="40"></el-table-column>
       <el-table-column    label="图片" width="60" >
	       <template #default="scope">
			   <div @click.stop="handleToMaterial(scope.row)" >
					<el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40" class="pointer" ></el-image>
					<el-image   v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40" class="pointer" ></el-image>
	           </div>
		  </template>
	    </el-table-column>
	    <el-table-column  prop="sku" label="名称/SKU" min-width="180"  show-overflow-tooltip sortable="custom">
	       <template #default="scope">
	          <div class='name'>{{scope.row.mname}}</div>
	          <div class='sku pointer' @click.stop="handleToSupplier(scope.row.purchaseUrl)">{{scope.row.sku}}
			   <el-tag class="pointer" v-if="scope.row.issfg=='2'" size="small" effect="plain" type="warning" @click.stop="showAssembly(scope.row)">组装</el-tag>
	          </div>
			 <!-- <div v-if="scope.row.auditstatus==2 && scope.row.paystatus==3">付款方式:
			  <el-tag  type="warning" size="small" effect="plain" round>申请付款</el-tag>
			  </div> -->
	      </template>
	    </el-table-column>
		<el-table-column  label="状态"  prop="auditstatus"  width="100">
		   <template #default="scope">
			   <el-tag  v-if="scope.row.auditstatus==0" type="danger">已作废</el-tag>
			   <el-tag  v-if="scope.row.auditstatus==1" type="warning">待审核
			   <span v-if="scope.row.ischange==1" style="color: #ff0f47;">
			        <el-icon @click="handlePurchase(scope.row)"><Warning /></el-icon>
			   </span>
			   </el-tag>
			   <el-tag  v-if="scope.row.auditstatus==2 && scope.row.paystatus!=3" type="success">执行中</el-tag>
			   <el-tag  v-if="scope.row.auditstatus==3" type="info">已完成</el-tag>
			   <el-tag  v-if="scope.row.paystatus==3" type="warning">请款中</el-tag>
		  </template>
		</el-table-column>
		<el-table-column  label="采购信息"  width="140" >
		   <template #default="scope">
			   <div class="flex-center">
			   <span class="word-break font-extraSmall">单价(￥)：</span>
			   <span v-if="scope.row.withoutEdit=='1'">{{scope.row.itemprice}}</span>
			   <el-input size="small" v-model="scope.row.itemprice" @input="changeItemPrice(scope.row)" v-else></el-input>
			   </div>
			   <div class="flex-center ">
			   <span class="word-break font-extraSmall">数量：</span>
			   <span v-if="scope.row.withoutEdit=='1'">{{scope.row.amount}}</span>
			   <el-input size="small" v-model="scope.row.amount"   @input="changeItemAmount(scope.row)" v-else></el-input>
			   </div>
			   <div class="flex-center ">
			   <span class="word-break font-extraSmall">金额(￥)：</span>
			   <span v-if="scope.row.withoutEdit=='1'">{{scope.row.orderprice}}</span>
			   <el-input size="small" v-model="scope.row.orderprice"  @input="changeItemOrderprice(scope.row)" v-else></el-input>
			   </div>
		  </template>
		</el-table-column>
		<el-table-column  label="订单信息"  prop="number"  sortable="custom" min-width="210">
		   <template #default="scope">
			<p>{{scope.row.number}}</p>
			<p><span class="font-extraSmall ">{{scope.row.creatorname}} 创建于 {{dateFormat(scope.row.createdate)}}</span></p>
			<p class="font-small"><span class="font-extraSmall">入库仓：</span>{{scope.row.warehousename}}</p>
		  </template>
		</el-table-column>
		<el-table-column  label="供应商信息" prop="suppliername"  show-overflow-tooltip min-width="230"  sortable="custom" >
		   <template #default="scope">
			   <p></p>
			   <p>{{scope.row.suppliername}}</p>
			   <el-popover
			     v-if="scope.row.auditstatus==1"
			     placement="top-start"
			     title="供货周期"
			     :width="200"
			     trigger="click"
			   	@show="showDatePopover(scope.row)"
			   >
			   	<el-input
			   	    v-model="scope.row.delivery_cycle2"
			   	    :rows="2"
			   	    type="textarea"
			   	    placeholder="请输入"
			   	  />
			   		<el-button type="primary" class='m-t-8' @click="updateCycleDate(scope.row.materialid,scope.row.delivery_cycle2,scope.row)">确定</el-button>
			     <template #reference>
			   		<div class="table-edit-flex">
						<span class="font-extraSmall">供货周期(天)：</span>
			       <span v-if="scope.row.delivery_cycle!=''&&scope.row.delivery_cycle!=undefined">{{scope.row.delivery_cycle}}</span>
			   							   <span v-else >-</span>
			       <el-icon><Edit /></el-icon>
			   		</div>
			     </template>
			   </el-popover>	
			  <p v-else><span class="font-extraSmall">供货周期(天)：</span>
								{{scope.row.delivery_cycle}}
			  </p> 
               <p><span class="font-extraSmall">起订量：</span>{{scope.row.moq}}</p>
		  </template>
		</el-table-column>
		<el-table-column  label="备注"  prop="remark" min-width="120"  >
		   <template #default="scope">
			  <el-popover
			    placement="top-start"
			    title="备注"
			    :width="200"
			    trigger="click"
				@show="showRemarkPopover(scope.row)"
			  >
			  	<el-input
			  	    v-model="scope.row.remark2"
			  	    :rows="2"
			  	    type="textarea"
			  	    placeholder="请输入"
			  	  />
			  		<el-button type="primary" class='m-t-8' @click="updatenotice(scope.row.id,scope.row.remark2,scope.row)">确定</el-button>
			    <template #reference>
			  		<div class="table-edit-flex" >
						<span v-if="scope.row.remark!=''&&scope.row.remark!=undefined">{{scope.row.remark}}</span>
						<span v-else >-</span>
			      <el-icon><Edit /></el-icon>
			  		</div>
			    </template>
			  </el-popover>
		  </template>
		</el-table-column>
		<el-table-column v-if="tableState=='4' || tableState=='5' || tableState=='6'" label="到货数" prop="auditstatus"  width="150">
			 <template #default="scope">
				 <div>{{scope.row.totalin}}
				  <el-tag v-if="scope.row.inwhstatus==0" effect="plain" type="info"  round size="small">未完成</el-tag>
				  <el-tag v-else effect="plain" type="success"  round size="small">已完成</el-tag>
				  </div>
				 <p v-if="dateFormat(scope.row.deliverydate)<dateFormat(new Date())" style="color: #ff0f47;" > <span class="font-extraSmall">预计到货:</span>{{dateFormat(scope.row.deliverydate)}}</p>
				  <p v-else > <span class="font-extraSmall">预计到货:</span>{{dateFormat(scope.row.deliverydate)}}</p>
			 </template>
		</el-table-column>
		<el-table-column v-if="tableState=='4' || tableState=='5' || tableState=='6'" label="付款金额" prop="auditstatus" width="150" >
			 <template #default="scope">
				<div :id="scope.row.id">￥{{scope.row.totalpay}}
				<el-tag v-if="scope.row && scope.row.paystatus==1" effect="plain" type="success"  round size="small">已结清</el-tag>
				<el-tag v-else effect="plain" type="info"  round size="small">未结清</el-tag> 
				</div>
				 <p> <span class="font-extraSmall">审核日期:</span>{{dateFormat(scope.row.audittime)}}</p>
			 </template>
		</el-table-column>
		<el-table-column  label="操作" width="170" fixed="right" >
		   <template #default="scope">
			   <el-space>
			   <template v-if="scope.row.auditstatus==1 || scope.row.auditstatus==0">
			   	<el-dropdown v-if="scope.row.auditstatus==1  && scope.row.withoutEdit==true">
			   	    <el-button   link type="primary">审核</el-button>
			   	     <template #dropdown>
			   	       <el-dropdown-menu>
			   	         <el-dropdown-item @click="handlePass(scope.row)">通过</el-dropdown-item>
			   	         <el-dropdown-item @click="handleReturn(scope.row)">驳回 </el-dropdown-item>
			   	       </el-dropdown-menu>
			   	     </template>
			   	   </el-dropdown>
				   <template v-if="scope.row.auditstatus==1">
			   	<el-button v-if="scope.row.withoutEdit" link type="primary" @click="handleChanges(scope.row)" >编辑</el-button>
			   	<el-button link v-else type="primary" @click="updateItem(scope.row)">保存</el-button>
				</template>
			   	<el-dropdown :hide-on-click="false">
			   	  <span class="el-dropdown-link">
					  <el-button type="primary" link>更多
					  <el-icon class="ic-cen"><ArrowDown /></el-icon>
					  </el-button>
			   	  </span>
			   	   <template #dropdown>
			   	    <el-dropdown-menu>
			   	      <el-dropdown-item @click="handleRecords(scope.row)">采购记录</el-dropdown-item>
			   	    </el-dropdown-menu>
			   	</template>
			   	</el-dropdown>
			   	
			   </template>
			   <el-space v-else>
			   	<el-button v-if="scope.row.inwhstatus==0" link type="primary" @click="handleReceipt(scope.row,'rec')">收货</el-button>
			   	<el-button v-if="scope.row.paystatus==0 " link type="primary" @click="handlePay(scope.row,'pay')">付款</el-button>
				<el-button v-if="scope.row.paystatus==3" link type="primary" @click.stop="gotoApprovePay(scope.row)" >审核请款</el-button>
			   	<el-button v-if="scope.row.auditstatus==3||(scope.row.inwhstatus==1&&scope.row.paystatus==1)" link type="primary" @click="handleDetails(scope.row)">详情</el-button>
			   	<el-dropdown :hide-on-click="false" >
			   	  <span class="el-dropdown-link">
					  <el-button type="primary" link>更多
					  <el-icon class="ic-cen"><ArrowDown /></el-icon>
					  </el-button>
			   	  </span>
			   	   <template #dropdown>
			   	    <el-dropdown-menu>
			   		  <el-dropdown-item v-if="!(scope.row.inwhstatus==0&&scope.row.auditstatus==2)"   @click="handleReceipt(scope.row,'rec')">收货</el-dropdown-item>
			   	      <el-dropdown-item v-if="scope.row.auditstatus>=2"   @click="handleReceipt(scope.row,'ret')">退货</el-dropdown-item>
			   		  <el-dropdown-item v-if="!(scope.row.paystatus==0&&scope.row.auditstatus==2)"    @click="handlePay(scope.row,'pay')">付款</el-dropdown-item>
			   		  <el-dropdown-item v-if="scope.row.auditstatus>=2"    @click="handlePay(scope.row,'refund')">退款</el-dropdown-item>
			   		  <el-dropdown-item v-if="scope.row.totalin==0 && (scope.row.totalpay==0 || scope.row.totalpay==0.0) && scope.row.withoutEdit==true" @click="handleChangesub(scope.row)">撤回</el-dropdown-item>
			   		  <el-dropdown-item v-if="scope.row.totalin==0 && (scope.row.totalpay==0 || scope.row.totalpay==0.0)" @click="handleDelete(scope.row)">作废</el-dropdown-item>
					  <el-dropdown-item v-if="scope.row.auditstatus==2" @click="handleDetails(scope.row)">详情</el-dropdown-item>
			   	    </el-dropdown-menu>
			   	</template>
			   	</el-dropdown>
			   </el-space>
			   	</el-space>
		  </template>
		</el-table-column>
		</template>
  </GlobalTable>
  
  <Records ref="RecordsRef"/>
  <ChangeRecords ref="changeRecordsRef"/>
  <Assembly ref="AssemblyRef"/>
  <Receipt ref="ReceiptRef" @change="changeRec" />
  <Payment ref="PaymentRef" @change="changePay"/>
  <Details ref="detailsRef"/>
</template>

<script setup>
	import {h,ref,reactive,toRefs,defineExpose,defineProps,defineEmits} from 'vue'
	import {Download,Edit,DeleteFilled,ArrowDown,Warning} from '@element-plus/icons-vue';
	import {MoreOne} from '@icon-park/vue-next';
	import {useRouter } from 'vue-router'
	import {ElDivider} from 'element-plus';
	import { ElMessage, ElMessageBox } from 'element-plus';
	import {dateFormat,formatFloat,dateTimesFormat,CheckInputFloat,CheckInputInt} from '@/utils/index.js';
	import NullTransform from"@/utils/null-transform";
	import Assembly from "./assembly.vue"; 
	import Records from "../records.vue";
	import ChangeRecords from "./change_records.vue"; 
	import Receipt from "./receipt.vue";
	import Payment from "./payment.vue"; 
	import Details from "./details.vue"; 
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import {updateItem,handleChangesub,changeItemPrice,changeItemOrderprice,changeItemAmount,handleChanges,updatenotice,handleDelete,
	updateCycle,updateCycleDate} from  '@/hooks/erp/purchase/form.js';	const router = useRouter()
	const changeRecordsRef=ref();
	const AssemblyRef= ref();
	const RecordsRef = ref();
	const detailsRef = ref();
	const PaymentRef = ref();
	const ReceiptRef = ref();
	const emit = defineEmits(['selectrow','changepay',]);
	let globalTable=ref();
	const spacer = h(ElDivider, {
		direction: 'vertical'
	})
	const state = reactive({
		tableData:{records:[],total:0},
		queryParams:{},
	})
	const {
		tableData,queryParams,
	} = toRefs(state)
	const props = defineProps({
	             tableState:String,
	        })
	const {
		tableState,
	} =toRefs(props);
	function showRemarkPopover(sub){
	    sub.remark2=sub.remark;
	}
	function loadTableData(params){
		purchaselistApi.list(params).then((res)=>{
			state.tableData.records = res.data.records;
			state.tableData.total =res.data.total;
		})
	}
	function selectChange(selection) {
		 emit('selectrow',selection);
	}

	function handleToSupplier(link){
		 window.open(link,"_blank");
	}
	function handleToMaterial(row){
		 router.push({
			path:'/material/details',
			query:{
			  title:"产品详情",
			  path:'/material/details',
			  details:row.materialid,
			}
		 })
	}
	function showDatePopover(sub){
	    sub.delivery_cycle2=sub.delivery_cycle;
	}	 
	//展示组装信息
	function showAssembly(sub){
		AssemblyRef.value.show(sub,"ass");
	}
	//审核通过
	function handlePass(sub){
		purchaselistApi.approval({"ids":sub.id}).then((res)=>{
			if(res.data){
				sub.auditstatus=2;
				sub.paystatus=0;
				sub.inwhstatus=0;
				ElMessage({
					message:'审核通过 ',
					type:'success',
				})
			}
		});
	}
	function handleReturn(sub){
		AssemblyRef.value.show(sub,"return");
	}
	//采购记录
	function handleRecords(row){
		RecordsRef.value.show(row.id);
	}
	//变更记录
	function handlePurchase(row){
		changeRecordsRef.value.show(row.id);
	}
 
	function changePay(){
		emit("changepay");
	}
	function changeRec(){
		emit("changepay");
	}
	//收货
	function handleReceipt(sub,type){
		ReceiptRef.value.show(type,sub)
	}
	
	//付款
	function handlePay(sub,type){
		PaymentRef.value.show(type,sub)
	}
	//采购单详情
	function handleDetails(){
		detailsRef.value.show()
	}
	function gotoApprovePay(row){
		router.push({
			path:"/finance/paymentRequest",
			query:{
				title:'请款单',
				path:"/finance/paymentRequest",
				number:row.number,
			},
		})
	}
	function load(params){
		state.queryParams=params;
		globalTable.value.loadTable(params);
	}
	defineExpose({
	   load,
	})
	
</script>

<style>
.word-break{
	white-space:nowrap;
}
</style>
