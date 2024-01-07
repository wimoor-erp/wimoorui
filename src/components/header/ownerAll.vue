<template>
	<el-select v-model="defaultValue"  v-if="isInForm" filterable placeholder="产品负责人" @change="ownerChange">
	    <el-option
	      v-for="item in ownerList"
	      :key="item.id"
	      :label="item.name"
	      :value="item.id"
	    > </el-option>
	  </el-select>
	  <el-select v-model="ownerid"  v-else filterable placeholder="产品负责人" @change="ownerChange">
	      <el-option
	        v-for="item in ownerList"
	        :key="item.id"
	        :label="item.name"
	        :value="item.id"
	      > </el-option>
	    </el-select>
</template>

<script>
	import userApi from '@/api/sys/admin/userApi.js';
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		name:"ownerAll",
		components:{ },
		emits:["owner"],
		props:["defaultValue","notAll","isInForm","alltitle"],
		setup(props,context){
			let ownerList =ref([])
			let ownerid=ref()
			onMounted(()=>{
				setTimeout(function(){getOwnerData()},300);
			})
		    function reset(){
				ownerid.value ="";
				if(props.notAll!="isNotAll"){
					ownerid.value ="";
				}
				if(props.defaultValue){ 
					ownerid.value =props.defaultValue;
				}
			}
			//获取负责人列表
			function getOwnerData(){
				userApi.findOwnerAll().then((res)=>{
					if(res.data&&res.data.length>0){
						if(props.notAll!="isNotAll"){
							if(props.alltitle){
								res.data.push({"id":"","name":props.alltitle})
							}else{
							   res.data.push({"id":"","name":"全部负责人"})
							}
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
						if(props.notAll=="isNotAll"&&!props.defaultValue){
							userApi.getInfo().then(res=>{
								if(!props.defaultValue){
									ownerid.value =res.data.id;
									ownerChange(ownerid.value);
								}else{
									ownerid.value =props.defaultValue;
								}
							})
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
				 ownerid,ownerList,ownerChange,getOwnerData,reset,
			}
		}
	}
</script>

<style>
</style>
