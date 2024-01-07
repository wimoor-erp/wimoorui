<template>
	<el-table :data="tableData.list" :stripe="true"  style="width: 100%;margin-bottom:16px;"  @sort-change="tableSort"  height="calc(100vh - 206px)">
	    <el-table-column prop="number"  label="订单编号" width="200" sortable="custom" show-overflow-tooltip>
			<template #default="scope">
			   <div >{{scope.row.number}}</div>
			   <div class="font-extraSmall">{{scope.row.cname}}</div>
			 </template>
			</el-table-column>
	    <el-table-column prop="sku" label="名称/SKU"  sortable="custom" show-overflow-tooltip>
	       <template #default="scope">
			   <el-space>
				    <el-image :src="scope.row.image"   style="width:40px;height:40px;"  ></el-image>
					<div>
						<div class='mname'>{{scope.row.mname}}</div>
						<div class='sku'>{{scope.row.sku}}  </div>
					</div>
			   </el-space>
	      </template>
	    </el-table-column>
	    <el-table-column prop="purchaseprice"  width="100" label="采购金额" sortable="custom" />
		<el-table-column prop="purchases" width="100" label="采购数量"  sortable="custom" />
		 <el-table-column prop="audittime" width="100" label="审核日期"  sortable="custom" >
			  <template #default="scope">
		      <span >{{dateFormat(scope.row.audittime)}}</span>
			   </template>
		   </el-table-column>
		  <el-table-column prop="deliverydate" width="130" label="预计到货日期"  sortable="custom" >
		  			  <template #default="scope">
		       <span >{{dateFormat(scope.row.deliverydate)}}</span>
		  			   </template>
		    </el-table-column>
			<el-table-column prop="ftype" width="180" label="操作类型"  show-overflow-tooltip sortable="custom" >
						   <template #default="scope">
						       <el-tag v-if="scope.row.ftype=='入库'">{{scope.row.ftype}}</el-tag>
							   <el-tag v-else-if="scope.row.ftype=='退货'" type="warning">{{scope.row.ftype}}</el-tag>
							   <el-tag v-else type="info">{{scope.row.ftype}}</el-tag>
						     </template>
			 </el-table-column>
		   <el-table-column prop="amount" width="200" label="入库数量"  show-overflow-tooltip sortable="custom" >
			   <template #default="scope">
			      <div >{{scope.row.amount}}</div>
				   <div class="font-extraSmall">{{scope.row.wname}}</div>
			   		   </template>
			   </el-table-column>
		   <el-table-column prop="opttime" width="100" label="入库时间"  sortable="custom" >
		   			  <template #default="scope">
		                  <div><span >{{dateFormat(scope.row.opttime)}}</span></div>
						  <div class="font-extraSmall">操作人:{{scope.row.name}}</div>
		   			   </template>
		     </el-table-column>
		   <el-table-column prop="remark"  label="备注"  sortable="custom" />
	</el-table>
	<el-pagination background   layout="total, sizes, prev, pager, next, jumper"   :total="total"
	               :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" style='margin-left:auto'
	               :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	</el-pagination>
</template>

<script setup>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
    import storagedetailApi from '@/api/erp/purchase/receive/storagedetailApi';
	import {dateFormat} from '@/utils/index';
	import { ElMessageBox,ElMessage } from 'element-plus';
	const emits=defineEmits(["getTotalmount"])
	        let tableData=reactive({list:[]})
	        let pagesize=ref(10)
	        let currentPage=ref(1)
			let total = ref()
			let warehouseid =ref("")
			let fromDate =ref()
			let toDate =ref()
			let searchtype =ref("sku")
			let search =ref("")
			
	        //方法
			onMounted(()=>{
			toDate.value = new Date().format("yyyy-MM-dd");
			var oidtime = new Date().getTime() - 3600 * 1000 * 24 * 7
			fromDate.value = new Date(oidtime).format("yyyy-MM-dd")
			loadtableData()	
			})
			const tableSort=function(option){
				let sort=option.prop;
				let order=option.order=="ascending"?"asc":"desc";
				loadtableData(sort,order);
			}
			const loadtableData =function(sort="",order=""){
				storagedetailApi.getReceiveReport({
					"pagesize":pagesize.value,
					"currentpage":currentPage.value,
					"warehouseid":warehouseid.value,
					"search":search.value,
					"searchtype":searchtype.value,
					"fromDate":fromDate.value,
					"toDate":toDate.value,
					"sort":sort,
					"order":order
				}).then(function(res){
					tableData.list = res.data
					total.value = res.total
					if(res.data.length>0)
					emits("getTotalmount",res.data[0].totalamount)
				})
			}
			const downLoadExcel = function(){
				storagedetailApi.getReceiveReportExcel({
					"warehouseid":warehouseid.value,
					"search":search.value,
					"searchtype":searchtype.value,
					"fromDate":fromDate.value,
					"toDate":toDate.value,
				}) 
			}
			function getWarehouseid(data){
				warehouseid.value = data
				loadtableData()
			}
			function getdate(date){
				if(date[1]){
				fromDate.value = date[0].format("yyyy-MM-dd")
				toDate.value = date[1].format("yyyy-MM-dd")
				loadtableData()
				}
			}
			function handleSizeChange(size){
			    pagesize.value = size
				loadtableData()
			}
	        function handleCurrentChange(val){
	            currentPage.value = val;
				loadtableData()
	        }
	        
		defineExpose({ search,loadtableData,getWarehouseid,getdate,searchtype,downLoadExcel })
</script>

<style>
</style>
