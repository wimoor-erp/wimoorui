<template>
	<el-row>
	    <el-space >
	     <Owner @owner="changeOwner" ref="ownerRef" ></Owner>
	   <Category @change="changeCategory" ref="categoryRef"></Category>
	   <Tags @change="changeTags" ref="tagsRef"></Tags>
	   <el-input  v-model="searchKeywords" clearable @input="changeData" placeholder="请输入" class="input-with-select" >
	      <template #prepend>
	        <el-select v-model="searchType" placeholder="SKU" style="width: 110px">
	          <el-option label="SKU" value="sku"></el-option>
	          <el-option label="产品名称" value="name"></el-option>
	          <el-option label="供应商" value="supplier"></el-option>
	           <el-option label="备注" value="remark"></el-option>
	        </el-select>
	      </template>
	      <template #append>
	        <el-button @click.stop="changeData">
	           <el-icon class="ic-cen font-medium">
	            <search />
	         </el-icon>
	        </el-button>
	      </template>
	    </el-input>
		<el-popover   :teleported="true"  :width="500" trigger="click">
			<template #reference>
			<el-button  title='高级筛选'  class='ic-btn'>
			  <filtericon></filtericon>
			</el-button>
			</template>
			 <el-form  label-width="auto"  label-position="left">
				 <el-form-item label="类型">
					 <el-radio-group v-model="productType">
					      <el-radio-button label="全部产品" />
					      <el-radio-button label="单独产品" />
						  <el-radio-button label="组合产品" />
						  <el-radio-button label="待组装产品" />
					    </el-radio-group>
					 </el-form-item>	
				<el-form-item label="产品状态">
				     <el-radio-group v-model="isdelete" >
				           <el-radio label="0" size="large" >启用</el-radio>
				           <el-radio label="1" size="large" >停用</el-radio>
				         </el-radio-group>
				   </el-form-item>
				<el-form-item label="备注">
				  <el-input
				      v-model="remarks"
				      :rows="2"
				      type="textarea"
				      placeholder="请输入"
				    />
				 </el-form-item>
				 <el-form-item>
					 <el-button type="primary" @click.stop="submitQuery" plain>确认</el-button>
				  </el-form-item>
				 </el-form>
			  </el-popover>	 
	    <el-button @click.stop="clearSearch">重置</el-button>
	  </el-space>
	  </el-row>
	   <!--功能区域 -->
	  <el-row>
	   <el-space >
	    <el-button type="primary" class="im-but-one" @click="addProduct">
	      <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
	      <span>添加产品</span>
	    </el-button>
	    <el-dropdown trigger="click">
	      <el-button>
	                 导入数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
	      </el-button>
	      <template #dropdown>
	        <el-dropdown-menu >
	          <el-dropdown-item @click="importProduct('base')">导入产品</el-dropdown-item>
	          <el-dropdown-item @click="importProduct('image')">导入图片</el-dropdown-item>
	          <el-dropdown-item @click="importProduct('supplier')">导入供应商</el-dropdown-item>
	          <el-dropdown-item @click="importProduct('cons')">导入耗材</el-dropdown-item>
			  <el-dropdown-item @click="importProduct('customs')">导入海关</el-dropdown-item>
			  <el-dropdown-item @click="importProduct('assembly')">导入组装关系</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
		<el-dropdown trigger="click" v-hasPerm="'erp:material:download'">
		  <el-button>
		             导出数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
		  </el-button>
		  <template #dropdown>
		    <el-dropdown-menu >
		      <el-dropdown-item @click="downloadProduct('base')">导出产品</el-dropdown-item>
		      <el-dropdown-item @click="downloadProduct('supplier')">导出供应商</el-dropdown-item>
		      <el-dropdown-item @click="downloadProduct('cons')">导出耗材</el-dropdown-item>
			  <el-dropdown-item @click="downloadProduct('customs')">导出海关</el-dropdown-item>
			  <el-dropdown-item @click="downloadProduct('assembly')">导出组装关系</el-dropdown-item>
		    </el-dropdown-menu>
		  </template>
		</el-dropdown>
	    <el-button @click.stop="showPictureDialog">
			同步图片/尺寸
		</el-button>
	    <el-dropdown trigger="click">
	      <el-button>
	                 更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
	      </el-button>
	      <template #dropdown>
	        <el-dropdown-menu >
	          <el-dropdown-item @click.stop="recoverRows">启用</el-dropdown-item>
	          <el-dropdown-item @click.stop="deleteRows">停用</el-dropdown-item>
	          <el-dropdown-item @click.stop="purchaseRows">采购</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
	   </el-space> 
	   <div class='rt-btn-group'>
	   <el-button class='ic-btn'  title='列配置'>
	      <setting-two theme="outline" size="16"  :strokeWidth="3"/>
	   </el-button>
	    <el-button   class='ic-btn' title='帮助文档'>
	     <help theme="outline" size="16" :strokeWidth="3"/>
	   </el-button>
	   </div>
	</el-row>
	<!-- 上传文件弹框 -->
	<el-dialog
	   v-model="uploadVisible"
	   :title="uploadTitle"
	   width="400px"
	 >
	 <el-upload
	     :drag="true"
	     action
		 :http-request="uploadFiles"
		 :limit="1"
		 :before-upload="beforeUpload" 
		 :show-file-list="true" 
		 :headers="headers" 
		 accept=".xls,.xlsx,.zip"
	     multiple
	   >
	     <el-icon class="font-large"><upload-filled /></el-icon>
	     <div class="el-upload__text">
	      拖拽文件到此处或 <em>点击上传</em>
	     </div>
	   </el-upload>
	 <template #footer>
	   <span class="dialog-footer">
		   <div class="flex-center-between">
		 <el-button v-if="state.uploadTitle!='导入产品图片'" type="success" @click.stop="downloadTemp" plain>下载模板</el-button>
		 <span class="font-extraSmall" v-else>图片需对应SKU命名(sku.jpg/png),<br/>然后压缩文件为zip上传</span>
		 <div>
	     <el-button @click="uploadVisible = false">取消</el-button>
	     <el-button type="primary" @click.stop="uploadExcel">
	       上传文件
	     </el-button></div></div>
	   </span>
	 </template>
	  </el-dialog>
	  <!-- 图片同步弹框 -->
	  <el-dialog v-model="pictureDialog" title="同步图片/尺寸" width="1000px">
	  	  <el-table :data="pictureTable" style="width: 100%">
			  <el-table-column prop="image" label="产品图片" width="80" >
				 <template #default="scope"> 
					 <el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
					 <el-image v-else  :src="require('@/assets/image/empty/noimage40.png')" width="40" height="40"></el-image>
				 </template> 
			  </el-table-column>
			   <el-table-column prop="name" label="本地产品名称" show-overflow-tooltip width="200" >
				   <template #default="scope"> 
					<div v-if="scope.row.pname" :src="scope.row.name"  >
							 本地SKU:{{scope.row.sku}}
							 <div>{{scope.row.name}}</div>
					</div>
				    </template> 
			   </el-table-column>
			  <el-table-column prop="infoimage" label="商品图片"  width="80" >
					<template #default="scope">
						 <el-image v-if="scope.row.infoimage" :src="scope.row.infoimage"   width="40" height="40"  ></el-image>
						 <span v-else>无</span>
					 </template> 
			  </el-table-column>  
			   <el-table-column prop="pname" label="在售商品名称" show-overflow-tooltip width="200" >
				   <template #default="scope">
				   	 <div v-if="scope.row.pname" :src="scope.row.pname"  >
						 平台SKU:{{scope.row.infoSKU}}
						 <div>{{scope.row.pname}}</div>
					 </div>
				   	 <span v-else>暂无在售商品！</span>
				    </template>
			   </el-table-column>  
			  <el-table-column prop="infosize" label="在售尺寸" >
				  <template #default="scope">
				  	 <span v-if="scope.row.infosize"    >{{scope.row.infosize}}</span>
				  	 <span v-else>暂无在售尺寸！</span>
				   </template>
			  </el-table-column>  
			  <el-table-column prop="ischeck" label="操作" width="120" >
				 <template #default="scope">
					 <el-checkbox v-if="scope.row.infosize || scope.row.infoimage"  v-model="scope.row.ischeck" ></el-checkbox>
					 <span v-else></span>
				 </template> 
			  </el-table-column>
		  </el-table>
	  	  <template #footer>
	  	  	<span class="dialog-footer">
				<el-button type="primary" @click.stop="submitSize">一键同步尺寸</el-button>
				<el-button type="primary" @click.stop="submitPicture">一键同步图片</el-button>
	  	  		<el-button  @click="pictureDialog = false">取消</el-button>
	  	  	</span>
	  	  </template>
	  </el-dialog>
