<template>
	<div class="con-body">
		<div class="header"><span class="menuTitle"> 菜单权限</span><span class="roleTitle font-extraSmall">{{title}}</span></div>
		<el-scrollbar height="calc(100vh - 120px)">
		<el-tree ref="menuTree"
		    :props="defaultProps"
		    :data="treeMenu"
			 v-loading="loading"
		     show-checkbox
			 node-key="id"
			 default-expand-all
		    @check="handleCheckChange"
			@current-change="handleCurrentChange"
			@node-click="handleClick"
		  />
	    </el-scrollbar>
	</div>
</template>

<script>
import { onMounted, reactive, ref, toRefs, watch } from 'vue';
	import {listCompanyMenuTree,roleMenuIds} from "@/api/sys/admin/menu"
	import {getRoleMenus,updateRoleMenu} from "@/api/sys/admin/roles"
	import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
	import {Help} from '@icon-park/vue-next';
	export default {
	  name: 'MenuList',
	  components: {Help,ElForm, ElMessage, ElMessageBox,},
	   emits:["selectMenu"],
	  setup(props,context){
		  const menuTree=ref();
		  const state = reactive({
		    loading: false,
			title:"",
			defaultProps : {
			  children: 'children',
			  label: 'name', },
		    queryParams:{menuIds:[]} ,
		    dialog: { visible: false } ,
			treeMenu:[],
		    formData: { } ,
		   });
		   const { loading,formData,  queryParams ,treeMenu,defaultProps,title} =  toRefs(state);
		   
		   function loadData(row){
			   state.queryParams=row;
			   state.title="-"+row.name;
			   menuTree.value.setCheckedKeys([]);
			   state.loading=true;
			   getRoleMenus(state.queryParams.id).then(res=>{
				   state.formData.menuIds=res.data;
				   if(res.data){
					   res.data.forEach(item=>{
						     menuTree.value.setChecked(item,true,false);
					   })
				   }
				   state.loading=false;
			  })
		   }
		   
      
		   function handleCheckChange(rows){
					state.queryParams.menuIds=menuTree.value.getCheckedKeys();
					updateRoleMenu(state.queryParams.id,state.queryParams).then(res=>{
							  ElMessage.success('修改成功');
					})
		   }
		   function handleCurrentChange(node){
				context.emit("selectMenu",state.queryParams,node.data);
		   }
		 
		  function handleClick(){
			  
		  }
		   onMounted(()=>{
			   state.loading=true;
			   listCompanyMenuTree().then(res=>{
				   state.treeMenu=res.data;
				   state.loading=false;
			   })
		   })
		   
		   return{
			   loading, formData,  queryParams ,treeMenu,defaultProps,title,//modal
			   loadData,handleCurrentChange,handleCheckChange,handleClick,//function
			   menuTree,//ref
		   }
	}
	}
</script>

<style scoped>
	.menuTitle{
		font-size: 16px;
		font-weight: bold;
		padding-bottom:16px;
		padding-top:4px;
		padding-left:5px;
	}
	.header{
		margin-bottom:10px;
		width:180px;
		white-space:nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.con-body{
		padding-top:16px;
	}
</style>
