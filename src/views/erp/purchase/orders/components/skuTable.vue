<template>
  <el-table :data="tableData" border>
	  <el-table-column type="selection" width="40"></el-table-column>
       <el-table-column  prop="image" label="图片" width="60" >
	       <template #default="scope">
	        <el-image v-if="scope.row.image" :src="scope.row.image"   width="40" height="40"  ></el-image>
			<el-image v-else :src="require('@/assets/image/empty/noimage40.png')"   width="40" height="40"  ></el-image>
	      </template>
	    </el-table-column>
	    <el-table-column  prop="product" label="名称/SKU" width="160" show-overflow-tooltip>
	       <template #default="scope">
	          <div class='name'>{{scope.row.name}}</div>
	          <div class='sku'>{{scope.row.sku}}
	          </div>
	      </template>
	    </el-table-column>
		<el-table-column  label="状态" width="85">
		   <template #default="scope">
			   <el-tag type="warning">待审核</el-tag>
		  </template>
		</el-table-column>
		<el-table-column  label="采购信息" width="140">
		   <template #default="scope">
			   <div class="flex-center">
			   <span class="word-break font-extraSmall">单价：</span>
			   <span v-if="scope.row.isEdit">{{scope.row.price}}</span>
			   <el-input size="small" v-model="scope.row.price" v-else></el-input>
			   </div>
			   <div class="flex-center ">
			   <span class="word-break font-extraSmall">数量：</span>
			   <span v-if="scope.row.isEdit">{{scope.row.num}}</span>
			   <el-input size="small" v-model="scope.row.num" v-else></el-input>
			   </div>
			   <div class="flex-center ">
			   <span class="word-break font-extraSmall">金额：</span>
			   <span v-if="scope.row.isEdit">{{scope.row.amount}}</span>
			   <el-input size="small" v-model="scope.row.amount" v-else></el-input>
			   </div>
		  </template>
		</el-table-column>
		<el-table-column  label="订单信息" width="230">
		   <template #default="scope">
			<p><span class="font-extraSmall">订单号：</span>{{scope.row.code}}</p>
			<el-space :spacer="spacer">
			<p>张三</p>
			<p>东莞(实际使用)-正品仓</p>
			</el-space>
			<p><span class="font-extraSmall">创建时间：</span>2022-11-21</p>
			
		  </template>
		</el-table-column>
		<el-table-column  label="供应商信息" width="220">
		   <template #default="scope">
			   <p></p>
			   <p><span class="font-extraSmall">供应商：</span>义乌市布荣皮革有限公司</p>
			   <p><span class="font-extraSmall">供货周期：</span>5天</p>
			   <p><span class="font-extraSmall">起订量：</span>1000</p>
		  </template>
		</el-table-column>
		<el-table-column  label="备注" >
		   <template #default="scope">
		  </template>
		</el-table-column>
		<el-table-column  label="操作" width="80">
		   <template #default="scope">
			   <el-button link type="primary">审核</el-button>
		  </template>
		</el-table-column>
		
  </el-table>
</template>

<script setup>
	import {h,ref,reactive,toRefs} from 'vue'
	import {Download,Edit,DeleteFilled} from '@element-plus/icons-vue';
	import {MoreOne} from '@icon-park/vue-next';
	import {ElDivider} from 'element-plus'
	const spacer = h(ElDivider, {
		direction: 'vertical'
	})
	const state = reactive({
		tableData: [{
		name: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
		sku: 'fe002',
		price:'￥46.00',
		num:'100',
		amount:'￥2000.00',
		code:'PF202211140008',
		isEdit:true,
		}],
	})
	const {
		tableData,
	} = toRefs(state)
	
</script>

<style>
.word-break{
	white-space:nowrap;
}
</style>
