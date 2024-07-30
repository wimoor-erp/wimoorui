<template>
	<el-row>
		<GlobalTable ref="globalTable" :tableData="tableData" :stripe="true"  @loadTable="loadtableData"  height="calc(100vh - 300px)" :defaultSort="{ prop: 'createtime', order: 'descending' }"  
			style="width: 100%;margin-bottom:16px;">
			<template #field>
				<el-table-column prop="groupname" label="店铺" width="120" />
				<el-table-column prop="number" label="计划编码" width='180' />
				<el-table-column prop="name" label="计划名称" width='180' />
				<el-table-column prop="skunum" label="SKU个数" width="100" sortable="custom" />
				<el-table-column prop="sumquantity" label="发货数量" width="120" sortable="custom" />
				<el-table-column prop="warename" label="发货仓库" width="140" />
				<el-table-column prop="country" label="收货站点" width="120" />
				<el-table-column prop="preShippingDate" label="预计到货日期" width="180" sortable="custom"   >
				<template #default="scope">
				{{dateFormat(scope.row.preShippingDate)}}
				<div v-if="scope.row.auditstatus<7">距离发货:{{getDaysBetweenDates(scope.row.preShippingDate)}}天</div>
				</template>
				</el-table-column>
				<el-table-column prop="createtime" label="申请日期" width="180" sortable="custom"   >
				<template #default="scope">
				{{dateTimesFormat(scope.row.createtime)}}
				</template>
				</el-table-column>
				<el-table-column v-if="auditstatus==null" prop="auditstatus" label="状态" width="120"   >
					<template #default="scope">
						 <span v-if="scope.row.auditstatus==1">待审核</span>
						 <span v-if="scope.row.auditstatus==2">待配货</span>
						 <span v-if="scope.row.auditstatus==3">待装箱</span>
						 <span v-if="scope.row.auditstatus==4">待发货</span>
						 <span v-if="scope.row.auditstatus==7">已发货</span>
						 <span v-if="scope.row.auditstatus==12">已取消</span>
						 <span v-if="scope.row.auditstatus==11">已驳回</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" />
				<el-table-column prop="remark" label="操作" width="120"  fixed="right" >
					<template #default="scope">
						<el-space>
							<el-button v-if="scope.row.auditstatus==2" class='el-button--blue' @click="gotoNewInbound(scope.row)">去配货</el-button>
							<el-button v-else-if="scope.row.auditstatus==3" class='el-button--blue' @click="gotoBox(scope.row)">去装箱</el-button>
							<el-button v-else-if="scope.row.auditstatus==4" class='el-button--blue' @click="gotoShip(scope.row)">去发货</el-button>
							<el-button v-else-if="scope.row.auditstatus<=7" class='el-button--blue' @click="gotoOldInbound(scope.row)">去查看</el-button>
							<el-button v-else class='el-button--blue' @click="gotoNewInbound(scope.row)">去查看</el-button>
							<el-button class='el-button--blue' @click="shipmentDetails(scope.row)">详情</el-button>
						</el-space>
					</template>
				</el-table-column>
			</template>
		</GlobalTable>
	</el-row>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import shipmentplanApi from '@/api/erp/shipv2/shipmentplanApi.js';
	import {dateFormat,dateTimesFormat,} from '@/utils/index.js';
	import GlobalTable from "@/components/Table/GlobalTable/index.vue";
  
			let globalTable = ref(GlobalTable);
			let router = useRouter()
			let parmashead = ref({})
			let tableData = reactive({
				records: [],
				total: 0
			})
			let auditstatus = ref("")

			function getshipplanData(params) {
				parmashead.value = params;
				globalTable.value.loadTable();
			}
			
			function gotoShip(row){
				router.push({
					path:'/e/s/s/three',
					query:{
					  id:row.id,
					  title:"发货处理_发货",
					  path:'/e/s/s/three',
					}
				})
			}
			
			function gotoBox(row){
				router.push({
					path:'/e/s/s/two',
					query:{
					  id:row.id,
					  title:"发货处理_装箱",
					  path:'/e/s/s/two',
					}
				})
			}
			
			function gotoNewInbound(row){
				router.push({
					path:'/e/s/s/one',
					query:{
					  id:row.id,
					  title:"发货处理_配货",
					  path:'/e/s/s/one',
					}
				})
			}
		
			function gotoOldInbound(row){
				router.push({
					path:'/e/s/s/end',
					query:{
					  id:row.id,
					  title:"发货处理_结束",
					  path:'/e/s/s/end',
					}
				})	
			}
			function shipmentDetails(row) {
				router.push({
					path: '/newshipmentdetails',
					query: {
						id: row.id,
						title: "新货件详情",
						path: '/newshipmentdetails',
					}
				})
			}
			function getDaysBetweenDates(date2) {
			    // 将日期字符串转换为Date对象
				if(date2){
					var d1 = new Date();
					var d2 = new Date(date2);
					// 计算两个日期的时间差（毫秒）
					var timeDiff = Math.abs(d2.getTime() - d1.getTime());
					// 计算天数
					var days = Math.ceil(timeDiff / (1000 * 3600 * 24));
					return days;
				}else{
					return 0;
				}
				
			}
			function loadtableData(params) {
				params.groupid = parmashead.value.groupid;
				params.marketplaceid = parmashead.value.marketplaceid;
				params.warehouseid = parmashead.value.warehouseid;
				if (parmashead.value.start !== undefined) {
					params.fromDate = (parmashead.value.start);
					params.toDate = (parmashead.value.end + " 23:59:59");
				} else {
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					params.fromDate = dateFormat(start);
					params.toDate = dateFormat(end) + " 23:59:59";
				}
				params.auditstatus = parmashead.value.auditstatus;
				if (parmashead.value.seachtype !== undefined) {
					params.searchtype = parmashead.value.seachtype;
				} else {
					params.searchtype = "sku";
				}
				auditstatus.value=params.auditstatus;
				params.search = parmashead.value.searchwords;
				shipmentplanApi.getPlanList(params).then((res) => {
					tableData.records = res.data.records
					tableData.total = res.data.total
				})
			}
    defineExpose({ getshipplanData })
		 
	 
</script>

<style>
</style>
