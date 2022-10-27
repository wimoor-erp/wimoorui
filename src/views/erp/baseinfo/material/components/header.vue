<template>
	<el-row>
	    <el-space >
	  <el-select v-model="proPerson"  placeholder="负责人">
	        <el-option  v-for="item in PersonData"   :key="item.value"  :label="item.label" :value="item.value"   >
	        </el-option>
	  </el-select>
	  <el-select v-model="proType"  placeholder="品类">
	        <el-option  v-for="item in typeData"   :key="item.value"  :label="item.label" :value="item.value"   >
	        </el-option>
	  </el-select>
	  <el-select v-model="proBuyer"  placeholder="采购员">
	        <el-option  v-for="item in buyerData"   :key="item.value"  :label="item.label" :value="item.value"   >
	        </el-option>
	  </el-select>
	    <el-select v-model="proMark"  placeholder="标签">
	        <el-option  v-for="item in markData"   :key="item.value"  :label="item.label" :value="item.value"   >
	        </el-option>
	  </el-select>
	   <el-input  v-model="searchKeywords" placeholder="请输入" class="input-with-select" >
	      <template #prepend>
	        <el-select v-model="selectlabel" placeholder="SKU" style="width: 110px">
	          <el-option label="SKU" value="1"></el-option>
	          <el-option label="产品名称" value="2"></el-option>
	          <el-option label="供应商" value="3"></el-option>
	           <el-option label="创建人" value="4"></el-option>
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
		<el-popover   :popper-append-to-body="false" v-model:visible="moreSearchVisible" :width="400" trigger="click">
			<template #reference>
			<el-button  title='高级筛选'  class='ic-btn'>
			<menu-unfold theme="outline" size="16"  :strokeWidth="3"/>
			</el-button>
			</template>
			 <el-form :model="form" label-width="auto"  label-position="left">
				 <el-form-item label="类型">
					 <el-radio-group v-model="radio2">
					      <el-radio-button label="全部产品" />
					      <el-radio-button label="普通产品" />
						  <el-radio-button label="组合产品" />
					    </el-radio-group>
					 </el-form-item>	
				<el-form-item label="产品标签">
				     <el-cascader :options="options"  :popper-append-to-body="false" :props="props" clearable />
				   </el-form-item>
				<el-form-item label="备注">
				  <el-input
				      v-model="textarea"
				      :rows="2"
				      type="textarea"
				      placeholder="Please input"
				    />
				 </el-form-item>
				 </el-form>
			  </el-popover>	 
	    <el-button>重置</el-button>
	  </el-space>
	  </el-row>
	   <!--功能区域 -->
	  <el-row>
	   <el-space >
	    <el-button type="primary" class="im-but-one" @click="addProduct">
	      <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
	      <span>添加产品</span>
	    </el-button>
	    <el-button @click="addAssemble">添加组合产品</el-button>
	    <el-dropdown trigger="click">
	      <el-button>
	                 导入数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
	      </el-button>
	      <template #dropdown>
	        <el-dropdown-menu >
	          <el-dropdown-item>导入产品</el-dropdown-item>
	          <el-dropdown-item>导入组合产品</el-dropdown-item>
	          <el-dropdown-item>导入图片</el-dropdown-item>
	          <el-dropdown-item>导入更新产品</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
	     <el-dropdown trigger="click">
	      <el-button>
	                 导出数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
	      </el-button>
	      <template #dropdown>
	        <el-dropdown-menu >
	          <el-dropdown-item>导出产品</el-dropdown-item>
	          <el-dropdown-item>导出组合产品</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
	    <el-dropdown trigger="click">
	      <el-button>
	                 更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
	      </el-button>
	      <template #dropdown>
	        <el-dropdown-menu >
	          <el-dropdown-item>打印产品标签</el-dropdown-item>
	          <el-dropdown-item>编辑</el-dropdown-item>
	          <el-dropdown-item>删除</el-dropdown-item>
	          <el-dropdown-item>采购</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
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
</template>

<script>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import { useRoute,useRouter } from 'vue-router'
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		components: {Search,MenuUnfold,Plus,ArrowDown,SettingTwo,Help,Copy,MoreOne,
		},
		setup(){
			let PersonData = [
			  {value:'allperson',label:'全部负责人'},
			  {value:'maxiaodong',label:'马晓东'},
			  {value:'liuyulin',label:'刘雨林'},
			  {value:'zhangsan',label:'张三'}
			]
			let typeData = [
			  {value:'alltype',label:'全部品类'},
			  {value:'toy',label:'玩具'},
			  {value:'Kitchen',label:'厨具'},
			  {value:'office',label:'办公用品'}
			]
			let buyerData = [
			  {value:'alltype',label:'全部采购员 '},
			  {value:'maxiaodong',label:'马晓东'},
			  {value:'liuyulin',label:'刘雨林'},
			  {value:'zhangsan',label:'张三'}
			]
			let markData = [
			  {value:'allperson',label:'全部标签'},
			  {value:'maxiaodong',label:'圣诞节'},
			  {value:'liuyulin',label:'备货'},
			  {value:'zhangsan',label:'万圣节'}
			]
			let selectlabel = ref('')
			let searchKeywords= ref('')
			let proType=ref('')
			let proBuyer=ref('')
			let proPerson=ref('')
			let proMark=ref('')
			let router = useRouter()
			function addAssemble(){
				router.push({
					path:'/localproduct/editinfo/assemble',
					query:{
					  title:"添加组合产品",
					  path:'/localproduct/editinfo/assemble',
					}
				})
			}
			function addProduct(){
				router.push({
					path:'/localproduct/editinfo',
					query:{
					  title:"添加产品",
					  path:'/localproduct/editinfo',
					}
				})
			}
			return{
				addAssemble,
				addProduct,
				PersonData,
				typeData,
				buyerData,
				markData,
				proMark,
				proBuyer,
				proType,
				proPerson,
				selectlabel,
				searchKeywords,
			}
		}
	}
</script>

<style>
</style>
