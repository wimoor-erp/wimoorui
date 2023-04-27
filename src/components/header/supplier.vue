<template>
	  <el-select   v-model="supplier" filterable   placeholder="全部供应商" @change="supplierChange">
	        <el-option  v-for="item in supplierList"   :key="item.id"  :label="item.name" :value="item.id"   >
	        </el-option>
	  </el-select>
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import customerApi from '@/api/erp/material/customerApi.js';
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['change']);
    const state=reactive({
		supplierList:[],
		supplier:"",
	});
	const { supplierList,supplier} = toRefs(state);
	let props = defineProps({ defaultValue:"" })
	const { defaultValue } = toRefs(props);
    function getData(){
				customerApi.listAll().then((res)=>{
					if(props.defaultValue!="only"){
						res.data.push({"id":"","name":"全部供应商"})
					}
					state.supplierList=res.data;
					if(res.data&&res.data.length>0){
	        			if(props.defaultValue=="only"){
	        			    state.supplier = res.data[0].id;
						}else{
							state.supplier = "";
						}
					}
					emit("change",state.supplier);
				})
			}
			
	function supplierChange(val){
		emit("change",state.supplier)
	}
	function reset(){
		state.supplier ="";
	}
	defineExpose({
	  getData,supplierChange,reset
	})	 
	onMounted(()=>{
		getData()
	})
</script>

<style>
</style>
