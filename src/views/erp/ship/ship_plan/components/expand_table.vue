<template>
	<el-table  
	:row-class-name="handleRowClassName" 
	:data="tableData" 
	:empty-text="status.loading?'加载中...':'平台SKU皆已失效或隐藏 , 请在计划中忽略或者隐藏此本地SKU'"
	 size="small">
		<el-table-column label="FBA仓库" prop="marketname"   header-align="center" align="center" >
			<template #default="scope">
				<el-link >{{scope.row.marketname}}</el-link>
			</template>
		</el-table-column>
		<el-table-column label="亚马逊sku"  prop="sku" header-align="center" align="center" min-width="120">
			<template #default="scope">
			  {{scope.row.sku}} 
			  <el-tag size="small" effect="plain" :type="scope.row.statuscolor" v-if="scope.row.statusname">{{scope.row.statusname}}</el-tag>
			</template>
			
		</el-table-column>
		<el-table-column label="销量(7天|30天)" header-align="center" align="center" min-width="120"  prop="sales" >
			<template #default="scope">
				<span v-if="scope.row.sumseven"> {{scope.row.sumseven}} </span>
				<span v-else>0</span>
			   <span class="font-extraSmall">|</span> 
			   <span v-if="scope.row.summonth">{{scope.row.summonth}}  </span>
			   <span v-else>0</span>
			</template>
		</el-table-column>
		<el-table-column label="日均销量" min-width="90" header-align="center" align="center" >
			<template #default="scope">
				<div class="table-edit-flex" @click="handleAdjustSale(scope.row)">	
				<span v-if="scope.row.avgsales">{{scope.row.avgsales}}
				  <span v-if="scope.row.sysavgsales!=scope.row.avgsales" class="font-extraSmall"> ({{scope.row.sysavgsales}})</span>
				 </span>
				<span v-else-if="scope.row.sysavgsales">{{scope.row.sysavgsales}}</span>
				<span v-else>0</span>
				<el-icon ><Calendar/></el-icon>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="备货周期" header-align="center" align="center" >
			<template #default="scope">
				<span v-if="scope.row.iseu">  </span>
				 <el-popover 
				    v-else
				    placement="top-start"
				    title="备货周期"
				    :width="300"
					:visible="scope.row.visible" 
					trigger="click"
				  >
				  <p class="font-extraSmall m-b-18">
					  备货周期:{{scope.row.shipday}}天<br>=安全库存周期{{scope.row.cycle.stockingCycle}}天
					  +头程周期{{scope.row.cycle.firstLegDays}}天
					  +上架周期{{scope.row.cycle.putOnDays}}天
				  </p>
				   <el-row  >
				      <el-col :span="24" style="margin-top:10px"> 
					  安全库存周期
					  </el-col>
				      <el-col :span="24"  > 
					    <el-input type="number" class="m-b-18" v-model="scope.row.setstockingcycles" clearable >  </el-input>
					  </el-col>
				    </el-row>
				  <el-row  >
				     <el-col :span="24" style="margin-top:10px"> 
				  		   运输方式
				  	 </el-col>
				     <el-col :span="24"> 
				  		<el-select v-model="scope.row.settranstype" >
						   <el-option  key="" value="" label="系统默认" >
							   系统默认
						   </el-option>
				  		    <el-option
				  		      v-for="item in transtypeOptions"
				  		      :key="item.id"
				  		      :label="item.name"
				  		      :value="item.id"
				  		    > {{item.name}}
							<span class="font-extraSmall" v-if="scope.row.defaultTranstype==item.id">(默认)</span>
							</el-option>
				  		  </el-select>	 
				  	 </el-col>
				   </el-row>
				   <div style="padding-top:10px;text-align:right">
					    <el-button  @click.stop="scope.row.visible = false">关闭</el-button>
				        <el-button type="primary" @click.stop="handleSaveCycle(scope.row)">确定</el-button>
				   </div>
				    <template #reference>
				     <div class="table-edit-flex" @click="scope.row.visible = true">
				     	<span>{{scope.row.shipday}}|{{getTransName(scope.row.transtype,transtypeOptions)}}</span>
				     	<el-icon ><Edit/></el-icon>
				     </div>
				    </template>
				  </el-popover>
			</template>
		</el-table-column>
		<el-table-column label="FBA库存" header-align="center" align="center" >
			<template #default="scope">
				<span v-if="scope.row.iseu">{{scope.row.quantity}}</span>
				<el-popover v-else  trigger="click"  placement="top" width="240px"  >
				<template  #reference>	
				 <div class="text-center pointer">{{scope.row.quantity}} 
				   <span class="font-extraSmall" v-if="scope.row.overseaqty">+{{getZeroValue(scope.row.overseaqty)}}</span>  
				 </div>
				</template>
				 <ul class="border-line">
					 <li class="flex-center-between "><span>可用库存</span><el-tag type="success">{{getZeroValue(scope.row.afn_fulfillable_quantity)}}</el-tag></li>
					 <li class="flex-center-between"><span class="font-extraSmall">预留库存<span  >(汇总)</span></span><el-tag type="info">{{getZeroValue(scope.row.reserved_qty)}}</el-tag></li>
					 <li class="flex-center-between"><span class="font-extraSmall">预留库存<span > (买家订单)</span></span><el-tag type="info">{{getZeroValue(scope.row.reserved_customerorders)}}</el-tag></li>
					 <li class="flex-center-between"><span>预留库存<span class="font-extraSmall"> (运营中心转运)</span></span><el-tag type="warning">{{getZeroValue(scope.row.reserved_fc_transfers)}}</el-tag></li>
					 <li class="flex-center-between"><span>预留库存<span class="font-extraSmall"> (运营中心处理中)</span></span><el-tag type="warning">{{getZeroValue(scope.row.reserved_fc_processing)}}</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (正在发货)</span></span><el-tag >{{getZeroValue(scope.row.afn_inbound_working_quantity)}}</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (待接收)</span></span><el-tag >{{getZeroValue(scope.row.afn_inbound_shipped_quantity)}}</el-tag></li>
					 <li class="flex-center-between"><span>待入库库存<span class="font-extraSmall"> (正在接收)</span></span><el-tag >{{getZeroValue(scope.row.afn_inbound_receiving_quantity)}}</el-tag></li>
					 <li class="flex-center-between" v-if="scope.row.overseaqty"><span>海外仓库存<span class="font-extraSmall">  </span></span><el-tag >{{getZeroValue(scope.row.overseaqty)}}</el-tag></li>
				 </ul>
				</el-popover>
			</template>
		</el-table-column>
		<el-table-column label="建议发货量" header-align="center" align="center" >
			<template #default="scope">
				 <span v-if="scope.row.iseu">  </span>
				 <div v-else>
				<span v-if="scope.row.needship">
				<el-tooltip  placement="top">
									   <template #content>
									         <div >含发货频次{{scope.row.mincycle}}天内销量：{{scope.row.ship_min_cycle_sale}}  </div>
									    </template>
				  <span v-if="isOversea==true">{{scope.row.needshipfba}}</span> 
				  <span v-else>{{scope.row.needship}}</span> 
				</el-tooltip>
				</span>
				<span v-else>0</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="实际发货量"  min-width="110" header-align="center" align="center" >
			<template #default="scope">
				<el-space>
				<el-input-number 
				v-if="status.isEdit&&(scope.row.subnum<=1||!scope.row.subnum)" 
				style="width:80px;" :controls="false" size="small" 
				v-model="scope.row.amount"
				@input="scope.row.amount=CheckInputInt(scope.row.amount)"></el-input-number>
				<span v-else>
				   <span v-if="scope.row.reallyamount">{{scope.row.reallyamount}}</span>
				   <span v-else>0</span>
				   <span v-if="scope.row.subnum>1" class="font-extraSmall"> (汇总) </span>
				</span>
				 <el-icon v-if="status.isEdit&&!(scope.row.subnum>1&&scope.row.marketplaceid=='EU')" 
				   class="font-extraSmall" 
				   @click="handleSplitRow(scope.row)"><EditPen />
				 </el-icon>
				</el-space>
			</template>
		</el-table-column>
		<el-table-column label="可销售天数" header-align="center" align="center" >
			<template #default="scope">
				<span v-if="scope.row.iseu">  </span>
				<div v-else>
				<el-tooltip v-if="scope.row.salesday"
				        effect="dark"
				        placement="top"
				      >
					    <template #content>
					        <span>断货时间:{{dateFormat(scope.row.short_time)}}</span>
					      </template>
				      <span v-if="scope.row.salesday>=0&&scope.row.salesday<180">{{scope.row.salesday}}</span>
					  <span v-else>180+</span>
				      </el-tooltip>
				<span v-else>0</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="发货后可销售天数" min-width="115" header-align="center" align="center" >
			<template #default="scope">
				<span v-if="scope.row.aftersalesday>=0&&scope.row.aftersalesday<180">{{scope.row.aftersalesday}}</span>
				<span v-else>180+</span>
			</template>
		</el-table-column>
		<el-table-column label="近期发货记录" min-width="185" header-align="center" align="center" >
			<template #default="scope">
				<el-space v-if="scope.row.shipRecordQuantity>0" @click="handleShipRecord(scope.row)">
				<span class="pointer font-extraSmall" v-if="scope.row.shipRecordDay=='今日'" >
				<el-tag size="small" type="danger">{{scope.row.shipRecordDay}}</el-tag>
				</span>
				<span class="pointer font-extraSmall" v-else >
				{{scope.row.shipRecordDay}}
				</span>
				<span class="pointer " style="padding-left:5px;">{{scope.row.shipRecordQuantity}}</span>
				<el-tag  type="danger" v-if="scope.row.status=='1'" round>{{scope.row.shipRecordStatusName}}</el-tag>
				 <el-tooltip  effect="dark"  v-else-if="scope.row.status=='5'" placement="top" >
				  <template #content>
					<span>到货时间:{{dateFormat(scope.row.shipRecordArrivalday)}}</span>
				  </template>
				  <el-tag size="small" type="success"  round> {{scope.row.shipRecordStatusName}}</el-tag>
				 </el-tooltip>
				<el-tag size="small"  v-else round>{{scope.row.shipRecordStatusName}}</el-tag>
				</el-space>
				<div v-else> 无</div>
			</template>
		</el-table-column>
		<el-table-column label="商品详情" header-align="center" align="center" >
			<template #default="scope">
				<el-icon v-if="scope.row.marketplaceid=='EU'">
					<CaretBottom @click="handleShowEuData(scope.row)" class="pointer"/> 
				</el-icon>
				<el-icon v-else @click="handleProductDeatils(scope.row)" class="font-medium ">
					<View />
				</el-icon>
			</template>
		</el-table-column>
	</el-table>
