<template>
	<div class="main-sty"> 
		<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
		  <el-tab-pane label="全部订单" name="" key="">
		  </el-tab-pane>
		  <el-tab-pane label="待审核" name="1" :key="1">
		  </el-tab-pane>
		  <el-tab-pane label="待配货" name="2" :key="2">
		  </el-tab-pane>
		  <el-tab-pane label="待装箱" name="3" :key="3">
		  </el-tab-pane>
		  <el-tab-pane label="待发货" name="4" :key="4">
		  </el-tab-pane>
		  <el-tab-pane label="已发货" name="7" :key="7">
		  </el-tab-pane>
		  <el-tab-pane label="已取消" name="12" :key="12">
		  </el-tab-pane>
		  <el-tab-pane label="已驳回" name="11" :key="11">
		  </el-tab-pane>
		
		</el-tabs>
		<Header @getdata="changedata" ref="headerRef"  />
		 <Table ref="tableRef" />
	</div>
</template>

<script>
	import Table from "./components/table.vue"
	import Header from "./components/header.vue";
	import { ref,reactive,onMounted } from 'vue'
	export default{
		name:'发货单',
		components:{Header,Table},
		setup(){
			let tableRef=ref(Table)
			let headerRef= ref()
			let obj = reactive({auditstatus:null})
			let activeName = ref("")
			function handleClick(){
				if(activeName.value==""){
					obj.auditstatus = null;
				}else if(activeName.value=="0"){
					obj.auditstatus = 0
				}else if(activeName.value=="1"){
					obj.auditstatus = 1
				}else if(activeName.value=="2"){
					obj.auditstatus = 2
				}else if(activeName.value=="3"){
					obj.auditstatus = 3
				}else if(activeName.value=="4"){
					obj.auditstatus = 4
				}else if(activeName.value=="5"){
					obj.auditstatus = 5
				}else if(activeName.value=="6"){
					obj.auditstatus = 6
				}else if(activeName.value=="7"){
					obj.auditstatus = 7
				}else if(activeName.value=="8"){
					obj.auditstatus = 8
				}else if(activeName.value=="11"){
					obj.auditstatus = 11
				}else if(activeName.value=="12"){
					obj.auditstatus = 12
				}
				
				tableRef.value.getshipplanData(obj);
			}
			function changedata(data){
				obj.groupid = data.groupid;
				obj.marketplaceid =data.marketplaceid;
				obj.warehouseid = data.warehouseid;
				obj.start =data.start;
				obj.end = data.end;
				if(data.seachtype){
					obj.seachtype =data.seachtype;
				}else{
					obj.seachtype ="sku";
				}
				if(data.searchwords){
					obj.searchwords = data.searchwords;
				}else{
					obj.searchwords ="";
				}
				if(data.color){
					obj.color=data.color;
				}else{
					obj.color="";
				}
				tableRef.value.getshipplanData(obj)
			}
			return{
				activeName,tableRef,obj,headerRef,handleClick,changedata
			}
		}
	}
</script>

<style>
</style>
