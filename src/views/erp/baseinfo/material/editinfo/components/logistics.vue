<template>
	<h3 id="logistics" class="tab-scroll">物流信息</h3>
	<el-form-item label="申报单价" >
		<el-input class="in-wi-24" v-model="price" placeholder="申报单价">
			 <template #append>
			      <el-select class='wi-100'  v-model="select" placeholder="USD" >
			                <el-option label="USD" value="1" />
			                <el-option label="CNY" value="2" />
			                <el-option label="ES" value="3" />
			              </el-select>
			      </template>
		</el-input>
	</el-form-item>
	<el-form-item label=" 中文报关名" >
		<el-input class="in-wi-24" v-model="name" placeholder="中文报关名"> </el-input>
	</el-form-item>
	<el-form-item label=" 英文报关名" >
		<el-input class="in-wi-24" v-model="name" placeholder="英文报关名"> </el-input>
	</el-form-item>
	<el-form-item label="特殊属性" >
	<el-checkbox-group v-model="checkedattributes" size="default">
	    <el-checkbox v-for="item in attributes" :key="item" :label="item" >{{ item }}</el-checkbox>
	  </el-checkbox-group>
	</el-form-item>
	<el-form-item label="物流报关">
	 <el-table border :data="tableData">
		 <el-table-column label="国家" prop="country"></el-table-column>
		 <el-table-column label="默认头程费用" prop="fee">
			 <template #default="scope">
				 <el-input v-model="scope.row.fee">
					 <template #append>
						<el-select v-model="scope.row.checkFee" class="wi-100">
							<el-option label="USD" value="usd"></el-option>
						</el-select> 
					 </template>
				 </el-input>
			 </template>
		 </el-table-column>
		 <el-table-column label="海关编码" >
			 <template #default="scope">
					 <el-input v-model="scope.row.code"> </el-input>
			 </template>
		 </el-table-column>
		 <el-table-column label="税率">
			  <template #default="scope">
			 <el-input v-model="scope.row.taxrate">
					 <template #append>
						%
					 </template>
			 </el-input>
			 </template> 
		 </el-table-column>
	 </el-table>
	</el-form-item>
</template>

<script>
	import {} from '@element-plus/icons-vue'
	import {Plus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		components: {
		Plus,
		},
		setup(){
			let checkedattributes=ref([])
			let attributes = [
				"带电","带磁","液体","粉末","膏体","纯电"
			]
			let tableData=reactive([
				{
					country:'美国',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'德国',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'法国',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'英国',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'加拿大',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'意大利',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'西班牙',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				{
					country:'日本',
					fee:'',
					code:'',
					taxrate:'',
					checkFee:'usd',
				},
				
			])
			return{
				attributes,
				checkedattributes,
				tableData,
			}
		}
		}
</script>

<style>
	.wi-100{
		width:100px;
	}
	
</style>