</template>

<script setup>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import {Search,ArrowDown,UploadFilled} from '@element-plus/icons-vue'
	import { useRoute,useRouter } from 'vue-router'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { ref,reactive,onMounted,watch,toRefs,defineEmits,defineExpose } from 'vue'
	import Owner from '@/components/header/owner.vue';
	import Tags from '@/components/header/tags.vue';
	import Category from '@/components/header/category.vue';
	import materialApi from '@/api/erp/material/materialApi.js';
	import materialZipApi from '@/api/erp/material/materialZipApi.js';
	import {getAllTags} from '@/api/sys/admin/tag.js';
	import downloadTemplateFileApi from '@/api/erp/common/downloadTemplateFileApi';
	import downloadhandler from "@/utils/download-handler";
	import filtericon from "@/components/icon/filtericon.vue";
	onMounted(()=>{
		changeData();
	})
	const emit = defineEmits(['getdata']);
	let router = useRouter();
	let ownerRef=ref();
	let categoryRef=ref();
	let tagsRef=ref();
	let state =reactive({
		uploadVisible:false,
		uploadTitle:'导入产品基础',
		uploadtype:'base',
		searchType:'sku',
		searchKeywords:'',
		isdelete:'0',
		remarks:'',
		productType:'全部产品',
		tagsList:[],
		tagsValue:'',
		queryParam:{},
		markprops:{ multiple: true },
		selectRows:[],
		myfile:null,
		pictureDialog:false,
		pictureTable:[],	
	})
	let{searchType,searchKeywords,tagsList,tagsValue,PersonData,Person,categoryList,category,
	   productType,isdelete,remarks,uploadTitle,uploadVisible,queryParam,markprops,selectRows,myfile,uploadtype,pictureDialog,
	   pictureTable
	//buyerData,buyer
	}=toRefs(state)
			
			 
			function addProduct(){
				router.push({
					path:'/localproduct/editinfo',
					query:{
					  title:"添加产品",
					  path:'/localproduct/editinfo',
					  details:'',
					  refresh:true,
					},
				}) 
				 
			}
		function importProduct(ftype){
			state.uploadVisible = true;
			state.uploadtype=ftype;
			if(ftype=="base"){
				state.uploadTitle="导入产品基础";
			}
			if(ftype=="image"){
				state.uploadTitle="导入产品图片";
			}
			if(ftype=="supplier"){
				state.uploadTitle="导入产品默认供应商";
			}
			if(ftype=="cons"){
				state.uploadTitle="导入产品耗材";
			}
			if(ftype=="customs"){
				state.uploadTitle="导入产品海关";
			}
			if(ftype=="assembly"){
				state.uploadTitle="导入产品组装关系";
			}
		}
		function downloadProduct(ftype){
			state.uploadVisible = false;
			 var data={};
			 data=state.queryParam;
			 if(ftype=="assembly"){
				 ftype="MaterialAssembly";
				 data.issfg="1";
			 }
			 if(ftype=="base"){
			 	ftype='MaterialBaseInfo';
			 }
			 if(ftype=="supplier"){
			 	ftype='MaterialSupplier';
			 }
			 if(ftype=="cons"){
			 	ftype='MaterialConsumable';
			 }
			 if(ftype=="customs"){
			 	ftype='MaterialCustoms';
			 }
			 data.downtype=ftype;
			 materialApi.downExcelRecords(data);
		}
		function changeOwner(id){
			state.queryParam.owner=id;
			changeData();
		}
		function changeTags(tags){
			 state.queryParam.taglist=tags;
			 changeData();
		}
		
		function changeCategory(value){
			state.queryParam.categoryid=value;
			changeData();
		}
		function submitQuery(){
			var issfg="";
			if(state.productType=="全部产品"){
				issfg="";
			}else if(state.productType=="单独产品"){
				issfg="0";
			}else if(state.productType=="组合产品"){
				issfg="1";
			}else if(state.productType=="待组装产品"){
				issfg="2";
			}
			state.queryParam.issfg=issfg;
			state.queryParam.isDelete=state.isdelete;
			state.queryParam.remark=state.remarks;
			changeData();
		}
		function changeData(){
			 state.queryParam.searchtype=state.searchType;
			 state.queryParam.search=state.searchKeywords;
			 emit('getdata',state.queryParam);
		}
		function deleteRows(){
			if(state.selectRows && state.selectRows.length>0){
				var ids="";
				state.selectRows.forEach(function(item){
					ids+=(item.id+",");
				});
				materialApi.deleteData({"ids":ids}).then((res)=>{
					if(res.data){
						ElMessage({
							  message: '批量删除成功！',
							  type: 'success'
						})
						changeData();
					}
				})
			}
		}
		function recoverRows(){
			if(state.selectRows && state.selectRows.length>0){
				state.selectRows.forEach(function(item){
					if(item.isDelete==true || item.isDelete==1){
						materialApi.recoverData({"id":item.id,"sku":item.sku}).then((res)=>{
							if(res.data){
								ElMessage({
									  message: res.data,
									  type: 'success'
								})
								changeData();
							}
						})
					}
				});
				
			}
		}
		function purchaseRows(){
			//跳转至采购的路由url
			var materialList=[];
			state.selectRows.forEach(item=>{
				materialList.push(item.id);
			})
				router.push({
					path:"/e/p/o",
					query:{
						title:'添加采购单',
						path:"/e/p/o",
						materialList:materialList
					},
				})
			 
		}
		function downloadTemp(){
			if(state.uploadtype=="base"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialBaseInfo'});
			}
			if(state.uploadtype=="image"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialImage'});
			}
			if(state.uploadtype=="supplier"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialSupplier'});
			}
			if(state.uploadtype=="cons"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialConsumable'});
			}
			if(state.uploadtype=="customs"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialCustoms'});
			}
			if(state.uploadtype=="assembly"){
				downloadTemplateFileApi.downExcelTemp({"ftype":'MaterialAssembly'});
			}
		}
		//文件上传之前
		function beforeUpload(file){
			if (file.type != "" || file.type != null || file.type != undefined){
			    //截取文件的后缀，判断文件类型
				const FileExt = file.name.replace(/.+\./, "").toLowerCase();
				//计算文件的大小
				const isLt5M = file.size / 1024  < 50000; //这里做文件大小限制
				//如果大于50M
				if (!isLt5M) {
					ElMessage({
					    message: '上传文件大小不能超过 50MB!!',
					    type: 'error'
					  })
					return false;
				}
				else {
				   return true;
				}
			}
		}
		function uploadFiles(item){
			//上传文件的需要formdata类型;所以要转
			state.myfile=item.file;
		}
		function uploadExcel(){
			let FormDatas = new FormData()
			FormDatas.append('file',state.myfile);
			if(state.uploadtype=="base"){
				materialApi.uploadBaseInfoFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					  changeData();
				})
			}
			if(state.uploadtype=="image"){
				materialZipApi.uploadFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					  changeData();
				})
			}
			if(state.uploadtype=="supplier"){
				materialApi.uploadSupplierFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					  changeData();
				})
			}
			if(state.uploadtype=="cons"){
				materialApi.uploadConsumableFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					   changeData();
				})
			}
			if(state.uploadtype=="customs"){
				materialApi.uploadCustomsFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					   changeData();
				})
			}
			if(state.uploadtype=="assembly"){
				materialApi.uploadAssemblyFile(FormDatas).then(function(res){
					 ElMessage({
					   type: 'success',
					   message: '上传成功',
					 });
					  state.uploadVisible = false;
					  changeData();
				})
			}
			
			
		}
		function showPictureDialog(){
			if(state.selectRows && state.selectRows.length>0){
				state.pictureDialog=true;
				var skulist="";
				var picturelist=[];
				state.selectRows.forEach(function(item){
					skulist+=(item.sku+"%,#");
					item.ischeck=false;
					picturelist.push(item);
				});
				state.pictureTable=picturelist;
				materialApi.findSKUImageForProduct({"skulist":skulist}).then((res)=>{
					if(res.data){
						res.data.forEach(function(items){
							state.pictureTable.forEach(function(mitem){
								if(mitem.sku==items.materialSKU){
									mitem.infoimage=items.image;
									mitem.pname=items.infoName;
									mitem.infoSKU=items.infoSKU;
									mitem.infosize="长:"+items.length+items.lenunit+",宽:"+items.width+items.wunit+
									",高:"+items.height+items.hunit+",重:"+items.weight+items.weunit;
									mitem.dimid=items.dimid;
								}
							});
						});
					}
					
				});
				
			}else{
				ElMessage({
				  type: 'error',
				  message: '请至少选择一行数据！',
				});
			}
		}
		function submitPicture(){
			var materialids="";
			var skus="";
			var images="";
			state.pictureTable.forEach(function(item){
				if(item.ischeck==true){
					if(item.infoimage){
						materialids+=(item.id+"%,#");
						skus+=(item.sku+"%,#");
						images+=(item.infoimage+"%,#");
					}
				}
			});
			if(materialids!="" && skus!="" && images!=""){
				materialApi.copyImageForProduct({"sku":skus,"materialid":materialids,"image":images}).then((res)=>{
					    var data=res.data;
						if(data && data.length > 0){
							var msg = "";
							for(var i = 0; i < data.length; i++){
								msg += data[i].sku + ";";
							}
							ElMessage({
							  type: 'error',
							  message: msg + ":同步失败!",
							});
						}else{
							ElMessage({
							  type: 'success',
							  message:  "同步成功!",
							});
							state.pictureDialog=false;
							changeData();
						}
				});
			}else{
				ElMessage({
				  type: 'error',
				  message: "请选择同步产品!",
				});
			}
			
		}
		function submitSize(){
				var materialids="";
				var skus="";
				var dims="";
				state.pictureTable.forEach(function(item){
					if(item.ischeck==true){
						if(item.dimid){
							materialids+=(item.id+"%,#");
							skus+=(item.sku+"%,#");
							dims+=(item.dimid+"%,#");
						}
					}
				});
				if(materialids!="" && skus!="" && dims!=""){
					materialApi.copyDimsForProduct({"sku":skus,"materialid":materialids,"dims":dims}).then((res)=>{
						    var data=res.data;
							if(data && data.length > 0){
								var msg = "";
								for(var i = 0; i < data.length; i++){
									msg += data[i].sku + ";";
								}
								ElMessage({
								  type: 'error',
								  message: msg + ":同步失败!",
								});
							}else{
								ElMessage({
								  type: 'success',
								  message:  "同步成功!",
								});
								state.pictureDialog=false;
								changeData();
							}
					});
				}else{
					ElMessage({
					  type: 'error',
					  message: "请选择同步产品!",
					});
				}
		}
		function clearSearch(){
			ownerRef.value.ownerid="";
			state.queryParam.owner="";
			categoryRef.value.state.category=""
			state.queryParam.categoryid="";
			state.searchType="sku";
			state.searchKeywords="";
			state.productType=="全部产品";
			state.queryParam.issfg="";
			state.queryParam.isDelete="0";
			state.isdelete="0";
			state.remarks="";
			state.queryParam.remark="";
			state.queryParam.taglist=[];
			tagsRef.value.state.tagsValue="";
			changeData();
		}
		defineExpose({
		  selectRows,submitQuery,
		})	
</script>

<style scoped>
	.font-large{
		font-size: 48px;
		color: #999;
	}
</style>
