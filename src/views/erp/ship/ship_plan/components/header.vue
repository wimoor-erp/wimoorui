<template>
	<div class="sys-headr-top">
		<el-space :size="16" class="font-base">
			<div>
			<span>发货店铺：</span>
			<el-select></el-select>
			</div>
			<div>
			<span>发货仓库：</span>
			<el-select v-model="localinventoryChecked" filterable placeholder="请选择" >
				<el-option
				      v-for="item in localshipInventroys"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value"
				    />
			</el-select>
			</div>
			<el-space class="font-extraSmall" :size="4">
				<el-badge is-dot >
				    <el-button @click="computedShipnum" title="计算可更新产品发货量">计算建议发货量</el-button>
				  </el-badge>
				<span> 更新时间:2022-02-23 09:06:29</span>
				<el-divider direction="vertical" />
				<span>操作人:钟春煌</span>
			</el-space>	
		</el-space>
		<el-button @click="clearPlan">清空计划</el-button>
	</div>
	<div class="main-sty con-header">
		<el-row class="no-flex-warp">
				<el-space>
				<el-select v-model="FbaInventorysChecked" multiple clearable placeholder="全部FBA仓库">
				      <el-option  v-for="item in FbaInventorysData"   :key="item.value"  :label="item.label" :value="item.value"   >
				      </el-option>
				</el-select>
				<el-select v-model="proPerson"  placeholder="负责人" clearable>
				      <el-option  v-for="item in PersonData"   :key="item.value"  :label="item.label" :value="item.value"   >
				      </el-option>
				</el-select>
				<el-select v-model="proPerson"  placeholder="产品状态">
				      <el-option  v-for="item in PersonData"   :key="item.value"  :label="item.label" :value="item.value"   >
				      </el-option>
				</el-select>
				 <el-cascader :options="marks"  :props="markprops" placeholder="产品标签" clearable />
				<el-input  v-model="searchKeywords" placeholder="请输入" class="input-with-select" >
				   <template #prepend>
				     <el-select v-model="selectlabel" placeholder="SKU" style="width: 110px">
				       <el-option label="SKU" value="1"></el-option>
				       <el-option label="产品名称" value="2"></el-option>
				       <el-option label="备注" value="3"></el-option>
					   <el-option label="同级SKU" value="3"></el-option>
					   <el-option label="ASIN" value="3"></el-option>
				     </el-select>
				   </template>
				   <template #append>
				     <el-button >
				        <el-icon style="font-size: 16px;align-itmes:center">
				         <search />
				      </el-icon>
				     </el-button>
				   </template>
				 </el-input>
				 <el-popover    v-model:visible="moreSearchVisible" :width="400" trigger="click">
				 	<template #reference>
				 	<el-button  title='高级筛选'  class='ic-btn'>
				 	<menu-unfold theme="outline" size="16"  :strokeWidth="3"/>
				 	</el-button>
				 	</template>
				 	 <el-form :model="form" label-width="80px">
				 		 <el-form-item label="类型">
				 			 <el-radio-group v-model="form.type">
				 			      <el-radio-button label="全部产品" />
				 			      <el-radio-button label="普通产品" />
				 				  <el-radio-button label="组合产品" />
				 			    </el-radio-group>
				 			 </el-form-item>	
				 		<el-form-item label="产品品类">
				 		   <el-select :teleported="false"></el-select>
				 		</el-form-item>
				 		<el-form-item label="SKU">
				 		  <el-input
				 		      v-model="textarea"
				 		      :rows="2"
				 		      type="textarea"
				 		      placeholder="逗号分隔批量搜索..."
				 		    />
				 		 </el-form-item>
						 <el-form-item label="断货预警">
							 <el-row gutter="8">
								 <el-col :span="12">
									 <el-select :teleported="false"></el-select>
								 </el-col>
								 <el-col :span="12">
								 	<el-select :teleported="false"></el-select>
								 </el-col>
							 </el-row>
						 </el-form-item>
						 <el-form-item label="是否轻小">
						   <el-radio-group v-model="form.small">
						       <el-radio :label="3">不限</el-radio>
						       <el-radio :label="6">是</el-radio>
						       <el-radio :label="9">否</el-radio>
						     </el-radio-group>
						 </el-form-item>
						 <el-form-item label="附加费用">
						   <el-radio-group v-model="form.extraprice">
						       <el-radio :label="3">不限</el-radio>
						       <el-radio :label="6">有</el-radio>
						       <el-radio :label="9">无</el-radio>
						     </el-radio-group>
						 </el-form-item>
				 		 <el-form-item >
				 			 <el-button type="primary" @click="submitForm(formRef)">搜索</el-button>
				 			 <el-button @click="resetForm(formRef)">取消</el-button>	
				 		</el-form-item>
				 		 </el-form>
				 	  </el-popover>
					  <el-button>重置</el-button>
				</el-space>
		</el-row>
		<el-row>
			<el-space >
				<el-button type="primary" class="im-but-one" @click="submitShip">
				  <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
				  <span>发货</span>
				</el-button>
				<el-button @click="setFbaDeliveryDate">FBA发货参数</el-button>
				<el-button @click="FbaShipRank">FBA站点配货优先级</el-button>
				</el-space >
					
				<div class='rt-btn-group'>
					<div class="flex-center font-small m-r-16">
						<el-checkbox v-model="checked1" label="显示已选" size="large" />
						<el-divider direction="vertical" />
						<span>已选<span class="font-black"> 2 </span>个SKU</span>
						<el-divider direction="vertical" />
						<span>发货总数<span class="font-black"> 200</span></span>
					</div>
					<el-space >
					<el-dropdown :hide-on-click="false" @command="handleCommand"  trigger="click">
					    <el-button class='ic-btn'  title='排序'>
					       <sort-one theme="outline" size="16"  :strokeWidth="3"/>
					    </el-button>
					    <template #dropdown>
					      <el-dropdown-menu >
							<el-dropdown-item disabled>排序依据</el-dropdown-item>
					        <el-dropdown-item v-for="(item,index) in rankData"  @click="rankChange(item.value)"
							 :class="{r_active:currentRank==item.value}" 
							>{{item.name}}</el-dropdown-item>
					        <el-dropdown-item divided  disabled>排序循序</el-dropdown-item>
					        <el-dropdown-item v-for="item in soltData" @click="soltChange(item.value)" 
							:class="{r_active:currentSolt==item.value}">{{item.name}}</el-dropdown-item>
					      </el-dropdown-menu>
					    </template>
					  </el-dropdown>
					  <el-button class='ic-btn m-l-0' title='帮助文档' >
					  	<help theme="outline" size="16" :strokeWidth="3" />
					  </el-button>
					</el-space>
				</div>	
		</el-row>
