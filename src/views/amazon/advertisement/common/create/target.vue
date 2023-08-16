<template>
	<el-form-item label="手动投放" prop="target" >
		<div>
		<el-radio-group  v-model="forms.targetType"
		 @change="radioChange"
		 class="have-ass-text-radio">
			<div>
			<div>
		     <el-radio label="keywords" >
			 关键词投放
			  <p >选择关键词可以帮助您的商品出现在买家的搜索词中。</p>
			  </el-radio>
			  </div>
			<el-radio label="product" >
			  商品投放
			  <p>选择特定的产品，类别，品牌，或其他产品的特征来投放您的广告。</p>
			  </el-radio>
			    </div>
		</el-radio-group>
		
		<div class="flex-center"   v-if="forms.targetType=='keywords'">
			<el-tabs type="border-card" class="p-l">
				<el-tab-pane label="建议关键词">
					<el-space>
					<span>匹配类型</span>
				<el-checkbox-group v-model="forms.checkList">
				    <el-checkbox label="广泛匹配" />
				    <el-checkbox label="词组匹配" />
				    <el-checkbox label="精准匹配" />
				  </el-checkbox-group>	
					</el-space>
		       <el-table  :data="tableData" height="390px">
						  <el-table-column label="关键词" prop="keywords" width="100">
						  </el-table-column>
						  <el-table-column label="匹配类型" width="80" prop="sugBid"/>
						  <el-table-column label="建议竞价" width="120">
							  <template #default="scope">
								  ${{scope.row.bidding}}
								 <p class="font-extraSmall">{{scope.row.range}}</p>
							  </template>
			             </el-table-column>
						  <el-table-column label="操作" width="90">
							  <template #header>
								  <el-button type="primary" class="font-small" link>全部添加</el-button>
								</template>
							  <template #default="scope">
								  <el-button @click="handleAdd(scope.row)">添加</el-button>
							  </template>
			    </el-table-column>
		</el-table>
		</el-tab-pane>
		<el-tab-pane label="填写关键词">
			<el-space>
				<span>匹配类型</span>
			<el-checkbox-group v-model="forms.checkList">
			    <el-checkbox label="广泛匹配" />
			    <el-checkbox label="词组匹配" />
			    <el-checkbox label="精准匹配" />
			  </el-checkbox-group>	
				</el-space>
			<el-input
			    v-model="textarea2"
			    type="textarea"
				:autosize="{ minRows:8, maxRows:8}"
			    placeholder="输入关键词,用逗号隔开"
			  />
			  <el-space class="m-t-8">
			<el-button  >添加商品</el-button> 
			 <span class="font-extraSmall ">最多只能添加1000个关键词!</span>
			 </el-space>	
		</el-tab-pane>
		</el-tabs>
		<div class="p-r">
			 <span class="font-extraSmall m-l-8">已添加 <span> 0 </span> 个关键词</span>
			<el-table  :data="addList" height="448px">
					  <el-table-column label="关键词" prop="keywords">
					  </el-table-column>
					  <el-table-column label="匹配类型" width="80" prop="sugBid"/>
					  <el-table-column label="建议竞价" width="100">
						  <template #default="scope">
							<el-space>${{scope.row.bidding}}
							<arrow-circle-right title="应用"
							@click="scope.row.a=scope.row.bidding"
							 class="pointer " theme="filled" size="16" fill="#67c23a"/></el-space>  
							  <p class="font-extraSmall">{{scope.row.range}}</p>
						  </template>
			          </el-table-column>
					   <el-table-column label="竞价" width="130">
						  <template #default="scope">
							  <el-input   v-model="scope.row.a"  style="width:100px">
							  	<template #prepend>$</template>
							  </el-input>
						  </template>
					   </el-table-column>s
						  <el-table-column label="操作" width="60">
							  <template #header>
								  <el-button type="primary" class="font-small" link>清空</el-button>
								</template>
							  <template #default="scope">
								  <el-button link type="primary" >删除</el-button>
							  </template>
			 </el-table-column>
			 </el-table>
		</div>
		</div>
		
		<div class="flex-center"   v-if="forms.targetType=='product'">
			<el-tabs type="border-card" class="p-l">
			<el-tab-pane label="分类">
				 <el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="建议分类" name="1">
						<div class="class-header font-small">
							<span >1 个建议分类</span>
							<el-button type="primary" link size='small'>定位全部</el-button>
						</div>
						<div class="class-list">
							<span>books</span>
							<el-space>
								<el-button type="primary" link size='small'>定位</el-button>
								<el-button @click="handleRefine" type="primary" link size='small'>细化</el-button>
							</el-space>
						</div>
						
					</el-tab-pane>
				    <el-tab-pane label="搜索" name="2">
						<el-input placeholder="按分类搜索...">
							 <template #suffix>
							  <el-icon><Search /></el-icon>
							 </template>
						</el-input>
						<el-tree
						 class="m-t-8"
						 :data="classtree"
						 :props="defaultProps"
						  node-key="id"
						 @node-click="handleNodeClick" >
						 <template #default="scope">
							  <div class="item-node flex-center-between">
								  <span>{{scope.node.label}}</span>
								  <div>
								  <el-button size="small" link type="primary">定位</el-button>
								  <el-button size="small" link type="primary">细分</el-button>
								  </div>
							  </div>
						 </template>
						 </el-tree>
					</el-tab-pane>
				  </el-tabs>
			</el-tab-pane>
			<el-tab-pane label="商品">
				<el-tabs v-model="activeProduct" @tab-click="handleClick">
				   <el-tab-pane label="建议商品" name="1">
					   <el-table :data="suggestProduct" height="368px">
							 <el-table-column label="图片" >
							  <template #default="scope">
									   <el-image v-if="scope.row.location" :src="scope.row.location" class="product-img"   ></el-image>
									   <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img" ></el-image>
							  </template>
							 </el-table-column>
							 <el-table-column label="ASIN" prop="asin"/>
							 <el-table-column label="操作" width="110" >
								 <template #header>
									 <el-button   type="primary" size="small" link>定位全部</el-button>
								 </template>
								 <template #default="scope">
									 <el-button   type="primary" link>定位</el-button>
								 </template>
							 </el-table-column>
					   </el-table>
					</el-tab-pane>
				   <el-tab-pane label="搜索" name="2">
					   <el-input placeholder="搜索ASIN或商品名称...">
					   	 <template #suffix>
					   	  <el-icon><Search /></el-icon>
					   	 </template>
					   </el-input>
					   <el-table class="m-t-8" :data="suggestProduct" height="368px">
								 <el-table-column label="图片" >
								  <template #default="scope">
										   <el-image v-if="scope.row.location" :src="scope.row.location" class="product-img"   ></el-image>
										   <el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-img" ></el-image>
								  </template>
								 </el-table-column>
								 <el-table-column label="ASIN" prop="asin"/>
								 <el-table-column label="操作" width="110" >
									 <template #header>
										 <el-button   type="primary" size="small" link>定位全部</el-button>
									 </template>
									 <template #default="scope">
										 <el-button   type="primary" link>定位</el-button>
									 </template>
								 </el-table-column>
					   </el-table>
					</el-tab-pane>
				   <el-tab-pane label="填写ASIN" name="3">
					   <el-input
					       v-model="textarea2"
					       type="textarea"
					    	:autosize="{ minRows:8, maxRows:8}"
					       placeholder="输入ASIN,用逗号隔开"
					     />
					   <el-button class="m-t-8" >定位</el-button> 
					</el-tab-pane>
				 </el-tabs>
			</el-tab-pane>
			</el-tabs>
			<div class="p-r">
				 <span class="font-extraSmall m-l-8">已定位 <span> 0 </span> 个分类&商品</span>
				<el-table  :data="addList" height="448px">
						  <el-table-column label="分类&商品" prop="keywords">
						  </el-table-column>
						  <el-table-column label="建议竞价" width="100">
							  <template #default="scope">
								<el-space>${{scope.row.bidding}}
								<arrow-circle-right title="应用"
								@click="scope.row.a=scope.row.bidding"
								 class="pointer " theme="filled" size="16" fill="#67c23a"/></el-space>  
								  <p class="font-extraSmall">{{scope.row.range}}</p>
							  </template>
				          </el-table-column>
						   <el-table-column label="竞价" width="130">
							  <template #default="scope">
								  <el-input   v-model="scope.row.a"  style="width:100px">
								  	<template #prepend>$</template>
								  </el-input>
							  </template>
						   </el-table-column>s
							  <el-table-column label="操作" width="60">
								  <template #header>
									  <el-button type="primary" class="font-small" link>清空</el-button>
									</template>
								  <template #default="scope">
									  <el-button link type="primary" >删除</el-button>
								  </template>
				 </el-table-column>
				 </el-table>
			</div>
		</div>	
		</div>
	</el-form-item>
	<el-dialog
	v-model = "visible"
	 title="细化分类:Books"
	 width="480px"
	>
	<el-form 
	:model="refineForm"
	label-position="top"
	>
	  <el-form-item label="品牌">
		  <el-select placeholder="请选择"></el-select>
	  </el-form-item>	
	  <el-form-item label="商品价格范围">
		 <el-input   v-model="a" placeholder="最低" style="width:140px">
		 	<template #prepend>$</template>
		 </el-input>
		  - 
		 <el-input   v-model="a" placeholder="最高" style="width:140px">
		 	<template #prepend>$</template>
		 </el-input>
	  </el-form-item>
	<el-form-item label="查看星级评定(0-5星)">
		    <el-row class="star-box">
			   <el-slider v-model="star" range show-stops :max="5" :marks="marks"  />
			   </el-row>
	</el-form-item>
	<el-form-item label="配送">
		   <el-radio-group v-model="radio1" >
		         <el-radio label="1" >所有</el-radio>
		         <el-radio label="2">具备prime资格</el-radio>
		         <el-radio label="3">不具备prime资格</el-radio>
		       </el-radio-group>
	</el-form-item>	  
	</el-form>
	<template #footer>
		<el-button @click="visible=false">取消</el-button>
		<el-button type="primary">确认</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs,watch} from 'vue'
	import {Search,} from '@element-plus/icons-vue'
	import {ArrowCircleRight,} from '@icon-park/vue-next';
	//展示用
	const star = ref([2, 4])
	const marks = reactive({
		0:'0',2:'2',5:'5',
		1:'1',3:'3',4:'4',
	})
	const emits = defineEmits([
		'targetPositionChange',
	])
	const state = reactive({
		suggestProduct:[{
			asin:'485WESS6',
		}],
		classtree:[{
			id:'1',
			label:'books',
			children:[{
				id:"2",
				label:'note',
			}], 
		},{
			id:'3',
			label:'Arts,crafts&sewing',
			children:[{
				id:"4",
				label:'flowers',
			}], 
		},
		],
		tableData:[
			{
				keywords:'bad apple',
				sugBid:'广泛匹配',
				bidding:'2.56',
				range:'$1.2 ~ $3.6',
			},
			{
				keywords:'bad apple',
				sugBid:'词组匹配',
				bidding:'3.56',
				range:'$2.2 ~ $4.6',
			},
		],
		activeName:'1',
		activeProduct:"1",
		addList:[],
		visible:false,
	})
	const {
		suggestProduct,
		classtree,
		tableData,
		addList,
		activeName,
		activeProduct,
		visible,
	}=toRefs(state)
    const props=defineProps({
		forms:{},
	})
	const {
	    forms,
	} = toRefs(props);
	
	function handleAdd(row){
		state.addList.push(row)
	}
	function handleRefine(){
		state.visible = true
	}
	function radioChange(val){
		emits('targetPositionChange',val)
	}
	
</script>

<style scoped>

	.star-box{
		width:100%;
		margin:0 16px;
		margin-bottom:16px;
	}
	.class-header{
		display:flex;
		justify-content:space-between;
		color:#666;
	}
	.class-list{
		display:flex;
		justify-content:space-between;
		color:#333;
		border-bottom:1px solid #eee;
	}
	.have-ass-text-radio .el-radio{
		height:inherit!important;
		line-height:24px;
		white-space: inherit;
		margin-bottom:16px;
		align-items:start;
	}
	
	.have-ass-text-radio p{
		font-size:12px;
		color:#acb0b9;
	}
	.p-l{
		width:450px;
		height:480px;
	}
	.p-r{
		width:450px;
		height:480px;
		background-color:#f5f5f5;
	}
	.m-l-8{
		margin-left:8px;
	}
</style>
<style>
	.have-ass-text-radio  .el-radio__input{
		  padding-top:6px;
	}
	.el-tree-node__label{
		flex-grow:1;
	}
</style>