<template>
	<GlobalTable 
			height="calc(100vh - 290px)" 
			:queryParams="queryParams"
			@loadTable="loadtableData" 
			@selectionChange="handleSelectionChange"
	        border >
		<template #field>
		<el-table-column type="selection"></el-table-column>
		<el-table-column label="备货单号" prop="number" width="120"></el-table-column>
		<el-table-column label="发货仓库" prop="warhouse"></el-table-column>
		<el-table-column label="海外仓库" prop="overseas"></el-table-column>
		<el-table-column label="预计到货日期" prop="time"></el-table-column>
		<el-table-column label="状态" prop="state">
			<template #default="scope">
				<el-tag :type="scope.row.state.style">{{scope.row.state.label}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="SKU个数"  prop="skuNum"></el-table-column>
		<el-table-column label="创建人" width="100" prop="operator"></el-table-column>
		<el-table-column label="创建时间" prop="opttime">
			<template #default="scope">
				<span>{{scope.row.opttime}}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default='scope'>
			<el-space>
				<el-button @click="handleDetail(scope.row)" type="primary" link>详情</el-button>
				<el-popover :visible="visible" placement="left" :width="320" trigger="click">
					<el-form>
						<el-form-item label="审核结果">
							<el-radio-group v-model="radio1" >
							      <el-radio label="1" >通过</el-radio>
							      <el-radio label="2" >驳回</el-radio>
							 </el-radio-group>
						</el-form-item>
						<el-form-item label="审核意见">
							 <el-input type="textarea"  maxlength="50" show-word-limit></el-input>
						</el-form-item>
					</el-form>
				    <div>
				      <el-button   @click="visible = false">取消</el-button>
				      <el-button  type="primary" @click="visible = false"
				        >确认</el-button
				      >
				    </div>
				    <template #reference>
				     <el-button v-if="scope.row.state.label=='待审核'"  type="primary" link>审核</el-button>
				    </template>
				  </el-popover>
				<el-dropdown v-if="scope.row.state.label=='待审核'" :hide-on-click="false">
				  <span class="el-dropdown-link">
				    <more-one class="ic-cen" theme="outline" size="16" fill="#333" :strokeWidth="3"/>
				  </span>
				   <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item @click.stop="deleteInfo(scope.row)">编辑</el-dropdown-item>
				    </el-dropdown-menu>
				</template>
				</el-dropdown>
			  </el-space>	
			</template>
		</el-table-column>
		</template>
	</GlobalTable>
</template>

<script setup>
	import {ref,reactive,toRefs,onMounted,defineEmits,defineProps}from"vue"
	import {MoreOne} from '@icon-park/vue-next';
	import { ElMessage, ElMessageBox, } from 'element-plus'
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const props = defineProps({
		queryParams:Object,
	})
    function loadtableData(params,callback){
		callback({records:[
			{
				number:'4dad48awd',
				warhouse:'龙华仓',
				overseas:'澳洲仓',
				state:{label:"已发货",style:"success"},
				skuNum:5,
				operator:'张三',
				opttime:'2020-02-20',
				time:'2020-02-20',
			},
			{
				number:'4dad48awd',
				warhouse:'龙华仓',
				overseas:'澳洲仓',
				state:{label:"待审核",style:"warning"},
				skuNum:5,
				operator:'张三',
				opttime:'2020-02-20',
				time:'2020-02-20',
			}
		],total:2})
	}
	function handleQuery(){
		props.queryParams.searchSession=new Date();
	}
	function handleDetail(){
		router.push({
			path:"/e/w/o/d",
			query:{
				title:'备货单详情',
				path:"/e/w/o/d",
			},
		})
	}
	onMounted(() => {
	  handleQuery();
	});
</script>

<style>
</style>
