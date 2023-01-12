<template>
	  <el-select   v-model="marketplaceid"    placeholder="全部国家" @change="marketChange">
	        <el-option  v-for="item in marketList"   :key="item.marketplaceid"  :label="item.name" :value="item.marketplaceid"   >
	        </el-option>
	  </el-select>
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import groupApi from '@/api/amazon/group/groupApi';
	import marketApi from '@/api/amazon/market/marketApi'
	import { ref,reactive,onMounted,watch } from 'vue'
			let marketList =ref([])
			let marketplaceid = ref("")
		 	const emit = defineEmits(['change']);
			//获取国家列表
			function show(id,isInit){
				marketApi.getMarketByGroup({'groupid':id}).then((res)=>{
					res.data.push({"id":"IEU","name":"欧洲(不含UK)","marketplaceid":"IEU"})
					res.data.push({"id":"","name":"全部国家","marketplaceid":""})
					marketList.value=res.data;
					marketplaceid.value = "";
					if(!isInit){
					   emit("change",getData());
					}
				})
			}
			defineExpose({ show })	 
			function marketChange(val){
				emit("change",val)
			}
		 
			 
	 
</script>

<style>
</style>
