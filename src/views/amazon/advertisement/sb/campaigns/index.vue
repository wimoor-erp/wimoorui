<template>
    <div class="flex">
		<div class="gird-line-left">
			 <LeftPlane @change="handleQuery" />
		</div>
		<div class="gird-line-right">
		     <RightPlane ref="rightPlaneRef"></RightPlane>
		</div>
	</div>
</template>
<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import { ElDivider } from 'element-plus'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import LeftPlane from '@/views/amazon/advertisement/common/portfolios_plane.vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import RightPlane from  "./components/header.vue";
	const globalTable=ref();
	const rightPlaneRef=ref(RightPlane);
	let state=reactive({type:"campaigns"});
	let {type} =toRefs(state);
    function handleQuery(queryParam){
		queryParam.campaignType="sb";
		rightPlaneRef.value.show(queryParam);
	}
</script>
<style scoped="scoped">
 .flex{
 	display: flex;
 }
.flex .gird-line-left{
	width: 220px;
}
.flex .gird-line-right {
    padding: 5px 16px;
	}
.flex .gird-line-right{
	flex:1;
}
.el-scrollbar{
	height: calc(100vh - 66px);
}
</style>
