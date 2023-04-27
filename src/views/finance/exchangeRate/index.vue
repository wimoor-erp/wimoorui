<template >
	<div class="main-sty">
		<div class="con-header">
			<el-row>
				<el-space>
					<el-button >导出</el-button>
					<DatepickerMonth ref="datepickers" @changedate="changedate" />
				</el-space>
			</el-row>
		</div>
       <el-table :data="tableData">
		<el-table-column label="货币"  prop="currency" />
		<el-table-column label="货币代码"  prop="code" />
		<el-table-column label="兑换币" prop="change"></el-table-column>
		<el-table-column label="官方汇率"  prop="office"></el-table-column>
		<el-table-column label="我的汇率" prop="system" >
			<template #default="scope">
				 <el-popover placement="left" :width="160" trigger="click">
				      <template #reference>
						  <span class="table-edit-flex">
						  <span>{{scope.row.system}}</span>
						  <el-icon ><Edit/></el-icon>
						  </span>
				      </template>
					  
				      <el-input type="number" v-model="scope.row.system2"></el-input>
					  <div class="m-t-8">
						  <el-button>取消</el-button>
						  <el-button type="primary">确认</el-button>
					  </div>
				    </el-popover>
			</template>
		</el-table-column>
		<el-table-column label="生效时间" prop="date">	</el-table-column>
        </el-table>
	</div>
</template>

<script setup>
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import DatepickerMonth from '@/components/header/datepicker_month.vue';
	import {Edit} from '@element-plus/icons-vue'
	const state = reactive({
			tableData:[
			{
				currency:'美元（$）',
				code:'USD',
				change:'人民币',
				office:'6.3757',
				system:'7.0000',
				date:'2023-02',
			},
			{
				currency:'欧元（€）',
				code:'EUR',
				change:'人民币',
				office:'6.3757',
				system:'7.0000',
				date:'2023-02',
			},
			{
				currency:'英镑（￡）',
				code:'GBP',
				change:'人民币',
				office:'8.6064',
				system:'8.4788',
				date:'2023-02',
			}
		]
	})
	const{
		tableData,
	}=toRefs(state)
	
</script>

<style >
</style>
 