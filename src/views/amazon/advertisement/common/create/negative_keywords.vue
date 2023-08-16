<template>
	<el-form-item>
		<div class="flex-center">
		 <el-tabs type="border-card" class="p-l">
		    <el-tab-pane label="否定精确">
				<el-input
				    v-model="textarea2"
				    type="textarea"
					:autosize="{ minRows:8, maxRows:8}"
				    placeholder="输入关键词,用逗号隔开"
				  />
				  <el-space class="m-t-8">
				<el-button  >添加关键词</el-button> 
				 <span class="font-extraSmall ">最多只能添加1000个关键词!</span>
				 </el-space>
			</el-tab-pane>
		    <el-tab-pane label="否定词组">
				<el-input
				    v-model="textarea2"
				    type="textarea"
					:autosize="{ minRows:8, maxRows:8}"
				    placeholder="输入关键词,用逗号隔开"
				  />
				  <el-space class="m-t-8">
				<el-button  >添加关键词</el-button> 
				 <span class="font-extraSmall ">最多只能添加1000个关键词!</span>
				 </el-space>
			</el-tab-pane>
		  </el-tabs>
		  <div class="p-r">
			  <span class="font-extraSmall m-l-8">已添加 <span> 0 </span> 个关键词</span>
			 <el-table :data="tableData" height="288px">
					 <el-table-column label="否定关键词" prop="keyword"/>
					 <el-table-column label="匹配类型" prop="type"/>
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
		tableData:[{
			keyword:'123',
			type:'否定精确'
		}],
	})
	const{
		tableData
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