<template>
  <el-col :span="6">
    <el-space style="margin-bottom:8px;">
      <span class="pag-title">公告</span>
      <span class="pag-small-Extra"> </span>
    </el-space>
    <div class="pag-radius-bor " style='height:392px;'>
		<div class='mes-list' v-for='(m,index) in messageData' :key="index">
           <el-tag :type='m.state' size="small" class='mes-tag'>{{m.tag}}</el-tag>
		   <div class='mes-text'>{{m.text}}</div>
		   <div class='mes-time'>{{m.time}}</div>
		</div>
    </div>
  </el-col>
</template>
<script>
import { ref } from 'vue'
import {CaretBottom,} from '@element-plus/icons-vue'
export default {
  name: "Notice",
  components: {CaretBottom},
  setup() {
    let messageData = [
	  { tag: "公告", text: "关于春节期间系统客服的调整", time: "2020-03-02",state:'',},
	  { tag: "通知", text: "关于发货货件：现可正常提交箱子信息", time: "2020-03-02",state:'success',},
	  { tag: "消息", text: "你提交的采购订单D4A48WA已通过审核", time: "2020-03-02",state:'warning',},
	  { tag: "消息", text: "你的账号还有30天到期，请联系管理员！", time: "2020-03-02",state:'warning',},
	  { tag: "公告", text: "2021年07月05日 ERP V1.6.0 上线！", time: "2020-03-02",state:'',},
	  { tag: "公告", text: "2021年07月05日 ERP V2.6.0 上线！", time: "2020-03-02",state:'',},
    ];
    //返回数据
    return {
      messageData
    };
  }
};
</script>
<style>
.mes-list{
  display: flex;
  margin: 16px 0;
  align-items: center;
  font-size:14px;
  color:var(--el-text-color-regular)
}
.mes-list .mes-tag{
	margin-right:8px;
}
.mes-list .mes-text{
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	margin-right:24px;
	}
.mes-list .mes-time{
	color:var(--el-text-color-secondary);
	margin-left:auto;
	white-space: nowrap;
}	
</style>
