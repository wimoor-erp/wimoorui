<template>
  <div class="flex el-white-bg">
		<div class="gird-line-left">
			 <parent-list @selectedItem="handleClick"  :ftype="warehouseType" />
		</div>
		<div class="gird-line-right">
		 <el-scrollbar>
          <children-list ref="childrenListRef"  :ftype="warehouseType" />
		  </el-scrollbar>
		</div>
  </div>
</template>
<script setup>
import ChildrenList from './components/childrenlist.vue';
import ParentList from './components/parentlist.vue';
import { useRoute,useRouter } from 'vue-router'
import { reactive, toRefs,ref } from 'vue'; 
const childrenListRef=ref(ChildrenList);
let router = useRouter();
const warehouseType=router.currentRoute.value.query.path.indexOf("oversea")>0?"oversea":"self";
const handleClick = (id) => {
		childrenListRef.value.show(id); 
 };
 
</script>
<style scoped="scoped">
.flex{
	display: flex;
}
	.flex .gird-line-left{
		width: 310px;
	}
	.flex .gird-line-right{
		flex:1;
	}
	.el-scrollbar{
		height: calc(100vh - 66px);
	}
</style>
