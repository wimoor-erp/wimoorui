<template>
	 <el-dialog v-model="uploadVisiable"   title="导入物流跟踪号">
		  <el-row>
			  <el-col :span="16">
	 		  <el-upload
	 		  		class="upload" 
	 		  		action   
	 		  		:http-request="uploadFile" 
	 		  		:limit="1" 
	 		  		:before-upload="beforeUpload" 
	 		  		:show-file-list="true" 
	 		  		:headers="headers" 
	 		  		accept=".xls,.xlsx"
	 		  		>
	 		  		<!-- action="/api/file/fileUpload" -->
	 		  		<el-button class="btn"><i class="el-icon-paperclip"></i>选择文件</el-button>
	 		  		<template #tip>
	 					   <el-link   style="margin-left:30px;" type="success" @click="downloadTemp"> 点击下载导入模板 </el-link>
	 		  		</template>
	 		  	</el-upload>
				</el-col>
				<el-col :span="7" >
				 <div style="float: right;"><el-button  type="primary" @click="uploadTransFile"  >上传</el-button ></div>
				 </el-col>
				 </el-row>
			<h3 style="margin-top:15px;">导入记录</h3>
			<div style="float: right;margin-bottom: 10px;">
				<el-input style="width: 250px;" @input="loadTableData" v-model="search" placeholder="请输入货件编码查询"></el-input>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="shipmentid" label="货件编码" width="200" />
				<el-table-column prop="status" label="提交状态" width="180" >
					<template #default="scope">
						<el-tag v-if="scope.row.status==0"  type="warning">待处理</el-tag>
						<el-tag v-if="scope.row.status==1"  type="success">已处理</el-tag>
						<el-tag v-if="scope.row.status==2"  type="danger">处理失败</el-tag>
					 </template>
					 </el-table-column>
				<el-table-column prop="opttime" label="上传时间"  >
						<template #default="scope">
							{{dateTimesFormat(scope.row.opttime)}}
						 </template>
				</el-table-column>
				<el-table-column prop="creator" label="创建人"   />
			</el-table>
	 	<template #footer>
	 	      <span class="dialog-footer">
	 	        <el-button @click="uploadVisiable = false">关闭</el-button>
	 	       
	 	      </span>
	 	 </template>
	 </el-dialog>
</template>
<script setup>
	import {h, ref ,watch,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,ChartPie} from '@icon-park/vue-next';
	import inboundboxApi from '@/api/amazon/inbound/inboundboxApi.js';
	import {dateFormat,getCurrencyMark,dateTimesFormat} from '@/utils/index';
	import {ElMessage } from 'element-plus';
	 let headers=ref({"Content-Type": "multipart/form-data" }) 
	let state=reactive({
		 uploadVisiable:false,
		 search:'',
		 tableData:[],
		 myfile:null,
	});
	let {
	   search,
	   uploadVisiable,
	   tableData,
	   myfile,
	} =toRefs(state);
	 
	 function downloadTemp(){
		inboundboxApi.downloadTraceuploadTemp();
	 }
	 
 
	//文件上传之前
	function beforeUpload(file){
		if (file.type != "" || file.type != null || file.type != undefined){
		    //截取文件的后缀，判断文件类型
			const FileExt = file.name.replace(/.+\./, "").toLowerCase();
			//计算文件的大小
			const isLt5M = file.size / 1024  < 50; //这里做文件大小限制
			//如果大于50M
			if (!isLt5M) {
				ElMessage({
				    message: '上传文件大小不能超过 50KB!!',
				    type: 'error'
				  })
				return false;
			}
			else {
			   return true;
			}
		}
	}
	function uploadFile(item){
		//上传文件的需要formdata类型;所以要转
		state.myfile=item.file;
	}
	function uploadTransFile(){
		let FormDatas = new FormData()
		FormDatas.append('file',state.myfile);
		inboundboxApi.uploadTraceuploadFile(FormDatas).then(function(res){
			 ElMessage({
			   type: 'success',
			   message: '上传成功',
			 });
			  refreshTable();
		})
	}
	function loadTableData(){
		inboundboxApi.recordList({"shipmentid":state.search}).then((res)=>{
			state.tableData=res.data;
		});
	}
	
	function show(){
		state.uploadVisiable=true;
		loadTableData();
	}
	
	defineExpose({
		show,
	})
	 
</script>

<style>
</style>