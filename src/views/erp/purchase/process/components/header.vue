<template>
	<el-tabs v-model="activeName"  @tab-change="tabChange">
	  <el-tab-pane v-for="(item,index) in orderState"  :name="item.name" :key="item.name">
		  <template #label>
			  <span >{{item.label}}</span>
			  <span  v-if="item.num">( <span class="text-orange">{{item.num}}</span> )</span>
		   </template>
			</el-tab-pane>
			</el-tabs>
			<el-row>
				<el-space>
					<el-button v-hasPerm="'erp:po:ass:add'" v-if="queryParams.auditstatus!='2'" type="primary" class="im-but-one" @click="handleAdd">
					  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
					  <span>添加加工单</span>
					</el-button>
					    <el-radio-group v-else v-model="queryParams.operate" @change="handleQuery">
					      <el-radio-button label=""  value=""   >全部</el-radio-button>
					      <el-radio-button label="true" value="true" >可处理</el-radio-button>
					      <el-radio-button label="false" value="false" >无库存</el-radio-button>
					    </el-radio-group>
					<el-button v-if="queryParams.auditstatus=='2'" @click="handleDelete">作废</el-button>
					<el-select placeholder="单据类型" v-model="queryParams.ftype" @change="handleQuery" clearable>
						<el-option label="组装单"  value="ass"></el-option>
						<el-option label="拆分单"  value="dis"></el-option>
					</el-select>
					<Warehouse @changeware="getWarehouse" />
					<Datepicker v-if="queryParams.auditstatus!='1'&&queryParams.auditstatus!='2'" ref="datepickers" @changedate="changeDate" />
					<el-input v-model="queryParams.search" @input="handleInputQuery"
					 clearable 
					 @clear="handleInputQuery"
					 placeholder="请输入" class="input-with-select">
						<template #prepend>
							<el-select v-model="queryParams.searchtype" @change='handleQuery' placeholder="SKU"
								style="width: 110px">
								<el-option label="单据编码" value="number"></el-option>
								<el-option label="SKU" value="sku"></el-option>
								<el-option label="货件编码" value="shipment"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="handleQuery">
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
	import {ref,reactive,onMounted,watch,h,toRefs} from 'vue'
	import {Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {ElMessage,ElDivider} from 'element-plus';
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import Warehouse from '@/components/header/warehouse.vue';
	import { useRouter } from 'vue-router';
	import {getCountNum } from '@/api/erp/assembly/assemblyApi.js'
	
	const router = useRouter();
	const shipmentid = router.currentRoute.value.query.shipmentid;
	const emits  =defineEmits(
		['change','delete']
	)
    const state =reactive({
		orderState:[
			{label:'全部',name:''},
			{label:'处理中',name:'2',num:'5'},
			{label:'已完成',name:'3'},
			{label:'已终止',name:'4'},
			{label:'已作废',name:'5'},
		],
		activeName:'',
		radio:'全部',
		queryParams:{searchtype:"sku",operate:""},
		uploadVisible:false,
	})
	const {
		orderState,
		activeName,
		queryParams,
		uploadVisible,
		radio,
	}=toRefs(state)
	defineExpose({
		state,show
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
	function getWarehouse(value,load){
		state.queryParams.warehouseid=value;
		if(!load){
		  emits('change',state.queryParams);
		}
	}
	function handleQuery(){
		emits('change',state.queryParams);
	}
	function changeDate(strdate,timedate){
		state.queryParams.fromDate=timedate.start;
		state.queryParams.toDate=timedate.end;
		emits('change',state.queryParams);
	}
	function tabChange(val){
		state.queryParams.auditstatus=val;
		emits('change',state.queryParams);
	}
	function handleInputQuery(){
		if(state.queryParams.search){
			if(state.queryParams.search.indexOf("AS")==0||state.queryParams.search.indexOf("MO")==0){
				state.queryParams.searchtype="number";
			}
			else if(state.queryParams.search.indexOf("FBA")==0){
				state.queryParams.searchtype="shipment";
			}
		}
		
		handleQuery();
	}
	function handleDelete(){
		emits('delete');
	}
	function show(){
		getCountNum().then(res=>{
			if(res.data){
				state.orderState[1].num=res.data.inProgressNum;
				if(res.data.pendingNointerNum){
				   state.orderState[1].num=state.orderState[1].num+res.data.pendingNointerNum;
				}
				if(res.data.pendingNum){
					state.orderState[1].num=state.orderState[1].num+res.data.pendingNum;
				}
			}
		})
	}
	onMounted(()=>{
		state.orderState[1].num=0;
		if(shipmentid){
			state.queryParams.searchtype="shipment";
			state.queryParams.search=shipmentid;
		}
		emits('change',state.queryParams);
		show();
	})  
</script>

<style scoped="scoped">
	.text-orange{
		font-weight: 700;
		color:var(--el-color-primary);
		font-size: 12px;
	}
</style>
