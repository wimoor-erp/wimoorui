<template>
	<el-select v-model="category" filterable :popper-append-to-body="false" :teleported="false" @change="changeData"  placeholder="品类" clearable>
	      <el-option  
			  v-for="item in categoryList"   
			  :key="item.id"  
			  :label="item.name" 
			  :value="item.id" >
	      </el-option>
	</el-select>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,defineEmits,defineExpose } from 'vue'
	import materialApi from '@/api/erp/material/materialApi.js';
	const emit = defineEmits(['change']);
	let state =reactive({
		categoryList:[],
		category:"",
	})
	let{ categoryList,category }=toRefs(state)
	onMounted(()=>{
		loadcategoryList();
	});
	function loadcategoryList(){
		materialApi.getCategory().then((res)=>{
			res.data.push({"id":"","name":"全部分类"})
			if(res.data && res.data.length>0){
				state.categoryList=res.data;
			}
		});
	}
	function changeData(value){
		emit("change",value);
	}
	function reset(){
		state.category="";
	}
	defineExpose({
	  state,reset
	})
</script>

<style>
</style>