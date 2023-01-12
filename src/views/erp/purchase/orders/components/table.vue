<template>
	   <table class="sd-table m-b-16 border-left-none" border="0" cellpadding="0" cellspacing="0">
		   <thead>
			   <tr>
				   <th width="240px">产品信息</th>
				   <th >单价</th>
				   <th >数量</th>
				   <th >金额</th>
				   <th>入库仓</th>
				   <th width="80px">状态</th>
				   <th v-if="tableState=='3'" width="140px">到货数</th>
				   <th v-if="tableState=='3'">付款金额</th>
				   <th>备注</th>
				   <th>操作</th>
			   </tr>
		   </thead>
		   <tbody v-for="item in tableData" >
			  <!-- 空格间距-->
			   <tr class="sep-row"><td :colspan="tableState=='3'? 10:8"></td></tr>
		   	   <tr class="sep-order">
		   		<td :colspan="tableState=='3'? 10:8">
					<div class="flex-center-between">
					<el-space :size="24">
						<el-checkbox v-model="checked1" size="small" />
						<span><span class="font-extraSmall">单据编码: </span>{{item.order.code}}
						</span>
						<span v-if="item.order.payState"><span class="font-extraSmall">付款方式:</span>
						<el-tag  type="warning" size="small" effect="plain" round>申请付款</el-tag>
						</span>
						<span><span class="font-extraSmall">创建时间: </span>{{item.order.time}}</span>
						<span><span class="font-extraSmall">创建人: </span>{{item.order.operater}}</span>
						<span><span class="font-extraSmall">总金额: </span>{{item.order.amount}}</span>
						<span><span class="font-extraSmall">供应商: </span>
						<el-link class="font-12 " :underline="false">
							<el-popover
							    placement="top-start"
							    trigger="hover"
								width="220px"
							  >
							   <el-space><span>供货周期:</span>
							    <span v-if="item.order.DeliveryInput">{{item.order.week}}</span>
								<el-input  v-else  v-model="item.order.week" style="width: 80px;" ></el-input>
							    <el-icon @click="item.order.DeliveryInput=false" class="ic-cen"><Edit /></el-icon>
							   </el-space>
							   <p class="m-t-8"><span>起订量:</span>{{item.order.num}}</p>
							    <template #reference>
							   {{item.order.supplier}}
							    </template>
							  </el-popover>
						
						</el-link>
						</span>
						<span><span class="font-extraSmall">备注: </span>{{item.order.remark}}</span>
					</el-space>
					<el-space >
						<el-button v-if="item.order.payState" type="info" link @click="download">
								<bank-card theme="filled" size="13"/>
							&nbsp;请款
						</el-button>
						<el-button type="info" link @click="download">
								<folder-download theme="filled" size="13"/>
							&nbsp;导出
						</el-button>
					<el-button type="info" link @click="handleDelete">
					<el-icon class="font-small pointer ic-cen "><DeleteFilled /></el-icon>
					&nbsp;作废
					</el-button>
					</el-space>
				   </div>
				</td>
				</tr>
				   <tr v-for="sub in item.list">
					   <td>
						   <div class="flex-center">
							   <el-image class="img-40" :src="sub.img"></el-image>
							   <div >
								   <div class="text-abb" style="width: 170px;">{{sub.product}}</div>
								   <p class="sku">{{sub.sku}}</p>
							   </div>
						   </div>
					   </td>
					   <td>
						   <span v-if="sub.isEdit">{{sub.price}}</span>
						   <el-input v-model="sub.price" v-else></el-input>
						 </td>
					   <td>
						  <span v-if="sub.isEdit">{{sub.num}}</span>
						  <el-input v-model="sub.num" v-else></el-input> 
					   </td>
					   <td >
						   <span v-if="sub.isEdit">{{sub.amount}}</span>
						   <el-input  v-model="sub.amount" v-else></el-input>
						</td>
					   <td >
						   <span v-if="sub.isEdit" >{{sub.warehouse}}</span>
						   <el-input  @focus="handleWarehouseShow" v-model="sub.warehouse" v-else></el-input>
					   </td>
					    <td><el-tag :type="sub.state.type">{{sub.state.label}}</el-tag></td>
					   <!-- 收货进度 -->
					   <td v-if="tableState=='3'">
						   <div>0/50 <el-tag effect="plain" type="info"  round size="small">未完成</el-tag></div>
						  <p> <span class="font-extraSmall">预计到货:</span>2022-02-02</p>
					   </td >
						<td v-if="tableState=='3'">
						  <div>￥46.00 <el-tag effect="plain" type="success"  round size="small">已结清</el-tag></div>
						 </td>
					   <td >
						   <el-popover
						     placement="top-start"
						     title="备注"
						     :width="200"
						     trigger="click"
						   >
						   	<el-input
						   	    v-model="textarea"
						   	    :rows="2"
						   	    type="textarea"
						   	    placeholder="请输入"
						   	  />
						   		<el-button type="primary" class='m-t-8'>确定</el-button>
						     <template #reference>
						   		<div class="table-edit-flex" @click="editRemarks(scope.row)">
						       <span>{{sub.remark}}</span>
						       <el-icon><Edit /></el-icon>
						   		</div>
						     </template>
						   </el-popover>
					   </td>
					   <td >
						   <el-space>
					<template v-if="sub.state.label=='待审核'">
						<el-dropdown>
						    <el-button link type="primary">审核</el-button>
						     <template #dropdown>
						       <el-dropdown-menu>
						         <el-dropdown-item @click="handlePass(sub)">通过</el-dropdown-item>
						         <el-dropdown-item>驳回 </el-dropdown-item>
						       </el-dropdown-menu>
						     </template>
						   </el-dropdown>
						<el-button v-if="sub.isEdit" link type="primary" @click="sub.isEdit=false">编辑</el-button>
						<el-button link v-else type="primary" @click="sub.isEdit = true">保存</el-button>
					</template>
					<el-button v-if="sub.state.label=='待下单'" link type="primary" @click="handleBuy(sub)">下单</el-button>
					<el-button v-if="sub.state.label=='待收货'" link type="primary" @click="handleReceipt(sub,'收货')">收货</el-button>
					<el-button v-if="sub.state.label=='待收货'&& !item.order.payState" link type="primary" @click="handlePay(sub,'付款')">付款</el-button>
					<el-button v-if="sub.state.label=='已完成'" link type="primary" @click="handleDetails(sub)">详情</el-button>
						<el-dropdown :hide-on-click="false">
						  <span class="el-dropdown-link">
						    <more-one class="ic-cen" theme="outline" size="16" fill="#333" :strokeWidth="3"/>
						  </span>
						   <template #dropdown>
						    <el-dropdown-menu>
						      <el-dropdown-item @click="handleRecords(sub)">采购记录</el-dropdown-item>
						      <el-dropdown-item @click="handlePurchase(sub)">采购变更</el-dropdown-item>
						      <el-dropdown-item v-if="sub.state.label=='待收货'" @click="handleReceipt(sub,'退货')">退货</el-dropdown-item>
						      <el-dropdown-item v-if="sub.state.label=='待收货'&& !item.order.payState" @click="handleRecords(sub)">退款</el-dropdown-item>
						    </el-dropdown-menu>
						</template>
						</el-dropdown>
						</el-space>
						</td>
				   </tr>
		   </tbody>
	   </table>
	<Records ref="RecordsRef"/>
	<WarehouseDialog :visible="warehouseDailog.visible" />
	<Receipt ref="ReceiptRef"/>
	<Payment ref="PaymentRef"/>
	<Details ref="detailsRef"/>
