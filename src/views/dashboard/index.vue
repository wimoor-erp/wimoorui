<template>
<div class='main-sty' style='background-color:var(--el-color-info-lighter)'>
  <el-row style='margin-bottom:16px'>
    <el-space>
      <el-select v-model="store" placeholder="全部店铺">
        <el-option
          v-for="item in storeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
       <div class="block">
        <el-date-picker
        v-model="timeval"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        >
        </el-date-picker>
		&nbsp;&nbsp;&nbsp;&nbsp;当前页面正在开发中。。。
    </div>
    </el-space>
	 <div class='rt-btn-group'>
    <el-button   class='ic-btn' title='帮助文档'>
     <help theme="outline" size="16" :strokeWidth="3"/>
   </el-button>
   </div>
  </el-row>
<!-- 头部数据 -->
 <el-row style='margin-bottom:8px'> 
		 <el-space>
		 <span class='pag-title'>即时销售报告</span>
		 <span class='pag-small-Extra'>更新时间：2022-02-24 19:40:39</span>
		 </el-space>
 </el-row>
<el-row :gutter="16" style='margin-bottom:16px;'>
  <el-col :span="6" v-for='(s,index) in saleData' :key="index">
	  <div class="pag-radius-bor" >
          <div class='data-group'>
		  <div>
		  <div style='font-size:12px;color:#666'>{{s.label}}</div>
		  <div class='pag-data-num'>{{s.data}}</div>
		   </div>
		   <div class='arrow'>
			   <up-small v-show='s.data > s.lastdata' theme="outline" size="20" fill="var(--el-color-success)" :strokeWidth="3"/>
			   <down-small v-show='s.data < s.lastdata' theme="outline" size="20" fill="var(--el-color-danger)" :strokeWidth="3"/>
		   </div>
          </div>
		  <div class='pag-small-Extra'><span>昨日 </span><span> {{s.lastdata}}</span></div>
	  </div>
  </el-col>
</el-row>

<el-row :gutter="16" style='margin-bottom:16px;'>
	<!-- 销售趋势 -->
	  <Salechart/>
	  <!-- 市场销量 -->
	   <Piechart/>
	 <el-col :span="6">
	  <!-- 销量对比 -->
      <Comparechart/>
	  <!-- 节日销售分布 -->
       <Stockchart/>
	 </el-col>
 </el-row>
 <el-row :gutter="16" style='margin-bottom:16px;'>
	   <!-- 广告表现 -->
	    <Adchart/>
	   <!--店铺绩效-->
	   <Storeshow/>
	   <!--销售业绩排名-->
	   <Personrank/>
 </el-row>
  <el-row :gutter="16">
	  <!--商品销售排名 -->
     <Goodsrank/>
	  <!--公告 -->
	  <Notice/>
	   <!--开发服务-->
	   <Service/>
  </el-row>
 </div>
 </template>

<script>
import Service from "./components/service";
import Notice from "./components/notice";
import Goodsrank from "./components/goodsrank";
import Personrank from "./components/personrank";
import Storeshow from "./components/storeshow";
import Adchart from "./components/adchart";
import Stockchart from "./components/stockchart";
import Comparechart from "./components/comparechart";
import Piechart from "./components/piechart";
import Salechart from "./components/salechart";
import {Help,UpSmall,DownSmall} from '@icon-park/vue-next';
import {} from '@element-plus/icons-vue'
import { ref,reactive} from 'vue'
export default{
	 name: 'Dashboard',
	 components: {Help,UpSmall,DownSmall,Salechart,Piechart,Comparechart,Stockchart,Adchart,Storeshow,
	 Personrank,Goodsrank,Notice,Service
	 },
     setup(){
	  //数据
	  let timeval=ref('')
	  let store = ref('')
	  let storeData=[{label:'NUJDA',value:'NUJDA'},{label:'达乌代',value:'dawudai'},{label:'dianpu',value:'dianpu'}]
	  let saleData=[{
		  label:'销售金额($)',
		  data:'5,156,98.00',
		  lastdata:'9,654,83.65'
	  },
	  {
		  label:'销量',
		  data:'8564',
		  lastdata:'8422' 
	  },
	  {
		  label:'订单量',
		  data:'8948',
		  lastdata:'7968' 
	  },
	  {
		  label:'退货量',
		  data:'5',
		  lastdata:'6' 
	  },
	  ]
	  //返回数据
	  return {
		  saleData,
		  store,
		  storeData,
	  }
  },
 


}
</script>

 <style>
.echart-box{height:320px;width:100%}
.arrow{margin-left:auto;}
.data-group{display:flex}
.pag-data-num{font-size:16px;font-weight:600;font-family: "Helvetica Neue";margin-bottom:16px;}
.pag-radius-bor{
	 background-color:#fff;
	 box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
	 border-radius: var(--el-border-radius-base); 
	 width:100%;
     padding:16px 24px;
 }
</style>