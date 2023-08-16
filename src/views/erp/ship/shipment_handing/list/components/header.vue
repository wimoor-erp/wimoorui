<template>
	<div class="con-header" >
	  <el-row>
	    <el-space >
			<Group ref="groups" @change="getData" defaultValue="all"/>
			<Warehouse ref="warehouses" @changeware="getWarehouse" />
			<Datepicker ref="datepickers" @changedate="changedate" />
	        <el-input  v-model="searchKeywords" @input="searchConfirm" placeholder="请输入" class="input-with-select" >
	      <template #prepend>
	        <el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU" style="width: 110px">
	          <el-option label="SKU" value="sku"></el-option>
	          <el-option label="货件编码" value="number"></el-option>
	          <el-option label="货件名称" value="formnumber"></el-option>
			  <el-option label="备注" value="remark"></el-option>
	        </el-select>
	      </template>
	      <template #append>
	        <el-button @click="searchConfirm">
	           <el-icon style="font-size: 16px;align-itmes:center">
	            <search />
	         </el-icon>
	        </el-button>
	      </template>
	    </el-input>
	   <el-popover    v-model:visible="moreSearchVisible" :width="400" trigger="click">
	         <template #reference>
	           <el-button  title='高级筛选'  class='ic-btn'>
	           <menu-unfold theme="outline" size="16"  :strokeWidth="3"/>
	           </el-button>
	         </template>
			  <el-form  :model="form" label-width="120px">
			  <el-form-item label="全部物流商">
			       <el-select  v-model="tran"  :teleported="false" placeholder="请选择" @change="tranChange">
			       <el-option
			             v-for="item in tranlist"
			             :key="item.id"
			             :label="item.name"
			             :value="item.id"
			           >
			           </el-option>
			       </el-select>
			     </el-form-item>
				 <el-form-item label="全部物流渠道">
				      <el-select v-model="channel" :teleported="false" placeholder="请选择" @change="channelChange">
				      <el-option
				            v-for="item in channellist"
				            :key="item.id"
				            :label="item.channame"
				            :value="item.id"
				          >
				          </el-option>
				      </el-select>
				    </el-form-item>
					<el-form-item label="全部运输方式">
					     <el-select  v-model="trantype"  :teleported="false" placeholder="请选择" @change="trantypeChange">
					     <el-option value="" label="全部" ></el-option>
						 <el-option value="1" label="海运" ></el-option>
						 <el-option value="2" label="空运" ></el-option>
						 <el-option value="3" label="铁路" ></el-option>
						 <el-option value="4" label="海运卡派" ></el-option>
						 <el-option value="6" label="国际快递" ></el-option>
						 <el-option value="7" label="空加派" ></el-option>
						 <el-option value="11988530289661444047" label="卡航" ></el-option>
						 <el-option value="11988530289674023944" label="陆运" ></el-option>
						 <el-option value="11988530289685903889" label="海卡" ></el-option>
					     </el-select>
					   </el-form-item>
				  <el-form-item >
				       <el-button type="primary" @click="submitForm(formRef)">搜索</el-button>
				       <el-button @click="resetForm(formRef)">取消</el-button>
				     </el-form-item>
				</el-form>
	       </el-popover>
	    <el-button @click="resetQuery">重置</el-button>
	  </el-space>
	  </el-row>
	   <!--功能区域 -->
	  <el-row>
	   <el-space >
		 <el-button type="primary" @click="asyncShipment">
		      同步货件
		 </el-button>
	   </el-space>
	   <div class='rt-btn-group'>
		   <el-button   @click="showNumberDialog" >导入追踪号</el-button>
	   <el-button class='ic-btn'  title='列配置'>
	      <setting-two theme="outline" size="16"  :strokeWidth="3"/>
	   </el-button>
	    <el-button   class='ic-btn' title='帮助文档'>
	     <help theme="outline" size="16" :strokeWidth="3"/>
	   </el-button>
	   </div>
	</el-row>
	</div>
	<TransNumber ref="transNumberRef"></TransNumber>
</template>   

