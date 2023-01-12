<template>
	<el-form :inline="true">
		<el-form-item label="已绑定的1688账号" class="margin-b">
			<el-select></el-select>
		</el-form-item>
		<el-form-item label="1688订单号" class="margin-b">
			<el-input></el-input>
		</el-form-item>
		<el-form-item class="margin-b">
			<el-button type="primary">确认关联</el-button>
		</el-form-item>
	</el-form>
	<el-divider></el-divider>
	<el-row :gutter="24">
		<el-col :span="14">
			 <el-descriptions title="收货信息" size="small" :column="1">
			    <el-descriptions-item label="订单号">3049452183525978860</el-descriptions-item>
			    <el-descriptions-item label="支付宝交易号">2022112322001833461411073871</el-descriptions-item>
			    <el-descriptions-item label="收货人">江欣</el-descriptions-item>
			    <el-descriptions-item label="收货地址">广东省 深圳市 龙华区 龙华街道清湖硅谷动力清湖园A17栋三楼</el-descriptions-item>
			    <el-descriptions-item label="手机">17702636172</el-descriptions-item>
			    <el-descriptions-item label="电话"></el-descriptions-item>
			  </el-descriptions>
		</el-col>
		<el-col :span="10">
			<el-descriptions title="卖家信息" size="small" :column="1">
			   <el-descriptions-item label="供应商">深圳市龙岗区佳勇印刷厂</el-descriptions-item>
			   <el-descriptions-item label="会员登陆名">lu印刷厂</el-descriptions-item>
			   <el-descriptions-item label="支付宝账户"></el-descriptions-item>
			   <el-descriptions-item label="手机"></el-descriptions-item>
			   <el-descriptions-item label="电话"></el-descriptions-item>
			 </el-descriptions>
		</el-col>
	</el-row>
	<el-table border>
		<el-table-column prop="type" label="图片" width="65">
			<template #default="scope">
				<el-image :src="scope.row.image" class="product-img"></el-image>
			</template>
		</el-table-column>
		<el-table-column  prop="pay" label="商品名称" />
		<el-table-column prop="type" label="单价" />
		 <el-table-column prop="price" label="数量"/>
		  <el-table-column prop="remarks" label="优惠"  />
		  <el-table-column prop="operate" label="状态" >
		  <template #default="scope">
		  		<el-tag :type="scope.row.state.type">{{scope.row.state.label}}</el-tag>
		  	</template>
		  </el-table-column>
		  <el-table-column prop="time" label="总价"  />
	</el-table>
	<div class="m-t-8  sum-p-t">
		<div>
		   <p class="font-small"><span >运费</span><span >￥4.00</span></p>
		   <p  class="font-small"><span >退款</span><span >￥0.00</span></p>
		   <p ><span>已付款</span><span class="text-red-18">￥31.97</span></p>
		   </div>
	</div>
</template>

<script setup>
	import {ref,reactive,onMounted,toRefs,} from 'vue'
</script>

<style>
	.sum-p-t p{
		display:flex;
		justify-content: space-between;
		width: 200px;
	}
	.sum-p-t{
		display: flex;
		justify-content: flex-end;
	}
	.text-red-18{
		color:var(--el-color-primary);
		font-size: 18px;
		font-weight: 700;
	}
	.margin-b{
		margin-bottom: 8px;
	}
</style>
