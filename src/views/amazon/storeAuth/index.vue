<template>
	<div class="main-sty">
		<el-row gutter="16">
			<el-col :span="6">
				<el-card shadow="never" >
					<el-scrollbar style="height: calc(100vh - 112px);">
					<div class="el-card-head">
						<div><h3>店铺账号列表</h3>
						<p class="font-extraSmall">用于区分店铺的名称</p></div>
						<div>
							<div class="text-right" style="padding-right:20px">
								<el-space>
					          <el-link type="danger"  title="新增" @click="addStorename" :underline="false">
								  <plus theme="outline" size="24" :strokeWidth="5"/>
								  </el-link>
						     <el-link type="info" title="排序" size="small" linked @click="dialogRank.visible=true" :underline="false">
								   <el-icon :size="20" color="#409EFC"><Sort /></el-icon>
							  </el-link>
							  </el-space>
							  </div>
						</div>
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
	 <el-dialog
	 	   v-model="dialogRank.visible"
	 	   title="显示次序设置"
	 	   width="400px"
	 	 >
	 	 <div class="rank-list-title">
	 	 	<span>店铺名称</span>
	 	 	<span>显示次序</span>
	 	 	</div>	
	 	 <draggable
	 	     class="draggable"
	 	    :list="state.list"
	 	 	animation="300"
	 	 	@start="dragStart"
	 	 	@end="dragEnd"
	 	   >
	 	 	 <template #item="{ element }">
	 	       <div class="item" >
	 	         <el-card shadow="hover">
	 	 			 <el-space class="list-title">
	 	 			<drag class="ic-cen" theme="outline" size="16" fill="#9a9a9a" :strokeWidth="2"/>
	 	 			<span>{{element.name}}
	 	 			</span> 
	 	 			</el-space>
	 	 				<div class="font-extraSmall" style="float:right">{{element.findex}}</div>
	 	 		  </el-card>
	 	       </div>
	 	 		 </template>
	 	   </draggable>
	 	 <template #footer>
	 		 <el-button @click="dialogRank.visible=false">取消</el-button>
	 		 <el-button type="primary" @click="submitFormIndex">确认</el-button>
	 	 </template>
	 	  </el-dialog> 
</template>

<script>
	import Table from"./components/table.vue"
	import {vue,ref,reactive,onMounted} from "vue"
	import {Edit,ArrowDown,Delete,Sort} from '@element-plus/icons-vue';
	import {Help,Plus,MenuUnfold} from '@icon-park/vue-next';
	import {format,dateFormat} from '@/utils/index';
	import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus';
	import draggable from "vuedraggable";
	import groupApi from '@/api/amazon/group/groupApi.js';
	export default{
		name:'Index',
		components:{Table,Plus,Edit,Delete,draggable,Sort},
		setup(){
			let storename = ref();
			let storeid=ref();
			let dialogVisible =ref(false)
			let edittitle=ref("添加店铺")
			let storeList =reactive({list:[]})
			let dialogRank=reactive({visible:false});
			let state=reactive({list:[]});
			onMounted(()=>{
				loadStoreList()
			})
			function addStorename(){
				dialogVisible.value =true
				storeid.value="";
				edittitle.value="添加店铺"
			}
			function dragEnd(){
				state.list.forEach((item,index)=>{
					item.findex = index+1
				})
			}
			function saveStore(){
				let params ={}
				params.id=storeid.value;
				params.name =storename.value;
				if(!params.name){
					ElMessage({
						type:'error',
						message:'店铺名称不能为空！'
					});
					return;
				}
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
					state.list=JSON.parse(JSON.stringify(res.data));
				})
			}
		function submitFormIndex(){
			groupApi.updateBatch(state.list).then(res=>{
				ElMessage.success('排序成功');
				state.dialogRank.visible=false
				loadStoreList();
			}); 
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
				delectStore,edittitle,dialogRank,dragEnd,state,submitFormIndex,
			}
		}
	}
</script>

<style scoped="scoped">
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
 
    .draggable .item{
		margin-bottom:5px;
	}
	.m-b-16{
		margin-bottom:16px;
	}
	
	.m-b-16 h5{
		line-height: 32px;
	}
	.m-b-16 .el-input{
		margin-right:8px;
	}
	.el-menu{
		border-right:none;
	}
	.more-icon{
		transform:rotate(90deg);
		font-size:14px!important;
		margin-right: -8px!important;
		opacity: 0;
	}
	.el-menu-item{
		display: flex;
		justify-content: space-between;
	}
	.el-menu-item.is-active{
		background-color: var(--el-color-info-light-9);
	}
	.el-menu-item .isvisable{
		opacity: 1;
	}
	.el-menu-item:hover .more-icon{
		opacity: 1;
	}
	.rank-list-title{
		display: flex;
		justify-content: space-between;
		margin:0 16px;
		font-size: 12px;
		color: #999;
	}
</style>