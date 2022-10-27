<template>
	<h3 id="purchase" class="tab-scroll">采购信息</h3>
	<el-form-item label="采购员">
		<el-select class="in-wi-24" v-model="form.brand" placeholder="采购员">
				<el-option label="Zone one" value="shanghai" />
				<el-option label="Zone two" value="beijing" />
		</el-select>
	</el-form-item>
	<el-form-item label="供应商" class="grid-row">
		<el-table border :data="cusTableData" >
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
					<div @click="selectSupplier">	
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
					    v-model="scope.row.check"
					    inline-prompt
					    active-text="是"
					    inactive-text="否"
					  />
				</template>
			</el-table-column>
			<el-table-column label="供货周期" width="160">
				<template #default="scope">
					<el-input  placeholder="默认为0">
						  <template #append>天</template>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column label="采购阶梯价" width="300" >
				<template #default="scope">
					<div class="position-edit" @click="editPrice">
					 <el-icon class="ic-cen"><Edit /></el-icon>	
					<el-table :data="priceTableData" class="small-tab" border size="small">
						<el-table-column label="采购量">
							<template #default="scope">
								<span>{{scope.row.starnum}}</span>-{{scope.row.endnum}}
							</template>
						</el-table-column>
						<el-table-column label="币种" prop="currenty"/>
						<el-table-column label="采购单价" prop="price"/>
					</el-table>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="采购链接" width="120">
				<template #default="scope">
					<el-input    type="textarea" :rows="4"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="税率" width="170">
				<template #default="scope">
					<el-input v-model="scope.row.tax"  placeholder="为空不含税">
						  <template #append>%</template>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column label="不良率" width="150">
				<template #default="scope">
					<el-input v-model="scope.row.badrate"  placeholder="不良率">
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
	<SupplierDialog ref='supDiaRef'/>
	<!-- 采购价编辑弹窗 -->
	<PriceDialog ref ="priDiaRef" @getprice="getprice"/>
</template>

<script>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	import SupplierDialog from "@/views/erp/baseinfo/supplier/supplier_dialog"
	import PriceDialog from"./purchase_price_dialog"
	import {useRouter } from 'vue-router'
	export default{
		components: {
			Plus,Edit,Minus,
			SupplierDialog,PriceDialog,
		},
		setup(){
			let router = useRouter();
			let supDiaRef =ref()
			let priDiaRef =ref()
			let priceTableData =ref()
			let form = {
				name:'',
				brand:'',
				type:"",
				person:'',
			}
			let cusTableData =reactive([
				{
				 name:"义乌市烈火包装制品有限公司",
				 currency:["CNY","USD"],
				 price:"",
				 check:true,
				},
			])
			function jumpsupplier(){
				router.push({
					path:"/erp/baseinfo/supplier",
					query:{
						title:'供应商',
						path:'/erp/baseinfo/supplier',
					}
				})
			}
			function selectSupplier(){
				supDiaRef.value.suplierVisible = true
			}
			function addSupplier(){
				cusTableData.push({
					name:"义乌市烈火包装制品有限公司",
					currency:["CNY","USD"],
					price:"",
					check:false,
				})
			}
			function editPrice(){
				priDiaRef.value.priceVisable =true
			}
			function getprice(data){
				priceTableData.value =data
			}
			function removeSupplier(index){
				cusTableData.splice(index,1)
			}
			return{
				priDiaRef,
				editPrice,
				supDiaRef,
				form,
				cusTableData,
				selectSupplier,
				jumpsupplier,
				getprice,
				priceTableData,
				addSupplier,
				removeSupplier,
			}
		}
		}
</script>

<style>
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
