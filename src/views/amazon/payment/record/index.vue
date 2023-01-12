<template>
	<div class="main-sty">
		<div class="con-header">
			<el-row>
			<el-space>
			   <el-radio-group v-model="radio">
			      <el-radio-button label="全部" />
			      <el-radio-button label="已结算" />
			      <el-radio-button label="未结算" />
			    </el-radio-group>
		<!-- <Group @change="getGroup" isproduct="ok" /> -->
		<el-select v-model="currentyType">
			<el-option v-for="item in currentyOptions" :label="item.label" :value="item.value"></el-option>
		</el-select>
		<div class="date-picker-group">
			<el-select v-model="dateType">
				<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<Datepicker ref="datepickers" @changedate="changedate" />
		</div>
		<el-button>重置</el-button>
		</el-space>
        <div class='rt-btn-group'>
					<el-button class='ic-btn' title='帮助文档'>
						<help theme="outline" size="16" :strokeWidth="3" />
					</el-button>
				</div>
				</el-row>
		</div>
		
		<div class="con-body">
			<el-row :gutter="16" class="m-b-16">
				<el-col :span="6">
					<el-card shadow="never">
						<div class="flex-center">
							<div class="r-icon">
								<bank-transfer class="ic-cen" theme="filled" size="20" fill="var(--el-color-primary)"/>
							</div>
							<div class="l-data">
								<div class="title">未结算金额</div>
								<div class="data">¥5,530,041.31</div>
							</div>
						</div>
					</el-card>
				</el-col><el-col :span="6">
					<el-card shadow="never">
						<div class="flex-center">
							<div class="r-icon">
								<bank-transfer class="ic-cen" theme="filled" size="20" fill="var(--el-color-success)"/>
							</div>
							<div class="l-data">
								<div class="title">已结算金额</div>
								<div class="data">¥21,483,677.63</div>
							</div>
						</div>
					</el-card>
				</el-col><el-col :span="6">
					<el-card shadow="never">
						<div class="flex-center">
							<div class="r-icon">
								<bank-transfer class="ic-cen" theme="filled" size="20" fill="var(--el-color-blue)"/>
							</div>
							<div class="l-data">
								<div class="title">总金额</div>
								<div class="data">¥27,013,718.94</div>
							</div>
						</div>
					</el-card>
				</el-col><el-col :span="6">
					<el-card shadow="never">
						<div class="flex-center">
							<div class="r-icon">
								<bank-transfer class="ic-cen" theme="filled" size="20" fill="var(--el-color-info)"/>
							</div>
							<div class="l-data">
								<div class="title">转账失败金额</div>
								<div class="data">¥0.00</div>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<el-table border :data="tableData">
				<el-table-column  label="店铺">Kuwai</el-table-column>
				<el-table-column label="国家" >美国</el-table-column>
				<el-table-column label="结算周期" >2022/02/22-2022-06-16</el-table-column>
				<el-table-column label="状态" >
					<template #default="scope">
						<el-tag type="success">已结算</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="存款总计" >USD 95,288.83</el-table-column>
				<el-table-column label="转账日期">2022/02/22</el-table-column>
				<el-table-column label="转账状态"><el-tag type="success">成功</el-tag></el-table-column>
				<el-table-column label="操作">
					<template #default="scope">
						<el-button type="primary" link>下载明细</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup>
	import {ref,reactive,toRefs,onMounted}from"vue"
	import {Help,BankTransfer} from '@icon-park/vue-next';
	import Datepicker from '@/components/header/datepicker.vue';
	import Group from '@/components/header/group.vue';
	let state = reactive({
		radio:'全部',
		currentyType:'1',
		dateType:'1',
		dateOptions:[{label:'结算日期',value:'1'},{label:'转账日期',value:'2'}],
		currentyOptions:[{label:'原币种',value:'1'},{label:'CNY',value:'2'},{label:'USD',value:'3'}],
	})
	let tableData =reactive([
        {}
	])
	let {radio,currentyType,currentyOptions,dateType,dateOptions}=toRefs(state)
</script>

<style scoped="scoped">
	.r-icon{
		background-color:var(--el-color-info-lighter) ;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}
	.l-data{
		margin-left:16px;
	}
	.l-data .title{
		color:#666;
		font-size:12px;
		margin-bottom: 4px;
	}
	.l-data .data{
		font-size: 18px;
		font-weight: 700;
	}
	.m-b-16{
		margin-bottom: 16px;
	}
</style>