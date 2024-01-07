<template>
	<el-dialog
	title="分时策略"
	v-model="visible"
	width="80%"
	>
	
	<el-form v-model="from" >
		<el-form-item label="策略名称" >
			<el-space :size="32">
			<el-switch
			    v-model="from.useTem"
				size="small"
			    active-text="使用模板"
			  />
			  <el-input v-if="!from.useTem" v-model="from.name" placeholder="策略名称"></el-input>
			 <el-select v-else v-model="from.value" placeholder="请选择分时策略" >
			    <el-option
			      v-for="item in planOptions"
			      :key="item.value"
			      :label="item.name"
			      :value="item.value"
			    />
			  </el-select>
			  </el-space>
		</el-form-item>
		<el-form-item label="策略状态" >
			<el-switch
			    size="small"
			    v-model="from.state"
			  />
		</el-form-item>
		<el-form-item label="起止时间" >
			<el-row>
			<el-date-picker
			        v-model="from.date"
			        type="daterange"
			        range-separator="-"
			        start-placeholder="开始时间"
			        end-placeholder="结束时间"
			      />
				  &nbsp;&nbsp;<span class="font-extraSmall">非必填</span>
			</el-row>	  
		</el-form-item>
		<el-form-item >
			<div class="flex1">
			<el-tabs
			    v-model="from.tab"
			    type="card"
			    class="demo-tabs"
			    @tab-click="handleClick"
			  >
			    <el-tab-pane label="分时竞价" name="1"></el-tab-pane>
			    <el-tab-pane label="分时预算" name="2"></el-tab-pane>
				</el-tabs>
				<el-space direction="vertical" class="widthfill" :fill="true" :size="16">
			 <el-alert class="clear-lineheight"  type="info" :closable="false"> 
			 <p>1.分时竞价执行中，手动修改竞价或者亚马逊后台修改竞价，将以后者修改的竞价为原有竞价。</p>
			 <p>2.指定日期的分时竞价规则会比重复周期的规则优先执行</p>
			 </el-alert>		
			<el-table :data="tableData">
				<el-table-column label="触发类型" width="140">
				  <template #default="scope">
					<el-select  v-model="scope.row.trigger"  >
					   <el-option
					     v-for="item in scope.row.triggerOptions"
					     :key="item.value"
					     :label="item.name"
					     :value="item.value"
					   />
					 </el-select>
				  </template>
				</el-table-column>
				<el-table-column label="执行日期" width="240px">
					<template #default="scope">
						<el-select v-if="scope.row.trigger=='1'"  v-model="scope.row.date"  multiple clearable>
						   <el-option
							 v-for="item in scope.row.dateOptions"
							 :key="item.value"
							 :label="item.name"
							 :value="item.value"
						   />
						 </el-select>
						 <el-date-picker
						 v-else
						         v-model="scope.row.date"
						         type="date"
						         placeholder="选择一天"
						       />
					</template>
				</el-table-column>
				<el-table-column label="时间段" width="280px">
					<template #default="scope">
						<el-space>
						<el-time-select
						      v-model="scope.row.startTime"
						      :max-time="scope.row.endTime"
						      placeholder="开始时间"
						      start="1:00"
						      step="1:00"
						      end="24:00"
						    />
						    <el-time-select
						      v-model="scope.row.endTime"
						      :min-time="scope.row.startTime"
						      placeholder="结束时间"
						      start="1:00"
						      step="1:00"
						      end="24:00"
						    />
							</el-space>
					</template>
				</el-table-column>
				<el-table-column label="竞价规则">
				  <template #default="scope">
					<el-select  v-model="scope.row.rule"  >
					   <el-option
					     v-for="item in scope.row.ruleOptions"
					     :key="item.value"
					     :label="item.name"
					     :value="item.value"
					   />
					 </el-select>
				  </template>
				</el-table-column>
				<el-table-column label="竞价">
					<template #default="scope">
						<el-input v-if="scope.row.rule=='1'" v-model="scope.row.bidding">
							  <template #prepend>$</template>
						</el-input>
						<el-input v-else v-model="scope.row.rate">
							  <template #append>%</template>
						</el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80px">
				  <template #default="scope">
				    <el-link v-if="scope.$index==0" @click="handleAdd" :underline="false" type="primary" class="font-extraLarge">
						<el-icon><CirclePlus /></el-icon>
					</el-link>
					<el-link v-else  :underline="false" type="primary" class="font-extraLarge">
						<el-icon><Minus /></el-icon>
					</el-link>
				  </template>
				</el-table-column>
			</el-table>
			</el-space>
			</div>
		</el-form-item>
	</el-form>
	<template #footer>
		<el-button @click="visible=false">取消</el-button>
		<el-button >保存为模板</el-button>
		<el-button type="primary" @click="saveBudgetRule">保存</el-button>
	</template>
	</el-dialog>
