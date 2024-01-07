<template>
	<el-dialog title="发货统计"
	           v-model="dialog.visible"
	           :append-to-body="true" 
			   class="afterpdailog"
			   top="3vh"
			   width="80%">
			   <el-row :gutter="12">
			       <el-col :span="4">
			         <el-card :shadow="shadow.ship" @click="handleCardChange('ship')">
						 <template #header>
						       <div class="card-header">
						         <span>已发货数量</span>
						       </div>
						     </template>
					   <el-timeline>
					      <el-timeline-item
					        v-for="(activity, index) in shipData"
					        :key="index"
					        :timestamp="activity.m" >
					        {{ activity.qty }}
					      </el-timeline-item>
					    </el-timeline>
					   
				     </el-card>
			       </el-col>
			       <el-col :span="4">
			         <el-card :shadow="shadow.plan" @click="handleCardChange('plan')"> 
					 <template #header>
					       <div class="card-header">
					         <span>预估将发货数量</span>
					       </div>
					     </template>
					  <el-timeline>
					  	<el-timeline-item
					  	    v-for="(activity, index) in planData"
					  	    :key="index"
					  	    :timestamp="activity.m" >
					  	    {{ activity.qty }}
					  	  </el-timeline-item>
					  	</el-timeline>
					  </el-card>
			       </el-col>
			       <el-col :span="16">
			         <el-card shadow="never" class="afterplancard"> 
					      <template #header>
					        <div class="card-header">
								<el-space>
								  <div>列表</div>
								  <el-input size="small" v-model="queryParams.search" @change="handleQuery" clearable placeholder="搜索SKU或名称"></el-input>
							   </el-space>
					        </div>
					      </template>
						  <GlobalTable ref="globalTableRef"
						  		 :tableData="tableData"  
						  		 @loadTable="loadTableData" 
								 :inDialog="true"
								 height="calc(100vh - 360px)"
						  		 >
						  		<template #field>
						  		<el-table-column label="SKU" prop="sku" width="360" sortable='custom' show-overflow-tooltip>
									 <template #default="scope">
										 <el-space>
											 <img v-if="scope.row.image" :src="scope.row.image"   class="pointer" style="width:40px; height:40px"  />
											 <img v-else :src="require('@/assets/image/empty/noimage40.png')"  style="width:40px; height:40px"/>
						  		             <div>
												 <div>{{scope.row.sku}}</div>
												 <div>{{scope.row.name}}</div>
											 </div>
									   </el-space>
									</template>
								</el-table-column>
								<el-table-column label="店铺" prop="marketname" sortable='custom' width="90" show-overflow-tooltip>
									 <template #default="scope">
												 <div>{{scope.row.groupname}}</div>
												 <div>{{scope.row.marketname}}</div>
									</template>
								</el-table-column>
								<el-table-column :prop="item" :label="item" sortable='custom'  v-for="item in state.fieldList">
									
								</el-table-column>
						      </template>
						  </GlobalTable>
					  </el-card>
			       </el-col>
			     </el-row>
			 <template #footer>
				<el-button @click="dialog.visible=false" type="primary" >关闭</el-button>
			</template>	
		</el-dialog>
</template>

<script setup>
	import{ref,reactive,toRefs,onMounted} from"vue"
	import planafterApi from '@/api/amazon/inbound/planafterApi.js';
	const state=reactive({
			  dialog:{visible:false},
			  queryParams:{},
			  shipData:[],
			  planData:[],
			  fieldList:[],
			  shadow:{ship:"never",plan:"always"},
			  tableData:{records:[],total:0}
	    });
		const {
		  queryParams,dialog,shipData,planData,tableData,fieldList,shadow
		} = toRefs(state);
		const globalTableRef=ref();
		function loadTableData(param){
			if(param.ftype=="plan"){
				 state.fieldList=[];
				 state.planData.forEach(item=>{
					 state.fieldList.push(item.m);
				 })
			}else{
				state.fieldList=[];
				state.shipData.forEach(item=>{
				    state.fieldList.push(item.m);
				})
			}
			param.fieldlist=state.fieldList;
			planafterApi.list(param).then(res=>{
				state.tableData.records=res.data.records;
				state.tableData.total=res.data.total;
			});
		}
		function handleCardChange(type){
			state.queryParams.ftype=type;
			if(type=="ship"){
				state.shadow.ship="always";
				state.shadow.plan="never";
			}else{
				state.shadow.ship="never";
				state.shadow.plan="always";
			}
			state.queryParams.sort="";
			handleQuery();
		}
		function handleQuery(){
			
			globalTableRef.value.loadTable(state.queryParams);
		}
		function show(groupid){
			state.dialog.visible=true;
			state.shipData=[];
			state.planData=[];
			state.queryParams={'groupid':groupid};
			planafterApi.summary(state.queryParams).then(res=>{
				if(res.data){
					state.fieldList=[];
					res.data.forEach(item=>{
						if(item.ftype=="needship"){
							state.planData.push(item);
						}else{
							state.shipData.push(item);
						}
					});
					state.queryParams.ftype="plan";
					if(globalTableRef.value&&globalTableRef.value.loadTable){
					   globalTableRef.value.loadTable(state.queryParams);
					}else{
						var timer=setTimeout(function(){
							globalTableRef.value.loadTable(state.queryParams);
							clearTimeout(timer);
						},1000);
					}
				}
			});
		}
		defineExpose({show});
</script>

<style>
	.afterplancard .el-card__body{
		padding-top:0px;
		padding-left:0px;
		padding-right:0px;
	}
	.afterpdailog .el-dialog__body{
		padding-top:0px;
	}
</style>