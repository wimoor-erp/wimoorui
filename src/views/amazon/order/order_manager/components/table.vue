<template>
	<el-row>
	   <GlobalTable ref="globalTable" :tableData="tableData"  height="calc(100vh - 220px)" @loadTable="loadtableData" :defaultSort="{ prop: 'buydate', order: 'descending' }"  border style="width: 100%;margin-bottom:16px;">
		   <template #field>
	  		 <el-table-column type="selection" width="38" />
	  		  <el-table-column prop="groupname"  label="店铺" width="120"  />
	  		  <el-table-column prop="marketname" label="国家"  width="70" />
	  		   <el-table-column prop="orderid" label="订单号" width='160' />
	  	      <el-table-column prop="image" label="图片" width="66" >
	  	       <template #default="scope">
	  	        <img :src="scope.row.image"  width="40" height="40"/>
	  	      </template>
	  	    </el-table-column>
	  	    <el-table-column prop="name" label="商品信息"  show-overflow-tooltip>
	  	       <template #default="scope">
	  	          <div class='name'>{{scope.row.name}}</div>
	  	          <div class='sku'>{{scope.row.sku}}
	  	            <copy title='复制' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
	  	          </div>
	  	      </template>
	  	    </el-table-column>
	  	    <el-table-column prop="orderprice" label="订单总金额" width='110'  sortable="custom"/>
	  	    <el-table-column prop="quantity" label="数量/单价" width="105"   sortable="custom">
	  			<template #default="scope">
	  			<div class='mname'>{{scope.row.quantity}}</div>
	  			<div class='sku'>{{scope.row.itemprice}}  </div>
	  			</template>
	  		</el-table-column>
	  	    <el-table-column prop="buydate" label="订购时间" width="145"   sortable="custom">
	  				<template #default="scope">
	  				<span >{{dateTimesFormat(scope.row.buydate)}}</span>
	  				</template>
	  			</el-table-column>
	  	     <el-table-column prop="orderstatus" label="状态" width="100"   sortable="custom">
	  	        <template #default="scope">
	  	            <el-tag  :type="statusFunc(scope.row.orderstatus)" effect="plain">{{scope.row.orderstatus}}</el-tag>
	  	        </template>
	  	    </el-table-column>  
			<el-table-column prop="feedstatus" v-if="showVatField" label="发票上传" width='100' >
							 <template #default="scope">
								  <el-tag  effect="info">{{scope.row.feedstatus}}</el-tag>
							 </template>
						</el-table-column>
	  	    <el-table-column prop="operate" label="操作"  width="130"   sortable="custom">
	  	        <template #default="scope">
	  	          <el-space>
	  	            <el-button class='el-button--blue' @click="showOrderModal(scope.row)">详情</el-button>
	  	            <el-button class='el-button--blue' v-if="scope.row.region=='EU'||scope.row.region=='UK'" @click="showVatModal(scope.row)">上传发票</el-button>
	  	           
	  	            <el-dropdown :hide-on-click="false">
	  	              <span class="el-dropdown-link">
	  	                <more-one theme="outline" size="20" fill="#333" :strokeWidth="3"/>
	  	              </span>
	  	               <template #dropdown>
	  	                <el-dropdown-menu>
	  	                  <el-dropdown-item>邀请评论</el-dropdown-item>
	  	                  <el-dropdown-item>标记推广</el-dropdown-item>
	  	                </el-dropdown-menu>
	  	            </template>
	            </el-dropdown>
	          </el-space>
	        </template>
	    </el-table-column>
		</template>
	  </GlobalTable>
	</el-row>
	<!-- 订单详情 -->
	<el-dialog v-model="orderVisible"  title="订单详情"  @close='closeDialog'>
		<div v-loading="orderloading">
		<el-descriptions>
		    <el-descriptions-item label="订单号"> {{orderData.orderid}}</el-descriptions-item>
		    <el-descriptions-item label="店铺国家">{{orderData.groupname}}-{{orderData.marketname}}</el-descriptions-item>
		    <el-descriptions-item label="购买时间"> {{dateTimesFormat(orderData.buydate)}}</el-descriptions-item>
			<el-descriptions-item label="发货方式"> {{orderData.channel}}</el-descriptions-item>
			<el-descriptions-item label="买家邮箱">{{buyeremail}}</el-descriptions-item>
			<el-descriptions-item label="买家名称">
			<span v-if="buyername">{{buyername}}</span>
			<span v-else><el-icon style='cursor: pointer;' @click="reloadOrderDailog"><View /></el-icon></span>
			
			</el-descriptions-item>
		    <el-descriptions-item label="订单状态">
		      <el-tag :type="statusFunc(orderData.orderstatus)" size="small">{{orderData.orderstatus}}</el-tag>
		    </el-descriptions-item>
		    <el-descriptions-item label="配送地址"  >
			   <div v-if="address " >
					<div v-if="address.hasAddress=='nohas'">
						 <div>--</div>
					</div>
					<div v-else>
						 <div>{{address.addressName}} </div>
						 <div>{{address.addressLine}},{{address.addressState}}</div>
						 <div>{{address.addressCity}},{{address.addressCountry}},{{address.addressPostal}}</div>
					</div>
				</div>
			</el-descriptions-item>
		    </el-descriptions>
		  <el-divider/>
		<el-table :data="productData.list" border class="od-table">
			<el-table-column prop="image" label="图片" width="60"> 
				<template #default="scope">
					<el-image :src="scope.row.image" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称/SKU"  show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sku}} </div>
				</template>
			</el-table-column>
			<el-table-column prop="asin" label="ASIN" width="100"   />
			<el-table-column prop="itemprice" label="售价" width="80"   />
			<el-table-column prop="currency" label="币种" width="80"   />
			<el-table-column prop="quantity" label="数量" width="80"   />
			<el-table-column prop="shipprice" label="运费" width="80"   />
			<el-table-column prop="itemdiscount" label="优惠金额" width="80"  >
					<template #default="scope">
						<div>{{scope.row.itemdiscount+scope.row.shipdiscount}}</div>
					</template>
			</el-table-column>
			<el-table-column prop="itemtax" label="商品税" width="80"    />
		</el-table>
		<div class="od-sum text-right">
			<p class="od-label">订单总计:</p>
			<span>{{currencyFunc(orderData.currency)}}{{totalorderprice}}</span>
		</div>
		<el-divider></el-divider>
		交易详情
		<el-table :data="finlist.list" border class="od-table">
			<el-table-column prop="ftype" label="费用名"     />
			<el-table-column prop="marketplaceId" label="费用中文名"     />
			<el-table-column prop="amount" label="金额"    >
				<template #default="scope">
					<div>{{currencyFunc(orderData.currency)}}{{scope.row.amount}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 10px;">卖家账户余额变动:{{currencyFunc(orderData.currency)}}{{finfee}}</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="orderVisible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 发票详情 -->
	<el-dialog v-model="vatVisible" title="发票详情"  @close='closeDialog'>
		<el-descriptions size="default">
		    <el-descriptions-item :span="2"  label="店铺名称">{{orderData.groupname}}</el-descriptions-item>
			 <el-descriptions-item :span="2" label="订单号"> {{orderData.orderid}}</el-descriptions-item>
			<el-descriptions-item :span="2" label="发票类型">
				<el-radio-group v-model="vattype" class="ml-4">
					  <el-radio label="Vat" size="large">Vat发票</el-radio>
					  <el-radio label="normal" size="large">普通发票</el-radio>
				</el-radio-group>
			</el-descriptions-item>
			<el-descriptions-item :span="2" label="发票格式">
				<el-radio-group v-model="vatlabel" class="ml-4">
					  <el-radio label="PDF" size="large">PDF</el-radio>
					  <el-radio label="Word" size="large">Word(可编辑)</el-radio>
				</el-radio-group>
			</el-descriptions-item>
		 
			<el-descriptions-item :span="2"  label="提交状态">
				    <FeedStatus :feedid="feedid" filename="tax.pdf" class="ml-4"> </FeedStatus>
			</el-descriptions-item>
	 
		  </el-descriptions>
		  <template #footer>
		  	<span class="dialog-footer btn-betwn">
				<div>
				<el-button @click="editInvoiceInfo()" size="mini">编辑发票信息</el-button>
				<el-button @click="openInvoiceInfo()" size="mini">预览发票信息</el-button>
				</div>
				<div>
				<el-button @click="vatVisible = false">关闭</el-button>
				<el-button @click="downloadVatInfo">下载</el-button>
				<el-button @click="submitFBAVat" type="primary" title="需在亚马逊后台开启‘我将上传自己的增值税发票’功能才能使用！">上传FBA发票</el-button>
				</div>
		  	</span>
		  </template>
	</el-dialog>	
	<!-- 编辑发票信息 -->
	<el-dialog v-model="editvatVisible" title="编辑发票详情"  @close='closeDialog'>
		<el-descriptions>
			<el-descriptions-item label="公司LOGO">
				<el-image :src="invoiceData1.logourl"   width="180" height="60"></el-image>
			</el-descriptions-item>
		</el-descriptions>
		<el-descriptions >
			<el-descriptions-item label="LOGO上传" >
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
					accept=".jpeg,.jpg,.png"
					>
					<!-- action="/api/file/fileUpload" -->
					<el-button class="btn"><i class="el-icon-paperclip"></i>上传图片</el-button>
					<template #tip>
					  <div class="el-upload__tip">
					    图片格式JPG/JPEG,分辨率180*60,小于50KB.
					  </div>
					</template>
				</el-upload>
			 
	 
			</el-descriptions-item>
		    <el-descriptions-item label="公司名称">
				<el-input  style="width: 80%;"    v-model="invoiceData1.company"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="发票署名">
				<el-input   style="width: 80%;" v-model="invoiceData1.sign"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="国家">
				<el-input   style="width: 80%;"  v-model="invoiceData1.country"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="州/省">
				<el-input   style="width: 80%;"  v-model="invoiceData1.province"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="城市">
				<el-input  style="width: 80%;" v-model="invoiceData1.city"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="地址">
				<el-input   style="width: 80%;" v-model="invoiceData1.address"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="电话">
				<el-input  style="width: 80%;"  v-model="invoiceData1.phone"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="邮编">
				<el-input   style="width: 80%;" v-model="invoiceData1.postalcode"></el-input>
			</el-descriptions-item>
			<el-descriptions-item label="邮箱"  >
				<el-input   style="width: 25%;"  v-model="invoiceData1.email"></el-input>
			</el-descriptions-item>
		</el-descriptions>
		<el-divider/>
		<div>Vat税号税率设置(欧洲5国需要缴Vat税,未缴可不填)</div>
		<el-table :data="invoiceData2.list" border class="od-table">
			<el-table-column prop="country" label="国家" width="60"> 
				<template #default="scope">
					<div>{{countryFunc(scope.row.country)}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="vatNum" label="Vat税号"  >
				<template #default="scope">
					<el-input v-model="scope.row.vatNum" ></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="vatRate" label="税率(%)"  >
				<template #default="scope">
					<el-input v-model="scope.row.vatRate" ></el-input>
				</template>
			</el-table-column>
		</el-table>
		  <template #footer>
		  	<span class="dialog-footer">
				<el-button @click="editvatVisible = false">关闭</el-button>
				<el-button @click="backEditInfo">返回</el-button>
		  		<el-button @click="submitVatInfo" type="primary">提交</el-button>
		  	</span>
		  </template>
	</el-dialog>	
	<!-- 预览发票信息 -->
	<el-dialog v-model="lookvatVisible"   title="预览发票详情"  @close='closeDialog'>
		<div style="border: 1px solid #5A5E66;" v-loading="orderloading">
			<el-descriptions :column="2">
				<el-descriptions-item :span="1">
					<el-image style="border-right: 1px solid #5A5E66;" :src="invoiceData1.logourl"   width="180" height="60"></el-image>
				</el-descriptions-item>
				<el-descriptions-item  align="right" :span="1"   ><h2 style="padding-right: 20px;font-size: 32px;"> INVOICE </h2>
				</el-descriptions-item>   
			</el-descriptions>
		   <el-descriptions :column="1">
			   <el-descriptions-item :span="1" style="font-weight: bolder;">
				 <span style="font-weight: bolder;font-size: 16px;">{{invoiceData1.company}} </span>
				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="1">
		   			   <el-descriptions-item :span="1">
		   				{{invoiceData1.sign}}
		   				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="1">
		   			   <el-descriptions-item :span="1">
		   				{{invoiceData1.address}}
		   				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="1" style="border-bottom: 1px solid #000000;">
		   			   <el-descriptions-item :span="1">
		   				{{invoiceData1.city}},{{invoiceData1.province}},{{invoiceData1.country}},{{invoiceData1.postalcode}}
		   				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="2"  >
				  <el-descriptions-item :span="1" align="left"  >
						<span  >{{address.addressName}} </span>
				  </el-descriptions-item>  
				   <el-descriptions-item :span="1" align="right" label="Invoice NO:">
					 <span style="padding-right: 20px;">{{vatNo}} </span>
					</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="2" >
			   <el-descriptions-item :span="1" align="left"  >
			   						<span  >{{address.addressLine}},{{address.addressState}} </span>
			   </el-descriptions-item>
		   			   <el-descriptions-item :span="1" align="right" label="Payment Due Date:">
		   				 <span style="padding-right: 20px;"> {{dateFormat(orderData.buydate)}} </span>
		   				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="2" >
			   <el-descriptions-item :span="1" align="left"  >
			   						<span  >{{address.addressCity}},{{address.addressCountry}} </span>
			   </el-descriptions-item>
		   			   <el-descriptions-item :span="1" align="right" label="Invoice Issue Date:">
		   				 <span style="padding-right: 20px;"> {{dateFormat(new Date())}} </span>
		   				</el-descriptions-item>  
		   </el-descriptions>
		   <el-descriptions :column="2" >
			   <el-descriptions-item :span="1" align="left"  >
			   						<span  >{{address.addressPostal}}</span>
			   </el-descriptions-item>
		   			   <el-descriptions-item :span="1" align="right" label="Order ID:">
		   				 <span style="padding-right: 20px;"> {{orderData.orderid}} </span>
		   				</el-descriptions-item>  
		   </el-descriptions>
		  <el-table :data="productData.list" border class="od-table" style="margin-bottom: 20px;">
		  	<el-table-column prop="name" label="Product Detail"    >
		  		<template #default="scope">
		  			<div  class="name">{{scope.row.name}}</div>
		  		</template>
		  	</el-table-column>
			<el-table-column prop="quantity" label="Quantity" width="80"   />
		  	<el-table-column prop="itemprice" label="Price" width="80" >
				<template #default="scope">
					<div>{{currencyFunc(scope.row.currency)}}{{scope.row.itemprice}}</div>
				</template>
			</el-table-column>
		  	<el-table-column prop="itemdiscount" label="Promotional Discount" width="120" >
				<template #default="scope">
					<div>{{currencyFunc(scope.row.currency)}}{{scope.row.itemdiscount+scope.row.shipdiscount}}</div>
				</template>
			</el-table-column>
		  	<el-table-column prop="shipprice" label="Shipping Fee" width="100"  >
		  			<template #default="scope">
		  				<div>{{currencyFunc(scope.row.currency)}}{{scope.row.shipprice}}</div>
		  			</template>
		  	</el-table-column>
		  	<el-table-column prop="shipprice" label="Total Price" width="100"    >
				<template #default="scope">
					<div>{{totalRowFunc(scope.row)}}
					  </div>
				</template>
			</el-table-column>	
		  </el-table>
		  <el-descriptions :column="1"  >
		  			   <el-descriptions-item :span="1" align="right" label="Sub Total:">
		  				 <span style="padding-right: 20px;">{{subtotal}} </span>
		  				</el-descriptions-item>  
		  </el-descriptions>
		  <el-descriptions :column="1"  >
		  			   <el-descriptions-item :span="1" align="right" label="Shipping Fee:">
		  				 <span style="padding-right: 20px;">{{shiptotal}} </span>
		  				</el-descriptions-item>  
		  </el-descriptions>
		  <el-descriptions :column="1"  >
		  			   <el-descriptions-item :span="1" align="right" label="Promotional Discount:">
		  				 <span style="padding-right: 20px;">{{discounttotal}} </span>
		  				</el-descriptions-item>  
		  </el-descriptions>
		  <el-descriptions :column="1"  :class="vathidden" >
		  			   <el-descriptions-item :span="1" align="right" label="VAT Total:" >
		  				 <span   style="padding-right: 20px;">{{vattotal}} </span>
		  				</el-descriptions-item>  
		  </el-descriptions>
		  <el-descriptions :column="1"  >
		  			   <el-descriptions-item :span="1" align="right" label="Total Amount:">
		  				 <span style="padding-right: 20px;">{{totalAmount}} </span>
		  				</el-descriptions-item>  
		  </el-descriptions>
		  </div>
		  <template #footer>
		  	<span class="dialog-footer">
				<el-button @click="downloadVatInfo">下载</el-button>
				<el-button @click="backLookInfo">返回</el-button>
		  		<el-button @click="lookvatVisible = false">关闭</el-button>
				<el-button @click="submitFBAVat" type="primary" title="需在亚马逊后台开启‘我将上传自己的增值税发票’功能才能使用！">上传FBA发票</el-button>
		  	</span>
		  </template>
	</el-dialog>
</template>

<script>
	import {ref ,watch,reactive,onMounted,onUpdated} from 'vue'
	import orderListApi from '@/api/amazon/order/orderListApi';
	import groupApi from '@/api/amazon/group/groupApi';
	import {format,dateFormat,dateTimesFormat} from '@/utils/index';
	import {ElMessage,ElLoading} from 'element-plus';
	import {View} from '@element-plus/icons-vue'
    import myUtil from "@/hooks/amazon/order/financial";
	import GlobalTable from "@/components/Table/GlobalTable/index";
	import FeedStatus from "@/components/feedstatus/index";
	export default{
		name:'Table',
		components:{
			GlobalTable,View,FeedStatus
		},
		setup(props){
			let showVatField =ref(false);
			let orderVisible =ref(false)
			let vatVisible=ref(false)
			let editvatVisible=ref(false)
			let lookvatVisible=ref(false)
			let fromDate =ref()
			let vatloading=ref(false);
			let toDate =ref()
			let params=ref({})
			let tableData=reactive({records:[],total:0})
			let pagesize=ref(10)
			let currentPage=ref(1)
			let total = ref()
			let orderData=ref({})
			let invoiceData1=ref({})
			let invoiceData2=reactive({list:[]})
			let buyername=ref("")
			let buyeremail=ref("")
			let address=ref({hasAddress:"nohas",addressLine:"",addressState:'',addressCity:'',addressCountry:'',addressPostal:'',addressName:''})
			let totalorderprice=ref("")
			let productData=reactive({list:[]})
			let finlist=reactive({list:[]})
			let finfee=ref(0)
			let vattype=ref("normal")
			let vatlabel=ref("Word")
			let vatNo=ref("")
			let vathidden=ref("hide")
			let totalAmount=ref(0)
			let vatRates=ref(0)
			let shiptotal=ref(0)
			let vattotal=ref(0)
			let discounttotal=ref(0)
			let orderloading=ref(false)
			let subtotal=ref(0)
			//上传后的文件列表
			let fileList=ref([])
			// 运行上传文件大小，单位 M
			let fileSize=ref(2)
			let feedid=ref("");
			let globalTable=ref()
			//请求头
			let headers=ref({"Content-Type": "multipart/form-data" }) 
			let logofile=ref()
			onMounted(()=>{
			toDate.value = new Date().format("yyyy-MM-dd");
			var oidtime = new Date().getTime() - 3600 * 1000 * 24 * 7
			fromDate.value = new Date(oidtime).format("yyyy-MM-dd")
			
			})
			;
			const {statusFunc,countryFunc,currencyFunc,totalRowFunc}=myUtil();
			function getDataParams(rows){
				//隐藏字段
				console.log('rows',rows.pointname)
				if(rows.pointname=='Amazon.de'||rows.pointname=='Amazon.it'||rows.pointname=='Amazon.co.uk'||rows.pointname=='Amazon.fr'||rows.pointname=='Amazon.es'){
					showVatField.value=true
				}else{
					showVatField.value=false
				}
				if(rows.dates[1]){
					fromDate.value = rows.dates[0].format("yyyy-MM-dd")
					toDate.value = rows.dates[1].format("yyyy-MM-dd")
				}
				params.value=rows;
				globalTable.value.loadTable();
			}
		 
			const successMsg = () => {
			  ElMessage({
			    message: '操作成功！',
			    type: 'success',
			  })
			}
			const errorMsg = () => {
				ElMessage.error('操作失败！')
			}
			const loadtableData =function(queryParam){
							   queryParam.groupid=params.value.groupid;
							   queryParam.search=params.value.search;
							   queryParam.searchtype=params.value.searchtype;
							   queryParam.startDate=fromDate.value;
							   queryParam.endDate=toDate.value;
							   queryParam.channel=params.value.saleschannel?params.value.saleschannel:null;
							   queryParam.pointname=params.value.pointname?params.value.pointname:null;
							   queryParam.status=params.value.orderstatus?params.value.orderstatus:null;
							   queryParam.color=params.value.color?params.value.color:null;
							   queryParam.isbusiness=params.value.isbusiness?params.value.isbusiness:null;
							   queryParam.datatype=params.value.datatype;
							if(params.value.datatype&&params.value.datatype=="2"){
								orderListApi.getOrderInvoinceList(queryParam).then(function(res){
									tableData.records = res.data.records
									tableData.total = res.data.total
								})
							}else{
								orderListApi.getOrderList(queryParam).then(function(res){
									tableData.records = res.data.records
									tableData.total = res.data.total
								})
							}
							
			}
		
			function loadOrderDetail(orderid,buydate,groupid,nonaddress,nonfin){
				vatloading.value=true;
				orderloading.value=true;
				orderListApi.showOrderDetail({
					"purchaseDate":buydate,
					"orderid":orderid,
					"groupid":groupid,
					"nonaddress":nonaddress,
					"nonfin":nonfin
				}).then(function(res){
					vatloading.value=false;
					orderloading.value=false;
					if(res.data){
						productData.list=res.data;
						if(res.data[0] && res.data[0]["orderMain"]){
							buyername.value=res.data[0].orderMain.buyerName;
							buyeremail.value=res.data[0].orderMain.buyerEmail;
						}
						if(res.data[0] && res.data[0]["financialList"] &&  res.data[0]["financialList"].length>0){
							finlist.list=res.data[0]["financialList"]
							finfee.value=res.data[0].financialfee
						}
						address.value=res.data[0];
						totalOrderPriceFunc();
						vatotalPriceAmount();
					}
				})
			}
			function showOrderModal(row){
				var rows=JSON.parse(JSON.stringify(row));
				orderData.value=rows;
				loadOrderDetail(orderData.value.orderid,dateTimesFormat(orderData.value.buydate),orderData.value.groupid,"true","false");
				orderVisible.value=true;
				orderloading.value=true;
			}
			function reloadOrderDailog(){
				loadOrderDetail(orderData.value.orderid,dateTimesFormat(orderData.value.buydate),orderData.value.groupid,"false","false");
			}
			function totalOrderPriceFunc(){
				if(productData.list){
					var totalPrice=0;
					productData.list.forEach(function(item,index){
						var discount = parseFloat(item.itemdiscount) + parseFloat(item.shipdiscount);
						if (item.region == "EU"||item.region == "UK") {
							totalPrice += parseFloat(item.itemprice) * parseInt(item.quantity) + parseFloat(item.shipprice) - parseFloat(discount);
						} else {
							totalPrice += parseFloat(item.itemprice) * parseInt(item.quantity) + parseFloat(item.shipprice) + parseFloat(item.itemtax) - parseFloat(discount);
						}
					})
				}
				totalorderprice.value=totalPrice.toFixed(2);
			}
			function vatotalPriceAmount(){
				if(productData.list){
					console.log(productData)
					var subtotals=0;var shippingfee=0;
					var promotionaldiscount=0;var vattotals=0;
					var total=0;
					productData.list.forEach(function(item,index){
						var price = 0;var nums=0;
						var rate=vatRates.value;
						if (rate > 0) {
							var rates = (rate / 100);
							nums = (parseFloat(item.itemprice) * rates) / (1 + rates);
						}
						subtotals+=  parseFloat(item.itemprice) * parseInt(item.quantity);
						promotionaldiscount+=(parseFloat(item.itemdiscount) + parseFloat(item.shipdiscount));
						shippingfee+=(parseFloat(item.shipprice));
						vattotals += parseFloat(nums) * parseInt(item.quantity);
						total+=(item.quantity*item.itemprice)+(item.shipprice)-(item.itemdiscount+item.shipdiscount);
					})
					totalAmount.value=total.toFixed(2);
					subtotal.value=subtotals.toFixed(2);
					discounttotal.value=promotionaldiscount.toFixed(2);
					vattotal.value=vattotals.toFixed(2);
					shiptotal.value=shippingfee.toFixed(2);
				}
				
			}
			function showVatModal(row){
				 vatVisible.value=true;
				if(row.marketname=="英国" || row.marketname=="法国" || row.marketname=="德国" || row.marketname=="西班牙" || row.marketname=="意大利"){
					vathidden.value=" ";
				}
				console.log(row.value);
				var rows=JSON.parse(JSON.stringify(row));
				orderData.value=rows;
				feedid.value="";
				feedid.value=rows.feedid
			}
			function loadOrderInfo(row){
				loadOrderDetail(row.orderid,dateTimesFormat(row.buydate),row.groupid,"false","true");
				orderListApi.selectVatInfoByGroup({
					"groupid":orderData.value.groupid
				}).then(function(res){
					if(res.data){
						invoiceData1.value=res.data.data1;
						invoiceData2.list=res.data.data2;
						vatNo.value=res.data.vatNo;
						if(vattype.value!="Vat"){
							vatRates.value=0;
						}else{
							var market=handlerMarket(orderData.value.market);
							invoiceData2.list.forEach(function(item,index){
								if(item.country==market){
									vatRates.value=item.vatRate;
								}
							});
						}
					}
				})
			}
			function editInvoiceInfo(){
				 vatVisible.value=false;
				 lookvatVisible.value=false;
				 editvatVisible.value=true;
				 loadOrderInfo(orderData.value);
			}
			function openInvoiceInfo(){
				 vatVisible.value=false;
				 editvatVisible.value=false;
				 lookvatVisible.value=true;
				 vatloading.value=true;
				 loadOrderInfo(orderData.value);
			}
			
			function handlerVatRate(){
				var vatData={};
				invoiceData2.list.forEach(function(item,index){
					if(item.country=="uk"){
						vatData.ukvat=item.vatNum;
						vatData.uknum=item.vatRate;
					}
					if(item.country=="de"){
						vatData.devat=item.vatNum;
						vatData.denum=item.vatRate;
					}
					if(item.country=="fr"){
						vatData.frvat=item.vatNum;
						vatData.frnum=item.vatRate;
					}
					if(item.country=="it"){
						vatData.itvat=item.vatNum;
						vatData.itnum=item.vatRate;
					}
					if(item.country=="es"){
						vatData.esvat=item.vatNum;
						vatData.esnum=item.vatRate;
					}
				});
				return vatData;
			}
			function submitVatInfo(){
				var vatData=handlerVatRate();
				let FormDatas = new FormData()
				FormDatas.append('file',logofile.value);
				FormDatas.append('groupid',orderData.value.groupid);
				FormDatas.append("Vatphone",invoiceData1.value.phone);
				FormDatas.append("Vatcompany",invoiceData1.value.company);
				FormDatas.append("Vatpostal",invoiceData1.value.postalcode);
				FormDatas.append("Vatcountry",invoiceData1.value.country);
				FormDatas.append("Vatemail",invoiceData1.value.email);
				FormDatas.append("Vatprovince",invoiceData1.value.province);
				FormDatas.append("Vatsign",invoiceData1.value.sign);
				FormDatas.append("Vatcity",invoiceData1.value.city);
				FormDatas.append("image",invoiceData1.value.logourl);
				FormDatas.append("Vataddress",invoiceData1.value.address);
				FormDatas.append("ukvat",vatData.ukvat);
				FormDatas.append("uknum",vatData.uknum);
				FormDatas.append("devat",vatData.devat);
				FormDatas.append("denum",vatData.denum);
				FormDatas.append("frvat",vatData.frvat);
				FormDatas.append("frnum",vatData.frnum);
				FormDatas.append("esvat",vatData.esvat);
				FormDatas.append("esnum",vatData.esnum);
				FormDatas.append("itvat",vatData.itvat);
				FormDatas.append("itnum",vatData.itnum);
				orderListApi.saveOrderVat(FormDatas).then(function(res){
					if(res.data){
						if(res.data.isSuccess=="true"){
							successMsg();
							editvatVisible.value=false;
						}else{
							errorMsg();
							editvatVisible.value=true;
						}
					}
				})
			}
			function downloadOrderXlsx(rows){
				params.value=rows;
				if(params.value.search==undefined){
					params.value.search="";
				}
				if(params.value.saleschannel==""){
					params.value.saleschannel="all";
				}
				if(params.value.orderstatus==""){
					params.value.orderstatus="all";
				}
				if(params.value.pointname==""){
					params.value.pointname="all";
				}
				if(params.value.color==""){
					params.value.color="all";
				}
				if(params.value.isbusiness==""){
					params.value.isbusiness="all";
				}
				orderListApi.downloadOrderList({
					"groupid":params.value.groupid,
					"search":params.value.search,
					"searchtype":params.value.searchtype,
					"startDate":fromDate.value,
					"endDate":toDate.value,
					"channel":params.value.saleschannel?params.value.saleschannel:null,
					"pointname":params.value.pointname?params.value.pointname:null,
					"status":params.value.orderstatus?params.value.orderstatus:null,
					"color":params.value.color?params.value.color:null,
					"isbusiness":params.value.isbusiness?params.value.isbusiness:null
				}); 
			}
			
			function downloadVatInfo(){
				//下载pdf或者word
				orderListApi.downloadOrderVatInvoice({
					"orderid":orderData.value.orderid,
					"groupid":orderData.value.groupid,
					"vatlabel":vatlabel.value,
					"vattype":vattype.value,
					"country":handlerMarket(orderData.value.market),
					"itemstatus":orderData.value.itemstatus,
					"postDate":dateTimesFormat(orderData.value.buydate)
				}).then(res => {
						ElMessage({
						    message: '导出成功！',
						    type: 'success',
						  })
					 const blob = new Blob([res]);
					 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
						 if(vatlabel.value=="PDF"){
							 navigator.msSaveBlob(blob, "ordersVatInfo.pdf")
						 }else{
							  navigator.msSaveBlob(blob, "ordersVatInfo.doc")
						 }
					 		  
					 }else{
						 var link=document.createElement("a");
						 link.href=window.URL.createObjectURL(blob);
						 if(vatlabel.value=="PDF"){
							link.download="ordersVatInfo.pdf";
						 }else{
							 link.download="ordersVatInfo.doc";
						 }
						 link.click();
						 window.URL.revokeObjectURL(link.href);
					 }
				
				}).catch(e=>{
						ElMessage({
						    message: '导出失败！',
						    type: 'error',
						  })
				})
			}
			function submitFBAVat(){
				if(vattype.value!="Vat"){
					ElMessage({
					    message: "自动上传的发票类型只支持VAT",
					    type: 'error',
					  });
					  return;
				}else{
					orderListApi.sendAmzVatInvoince({
						"groupid":orderData.value.groupid,
						"country":handlerMarket(orderData.value.market),
						"orderid":orderData.value.orderid,
						"itemstatus":orderData.value.itemstatus,
						"postDate":dateTimesFormat(orderData.value.buydate),
						"vatlabel":vatlabel.value,
						"vattype":vattype.value
					}).then(function(res){
						if(res.data){ 
							if(res.data.isOk=="true"){
								feedid.value=res.data.feedid;
								ElMessage({
								    message: res.data.msg,
								    type: 'success',
								  })
							}else{
								ElMessage({
								    message: res.data.msg,
								    type: 'error',
								  })
							}
						}
					})
				}
			}
			function backLookInfo(){
				lookvatVisible.value=false;
				vatVisible.value=true;
				
			}
			function backEditInfo(){
				editvatVisible.value=false;
				vatVisible.value=true;
			}
			function handlerMarket(market){
				if (market == "Amazon.fr"){
					market = "fr";
				}
				if (market == "Amazon.co.uk"){
					market = "uk";
				}
				if (market == "Amazon.de"){
					market = "de";
				}
				if (market == "Amazon.es"){
					market = "es";
				}
				if (market == "Amazon.it"){
					market = "it";
				}
				return market;
			}
			//文件上传之前
			function beforeUpload(file){
				if (file.type != "" || file.type != null || file.type != undefined){
				    //截取文件的后缀，判断文件类型
					const FileExt = file.name.replace(/.+\./, "").toLowerCase();
					//计算文件的大小
					const isLt5M = file.size / 1024  < 50; //这里做文件大小限制
					//如果大于50M
					if (!isLt5M) {
						ElMessage({
						    message: '上传文件大小不能超过 50KB!!',
						    type: 'error'
						  })
						return false;
					}
					else {
						// ElMessage({
						//     message: "上传文件格式不正确!",
						//     type: 'error'
						//   })
					   return true;
					}
				}
			}
			//上传了的文件给移除的事件，由于我没有用到默认的展示，所以没有用到
			function handleRemove(){
			}
			//这是我自定义的移除事件
			function handleClose(i){
				// this.fileList.splice(i,1);//删除上传的文件
				// if(this.fileList.length == 0){//如果删完了
				// 	this.fileflag = true;//显示url必填的标识
				// 	this.$set(this.rules.url,0,{ required: true, validator: this.validatorUrl, trigger: 'blur' })//然后动态的添加本地方法的校验规则
				// }
			}
			//超出文件个数的回调
			function handleExceed(){
				ElMessage({
				    message: '超出最大上传文件数量的限制！',
				    type: 'error'
				  })
				 return
			}
			//上传文件的事件
			function uploadFile(item){
				//上传文件的需要formdata类型;所以要转
				logofile.value=item.file;
			}
			//上传成功后的回调
			function handleSuccess(){
				
			}
			return{
				toDate,fromDate,orderVisible,getDataParams,params,loadtableData,
				tableData,dateFormat,dateTimesFormat,statusFunc,showOrderModal,orderData,loadOrderDetail,productData,
				buyername,buyeremail,address,totalorderprice,totalOrderPriceFunc,showVatModal,vatVisible,vattype,vatlabel,
				editInvoiceInfo,openInvoiceInfo,editvatVisible,lookvatVisible,invoiceData1,invoiceData2,vatNo,countryFunc,submitVatInfo,
				handlerVatRate,downloadVatInfo,submitFBAVat,currencyFunc,totalRowFunc,vathidden,vatotalPriceAmount,totalAmount,vatRates,
				shiptotal,vattotal,discounttotal,subtotal,backLookInfo,backEditInfo,handlerMarket,fileList,fileSize,headers,
				beforeUpload,handleRemove,handleClose,handleExceed,uploadFile,handleSuccess,logofile,finlist,finfee,downloadOrderXlsx,
				vatloading,orderloading,globalTable,showVatField,reloadOrderDailog,feedid,
			}
		}
	}
</script>

<style>
	.od-table{
		margin-top:16px;
	}
	.od-sum{
		margin-top:16px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.od-sum span{
		font-size: 16px;
		font-weight: 600;
		color:var(--el-color-primary)
	}
	.od-label{
		width:120px;
		text-align: left;
	}
	.textright{
		text-align: right;
	}
	.btn-betwn{
		display: flex;
		justify-content: space-between;
	}
</style>
