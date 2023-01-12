<template>
	<h3 id="specs" class="tab-scroll">规格信息</h3>
	<el-form-item label="带包装规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input  v-model="dataForms.pkgdim.length" placeholder="长"></el-input>
			<el-input v-model="dataForms.pkgdim.width" placeholder="宽"></el-input>
			<el-input v-model="dataForms.pkgdim.height" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="dataForms.pkgdim.weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label="净品规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input v-model="dataForms.itemdim.length" placeholder="长"></el-input>
			<el-input v-model="dataForms.itemdim.width" placeholder="宽"></el-input>
			<el-input v-model="dataForms.itemdim.height" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="dataForms.itemdim.weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label="单箱规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input v-model="dataForms.boxdim.length" placeholder="长"></el-input>
			<el-input v-model="dataForms.boxdim.width" placeholder="宽"></el-input>
			<el-input v-model="dataForms.boxdim.height" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="dataForms.boxdim.weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label=" 单箱数量" >
		<el-input class="in-wi-24" v-model="dataForms.boxnum" placeholder="单箱数量"> </el-input>
	</el-form-item>
</template>

<script setup>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch,toRefs } from 'vue'
	let props = defineProps({
	  dataForms:Object
	})
	let {dataForms} =toRefs(props); 
		 
		 
	onMounted(()=>{
		 
	})
		 
</script>

<style>
</style>
