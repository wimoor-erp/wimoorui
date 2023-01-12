<template>
	<div>
		<el-card shadow="hover">
			<el-row class="ship-sty">
				<el-col :span="8">
					<div class="ship-info">
						<div class="ship-title ">
							<transaction-order theme="outline" size="18" fill="#696969" :strokeWidth="2"/>
							<span >货件信息</span>
						</div>
						<el-space direction="vertical" alignment="left"	>
							<div class='item-list-from'>
								<div class="label">货件名称</div>
								<div class="value">{{noDatatran(shipmentInfo.name)}}</div>
							</div>
							<div class='item-list-from'>
								<div class="label">货件编码</div>
								<div class="value">{{noDatatran(shipmentInfo.shipmentid)}}</div>
							</div>
							<div class='item-list-from'>
								<div class="label">亚马逊店铺</div>
								<div class="value">{{shipmentInfo.groupname}}</div>
							</div>
							<div class='item-list-from'>
								<div class="label">发货仓库</div>
								<div class="value">{{shipmentInfo.warehouse}}</div>
							</div>
							<div class='item-list-from'>
								<div class="label">收货站点</div>
								<div class="value">{{shipmentInfo.country}}</div>
							</div>
							<div class='item-list-from'>
								<div class="label">货件状态</div>
								<div class="value">
									 <el-tag :type="tranStatusType(shipment)" v-if="shipment.status">{{tranStatus(shipment)}}</el-tag>
								</div>
							</div>
							<div class='item-list-from'>
								<div class="label">备注</div>
								<div class="value">{{shipmentInfo.remark}}</div>
							</div>
						</el-space>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="ship-data">
						<div class="ship-title ">
							<take-off theme="outline" size="24" fill="#696969" :strokeWidth="2"/>
							<span >运输信息</span>
						</div>
						<el-space :size="32">
							<div class="ship-dea-data">
								<div class="ship-text">SKU个数</div>
								<div class="ship-num">{{shipmentInfo.skuamount}}</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text">实际配货总数</div>
								<div class="ship-num">{{shipmentInfo.sumQuantity}}</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text">{{weighttxt}}</div>
								<div class="ship-num" v-if="weightvalue">{{weightvalue}}</div>
								<div class="ship-num" v-else>无</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text">体积(立方)</div>
								<div class="ship-num" v-if="volume">{{volume}}</div>
								<div class="ship-num" v-else>无</div>
							</div>
						</el-space>
						<el-space :size="32">
							<div class="ship-dea-data">
								<div class="ship-text">亚马逊运输方式</div>
								<div class="ship-num" v-if="shiptype">{{shiptype}}</div>
								<div class="ship-num" v-else>无</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text">装箱箱数</div>
								<div class="ship-num" v-if="boxnum">{{boxnum}}</div>
								<div class="ship-num" v-else>无</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text ">总货值</div>
								<div class="ship-num ad-weight">{{totalprice}}</div>
							</div>
							<div class="ship-dea-data">
								<div class="ship-text ">物流总费用</div>
								<div class="ship-num ad-weight">{{totalfee}}</div>
							</div>
						</el-space>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="ship-addr">
						<div class="ship-title ">
							<local theme="outline" size="20" fill="#696969" :strokeWidth="2"/>
							<span >地址信息</span>
						</div>
						<el-timeline >
						    <el-timeline-item  :hollow="true"  timestamp="发货地址" >
								<p>{{fromAddress.name}}</p>
								<p>{{fromAddress.addressline1}}{{getValue(fromAddress.addressline2)}}</p>
								<p>{{fromAddress.city}}{{getValue(fromAddress.stateorprovincecode)}}{{getValue(fromAddress.postalcode)}}</p>
								<p>{{fromAddress.countrycode}}</p>
						    </el-timeline-item>
							<el-timeline-item :hollow="true"   timestamp="收货地址" >
								 <p>{{toAddress.name}}</p>
								 <p>{{toAddress.addressline1}}{{getValue(toAddress.addressline2)}}</p>
								 <p>{{toAddress.city}}{{getValue(toAddress.stateorprovincecode)}}{{getValue(toAddress.postalcode)}}</p>
								 <p>{{toAddress.countrycode}}-({{shipment.destinationfulfillmentcenterid}})</p>
							</el-timeline-item>
						  </el-timeline>
					</div>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import {TakeOff,TransactionOrder,Local} from '@icon-park/vue-next';
	import { ref,reactive,onMounted } from 'vue';
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import { useRoute,useRouter } from 'vue-router'
	import {tranStatus,tranStatusType} from "@/hooks/erp/shipment/shipment_status.js"
	
	export default{
		name:'Shipment_info',
		components:{
			TakeOff,TransactionOrder,Local,
		},
		setup(){
			onMounted(()=>{
			  getBaseInfo();
			})
			let shipmentInfo=ref({})
			let router = useRouter()
			let weighttxt=ref("实际结算重量")
			let weightvalue=ref("")
			let volume=ref("")
			let shiptype=ref("")
			let boxnum=ref("")
			let totalprice=ref("")
			let totalfee=ref("")
			let fromAddress=ref({})
			let toAddress=ref({})
			let shipment=ref({})
			const shipmentid = router.currentRoute.value.query.shipmentid;
			function noDatatran(val){
				if(val==null||val==undefined){
					return "--"
				}else{
					return val
				}
			}
		 
			function getValue(value){
				if(value==null||value==""||typeof(value)=="undefined"||(typeof(value) === "number" && isNaN(value))){
					return "";
				}
				else {
				  return ","+value;
				}
			}
			function getBaseInfo(){
				shipmenthandlingApi.getBaseInfo({
					"shipmentid":shipmentid
				}).then(res=>{
					if(res.data){
						var data=res.data;
						shipment.value=data.shipment;
						volume.value=data.totalBoxSize;
						shiptype.value=data.shipment.transtyle;
						boxnum.value=data.shipment.boxnum;
						totalprice.value="￥"+getValue(parseFloat(data.detail.itemprice));
						if(data["fromAddress"]){
							fromAddress.value=data["fromAddress"];
						}
						if(data["toAddress"]){
							toAddress.value=data["toAddress"];
						}
						if(data.transinfo==null || data.transinfo==undefined){
							totalfee.value="0";
						}else{
							if(!data.transinfo.otherfee)data.transinfo.otherfee=0;
							if(!data.transinfo.transweight)data.transinfo.transweight =0;
							if(!data.transinfo.singleprice)data.transinfo.singleprice=0;
							totalfee.value=( "￥"+  (parseFloat(parseFloat(data.transinfo.transweight) *parseFloat(data.transinfo.singleprice))+parseFloat(data.transinfo.otherfee))); 
						}
						if(data.transinfo && data.transinfo.transweight){
							if(data.transinfo.wunit){
								weightvalue.value=(data.transinfo.transweight+""+getValue(data.transinfo.wunit));
							}else{
								if(data.transchannel.priceunits=="weight"){
									weightvalue.value=(data.transinfo.transweight+"kg");
								}else{
									weightvalue.value=(data.transinfo.transweight+"cbm");
								}
							}
							weighttxt.value="实际结算重量";
						}else{
							weightvalue.value=(getValue(data.detail.readweight));
							weighttxt.value="发货重量(kg)";
						}
					}
				})
			}
			
			return{
				shipmentInfo,noDatatran,getBaseInfo,weighttxt,weightvalue,getValue,volume,shiptype,boxnum,totalprice,
				totalfee,fromAddress,toAddress,shipment,tranStatus,tranStatusType
				
			}
		}
	}
</script>

<style>
	.ship-sty .item-list-from,.ship-sty .el-timeline{
		font-size: var(--el-font-size-extra-small);
	}
	.ship-info{
		
	}
	.ship-text{
		font-size: 12px;
		color: rgb(102, 102, 102);
	}

	.ship-num{
		font-size: 14px;
		font-weight: 500;
		font-family: "Helvetica Neue";
		margin-bottom:32px;
	}
	.ad-weight{
		font-weight: 600;
	}
	.ship-dea-data{width:90px}
	.ship-title{display: flex;
	 align-items: center;
	 margin-bottom:16px ;
	 font-size: 14px;
	}
	
</style>