<!-- 		   <div class="flex-v-bet affix-box1" >
			   <p class="font-bold m-b-4">265</p>
			   <p class="font-small">已选产品</p>
			</div>
			<div class="flex-v-bet affix-box1 p-2" >
						   <p class="font-bold m-b-4">2565</p>
						   <p class="font-small">发货总数</p>
			</div> -->
		<Table/>
	</div>
	<DeliveryDialog ref="deliverRef" />
	<ShipmarketRank ref ="ShipmarketRankRef"/>
</template>

<script setup>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne,SortOne} from '@icon-park/vue-next';
	import { ref ,defineEmits,reactive,onMounted} from 'vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Table from "./table";
	import DeliveryDialog from "./delivery_dialog";
	import ShipmarketRank from "./shipmarket_rank";
	import { useRouter } from 'vue-router'
	let deliverRef = ref()
	let ShipmarketRankRef = ref()
	let router = useRouter()
			let FbaInventorysChecked = ref([])
			let moreSearchVisible =ref(false)
	        let localinventoryChecked=ref(1)
			let localshipInventroys =reactive([
				{label:'清湖仓',value:1},
				{label:'东莞(实际使用)',value:2},
				{label:'东莞外包仓',value:3},
				{label:'虾皮仓库',value:5},
				{label:'龙华仓',value:6},
				])
			let FbaInventorysData =	reactive([
				{label:'美国',value:1},
				{label:'加拿大',value:2},
				{label:'英国',value:3},
				{label:'法国',value:4},
				{label:'德国',value:5},
			])
	    let marks =[
				{
				    value: 1,
				    label: '颜色',
				    children: [
				      {
				        value: 2,
				        label: '红',
				      },
					  {
					    value: 3,
					    label: '黄',
					  },
					  ]
			},
			{
				    value: 2,
				    label: '节日',
				    children: [
				      {
				        value: 2,
				        label: '圣诞节',
				      },
					  {
					    value: 3,
					    label: '万圣节',
					  },
					  ]
			},
			{
				    value: 3,
				    label: '策略',
				    children: [
				      {
				        value: 2,
				        label: '促销',
				      },
					  {
					    value: 3,
					    label: '提价',
					  },
					  ]
			},
		]
		let markprops={ multiple: true }
		let rankData =reactive([
			{name:'可售库存',},
			{name:'预估日均销量',},
			{name:'7日销量',},
			{name:'30日销量',},
			{name:'实际发货量',},
			{name:'建议发货量',},
			{name:'可售天数',},
			{name:'发货后可售天数',},
		])
		let soltData = reactive([
			{name:'从高到低',},
			{name:'从低到高',},
		]) 
		let form = reactive({
					type:'全部产品',
					small:3,
					extraprice:3,
		})
				function clearPlan(){
					ElMessageBox.confirm(
					    '您确定要清空发货计划吗?',
					    '清空计划',
					    {
					      confirmButtonText: '确定',
					      cancelButtonText: '取消',
					      type: 'warning',
					    }
					  )
					    .then(() => {
					      ElMessage({
					        type: 'success',
					        message: '清除成功！',
					      })
					    })
					    .catch(() => {
					      ElMessage({
					        type: 'info',
					        message: '取消清除！',
					      })
					    })
				}
			let  emits = defineEmits(['getComputedResult'])		
			function computedShipnum(){
				emits("getComputedResult",true)	
				}	
			function resetForm(){
				moreSearchVisible.value =false
			}	
			function setFbaDeliveryDate(){
				deliverRef.value.dialogVisible = true
			}
			function FbaShipRank(){
				ShipmarketRankRef.value.rankVisible = true
			}
			/* 发货提交 */
			function submitShip(){
				router.push({
					path:"/e/s/p",
					query:{
						title:'提交发货',
						path:"/e/s/p",
					}
				})
			}
</script>

<style>
	.sys-headr-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:16px 24px;
		border-bottom:1px solid var(--el-border-color-base);
		background-color:var(--el-bg-color);
	}
	.no-flex-warp{
		flex-wrap:inherit;
	}
	.m-r-16{
		margin-right:16px;
	}
	.m-l-0{
		margin-right:-8px;
	}
	.affix-box1{
		text-align: center;
		width:50px;
		position:fixed;
		z-index: 999;
		right:24px;
		bottom:120px;
		padding: 8px;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: var(--el-box-shadow-light);
	}
	.p-2{
		bottom:40px;
	}
	.m-b-4{
		margin-bottom:4px;
	}
</style>
