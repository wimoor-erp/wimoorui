<template>
	<el-space>
	  <el-select v-model="groupid"     placeholder="全部店铺" @change="groupChange">
	        <el-option  v-for="item in groupList"   :key="item.id"  :label="item.name" :value="item.id"   >
	        </el-option>
	  </el-select>
	  </el-space> 
	  <el-select   v-model="marketplaceid"    placeholder="全部国家" @change="marketChange">
	        <el-option  v-for="item in marketList"   :key="item.marketplaceid"  :label="item.name" :value="item.marketplaceid"   >
	        </el-option>
	  </el-select>
</template>

<script>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import groupApi from '@/api/amazon/group/groupApi';
	import marketApi from '@/api/amazon/market/marketApi'
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		name:"group",
		components:{MenuUnfold,Search,ArrowDown,SettingTwo,Help,Copy,MoreOne,},
		emits:["change"],
		props:["defaultValue","isproduct"],
		setup(props,context){
			let groupList =ref([])
			let marketList =ref([])
			let groupid=ref("")
			let marketplaceid = ref("")
			onMounted(()=>{
				getGroupData()
			})
		 
			//获取店铺列表
			function getGroupData(){
				groupApi.getAmazonGroup().then((res)=>{
					 if(props.defaultValue!="only"&&props.defaultValue!="onlyEU"){
						 res.data.push({"id":"","name":"全部店铺"})
					 }
					groupList.value=res.data;
					if(res.data&&res.data.length>0){
							 if(props.defaultValue!="all"){
						         groupid.value = res.data[0].id;
							}else{
								 groupid.value ="";
							}
							getMarketData(groupid.value);
					}
				})
			}
			//获取国家列表
			function getMarketData(id){
				marketApi.getMarketByGroup({'groupid':id}).then((res)=>{
					if(props.isproduct=='ok'){
						res.data.push({"id":"IEU","name":"欧洲(不含UK)","marketplaceid":"IEU"})
					}
					if(props.defaultValue=="onlyEU"){
						 var hasEu=false;
						if(res.data&&res.data.length>1){
								var list=[]
							 for(var i=0;i<res.data.length;i++){
								 if(res.data[i].region=='EU'){
									 res.data.splice(i,1);
									 hasEu=true;
								 }else{
									 list.push(res.data[i]);
								 }
							 }
							 if(hasEu){
								list.push({"id":"EU","name":"欧洲(不含UK)","marketplaceid":"EU"}); 
							 }
							res.data=list;
						}
					
					} 
					if(props.defaultValue!="only"&&props.defaultValue!="onlyEU"){
						res.data.push({"id":"","name":"全部国家","marketplaceid":""})
					}
					marketList.value=res.data;
					if(res.data&&res.data.length>0){
	        			if(props.defaultValue!="all"){
	        			  marketplaceid.value = res.data[0].marketplaceid;
						}else{
							marketplaceid.value = "";
						}
					}
					context.emit("change",getData());
				})
			}
			function groupChange(val){
				getMarketData(val);
			}
			
			function marketChange(val){
				context.emit("change",getData())
			}
		    function getData(){
				return {'groupid':groupid.value,"marketplaceid":marketplaceid.value};
			}
	
			 
			return{
				 groupList,marketList,groupChange,marketChange,groupid,marketplaceid,getData
			}
		}
	}
</script>

<style>
</style>
