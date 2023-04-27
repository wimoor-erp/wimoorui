<template>
	  <el-table v-if="tableData"
	    :data="tableData.records" 
		:id="uuid"
		ref="globalTableRef"
	    v-loading="loading" 
		element-loading-text="加载中..."
		:default-sort="defaultSort"
	    :stripe="stripe" 
		:border="border"
		:height="height"
		:show-summary="showSummary"
		:summary-method="summaryMethod"
	    :row-class-name="rowClassName"
		:cell-class-name="cellClassName"
		:row-key="rowKey"
		:highlight-current-row="highlightCurrentRow"
		@row-click="rowClick"
	    @sort-change="tableSort" 
		@expand-change="expandChange"
		@selection-change='selectChange'  
		@current-change="currentChange"
	     style="width: 100%;margin-bottom:16px;">
		  <slot  name="field"></slot>
	  </el-table>
	  
	  <el-table v-else
	         :id="uuid"
	         :data="mTableData.records" 
	  		 ref="globalTableRef"
	         v-loading="loading" 
			 element-loading-text="加载中..."
	  		:default-sort="defaultSort"
	        :stripe="stripe" 
	  		:border="border"
	  		:height="height"
	  		:show-summary="showSummary"
	  		:summary-method="summaryMethod"
			:row-key="rowKey"
			:row-class-name="rowClassName"
			:cell-class-name="cellClassName"
			:highlight-current-row="highlightCurrentRow"
			@row-click="rowClick"
	        @sort-change="tableSort" 
			@expand-change="expandChange"
	  		@selection-change='selectChange'  
			@current-change="currentChange"
	         style="width: 100%;margin-bottom:16px;">
	  		<slot  name="field"></slot>
	  </el-table>
	  <el-pagination background v-if="inDialog&&tableData"  layout="total, sizes, prev, next, jumper"   :total="tableData.total"
	  :page-sizes="[10, 20, 50, 200]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
	  <el-pagination background v-else-if="tableData"  layout="total, sizes, prev, pager, next, jumper"   :total="tableData.total"
	  :page-sizes="[10, 20, 50, 200]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
	  <el-pagination background v-else-if="inDialog"   layout="total, sizes, prev, next, jumper"   :total="mTableData.total"
	  :page-sizes="[10, 20, 50, 200]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
	  <el-pagination background v-else  layout="total, sizes, prev, pager, next, jumper"   :total="mTableData.total"
	  :page-sizes="[10, 20, 50, 200]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
