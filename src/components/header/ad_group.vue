<template>
	<div class="flex-center"  :class="{'no-border':!border}" >
	  <el-select v-model="groupid"  :size="selectSize"   placeholder="全部店铺" @change="groupChange">
	        <el-option  v-for="item in groupList"   :key="item.id"  :label="item.name" :value="item.id"   >
	        </el-option>
	  </el-select>
	  <el-divider v-if="!border" direction="vertical"></el-divider>
	  <span v-else class="m-r-8"></span>
	  <el-select   v-model="marketplaceid"  :size="selectSize"  placeholder="全部国家" @change="marketChange">
	        <el-option  v-for="item in marketList"  :key="item.id"  :label="item.name"  :value="item.id"   >
				{{item.name}}-{{item.ftype}}
	        </el-option>
	  </el-select>
	  </div>
</template>

<script setup>
	import { ref,reactive,onMounted,watch,toRefs} from 'vue';
	import groupApi from '@/api/amazon/group/groupApi';
	import advertApi from '@/api/amazon_adv/advertApi.js';
	const emit = defineEmits(['change']);
	const props = defineProps({
		selectSize:'',
		border:'',
	})
	const{
		selectSize,
		border,
	}=toRefs(props)
	const state = reactive({
		groupList:[],
		groupid:'',
		marketList:[],
		marketplaceid:'',
	})
	const{
		groupList,
		groupid,
		marketList,
		marketplaceid,
	}=toRefs(state)
	
	//获取店铺列表
	function getGroupData(){
		groupApi.getAmazonGroup().then((res)=>{
			state.groupList=res.data;
			if(res.data&&res.data.length>0){
				state.groupid = res.data[0].id;
				getMarketData(state.groupid);
			}
		})
	}
	
	
	//获取国家列表
	function getMarketData(id){
		state.marketplaceid=null;
		advertApi.loadProfile({'groupid':id}).then((res)=>{
			state.marketList=res.data;
			if(res.data&&res.data.length>0){
				  state.marketplaceid = res.data[0].id;
			}
			emit("change",getData());
		})
	}
	function groupChange(val){
		getMarketData(val);
	}
	
	function marketChange(val){
		emit("change",getData())
	}
	function getData(){
		return {'groupid':state.groupid,"profileid":state.marketplaceid};
	}
	onMounted(()=>{
		getGroupData()
	})
</script>

<style >
	.no-border .el-input__wrapper{
		box-shadow:none!important;
	}
	.m-r-8{
		margin-right:8px;
	}
</style>