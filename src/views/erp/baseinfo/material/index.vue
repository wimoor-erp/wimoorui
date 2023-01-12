<template>
	<div class="main-sty">
	<!--  头部搜索区域 -->
	<div class="con-header" >
	     <Header @getdata="loadData" ref="headerRef"  />
	</div>
	<el-row>
	   <GlobalTable ref="globalTable" @selectionChange='selectChange' :tableData="tableData" height="calc(100vh - 220px)"  @loadTable="loadTableData" border style="width: 100%;margin-bottom:16px;">
		   <template #field>
	     <el-table-column fixed type="selection" width="38" />
	      <el-table-column fixed prop="image" label="图片" width="60" >
	       <template #default="scope">
	        <el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
			<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
	      </template>
	    </el-table-column>
	    <el-table-column fixed prop="product" label="名称/SKU" width="240" show-overflow-tooltip>
	       <template #default="scope">
	          <div class='name'>{{scope.row.name}}</div>
	          <div class='sku'>{{scope.row.sku}}
	            <copy class="" @click="CopyText(scope.row.name)" title='复制名称' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
	          </div>
	      </template>
	    </el-table-column>
	    <el-table-column prop="category"  label="品类" width="140" sortable />
	    <el-table-column prop="weight" label="重量"  width="90" sortable/>
	    <el-table-column prop="price" label="采购成本" width='100'  sortable>
		  <template #default="scope">
			  <el-popover
			      placement="top"
			      title="阶梯采购价"
			      :width="200"
				  trigger="click"
				  @show="getWisePriceList(scope.row)"
			    >
			      <template #reference>
			       <span class="pointer">{{scope.row.price}}</span> 
			      </template>
			  	<el-table :data="pricelist" >
			  		<el-table-column label="起订量" prop="amount"></el-table-column>
			  		<el-table-column label="单价" prop="price"></el-table-column>
			  	</el-table>
			    </el-popover>
		  </template>
	    </el-table-column>
	    <el-table-column prop="supplier" label="供应商" width='200'  sortable>
			<template #default="scope">
				<el-link @click.stop="openPurchase(scope.row.purchaseUrl)" class="font-12">{{scope.row.supplier}}</el-link>
			    <div><span class="font-extraSmall">供货周期：</span> {{scope.row.delivery_cycle}}</div>
			</template>	
		</el-table-column>	
	    <el-table-column prop="fulfillable" label="库存" width="100"   sortable>
		<template #default="scope">
			<el-popover
			    placement="top"
			    title="产品库存"
			    :width="250"
			    trigger="click"
				@show="loadInventory(scope.row)"
			  >
			    <template #reference>
			     <span class="pointer">{{scope.row.fulfillable}}</span> 
			    </template>
				<el-table :data="inventoryList" >
					<el-table-column label="仓库名称" width="140" prop="name"></el-table-column>
					<el-table-column label="库存" prop="quantity"></el-table-column>
				</el-table>
			  </el-popover>
		</template>
		 </el-table-column>
	    <el-table-column prop="issfg" label="产品类型" width="110"   sortable>
	        <template #default="scope">
				<el-tag v-if="scope.row.issfg=='0'" type="success" effect="plain">单独产品</el-tag>
				<el-tag v-if="scope.row.issfg=='1'" type="warning" effect="plain">组合产品</el-tag>
				<el-tag v-if="scope.row.issfg=='2'" type="danger" effect="plain">待组装产品</el-tag>
	        </template>
	    </el-table-column>
	    <el-table-column prop="name" class-name="editable-cell" label="标签" width="180" sortable>
	       <template #default="scope">
	         <span class='tag-mr' v-if='scope.row.TagNameList'  v-for='(s,index) in scope.row.TagNameList' :key='index'>
	             <el-tag  effect="plain" :title="s.name" :type="s.color">  {{s.name}}</el-tag>
	         </span>
			 <span v-else>-</span>
			<span class="edit-text" @click.stop="editTags(scope.row)" :class="scope.row.active">修改</span>
	       </template>
	    </el-table-column>
	    <el-table-column prop="remark" label="备注"  show-overflow-tooltip sortable/>
	    <el-table-column fixed="right" prop="operate" label="操作"  width="125"   sortable>
	        <template #default="scope">
	          <el-space>
	            <el-button type="primary" link @click="productDetails(scope.row)">详情</el-button>
	            <el-button type="primary" link @click="productEdit(scope.row)">编辑</el-button>
	            <el-dropdown :hide-on-click="false">
	              <span class="el-dropdown-link">
	                <more-one class="ic-cen" theme="outline" size="16" fill="#333" :strokeWidth="3"/>
	              </span>
	               <template #dropdown>
	                <el-dropdown-menu>
	                  <el-dropdown-item @click.stop="deleteInfo(scope.row)">停用</el-dropdown-item>
	                 <!-- <el-dropdown-item >打印条码</el-dropdown-item> -->
	                </el-dropdown-menu>
	            </template>
	            </el-dropdown>
	          </el-space>
	        </template>
	    </el-table-column>
	  </template>
	  </GlobalTable>
	</el-row>
	</div>
	
	<el-dialog v-model="markVisable" title="编辑标签" width="600px">
		  <el-space>
		  <span>标签</span>
		  <el-cascader v-model="tagsValue" placeholder="请选择标签" :options="tagsList"  @change="changeTags" :popper-append-to-body="false" :props="markprops" clearable />
		 </el-space>
		  <template #footer>
		  	<span class="dialog-footer">
		  		<el-button @click="markVisable = false">取消</el-button>
				<el-button @click.stop="Addtag">添加标签</el-button>
		  		<el-button type="primary" @click.stop="submitTag">提交</el-button>
		  	</span>
		  </template>
	</el-dialog>
	
