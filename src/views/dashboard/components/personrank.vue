<template>
  <el-col :span="6">
    <el-space style="margin-bottom:8px;">
      <span class="pag-title">销售业绩排名</span>
      <span class="pag-small-Extra">2022-02-11 ~ 2022-02-17 </span>
    </el-space>
    <div class="pag-radius-bor " style='height:394px;'>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column type="index" label="排名"  width="45" />
        <el-table-column prop="person" label="负责人"  width="75"  show-overflow-tooltip/>
        <el-table-column prop="sale" label="销量"  width="65" />
		<el-table-column prop="amount" label="销售额" width='120'/>
		<el-table-column prop="increase" label="环比涨幅" >
			 <template #default="scope" >
				  <span class='name'>{{scope.row.increase}}</span>
                  <el-icon style='margin-left:4px;color:var(--el-color-danger)'><caret-bottom /></el-icon>
			</template>
		</el-table-column>
      </el-table>
    </div>
  </el-col>
</template>
<script>
import { ref } from 'vue'
import {CaretBottom,} from '@element-plus/icons-vue'
export default {
  name: "Personrank",
  components: {CaretBottom},
  setup() {
    let tableData = [
      { person: "张三", sale: "624356", amount: "￥68,152.26" , increase: "0.23%" },
      { person: "李四", sale: "5987", amount: "￥68,152.26" , increase: "0.23%" },
      { person: "王五", sale: "4987", amount: "￥68,152.26", increase:  "0.23%" },
      { person: "赵六六六", sale: "3998", amount: "￥68,152.26" , increase: "0.23%" },
      { person: "刘七", sale: "2996", amount: "￥68,152.26" , increase: "0.23%" },
	  { person: "陈八", sale: "1997", amount: "￥68,152.26" , increase: "0.23%" },
	  { person: "孙九", sale: "997", amount: "￥68,152.26" , increase: "0.23%" },
	  { person: "钱十", sale: "997", amount: "￥68,152.26" , increase: "0.23%" },
    ];
    //返回数据
    return {
      tableData
    };
  }
};
</script>
<style>
.st-list {
  display: flex;
  padding: 7px 16px;
  border: 1px solid var(--el-border-color-base);
  margin: 8px 0;
  border-radius: var(--el-border-radius-base);
  align-items: center;
}
.danger {
  background-color: #fef0f0;
  border-color: #ffbfbf;
}
.st-list .st-label .title {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
.st-list .pag-data-num {
  margin-left: auto;
  margin-bottom: 0;
}
</style>
