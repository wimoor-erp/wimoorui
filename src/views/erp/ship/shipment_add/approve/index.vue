<template>
	<el-row>
		<el-col :span="24">
			<div class="gird-line-head">
				<div class="order-title">
					<h3>{{plandata.name}}</h3>
					<div class="font-extraSmall">
						<el-space :spacer="spacer">
							<span>计划编码：{{plandata.number}}</span>
							<span>货件数：{{plandata.shipmentnum}}</span>
						</el-space>
					</div>
				</div>
				<div class="rt-btn-group">
					<el-button type="primary" v-if="plandata.auditstatus==1"  @click="approvePlan">审核</el-button>
					<el-button type="info" v-if="plandata.auditstatus==3"  >已审核</el-button>
					<el-button type="info" v-if="plandata.auditstatus==2"  >已驳回</el-button>
					<el-button   class='ic-btn' title='帮助文档'>
					  <help theme="outline" size="16" :strokeWidth="3"/>
					</el-button>
				</div>
				
			</div>
		</el-col>
	</el-row>
	<el-row >
		<el-col :span="18" class="gird-line-left">
			 <el-scrollbar height="calc(100vh - 156px)">
				<Table ref="tableRef" />
			 </el-scrollbar>
		</el-col>
		<el-col :span="6" class="gird-line-right">
			<List ref="listRef" />
		</el-col>
	</el-row>
	<el-dialog v-model="approveVisible" title="发货货件审核" destroy-on-close='true' width="60%" @close='closeDialog'>
			 <div class="from-body">
			 <el-table :data="shipmentList" border style="width: 100%;margin-top:16px;" >
				  <el-table-column prop="name" label="货件名称" width="200" />
				 <el-table-column prop="skucount" label="sku数量" width="80" />
				 <el-table-column prop="toquantity" label="发货数量" width="80" />
				 <el-table-column prop="weight" label="发货重量(kg)" width="120" />
				 <el-table-column prop="readweight" label="预估运输重量(kg)" width="120" />
				 <el-table-column prop="boxvolume" label="预估箱子体积(m³)" width="120" >
					 <template #default="scope">
						 <span v-if="scope.row.boxvolume!='0E-10'">{{scope.row.boxvolume}}</span>
						 <span v-else>0</span>
					 </template>
				 </el-table-column>
				 <el-table-column prop="itemprice" label="货值(￥)" width="100" />
				 <el-table-column prop="itemprice" label="收货城市"  >
					 <template #default="scope">
					    <span>{{scope.row.addressTo.countrycode}} {{scope.row.destinationFulfillmentCenterId}}</span> 
					 </template>
				 </el-table-column>
				 <el-table-column prop="itemprice" label="操作"  >
						 <template #default="scope">
							 <el-radio-group v-model="scope.row.approve">
								 <el-radio
								 v-for="item in approves"
								 :key="item.value"
								 :label="item.value"
								 :value="item.value"
								  >{{item.label}}
								 </el-radio>
							 </el-radio-group>
						 </template>
				 </el-table-column>
			  </el-table>
			</div>
				<el-alert class="m-t-16" title="亚马逊规定同一订单中的货件需要同时通过或者驳回，若发生某个货件审核失败，建议将其他已通过货件取消" type="warning" show-icon />
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="approveVisible = false">取消</el-button>
					<el-button @click="submitplan" type="primary">确认</el-button>
				</span>
			</template>
	</el-dialog>
</template>
<script>
	import {h, ref ,watch,reactive,onMounted} from 'vue'
	import {Help,} from '@icon-park/vue-next';
	import { ElDivider } from 'element-plus'
	import List from"./components/list"
	import Table from"./components/table"
	import { useRoute,useRouter } from 'vue-router'
	import shipmentplanApi from '@/api/erp/ship/shipmentplanApi.js';
	import {ElMessage } from 'element-plus'
	export default {
		name: 'index',
		components: {List,Table,Help,},
		setup() {
			let spacer = h(ElDivider, {direction: 'vertical'})
			let router = useRouter();
			let tableRef=ref();
			let listRef=ref();
			let plandata=ref({});
			let approveVisible=ref(false);
			let shipmentList=ref([]);
			let approves=reactive([{label:'通过',value:true},
									{label:'驳回',value:false}
								]);
			const planid=router.currentRoute.value.query.id;
			onMounted(()=>{
				loadData()
			})
			function loadData(){
				if(planid){
					shipmentplanApi.getPlanInfo({"inboundplanid":planid}).then((res)=>{
							if(res.data){
								if(res.data.shipmentList && res.data.shipmentList.length>0){
									res.data.shipmentnum=res.data.shipmentList.length;
								}else{
									res.data.shipmentnum=0;
								}
								plandata.value=res.data;
								tableRef.value.planData=res.data;
								res.data.shipmentList.forEach(function(item,index){
									var nowDate=new Date();
									item.nameVis=false;
									item.remarkVis=false;
									if(item.name=='' || item.name==undefined || item.name==null){
										item.name="FBA"+"("+(nowDate.getMonth()+1)+"/"+(nowDate.getDate())+"/"+nowDate.getFullYear()+" "+nowDate.getHours()+":"+nowDate.getMinutes()+")-"+(index+1)
									} 
								});
								tableRef.value.initData(res.data.shipmentList);
								listRef.value.planData=res.data;
								listRef.value.remark=res.data.remark;
							}
					});
				}
			}
			function approvePlan(){
				approveVisible.value=true;
				if(planid){
					shipmentplanApi.getPlanInfo({"inboundplanid":planid}).then((res)=>{
						if(res.data && res.data.shipmentList){
							res.data.shipmentList.forEach(function(item){
								item.approve=true;
							});
							shipmentList.value=res.data.shipmentList
						}
					});
				}
			}
			function submitplan(){
				approveVisible.value=false;
				shipmentList.value.forEach(async function(item){
					if(item.approve==true){
						await shipmentplanApi.createShipment({"shipmentid":item.shipmentId});
					}else{
						await shipmentplanApi.cancelShipment({"shipmentid":item.shipmentId});
					}
				})
				//最后更新一下plan的状态
				shipmentplanApi.updatePlan({"planid":plandata.value.id}).then((res)=>{
					if(res.data=="ok"){
						ElMessage({
						   message: '审核成功！',
						   type: 'success'
						 })
					}
				});
				
			}
			return {
				spacer,loadData,listRef,tableRef,plandata,approvePlan,approveVisible,submitplan,shipmentList,approves
			}
		}
	}
</script>

<style scoped="scoped">
	.gird-line-left{
		background-color: var(--el-color-info-lighter);
	}
	.m-t-16{
		margin-top: 16px;
	}
</style>
