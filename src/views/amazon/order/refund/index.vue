<template>
	<div class="main-sty">
		<Header  @getdata="getdata" @download="downloadlist" />
		<Table ref="tableRef" />
	</div>
</template>

<script>
	import { ref ,watch,reactive,onMounted} from 'vue'
	import Header from "./components/header.vue";
	import Table from "./components/table.vue";
	export default{
		name:'退货订单',
		components:{
			Header,Table
		},
		setup(){
			let tableRef = ref(Table); 
			function getdata(data){
				tableRef.value.loadData(data);
			}
			function downloadlist(){
				tableRef.value.downloadList();
			}
			return{
				tableRef,getdata,downloadlist
			}
		}
	}
</script>

<style>
</style>
