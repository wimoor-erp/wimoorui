<template>
<div style="display:flex;align-items: center;">
 <div class="message">
     <remind theme="outline" size="16" fill="#333"/>
    
 </div>
 <div class="phone">
       <headset-one theme="outline" size="16" fill="#333"/>
</div>
<div class="avatar">
	   <el-dropdown>
	      <span class="el-dropdown-link">
	        <el-avatar  :src="image" ></el-avatar>
	        <el-icon class="el-icon--right">
	          <arrow-down />
	        </el-icon>
	      </span>
	      <template #dropdown>
	        <el-dropdown-menu>
			  <el-dropdown-item>个人中心</el-dropdown-item>
	          <el-dropdown-item>退出</el-dropdown-item>
	          <el-dropdown-item>注销</el-dropdown-item>
	        </el-dropdown-menu>
	      </template>
	    </el-dropdown>
    </div>
</div>
</template>
<script>
import {Remind,HeadsetOne} from '@icon-park/vue-next';
import {getInfo} from '@/api/sys/admin/userApi';

export default {
        name: "HeaderAvatar",
        components:{
            Remind,
            HeadsetOne
        } ,
		data() {
		  return {
		     image:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
		  }
		}, 
	   created() {
			this.getData();
			},
		methods: {
			getData() {
			    getInfo().then(response => {
					if(response&&response.data&&response.data.image){
						let url=response.data.image;
						url=url.replace("photo/","https://photo.wimoor.com/");
						this.image =url;
					}
			  })
			}
	    },
	}
</script>
<style >
.phone,.message{line-height:56px;}
.phone,.message .i-icon{display:block;padding:0px 12px;}
.phone>.i-icon>svg,.message>.i-icon>svg{
vertical-align: middle;
}
.avatar{padding:0px 24px;}
</style>