</template>
<script setup>
  import { reactive,ref,watch,onMounted,toRefs,nextTick} from "vue";
  import { ElMessage,ElLoading } from 'element-plus';
  import { useRoute,useRouter } from 'vue-router'
  import {tableHeaderFloat,screenToTop,checkVisiable} from '@/utils/jquery/table/float-header';
  import {guid} from '@/utils/index';
  	let props = defineProps({
  	 	                       tableData:{records:[],total:""},
							   queryParams:{},
		                       inDialog:"",
							   inTable:"",
							   defaultSort:{}, 
							   stripe:"",
							   border:"",
							   size:"",
							   height:undefined,
							   showSummary:"",
							   summaryMethod:"",
							   rowKey:undefined,
							   rowClassName:undefined,
							   cellClassName:undefined,
							   highlightCurrentRow:undefined
  	                       });
	const { tableData,inDialog,inTable,defaultSort,size,queryParams,
	        stripe,border,height,showSummary,summaryMethod,rowKey,rowClassName,cellClassName,highlightCurrentRow} = toRefs(props);
	const emit = defineEmits(['loadTable',"selectionChange","row-click","expandChange","currentChange"]);
	let globalTableRef=ref();
	const state = reactive({
					  pagesize:10  ,
					  currentPage: 1 ,
					  mTableData:{records:[],total:""},
					  mQueryParams: {pagesize:10,currentpage:1} ,
					  loading: false ,
					  uuid:guid(),
					});
	const {
	  uuid,
	  pagesize,
	  currentPage,
	  mTableData,
	  mQueryParams,
	  loading,
	} = toRefs(state);
 
	 let route = useRoute();
	 let router = useRouter();
  		function handleSizeChange(size){
			state.pagesize=size;
			state.mQueryParams.pagesize=size;
			state.mQueryParams.currentpage=1;
			state.currentPage=1;
			refreshTable();
  		}
 
	   function tableSort(option){
			  state.mQueryParams.sort=option.prop;
			  state.mQueryParams.order=option.order=="ascending"?"asc":"desc";
			  state.mQueryParams.currentpage=1;
			  state.currentPage=1;
			  refreshTable();
		}
  		function handleCurrentChange(page){
			state.currentPage=page;
			state.mQueryParams.currentpage=page;
			refreshTable();
  		}
		function currentChange(currentrow,oldrow){
			 emit("currentChange",currentrow,oldrow ) ;
		}
		const callback =function(res){
			     if(props.tableData){
					 if(res&&res["records"]&&res["total"]){
							   props.tableData.records=res.records;
							   props.tableData.total=res.total;
					 }else if(res&&res["data"]&&res["data"]["records"]&&res["data"]["total"]){
							  props.tableData.records=res.data.records;
							  props.tableData.total=res.data.total;
					 }else{
							  props.tableData.records=[];
							  props.tableData.total=0; 
					 }
				 }else{
					 if(res&&res["records"]&&res["total"]){
							   state.mTableData.records=res.records;
							   state.mTableData.total=res.total;
					 }else if(res&&res["data"]&&res["data"]["records"]&&res["data"]["total"]){
							  state.mTableData.records=res.data.records;
							  state.mTableData.total=res.data.total;
					 }else{
							  state.mTableData.records=[];
							  state.mTableData.total=0; 
					 }
				 }
				 state.loading=false;
		}
		function refreshTable(){
			 state.loading=true;
			 state.mQueryParams.loadType="refreshTable";
			 emit("loadTable", state.mQueryParams,callback) ;
			 if(!props.height){
			     screenToTop();
			   }
		}
		
		function loadTable(param){
			 state.loading=true;
			 state.mQueryParams.currentpage=1;
			 state.currentPage=1;
			 if(param){
			    state.mQueryParams=Object.assign(state.mQueryParams, param);
			 }
			 state.mQueryParams.loadType="loadTable";
			 emit("loadTable",state.mQueryParams,callback ) ;
			 if(!props.height){
			     screenToTop();
			   }
		
		}
		function toggleRowSelection(row, selected){
			globalTableRef.value.toggleRowSelection(row,selected);
		}
		function selectChange(selection){
			  emit("selectionChange",selection) ;
			  emit("selection-change",selection) ;
		}
		function toggleRowExpansion(row){
			globalTableRef.value.toggleRowExpansion(row);
		}
		function expandChange(row, expandedRows){
			 emit("expandChange",row, expandedRows) ;
		}
		function rowClick(row, column, event){
			  emit("row-click",row, column, event) ;
		}
		 onMounted(() => {
			 if(props.inDialog){
		         refreshTable();
			 }
			 if(props.size){
				 state.pagesize=props.size;
				 state.mQueryParams.pagesize=props.size;
			 }
			 if(props.defaultSort){
			 	state.mQueryParams.sort=props.defaultSort.prop;
			 	state.mQueryParams.order=props.defaultSort.order=="ascending"?"asc":"desc";
			 }
		 })
		 defineExpose({ loadTable,toggleRowExpansion,toggleRowSelection })
		 watch(props.queryParams,(val)=>{
			loadTable(props.queryParams);
		 });
		 watch(route,()=>{ 
			 if(!props.height&&!props.inTable){
			 	 tableHeaderFloat(state.uuid);
			  }
		 })
		 watch(() =>router.currentRoute.value.query,(newValue,oldValue)=> {
		       if(newValue&&newValue['refresh']){
							 setTimeout(()=>{
								 if(checkVisiable(state.uuid)){
							 	         loadTable(props.queryParams);
								 }
							 },100);
		 			  }
		       },{ immediate: true });
		 watch(props.tableData,(val)=>{
		 		   state.loading = false;
				  if(!props.height&&!props.inTable){
					  tableHeaderFloat(state.uuid);
		           }
			});
</script>

<style>
	.floathead{
		position:fixed;
		z-index:100;
		top:34px;
	}
</style>
