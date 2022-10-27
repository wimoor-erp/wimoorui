<template>
	<el-row >
		<el-col :span="24">
			<Header @getComputedResult = "getComputedResult"/>
		</el-col>
		<!-- 计算进度条 -->
		<div class="el-loading-mask" v-if="loading">
			<div class="el-loading-spinner">
				 <el-progress indeterminate="true" :percentage="50" style="width: 50%;margin:24px auto;"/>
				<p class="el-loading-text">发货量计算中...</p>
			</div>
		</div>
	</el-row>
</template>

<script setup>
import { ref ,watch,reactive,onMounted} from 'vue'
import Header from "./components/header";
import {Help} from '@icon-park/vue-next';
	   let loading =ref(false)
	   function getComputedResult(val){
		   loading.value = val
	   }
</script>

<style>
	.el-loading-mask{
		z-index: 997;
	}
</style>
