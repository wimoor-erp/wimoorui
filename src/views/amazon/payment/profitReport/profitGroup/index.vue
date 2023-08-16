<template>
	<div class="main-sty" >
		<div class="con-header">
			<el-row>
				<Group @change="getGroup"  ref="groupRef" />
				<el-space>
					<div class="date-picker-group">
						<el-select v-model="queryParams.datetype" @change="handleQuery">
							<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<Datepicker ref="datepickers"  :shortIndex="1"  @changedate="changedate" />
					</div>
					<el-select v-model="queryParams.currency" @change="handleQuery">
						<el-option label="人民币" value="CNY"></el-option>
						<el-option label="美元" value="USD"></el-option>
						<el-option label="站点币种" value="market"></el-option>
					</el-select>
		        </el-space>
				
				<div class='rt-btn-group' style="margin-bottom:20px;">
				 <el-button style="float:right;"  @click="downloadList">导出</el-button>
				</div>
				
				
			 </el-row>
			 <el-table :data="tableData" v-loading="loading" >
				 <el-table-column prop="name" label="店铺"   />
				 <el-table-column prop="tocurrency" label="币种"  />
				 <el-table-column prop="principal" label="销售额" >
				 </el-table-column>
				 <el-table-column prop="commission" label="销售佣金" >
				 </el-table-column>
				 <el-table-column prop="fbafee" label="FBA费用" >
				 </el-table-column>
				 <el-table-column prop="refund" label="退款金额" >
				 </el-table-column>
				 <el-table-column prop="storagefee" label="仓储费" >
				 </el-table-column>
				 <el-table-column prop="advfee" label="广告费" >
				 </el-table-column>
				 <el-table-column prop="other" label="其它" >
				 </el-table-column>
				 <el-table-column prop="setin" label="结算收入" >
				 </el-table-column>
				 <el-table-column prop="price" label="采购成本" >
				 </el-table-column>
				 <el-table-column prop="profit" label="利润" >
				 </el-table-column>
			 </el-table>
		</div>
		</div>
	</template>
	
	<script setup>
		import { ref,reactive,onMounted,toRefs} from 'vue';
		import Group from '@/views/amazon/listing/common/group.vue';
		import Datepicker from '@/components/header/datepicker.vue';
		import { ElMessage, ElMessageBox} from 'element-plus';
		import settlementAccRptApi from '@/api/amazon/finances/settlementAccRptApi.js';
		import { outputmoney} from '@/utils/index';
		let state=reactive({
			dateOptions:[{label:'结算日期',value:''},{label:'转账日期',value:'acc'}],
			queryParams:{datetype:"",currency:"CNY"},
			tableData:[],
			loading:false,
			isload:true,
		})
		const{
			dateOptions,
			queryParams,
			tableData,
			loading,
			isload,
		}=toRefs(state)
		
		//日期改变
		function changedate(dates){
			state.queryParams.fromDate=dates.start;
			state.queryParams.endDate=dates.end;
			if(state.isload==false){
				handleQuery();
			}
		}
		function getGroup(obj){
			state.queryParams.groupid=obj.groupid;
			state.queryParams.marketplaceid=obj.marketplaceid;
			handleQuery();
			state.isload=false;
		}
		
		function handleQuery(){
			//查询表格数据
			state.loading=true;
			settlementAccRptApi.getSettlementOverAll(state.queryParams).then((res)=>{
				state.loading=false;
				if(res.data){
					res.data.forEach(item=>{
						item.principal=item.principal?outputmoney(item.principal):item.principal;
						item.commission=item.commission?outputmoney(item.commission):item.commission;
						item.fbafee=item.fbafee?outputmoney(item.fbafee):item.fbafee;
						item.refund=item.refund?outputmoney(item.refund):item.refund;
						item.storagefee=item.storagefee?outputmoney(item.storagefee):item.storagefee;
						item.advfee=item.advfee?outputmoney(item.advfee):item.advfee;
						item.other=item.other?outputmoney(item.other):item.other;
						item.setin=item.setin?outputmoney(item.setin):item.setin;
						item.price=item.price?outputmoney(item.price):item.price;
						item.profit=item.profit?outputmoney(item.profit):item.profit;
					})
				}
				state.tableData=res.data;
			}).catch(e=>{state.loading=false;});
		}
		
		function downloadList(){
			settlementAccRptApi.downloadSettlementOverAll(state.queryParams);
		}
		onMounted(()=>{
			 
		});
	</script>
	
	<style scoped="scoped">
	</style>
	



