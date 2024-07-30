<template>
	<div class="box-margin">
		<div class="pag-radius-bor mar-bot" >
			<div class=" tow-box" > 
			  <Header ref="headerRef" ></Header>
			  <div class="light-font font14">以下装箱组中的SKU会一同配送，打包时请为包装箱号，便于识别，装箱组中可包含多个包装箱。<el-button :icon="Refresh" size="small">重新分组</el-button></div>
			  <div  v-loading="optionloading"  element-loading-text="加载装箱方案..." style="min-height:320px;">
				  	<div  v-if="!options||options.length==0" class="font-extraSmall text-center" style="padding-top:150px;">无法加载到装箱方案</div>
			  <div  v-else v-for="optitem in options">
				 			  <el-card  v-for="(groupInfo,index) in optitem.listPackingGroups" style="margin-top: 15px;" shadow="false">
				 					  <template #header>
				 						<div>
											<div style="padding-bottom:10px">
				 						  <span style="font-weight:600;font-size:12">装箱组{{index+1}}</span>
				 						  <span class="pull-right"><el-link type="primary" @click="showGroupInfo(groupInfo)">查看商品详情</el-link></span>
										  </div>
				 						  <div class="font-extraSmall">以下SKU可混装:3个SKU(共2000件商品)</div>
				 						</div>
				 					  </template>
				 					   <el-row>
				 						   <el-col :span="groupInfo.hasBox==false?20:24">
											   <el-space>
				 							   <div   v-for="item in  groupInfo.items" >
				 									 <img :src="item.skuinfo.image"  style="width:40px;height:40px" />
				 									 <p>x{{item.quantity}}</p>
				 							   </div>
											   </el-space>
				 						   </el-col>
				 						   <el-col v-if="groupInfo.hasBox==false" :span="4" style="border-left: 1px solid #dedede;padding: 10px;font-size: 14px;">
				 								<div >
				 									 <p class="mar-bot" style="font-weight: bolder;">确认包装箱数量</p>
				 									<div style="margin-bottom:20px;">
				 										需要<el-input-number  style="width: 120px;" :min="1" :max="10000" v-model="groupInfo.boxnum"  @change="handleChange" />个箱子包装 
				 									</div>
				 									<el-button class="pull-right" type="primary" @click.stop="openPackList(groupInfo)">打开Web表单</el-button>
				 								</div>
				 						   </el-col>
				 						</el-row>
										<template v-if="groupInfo.hasBox==true"   #footer>
														 						<div  class="card-header pointer"  @click.stop="openPackList(groupInfo)">
																					<el-icon style="font-size:20px;float:left;margin:2px;" class="text-green">
																						<file-code theme="filled" size="24" fill="#0B9E52"/>
																					</el-icon>
														 						    <div>装箱web表单（共{{groupInfo.boxnum}}箱）</div>
														 						</div>
										</template>
				 					</el-card>
							
						 <el-row style="padding-top:10px;">
							     <el-col :span="10">
							     <!-- <span class="font-extraSmall">原厂包装发货的SKU数量为0</span> -->
							 	 </el-col>
							      <el-col :span="10">
									  
								   </el-col>
										<el-col :span="4">
											 <el-button style="float:right"   :disabled="formsubmitdisable"  @click="toNext()"  >下一步</el-button>
											<el-button style="float:right;margin-right: 10px;" @click="submitBox('submit')" type="primary" :loading="btnloading">确认装箱信息</el-button>
										</el-col>						   
						</el-row>
				</div>
			
				<el-row style="padding-top:10px;">
				    <el-col :span="10">
				       <Operation ref="operationRef" :titles="['提交箱子信息','生成发货报告']"  @change="handleOperationChange"></Operation>
			     	</el-col>
				 </el-row>
			</div>
			</div>
		</div>
		<Footer  ref="footerRef"></Footer>
	</div>
	 
	 
	<BoxTable  ref="boxTableRef" @change="getBoxData"></BoxTable>
    <Table ref="tableRef" ></Table>
	
	
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs, nextTick } from 'vue';
	import { useRoute,useRouter } from 'vue-router';
	import {Location,Van,ShoppingCart,Printer,Document,Refresh,Management} from '@element-plus/icons-vue';
	import {Plus,FileCode} from '@icon-park/vue-next';
	import BoxTable from "./components/box_table.vue";
	import Table from "./components/table.vue";
	import Footer from "./components/footer.vue";
	import Header from "./components/header.vue";
	import Operation from "./components/operation.vue";
	import {pointKeyChnage} from '@/utils/jquery/key/point-key';
	import { ElMessage,ElMessageBox } from 'element-plus';
	import {dateFormat,formatFloat,getValue,formatPercent,CheckInputIntLGZero,CheckInputFloat} from '@/utils/index.js';
	import addressApi from '@/api/amazon/inbound/addressApi.js';
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import shipmentPlacementApi from '@/api/erp/shipv2/shipmentPlacementApi.js';
	import shipmentBoxApi from '@/api/erp/shipv2/shipmentBoxApi.js';
	let router = useRouter();
	const planid=router.currentRoute.value.query.id;
	const footerRef=ref();
	const boxTableRef=ref();
	const headerRef=ref();
	const globalTable=ref();
	const operationRef=ref();
	const tableRef=ref();
	let state =reactive({
		planData:{}, 
		tableData:{records:[],total:0},
		step:0,
		itemcount:0,
		formsubmitdisable:true,
		operatorInfo:null,
		optionloading:false,
		btnStatus:{
			"submitForm":false,
			"submitStep":false,
			"number":1,
		},
		options:[],
		boxDisable:false,
		btnloading:false,
	})
	let{planData,step,formsubmitdisable,itemcount,tableData,operatorInfo,btnStatus,options,boxDisable,optionloading,btnloading}=toRefs(state);
	
	function stepChange(val){
		state.step=val;
		//loading.value=true;
		//shipmentRef.value.getBaseInfo(shipmentid);
	}
	
	function showGroupInfo(groupInfo){
		tableRef.value.show(state.planData,groupInfo);
	}
	
	function loadData(){
		shipmentplanApi.getPlanInfo({"formid":planid}).then((res)=>{
			state.planData=res.data;
			state.itemcount=state.planData.itemlist.length;
			headerRef.value.show(state.planData,1);
			footerRef.value.show(state.planData);
			//获取箱子分组信息
			listPackingOptions();
		});
	}
	function toNext(){
		router.push({
			path:'/e/s/s/three',
			query:{
			  id:planid,
			  title:"发货处理_发货",
			  path:'/e/s/s/three',
			  replace:true
			}
		})		 
	}
	function handleDonePacking(){
		shipmentBoxApi.donePlanBox({"formid":planid,"ftype":"submit"}).then((res)=>{
			 generatePlacementOptions();
		}).catch(e=>{
			state.btnloading=false;
		});
	}
	function generatePackingOptions(){
		shipmentBoxApi.generatePackingOptions({"formid":planid}).then((res)=>{
			if(res.data && res.data.operationid){
				operationRef.value.show(res.data.operationid,1);
			}
		}).catch(()=>{
			state.btnloading=false;
		});
	}
	
	function listPackingOptions(nextToken){
		var param={"formid":planid};
		 param.pageSize=20;
		 if(nextToken){
			  param.paginationToken=nextToken; 
		 }else{
			 param.paginationToken=null;
		 }
		 state.optionloading=true;
		shipmentBoxApi.listPackingOptions(param).then((res)=>{
			if(res.data&&res.data.options&&res.data.options.length>0){
				state.options=res.data.options;
				getOptionsItem();
			}else if(state.planData.auditstatus==3){
				generatePackingOptions();
			}else {
				state.options=[];
				state.optionloading=false;
			}
		}).catch(e=>{
			state.optionloading=false;
		});
	
	}
	
	async function listPackingGroupItems(packingOptionId,packingGroupId,nextToken,optionitem){
		var param={};
		param.formid=planid;
		param.packingOptionId=packingOptionId;
		param.packingGroupId=packingGroupId;
		param.pageSize=100;
		if(nextToken){
			param.paginationToken=nextToken; 
		}else{
			param.paginationToken=null;
		}
		await shipmentBoxApi.listPackingGroupItems(param).then((res)=>{
			 var groupInfo=res.data;
			 groupInfo.packstyle=2;
			 groupInfo.packSetType=1;
			 groupInfo.hasBox=false;
			 var skuMap={};
			 state.planData.itemlist.forEach(item=>{
				 skuMap[item.sku]=item;
			 })
			 groupInfo.packingOptionId=param.packingOptionId;
			 groupInfo.packingGroupId=param.packingGroupId;
			  groupInfo.items.forEach(item=>{
				 item.skuinfo= skuMap[item.msku];
			 });
			 state.optionloading=false;
			 optionitem.listPackingGroups.push(groupInfo);
		});
		//如果箱子组已经提交了装箱 直接加载装箱信息 查询
				optionitem.listPackingGroups.forEach(item=>{
					selectPackgroupInfo(item);
				});
	}
	function checkAllSubmit(){
		var formsubmitdisable=false;
			state.options.forEach(vitem=>{
				vitem.listPackingGroups.forEach(mitem=>{
					 if(mitem.hasBox==false){
						 formsubmitdisable=true;
					 }
				});	
			})
		  state.formsubmitdisable=formsubmitdisable;
	}
		function selectPackgroupInfo(item){
			shipmentBoxApi.selectPackgroupInfo({"packingGroupId":item.packingGroupId}).then((ress)=>{
				if(ress.data.msg=="success"){
					//已经填写过装箱信息
					item.hasBox=true;
					item.boxnum=parseInt(ress.data.num);
				    checkAllSubmit()
					
				}else{
					item.hasBox=false;
				}
			});
		}
		
	function getLocalOptionsItem(){
		 var groupInfo={};
		 state.options=[{listPackingGroups:[]}];
		 groupInfo.packstyle=2;
		 groupInfo.packSetType=1;
		 groupInfo.packageCount=null;
		 groupInfo.hasBox=false;
		 groupInfo.packingOptionId=state.planData.id;
		 groupInfo.packingGroupId=state.planData.id;
		 groupInfo.items=state.planData.itemlist;
		 groupInfo.items.forEach(item=>{
			             item.packingGroupId=state.planData.id;
		 				 item.skuinfo= item;
						
		 });
		 state.options[0].listPackingGroups.push(groupInfo);
		 selectPackgroupInfo( state.options[0].listPackingGroups[0]);
		
		 
	}
	function getOptionsItem(){
		 state.options.forEach(item=>{
			 var packingOptionId=item.packingOptionId;
			 item.listPackingGroups=[];
			 item.packingGroups.forEach(packingGroupId=>{
				  listPackingGroupItems(packingOptionId,packingGroupId,null,item);
			 });
		 });
		 
	}
	
	function generatePlacementOptions(){
		shipmentPlacementApi.generatePlacementOptions({"formid":state.planData.id}).then(res=>{
			if(res.data.operationid){
				 operationRef.value.show(res.data.operationid,1);
			}
		})
	}
	
	function handleOperationChange(data){
		//跳转路由至第三步
		if(data && data.operationStatus=="SUCCESS" &&data.operation=="setPackingInformation"){
		   handleDonePacking();
		}
		if(data && data.operationStatus=="SUCCESS" &&data.operation=="generatePackingOptions"){
			 listPackingOptions();
		}
		if(data && data.operationStatus=="SUCCESS" &&data.operation=="generatePlacementOptions"){
			var timer1=setTimeout(function(){
					router.push({
						path:'/e/s/s/three',
						query:{
						  id:planid,
						  title:"发货处理_发货",
						  path:'/e/s/s/three',
						  replace:true
						}
					})		 
					clearTimeout(timer1);
			},500);
		}
	}
	
	function confirmPackingOption(groupInfo){
		var param={};
		param.formid=planid;
		param.packingOptionId=groupInfo.packingOptionId;
		if(state.planData.invtype!=1&&state.planData.invtype!="1"){
			shipmentBoxApi.confirmPackingOption(param).then((res)=>{
			   
			});
		}
		
	}
	
	function confirmPackStyle(groupInfo){
		if(groupInfo.packstyle==1 || groupInfo.packstyle=='1'){
			groupInfo.packageCount='one';
		}else{
			groupInfo.packageCount='more';
		}
		confirmPackingOption(groupInfo);
	}
	function gotoPackInfo(groupInfo){
		groupInfo.packageCount=null;
	}
	
	
	function openPackList(groupInfo){
		if(!(groupInfo.boxnum && groupInfo.boxnum>1)){
			groupInfo.boxnum=1;
		}
		groupInfo.boxnum=parseInt(groupInfo.boxnum);
		state.operatorInfo=groupInfo;
		boxTableRef.value.show(groupInfo,state.planData);
	 
	}
	
 
	function getBoxData(data){
		//console.log(data);
		loadData();
	}
	
	function packNumchange(row,index){
		var boxindex='boxNum'+index;
		if(row[boxindex]&&row[boxindex]!="0"){
		   row[boxindex]=CheckInputIntLGZero(row[boxindex]);
		}
		packNumSum(row);
	}
	
	//装箱数量校验
	function packNumSum(row){
		let sum = 0
		for(var i=0;i<state.operatorInfo.boxnum ;i++){
		    if(row['boxNum'+i]){
			sum +=parseInt(row['boxNum'+i]);
			}
		}
		row.sum=sum;
	}
	function submitBox(){
		state.btnloading=true;
		shipmentBoxApi.submitPackingInformation({"formid":planid}).then((res)=>{
			if(res.data &&res.data.operationid){
				ElMessage.warning("箱子信息已提交...");
				operationRef.value.show(res.data.operationid,0);
			}
		}).catch(()=>{
			state.btnloading=false;
		});
	}
	
	
	
	onMounted(()=>{
		loadData();
	})
</script>
<style scoped>
	.font14{
		font-size: 14px;
	}
</style>
<style>
	.two-box .el-card__header {
	    padding: calc(var(--el-card-padding) - 12px) var(--el-card-padding);
	    border-bottom: 1px solid var(--el-card-border-color);
	    box-sizing: border-box;
	    background-color: #F8F8F8;
	}
	.two-box .el-card__footer {
	    padding: calc(var(--el-card-padding) - 12px) var(--el-card-padding);
	    border-bottom: 1px solid var(--el-card-border-color);
	    box-sizing: border-box;
	    background-color: #F8F8F8;
	}
	.two-box .card-header{
		font-size:14px;
	}
	.pull-right{
		float: right;
	}
	.mar-bot{
		margin-bottom:16px;
	}
	.mar-bot10{
		margin-bottom:10px;
	}
	.box-margin{
		padding:16px;
		min-height:calc(100vh - 36px)
	}
</style>