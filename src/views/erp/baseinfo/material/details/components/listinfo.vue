<template>
	<div class="right-align-list">
	<h3 id="base"  class="tab-scroll">基础信息</h3>
	<el-descriptions  :column="1"  size="default" >
		<el-descriptions-item label="产品图片" >
			<el-image style="width: 148px; height: 148px" src="https://photo.wimoor.com/materialImg/a01224a9-ab15-11e6-bab5-00e04c023f0e/1536744463384_after.jpeg"></el-image>
		</el-descriptions-item>
	    <el-descriptions-item label="产品名称" >4.3cm 小款易拉扣2个带透明证件夹 BXKQ001小黑盒</el-descriptions-item>
	    <el-descriptions-item  label="SKU" :span="2">FP383-1</el-descriptions-item>
		<el-descriptions-item label="产品类型" :span="2">
			 <el-tag class="ml-2" type="info">普通产品</el-tag>
		</el-descriptions-item>
	    <el-descriptions-item  label="品牌" :span="2">-</el-descriptions-item>
		<el-descriptions-item label="品类" :span="2">-</el-descriptions-item>
	    <el-descriptions-item label="产品标签">
			<el-space>
	      <el-tag  effect="dark" type="primary" >蓝</el-tag>
		  <el-tag class="ml-2" type="warning">开发中</el-tag>
		  </el-space>
	    </el-descriptions-item>
		<el-descriptions-item label="负责人" :span="2">张三</el-descriptions-item>
		<el-descriptions-item label="生效日期" :span="2">2022-02-20</el-descriptions-item>
	    <el-descriptions-item label="备注">
	      43mm易拉扣 一套=2个备用供应商：兆银600个起5.8
	    </el-descriptions-item>
	  </el-descriptions>
	 <el-divider />
	<h3 id="purchase" class="tab-scroll">采购信息</h3>
	<el-descriptions  :column="1"  size="default" >
		<el-descriptions-item label="采购员" :span="2">李四</el-descriptions-item>
		<el-descriptions-item label="供应商" :span="2" class-name="flex-one">
			<el-table :data="tableData" border >
				<el-table-column type="index"></el-table-column>
				<el-table-column label="供应商名称" prop="supplier"></el-table-column>
				<el-table-column label="首选" prop="first">
					<template #default="scope">
						<el-switch
						    v-model="scope.row.check"
						    inline-prompt
						    active-text="是"
						    inactive-text="否"
						  />
					</template>
				</el-table-column>
				<el-table-column label="供货周期" prop="day"></el-table-column>
				<el-table-column label="采购阶梯价" >
					<template #default="scope">
						<div class="position-edit" @click="editPrice">
						 <el-icon class="ic-cen"><Edit /></el-icon>	
						<el-table :data="priceTableData" class="small-tab" border>
							<el-table-column label="采购量">
								<template #default="scope">
									<span>{{scope.row.starnum}}</span>-{{scope.row.endnum}}
								</template>
							</el-table-column>
							<el-table-column label="币种" prop="currenty"/>
							<el-table-column label="采购单价" prop="price"/>
						</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="采购链接">
				</el-table-column>
				<el-table-column label="税率"></el-table-column>
				<el-table-column label="不良率"></el-table-column>
			</el-table>
		</el-descriptions-item>
	 </el-descriptions>
	 <el-divider />
	 <h3 id="specs" class="tab-scroll">规格信息</h3>
	 <el-descriptions  :column="1"  size="default" >
	 	<el-descriptions-item label="净品规格" :span="2">
			<el-space :size="32">
			<span>4x2x1 cm</span>
			<span>2kg</span>
			</el-space>
		</el-descriptions-item>
		<el-descriptions-item label="带包装规格" :span="2">
			<el-space :size="32">
			<span>4x2x1 cm</span>
			<span>2kg</span>
			</el-space>
		</el-descriptions-item>
		<el-descriptions-item label="单箱规格" :span="2">
			<el-space :size="32">
			<span>4x2x1 cm</span>
			<span>2kg</span>
			</el-space>
		</el-descriptions-item>
		<el-descriptions-item label="单箱数量" :span="2">
			12
		</el-descriptions-item>
	  </el-descriptions>
	  <el-divider />
	  <h3 id="consumables" class="tab-scroll">辅料关联</h3>
	  <el-descriptions  :column="1"  size="default" >
		  <el-descriptions-item label="辅料" :span="2" class-name="flex-one">
		  	<el-table border :data="tableData">
		  			 <el-table-column width="50"  type="index"> 
		  			 			 <template #header>
									 序号
		  			 			 </template>
		  			 </el-table-column>
		  			 <el-table-column width="80" label="图片">
		  				 <template #default="scope">
		  				 	<el-image :src="scope.row.img" width="40" height="40"></el-image>
		  				 </template>
		  			 </el-table-column>
		  			 <el-table-column label="辅料名称/辅料SKU" width="400">
		  				 <template #default="scope">
		  				 	<div class='name'>{{scope.row.name}}</div>
		  				 	<div class='sku'>{{scope.row.sku}} </div>
		  				 </template>
		  			 </el-table-column>
		  			 <el-table-column label="单价">
		  				  <template #default="scope">
		  				 <el-input v-model="scope.row.price"></el-input>
		  				  </template>
		  			 </el-table-column>
		  			 <el-table-column label="关联数量">
		  				 <template #default="scope">
		  				 <el-input v-model="scope.row.bindnum"></el-input>
		  				  </template>
		  			 </el-table-column>
		  	</el-table>
		  </el-descriptions-item>
	  </el-descriptions>
	  <el-divider />
	  <h3 id="logistics" class="tab-scroll">物流信息</h3>
	  <el-descriptions  :column="1"  size="default" >
		  <el-descriptions-item label="申报单价" :span="2">
		  	1.2USD
		  </el-descriptions-item>
		  <el-descriptions-item label="中文报关名" :span="2">
		  	-
		  </el-descriptions-item>  
		  <el-descriptions-item label="英文报关名" :span="2">
		  	-
		  </el-descriptions-item> 
		  <el-descriptions-item label="特殊属性" :span="2">
			  <el-space>
		  	<el-tag type="info">带电</el-tag>
			<el-tag type="info">带磁</el-tag>
			</el-space>
		  </el-descriptions-item>
		  <el-descriptions-item label="物流报关" :span="2" class-name="flex-one">
			  <el-table border :data="tableData">
			  		 <el-table-column label="国家" prop="country"></el-table-column>
			  		 <el-table-column label="默认头程费用" prop="fee">
			  			 <template #default="scope">
			  				 <el-input v-model="scope.row.fee">
			  					 <template #append>
			  						<el-select v-model="scope.row.checkFee" class="wi-100">
			  							<el-option label="USD" value="usd"></el-option>
			  						</el-select> 
			  					 </template>
			  				 </el-input>
			  			 </template>
			  		 </el-table-column>
			  		 <el-table-column label="海关编码" >
			  			 <template #default="scope">
			  					 <el-input v-model="scope.row.code"> </el-input>
			  			 </template>
			  		 </el-table-column>
			  		 <el-table-column label="税率">
			  			  <template #default="scope">
			  			 <el-input v-model="scope.row.taxrate">
			  					 <template #append>
			  						%
			  					 </template>
			  			 </el-input>
			  			 </template> 
			  		 </el-table-column>
			  </el-table>
		  </el-descriptions-item>
	  </el-descriptions>
	  <el-divider />
	  <h3 id="inv" class="tab-scroll">库存信息</h3>
	 </div>
</template>

<script>
import { ref,reactive} from 'vue'

	export default{
		components: {
		},
		setup(){
			let tableData =reactive([
				{
					supplier:'义乌市烈火包装制品有限公司',
					check:'true',
					day:"5天",
					
					
				}
			])
			return{
			
			}
		}
		}
</script>

<style>
.flex-one{
	flex: 1;
}	
.right-align-list 	.el-descriptions__cell{
	display: flex;
}
.right-align-list .el-descriptions__label{
	width:100px;
	text-align: right;
	padding-right:16px;
}
</style>
