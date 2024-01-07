<template>
	 <div>
		  <span class="font-small">配货产品</span>
		  <div style="float:right;">
			  <el-button type="primary" @click="handleSubmit">提交</el-button>
		  </div>
	 </div>
	 <div style="padding-top:7px; ">
		  <el-divider />
	 </div>
	<div class="expand-table">
	<el-table  :data="skuList" :expand-row-keys="expandRowKeys" height="calc(100vh - 150px)"  :row-class-name="rowClassName" row-key="id">
			<el-table-column type="expand" width="65"   >
				<template #default="props">
				<div class="subAssemblyShelfTable">
			     <el-table :data="props.row.assemblyList" :row-class-name="rowClassName"  row-key="id">
					<el-table-column  label="图片" width="60px">
						<template #default='scope'>
							<el-image	v-if="scope.row.image" :src="scope.row.image" class="product-image"></el-image>
							<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-image"  ></el-image>
						</template>
					</el-table-column>
					<el-table-column label="名称/子SKU">
						<template #default="scope">
						    <el-tooltip :content="scope.row.mname">
							<div class="text-omit-1 name">{{scope.row.mname}}</div>
							</el-tooltip>
						    <div class='sku' v-if="scope.row.sku">{{scope.row.sku}} </div>
						</template>
					</el-table-column>
					<el-table-column label="箱规" width="120px">
						<template #default="scope">
						    <div class="font-extraSmall">
								箱柜:{{scope.row.boxnum}}个每箱
							</div>
						    <div class="font-extraSmall">
								尺寸:{{scope.row.boxlength}}*{{scope.row.boxwidth}}*{{scope.row.boxheight}}cm
							</div>
						    <div class="font-extraSmall" >
								重量:<span v-if="scope.row.weight">{{scope.row.weight}}kg</span>
								<span v-else>-</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="需求量"  width="120px" prop="subamount">
						<template #default="scope">
							 <div style="padding-left: 5px;"> {{scope.row.subamount}}</div>
						   <div  >
							   <el-popover
							      placement="top-start"
							      title="下架记录"
							      :width="400"
							      trigger="click"
							    >
							      <template #reference>
							        <el-button  type="primary"   v-if="scope.row.shelfInvRecordList&&scope.row.shelfInvRecordList.length>0" link>下架记录</el-button>
									<el-button  type="info" link v-else>暂无操作</el-button>
							      </template>
							   					 <el-table :data="scope.row.shelfInvRecordList" size="small" border>
							   					 	<el-table-column label="库位" >
							   					 		<template #default="scope">
							   					 		      {{scope.row.shelfname}}
							   					 		</template>
							   					 	</el-table-column>
							   					 	<el-table-column label="操作" prop="quantity">
							   					 		<template #default="scope">
							   					 			<span v-if="scope.row.opt==0">下架：</span>
							   					 			<span v-else>上架：</span>
							   					 			    {{scope.row.quantity}}
							   					 			<p class="font-extraSmall">
							   					 			    {{scope.row.opttime}}
							   					 			</p>
							   					 		</template>
							   					 	</el-table-column>
							   					 </el-table>
							    </el-popover>
						   </div>
						</template>
					</el-table-column>
					<el-table-column label="可用库存" width="80px" prop="fulfillable">
					</el-table-column>
					<el-table-column label="库位信息( 库位 - 库存 )"  width="350">
						<template #default="scope">
							<el-table v-if="scope.row.shelfInvList&&scope.row.shelfInvList.length>0" :data="scope.row.shelfInvList" @row-click="shelfRowClick"    size="small" border >
								<el-table-column  label="库位" prop="shelfname">
										<template #default="scope">
										<div @click="radioShelf=scope.$index">{{scope.row.shelfname}}
										<span class="font-extraSmall" v-if="scope.row.warehousename">({{scope.row.warehousename}})</span>
										</div>
										</template>
								</el-table-column>
								<el-table-column width="70"  label="库存" prop="quantity">	<template #default="scope">
										<div @click="radioShelf=scope.$index">{{scope.row.quantity}}</div>
										</template>
								</el-table-column>
								<el-table-column width="90"  label="下架" prop="quantity">	
								  <template #default="scope">
									<el-input  type="number" v-model="scope.row.quantity2" @input="scope.row.quantity2=CheckInputInt(scope.row.quantity2)">
									</el-input>
								  </template>
								</el-table-column>
							</el-table>
							<div v-else class="font-extraSmall">暂无上架信息</div>
						</template>
					</el-table-column>
					  
				</el-table>
				</div>
				</template>
			</el-table-column>
		<el-table-column  label="图片" width="60px">
			<template #default='scope'>
				<el-image	v-if="scope.row.image" :src="scope.row.image" class="product-image"></el-image>
				<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"  class="product-image"  ></el-image>
			</template>
		</el-table-column>
		<el-table-column label="名称/SKU">
			<template #default="scope">
			    <el-tooltip :content="scope.row.name">
				<div class="text-omit-1 name">{{scope.row.name}}</div>
				</el-tooltip>
			    <div class='sku' v-if="scope.row.sku">{{scope.row.sku}} </div>
			    <div class="font-extraSmall" v-if="scope.row.msku">
					平台SKU: {{scope.row.msku}}
				</div>
			    <div class="font-extraSmall" v-if="scope.row.fnsku">
					FNSKU: {{scope.row.fnsku}}
				</div>
			</template>
		</el-table-column>
		<el-table-column label="箱规" width="120px">
			<template #default="scope">
			    <div class="font-extraSmall">
					箱柜:{{scope.row.boxnum}}个每箱
				</div>
			    <div class="font-extraSmall">
					尺寸:{{scope.row.boxlength}}*{{scope.row.boxwidth}}*{{scope.row.boxheight}}cm
				</div>
			    <div class="font-extraSmall" >
					重量:<span v-if="scope.row.weight">{{scope.row.weight}}kg</span>
					<span v-else>-</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="发货"   width="120px" prop="quantityShipped">
				<template #default="scope">
					<div style="padding-left: 5px;"> {{scope.row.quantityShipped}}</div>
				   <div  >
					   <el-popover
					      title="下架记录"
					      :width="400"
					      trigger="click"
					    >
					      <template #reference>
					        <el-button  type="primary"   v-if="scope.row.shelfInvRecordList&&scope.row.shelfInvRecordList.length>0" link>下架记录</el-button>
							<el-button  type="info" link v-else>暂无操作</el-button>
					      </template>
					   					 <el-table :data="scope.row.shelfInvRecordList" size="small" border>
					   					 	<el-table-column label="库位" >
					   					 		<template #default="scope">
													  <div  >{{scope.row.shelfname}}
													  <span class="font-extraSmall" v-if="scope.row.warehousename">
														  ({{scope.row.warehousename}})
														  </span>
														  </div>
					   					 		</template>
					   					 	</el-table-column>
					   					 	<el-table-column label="操作" prop="quantity">
					   					 		<template #default="scope">
					   					 			<span v-if="scope.row.opt==0">下架：</span>
					   					 			<span v-else>上架：</span>
					   					 			    {{scope.row.quantity}}
					   					 			<p class="font-extraSmall">
					   					 			    {{scope.row.opttime}}
					   					 			</p>
					   					 		</template>
					   					 	</el-table-column>
					   					 </el-table>
					    </el-popover>
				   </div>
			</template>
		</el-table-column>
		<el-table-column label="可用库存" width="80px" prop="invquantity">
		</el-table-column>
		<el-table-column label="库位信息( 库位 - 库存 )" width="350">
			<template #default="scope">
				<el-table v-if="scope.row.shelfInvList&&scope.row.shelfInvList.length>0" :data="scope.row.shelfInvList" @row-click="shelfRowClick"    size="small" border >
					<el-table-column  label="库位" prop="shelfname">
							<template #default="scope">
							<div @click="radioShelf=scope.$index">{{scope.row.shelfname}}</div>
							</template>
					</el-table-column>
					<el-table-column width="70"  label="库存" prop="quantity">	<template #default="scope">
							<div @click="radioShelf=scope.$index">{{scope.row.quantity}}</div>
							</template>
					</el-table-column>
					<el-table-column width="90"  label="下架" prop="quantity">	
					  <template #default="scope">
						<el-input  type="number" v-model="scope.row.quantity2" @input="scope.row.quantity2=CheckInputInt(scope.row.quantity2)">
						</el-input>
					  </template>
					</el-table-column>
				</el-table>
				<div v-else class="font-extraSmall">暂无上架信息</div>
			</template>
		</el-table-column>
		 
		 
	</el-table>
	</div>
