<template>
    <div style="width: 100%;height: 100vh;background-color:darkslateblue;overflow: hidden;">
                 自动登录

    </div>
</template>

<script>
import { Lock, User } from '@element-plus/icons-vue';
import request from "@/utils/request";
import {ElMessage} from "element-plus";
    export default {
        name: "SSOLogin",
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
                   var jsessionid = this.$route.query.jsessionid;
                   let path =sessionStorage.getItem("old_url_before_login");
		            if(jsessionid){
		                 sessionStorage.setItem("jsessionid",jsessionid);
		                 if(path){
							if(path.indexOf("auth/getJSession")>0||path.indexOf("ssologin")>0||path=="/"){
							    this.$router.push("/home"); 
							}else{
								this.$router.push(path);
							}
		                	 
		                 }else{
		                	 this.$router.push("/home"); 
		                 }		             
		            }else{
		            	jsessionid=sessionStorage.getItem("jsessionid");
		            	if(jsessionid){
	                       if(path){
								if(path.indexOf("auth/getJSession")>0||path.indexOf("ssologin")>0||path=="/"){
									this.$router.push("/home"); 
								}else{
									this.$router.push(path);
								}
	                       }else{
		            		   this.$router.push("/home");
		            		}
		            	}else{
		            	  location="http://192.168.0.129:8087/auth/getJSession"; 
		            	}
		            }
            
            }
        },
        created() {
			   
			    this.userLogin();
			  }
    }
</script>

<style scoped>

</style>