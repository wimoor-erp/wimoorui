<template>
	<div class="main-sty">
		<Header @refreshTable="getdataArea"   @downloadOrderlist="downloadOrder"   @callbackReview="callbackReview"   />
		<Table ref="tableRef" />
	</div>
</template>

<script setup>
	import { ref ,watch,reactive,onMounted} from 'vue'
	import Header from "./components/header";
	import Table from "./components/table";
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
 
</script>

<style>
</style>
