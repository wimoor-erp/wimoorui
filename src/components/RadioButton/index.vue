<!-- RadioButton -->
<template>
	<el-button v-for="item in options" @click="handleClick(item.label)" :class="{'active':item.value}" link>{{item.label}}</el-button>
</template>

<script setup>
	import {ref,reactive,defineProps} from 'vue'
	let props = defineProps({
	  options:[]
	});
   function handleClick(val){
	   props.options.forEach((item)=>{
		  item.value = false 
		  if(item.label==val){
			  item.value = true
		  }
	   })
   }
    
</script>

<style scoped="scoped">
	.el-button.is-link{
		padding: 8px 15px;
		margin-bottom:16px;
	}
	.el-button.active{
		color:var(--el-color-primary);
		background-color:var(--el-color-primary-light-8)!important;
	}
	.el-button.is-link:focus, .el-button.is-link:hover {
		color:var(--el-color-primary)
	}
	.el-button+.el-button{
		margin-left: 0px;
		margin-right:12px;
	}
</style>
