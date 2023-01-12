<template>
	<div >
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <div class="gird-line-head">
						 <h3>产品互调详情</h3>
						 <el-button   class='ic-btn' title='帮助文档'>
						   <help theme="outline" size="16" :strokeWidth="3"/>
						 </el-button>
						 </div>
						 <div class="fill-from-body">
							<el-descriptions :column="2">
							    <el-descriptions-item label="单据编码">O202211170002</el-descriptions-item>
							    <el-descriptions-item label="操作仓库">xx仓</el-descriptions-item>
								<el-descriptions-item label="操作人">张三</el-descriptions-item>
								<el-descriptions-item label="操作时间">2023-01-01</el-descriptions-item>
								<el-descriptions-item label="备注">
								 发货单耗材出库
								</el-descriptions-item>
							  </el-descriptions>
						 <el-divider></el-divider>
						 <div class="mark-re">
							<div>
						   <h5 >商品列表</h5>
						   </div>
						 </div>
					<el-table border :data="TableData">
												 <el-table-column label="序号" type="index" width="60"/> 
												 <el-table-column label="调入产品信息"  show-overflow-tooltip>
												    <template #default="scope">
														<el-space>
															<div>
																<el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
																<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
															</div>
														<div>
												         <div class='name'>{{scope.row.name}}</div>
												         <div class='sku'>{{scope.row.sku}} </div>
													   </div>
													   </el-space>
												   </template>
												 </el-table-column>
												 <el-table-column label="可用库存" prop="fulfillable"/>
												 <el-table-column label="调出产品信息"  show-overflow-tooltip>
												    <template #default="scope">
														<el-space>
															<div>
																<el-image v-if="scope.row.image2" :src="scope.row.image2" class="product-img" ></el-image>
																<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
															</div>
														<div>
												         <div class='name'>{{scope.row.name2}}</div>
												         <div class='sku'>{{scope.row.sku2}} </div>
													   </div>
													   </el-space>
												   </template>
												 </el-table-column>
												 <el-table-column label="可用库存" prop="fulfillable2"/>
												 <el-table-column label="调库数量">
													  <template #default="scope">
														  <el-input v-model="scope.row.num">
														  </el-input>
													  </template>  
												 </el-table-column>
					</el-table>
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
	})
	const {
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
