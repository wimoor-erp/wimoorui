<template>
	<el-dialog
		   v-model="authVisible"
		   title="广告授权"
		   width="600px"
		 >
		  <el-alert   title="请确保当前的电脑和IP是您要授权广告店铺的常用环境，以免店铺关联!" type="error" show-icon />
		  <el-form :inline="true" :model="formInline" class="form-width-fill" label-width="auto">
		     <el-form-item label="店铺名称"   >
		       <el-select v-model="formInline.groupid" placeholder="请选择..." @change="selectStote">
		         <el-option v-for="(item,index) in storelist.list" :label="item.name" :value="item.id" />
		       </el-select>
		     </el-form-item>
			 <el-form-item   label="站点" required>
			   <el-select v-model="formInline.region" placeholder="同区域站点绑定一个,该区域所有站点都会绑定!" @change="selectCountry">
			          <el-option   label="北美"  value="NA" ></el-option>
					  <el-option   label="欧洲"  value="EU" ></el-option>
					  <el-option   label="远东"  value="FE" ></el-option>
			   </el-select>
			 </el-form-item>
		   </el-form>
		   <template #footer>
		     <span class="dialog-footer">
		       <el-button @click="authVisible = false">取消</el-button>
		       <el-button  type="primary" @click="getamazonUrl"  >登录亚马逊授权</el-button >
		     </span>
		   </template>
		 </el-dialog>
</template>

<script setup>
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ref,reactive,onMounted,toRefs,watch} from "vue";
	import {Edit,ArrowDown,Delete} from '@element-plus/icons-vue';
	import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus'
	import authApi from '@/api/amazon/advertisement/auth/authApi.js';
	import marketApi from '@/api/amazon/market/marketApi.js';
	import {dateFormat} from '@/utils/index';
	import { useRoute } from "vue-router";
    let props = defineProps({storelist:[]});
    const { storelist} = toRefs(props);
	const emit = defineEmits(['comfirm']);
	const route = useRoute();
	let authVisible =ref(false)
	let market =ref()
	var authtype=ref('manuAuthority');
	let formInline = reactive({
		 groupid: '',
		 marketplaceid:'',
		 region:"NA",
	})
 
	function selectStote(val){
		formInline.groupid = val
	}
	function selectCountry(val){
		formInline.marketplaceid = val
	}
	function getamazonUrl(){
		let params={}
		params = formInline
		if(params.groupid&&params.region){
			authApi.getAuthUrl(params).then((res)=>{
				ElMessageBox.confirm(
									    '为避免店铺关联，请确认当前设备环境是您授权店铺的常用环境！',
									    {
									      confirmButtonText: '前往授权',
									      cancelButtonText: '取消',
									      type: 'warning',
										  callback:(action)=>{
											 if(action=="confirm"){
												 window.open(res.data)
											 }
										  }
									    }
									  )
			})
		}else{
			ElMessage({
				type:'error',
				message:'请选择对应店铺或站点！'
			})
		}
		
	}
	function show(){
		authVisible.value =true
	}
	watch(props,()=>{
		 if(props.storelist&&props.storelist.list.length>0){
		 	formInline.groupid=props.storelist.list[0].id;
		 }else{
		 	formInline.groupid="";
		 }
		
	})
	 defineExpose({ show })
</script>

<style>
</style>