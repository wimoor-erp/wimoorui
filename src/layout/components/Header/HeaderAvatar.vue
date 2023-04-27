<template>
	<div class="header-right-content">
	
		
		<div class="message">
			<remind theme="outline" size="16"  />
		</div>
		<div class="phone">
			<headset-one theme="outline" size="16"  />
		</div>
		<div class="message pointer" @click="changeTheme" v-if="lightSkin">
			<brightness theme="outline" size="18" />
		</div>
		<div class="message pointer" v-else @click="changeTheme">
			<moon theme="outline" size="16" />
		</div>
		<div class="avatar">
			<el-dropdown>
				<span class="el-dropdown-link">
					<el-avatar :src="image"></el-avatar>
					<span class="user-name">{{name}}</span>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="goTocenter">个人中心</el-dropdown-item>
						<el-dropdown-item @click="logout">退出</el-dropdown-item>
						<el-dropdown-item @click="clearCath">清缓存</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
	<!-- 注销账号 -->
</template>
<script>
	import request from "@/utils/request"; 
	import {
		Remind,
		HeadsetOne,
		Brightness,
		Moon,
	} from '@icon-park/vue-next';
	import userApi from '@/api/sys/admin/userApi';
	/* 清除缓存 */
	import {
		menuApi
	} from '@/api/sys/admin/menuApi';
	import { toggleDark } from "@/components/composables";
	import {
		ElMessage
	} from 'element-plus';
	export default {
		name: "HeaderAvatar",
		components: {
			Remind,
			HeadsetOne,
			Brightness,
			Moon,
		},
		props:['changeSKin'],
		data() {
			return {
				bindVisible: false,
				image: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
				name:"",
				lightSkin:false,
			}
		},
		created() {
			this.getData();
		},
		methods: {
			changeTheme(){
				this.lightSkin = !this.lightSkin
				toggleDark();
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
			logout() {
				    var logintype = localStorage.getItem("logintype");
					let jsessionid = localStorage.getItem("jsessionid");
					request.get("/api/auth/apilogout").then(res => {
					  if ("api" == logintype) {
						if (res.data=="success") {
							this.$message({
								type: "success",
								message: "登出成功!"
							});
							localStorage.removeItem("jsessionid");
							localStorage.removeItem("logintype");
							this.$router.push({path: "/ssologin"})
						}else{
							this.$message({
								type: "error",
								message: "登出失败!"
							});
						}
					 }else{
					 	localStorage.removeItem("jsessionid");
					 	localStorage.removeItem("logintype");
						let authserver=  localStorage.getItem("authserver");
					 	location=authserver+"/logout";
					 }
					});
				
			},
			getData() {
				let self=this;
				userApi.getInfo().then(response => {
					if (response && response.data) {
						if(response.data.image){
							let url = response.data.image;
							url = url.replace("photo/", "https://photo.wimoor.com/");
							self.image = url;
						}
						if(response.data.name){
						   self.name=response.data.name;
						}
					}
				})
			}
		},
	}
</script>
<style>
	.phone,
	.message {
		line-height:34px;
	}

	.phone,
	.message .i-icon {
		display: block;
		padding: 0px 12px;
	}

	.phone>.i-icon>svg,
	.message>.i-icon>svg {
		vertical-align: middle;
	}

	.avatar {
		padding: 0px 12px;
		line-height:34px;
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
	}
</style>
