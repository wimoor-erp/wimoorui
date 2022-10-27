<template>
	<h3 id="base" class="tab-scroll">基础信息</h3>
	<el-form-item label="产品图片">
		<el-upload action="#" list-type="picture-card" :auto-upload="false">
			<el-icon>
				<Plus />
			</el-icon>
			<template #file="{ file }">
				<div>
					<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
					<span class="el-upload-list__item-actions">
						<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
							<el-icon>
								<zoom-in />
							</el-icon>
						</span>
						<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
							<el-icon>
								<Delete />
							</el-icon>
						</span>
					</span>
				</div>
			</template>
		</el-upload>
	</el-form-item>
	<el-form-item label="产品名称" required>
		<el-input v-model="form.name" placeholder="产品名称"> </el-input>
	</el-form-item>
	<el-form-item label="SKU" required>
		<el-input class="in-wi-24" v-model="form.name" placeholder="建议用字母加数字，禁止用“空格、*、×、#”这类特殊符号"> </el-input>
	</el-form-item>
	<el-form-item label="品牌" class="grid-row">
		<el-select class="in-wi-24" v-model="form.brand" placeholder="选择品牌">
			<el-option label="Zone one" value="shanghai" />
			<el-option label="Zone two" value="beijing" />
		</el-select>
		<el-button type="primary"  link @click="jumpBrand">
			<el-icon class="ic-cen font-small">
				<Edit />
			</el-icon>
			编辑</el-button>
	</el-form-item>
	<el-form-item label="品类" class="grid-row">
		<el-select class="in-wi-24" v-model="form.type" placeholder="选择品类">
			<el-option label="Zone one" value="shanghai" />
			<el-option label="Zone two" value="beijing" />
		</el-select>
		<el-button type="primary"  link  @click="jumpCategory">
			<el-icon class="ic-cen font-small">
				<Edit />
			</el-icon>
			编辑</el-button>
	</el-form-item>
	<el-form-item label="产品标签" class="grid-row">
		<el-cascader class="in-wi-24" :options="options" :popper-append-to-body="false" :props="props" clearable />
		<el-button type="primary"  link  @click="jumptags">
			<el-icon class="ic-cen font-small">
				<Edit />
			</el-icon>
			编辑</el-button>
	</el-form-item>
	<el-form-item label="负责人">
		<el-select class="in-wi-24" v-model="form.person" placeholder="选择品类">
			<el-option label="Zone one" value="shanghai" />
			<el-option label="Zone two" value="beijing" />
		</el-select>
	</el-form-item>
	<el-form-item label="生效日期">
		<el-date-picker v-model="value1" type="date" placeholder="选择日期" :size="size" />
	</el-form-item>
	<el-form-item label="备注">
		<el-input v-model="textarea" maxlength="300" placeholder="产品备注" show-word-limit type="textarea" />
	</el-form-item>
</template>

<script>
	import {ArrowDown,Edit} from '@element-plus/icons-vue'
	import {Plus,} from '@icon-park/vue-next';
	import { ref,reactive,onMounted,watch } from 'vue'
	import {useRouter } from 'vue-router'
	export default{
		components: {
			Plus,Edit,
		},
		setup(){
			let router = useRouter();
			let form = {
				name:'',
				brand:'',
				type:"",
				person:'',
			}
			//跳转到品牌管理
			function jumpBrand(){
				router.push({
					path:"/erp/baseinfo/brand",
					query:{
						title:'品牌管理',
						path:'/erp/baseinfo/brand',
					}
				})
			}
			function jumpCategory(){
				router.push({
				path:"/erp/baseinfo/category",
				query:{
					title:'品类管理',
					path:'/erp/baseinfo/category',
				},
				})
			}
			
			function jumptags(){
				router.push({
				path:"/erp/baseinfo/tags",
				query:{
					title:'产品标签',
					path:'/erp/baseinfo/tags',
				},
				})
			}
			return{
				jumpBrand,
				jumpCategory,
				jumptags,
				form,
			}
		}
		}
</script>

<style>
</style>
