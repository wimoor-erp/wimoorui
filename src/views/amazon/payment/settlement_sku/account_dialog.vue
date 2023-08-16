<template>
	<el-dialog
	title="结账"
	v-model="visible"
	width="70%"
	top="1vh"
	>
		 <el-row style="padding-top:10px;padding-bottom:10px;">
		    <el-col :span="8"> <el-space> 店铺:{{localData.gname}}  </el-space> </el-col>
		    <el-col :span="8">  <el-space>  站点:{{localData.marketplacename}}</el-space></el-col>
		    <el-col :span="8"> <el-space>币种:{{localData.currency}}</el-space></el-col>
		  </el-row>
		 <el-row style="padding-top:10px;padding-bottom:10px;">
		    <el-col :span="8"> <el-space>开始日期:{{localData.fromDate}}</el-space></el-col>
		    <el-col :span="8"><el-space>结束日期:{{localData.endDate}} </el-space></el-col>
		    <el-col :span="8"> </el-col>
		  </el-row>
	 <el-row class="text-red">
		 
			 <el-col :span="20">
				 注意：结账后的数据不能做任何修改，如果发生错误只能删除后重新结账
			 </el-col>
			 <el-col :span="4">
				 <el-button type="primary" @click="submitForm" :loading="downloading">结账</el-button>
			 </el-col>
 
		 
	 </el-row>
	 	
	<div style="margin-bottom:5px;margin-top:15px;font-weight:bolder;font-size:22px;">结账记录历史</div>
	<GlobalTable
	 :tableData="tableData"
	  @loadTable="loadTableData"  
	 height="calc(40vh)" 
	 ref="globalTable"
	 >
	 <template #field>
		<el-table-column label="店铺"   min-width="110"  sortable="custom"   prop="gname" />
		<el-table-column label="站点"  min-width="80"  sortable="custom"   prop="market" />
		<el-table-column label="货币"  width="80"  sortable="custom"   prop="currency" />
		<el-table-column label="类型"  width="80"  sortable="custom"   prop="datetype" >
			 <template #default="scope">
				<span v-if="scope.row.datetype">转账日期</span> 
				<span v-else>结算日期</span> 
			</template>
		</el-table-column>
		<el-table-column label="开始日期"    width="100" sortable="custom"   prop="startdate" >
			<template #default="scope">
					{{dateFormat(scope.row.startdate)}}		 
			</template>
		</el-table-column>
		<el-table-column label="结束日期"   width="100"   sortable="custom"   prop="enddate" >
			<template #default="scope">
					{{dateFormat(scope.row.enddate)}}		 
			</template>
		</el-table-column>
		<el-table-column label="操作时间"  width="100"   sortable="custom"   prop="opttime" >
			<template #default="scope">
					{{dateTimesFormat(scope.row.opttime)}}		 
			</template>
		 </el-table-column>	
		<el-table-column label="操作人"  width="110"  sortable="custom"   prop="uname" />
		 <el-table-column label="操作"   >
			 <template #default="scope">
				 <el-button  link @click.stop="downLoadList(scope.row.id,scope.row)" :loading="scope.row.downloading">下载查看</el-button>
				 <el-link style="margin-left:10px;" type="danger" @click.stop="delSettAc(scope.row.id)">删除</el-link>
			 </template>
		 </el-table-column>
		 </template>
	</GlobalTable> 
	<template #footer>
		<el-button @click="visible=false">关闭</el-button>
	
	</template>
	</el-dialog>
</template>

<script setup>
	import {ref,reactive,toRefs} from"vue";
	import {dateFormat,dateTimesFormat} from '@/utils/index';
	import { ElMessage, ElMessageBox} from 'element-plus';
	import settlementSkuRptApi from '@/api/amazon/finances/settlementSkuRptApi.js';
	const globalTable=ref();
	const state = reactive({
		visible:false,
		tableData: {records:[],total:0}  ,
		localData:{},
		downloading:false,
	})
	const{
		visible,
		tableData,
		localData,
		downloading,
	}=toRefs(state)
	function downLoadList(id,row){
		var data={};
		data.id=id;
		data.currency=row.currency;
		row.downloading=true;
		settlementSkuRptApi.downDataExcel(data,()=>{
			row.downloading=false;
		})
	}
	function submitForm(){
		state.downloading=true;
		settlementSkuRptApi.saveFinStatement(state.localData).then((res)=>{
			if(res.data){
				ElMessage.success("操作成功");
				handleQuery();
			}
			state.downloading=false;
		}).catch((e)=>{
			state.downloading=false;
		});
	}
	function delSettAc(id){
		 ElMessageBox.confirm(
		    '请确认您要删除本次结账', '注意',
		    {
		      confirmButtonText: '确认',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }
		  ).then(() => {
		      settlementSkuRptApi.deleteAmzSettlementAccStatement({"id":id}).then((res)=>{
		      	if(res.data){
		      		ElMessage.success("删除成功");
		      		handleQuery();
		      	}
		      });
		    })
		
	}
	
	function handleQuery(){
		globalTable.value.loadTable();
	}
	function loadTableData(params){
		 settlementSkuRptApi.findAmzSettlementAccStatement(params).then(res=>{
				 if(res.data){
					 state.tableData.records=res.data.records;
					 state.tableData.total=res.data.total;
				 }else{
					 state.tableData.records=[];
					 state.tableData.total=0;
				 }
		 })
	}
		
	function loadGroupMarket(groupid,marketplaceid){
		settlementSkuRptApi.getGroupMarket({"groupid":groupid,"marketplaceid":marketplaceid}).then((res)=>{
			 if(res.data){
				 state.localData.gname=res.data.group.name;
				 state.localData.marketplacename=res.data.market.name;
			 }
		});
	}
	
	function show(queryParams){
		state.visible = true;
		state.localData=queryParams;
		loadGroupMarket(state.localData.groupid,state.localData.marketplaceid);
		setTimeout(function(){
			handleQuery();
		},500);
	}
	defineExpose({
		show,
	})
</script>

<style>
	.have-ass-text-radio .el-radio{
		height:inherit!important;
		line-height:24px;
		white-space: inherit;
	}
	.have-ass-text-radio p{
		font-size:12px;
		color:#acb0b9;
	}
</style>