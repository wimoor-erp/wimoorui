<template>
	<div class="pag-radius-bor m-t-16">
		<el-row>
		<el-space>
		<el-button type="primary"  @click="dialogVisable=true">
		  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
		  <span>记账</span>
		</el-button>
		<el-button @click="feeVisable=true">费用项管理</el-button>
		<el-button>导出</el-button>
		</el-space>
		<div class="rt-btn-group">
			<el-space>
			<Datepicker ref="datepickers" @changedate="changedate" />
			<el-select v-model="selectLabel" class="with-select">
				<el-option v-for="item in options" :label="item.name" :value="item.value"></el-option>
			</el-select>
			</el-space>
	  <el-input 
	  placeholder="费用项"
	  v-model="searchWord">
	  <template #suffix>
	       <el-icon class="ic-cen font-medium">
	        <search />
	     </el-icon>
	  </template>
	  </el-input>
		</div>
		</el-row>
		<el-row class="m-t-16 expand-table-bg">
			<GlobalTable
			:defaultSort="defaultSort" 
			 @selectionChange='selectChange'
			 :tableData="tableData"
			 height="calc(100vh - 220px)"  @loadTable="loadTableData" >
				<template #field>
					<el-table-column type="expand" width="65" >
						 <template #default="props">
							<el-table :data="props.row.subTable">
								<el-table-column label="时间"  prop="time" />
								<el-table-column label="收支项" prop="fee" />
								<el-table-column label="关联单号" prop="code" />
								<el-table-column label="关联SKU" prop="sku" />
								<el-table-column label="金额(￥)" prop="amount" />
								<el-table-column label="备注" prop="remarks"/>
							</el-table>
						 </template>	 
				</el-table-column>
				<el-table-column label="日期" prop="date"/>
				<el-table-column label="收入(￥)" prop="income"/>
				<el-table-column label="支出(￥)" prop="pay"/>
				<el-table-column label="结余" prop="amount"/>
				</template>
			</GlobalTable>
		</el-row>
	</div>
	<el-dialog
	width="480px"
	title="记账" 
	:rules="rules"
	v-model="dialogVisable"
	>
	<el-form v-model="form" label-width="60px">
		<el-form-item label="费用类型">
		<el-radio-group v-model="form.radio" class="ml-4">
		  <el-radio label="1" >收入</el-radio>
		  <el-radio label="2" >支出</el-radio>
		</el-radio-group>
		</el-form-item>
		<el-form-item label="收支项目">
           <el-select  v-model="form.select">
			   <el-option v-for="(item,index) in options2" :label="item.name"  :value="item.value"  > </el-option>
		   </el-select>
		</el-form-item>
		<el-form-item label="金额">
           <el-input type="number" v-model="form.amount">
			   <template #suffix>
			   ￥
			   </template>
		   </el-input>
		</el-form-item>
		<el-form-item label="备注" prop="remarks">
			<el-input type="textarea"  v-model="form.remarks"></el-input>
		</el-form-item>
	</el-form>
	 <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialogVisable = false">取消</el-button>
	        <el-button type="primary" @click="handleConfirm">
	          确认
	        </el-button>
	      </span>
	    </template>
	</el-dialog>
<el-dialog v-model="feeVisable" title="费用项管理">
		<el-button @click="handleAdd"   >添加费用类型</el-button>
	    <el-table :data="feeTableData" class="m-t-8">
	      <el-table-column  label="费用名称"  >
		  <template #default="scope">
		  		<el-input clearable placeholder="请输入" v-model="scope.row.name" ></el-input>
		  </template>
		  </el-table-column>
	      <el-table-column  label="操作"  >
		     <template #default="scope">
				 <el-button v-if="scope.$index>0" type="primary"
				  @click="handleDelete(scope.$index)"
				  link>删除</el-button>
			 </template>
		  </el-table-column>
	    </el-table>
		 <template #footer>
		        <el-button @click="feeVisable = false">取消</el-button>
		        <el-button type="primary" @click="handleConfirm">
		          保存
		        </el-button>
		    </template>
	  </el-dialog>
</template>

<script setup>
	import {Plus,} from '@icon-park/vue-next';
	import {Search} from '@element-plus/icons-vue'
	import { ref,reactive,onMounted,watch,toRefs,computed} from 'vue'
	import Datepicker from '@/components/header/datepicker.vue';
	const state = reactive({
		feeTableData:[
			{name:''}
		],
		dialogVisable:false,
		feeVisable:false,
		form:{
			radio:'1',
			amount:'',
			remarks:'',
			select:'1',
		},
		options:[
			{name:'全部收支项',value:'0'},
			{name:'采购货款',value:'1'},
			{name:'运费',value:'2'},
			{name:'样品费用',value:'3'},
		],
		selectLabel:'0',
		searchWord:'',
		tableData:{
			records:[
			{
				date:'2023-02-16',
				income:'156.05',
				pay:'0',
				amount:'3163881.18',
				subTable:[
					{
					time:'16:08',
					sku:'kq005',
					fee:'采购货款',
					code:'DAED58DWA',
					amount:'56.05',
					remarks:'-',
					},
				],
			}
		],total:1}
	})
	const {
		options,
		selectLabel,
		searchWord,
		tableData,
		feeTableData,
		dialogVisable,
		form,
		feeVisable,
	} = toRefs(state)
	const options2 = computed(()=>{
		
		var arr =[]
		state.options.forEach((item,index)=>{
			 arr.push(item)
		})
		arr.shift()
		return arr
	})
	
	function handleAdd(){
		state.feeTableData.push(
		 {
			 name:'',
		 }
		)
	}
</script>

<style scoped="scoped">
	.with-select{
		width: 120px;
	}

</style>
<style>
	.expand-table-bg .el-table__expanded-cell{
		padding:0px;
	}
	.expand-table-bg .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
	.expand-table-bg .el-table__expanded-cell .el-table__inner-wrapper::before{background-color:var(--el-fill-color-lighter)}
</style>