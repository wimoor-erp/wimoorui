<template>
	<div class="gird-line-head">
		<div class="flex-center">
		<Group @change="getGroup" isproduct="ok" />
		<el-input v-model="searchKeywords"  @input="changeKeywords"  placeholder="请输入" class="input-with-select">
			<template #prepend>
				<el-select v-model="searchtype" @change='searchTypeChange' placeholder="SKU">
					<el-option label="SKU" value="sku">SKU</el-option>
					<el-option label="ASIN" value="asin">ASIN</el-option>
				</el-select>
			</template>
			<template #append>
					<el-button @click="searchConfirm">
						<el-icon class="font-base ic-cen">
							<search />
						</el-icon>
			 </el-button>
				</template>
			</el-input>
		</div>
		<el-button class='ic-btn' title='帮助文档'>
			<help theme="outline" size="16" :strokeWidth="3" />
		</el-button>
	</div>
	<div class="grid-content">
	<div class="left-content">
		<div class="con-header">
		<h4>SKU列表</h4>
		</div>
		<ul class="sku-list" v-infinite-scroll="load">
		 <li class="pointer" v-for="item in skuList" @click="selectSku(item.sku)" :class="{'active':item.active}">{{item.sku}}<div class="font-extraSmall">ASIN：{{item.asin}}</div></li>	
		</ul>
	</div>
	
	<div class="right-content">
		<el-scrollbar class="screen-height gary-bg">
			<DataDeatils/>
		</el-scrollbar>
	</div>
	</div>
</template>

<script setup>
	import {Help} from '@icon-park/vue-next';
	import {Search,ArrowDown,} from '@element-plus/icons-vue';
	import DataDeatils from"./components/data_deatils"
	import Group from '@/components/header/group.vue';
	import {ref,reactive,toRefs,onMounted}from"vue"
	let state=reactive({
		skuList:[
			{sku:'A2032KQJYA',asin:'B07F1VH6YK',active:true,},
			{sku:'A2085FPJYASL',asin:'B06F1VH6YK',active:false,}
		]
	})
	let load = () => {
	  console.log("滚动加载数据方法")
	}
	let {skuList} =toRefs(state);
	function selectSku(sku){
		state.skuList.forEach((item)=>{
			item.active = false
			if(item.sku==sku){
				item.active=true
			}
		})
	}
</script>

<style scoped="scoped">
	.grid-content{
		display: flex;
	}
	.con-header{
		margin:16px 24px; 
	}
	.con-header h4{
		margin-top:16px;
	}
	.sku-list li{
		padding:16px 16px 16px 24px;
	}
	.sku-list li.active{
		background-color: var(--el-bg-color);
		border-left:3px solid var(--el-color-primary)
	}
  .right-content{
	  flex:1;
  }
 .screen-height{
	   height:calc(100vh - 108px); 
  }
  .left-content{
	  width: 200px;
  }
</style>
