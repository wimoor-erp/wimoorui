<template>
	<div class="main-sty">
		<div class="con-header">
		<el-row>
			<el-space>
		<Owner @owner="changeOwner" ref="ownerRef" ></Owner>
		<Group ref="groups" @change="getData" defaultValue="all"/>
		<Currency ref="currencyRef" @change="getData" />
		<DatepickerMonth ref="datepickers" @changedate="changedate" />
		<el-button @click="clearSearch">重置</el-button>
		</el-space>
		</el-row>	
		<el-row>
				<el-button >导出</el-button>
			<div class="rt-btn-group">
				<el-button   class='ic-btn' title='帮助文档'>
					<help theme="outline" size="16" :strokeWidth="3"/>
				</el-button>
			</div>
		</el-row>
		</div>
		<div class="con-body">
			<Table/>
		</div>
	</div>
</template>

<script setup>
	import Group from '@/components/header/group.vue';
	import Currency from '@/components/header/currency.vue';
	import DatepickerMonth from '@/components/header/datepicker_month.vue';
	import { ref,reactive,onMounted,toRefs} from 'vue'
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue'
	import {Help,} from '@icon-park/vue-next';
	import Table from"./components/table.vue"
	import Owner from '@/components/header/owner.vue';
	import {useRouter } from 'vue-router'
	const router = useRouter()
	const currencyRef=ref()
	const state=reactive({
		queryParam:{},
	})
	const {
		queryParam,
	}=toRefs(state)
	
	function clearSearch(){
		currencyRef.value.reset()
	}
	
	function handleAdd(){
		router.push({
			path:"/f/c/c",
			query:{
				title:'添加分摊费用',
				path:"/f/c/c",
			},
		})
	}
	
	
</script>

<style>
	.font-32{
		font-size:32px;
	}
</style>
