<template>
	<div class="main-sty">
		<el-row gutter="16">
			<el-col :span="6">
				<el-card shadow="never" >
					<el-scrollbar style="height: calc(100vh - 112px);">
					<div class="el-card-head">
						<div><h3>店铺账号列表</h3>
						<p class="font-extraSmall">用于区分店铺的名称</p></div>
						
							<el-link type="danger" @click="addStorename" :underline="false"><plus theme="outline" size="24" :strokeWidth="5"/></el-link>
					</div>
					<div class="el-card-body">
						<el-card shadow="hover" v-if="storeList.list.length>0" v-for="item in storeList.list">
							<div><h4>{{item.name}}</h4>
							<p class="font-extraSmall">创建于：{{dateFormat(item.createtime)}}</p>
							</div>
							<el-space>
								<el-link @click="updataStorename(item)" type="info" :underline="false">
								<el-icon  class="font-medium"> <Edit /> </el-icon>
								</el-link>   
								<el-link @click="delectStore(item)" type="info" :underline="false">
								  <el-icon  class="font-medium">
								 <Delete/> 
								 </el-icon>
								 </el-link>
							</el-space> 
						</el-card>
						 <el-empty v-else description="请添加要授权的店铺!" />
					</div>
					</el-scrollbar>
				</el-card>
			</el-col>
			<el-col :span="18">
					<Table :storelist="storeList" />
			</el-col>
		</el-row>
	</div>
	 <el-dialog
	    v-model="dialogVisible"
	    :title=edittitle
	    width="30%"
		@close ="closedialog"
	  >
	   <el-input v-model="storename" placeholder="请输入店铺在系统上的名称!" class="input-with-select" />
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="dialogVisible = false">取消</el-button>
	        <el-button type="primary" @click="saveStore"  >确认</el-button >
	        
	       
	      </span>
	    </template>
	  </el-dialog>
	  
</template>

<script>
	import Table from"./components/table.vue"
	import {vue,ref,reactive,onMounted} from "vue"
	import {Edit,ArrowDown,Delete} from '@element-plus/icons-vue';
	import {Help,Plus,MenuUnfold} from '@icon-park/vue-next';
	import {format,dateFormat} from '@/utils/index';
	import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus'
	import groupApi from '@/api/amazon/group/groupApi.js';
	export default{
		name:'Index',
		components:{Table,Plus,Edit,Delete},
		setup(){
			let storename = ref();
			let storeid=ref();
			let dialogVisible =ref(false)
			let edittitle=ref("添加店铺")
			let storeList =reactive({list:[]})
			onMounted(()=>{
				loadStoreList()
			})
			function addStorename(){
				dialogVisible.value =true
				edittitle.value="添加店铺"
			}
			function saveStore(){
				let params ={}
				params.id=storeid.value;
				params.name =storename.value
				groupApi.AmazonGroupSave(params).then((res)=>{
					if(res.code==201){
						ElMessage({
							type:'success',
							message:'提交成功！'
						})
					dialogVisible.value =false
					loadStoreList()	
					}
				})
			}
			function loadStoreList(){
				groupApi.getAmazongroupList().then((res)=>{
					storeList.list = res.data
				})
			}
			function updataStorename(item){
				dialogVisible.value =true
				storename.value = item.name
				storeid.value = item.id
				edittitle.value="编辑店铺"
			}
			function closedialog(){
			 storename.value=""	
			}
			function delectStore(item){
			  let id =item.id
			  ElMessageBox.confirm(
					    '你确定要删除该店铺吗?',
					    {
					      confirmButtonText: '确认',
					      cancelButtonText: '取消',
					      type: 'warning',
						  callback:(action)=>{
							 if(action=="confirm"){
								groupApi.deleteAmazongroup(id).then(() => {
								      ElMessage({
								        type: 'success',
								        message: '删除成功',
								      })
									  loadStoreList();
								    })  
							 }
						  }
					    }
					  )
			

			}
			
			return{
				addStorename,storename,dialogVisible,saveStore,loadStoreList,
				storeList,dateFormat,updataStorename,storeid,closedialog,
				delectStore,edittitle
			}
		}
	}
</script>

<style>
	.el-card-head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}
	.el-card-body .el-card__body{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:16px 24px;
	}
	.el-card-body .el-card{
		margin-bottom:8px;
	}
</style>
