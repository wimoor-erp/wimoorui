<template>
	<div class="con-header">
	<el-row>
		<el-space>
			<div>
				<Platform @change="handlePlatform"></Platform>
			</div>
			<Warehouse
			@changeware="gettoWarehouse" 
			 warehouseType="oversea_usable"
			 defaultValue="only" 
			:isform="true" />
			<Datepicker ref="datepickers"   @changedate="changedate" />
			<el-input  v-model="searchKeywords" placeholder="输入换货编码,SKU或名称" @input="handleQuery" clearable class="input-with-select" >
			   <template #append>
			     <el-button @click="handleQuery">
			        <el-icon style="font-size: 16px;align-itmes:center">
			         <search />
			      </el-icon>
			     </el-button>
			   </template>
			 </el-input>
		</el-space>
		<div class='rt-btn-group'>
			<el-button @click="handleOrderDownload"> 导出 </el-button>
		</div>
	</el-row>
			<el-row>
				<el-space>
					<el-button type="primary" class="im-but-one" @click="handleAdd">
					  <span>添加多渠道订单</span>
					</el-button>
					 <el-button  @click="handleOrderUpdate">导入订单</el-button> 
				</el-space>
				<div class='rt-btn-group'>
					<div style="padding-right:20px">
						<el-button-group class="ml-4" >
						  <el-button :type="queryParam.displayType=='product'?'primary':null"
									 :plain="queryParam.displayType=='order'?true:false"   
						             @click="queryParam.displayType='product';handleQuery()"  >商品</el-button>
						  <el-button :type="queryParam.displayType=='product'?null:'primary'"
						             :plain="queryParam.displayType=='product'?true:false"   
						             @click="queryParam.displayType='order';handleQuery()">订单</el-button>
						</el-button-group>
					</div>
					
					<el-button class='ic-btn' title='帮助文档'>
						<help theme="outline" size="16" :strokeWidth="3" />
					</el-button>
				</div>
			</el-row>
 </div>
			<el-dialog
			   v-model="uploadVisible"
			   title="导入调库单"
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
			    accept=".xls,.xlsx"
			    multiple
			   >
			     <el-icon class="font-large"><upload-filled /></el-icon>
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
	<CreateOrder ref="createOrderRef" @change="handleQuery"></CreateOrder>
</template>

<script setup>
	import {ref,reactive,onMounted,watch,h,toRefs} from 'vue'
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,UploadFilled,House} from '@element-plus/icons-vue';
    import Warehouse from '@/components/header/warehouse.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import { useRouter } from 'vue-router';
	import dispatchApi from '@/api/erp/inventory/dispatchApi.js';
	import Platform from './platform.vue';
	import orderApi from "@/api/erp/order/orderApi.js";
	import CreateOrder from './create.vue';
	const emit = defineEmits(['getdata']);
	const createOrderRef=ref();

    const state =reactive({
		uploadVisible:false,
		queryParam:{
			search:'',
			auditstatus:'',
			platformid:'',
			displayType:"product"
		},
		myfile:null,
		searchKeywords:'',
	})
	const {
		orderStateList,
		uploadVisible,
		queryParam,
		activeStatus,
		myfile,
		searchKeywords
	}=toRefs(state)
	function handleAdd(){
		 createOrderRef.value.show()
	}
	//导入
	function upload(){
		state.uploadVisible = true;
	}
	function handleOrderDownload(){
		orderApi.downloadOrderByCondition(state.queryParam);
	}
	//日期改变
	function changedate(dates){
		state.queryParam.fromDate=dates.start;
		state.queryParam.toDate=dates.end;
		handleQuery();
	}
	function gettoWarehouse(warehouseid){
		state.queryParam.warehouseid=warehouseid;
			emit('getdata',state.queryParam);
	}
	function handlePlatform(value){
		state.queryParam.platformid=value;
		emit('getdata',state.queryParam);
	}
	function handleQuery(){
		state.queryParam.sku=state.searchKeywords;
		emit('getdata',state.queryParam);
	}
	function handleOrderUpdate(){
		state.uploadVisible=true;
	}
	//文件上传之前
	function beforeUpload(file){
		if (file.type != "" || file.type != null || file.type != undefined){
		    //截取文件的后缀，判断文件类型
			const FileExt = file.name.replace(/.+\./, "").toLowerCase();
			//计算文件的大小
			const isLt5M = file.size / 1024  < 5000; //这里做文件大小限制
			//如果大于50M
			if (!isLt5M) {
				ElMessage.error(  '上传文件大小不能超过 5MB!!');
				return false;
			}
			else {
			   return true;
			}
		}
	}
	function uploadFiles(item){
		//上传文件的需要formdata类型;所以要转
		state.myfile=item.file;
	}
	function uploadExcel(){
		let FormDatas = new FormData();
		FormDatas.append('file',state.myfile);
		orderApi.uploadExcel(FormDatas).then(function(res){
		    state.uploadVisible = false;
			ElMessage.success('上传成功');
			emit('getdata',state.queryParam);
		})
	}
	function downloadTemp(){
		orderApi.downExcelTemp();
	}
	onMounted(()=>{
		 
	});
	
	
</script>

<style scoped="scoped">
	.text-orange{
		font-weight: 700;
		color:var(--el-color-primary);
		font-size: 12px;
	}
	.font-48{
		font-size: 48px;
		    color: #999;
	}
</style>
