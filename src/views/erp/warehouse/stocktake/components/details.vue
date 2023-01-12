<template>
	<div >
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>盘点单详情</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							
						 <el-form :model="form"
						   :rules="rules"
						   label-width="120px">
							  <el-row>
							 <el-col :span="12">
							 <el-form-item label="单据编码"   >
							 ad5w4d6d48w
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
							 <el-form-item label="备注"  >
								 -
							 </el-form-item>
						  </el-col>
							 <el-col :span="12">
								 <el-form-item label="库位" prop="warehouse">
									 清湖仓
								 </el-form-item>
							 </el-col>
							 <el-col :span="12" >
							  <el-form-item label="状态"  >
							     <el-tag type="info" effect="plain" >盘点完成</el-tag>
							  </el-form-item>
							  </el-col>
							  </el-row>
						 </el-form>
						 <el-divider></el-divider>
						 <div class="mark-re">
						   <h5 >产品列表</h5>
						 </div>
						 <el-table border :data="TableData">
							 <el-table-column  prop="image" label="图片"  >
							    <template #default="scope">
							     <el-image v-if="scope.row.image" :src="scope.row.image"  class="product-img"></el-image>
							 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"    class="product-img"  ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column  prop="product" label="名称/SKU"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column label="成本价" prop="price"/>
							 <el-table-column label="可用库存" prop="i"/>
							 <el-table-column label="待出库" prop="d"/>
							 <el-table-column label="盘点数量"  prop="num">
							 </el-table-column>
							  <el-table-column label="账面数量" sortable  prop="d"/>
							  <el-table-column label="盘盈数量" prop="d"/>
							  <el-table-column label="盘亏数量" prop="d"/>
						 </el-table>
						 <el-row :gutter="16" class="m-t-16">
							 <el-col :span="4">
						 <el-card shadow="never">
							 <div class="flex-center-between">
							  <div>
							 <div class="font-large font-bold ">¥5.1</div>
							 <div class="font-extraSmall">盘盈金额</div>
							 </div>
							<el-icon class="icon-font text-red"><CirclePlus/></el-icon>
							</div>
						 </el-card>
						 </el-col>
						  <el-col :span="4">
						 <el-card  shadow="never">
							 <div class="flex-center-between">
							   <div>
							<div class="font-large font-bold ">¥36.5</div>
							<div class="font-extraSmall">盘亏金额</div>
							  </div>
							 <el-icon class="icon-font text-green"><Remove /></el-icon>
							 </div>
							
						 </el-card>
						 </el-col>
						 </el-row>
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button type="" @click="closeTab">关闭</el-button>
								</el-space>
							</div>
						</div>
	</div>
	<MaterialDialog  ref = "MaterialRef"/>
</template>

<script setup>
	import {ArrowDown,Edit,Remove,CirclePlus} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage } from 'element-plus'
	import MaterialDialog from "@/views/erp/baseinfo/material/materialDialog"
	import { useRoute,useRouter } from 'vue-router'
	const MaterialRef = ref()
	const emitter = inject("emitter"); // Inject `emitter`
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	const state = reactive({
		orderState:true,
		TableData:[{
			img: require('@/assets/image/testpic.png'),
			name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			price:'$31.35',
			i:20,
			num:55,
			d:50,
			state:true,
			statelabel:{label:'未盘点',type:'info'},
			},{
			img: require('@/assets/image/testpic.png'),
			name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			price:'$31.35',
			i:20,
			num:55,
			d:50,
			state:true,
			statelabel:{label:'未盘点',type:'info'},
			}
		],
		form:{
			name:'',
			radio:'1',
			radio2:'1',
		},
		rules: {
			warehouse: [{ required: true, message: '出库仓库不能为空', trigger: 'blur' }],
		},
	})
	const {
		orderState,
		form,
		TableData,
		rules,
	}=toRefs(state)
			onMounted(()=>{
	
			});
    function handleAdd(){
		MaterialRef.value.show()
	}
	function startCheck(){
		state.orderState = false
		state.TableData.forEach((item)=>{
			item.state = false
		})
	}
	function handleInput(row){
		row.statelabel.label = "已盘点"
		row.statelabel.type = ""
	}
</script>

<style>
	.icon-font{
		font-size: 24px;
	}
	.text-green{
		color: var(--el-color-success-dark-2);
	}
	.text-red{
		color: var(--el-color-danger-dark-2);
	}
	.font-12{font-size: 12px;margin-right:4px;}
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
	.m-t-16{margin-top: 16px;}
</style>
