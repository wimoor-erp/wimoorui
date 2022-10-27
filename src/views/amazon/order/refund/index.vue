<template>
	<div class="main-sty">
		<Header  @getdata="getdata" @download="downloadlist" />
		<Table ref="tableRef" />
	</div>
</template>

<script>
	import { ref ,watch,reactive,onMounted} from 'vue'
	import Header from "./components/header";
	import Table from "./components/table";
	export default{
		name:'Index',
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
