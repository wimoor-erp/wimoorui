<template>
	<el-space v-if="isform"><span  >
											
											<el-select v-model="ftype" class="mywarehouseleft"  placeholder="本地仓" @change="getWarehouseData">
											      <el-option  key="self" label="本地仓" value="self"> </el-option>
												  <el-option  key="oversea" label="海外仓" value="oversea"   > </el-option>
											</el-select>
											<el-select v-model="warehouseid" class="mywarehouseright"     placeholder="全部仓库" @change="warehouseChange">
											      <el-option  v-for="item in warehouseList"   :key="item.id"  :label="item.name" :value="item.id"   >
											      </el-option>
											</el-select>
											</span>
	</el-space>
	 <el-select v-else v-model="warehouseid"     placeholder="全部仓库" @change="warehouseChange">
	       <el-option  v-for="item in warehouseList"   :key="item.id"  :label="item.name" :value="item.id"   >
	       </el-option>
	 </el-select>
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { ref,reactive,onMounted,watch ,toRefs} from 'vue'
    const emit = defineEmits(["changeware",'change']);
	let props = defineProps({ defaultValue:"" ,isform:""})
	const { defaultValue ,isform} = toRefs(props);
	let warehouseList =ref([])
	let warehouseid =ref("");
	let ftype =ref("self");
			onMounted(()=>{
				getWarehouseData()
			})
			//获取仓库列表
			  function getWarehouseData(){
				  if(ftype.value=="oversea"){
					  warehouseApi.getOversaWarehouseUseable().then((res)=>{
					  	if(props.defaultValue!="only"){
					  		res.data.push({"id":"","name":"全部自有仓"})
					  	}
					  	warehouseList.value=res.data;
					  	if(res.data&&res.data.length>0){
					  	    if(props.defaultValue=="only"){
					  	    	 warehouseid.value=res.data[0].id;
					  	    }
					  		warehouseChange(warehouseid.value);
					  	}
					  })
				  }else{
					  warehouseApi.getWarehouseUseable().then((res)=>{
					  	if(props.defaultValue!="only"){
					  		res.data.push({"id":"","name":"全部自有仓"})
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
				
			}
			
			function warehouseChange(val){
				 emit("changeware",val);
				 emit("change",val)
			}
	
		 
</script>

<style>
	.mywarehouseleft .el-input__wrapper{
		border-top-right-radius:0px !important;
		border-bottom-right-radius:0px !important;
		width:90px;
	}
	.mywarehouseleft {
		border-right:none;
	}	
	.mywarehouseright .el-input__wrapper{
		border-top-left-radius:0px !important;
		border-bottom-left-radius:0px !important;
		border-left: none;
	}
</style>
