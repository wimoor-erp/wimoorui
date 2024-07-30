<template>
	<div class="box-ship">
		<div class="con-header">
			<el-space :spacer="spacer">
				<h4>箱子信息</h4>
				<el-space   class="font-small">
					<span>需要</span>
					 <el-input :controls="false" v-model="inputboxNum" @input="inputBoxNumChange" @focus="inputBoxNumChange" :disabled="boxed" />
					<span>个箱子装箱</span>
					<el-button type='primary' @click="subimtBoxNum" :disabled="boxed">确认</el-button>
				</el-space>
				
				<el-space v-if="form.tranType=='LTL'"  class="font-small">
					<span>托盘个数:</span>
					 <el-input-number :controls="false"  :max="30" v-model.number="panNum"   />
				</el-space>
				
			</el-space>
		</div>
		<div class="con-body"  >
			<div style="width:100%;overflow-x: auto;margin-bottom:10px;">
			<table class="sd-table"    border="0" cellpadding="0" cellspacing="0"   >
				<thead>
					<tr>
						<th style="width: 60px;" >图片</th>
						<th style="width: 280px;"  >名称/SKU</th>
						<th   style="width: 80px;">货件数量</th>
						<!-- 箱子增减 -->
						<th v-for="(item,index) in inputboxNum" width="100px">箱子{{index+1}}</th>
						<th width="80px;" >总计</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for = "(item,index) in state.tableData" :key="index" >
						<td><img :src="item.image"   style="width:40px;height:40px" /></td>
						<td>
							<div class='name  text-omit-1'>{{item.name}}</div>
							<div class='sku'>{{item.sellersku}}</div>
						</td>
						<td>{{item.quantityshipped}}</td>
						<!-- 箱子增减 -->
						<td  v-for="(sub,i) in inputboxNum" :key="i">
							   <el-popover
								  placement="top"
								  trigger="hover"
								  :visible="item['popover'+i]" 
								>
								 <template #default>
								    箱号 : {{i+1}} <br/>SKU:{{ item.sellersku}} 
								 </template>
								 <template #reference> 
								 <el-input
								  value-on-clear=""
								 :disabled="boxDisable"  
								 :controls="false"   
								  v-model="item['boxNum'+i]" 
								  @blur="item['popover'+i]=false"
								  @focus="item['popover'+i]=true"
								 :id="'c-'+parseInt(i)+'-'+parseInt(index)+''"
								 :title="'箱号 :'+(i+1)+' SKU:'+ item.sellersku+''"
								 :min="0" 
								 @input="packNumchange(item,i)"
								 />
								 </template>
							  </el-popover>
						</td>
						<td><span v-if="item.sum!=item.quantity" class="text-danger">{{item.sum}}</span>
						    <span v-else class="text-success">{{item.sum}}</span>
						</td>
					</tr>
				</tbody>
				<!-- 合计 -->
				<tbody>
					<tr class="h-bg">
						<td colspan="2">
							<div class="text-right">合计</div>
						</td>	
						<td  class=" font-bold">{{boxDetail.sumquantityshiped}}</td>
						<!-- 每列合计 -->
						<td  v-for="(item,index) in state.tableData.colBoxsumNum"><div class=" font-bold">{{getSummmary(index)}}</div></td>
						<td  class=" font-bold">{{getSummmary()}}</td>
					</tr>
				</tbody>	
				<!-- 箱子加货物重量 -->
				<tbody>
					<tr>
						<td colspan="3">
						<div class="text-right">箱子+货物重量(kg)</div>
						</td>
						<td v-for="(sub,i) in inputboxNum">
							<el-tooltip
							   class="box-item"
							   effect="light"
							   placement="top"
							 >
							 <template #content>箱号: {{i+1}} </template>
							  <el-input
							  :disabled="boxDisable"
							  :controls="false"  
							   v-model="boxWeightData[i]" 
							  :min="0" 
							  @input="boxWeightData[i]=CheckInputFloat(boxWeightData[i])"
							  @change="boxweightChange"/>
							 </el-tooltip>
							 
						</td>
						<td >{{boxweightSum}}</td>
					</tr>
				</tbody>
				<!-- 箱子尺寸 -->
				<tbody>
					<tr v-for="(item,index)  in state.boxListData">
						<td colspan="3">
						<div class="text-right">
								<div class=" box-size">
							     <span v-if="index == 0">包装箱尺寸(cm)</span>
								 <el-link class="icon-c" @click="delectBox(item)" :underline="false" v-else><el-icon ><Close /></el-icon></el-link>
								<el-input :disabled="boxDisable"    v-model="item.boxlength"  style="width:80px;"
								 @input="item.boxlength=CheckInputFloat(item.boxlength)" placeholder="长"/>
								<span>*</span>
								<el-input :disabled="boxDisable"  
								 v-model="item.boxwidth" 
								 style="width:80px;"
								 @input="item.boxwidth=CheckInputFloat(item.boxwidth)"
								 placeholder="宽"/>
								<span>*</span>
								<el-input :disabled="boxDisable"    style="width:80px;"
								@input="item.boxheight=CheckInputFloat(item.boxheight)"
								v-model="item.boxheight"   placeholder="高"/>
							</div>
						</div>
						</td>
						<td  v-for="(sub,i) in inputboxNum">
							<div>
								<el-tooltip
								   class="box-item"
								   effect="light"
								   placement="bottom"
								 >
								 <template #content>箱号 : {{i+1}}  </template>
								    <el-checkbox :disabled="boxDisable"  @change='checkboxChange(i,index)' v-model="item.boxcheck[i]"></el-checkbox>
								 </el-tooltip>
								 
							
							</div>
						</td>
						<td >
						<div>{{rowboxNumAndsize(item,index).boxnum}}箱</div>
						<div>{{rowboxNumAndsize(item,index).size}}m³</div>
						</td>
					</tr>
				</tbody>
					<!-- 添加箱子尺寸 -->
					<tbody>
						<tr>
							<td colspan="3">
							<div class="text-right">
								<el-link type="primary"  @click="addBoxSize" :underline="false">添加其他不同尺寸的箱子</el-link>
								</div>
							</td>
							<td v-show="inputboxNum>0" :colspan="inputboxNum">使用以上复选框指定特定包装箱的尺寸</td>
							<td >
							<div>{{sumbsn.boxnum}}箱</div>
							<div>{{sumbsn.size}}m³</div>
							</td>
						</tr>
					</tbody>
			</table>
			</div>
			<el-row>
				<el-col :span="6">
				<el-button @click.stop="submitBox('submit')" :loading="submitloading"  type="primary" >提交所有货件装箱</el-button>
				<div class="font-extraSmall">请确认保存完所有货件的装箱信息再提交！</div>
				</el-col>
			 <el-col :span="14"  ><Operation ref="operationRef" :titles="titles"   @change="handleOperationChange"></Operation></el-col>	
				<el-col :span="4">
					<div class="rt-btn-group">
						<el-button  class="rt-btn-group" :disabled="boxDisable" :loading="submitloading"   @click="saveBox('save')">保存装箱信息</el-button>
					</div>
				</el-col>
			</el-row>
			<div style="padding-top:10px;padding-bottom:10px;">
			<el-divider  />
			</div>
			<el-row>
				<el-col :span="12" >
					<el-card v-loading="loadingTransportation"  style="min-height: 300px;">
						<template #header>
						      <div class="card-header">
						        <span>配送信息确认-配送商</span>
						      </div>
						    </template>
					<el-form :model="form"  label-position="left" label-width="200px">
						<el-form-item label="选择运输方式">
							<el-radio-group v-model="form.tranType"  @change="loadCarrier"  >
								<el-radio  label="SP">
								<p>小包裹快递</p>
								<span class="font-extraSmall">我要用单独的箱子由快递配送</span>
								</el-radio>
								<el-radio   label="LTL" >
								<p>汽车零担</p>
								<span class="font-extraSmall">我要发送托拍</span>
								</el-radio>
							</el-radio-group>
						</el-form-item>
						
								<el-form-item label="配送商" prop="carrier">
									<el-space :size="16">
									<el-select v-model="planData.shipment.transportationOptionId" >
										 <el-option 
												v-for="item in transportation" 
												 :key="item.transportationOptionId"
												 :label="item.carrier.name+'----'+item.shippingMode"
												 :value="item.transportationOptionId">
										 </el-option>
									</el-select>
									<span class="font-extraSmall">注：暂不支持亚马逊合作承运商</span>
									</el-space>
								</el-form-item>
								 
					</el-form>
					
					<el-row>
						<el-col :span="20">
						<el-button @click.stop="submitDetail('submit')" :loading="submitloading" type="primary" >提交所有货件配送信息</el-button>
						<div class="font-extraSmall">请确认保存完所有货件的配送信息再提交！</div>
						</el-col>
						<el-col :span="4">
							<div class="rt-btn-group">
								<el-button  class="rt-btn-group"   :loading="submitloading"   @click="saveDetail('save')">保存配送信息</el-button>
							</div>
						</el-col>
					</el-row>
					
					
					</el-card>
					
				</el-col >
				
				<el-col :span="11" :offset="1" >
					<el-card  v-loading="loadingDeliverWindow" style="min-height: 300px;"  >
						<template #header>
						      <div class="card-header">
						        <span>配送信息确认-预计到货时间</span>
						      </div>
						    </template>
					      <el-form :model="form" style="padding-top:20px;" label-position="left" label-width="200px">
								<el-form-item label="预计到货时间" prop="carrier">
									<el-select v-model="planData.shipment.deliveryWindowOptionId" >
										 <el-option 
											v-for="item in deliveryWindowOptions" 
											 :key="item.deliveryWindowOptionId"
											 :label="item.startDate.year+'-'+item.startDate.monthValue+'-'+item.startDate.dayOfMonth+'----'+item.endDate.year+'-'+item.endDate.monthValue+'-'+item.endDate.dayOfMonth"
											 :value="item.deliveryWindowOptionId">
										 </el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="操作" prop="carrier">
									<el-button    :loading="submitloading"   @click="saveTime()">提交</el-button>
								</el-form-item>
					</el-form>
					
		 
					
					</el-card>
					
				</el-col>
			</el-row>
			<div style="padding-top:10px;padding-bottom:10px;">
			<el-divider  />
			</div>
			
		 <el-card title="配送信息确认">
			<template #header>
				  <div class="card-header">
					<span>下载装箱</span>
				  </div>
	    </template>
			<el-row class="mar-bot ">
			<el-space >
				  <el-button 
					  @click="downloadBoxInfo">下载装箱详情
				  </el-button>
				 <el-button-group>
				 <el-select v-model="boxmarksType" class="m-2 myshipdrop"  placeholder="选择打印箱子标签类型">
				    <el-option
				      v-for="item in boxMarks"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value"
				   />
				   </el-select>
				   <el-dropdown trigger="click" >
				     <el-button >
				                打印箱子标签<el-icon class="el-icon--right"><arrow-down /></el-icon>
				     </el-button>
				     <template #dropdown>
				       <el-dropdown-menu >
						 <el-dropdown-item @click="downloadLabel('SELLER_LABEL')">下载箱子标签</el-dropdown-item>
						 <el-dropdown-item @click="downloadLabel('BARCODE_2D')">下载2D条形码</el-dropdown-item>
						 <el-dropdown-item @click="downloadLabel('PALLET')">下载托盘标签</el-dropdown-item>
				       </el-dropdown-menu>
				     </template>
				   </el-dropdown>
				 </el-button-group>
			</el-space>
			</el-row>
			<el-row :gutter="16" class="mar-bot">
				<el-col :span="12">
					<el-alert  :closable="false" title="第一步:提交装箱 , 第二步:提交预计到货日期 , 第三步:提交物流供应商 , 第四步:打标 (注意 必须完成前三步) !" type="info" />
				</el-col>
			</el-row>
			</el-card>
		</div>
	
	  
