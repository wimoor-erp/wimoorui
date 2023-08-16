<template>
	<el-form-item >
		<div class="flex-center" >
			<el-tabs type="border-card" class="p-l">
			<el-tab-pane label="排除品牌">
				<el-input placeholder="搜索品牌">
					 <template #suffix>
					  <el-icon><Search /></el-icon>
					 </template>
				</el-input>
				<el-table class="m-t-8" :data="suggestProduct" height="368px">
					 <el-table-column label="您的品牌" prop="asin"/>
					 <el-table-column label="操作" width="110" >
						 <template #header>
							 <el-button   type="primary" size="small" link>全部添加</el-button>
						 </template>
						 <template #default="scope">
							 <el-button >添加</el-button>
						 </template>
					 </el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="排除ASIN">
		  <el-input
		    v-model="textarea2"
		    type="textarea"
		 	:autosize="{ minRows:8, maxRows:8}"
		    placeholder="输入ASIN,用逗号隔开"
		  />
	      	<el-button class="m-t-8" >添加</el-button> 
			</el-tab-pane>
			</el-tabs>
			<div class="p-r">
				 <span class="font-extraSmall m-l-8">已否定 <span> 0 </span> 个商品</span>
				<el-table  :data="addList" height="448px">
						  <el-table-column label="否定目标" prop="keywords">
						  </el-table-column>
							  <el-table-column label="操作" width="60">
								  <template #header>
									  <el-button type="primary" class="font-small" link>清空</el-button>
									</template>
								  <template #default="scope">
									  <el-button link type="primary" >删除</el-button>
								  </template>
				               </el-table-column>
				 </el-table>
			</div>
		</div>	
	</el-form-item>

</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs,watch} from 'vue'
	const state = reactive({
	})
	const {
	}=toRefs(state)
    const props=defineProps({
		forms:{},
	})
	const {
	    forms,
	} = toRefs(props);
	
</script>

<style scoped>
	.p-l{
		width:450px;
		height:480px;
	}
	.p-r{
		width:450px;
		height:480px;
		background-color:#f5f5f5;
	}
	.m-l-8{
		margin-left:8px;
	}
</style>