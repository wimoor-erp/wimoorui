<template>
	<el-form-item>
		<div class="flex-center">
		 <el-tabs type="border-card" class="p-l">
		    <el-tab-pane label="输入ASIN">
				<el-input
				    v-model="textarea2"
				    type="textarea"
					:autosize="{ minRows:8, maxRows:8}"
				    placeholder="输入ASIN,用逗号隔开"
				  />
				  <el-space class="m-t-8">
				<el-button  >添加商品</el-button> 
				 <span class="font-extraSmall ">最多只能添加1000个商品!</span>
				 </el-space>
			</el-tab-pane>
		  </el-tabs>
		  <div class="p-r">
			<el-table :data="addedList" height="320px">
								 <el-table-column label="商品信息" >
												<template #header>
														<span class="font-small">已添加 <span> 0 </span> 商品</span>
												</template> 
								  <template #default="scope">
									  <div class="flex-center">
									  	   <el-image v-if="scope.row.location" :src="scope.row.location" class="product-img"   ></el-image>
									  	   <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img" ></el-image>
									  	   <div class="m-l-8">
									  		    <div class="text-omit-1">{{scope.row.name}}</div>
									  		   <p class="sku">{{scope.row.msku}}   </p>
									  		   <p class="font-extraSmall"><span>ASIN:B07ZP2JTZ5</span>
											   <el-divider direction="vertical"></el-divider>
											   <span>$2.30</span></p>
									  	   </div>
									  </div>
								  </template>
								 </el-table-column>
								 <el-table-column label="操作" width="60" >
									 <template #header>
										 <el-link type="primary" class="font-small" :underline="false">清空</el-link>
									 </template>
						 <template #default="scope">
										 <el-button link type="primary">删除</el-button>
						 </template>
				 </el-table-column>
			</el-table>
		  </div>
		  </div>
	</el-form-item>
</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs,watch} from 'vue'
	import {Search,} from '@element-plus/icons-vue'
	const state = reactive({
		addedList:[{
			keyword:'123',
			type:'否定精确'
		}],
	})
	const{
		addedList
	}=toRefs(state)
	
</script>

<style scoped>
	.m-l-8{
		margin-left:8px;
	}
	.p-l{
		width:450px;
		height:320px;
	}
	.p-r{
		width:450px;
		height:320px;
		background-color:#f5f5f5;
	}
</style>