<template>
	<div class="account"> 
	<div class="account-card">
		<el-scrollbar >
		<h4>我的账户</h4>
			<el-card class="m-t-16" v-for="item in DataList">
				      <div class="card-header flex-center-between">
						  <span>
				        <span>{{item.name}}</span>&nbsp;
						<el-tag  v-if="item.type=='credit'" size="small" type="danger" >借贷</el-tag>
						</span>
						<el-dropdown trigger="click">
						<el-icon class="font-large text-gray pointer"><MoreFilled /></el-icon>
						    <template #dropdown>
						      <el-dropdown-menu>
						        <el-dropdown-item @click="handleRename(item)">重命名</el-dropdown-item>
						        <el-dropdown-item @click="handleDelect(item)">删除</el-dropdown-item>
						      </el-dropdown-menu>
						    </template>
						  </el-dropdown>
				      </div>
					  <div class="card-body">
						  <span :class="item.type==''?'text-primary':''">￥<span class="ft-24">{{item.amount}}</span></span>
						  <p class="font-extraSmall">账户资产</p>
					  </div>
			</el-card>
			<el-card @click="handleAdd" class="add-account pointer" shadow="hover">
				<div class="flex-vertical">
				<el-icon class="text-center"><Plus /></el-icon>
				<span class="text-gray">添加账户</span>
				</div>
			</el-card>
			 </el-scrollbar>
	</div>
	<div class="account-chart">
		<el-row :gutter="16">
			<el-col :span="16">
				<LineChart/>
			</el-col>
			<el-col :span="8">
				<PieChart/>
			</el-col>
		</el-row>
		<el-row>
			<Table/>
		</el-row>
	</div>
	</div>
	<el-dialog 
	width="480px"
	:title="title" 
	:rules="rules"
	v-model="acconutVisable"
	>
	<el-form v-model="form" label-width="60px">
		<el-form-item label="名称" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="账户类型" v-if="type=='create'">
			    <el-radio-group v-model="form.radio" class="ml-4">
			      <el-radio label="1" >实体</el-radio>
			      <el-radio label="2" >借贷</el-radio>
			    </el-radio-group>
		</el-form-item>
	</el-form>
	 <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="acconutVisable = false">取消</el-button>
	        <el-button type="primary" @click="handleConfirm">
	          确认
	        </el-button>
	      </span>
	    </template>
	</el-dialog>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {MoreFilled,Plus} from '@element-plus/icons-vue'
	import {ElMessage, ElMessageBox } from 'element-plus';
	import LineChart from "./components/lineChart.vue"
	import PieChart from "./components/pieChart.vue"
	import Table from "./components/table.vue"
	const state = reactive({
		DataList:[
			{name:'银行卡',amount:'2,751,820.33',type:'',id:'1'},
			{name:'诚e赊',amount:'-820.33',type:'credit',id:'2'},
		],
		title:'账户编辑',
		type:'add',
		acconutVisable:false,
		accountid:'',
		form:{
			name:'',
			radio:'1',
		},
		rules:{
			 name:[{ required: true, message: '名称不能为空！', trigger: 'blur' }],
		},
	})
	const {
		DataList,
		acconutVisable,
		form,
		rules,
		accountid,
		title,
		type,
	}=toRefs(state)
	function handleRename(item){
		state.type = 'add';
		state.acconutVisable = true;
		state.form.name = item.name;
		state.accountid = item.id
	}
	function handleConfirm(){
		state.acconutVisable = false;
		state.DataList.forEach((item)=>{
			if(item.id==state.accountid){
				item.name = state.form.name
			}
		})
		ElMessage({
			message:'修改成功',
			type:'success',
		})
	}
	function handleDelect(item){
		ElMessage({
			message:'存在账户记录，不可删除！',
			type:'warning',
		})
	}
	function handleAdd(){
		state.title = '添加账户';
		state.type = 'create';
		state.form.name="";
		state.acconutVisable = true;
		
	}
	
</script>

<style scoped="scoped">
	.flex-vertical{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 24px;
		margin-bottom: 24px;
	}
	.text-gray{
		color: #999;
	}
	.account{
		display: flex;
	}
	.account-card{
		padding:16px;
		width:280px;
		height: 100%;
		height: calc(100vh - 34px);
	}
	.account-card h4{
		margin-bottom: 16px;
	}
	.account-chart{
		padding:16px;
		flex: 1;
		background-color: var(--el-color-info-lighter);
	}
	.m-t-16{
		margin-bottom: 16px;
	}
	.account-card .card-body{
		margin-top: 24px;
	}
	.ft-24{
		font-size: 24px;
		font-family:DIN Alternate,Helvetica Neue,Helvetica,Arial, SF Pro Display;
		font-weight: 700;
	}
	.text-primary{
		color: var(--el-color-primary);
	}
	
	.add-account{
		border: 2px dashed #DEDEDE;
	}

</style>
