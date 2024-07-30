<template>
   <el-empty :image-size="600"   description="登录信息检查..."/>
</template>

<script>
import { Lock, User } from '@element-plus/icons-vue';
import request from "@/utils/request.js";
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
            async userLogin(){
                   var jsessionid = this.$route.query.jsessionid;
                   let path =sessionStorage.getItem("old_url_before_login");
		            if(jsessionid){
		                 localStorage.setItem("jsessionid",jsessionid);
						 localStorage.setItem("jsessiontime",new Date());
						 localStorage.setItem("logintype","sso");
						 let authserver=  localStorage.getItem("authserver");
						 if(!authserver){
							 this.ssologinisrun().then((result)=>{
								 if(result.data!="false"){
								 	  localStorage.setItem("authserver",result.data);
								 }
							 }).catch(e=>{
								  this.$router.push("/login");
							 });
						 }  
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
		            	jsessionid=localStorage.getItem("jsessionid");
		            	if(jsessionid){
							let authserver=  localStorage.getItem("authserver");
							if(!authserver){
								 this.ssologinisrun().then((result)=>{
									 if(result.data!="false"){
										  localStorage.setItem("authserver",result.data);
									 }
								 }).catch(e=>{
								  this.$router.push("/login");
							    });
							} 
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
							 this.ssologinisrun().then(result=>{
								 if(result.data!="false"){
								 	  localStorage.setItem("authserver",result.data);
								 	  location=result.data+"/getJSession";
								 }else{
								 	 this.$router.push("/login");
								 }
							 }).catch(e=>{
								  this.$router.push("/login");
							 });
							
		            	}
		            }
            
            },
			 ssologinisrun(){
			       return request.post("/api/auth/ssologinisrun");
			 }
        },
        mounted() {
			    this.userLogin();
			  }
    }
</script>

<style scoped>

</style>