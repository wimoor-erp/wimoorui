<template>
	<div class="main-sty">
		<div class="con-header">
	    	<el-row>
	    		<el-space>
	    			<Group ref="groups" @change="changeGroup" defaultValue="onlyEU"/>
	    			<Owner   @owner="changeOwner" />
	    			<el-input v-model="localParams.searchKeywords" @input="handleQuery"  placeholder="请输入" class="input-with-select">
	    				<template #prepend>
	    					<el-select v-model="localParams.selectlabel" @change="handleQuery"  placeholder="SKU"
	    						style="width: 110px">
	    						<el-option label="SKU" value="sku"></el-option>
	    						<el-option label="MSKU" value="msku"></el-option>
	    						<el-option label="ASIN" value="asin"></el-option>
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
					<el-button  :loading="downLoading" @click="handleDownloadSales"><el-icon><Download /></el-icon>下载</el-button>
					<el-button :loading="upLoading"  @click="handleUploadSales"><el-icon><Upload /></el-icon>上传</el-button>
	    			<el-button class='ic-btn' title='帮助文档'>
	    				<help theme="outline" size="16" :strokeWidth="3" />
	    			</el-button>
	    		</div>
	    	</el-row>
		</div>
		<div class="con-body">
			<GlobalTable
					height="calc(100vh - 168px)" 
					:queryParams="queryParams"
					:defaultSort="{ prop: 'openDate', order: 'descending' }"  
					@loadTable="loadtableData" 
					@selectionChange="handleSelectionChange"
			         >
				<template #field>
				<el-table-column label="图片" prop="img" width="65">
					<template #default="scope">
					<el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
					<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
					</template>
				</el-table-column>
				<el-table-column label="名称/SKU" prop="sku" sortable="custom" show-overflow-tooltip="">
					<template #default="scope">
						<div class="name">{{scope.row.name}}</div>
						<div  >
						<span class=" sku pointer" @click="showMore(scope.row)">{{scope.row.sku}} </span><span class="font-extraSmall"> [{{scope.row.asin}}] </span>
						<el-tag size="small" effect="dark" :type="scope.row.statuscolor" v-if="scope.row.statusname">{{scope.row.statusname}}</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="店铺/国家" width="120" prop="groupname"  sortable="custom" >
					<template #default="scope">
						<div >{{scope.row.groupname}}</div>
						<div class="font-extraSmall">{{scope.row.marketname}}</div>
					</template>
				</el-table-column>
				<el-table-column label="销量" prop="state" >
					<el-table-column label="日均" prop="avgsales" width="80" sortable="custom" >
						<template #default="scope">
							<span v-if="scope.row.avgsales">{{scope.row.avgsales}}</span>
							<span v-else>0</span>
							<el-link @click="handleSales(scope.row)"  
							type="warning" class="m-l-8 ">
							<el-icon class="ic-cen"><Histogram /></el-icon>
							</el-link>
						</template>
					</el-table-column>
					<el-table-column label="7天" prop="sumseven" width="80" sortable="custom" >
						<template #default="scope">
							<span v-if="scope.row.sumseven">{{scope.row.sumseven}}</span>
							<span v-else>0</span>
						</template>
					</el-table-column>
					<el-table-column label="30天" prop="summonth" width="80" sortable="custom" >
						<template #default="scope">
							<span v-if="scope.row.summonth">{{scope.row.summonth}}</span>
							<span v-else>0</span>
						</template>
					</el-table-column> 
				</el-table-column>
				<el-table-column label="上架时间" prop="openDate" sortable="custom" width="120">
					<template #default="scope">
						<div>{{dateFormat(scope.row.openDate)}}</div>
						<div v-if="scope.row.multplus" class="font-extraSmall">复合增长率{{scope.row.multplus}}%</div>
					</template>
				</el-table-column>
				<el-table-column label="2023年销量预测"  prop="operator">
					<el-table-column :label="header.month1+'月销量'" width="120">
						<template #default="scope">
							<el-input v-model="scope.row.month1sales"></el-input>
						</template>
					</el-table-column>
					<el-table-column :label="header.month2+'月销量'" width="120">
						<template #default="scope">
							<el-input v-model="scope.row.month2sales"></el-input>
						</template>
					</el-table-column>
					<el-table-column :label="header.month3+'月销量'" width="120">
						<template #default="scope">
							<el-input v-model="scope.row.month3sales"></el-input>
						</template>
					</el-table-column>
				</el-table-column>
				
				<el-table-column label="操作" width="150">
					<template #default='scope'>
					 <el-space>
						<el-button @click="submitForm(scope.row)" type="primary" link>保存</el-button>
						<el-button @click="handleShowSalesAdjust(scope.row)" type="primary" link>详细计划</el-button>
					  </el-space>	
					</template>
				</el-table-column>
				</template>
			</GlobalTable>
		</div>
	</div>
	<SalechartDialog ref="salechartRef"/>
	<SaleAdjustDialog ref="saleAdjustDialogRef"></SaleAdjustDialog>
	<SaleAdjustUploadDialog ref ="saleAdjustUploadDialogRef"></SaleAdjustUploadDialog>
	<GoodsDeatils ref="goodsDeatilsRef" :productInfoData="productInfoData"/>
