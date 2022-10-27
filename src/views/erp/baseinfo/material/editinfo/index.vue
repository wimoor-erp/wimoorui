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
				    <el-tab-pane  label="采购信息" name="2">
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
					 <el-form :model="form"  label-width="100px">
						 <!-- 基础信息 -->
						 <Base/>
					    <el-divider />
						 <!-- 采购信息 -->
						 <Purchase/>
						  <!-- 组装信息 -->
						  <Assemble/>
						   <el-divider />
						  <!-- 规格信息 -->
						  <Specs/>
						  <el-divider />
						  <!-- 辅料关联 -->
						  <Consumables/>
						   <el-divider />
						    <!--物流信息 -->
							<Logistics/>
					 </el-form>
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
import Base from"./components/base.vue"
import Purchase from"./components/purchase.vue"
import Logistics from"./components/logistics.vue"
import Consumables from"./components/consumables.vue"
import Specs from"./components/specs.vue"
import tabScroll from"@/utils/tab_scroll"

	export default{
		components: {
			Base,
			Purchase,Logistics,Consumables,Specs,
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
   .fr-con .tab-scroll {
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
	.grid-row .is-link{
		margin-left: 8px;
		opacity: 0;
	}
	.grid-row:hover .is-link{
		opacity: 1;
	}
	.fo-we-400{
		font-weight: 400;
	}
	.he-scr-car{
		height:calc(100vh - 176px)
	}
</style>
