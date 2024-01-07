<template>
	<div class="main-sty">
	<!--  头部搜索区域 -->
	<div class="con-header" >
	<el-form :model="form" label-width="120px">
	    <el-form-item label="消息类型：">
	     <el-select v-model="form.action" placeholder="消息类型">
	       <el-option label="常规消息" value="like" />
	       <el-option label="即时消息" value="timely" />
	     </el-select>
	    </el-form-item>
	    <el-form-item label="用户类型">
	      <el-select v-model="form.target" placeholder="用户类型">
	        <el-option label="全部用户" value="AL" />
	        <el-option label="付费用户" value="PA" />
			<el-option label="免费用户" value="FR" />
	      </el-select>
	    </el-form-item>
	    <el-form-item label="标题:">
	       <el-input v-model="form.title"></el-input>
	    </el-form-item>
	    
	    <el-form-item label="内容">
	       <el-input type="textarea" v-model="form.content" rows="15" cols="100"></el-input>
	    </el-form-item>
	    <el-form-item>
	      <el-button type="primary" @click="onSubmit">提交</el-button>
	      <el-button>取消</el-button>
	    </el-form-item>
	  </el-form>
	  </div>
	  </div>
</template>

<script setup>
	import {ref,reactive,onMounted,watch,inject,toRefs,nextTick} from 'vue';
	import notify from "@/api/sys/admin/notify.js";
	import { ElMessage, ElMessageBox } from 'element-plus';
	const state = reactive({
		form:{title:"",content:"",action:"timely",target:"AL",}
	})
	const {
		form
	}=toRefs(state);
	function onSubmit(){
		notify.addAnnounce(state.form).then(res=>{
			ElMessage({
			  type: 'success',
			  message: '提交成功!',
			})
		})
	}
</script>

<style>
</style>