<template>
     <el-popover
	  :virtual-ref="props.assbRef"
	   virtual-triggering
	  @after-enter="handleQuery" placement="right" :width="600" trigger="click">
       <el-table :data="assemblyList" v-loading="loading">
          <el-table-column width="62" label="图片">
          			 <template #default="scope">
          			 	<el-image v-if="scope.row.image" :src="scope.row.image" width="40" height="40"></el-image>
          			 	<el-image v-else :src="require('@/assets/image/empty/noimage40.png')" width="40" height="40"></el-image>
          			 </template>
          </el-table-column>
          <el-table-column label="名称/子SKU" show-overflow-tooltip>
          	<template #default="scope">
          		<div class='name'>{{scope.row.mname}}</div>
          		<div class='sku'>{{scope.row.sku}} </div>
          	</template>
          </el-table-column>
          <el-table-column label="单价" width="60" >
          	<template #default="scope">
          		<el-popover
          		    placement="top-start"
          		    title="历史价格"
          		    :width="230"
          		    trigger="hover"
          		  >
          		<template #reference>
          		 <span class="pointer" v-html="scope.row.subprice"></span> 
          		</template>
          		<span  v-html="scope.row.historyprice"> </span>
          		</el-popover>
          	</template>
          </el-table-column>
          <el-table-column label="单位数量" prop="subnumber" width="80" >
			  <template #default="scope">
			    <span   v-if="scope.row.subnumber">{{scope.row.subnumber}} </span>
			    <span  v-else>0 </span>
			  </template>
          </el-table-column>
       
			   <el-table-column label="待入库" prop="subnumber" width="70" >
			   			  <template #default="scope">
			   			    <span class="font-extraSmall"  v-if="scope.row.inbound">{{scope.row.inbound}} </span>
			   			    	<span class="font-extraSmall"  v-else>0 </span>
			   			  </template>
			   </el-table-column>
			   <el-table-column label="可用" prop="subnumber" width="60" >
			   			  <template #default="scope">
			   			   <span  v-if="scope.row.fulfillable">{{scope.row.fulfillable}} </span>
			   			   	<span  v-else>0 </span>
			   			  </template>
			   </el-table-column>
			   <el-table-column label="待出库" prop="subnumber" width="70" >
			   			  <template #default="scope">
			   			   <span class="font-extraSmall" v-if="scope.row.outbound">{{scope.row.outbound}} </span>
			   			   	<span class="font-extraSmall" v-else>0 </span>
			   			  </template>
			   </el-table-column>
       </el-table>
     </el-popover>
</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs,unref} from 'vue'
	let props = defineProps({ assemblyList:[] , loading:false ,assbRef:{}});
	const emit = defineEmits(['change']);
	const { assemblyList,loading} = toRefs(props);
	function handleQuery(){
		emit("change");
	}
	function handleClick(){
		
	}
	 defineExpose({ handleClick})
</script>

<style scoped>
	.asslistiteminv{
		 text-align:right 
	}
	.asslistitemtable, .asslistitemtable td,.asslistitemtable tr{
		border:none;
		background:none;
	}
</style>