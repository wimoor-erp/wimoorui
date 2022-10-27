<!-- 添加供应商时，共用的弹窗 -->

<template>
	<div >
		<el-dialog
		    v-model="suplierVisible"
		    title="选择供应商"
		    width="40%"
		    :before-close="handleClose"
		  >
		  <div class="con-header">
			  <el-row>
			<el-input   v-model="searchSku"  placeholder="搜索供应商">
				<template #suffix >
					<el-icon :size="16"><Search/></el-icon>
				</template>
			</el-input>
			</el-row>
			</div>
		   <el-table :data="tableData" border >
		   	<el-table-column prop="img" label="图片" width="60"> 
		   		<template #default="scope">
		   			<el-image :src="scope.row.image" width="40" height="40"></el-image>
		   		</template>
		   	</el-table-column>
		   	<el-table-column prop="product" label="名称/SKU" width="400" show-overflow-tooltip>
		   		<template #default="scope">
		   			<div class='name'>{{scope.row.name}}</div>
		   			<div class='sku'>{{scope.row.sku}} </div>
		   		</template>
		   	</el-table-column>
		   	<el-table-column prop="amount" label="可用库存" width="100"   />
		   	<el-table-column prop="quantity" label="产品类型"  >
		   		<template #default="scope">
		   			<el-tag>普通产品</el-tag>
		   		</template>
		   	</el-table-column>
		   </el-table>
		   <el-pagination background
		               layout="total, sizes, prev, pager, next, jumper"   
		               :total="total"
		               :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" 
		   			   style='margin-left:auto'
		               :current-page="page"  
		   			   @size-change="PaginationSize"   
		   			   @current-change="PaginationCurrent">
		   </el-pagination>
		    <template #footer>
		      <span class="dialog-footer">
		        <el-button @click="suplierVisible = false">取消</el-button>
		        <el-button type="primary" @click="submit"
		          >提交</el-button >
		      </span>
		    </template>
		  </el-dialog>
	</div>
</template>

<script>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import materialApi from '@/api/erp/material/materialApi.js';
	export default{
	    name: 'SupplierDialog',
	    components:{
			Search,
	    },
	    setup(){
			let suplierVisible=ref(false)
			let searchSku=ref('')
			let page =ref(1)
			let pagesize = ref(10)
	        //方法
			onMounted(()=>{
				loadData()
			})
			function loadData(){
				materialApi.getMaterialList().then((res)=>{
					
				})
			}
			function submit(){
			    suplierVisible.value=false
				console.log(suplierVisible.value)
			}
	        //数据接收
	        return{
	         suplierVisible,page,pagesize,
			 submit,
			 loadData,
	        }
	    }
	
	}
</script>

<style>
	.el-input__suffix{
		display: flex;
		align-items: center;
		font-size: 16px;
		padding-right:8px;
	}
</style>
