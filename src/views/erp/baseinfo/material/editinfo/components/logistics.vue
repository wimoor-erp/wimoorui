<template>
	<h3 id="logistics" class="tab-scroll">物流信息</h3>
	<el-form-item label="申报单价" >
		<el-input class="in-wi-24" v-model="dataForms.unitprice" @input="dataForms.unitprice=CheckInputFloat(dataForms.unitprice)" placeholder="申报单价">
			 <template #append>
			      <el-select class='wi-100'  v-model="dataForms.currency" placeholder="CNY" >
					        <el-option label="CNY" value="CNY" />
			                <el-option label="USD" value="USD" />
			                <el-option label="EUR" value="EUR" />
			              </el-select>
			      </template>
		</el-input>
	</el-form-item>
	<el-form-item label=" 中文报关名" >
		<el-input class="in-wi-24" v-model="dataForms.nameCn" placeholder="中文报关名"> </el-input>
	</el-form-item>
	<el-form-item label=" 英文报关名" >
		<el-input class="in-wi-24" v-model="dataForms.nameEn" placeholder="英文报关名"> </el-input>
	</el-form-item>
	<el-form-item label=" 产品材质" >
		<el-input class="in-wi-24" v-model="dataForms.material" placeholder="产品材质"> </el-input>
	</el-form-item>
	<el-form-item label=" 产品型号" >
		<el-input class="in-wi-24" v-model="dataForms.model" placeholder="产品型号"> </el-input>
	</el-form-item>
	<el-form-item label=" 产品用途" >
		<el-input class="in-wi-24" v-model="dataForms.materialUse" placeholder="产品用途"> </el-input>
	</el-form-item>
	<el-form-item label=" 产品品牌" >
		<el-input class="in-wi-24" v-model="dataForms.brand" placeholder="产品品牌"> </el-input>
	</el-form-item>
	<el-form-item label=" 附加费用" >
		<el-input class="in-wi-24" v-model="dataForms.addfee" @input="dataForms.addfee=CheckInputFloat(dataForms.addfee)" placeholder="附加费用"> </el-input>
	</el-form-item>
	<el-form-item label="特殊属性" >
	    <el-checkbox  v-model="dataForms.iselectricity" >带电/磁</el-checkbox>
		<el-checkbox  v-model="dataForms.isdanger" >危险品</el-checkbox>
	</el-form-item>
	<el-form-item label="物流报关">
	 <el-table border :data="listForms">
		 <el-table-column width="50"  type="index">
				 <template #header>
					   <el-link :underline="false" type="primary" @click="addCustItem">
					   <plus  class="ic-cen" theme="outline" size="24" :strokeWidth="3"/>
					   </el-link>
				 </template>
		 </el-table-column>
		 <el-table-column label="国家" prop="country">
			 <template #default="scope">
				 <el-select v-model="scope.row.country">
					 <el-option v-for="item in marketList"   :key="item.market"  :label="item.name" :value="item.market" ></el-option>
				 </el-select>
			  </template>
		 </el-table-column>
		 <el-table-column label="默认头程费用" prop="fee">
			 <template #default="scope">
				 <el-input v-model="scope.row.fee" @input="scope.row.fee=CheckInputFloat(scope.row.fee)">
					 <template #append>
						<el-select v-model="scope.row.currency" class="wi-100" placeholder="CNY">
							<el-option label="CNY" value="CNY" />
							<el-option label="USD" value="USD" />
							<el-option label="EUR" value="EUR" />
						</el-select> 
					 </template>
				 </el-input>
			 </template>
		 </el-table-column>
		 <el-table-column label="海关编码(必填)" >
			 <template #default="scope">
				<el-input v-model="scope.row.code"> </el-input>
			 </template>
		 </el-table-column>
		 <el-table-column label="税率">
			  <template #default="scope">
			 <el-input v-model="scope.row.taxrate" @input="scope.row.taxrate=CheckInputFloat(scope.row.taxrate)" >
					 <template #append>
						%
					 </template>
			 </el-input>
			 </template> 
		 </el-table-column>
		  <el-table-column label="操作">
			  <template #default="scope">
			  	<el-link title="删除"  type="primary" :underline="false" @click="removeLogtis(scope.$index)">
			  		<minus  class="ic-cen" theme="outline" size="24"  :strokeWidth="3"/>
			  	</el-link>
			  </template>
		  </el-table-column>
		 <!-- 附加费用 -->
	 </el-table>
	</el-form-item>
</template>

<script setup>
	import {Plus,Minus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,toRefs } from 'vue';
	import {CheckInputFloat,CheckInputInt} from '@/utils/index';
	import marketApi from '@/api/amazon/market/marketApi'
	let props = defineProps({
	  dataForms:Object,
	  listForms:Object
	})	 
	let {dataForms,listForms} =toRefs(props);
	let state=reactive({
		marketList:[]
	});
	let { marketList  } =toRefs(state);
	
	function addCustItem(){
		var row={};
		row.currency="CNY";
		row.country="US";
		row.fee=0;
		row.code="";
		row.taxrate=0;
		props.listForms.push(row);
	}
	function loadAllMarket(){
		marketApi.getMarketAll().then((res)=>{
			state.marketList=res.data;
		});
	}
	function removeLogtis(index){
		props.listForms.splice(index,1)
	}
	onMounted(()=>{
		loadAllMarket();
	})
		 
		 
</script>

<style>
	.wi-100{
		width:100px;
	}
	
</style>
