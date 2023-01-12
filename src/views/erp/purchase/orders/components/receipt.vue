<template>
	<el-dialog :title="operateType.dialogTitle" v-model="dialogVisable" width="60%">
	
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
				<el-row class="m-t-32">
					<el-col :span="12">
					<el-form label-width="100px">
						<el-form-item :label="operateType.warehouseType">
							<el-select></el-select>
						</el-form-item>
						<el-form-item :label="operateType.tabsType+'数量'">
							<el-input></el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input type="textarea"></el-input>
						</el-form-item>
						<el-form-item >
						<el-button type="primary">提交{{operateType.tabsType}}</el-button>
						</el-form-item>
					</el-form>
					</el-col>
					<el-col v-if="operateType.tabsType=='收货'" :span="12" class="text-center">
						 <el-progress type="dashboard" :percentage="80">
						       <template #default="{ percentage }">
						         <p class="font-large font-bold">{{ percentage }}%</p>
						         <span class="font-extraSmall">收货进度</span>
						       </template>
						     </el-progress>
							 <div>
								 <el-space  :spacer="spacer">
									 <span>100<p class="font-extraSmall">待收货</p></span>
									 <span>800<p class="font-extraSmall">已收货</p></span>
								 </el-space>
							 </div>
					</el-col>
			</el-row>
			</el-tab-pane>
		    <el-tab-pane :label="operateType.tabsType+'记录'" name="2">
				<!-- 到货记录 -->
			     <ArrivalRecord/>
			</el-tab-pane>
			<el-tab-pane label="物流信息" name="3">
				<!-- 物流信息 -->
				<LogisticsRecord/>
			</el-tab-pane>	
		  </el-tabs>
		  <template #footer>
			  <el-button @click="dialogVisable=false">关闭</el-button>
			  <el-button type="primary" @click="handleComplete" plain>结束收货</el-button>
		  </template>
	</el-dialog>
</template>

<script setup>
	import {h, ref,reactive,onMounted,watch,inject,toRefs,defineExpose} from 'vue'
	import { ElDivider } from 'element-plus'
	import ArrivalRecord from "./arrival_record.vue"
	import LogisticsRecord from "./logistics_record.vue"
	const spacer = h(ElDivider, { direction: 'vertical'})
	const state = reactive({
		operateType:{
			dialogTitle:'',
			warehouseType:'',
			tabsType:''
		},
		dialogVisable:false,
		activeName:'1',
		// 查询参数
		queryParams: {} ,
		form:{
		},
		
	})
	const {
		activeName,
		dialogVisable,
		queryParams,
		operateType,
		form,
		logisticsData,
	}=toRefs(state)

	function show(type){
		if(type=="收货"){
			state.operateType.dialogTitle = "采购收货"
			state.operateType.warehouseType = "入库仓库"
			state.operateType.tabsType  ="收货"
		}else{
			state.operateType.dialogTitle = "采购退货"
			state.operateType.warehouseType = "出库仓库"
			state.operateType.tabsType  ="退货"
		}
		state.dialogVisable = true;
	}
	//结束收货
	function handleComplete(){
		
	}
	defineExpose({
		show,
	})
</script>

<style >
.m-b-16{
		margin-bottom: 16px;
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
.m-t-16{
	margin-top:16px;
}
</style>
