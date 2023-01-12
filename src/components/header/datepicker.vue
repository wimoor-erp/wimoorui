<template>
	<el-date-picker
	        v-model="dateValue"
			@change = "dateChange"
	        type="daterange"
			:clearable="false"
	        range-separator="至"
	        start-placeholder="开始日期"
	        end-placeholder="结束日期"
	        :shortcuts="shortcuts"
	      />
</template>

<script>
	import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import {MenuUnfold,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		name:"datepick",
		components:{MenuUnfold,Search,ArrowDown,SettingTwo,Help,Copy,MoreOne,},
		emits:["changedate"],
		 props:["days","shortIndex"],
		setup(props,context){
			let beforedays=0;
			if(props.days){
				 beforedays=props.days-1;
			}else{
				 beforedays=-1;
			}
			let shortcuts = [
			  {
			    text: '近7天',
			    value: () => {
			      const end = new Date()
			      const start = new Date()
				  end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1))
			      start.setTime(start.getTime() - 3600 * 1000 * 24 * (7+beforedays))
			      return [start, end]
			    },
			  },
			  {
			    text: '近1个月',
			    value: () => {
			      const end = new Date()
			      const start = new Date()
				  end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1))
			      start.setTime(start.getTime() - 3600 * 1000 * 24 *(30+beforedays))
			      return [start, end]
			    },
			  },
			  {
			    text: '近2个月',
			    value: () => {
			      const end = new Date()
			      const start = new Date()
				  end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1))
			      start.setTime(start.getTime() - 3600 * 1000 * 24 * (60+beforedays))
			      return [start, end]
			    },
			  },
			  {
			    text: '近3个月',
			    value: () => {
			      const end = new Date()
			      const start = new Date()
				  end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1))
			      start.setTime(start.getTime() - 3600 * 1000 * 24 * (90+beforedays))
			      return [start, end]
			    },
			  },
			]
			let datas={}
			let dateValue=ref()
			onMounted(()=>{
				if(props.shortIndex){
					 dateValue.value = shortcuts[props.shortIndex].value();
				}else{
				 dateValue.value = shortcuts[0].value();
				}
				 dateChange(dateValue.value)
			})
		 
			function dateChange(val){
				datas.start=val[0].format("yyyy-MM-dd");
				datas.end=val[1].format("yyyy-MM-dd")+" 23:59:59";
				context.emit("changedate",datas)
			}
	
			return{
				  dateChange,dateValue,shortcuts
			}
		}
	}
</script>

<style>
</style>
