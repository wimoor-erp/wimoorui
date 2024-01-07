<template>
	<div class="sys-headr-top">
		<el-space :size="8" class="font-base">
			<span>采购计划：</span>
			 <PlanSelect  @change="handlePlanChange" ></PlanSelect>
		</el-space>
			
		<el-button @click="clearPlan">清空计划</el-button>
	</div>
	<div class=" con-header" style="padding:16px 16px 0px 16px;">
		<el-row class="no-flex-warp">
				<el-space>
				   <GroupSelect @change="handleGroupChange" defaultValue="all"></GroupSelect>
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
				 			   <el-radio-group size="small" v-model="queryParams.issfg">
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
							 <el-row :gutter="8">
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
						 <el-form-item label="是否低价">
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
						 <el-form-item label="销售预估">
						   <el-radio-group v-model="queryParams.different">
						       <el-radio label="">不限</el-radio>	 
						       <el-radio label="avgsales">系统预估大于手动干预</el-radio>
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
				<el-button type="primary" class="im-but-one" @click="submitPlan">
				  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
				  <span>采购</span>
				</el-button>
				<el-button @click="gotoSalePre" > 销售计划</el-button>
				<el-button @click="openUpload" > 导入SKU入库仓库</el-button>
				<div class='rt-btn-group'>
					<div class="flex-center font-small m-r-16">
						<el-button v-if="queryParams.selected==true" @click.stop="downloadCheckList" :loading="downloading" size="small" style="margin-right:10px;">导出已选</el-button>
						<el-checkbox style="margin-right:0px;" v-model="queryParams.selected" label="显示已选"  @change="handleQuery"/>
	                  	<el-divider direction="vertical" />
						<el-checkbox v-model="queryParams.expendall" label="默认展开"  @change="handleExpendAll"/>
						<el-divider direction="vertical" />
						<el-checkbox  v-if="queryParams.marketplaceids&&queryParams.marketplaceids.length>0" v-model="queryParams.plansimple" label="简约计划"  @change="handleQuery"/>
					     <el-divider v-if="queryParams.marketplaceids&&queryParams.marketplaceids.length>0" direction="vertical" />
					  <el-affix :offset="80" ref="affixRef" class="affix">
					  <span class="affix-s">	
						<span @click="handleCheckShow">已选 <span class="text-orange font-bold"> {{summary.skunum}} </span> 个SKU</span>
						<el-divider direction="vertical" />
						<span>采购总数 <span class="text-orange font-bold"> 
						<span v-if="summary.amount">{{summary.amount}}</span>
						<span v-else>0</span>
						</span></span>
						</span>
						</el-affix>
					</div>
					<el-space v-if="queryParams.marketplaceids&&queryParams.marketplaceids.length>0" >
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
	<UploadDialog ref="uploadDialogRef" @upload="handleUpload"></UploadDialog>
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,SortOne} from '@icon-park/vue-next';
	import { ref ,reactive,onMounted,toRefs,inject} from 'vue'
	import PlanSelect from "./plan_select.vue"
	import GroupSelect from "@/components/header/group_select.vue"
	import Warehouse from "@/components/header/warehouse.vue"
	import Market from "@/components/header/market.vue"
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Owner from '@/components/header/owner.vue';
	import DeliveryDialog from "@/views/erp/ship/ship_plan/components/delivery_dialog";
	import Tags from '@/components/header/tags.vue';
	import Category from '@/components/header/category.vue';
	import Status from '@/views/amazon/listing/products/components/prostatus.vue';
	import {downExcelSales} from "@/api/amazon/listing/preSalesApi.js";
	import filtericon from "@/components/icon/filtericon.vue";
	import UploadDialog from '@/components/Upload/uploadDialog.vue';
	// API依赖
	import planApi from '@/api/erp/ship/planApi';
	import { useRouter } from 'vue-router'
	import {getSummary,clearItem,uploadPurchaseWarehouse} from '@/api/erp/purchase/plan/planApi';
	import editApi from '@/api/erp/purchase/form/editApi.js';
	let deliverRef = ref()
	let marketRef=ref();
	let affixRef=ref();
	let ownerRef=ref();
	let statusRef=ref();
	let tagsRef=ref();
	let uploadDialogRef=ref();
	const checkDataDialogRef=ref();
	 const emitter = inject("emitter");
	let router = useRouter()
	const state = reactive({
	  queryParams: {planid:'',
	                searchtype:'sku',selected:false,small:"",currentRank:"",status2:"shownormal",
					hasAddFee:"",issfg:"",currentSolt:"desc"} ,
	  loading:false,
	  summary:{skunum:0,amount:0},
	  progress:0,
	  downloading:false,
	});
	const {
	  queryParams,loading,progress, summary,downloading,
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
					    '此操作不可逆，将不区分店铺清空所有已经加入的计划，您确定要清空采购计划吗?',
					    '清空计划',
					    {
					      confirmButtonText: '确定',
					      cancelButtonText: '取消',
					      type: 'warning',
					    }
					  )
					    .then(() => {
							if(state.queryParams.planid){
								clearItem({"planid":state.queryParams.planid}).then(res=>{
													 ElMessage({
													   type: 'success',
													   message: '清除成功！',
													 });
													 handleQuerySummary();
													 emits("change",state.queryParams);
								});
							}
					    }).catch(() => {
					      ElMessage({
					        type: 'info',
					        message: '取消清除！',
					      })
					    })
				}
				
			let  emits = defineEmits(['change'])	
			function handleCheckShow(){
				state.queryParams.selected=true;
				//state.queryParams.ischeck="all";
				handleQuery();
			}
			function handleQuery(type){
						 if(state.queryParams.planid){
						 	emits("change",state.queryParams);
							//state.queryParams.ischeck="";
						 }
				}
			function handleQuerySummary(){
				  if(state.queryParams.planid){
				  	 getSummary({'planid':state.queryParams.planid}).then(res=>{
				  			     state.summary=res.data;
				           	   });
				  }
			}
	var timer=null;
	onMounted(()=>{
		emitter.on("openTab", (value) => { // 监听事件
		  if(value=="/erp/purchase/plan"){
			  var t=setTimeout(()=>{
						   affixRef.value.updateRoot();
							clearTimeout(t);
			  },500);
			  if(timer==null){
				  timer=setInterval(function(){
				  	handleQuerySummary();
				  },60000);
			  }
		  }else if(timer){
		  	clearInterval(timer);
			timer=null;
		  }
		});
		timer=setInterval(function(){
			handleQuerySummary();
		},60000);
	});
			 defineExpose({ handleQuerySummary });
			function handlePlanChange(value,plan){
				state.queryParams.planid=value;
				state.queryParams.plan=plan;
				marketRef.value.show(null,true);
				handleQuery();
				handleQuerySummary();
			}
			
			function handleMarketChange(val){
				state.queryParams.marketplaceids=val;
				handleQuery();
			}
			function openUpload(){
				uploadDialogRef.value.show({'template':"PurchasePlanMaterialWarhouse",'title':"当前计划本地SKU入库仓库关系导入"});
			}
			function handleUpload(formDatas){
				formDatas.append("planid",state.queryParams.planid)
				uploadPurchaseWarehouse(formDatas).then(res=>{
						ElMessage({
							  message: "上传成功！",
							  type: 'success'
						});
					handleQuery();
					uploadDialogRef.value.hide();
				});
			}
			function handleExpendAll(value){
				      state.queryParams.expendall=value;
					  emits("expend",value);
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
			function handleWarehouseChange(value){
				state.queryParams.warehouseid=value;
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
				state.queryParams.searchtype="sku";
				state.queryParams.selected=false;
				state.queryParams.categoryid="";
				state.queryParams.shortdays=false;
				state.queryParams.status2="shownormal";
				state.queryParams.owner="";
				state.queryParams.search="";
				state.queryParams.name="";
				state.queryParams.remark="";
				state.queryParams.tags=[];
				state.queryParams.marketplaceids=[];
				state.queryParams.status='';
				state.queryParams.hasAddFee="";
				state.queryParams.issfg="";
				state.queryParams.different="";
				state.queryParams.currentSolt="desc";
				state.queryParams.currentRank="";
				state.queryParams.skuarray="";
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
			function handleGroupChange(value,isInit){
				state.queryParams.groupid=value;
				handleQuery();
				handleQuerySummary();
			}
			function soltChange(value){
				state.queryParams.currentSolt=value;
				handleQuery("opt");
			}
			function showFbaDeliveryDialog(){deliverRef.value.show()}
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
		
			/* 发货提交 */
			function submitPlan(){
			  if(state.queryParams.planid){
						emits("confirm",state.queryParams,state.summary);
				}else{
					ElMessage({
					  type: 'error',
					  message: '请选择对应计划！',
					})	
				}
			
			}
			function downloadCheckList(){
				state.downloading=true;
				editApi.downloadItemList({"planid":state.queryParams.planid},()=>{
					state.downloading=false;
				});
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
	.affix .el-affix--fixed{
		background-color:rgba(0,0,0,0.8);
		border-radius: 4px;
		padding:4px 0px;
		height:24px!important;
		white-space: nowrap;
		color:#fff;
	}
	.affix-s{
		margin-right:8px;
		margin-left:8px;
	}
</style>
