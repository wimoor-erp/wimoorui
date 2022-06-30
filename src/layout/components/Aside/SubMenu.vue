<template>
  <el-space direction="vertical" :size="24" alignment="left" style="width:100%" fill="true">
  <div class="item">	  
  <div class="text ">本地产品</div>
  <div class="text ">产品标签</div>
  </div>
   <div class="item">
	<div class="text ">品牌管理</div>
	<div class="text ">品类管理</div>
  </div>
  <div class="item">
	<div class="text ">SKU配对</div>
  </div>
  </el-space>
</template>
<script>
</script>
<style>
  .text{
	  color:var(--el-text-color-primary);
	  font-size:14px;
	  padding:8px 16px;
	  border-radius: 2px;
	  cursor: pointer;
	  transition: background-color var(--el-transition-duration),color var(--el-transition-duration);
  }
    .text:hover{
     background-color: var(--el-bg-color);
	}
	.text:active{
		color:var(--el-color-primary);
		 background-color:var(--el-color-primary-light-7);
	}
</style>