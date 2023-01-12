	<template>
		<div class="main-sty con-header"> 
			<el-tabs v-model="activeName"  @tab-change="handleChange">
			  <el-tab-pane v-for="item in orderState"  :name="item.name" :key="item.name">
				  <template #label>
					  {{item.label}}
					  <span class="text-orange">{{item.length}}</span>
				  </template>
				    <el-row>
				   <el-space>
				   <Supplier/>
				   <el-select placeholder="支付方式">
				   </el-select>
				   <div class="date-picker-group">
				   	<el-select v-model="dateType">
				   		<el-option v-for="item in dateOptions" :label="item.label" :value="item.value"></el-option>
				   	</el-select>
				   	<Datepicker ref="datepickers" @changedate="changedate" />
				   </div>
				     <el-input  v-model="searchKeywords" placeholder="请输入" @input="searchConfirm" class="input-with-select" >
				        <template #prepend>
				          <el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU" style="width:70px">
				            <el-option label="请款单号" value="sku"></el-option>
				            <el-option label="订单号" value="plan"></el-option>
				            <el-option label="运单号" value="number"></el-option>
				          </el-select>
				        </template>
				        <template #append>
				          <el-button @click="searchConfirm">
				             <el-icon style="font-size: 16px;align-itmes:center">
				              <search />
				           </el-icon>
				          </el-button>
				        </template>
				      </el-input>
				     <el-popover   v-model:visible="moreSearchVisible" :width="400" trigger="click">
				           <template #reference>
				             <el-button  title='高级筛选'  class='ic-btn'>
				             <menu-unfold theme="outline" size="16"  :strokeWidth="3"/>
				             </el-button>
				           </template>
				  		  <el-form :model="form" label-width="80px">
				  		  <el-form-item label="产品标签">
				  		       <el-select  v-model="color" :teleported="false" placeholder="标签选择" @change="colorChange">
				  		       <el-option
				  		             v-for="item in colors"
				  		             :key="item.value"
				  		             :label="item.label"
				  		             :value="item.value"
				  		           >
				  		           </el-option>
				  		       </el-select>
				  		     </el-form-item>
				  			  <el-form-item>
				  			       <el-button type="primary" @click="submitForm(formRef)">搜索</el-button>
				  			       <el-button @click="resetForm(formRef)">取消</el-button>
				  			     </el-form-item>
				  			</el-form>
				         </el-popover>
				      <el-button>重置</el-button>
				  		
				    </el-space>
				    </el-row>
				     <!--功能区域 -->
				    <el-row>
				     <el-space >
						 <el-button type="primary" class="im-but-one" @click="handleAdd">
						   <span>审核</span>
						 </el-button>
					   <el-dropdown v-if="item.name==0||item.name==1">
					         <el-button >批量审核 
							 <el-icon class="ic-cen"><arrow-down /></el-icon></el-button>
					        <template #dropdown>
					          <el-dropdown-menu>
					            <el-dropdown-item>通过</el-dropdown-item>
					            <el-dropdown-item>驳回</el-dropdown-item>
					          </el-dropdown-menu>
					        </template>
					      </el-dropdown>
						  <el-button v-if="item.name==2||item.name==0">批量下单</el-button>
				     </el-space>
				     <div class='rt-btn-group'>
				  	   <el-button class='ic-btn'  title='列配置'>
				  		  <setting-two theme="outline" size="16"  :strokeWidth="3"/>
				  	   </el-button>
				  		<el-button   class='ic-btn' title='帮助文档'>
				  		 <help theme="outline" size="16" :strokeWidth="3"/>
				  	   </el-button>
				     </div>
				  </el-row>
			  </el-tab-pane>
			</el-tabs>
			<Table v-if="radio=='单据'"  :tableState = "activeName" />
			<SkuTable v-else/>
		</div>
	</template>
	
	<script setup>
		import { ref,reactive,onMounted,toRefs} from 'vue'
		import Table from"./components/table.vue"
		import Supplier from '@/components/header/supplier.vue';
		import Datepicker from '@/components/header/datepicker.vue';
		import {Search,ArrowDown,} from '@element-plus/icons-vue'
		import {useRouter } from 'vue-router'
		import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
		const router = useRouter()
		let state=reactive({
			radio:'单据',
			activeName:'0',
			orderState:[
				{label:'全部订单',name:'0',},
				{label:'待审核',name:'1',length:2,},
				{label:'待付款',name:'2',length:8,},
				{label:'已完成',name:'3',},
				{label:'已驳回',name:'4',},
			],
			dateType:'0',
			dateOptions:[
				{label:'申请日期',value:'0',},
				{label:'付款日期',value:'2',},
			],
		})
		const{
			radio,
			activeName,orderState,
		    dateOptions,dateType,
		}=toRefs(state)
		function handleAdd(){
			router.push({
				path:"/e/p/o",
				query:{
					title:'添加采购单',
					path:"/e/p/o",
				},
			})
		}
		
		function handleChange(val){
			state.activeName = val
		}
	</script>
	
	<style scoped="scoped">
		.text-orange{
			color:var(--el-color-primary);
			font-size:12px;
			font-weight: 700;
		}
	</style>
	



