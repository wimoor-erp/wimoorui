<template>
	<div class="header-right-content">
		<div  class="phone pointer">
			<connect-address-one @click="handToPage" title="常用地址" theme="outline" size="16" />
		</div>
		<div class="message">
			<RemindMessage  ref="messageRef"></RemindMessage>
		</div>
		<div class="phone pointer">
           <headset-one  @click="handleHelpQQ" theme="outline" size="16"  /> 
		</div>
		
		<div class="avatar">
			 <el-menu
			     :default-active="'1'"
			     class="el-menu-avatar"
			     mode="horizontal"
				 :collapse-transition="false"
			     :ellipsis="false"
			   >
			     <el-sub-menu popper-class="el-menu-popper-avatar" index="1">
			       <template #title>
					   <span class="el-dropdown-link">
					   	<el-avatar v-if="image" :src="image"></el-avatar>
					   	<el-avatar v-else  >
					   		<div style="padding-top:1px;color:var(--el-color-primary);font-size:10px;" >{{avatarName}}</div></el-avatar>
					   	<span class="user-name">{{name}}</span>
					   </span>
				   </template>
			       <el-menu-item index="1-1" disabled class="company" > {{companyname}} </el-menu-item>
			       <el-menu-item index="1-2"    @click="goTocenter">  个人中心</el-menu-item>
				   <el-sub-menu index="1-3">
				     <template #title>切换账号</template>
				     <el-menu-item index="1-3-1" 
					 @click="changeAccount(item)" 
					 :class="item.isactive? 'active':''" 
					  v-for="item in bindlist">
					     <template #title>
						    <div>{{item.companyname}} </div>
							<div class="font-extraSmall" style="padding-left:5px;"> - {{item.name}} </div>
							<el-icon v-if="item.isactive" style="padding-left: 10px;"><Check /></el-icon>
						  </template>
					 </el-menu-item>
				     <el-menu-item index="1-3-1000" @click="bindVisible=true"><el-icon><people-plus    size="14"/></el-icon>添加账号</el-menu-item>
				   </el-sub-menu>
				   <el-menu-item index="1-7"  @click="handDocument">
					  <el-icon class="font-extraSmall"><help  /></el-icon> 帮助文档
				   </el-menu-item>
				  <el-menu-item index="1-8"   @click="changeTheme" >
					  <div class="message pointer" v-if="lightSkin">
					  <el-icon class="font-extraSmall">	<brightness theme="outline"   /></el-icon>白天模式
					  </div>
					  <div class="message pointer" v-else  >
					  	<el-icon class="font-extraSmall"><moon theme="outline"   /></el-icon>黑夜模式
					  </div>
				  </el-menu-item>
				   <el-menu-item index="1-6" v-if="isSSO()" @click="backOldsys">返回旧系统</el-menu-item>
			       <el-menu-item index="1-4" @click="logout">退出</el-menu-item>
				   <el-menu-item index="1-5" @click="clearCath">清缓存</el-menu-item>
			     </el-sub-menu>
			   </el-menu>
			 
		</div>
	</div>
	<!-- 绑定账号 -->
	 <el-dialog v-model="bindVisible" title="绑定其它账号" :destroy-on-close='true' width="560px" >
	 			 <el-form :inline="true" :model="bindForm" class="form-width-fill" label-width="auto">
	 			    <el-form-item label="其它账号"   >
	 			 	   <el-input  v-model="bindForm.account"   placeholder="请输入要绑定的账号" ></el-input>
	 			    </el-form-item>
	 			 		 <el-form-item label="账号密码"  >
	 			 		   <el-input v-model="bindForm.password" type="password"  show-password placeholder="请输入密码" ></el-input>
	 			 	</el-form-item>
	 			  </el-form>
	 	<template #footer>
	 		<span class="dialog-footer">
	 			<el-button @click="bindVisible = false">取消</el-button>
	 			<el-button type="primary" @click="submitBind" >确认</el-button>
	 		</span>
	 	</template>
	 </el-dialog>
	 <el-dialog v-model="siteVisible" top="4vh" class="sitedialog"  :destroy-on-close='true' width="80%" >
	 		 <iframe id="myIframe" src="https://site.wimoor.com" width="100%"   frameborder="0" ></iframe>
	 	 
	 </el-dialog>
