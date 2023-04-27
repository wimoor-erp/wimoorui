<template>
	<div class='main-sty gary-bg'>
		<el-row>
			<el-col  :span="16" :offset="4">
				<div class=" g-bg pag-radius-bor"> 
				  <div class="blur">
					<div class="user-head">
						<div class="u-img">
							<el-avatar  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" ></el-avatar>
							<span class="e-photo">修改<br>头像</span>
						</div>
						<div class="u-message">
							<el-row>
								<el-col :span="8">
									<div class="u-name">
									<h2>贪玩蓝月</h2>
									<el-image :src="require('@/assets/image/svip.png')">
									</el-image>
									</div>
									<el-space class="pag-small-Extra" :spacer="spacer">
										<span>超级管理员</span>
										<span>2022-02-22注册</span>
									</el-space>
									<h4>账号:176******86</h4>
								</el-col>
								<el-col :span="8">
									<div class ="text-name">
									<div class="u-label">
										<p >邮箱:</p>
										<p>公司:</p>
									</div>
									<div>
										<p>1243*****@qq.com</p>
										<p>深圳万墨科技有限公司</p>
									</div>
									</div>
								</el-col>
								<el-col :span="8" class=" btn-bottom">
									<el-button   type="primary" @click="editPerson" plain>编辑个人信息</el-button>
								</el-col>	
							</el-row>
						</div>
					</div>
				</div>
				</div>
				<div class="pag-radius-bor">
				  <div class="user-body">
					   <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
					     <el-tab-pane label="账号安全" name="first">
							 <AccountSafe/>
						 </el-tab-pane>
					     <el-tab-pane label="微信绑定" name="fourth">
							 <Wechat/>
						 </el-tab-pane>
						 <el-tab-pane label="帐号注销" name="five">
							 <Logoff/>
						 </el-tab-pane>
					   </el-tabs>
				  </div>	  
				</div>
			</el-col>
		</el-row>
	</div>
	<el-dialog v-model="personVisable" title="个人信息编辑" destroy-on-close='true' width="600px" >
		<el-form :inline="true" :model="formInline" class="form-width-fill" label-width="auto">
		   <el-form-item label="用户名" required >
			   <el-input  v-model="formInline.name"   placeholder="请输入..." ></el-input>
		   </el-form-item>
				 <el-form-item label="公司名称" required>
				   <el-input v-model="formInline.company"   placeholder="请输入..." ></el-input>
				 </el-form-item>
		 </el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="personVisable = false">取消</el-button>
				<el-button type="primary" @click="submitPersoninfo" >提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
	import {} from '@icon-park/vue-next';
	import { ref,reactive,onMounted ,h} from 'vue'
	import { ElDivider} from 'element-plus'
	import {} from '@element-plus/icons-vue'
	import userApi from '@/api/sys/admin/userApi';
	import AccountSafe from"./components/accountSafe.vue"
	import Wechat from"./components/wechat.vue"
	import Logoff from"./components/logoff.vue"
 
		    let personVisable = ref(false)
			let activeName = ref("first")
			let formInline =reactive({
				name:"贪玩蓝月",
				company:'深圳万墨科技有限公司',
			})
	        let spacer = h(ElDivider, { direction: 'vertical' })
			//
			onMounted(()=>{
				getPersonalmessage()
			})
			function editPerson(){
				personVisable.value = true 
			}
			function submitPersoninfo(){
				//更新个人信息api
			}
			function getPersonalmessage(){
				userApi.userinfo().then((res)=>{
					console.log(res)
				})
				userApi.detail().then((res)=>{
					console.log(res)
				})
			}
		
	        //数据接收
	       
</script>

<style>
	.u-img .el-avatar{
		--el-avatar-large-size: 100px;
		position: relative;
		background-color: #222;
	}
	.u-img .e-photo{
		position: absolute;
		left:54px;
		top:52px;
		letter-spacing:6px;
		color:#fff;
		opacity: 0;
	}
	.u-img {
		margin:8px 32px 8px 0px;
	}
	.u-img:hover .e-photo{
		opacity: 1;
	}
	.u-img:hover img{
		opacity:0.5;
	}
	.user-head{
		display: flex;
	}
	.u-message{
		flex:1
	}
	.u-name{
		display: flex;
		align-items: center;
		margin-top: 16px;
	}
	.u-name .el-image{
		height:24px;
		margin-left:8px;
	}
	.u-message h4{
		margin-top:16px;
		color:var(--el-text-color-regular);
		font-weight: 400;
	}
	.text-name{
		display: flex;
		font-size: 14px;
		margin-top:16px;
	}
	.text-name p{
		line-height:32px;
	}
	.text-name .u-label{margin-right:24px;}
	.btn-bottom{
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}
	.g-bg{padding:0}
	.g-bg::after{
		content: ""; 
		position: absolute;
		height:100px;
		width:200px;
		top:0;
		  opacity: .5; 
		clip-path:polygon(0 10%, 30% 0, 100% 40%, 70% 100%, 20% 90%);
		background-color:#7fd83b
		
	}
	.g-bg::before{
		content: ""; 
		  opacity: .5; 
		position: absolute;
		height:100px;
		width:200px;
		top:0;
		left: 27%;
		clip-path:polygon(10% 0, 100% 70%, 100% 100%, 20% 90%); 
		background-color:#53A8FF
		
	}
	.blur{
		backdrop-filter: blur(40px); 
		padding: 16px 24px;
		position: relative;
		z-index: 2;
	}
	.pag-radius-bor{
		margin-bottom:16px;
	}
	.user-body{
		height:calc(100vh - 304px);
		min-height: 200px;
	}
</style>
