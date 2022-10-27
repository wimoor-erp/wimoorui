<template>
	  <el-select v-model="warehouseid"     placeholder="全部仓库" @change="warehouseChange">
	        <el-option  v-for="item in warehouseList"   :key="item.id"  :label="item.name" :value="item.id"   >
	        </el-option>
	  </el-select>
</template>

<script>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		name:"warehouse",
		components:{MenuUnfold,Search,ArrowDown,SettingTwo,Help,Copy,MoreOne,},
		emits:["changeware"],
		props:["defaultValue"],
		setup(props,context){
			let warehouseList =ref([])
			let warehouseid =ref("")
			onMounted(()=>{
				getWarehouseData()
			})
		 
			//获取仓库列表
			function getWarehouseData(){
				warehouseApi.getWarehouseUseable().then((res)=>{
					if(props.defaultValue!="only"){
						res.data.push({"id":"","name":"全部"})
					}
					warehouseList.value=res.data;
					if(res.data&&res.data.length>0){
					    if(props.defaultValue=="only"){
					    	 warehouseid.value=res.data[0].id;
					    }
						warehouseChange(warehouseid.value);
					}
				})
			}
			
			function warehouseChange(val){
				context.emit("changeware",val)
			}
	
			return{
				 warehouseList,warehouseChange,warehouseid
			}
		}
	}
</script>

<style>
</style>