</div>
	  
</template>

<script setup>
	import {h, ref ,watch,reactive,onMounted,computed,nextTick,toRefs} from 'vue'
	import {Search,ArrowDown,Close} from '@element-plus/icons-vue'
	import { ElDivider,ElMessageBox ,ElMessage } from 'element-plus'
	import '@/assets/css/packbox_table.css'
	import materialApi from '@/api/erp/material/materialApi.js';
	import feedApi from '@/api/amazon/feed/feedApi.js';
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js';
	import shipmentPlacementApi from '@/api/erp/shipv2/shipmentPlacementApi.js';
	import shipmentBoxApi from '@/api/erp/shipv2/shipmentBoxApi.js';
	import shipmentTransportationApi from '@/api/erp/shipv2/shipmentTransportationApi.js';
	import ShipmentOpt from"./shipment_operator.vue"
	import Operation from "@/views/erp/shipv2/shipment_add/shipstep/components/operation.vue";
	import {formatFloat,CheckInputIntLGZero,CheckInputFloat} from '@/utils/index.js';
	import {pointKeyChnage} from '@/utils/jquery/key/point-key';
	import boxMarks from '@/model/erp/ship/boxMarks.json';
   
    const emit = defineEmits(['stepdata',"carrData","change"]);
	
	let state =reactive({
		planData:{shipment:{}},
		transportation:[],
		deliveryWindowOptions:[],
		infoData:{shipment:{}},
		boxDetail:{},
		totalBoxNum:0,
		submitloading:false,
		carrierData:[],
		boxDisable:false,
		inputboxNum:"",
		loadingDeliverWindow:false,
		loadingTransportation:false,
		boxWeightData:[],
		titles:['箱子信息','配送信息生成','预计到货日期生成','提交预计到货日期'],
		tableData:[],
		boxListData:[{boxlength:'',boxwidth:'',boxheight:'',boxcheck:[]}],
		form:{
			selectedTransportationOptionId:null,
			deliveryWindowOptionId:null,
			tranType:"SP",
		},
		boxed:false,
	})
	let{planData,
		transportation,
		titles,
		deliveryWindowOptions,
		loadingDeliverWindow,
		loadingTransportation,
		infoData,
		boxDetail,
		totalBoxNum,
		submitloading,
		carrierData,
		boxDisable,
		inputboxNum,
		boxWeightData,
		tableData,
		boxListData,
		form,
		boxed,
		}=toRefs(state);
	
	let spacer = h(ElDivider, { direction: 'vertical' })
	const operationRef=ref();
	let boxmarksType=ref("PackageLabel_Plain_Paper");
	let panNum=ref(1);
	
	
			 function cellTitle(sku,index){
				 return sku+"    箱号:"+(index+1)+"";
			 }
			 function inputBoxNumChange(){
				 state.inputboxNum=CheckInputIntLGZero(state.inputboxNum);
				 if(state.inputboxNum){
				    state.inputboxNum=parseInt(state.inputboxNum)
				 }
				 addBoxSize("init");
				pointKeyChnage(".sd-table");
			 }
			//确认装箱数量
			function subimtBoxNum(){
				state.tableData.forEach((item)=>{
					for(var i=0;i<state.inputboxNum ;i++){
						item['boxNum'+i] = undefined
						state.boxWeightData[i] = undefined
					}
				})
				state.boxed =true
			}
			function radioChange(val){
				radio1.value= val
			}
			 
			//箱子尺寸单选
			function checkboxChange(i,a){
				if(i==0&&a==0&&state.boxListData.length==1){
					state.boxListData[0].boxcheck=[];
					for(var ibox=0;ibox<state.inputboxNum ;ibox++){
						state.boxListData[0].boxcheck.push(true);
					}
				}else{
					state.boxListData.forEach((item,index)=>{
						if(a==index){
							item.boxcheck[i] = true
						}else{
							item.boxcheck[i] = false
						}
					})
				}
			}
			function rowBoxsumNum(row){
				let sum = 0
				for(var i=0;i<state.inputboxNum ;i++){
					if(row['boxNum'+i]){
				       sum +=row['boxNum'+i]
					}
				}
				return sum
			}
			//总计合计
			function getSummmary(index){
				let sumitem=0;
				if(index!=undefined){
					state.tableData.forEach((item)=>{
							if(item['boxNum'+index]!=undefined&&item['boxNum'+index]!=""){
								sumitem+=parseInt(item['boxNum'+index]);
							}
						});
				}else{
					state.tableData.forEach((item)=>{
						for(var i=0;i<state.inputboxNum ;i++){
							if(item['boxNum'+i]!=undefined&&item['boxNum'+i]!=""){
								sumitem+=parseInt(item['boxNum'+i]);
							}
							}
						});
				}
				return sumitem; 
			}
			//箱数立方尺寸求和
			function rowboxNumAndsize(row,index){
				let obj={}
				let boxnum = 0;
				let size =0
				if(row){
					row.boxcheck.forEach((item)=>{
						if(item == true){
							boxnum++;
						}
					})
					obj.boxnum = boxnum
					size = row.boxlength*row.boxwidth*row.boxheight*boxnum/1000000;
					obj.size = formatFloat(size);
				}
				return obj;
			} 
			 
			//计算属性
			let sumbsn = computed(()=>{
				let obj={}
				let boxnum = 0
				let size = 0
				state.boxListData.forEach((row)=>{
					let obj=rowboxNumAndsize(row);
					size=size+obj.size;
					boxnum=boxnum+obj.boxnum;
				})
				obj.boxnum = formatFloat(boxnum);
				obj.size =formatFloat(size) ;
				return obj
			})  
			
			let boxweightSum =   computed(()=>{
				let sumweight = 0;
				for(var i=0;i<state.boxWeightData.length;i++){
					if(state.boxWeightData[i]&&state.boxWeightData[i]!=""){
					   sumweight +=parseFloat(state.boxWeightData[i]);
					}
				}
				return formatFloat(sumweight);
			})  
				//竖向向装箱数求和
			state.tableData.colBoxsumNum = computed(()=>{
				const sumarr = [];
				state.tableData.forEach((item)=>{
					for(var i=0;i<state.inputboxNum ;i++){
						let sumitem=0;
						if(item['boxNum'+i]!=undefined){
							sumitem=item['boxNum'+i];
						}
						if(sumarr[i]){
							sumarr[i] +=sumitem;
						}else{
							sumarr[i] = sumitem;
						}
					}
				})
				
				return sumarr
			}) 
			//箱子重量
			//跳过箱子信息
			function jumpBoxinfo(){
				 ElMessageBox.alert('亚马逊可能收取处理费用', {
				    confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				  })
				  //货件状态3变成4
			}
			//装箱数量校验
			function packNumSum(row){
				let sum = 0
				for(var i=0;i<state.inputboxNum ;i++){
				    if(row['boxNum'+i]){
					sum +=parseInt(row['boxNum'+i]);
					}
				}
				row.sum=sum;
			}
			function packNumchange(row,index){
				var boxindex='boxNum'+index;
				if(row[boxindex]&&row[boxindex]!="0"){
				   row[boxindex]=CheckInputIntLGZero(row[boxindex]);
				}
				packNumSum(row);
			}
			//箱子重量变化
			function boxweightChange(){
				//console.log("重量数组",state.boxWeightData)
			}
			//添加箱子尺寸
			function addBoxSize(type){
				let obj = {boxlength:'',boxwidth:'',boxheight:'',boxcheck:[]};
				if(type=="init"){
					state.boxListData=[];
					state.boxListData.push(obj);
				}else{
					state.boxListData.push(obj)
				}
				
			}
			//删除
			function delectBox(row){
				state.boxListData.splice(state.boxListData.indexOf(row), 1)
			}
			function loadCarrier(){
				  var tranType=state.form.tranType;
				  if(state.boxDetail.market!=null){
					  shipmenthandlingApi.getCarrier({
					  	"country":state.boxDetail.market,
					  	"transtyle":tranType
					  }).then(res=>{
					  	   state.carrierData=res.data;
					  })
				  }
			}
			function getBoxDetial(res){
					if(res.data){
						state.boxDetail=res.data;
						state.tableData=res.data.itemlist;
						loadCarrier();
						 state.inputboxNum=res.data.totalBoxNum;
						 if(res.data.shipment.carrier){
						    state.form.selectedTransportationOptionId=res.data.shipment.carrier;
						 }
					 
						 state.tableData.forEach( async function(item,index){
						 	//混装发货 caselist
						 	if(state.boxDetail.arecasesrequired==false){
						 		for(let i=0;i<state.inputboxNum;i++){
									if(item.boxsku[i+1]&&item.boxsku[i+1]["quantity"]){
										item["boxNum"+i]=item.boxsku[i+1].quantity;
									}else{
										item["boxNum"+i]=0;
									}
						 		}
							   packNumSum(item);
						 	}else{
						 		//原厂包装发货 caselist
								if(item.boxnum&&parseInt(item.boxnum)>0){
								    item.num=parseInt(item.boxnum);
								}else{
									item.num=0;
								}
								if(item.num>0&&item.quantityshipped){
    								item.boxnum=item.quantityshipped/item.num;
								}else{
									item.boxnum=0;
								}
									
								if(item.boxsku&&Object.keys(item.boxsku).length>=1){
									item.boxnum=Object.keys(item.boxsku).length;
									item.totalQuantityShipped=item.boxnum*item.num;
									for (var key in item.boxsku) {
										item.num=item.boxsku[key].quantity;
										var boxnode=state.boxDetail&&state.boxDetail.listbox&&state.boxDetail.listbox.length>parseInt(key)-1?state.boxDetail.listbox[parseInt(key)-1]:null;
										if(boxnode){
											item.boxlength=boxnode.length;
											item.boxwidth =boxnode.width;
											item.boxheight=boxnode.height;  
											item.boxweight=boxnode.weight;  
										}
									 }
								}else{
									item.totalQuantityShipped=item.boxnum*item.num;
								}
						 	}
						 });
						 state.boxListData=[];
						 res.data.listbox.forEach((item)=>{
							 state.boxWeightData[item.boxnum-1]=item.weight;
							 let isold=false;
							 if(state.boxListData&&state.boxListData.length>0){
									 state.boxListData.forEach((boxitem)=>{
										 if(boxitem.boxlength==item.length
											 &&boxitem.boxwidth==item.width
											 &&boxitem.boxheight==item.height){
												 boxitem.boxcheck[item.boxnum-1]=true;
												 isold=true;
												 return;
											 }
									 });
								  }
								if(isold==false){
									let obj = {boxlength:item.length,boxwidth:item.width,boxheight:item.height,boxcheck:[]};
									for(let i=0;i<state.inputboxNum;i++){
									    obj.boxcheck[i]=false;
									}
									obj.boxcheck[(item.boxnum-1)]=true;
									state.boxListData.push(obj)
								} 
						 });
						 
						 state.tableData.colBoxsumNum = computed(()=>{
						 	const sumarr = [];
						 	state.tableData.forEach((item)=>{
						 		for(var i=0;i<state.inputboxNum ;i++){
						 			if(sumarr[i]){
						 				sumarr[i] += item['boxNum'+i]
						 			}else{
						 				sumarr[i] = item['boxNum'+i]
						 			}
						 		}
						 	})
						 	return sumarr
						 })
						 
					}
				 
			}
			function submitBox(){
					 //集体提交装箱信息
					 ElMessageBox.confirm(
					    '请确认是否填写完成所有货件的装箱信息？',
					    '确认提交装箱',
					    {
					      confirmButtonText: '确认',
					      cancelButtonText: '取消',
					      type: 'warning',
					    }
					  )
					    .then(() => {
								state.submitloading=true;
								shipmentBoxApi.submitPackingInformation({"formid":state.planData.plan.id}).then((res)=>{
									state.submitloading=false;
									ElMessage.success("已提交装箱信息！"); 
									if(res.data && res.data.operationid){
										operationRef.value.show(res.data.operationid,0);
									}
								}).catch(e=>{
									state.submitloading=false;
								});
					      
					    })
					
					 
			}
			
			function saveBox(opttype){
				var caselist=[];
				var boxlist=[];
				var summary=getSummmary();
				//混装发货 boxlist
				if(!state.boxDetail.arecasesrequired){
					if(state.boxDetail.sumquantityshiped!=summary){
						 ElMessage.error( '数量校验失败，请确所有产品都已装箱！');
						 return ;
					}
					state.boxListData.forEach(function(item,index){
						var boxnums="";							
						for(let i=0;i<state.inputboxNum;i++){
							 if(item.boxcheck[i]==true){
								 var boxrow={};
								 boxrow.shipmentid=state.planData.shipment.shipmentid;
								 boxrow.boxnum=(i+1)+"";
								 boxrow.length=item.boxlength;
								 boxrow.width=item.boxwidth;
								 boxrow.height=item.boxheight;
								 boxrow.unit='cm';
								 boxrow.weight=state.boxWeightData[i];
								 boxrow.wunit='kg';
								 if(boxrow.length&&boxrow.weight){
									 boxlist.push(boxrow);
								 }
							 }
						}
					})
					if(boxlist.length!=state.inputboxNum){
						ElMessage.error('请填写完整的箱子信息！');
						 return ;
					}
				}else{
					changeTotalBoxNum();
				}
	
				state.tableData.forEach( async function(item,index){
					//混装发货 caselist
					if(state.boxDetail.arecasesrequired==true){
						//原厂包装发货 caselist
						state.inputboxNum=state.totalBoxNum;
						for(let i=0;i<state.totalBoxNum;i++){
							if(item['boxselect'+i]==true){
								var caserow={};
								caserow.shipmentid=item.ShipmentId;
								caserow.merchantsku=item.SellerSKU;
								caserow.unitspercase=item.num;
								caserow.numberofcase=(1+i);
								caserow.quantity=item.num;
								caselist.push(caserow);
								
								var boxrow={};
								boxrow.shipmentid=item.ShipmentId;
								boxrow.boxnum=(1+i);//箱号
								boxrow.length=item.boxlength;
								boxrow.width=item.boxwidth;
								boxrow.height=item.boxheight;
								boxrow.unit='cm';
								boxrow.weight=item.boxweight;
								boxrow.wunit='kg';
								boxlist.push(boxrow);
							} 
						}
					    
					}else{
						for(let i=0;i<state.inputboxNum;i++){
							var caserow={};
							caserow.shipmentid=item.ShipmentId;
							caserow.merchantsku=item.sellersku;
							caserow.numberofcase=(1+i);
							if(item["boxNum"+i] && item["boxNum"+i]!=undefined){
								caserow.quantity=item["boxNum"+i];
								caserow.unitspercase=1;
							}else{
								caserow.quantity=0;
								caserow.unitspercase=0;
							}
							caselist.push(caserow);
						}
					}
				});
				var data={
					"shipmentid":state.planData.shipment.shipmentid,
					"boxnum":state.inputboxNum,
					"transtyle":state.form.tranType,
					"opttype":opttype,
					"carrier":state.form.selectedTransportationOptionId,
					"caseListDetail":caselist,
					"boxListDetail":boxlist
				}
				state.submitloading=true;
				
				
				var params={boxListDetail:[]};
				var lists=[];
				params.formid=state.planData.plan.id;
				params.boxnum=state.inputboxNum;
				params.opttype=opttype;
				params.shipmentid=state.planData.shipment.shipmentid;
				var total=0;
				var itemtotal=0;
				state.tableData.forEach(item=>{
					itemtotal=itemtotal+parseInt(item.QuantityShipped);
				});
				for(let i=0;i<state.inputboxNum;i++){
					 var boxrow={};
					boxrow.weight=state.boxWeightData[i];
					boxrow.wunit='kg';
					boxrow.formid=state.planData.plan.id;
					boxrow.boxnum=i+1;
					state.boxListData.forEach(box=>{
						 if(box.boxcheck[i]==true){
								boxrow.unit='cm';
								boxrow.length=box.boxlength;
								boxrow.height=box.boxheight;
								boxrow.width=box.boxwidth;
						}
					})
					boxrow.caseListDetail=[];
					state.tableData.forEach(item=>{
						if(item["boxNum"+i]){
							var caseDetail={"sku":item.msku,"quantity":item["boxNum"+i]};
							total=total+parseInt(caseDetail.quantity);
							boxrow.caseListDetail.push(caseDetail);
						}
					});
					 params.boxListDetail.push(boxrow);
				}
				shipmentBoxApi.savePackingInformation(params).then((res)=>{
					state.submitloading=false;
					if(opttype=='save'){
						ElMessage.success("箱子信息保存成功！");
						emit('change');
						state.submitloading=false;
					}else if(res.data&&res.data.operationid){
						 ElMessage.warning("箱子信息已提交...");
						 operationRef.value.show(res.data.operationid,0);
					}else{
						ElMessage.success("箱子信息保存成功！");
						state.submitloading=false;
						emit('change');
					}
				}).catch(e=>{
					state.submitloading=false;
				});

				 
			}
			function saveTime(){
				state.submitloading=true;
				var data={"formid":state.planData.plan.id,"deliveryWindowOptionId":state.planData.shipment.deliveryWindowOptionId ,"shipmentid":state.planData.shipment.shipmentid}
				shipmentPlacementApi.confirmDeliveryWindowOptions(data).then(res=>{
					state.submitloading=false;
					if(res.data&&res.data.operationid){
						 operationRef.value.show(res.data.operationid,3);
					}
				}).catch(()=>{
					state.submitloading=false;
				});
				
				
			}
			
			function saveDetail(){
				if(state.planData.shipment.deliveryWindowOptionId){
					state.submitloading=true;
					shipmentTransportationApi.saveConfirmTransportationOptionsInfo({"shipmentid":state.planData.shipment.shipmentid,"transportationOptionId":state.planData.shipment.transportationOptionId}).then(res=>{
						state.submitloading=false;
						if(res.data){
							ElMessage.success("配送信息保存成功！");
						}
					}).catch(()=>{
						state.submitloading=false;
					});
				}else{
					ElMessage.error("请先保存右侧的预计到货时间！");
				}
			}
			
			function submitDetail(){
				state.submitloading=true;
				shipmentTransportationApi.confirmTransportationOptionsByForm(state.planData.plan.id).then(res=>{
					state.submitloading=false;
					if(res.data&&res.data.operationid){
						 state.titles=['箱子信息','配送信息生成','提交预计到货日期','提交配送信息'],
						 operationRef.value.show(res.data.operationid,3);
					}
				}).catch(()=>{
					state.submitloading=false;
				});
			}
			
			
			function generateTransportationOptions(){
				shipmentTransportationApi.generateTransportationOptions(state.planData.plan).then((res)=>{
					 if(res.data.operationid){
						operationRef.value.show(res.data.operationid,1);
					 }
				});
			}
			
			function generateDeliveryWindowOptions(shipmentid){
				  shipmentPlacementApi.generateDeliveryWindowOptions({"formid":state.planData.plan.id,"shipmentId":shipmentid}).then(res=>{
					if(res.data.operationid){
						operationRef.value.show(res.data.operationid,2);
					}
				});
			}
			
			function boxShipment(){
				shipmentPlacementApi.boxShipment(state.planData.plan.id,state.planData.plan.shipmentids).then((res)=>{
					generateTransportationOptions();
					generateDeliveryWindowOptions(state.planData.shipment.shipmentid);
				});
			}
			function loadTransportation(paginationToken){
				state.loadingTransportation=true;
					shipmentTransportationApi.listTransportationOptions({
					"formid":state.planData.plan.id,
					"placementOptionId":state.planData.shipment.placementOptionId,
					"shipmentid":state.planData.shipment.shipmentid,
					"paginationToken":paginationToken,
					"pageSize":20}).then((res)=>{
						state.loadingTransportation=false;
						if(res&&res.data){
							 res.data.transportationOptions.forEach(item=>{
								if(item.shipmentId==state.planData.shipment.shipmentid){
									state.transportation.push(item);
								}
							 });
						}
						if(res&&res.data&&res.data.pagination&&res.data.pagination.nextToken){
							loadTransportation(res.data.pagination.nextToken);
						}
					});	
			
				}
			function refreshShipment(){
				shipmentPlacementApi.boxShipment(state.planData.plan.id,[state.planData.shipment.shipmentid]).then((res)=>{
		 
				});
			}
			function loadDeliverWindow(shipmentid){
					if(shipmentid){
					state.loadingDeliverWindow=true;
						shipmentPlacementApi.listDeliveryWindowOptions({"formid":state.planData.plan.id,"shipmentid":shipmentid}).then(res=>{
							state.loadingDeliverWindow=false;
							state.deliveryWindowOptions=res.data.deliveryWindowOptions;
						});
					}
			}
			
			function showEditBoxNum(row){
				changeTotalBoxNum();
			}
			function changeTotalBoxNum(){
				var index=0;
				state.totalBoxNum=0;
				state.tableData.forEach(function(item){
						if(item.boxnum && parseInt(item.boxnum)>0){
						  state.totalBoxNum=(state.totalBoxNum+parseInt(item.boxnum));
						}else{
							item.boxnum=0;
						}
						item.totalQuantityShipped=item.boxnum*item.num;
					});
				state.tableData.forEach(function(item){
					var number=item.boxnum;
					for(var i=0;i<state.totalBoxNum;i++){
						if(i>=index&&number>0){
							item["boxselect"+i]=true;
							index++;
							number--;
						}else{
					    	item["boxselect"+i]=false;
						}
					}
				})
			}
			 
			function downloadBoxInfo(){
				shipmentPlacementApi.downExcelBoxDetail({
					"shipmentid":state.planData.shipment.shipmentid
				}).then(res => {
						ElMessage.success( '导出成功！');
					 const blob = new Blob([res]);
					 if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
						navigator.msSaveBlob(blob, "boxDetail.xlsx")
					 }else{
						 var link=document.createElement("a");
						 link.href=window.URL.createObjectURL(blob);
						 link.download="boxDetail.xlsx";
						 link.click();
						 window.URL.revokeObjectURL(link.href);
					 }
				
				}).catch(e=>{
						ElMessage.error('导出失败！');
				})
			}
			function downloadLabel(labeltype){
				var data={};
				data.shipmentid=state.infoData.shipmentid;
				data.pagetype=boxmarksType.value;
				data.labeltype=labeltype;
				data.pannum=panNum.value;
				shipmentPlacementApi.downLabel(data,()=>{
					emit('change');
				});
			}
			function loadOptData(datas){
				state.planData=datas;
				state.infoData=datas.shipmentAll;
				if(datas.plan.submitbox==false && datas.shipment.status==3){
					state.boxDisable=false;
					state.boxed=false;
				}else{
					state.boxDisable=true;
					state.boxed=true;
				}
				if(state.infoData.transtyle){
				   state.form.tranType=state.infoData.transtyle;
				}
				getBoxDetial({"data":datas});
				if(datas.shipment.status>3){
					loadTransportation();
					if(datas.shipment.deliveryWindowOptionId){
						loadDeliverWindow(state.infoData.shipmentid);
					}else{
						generateDeliveryWindowOptions(datas.shipment.shipmentid);
					}
				}
			}
			function handleOperationChange(data){	
				state.submitloading=false;
				if(data && data.operationStatus=="SUCCESS" && data.operation=="setPackingInformation" ){
							boxShipment();
					}else if(data && data.operationStatus=="SUCCESS" && data.operation=="generateTransportationOptions" ){
						state.transportation=[];
						  loadTransportation()
					}else if(data && data.operationStatus=="SUCCESS" && data.operation=="generateDeliveryWindowOptions" ){
						    loadDeliverWindow(state.infoData.shipmentid);
					}
			}
			
			function stepclick(step){
				emit("stepdata",step);
			}
			 defineExpose({loadOptData})
</script>

<style scoped="scoped">
	.box-ship .el-form-item--small .el-form-item__content{
		line-height: 20px;
	}
	.font-extraSmall{
		font-weight: 400;
	}
	.box-ship .con-header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top:16px;
		margin-bottom:16px;
	}
	.box-ship .el-input-number--small{
		width: 100%;
	}
	.sd-table{
		margin-bottom:16px;
	}
	.box-size{
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.box-ship .el-input-number{width:70px !important;}
	.box-size span{
		margin-left: 8px;
		margin-right:8px;
	}
	.icon-c{
		font-size: 16px;
		margin-right:8px;
		line-height: 0px;
	}
	.box-ship .el-radio-group{
		line-height:20px;
	}
	.sd-table td{
		background-color: var(--el-bg-color);
	}
</style>
<style>
	.myshipdrop .el-input__wrapper{
		border-top-right-radius:0px !important;
		border-bottom-right-radius:0px !important;
	}
	.el-input.is-disabled .el-input__inner{
		color:#333;
		-webkit-text-fill-color:#333;
	}
	.el-radio__input.is-disabled+span.el-radio__label{color:inherit;}
</style>