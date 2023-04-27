<template>
	<div class="main-sty">
		<div class="con-header">
			<el-row>
				<el-col :span="24">
		<el-tabs v-model="activeName"  @tab-click="handleClick">
		    <el-tab-pane label="本地仓" name="1"></el-tab-pane>
		    <el-tab-pane label="FBA仓" name="2"></el-tab-pane>
		</el-tabs>
		<div class="flex-center-between">
		<el-space>
		  <el-button @click="download">导出</el-button>
		  <Group v-if="activeName=='2'" ref="groups" @change="changeGroup" />
		  <Warehouse v-if="activeName=='1'" @changeware="getWarehouse" />
		  <el-space :size="4">
		  <span class="font-extraSmall">库存日期：</span>
		  <el-date-picker
		        v-model="day"
		        type="date"
		        placeholder="请选择"
		      /></el-space>
		<el-input  v-model="searchKeywords" placeholder="请输入" @input="searchConfirm" class="input-with-select" >
		   <template #prepend>
		     <el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU" >
		       <el-option label="SKU" value="sku"></el-option>
		       <el-option label="产品名称" value="plan"></el-option>
		     </el-select>
		   </template>
		   <template #append>
		     <el-button @click="searchConfirm">
		        <el-icon style="font-size: 16px;align-itmes:center">
		         <search />
		      </el-icon>
		     </el-button>
		   </template>
		 </el-input>
		  </el-space>
		  			  <el-button   class='ic-btn' title='帮助文档'>
		  			  		<help theme="outline" size="16" :strokeWidth="3"/>
		  			  </el-button>
				 </div>
		  </el-col>
		  	</el-row>
		</div>  
	  <div class="con-body">
		  <Self v-if="activeName=='1'"/>
		  <Fba v-else/>
	  </div>
	</div>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {Help} from '@icon-park/vue-next';
	import Warehouse from '@/components/header/warehouse.vue';
	import Group from '@/components/header/group.vue';
	import Self from"./components/self.vue"
	import Fba from"./components/fba.vue"
	const state = reactive({
		activeName:'1', 
	})
	const {
		activeName,
	}=toRefs(state)
</script>

<style>
</style>
