<template>
  <div>
    <el-space style="margin-bottom:8px;margin-top:16px;">
      <span class="pag-title">常用功能</span>
    </el-space>
    <div class="pag-radius-bor">
       <el-row >
		   <el-col :span="6" v-for="item in menuData">
			   <div class="item-fun" @click="goPage(item)">
				   <div class="item-icon" :style="{backgroundColor:item.bg}">
					    <icon-park
						 :type="item.icon"
						class="ic-cen"
						theme="outline" size="16" :fill="item.color" :strokeWidth="4"/>
				   </div>
				   <div class="item-text text-omit-1">{{item.name}}</div>
			   </div>
		   </el-col>
	   </el-row>
    </div>
 </div>
</template>
<script setup>
import {IconPark} from '@icon-park/vue-next/es/all';
import { ref,reactive,onMounted,watch,nextTick, toRefs } from 'vue'
import {useRouter } from 'vue-router'
const router = useRouter()
const state =reactive({
	menuData:[
		{
			name:'商品分析',
			icon:"workbench",
			url:'/amazon/sale/listing',
			color:'#e6a23c',
			bg:'#fdf6ec',
		},
		{
			name:'利润计算',
			icon:"adjustment",
			url:'/amazon/profit/calculator',
			color:'#3c8bfa',
			bg:'#f0f8ff',
		},
		{
			name:'产品管理',
			icon:"box",
			url:'/erp/product/localproduct',
			color:'#e6a23c',
			bg:'#fdf6ec',
		},
		{
			name:'采购单',
			icon:"transaction",
			url:'/erp/purchase/orders',
			color:'#ff7315',
			bg:'#fff9f4',
		},
		{
			name:'采购规划',
			icon:"shopping-cart",
			url:'/erp/purchase/plan',
			color:'#ff7315',
			bg:'#fff9f4',
		},
		{
			name:'FBA发货规划',
			icon:"transporter",
			url:'/erp/ship/ship_plan',
			color:'#ff7315',
			bg:'#fff9f4',
		},
		{
			name:'广告管理',
			icon:"inbox-r",
			url:'/amazon/manager',
			color:'#67c23a',
			bg:'#f0f9eb',
		},
		
	],
})
const {
	menuData,
}=toRefs(state)

function goPage(item){
	router.push({
		path:item.url,
		query:{
		title:item.name,
		path:item.url,
		}
	})
}
</script>
<style scoped>
 .item-fun{
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 16px;
	cursor: pointer;
 }
 .item-text{
	 font-size:12px;
	 color:#666;
 }
 .item-icon{
	 border-radius: 6px;
	 display: flex;
	 align-items: center;
	 justify-content: center;
	 width: 36px;
	 height:36px;
	 margin-bottom: 8px;
 }
 .pag-radius-bor{
	 padding-bottom: 0;
	 padding-right:0;
	 padding-left:0;
 }
</style>