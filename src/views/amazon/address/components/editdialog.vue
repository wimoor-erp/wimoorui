<template>
	<div>
		<el-dialog
		    v-model="dialogVisible"
		    :title="dialogTitle"
		    width="40%"
			@open="handleOpen"
		    :before-close="handleClose"
		  >
		    <el-form
		       ref="ruleFormRef"
		       :model="ruleForm"
		       :rules="rules"
		       label-width="120px"
		       class="demo-ruleForm"
		       :size="formSize"
		       status-icon
		     >
			 <el-form-item label="店铺" prop="groupid" required>
			   <el-select ref="amzgroup" v-model="ruleForm.groupid"  @change="groupChange"  placeholder="店铺">
			    <el-option   v-for="item in groupList"   
				            :key="item.id"  
							:label="item.name" 
							:value="item.id"   >
			    </el-option>
			   </el-select>
			 </el-form-item>
		       <el-form-item label="名称" prop="name" placeholder="可填店铺名称" required>
		         <el-input v-model="ruleForm.name" />
		       </el-form-item>
		       
		       <el-form-item label="发货地" prop="countrycode" required>
		         <el-select-v2
		           v-model="ruleForm.countrycode"
		           placeholder="国家"
		           :options="options"
				   filterable
		         >
				 		
				 </el-select-v2>
				 </el-form-item>
				 <el-form-item label="省份" prop="stateorprovincecode"  >
				  <el-input v-model="ruleForm.stateorprovincecode"  placeholder="省份"   />
				</el-form-item>
				 <el-form-item label="城市" prop="city"  >
				  <el-input v-model="ruleForm.city"  placeholder="城市" />
				 </el-form-item>
			    <el-form-item label="地区" prop="districtorcounty"  >
				  <el-input v-model="ruleForm.districtorcounty"  placeholder="地区"   />
		       </el-form-item>
			   <el-form-item label="街道" prop="addressLine1"  >
			     <el-input v-model="ruleForm.addressline1"   />
			   </el-form-item>
		       <el-form-item label="详细地址" prop="addressLine2"  >
		         <el-input v-model="ruleForm.addressline2" type="textarea" />
		       </el-form-item>
			   <el-form-item label="邮政编码" prop="postalcode" placeholder="可填店铺名称" >
			     <el-input v-model="ruleForm.postalcode" />
			   </el-form-item>
			   <el-form-item label="电话" prop="phone" placeholder="可填店铺名称" >
			     <el-input v-model="ruleForm.phone" />
			   </el-form-item>
			   <el-form-item label="默认地址" prop="isdefault" placeholder="店铺默认地址" >
				     
					   <el-checkbox v-model="ruleForm.isdefault"  ></el-checkbox>
			   </el-form-item>
		     </el-form>
		    <template #footer>
		      <span class="dialog-footer">
		        <el-button @click="dialogVisible = false">取消</el-button>
		        <el-button type="primary" @click="submitAddress"
		          >提交</el-button >
		      </span>
		    </template>
		  </el-dialog>
	</div>
</template>

<script>
	import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,nextTick } from 'vue'
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import groupApi from '@/api/amazon/group/groupApi';
	import country from '@/model/sys/common/country.json';
	import addressApi from '@/api/amazon/inbound/addressApi.js';
	import {ElMessage,ElLoading} from 'element-plus';
	export default{
	    name: 'Mark',
	    components:{
	    },
	   setup(prop, context) {
			let dialogVisible=ref(false)
			let formSize = ref('default')
			let groupList=ref([]);
			let options =ref([]);
			let dialogTitle=ref("");
			let amzgroup=ref();
			let ruleForm = reactive({
			  name: '',
			  groupid: '',
			  addressline1: '',
			  addressline2: '',
			  city: '',
			  districtorcounty: '',
			  stateorprovincecode: '',
			  countrycode: 'CN',
			  postalcode: '',
			  isfrom:true,
			  isdefault:false,
			  phone:'',
			})
			function handleOpen(){
					groupApi.getAmazonGroup().then((res)=>{
						groupList.value=res.data;
					})
					 options.value = country;
			}
			
			
		    function submitAddress(){
			
				if(ruleForm["id"]){
					addressApi.updateAddress(ruleForm).then((res)=>{
						dialogVisible.value = false;
						ElMessage({
						  message: '操作成功！',
						  type: 'success',
						});
						 context.emit("addressChange") ;
					});
				}else{
					addressApi.saveAddress(ruleForm).then((res)=>{
						dialogVisible.value = false;
						ElMessage({
						  message: '操作成功！',
						  type: 'success',
						});
						context.emit("addressChange") ;
					});
				}
			}
			
			function showModel(param,groupid){
				dialogVisible.value = true;
				nextTick(()=>{
					if(param){
						ruleForm.id=param.id;
						ruleForm.name=param.name;
						ruleForm.groupid=param.groupid;
						ruleForm.addressline1=param.addressline1;
						ruleForm.addressline2=param.addressline2;
						ruleForm.city=param.city;
						ruleForm.districtorcounty=param.districtorcounty;
						ruleForm.stateorprovincecode=param.stateorprovincecode;
						ruleForm.countrycode=param.countrycode;
						ruleForm.postalcode=param.postalcode;
						ruleForm.isfrom=param.isfrom;
						ruleForm.isdefault=param.isdefault;
						ruleForm.phone=param.phone;
						dialogTitle.value="修改发货地址";
					}else{
						ruleForm.name= '';
						console.log(groupid);
						ruleForm.groupid=groupid;
						ruleForm.addressline1= '';
						ruleForm.addressline2= '';
						ruleForm.city= '';
						ruleForm.districtorcounty= '';
						ruleForm.stateorprovincecode= '';
						ruleForm.countrycode= 'CN';
						ruleForm.postalcode= '';
						ruleForm.phone='';
						dialogTitle.value="添加发货地址";
					}
				})
				
			}
			function groupChange(val){
				ruleForm.groupid=val;
			}
	        //方法
	        //数据接收
	        return{
	          showModel,dialogVisible,formSize,ruleForm,
			  options,groupList,groupChange,dialogTitle,amzgroup,
			  submitAddress,handleOpen
	        }
	    }
	
	}
</script>

<style>
</style>
