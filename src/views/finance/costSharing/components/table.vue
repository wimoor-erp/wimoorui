<template >
	<div class=" expand-table">
	<GlobalTable
	:defaultSort="defaultSort" 
	 show-summary
	 @selectionChange='selectChange'
	 :tableData="tableData"
	 height="calc(100vh - 220px)"  @loadTable="loadTableData" >
		<template #field>
			<el-table-column type="expand" width="65" >
				 <template #default="props">
					<el-table :data="props.row.subTable">
						<el-table-column label="店铺" width="150" prop="group" />
						<el-table-column label="国家" width="150" prop="market" />
						<el-table-column label="分摊产品"  prop="market" show-overflow-tooltip>
							<template #default="scope">
								<div class="flex-center">
									<el-image class="  product-img" :src="scope.row.image"></el-image>
									<div class="m-l-8">
										<div class="name">{{scope.row.name}}</div>
										<div class="sku">{{scope.row.sku}}</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="分摊金额" prop="amount">
							<template #default="scope">
								<span>{{scope.row.currency}}{{scope.row.amount}}</span>
							</template>
						</el-table-column>
						<el-table-column label="备注" prop="remarks"/>
					</el-table>
				 </template>	 
			</el-table-column>
		<el-table-column label="单据号" width="150" prop="code" />
		<el-table-column label="分摊日期" prop="date"></el-table-column>
		<el-table-column label="费用类型"  prop="feeType"></el-table-column>
		<el-table-column label="金额" prop="amount">
			<template #default="scope">
				<span>{{scope.row.currency}}{{scope.row.amount}}</span>
			</template>
		</el-table-column>
		<el-table-column label="创建人" prop="operator">	</el-table-column>
		<el-table-column label="创建日期" prop="createDate">	</el-table-column>
		<el-table-column label="备注" prop="remarks"/>
		<el-table-column label="操作" width="140">
			<template #default="scope">
				<el-button type="primary" link @click="handleDetail(scope.row)">编辑</el-button>
				    <el-popover :visible="scope.row.desVisible" placement="left"   trigger="click" >
				      <p >确认要删除吗？删除后分摊的费用将退回！</p>
				      <div class="m-t-8">
				        <el-button size="small"  @click="scope.row.desVisible = false">取消</el-button>
				        <el-button size="small" type="primary" @click="scope.row.desVisible = false"
				          >确认</el-button
				        >
				      </div>
				      <template #reference>
						  <el-button type="primary" link @click="scope.row.desVisible=true">删除</el-button>
				      </template>
				    </el-popover>
			</template>
		</el-table-column>
		</template>
	</GlobalTable>
	</div>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const state = reactive({
		tableData:{
			records:[
			{
				code:'PF15885664',
				feeType:'测评费用',
				date:'2023-02-16',
				amount:'156.05',
				currency:'￥',
				operator:'张三',
				createDate:'2023-02-20',
				remarks:'-',
				subTable:[
					{
					image:require('@/assets/image/testpic.png'),
					group:'akhd',
					market:'美国',
					name:'Confetti Balloons 60 Pack Pastel Yellow White Party Balloon for Sunflower',
					sku:'kq005',
					amount:'56.05',
					currency:'￥',
					remarks:'-',
					},
					{
					image:require('@/assets/image/testpic.png'),
					group:'akhd',
					market:'英国',
					name:'Confetti Balloons 60 Pack Pastel Yellow White Party Balloon for Sunflower',
					sku:'kq006',
					amount:'100.00',
					currency:'￥',
					remarks:'-',
					}
				],
			}
		],total:1}
	})
	const{
		tableData,
	}=toRefs(state)
	
	function handleDetail(){
		router.push({
			path:"/f/c/c",
			query:{
				title:'编辑分摊费用',
				path:"/f/c/c",
			},
		})
	}
</script>

<style >
	.expand-table .el-table__expanded-cell{
		padding:0px;
	}
	.expand-table .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
	.m-l-8{
		margin-left: 8px;
	}
</style>
 