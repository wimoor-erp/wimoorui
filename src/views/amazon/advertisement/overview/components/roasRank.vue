<template>
	<div class='pag-radius-bor '>
		<div class="flex-center-between">
			<h4 class="nowrap">ROAS后五名</h4>
			<el-space>
            <AdGroup :selectSize="'small'" :border="true"/>
			<el-radio-group class="el-radio-group-button" v-model="wardatatype" size="small">
			     <el-radio-button label="广告组" />
			     <el-radio-button label="商品广告" />
			     <el-radio-button label="关键词" />
			  </el-radio-group>
			  </el-space>
		</div>
		<el-table height="444" class="m-t-16">
			<el-table-column label="广告组" prop="adgroup"/>
			<el-table-column label="所属广告活动" prop="campaign"/>
			<el-table-column label="花费" prop="cost"/>
			<el-table-column label="广告销量" prop="sale"/>
			<el-table-column label="ROAS" prop="roas"/>
		</el-table>
	</div>	
</template>

<script setup>
	import{ref,reactive,toRefs}from'vue';
	import AdGroup from '@/components/header/ad_group.vue';
</script>

<style scoped>
.nowrap{
	white-space:nowrap;
	margin-right:16px;
}
.m-t-16{
	margin-top:16px;
}
</style>