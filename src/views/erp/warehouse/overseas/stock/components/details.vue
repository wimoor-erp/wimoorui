<template>
	<div >
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>填写备货单</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							<el-descriptions :column="2">
							    <el-descriptions-item label="单据编码">O202211170002</el-descriptions-item>
								<el-descriptions-item label="物流渠道">--</el-descriptions-item>
							    <el-descriptions-item label="发货仓库">xx仓</el-descriptions-item>
							    <el-descriptions-item label="预计到货日期">--</el-descriptions-item>
								<el-descriptions-item label="收货海外仓">Suzhou</el-descriptions-item>
								<el-descriptions-item label="状态">
									<el-tag type="success">已发货</el-tag>
								</el-descriptions-item>
								<el-descriptions-item label="备注">
								 发货单耗材出库
								</el-descriptions-item>
							  </el-descriptions>
						 <el-divider></el-divider>
						 <el-tabs
						    v-model="activeName"
						    type="card"
						    class="m-t-8"
						    @tab-click="handleClick"
						  >
						    <el-tab-pane label="备货商品" name="1">
						 <el-table border :data="TableData">
							 <el-table-column label="序号" type="index" width="80"/> 
							 <el-table-column  prop="image" label="图片"  >
							    <template #default="scope">
							     <el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
							 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
							   </template>
							 </el-table-column>
							 <el-table-column  prop="product" label="名称/SKU"  show-overflow-tooltip>
							    <template #default="scope">
							       <div class='name'>{{scope.row.name}}</div>
							       <div class='sku'>{{scope.row.sku}}
							       </div>
							   </template>
							 </el-table-column>
							 <el-table-column label="发货数量">
								  <template #default="scope">
									  <el-input v-model="scope.row.num">
									  </el-input>
								  </template>  
							 </el-table-column>
							 <el-table-column label="可用库存">
								  <template #default="scope">
									  <el-input v-model="scope.row.num">
									  </el-input>
								  </template>  
							 </el-table-column>
							 <el-table-column label="操作" width="80">
								  <template #default="scope">
								    <el-button @click="handleDelete (scope.row)" link type="primary" >删除</el-button>
					        	  </template>
							 </el-table-column>
						 </el-table>
						 </el-tab-pane>
						   <el-tab-pane label="物流信息" name="2">
							   
							</el-tab-pane>
							</el-tabs>
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
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus,Help} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,inject,toRefs } from 'vue'
	import {ElMessage } from 'element-plus'
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
		activeName:'1',
	})
	const {
		form,
		rules,
		activeName,
	}=toRefs(state)
			onMounted(()=>{
	
			});
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
</style>
