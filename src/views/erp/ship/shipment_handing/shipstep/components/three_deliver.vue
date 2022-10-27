<template>
	<div>
		<el-row :gutter="16">
			<el-col :span="12">
				<div class="shi-left">
					<el-card shadow="never">
						<el-form :model="form" label-width="120px" >
							<el-form-item label="运输方式" prop="transtype" >
									 <el-space>
										<el-select v-model="form.transtype"  placeholder="请选择" fit-input-width="true" @change="changeTransType">
											 <el-option
												  v-for="item in tranlist.list"
												  :key="item.id"
												  :label="item.name"
												  :value="item.id"
												/>
										</el-select>
										<el-button
										      key="warning"
										      type="warning"
										      link
										      >
											  <el-icon @click="compareVisible=true"
											  	style="font-size:20px">
											  	<balance-two theme="outline" fill="#FF6700" :strokeWidth="2" />
											  </el-icon>
											  </el-button >
								 </el-space>
							</el-form-item>
							<el-form-item label="物流承运商" prop="company">
								 <el-space>
										<el-select v-model="form.company" placeholder="请选择" @change="changeCompany">
											<el-option
												 v-for="item in companylist.list"
												 :key="item.id"
												 :label="item.name"
												 :value="item.id"
											   />
										</el-select>
								    
										<el-link type="info" @click="infoVisiable=true"  :underline="false">
											<el-icon>
												<View />
											</el-icon>&nbsp;查看报价
										</el-link>
								 </el-space>
							</el-form-item>
							<el-form-item label="物流渠道" prop="channel">
								<el-select v-model="form.channel" placeholder="请选择">
									<el-option
									     v-for="item in channellist.list"
									     :key="item.id"
									     :label="item.channame"
									     :value="item.id"
									   />
								</el-select>
							</el-form-item>
							<el-form-item label="跟踪编号">
							      <el-input v-model="form.ordernumber" />
							    </el-form-item>
								<el-form-item label="预计到货日期">
								    <el-date-picker
								            v-model="form.arrdate"
								            type="date"
								            placeholder="选择日期"
								          />
							    </el-form-item>
								<el-form-item label="货件发货日期">
								    <el-date-picker
								            v-model="form.shipdate"
								            type="date"
								            placeholder="选择日期"
								          />
								</el-form-item>
								<el-form-item label="实际结算">
									<div class="mt-4">
									    <el-input
									      v-model="form.rweight"
										  @input="calculatefee"
										  type="number"
									      placeholder="请输入"
									      class="input-with-select"
									    >
									      <template #prepend>
									        <el-select v-model="form.wtype"   style="width: 115px">
									          <el-option label="重量" value="0"  />
									          <el-option label="体积" value="1" />
									        </el-select>
									      </template>
									      <template #append>
									       <el-select v-model="form.wunit"   style="width: 115px">
									                 <el-option label="kg" value="kg" />
									                 <el-option label="cbm" value="cbm" />
									        </el-select>
									      </template>
									    </el-input>
									  </div>
								</el-form-item>
								<el-form-item label="单价">
								     <el-input v-model="form.singleprice" @input="calculatefee" type="number" placeholder="请输入单价">
								           <template #append>￥</template>
								        </el-input>
								</el-form-item>
								<el-form-item label="关税等其它费用">
								     <el-input v-model="form.otherfee" type="number" @input="calculatefee" placeholder="请输入关税等其它费用">
								           <template #append>￥</template>
								        </el-input>
								</el-form-item>
								<el-form-item label="配送商" prop="carrier">
									<el-select v-model="form.carrier" placeholder="请选择">
										<el-option
										     v-for="item in carrlist.list"
										     :key="item"
										     :label="item"
										     :value="item"
										   />
									</el-select>
								</el-form-item>
								<el-form-item label="货件出港日期">
								    <el-date-picker
								            v-model="form.outtime"
								            type="date"
								            placeholder="选择日期"
								          />
								</el-form-item>
								<el-form-item label="货件到港日期">
								    <el-date-picker
								            v-model="form.intime"
								            type="date"
								            placeholder="选择日期"
								          />
								</el-form-item>
								<el-form-item label="备注">
									 <el-input v-model="form.remark" type="textarea" />
								</el-form-item>
								<el-form-item>
								      <el-button type="primary" @click="saveSelfTrans('save')">保存</el-button>
								      <el-button @click="openHistory">修改记录</el-button>
									   <!-- <el-button @click="openCosUpload">上传/下载报关资料</el-button> -->
								    </el-form-item>
						</el-form>
					</el-card>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="shi-right">
                    <h4>提交货件跟踪信息</h4>
					<el-table :data="boxinfolist.list" border  show-summary="true" >
						<el-table-column prop="boxnum" label="箱子编号" width="100"   />
						<el-table-column prop="" label="追踪编号" width="260">
							<template #default="scope">
								<el-input v-model="scope.row.tracking_id"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="package_status" label="包裹状态" width="100"   />
						<el-table-column prop="qty" label="装箱数量" width="100"   />
						<el-table-column prop="weight" label="重量(kg)" width="100"   />
						<el-table-column prop="volume" label="尺寸(cm)材积"  >
							<template #default="scope">
								<span>{{scope.row.length}}</span>*
								<span>{{scope.row.width}}</span>*
								<span>{{scope.row.height}}</span>
								({{scope.row.volume}})
							</template>
						</el-table-column>
					</el-table>
					 <el-alert title="配送商,跟踪编号等追踪信息暂停提交亚马逊,请到后台手动提交" type="warning" />
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<div class="shi-sum-data">
					<el-space :size="32">
						<div>运输费用: <span >￥{{shipfee}}</span></div>
						<div>物流费用总计: <span >￥{{formatFloat(totalfee)}}</span></div>
					</el-space>
				</div>
			</el-col>
		</el-row>
		<el-row class="mar-bot">
				  <ShipmentOpt ref="optRef"  />
				<div class="rt-btn-group">
					<el-button @click="openMaterialCon">耗材出库</el-button>
					<el-button type="primary" @click="stepclick(3)" plain>下一步</el-button>
					<el-button type="primary" @click="saveSelfTrans('confirm')">确认出库</el-button>
				</div>
		</el-row>
		
		<el-dialog v-model="historyDialogVisible" title="历史信息" width="80%" center>
			<el-table :data="historylist.list" border >
				<el-table-column prop="optname" label="操作人" width="100"   />
				<el-table-column prop="opttime" label="操作时间" width="100">
					<template  #default="scope">
						{{dateFormat(scope.row.opttime)}}
					</template>
				</el-table-column>
				<el-table-column prop="transtypename" label="运输方式" width="100"   />
				<el-table-column prop="companyname" label="物流承运商" width="100"   />
				<el-table-column prop="channame" label="物流渠道" width="100"   />
				<el-table-column prop="arrivalTime" label="预计到货日期" width="100" >
					<template  #default="scope">
							{{getValue(dateFormat(scope.row.arrivalTime))}}
					</template>
				</el-table-column>
				<el-table-column prop="wtype" label="收费方式" width="100" >
						<template  #default="scope">
							<span v-if="scope.row.wtype=='0'">
								重量(kg)
							</span>
							<span v-else>
								体积(cbm)
							</span>
						</template>
				</el-table-column>
				<el-table-column prop="transweight" label="计价单位" width="100"  >
					<template  #default="scope">
							<span>{{getValue(scope.row.transweight)}}</span>
							({{getValue(scope.row.wunit)}})
					</template>
				</el-table-column>	
				<el-table-column prop="singleprice" label="单价" width="50"  />
				<el-table-column prop="otherfee" label="关税等其它费用" width="100"  />
				<el-table-column prop="outarrtime" label="货件出港日期" width="100" >
					<template  #default="scope">
							{{getValue(dateFormat(scope.row.outarrtime))}}
						</template>
				</el-table-column>
				<el-table-column prop="inarrtime" label="货件到港日期" width="100" >
					<template  #default="scope">
							{{getValue(dateFormat(scope.row.inarrtime))}}
						</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" width="100"  />
				<el-table-column prop="singleprice" label="运输费用"   >
					<template  #default="scope">
						{{getValue(feefunc(scope.row.singleprice,scope.row.transweight))}}
						</template>
				</el-table-column>
				<el-table-column prop="singleprice" label="物流费用总计"   >
					<template  #default="scope">
						  {{getValue(feefunc(scope.row.singleprice,scope.row.transweight)+scope.row.otherfee)}}  
						</template>
				</el-table-column>
			</el-table>
			<template #footer>
			  <span class="dialog-footer">
			    <el-button @click="historyDialogVisible = false">关闭</el-button>
			  </span>
			</template>
		</el-dialog>
		
		<el-dialog v-model="cosDialogVisible" title="上传/下载报关资料" width="60%" center>
			<div>
				<el-row :gutter="16">
					<el-col :span="12" style="border-right: 1px solid #dedede;">
						<!-- <el-button style="margin-bottom: 20px;" type="primary" @click="downloadCustoms" >批量下载</el-button> -->
						<div style="margin-bottom: 20px;">历史上传记录 </div>
						<el-table   :data="customslist.list"  >
							<!-- <el-table-column type="selection" width="50" /> -->
							<el-table-column prop="filename" label="文件名"    />
							<el-table-column prop="username" label="操作人" width="100"   />
							<el-table-column prop="opttime" label="操作时间" width="150"  >
								<template  #default="scope">
									  {{dateTimesFormat(scope.row.opttime)}}  
								</template>
						    </el-table-column>
							<el-table-column prop="username" label="操作" width="100" >
								<template  #default="scope">
									 <span style="color: #0055ff;cursor: pointer;margin-right: 5px;" @click="downloadCustoms(scope.row.id)">下载</span>  
									 <span style="color: #0055ff;cursor: pointer;" @click="deleteFtpFile(scope.row.id)">删除</span>  
								</template>
							</el-table-column>
							
						</el-table>
					</el-col>
					<el-col :span="12">
						<el-upload
								class="upload-demo" 
								action   
								:http-request="uploadFile" 
								ref="upload"
								:limit="1" 
								:file-list="fileList" 
								:on-exceed="handleExceed" 
								:before-upload="beforeUpload" 
								:show-file-list="true" 
								:headers="headers" 
								accept=".docx,.doc,.xlsx,.xls,.txt"
								>
								<!-- action="/api/file/fileUpload" -->
								<el-button class="btn"><i class="el-icon-paperclip"></i>选择文件</el-button>
								<template #tip>
								  <div class="el-upload__tip">
								    文件后缀名:docx/doc/xlsx/xls/txt,小于50MB.
								  </div>
								</template>
							</el-upload>
							
							<el-button @click="uploadCusFile" type="primary">上传</el-button>
						<div style="margin-top: 5px;">按照模板定义格式导入数据。没有模板？<span style="color: #0055ff;cursor: pointer;" @click="downloadDataTemplate">点击下载</span></div>
					</el-col>
				</el-row>
			</div>
			
		</el-dialog>
		
		<el-dialog v-model="materialDialogVisible" title="耗材出库" width="50%" center>
			<el-table :data="materiallist.list" border >
				<el-table-column prop="image" label="图片" width="100" >
					<template  #default="scope">
						<el-image :src="scope.row.image"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="sku" label="SKU" width="100"   />
				<el-table-column prop="mname" label="产品名称"     />
				<el-table-column prop="inventoryqty" label="产品库存" width="100"   />
				<el-table-column prop="needamount" label="扣减数量" width="100"  >
					<template  #default="scope">
						<el-input type="number"  v-model="scope.row.needamount"></el-input>
					</template>
				</el-table-column>
			</el-table>
			<template #footer>
			  <span class="dialog-footer">
			    <el-button @click="materialDialogVisible = false">关闭</el-button>
				<el-button type="primary" @click="submitMaterialCon()">确认</el-button>
			  </span>
			</template>
		</el-dialog>
		
				<el-dialog v-model="compareVisible" title="物流比价" width="70%" center>
					<CompareList ref="comareRef" :isdialog="true" :shipform="form" :shipdata="shipdata"></CompareList>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="compareVisible = false">关闭</el-button>
							<el-button type="primary" @click="selectTrans()">确认</el-button>
						</span>
					</template>
				</el-dialog>
				
			<el-dialog custom-class="excelinfo" v-model="infoVisiable" width="860px" title="详情">
				<div v-if="pricemessage!=''">{{pricemessage}}</div>
				<iframe :src="getFrameUrl(form.company)" width="100%" height='423px' style="padding:0;margin:0"
				 frameborder='0'>未上传报价单 </iframe>
				 
				<template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="infoVisiable=false">关闭</el-button>
					</span>
				</template>
			</el-dialog>
	</div>
