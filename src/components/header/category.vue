<template>
	<el-select v-model="category"  :popper-append-to-body="false" :teleported="false" @change="changeData"  placeholder="全部品类" clearable>
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
			if(res.data && res.data.length>0){
				res.data.push({"id":"","name":"全部"});
				state.categoryList=res.data;
			}
		});
	}
	function changeData(value){
		emit("change",value);
	}
</script>

<style>
</style>