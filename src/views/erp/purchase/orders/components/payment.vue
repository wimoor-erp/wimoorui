<template>
	<el-dialog :title="operateType.dialogTitle" v-model="dialogVisable" width="90%">
		<div  class="product-box">
			<el-image :src="require('@/assets/image/testpic.png')"></el-image>
			<div>
				<p class="name">血手印桌布+血刀八件套+血手印红色4张（2款）+脚掌印红色4张（2款）（B1024TKJJC+FP301+FP350）（BGA029，28*50 OPP袋 </p>
				<p class="sku">C3422KQWJA</p>
			</div>
		</div>
		 <el-tabs
		    v-model="activeName"
		    type="card"
		    @tab-click="handleClick"
		  >
		    <el-tab-pane :label="operateType.tabsType" name="1">
				<el-row :gutter="24">
					<el-col :span="10" >
					<el-card class="m-b-16 " shadow="never" v-if="operateType.tabsType=='付款'">
						<div class="flex-center-between">
						<el-space  :spacer="spacer">
						 <span ><span class="font-bold">100</span><p class="font-extraSmall">待付款</p></span>
						 <span><span class="font-bold">800</span><p class="font-extraSmall">已付款</p></span>
						 <span><span class="font-bold">0</span><p class="font-extraSmall">已付运费</p></span>
						</el-space>
						<el-tag type="warning" size="large">待付款</el-tag>
						</div>
					</el-card>	
					<el-form label-width="100px">
						<el-form-item label="货物费用">
							<el-input></el-input>
						</el-form-item>
						<el-form-item label="运费">
							<el-input></el-input>
							<p  class="font-extraSmall">预计重量：840kg</p>
						</el-form-item>
						<el-form-item label="其他费用">
						   <el-table :data="otherFeeData" border size="small">
							   <el-table-column type="index">
								   <template #header>
									   <el-link :underline="false" @click="handleAdd">
										   <el-icon class="ic-cen font-large"><Plus /></el-icon>
									   </el-link>
								   </template>
							   </el-table-column>
							   <el-table-column label="费用名称">
								   <template #header>
									   <div  class="flex-center">
									   <span>费用名称</span>
									   <span class="table-edit-flex">
										 <el-icon class="ic-cen"><Edit/></el-icon>  
									   </span>
									   </div>
								   </template>
								   <template #default='scope'>
									   <el-select  size="small"></el-select>
								   </template>
							   </el-table-column>
							   <el-table-column label="金额">
								   <template #default='scope'>
								   <el-input size="small" v-model="scope.row.price"></el-input>
								   </template>
							   </el-table-column>
							   <el-table-column label="操作" width="60">
								   <template #default='scope'>
								   <el-link :underline="false" @click="handleDelete(scope.$index)">
								  <el-icon class="ic-cen font-medium"><Close /></el-icon>
								  </el-link>
								  </template>
							   </el-table-column>
						   </el-table>
						</el-form-item>
						<el-form-item label="预计到货日期">
							<el-radio-group v-model="form.radio" >
							      <el-radio label="1" >
									 <el-date-picker
									         v-model="value1"
									         type="date"
									         placeholder="请选择"
									       />
								  </el-radio>
							      <el-radio label="2" >
									  <div>2022/12/07
									  <span class="font-extraSmall">旧预计到货日期</span>
									  </div>
								  </el-radio>
							    </el-radio-group>
						</el-form-item>
						<el-form-item label="支付方式">
							<el-select></el-select>
						</el-form-item>
						<el-form-item label="备注">
							<el-input type="textarea"></el-input>
						</el-form-item>
						<el-form-item >
						<el-button type="primary">付款</el-button>
						</el-form-item>
					</el-form>
					</el-col>
					<el-col :span="14" >
						<!-- 交易订单记录 -->
						<OrderRecord/>
					</el-col>
			</el-row>
			</el-tab-pane>
		    <el-tab-pane :label="operateType.tabsType+'记录'" name="2">
			     <!-- 付款记录 -->
				 <PayRecord />
			</el-tab-pane>
		  </el-tabs>
		  <template #footer>
			  <el-button >关闭</el-button>
			  <el-button type="primary" plain>结束付款</el-button>
		  </template>
	</el-dialog>
</template>

<script setup>
	import {h, ref,reactive,onMounted,watch,inject,toRefs,defineExpose} from 'vue'
	import { ElDivider } from 'element-plus'
    import {Close,Plus,Edit} from '@element-plus/icons-vue';
	import PayRecord from "./pay_record.vue"
	import OrderRecord from "./order_record.vue"
	const spacer = h(ElDivider, { direction: 'vertical'})
	const state = reactive({
		operateType:{
			dialogTitle:'采购付款',
			tabsType:'付款'
		},
		dialogVisable:false,
		activeName:'1',
		// 查询参数
		queryParams: {} ,
		form:{
			radio:'1',
		},
		otherFeeData:[
			{name:'样品费',price:'',}
		],
	})
	const {
		activeName,
		dialogVisable,
		queryParams,
		operateType,
		form,
		otherFeeData,
	}=toRefs(state)
	function handleAdd(){
		state.otherFeeData.push({
			name:'',
			price:'',
		})
	}
    
	function handleDelete(index){
		state.otherFeeData.splice(index)
	}
	function show(type){
		if(type=="付款"){
			state.operateType.dialogTitle = "采购付款"
			state.operateType.tabsType  ="付款"
		}else{
			state.operateType.dialogTitle = "采购退款"
			state.operateType.tabsType  ="退款"
		}
		state.dialogVisable = true;
	}
	defineExpose({
		show,
	})
</script>

<style scoped="scoped">
.el-progress-bar{
	width: 200px;
}
.product-box{
	display: flex;
	margin-bottom: 24px;
}	
.product-box .el-image{
	margin-right: 16px;
}
.product-box .name{
font-size: 12px;
margin-bottom:8px;
}
.product-box .sku{
font-size: 12px;
color:var(--el-color-blue)
}
.m-t-32{
	margin-top: 32px;
}
</style>
