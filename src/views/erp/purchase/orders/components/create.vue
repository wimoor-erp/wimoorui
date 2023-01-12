<template>
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>填写采购单</h3>
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
							 	<el-input class="in-wi-24" disabled  v-model="form.name" placeholder="请输入"> </el-input>
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
							 <el-form-item label="供应商" >
							 	<el-input @focus="selectSupplier" class="in-wi-24"   v-model="form.name" placeholder="请输入"> </el-input>
							 </el-form-item>
							 </el-col>
							 <el-col :span="12">
								 <el-form-item label="入库仓库" prop="warehouse">
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
							 <el-form-item label="采购员" >
							 		<el-select v-model="value"  placeholder="请选择">
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
							 <el-col :span="12">
							 <el-form-item label="付款方式" >
							 		 <el-radio-group v-model="form.radio" class="ml-4">
							 		      <el-radio label="1">现结</el-radio>
							 		      <el-radio label="2">申请付款</el-radio>
							 		    </el-radio-group>
							 </el-form-item>
							 </el-col>
							  </el-row>
						 </el-form>
						
						 <el-divider></el-divider>
						 <div class="mark-re">
						   <h5 >商品列表</h5>
						   <div>
						   	<el-space>
								<el-tooltip
										 effect="dark"
										 content="组装产品可生成加工单"
										 placement="top-start"
								>
								 	<el-checkbox v-model="checked4" label="同步生成加工单" />	
								   </el-tooltip>
						   <el-button @click="upload" >辅料采购</el-button>
						   <el-button @click="upload" >导入商品</el-button>
						   </el-space>
						    <el-button @click="handleAdd" type="primary">添加商品</el-button>
						 </div>
						 </div>
						 <table class="sd-table"  border="0" cellpadding="0" cellspacing="0">
							 <thead>
								 <tr>
									 <th width="65">图片</th>
									 <th>名称/SKU</th>
									 <th>数量</th>
									 <th>单价</th>
									 <th>总金额</th>
									 <th width="245">预计到货日期</th>
									 <th width="80">操作</th>
								 </tr>
							 </thead>
							 <tbody v-for="item in tableData">
								 <tr >
									 <td>
										 <el-image v-if="item.image" :src="item.image"  class="product-img"   ></el-image>
										 <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
									 </td>
									 <td >
										 <el-space>
											 <div>
											 <el-tooltip
												         effect="dark"
												         :content="item.name"
												         placement="top-start"
											 >
												      <div class='name overflow-text' >{{item.name}}</div>
												       </el-tooltip>
										 <div class='sku'>{{item.sku}}</div>
										    </div>
										 <el-tag type="warning" v-if="item.type=='组合'"  effect="plain">组合</el-tag>
										 </el-space>
									 </td>
									 <td >
										 <el-input v-model="item.num">
										 </el-input>
									 </td>
									 <td >
										<el-input v-model="item.num"  v-if="item.type!=='组合'">
										        <template #prefix >
										          ￥
										        </template>
										      </el-input>
									 </td>
									 <td >
										<el-input v-model="item.num"  v-if="item.type!=='组合'">
										        <template #prefix >
										          ￥
										        </template>
										      </el-input>
									 </td>
									 <td >
										 <el-date-picker
										         v-if="item.type!=='组合'"
										         v-model="item.day"
										         type="date"
										         placeholder="请选择"
										       />
									 </td>
									 <td>
										  <el-button @click="handleDelete (item.row)" link type="primary" >删除</el-button>
									 </td>
									<!-- 子产品 -->
								 </tr>
								 <tr v-if="item.type=='组合'">
									 <td colspan="7" class="subtable">
										 <el-table :data="item.SubSku" size="small">
											 <el-table-column label="图片" width="65">
											   <template #default="scope">
												 <el-image v-if="scope.row.image" :src="scope.row.image"  class="product-img"   ></el-image>
												 <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
											  </template> 
											 </el-table-column>
											 <el-table-column label="名称/子SKU" show-overflow-tooltip>
											   <template #default="scope">
												<div class='name'>{{scope.row.name}}</div>
												<div class='sku'>{{scope.row.sku}}</div>
											  </template> 
											 </el-table-column>
											 <el-table-column label="单位个数" width="100"/>
											 <el-table-column label="待入库" width="100" />
											 <el-table-column label="库存" width="100"/>
											 <el-table-column label="数量">
											   <template #default="scope">
											   <el-input v-model="scope.row.num">  </el-input>
											  </template> 
											 </el-table-column>
											 <el-table-column label="单价">
											   <template #default="scope">
											  <el-input v-model="scope.row.num"  >
											          <template #prefix >
											            ￥
											          </template>
											        </el-input>
											  </template> 
											 </el-table-column>
											 <el-table-column label="总金额">
											   <template #default="scope">
											    <el-input v-model="scope.row.num"  >
											        <template #prefix >
											          ￥
											        </template>
											      </el-input>
											  </template> 
											 </el-table-column>
											 <el-table-column label="预计到货日期" width="245">
											   <template #default="scope">
												<el-date-picker
												        v-model="scope.row.day"
												        type="date"
												        placeholder="请选择"
												      />
											  </template> 
											 </el-table-column>
											 <el-table-column label="操作" width="80">
												 <template #default="scope">
													   <el-button @click="handleDelete(scope.row)" link type="primary" >删除</el-button>
												 </template>
											 </el-table-column>
										 </el-table>
									 </td>
								 </tr>
							 </tbody>
						 </table>
						</div>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							 <div style="padding-top:10px;">
								<el-space>
									<el-button type="" @click="closeTab">关闭</el-button>
									<el-button type="" @click="closeTab">保存</el-button>
									<el-button type="primary" @click="submitCompanyDetail">提交</el-button>
								</el-space>
							</div>
						</div>
	<MaterialDialog  ref = "MaterialRef"/>
	<SupplierDialog ref="supplierRef"/>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import '@/assets/css/packbox_table.css'
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage } from 'element-plus'
	import MaterialDialog from "@/views/erp/baseinfo/material/materialDialog"
	import SupplierDialog from "@/views/erp/baseinfo/supplier/supplier_dialog"
	import { useRoute,useRouter } from 'vue-router'
	const MaterialRef = ref()
	const supplierRef = ref()
	const emitter = inject("emitter"); // Inject `emitter`
	function closeTab(){
		emitter.emit("removeTab", 100);
	};
	const state = reactive({
		tableData:[{
			type:'组合',
			img: require('@/assets/image/testpic.png'),
			name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
			state:{label:'待审核',type:'warning'},
			price:'￥46.00',
			num:'50',
			amount:'￥8600.00',
			warehouse:'龙华仓',
			SubSku:[
				{
					img: require('@/assets/image/testpic.png'),
					name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
					sku: 'fe002',
				},
				{
					img: require('@/assets/image/testpic.png'),
					name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
					sku: 'qk004',
				}
			]
		},
		{
			type:'',
			img: require('@/assets/image/testpic.png'),
			name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
			sku: 'fe002',
		}],
		form:{
			name:'',
			radio:'1',
		},
		rules: {
			warehouse: [{ required: true, message: '出库仓库不能为空', trigger: 'blur' }],
		},
	})
	const {
		form,
		rules,
		tableData,
	}=toRefs(state)
			onMounted(()=>{
			});
    function handleAdd(){
		MaterialRef.value.show()
	}
	function selectSupplier(){
		supplierRef.value.show()
	}
</script>

<style>
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
	.subtable {
		padding:0!important;
	}
	.subtable td{
		background-color: var(--el-bg-color);
	}
	.overflow-text{
		width: 200px;
		   overflow: hidden;
		    display: -webkit-box;
		    -webkit-box-orient: vertical;
		    -webkit-line-clamp:1;
	}
</style>
