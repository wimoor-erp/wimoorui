<template>
			<el-row>
				<el-space>
					<el-button type="primary" class="im-but-one" @click="handleAdd">
					  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
					  <span>添加</span>
					</el-button>
					<el-button @click="handleDelete">删除</el-button>
					<el-button @click="upload">导入</el-button>
					<Datepicker ref="datepickers" @changedate="changedate" />
					<el-input v-model="searchKeywords" @input="searchConfirm" placeholder="请输入" class="input-with-select">
						<template #prepend>
							<el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU"
								style="width: 110px">
								<el-option label="单据编码" value="sku"></el-option>
								<el-option label="SKU" value="fnsku"></el-option>
								<el-option label="产品名称" value="asin"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="searchConfirm">
								<el-icon style="font-size: 16px;align-itmes:center">
									<search />
								</el-icon>
				  	</el-button>
						</template>
					</el-input>
					<!-- <el-button>重置</el-button> -->
				</el-space>
				<div class='rt-btn-group'>
					<el-button class='ic-btn' title='帮助文档'>
						<help theme="outline" size="16" :strokeWidth="3" />
					</el-button>
				</div>
			</el-row>
			<el-dialog
			   v-model="uploadVisible"
			   title="导入产品互调单"
			   width="400px"
			 >
			 <el-upload
			     :drag="true"
			     action
				 :http-request="uploadFiles"
				 :limit="1"
				 :before-upload="beforeUpload" 
				 :show-file-list="true" 
				 :headers="headers" 
				 accept=".xls,.xlsx,.zip"
			     multiple
			   >
			     <el-icon class="font-48"><upload-filled /></el-icon>
			     <div class="el-upload__text">
			      拖拽文件到此处或 <em>点击上传</em>
			     </div>
			   </el-upload>
			 <template #footer>
			   <span class="dialog-footer">
				   <div class="flex-center-between">
				 <el-button type="success" @click.stop="downloadTemp" plain>下载模板</el-button>
				 <div>
			     <el-button @click="uploadVisible = false">取消</el-button>
			     <el-button type="primary" @click.stop="uploadExcel">
			       上传文件
			     </el-button></div></div>
			   </span>
			 </template>
			  </el-dialog>
</template>

<script setup>
	import {ref,reactive,onMounted,watch,h,toRefs} from 'vue'
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import { useRouter } from 'vue-router'
	const router = useRouter()
    const state =reactive({
		uploadVisible:false,
	})
	const {
		uploadVisible,
	}=toRefs(state)
	function handleAdd(){
		router.push({
			path:"/e/w/e/c",
			query:{
				title:'添加互调单',
				path:"/e/w/e/c",
			},
		})
	}
	//导入
	function upload(){
		state.uploadVisible = true
	}
	function handleDelete(row){
		if(row){
			ElMessage({
				message:'请选择一个产品!',
				 type: 'error',
			})
		}
	}
</script>

<style scoped="scoped">
	.font-48{
		font-size: 48px;
		    color: #999;
	}
</style>
