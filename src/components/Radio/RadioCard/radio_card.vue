<template>
		<el-card v-if="groupValue.isspace" shadow="hover" :class="groupValue.modelValue==value?'radio-card-select':''" @click="change" >
			   <slot></slot>
		</el-card>
	  <el-col v-else  :span="4" style="padding-right:20px"> 
		<el-card shadow="hover" :class="groupValue.modelValue==value?'radio-card-select':''" @click="change" >
			   <slot></slot>
		</el-card>
		<slot name="colfooter"></slot>
	   </el-col>
</template>

<script setup>
 import {toRefs,inject} from "vue";
 let props = defineProps({value:"",isspace:""});
 const {value,isspace} = toRefs(props);
 const groupValue=inject("groupValue");
 const changeEvent=inject("changeEvent");
 const change=()=>{
	   changeEvent(props.value);
 }
</script>
 <style>
	 .radio-card-select {
	     position: relative;
		 border:1px solid var(--el-color-primary);
		 color:var(--el-color-primary);
	     background: var(--el-button-hover-bg-color) !important;
	     &:after {
	       content: "";
	       position: absolute;
	       top: 0;
	       right:0;
	       border-top: 16px solid var(--el-color-primary);
	       border-left: 16px solid var(--el-color-primary);
		   border-bottom-left-radius:4px;
	     }
	     &:before {
	       content: "";
	       position: absolute;
	       width: 8px;
	       height: 4px;
	       background: transparent;
	       top: 4px;
	       right: 3px;
	       border: 1.5px solid white;
	       border-top: none;
	       border-right: none;
	       -webkit-transform: rotate(-50deg);
	       -ms-transform: rotate(-50deg);
	       transform: rotate(-50deg);
	       z-index: 9;
	     }
	   }
	 
 </style>