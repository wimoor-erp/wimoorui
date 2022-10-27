<template>
	<div>
		<div class="con-header">
			<el-row>
				<el-button type="primary" @click="storeAuth">店铺授权</el-button>
				<div class='rt-btn-group'>
					<el-button class='ic-btn' title='帮助文档'>
						<help theme="outline" size="16" :strokeWidth="3" />
					</el-button>
				</div>
			</el-row>
			<el-row>
				<el-col :span="24">
				<el-table  class="only-table-head" border>
					<el-table-column label="店铺名称"></el-table-column>
					<el-table-column label="卖家ID" ></el-table-column>
					<el-table-column label="区域" width="90"></el-table-column>
					<el-table-column label="国家"></el-table-column>
					<el-table-column label="店铺授权" ></el-table-column>
					<el-table-column label="广告授权" ></el-table-column>
					<el-table-column label="授权日期" ></el-table-column>
					<el-table-column label="操作" width="100" ></el-table-column>
				</el-table>
				<el-row v-if="tableData.list.length<=0" class="storegroup">
				<el-col>
				    <el-card shadow="never" ><div class="font-extraSmall text-center ">暂无数据</div></el-card>
				</el-col>
				</el-row>
				<div class="storegroup" v-for="item in tableData.list">
					<el-table :show-header="false" :data="item.regionslist" border  :span-method="rowmerge">
						<el-table-column  >{{item.gname}}</el-table-column>
						<el-table-column prop="sellerid" ></el-table-column>
						<el-table-column prop="regionname"  width="90" ></el-table-column>
						<el-table-column  prop="countrysList">
							<template #default="scope">
								 <div class="country" v-for="sub in scope.row.countrysList">
									 <el-image :src="imageFormat(sub)"></el-image>
									 <span> {{sub.countryname}}</span>
								 </div>
							</template>
						</el-table-column>
						<el-table-column  prop="sellerauth">
							<template #default="scope">
								<el-tag v-if="scope.row.sellerauth=='2'"  type="info">未授权</el-tag>
								<el-tag v-else-if="scope.row.sellerauth=='0'"  type="danger">授权异常</el-tag>
								<el-tag v-else  type="success">已授权</el-tag>
							</template>	
						</el-table-column>
						<el-table-column  prop="adauth">
							<template #default="scope">
								<el-tag v-if="scope.row.adauth=='2'"  type="info">未授权</el-tag>
								<el-tag v-else-if="scope.row.adauth=='0'"  type="danger">授权异常</el-tag>
								<el-tag v-else  type="success">已授权</el-tag>
							</template>	
						</el-table-column>
						<el-table-column  prop="time" >
							<template #default="scope">
								{{dateFormat(scope.row.time)}}
							</template>	
						</el-table-column>
						<el-table-column   width="100" >
							<template #default="scope">
								<el-dropdown>
								    <el-link type="primary" class="font-extraSmall font-400"  :underline="false">
								      操作
								      <el-icon >
								        <arrow-down />
								      </el-icon>
								    </el-link>
								    <template #dropdown>
								      <el-dropdown-menu>
								        <el-dropdown-item @click="deleteByLogic(scope.row.sellerid)">停用店铺授权</el-dropdown-item>
										<!-- <el-dropdown-item  @click="printImage('',parentNode.data.id)">停用广告授权</el-dropdown-item> -->
								      </el-dropdown-menu>
								    </template>
								  </el-dropdown>
							</template>	
						</el-table-column>
					</el-table>
				</div>
				</el-col>
			</el-row> 
		</div> 
	</div>
	<el-dialog
	   v-model="authVisible"
	   title="店铺授权"
	   width="600px"
	 >
	  <el-alert  v-if="authtype=='manuAuthority'"  title="请确保当前的电脑和IP是您要授权店铺的常用环境，以免店铺关联!" type="error" show-icon />
	  <el-alert  v-if="authtype=='amazonAuthority'"  title="检测到你正在绑定授权,请选择当前要绑定的店铺!" type="error" show-icon />
	  <el-form :inline="true" :model="formInline" class="form-width-fill" label-width="auto">
	     <el-form-item label="店铺名称" required >
	       <el-select v-model="formInline.groupid" placeholder="请选择..." @change="selectStote">
	         <el-option v-for="(item,index) in storelist.list" :label="item.name" :value="item.id" />
	       </el-select>
	     </el-form-item>
		 <el-form-item  v-if="authtype=='manuAuthority'" label="站点" required>
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

