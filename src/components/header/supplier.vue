<template>
	  <el-select v-model="value" filterable clearable  placeholder="全部供应商">
	    <el-option
	      v-for="item in options"
	      :key="item.value"
	      :label="item.label"
	      :value="item.value"
	    />
	  </el-select>
</template>

<script setup>
	import { ref,reactive,onMounted,watch } from 'vue'
	let value = ref('')
	let options=reactive([
		{label:'a供应商',value:'1'},
		{label:'b供应商',value:'2'},
		{label:'c供应商',value:'3'},
	])
</script>

<style>
</style>
