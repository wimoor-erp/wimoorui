<template>
	<el-dialog
		   v-model="authVisible"
		   title="店铺授权"
		   width="600px"
		 >
		  <el-alert  v-if="authtype=='manuAuthority'"  title="请确保当前的电脑和IP是您要授权店铺的常用环境，以免店铺关联!" type="error" show-icon />
		  <el-alert  v-if="authtype=='amazonAuthority'"  title="检测到你正在绑定授权,请选择当前要绑定的店铺!" type="error" show-icon />
		  <el-form :inline="true" :model="formInline" class="form-width-fill" label-width="auto">
		     <el-form-item label="店铺名称"   >
		       <el-select v-model="formInline.groupid" placeholder="请选择..." @change="selectStote">
		         <el-option v-for="(item,index) in storelist.list" :label="item.name" :value="item.id" />
		       </el-select>
		     </el-form-item>
			 <el-form-item  v-if="authtype=='manuAuthority'" label="站点"  >
			   <el-select v-model="formInline.marketplaceid" placeholder="同区域站点绑定一个,该区域所有站点都会绑定!" @change="selectCountry">
			     <el-option  v-for="(item,index) in market" :label="item.name" v-show="item.name !=='中国'" :value="item.marketplaceid" >
				 {{item.name}}<span class="font-extraSmall"> - {{item.regionName}}</span>
				 </el-option> 
			   </el-select>
			 </el-form-item>
			 <el-form-item  v-if="authtype=='amazonAuthority'" label="站点" required>
			   <el-select v-model="formInline.awsRegion" placeholder="同区域站点绑定一个,该区域所有站点都会绑定!" @change="selectCountry">
			          <el-option   label="北美"  value="us-east-1" ></el-option>
					  <el-option   label="欧洲"  value="eu-west-1" ></el-option>
					  <el-option   label="远东"  value="us-west-2" ></el-option>
			   </el-select>
			 </el-form-item>
		   </el-form>
		   <template #footer>
		     <span class="dialog-footer">
		       <el-button @click="authVisible = false">取消</el-button>
		       <el-button v-if="authtype=='manuAuthority'" type="primary" @click="getamazonUrl"  >登录亚马逊授权</el-button >
			   <el-button v-if="authtype=='amazonAuthority'" type="primary" @click="subMitAuth"  >确认绑定</el-button >
		     </span>
		   </template>
		 </el-dialog>
</template>

<script setup>
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ref,reactive,onMounted,toRefs,watch} from "vue"
	import {Edit,ArrowDown,Delete} from '@element-plus/icons-vue';
	import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus'
	import authApi from '@/api/amazon/auth/authApi.js';
	import marketApi from '@/api/amazon/market/marketApi.js';
	import {dateFormat} from '@/utils/index';
	import { useRoute } from "vue-router"
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
		 awsRegion:"us-east-1",
	})
	function initAuth(){
		if((route.query&&route.query.mws_auth_token)||(route.query&&route.query.path&&route.query.path.indexOf("mws_auth_token")>-1)){
			authVisible.value =true
		    authtype.value='amazonAuthority';	
		}
	}
	function selectStote(val){
		formInline.groupid = val
	}
	function selectCountry(val){
		formInline.marketplaceid = val
	}
	function getamazonUrl(){
		let params={}
		params = formInline
		params.redirecturl="https://app.wimoor.com/authresult";
		if(params.groupid&&params.marketplaceid){
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
	function subMitAuth(){
		var groupid=formInline.groupid;
		var awsregion =formInline.awsRegion;
		var state=groupid+"@"+awsregion;
		var mwstoken="";
		if(route.query.mws_auth_token){
			mwstoken=route.query.mws_auth_token;
		}else{
			var param=route.query.path.split("?")[1];
			var query=param.split("&");
			query.forEach(item=>{
				if(item.indexOf("mws_auth_token=")>-1){
					mwstoken=item.split("=")[1];
				}
			})
		}
		if(mwstoken==""){
			ElMessage({
				type:'error',
				message:"授权失败，无法获取到token"
			});
			return ;
		}
		authApi.authSeller({"state":state,"selling_partner_id":route.query.selling_partner_id,
		"mws_auth_token":mwstoken,"spapi_oauth_code":route.query.spapi_oauth_code}).then((res)=>{
			if(res.data&&res.data.id){
				ElMessage({
					type:'success',
					message:"授权成功，请回到授权列表页面刷新。"
				})
			}else{
				ElMessage({
					type:'error',
					message:"授权失败，请再次尝试（注意：您必须在店铺所在的网络环境重新尝试）"
				})
			}
		})
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
	function loadMarketAll(){
		marketApi.getMarketAll().then((res)=>{
			market.value = res.data
			if(res.data&&res.data.length>0){
				formInline.marketplaceid=res.data[0].marketplaceid;
			}
		})
	}
	onMounted(()=>{
		loadMarketAll()
		initAuth();
	})
	 defineExpose({ show })
</script>

<style>
</style>