</template>
<script>
	import {h, ref ,watch,reactive,onMounted} from 'vue'
	import ShipmentOpt from"./shipment_operator.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
    import transportationApi from '@/api/erp/ship/transportationApi';
	import { useRoute,useRouter } from 'vue-router'
	import {formatFloat,format,dateFormat,dateTimesFormat} from '@/utils/index';
	import { ElMessage,ElMessageBox } from 'element-plus';
	import { ElTable } from 'element-plus'
	import CompareList from "@/views/erp/ship/transportation/components/compare.vue"
	import { View } from '@element-plus/icons-vue'
	import {BalanceTwo} from '@icon-park/vue-next';
	import {getValue} from '@/utils/index';
	export default {
			name: 'Fromlist',
			components: {
				ShipmentOpt,
				BalanceTwo,
				CompareList,
				View
			},
			emits: ["stepdata"],
			setup(props, context) {
				let router = useRouter()
				let shipdata = ref({})
				let shipfee = ref(0)
				let totalfee = ref(0)
				let historyDialogVisible = ref(false)
				let cosDialogVisible = ref(false)
				let materialDialogVisible = ref(false)
				let optRef = ref();
				let compareVisible = ref(false);
				let comareRef = ref(CompareList);
				const shipmentid = router.currentRoute.value.query.shipmentid;
				//上传后的文件列表
				let fileList = ref([])
				let infoVisiable = ref(false);
				// 运行上传文件大小，单位 M
				let fileSize = ref(2)
				//请求头
				let headers = ref({
					"Content-Type": "multipart/form-data"
				})
				let cusfile = ref()
				let form = reactive({
					pronumber: '',
					carrier: '',
					arrdate: '',
					shipdate: '',
					remark: '',
					transtype: '',
					company: '',
					channel: '',
					wtype: '0',
					wunit: '0',
					rweight: 0,
					singleprice: 0,
					otherfee: 0,
					outtime: '',
					intime: '',
					ordernumber: ''
				})
				let tranlist = reactive({
					list: []
				})
				let companylist = reactive({
					list: []
				})
				let channellist = reactive({
					list: []
				})
				let carrlist = reactive({
					list: []
				})
				let boxinfolist = reactive({
					list: []
				})
				let historylist = reactive({
					list: []
				})
				let materiallist = reactive({
					list: []
				})
				let customslist = reactive({
					list: []
				})
	            let pricemessage=ref("");
				onMounted(() => {
					getTransTypeAll();
				})
				async function getTransTypeAll() {
					let res = await transportationApi.getTransTypeAll();
					if (res.data) {
						tranlist.list = res.data;
						if (form.transtype == "") {
							form.transtype = res.data[0].id;
						}
					}
				}
	
				function changeTransType(val, type) {
					if (val.id) {
						getCompanyTranstypeList(val.id, type);
					} else {
						getCompanyTranstypeList(val, type);
					}
				}
	
				function getFrameUrl(company) {
					let url = "";
					companylist.list.forEach(item=>{
						if (item.id ==company ) {
							url = item.uploadpath;
						}
					});
					if(url&&url!=""){
						if(url.indexOf("http")>=0){
							pricemessage.value="";
					      return "https://view.officeapps.live.com/op/embed.aspx?src=" + url;
						}else{
							pricemessage.value="暂未报价"
							return "";
						}
					}else{
						pricemessage.value="暂未报价"
						return "";
					}
				}
	            
				function changeCompany(val, type) {
					if (val) {
						transportationApi.getChannel({
							"company": val,
							"marketplaceid": shipdata.value.marketplaceid,
							"transtype": form.transtype
						}).then((res) => {
							channellist.list = res.data;
							if (type != 'init') {
								form.channel = res.data[0].id;
							}
						})
					}
				}
	
				function getCompanyTranstypeList(val, type) {
					transportationApi.getCompanyTranstypeList({
						"marketplaceid": shipdata.value.marketplaceid,
						"transtype": val
					}).then(res => {
						console.log(res);
						if (res.data && res.data.length > 0) {
							companylist.list = res.data;
							if (type != 'init') {
								form.company = res.data[0].id;
							}
							getChannel(type);
						} else {
							companylist.list = [];
							form.company = null;
							channellist.list = [];
							form.channel = null;
						}
					})
				}
	
				function getChannel(type) {
					transportationApi.getChannel({
						"marketplaceid": shipdata.value.marketplaceid,
						"transtype": form.transtype,
						"company": form.company
					}).then(res => {
						if (res.data) {
							channellist.list = res.data;
							if (type != 'init') {
								form.channel = res.data[0].id;
							}
						}
					})
				}
	
				function loadCarrier(carr) {
					shipmenthandlingApi.getCarrier({
						"country": shipdata.value.countryCode,
						"transtyle": shipdata.value.transtyle
					}).then(res => {
						carrlist.list = res.data;
					})
				}
	
				function calculatefee() {
					if (form.rweight > 0 && form.singleprice > 0) {
						shipfee.value = form.singleprice * form.rweight;
						totalfee.value = (form.singleprice * form.rweight) + parseFloat(form.otherfee);
					}
				}
	
				function selectTrans() {
					let selection = comareRef.value.getSelection();
					if (selection && selection.length > 1) {
						ElMessage({
							message: '请勿选择多行！',
							type: 'warning',
						})
					} else if (selection && selection.length == 0) {
						ElMessage({
						 message: '请选择一行记录！',
							type: 'warning',
						})
					} else if (selection) {
						form.company = selection[0].company;
						form.channel = selection[0].id;
						changeTransType(form.transtype, 'init');
						compareVisible.value = false;
					}
	
				}
	
				function getShipAmazonInfo() {
					shipmenthandlingApi.getShipAmazonInfo({
						"shipmentid": shipmentid
					}).then(res => {
						var data = res.data;
						if (data.cart && data.cart.length > 0) {
							boxinfolist.list = data.cart;
						}
						if (data.shipment.status5date) {
							form.shipdate = data.shipment.status5date;
						}
						if (data.transinfo) {
							form.singleprice = data.transinfo.singleprice;
							form.rweight = data.transinfo.transweight;
							if (data.transinfo.wtype == "0") {
								form.wtype = '0';
							} else {
								form.wtype = '1';
							}
	
							form.wunit = data.transinfo.wunit;
							if (data.transinfo.arrivalTime) {
								form.arrdate = data.transinfo.arrivalTime;
							}
							if (data.transinfo.outarrtime) {
								form.outtime = data.transinfo.outarrtime;
							}
							if (data.transinfo.inarrtime) {
								form.intime = data.transinfo.inarrtime;
							}
							if (data.transinfo.ordernum) {
								form.ordernumber = data.transinfo.ordernum;
							}
							if (data.transinfo.otherfee) {
								form.otherfee = data.transinfo.otherfee;
							}
							if (data.transinfo.remark) {
								form.remark = data.transinfo.remark;
							}
							calculatefee();
						}
						if (data.transchannel) {
							form.transtype = data.transchannel.transtype;
							form.company = data.transchannel.company;
							form.channel = data.transchannel.id;
							changeTransType(form.transtype, 'init');
						} else {
							changeTransType(form.transtype);
						}
						if (data.shipment) {
							if (data.shipment.carrier) {
								form.carrier = data.shipment.carrier;
							}
						}
					})
				}
	
				function saveSelfTrans(ftype) {
					var data = {};
					data.shipmentid = shipmentid;
					data.company = form.company;
					data.channel = form.channel;
					data.unit = form.wunit;
					data.wtype = form.wtype;
					data.transtype = form.transtype;
					data.ordernum = form.ordernumber;
					data.remark = form.remark;
					data.operate = ftype;
					data.carrier = form.carrier;
					data.rweight = form.rweight;
					data.singleprice = form.singleprice;
					data.otherfee = form.otherfee;
					data.arrive = form.arrdate;
					data.shipdate = form.shipdate;
					data.outarrivaldate = form.outtime;
					data.inarrivaldate = form.intime;
					if ("SP" == shipdata.value.transtyle) {
						var boxinfos = [];
						boxinfolist.list.forEach(function(item, index) {
							var trackinginfo = {};
							trackinginfo.boxnum = item.boxnum;
							trackinginfo.value = item.tracking_id;
							boxinfos.push(trackinginfo);
						})
						data.boxinfo = boxinfos;
					} else {
						data.proNumber = form.pronumber;
					}
					shipmenthandlingApi.saveSelfTrans(data).then(res => {
						ElMessage({
							message: '操作成功！',
							type: 'success',
						})
					})
				}
	
				function openHistory() {
					historyDialogVisible.value = true;
					shipmenthandlingApi.getSelfTransHis({
						"shipmentid": shipmentid
					}).then(res => {
						if (res.data && res.data.length > 0) {
							historylist.list = res.data;
						}
					})
	
				}
	
				function openCosUpload() {
					cosDialogVisible.value = true;
					getShipmentCustoms();
				}
	
				function getShipmentCustoms() {
					shipmenthandlingApi.getShipmentCustomsRecord().then(res => {
						if (res.data && res.data.length > 0) {
							customslist.list = res.data;
						}
					})
				}
	
				function openMaterialCon() {
					materialDialogVisible.value = true;
					shipmenthandlingApi.getConsumableList({
						"shipmentid": shipmentid
					}).then(res => {
						if (res.data && res.data.length > 0) {
							materiallist.list = res.data;
						}
					})
				}
	
				function feefunc(value1, value2) {
					return (parseFloat(value1)) * (parseFloat(value2));
				}
	
				function submitMaterialCon() {
					var warehousename = shipdata.warehouse;
					var skulist = [];
					materiallist.list.forEach(function(item) {
						var row = {}
						row.sku = item.sku;
						row.qty = item.needamount;
						skulist.push(row);
					});
					shipmenthandlingApi.saveInventoryConsumable({
						"shipmentid": shipmentid,
						"warehousename": warehousename,
						"skulist": JSON.stringify(skulist)
					}).then(res => {
						if (res.data && res.data.isok == "true") {
							materialDialogVisible.value = true;
							ElMessage({
								message: '操作成功！',
								type: 'success',
							})
						}
					})
				}
				//下载海关记录
				function downloadCustoms() {
	
				}
				//删除海关上传记录
				function deleteFtpFile(id) {
					shipmenthandlingApi.deleteCustomsFile({
						"uploadid": id
					}).then(res => {
						if (res.data && res.data.code == "ok") {
							getShipmentCustoms();
							ElMessage({
								message: '操作成功！',
								type: 'success',
							})
						}
					})
				}
				//下载模板
				function downloadDataTemplate() {
	
				}
				//超出文件个数的回调
				function handleExceed() {
					ElMessage({
						message: '超出最大上传文件数量的限制！',
						type: 'error'
					})
					return
				}
				//上传文件的事件
				function uploadFile(item) {
					//上传文件的需要formdata类型;所以要转
					cusfile.value = item.file;
				}
				//文件上传之前
				function beforeUpload(file) {
					if (file.type != "" || file.type != null || file.type != undefined) {
						//截取文件的后缀，判断文件类型
						const FileExt = file.name.replace(/.+\./, "").toLowerCase();
						//计算文件的大小
						const isLt5M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
						//如果大于50M
						if (!isLt5M) {
							ElMessage({
								message: '上传文件大小不能超过 50MB!!',
								type: 'error'
							})
							return false;
						} else {
							// ElMessage({
							//     message: "上传文件格式不正确!",
							//     type: 'error'
							//   })
							return true;
						}
					}
				}
	
				function uploadCusFile() {
					let FormDatas = new FormData()
					FormDatas.append('file', cusfile.value);
					shipmenthandlingApi.uploadCustomsFile(FormDatas).then(function(res) {
						if (res.data) {
							if (res.data.code == "ok") {
								getShipmentCustoms();
								ElMessage({
									message: "上传成功！",
									type: 'success'
								})
							} else {
								ElMessage({
									message: "上传失败！",
									type: 'error'
								})
							}
						}
					})
				}
	
				function loadOptData(datas) {
					optRef.value.shipDatas = datas;
					shipdata.value = datas;
					loadCarrier();
					getShipAmazonInfo();
	
				}
	
				function stepclick(step) {
					context.emit("stepdata", step);
				}
				return {
					form,
					getTransTypeAll,
					tranlist,
					getCompanyTranstypeList,
					changeTransType,
					shipdata,
					companylist,
					channellist,
					loadCarrier,
					carrlist,
					shipfee,
					totalfee,
					calculatefee,
					getShipAmazonInfo,
					saveSelfTrans,
					boxinfolist,
					historyDialogVisible,
					cosDialogVisible,
					materialDialogVisible,
					openHistory,
					openCosUpload,
					openMaterialCon,
					historylist,
					feefunc,
					submitMaterialCon,
					materiallist,
					dateFormat,
					downloadCustoms,
					customslist,
					dateTimesFormat,
					deleteFtpFile,
					downloadDataTemplate,
					uploadFile,
					handleExceed,
					beforeUpload,
					fileList,
					headers,
					cusfile,
					uploadCusFile,
					loadOptData,
					optRef,
					stepclick,
					changeCompany,
					compareVisible,
					comareRef,
					selectTrans,
					getFrameUrl,
					infoVisiable,
	                pricemessage,
					formatFloat,
					getValue
				}
			}
		}
</script>

<style>
	.shi-left {
		margin-bottom:8px;
	}
	.shi-right .el-table{
		margin-top:16px;
		margin-bottom: 16px;
	}
	.shi-sum-data{
		background-color: var(--el-bg-color);
		padding:16px 24px;
		 font-size: 14px;
		 margin-bottom: 16px;
	}
	.shi-sum-data span{
		    font-weight: 600;
		    font-family: "Helvetica Neue";
			color: var(--el-color-primary);
	}
	
</style>
