<template>
     <div class="main-sty">
	 <el-row>
			 <GlobalTable ref="globalTable" :nopage="true" :tableData="tableData"     @loadTable="loadTableData" :stripe="true"  style="width: 100%;margin-bottom:16px;">
			   <template #field>
			 	 <el-table-column prop="name" label="名称"  sortable='custom'  width="120">
			 	  </el-table-column>
				  <el-table-column prop="fgroup" label="分组"  sortable='custom'  width="120">
				   </el-table-column>
				   <el-table-column prop="description" label="描述"  sortable='custom'  width="190">
				    </el-table-column>
					<el-table-column prop="path" label="路径"  sortable='custom'  >
					 </el-table-column>
			 	  
			 	 <el-table-column prop="turndays" label="操作"    width="120"  >
			 		 <template #default="scope">
			 			  <el-button v-if="!scope.row.isdelete" @click="disableApi(scope.row)"   link type="primary">禁用</el-button>
						  <el-button v-else @click="enableApi(scope.row)"   link type="primary">启用</el-button>
			 			  <el-button   @click="runApi(scope.row)"   link type="primary">运行</el-button>
			 		 </template>
			 	 </el-table-column>
			 	 </template>
			  </GlobalTable>
  </el-row>
  </div>
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue';
	import GlobalTable from "@/components/Table/GlobalTable/index.vue";
    import { ElMessage ,ElMessageBox} from 'element-plus';
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import {dateFormat,getCurrencyMark} from '@/utils/index.js';
	import MarketCountry from '@/components/header/market_country.vue';
	import taskApi from '@/api/sys/admin/taskApi.js';
	const globalTable=ref();
	const marketCountryRef =ref();
	let state=reactive({
		 downLoading:false,
		 queryParam:{
			 groupid:'',
			 search:"",
			 marketplaceid:"",
		 },
		 isload:true,
		 tableData:{records:[],total:0},
	});
	let {
	   queryParam,
	   isload,
	   tableData,
	   downLoading,
	} =toRefs(state);
 
  
	 
	function handleQuery(){
	     globalTable.value.loadTable(state.queryParam);
	}
	
	function loadTableData(param){
		taskApi.getTaskList().then((res)=>{
			state.tableData.records=res.data;
			state.tableData.total=res.data.length;
		}); 
	}
	
	function disableApi(row){
		taskApi.disableApi(row).then((res)=>{
			ElMessage.success("操作成功");
			handleQuery();
		});
	}
	
	function enableApi(row){
		taskApi.enableApi(row).then((res)=>{
			ElMessage.success("操作成功");
			handleQuery();
		});
	}
	
	function runApi(row){
		taskApi.runApi(row).then((res)=>{
			ElMessage.success("执行成功");
		});
	}
 

 
	 onMounted(()=>{
		 handleQuery();
	 })
	 
	 
</script>

<style>
</style>
