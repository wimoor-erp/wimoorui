	<template>
		<div class="main-sty con-header"> 
			<el-tabs v-model="activeName"  @tab-change="handleChange">
			  <el-tab-pane v-for="item in ViewData"  :label="item.label" :name="item.name" :key="item.name">
			  </el-tab-pane>
			</el-tabs>
			<el-row>
			 <el-space>
				 <Group ref="groups" @change="getData" defaultValue="all"/>
				 <Currency ref="currencyRef" @change="getData" />
				 <Category v-if="activeName=='4'" @change="changeCategory" ref="categoryRef"></Category>
				 <Owner v-if="activeName=='0'||activeName=='1'||activeName=='2'||activeName=='3'" @owner="changeOwner" ref="ownerRef" ></Owner>
				 <DatepickerMonth v-if="activeName=='5'" ref="datepickers" @changedate="changedate" />
			 	<Datepicker v-else ref="datepickers" @changedate="changedate" />
			    <el-input 
				v-if="activeName<4"
				 v-model="searchKeywords" placeholder="请输入" @input="searchConfirm" class="input-with-select" >
			      <template #prepend>
			        <el-select v-model="selectlabel" @change='searchTypeChange'  style="width:100px">
			          <el-option label="MSKU" value="0"></el-option>
			          <el-option label="ASIN" value="1"></el-option>
			          <el-option label="父ASIN" value="2"></el-option>
			          <el-option label="SKU" value="3"></el-option>
			          <el-option label="产品名称" value="4"></el-option>
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
			   <el-popover  v-if="activeName=='0'||activeName=='1'||activeName=='3'"  v-model:visible="moreSearchVisible" :width="400" trigger="click">
			         <template #reference>
			           <el-button  :type="filterBtn" plain title='高级筛选'  class='ic-btn'>
			           <i>
			           <svg width="16" height="16" fill="none" viewBox="0 0 48 48"  xmlns="http://www.w3.org/2000/svg">
			           	<path d="M6 9L20.4 25.8178V38.4444L27.6 42V25.8178L42 9H6Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>
			            </i>
			           </el-button>
			         </template>
					  <el-form   ref="formRef" label-width="80px">
					  <el-form-item label="产品标签" prop="remarks">
			                <Tags ref="tagsRef" @change="changeTag"  />
					     </el-form-item>
						  <el-form-item>
						       <el-button type="primary" @click="">搜索</el-button>
						       <el-button @click="cancelFilter">取消</el-button>
						     </el-form-item>
						</el-form>
			       </el-popover>
			    <el-button>重置</el-button>
			  </el-space>
			  </el-row>
			   <!--功能区域 -->
			  <el-row>
			   <el-space >
				 <el-button 
				  @click="recalculation"
				  type="primary" > 重算 </el-button>
				
				
			   </el-space>
			   <div class='rt-btn-group'>
				   <el-button class='ic-btn' @click="formulaConfig" title='毛利润计算公式'>
					  <formula theme="outline" size="14"  :strokeWidth="3"/>
				   </el-button>
					<el-button   class='ic-btn' title='帮助文档'>
					 <help theme="outline" size="16" :strokeWidth="3"/>
				   </el-button>
			   </div>
			</el-row>
			<Table :activeName="activeName"  v-if="activeName=='0'||activeName=='1'||activeName=='3'"/>
			<ParentAisnTable v-if="activeName=='2'"/>
			<CategoryTable v-if="activeName=='4'"/>
			<MonthTable v-if="activeName=='5'"/>
			<StoreTable v-if="activeName=='6'"/>
		</div>
		<FormulaConing ref="FormulaRef"/>
		<el-dialog
		title="重算"
		v-model="visable"
		width="600px"
		>
		<el-form >
			<el-form-item label="店铺国家">
				<Group ref="groups" @change="getData" defaultValue="all"/>
			</el-form-item>
			<el-form-item label="重算区间">
				<Datepicker ref="datepickers" @changedate="changedate" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visable=false">取消</el-button>
			<el-button type="primary">确定</el-button>
		</template>
		</el-dialog>
	</template>
	
	<script setup>
		import { ref,reactive,onMounted,toRefs} from 'vue'
		import DatepickerMonth from '@/components/header/datepicker_month.vue';
		import Datepicker from '@/components/header/datepicker.vue';
		import Currency from '@/components/header/currency.vue';
		import Group from '@/components/header/group.vue';
		import Owner from '@/components/header/owner.vue';
		import Category from '@/components/header/category.vue';
		import Tags from '@/components/header/tags.vue';
		import Table from"./msku/table.vue"
		import ParentAisnTable from"./parentAsin/table.vue"
		import CategoryTable from"./category/table.vue"
		import MonthTable from"./month/table.vue"
		import StoreTable from"./store/table.vue"
		import FormulaConing from "./components/formula.vue"
		import {Search,ArrowDown,} from '@element-plus/icons-vue'
		import {useRouter } from 'vue-router'
		import { ElMessage, ElMessageBox} from 'element-plus'
		import {Plus,Formula,Help,Copy,MoreOne} from '@icon-park/vue-next';
		const router = useRouter()
		const FormulaRef =ref()
		const categoryRef =ref()
		let state=reactive({
			visable:false,
			dialogVisible:false,
			moreSearchVisible:false,
			activeName:'0',
			filterBtn:'',
			ViewData:[
				{label:'MSKU',name:'0',},
				{label:'ASIN',name:'1',},
				{label:'父ASIN',name:'2',},
				{label:'SKU',name:'3',},
				{label:'品类',name:'4',},
				{label:'月度',name:'5',},
				{label:'店铺',name:'6',},
			],
			selectlabel:'0',
			selectrows:[],
		})
		const{
			filterBtn,
			selectlabel,
			moreSearchVisible,
			activeName,ViewData,
			dialogVisible,
			selectrows,
			visable,
		}=toRefs(state)
		
		function formulaConfig(){
			FormulaRef.value.show()
		}
		
		function recalculation(){
			state.visable = true
		}
		
		function handleChange(val){
				state.selectlabel=val
		}
	</script>
	
	<style scoped="scoped">
	</style>
	



