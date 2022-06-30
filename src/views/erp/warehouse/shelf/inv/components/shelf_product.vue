<template>
	<div class="con-header">
		<el-row>
			<div>
				<h3><span v-if='shelfdata.data.length!==null'>{{shelfdata.data.number}}-</span>{{shelfdata.data.name}}
				</h3>
				<el-space class='font-extraSmall'>
					<span v-if="shelfdata.data.treepath">规格(cm):{{shelfdata.data.length}}*{{shelfdata.data.width}}*{{shelfdata.data.height}}</span>
					<span v-if="shelfdata.data.treepath">已用容量:{{shelfdata.usesize}}%</span> 
					<span> </span>
				</el-space>
			</div>
			<div class='rt-btn-group'>
					<el-button class='ic-btn' title='帮助文档'>
						<help theme="outline" size="16" :strokeWidth="3" />
					</el-button>
			</div>
		</el-row>
	</div>
	<!-- 表单列表 -->
	<div class='con-body'>
		<div class="btn-header">
			<el-radio-group v-model="tablabel">
				<el-radio-button label="shelf">已上架</el-radio-button>
				<el-radio-button label="unshelf">未上架</el-radio-button>
			</el-radio-group>
			<div>
			
				<div class="rt-btn-group" v-show="tablabel=='shelf'" >
				   <el-space wrap>
				   <el-checkbox v-model="allchildren" @change="allchildrenChange" :disabled="allchildrendisabled" label="含子库位"  />
				   <el-button  @click='subShelfs'>批量下架</el-button>
					<el-input v-model="skuSearch" placeholder="搜素SKU...">
						<template #suffix>
							<el-icon style="font-size:16px;" class="el-input__icon">
								<search />
							</el-icon>
						</template>
					</el-input>
					</el-space>
				</div>
				<div class="rt-btn-group" v-show="tablabel=='unshelf'" >
					<el-button @click='addShelf'>批量上架</el-button>
					<el-input v-model="skuSearch" placeholder="搜素SKU...">
						<template #suffix>
							<el-icon style="font-size:16px;" class="el-input__icon">
								<search />
							</el-icon>
						</template>
					</el-input>
				</div>
			</div>
		</div>
		<el-row v-show="tablabel=='shelf'">
			<el-table :data="tableData.records" @sort-change="shelfSort"  @selection-change='selectCheckboxShelf' :row-key="getRowKeys" border
				class="sys-table">
				<el-table-column type="selection" :reserve-selection="false" width="38" />
				<el-table-column prop="image" label="图片" width="60">
					<template #default="scope">
						<el-image :src="scope.row.image" width="40" height="40"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="名称/SKU" width="400" prop="sku" sortable="custom"  show-overflow-tooltip>
					<template #default="scope">
						<div class='name'>{{scope.row.name}}</div>
						<div class='sku'>{{scope.row.sku}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="shelfname" label="库位" sortable="custom" />
				<el-table-column prop="quantity" label="库位库存" sortable="custom" />
				<el-table-column prop="operate" label="操作" width="120"  >
					<template #default="scope">
						<el-popover v-model:visible="scope.row.visible" placement="top" :width="160">
							<el-input v-model="scope.row.amount" @input="scope.row.amount=number(scope.row.amount)"
								class='inp-box' placeholder="下架数量" />
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
								<el-button size="small" type="primary"
									@click="submitOffTheShelf(scope.row,scope.$index)">确认</el-button>
							</div>
							<template #reference>
								<el-button class='el-button--blue'>下架</el-button>
							</template>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
				<el-pagination background
				               layout="total, sizes, prev, pager, next, jumper"   
				               :total="tableData.total"
				               :page-sizes="[10, 20, 50, 100]"  
							   :page-size="tableData.pagesize" 
							   style='margin-left:auto'
				               :current-page="tableData.page"  
							   @size-change="shelfPaginationSize"   
							   @current-change="shelfPaginationCurrent">
				</el-pagination>
		</el-row>
		<el-row v-show="tablabel=='unshelf'">
			<el-table :data="unshelftableData.records"  @sort-change="unshelfSort" @selection-change='selectCheckboxunShelf' :row-key="getRowKeys" border
				class="sys-table">
				<el-table-column type="selection" :reserve-selection="false" width="38" />
				<el-table-column prop="image" label="图片" width="60">
					<template #default="scope">
						<el-image :src="scope.row.image" width="40" height="40"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="名称/SKU" width="400"   prop="sku"  sortable="custom" show-overflow-tooltip>
					<template #default="scope">
						<div class='name'>{{scope.row.name}}</div>
						<div class='sku'>{{scope.row.sku}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="warehousequantity" label="仓库" sortable="custom">
					<template #default="scope">
						<div>{{scope.row.warehousename}}</div>
						<div class="font-extraSmall">库存:{{scope.row.warehousequantity}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="quantity" label="暂存库存" sortable="custom" />
				<el-table-column prop="operate" label="操作" width="120" >
					<template #default="scope">
						<el-popover v-model:visible="scope.row.visible" placement="top" :width="160">
							<el-input v-model="scope.row.amount" @input="scope.row.amount=number(scope.row.amount)"
								class='inp-box' placeholder="上架数量" />
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
								<el-button size="small" type="primary"
									@click="addOffTheShelf(scope.row,scope.$index)">确认</el-button>
							</div>
							<template #reference>
								<el-button class='el-button--blue'>上架</el-button>
							</template>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background   
			               layout="total, sizes, prev, pager, next, jumper"   
			               :total="unshelftableData.total"
			               :page-sizes="[10, 20, 50, 100]"  :page-size="unshelftableData.pagesize" 
						   style='margin-left:auto'
			               :current-page="unshelftableData.page"  
						   @size-change="unShelfPaginationSize"   
						   @current-change="unShelfPaginationCurrent">
			</el-pagination>
 
		</el-row>


	</div>
	<!-- 弹窗选择上架产品 -->
	<el-dialog v-model="GroundingVisible" :title="dialogTitle" destroy-on-close="true" @close='closeDialog'>
	<!-- 	<el-input v-model="dialogSearch" class='inp-box' placeholder="搜索SKU..." /> -->
		<el-table :data="diglogunshelftableData" border style="width: 100%;margin-bottom:16px;">
			<el-table-column prop="img" label="图片" width="60">
				<template #default="scope">
					<el-image :src="scope.row.image" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="product" label="名称/SKU" width="400" show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sku}} </div>
				</template>
			</el-table-column>
			<el-table-column prop="amount" label="暂存库存" width="100"   />
			<el-table-column prop="quantity" label="上架数量"  >
				<template #default="scope">
					<el-input v-model.number="scope.row.quantity"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="GroundingVisible = false">取消</el-button>
				<el-button type="primary" @click="submitShelf">确认上架</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 弹窗选择下架产品 -->
	<el-dialog v-model="offShelfVisible" :title="dialogTitle" destroy-on-close='true' @close='closeDialog'>
		<el-table :data="offShelftableData" border style="width: 100%;margin-bottom:16px;">
			<el-table-column prop="img" label="图片" width="60"> 
				<template #default="scope">
					<el-image :src="scope.row.image" width="40" height="40"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="product" label="名称/SKU" width="400" show-overflow-tooltip>
				<template #default="scope">
					<div class='name'>{{scope.row.name}}</div>
					<div class='sku'>{{scope.row.sku}} </div>
				</template>
			</el-table-column>
			<el-table-column prop="amount" label="库位库存" width="100"   />
			<el-table-column prop="quantity" label="下架数量"  >
				<template #default="scope">
					<el-input v-model="scope.row.quantity"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="offShelfVisible = false">取消</el-button>
				<el-button type="primary" @click="submitOffTheShelfs">确认下架</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import {ref,reactive,onMounted,watch} from 'vue'
	import {Help,Plus,} from '@icon-park/vue-next';
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi';
	import shelfApi from '@/api/erp/warehouse/shelf';
	import {number} from '@/utils/index';
	import {ElMessage} from 'element-plus';
	import {Search} from '@element-plus/icons-vue';
	import {fomatFloat,parseTime} from '@/utils/index';
 
	export default {
		name: 'ShelfProduct',
		components: {
			Help,
			Search,
			Plus 
		},
		setup(props, {
			attrs,
			slots,
			emit
		}) {
			let tablabel = ref("shelf")
			let GroundingVisible = ref(false)
			let offShelfVisible = ref(false)
			let diglogunshelftableData=ref()
			let dialogSearch = ref("")
			let skuSearch=ref("");
			let dialogTitle = ref();
			let tabletype = ref("shelftable")
			let checkall = ref(false);
			let search = ref();
			const allchildrendisabled=ref(false);
			const allchildren=ref(true) ;
			let pagesize=ref(10)
			let shelfPage=ref();
			let unshelfPage=ref();
			
			let currentPage=ref(1)
			let totalunshelf = ref(100);
			let totalshelf = ref(100);
			let shelfdata = reactive({
				data: {},usesize:0
			})
			let unshelftableData = reactive({ records: [],total:0,page:1,pageSize:10,sort:"orderitem",order:"desc"});
			let tableData = reactive({ records: [],total:0 ,page:1,pageSize:10,sort:"",order:""});
			let offShelftableData = ref();
			const unShelfPaginationSize=function(data){
				 getunshelfList(1,data);
			}
			const unShelfPaginationCurrent=function(data){
				 getunshelfList(data,unshelftableData.pageSize);
			}
			const shelfPaginationSize=function(data){
		         getshelfList(1,data);
			}
			const shelfPaginationCurrent=function(data){
			     getshelfList(data,tableData.pageSize);
			}
			const shelfSort=function(option){
				if("shelfname"==option.prop){
					tableData.sort="treepath";
				}else{
					tableData.sort=option.prop;
				}
				tableData.order=option.order=="ascending"?"asc":"desc";
				getshelfList(1,tableData.pageSize);
			}
			const unshelfSort=function(option){
				unshelftableData.sort=option.prop;
				unshelftableData.order=option.order=="ascending"?"asc":"desc";
				getunshelfList(1,unshelftableData.pageSize);
			}
			const loadProduct = function(data) {
				shelfdata.data = data
				if(shelfdata.data.treepath){
					allchildrendisabled.value=false;
				}else{
					allchildrendisabled.value=true;
					allchildren.value=true;
				}
				if(shelfdata.data.treepath){
					shelfApi.getShelfInfo({'shelfid':shelfdata.data.id}).then((res)=>{
						console.log(res);
						shelfdata.usesize=res.data.usesize;
					});
				}else{
					shelfdata.usesize=0;
				}
				
				getshelfList();
				getunshelfList();
			}
			function getshelfList(currentpage=1,pagesize=10){
				var param={};
				if (!shelfdata.data.search) {
					shelfdata.data.search = "";
				}
				param.pagesize=pagesize;
				param.currentpage= currentpage;
		        param.search=shelfdata.data.search;
				if(allchildren.value){
				   param.allchildren=  "true";
				}else{
				   param.allchildren=  "false";
				}
				if(shelfdata.data.treepath){
					param.shelfid=shelfdata.data.id;
					param.warehouseid=shelfdata.data.warehouseid;
				}else{
					param.shelfid="";
					param.warehouseid=shelfdata.data.id;
				}
			    tableData.page	=currentpage;
				tableData.pageSize	=pagesize;	
				param.sort=tableData.sort;
				param.order=tableData.order;
				shelfproductApi.getShelfInventoryList(param).then(function(response) {
					if(response&&response.data){
						tableData.records = response.data.records;
						tableData.total=response.data.total;
						tableData.records.forEach((items) => {
							items.visible = false
						})
					}
				})
			}
			function allchildrenChange(value){
				getshelfList();
			}

			//弹窗搜索
			//方法
			//获取暂存库存列表
			function getunshelfList(currentpage=1,pagesize=10) {
				if (!shelfdata.data.search) {
					shelfdata.data.search = "";
				}
				var warehouseid = shelfdata.data.warehouseid;
				var shelfid = "";
				if (!shelfdata.data.treepath) {
					warehouseid = shelfdata.data.id;
				} else {
					shelfid = shelfdata.data.id;
				}
				unshelftableData.page	=currentpage;
				unshelftableData.pageSize	=pagesize;	 
				shelfproductApi.getShelfList({
					"warehouseid": warehouseid,
					"shelfid": shelfid,
					"pagesize": pagesize,
					"currentpage": currentpage,
					"search":shelfdata.data.search,
					"sort":unshelftableData.sort,
					"order":unshelftableData.order
				}).then(function(response) {
					if (response.data.records) {
						unshelftableData.records = response.data.records;
						unshelftableData.total=response.data.total;
					}
				})
			}
           watch(skuSearch, (val) => {
				shelfdata.data.search = val
				getunshelfList();
				getshelfList();
			})
			//批量上架产品
			const getshelfsdata = () => {
				let arr = []
				diglogunshelftableData.value.forEach((item, index) => {
						const rows = {}
						rows.materialid = item.materialid
						rows.quantity = item.quantity
						rows.shelfid = shelfdata.data.id
						rows.opt = 1
						arr.push(rows)
				})
				return arr
			}

			function closeDialog() {
				checkall.value = false
			}
			//批量上架
			const submitShelf = async () => {
				let arr = getshelfsdata()
				if (arr == '') {
					ElMessage({
						message: '您没有选择上架的产品!',
						type: 'error',
					})
				}
				if(!shelfdata.data.treepath){
					ElMessage({
						message: '必须选中库位！',
						type: 'error',
					});
					return;
				}
				var datas = await shelfproductApi.addShelfInventory(arr)
				var title = '成功上架产品到' + shelfdata.data.number + '-' + shelfdata.data.name;
				if (datas && datas.code == "201") {
					ElMessage({
						message: title,
						type: 'success',
					})
					loadProduct(shelfdata.data);
					GroundingVisible.value = false
				}
				
			}
			//单个上架产品
			function addOffTheShelf(row,index){
				let arr = []
				let obj = {}
				obj.materialid = row.materialid
				if (row.amount) {
					obj.quantity = row.amount
				} else {
					ElMessage({
						message: '数量不能为空！',
						type: 'error',
					})
					return
				}
				obj.shelfid = shelfdata.data.id
				if(!shelfdata.data.treepath){
					ElMessage({
						message: '必须选中库位！',
						type: 'error',
					});
					return;
				}
				obj.opt = 1
				arr.push(obj)
				shelfproductApi.addShelfInventory(arr).then(function(response) {
					if (response.code == "201") {
						ElMessage({
							message: '上架成功！',
							type: 'success',
						})
						//unshelftableData.list[index].visible = false
						loadProduct(shelfdata.data);
					}
				})
			}
			//单个下架产品
			function submitOffTheShelf(row, index) {
				let arr = []
				let obj = {}
				obj.materialid = row.materialid
				if (row.amount) {
					obj.quantity = row.amount
				} else {
					ElMessage({
						message: '数量不能为空！',
						type: 'error',
					})
					return
				}
				obj.shelfid = row.shelfid
				obj.opt = 0
				arr.push(obj)
				shelfproductApi.subShelfInventory(arr).then(function(response) {
					if (response.code == "201") {
						ElMessage({
							message: '下架成功！',
							type: 'success',
						})
						//tableData.list[index].visible = false
						loadProduct(shelfdata.data);
					}
				})
			}
			//批量下架产品
			function submitOffTheShelfs() {
				let arr = []
				offShelftableData.value.forEach((item) => {
					const obj = {};
					obj.materialid = item.materialid;
					obj.shelfid = item.shelfid;
					obj.quantity = item.quantity;
					obj.opt = 0;
					arr.push(obj);
				})
				console.log("arr",arr)
				shelfproductApi.subShelfInventory(arr).then(function(response) {
					if (response.code == "201") {
						ElMessage({
							message: '下架成功！',
							type: 'success',
						});
						offShelfVisible.value = false;
						loadProduct(shelfdata.data);
					}
				})
				
			}
			let offshelfState = false
			let unoffshelfState = false
	        //上架产品
			function addShelf() {
				if(unoffshelfState){
					GroundingVisible.value = true
				}else{
					ElMessage({
						message: '请选择要上架的产品！',
						type: 'error',
					})
				}
				
				dialogTitle.value = shelfdata.data.number + '-' + shelfdata.data.name
			}
			//下架产品
			function subShelfs() {
				if (offshelfState) {
					offShelfVisible.value = true
				} else {
					ElMessage({
						message: '请选择要下架的产品！',
						type: 'error',
					})
				}
				dialogTitle.value = shelfdata.data.number + '-' + shelfdata.data.name

			}
			const selectCheckboxShelf = function(selection) {
				offShelftableData.value = selection
				if (selection.length > 0) {
					offshelfState = true
				} else {
					offshelfState = false
				}
			}
			const selectCheckboxunShelf = function(selection) {
				diglogunshelftableData.value = selection
				if (selection.length > 0) {
					unoffshelfState = true
				} else {
					unoffshelfState = false
				}
			}
			function getRowKeys(row) {
				return row.id
			}
			function handleSizeChange(size){
			    pagesize.value = size
				loadtableData()
			}
			function handleCurrentChange(val){
			    currentPage.value = val;
				loadtableData()
			}
			return {
				addOffTheShelf,
				pagesize,
				currentPage,
			    unShelfPaginationSize ,
			    unShelfPaginationCurrent,
			    shelfPaginationSize,
			    shelfPaginationCurrent,
				getRowKeys,
				closeDialog,
				getshelfsdata,
				submitOffTheShelf,
				submitOffTheShelfs,
				dialogSearch,
				dialogTitle,
				submitShelf,
				shelfdata,
				offshelfState,
				unoffshelfState,
				offShelftableData,
				unshelftableData,
				tablabel,
				loadProduct,
				GroundingVisible,
				offShelfVisible,
				tableData,
				search,
				addShelf,
				checkall,
				number,
				selectCheckboxShelf,
				selectCheckboxunShelf,
				subShelfs,
				getunshelfList,
				diglogunshelftableData,
				skuSearch,
				allchildren,
				allchildrenChange,
				allchildrendisabled,
				shelfSort,
				unshelfSort,
			}
		},

		//提交上架产品

	}
</script>

<style>
	.btn-header {
		display: flex;
		justify-content: space-between;
	}
	.btn-header .rt-btn-group button{
		margin-right:8px;
	}
	.con-header {
		padding: 16px;
		border-bottom: 1px solid var(--el-border-color-light);
		margin-bottom: 16px;
	}

	.sys-table {
		width: 100%;
		margin-bottom: 16px;
		margin-top: 16px;
	}

	.inp-box {
		margin-bottom: 16px;
	}

	.con-body {
		margin: 16px;
	}

	.rt-btn-group {
		display: flex;
	}
</style>
