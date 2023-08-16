<template>
		<div class="main-sty">
	 <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
	     <el-tab-pane label="费用公式" name="fbafee"></el-tab-pane>
	     <el-tab-pane label="尺寸分段公式" name="tierformat"></el-tab-pane>
		 <el-tab-pane label="分段管理" name="tier"></el-tab-pane>
	   </el-tabs>
	   <FBAFee v-if="activeName=='fbafee'"></FBAFee>
	   <TierFormat v-if="activeName=='tierformat'"></TierFormat>
	   <Tier v-if="activeName=='tier'"></Tier>
	   </div>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import FBAFee from "./component/fba.vue";
	import TierFormat from "./component/tierformat.vue";
	import Tier from "./component/tier.vue";
	 let state=reactive({
	 	 activeName:"fbafee",
	 });
	 let {
	 activeName
	 } =toRefs(state);
</script>

<style>
</style>