</template>

<script setup>
	import {ref,reactive,toRefs} from"vue";
	import {CirclePlus,Minus} from '@element-plus/icons-vue';
	import advBudgetRuleApi from '@/api/amazon/advertisement/report/advBudgetRuleApi.js';
	
	const state = reactive({
		visible:false,
		planOptions:[{name:'策略a',value:'1',},{name:'策略b',value:'2',}],
		from:{
			name:'',
			value:'1',
			useTem:false,
			state:true,
			date:'',
			tab:'1',
		},
		tableData:[
			{
			 trigger:'1', 
			 triggerOptions:[{name:'重复周期',value:'1'},{name:'指定日期',value:'2'}],
			 date:['1'],
			 dateOptions:[
				 {name:'周一',value:'1'},
				 {name:'周二',value:'2'},
				 {name:'周三',value:'3'},
				 {name:'周四',value:'4'},
				 {name:'周五',value:'5'},
				 {name:'周六',value:'6'},
				 {name:'周日',value:'7'},
				 ],
			 ruleOptions:[
				 {name:'固定竞价',value:'1'},
				 {name:'增加%',value:'2'},
				 {name:'减少%',value:'3'},
				 ],
				 rule:'1',
			},
		],
		nowRow:null,
	})
	const{
		visible,
		from,
		planOptions,
		tableData,
		nowRow,
	}=toRefs(state)
	defineExpose({
		show,
	})
	function show(row){
		state.visible = true;
		state.nowRow=row;
		var params={"campaignId":row.campaignId};
		advBudgetRuleApi.budgetRulesRecommendation(row.profileid,row.campaignType,params).then((res)=>{
			console.log(res.data);
		});
	}
	
	function handleAdd(){
		state.tableData.push({
			trigger:'1',
			triggerOptions:[{name:'重复周期',value:'1'},{name:'指定日期',value:'2'}],
			date:['1'],
			dateOptions:[
							 {name:'周一',value:'1'},
							 {name:'周二',value:'2'},
							 {name:'周三',value:'3'},
							 {name:'周四',value:'4'},
							 {name:'周五',value:'5'},
							 {name:'周六',value:'6'},
							 {name:'周日',value:'7'},
							 ],
			ruleOptions:[
							 {name:'固定竞价',value:'1'},
							 {name:'增加%',value:'2'},
							 {name:'减少%',value:'3'},
							 ],
							 rule:'1',
		})
	}
	//保存预算rules
	function saveBudgetRule(){
		var startTime=state.from.date[0];
		var endTime=state.from.date[1];
		var profileid=state.nowRow.profileid;
		var type=state.nowRow.campaignType;
		var params={"budgetRulesDetails":[{
			"duration":{
				"dateRangeTypeRuleDuration":{
					"startDate":"20240107",
					"startDate":"20240110"
				}
			},
			"ruleType":"SCHEDULE",
			"recurrence":{
				"type":"DAILY"
			},
			"budgetIncreaseBy":{
			   "type":"PERCENT",
			   "value": 10
			},
			"name":"test Rules222",
			"performanceMeasureCondition": {
				"metricName": "ACOS",
				"comparisonOperator": "GREATER_THAN",
				"threshold": 0.1
			}
		}]};
		// advBudgetRuleApi.amzCreateBudgetRules(profileid,type,params).then((res)=>{
			
		// });
	}
	
</script>

<style>
	.flex1{
		flex:1;
	}
	.widthfill{
		width:100%;
	}
	.clear-lineheight{
		line-height:inherit;
	}
</style>