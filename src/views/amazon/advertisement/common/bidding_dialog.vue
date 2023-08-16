<template>
	<el-dialog
	title="竞价策略设置"
	v-model="visible"
	width="60%"
	>
	<el-form v-model="from" label-width="80px" label-position="left">
	    <BiddingTactics  :forms="form"/>
	</el-form>
	<template #footer>
		<el-button @click="visible=false">取消</el-button>
		<el-button type="primary">确认</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import {ref,reactive,toRefs} from"vue"
	import BiddingTactics from './create/bidding_tactics.vue'
	const state = reactive({
		visible:false,
		form:{radio:'1'},
	})
	const{
		visible,
		form,
	}=toRefs(state)
	defineExpose({
		show,
	})
	function show(){
		state.visible = true
	}
</script>

<style>
	.have-ass-text-radio .el-radio{
		height:inherit!important;
		line-height:24px;
		white-space: inherit;
	}
	.have-ass-text-radio p{
		font-size:12px;
		color:#acb0b9;
	}
</style>