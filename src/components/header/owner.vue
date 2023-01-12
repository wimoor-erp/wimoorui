<template>
			<el-select v-model="ownerid"     placeholder="产品负责人" @change="ownerChange">
			      <el-option  v-for="item in ownerList"    :label="item.name" :value="item.id"   >
			      </el-option>
			</el-select>
</template>

<script>
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		name:"owner",
		components:{ },
		emits:["owner"],
		props:["defaultValue","notAll"],
		setup(props,context){
			let ownerList =ref([])
			let ownerid=ref()
			onMounted(()=>{
				getOwnerData()
			})
		 
			//获取负责人列表
			function getOwnerData(){
				productinfoApi.getOwnerList().then((res)=>{
					if(res.data&&res.data.length>0){
						if(props.notAll!="isNotAll"){
							res.data.push({"id":"","name":"全部负责人"})
						}
						ownerList.value=res.data;
						ownerList.value.forEach((item,index)=>{
							if(!item){
								ownerList.value.splice(index,1)
							}
						})
						if(props.notAll!="isNotAll"){
							ownerid.value ="";
						}
						if(props.defaultValue){
							ownerid.value =props.defaultValue;
						}
						if(ownerid.value&&ownerid.value!=""){
							context.emit("owner",ownerid.value);
						}
					}
				})
			}
			//改变负责人
			function ownerChange(id){
				 context.emit("owner",id);
			}
			 
			return{
				 ownerid,ownerList,ownerChange,getOwnerData
			}
		}
	}
</script>

<style>
</style>
