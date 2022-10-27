<template>
	<el-dialog v-model="priceVisable" title="采购阶梯价格编辑">
		<el-table border :data="tableData" >
			<el-table-column type="index" label="序号" width="50">
				<template #header>
					<span>序号</span>
				</template>
			</el-table-column>
			<el-table-column label="采购量">
				<template #default="scope">
					<el-space>
						<el-input v-model="scope.row.starnum" placeholder="起订量" :disabled="scope.$index!==0"></el-input>
						<span>-</span>
						<el-input v-model="scope.row.endnum" @change="putval(scope.row,scope.$index)"></el-input>
					</el-space>
				</template>	
			</el-table-column>
			<el-table-column label="币种">
				<template #default="scope">
					<el-select  v-model="scope.row.currenty" placeholder="USD" >
					  <el-option label="USD" value="USD" />
					  <el-option label="CNY" value="CNY" />
					  <el-option label="ES" value="ES" />
					 </el-select>
				</template>
			</el-table-column>
			<el-table-column label="采购单价">
				<template #default="scope">
					<el-input v-model="scope.row.price"></el-input>
				</template>	
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-space>
						<el-link v-if="tableData.length-1==scope.$index" title="添加" :underline="false" type="primary" @click="addladder(scope.row,scope.$index)">
						  <plus  class="ic-cen" theme="outline" size="24" :strokeWidth="3"/>
						 </el-link>
						<el-link title="删除" v-if="scope.$index>0&&tableData.length-1==scope.$index" type="primary" :underline="false" @click="removePrice">
							<minus  class="ic-cen" theme="outline" size="24"  :strokeWidth="3"/>
						</el-link>
					</el-space>
				</template>	
			</el-table-column>
		</el-table>
		<template #footer>
			<el-button @click="priceVisable=false">取消</el-button>
			<el-button type="primary" @click="submitprice" >提交</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import {ref,reactive} from 'vue'
	import {Plus,Minus} from '@icon-park/vue-next';
	import {ElMessage} from 'element-plus';
	export default{
		components: {
			Plus,Minus,
		},
		emits:["getprice"],
		setup(props,context){
			let priceVisable = ref(false)
			let tableData =reactive([
				{
					starnum:'',
					endnum:'',
					currenty:'USD',
					price:'',
				},
			])
			function addladder(row,index){
				tableData.push({
					starnum:'',
					endnum:'',
					currenty:'USD',
					price:'',
				})
				putval(row,index)
			}
			function removePrice(){
				tableData.pop()
			}
			function putval(row,index){
				if(parseInt(row.endnum)<=parseInt(row.starnum)){
					ElMessage({
						message:'需大于起订量',
						type:"error",
					})
					row.endnum = ""
				}
				if(tableData[index+1]){
					if(row.endnum==""){
						tableData[index+1].endnum = ''
					}else{
						tableData[index+1].starnum = parseInt(row.endnum)+1
					}
					
				}
			}
			
			function submitprice(){
				tableData.forEach((item)=>{
					if(item.starnum!==""&&item.endnum!==""&&item.price!==""){
						priceVisable.value =false
						context.emit("getprice",tableData)
					}else{
						ElMessage({
							message:'数据不能为空',
							type:"error",
						})
					}
				})
			}
			return{
			priceVisable,
			tableData,
			addladder,
			removePrice,
			putval,
			submitprice,
			}
		}
		}
</script>

<style>
</style>
