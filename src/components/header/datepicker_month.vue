<template>
	<el-date-picker
	        v-model="dateValue"
			@change = "dateChange"
	        type="monthrange"
			:clearable="false"
	        range-separator="至"
	        start-placeholder="开始日期"
	        end-placeholder="结束日期"
	      />
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
    const dateValue = ref()
	const emit = defineEmits(["changedate"])
	onMounted(()=>{
		dateValue.value=[new Date(),new Date()]
	})
	
	function dateChange(val){
		emit("changedate",val)
	}
</script>

<style>
</style>
