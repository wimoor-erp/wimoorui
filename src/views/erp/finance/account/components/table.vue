<template>
	<div class="pag-radius-bor m-t-16">
		<el-row>
		<el-space>
		<el-button type="primary" v-if="queryParams.acc"  @click="showAccDialog">
		  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
		  <span>记账</span>
		</el-button>
		 

		<el-tooltip  v-else placement="top" content="必须选择具体账户后才能操作">
			<el-button type="primary"  >
			  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
			  <span>记账</span>
			</el-button>
		</el-tooltip>
	
		<el-button @click="handleFeeItem">费用项管理</el-button>
		<el-button @click="handleDownload">导出</el-button>
		</el-space>
		<div class="rt-btn-group">
			<el-space>
			<Datepicker ref="datepickers" :shortIndex="1"  @changedate="changedate" />
			<el-select v-model="queryParams.project" placeholder="请选择费用项" class="with-select"  @change="handleQuery">
				<el-option v-for="item in feeTypeList" :key="item.id"  :label="item.name" :value="item.id" ></el-option>
			</el-select>
			</el-space>
			  <el-input  @input="handleQuery"
			  placeholder="请输入费用项,SKU,单据号"
			  v-model="queryParams.search">
			  <template #suffix>
				   <el-icon class="ic-cen font-medium">
					<search />
				 </el-icon>
			  </template>
	        </el-input>
		</div>
		</el-row>
		<el-row class="m-t-16 expand-table-bg">
			<GlobalTable
			ref="globalTableRef"
			 :tableData="tableData"
			 @expandChange="handleExpandChange"
			  @row-click="tableRowClick"
			 rowKey="createtime"
			 height="calc(100vh - 220px)"  @loadTable="loadTableData" >
				<template #field>
					<el-table-column type="expand" width="65" >
						 <template #default="props">
							<el-table :data="props.row.expandTable">
								<el-table-column label="时间"  prop="createtime" />
								<el-table-column label="收支项" prop="name" />
								<el-table-column label="关联单号" prop="number" />
								<el-table-column label="关联SKU" prop="sku" />
								<el-table-column label="金额(￥)" prop="amount">
									<template #default="scope">
										<span v-if="scope.row.ftype=='in'">+</span>
										<span v-if="scope.row.ftype=='out'">-</span>{{scope.row.amount}}
										<el-button link size="mini" type="primary" v-if="!scope.row.number" @click.stop="cancelAccItem(scope.row)">撤销</el-button> 
									</template>	 
								 </el-table-column>
								<el-table-column label="备注" prop="remark"/>
							</el-table>
						 </template>	 
				</el-table-column>
				<el-table-column label="日期" prop="createtime"/>
				<el-table-column label="收入(￥)" prop="insum"/>
				<el-table-column label="支出(￥)" prop="outsum"/>
				<el-table-column label="结余" prop="balance"/>
				</template>
			</GlobalTable>
		</el-row>
	</div>
	<el-dialog
	width="480px"
	title="记账" 
	:rules="rules"
	v-model="dialogVisable"
	>
	<el-form v-model="form" label-width="60px">
		<el-form-item label="费用类型">
		<el-radio-group v-model="form.ftype" class="ml-4">
		  <el-radio label="in" >收入</el-radio>
		  <el-radio label="out" >支出</el-radio>
		</el-radio-group>
		</el-form-item>
		<el-form-item label="收支项目">
           <el-select  v-model="form.projectid">
			  <el-option v-for="item in feeTypeList" :key="item.id"  :label="item.name" :value="item.id" ></el-option>
		   </el-select>
		</el-form-item>
		<el-form-item label="金额">
           <el-input type="number" v-model="form.amount">
			   <template #suffix>
			   ￥
			   </template>
		   </el-input>
		</el-form-item>
		<el-form-item label="备注" prop="remark">
			<el-input type="textarea"  v-model="form.remark"></el-input>
		</el-form-item>
	</el-form>
	 <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialogVisable = false">取消</el-button>
	        <el-button type="primary" @click="handleConfirm">
	          确认
	        </el-button>
	      </span>
	    </template>
	</el-dialog>
<el-dialog v-model="feeVisable" title="费用项管理">
		<el-button @click="handleAdd"   >添加费用类型</el-button>
	    <el-table :data="feeTableData" class="m-t-8">
	      <el-table-column  label="费用名称"  >
		  <template #default="scope">
		  		<el-input v-if="scope.row.edit" clearable placeholder="请输入费用项" v-model="scope.row.name" ></el-input>
				<div v-else>{{scope.row.showname}}</div>
		  </template>
		  </el-table-column>
	      <el-table-column  label="操作"  >
		     <template #default="scope">
				 <el-button v-if="!scope.row.edit" type="primary"
				  @click="scope.row.edit=true"
				  link>编辑</el-button>
				 <el-button v-if="!scope.row.edit" type="primary"
				  @click="handleDelete(scope.row)"
				  link>删除</el-button>
				  
				  <el-button  v-if="scope.row.edit" type="primary"
				   @click="handleSave(scope.row)"
				   link>保存</el-button>
				   <el-button v-if="scope.row.edit"  type="primary"
				    @click="handleCancel(scope.row)"
				    link>取消</el-button>
			 </template>
		  </el-table-column>
	    </el-table>
		 <template #footer>
		        <el-button @click="feeVisable = false">关闭</el-button>
		    </template>
	  </el-dialog>
</template>

