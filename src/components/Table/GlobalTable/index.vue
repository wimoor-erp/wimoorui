<template>
	  <el-table :data="tableData.records" v-loading="loading" :default-sort="defaultSort"
	    :stripe="stripe" 
		:border="border"
		:height="height"
		:show-summary="showSummary"
		:summary-method="summaryMethod"
	    @sort-change="tableSort" 
		@selection-change='selectChange'  
	     style="width: 100%;margin-bottom:16px;">
		  <slot  name="field"></slot>
	  </el-table>
	  
	  <el-pagination background v-if="inDialog"  layout="total, sizes, prev, next, jumper"   :total="tableData.total"
	  :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
	  <el-pagination background v-else  layout="total, sizes, prev, pager, next, jumper"   :total="tableData.total"
	  :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
</template>
<script>
  import {vue,reactive,ref,watch,onMounted} from "vue";
  import { ElMessage,ElLoading } from 'element-plus';
  export default{
	  name:'GlobalTable',
	  components:{},
	  props:["tableData","inDialog","defaultSort","stripe","border","height","showSummary","summaryMethod"],
	  emits:["loadTable","selectionChange"],
  	  setup(prop,context){
		let pagesize =ref(10);
		let currentPage =ref(1);
		let loading =ref(false);
		let params=reactive({pagesize:10,currentpage:1});
  		function handleSizeChange(size){
			pagesize.value=size;
			params.pagesize=size;
			params.currentpage=1;
			currentPage.value=1;
			refreshTable();
  		}
		if(prop.defaultSort){
			params.sort=prop.defaultSort.prop;
			params.order=prop.defaultSort.order=="ascending"?"asc":"desc";
		}
		const tableSort=function(option){
			  params.sort=option.prop;
			  params.order=option.order=="ascending"?"asc":"desc";
			  params.currentpage=1;
			  currentPage.value=1;
			  refreshTable();
		}
  		function handleCurrentChange(page){
			currentPage.value=page;
			params.currentpage=page;
			refreshTable();
  		}
		function refreshTable(){
			 loading.value=true;
			 params.loadType="refreshTable";
			 context.emit("loadTable",params) ;
		}
		function loadTable(param){
			 loading.value=true;
			 params.currentpage=1;
			 currentPage.value=1;
			 if(param){
			    params=Object.assign(params, param);
			 }
			 params.loadType="loadTable";
			 context.emit("loadTable",params) ;
		}
		function selectChange(selection){
			 context.emit("selectionChange",selection) ;
		}
		 onMounted(() => {
			 if(prop.stripe==undefined){
				 prop.stripe=true;
			 }
			 if(prop.border==undefined){
			 	 prop.border=false;
			 }
			 if(prop.height==undefined){
				 prop.height="calc(100vh - 220px)";
			 }
			 if(prop.inDialog){
		         refreshTable();
			 }
			 
		 })
		 
		 watch(prop.tableData,(val)=>{
		 		  loading.value = false;
		 })
  		return {
			currentPage,
			pagesize,
  			handleSizeChange,
			handleCurrentChange,
			params,
			loadTable,
			loading,
			tableSort,
			selectChange,
  		}
  	}
  }
</script>

<style>
</style>
