<template>
	<h3 id="base" class="tab-scroll">基础信息</h3>
	<el-form-item label="产品图片">
		<el-upload 
		    action="#"
		    list-type="picture-card"
			:show-file-list="false"
			:limit="1"
			:multiple="false"
			accept=".png,.jpeg,.jpg,.bmp"
			:headers="headers" 
			:http-request="uploadFiles"
			:before-upload="beforeUpload" 
			:on-exceed="handleExceed"
			 ref="uploadRef"
			auto-upload="true"
		>
		<div v-if="dataForms.id" >
			<img  width="130" height="130" v-if="dataForms.image && dataForms.image!=undefined"   :src="dataForms.image" alt="产品图片" />
			<img width="130" height="130" v-else   :src="require('@/assets/image/empty/noimage40.png')" alt="暂无图片" />
		</div>
		<el-icon v-else>
			<img  width="130" height="130" v-if="dataForms.image && dataForms.image!=undefined"   :src="dataForms.image" alt="产品图片" />
			<Plus v-else />
		</el-icon>
		</el-upload>
	</el-form-item>
	<el-form-item prop="baseforms.name" :rules="{ required: true,  message: '名称不能为空',  }" label="产品名称" >
		  <el-input v-model="dataForms.name" placeholder="产品名称"> </el-input>
	</el-form-item>
	<el-form-item label="SKU" prop="baseforms.sku"
	:rules="{ required: true,  message: 'SKU不能为空',  }"
	>
		<el-input class="in-wi-24" v-model="dataForms.sku" placeholder="建议用字母加数字，禁止用“空格、*、×、#”这类特殊符号"> </el-input>
	</el-form-item>
	<el-form-item label="品牌" class="grid-row">
		<el-select class="in-wi-24" v-model="dataForms.brandid" placeholder="选择品牌">
			<el-option v-for="(item,index) in brandlist" :label="item.name" :value="item.id" />
		</el-select>
		<el-button type="primary"  link @click="jumpBrand">
			<el-icon class="ic-cen font-small">
				<Edit />
			</el-icon>
			编辑</el-button>
	</el-form-item>
	<el-form-item label="品类" class="grid-row">
		<el-select class="in-wi-24" v-model="dataForms.categoryid" placeholder="选择品类">
			<el-option v-for="(item,index) in catelist" :label="item.name" :value="item.id" />
		</el-select>
		<el-button type="primary"  link  @click="jumpCategory">
			<el-icon class="ic-cen font-small">
				<Edit />
			</el-icon>
			编辑</el-button>
	</el-form-item>
	<el-form-item label="税率" width="100">
		<el-input v-model="dataForms.vatrate"  placeholder="为空不含税">
			  <template #append>%</template>
		</el-input>
	</el-form-item>
	<el-form-item label="产品标签" class="grid-row">
		  <el-button  class="im-but-one" @click="editTags" >
		    <plus theme="outline" size="18"  :strokeWidth="4"/>
		    <span>编辑标签</span>
		  </el-button>
	</el-form-item>
	<el-form-item label="负责人">
		<Owner @owner="changeOwner" notAll="isNotAll" :defaultValue="dataForms.owner" ></Owner>
	</el-form-item>
	<el-form-item label="生效日期">
		<el-date-picker v-model="dataForms.effectivedate" :default-value="dataForms.effectivedate" type="date" placeholder="选择日期" :size="size" />
	</el-form-item>
	<el-form-item label="采购成本">
		<el-input v-model="dataForms.price" type="text" placeholder="请输入采购成本"></el-input>
	</el-form-item>
	<el-form-item label="备货周期">
		<el-input v-model="dataForms.deliveryCycle" type="text" placeholder="请输入备货周期"></el-input>
	</el-form-item>
	<el-form-item label="备注">
		<el-input v-model="dataForms.remark" maxlength="300" placeholder="产品备注" show-word-limit type="textarea" />
	</el-form-item>
	
	<el-dialog v-model="markVisable" title="编辑标签" width="600px">
		  <el-space>
		  <span>标签</span>
		  <el-cascader v-model="tagsValue" placeholder="请选择标签" :options="tagsList"  @change="changeTags" :popper-append-to-body="false" :props="markprops" clearable />
		 </el-space>
		  <template #footer>
		  	<span class="dialog-footer">
		  		<el-button @click="markVisable = false">取消</el-button>
				<el-button @click.stop="Addtag">添加标签</el-button>
		  		<el-button type="primary" @click.stop="submitTags">提交</el-button>
		  	</span>
		  </template>
	</el-dialog>
</template>

