<template>
	<div >
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>填写调库单</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							  <el-steps :active="0" finish-status="success" align-center class="m-b-t-24">
							    <el-step title="创建" />
							    <el-step title="审核"  />
							    <el-step title="配货中"  />
							    <el-step title="已发货"  />
							    <el-step title="完成"  />
							  </el-steps>
						 <el-form :model="form"
						   :rules="rules"
						   label-width="120px">
							  <el-row>
							 <el-col :span="12">
							 <el-form-item label="单据编码"   >
							 	<el-input class="in-wi-24" disabled  v-model="form.name" placeholder="请输入"> </el-input>
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
							 <el-form-item label="预计到货日期" >
							     <el-date-picker
							         v-model="value1"
							         type="date"
							         placeholder="请选择"
							       />
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
								 <el-form-item label="调出仓库" prop="warehouse">
								 	<el-select v-model="value"  placeholder="选择仓库">
								 	<el-option
								 	v-for="item in options"
								 	:key="item.value"
								 	:label="item.label"
								 	:value="item.value"
								 	/>
								 	</el-select>
								 </el-form-item>
							 </el-col>
							 <el-col :span="12">
							   <el-form-item label="调入仓库" prop="overseas">
							   	<el-select v-model="value"  placeholder="选择仓库">
							   	<el-option
							   	v-for="item in options"
							   	:key="item.value"
							   	:label="item.label"
							   	:value="item.value"
							   	/>
							   	</el-select>
							   </el-form-item>
							 </el-col>
							 <el-col :span="12">
								  <el-form-item label="备注"  >
									<el-input class="in-wi-24" type="textarea" v-model="form.name" placeholder="备注"> </el-input>
								  </el-form-item>
							 							
							 </el-col>
							  </el-row>
						 </el-form>
						
						 <el-divider></el-divider>
						 <div class="mark-re">
							<div>
						   <h5 >调库商品 </h5>
						   </div>
						   <el-button @click="handleAdd" type="primary">添加商品</el-button>
						 </div>
						 <el-table border :data="TableData">
							 <el-table-column label="序号" type="index" width="80"/> 
							 <el-table-column  prop="image" label="图片" width="80" >
							    <template #default="scope">
							    <el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
							 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
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
							 <el-table-column label="调库数量">
								  <template #default="scope">
									  <el-input v-model="scope.row.num">
									  </el-input>
								  </template>  
							 </el-table-column>
							 <el-table-column label="操作" width="80">
								  <template #default="scope">
								    <el-button @click="handleDelete(scope.row,scope.$index)" link type="primary" >删除</el-button>
					        	  </template>
							 </el-table-column>
						 </el-table>
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button type="" @click="closeTab">取消</el-button>
									<el-button type="primary" plain>直接完成</el-button>
									<el-button type="primary" @click="submitCompanyDetail">提交</el-button>
								</el-space>
							</div>
						</div>
	</div>
	<MaterialDialog @getdata="getdata" ref = "MaterialRef"/>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
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
		form:{
			name:'',
			
		},
		rules: {
			warehouse: [{ required: true, message: '发货仓库不能为空', trigger: 'blur' }],
			overseas: [{ required: true, message: '收货仓库不能为空', trigger: 'blur' }],
		},
		TableData:[],
	})
	const {
		form,
		rules,
		TableData,
	}=toRefs(state)
			onMounted(()=>{
	
			});
    function handleAdd(){
		MaterialRef.value.show()
	}
	function getdata(row){
		row.forEach((item)=>{
			state.TableData.push(item)
		})
	}
	function handleDelete(row,index){
		state.TableData.splice(index,1)
	}
</script>

<style>
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
