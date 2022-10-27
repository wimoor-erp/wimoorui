<template>
	<el-table :data="tableData.list" border style="width: 100%;margin-bottom:16px;"  @sort-change="tableSort"  height="calc(100vh - 190px)">
	    <el-table-column type="selection" width="38" />
	    <el-table-column prop="number"  label="订单编号" width="130" sortable="custom" />
		<el-table-column prop="image" label="图片" width="60" >
		   <template #default="scope">
		    <el-image :src="scope.row.image"   style="width:40px;height:40px;"  ></el-image>
		  </template>
		</el-table-column>
	    <el-table-column prop="sku" label="名称/SKU" width="400" sortable="custom" show-overflow-tooltip>
	       <template #default="scope">
	          <div class='mname'>{{scope.row.mname}}</div>
	          <div class='sku'>{{scope.row.sku}}  </div>
	      </template>
	    </el-table-column>
	    <el-table-column prop="purchaseprice"  width="100" label="采购金额" sortable="custom" />
		<el-table-column prop="purchases" width="120" label="采购数量"  sortable="custom" />
		 <el-table-column prop="audittime" width="120" label="审核日期"  sortable="custom" >
			  <template #default="scope">
		      <span >{{dateFormat(scope.row.audittime)}}</span>
			   </template>
		   </el-table-column>
		  <el-table-column prop="deliverydate" width="130" label="预计到货日期"  sortable="custom" >
		  			  <template #default="scope">
		       <span >{{dateFormat(scope.row.deliverydate)}}</span>
		  			   </template>
		    </el-table-column>
		   <el-table-column prop="amount" width="100" label="入库数量"  sortable="custom" />
		   <el-table-column prop="opttime" width="120" label="入库时间"  sortable="custom" >
		   			  <template #default="scope">
		        <span >{{dateFormat(scope.row.opttime)}}</span>
		   			   </template>
		     </el-table-column>
		    <el-table-column prop="name" width="100" label="操作人"  sortable="custom" />
		   <el-table-column prop="remark"  label="备注"  sortable="custom" />
	</el-table>
	<el-pagination background   layout="total, sizes, prev, pager, next, jumper"   :total="total"
	               :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" style='margin-left:auto'
	               :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	</el-pagination>
</template>

<script>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
    import storagedetailApi from '@/api/erp/purchase/receive/storagedetailApi';
	import {format,dateFormat} from '@/utils/index';
	import { ElMessageBox,ElMessage } from 'element-plus';
	export default{
	    name: 'StorageDetailTable',
	    components:{
	        Help,
	        Search,
	        Plus,
	        ArrowDown
	    },
		emits:["getTotalmount"],
	    setup(props,context){
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
					context.emit("getTotalmount",res.data[0].totalamount)
				})
			}
			const downLoadExcel = function(){
				storagedetailApi.getReceiveReportExcel({
					"warehouseid":warehouseid.value,
					"search":search.value,
					"searchtype":searchtype.value,
					"fromDate":fromDate.value,
					"toDate":toDate.value,
				}).then(res => {
						ElMessage({
						    message: '导出成功！',
						    type: 'success',
						  })
					 const blob = new Blob([res.data]);
					 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
					 		  navigator.msSaveBlob(blob, "purchaseRec.xlsx")
					 }else{
						 var link=document.createElement("a");
						 link.href=window.URL.createObjectURL(blob);
						 link.download="purchaseRec.xlsx";
						 link.click();
						 window.URL.revokeObjectURL(link.href);
					 }
				
				}).catch(e=>{
						ElMessage({
						    message: '导出失败！',
						    type: 'error',
						  })
				})
			}
			function getWarehouseid(data){
				warehouseid.value = data
				console.log(data)
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
	        //数据接收
	            return{
				handleCurrentChange,
				handleSizeChange,
				loadtableData,
	            tableData,
	            pagesize,
	            currentPage,
				total,
				getWarehouseid,
				warehouseid,
				getdate,
				searchtype,
				search,
				dateFormat,
				downLoadExcel,
				tableSort,
	        }
	    }
	
	}
</script>

<style>
</style>