<script  setup>
	import {ArrowDown,Edit,Delete,Download,ZoomIn} from '@element-plus/icons-vue'
	import {Plus} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch ,defineProps,toRefs,computed,defineExpose} from 'vue'
	import {useRouter } from 'vue-router'
	import brandApi from '@/api/erp/material/brandApi.js';
	import categoryApi from '@/api/erp/material/categoryApi.js'
	import materialApi from '@/api/erp/material/materialApi.js';
	import { genFileId } from 'element-plus'
	import {getAllTags} from '@/api/sys/admin/tag.js';
	import Owner from '@/components/header/owner.vue';
	import { ElMessage } from 'element-plus'
	let headers=ref({"Content-Type": "multipart/form-data" });
	        onMounted(()=>{
	        	   
	        })
			let uploadRef=ref();
			let router = useRouter()
	        let props = defineProps({
	          dataForms:Object
	        })
			let state=reactive({
				brandlist:[],
				catelist:[],
				imgfile:{},
				markVisable:false,
				tagsList:[],
				 tagsValue:[],
				 markprops:{ multiple: true },
				 checktags:'',
			});
			defineExpose({
			  loadBrandCateList
			})
			 let {dataForms} =toRefs(props);
			 let {
				tags,brandlist,catelist,
			    imgfile,tagsList,tagsValue,
			    markVisable,markprops,checktags,
				} =toRefs(state);
			//选中标签
			function openPopover(){
				let arr =[]
				props.dataForms.tagOptions.forEach((item)=>{
					item.marks.forEach((sub)=>{
						arr.push({name:sub.name})
					})
				})
				tags.forEach((item)=>{
					item.marks.forEach((sub)=>{
						for(var i=0;i<arr.length;i++)
						if(sub.name==arr[i].name){
							sub.value=true
						}
					})
				})
			}
			//跳转到品牌管理
			function jumpBrand(){
				router.push({
					path:"/erp/baseinfo/brand",
					query:{
						title:'品牌管理',
						path:'/erp/baseinfo/brand',
					}
				})
			}
			function jumpCategory(){
				router.push({
				path:"/erp/baseinfo/category",
				query:{
					title:'品类管理',
					path:'/erp/baseinfo/category',
				},
				})
			}
			
			function jumptags(){
				router.push({
				path:"/sys/tags",
				query:{
					title:'产品标签',
					path:'/sys/tags',
				},
				})
			}
		//变为单选
		function tagChange(row,item){
			  row.forEach((i)=>{
				  if(i.name!==item.name){
					  i.value = false
				  }
			  })
		}
		function loadBrandCateList(){
			brandApi.getBrand().then((res)=>{
				state.brandlist=res.data;
			});
			categoryApi.getcategory().then((res)=>{
				state.catelist=res.data;
			});
		}
		//文件上传之前
		function beforeUpload(file){
			if (file.type != "" || file.type != null || file.type != undefined){
			    //截取文件的后缀，判断文件类型
				//const FileExt = file.name.replace(/.+\./, "").toLowerCase();
				//计算文件的大小
				const isLt5M = file.size / 1024  < 5000; //这里做文件大小限制
				//如果大于50M
				if (!isLt5M) {
					ElMessage({
					    message: '上传文件大小不能超过 5000KB!!',
					    type: 'error'
					  })
					return false;
				}
				else {
				   props.dataForms.image=URL.createObjectURL(file);
				   return true;
				}
			}
		}
		function uploadFiles(item){
			//上传文件的需要formdata类型;所以要转
			state.imgfile=item.file;
			props.dataForms.imgfile=item.file;
		}
		function handleExceed(files){
			uploadRef.value.clearFiles();//清空图片list
			const file=files[0];
			file.uid = genFileId();
			uploadRef.value.handleStart(file);//手动选择图片
			props.dataForms.image=URL.createObjectURL(file);
			uploadRef.value.submit();//上传图片
		}
		function Addtag(){
			router.push({
				path:'/sys/tags',
				query:{
				  title:"产品标签",
				  path:'/sys/tags',
				}
			})
		}
		function changeTags(tags){
			 var items="";
			 if(tags){
				  tags.forEach(function(item){
					  items+=(item[1]+",");
				  });
			 }else{
				 items="";
			 }
			 state.checktags=items;
			 // props.dataForms.taglist=items;				 
		}
		function submitTags(){
			props.dataForms.taglist=state.checktags;
			state.markVisable=false;
		}
		function editTags(){
			getAllTags().then(res => {
				state.tagsList=res.data;
				//在通过id去找 选了哪些
				var arrs=[];
				materialApi.findMaterialTags({"mid":props.dataForms.id}).then((ress)=>{
					  if(ress.data && ress.data!=""){
						  var strs=ress.data.toString();
						  var list=strs.split(",");
						  list.forEach(function(item){
							  arrs.push(item);
						  });
						   state.tagsValue=arrs;
					  }else{
						   state.tagsValue=[];
					  }
				});
			});
			state.markVisable =true;
		}
		function changeOwner(id){
			 props.dataForms.owner=id;
		}
		 
			
</script>

<style scoped>
	.scoped-form .el-form-item{
		margin-bottom:0px;
	}
	 .footer-right{
		text-align: right;
		margin-top:16px;
	}
</style>