<script>
import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
import {vue,ref,reactive,onMounted} from "vue"
import {Edit,ArrowDown,Delete} from '@element-plus/icons-vue';
import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus'
import authApi from '@/api/amazon/auth/authApi.js';
import marketApi from '@/api/amazon/market/marketApi.js';
import {format,dateFormat} from '@/utils/index';
import { useRoute } from "vue-router"
export default {
		name:'Table',
		components: {
			Help,ArrowDown
		},
		props:["storelist"],
		setup(props) {
			let authVisible =ref(false)
			let formInline = reactive({
				 groupid: '',
				 marketplaceid:'',
				 
			})
			const imageFormat=function(country){
				return require('@/assets/image/country/'+country.countrycode+'-flag-small.jpg');
			}
			const route = useRoute();
			let market =ref()
			let tableData =reactive({list:[
				// {
				// group:[
				// 	{
				// 	name:"Tuparka",region:'欧洲',sellerid:"A39CGQXVT3YXM5",
				// 	country:[{img:'https://erp.wimoor.com/images/UK-flag-small.jpg',name:' 英国'},{img:'https://erp.wimoor.com/images/DE-flag-small.jpg',name:'德国'}],
				// 	ad:'已授权',
				// 	store:'已授权',
				// 	time:'2022-02-20',	
				// 	},
				// 	{
				// 	name:"Tuparka",region:'北美',sellerid:"A2QFBHH3V8T9F6",
				// 	country:[{img:'https://erp.wimoor.com/images/CA-flag-small.jpg',name:' 加拿大'},{img:'	https://erp.wimoor.com/images/US-flag-small.jpg',name:'美国'}],
				// 	ad:'已授权',
				// 	store:'已授权',
				// 	time:'2022-02-20',	
				// 	},
				// 	{
				// 	name:"Tuparka",region:'东亚',sellerid:"A1L9NOV5HC2AVF",
				// 	country:[{img:'https://erp.wimoor.com/images/JP-flag-small.jpg',name:' 日本'}],
				// 	ad:'已授权',
				// 	store:'已授权',
				// 	time:'2022-02-20',	
				// 	},
				// ]
				// },
				// {
				// group:[
				// 	{
				// 	name:"kuuqa",region:'欧洲',sellerid:"A39CGQXVT3YXM5",
				// 	country:[{img:'https://erp.wimoor.com/images/UK-flag-small.jpg',name:' 英国'},{img:'https://erp.wimoor.com/images/DE-flag-small.jpg',name:'德国'}],
				// 	ad:'已授权',
				// 	store:'授权过期',
				// 	time:'2022-02-20',	
				// 	},
				// 	{
				// 	name:"kuuqa",region:'北美',sellerid:"A2QFBHH3V8T9F6",
				// 	country:[{img:'https://erp.wimoor.com/images/CA-flag-small.jpg',name:' 加拿大'},{img:'	https://erp.wimoor.com/images/US-flag-small.jpg',name:'美国'}],
				// 	ad:'已授权',
				// 	store:'授权过期',
				// 	time:'2022-02-20',	
				// 	},
				// ]
				// },
				
				
			]})
			onMounted(()=>{
				loadauthData()
				loadMarketAll()
				initAuth();
			})
			function loadMarketAll(){
				marketApi.getMarketAll().then((res)=>{
					market.value = res.data
				})
			}
			function loadauthData(){
				authApi.getBindSeller().then((res)=>{
					 tableData.list = res.data 
				})
			}
			function rowmerge({row,column,rowIndex,columnIndex}){
				if(columnIndex === 0){
					if(rowIndex % 20 === 0){
						return [20,1]
						}else{
                   return [0, 0]
                   }
				}	
			}
			function storeAuth(){
				authVisible.value =true
			}
			var authtype=ref('manuAuthority');
			function initAuth(){
				if(route.query.mws_auth_token){
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
				authApi.authSeller({"state":state,"selling_partner_id":route.query.selling_partner_id,
				"mws_auth_token":route.query.mws_auth_token,"spapi_oauth_code":route.query.spapi_oauth_code}).then((res)=>{
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
			function deleteByLogic(sellerid){
				ElMessageBox.confirm(
									    '是否解除绑定，解除后会造成店铺数据缺失！',
									    {
									      confirmButtonText: '确定',
									      cancelButtonText: '取消',
									      type: 'warning',
										  callback:(action)=>{
											 if(action=="confirm"){
												authApi.deleteByLogic({"sellerid":sellerid}).then((res)=>{
													if(res.data.indexOf('成功')>=0){
														ElMessage({
															type:'success',
															message:res.data
														})
													}else{
														ElMessage({
															type:'error',
															message:res.data
														})
													}
													loadauthData();
												})
											 }
										  }
									    }
									  )
				
			}
			return {
				tableData,rowmerge,storeAuth,authVisible,formInline,
				loadMarketAll,market,selectStote,selectCountry,
				getamazonUrl,loadauthData,dateFormat,deleteByLogic,
				subMitAuth,authtype,imageFormat
			}
		},
	}	
</script>

<style>
	.only-table-head .el-scrollbar{
		display: none;
	}
	.storegroup{
		margin-top:8px;
		width:100%;
	}
	.font-400{
		font-weight:400;
	}
	.country{
		display: flex;
		align-items: center;
	}
	.country .el-image{
		margin-right:8px;
	}
.form-width-fill{margin-top:16px;}
	.el-table tbody tr:hover > td {
		background-color: transparent !important
	}
</style>