<script> 
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { useRoute,useRouter } from 'vue-router'
	import groupApi from '@/api/amazon/group/groupApi.js';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js';
	import marketApi from '@/api/amazon/market/marketApi.js';
	import { ref,reactive,onMounted,watch } from 'vue'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import transportationApi from '@/api/erp/ship/transportationApi';
	import Group from '@/components/header/group.vue';
	import Warehouse from '@/components/header/warehouse.vue';
	import Datepicker from '@/components/header/datepicker.vue';
	import TransNumber from './transnumber.vue';
	export default{
		name:"Header",
		components:{MenuUnfold,Search,ArrowDown,SettingTwo,Help,Copy,MoreOne,Group,Warehouse,Datepicker,TransNumber},
		emits:["getdata"],
		setup(props,context){
			let tranlist=ref([])
			let channellist=ref([])
			let searchKeywords =ref()
			let queryParam={};
			let router = useRouter()
			let selectlabel = ref("sku");
			let trantype=ref("")
			let tran=ref("")
			let rfgroups=ref(Group);
			let rfdatepickers=ref(Datepicker);
			let channel=ref("")
			let moreSearchVisible=ref(false)
			let isload=true;
			let groups=ref();
			let warehouses=ref();
			let datepickers=ref();
			let dialogVisible=ref(false);
			let transNumberRef=ref();
			onMounted(()=>{
				getTranList()
			})
			function showNumberDialog(){
				transNumberRef.value.show();
			}
			function refreshShipment(){
				let groupid=rfgroups.value.groupid;
				let marketplaceid=rfgroups.value.marketplaceid;
				let datas=rfdatepickers.value.dateValue;
				let start=datas[0].format("yyyy-MM-dd");
				let end=datas[1].format("yyyy-MM-dd")+" 23:59:59";
			}
			function asyncShipment(){
				router.push({
						path:'/e/s/a',
						query:{
						  name:'shiptongbu',
						  title:"货件同步",
						  path:'/e/s/a',
						}
					})
			}
			function searchTypeChange(){
				queryParam.seachtype=selectlabel.value;
				if(isload==false){
					context.emit("getdata",queryParam);
				}
			}
			function searchConfirm(){
				if(searchKeywords.value&&searchKeywords.value.indexOf("FBA")==0){
					selectlabel.value="number";
				}
				queryParam.searchwords=searchKeywords.value;
				if(isload==false){
					context.emit("getdata",queryParam);
				}
			}
			function getTranList(){
				transportationApi.getTranlist().then((res)=>{
					res.data.push({"id":"","name":"全部"})
					tranlist.value = res.data;
				})
				
			}
			function trantypeChange(val){
				trantype.value=val;
			}
			function tranChange(val){
				tran.value=val;
				getchannelList();
			}
			function channelChange(val){
				channel.value=val;
			}
			function getchannelList(){
				var tranid=tran.value;
				var market="";
				if(queryParam.country==undefined){
					market="";	
				}else{
					market=queryParam.country;
				}
				transportationApi.getChannel({"company":tranid,"marketplaceid":market,"transtype":""}).then((res)=>{
					res.data.push({"id":"","channame":"全部"});
					channellist.value = res.data
				})
			}
			function submitForm(){
				queryParam.company=tran.value;
				queryParam.channel=channel.value;
				queryParam.transtype=trantype.value;
				if(isload==false){
					context.emit("getdata",queryParam);
				}
				moreSearchVisible.value=false;
			}
			function resetForm(){
				moreSearchVisible.value=false;
			}
			function getData(obj){
				queryParam.store=obj.groupid;
				queryParam.country=obj.marketplaceid;
				context.emit("getdata",queryParam)
				isload=false;
			}
			function getWarehouse(wid){
				queryParam.warehouse=wid;
				if(isload==false){
					context.emit("getdata",queryParam);
				}
			}
			function changedate(dates){
				queryParam.start=dates.start;
				queryParam.end=dates.end;
				if(isload==false){
					context.emit("getdata",queryParam);
				}
			}
			function resetQuery(){
				tran.value="";
				channel.value=null;
				channellist.value=[];
				trantype.value="";
				selectlabel.value='sku';
				groups.value.groupid="";
				groups.value.marketplaceid="";
				warehouses.value.warehouseid="";
				queryParam.store="";
				queryParam.country="";
				queryParam.warehouse="";
				searchKeywords.value="";
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
				datepickers.value.dateValue=[start, end];
				queryParam.start=start.format("yyyy-MM-dd");
				queryParam.end=end.format("yyyy-MM-dd")+" 23:59:59";;
				searchConfirm();
			}
			
			return{
				refreshShipment,selectlabel,searchKeywords,searchConfirm,searchTypeChange,
				tranlist,channellist,getTranList,trantypeChange,trantype,
				tranChange,tran,channelChange,channel,getchannelList,
				submitForm,resetForm,getData,getWarehouse,
				moreSearchVisible,changedate,resetQuery,groups,warehouses,datepickers,
				dialogVisible,rfgroups,rfdatepickers,asyncShipment,transNumberRef,showNumberDialog,
			}
		}
	}
</script>

<style>
</style>