</template>
<script setup>
	import { ref ,reactive,onMounted,toRefs,watch} from 'vue'
	import {Calendar,Edit,View,CaretBottom,EditPen} from '@element-plus/icons-vue';
 	import planApi from '@/api/erp/ship/planApi.js';
	import fbacycleApi from '@/api/amazon/inbound/fbacycleApi.js';
	import {dateFormat,CheckInputInt} from "@/utils/index";
	import { ElMessage, ElMessageBox } from 'element-plus'
	const props = defineProps({
					row:{
						default:[],
					},
					tableData:[],
					status:{},
					isOversea:false,
					transtypeOptions:{}
	})
	const {
	   tableData,status,transtypeOptions,isOversea,
	} = toRefs(props);
	const emit = defineEmits(['show-product-detail',
							  'show-sales-adjust',
							  'show-ship-record',
							  'show-split-row',
							  'show-eudata',
							  'reload']);
	function getZeroValue(value){
		if(value){
			return value;
		}else{
			return 0;
		}
	}
 
	function handleSaveCycle(row){
		if(row.setstockingcycles<0){
			ElMessage({ message: "备货周期必须大于等于0", type: 'error', });
			return;
		}
		var stockingCycle=row.setstockingcycles;
		var transtype=row.settranstype;
		var formData={sku:row.sku,marketplaceid:row.marketplaceid,groupid:row.groupid}
		    formData.transtype=transtype;
		    formData.stockingcycle=stockingCycle;
		    fbacycleApi.updateStockCycleTranstype(formData).then(res=>{
			       ElMessage({ message: "保存成功", type: 'success', });
			       emit("reload",props.row);
		    })
	}
 function handleRowClassName({row,rowindex}){
	   if(row["hide"]){
		    return 'hide';
	   }else if(row.iseu==true){
		   if(props.status.showeu==false){
	   		   return 'hide';
		   }else{
			 return '';
		   }
	   } else{
		   return '';
	   }
   }
	function getTransName(transtype,transtypeOptions){
		  if(transtypeOptions){
			  var name="";
			  transtypeOptions.forEach(item=>{
				  if(name==""&&(transtype+"")==item.id){
					  name =item.name;
				  }else{
					  return ;
				  }
			  })
			  return name;
		  }else{
			  return "";
		  }
	}
	function handleSplitRow(row){
		emit("show-split-row",row,props.row);
	}
	function handleShowEuData(row){
		emit("show-eudata",row,props.row);
	}
	function handleShipRecord(row){
		emit("show-ship-record",row,props.row);
	}
	function handleProductDeatils(row){
		emit("show-product-detail",row,props.row);
	}
	function handleAdjustSale(row){
		emit("show-sales-adjust",row,props.row);
	}
 
</script>

<style>
	.hide{
		display:none;
	}
	.expand-table .el-table__expanded-cell{
		padding:0px;
	}
	.expand-table .el-table__expanded-cell .el-table__cell{
		background-color:var(--el-fill-color-lighter);
	}
	.el-table__expanded-cell .table-edit-flex{
		text-align:center;
		display: block;
	}
	.expand-table .el-table__expanded-cell .el-table__inner-wrapper::before{background-color:var(--el-fill-color-lighter)}
	.m-b-8{
		margin-bottom:8px;
	}
</style>
