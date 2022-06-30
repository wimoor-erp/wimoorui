<template>
 <el-col :span='12'>
		  <el-space style='margin-bottom:8px;'>
		    <span class='pag-title'>商品销量排名</span><span class='pag-small-Extra'>2022-02-11 ~ 2022-02-17</span>
		  </el-space>
		  <div class='pag-radius-bor'>
               <el-table :data="tableData" border style="width: 100%;">
        <el-table-column  type="index" label="排名"  width="45" />
		 <el-table-column prop="img" label="图片" width="60" >
         <template #default="scope">
          <el-image :src="scope.row.img"   width="40" height="40"  ></el-image>
        </template>
       </el-table-column>
		 <el-table-column  label="名称/sku/asin"    show-overflow-tooltip>
		      <template #default="scope" >
				  <div class='name'>{{scope.row.name}}</div>
				  <span class="sku">{{scope.row.sku}} </span>
				  <span >{{scope.row.asin}} </span>
			  </template>
	  </el-table-column>
        <el-table-column prop="ptype" label="品类"  width="100" />
		<el-table-column prop="sale" label="销量" width='80'/>
		<el-table-column prop="amount" label="销售额"  width="120" />
		<el-table-column prop="fba" label="FBA可售" width='80'/>
      </el-table>
		  </div>
	 </el-col>
</template>
<script>
import { ref } from 'vue'
export default {
  name: "Goodsrank",
  components: {},
  setup() {
	let radio=ref('近7天')
    let tableData = [
	  {  img:require('@/assets/image/testpic.png'),name:'FEPITO Pin The Horn auf dem Einhorn-Geburtstagsfeier-Spiel mit 24 Hörnern für Einhorn-Partybedarf',
	  sku:'kq002',asin:'AF48EFE1',ptype:'电子设备', sale: "624356", amount: "￥68,152.26" , fba: "129" },
	   {  img:require('@/assets/image/testpic.png'),name:'FEPITO Pin The Horn auf dem Einhorn-Geburtstagsfeier-Spiel mit 24 Hörnern für Einhorn-Partybedarf',
	  sku:'kq002',asin:'AF48EFE1',ptype:'电子设备', sale: "624356", amount: "￥68,152.26" , fba: "129" },
	   {  img:require('@/assets/image/testpic.png'),name:'FEPITO Pin The Horn auf dem Einhorn-Geburtstagsfeier-Spiel mit 24 Hörnern für Einhorn-Partybedarf',
	  sku:'kq002',asin:'AF48EFE1',ptype:'电子设备', sale: "624356", amount: "￥68,152.26" , fba: "129" },
	   {  img:require('@/assets/image/testpic.png'),name:'FEPITO Pin The Horn auf dem Einhorn-Geburtstagsfeier-Spiel mit 24 Hörnern für Einhorn-Partybedarf',
	  sku:'kq002',asin:'AF48EFE1',ptype:'电子设备', sale: "624356", amount: "￥68,152.26" , fba: "129" },
	   {  img:require('@/assets/image/testpic.png'),name:'FEPITO Pin The Horn auf dem Einhorn-Geburtstagsfeier-Spiel mit 24 Hörnern für Einhorn-Partybedarf',
	  sku:'kq002',asin:'AF48EFE1',ptype:'电子设备', sale: "624356", amount: "￥68,152.26" , fba: "129" },
    ];
    //返回数据
    return {
      tableData
    };
  }
};
</script>