<script setup>
	import {Plus,} from '@icon-park/vue-next';
	import {Search} from '@element-plus/icons-vue'
	import { ref,reactive,onMounted,watch,toRefs,defineEmits,computed} from 'vue'
	import Datepicker from '@/components/header/datepicker.vue';
	import journalApi from '@/api/erp/finances/journalApi.js';
	import faccountApi from '@/api/erp/finances/faccountApi.js';
	import projectApi from '@/api/erp/finances/projectApi.js';
	import { ElMessage, ElMessageBox } from 'element-plus';
	const emit = defineEmits(['changeData']);
	const globalTableRef=ref();
	const state = reactive({
		feeTableData:[ ],
		dialogVisable:false,
		feeVisable:false,
		form:{
			ftype:'in',
			amount:'',
			remark:'',
			feetype:'',
		},
		feeTypeList:[],
		selectLabel:'0',
		expendRows:[],
		searchWord:'',
		queryParams:{search:'',},
		tableData:{records:[],total:0}
	})
	const {
		feeTypeList,
		selectLabel,
		searchWord,
		queryParams,
		tableData,
		feeTableData,
		dialogVisable,
		form,
		feeVisable,
	} = toRefs(state)
	function cancelAccItem(row){
		ElMessageBox.confirm(
			'你确定要撤销该笔记账吗?',
			{
			  confirmButtonText: '确认',
			  cancelButtonText: '取消',
			  type: 'warning',
			  callback:(action)=>{
				 if(action=="confirm"){
						journalApi.cancel({"id":row.id}).then(() => {
						  ElMessage({
							type: 'success',
							message: '删除成功',
						  })
						  handleQuery();
						  emit("changeData");
						})  
				 }
			  }
			}
		  )
	}
	function showAccDialog(){
		state.dialogVisable=true;
	}
	function handleConfirm(){
		if(state.queryParams.acc){
			var data=state.form;
			data.acct=state.queryParams.acc;
			journalApi.save(data).then((res)=>{
				ElMessage({
				  type: 'success',
				  message: '操作成功！',
				})
				state.dialogVisable=false;
				handleQuery();
				emit("changeData");
			});
		}else{
			ElMessage({
			  type: 'error',
			  message: '请选择一个具体的账户！',
			})
		}
	}
	
	function handleAdd(){
		if(state.feeTableData&&state.feeTableData.length>0){
			var hasNewItem=false;
			state.feeTableData.forEach(item=>{
				if(item.id==""){
					hasNewItem=true;
				}
			})
			if(hasNewItem){
				ElMessage({
				  type: 'error',
				  message: '存在未保存的记录！',
				})
				return ;
			}
		}
		state.feeTableData.push(  {  name:'', id:"",edit:true} );
	}
	function handleCancel(item){
		if(item.id==""){
			state.feeTableData = state.feeTableData.filter(item => item.id != "");
		}else{
			item.edit=false;
		}
	}
	function handleFeeItem(){
		state.feeVisable=true;
		state.feeTableData=[];
		projectApi.getProject().then((res)=>{
			 res.data.forEach(item=>{
				 if(item.issys==false){
					 item.showname=item.name;
				 	 state.feeTableData.push(item);
				 }
			 });
		});
	}
	function handleDelete(row){
		projectApi.delProject({"id":row.id}).then((res)=>{
			ElMessage({
			  type: 'success',
			  message: '删除成功',
			})
			 state.feeTableData = state.feeTableData.filter(item => item.id != row.id);
		});
	}
	function handleSave(row){
		if(row.id){
			projectApi.updateProject({"id":row.id,"name":row.name}).then((res)=>{
				ElMessage({
				  type: 'success',
				  message: '修改成功',
				})
				 row.showname=row.name;
				 row.edit=false;
			});
		}else{
			projectApi.saveProject({"name":row.name}).then((res)=>{
				ElMessage({
				  type: 'success',
				  message: '添加成功',
				});
				row.showname=row.name;
				row.id=res.data.id;
				row.edit=false;
			});
		}
		
	}
	//日期改变
	function changedate(dates){
		state.queryParams.fromDate=dates.start;
		state.queryParams.toDate=dates.end;
		handleQuery();
	}
	function handleDownload(){
		journalApi.downExcelDate(state.queryParams);
	}
	function handleExpandChange(row,expandedRows){
		//查询detail
		state.expendRows=expandedRows;
		if(row.expandTable&&row.expandTable.length==0){
			var data={};
			data.createdate=row.createtime;
			data.project=state.queryParams.project;
			data.search=state.queryParams.search;
			data.acc=state.queryParams.acc;
			journalApi.findDetialByCondition(data).then((res)=>{
				res.data.forEach(item=>{
					row.expandTable.push(item);
				})
			});
		}
		
	}
	function tableRowClick(row){
		   globalTableRef.value.toggleRowExpansion(row);
	}
	function handleQuery(){
		state.expendRows.forEach(item=>{
			  globalTableRef.value.toggleRowExpansion(item,false);
		});
		globalTableRef.value.loadTable(state.queryParams);
	}
	function loadTableData(param){
		journalApi.list(param).then(res=>{
			state.tableData.records=res.data.records;
			state.tableData.total=res.data.total;
			if(res.data.total>0){
				state.tableData.records.forEach(item=>{
					item.expandTable=[];
				});
			}
		});
	}
	function loadTypeList(){
		faccountApi.getProject().then((res)=>{
			state.feeTypeList=res.data;
		});
	}
	
	function show(item){
		state.queryParams.acc=item.id;
		handleQuery();
	}
	defineExpose({ show })
	onMounted(()=>{
		loadTypeList();
	})
</script>

<style scoped="scoped">
	.with-select{
		width: 120px;
	}

</style>
<style>
	.expand-table-bg .el-table__expanded-cell{
		padding:0px;
	}
	.expand-table-bg .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
	.expand-table-bg .el-table__expanded-cell .el-table__inner-wrapper::before{background-color:var(--el-fill-color-lighter)}
</style>