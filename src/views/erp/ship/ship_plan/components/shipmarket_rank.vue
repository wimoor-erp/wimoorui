<template>
	<el-dialog   v-model="rankVisible" title="设置FBA站点配货优先级" width='600px'>
	<div class="rank-list-title">
	<span>FBA仓库</span>
	<span>优先级</span>
	</div>	
  <draggable
      class="draggable"
     :list="list"
	   animation="300"
	   @start="onStart"
	 @end="onEnd"
    >
	 <template #item="{ element }">
        <div class="item" >
          <el-card shadow="hover">
			 <el-space class="list-title">
			<drag class="ic-cen" theme="outline" size="16" fill="#9a9a9a" :strokeWidth="2"/>
			<span>{{element.name}}
			<p class="font-extraSmall">{{element.market}}</p>
			</span> 
			</el-space>
				<span>{{element.order}}</span>
		  </el-card>
        </div>
		 </template>
    </draggable>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submitFunc">保存</el-button>
				</span>
			</template>
	</el-dialog>
</template>

<script>
	import { ref ,reactive} from 'vue'
	import {Drag} from '@icon-park/vue-next';
	//需要安装依赖 npm i -S vuedraggable@next
	//使用文档地址https://www.itxst.com/vue-draggable-next/tutorial.html
	import draggable from "vuedraggable";
	import '@/assets/css/draggable.css'
	export default {  
	   name: 'index',
	   components: {
		  draggable,Drag,
	   },
	   setup(){
		   let rankVisible =ref(false)
		   let list =reactive([
			     { name: "美国", order: 0,market:'FBA-US' },
			      { name: "加拿大", order: 1 ,market:'FBA-CA'},
			      { name: "英国", order: 2 ,market:'FBA-UK'},
		   ])
	 		return{
				rankVisible,
				list,   
			}
	 }
	}
</script>

<style>
	.rank-list-title{
		display: flex;
		justify-content: space-between;
		margin:0 16px;
		font-size: 12px;
		color: #999;
	}
</style>
