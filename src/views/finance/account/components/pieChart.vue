<template>
	<div class="pag-radius-bor">
		<div class="flex-center-between">
			<h4>收支项</h4>
			<el-popover
			    :visible="visible"
			    placement="bottom"
			    :width="200"
				trigger="click"
			    content="123"
			  >
			    <template #reference>
			      <el-button size="small" @click="visible = !visible"
			        >2023年</el-button
			      >
			    </template>
			  </el-popover>
		</div>
		<el-row>
			<el-col :span="24">
				<el-col :span="24" class="m-t-16 text-center">
				<p class="font-bold font-large">694,980.39</p>
				<p class="font-extraSmall">总金额（元）</p>
				</el-col>
		<div class="m-t-16" >
			<div id="piechart" style="height:320px;width:100%"></div>
		</div>
		</el-col>
		</el-row>
	</div>
</template>

<script setup>
	import * as echarts from "echarts";
	import { ref,reactive,onMounted,watch,toRefs} from 'vue'
	const state = reactive({
		datas:[
		       { value: 40316.37, name: '货物费用' },
		       { value: 48347.44, name: '采购预付款' },
		       { value: 50001.35, name: '运费' },
		       { value: 42824, name: '其他款项' },
		       { value: 44824, name: '样品采购' },
		     ],
		visible:false,	 
	})
	const {
		datas,
		visible,
	}= toRefs(state)
	
	function getvalue (name){
		var val = ''
		state.datas.forEach((item)=>{
			if(item.name==name){
				val = item.value
			}
		})
		return val
	}
	function generalChart(datas) {
	  var myChart = echarts.init(document.getElementById("piechart"));
	  var option = {
	    tooltip: {
	      trigger: "item"
	    },
	    legend: {
	      itemGap:16,
	      bottom:8,
	      icon: "circle",
	      itemWidth: 6,
	      itemHeight: 6,
	      formatter: function (name) {
	          return '{a|'+name+'}'+' '+getvalue (name) ;
	      },
		  textStyle: {
			rich:{
        a: {
            color: '#999',
        },
    }
		 },
		 
	    },
	    color:['#ff6d18','#ff9249','#ffa76c','#ffc59e','#409eff','#66b1ff','#8cc5ff','#b3d8ff',"#67c23a","#8dd968","#ade393","#d2f7c1"],
	    series: [
	      {
	        type: "pie",
			center:['50%','38%'],
	        radius: ["35%", "70%"],
	        label: {
	          show: false,
	          position: "outside",
	          color:'#666',
	          formatter: '{d}%'
	        },
	        labelLine:{
	          minTurnAngle:120,
	        },
	        data: datas,
	      }
	    ]
	  };
	
	  myChart.setOption(option);
	  window.addEventListener("resize", () => {
	    myChart.resize();
	  });
	}
	onMounted(()=>{
		generalChart(state.datas)
	})
</script>

<style>
	.m-t-16{
		margin-top: 16px;
	}
</style>