</template>

<script setup>
	import {h,ref,reactive,toRefs,onMounted,defineEmits,defineProps} from "vue"
	import {MoreOne,Help,Plus,MenuUnfold,SettingTwo} from '@icon-park/vue-next';
	import {Search,ArrowDown,Histogram,Download,Upload} from '@element-plus/icons-vue';
	import Group from '@/components/header/group.vue';
	import Owner from '@/components/header/owner.vue';
	import { ElMessage, ElMessageBox, ElDivider } from 'element-plus';
	import {useRouter } from 'vue-router';
	import SalechartDialog from "@/views/amazon/listing/common/salechart.vue";
	import {getProductMonthSales} from "@/api/amazon/listing/preSalesApi.js";
	import {getSales,save,clear} from "@/api/amazon/listing/preSalesApi.js";
	import GoodsDeatils from "@/views/amazon/listing/common/goods_deatils"
	import {dateFormat} from "@/utils/index.js";
	import SaleAdjustDialog from "./components/sale_adjust_dialog";
	import SaleAdjustUploadDialog from "./components/sale_adjust_upload_dialog";
	import {downExcelSales} from "@/api/amazon/listing/preSalesApi.js";
	const spacer = h(ElDivider, { direction: 'vertical' });
	const salechartRef =ref();
	const saleAdjustDialogRef=ref();
	const saleAdjustUploadDialogRef=ref();
	let goodsDeatilsRef=ref();
	const router = useRouter();
	const state = reactive({
		queryParams:{},
		downLoading:false,
		upLoading:false,
		header:{month1:"",month2:"",month3:""},
		localParams:{selectlabel:"sku"},
	})
	const { queryParams ,localParams,header,downLoading,upLoading}=toRefs(state)
	function loadtableData(params,callback){
		getProductMonthSales(params).then(res=>{
			if(res&&res.data&&res.data.records.length>0){
				state.header.month1=res.data.records[0].month1+1;
				state.header.month2=res.data.records[0].month2+1;
				state.header.month3=res.data.records[0].month3+1;
			}
			callback(res);
		});
	}
	function showMore(row){
		goodsDeatilsRef.value.show(row);
	}
	function handleQuery(){
		if(state.localParams.searchKeywords){
			if(state.localParams.selectlabel=="sku"){
				state.queryParams.asin="";
				state.queryParams.msku="";
				state.queryParams.sku=state.localParams.searchKeywords;
			}
			if(state.localParams.selectlabel=="asin"){
				state.queryParams.sku="";
				state.queryParams.msku="";
				state.queryParams.asin=state.localParams.searchKeywords;
			}
			if(state.localParams.selectlabel=="msku"){
				state.queryParams.sku="";
				state.queryParams.asin="";
				state.queryParams.msku=state.localParams.searchKeywords;
			}
		}else {
				state.queryParams.sku="";
				state.queryParams.asin="";
				state.queryParams.msku="";
		}
		state.queryParams.searchSession=new Date();
	}
	function handleUploadSales(){
		saleAdjustUploadDialogRef.value.show();
	}
	function handleDownloadSales(){
		state.downLoading=true;
		downExcelSales(state.queryParams,item=>{
			state.downLoading=false;
		});
	}
	function changeGroup(value){
	    state.queryParams.groupid=value.groupid;
		state.queryParams.marketplaceid=value.marketplaceid;
	}
	function changeOwner(value){
		state.queryParams.owner=value;
	}
	function handleShowSalesAdjust(row){
		row.sysavgsales=row.avgsales;
		saleAdjustDialogRef.value.show(row,row);
	}
	function monthDate(month){
		var date=new Date();
		date=date.setMonth(month);
		date=new Date(date);
		date=date.setDate(1);
		date=new Date(date); 
		return date;
	}
	function submitForm(row){
			 var monthdata={};
			 var preSaleList=[];
		      monthdata[row.month1+1]={amount:row.month1sales};
			  monthdata[row.month2+1]={amount:row.month2sales};
			  monthdata[row.month3+1]={amount:row.month3sales};
			  monthdata[row.month1+1].date=monthDate(row.month1);
			  monthdata[row.month2+1].date=monthDate(row.month2);
			  monthdata[row.month3+1].date=monthDate(row.month3);
			 for(var i=row.month1+1;i<=row.month3+1;i++){
			 		   var amount=monthdata[i].amount;
			 			 if(amount!=""){
			 				 var start= monthdata[i].date.clone();
			 				 var end = start.clone();
			 				 end=end.setMonth(end.getMonth() +1);
			 				 end=new Date(end); 
			 				 end=end.setDate(1);
			 				 end=new Date(end); 
							 var daynum=0;
			 				 while(start<end){
								  start=start.clone();
								  start=start.setDate(start.getDate()+1);
								  start=new Date(start);
			 					 daynum++;	  
			 				 }
							monthdata[i].daynum=daynum; 
			 			 }
			 }
			 console.log(monthdata);
		  for(var i=row.month1+1;i<=row.month3+1;i++){
					 var amount=monthdata[i].amount;
					 if(amount!=""){
						 var sub=amount%monthdata[i].daynum;
						 var myamount=parseInt(amount/monthdata[i].daynum);
						 var start= monthdata[i].date.clone();
						 var end = start.clone();
						 end=end.setMonth(end.getMonth() +1);
						 end=new Date(end); 
						 end=end.setDate(1);
						 end=new Date(end); 
						 while(start<end){
									  var param={};
									  param.sku=row.sku;
									  param.groupid=row.groupid;
									  param.amazonauthid=row.amazonauthid;
									  param.marketplaceid=row.marketplaceid;
									  param.quantity=myamount;
									  if(sub>0){
										   param.quantity=param.quantity+1;
										   sub=sub-1;
									  } 
									  param.date=start;
									  preSaleList.push(param);
									  start=start.clone();
									  start=start.setDate(start.getDate()+1);
									  start=new Date(start);
						 }
					 }
			 }
			save(preSaleList).then(res=>{
						 ElMessage({ message: "保存成功", type: 'success', });
						 handleQuery()
			}) 
	}
	function handleSales(row){
		salechartRef.value.show(row.groupid,row.marketplaceid,row.amazonAuthId,row.sku,row.msku);
	}
	onMounted(() => {
	 
	});
</script>

<style>
	.m-l-8{
		margin-left:8px;
	}
</style>
