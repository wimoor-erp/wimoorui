<template>
	<div class="con-header" >
	  <el-row>
	 <el-space>
	 <Group @change="getData" defaultValue="all" />
	 <Warehouse @changeware="getWarehouse" />
	 <Datepicker @changedate="changedate" />
	   <el-input  v-model="searchKeywords" placeholder="请输入" @input="searchConfirm" class="input-with-select" >
	      <template #prepend>
	        <el-select v-model="selectlabel" @change='searchTypeChange' placeholder="SKU" style="width: 110px">
	          <el-option label="SKU" value="sku"></el-option>
	          <el-option label="计划名称" value="plan"></el-option>
	          <el-option label="计划编码" value="number"></el-option>
			  <el-option label="备注" value="remark"></el-option>
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
			  <el-form-item label="颜色">
			       <el-select  v-model="color" :teleported="false" placeholder="颜色选择" @change="colorChange">
			       <el-option
			             v-for="item in colors"
			             :key="item.value"
			             :label="item.label"
			             :value="item.value"
			           >
					   <div class="color-select">
			             <span >{{ item.label }}</span>
			             <span :class="'cilcle-'+item.value"></span  >
						</div> 
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
	    <el-button type="primary" class="im-but-one" @click="addShipment">
	      <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
	      <span>添加货件</span>
	    </el-button>
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
	</div>
</template>

<script>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { useRoute,useRouter } from 'vue-router'
	 import { ref,reactive,onMounted,watch } from 'vue'
	 import groupApi from '@/api/amazon/group/groupApi.js';
	 import marketApi from '@/api/amazon/market/marketApi.js';
	 import warehouseApi from '@/api/erp/warehouse/warehouseApi.js';
	 import Group from '@/components/header/group.vue';
	 import Warehouse from '@/components/header/warehouse.vue';
	 import Datepicker from '@/components/header/datepicker.vue';
	export default{
		name:"Header",
		components:{MenuUnfold,Search,ArrowDown,Plus,SettingTwo,Help,Copy,MoreOne,Group,Warehouse,Datepicker},
		emits:["getdata"],
		setup(props,context){
			let router = useRouter()
			let queryParam={}
			let selectlabel=ref('sku')
			let searchKeywords=ref("")
			let moreSearchVisible=ref(false)
			let color=ref("");
			let isload=true;
			onMounted(()=>{
				
			})
			function addShipment(){
				console.log(1123)
				router.push({
					path:'/invoice/addshipment',
					query:{
					  title:"添加货件",
					  path:'/invoice/addshipment',
					}
				})
			}
			function getData(obj){
				queryParam.groupid=obj.groupid;
				queryParam.marketplaceid=obj.marketplaceid;
				context.emit("getdata",queryParam)
				isload=false;
			}
			function getWarehouse(wid){
				queryParam.warehouseid=wid;
				if(isload==false){
					context.emit("getdata",queryParam)
				}
			}
			function changedate(dates){
				queryParam.start=dates.start;
				queryParam.end=dates.end;
				if(isload==false){
					context.emit("getdata",queryParam)
				}
			}
			function searchTypeChange(){
				queryParam.seachtype=selectlabel.value;
				if(isload==false){
					context.emit("getdata",queryParam)
				}
			}
			function searchConfirm(){
				queryParam.searchwords=searchKeywords.value;
				if(isload==false){
					context.emit("getdata",queryParam)
				}
			}
			function submitForm(){
				queryParam.color=color.value;
				if(isload==false){
					context.emit("getdata",queryParam)
				}
				moreSearchVisible.value=false;
			}
			function resetForm(){
				moreSearchVisible.value=false;
			}
			return{
				addShipment,getData,getWarehouse,changedate,selectlabel,searchKeywords,
				searchTypeChange,searchConfirm,moreSearchVisible,submitForm,resetForm,color
			}
		}
	}
</script>

<style>
</style>
