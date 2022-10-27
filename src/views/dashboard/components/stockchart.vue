<template>
  <div>
    <el-space style="margin-bottom:8px;margin-top:16px;">
      <span class="pag-title">库存状况</span>
    </el-space>
    <div class="pag-radius-bor st">
      <el-space :size="16" spacer="|">
      <div>
          <div class='data-group'>
             <div>
             <div style='font-size:12px;color:#666'>本地库存趋势</div>
             <div class='pag-data-num' >0<up-small  theme="outline" size="20" fill="var(--el-color-success)" :strokeWidth="3"/></div>
             </div>
              
          </div>
        <div id="localchart" style='height:80px;width:100%'></div>
      </div>

      <div>
          <div class='data-group'>
             <div>
             <div style='font-size:12px;color:#666'>FBA库存趋势</div>
             <div class='pag-data-num' >0
                <down-small  theme="outline" size="20" fill="var(--el-color-danger)" :strokeWidth="3"/>
             </div>
             </div>
          </div>
        <div  id="fabchart" style='height:80px;width:100%'></div>
      </div>
    </el-space>
    </div>
 </div>
</template>
<script>
import * as echarts from "echarts";
import {Help,UpSmall,DownSmall} from '@icon-park/vue-next';
export default {
  name: "Stockchart",
  components: {UpSmall,DownSmall},
  setup() {
    //返回数据
    return {};
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("localchart"));
    var myChart2 = echarts.init(document.getElementById("fabchart"));
    var option = {
      tooltip:{
        trigger : 'axis',
      },
    xAxis: {
      boundaryGap:false,
    show: false ,
    type: 'category',
    data: ['2021.01', '2021.02', '2021.03', '2021.04', '2021.05', '2021.06', '2021.07','2021.08','2021.09','2021.10','2021.11','2021.12']
  },
  yAxis: {
    show: false ,
    type: 'value'
  },
  grid:{
    left:0,
    bottom:0,
    top:16,
    right:8,
  },
  color:'#FF6700',
  series: [
    {
      
symbol: 'none' ,
      data: [0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
      type: 'line',
      smooth: true
    }
  ]
};
 var option2 = {
      tooltip:{
        trigger : 'axis',
      },
    xAxis: {
      boundaryGap:false,
    show: false ,
    type: 'category',
    data: ['2021.01', '2021.02', '2021.03', '2021.04', '2021.05', '2021.06', '2021.07','2021.08','2021.09','2021.10','2021.11','2021.12']
  },
  yAxis: {
    show: false ,
    type: 'value'
  },
  grid:{
    left:0,
    bottom:0,
    top:16,
    right:0,
  },
  color:'#409eff',
  series: [
    {
      
symbol: 'none' ,
      data: [0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
      type: 'line',
      smooth: true
    }
  ]
};

    myChart.setOption(option);
     myChart2.setOption(option2);
    window.addEventListener("resize", () => {
      myChart.resize();
      myChart2.resize();
    });
  }
};
</script>
<style>
.st > .el-space > span {color:var(--el-border-color-base)}
.st .el-space{display:flex}
.st .el-space__item{width:100%}
.st .i-icon {margin-left:4px;;vertical-align: middle;}
</style>