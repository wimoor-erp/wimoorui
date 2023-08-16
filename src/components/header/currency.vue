<template>
	<el-select v-model="currency"  @change="changeData"  >
	      <el-option  
			  v-for="item in currencyList"   
			  :key="item.id"  
			  :label="item.name" 
			  :value="item.id" >
	      </el-option>
	</el-select>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs,} from 'vue'
	const emit = defineEmits(['change']);
	const state =reactive({
		currencyList:[
			{name:'CNY',id:'1'},
			{name:'USD',id:'2'},
			{name:'站点币种',id:'3'},
		],
		currency:"CNY",
	})
	const{ currencyList,currency }=toRefs(state)
	onMounted(()=>{
		loadcurrencyList();
	});
	function loadcurrencyList(){
	}
	function changeData(value){
		emit("change",value);
	}
	function reset(){
		state.currency="CNY";
	}
	defineExpose({
	  state,reset
	})
</script>

<style>
</style>