</template>

<script setup>
	import {ref,reactive,toRefs,onMounted,} from "vue"
	import {Copy,MenuUnfold,Plus,SettingTwo,Help,MoreOne} from '@icon-park/vue-next';
	import Header from "./components/header.vue"
	import {useRouter } from 'vue-router'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import CopyText from"@/utils/copy_text"
	import materialApi from '@/api/erp/material/materialApi.js';
	import {getAllTags} from '@/api/sys/admin/tag.js';
	import inventoryApi from '@/api/erp/inventory/inventoryApi.js';
	onMounted(()=>{
		
	})
	const headerRef=ref();
	let router = useRouter()
	const globalTable=ref();
	let state = reactive({
		tagsList:[],
		tableData:{records:[],total:0},
		markprops:{ multiple: true },
		tagsValue:[],
		checkTags:'',
		nowTagProRow:{},
		markVisable:false,
		inventoryList:[],
		pricelist:[],
		queryParams:{},
		})
		let {tableData,tagsList,markprops,tagsValue,checkTags,nowTagProRow,markVisable,queryParams,
		inventoryList,pricelist}=toRefs(state)
		  function productDetails(row){
			  router.push({
			  	path:'/material/details',
			  	query:{
			  	  title:"产品详情",
			  	  path:'/material/details',
				  details:row.id
			  	}
			  })
		  }
		  function productEdit(row){
				 router.push({
				 	path:'/localproduct/editinfo',
				 	query:{
				 	  title:"编辑产品",
				 	  path:'/localproduct/editinfo',
				 	  details:row.id,
				 	}
				 }) 
		  }
function submitTag(row){
	var mid=state.nowTagProRow.id;;
	var ids=state.checkTags;
	materialApi.saveMaterialTags({"mid":mid,"ids":ids}).then((res)=>{
		 if(res.data=="ok"){
			 ElMessage({
				  message: '操作成功！',
				  type: 'success'
			 })
			state.markVisable = false 
		 }else{
			 ElMessage({
				  message: '操作失败！',
				  type: 'error'
			 })
		 }
	});
	
}
function Addtag(){
	router.push({
		path:'/sys/tags',
		query:{
		  title:"产品标签",
		  path:'/sys/tags',
		}
	})
}
function loadData(params){
	state.queryParams=params;
	globalTable.value.loadTable(params);
	
}
function loadTableData(params){
	materialApi.getMaterialList(params).then((res)=>{
		state.tableData.records = res.data.records
		state.tableData.total =res.data.total
	})
}
function editTags(rows){
	state.nowTagProRow=rows;
	getAllTags().then(res => {
		state.tagsList=res.data;
		//在通过id去找 选了哪些
		var arrs=[];
		materialApi.findMaterialTags({"mid":rows.id}).then((ress)=>{
			  if(ress.data && ress.data!=""){
				  var strs=ress.data.toString();
				  var list=strs.split(",");
				  list.forEach(function(item){
					  arrs.push(item);
				  });
				   state.tagsValue=arrs;
			  }else{
				   state.tagsValue=[];
			  }
		});
	});
	state.markVisable =true;
}
function changeTags(tags){
		 if(tags){
			 var items="";
			  tags.forEach(function(item){
				  items+=(item[1]+",");
			  });
			  state.checkTags=items;
		 }else{
			 state.checkTags="";
		 }
}
function loadInventory(row){
	inventoryApi.getInventoryByMaterial({"mid":row.id}).then((res)=>{
		state.inventoryList=res.data;
	});
}
function getWisePriceList(row){
	materialApi.getWisePriceList({"mid":row.id}).then((res)=>{
		state.pricelist=res.data;
	});
}
function openPurchase(url){
	 window.open(url, '_blank');
}
function deleteInfo(row){
	materialApi.deleteData({"ids":row.id}).then((res)=>{
		if(res.data){
			ElMessage({
				  message: '删除成功！',
				  type: 'success'
			})
			loadData(state.queryParams);
		}
	})
}
function selectChange(selection) {
	 headerRef.value.selectRows=selection;
}

</script>

<style >
	.el-dropdown-link .i-icon svg{vertical-align:text-top;}
	.tag-mr{margin-right:4px;margin-bottom:4px;display:inline-block}
	.sku .i-icon-copy{cursor:pointer;opacity: 0;}
	.el-table  tr:hover>td.el-table__cell .sku .i-icon-copy{opacity: 1;transition: opacity .4s; }
	.scoped-form .el-form-item--default{
		margin-bottom:0px;
	}
	.scoped-form .el-form-item__label{
		color: #999;
	}
	.footer-right{ 
		margin-top:16px;
		text-align: right;
	}
	.font-12{
		font-size:12px;
	}
</style>
