<template>
    <div style="width: 100%;height: 100vh;background-color:darkslateblue;overflow: hidden;">
        <div style="width: 400px;margin: 150px auto;">
            <h1 style="color: #eeeeee;text-align: center;padding: 30px 0;">欢迎登录</h1>
            <el-form ref="form" :model="form" size="normal">
                <el-form-item>
                    <el-input :prefix-icon="User" v-model="form.username"   placeholder="请输入账户名" clearable>
                         <template #prefix>
                        <el-icon style="font-size:20px;" class="el-input__icon"><user /></el-icon>
                         </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                <el-input :prefix-icon="Lock" v-model="form.password"  show-password   placeholder="请输入密码">
                    <template #prefix>
                        <el-icon style="font-size:20px;" class="el-input__icon"><lock /></el-icon>
                    </template>
                </el-input>
           
                </el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button style="width: 100%;" type="primary" @click="userLogin">登录</el-button>
                </el-form-item>
            </el-form>

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
                 request.post("/api/user/login",this.form).then(res=>{
                    if(res.code=="0"){
                        this.$message({
                            type:"success",
                            message:"登录成功!"
                        });
                        this.$router.push("/home");//路由跳转
                    }else{
                         this.$message({
                            type:"error",
                            message:"登录失败!"+res.msg
                        });
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>