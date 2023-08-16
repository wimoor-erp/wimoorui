<template>
	<div class="lr-wrapper">
	     <div class="l-content">
			<div class="item-tab " v-for="item in tabs" 
			v-show="!item.show"
			:class="{'active':current==item.value}"> 
				<el-link type="info" :underline="false" :href="'#'+item.id">{{item.name}}</el-link>
			</div>
		 </div>
	     <div class="r-content">
			 <el-Scrollbar height="calc(100vh - 100px )" @scroll='scroll'>
				 <div class="ad-body">
					 <div class="flex-center">
					<div class="mark-squre"></div>
					<div id="campaign" class="font-base font-bold tab-scroll">
						广告活动
					</div>
					</div>
				<el-form 
				:model="form"
				:rules="rules"
				label-position="right"
				label-width="120px"
				>
					   <el-form-item label="店铺站点" prop="group" >
						  <Group @change="groupChange" defaultValue="only"/>
						</el-form-item>
					 <el-form-item label="广告活动名称" prop="name">
						<el-input v-model="form.name" placeholder="必填" style="width:452px"> </el-input>
					</el-form-item>
					 <el-form-item label="广告活动时间"  prop="stardate">
						<el-date-picker
						        v-model="form.stardate"
						        type="date"
						        placeholder="开始时间"
						      />
							   &nbsp;<span class="font-extraSmall">-</span>&nbsp; 
					     	<el-date-picker
						        v-model="form.enddate"
						        type="date"
						        placeholder="结束时间(选填)"
						      />
					</el-form-item>
					<el-form-item label="广告组合" prop="portfolios">
						<el-select v-model="form.portfolios" placeholder="请选择"></el-select>
					</el-form-item>
					<el-form-item label="每日预算" prop="budget">
						<el-input v-model="form.budget" placeholder="请输入" style="width:214px">
							<template #prepend>$</template>
						</el-input>
					</el-form-item>
					<el-form-item label="投放类型" prop="target" required>
						<el-radio-group  v-model="form.target"
						 @change="targetChange"
						 class="have-ass-text-radio">
							<div>
							<div>
						     <el-radio label="auto" >
							 自动投放
							  <p >亚马逊会根据您的商品信息将您的广告定位到买家的搜索词，这能帮助您了解到哪些关键词在手动投放中效果良好。</p>
							  </el-radio>
							  </div>
							<el-radio label="manual" >
							  手动投放
							  <p>当您知道哪些关键字为您的企业带来最高价值时，可使用该策略。您可以为单个关键字设置自定义出价。</p>
							  </el-radio>
							    </div>
						</el-radio-group>
					</el-form-item>
					<div class="flex-center">
					<div class="mark-squre"></div>
					<div id="biddingTactics" class="font-base font-bold tab-scroll">
						竞价策略
					</div>
					</div>
					<!-- 竞价策略 -->	
					<BiddingTactics  :forms="form"/>
					<div class="flex-center">
					<div class="mark-squre"></div>
					<div id="adGroup" class="font-base font-bold tab-scroll">
						广告组
					</div>
					</div>
					<el-form-item label="广告组名称" prop="adGroup" required>
						<el-input v-model="form.adGroup" placeholder="必填" style="width:452px"> </el-input>
					</el-form-item>	
					<div class="flex-center">
					<div class="mark-squre"></div>
					<div id="product" class="font-base font-bold tab-scroll">
						商品
					</div>
					</div>
					<!-- 添加商品 -->
					<ProductAdd/>
					<div class="flex-center">
					<div class="mark-squre"></div>
					<div id="bidding" class="font-base font-bold tab-scroll">
						竞价
					</div>
					</div>
					<!-- 竞价 -->
					<Bidding v-if="form.target=='auto'"  :forms="form"/>
					<el-form-item v-else label="默认竞价" prop="bidding" required>
					<el-input   v-model="form.bidding" placeholder="请输入" style="width:214px">
						<template #prepend>$</template>
					</el-input>
					</el-form-item>	
					
					<div class="flex-center " v-if="form.target=='manual'">
					<div class="mark-squre"></div>
					<div id="target" class="font-base font-bold tab-scroll">
						投放
					</div>
					</div>
					<Target
					@targetPositionChange="targetPositionChange"
					 v-if="form.target=='manual'" :forms="form"/>
					
					<div class="flex-center"  v-if="form.target=='auto'||form.targetType=='keywords'">
					<div class="mark-squre"></div>
					<div id="keywords" class="font-base font-bold tab-scroll">
						否定关键词<span class="font-extraSmall"> (选填)</span>
					</div>
					</div>
					<!-- 否定关键词 -->
					<NegativeKeywords v-if="form.target=='auto'||form.targetType=='keywords'"/>
					
					<div  class="flex-center" v-if="form.target=='auto'||form.targetType=='product'">
					<div class="mark-squre"></div>
					<div id="unpt" class="font-base font-bold tab-scroll">
						否定商品投放<span class="font-extraSmall"> (选填)</span>
					</div>
					</div>
					<!-- 否定商品投放 -->
					<NegativeProductAuto v-if="form.target=='auto'" />
					<NegativeProductManual v-if="form.target=='manual'&&form.targetType=='product'" />
				</el-form> 
				</div>
				<el-affix position="bottom" :offset="16">
				 <div class="footer-box">
					 <el-button>取消</el-button>
					 <el-button type="primary">提交广告活动</el-button>
				 </div>
				</el-affix>
				</el-Scrollbar>
		
		 </div>
	</div>	
