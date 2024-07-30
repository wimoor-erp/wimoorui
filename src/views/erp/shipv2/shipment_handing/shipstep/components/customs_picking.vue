<template>
		<el-table :data="productData.list" border style="width: 100%;margin-bottom:16px;">
			<el-table-column prop="image" label="图片" width="70">
				<template #default="scope">
					<img :src="scope.row.image" @click.stop="handleToMaterial(scope.row)" style="width:40px;height:40px" />
				</template>
			</el-table-column>
			<el-table-column label="名称/SKU"  show-overflow-tooltip>
				<template #default="scope"> 
					<div class='name text-omit-1'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sellersku}} <el-tag v-if="scope.row.boxnum&&shipInfo.arecasesrequired">原装单箱：{{scope.row.boxnum}}</el-tag>
					</div>
				</template>
			</el-table-column>
		    <el-table-column prop="quantityshipped" label="申报数量" width="100"   />
			<el-table-column  label="申报单价" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.price"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="海关编码" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.code"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="税率" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.rate"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="产品材质" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.material"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="产品用途" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.application"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="链接" width="200">
				<template #default="scope">
					<el-input v-model="scope.row.url"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="英文名" width="200">
				<template #default="scope">
					<el-input v-model="scope.row.ename"></el-input>
				</template>
			</el-table-column>
			<el-table-column  label="中文名" width="200">
				<template #default="scope">
					<el-input v-model="scope.row.cname"></el-input>
				</template>
			</el-table-column>
		</el-table>
		   <el-row >
		  <div class="rt-btn-group">
		  	 <el-button   :loading="confirmloading" type="primary" @click.stop="saveCustoms">保存</el-button>
		  </div>
		  </el-row>
</template>

<script setup>
	import {Search,ArrowDown,WarningFilled} from '@element-plus/icons-vue'
	import {Printer,AddPrint,InboxOut,ShoppingCartDel} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue'
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import {dateFormat,dateTimesFormat} from '@/utils/index.js';
	import { ElMessage,ElMessageBox } from 'element-plus';
	import { useRoute,useRouter } from 'vue-router'
	import ShipmentOpt from"./shipment_operator.vue";
	import {downloadShipmentLabel} from '@/hooks/amazon/listing/label.js';
	import {assemblyShipment} from '@/api/erp/assembly/assemblyApi.js';
	import PrepInstruction from '@/model/amazon/ship/PrepInstruction.json';
	import shipmentTransportationApi from '@/api/erp/shipv2/shipmentTransportationApi.js';
	import materialApi from '@/api/erp/material/materialApi.js';
	const emit = defineEmits(['stepdata']);
	let router = useRouter()
	let productData=reactive({list:[]})
	let shipInfo=ref({})
	let validateLoading=ref(false);
	let boxcontents=ref("FEED")
	let piceDisable=ref(false);
	let confirmloading=ref(false);
	let boxconName=ref("系统提交装箱");
		 
	function downloadLabel(ftype){ 
		downloadShipmentLabel(shipInfo.value.shipmentid,ftype,null);
	}
	function saveCustoms(){
		confirmloading.value=true;
		productData.list.forEach(item=>{
			  item.itemid=item.id;
			  item.country=shipInfo.value.market;
			  item.opttime=null;
			  item.operator=null;
			  item.createtime=null;
			  item.creator=null;
		  })
		shipmentTransportationApi.saveCustomsList(productData.list).then(res=>{
			materialApi.saveCustoms(productData.list).then(res=>{
				confirmloading.value=false;
				ElMessage.success( '保存成功！');
				loadCustoms(shipInfo.value.shipmentid)
			}).catch(e=>{
				confirmloading.value=false;
			 });
		}).catch(e=>{
			confirmloading.value=false;
		})
	}
	function loadCustoms(shipmentid){
		shipmentTransportationApi.getCustomsList({"shipmentid":shipmentid}).then(res=>{
			  if(res.data){
					productData.list.forEach(item=>{
						   item=Object.assign(item,res.data[item.id]);
					  })
			  }else{
				  productData.list.forEach(item=>{
					  materialApi.getCustoms({"msku":item.msku,"country":shipInfo.value.market}).then(res=>{
						   item=Object.assign(item,res.data);
					  })
				  })
				  
			  }
		});
	}
	function loadOptData(data){
		data.shipmentid=data.shipment.shipmentid;
		shipInfo.value=data;
		productData.list=data.itemlist;
		loadCustoms(data.shipmentid)
	}
	function stepclick(step){
		emit("stepdata",step);
	}
	

	function handleToMaterial(row){
		 router.push({
			path:'/material/details',
			query:{
			  title:"产品详情",
			  path:'/material/details',
			  details:row.mid,
			}
		 })
	}
  defineExpose({loadOptData})
</script>

<style scoped>
	.icon-prin{
		display: flex;
		align-items: center;
	}
	.icon-prin .el-dropdown-link{
		margin-left: 8px;
		color: var(--el-color-primary);
	}
	.m-t-16{
		margin-top:16px;
	}
</style>
