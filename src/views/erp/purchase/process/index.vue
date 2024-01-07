<template>
	<div class="main-sty">
		<div class="con-header">
	    	<Header ref="headerRef" @change="handleQuery" @delete="handleDelete" />
		</div>
		<div class="con-body">
			<GlobalTable  height="calc(100vh - 300px)" 
					     :queryParams="queryParams"
					     @loadTable="loadtableData" 
						 :defaultSort="{ prop: 'opttime', order: 'descending' }"  
					     @selectionChange="handleSelectionChange" >
				<template #field>
					<el-table-column type="selection" width="40"/>
				<el-table-column label="加工单编码" prop="number" width="140">
					<template #default="scope">
						<div>{{scope.row.number}}</div>
						<div v-if="!queryParams.auditstatus">
							<el-tag type="primary"  v-if="scope.row.auditstatus=='2' || scope.row.auditstatus=='1'"
							effect="plain"> 处理中</el-tag>
							<el-tag type="success"  v-if="scope.row.auditstatus=='3'"
							effect="plain"> 已完成</el-tag>
							<el-tag type="danger"  v-if="scope.row.auditstatus=='4'"
							effect="plain"> 已终止</el-tag>
							<el-tag type="info"  v-if="scope.row.auditstatus=='5'"
							effect="plain"> 已作废</el-tag>
						</div>
					</template>
				  </el-table-column>
					
				 <el-table-column  prop="image" label="图片" width="65" >
					<template #default="scope">
					<el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
					<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
				   </template>
				 </el-table-column>
				 <el-table-column label="名称/SKU"  show-overflow-tooltip>
					<template #default="scope">
					   <div class='name'>{{scope.row.name}}</div>
					   <div class='sku'>{{scope.row.sku}}</div>
				   </template>
				 </el-table-column>
				<el-table-column label="操作仓库" prop="wname"/>
				<el-table-column label="单据类型" width="90">
					<template #default="scope">
						<el-tag :type="success" v-if="scope.row.ftype=='ass'" effect="plain">
						组装单</el-tag>
						<el-tag :type="primary" v-else effect="plain">
						拆分单</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="加工数量" prop="amount" width="100" sortable="custom">
					<template #default="scope">
					 <div>{{scope.row.amount}}</div>
					</template>
					</el-table-column>
			
				<el-table-column  label="采购需求量" 
								  v-if="queryParams.auditstatus=='2'&&queryParams.operate=='false'"
								  prop="needin" 
								  width="110" 
								  sortable="custom">
					<template #default="scope">
						<div>
						<span v-if="scope.row.needin">{{scope.row.needin}}</span>
						<span v-else>0</span>
						</div>
						 <el-tag type="danger"  size="small" v-if="scope.row.needin>0">需要采购</el-tag>
					</template>
				</el-table-column>
				<el-table-column v-else label="可处理数量" prop="hasqty" width="110" sortable="custom">
					<template #default="scope">
						<div>
						<span v-if="scope.row.hasqty">{{scope.row.hasqty}}</span>
						<span v-else>0</span>
						</div>
						 <el-tag type="danger"  size="small" v-if="scope.row.needin>0">需要采购</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建人" prop="creator" width="90" sortable="custom"/>
				<el-table-column label="操作时间" prop="opttime"  width="100" sortable="custom">
					<template #default="scope">
						<span>{{dateFormat(scope.row.opttime)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联货件" prop="shipment">
				<template #default="scope">
					<span>{{scope.row.shipmentids}}</span>
					<div v-if="scope.row.shipmentids">
						<el-tag type="danger" size="small" effect="dark">优先组装</el-tag>
					</div>
				</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark"/>
				<el-table-column  fixed="right"  label="操作" width="120">
					<template #default='scope'>
					<el-space>
						<el-button @click="handleDownload(scope.row)" type="primary" link>下载</el-button>
						<el-button @click="handleDetail(scope.row)" type="primary" link>详情</el-button>
					  </el-space>	
					</template>
				</el-table-column>
				</template>
			</GlobalTable>
		</div>
	</div>
</template>

<script setup>
	import Header from"./components/header.vue"
	import {ref,reactive,toRefs,onMounted}from"vue"
	import {MoreOne,} from '@icon-park/vue-next';
	import {Histogram} from '@element-plus/icons-vue'
	import { ElMessage, ElMessageBox, ElDivider } from 'element-plus'
	import {useRouter } from 'vue-router'
	import {listForm,downloadInfoWord,deleteFrom } from '@/api/erp/assembly/assemblyApi.js'
	import {dateFormat,CheckInputInt} from "@/utils/index.js";
	const router = useRouter()
	const headerRef= ref()
	const state = reactive({
		queryParams:{},
		isShow:false,
		selectRows:[],
	})
	const {
		queryParams,
		isShow,
		selectRows
	}=toRefs(state)
	
	function loadtableData(params,callback){
		listForm(params).then(res=>{
			if(res.data.records){
				res.data.records.forEach(row=>{
					if(row.hasqty){
						row.hasqty=parseInt(row.hasqty);
					}
				})
			}
			callback(res.data);
		})
	}
	function handleQuery(params){
		console.log(params);
		if(params){
			state.queryParams.warehouseid=params.warehouseid;
			state.queryParams.auditstatus=params.auditstatus;
			state.queryParams.search=params.search;
			state.queryParams.searchtype=params.searchtype;
			state.queryParams.ftype=params.ftype;
			//state.queryParams.operate=params.operate;
			if(params.auditstatus=="1" || params.auditstatus=="2"){
				state.queryParams.operate=params.operate;
			}else{
				state.queryParams.operate=undefined;
			}
			if(params.auditstatus=="1"||params.auditstatus=="2"){
					state.queryParams.fromDate=undefined;
					state.queryParams.toDate=undefined;
				}else{
					state.queryParams.fromDate=params.fromDate;
					state.queryParams.toDate=params.toDate;
				}
			
		}
		state.queryParams.searchSession=new Date();
	}
	function handleDownload(row){
		downloadInfoWord({formid:row.id});
	}
	function handleDetail(row){
		router.push({
			path:"/e/p/p/d",
			query:{
				title:'加工单详情',
				path:"/e/p/p/d",
				id:row.id
			},
		})
	}
	function getState(val){
		if(val=='可处理'){
			state.isShow = true
		}else{
			state.isShow = false
		}
	}
	function tabState(val){
		if(val=='2'){
			state.isShow = true
		}else if(val=='1'){
			if(headerRef.value.state.radio=='可处理'){
				state.isShow = true
			}else{
				state.isShow = false
			}
		}else{
			state.isShow = false
		}
	}
	function handleSelectionChange(rows){
		state.selectRows=rows;
	}
	function handleDelete(){
		if(state.selectRows && state.selectRows.length>0){
			ElMessageBox.confirm('确认作废单据吗?', '警告', {
			 				confirmButtonText: '确定',
			 				cancelButtonText: '取消',
			 				type: 'warning',
			 })
			.then(() => {
			   var ids="";
			   state.selectRows.forEach(function(item){
			   	ids+=(item.id+",");
			   });
			   deleteFrom({"ids":ids}).then((res)=>{
			   	if(res.data.type=="info"){
			   		ElMessage({
			   		  type: 'success',
			   		  message: res.data.msg,
			   		})
					handleQuery();
					headerRef.value.show();
			   	} 
			   });
			})
			.catch(() => ElMessage.info('已取消操作'));
			
		}
	}
	onMounted(() => {
 
	});
</script>

<style>
</style>
