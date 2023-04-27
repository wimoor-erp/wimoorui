<template>
	<h3 id="purchase" class="tab-scroll">采购信息</h3>
	<!-- <el-form-item label="采购员">
		<el-select class="in-wi-24" v-model="dataForms.buyer" placeholder="采购员">
				<el-option v-for="(item,index) in buyerList" :label="item.name" :value="item.id" />
		</el-select>
	</el-form-item> -->
	<el-form-item label="采购成本">
		<el-input v-model="dataBaseForms.price" type="text" @input="dataBaseForms.price=CheckInputFloat(dataBaseForms.price)" placeholder="请输入采购成本"></el-input>
	</el-form-item>
	<el-form-item label="供货周期">
		<el-input v-model="dataBaseForms.deliveryCycle" @input="dataBaseForms.deliveryCycle=CheckInputInt(dataBaseForms.deliveryCycle)" type="text" placeholder="请输入供货周期"></el-input>
	</el-form-item>
	<el-form-item label="供应商" class="grid-row">
		<el-table border :data="dataForms" >
			<el-table-column width="50" type="index">
						 <template #header >
							   <el-link :underline="false" type="primary" @click="addSupplier">
							   <plus  class="ic-cen" theme="outline" size="24" :strokeWidth="3"/>
							   </el-link>
						 </template>
			</el-table-column>
			<el-table-column label="供应商名称" width="240">
				<template #default="scope">
					<el-space :size="0">
					<div @click="selectSupplier(scope.row)">	
					<el-input v-model="scope.row.name" placeholder="选择供应商" ></el-input>
					</div>
					<el-button type="primary"  link  @click="jumpsupplier">
						<el-icon class="ic-cen font-small">
							<Edit />
						</el-icon>
						编辑</el-button>
					</el-space>
				</template>
			</el-table-column>
			<el-table-column label="首选" width="80">
				<template #default="scope">
					<el-switch
					    v-model="scope.row.isdefault"
						@change="changeIsdefault(scope.row)"
					    inline-prompt
					    active-text="是"
					    inactive-text="否"
					  />
				</template>
			</el-table-column>
			<el-table-column label="供货周期" width="160">
				<template #default="scope">
					<el-input v-model.number="scope.row.deliverycycle"  @input="scope.row.deliverycycle=CheckInputInt(scope.row.deliverycycle)" placeholder="默认为0">
						  <template #append>天</template>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column label="采购阶梯价" width="300" >
				<template #default="scope">
					<div class="position-edit" @click="editPrice(scope.row)">
					 <el-icon class="ic-cen"><Edit /></el-icon>	
					<el-table :data="scope.row.stepList" class="small-tab" border size="small">
						<el-table-column label="采购量">
							<template #default="scope">
								<span>{{scope.row.amount}}</span>
							</template>
						</el-table-column>
						<el-table-column label="币种" prop="currency">
							<template #default="scope">
								CNY
							</template>
						</el-table-column>
						<el-table-column label="采购单价" prop="price"/>
					</el-table>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="其它成本" width="100">
				<template #default="scope">
					<el-input v-model="scope.row.otherCost"  @input="scope.row.otherCost=CheckInputFloat(scope.row.otherCost)"  type="text"  ></el-input>
				</template>
			</el-table-column>
			<el-table-column label="供应商代码" width="120">
				<template #default="scope">
					<el-input v-model="scope.row.productCode"   type="text"  ></el-input>
				</template>
			</el-table-column>
			<el-table-column label="采购链接" width="120">
				<template #default="scope">
					<el-input v-model="scope.row.purchaseUrl"   type="textarea" :rows="4"></el-input>
				</template>
			</el-table-column>
			
			<el-table-column label="不良率" width="150">
				<template #default="scope">
					<el-input v-model="scope.row.badrate" @input="scope.row.badrate=CheckInputFloat(scope.row.badrate)"  placeholder="不良率">
						  <template #append>%</template>
					</el-input>
				</template>
			</el-table-column>
			
			<el-table-column fixed="right" label="操作" width="80">
				<template #default="scope">
					<el-link title="删除"  type="primary" :underline="false" @click="removeSupplier(scope.$index)">
						<minus  class="ic-cen" theme="outline" size="24"  :strokeWidth="3"/>
					</el-link>
				</template>
			</el-table-column>
		</el-table>
	</el-form-item>
	<SupplierDialog ref='supDiaRef' @getdata="getSupplierRows" />
	<!-- 采购价编辑弹窗 -->
	<PriceDialog ref ="priDiaRef" @getprice="getprice"/>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus} from '@icon-park/vue-next';
	import { ElMessage } from 'element-plus'
	import { ref,reactive,onMounted,watch,defineProps,toRefs } from 'vue'
	import SupplierDialog from "@/views/erp/baseinfo/supplier/supplier_dialog"
	import PriceDialog from"./purchase_price_dialog"
	import {useRouter } from 'vue-router';
	import {CheckInputFloat,CheckInputInt} from '@/utils/index';
	let router = useRouter();
	const supDiaRef =ref()
	const priDiaRef =ref()
	onMounted(()=>{
		 
	})
	let props = defineProps({
	  dataForms:Object,
	  dataBaseForms:Object
	})
	let state=reactive({
		nowRows:{},
	});
	 let {dataForms,dataBaseForms} =toRefs(props);
	 let { nowRows } =toRefs(state);
	 
	// let cusTableData =reactive([
	// 	{
	// 	 name:"义乌市烈火包装制品有限公司",
	// 	 currency:["CNY","USD"],
	// 	 price:"",
	// 	 check:true,
	// 	},
	// ])
	function jumpsupplier(){
		router.push({
			path:"/erp/baseinfo/supplier",
			query:{
				title:'供应商',
				path:'/erp/baseinfo/supplier',
			}
		})
	}
	function selectSupplier(row){
		state.nowRows=row;
		supDiaRef.value.show();
	}
	function addSupplier(){
		var row={};
		if(props.dataForms.length>0){
			row.isdefault=false;
		}else{
			row.isdefault=true;
		}
		row.stepList=[];
		row.name='';
		if(!props.dataForms || props.dataForms==null || props.dataForms==undefined || props.dataForms==undefined || props.dataForms=="null"){
			props.dataForms=[];
		}
		props.dataForms.push(row);
		// cusTableData.push({
		// 	name:"义乌市烈火包装制品有限公司",
		// 	currency:["CNY","USD"],
		// 	price:"",
		// 	check:false,
		// })
	}
	function editPrice(row){
		priDiaRef.value.priceVisable =true;
		state.nowRows=row;
		if(row.stepList && row.stepList.length>0){
			//不做处理
		}else{
			row.stepList=[{
				amount:'',
				currency:'0',
				price:'',
			}];
		}
		priDiaRef.value.tableData=row.stepList;
	}
	function getprice(data){
		state.nowRows.stepList=data;
	}
	function removeSupplier(index){
		props.dataForms.splice(index,1);
	}
	function getSupplierRows(row){
		 var name=row.name;
		 var ispush=true;
		 props.dataForms.forEach(function(item){
			 if(name==item.name){
				 ispush=false;
			 }
		 });
		 if(ispush==true){
			state.nowRows.name=row.name;
			state.nowRows.supplierid=row.id; 
		 }else{
			 ElMessage.error('已有重复的供应商！')
		 }
		
	}
	function changeIsdefault(row){
		var nowisdefault=row.isdefault;
		props.dataForms.forEach(function(item){
			item.isdefault=false;
		});
		if(nowisdefault==true){
			row.isdefault=true;
		}
	}
</script>

<style scoped>
	.position-edit{
		position: relative;
		border: 1px dashed #a4d8ff;
		border-color: transparent;
		cursor: pointer;
	}
	.position-edit .el-icon{
		position: absolute;
		left:0;
		top:0;
		z-index: 2;
		color:#007dff;
		font-size: 14px;
		opacity: 0;
	}
	.position-edit:hover{
		border-color:#a4d8ff;
	}
	.position-edit:hover .el-icon{
		opacity: 1;
	}
</style>
