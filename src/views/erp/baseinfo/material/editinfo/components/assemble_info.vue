<template>
	<h3 id="assemble" class="tab-scroll">组合信息</h3>
	<el-form-item label="子产品列表" class="grid-row">
		<el-table border :data="cusTableData">
			<el-table-column width="50" type="index">
						 <template #header >
							   <el-link :underline="false" type="primary" @click="addSubSku">
							   <plus  class="ic-cen" theme="outline" size="24" :strokeWidth="3"/>
							   </el-link>
						 </template>
			</el-table-column>
			<el-table-column width="62" label="图片">
						 <template #default="scope">
						 	<el-image :src="scope.row.img" width="40" height="40"></el-image>
						 </template>
			</el-table-column>
			<el-table-column label="名称/子SKU">
				<template #default="scope">
					<div class='name'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sku}} </div>
				</template>
			</el-table-column>
			<el-table-column label="成本单价" width="300" >
				<template #default="scope">
					<el-popover
					    placement="top-start"
					    title="历史价格"
					    :width="200"
					    trigger="hover"
					  >
					    <template #reference>
					     <span class="pointer">{{scope.row.stock}}</span> 
					    </template>
						<el-table :data="priceTableData" class="small-tab" border>
							<el-table-column label="时间">
								<template #default="scope">
									<span>{{scope.row.starnum}}</span>-{{scope.row.endnum}}
								</template>
							</el-table-column>
							<el-table-column label="币种" prop="currenty"/>
							<el-table-column label="采购单价" prop="price"/>
						</el-table>
					  </el-popover>
				</template>
			</el-table-column>
			<el-table-column label="单位数量" width="120" />
			<el-table-column label="可用库存" width="150" />
			<el-table-column fixed="right" label="操作" width="80">
				<template #default="scope">
					<el-link title="删除"  type="primary" :underline="false" @click="removeSubSku(scope.$index)">
						<minus  class="ic-cen" theme="outline" size="24"  :strokeWidth="3"/>
					</el-link>
				</template>
			</el-table-column>
		</el-table>
	</el-form-item>
	<el-form-item label="成本单价">
		<el-input v-model="form.price" class="in-wi-24">
			 <template #append>CNY</template>
		</el-input>
	</el-form-item>
	<MateiralDialog ref='MateiralDialogRef' @getdata="getSubSku"/>
</template>

<script>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,Minus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	import MateiralDialog from "@/views/erp/baseinfo/material/mateiralDialog.vue"
	import {useRouter } from 'vue-router'
	export default{
		components: {
			Plus,Edit,Minus,
			MateiralDialog,
		},
		setup(){
			let router = useRouter();
			let MateiralDialogRef =ref()
			let form = {
				name:'',
				price:'',
				type:"",
				person:'',
			}
			let cusTableData =reactive([])
			function addSubSku(){
				MateiralDialogRef.value.dialogVisible = true
			}
			function getSubSku(rows){
				console.log(rows)
			}
			function removeSubSku(index){
				cusTableData.splice(index,1)
			}
			return{
				getSubSku,
				MateiralDialogRef,
				form,
				addSubSku,
				removeSubSku,
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
