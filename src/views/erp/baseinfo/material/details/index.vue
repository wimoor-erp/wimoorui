<template>
	<div class="main-sty gary-bg">
		<el-row >
			<el-col :span="4" class="ri-tabs">
				<el-tabs tab-position="left"  v-model="activeName">
				    <el-tab-pane label="基本信息" name="1">
						<template #label>
							 <el-link :underline="false"  href="#base">基本信息</el-link>
						</template>
					</el-tab-pane>
				    <el-tab-pane label="采购信息" name="2">
						<template #label>
							 <el-link :underline="false" href="#purchase">采购信息</el-link>
						</template>
					</el-tab-pane>
					<el-tab-pane label="规格信息" name="3">
						<template #label>
							 <el-link :underline="false" href="#specs">规格信息</el-link>
						</template>
					</el-tab-pane>
					<el-tab-pane label="辅料关联" name="4">
						<template #label>
							 <el-link :underline="false" href="#consumables">辅料关联</el-link>
						</template>
					</el-tab-pane>
				    <el-tab-pane label="物流信息" name="5">
						<template #label>
							 <el-link :underline="false" href="#logistics">物流信息</el-link>
						</template>
					</el-tab-pane>
				  </el-tabs>
			</el-col>
			<el-col :span="16" >
				<el-card class="fr-con">
					 <el-scrollbar class="he-scr-car" @scroll="scroll">
						 <Listinfo/>
					</el-scrollbar>
						<div class='text-center mar-top-16'>
							<el-space>
								<el-button type="">取消</el-button>
								<el-button type="primary">提交</el-button>
							</el-space>
						</div>
						
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { ref,reactive,onMounted,watch,onUnmounted} from 'vue'
import tabScroll from"@/utils/tab_scroll"
import Listinfo from"./components/listinfo"
	export default{
		components: {
			Listinfo,
		},
		setup(){
			let activeName =ref('1')
			let arrDom =ref([])
			function scroll(obj){
				activeName.value = tabScroll(obj,"tab-scroll")
			}
			return{
				activeName,
				scroll,
				arrDom,
			}
		}
		}
</script>

<style>
	
.small-tab  th.el-table__cell{
	background-color: #fff;
}	
	.wi-60{
		width:60px;
	}
.mar-top-16{
	margin-top: 16px;
}
.fr-con .el-divider{
	padding-bottom:8px!important;
}
   .fr-con h3{
   	margin-bottom:16px ;
   }
	.fr-con .el-card__body{
		height:calc(100vh - 90px);
		min-height:600px;
	}
	.ri-tabs{
		display: flex;
		justify-content: flex-end;
	}
	.ri-tabs .el-tabs--left .el-tabs__nav-wrap.is-left::after{
		height:0px;
	}
	.in-wi-24{
		width: 400px;
	}
	.flex-center .el-link--inner{
		display: flex;
		align-items: center;
		margin-left: 8px;
		opacity: 0;
	}
	.grid-row:hover .flex-center .el-link--inner{
		opacity: 1;
	}
	.fo-we-400{
		font-weight: 400;
	}
	.he-scr-car{
		height:calc(100vh - 176px)
	}
</style>
