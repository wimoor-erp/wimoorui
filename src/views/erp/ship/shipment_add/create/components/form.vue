<template>
	<div class="list-from">
		<el-row>
			<el-col :span="16">
				<el-form  label-width="120px">
					<el-row>
						<el-col :span="12">
							<el-form-item label="计划名称">
								<span>{{planname}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="计划编码">
								<span>{{number}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="发货店铺" prop="groupid">
								<el-select v-model="groupid"     placeholder="发货店铺" @change="groupChange">
									  <el-option  v-for="item in groupList"   :key="item.id"  :label="item.name" :value="item.id"   >
									  </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="发货仓库" prop="warehouseid">
								<el-select v-model="warehouseid"     placeholder="全部仓库" @change="warehouseChange">
								      <el-option  v-for="item in warehouseList"   :key="item.id"  :label="item.name" :value="item.id"   >
								      </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="收货国家" prop="marketplaceid">
								<el-select   v-model="marketplaceid"    placeholder="全部国家" @change="marketChange">
								      <el-option  v-for="item in marketList"   :key="item.marketplaceid"  :label="item.name" :value="item.marketplaceid"   >
								      </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="物流承运商" prop="tran">
								<el-select v-model="tran"  :popper-append-to-body="false" placeholder="请选择" @change="tranChange">
								<el-option
								      v-for="item in tranlist"
								      :key="item.id"
								      :label="item.name"
								      :value="item.id"
								    >
								    </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="包装类型">
								<el-radio-group v-model="arecase">
									<el-radio label="0"  >混装发货</el-radio>
									<el-radio label="1" >原厂包装发货</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="物流渠道" prop="region">
								<el-select v-model="channel" :popper-append-to-body="false" placeholder="请选择" @change="channelChange">
								<el-option
								      v-for="item in channellist"
								      :key="item.id"
								      :label="item.channame"
								      :value="item.id"
								    >
								    </el-option>
								</el-select>
							</el-form-item>
						</el-col>
                        <el-col :span="24">
							<el-form-item label="发货地址" prop="region">
								<el-radio-group v-model="radio1" size="large" @change="radioChange">
									<el-row >
										<el-col class="addr-card" :span="8" v-for="(item,index) in addressData.list"  v-show="index<addrIndex" >
								      <el-radio-button  :label="item.id">
										  <div class="addr-info">
											  <div class="addr-header">
												  <el-tag v-show="item.checked" type="danger">默认地址</el-tag>
												  <span>{{item.name}}</span>
												  <span>{{item.phone}}</span>
											  </div>
											  <div class="addr-body">
												  <p>{{item.addressline1}}</p>
												  <p>{{item.addressline2}}</p>
												  <p>{{item.stateorprovincecode}},{{item.city}},{{item.districtorcounty}}</p>
												  <span>{{item.countrycode}},{{item.postalcode}}</span>
											  </div>
											  <div class="addr-footer">
												  <el-link v-if="item.id==radio1" @click="addAddress(item)" type="primary">修改</el-link>
												  <el-link v-else ></el-link>
											  </div>
										  </div>
									  </el-radio-button>
									   </el-col>
										<el-col :span="24">
											<div class="adrr-btn">
												
											<el-link v-if="showall" @click="showAlladdr"  :underline="false" type="primary">显示全部</el-link>
											<el-button @click="addAddress" v-else>使用新地址</el-button>
											<el-link @click="manageAlladdr"  :underline="false" type="primary">管理发货地址</el-link>
											</div>
										</el-col>
									   </el-row>  
								    </el-radio-group>
							</el-form-item>	
						</el-col>	
						<el-col :span="24">
							<el-form-item label="备注">
								<el-radio-group >
									 <el-input v-model="remark" type="textarea" />
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-col>
		</el-row>
	</div>
	<div class="divider"> <el-divider /></div>
	<div class="con-header">
	<el-row>
		<el-col :span="24">
			<div class="fro-head">
			<h4>发货商品列表({{totalproducts}})</h4>
			<div>
				<el-button @click="addProduct" type="primary" plain>添加商品</el-button>
				<el-button @click="showProductModal">导入</el-button>
				<el-button @click="printProductlabel">打印当前产品标签</el-button>
			</div>
			</div>
			<div class="fro-body">
			  <el-table :data="productlist.list" border style="width: 100%;margin-bottom:16px;" row-key="id">
			  	<el-table-column prop="image" label="图片" width="60">
			  		<template #default="scope">
			  			<el-image :src="scope.row.image" width="40" height="40"></el-image>
			  		</template>
			  	</el-table-column>
			  	<el-table-column prop="name" label="名称/SKU" width="450" show-overflow-tooltip>
			  		<template #default="scope">
			  			<div class='name'>{{scope.row.name}}</div>
			  			<div class='sku'>{{scope.row.sku}} </div>
			  		</template>
			  	</el-table-column>
				<el-table-column prop="asin" label="ASIN" width="120"   />
				<el-table-column prop="msku" label="本地SKU" width="120"  >
					 <template #default="scope">
						 <span v-if="scope.row.msku">{{scope.row.msku}}</span>
						 <span v-else>无</span>
					  </template>
				</el-table-column>
				
				<el-table-column prop="fulfillable" label="库存" width="70" >
					<template #default="scope">
							 <div>{{scope.row.fulfillable}}</div>
							 <div v-if="scope.row.canAssembly">可组装:{{scope.row.canAssembly}}</div>
					 </template>
				</el-table-column>
				<el-table-column prop="length" label="长*宽*高" width="230"  >
					 <template #default="scope">
					 	<span >长:{{scope.row.length}}cm</span>,
						<span >宽:{{scope.row.width}}cm</span>,
						<span >高:{{scope.row.height}}cm</span>
					 </template>
				</el-table-column>
			  	<el-table-column prop="weight" label="带包装重量(kg)" width="120"   />
			  	<el-table-column prop="quantity" label="发货数量" width="150" >
			  		<template #default="scope">
			  			<el-input v-model.number="scope.row.quantity"  @input="formatQuantity(scope.row)" ></el-input>
			  		</template>
			  	</el-table-column>
				<el-table-column prop="guidance" label="亚马逊校验"  >
					<template #default="scope">
						<el-tag v-if="scope.row.guidance=='success'" type="success">亚马逊校验成功</el-tag>
						<el-tag v-else-if="scope.row.guidance=='warn'" type="error">亚马逊未正常校验</el-tag>
						<el-tag v-else-if="scope.row.guidance=='error'" type="error">无效的SKU</el-tag>
						<el-tag v-else  type="warning">亚马逊校验中</el-tag>
						<el-tag v-if="scope.row.fulfillable-scope.row.quantity<0" type="warning">发货数量大于库存数</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="asin"  label="操作" width="140"  >
				    <template #default="scope">
						<el-button class='el-button--blue' @click="removeBind(scope.row)">删除</el-button>
				    </template>
				</el-table-column>
			  </el-table>
			  <el-button type="primary" @click="submitPlan" >提交</el-button>
			   <el-button @click="cancelPlan" >取消</el-button>
			</div>
		</el-col>
	</el-row>
	</div>
	 <Editdialog ref="editRef" @addressChange="loadAddress"/>
	 <MateiralDialog ref="prodiaRef" @getdata="getdata" />
	<el-dialog v-model="downloadVisible" title="导入数据" width="50%" center >
		<div>
		<el-descriptions >
			 <el-descriptions-item label="文件上传" >
			 <el-upload
			 		class="upload-demo" 
			 		action   
			 		:http-request="uploadFile" 
			 		ref="upload"
			 		:limit="1" 
			 		:on-remove="handleRemove"  
			 		:file-list="fileList" 
			 		:on-exceed="handleExceed" 
			 		:before-upload="beforeUpload" 
			 		:show-file-list="true" 
			 		:headers="headers" 
			 		accept=".xls,.xlsx"
			 		>
			 		<!-- action="/api/file/fileUpload" -->
			 		<el-button class="btn"><i class="el-icon-paperclip"></i>选择文件</el-button>
			 		<template #tip>
			 		  <div class="el-upload__tip">
			 		    文件格式Xls/Xlsx,小于5MB.
			 		  </div>
			 		</template>
			 	</el-upload>
			 </el-descriptions-item>
				</el-descriptions>
				</div>
	  <div style="margin-top: 15px;">按照模板定义格式导入数据。没有模板？ <span style="color: #007DFF;cursor: pointer;" @click="downloadtemplate">点击下载</span></div>
	  <template #footer>
	    <span class="dialog-footer">
	      <el-button @click="downloadVisible = false">关闭</el-button>
	      <el-button type="primary" @click="submitProductList()"
	        >上传</el-button
	      >
	    </span>
	  </template>
	</el-dialog>
</template>

<script>
import Editdialog from"@/views/amazon/address/components/editdialog.vue"
import MateiralDialog from "@/views/erp/baseinfo/material/mateiralDialog";	
import shipmentCreate from '@/hooks/erp/shipment/shipment_create.js';
	export default {
		name: 'Fromlist',
		components: {
             Editdialog,MateiralDialog
		},
		setup() {
			return shipmentCreate();
		}
	}
</script>

<style >
	.list-from .el-radio-button__inner{
		display: block !important;
		
	}
	.list-from {
		margin-top: 16px;
	}
	.addr-info{
		text-align: left;
		line-height: 1.5;
	}
	.addr-header{
		border-bottom: 1px solid var(--el-border-color-light);
		padding-bottom:8px;
		margin-bottom:8px;
		position: relative;
	}
	.addr-header .el-tag{
		position: absolute;
		top: -13px;
		right: -21px;
	}
	.list-from .el-radio-button{
		display: block;
	}
	.addr-card{
		padding-right: 16px;
		margin-bottom:16px;
	}
	.list-from .el-radio-group{
		display: block;
	}
	.list-from .el-radio-button__original-radio:checked+.el-radio-button__inner{
		color:inherit;
		background-color:inherit;
	}
	.adrr-btn{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.fro-head{
		margin:16px 24px;
		display:flex;
		align-items: center;
		justify-content: space-between;
	}
	.fro-body{
		margin:0px 24px 16px 24px;
	}
</style>
