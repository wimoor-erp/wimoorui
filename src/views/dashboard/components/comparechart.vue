<template>
  <div>
    <el-space style="margin-bottom:8px;">
      <span class="pag-title">销量对比</span>
      <span class="pag-small-Extra">2022-02-11 ~ 2022-02-17</span>
    </el-space>
    <div class="pag-radius-bor">
      <div id="comparechart" style="height:146px;width:100%"></div>
	  <div class=""></div>
    </div>
 </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "Comparechart",
  components: {},
  setup() {
    //返回数据
    return {};
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("comparechart"));
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {
        itemGap: 16,
        icon: "circle",
        itemWidth: 6,
        itemHeight: 6
      },
      grid: {
		  bottom:8,
		  top:8,
        left: 0,
        right: 8,
        containLabel: true
      },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#acb0b9"
		},
		splitLine:{
					lineStyle:{
					color:"#F2F3F6"
					}
				}
      },
      yAxis: {
        type: "category",
        data: ["上周同期", "前日", "昨日"],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      color: "#FF6700",
      series: [
        {
		  barWidth:8,
          type: "bar",
		  data: [9689, 8978, 10240],
		  itemStyle:{
			  borderRadius:4,
		  }
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