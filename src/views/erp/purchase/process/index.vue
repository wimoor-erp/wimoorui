<template>
	<div class="main-sty">
		<div class="con-header">
	    	<Header ref="headerRef" @getState="getState" @tabState="tabState" />
		</div>
		<div class="con-body">
			<GlobalTable
					height="calc(100vh - 220px)" 
					:queryParams="queryParams"
					@loadTable="loadtableData" 
					@selectionChange="handleSelectionChange"
			         >
				<template #field>
					<el-table-column type="selection" width="40"/>
				<el-table-column label="加工单编码" prop="code" width="130"/>
				 <el-table-column  prop="image" label="图片" width="65" >
					<template #default="scope">
					<el-image v-if="scope.row.image" :src="scope.row.image" class="product-img" ></el-image>
					<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img"  ></el-image>
				   </template>
				 </el-table-column>
				 <el-table-column label="名称/SKU"  show-overflow-tooltip>
					<template #default="scope">
					   <div class='name'>{{scope.row.name}}</div>
					   <div class='sku'>{{scope.row.sku}}
					   </div>
				   </template>
				 </el-table-column>
				<el-table-column label="操作仓库" prop="warhouse"/>
				<el-table-column label="单据类型" width="120">
					<template #default="scope">
						<el-tag :type="scope.row.state.style" effect="plain">{{scope.row.state.label}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="加工数量" prop="num" width="80"/>
				<el-table-column v-if="isShow" label="可处理数量" prop="num2" width="100"/>
				<el-table-column label="操作人" prop="operator"/>
				<el-table-column label="操作时间" prop="opttime">
					<template #default="scope">
						<span>{{scope.row.opttime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联货件" prop="shipment">
				<template #default="scope">
					<span>{{scope.row.shipment}}</span>
					<div v-if="scope.row.shipment!=''"><el-tag type="danger" size="small" effect="dark">优先组装</el-tag></div>
				</template>
				</el-table-column>
				<el-table-column label="备注" prop="remark"/>
				<el-table-column label="操作" width="80">
					<template #default='scope'>
					<el-space>
						<el-button @click="handleDetail(scope.row)" type="primary" link>详情</el-button>
					  </el-space>	
					</template>
				</el-table-column>
				</template>
			</GlobalTable>
		</div>
	</div>
</template>

<script setup>
	import Header from"./components/header.vue"
	import {ref,reactive,toRefs,onMounted,defineEmits,defineProps}from"vue"
	import {MoreOne,} from '@icon-park/vue-next';
	import {Histogram} from '@element-plus/icons-vue'
	import { ElMessage, ElMessageBox, ElDivider } from 'element-plus'
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const headerRef= ref()
	const state = reactive({
		queryParams:{},
		isShow:false,
	})
	const {
		queryParams,
		isShow,
	}=toRefs(state)
	function loadtableData(params,callback){
		callback({records:[
			{
				code: "PD202212300001",
				warhouse: '东莞外包仓-正品仓',
				name: '东莞外包）120PCS耳环项链显示卡板,配1',
				sku:'kq0000',
				num:200,
				num2:200,
				state:{label:"组装单",style:"warning"},
				operator:'张三',
				opttime:'2020-02-20',
				shipment:'FBA15GKKWCNN',
				remark:'',
			},
			{
				code: "PD202212300001",
				warhouse: '东莞外包仓-正品仓',
				name: '东莞外包）120PCS耳环项链显示卡板,配1',
				sku:'kq0000',
				num:200,
				num2:200,
				state:{label:"拆分单",style:"danger"},
				operator:'张三',
				opttime:'2020-02-20',
				shipment:'',
				remark:'',
			},
		],total:2})
	}
	function handleQuery(){
		state.queryParams.searchSession=new Date();
	}
	function handleDetail(){
		router.push({
			path:"/e/p/p/d",
			query:{
				title:'加工单详情',
				path:"/e/p/p/d",
			},
		})
	}
	function getState(val){
		console.log(val)
		if(val=='可处理'){
			state.isShow = true
		}else{
			state.isShow = false
		}
	}
	function tabState(val){
	if(val=='2'){
		state.isShow = true
	}else if(val=='1'){
		if(headerRef.value.state.radio=='可处理'){
			state.isShow = true
		}else{
			state.isShow = false
		}
	}else{
		state.isShow = false
	}
	  
	}
	onMounted(() => {
	  handleQuery();
	});
</script>

<style>
</style>
