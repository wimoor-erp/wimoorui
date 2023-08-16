<template>
	<el-form-item>
		<div class="flex-center">
		 <el-tabs type="border-card" class="p-l">
		    <el-tab-pane label="搜索">
				<el-input  v-model="searchKeywords" placeholder="请输入" clearable @input="handleQuery" class="input-with-select" >
				   <template #prepend>
				     <el-select v-model="searchtype" @change='searchTypeChange' placeholder="SKU"  style="width:90px">
				       <el-option label="SKU" value="sku"></el-option>
				       <el-option label="ASIN" value="asin"></el-option>
				       <el-option label="产品名称" value="name"></el-option>
				     </el-select>
				   </template>
				   <template #append>
				     <el-button @click="handleQuery">
				        <el-icon class="font-medium ic-cen">
				         <search />
				      </el-icon>
				     </el-button>
				   </template>
				 </el-input>
	             <el-table :data="tableData.records" height="408px">
					 <el-table-column label="商品信息" >
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
					 <el-table-column label="操作" width="110" >
						 <template #header>
							 <el-link type="primary" class="font-small" :underline="false">此页全部添加</el-link>
						 </template>
						 <template #default="scope">
							 <el-button v-if="!scope.row.disabled" @click="handleAdd(scope.row)">添加</el-button>
							 <el-button v-else disabled>已添加</el-button>
						 </template>
					 </el-table-column>
				 </el-table>
				  <el-pagination background layout="prev, pager, next" class="m-t-8" :total="1000" small/>
			</el-tab-pane>
		    <el-tab-pane label="手动输入">
				<el-input
				    v-model="textarea2"
				    type="textarea"
					:autosize="{ minRows:8, maxRows:8}"
				    placeholder="输入ASIN,用逗号隔开"
				  />
				<el-button class="m-t-8" type="primary">添加</el-button>  
			</el-tab-pane>
		  </el-tabs>
		  <div class="p-r">
			 <el-table :data="addedList" height="560px">
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
		tableData:{records:[
			{
				name:'ELECLAND 5 Packs Wooden Halloween Centerpiece Signs Halloween Table Decorations, Trick or Treat Table Signs with Witch Pum',
				msku:'A2007ELJJB-MH',
			},
		],total:100},
		addedList:[],
	})
	const{
		tableData,
		addedList,
	}=toRefs(state)
	
	
	function handleAdd(row){
		row.disabled = true
		state.addedList.push(row)
	}
</script>

<style scoped>
	.m-l-8{
		margin-left:8px;
	}
	.p-l{
		width:450px;
		height:560px;
	}
	.p-r{
		width:450px;
		height:560px;
		background-color:#f5f5f5;
	}
	.input-with-select{
		margin-bottom:16px;
	}
</style>