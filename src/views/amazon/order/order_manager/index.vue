<template>
	<div class="main-sty">
		<Header @refreshTable="getdataArea"   @downloadOrderlist="downloadOrder"   @callbackReview="callbackReview"   />
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
			let tableRef = ref();
			function getdataArea(rows){
				tableRef.value.getDataParams(rows)
			}
			function downloadOrder(rows){
				tableRef.value.downloadOrderXlsx(rows)
			}
			function callbackReview(){
					tableRef.value.callbackReview()
			}
			return{
				getdataArea,tableRef,downloadOrder,callbackReview
			}
		}
	}
</script>

<style>
</style>
