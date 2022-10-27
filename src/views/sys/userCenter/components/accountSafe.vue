<template>
	<div >
		<el-row>
			<el-col  :span="8" >
				<span class="font-base">手机号</span>
			</el-col>
			<el-col  :span="6" >
				<span class="font-small">176******86</span>
			</el-col>
			<el-col :span="4"  :offset="6" class="text-right">
				<el-link type="primary" :underline="false" @click="changephone">更换</el-link>
			</el-col>
		</el-row>
		  <el-divider />
		  <el-row>
		  	<el-col  :span="8" >
		  		<span class="font-base">密码</span>
		  	</el-col>
		  	<el-col  :span="6" >
		  		<span class="font-small">已设置</span>
		  	</el-col>
		  	<el-col :span="4"  :offset="6" class="text-right">
		  		<el-link type="primary" :underline="false" @click = "changepassedword">修改</el-link>
		  	</el-col>
		  </el-row>
		   <el-divider />
		   <el-row>
		   	<el-col  :span="8" >
		   		<span class="font-base">邮箱</span>
		   	</el-col>
		   	<el-col  :span="6" >
		   		<span class="font-small">1243*****@qq.com</span>
		   	</el-col>
		   	<el-col :span="4"  :offset="6" class="text-right">
		   		<el-link type="primary" :underline="false" >更换</el-link>
		   	</el-col>
		   </el-row>
	</div>
	<el-dialog v-model="phoneVisible" title="设置手机" destroy-on-close='true' width="560px" >
			<el-steps :active="active" finish-status="success">
			    <el-step title="身份验证" />
			    <el-step title="绑定手机" />
			    <el-step title="绑定成功" />
			  </el-steps>
			 <div class="ph-box">
				 <div  v-if="step=='step1'">
				  <el-input v-model="phone" disabled >
					   <template #prepend>原手机号</template>
				  </el-input>
				  <div class="flex-center">
					 <el-input v-model="code" placeholder="请输入..." > </el-input>
					 <el-button type="" plain>获取验证码</el-button>
					</div>
				 </div>
				 <div  v-else-if="step=='step2'">
				  <el-input v-model="phone" >
				 					   <template #prepend>新手机号</template>
				  </el-input>
				  <div class="flex-center">
				 					 <el-input v-model="code" placeholder="请输入..." > </el-input>
				 					 <el-button type="" plain>获取验证码</el-button>
				 					</div>
				 </div>
				 <div  v-else>
				  <div class="flex-center text-center">
				 		<el-result
				 		        icon="success"
				 		        title="修改成功!"
				 		      >
				 		      </el-result>
				 	</div>
				 </div>
			</div>
		<template #footer>
			<span class="dialog-footer">
				<div v-if="step !=='step3'">
				<el-button @click="phoneVisible = false">取消</el-button>
				<el-button type="primary" @click="nextstep" >下一步</el-button>
				</div>
				<el-button v-else  @click="successphone" >知道了</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog v-model="passedwordVisible" title="设置密码" destroy-on-close='true' width="560px" >
				 <el-form :inline="true" :model="passedword" class="form-width-fill" label-width="auto">
				    <el-form-item label="旧密码" required >
				 	   <el-input  v-model="passedword.old"   placeholder="请输入..." ></el-input>
				    </el-form-item>
				 		 <el-form-item label="新密码" required>
				 		   <el-input v-model="passedword.new"   placeholder="至少8位数以上的数字或字母组合" ></el-input>
				 		 </el-form-item>
						 <el-form-item label="确认密码" required>
						   <el-input v-model="passedword.new"   placeholder="请输入..." ></el-input>
						 </el-form-item>
				  </el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="passedwordVisible = false">取消</el-button>
				<el-button type="primary" @click="submitpassedword" >确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import {ref,reactive,onMounted}from"vue"
	export default{
		setup(){
			let phoneVisible =ref(false)
			let passedwordVisible =ref(false)
			let phone =ref('176******86')
			let step =ref("step1")
			let active =ref(0)
			let passedword = reactive({
				old:'',
				new:'',
			})
			function changephone(){
				phoneVisible.value = true
			}
			function successphone(){
				phoneVisible.value = false
				step.value = "step1"
				active.value = 0
			}
			function changepassedword(){
				passedwordVisible.value = true
			}
			function nextstep(){
				active.value++
				//需要验证验证码
				if(active.value==1){
					step.value = "step2"
				}
				if(active.value==2){
					step.value = "step3"
				}
			}
			return{
				changephone,phoneVisible,
				phone,step,active,nextstep,
				successphone,passedword,
				changepassedword,
				passedwordVisible,
			}
		}
	}
</script>

<style scoped="scoped">
	.font-small{
		color:#999;
	}
	.ph-box{margin-top:32px;}
	.el-row{margin-top: 16px;margin-bottom: 16px;}
	.flex-center{
		display: flex;
		margin-top:16px;
	}
	.flex-center .el-input{
		margin-right:8px;
	}
	.text-center{
		justify-content: center;
	}
</style>
