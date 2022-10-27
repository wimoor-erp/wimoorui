<template>
<div>
	<el-button @click="copyshipment" >复制货件</el-button>
	<el-button v-if="shipDatas.status=='5' || shipDatas.status=='-1' || shipDatas.status=='0'" disabled >本地完成</el-button>
	<el-button v-else  @click="amazondoneShipmentFunc">本地完成</el-button>
	
	<el-dialog
	  v-model="dialogVisible"
	  title="操作提示"
	  width="30%"
	>
	  <span>{{canceltitle}}</span>
	  <template #footer>
	    <span class="dialog-footer">
		  <el-button @click="confirmDelete('local')" :style="{ display: visibleBtn }">仅删除本地</el-button>
	      <el-button @click="dialogVisible = false">取消</el-button>
	      <el-button type="primary" @click="confirmDelete('')"
	        >确认</el-button
	      >
	    </span>
	  </template>
	</el-dialog>
</div>
</template>

<script>
	
	import {TakeOff,TransactionOrder,Local} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue';
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import { useRoute,useRouter } from 'vue-router'
	import { ElMessageBox ,ElMessage } from 'element-plus'
	export default{
		name:'ShipmentOpt',
		components:{
			TakeOff,TransactionOrder,Local,
		},
		setup(){
			onMounted(()=>{
				
			})
			let router = useRouter()
			const shipmentid = router.currentRoute.value.query.shipmentid;
			let canceltitle=ref("亚马逊后台货件状态为,请确认是否同步删除亚马逊货件？")
			let shipstatus=ref("")
			let dialogVisible = ref(false)
			let visibleBtn=ref("none")
			let shipDatas=ref({})
			function deleteShipment(){
					//先弹窗打开modal 获取最新的货件状态
					dialogVisible.value=true;
					var status=shipDatas.value.shipmentstatus;
					shipmenthandlingApi.requestInboundShipment({
						"shipmentid":shipmentid
					}).then(res=>{
						if(res.data!="fail"){
							status=res.data;
						}
						if(status!="CANCELLED"&&status!="CANCELLED"&&status!="CANCELLED"){
							visibleBtn.value="";
						}
						canceltitle.value="亚马逊后台货件状态为"+status+",请确认是否同步删除亚马逊货件？";
						shipstatus.value=status;
					})
					
					
				}	
			function confirmDelete(ftype){
				var nowstatus="";
				if(ftype=="local"){
					nowstatus="DELETED";
				}else{
					nowstatus=shipstatus.value;
				}
				shipmenthandlingApi.disableShipment({
					"shipmentid":shipmentid,
					"shipmentStatus":nowstatus,
					"disableShipment":"1"
				}).then(res=>{
					ElMessage({
					    message: '操作成功！',
					    type: 'success',
					  })
				})
			}
			function copyshipment(){
							router.push({
								path:'/invoice/addshipment',
								query:{
									title:'添加货件',
									path:'/invoice/addshipment',
									shipmentid:shipmentid
								}
							}) 
						}
			function amazondoneShipmentFunc(){
				ElMessageBox.confirm(
					'该操作会对库存产生影响，请确认是否要执行本地已完成？',
					{
					  confirmButtonText: '确认',
					  cancelButtonText: '取消',
					  type: 'warning',
					  callback:(action)=>{
						 if(action=="confirm"){
							 shipmenthandlingApi.amazondoneShipment({
								"shipmentid":shipmentid
							 }).then(res=>{
								ElMessage({
								    message: '操作成功！',
								    type: 'success',
								  })
							 })
						 }
					  }
					}
				  )
				
			}	
			return{
				deleteShipment,confirmDelete,
				amazondoneShipmentFunc,canceltitle,shipstatus,
				dialogVisible,visibleBtn,shipDatas,copyshipment
				
			}
		}
	}
	
</script>

<style>
</style>
