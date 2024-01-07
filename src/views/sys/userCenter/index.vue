<template>
	<div class=' gary-bg' style="padding:16px 0px">
		<el-row>
			<el-col  :span="16" :offset="4">
				<div class=" g-bg pag-radius-bor"> 
				  <div class="blur">
					<div class="user-head">
						<div class="u-img">
							<el-upload
							    action="#"
								class="avatar-uploader"
							    list-type="picture-card"
								:show-file-list="false"
								:limit="1"
								:multiple="false"
								accept=".png,.jpeg,.jpg,.bmp"
								:headers="headers" 
								:http-request="uploadFiles"
								:before-upload="beforeUpload" 
								:on-exceed="handleExceed"
								 ref="uploadRef"
								auto-upload="true"
							>
							  <el-avatar v-if="formInline.image" :src="formInline.image" class="avatar" />
							  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
							</el-upload>
							
							
						</div>
						<div class="u-message">
							<el-row>
								<el-col :span="8">
									<div class="u-name">
									<h2>{{formInline.username}}</h2>
									
									<el-image :src="require('@/assets/image/svip.png')">
									</el-image>
									</div>
									<el-space class="pag-small-Extra" :spacer="spacer">
										<span v-if="formInline.usertype=='admin'">超级管理员</span>
										<span v-else-if="formInline.usertype=='manager'">管理员</span>
										<span v-else>常规账户</span>
										<span>{{dateFormat(userData.createDate)}}注册</span>
									</el-space>
									<h4>账号:{{userData.account}}</h4>
								</el-col>
								<el-col :span="8">
									<div class ="text-name">
									<div class="u-label">
										<p >邮箱 : {{formInline.email}}</p>
										<p>公司 : {{formInline.companyname}}</p>
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
					   <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
					     <el-tab-pane label="账号安全" name="safe">
							 <AccountSafe @change="getPersonalmessage" ref="safeRef" />
						 </el-tab-pane>
					     <el-tab-pane label="微信绑定" ref="wechatRef" name="wechat">
							 <Wechat/>
						 </el-tab-pane>
						 <el-tab-pane label="账号解绑"   name="unbind">
						 	 <Unbind ref="unbindRef" />	
						 </el-tab-pane>
						 <el-tab-pane label="帐号注销" ref="loginRef" name="login">
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
		   <el-form-item label="用户名"   >
			   <el-input  v-model="formInline.name"   placeholder="请输入用户名" ></el-input>
		   </el-form-item>
				 <el-form-item label="公司名称" v-if="formInline.usertype=='manager'"  >
				   <el-input v-model="formInline.company"   placeholder="请输入公司名称" ></el-input>
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
	import {reactive,toRefs,onMounted,h,ref}from"vue";
	import { ElDivider} from 'element-plus'
	import {Plus} from '@element-plus/icons-vue'
	import userApi from '@/api/sys/admin/userApi';
	import AccountSafe from"./components/accountSafe.vue"
	import Wechat from"./components/wechat.vue"
	import Logoff from"./components/logoff.vue";
	import Unbind from "./components/unbind.vue";
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import { genFileId } from 'element-plus';
	import { ElMessage } from 'element-plus';
	let headers=ref({"Content-Type": "multipart/form-data" });
	let uploadRef=ref();
	let unbindRef=ref();
	let safeRef=ref();
	let wechatRef=ref();
	let loginRef=ref();
    const state = reactive({
    	personVisable:false,
    	activeName:"safe",
		formInline:{
			name:"",
			company:'',
			companyname:'',
		},
		avatarName:'',
		userData:{},
		imgfile:{},
    })
    const {
    	personVisable,
    	activeName,
		formInline,
		avatarName,
		userData,
		imgfile,
		
    }=toRefs(state)
	       const spacer = h(ElDivider, { direction: 'vertical' });
		   
		   function handleClick(){
			   if(state.activeName=="safe"){
				   safeRef.value.show(state.formInline);
			   }
			   if(state.activeName=="wechat"){
			   		wechatRef.value.show();
			   }
			   if(state.activeName=="login"){
			   		loginRef.value.show();
			   }
			   if(state.activeName=="unbind"){
				   unbindRef.value.show();
			   }
		   }
			function editPerson(){
				state.personVisable = true;
			}
			function submitPersoninfo(){
				//更新个人信息api
				var data={};
				data.name=state.formInline.name;
				data.company=state.formInline.company;
				if(!data.name){
					ElMessage({ message: "用户名称不能为空！", type: 'error'});
					return ;
				}
				if(state.formInline.usertype=='manager'&&!data.company){
					ElMessage({ message: "公司名称不能为空！", type: 'error'});
					return ;
				}
				userApi.updateSelf(data).then((res)=>{
					ElMessage({ message: "更新成功！", type: 'success'});
					state.personVisable=false;
					getPersonalmessage();
				});
			}
			function getPersonalmessage(){
				userApi.getInfo().then((res)=>{
					state.formInline=res.data;
					if(res.data.name){
						state.formInline.username=res.data.name;
						state.avatarName=res.data.name.substring(0,1);
					}
					if(res.data.company){
						state.formInline.companyname=res.data.company;
					}
					if(res.data.user){
						state.userData=res.data.user;
					}
					handleClick();
				})
				userApi.detail().then((res)=>{
					
				})
			}
		function uploadFiles(item){
			//上传文件的需要formdata类型;所以要转
			state.imgfile=item.file;
			let FormDatas = new FormData();
			if(state.imgfile){
				FormDatas.append("file",state.imgfile);
			}else{
				FormDatas.append("file",{});
			}
			userApi.saveImage(FormDatas).then((res)=>{
					ElMessage({ message: "操作成功！", type: 'success'});
					getPersonalmessage();
		   });
		}
		//文件上传之前
		function beforeUpload(file){
			if (file.type != "" || file.type != null || file.type != undefined){
			    //截取文件的后缀，判断文件类型
				//const FileExt = file.name.replace(/.+\./, "").toLowerCase();
				//计算文件的大小
				const isLt5M = file.size / 1024  < 5000; //这里做文件大小限制
				//如果大于50M
				if (!isLt5M) {
					ElMessage({
					    message: '上传文件大小不能超过 5000KB!!',
					    type: 'error'
					  })
					return false;
				}
				else {
				   state.formInline.image=URL.createObjectURL(file);
				   return true;
				}
			}
		}
		function handleExceed(files){
			uploadRef.value.clearFiles();//清空图片list
			const file=files[0];
			file.uid = genFileId();
			uploadRef.value.handleStart(file);//手动选择图片
			state.formInline.image=URL.createObjectURL(file);
			uploadRef.value.submit();//上传图片
		}
	    onMounted(()=>{
			var timer=setTimeout(function(){
	    	    getPersonalmessage();
				clearTimeout(timer);
			},1000);
	    })
	       
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
<style>
	.u-img .el-avatar{
		position: relative;
		background-color: #606266;
	}
	.dark .u-img  .el-avatar{
		position: relative;
		background-color: #EBEDF0;
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
		height:calc(100vh - 264px);
		min-height: 200px;
	}
	.avatar-uploader .el-upload {
	  border: 1px dashed var(--el-border-color);
	  border-radius: 40px;
	  height:60px !important;
	  width:60px !important;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	  transition: var(--el-transition-duration-fast);
	}
	
</style>
