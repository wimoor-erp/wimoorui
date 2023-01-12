<template>
	<el-tabs v-model="activeName"  @tab-change="tabChange">
	  <el-tab-pane v-for="(item,index) in orderState"  :name="item.name" :key="item.name">
		  <template #label>
			  <span >{{item.label}}</span>
			  <span  v-if="item.length">( <span class="text-orange">{{item.length}}</span> )</span>
		   </template>
			<el-row>
				<el-space>
					<el-button v-if="item.name!='1'" type="primary" class="im-but-one" @click="handleAdd">
					  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
					  <span>添加加工单</span>
					</el-button>
					    <el-radio-group v-else v-model="radio" @change="stateChange">
					      <el-radio-button label="全部" />
					      <el-radio-button label="可处理" />
					      <el-radio-button label="无库存" />
					    </el-radio-group>
					<el-button v-if="item.name=='0'||item.name=='1'" @click="handleDelete">作废</el-button>
					<el-select placeholder="单据类型" clearable>
						<el-option label="组装单"></el-option>
						<el-option label="拆分单"></el-option>
					</el-select>
					<Warehouse @changeware="getWarehouse" />
					<Datepicker v-if="item.name!='1'&&item.name!='2'" ref="datepickers" @changedate="changedate" />
					<el-input v-model="searchKeywords" @input="searchConfirm" placeholder="请输入" class="input-with-select">
						<template #prepend>
							<el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU"
								style="width: 110px">
								<el-option label="加工单编码" value="sku"></el-option>
								<el-option label="SKU" value="fnsku"></el-option>
								<el-option label="货件编码" value="asin"></el-option>
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
			</el-tab-pane>
			</el-tabs>
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
	import {ref,reactive,onMounted,watch,h,toRefs,defineEmits} from 'vue'
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import Warehouse from '@/components/header/warehouse.vue';
	import { useRouter } from 'vue-router'
	const router = useRouter()
	const emits  =defineEmits(
		['stateChange',"tabChange"]
	)
    const state =reactive({
		orderState:[
			{label:'全部',name:'0'},
			{label:'待处理',name:'1',length:'200'},
			{label:'处理中',name:'2',length:'5'},
			{label:'已完成',name:'3'},
			{label:'已终止',name:'4'},
			{label:'已作废',name:'5'},
		],
		activeName:'0',
		radio:'全部',
		uploadVisible:false,
	})
	const {
		orderState,
		activeName,
		uploadVisible,
		radio,
	}=toRefs(state)
	defineExpose({
		state,
	});
	function handleAdd(){
		router.push({
			path:"/e/p/p/c",
			query:{
				title:'添加加工单',
				path:"/e/p/p/c",
			},
		})
	}
	//导入
	function upload(){
		state.uploadVisible = true
	}
	function stateChange(val){
		emits('getState',val)
	}
	function tabChange(val){
		emits('tabState',val)
	}
</script>

<style scoped="scoped">
	.text-orange{
		font-weight: 700;
		color:var(--el-color-primary);
		font-size: 12px;
	}
</style>
