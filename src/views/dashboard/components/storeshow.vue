<template>
  <el-col :span="6">
    <el-space style="margin-bottom:8px;">
      <span class="pag-title">店铺绩效</span>
      <span class="pag-small-Extra">更新时间2022-02-20</span>
    </el-space>
    <div class="pag-radius-bor">
        <div class="st-list" :class='s.state' v-for="s in storeData" :key="s.id">
          <div class="st-label">
            <div class="title">{{s.label}}</div>
            <div class="pag-small-Extra">目标:{{s.subdata}}</div>
          </div>
          <div class="pag-data-num">{{s.data}}</div>
        </div>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "storeshow",
  components: {},
  setup() {
    let storeData = [
      { label: "订单缺陷率", data: "0.2%", subdata: "低于1%" },
      { label: "退货不满意度", data: "0.3%", subdata: "低于10%" },
      { label: "商品政策合规性", data: "1", subdata: "0" ,state:'danger'},
      { label: "有效跟踪率", data: "0.1%", subdata: "高于95%" },
	  { label: "迟发率", data: "0", subdata: "低于4%" },
	  { label: "订单取消率", data: "0.5%", subdata: "低于1%" }
    ];
    //返回数据
    return {
		storeData
	};
  }
};
</script>
<style>

.st-list{display:flex;padding:7px 16px;border: 1px solid var(--el-border-color-base);margin:8px 0;
           border-radius: var(--el-border-radius-base); 
		   align-items: center;
}
.danger{background-color:#fef0f0;border-color:#ffbfbf}
.st-list .st-label .title{font-size:14px;color:var(--el-text-color-primary)}
.st-list .pag-data-num{ margin-left:auto;margin-bottom:0}
</style>
