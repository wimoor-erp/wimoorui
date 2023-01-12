<template>
	<el-table :data="tableData" border @select="handleSelect">
		<el-table-column type="selection"></el-table-column>
		<el-table-column label="盘点单编码" prop="code"></el-table-column>
		<el-table-column label="盘点仓库" prop="warehouse"></el-table-column>
		<el-table-column label="库存总数" prop="sumnum"></el-table-column>
		<el-table-column label="库存总金额" align="right" prop="sumprice"></el-table-column>
		<el-table-column label="盘盈金额" align="right" prop="up"></el-table-column>
		<el-table-column label="盘亏金额" align="right" prop="dowm"></el-table-column>
		<el-table-column label="盘点状态" prop="state">
			<template #default="scope">
				<el-tag :type="scope.row.state.type" >{{scope.row.state.label}}</el-tag>
			</template>
		</el-table-column>
		<el-table-column label="创建时间" prop="time"></el-table-column>
		<el-table-column label="备注" prop="remarks"></el-table-column>
		<el-table-column label="操作">
			<template #default='scope'>
			<el-space>
				<el-button @click="handleDetails(row)" type="primary" link>详情</el-button>
			  </el-space>	
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
	import {h,ref,reactive,toRefs} from 'vue'
	import {Download,Edit} from '@element-plus/icons-vue';
	import {MoreOne} from '@icon-park/vue-next';
	import { useRoute,useRouter } from 'vue-router'
	const router = useRouter()
	let detailsRef = ref()
	let state = reactive({
		tableData: [{
			code: 'da15wd1a8w9d',
			warehouse: '东莞(实际使用)',
			sumnum: 164664,
			sumprice:" ¥161561.05",
			up:" - ¥410.04",
			dowm:"-",
			state:{label:'盘点完成',type:'info'},
			time:"2022-11-24",
			remarks:'',
		}],
	})
	let {
		tableData,
	} = toRefs(state)
	function handleDetails(row){
		router.push({
			path:"/e/w/s/d",
			query:{
				title:'盘点单详情',
				path:"/e/w/s/d",
			},
		})
	}
</script>

<style>

</style>
