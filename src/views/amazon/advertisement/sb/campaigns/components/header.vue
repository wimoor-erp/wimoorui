<template>
	<div class="con-header">
	<el-row>
			<el-space>
				<el-button type="primary" class="im-but-one" @click.stop="handleAdd">
				  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
				  <span>添加活动</span>
				</el-button>
				<el-button @click.stop="handleDelete">归档</el-button>
				<Datepicker ref="datepickers" @changedate="changedate" />
				<el-input  v-model="queryParams.campaignName" @input="handleQuery" placeholder="活动名称" style="width: 250px;" class="input-with-select" >
					<template #suffix>
					  <el-icon style="font-size:16px;" class="el-input__icon" @click="handleQuery"><search/></el-icon>
				   </template> 
				</el-input>
				<el-radio-group v-model="queryParams.creativeType" >
				  <el-radio-button label="productCollection" >品牌广告</el-radio-button>
				  <el-radio-button label="video" >视频广告</el-radio-button>
				</el-radio-group>
			</el-space>
	    </el-row>
	</div>
	<Table ref="tableRef"></Table>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import { ElDivider } from 'element-plus'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Datepicker from '@/components/header/datepicker.vue';
	import Table from  "./table.vue";
	const tableRef=ref();
	let state=reactive({queryParams:{search:"",creativeType:"video",campaignType:"sb",fromDate:"",endDate:""}});
	let {queryParams} =toRefs(state);
	function handleQuery(){
		tableRef.value.show(state.queryParams);
	}
	function show(queryParams){
		 state.queryParams=Object.assign(state.queryParams, queryParams);
		 handleQuery();
	}
	//日期改变
	function changedate(dates){
		state.queryParams.fromDate=dates.start;
		state.queryParams.endDate=dates.end;
		if(state.queryParams.profileid){
			handleQuery();
		}
		
	}
	 defineExpose({ show })
</script>

<style scoped="scoped">
	.con-header{
		padding-top:20px;
	}
</style>
