<template>
	<div class="main-sty">
	<!--  头部搜索区域 -->
	<div class="con-header" >
	     <Header/>
	</div>
	<el-row>
	  <el-table :data="tableData" border style="width: 100%;margin-bottom:16px;">
	     <el-table-column fixed type="selection" width="38" />
	      <el-table-column fixed prop="img" label="图片" width="60" >
	       <template #default="scope">
	        <el-image :src="scope.row.img"   width="40" height="40"  ></el-image>
	      </template>
	    </el-table-column>
	    <el-table-column fixed prop="product" label="名称/SKU" width="240" show-overflow-tooltip>
	       <template #default="scope">
	          <div class='name'>{{scope.row.product}}</div>
	          <div class='sku'>{{scope.row.sku}}
	            <copy @click="CopyText(scope.row.product)" title='复制名称' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
	          </div>
	      </template>
	    </el-table-column>
	    <el-table-column prop="types"  label="品类" width="140" sortable />
	    <el-table-column prop="weight" label="重量"  width="90" sortable/>
	    <el-table-column prop="price" label="采购成本" width='100'  sortable/>
	    <el-table-column prop="supplier" label="供应商" width='200'  sortable/>
	    <el-table-column prop="delivery" label="供货周期" width="100"   sortable/>
	    <el-table-column prop="stock" label="库存" width="100"   sortable>
		<template #default="scope">
			<el-popover
			    placement="top-start"
			    title="产品库存"
			    :width="200"
			    trigger="hover"
			  >
			    <template #reference>
			     <span class="pointer">{{scope.row.stock}}</span> 
			    </template>
				<el-table :data="scope.row.stocklist" border>
					<el-table-column label="仓库名称" prop="name"></el-table-column>
					<el-table-column label="库存" prop="detialsstock"></el-table-column>
				</el-table>
			  </el-popover>
		</template>
		 </el-table-column>
	    <el-table-column prop="state" label="状态" width="100"   sortable>
	        <template #default="scope">
	            <el-tag  :type="scope.row.state.type" effect="plain">{{scope.row.state.label}}</el-tag>
	        </template>
	    </el-table-column>
		<el-table-column prop="class" label="产品类型" width="100"   sortable/>
	    <el-table-column prop="mark" label="标签" width="180" sortable>
	       <template #default="scope">
	         <span class='tag-mr' v-show='s.name'  v-for='(s,index) in scope.row.mark' :key='index'>
	             <el-tag  type="info">{{s.name}}</el-tag>
	         </span>
	       </template>
	    </el-table-column>
	    <el-table-column prop="remarks" label="备注"   sortable/>
	    <el-table-column fixed="right" prop="operate" label="操作"  width="125"   sortable>
	        <template #default="scope">
	          <el-space>
	            <el-button type="primary" link @click="productDetails(scope.row)">详情</el-button>
	            <el-button type="primary" link @click="productEdit(scope.$index, scope.row)">编辑</el-button>
	            <el-dropdown :hide-on-click="false">
	              <span class="el-dropdown-link">
	                <more-one class="ic-cen" theme="outline" size="16" fill="#333" :strokeWidth="3"/>
	              </span>
	               <template #dropdown>
	                <el-dropdown-menu>
	                  <el-dropdown-item>删除</el-dropdown-item>
	                  <el-dropdown-item>打印条码</el-dropdown-item>
	                </el-dropdown-menu>
	            </template>
	            </el-dropdown>
	          </el-space>
	        </template>
	    </el-table-column>
	  </el-table>
	  <el-pagination background   layout="total, sizes, prev, pager, next, jumper"   :total="tableData.length"
	  :page-sizes="[10, 20, 50, 100]"  :page-size="pagesize" style='margin-left:auto' 
	  :current-page="currentPage"  @size-change="handleSizeChange"   @current-change="handleCurrentChange">
	  </el-pagination>
	</el-row>
	</div>
</template>

<script>
	import {ref,reactive} from "vue"
	import {Copy} from '@icon-park/vue-next';
	import Header from "./components/header.vue"
	import {useRouter } from 'vue-router'
	import {MenuUnfold,Plus,SettingTwo,Help,MoreOne} from '@icon-park/vue-next';
	import CopyText from"@/utils/copy_text"
	export default{
		components:{
			Header,Copy,
			MoreOne,
		},
		setup(){
			let router = useRouter()
			let tableData = reactive([
  { 
    img:require('@/assets/image/testpic.png'),
    product: '飞机盒 尺寸：40x30x5 cm，拍：KK特硬-空白',
    sku:'kq002',
    types: '电子设备',
    weight: '0.23kg',
    price:'$0.06',
    supplier:'贝贝家贸易有限公司',
    delivery:'3天',
    stock:'15',
    state:{type:'success',label:'在售'},
    mark:'-',
    remarks:'',
    

  },
  {
    img:'',
    product: '300颗酱紫色密封火漆蜡珠自封袋装+1个不锈钢勺子+3个白色蜡烛，仓库把供应商的袋子拆掉，再放1张说明书用BXA022白卡纸盒装；注意放进去时必须铺平整，盒子不要鼓起',
    sku:'DA4165',
    types: '办公用品',
    weight: '1.2kg',
    price:'$16.2',
    supplier:'东阳永挥塑料制品有限公司',
    delivery:'-',
    stock:'0',
    state:{type:'',label:'开发中'},
    mark:[{name:'圣诞节'},{name:'海运'},{name:'危险品'}],
    remarks:'',
  },
  {
    img:'',
    product: '1米带logo红色布袋海洋球围挡外套OPP袋放折叠说明书',
    sku:'SEF63SE',
    types: '玩具',
    weight: '1.2kg',
    price:'$4.90',
    supplier:'义乌市超伦包装制品有限公司',
    delivery:'0天',
    stock:'458',
    state:{type:'info',label:'清仓'},
    mark:[{name:'夏季产品'}],
    remarks:'',
  },
  {
    img:'',
    product: '12MM宽透明小胶带（整箱720卷',
    sku:'AWDA4165',
    types: '艺术装饰品',
    weight: '0.02kg',
    price:'$1.87',
    supplier:'杭州权佳包装材料有限公司',
    delivery:'-',
    stock:'495',
    state:{type:'danger',label:'停售'},
    mark:[{name:'长期滞销'}],
    remarks:'',
  },
])
  function productDetails(row){
	  router.push({
	  	path:'/material/details',
	  	query:{
	  	  title:"产品详情",
	  	  path:'/material/details',
	  	}
	  })
  }
  function productEdit(row){
	  if(row.type=="组装产品"){
		  router.push({
		  	path:'/localproduct/editinfo/assemble',
		  	query:{
		  	  title:"添加组合产品",
		  	  path:'/localproduct/editinfo/assemble',
			  details:{},
		  	}
		  })
	  }else{
		 router.push({
		 	path:'/localproduct/editinfo',
		 	query:{
		 	  title:"编辑产品",
		 	  path:'/localproduct/editinfo',
		 	  details:{},
		 	}
		 }) 
	  }
	 
  }
  return {
	  CopyText,
	  tableData,
	  productEdit,
	  productDetails,
  }
		}
	}
	
</script>

<style>
	.el-dropdown-link .i-icon svg{vertical-align:text-top;}
	.tag-mr{margin-right:4px;margin-bottom:4px;display:inline-block}
	.sku .i-icon-copy{cursor:pointer;opacity: 0;}
	.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell .sku .i-icon-copy{opacity: 1;transition: opacity .4s; }
	.con-header .el-row{margin-bottom:16px;}
</style>