</template>
<script>
	import request from "@/utils/request.js"; 
	import store from '@/store/index';
	import {
		HeadsetOne,
		Brightness,
		Help,
		PeoplePlus,
		Moon,ConnectAddressOne,
	} from '@icon-park/vue-next';
	import { Check } from '@element-plus/icons-vue';
	import userApi from '@/api/sys/admin/userApi.js';
	/* 清除缓存 */
	import {
		menuApi
	} from "@/api/sys/admin/menuApi.js";
	import { toggleDark } from "@/components/composables/index.js";
	import RemindMessage from "../remind_message/index.vue";
	import {
		ElMessage
	} from 'element-plus';
	export default {
		name: "HeaderAvatar",
		components: {
			HeadsetOne,
			Brightness,
			Moon,
			Help,
			PeoplePlus,
			RemindMessage,
			Check,ConnectAddressOne
		},
		emits:['changeSKin'],
		data() {
			return {
				bindVisible: false,
				image: "",
				name:"",
				avatarName:"",
				currentUser:{},
				lightSkin:false,
				siteVisible:false,
				companyname:"",
				bindlist:[],
				bindForm:{},
			}
		},
		created() {
			this.getData();
		},
		methods: {
			handToPage(){
				this.siteVisible=true;
				setTimeout(function(){
					document.getElementById("myIframe")
				},1000);
			},
			changeTheme(){
				this.lightSkin = !this.lightSkin
				toggleDark();
			},
			isSSO(){
				 return localStorage.getItem("logintype")=="sso";
			},
			backOldsys(){
				window.location='https://erp.wimoor.com/page.do'
			},
			clearCath() {
				menuApi.cleanUserCache()
			},
			goTocenter() {
				this.$router.push({
					path: "/usercenter",
					query: {
						title: "个人中心",
						path: "/usercenter",
					}
				})
			},
			handDocument(){
				window.open("https://s44njf65vz.feishu.cn/wiki/BD4jwE5X2iBRUwksn77cOw5wnKg");
			},
			handleHelpQQ(){
				window.open('http://wpa.qq.com/msgrd?v=3&uin=1874049814&site=qq&menu=yes','_blank');
			},
			submitBind(){
				let self=this;
				var data={};
				data.openid="";
				data.password=self.bindForm.password;
				data.account=self.bindForm.account;
				data.appType="website";
				userApi.openidbind(data).then((res)=>{
					self.$message({
						type: "success",
						message: "操作成功!"
					});
					self.bindVisible=false;
					self.loadBindList();
				});
			},
			changeAccount(item){
				let self=this;
				var data={};
				 data.openid=item.lastloginsession;
				 data.account=item.account;
				 data.appType=item.lastloginip;
				 userApi.changeLoginWechatApp(data).then((res)=>{
					 var query=this.$router.currentRoute.value.query;
					 localStorage.setItem("jsessiontime",new Date());
					 if(query["title"]&&query["path"]&&Object.keys(query).length==2){
						 window.location.reload();
					 }else{
						  window.location="/home";
					 }
				 });
				
			},
			logout() {
				let self=this;
				    var logintype = localStorage.getItem("logintype");
					let jsessionid = localStorage.getItem("jsessionid");
					request.get("/admin/api/v1/auth/apilogout").then(res => {
					  if ("api" == logintype||"feishu"==logintype) {
						if (res.data=="success") {
							self.$message({
								type: "success",
								message: "登出成功!"
							});
							localStorage.removeItem("jsessionid");
							localStorage.removeItem("logintype");
							store.dispatch("routerStore/clearRouter");
							store.dispatch("permissionStore/clearPermission");
							store.dispatch("jessionStore/setJessionTime",null);
							self.$router.push({path: "/login"})
						}else{
							self.$message({
								type: "error",
								message: "登出失败!"
							});
							self.$router.push({path: "/ssologin"})
						}
					 }else{
					 	localStorage.removeItem("jsessionid");
					 	localStorage.removeItem("logintype");
						let authserver=  localStorage.getItem("authserver");
					 	location=authserver+"/logout";
					 }
					});
				
			},
			loadBindList(){
				let self=this;
				userApi.findbindlist().then((res)=>{
					if(res.data){
						res.data.forEach(item=>{
							item.userid=item.id;
							item.isactive=false;
							item.companyname=item.userinfo.companyname;
							item.name=item.userinfo.name;
							if(self.currentUser.id==item.id){
								item.isactive=true;
							}
							if(item.companyname){
								item.companyname=decodeURI(item.companyname);
							}
						});
					}
					self.bindlist=res.data;
				});
			},
			getData() {
				let self=this;
				window.onstorage = function(e) {
				               if(e.key=="jsessiontime"&&e.oldValue!=e.newValue){
				                     var arr = Math.floor(Math.random()*1000 + 500) ; 
				                    var timer= setTimeout(function(){
										        var query=self.$router.currentRoute.value.query;
												if(query["title"]&&query["path"]&&Object.keys(query).length==2){
																		 window.location.reload();
												}else{
																		  window.location="/home";
												}
											 clearTimeout(timer);
				                     },arr);
				                 }
				            };
				userApi.getInfo().then(response => {
					if (response && response.data) {
						self.loadBindList();
						if(response.data.image){
							let url = response.data.image;
							self.image = url;
						}
						self.currentUser=response.data;
						self.$refs.messageRef.show(self.currentUser);
						if(response.data.name){
						   self.name=response.data.name;
						   if(self.name){
							  self.avatarName=self.name.substring(0,1);
						   }
						}
						if(response.data.company){
							self.companyname=response.data.company;
						}
					}
				})
				
			}
		},
	}
