<template>
  <el-col :span="6">
    <el-space style="margin-bottom:8px;">
      <span class="pag-title">市场销量</span>
      <span class="pag-small-Extra">2022-02-11 ~ 2022-02-17</span>
    </el-space>
    <div class="pag-radius-bor">
      <div id="piechart" style="height:360px;width:100%"></div>
    </div>
  </el-col>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "Piechart",
  components: {},
  setup() {
    //返回数据
    return {};
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("piechart"));
    var option = {
      tooltip: {
        trigger: "item"
      },
      title:{
        text:'14655',
        left:'center',
        top:'35%',
        subtext:'总销量',
        textStyle:{
            fontSize:16,
            fontFamily:"Helvetica Neue",
            color:'#303133'
        },
        subtextStyle:{
             fontSize:12,
        },
      },
      legend: {
        itemGap:16,
        bottom:8,
        icon: "circle",
        itemWidth: 6,
        itemHeight: 6
      },
      color:['#FF6700','#ff9249','#ffa76c','#ffc59e','#409eff','#66b1ff','#8cc5ff','#b3d8ff',"#67c23a","#8dd968","#ade393","#d2f7c1"],
      series: [
        {
          type: "pie",
          center: ['50%', '40%'],
          radius: ["30%", "55%"],
          label: {
            show: true,
            position: "outside",
            color:'#666',
            formatter: '{d}%'
          },
          labelLine:{
            minTurnAngle:120,
 
          },
          data: [
            { value: 1048, name: "美国" },
            { value: 735, name: "德国" },
            { value: 580, name: "法国" },
            { value: 484, name: "英国" },
            { value: 300, name: "意大利" },
            { value: 280, name: "日本" },
			{ value: 189, name: "印度" },
			{ value: 89, name: "澳洲" }
          ]
        }
      ]
    };

    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }
};
</script>
<style>
</style>
