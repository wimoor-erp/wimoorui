<template>
	<h3 id="specs" class="tab-scroll">规格信息</h3>
	<el-form-item label="净品规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input v-model="length" placeholder="长"></el-input>
			<el-input v-model="length" placeholder="宽"></el-input>
			<el-input v-model="length" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label="带包装规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input v-model="length" placeholder="长"></el-input>
			<el-input v-model="length" placeholder="宽"></el-input>
			<el-input v-model="length" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label="单箱规格">
		<el-space :size="56">
		<div class="el-input-group-thir">
			<el-input v-model="length" placeholder="长"></el-input>
			<el-input v-model="length" placeholder="宽"></el-input>
			<el-input v-model="length" placeholder="高">
				<template #append>cm</template>
			</el-input>
		</div>
		<el-input v-model="weight" placeholder="重">
			<template #append >kg</template>
		</el-input>
		</el-space>
	</el-form-item>
	<el-form-item label=" 单箱数量" >
		<el-input class="in-wi-24" v-model="form.name" placeholder="单箱数量"> </el-input>
	</el-form-item>
</template>

<script>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	export default{
		components: {
			Plus,Edit,
		},
		setup(){
			let form = {
				name:'',
				brand:'',
				type:"",
				person:'',
			}
			return{
				form,
			}
		}
		}
</script>

<style>
</style>
