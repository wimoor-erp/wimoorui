<template>
	<el-dialog v-model="dialogTransVisible" title="确认信息" width="80%" center>
		<div v-if="systemType=='ZH'">
		   <el-row>
			    <el-col :span="6">
						<span class="light-font">服务类型</span> 
						<div class="text-lg">{{shipment.service_name}}</div>
				</el-col>
				 <el-col :span="6">
						<span class="light-font">客户订单号</span>
						<div class="text-lg"> {{shipment.shipment_id}} / {{shipment.client_reference}}</div>
				</el-col>
			   <el-col :span="6">
						<span class="light-font">运费</span>
						<div class="text-lg">￥ {{shipment.charge_amount}}</div>
				</el-col>
	           <el-col :span="6">
						<span class="light-font">状态</span> 
						<span class="badge bg-orange"> {{shipment.status}}</span>
				</el-col>
				<el-col :span="6">
						<span class="light-font">箱数</span>
						<div class="text-lg">{{shipment.parcel_count}}</div>
				</el-col>

				<el-col :span="6">
						<el-col :span="6">
							<span class="light-font">申报数量</span>
							<div class="text-lg">
								{{shipment.sumqty}}
							</div>
				        </el-col>
						<el-col :span="6">
							<span class="light-font">申报价格</span>
							<div class="text-lg">
								{{shipment.sumprice}}
							</div>
					   </el-col>
			   </el-col>
			</el-row>
			<el-row>
				 <el-col :span="12">
					 <el-card class="box-card">
						<div class="box-title">基础信息</div>
						<div class="col-md-6 form-group">
							<p class="margin10"> 收件人</p>
							<div v-if="shipment.to_address">
								<div v-if="shipment.to_address.name">{{shipment.to_address.name}}</div>
								<div v-if="shipment.to_address.address_1">{{shipment.to_address.address_1}}</div>
								<div v-if="shipment.to_address.city_1">{{shipment.to_address.city_1}}</div>
								{{shipment.to_address.postcode}} {{shipment.to_address.country}}
							</div>
							<div v-else>
								暂无发件人信息
							</div>
						</div>
						<div class="col-md-6  form-group">
							<p class="margin10">发件人</p>
							<div v-if="shipment.from_address">
								<div v-if="shipment.from_address.name">{{shipment.from_address.name}}</div>
								<div v-if="shipment.from_address.address_1">{{shipment.from_address.address_1}}</div>
								<div v-if="shipment.from_address.city_1">{{shipment.from_address.city_1}}</div>
								{{shipment.from_address.postcode}} {{shipment.from_address.country}}
							</div>
							<div v-else>
								暂无发件人信息
							</div>
						</div>
					 </el-card>
				</el-col>
			   </el-row>
			   <el-row>
				<el-col :span="12">
					 <el-card class="box-card">
						<div class="box-title">路由信息 </div>
						   <span>{{shipment.carrier_code}}</span> 
							#<span>{{shipment.tracking_number}}</span>
								<div v-for="traces,index in shipment.traces">
									<span class="sys-point"></span>
									<span class="text-sm light-font">
									     {{dateFormat(traces.time*1000)}}
									</span>
									<div style="margin-left:8px;">{{traces.info}}</div>
								</div>
						</el-card>
					</el-col>
			</el-row>
			 
		     <el-row>
				 <el-col :span="24">
					 <el-card class="box-card">
						<div class="box-title"> 货箱信息</div>
						<table class="table">
							<thead>
								<tr>
									<th>货箱号</th>
									<th>客户数据</th>
									<th>拣货数据(实重/材重)</th>
									<th>打包时间</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="parcels,index in shipment.parcels">
									<td>{{parcels.number}} <br/>{{parcels.ext_number}} </td>

									<td v-if="parcels.client_height >0">{{parcels.client_weight}}br>
										{{parcels.client_length}} * {{parcels.client_weight}} *
										{{parcels.client_height}}
									</td>
									<td v-else>--</td>
									<td>{{parcels.chargeable_weight}}/{{parcels.actual_weight}}(kg) <br/>
										{{parcels.chargeable_length}} * {{parcels.chargeable_weight}} *
										{{parcels.chargeable_height}} (cm)
									</td>
									<td>{{dateFormat(parcels.picking_time*1000)}}</td>
								</tr>

							</tbody>
						</table>
					 </el-card>
				 </el-col>
			</el-row>

			<el-row>
				 <el-col :span="24">
				  <el-card class="box-card">
						<div class="box-title">申报信息</div>
									<table class="table">
										<thead>
											<tr>
												<th>货箱编号</th>
												<th>商品SKU</th>
												<th>中文品名</th>
												<th>英文品名</th>
												<th>申报单价</th>
												<th>数量</th>
												<th>材质</th>
												<th>用途</th>
												<th>品牌</th>
												<th>型号</th>
												<th>销售链接</th>
												<th>产品重量</th>
												<th>图片链接</th>
												<th>海关编码</th>
											</tr>
										</thead>
										<tbody v-for="parcels,index in shipment.parcels">
											<tr v-for="declarations,index in parcels.declarations">
												<td>{{parcels.ext_number}}</td>
												<td>{{declarations.sku}}</td>
												<td>{{declarations.name_zh}}</td>
												<td>{{declarations.name_en}}</td>
												<td>{{declarations.unit_value}}</td>
												<td>{{declarations.qty}}</td>
												<td>{{declarations.material}}</td>
												<td>{{declarations.usage}}</td>
												<td>{{declarations.brand}}</td>
												<td>{{declarations.size}}</td>
												<td>{{declarations.sale_url}}</td>
												<td>{{declarations.weight}}</td>
												<td> <span v-for="photo,index in declarations.photo_url">
														{{photo}}
													</span>
												</td>
												<td>{{declarations.hscode}}</td>
											</tr>
										</tbody>
									</table>
					      </el-card>
					</el-col>
				 </el-row>
 </div>
	 


		<div class="row" v-if="systemType=='ZM'">
			<div class="col-md-12">
				<div class="box box-widget" style="height:500px;">
					<div class="box-title"><img src="images/systempicture/inventory_detail_icon03.png"> 路由信息</div>
					<div id="transship2" style="margin-left:15px;margin-top:10px;">


						<p>运单号码:{{zmData.jobno}}</p>
						<div class="left-line"></div>
						<div style="padding-left:15px;max-height:400px;width:100%;overflow:auto;">
							<div v-for="traces,index in zmData.podInfoDTOList">
								<span class="sys-point"></span><span
									class="text-sm light-font">{{traces.scanTime }}</span>
								<p style="margin-left:8px;">{{traces.remark}}</p>
							</div>
						</div>


					</div>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogTransVisible=false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
   import transportationApi from '@/api/erp/ship/transportationApi';
   import { ref } from 'vue'
   	import {format,dateFormat} from '@/utils/index';
	export default {
		name: "TransInfoDailog",
		components: {},
		setup(props, context) {
			let dialogTransVisible=ref(false);
			let zmData=ref({});
			let shipment=ref({});
			let zhTrans=ref({});
			let systemType=ref("ZH");
			function loadZmApiDetail(data){
					if(data&&data.message&&data.message=="请求成功"){
						zmData.value=data;
					} 
			   }
		    function loadZhApiDetail(data,companyid,shipmentid){
						if(data&&data.status&&data.data.shipment){
							var sumqty=0;
							var sumprice=0.0;
							if(data
									 &&data.data
									 &&data.data.shipment
									 &&data.data.shipment.parcels){
										for(var i=0;i<data.data.shipment.parcels.length;i++){
											var parcels=data.data.shipment.parcels[i];
											for(var j=0;j<parcels.declarations.length;j++){
												var declarations=parcels.declarations[j];
												var qty=declarations.qty;
												var unit_value=declarations.unit_value;
												sumqty=parseInt(sumqty)+parseInt(qty);
												sumprice=parseFloat(sumprice)+(parseFloat(qty)*parseFloat(unit_value));
											}
										}
									 data.data.shipment.sumqty=sumqty;
									 data.data.shipment.sumprice=sumprice;
									 shipment.value=data.data.shipment;
									 shipment.value.sumprice=sumprice;
									}
						    transportationApi.shipTransDetialShipment({"companyid": companyid,"shipmentid":shipmentid}).then(res=>{
							 shipment.value= params=Object.assign(shipment.value, res.data.data.shipment);
						 })
				   }
		      }
		function loadTransDetialInfo(companyid,shipmentid,ordernum){
								var html="";
								transportationApi.shipTransDetial({"companyid": companyid,"shipmentid":shipmentid,"ordernum":ordernum}).then(res=>{
									if(res && res.data.ftype=="zhapi"){
										systemType.value="ZH";
										loadZhApiDetail(res.data,companyid,shipmentid);
									}
									if(res && res.data.ftype=="zmapi"){
										systemType.value="ZM";
										loadZmApiDetail(res.data);
									}
								})
							    dialogTransVisible.value=true;
		}
	  return {dialogTransVisible,zmData,
	         shipment,zhTrans,loadTransDetialInfo,systemType,dateFormat
			}
	    }
	}
</script>

<style>
</style>