</template>

<script setup>
	import { ref,reactive,onMounted, toRefs} from 'vue';
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js';
	import {formatFloat,CheckInputInt,CheckInputFloat} from '@/utils/index';
	import { ElMessage, ElMessageBox } from 'element-plus';
	const emit = defineEmits(["change"]);
	const state = reactive({
		radioShelf:0,
		skuList:[],
		expandRowKeys:[],
	})
	const {
		radioShelf,
		skuList,
		expandRowKeys
	} = toRefs(state)
	//下架操作
	function handleSubmit(){
		var arr=[]
		var needwarning=false;
		if(state.skuList&&state.skuList.length>0){
			state.skuList.forEach(row=>{
				var hasqty=0;
				 if(row.shelfInvList&&row.shelfInvList){
				 	row.shelfInvList.forEach(item=>{
						if(item.quantity2){
							var qty=parseInt(item.quantity2);
							if(qty>0){
								hasqty=hasqty+qty;
								var obj={};
								obj.materialid = item.materialid;
								obj.shelfid = item.shelfid;
								obj.warehouseid=item.warehouseid;
								obj.formid=row.id;
								obj.formtype="outstockform";
								obj.quantity =qty;
								obj.opt = 0;
								arr.push(obj);
							}
						}
				 	})
				 }
				 var out=getOut(row);
				 if(out+hasqty>parseInt(row.quantityShipped)){
					 needwarning=true;
				 }
				if(row.assemblyList&&row.assemblyList.length>0){
					row.assemblyList.forEach(subrow=>{
						var subhasqty=0;
						 if(subrow.shelfInvList&&subrow.shelfInvList){
						 	subrow.shelfInvList.forEach(item=>{
						 		if(item.quantity2){
						 			var qty=parseInt(item.quantity2);
						 			if(qty>0){
						 				hasqty=hasqty+qty;
						 				var obj={};
										obj.materialid = item.materialid;
										obj.shelfid = item.shelfid;
										obj.warehouseid=item.warehouseid;
						 				obj.formid=row.id;
						 				obj.formtype="outstockform";
						 				obj.quantity =qty;
						 				obj.opt = 0;
						 				arr.push(obj);
						 			}
						 		}
						 	})
						 }
						 var subout=getOut(subrow);
						 if(subout+subhasqty>parseInt(subrow.subamount)){
						 	  needwarning=true;
						 }
					})
				}
			})
		}
		
		
		//多个库位时，获取选中的库位的id
		if(needwarning){
			 ElMessageBox.confirm(
			    '您的下架数量将大于发货数量，请确认是否继续?',
			    'Warning',
			    {
			      confirmButtonText: '确认',
			      cancelButtonText: '取消',
			      type: 'warning',
			    }
			  )
			    .then(() => {
			      shelfproductApi.subShelfInventory(arr).then(data=>{
			      	ElMessage({
			      		message:'下架成功',
			      		type:'success',
			      	})
			       emit("change");
			      		
			      })
			    })
			    .catch(() => {
			       
			    })
		}else{
			shelfproductApi.subShelfInventory(arr).then(data=>{
				ElMessage({
					message:'下架成功',
					type:'success',
				})
				 emit("change");
			})
		}
	}
	
	function getOut(row){
		var out=0;
		if(row.shelfInvRecordList&&row.shelfInvRecordList.length>0){
				row.shelfInvRecordList.forEach((item,index)=>{
					if(item.quantity){
						out=out+parseInt(item.quantity);
					}
				});
		}
		return out;
	}
	function getChecked(row,skumap){
		var value =0 ;
		if(row.mname){
				value = parseInt(row.subamount);
		}else{
				value = parseInt(row.quantityShipped);
		}
		var out=getOut(row);
		value=value-out;
		if(value<0){
			value=0;
		}
		if(row.shelfInvList&&row.shelfInvList.length>0){
			row.shelfInvList.forEach((item,index)=>{
				var oldvalue=0;
				if(skumap[item.id]){
					 oldvalue=skumap[item.id];
				}
				var itemqty=parseInt(item.quantity);
				itemqty=itemqty-oldvalue;
				if(value>itemqty){
					item.quantity2 = itemqty;
					value = value-itemqty;
				}else if(value>0){
					item.quantity2 = value;
					value = 0;
				}
				if(item.quantity2>0){
					if(skumap[item.id]){
						 skumap[item.id]=skumap[item.id]+item.quantity2;
					}else{
						 skumap[item.id]=item.quantity2;  
					}
				}
				
			   })
	   }
	  
	}
	function rowClassName({ row, rowIndex }){
		var clasz=""
		if(row.assemblyList&&row.assemblyList.length>0){
			clasz= "hasChildren";
		}else{
			clasz= "NonChildren";
		}
		if(row.isrepeat){
			clasz= "isrepeat "+clasz;
		}else{
			clasz= "norepeat "+clasz;
		}
		return clasz;
	}
	function show(mskuList){
		state.skuList=mskuList;
		var skumap={};
		var skulist=[];
		if(state.skuList&&state.skuList.length>0){
			state.skuList.forEach((item)=>{
				getChecked(item,skumap);
				if(skulist.includes(item.sku)){
					item.isrepeat=true;
				}else{
					item.isrepeat=false;
					skulist.push(item.sku);
				}
				if(item.assemblyList&&item.assemblyList.length>0){
					state.expandRowKeys.push(item.id);
					item.assemblyList.forEach(subrow=>{
						getChecked(subrow,skumap);
						if(skulist.includes(subrow.sku)){
							subrow.isrepeat=true;
						}else{
							subrow.isrepeat=false;
							skulist.push(subrow.sku);
						}
					})
				}
			})
		}
	}
	 defineExpose({ show })
</script>

<style>
	.NonChildren .el-table__expand-icon{
		display: none !important;
	}
	.subAssemblyShelfTable{
		background-color: #EEEEEE;
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
	.isrepeat td{ 
			     background-color: #fff3ec !important;
	}
 
	.dark .isrepeat td{
				  background-color: #302d2c !important;
	}
	 
</style>
