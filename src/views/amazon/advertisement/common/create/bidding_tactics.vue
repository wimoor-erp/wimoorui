<template>
	<el-form-item label="竞价策略" >
		 <el-radio-group  v-model="forms.radio" class="have-ass-text-radio">
			 <div><div>
		      <el-radio label="1" >
				  动态竞价-只降低
				  <p >当您的广告不太可能带来销售时，我们将实时降低您的竞价。在2019年1月之前创建的任何广告活动都会使用此设置。</p>
				  </el-radio>
				</div>  
				<div>
		      <el-radio label="2" >
				  动态竞价-提高和降低
				  <p>当您的广告很有可能带来销售时，我们将实时提高您的竞价（最高可达100%），并在您的广告不太可能带来销售时降低您的竞价。</p>
				  </el-radio>
				</div>  
		      <el-radio label="3" >
				  固定竞价
				  <p > 我们将使用您的确切竞价和您设置的任何手动调整，而不会根据售出可能性对您的竞价进行更改。</p>
				  </el-radio>
				  </div>  
		 </el-radio-group>
	</el-form-item>
	<el-form-item  label="其他" >
		<div>
			<span class="text-black">根据广告位置调整竞价</span>
		<p class="font-extraSmall">除了竞价策略外，您可以将竞价提高多达900%</p>
		<el-space :size="24">
		<el-space>
			<span class="text-black">搜索结果顶部(首页)</span>
			<el-input>
				<template #suffix>%</template>
			</el-input>
		</el-space>
		<el-space>
			<span class="text-black">商品页面</span>
			<el-input>
				<template #suffix>%</template>
			</el-input>
		</el-space>
		</el-space>
		<p class="font-extraSmall">示例: 输入50%, 对于此广告位, $1.00竞价将为$1.50</p>
		</div>
	</el-form-item>
</template>

<script setup>
	import { ref ,reactive,onMounted,toRefs,watch} from 'vue'
    const props=defineProps({
		forms:{},
	})
	const {
	    forms,
	} = toRefs(props);
</script>

<style scoped>
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
	.text-black{
		color:#333;
	}
</style>
<style>
	.have-ass-text-radio  .el-radio__input{
		  padding-top:6px;
	}
</style>