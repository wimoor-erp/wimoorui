<template>
	<el-dialog   v-model="dialogVisible" title="FBA发货配置" width='1100px'>
		<el-table border :data="tableData">
			<el-table-column label="国家" width="100">
				<template #default="scope">
					<el-space>
						<el-image :src="scope.row.img"></el-image>
						<span>{{scope.row.country}}</span>
					</el-space>
				</template>
				
			</el-table-column>
			<el-table-column label="上架周期(天)" width="100">
				<el-input ></el-input>
			</el-table-column>
			<el-table-column label="安全库存周期(天)">
				<el-input ></el-input>
			</el-table-column>
			<el-table-column label="最小库存周期(天)">
				<el-input ></el-input>
			</el-table-column>
			<el-table-column label="运输渠道">
				<el-select></el-select>
			</el-table-column>
			<el-table-column label="头程周期(天)" width="100">
				<el-input ></el-input>
			</el-table-column>
			<el-table-column label="操作人" width="80"></el-table-column>
			<el-table-column label="操作时间"></el-table-column>
			<el-table-column label="操作" width="80">
				<el-link v-if="true" :underline="false" class="font-small" type="primary">编辑</el-link>
				<el-link v-else :underline="false" class="font-small" type="primary">保存</el-link>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script>
	import { ref ,reactive} from 'vue'
	export default {
	   name: 'index',
	   components: {
		   
	   },
	   setup(){
		   let dialogVisible =ref(false)
		   let tableData =reactive([
			   {
			    country:'墨西哥',
				img:'https://erp.wimoor.com/images/systempicture/Mexicanos.png',   
			   }
		   ])
	 		return{
				dialogVisible,
				tableData,
			}
	 }
	}
</script>

<style>
</style>