</template>

<script setup>
	import '@/assets/css/packbox_table.css'
	import {h,ref,reactive,toRefs,defineProps} from 'vue'
	import {Download,Edit,DeleteFilled} from '@element-plus/icons-vue';
	import {MoreOne,FolderDownload,BankCard} from '@icon-park/vue-next';
	import {ElDivider} from 'element-plus'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Records from "../records.vue" 
	import Receipt from "./receipt.vue" 
	import Payment from "./payment.vue" 
	import Details from "./details.vue" 
	import WarehouseDialog from "@/views/erp/warehouse/base/warehouseDialog"
	const RecordsRef = ref()
	const ReceiptRef =ref()
	const PaymentRef =ref()
	const detailsRef =ref()
	const warehouseRef = ref()
	const props = defineProps({
	             tableState:String,
	        })
	const state = reactive({
		warehouseDailog:{visible: false},
		tableData: [{
			order:{
						  DeliveryInput:true,	
						  code:': PF202211140008',
						  time: "2022-11-14",
						  operater:'周漫',
						  amount:'￥82.00',
						  supplier:'义乌市布荣皮革有限公司',
						  week:'5天',
						  num:'1000',
						  remark:'',
						  payState:false,
			},          
			list:[{
			isEdit:true,	
			img: require('@/assets/image/testpic.png'),
			product: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			state:{label:'待收货',type:'success'},
			price:'￥46.00',
			num:'50',
			amount:'￥8600.00',
			warehouse:'龙华仓',
			remark:'',
			},
			{
			isEdit:true,	
			img: require('@/assets/image/testpic.png'),
			product: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			state:{label:'待审核',type:'warning'},
			price:'￥46.00',
			num:'50',
			amount:'￥8600.00',
			warehouse:'龙华仓',
			remark:'',
			}
		   ],
		},
		{
			order:{
						  DeliveryInput:true,	
						  code:': PF202211140008',
						  time: "2022-11-14",
						  operater:'周漫',
						  amount:'￥82.00',
						  supplier:'义乌市布荣皮革有限公司',
						  week:'5天',
						  num:'1000',
						  remark:'',
						   payState:true,
			},
			list:[{
			isEdit:true,	
			img: require('@/assets/image/testpic.png'),
			product: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			state:{label:'待收货',type:'success'},
			price:'￥46.00',
			num:'50',
			amount:'￥8600.00',
			warehouse:'龙华仓',
			remark:'加急',
			},
			{
			isEdit:true,	
			img: require('@/assets/image/testpic.png'),
			product: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			state:{label:'已完成',type:'info'},
			price:'￥46.00',
			num:'50',
			amount:'￥8600.00',
			warehouse:'龙华仓',
			remark:'',
			}
		   ],
		}],
	})
	const {
		tableState,
	} =toRefs(props);
	const {
		tableData,
		warehouseDailog,
	} = toRefs(state)
	//单据作废
	function handleDelete(){
		 ElMessageBox.confirm(
		    '确定要作废该采购单吗？',
		    '单据删除',
		    {
		      confirmButtonText: '确认',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }
		  )
		    .then(() => {
		      ElMessage({
		        type: 'success',
		        message: '单据已作废',
		      })
		    })
	}
	//采购记录
	function handleRecords(row){
		RecordsRef.value.show()
	}
	function handleWarehouseShow(){
		state.warehouseDailog.visible=true
	}
	//审核通过
	function handlePass(sub){
		sub.state.label = "待下单"
		sub.state.type = "danger"
		ElMessage({
			message:'审核通过 ',
			type:'success',
		})
	}
	//下单
	function handleBuy(sub){
		ElMessageBox.confirm(
		   '确定下单吗？',
		   '采购下单',
		   {
		     confirmButtonText: '确认',
		     cancelButtonText: '取消',
		     type: 'warning',
		   }
		 )
		   .then(() => {
		     ElMessage({
		       type: 'success',
		       message: '下单成功',
		     })
			 sub.state.label = "待收货"
			 sub.state.type = "success"
		   })
		   .catch(() => {
		     ElMessage({
		       type: 'info',
		       message: '取消下单',
		     })
		   })
	}
	//到货
	function handleReceipt(sub,type){
		ReceiptRef.value.show(type)
	}
	
	//付款
	function handlePay(sub,type){
		PaymentRef.value.show(type)
	}
	//采购单详情
	function handleDetails(){
		detailsRef.value.show()
	}
</script>

<style>
.m-b-16{
	margin-bottom:16px;
}

.border-left-none{
	border-left: 0px;
}
.border-left-none tr td:first-child ,.border-left-none tr th:first-child{
	border-left:1px solid #ebeef5;
}
.sep-row td{
	border-right: 0!important;
	border-left: 0!important;
}
.sep-row:hover{
	background-color:#fff!important;
}
.sep-order{
	background-color: #f9f9f9;
}
.sep-order:hover{
	background-color: #f9f9f9!important;
}
.img-40{width: 40px;
height: 40px;flex: none;
margin-right: 8px;}
tr:hover  .table-edit-flex .el-icon{
	opacity: 1;
}
.font-12{
	font-size: 12px;
}
</style>
