<template>
	<div class="add-from el-white-bg">
	<div class="gird-line-head">
		<h3>添加货件</h3>
		<el-button   class='ic-btn' title='帮助文档'>
		  <help theme="outline" size="16" :strokeWidth="3"/>
		</el-button>
	</div>
	<Fromlist/>
	
	</div>
</template>

<script>
	import {Help}from"@icon-park/vue-next";
	import Fromlist from"./components/form"
	export default{
		name:'Index',
		components:{
			Help,Fromlist,
		},
	}
</script>

<style>
	.add-from .divider{
		margin-left:24px;
		margin-right:24px;
	}
</style>
