<template>
	<div class="main-sty">
		<div class="con-header">
		<el-row>
			<el-space>
		<Group ref="groups" @change="getData" defaultValue="all"/>
		<Currency ref="currencyRef" @change="getData" />
		<Datepicker ref="datepickers" @changedate="changedate" />
		<el-input  v-model="searchKeywords" @input="searchConfirm" placeholder="请输入" class="input-with-select" >
		  <template #prepend>
		    <el-select v-model="selectlabel" @change='searchTypeChange' style="width: 110px">
		      <el-option label="单据号" value="code"></el-option>
		      <el-option label="SKU" value="sku"></el-option>
		      <el-option label="创建人" value="operator"></el-option>
		    </el-select>
		  </template>
		  <template #append>
		    <el-button @click="searchConfirm">
		       <el-icon class="ic-cen font-medium">
		        <search />
		     </el-icon>
		    </el-button>
		  </template>
		</el-input>
		<el-button @click="clearSearch">重置</el-button>
		</el-space>
		</el-row>	
		<el-row>
			<el-space>
				<el-button type="primary" @click="handleAdd">添加分摊费用</el-button>
				<el-button @click="FeeTypeEdit">费用类型管理</el-button>
				<el-button  @click="shareRules">分摊规则</el-button>
				<el-button @click="upload">导入分摊费</el-button>
				<el-button >导出</el-button>
			</el-space>
			<div class="rt-btn-group">
				<el-button   class='ic-btn' title='帮助文档'>
					<help theme="outline" size="16" :strokeWidth="3"/>
				</el-button>
			</div>
		</el-row>
		</div>
		<div class="con-body">
			<Table/>
		</div>
	</div>
	<OtherFee ref="otherFeeRef"/>
	<ShareRules ref="ShareRulesRef"/>
	<Listings ref="ListingsRef" />
	<el-dialog
	   v-model="uploadVisible"
	   title="导入分摊费用"
	   width="480px"
	 >
	 <el-upload
	    :drag="true"
	    action
	    :http-request="uploadFiles"
	    :limit="1"
	    :before-upload="beforeUpload" 
	    :show-file-list="true" 
	    :headers="headers" 
	    accept=".xls,.xlsx"
	    multiple
	   >
	     <el-icon class="font-32"><upload-filled /></el-icon>
	     <div class="el-upload__text">
	      拖拽文件到此处或 <em>点击上传</em>
	     </div>
	   </el-upload>
	 <template #footer>
	   <span class="dialog-footer">
		   <div class="flex-center-between">
		 <el-button type="primary" @click.stop="downloadTemp" plain>下载模板</el-button>
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
	import Group from '@/components/header/group.vue';
	import Currency from '@/components/header/currency.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue'
	import {Help,} from '@icon-park/vue-next';
	import Table from"./components/table.vue"
	import OtherFee from"./components/otherFee.vue"
	import ShareRules from"./components/shareRules.vue"
	import Listings from"@/views/amazon/listing/common/listings"
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const currencyRef=ref()
	const otherFeeRef = ref()
	const ShareRulesRef = ref()
	const ListingsRef = ref()
	const state=reactive({
		selectlabel:'code',
		searchKeywords:'',
		queryParam:{},
		uploadVisible:false,
	})
	const {
		selectlabel,
		searchKeywords,
		queryParam,
		uploadVisible,
	}=toRefs(state)
	
	function clearSearch(){
		currencyRef.value.reset()
	}
	
	function handleAdd(){
		router.push({
			path:"/f/c/c",
			query:{
				title:'添加分摊费用',
				path:"/f/c/c",
			},
		})
	}
	
	function FeeTypeEdit(){
		otherFeeRef.value.show()
	}
	function shareRules(){
		ShareRulesRef.value.show()
	}
	
	function upload(){
		state.uploadVisible = true
	}
</script>

<style>
	.font-32{
		font-size:32px;
	}
</style>