</script>
<style>
	#myIframe {
	  width: 100%;
	  height: 81vh; /* 视口高度 */
	  border: none; /* 移除边框 */
	}
	.arco-typography{
		display:none;
	}
	.phone,
	.message {
		line-height:36px;
	}

	.phone,
	.message .i-icon {
		padding: 0px 12px;
	}

	.phone>.i-icon>svg,
	.message>.i-icon>svg {
		vertical-align: middle;
	}
    .sitedialog .el-dialog__body{
		padding:0px;
	}
	.avatar {
		line-height:36px;
		display: flex;
		align-items: center;
	}
	.header-right-content{
		display: flex;
		align-items: center;
	}
	.header-right-content .el-avatar{
		width:24px;
		height: 24px;
	}
	.user-name{
		font-size: 13px;
		margin-left: 8px;
		margin-top:2px;
	}
	.el-avatar{
		position: relative;
		background-color: #606266;
	}
	.dark .el-avatar{
		position: relative;
		background-color: #EBEDF0;
	}
	
	.el-menu-avatar .el-sub-menu__icon-arrow{
		display:none;
	}
	.el-menu-avatar{
		border-bottom:none !important;
		
	}
	.el-menu-avatar .el-sub-menu__title {
		line-height:0px !important;
		padding-right:0px !important;
	}
	
    .el-menu-avatar .el-sub-menu.is-active .el-sub-menu__title{
		border-bottom:none !important;
		padding-right:0px !important;
	}
 .avatar .el-menu--horizontal>.el-sub-menu .el-sub-menu__title{
 	border-bottom:none;
 }
</style>
<style scoped>

	.company{
		border-bottom:1px solid #e5e5e5 !important;
		margin-bottom:5px !important;
		padding-top:5px !important;
		padding-bottom:5px !important;
		
		opacity: .66  !important;
	}
</style>