</template>

<script setup>
	import {ref,reactive,onMounted,watch,toRefs,computed} from 'vue'
	import Group from '@/components/header/group.vue';
	import BiddingTactics from '@/views/amazon/advertisement/common/create/bidding_tactics.vue'
	import Bidding from '@/views/amazon/advertisement/common/create/bidding.vue'
	import ProductAdd from '@/views/amazon/advertisement/common/create/product_add.vue'
	import NegativeKeywords from '@/views/amazon/advertisement/common/create/negative_keywords.vue'
	import NegativeProductAuto from '@/views/amazon/advertisement/common/create/negative_product_auto.vue'
	import NegativeProductManual from '@/views/amazon/advertisement/common/create/negative_product_manual.vue'
	import Target from '@/views/amazon/advertisement/common/create/target.vue' 
	
	import tabScroll from"@/utils/tab_scroll"
	const state = reactive({
		tabs:[
			{name:'广告活动',value:1,id:'campaign',},
			{name:'竞价策略',value:2,id:'biddingTactics',},
			{name:'广告组',value:3,id:'adGroup'},
			{name:'商品',value:4,id:'product'},
			{name:'竞价',value:5,id:"bidding"},
			{name:'投放',value:6,id:'target',show:true,},
			{name:'否定关键词',value:6,id:'keywords'},
			{name:'否定商品投放',value:7,id:"unpt"},
		],
		form:{
			name:'',budget:'',stardate:'',
			time:'',target:'auto',radio:"1",biddingType:'1',targetType:'keywords',
			biddingTable:[{
				status:true,
				name:'紧密匹配',
				sugBid:'-',
			},{
				status:true,
				name:'宽泛匹配',
				sugBid:'-',
			},{
				status:true,
				name:'同类商品',
				sugBid:'-',
			},{
				status:true,
				name:'关联商品',
				sugBid:'-',
			},],
			checkList:['广泛匹配','词组匹配'],
		},
		rules:{
			name:[ { required: true, message: '请输入广告活动名称', trigger: 'blur' },],
			group:[ { required: true, message: '', trigger: 'blur' },],
			stardate:[ {required: true,message: '开始时间不能为空!',  trigger: 'change' },],
			budget:[ {required: true,message: '预算不能为空!',  trigger: 'blur' },],
		},
		current:'1',
	})
	const {
		tabs,
		form,
		rules,
		current,
	}= toRefs(state)
	let timer = null
	//防抖
	function scroll(obj){
		clearTimeout(timer)
		timer = setTimeout(()=>{
			state.current= tabScroll(obj,"tab-scroll")
			console.log(state.current)
		},200)
	}
	
	
	function targetChange(val){
			state.tabs.forEach((item)=>{
				if(item.name=='投放'){
					if(val=='manual'){
						item.show = false
						
					}else{
						item.show = true
					}
					
				}
				if(item.name=='否定商品投放'){
					if(val=='manual'&&state.form.targetType=="keywords"){
						item.show = true
					}else{
						item.show = false
					}
				}
				if(item.name=='否定关键词'){
					if(val=='manual'){
						item.value=7
					}else{
						item.value = 6
					}
					if(val=='manual'&&state.form.targetType=="product"){
						item.show = true
					}else{
						item.show = false
					}
				}
			})
	}
	
	function targetPositionChange(val){
	 state.tabs.forEach((item)=>{
		 if(item.name=='否定关键词'){
			 if(val=='keywords'){
				item.show = false 
			 }else{
				 item.show = true
			 }
		 }
		 if(item.name=='否定商品投放'){
			 if(val=='keywords'){
				item.show = true 
			 }else{
				 item.show = false
			 }
		 }
		 
	 })
	}
</script>

<style scoped>
 .l-content{
	 width:208px;
	 padding:16px;
 }
 .ad-body{
	 padding:0px 24px;
 }
  .r-content{
	  padding:16px 0px;
  }
 .item-tab{
	 font-size:14px;
	 line-height:40px;
	 padding-left:24px;
	 border-radius: 2px;
	 cursor:pointer;
	 color:#999;
 }
  .item-tab.active {
	  background-color:#f5f5f5;
  }
  .item-tab.active .el-link{
	  color:#333!important;
  }
  .flex-center{
	  margin-bottom:24px;
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
  .footer-box{
	  background-color: #fff;
	  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
	  padding:16px 24px;
	  width:100%;
  }
</style>
<style>
	.have-ass-text-radio  .el-radio__input{
		  padding-top:6px;
	}
</style>