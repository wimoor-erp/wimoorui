<template>
     <el-popover ref="assemblyPopRef" @after-enter="handleQuery" placement="right" :width="600" trigger="click">
       <template #reference>
		   <slot  name="field"></slot>
       </template>
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
          <el-table-column label="成本单价" width="120" >
          	<template #default="scope">
          		<el-popover
          		    placement="top-start"
          		    title="历史价格"
          		    :width="200"
          		    trigger="hover"
          		  >
          		<template #reference>
          		 <span class="pointer" v-html="scope.row.subprice"></span> 
          		</template>
          		<span  v-html="scope.row.historyprice"> </span>
          		  </el-popover>
          	</template>
          </el-table-column>
          <el-table-column label="单位数量" prop="subnumber" width="120" >
          </el-table-column>
          <el-table-column label="可用库存" prop="fulfillable"  width="120" />
       </el-table>
     </el-popover>
</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs} from 'vue'
	const assemblyPopRef=ref();
	let props = defineProps({ assemblyList:[] , loading:false });
	const emit = defineEmits(['change']);
	const { assemblyList,loading} = toRefs(props);
	function handleQuery(){
		emit("change");
	}
</script>

<style>
</style>