	<template>
		<el-dialog v-model="remarksVisable" title="产品公告" destroy-on-close='true' width="800px"  >
				<el-row :gutter="32">
					<el-col :span="12" class="border-right">
						<el-input v-model="remarks" placeholder="输入公告" :rows="8"  type="textarea"  />
						<el-button class="m-t-8" type="primary" >提交</el-button>
					</el-col>
					<el-col :span="12">
						<el-scrollbar class="remark-history">
						<h4>公告日志</h4>
						 <el-timeline>
						    <el-timeline-item
						      v-for="(activity, index) in activities"
						      :key="index"
						      :timestamp="activity.timestamp"
							  :hollow="true"
							   type='success'
						    >
						      {{ activity.content }}
						    </el-timeline-item>
						  </el-timeline>
						  </el-scrollbar>
					</el-col>
				</el-row>
		  <template #footer>
		  	<span class="dialog-footer">
		  		<el-button @click="remarksVisable = false"> 关闭</el-button>
		  	</span>
		  </template>
		</el-dialog>
	</template>
	
	<script>
		import {ref,reactive,onMounted} from "vue"
		export default{
			setup(){
				let remarksVisable =ref(false)
				let activities = [
				  {
				    content: '万圣（22年：美国3000，英国700，欧洲200',
				    timestamp: '2018-04-15 | 操作人：张三',
				  },
				  {
				    content: '23年：US，UK，EU300美国平时月均80',
				    timestamp: '2018-04-13 | 操作人：张三',
				  },
				  {
				    content: '英国已建立跟卖',
				    timestamp: '2018-04-11 | 操作人：张三',
				  },
				]
				return{
					remarksVisable,activities,
				}
			}	
		}
	</script>
	
	<style>
		.border-right{
			border-right:1px solid #e4e7ed;
		}
		.remark-history h4{
			margin-bottom:16px;
		}
		.el-timeline-item__node--normal{
			width: 10px;
			height:10px;
			left: 0px;
		}
		.el-timeline-item__timestamp{
			color: #bcbec3;
		}
	</style>
	
