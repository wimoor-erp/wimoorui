<template>
	<el-popover
	     :visible="visible"
	    placement="left"
	    title="指标筛选"
	    :width="800"
	    trigger="click"
	  >
	   <el-row class="filter-box"> 
		   <el-col :span="12" class="search-item">
			   <el-scrollbar height="480px">
				   <div class="vertical-flex-space">
				   <div class="filter-item">
				   <div class="list-item m-b-8" v-for="(item,index) in dataList" :key="index">
					   <el-space >
						   <el-select v-model="item.dataType" @change="e=>handleChangeOptios(e,item)">
							   <el-option v-for="option in optionsList" :label="option.name" :value="option.value"></el-option>
						   </el-select>	
						   <el-select v-model="item.symbolType" >
							   <el-option v-for="option in symbolList" :label="option.name" :value="option.value"></el-option>
						   </el-select>
						   <el-input v-model="item.dataVal">
							   <template #suffix v-if="item.chartype">
							    %
							   </template>
						   </el-input>
						   <el-button
							@click="handleDelect(index)"
							:disabled="index==0" link><el-icon><CloseBold /></el-icon></el-button>
					   </el-space>
				   </div>
				   <el-button type="primary"
						@click="handleAdd"
						link>
						   <el-icon class="font-medium"><Plus /></el-icon>
						   添加筛选条件</el-button>
					</div>
				   <div class="flex-center-between">
					   <el-button @click="removeAll" link type="info"><el-icon><Delete /></el-icon>清空所有</el-button>
					   <el-button  @click="handleSave" link type="info">保存这次搜索</el-button>
				   </div>
					</div>
			   </el-scrollbar>
		   </el-col >
		   <el-col :span="12" class="search-history">
			   <h5>我的搜索条件</h5>
			   <el-table :data="tableData" class="m-t-8">
				   <el-table-column label="搜索条件"></el-table-column>
				   <el-table-column label="操作" width="80">
					   <template #defalut="scope">
						   <button link type="primary">筛选</button>
					   </template>
				   </el-table-column>
			   </el-table>
		   </el-col>
	   </el-row>
	   <div class="footer-popover">
		   <el-button @click="visible=false">取消</el-button>
		   <el-button type="primary">筛选</el-button>
	   </div>
	    <template #reference>
	     <el-button @click="visible=true">筛选器</el-button>
	    </template>
	  </el-popover>
	
</template>

<script setup>
	import {ref ,reactive,onMounted,toRefs} from 'vue'
	import {Plus,CloseBold,Delete} from '@element-plus/icons-vue'
	const state = reactive({
		visible:false,
		dataList:[
			{dataType:1,symbolType:1,dataVal:'',chartype:true,},
		],
		optionsList:[
			{name:'转化率',value:1,chartype:true,},
			{name:'曝光量',value:2,chartype:false,},
			{name:'ACOS',value:3,chartype:true,},
			{name:'点击率',value:4,chartype:true,},
		],
		symbolList:[
			{name:'大于',value:1,},
			{name:'等于',value:2,},
			{name:'小于',value:3,},
		],
	})
	
	const{
		visible,
		dataList,
		optionsList,
		symbolList,
	}=toRefs(state)
	
	function handleAdd(){
		state.dataList.push(
		   {dataType:1,symbolType:1,dataVal:'',chartype:true,}
		)
	}
	
	function handleChangeOptios(e,item){
		if(e==2){
			item.chartype = false
		}else{
			item.chartype = true
		}
	}
	function handleDelect(index){
		state.dataList.splice(index,1)
	}
	
	function removeAll(){
		state.dataList = [{dataType:1,symbolType:1,dataVal:'',chartype:true,}]
	}
	
	function handleSave(){ 
		
	}
</script>

<style>
	.filter-box{
		border:1px solid #eee;
		display:flex;
		border-radius:4px;
	}
	.search-item{
		background-color:#f5f5f5;
		padding:16px;
	}
	.search-history{
		padding:16px;
	}
	.footer-popover{
		margin-top:12px;
	}
	.m-b-8{
		margin-bottom:8px;
	}
	.vertical-flex-space{
		height:100%;
		display: flex;
		flex-direction:column;
		justify-content: space-between;
	}
	.filter-item{
		flex-grow:1;
	}
</style>