<template>
	test
</template>
<script setup>
	import {Search,ArrowDown,Edit,View} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne, Form} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,toRefs,nextTick } from 'vue'
	import Datepicker from '@/components/header/datepicker.vue';
	import thirdpartyApi from "@/api/erp/thirdparty/thirdpartyApi.js";
    import {ElMessage,ElMessageBox } from 'element-plus';
	import {dateFormat,dateTimesFormat,CheckInputFloat,formatFloat} from '@/utils/index';
	const globalTable=ref();
	let props = defineProps({  indialog:"",  });
	const { indialog, } = toRefs(props);
	const emit = defineEmits(["change"]);
	const state = reactive({
		tableData:{records:[],total:0},
		queryParam:{
			 token:null,
			 status:0,
		},
	})
	const{
		 queryParam,tableData,
	}=toRefs(state)
    function handleQuery(){
	  
    }
	function loadToken(){
		thirdpartyApi.getQuoteToken().then((res)=>{
			state.queryParam.token=res.data.buyertoken;
			state.isowner=res.data.isowner;
			if(state.queryParam.token){
				handleQuery();
			}else{
				state.tableData={records:[],total:0};
				state.orderTableData={records:[],total:0};
			}
		});
	}
	onMounted(()=>{
	    loadToken();
	});
</script>

<style>
</style>