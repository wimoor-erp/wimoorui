<template>
	<div class="el-con-16 con-header">
	<el-row :gutter="16" >
		 <el-col :span="12">
			   <div class='pag-radius-bor '>
				    <h4 >运行中活动</h4>
				  <div class="data-center m-t-extra">
					  <div class="ad-data-item">
						  <h5>2745</h5>
						  <p class="name">广告活动数</p>
					  </div>
					  <div class="ad-data-item">
						  <h5>46781</h5>
						  <p class="name">广组数</p>
					  </div>
					  <div class="ad-data-item">
						  <h5>6771</h5>
						  <p class="name">商品广告数</p>
					  </div>
					  <div class="ad-data-item">
						  <h5>6496</h5>
						  <p class="name">关键词数</p>
					  </div>
				  </div>
			   </div>
		 </el-col>
		 <el-col :span="12">
			   <div class='pag-radius-bor '>
				   <div class="flex-center-between">
				    <h4 >异常数据预警</h4>
					<el-space>
					  <el-radio-group v-model="wardatatype" size="small">
					       <el-radio-button label="商品广告" />
					       <el-radio-button label="关键词" />
					    </el-radio-group>
						<el-select size="small" v-model="waringType" style="width:120px;">
							<el-option
							 v-for="item in dataWaring"
							 :label="item.name" :value="item.value"></el-option>
						</el-select>
						<el-button @click="warningVisible=true" size="small">
						<el-icon><Tools /></el-icon>
						</el-button>
					</el-space>
					</div>
				  <div class="data-center el-text-primary">
					  <div class="ad-data-item pointer">
						  <h5 >99</h5>
						  <p class="name">曝光量突降</p>
					  </div>
					  <div class="ad-data-item pointer">
						  <h5>685</h5>
						  <p class="name">点击量突降</p>
					  </div>
					  <div class="ad-data-item pointer">
						  <h5>495</h5>
						  <p class="name">转化率突降</p>
					  </div>
					  <div class="ad-data-item pointer">
						  <h5>110</h5>
						  <p class="name">ACOS突增</p>
					  </div>
				  </div>
			   </div>
		 </el-col>
	</el-row>
	<el-row :gutter="16" >
		<el-col :span="12">
			<AdFunnel/>
		</el-col>
		<el-col :span="12">
			<AcosRank/>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="24">
			<AdStatistics/>
		</el-col>
	</el-row>
	</div>
	<el-dialog
	    v-model="warningVisible"
	    title="指标设置"
	    width="600px"
	  >
	  <span class="font-extraSmall">下降比率范围在5% ~ 100%之间,默认20%,下降值必须大于0,默认为0,超出下方设定的值即会预警。</span>
	  <el-table :data="tableData"
	  class="m-t-8"
	  >
		  <el-table-column label="预警字段" prop="name">
		  </el-table-column>
		  <el-table-column label="下降比率超">
			  <template #default="scope">
				  <el-input v-model="scope.row.rate">
					 <template #append>%</template>
				  </el-input>
			  </template>
		  </el-table-column>
		  <el-table-column label="且下降值超">
			  <template #default="scope">
					  <el-input v-model="scope.row.rate">
						  <template #append>%</template>
					  </el-input>
			  </template>
		  </el-table-column>
	  </el-table>
	    <template #footer>
	        <el-button @click="warningVisible = false">取消</el-button>
	        <el-button type="primary" @click="warningVisible = false">
	          保存
	        </el-button>
	    </template>
	  </el-dialog>
</template>

<script setup>
	import{Tools}from '@element-plus/icons-vue'
	import{ref,reactive,toRefs}from'vue'
	import AdFunnel from "./components/adFunnel.vue"
	import AcosRank from "./components/acosRank.vue"
	import AdStatistics from "./components/adStatistics.vue"
	const state = reactive({
		wardatatype:'商品广告',
		dataWaring:[
			{name:'昨日变动',value:'1'},
			{name:'连续变动',value:'2'},
			{name:'同期变动',value:'3'},
		],
		waringType:'1',
		warningVisible:false,
		formWarning:{},
		tableData:[
			{rate:'',name:'曝光量'},
			{rate:'',name:'点击量'},
			{rate:'',name:'转化率'},
			{rate:'',name:'ACOS'},
			],
	})
	const{	
		wardatatype,
		waringType,
		dataWaring,
		warningVisible,
		formWarning,
		tableData,
	}=toRefs(state)
</script>

<style scoped>
	.el-text-primary{
		color:#ff6700;
	}
	.data-center{
		display:flex;
		align-items: center;
		justify-content:center;
	}
	.m-t-extra{
		margin-top:4px;
	}
	.ad-data-item {
		flex-grow:1;
		margin-top:24px;
		margin-bottom:16px;
	}
	.ad-data-item h5{
		font-size:20px;
		font-weight:700;
		font-family: DIN Alternate,Helvetica Neue,Helvetica,Arial,SF Pro Display;
		margin-bottom:8px;
	}
	.ad-data-item .name{
		font-size:14px;
		color:#999;
	}
	.el-con-16{
		padding:16px;
		padding-bottom:0px;
	}
</style>