<template>
 <div class='main-sty'>
	<!--  头部搜索区域 -->
<div class="con-header" >
  <el-row>
    <el-space >
  <el-select v-model="proPerson"  placeholder="负责人">
        <el-option  v-for="item in PersonData"   :key="item.value"  :label="item.label" :value="item.value"   >
        </el-option>
  </el-select>
  <el-select v-model="proType"  placeholder="品类">
        <el-option  v-for="item in typeData"   :key="item.value"  :label="item.label" :value="item.value"   >
        </el-option>
  </el-select>
  <el-select v-model="proBuyer"  placeholder="采购员">
        <el-option  v-for="item in buyerData"   :key="item.value"  :label="item.label" :value="item.value"   >
        </el-option>
  </el-select>
    <el-select v-model="proMark"  placeholder="标签">
        <el-option  v-for="item in markData"   :key="item.value"  :label="item.label" :value="item.value"   >
        </el-option>
  </el-select>
   <el-input  v-model="searchKeywords" placeholder="请输入" class="input-with-select" >
      <template #prepend>
        <el-select v-model="selectlabel" placeholder="SKU" style="width: 110px">
          <el-option label="SKU" value="1"></el-option>
          <el-option label="产品名称" value="2"></el-option>
          <el-option label="供应商" value="3"></el-option>
           <el-option label="创建人" value="4"></el-option>
        </el-select>
      </template>
      <template #append>
        <el-button >
           <el-icon style="font-size: 16px;align-itmes:center">
            <search />
         </el-icon>
        </el-button>
      </template>
    </el-input>
   <el-button  title='高级筛选'  class='ic-btn'>
   <menu-unfold theme="outline" size="16"  :strokeWidth="3"/>
   </el-button>
    <el-button>重置</el-button>
  </el-space>
  </el-row>
   <!--功能区域 -->
  <el-row>
   <el-space >
    <el-button type="primary" class="im-but-one">
      <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
      <span>添加产品</span>
    </el-button>
    <el-button>添加组合产品</el-button>
    <el-dropdown trigger="click">
      <el-button>
                 导入数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu >
          <el-dropdown-item>导入产品</el-dropdown-item>
          <el-dropdown-item>导入组合产品</el-dropdown-item>
          <el-dropdown-item>导入图片</el-dropdown-item>
          <el-dropdown-item>导入更新产品</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
     <el-dropdown trigger="click">
      <el-button>
                 导出数据<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu >
          <el-dropdown-item>导出产品</el-dropdown-item>
          <el-dropdown-item>导出组合产品</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown trigger="click">
      <el-button>
                 更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu >
          <el-dropdown-item>打印产品标签</el-dropdown-item>
          <el-dropdown-item>编辑</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
          <el-dropdown-item>采购</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
   </el-space>
   <div class='rt-btn-group'>
   <el-button class='ic-btn'  title='列配置'>
      <setting-two theme="outline" size="16"  :strokeWidth="3"/>
   </el-button>
    <el-button   class='ic-btn' title='帮助文档'>
     <help theme="outline" size="16" :strokeWidth="3"/>
   </el-button>
   </div>
</el-row>
</div>
	<!-- 表单 -->
	<div class='con-body'>
<el-row>
  <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%;margin-bottom:16px;">
     <el-table-column type="selection" width="38" />
      <el-table-column prop="img" label="图片" width="60" >
       <template #default="scope">
        <el-image :src="scope.row.img"   width="40" height="40"  ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="product" label="名称/SKU" width="240" show-overflow-tooltip>
       <template #default="scope">
          <div class='name'>{{scope.row.product}}</div>
          <div class='sku'>{{scope.row.sku}}
            <copy title='复制' theme="outline" size="14" fill="#666" :strokeWidth="3"/>
          </div>
      </template>
    </el-table-column>
    <el-table-column prop="types"  label="品类" width="140" sortable />
    <el-table-column prop="weight" label="重量"  width="100" sortable/>
    <el-table-column prop="price" label="采购成本" width='100'  sortable/>
    <el-table-column prop="supplier" label="供应商" width='200'  sortable/>
    <el-table-column prop="delivery" label="供货周期" width="100"   sortable/>
    <el-table-column prop="stock" label="库存" width="100"   sortable/>
    <el-table-column prop="state" label="状态" width="100"   sortable>
        <template #default="scope">
            <el-tag  :type="scope.row.state.type" effect="plain">{{scope.row.state.label}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="mark" label="标签" width="180" sortable>
       <template #default="scope">
         <span class='tag-mr' v-show='s.name'  v-for='(s,index) in scope.row.mark' :key='index'>
             <el-tag  type="info">{{s.name}}</el-tag>
         </span>
       </template>
    </el-table-column>
    <el-table-column prop="remarks" label="备注"   sortable/>
    <el-table-column prop="operate" label="操作"  width="120"   sortable>
        <template #default="scope">
          <el-space>
            <el-button class='el-button--blue' @click="(scope.$index, scope.row)">详情</el-button>
            <el-button class='el-button--blue' @click="(scope.$index, scope.row)">编辑</el-button>
           
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link">
                <more-one theme="outline" size="20" fill="#333" :strokeWidth="3"/>
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
</div>
</template>
<script>
import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
import {Search,ArrowDown,} from '@element-plus/icons-vue'
import { ref,reactive,onMounted } from 'vue'
export default {
  name: 'Localproduct',
  components: {Search,MenuUnfold,Plus,ArrowDown,SettingTwo,Help,Copy,MoreOne
  },
  setup(){
     let selectlabel = ref('')
     let searchKeywords= ref('')
     let proType=ref('')
     let typeData = [
       {value:'alltype',label:'全部品类'},
       {value:'toy',label:'玩具'},
       {value:'Kitchen',label:'厨具'},
       {value:'office',label:'办公用品'}
     ]
     let proBuyer=ref('')
     let buyerData = [
       {value:'alltype',label:'全部采购员 '},
       {value:'maxiaodong',label:'马晓东'},
       {value:'liuyulin',label:'刘雨林'},
       {value:'zhangsan',label:'张三'}
     ]
     let proPerson=ref('')
     let PersonData = [
       {value:'allperson',label:'全部负责人'},
       {value:'maxiaodong',label:'马晓东'},
       {value:'liuyulin',label:'刘雨林'},
       {value:'zhangsan',label:'张三'}
     ]
     let proMark=ref('')
     let markData = [
       {value:'allperson',label:'全部标签'},
       {value:'maxiaodong',label:'圣诞节'},
       {value:'liuyulin',label:'备货'},
       {value:'zhangsan',label:'万圣节'}
     ]
        let pagesize=10
     let currentPage=1
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
      //方法
      function handleSizeChange(size){
          pagesize = size
      }
      function handleCurrentChange(currentPage){
          currentPage = currentPage;
      }
      //返回对象
       return {
         selectlabel,
         searchKeywords,
           pagesize,
         currentPage,
         tableData,
         proMark,
         markData,
         proBuyer,
         buyerData,
         typeData,
         proType,
         PersonData,
         proPerson 
    }
},
}
</script>
<style>
.el-dropdown-link .i-icon svg{vertical-align:text-top;}
.tag-mr{margin-right:4px;margin-bottom:4px;display:inline-block}
.sku .i-icon-copy{cursor:pointer;opacity: 0;}
.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell .sku .i-icon-copy{opacity: 1;transition: opacity .4s; }

.con-header .el-row{margin-bottom:16px;}
</style>