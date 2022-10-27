<template>
	<div class="gird-line-head">
		<el-space class="font-small" :size="24">
			<span><span class="text-gray">发货店铺:  </span>Ruikeji</span>
			<span ><span class="text-gray">发货仓库:  </span>清湖仓</span>
		</el-space>
		<el-button   class='ic-btn' title='帮助文档'>
					 <help theme="outline" size="16" :strokeWidth="3"/>
		</el-button>
	</div>
	<div class="flex-warp">
	<div class="">
		<el-menu
		        default-active="EU"
				@select="handleSelect"
				@open="handleOpen"
				class="m-t-16"
		      >
		        <el-menu-item index="CA">
		         <local class="ic-cen" theme="filled" size="16" />
		          &nbsp;<span> FBA-CA-加拿大</span>
				  <P class="font-extraSmall"></P>
		        </el-menu-item>
		        <el-menu-item  index="UK" >
		          <local class="ic-cen"  theme="filled" size="16" />
		          &nbsp;<span> FBA-UK-英国</span>
				<P class="font-extraSmall"></P>
		        </el-menu-item>
		        <el-menu-item index="EU">
		         <local class="ic-cen"  theme="filled" size="16" />
		         &nbsp; <span> FBA-EU-欧洲</span>
				  <P class="font-extraSmall"></P>
		        </el-menu-item>
		      </el-menu>
	</div>
	<div class=" height-screen border-left">
		<div class="con-header ">
		<el-button type="primary">FBA发货</el-button>
		<el-button @click="marketSplit" v-if="eu">分配站点</el-button>
		</div>
		<el-row :gutter="16" class="m-t-16">
			<el-col :span="16">
				<el-card shadow="never">
					<el-space >
						<data-sheet class="ic-cen" theme="filled" size="20" fill="#FF6700"/>
						 <h5> 发货合计</h5>
					</el-space>
				<div class="con-body">
					<el-row >
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">SKU数量</span>
								<span class="data">4</span>
							</div>
						</el-col>	
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">发货数量</span>
								<span class="data">200</span>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">货值</span>
								<span class="data">￥2780.0</span>
							</div>
						</el-col>
					</el-row>
					<el-row class="m-t-16">
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">预估箱子体积</span>
								<span class="data">0.08m³</span>
							</div>
						</el-col>	
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">预估发货重量</span>
								<span class="data">15.5kg</span>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="flex-v-bet">
								<span class="title">预估材积重量</span>
								<span class="data">16.08kg</span>
							</div>
						</el-col>
					</el-row>
				</div>
				</el-card>
			</el-col>
		<el-col :span="8">
				<el-card shadow="never">
					<el-space >
					<bookmark-one class="ic-cen"  theme="filled" size="18" fill="#e6a23c"/>
				 <h5>历史发货</h5>
				 </el-space>
				 <div class="">
				 	<ul class="font-small ul-list">
				 		<li><span>2022-10-14 11:57:14.0</span><span>  已发货 520</span></li>
				 		<li><span>2022-10-14 11:57:14.0</span><span>  已发货 330</span></li>
				 		<li><span>2022-10-14 11:57:14.0</span><span>  已发货 470</span></li>
				 		<li><span>2022-10-14 11:57:14.0</span><span>  已发货 470</span></li>
				 	</ul>
				 </div>
				</el-card>
			</el-col>
		</el-row>
		<el-table v-if="eu" border class="m-t-16">
			<el-table-column label="国家"></el-table-column>
			<el-table-column label="SKU数量"></el-table-column>
			<el-table-column label="发货数量"></el-table-column>
			<el-table-column label="货值"></el-table-column>
			<el-table-column label="预估箱子体积"></el-table-column>
			<el-table-column label="预估发货重量"></el-table-column>
			<el-table-column label="预估材积重量"></el-table-column>
			<el-table-column label="操作"></el-table-column>
		</el-table>
		<p class="font-extraSmall m-t-16 m-b-8">去掉勾选的产品，可分批次或部分发货</p>
		<el-table :data="tableData"  border ref="tableRef">
			<el-table-column type="selection"></el-table-column>
			<el-table-column label="图片"  width="65">
				<template #default="scope">
					<el-image :src="scope.row.image"></el-image>
				</template>
			</el-table-column>
			<el-table-column label="名称/msku">
				<template #default="scope">
					<div class="name">4pcs橘色圆点串(盒装BXA065，高度不要超1.8cm，4个并排放)</div>
					<div class="sku">B6009MHJYB-JuS-MHCA</div>
				</template>
			</el-table-column>
			<el-table-column label="sku">B6009MHJYB-JuS-MHCA</el-table-column>
			<el-table-column label="库存" width="80">50</el-table-column>
			<el-table-column label="产品附加费" width="100">-</el-table-column>
			<el-table-column label="产品材质">-</el-table-column>
			<el-table-column label="实际发货总量" width="100">50</el-table-column>
		</el-table>
	</div>
	</div>
</template>

<script setup>
	import {} from '@element-plus/icons-vue';
	import {Local,Help,DataSheet,BookmarkOne} from '@icon-park/vue-next';
	import { ref ,nextTick ,reactive,onMounted} from 'vue'
	import { useRouter } from 'vue-router'
	let router = useRouter()
	let tableRef = ref()
	let eu = ref(false) 
	let tableData = reactive([
		{
			
		}
	])
	onMounted(()=>{
		tableRef.value.toggleAllSelection()
	
	})
	/* handleSelect页面刚渲染获取不到index */
	function handleOpen(index){
		handleSelect(index)
	}
	function handleSelect(index){
				  if(index=="EU"){
					 eu.value = true 
				  }else{
					  eu.value = false  
				  }
	}
	function marketSplit(){
		router.push({
			path:"/e/s/p/e",
			query:{
				title:'站点分配 ',
				path:"/e/s/p/e",
			}
		})
	}
</script>

<style scoped="scoped">
	.text-gray{
		color:var(--el-text-color-secondary)
	}
	.height-screen{
		height: calc(100vh - 100px);
		width: 100%;
		padding:16px ;
	}
	.flex-warp{
		display: flex;
	}
	.m-t-16{
		margin-top:16px;
	}
	.border-left{
		border-left: 1px solid var(--el-border-color-base);
	}
	.el-menu{border-right: 0;}
	.flex-v-bet{
		display: flex;
		flex-direction: column;
	}
	.flex-v-bet .title{
		font-size:12px;
		color: var(--el-text-color-secondary);
	}
	.flex-v-bet .data{
		font-size:16px;
		font-weight: 600;
	}
	.con-body{
		margin-top:16px;
	}
	.ul-list{
		margin-left: 16px;
		margin-top:10px;
	}
	.ul-list li::marker {
	    color: #FF6700;
	    line-height: 32px;
	}
	.m-b-8{
		margin-bottom:8px;
	}
</style>
