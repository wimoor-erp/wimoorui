<template>
    <div class="login-bg">
        <div class="screen-height">
			<div class="login-content">
			<div class="left-content"></div>
			<el-card class="login-box">
           <el-image src="https://sso.wimoor.com/images/login/login-logo.png"></el-image>
		   <h4 class="m-t-24">欢迎登录Wimoor</h4>
            <el-form class="m-t-24" ref="form" :model="form" size="normal">
                <el-form-item>
                    <el-input :prefix-icon="User" v-model="form.account"  size="large"  placeholder="请输入手机号或邮箱" clearable>
                         <template #prefix>
                        <el-icon   class="font-medium el-input__icon"><user /></el-icon>
                         </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                <el-input :prefix-icon="Lock" v-model="form.password"  size="large" show-password   placeholder="请输入密码">
                    <template #prefix>
                        <el-icon  class="font-medium el-input__icon"><lock /></el-icon>
                    </template>
                </el-input>
                </el-form-item>
				<el-form-item >
					<div class="flex-center-between" style="flex:1">
						 <el-checkbox class="text-gray" v-model="checked2" label="记住账号"/>
						 <el-button type="info"  link @click="goResetPassword">忘记密码</el-button>
					</div>
				</el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button style="width: 100%;" type="primary" size="large" @click="userLogin">登录</el-button>
                </el-form-item>
            </el-form>
			<div class="font-extraSmall text-center m-t-64 flex-center ">
			<span>没有账号吗&nbsp;</span>
			<el-link type="primary"  :underline="false"  class="font-12">
			注册新账号
			</el-link>
			</div>
         </el-card>
        </div>
    </div>
	</div>
</template>

<script>
import { Lock, User } from '@element-plus/icons-vue';
import request from "@/utils/request"; 
import {ElMessage} from "element-plus";
    export default {
        name: "Login",
        components:{
            User,Lock
        },
        data(){
            return{
                form:{},

            }
        },
        methods:{
            userLogin(){
                 request.post("/api/auth/login",this.form).then(res=>{
                    if(res.data){
                        this.$message({
                            type:"success",
                            message:"登录成功!"
                        });
						 let path =sessionStorage.getItem("old_url_before_login");
						localStorage.setItem("jsessionid",res.data.session);
						localStorage.setItem("logintype","api");
						if(path){
								if(path.indexOf("auth/getJSession")>0||path.indexOf("ssologin")>0||path=="/"||path=="/login"){
									this.$router.push("/home"); 
								}else{
									this.$router.push(path);
								}
						}else{
							  this.$router.push("/home"); 
						}		             
                    }else{
						if(res.msg){
							 this.$message({
								type:"error",
									message:"登录失败!"+res.msg
								});
						  }else{
							this.$message({
								type:"error",
									message:"登录失败!"
								});
						}
                            
                    }
                });
            },
			goResetPassword(){
				 this.$router.push("/resetPassword"); 
			}
        },
		mounted() {
			    let jsessionid= localStorage.getItem("jsessionid");
			     if(jsessionid){
			         	 this.$router.push("/home"); 
			       }
			  }
    }
</script>

<style scoped>
  .login-bg{
	  background-image: url(../../assets/image/login-bg.png);
	  background-size: cover;
  }
  .screen-height{
	  height: calc(100vh);
  }
  .login-content{
	  display: flex;
	  justify-content: center;
	  padding-top: 10%;
  }
  .login-box{
	  width:420px;
	  padding:24px 32px;
	  border:none;
	  background-color:rgba(255,255,255,);
  }
  .font-12{
	  font-size: 12px;
  }
  .left-content{
	  width:36%;
  }
  .m-t-24{
	  margin-top: 24px;
  }
  .m-t-64{
	  margin-top:64px;
	justify-content: center;
  }
  .text-gray{
	  color:var(--el-color-info)
  }
</style>