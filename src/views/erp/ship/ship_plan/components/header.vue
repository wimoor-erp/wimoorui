<template>
	<div class="sys-headr-top">
		<el-space :size="16" class="font-base">
			<div>
			<span >发货店铺：</span>
			<GroupSelect @change="handleGroupChange" defaultValue="only"></GroupSelect>
			</div>
			<div class="flex-center">
			<span>发货仓库：</span>
			 <Warehouse  @change="handleWarehouseChange" :isform="true" defaultValue="only"></Warehouse>
			</div>
		</el-space>
		<el-button @click="clearPlan">清空计划</el-button>
	</div>
	<div class="main-sty con-header" style="padding-bottom: 0px;">
		<el-row class="no-flex-warp">
				<el-space>
				   <Market ref="marketRef" @change="handleMarketChange" :multiple="true"></Market>
				   <Owner  ref="ownerRef" @owner="getOwner" />
				   <Status ref="statusRef" @status="getStatus" />
				   <Tags   ref="tagsRef" @change="getTags"/>
				<el-input  v-model="queryParams.search" clearable @input="handleQuery"  @clear="handleQuery" placeholder="请输入" class="input-with-select" >
				   <template #prepend>
				     <el-select v-model="queryParams.searchtype" placeholder="SKU" style="width: 110px">
				       <el-option label="SKU" value="sku"></el-option>
					   <el-option label="同级SKU" value="samesku"></el-option>
					   <el-option label="同级ASIN"  value="sameasin"></el-option>
				     </el-select>
				   </template>
				   <template #append>
				     <el-button >
				        <el-icon style="font-size: 16px;align-itmes:center">
				         <search @click="handleQuery" />
				      </el-icon>
				     </el-button>
				   </template>
				 </el-input>
				 <el-popover    v-model:visible="moreSearchVisible" :width="400" trigger="click">
				 	<template #reference>
				 	<el-button  title='高级筛选'  class='ic-btn'>
				 	<filtericon></filtericon>
				 	</el-button>
				 	</template>
				 	 <el-form   label-width="80px">
				 		 <el-form-item label="类型">
				 			   <el-radio-group v-model="queryParams.issfg">
				 			      <el-radio-button label="" >全部产品</el-radio-button>
				 			      <el-radio-button label="0" >普通产品</el-radio-button>
				 				  <el-radio-button label="1" >组合产品</el-radio-button>
				 			    </el-radio-group>
				 			 </el-form-item>	
				 		<el-form-item label="产品品类">
				 		 <Category @change="getCategory"></Category>
				 		</el-form-item>
				 		<el-form-item label="平台SKU">
				 		  <el-input
				 		      v-model="queryParams.skuarray"
				 		      :rows="2"
				 		      type="textarea"
				 		      placeholder="逗号分隔批量搜索..."
				 		    />
				 		 </el-form-item>
						 <el-form-item label="产品名称">
						   <el-input
						       v-model="queryParams.name"
						       placeholder="搜索名称"
						     />
						  </el-form-item>
						  <el-form-item label="备注">
						 							  <el-input
						 							      v-model="queryParams.remark"
						 							      :rows="2"
						 							      type="textarea"
						 							      placeholder="搜索备注..."
						 							    />
						   </el-form-item>
						 <el-form-item label="断货预警">
							 <el-row gutter="8">
								 <el-col :span="12">
								 	<el-select v-model="queryParams.shortdays" :teleported="false">
										  <el-option label="不限" value=""></el-option>
										   <el-option label="15天" value="15"></el-option>
										   <el-option label="30天" value="30"></el-option>
										   <el-option label="60天" value="60"></el-option>
									</el-select>
								 </el-col>
							 </el-row>
						 </el-form-item>
						 <el-form-item label="是否轻小">
						   <el-radio-group v-model="queryParams.small">
						       <el-radio label="">不限</el-radio>
						       <el-radio label="true">是</el-radio>
						       <el-radio label="false">否</el-radio>
						     </el-radio-group>
						 </el-form-item>
						 <el-form-item label="附加费用">
						   <el-radio-group v-model="queryParams.hasAddFee">
						       <el-radio label="">不限</el-radio>
						       <el-radio label="true">有</el-radio>
						       <el-radio label="false">无</el-radio>
						     </el-radio-group>
						 </el-form-item>
						 <el-form-item label="产品状态">
						   <el-radio-group v-model="queryParams.status2">
						       <el-radio label="">不限</el-radio>	 
						       <el-radio label="shownormal">未隐藏</el-radio>
						       <el-radio label="showhid">隐藏</el-radio>
						     </el-radio-group>
						 </el-form-item>
						 
				 		 <el-form-item >
				 			 <el-button type="primary" @click="handleQuery();moreSearchVisible=false">搜索</el-button>
				 			 <el-button @click="resetForm(formRef)">取消</el-button>	
				 		</el-form-item>
				 		 </el-form>
				 	  </el-popover>
					  <el-button @click="resetQuery">重置</el-button>
				</el-space>
		</el-row>
		<el-row>
			<el-space >
				<el-button type="primary" class="im-but-one" @click="submitShip">
				  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
				  <span>发货</span>
				</el-button>
				<el-button @click="showFbaDeliveryDialog">FBA发货配置</el-button>
				<el-button @click="ShowShipMarketRank">FBA站点配货优先级</el-button>
				<el-button @click="gotoSalePre" > 销售计划</el-button>
				</el-space >
					
				<div class='rt-btn-group'>
					<div class="flex-center font-small m-r-16">
						<el-checkbox v-model="queryParams.selected" label="显示已选"  @change="handleQuery"/>
						<el-divider direction="vertical" />
						<span>已选 <span class="text-orange font-bold"> {{summary.skunum}} </span>个SKU</span>
						<el-divider direction="vertical" />
						<span>发货总数 <span class="text-orange font-bold"> {{summary.amount}}</span></span>
					</div>
					<el-space v-if="queryParams.marketplaceids&&queryParams.marketplaceids.length>0" >
					<el-checkbox v-model="queryParams.plansimple" label="简约计划"  @change="handleQuery"/>
					<el-dropdown :hide-on-click="false" @command="handleCommand"  trigger="click">
					    <el-button class='ic-btn'  title='排序'>
					       <sort-one theme="outline" size="16"  :strokeWidth="3"/>
					    </el-button>
					    <template #dropdown>
					      <el-dropdown-menu >
							<el-dropdown-item disabled>排序依据</el-dropdown-item>
					        <el-dropdown-item v-for="(item,index) in rankData"  @click="rankChange(item.value)"
							 :class="{r_active:queryParams.currentRank==item.value}" 
							>{{item.name}}</el-dropdown-item>
					        <el-dropdown-item divided  disabled>排序循序</el-dropdown-item>
					        <el-dropdown-item v-for="item in soltData" @click="soltChange(item.value)" 
							:class="{r_active:queryParams.currentSolt==item.value}">{{item.name}}</el-dropdown-item>
					      </el-dropdown-menu>
					    </template>
					  </el-dropdown>
					  <el-button class='ic-btn m-l-0' title='帮助文档' >
					  	<help theme="outline" size="16" :strokeWidth="3" />
					  </el-button>
					</el-space>
				</div>	
		</el-row>
	</div>
	<DeliveryDialog ref="deliverRef" />
	<ShipmarketRank ref ="shipmarketRankRef"/>
	<CheckDataDialog ref ="checkDataDialogRef" @change="goToPlanConfirm"/>
	
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,SortOne} from '@icon-park/vue-next';
	import { ref ,defineEmits,reactive,onMounted,toRefs} from 'vue'
	import GroupSelect from "@/components/header/group_select.vue"
	import Warehouse from "@/components/header/warehouse.vue"
	import Market from "@/components/header/market.vue"
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Owner from '@/components/header/owner.vue';
	import Tags from '@/components/header/tags.vue';
	import Category from '@/components/header/category.vue';
	import DeliveryDialog from "./delivery_dialog";
	import ShipmarketRank from "./shipmarket_rank";
	import Status from '@/views/amazon/listing/products/components/prostatus.vue';
	import CheckDataDialog from "./check_data_dialog";
	import {downExcelSales} from "@/api/amazon/listing/preSalesApi.js";
	import filtericon from "@/components/icon/filtericon.vue"
	// API依赖
	import planApi from '@/api/erp/ship/planApi';
	import { useRouter } from 'vue-router'
	let deliverRef = ref()
	let marketRef=ref();
	let ownerRef=ref();
	let statusRef=ref();
	let tagsRef=ref();
	let shipmarketRankRef = ref()
	const checkDataDialogRef=ref();
	let router = useRouter()
	const state = reactive({
	  queryParams: {groupid:'',warehouseid:'',shortdays:'',isOversea:false,
	                searchtype:'sku',selected:false,small:"",currentRank:"",status2:"shownormal",
					hasAddFee:"",issfg:"",currentSolt:"desc"} ,
	  loading:false,
	  summary:{skunum:0,amount:0},
	  progress:0,
	});
	const {
	  queryParams,loading,progress, summary,
	} = toRefs(state);
	
			let FbaInventorysChecked = ref([])
			let moreSearchVisible =ref(false)
	        let localinventoryChecked=ref(1)
  
		let rankData =reactive([
			{name:'可售库存',value:'afn_fulfillable_quantity'},
			{name:'预估日均销量',value:'avgsales'},
			{name:'7日销量',value:'sales_seven'},
			{name:'30日销量',value:'sales_month'},
			{name:'实际发货量',value:'marketamount'},
			{name:'建议发货量',value:'marketneedship'},
			{name:'可售天数',value:"marketsalesday"},
			{name:'发货后可售天数',value:"marketaftersalesday"},
		])
		let soltData = reactive([
			{name:'从高到低',value:"desc"},
			{name:'从低到高',value:'asc'},
		]) 
		let form = reactive({
					type:'全部产品',
					small:3,
					extraprice:3,
		})
	   function clearPlan(){
					ElMessageBox.confirm(
					    '您确定要清空发货计划吗?',
					    '清空计划',
					    {
					      confirmButtonText: '确定',
					      cancelButtonText: '取消',
					      type: 'warning',
					    }
					  )
					    .then(() => {
							if(state.queryParams.warehouseid&&state.queryParams.groupid){
								planApi.clear({groupid:state.queryParams.groupid,
											   warehouseid:state.queryParams.warehouseid}
											  ).then(res=>{
													 ElMessage({
													   type: 'success',
													   message: '清除成功！',
													 });
													 handleQuerySummary();
													 emits("change",state.queryParams);
								});
							}
					     
					    })
					    .catch(() => {
					      ElMessage({
					        type: 'info',
					        message: '取消清除！',
					      })
					    })
				}
				
			let  emits = defineEmits(['change'])	
			function handleQuery(type){
				     if(type&&type=="opt"){
						 if(state.queryParams.warehouseid&&state.queryParams.groupid){
						 	emits("change",state.queryParams);
						 }
					 }else{
						 state.queryParams.currentRank="";
						 if(state.queryParams.warehouseid&&state.queryParams.groupid){
						 	emits("change",state.queryParams);
						 }
					 }
					
				}
			function handleQuerySummary(){
				  if(state.queryParams.warehouseid&&state.queryParams.groupid){
				  	planApi.getSummary({groupid:state.queryParams.groupid,
					                    warehouseid:state.queryParams.warehouseid}
									   ).then(res=>{
				  						   state.summary=res.data;
				  	});
				  }
				   
			}
			 defineExpose({ handleQuerySummary });
			function handleGroupChange(value,isInit){
				state.queryParams.groupid=value;
				state.queryParams.marketplaceid="";
				marketRef.value.show(value,true);
				handleQuery();
				handleQuerySummary();
			}
			function handleMarketChange(val){
				state.queryParams.marketplaceids=val;
				if(state.queryParams.marketplaceids.length==0){
					state.queryParams.plansimple=false;
				}
				handleQuery();
			}
			function getStatus(id){
				state.queryParams.status=id;
				handleQuery();
			}
			function getOwner(id){
				state.queryParams.owner=id;
				handleQuery();
			}
			function getTags(tags){
				state.queryParams.tags=tags;
				handleQuery();
			}
			function getCategory(value){
				state.queryParams.categoryid=value;
			}
			function handleWarehouseChange(value,ftype,warehouse){
				state.queryParams.warehouseid=value;
				if(warehouse.country){
				   state.queryParams.isOversea=true;	
				}else{
					state.queryParams.isOversea=false;
				}
				handleQuery();
				handleQuerySummary();
			}
			function resetQuery(){
				marketRef.value.reset();
				ownerRef.value.reset();
				statusRef.value.reset();
				tagsRef.value.reset();
				var groupid=state.queryParams.groupid;
				var warehouseid=state.queryParams.warehouseid;
				state.queryParams={'groupid':groupid,'warehouseid':warehouseid,shortdays:'',
				                   searchtype:'sku',selected:false,categoryid:"",isOversea:false,
								   status2:"shownormal",
								   owner:'',search:"",name:"",remark:"",
								   tags:[],marketplaceid:'',status:'',
								   hasAddFee:"",issfg:"",
								   currentSolt:"desc",
								   currentRank:"",skuarray:""} ;
				handleQuery();
			}
			function resetForm(){
				moreSearchVisible.value =false
			}	
			function rankChange(value){
				state.queryParams.currentRank=value;
				state.queryParams.sort=value;
				state.queryParams.order=state.queryParams.currentSolt;
				handleQuery("opt");
			}
			function soltChange(value){
				state.queryParams.currentSolt=value;
				handleQuery("opt");
			}
			function showFbaDeliveryDialog(){deliverRef.value.show()}
			function ShowShipMarketRank(){ shipmarketRankRef.value.show(state.queryParams.groupid) }
			function handleCalu(){
				    state.loading=true;
				    state.progress=0;
					planApi.calPlanModel(state.queryParams).then(res=>{
						state.progress=100;
						state.loading=false;
						ElMessage({
						  type: 'success',
						  message: '计算成功！',
						})
						handleQuery();
					})
			}
			function gotoSalePre(){
				router.push({
					path:"/amazon/sales/forecast",
					query:{
						title:'销售计划',
						path:"/amazon/sales/forecast",
					}
				})
			}
			function goToPlanConfirm(){
				router.push({
					path:"/e/s/p",
					query:{
						title:'提交发货',
						path:"/e/s/p",
						warehouseid:state.queryParams.warehouseid,
						groupid:state.queryParams.groupid
					}
				})
			}
			/* 发货提交 */
			function submitShip(){
			  if(state.queryParams.groupid&&state.queryParams.warehouseid){
					var params={};
					params.groupid=state.queryParams.groupid;
					params.warehouseid=state.queryParams.warehouseid;
					params.ischeck="true";
					params.pagesize=1000;
					params.currentpage=1;
					params.plantype="ship";
					planApi.getPlanList(params).then(res=>{
							   if(res.data&&res.data.records&&res.data.records.length>0){
								  checkDataDialogRef.value.show(state.queryParams.warehouseid,res.data.records);
							   }else{
								   goToPlanConfirm();
							   }
					}); 
				}else{
					ElMessage({
					  type: 'error',
					  message: '请选择对应得店铺和仓库！',
					})	
				}
			
			}
</script>

<style>
	.sys-headr-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:16px 24px;
		border-bottom:1px solid var(--el-border-color-base);
		background-color:var(--el-bg-color);
	}
	.no-flex-warp{
		flex-wrap:inherit;
	}
	.m-r-16{
		margin-right:16px;
	}
	.m-l-0{
		margin-right:-8px;
	}
	.affix-box1{
		text-align: center;
		width:50px;
		position:fixed;
		z-index: 999;
		right:24px;
		bottom:120px;
		padding: 8px;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: var(--el-box-shadow-light);
	}
	.p-2{
		bottom:40px;
	}
	.m-b-4{
		margin-bottom:4px;
	}
</style>
