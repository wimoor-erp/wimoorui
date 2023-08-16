<template>
    <div class="main-sty">
        <div class="con-header">
			<el-row>
				<el-space>
					<AdGroup  :border="true"/>
				    <el-select v-model="campagin" placeholder="全部广告活动" clearable filterable >
						<el-option v-for="item in campaginsData" :label="item.name" :value="item.value"></el-option>
					</el-select>
				    <el-select v-model="campagin" placeholder="全部广告组" clearable filterable >
						<el-option v-for="item in campaginsData" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-space>
			</el-row>
            <el-row>
                <el-space >
                    <el-button @click="Add" type="primary" class="im-but-one">
                        <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
                        <span>添加提醒</span>
                    </el-button>
                    <el-input  v-model="searchKeywords" @input="loadData" placeholder="请输入品牌名称" clearable="true" class="input-with-select" >
                        <!-- <template #prepend>
                            <el-select v-model="selectlabel" placeholder="品牌名称" style="width: 110px">
                                <el-option label="品牌名称" value="1"></el-option>
                                <el-option label="创建人" value="2"></el-option>
                            </el-select>
                        </template> -->
                        <template #append>
                            <el-button @click.stop="loadData">
                                <el-icon style="font-size: 16px;align-itmes:center">
                                    <search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </el-space>
                <div class='rt-btn-group'>
                    <el-button   class='ic-btn' title='帮助文档'>
                        <help theme="outline" size="16" :strokeWidth="3"/>
                    </el-button>
                </div>
            </el-row>
        </div>
        <!--表单-->
        <el-row>
            <GlobalTable ref="globalTable" :tableData="tableData" @selectionChange='handleSelect' :defaultSort="{ prop: 'opttime', order: 'descending' }"  @loadTable="loadTableData" :stripe="true" 
			height="calc(100vh - 198px)"
			>
            	<template #field>
               <!-- <el-table-column type="selection" width="38" /> -->
                <el-table-column prop="name"  label="品牌名称" sortable />
				<el-table-column prop="remark"  label="备注"   />
                <el-table-column prop="opttime"  label="操作时间" sortable />
                <el-table-column prop="operate"  label="操作" width="140" sortable >
                    <template #default="scope">
                        <el-button class='el-button--blue' @click="Edit(scope.row)">编辑</el-button>
                        <el-button class='el-button--blue' @click="Remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
				</template>
            </GlobalTable>
        </el-row>

    </div>
	<el-dialog
	   v-model="dialogVisible"
	   title="编辑品牌"
	   width="400px"
	 >
	<el-form
	    ref="dataFormRef"
	    :model="formData"
	    :rules="rules"
	  >
	    <el-form-item label="品牌名称" prop="name">
	      <el-input v-model="formData.name" placeholder="请输入品牌名称" />
	    </el-form-item>
		<el-form-item label="品牌备注" prop="remark">
		  <el-input v-model="formData.remark" :rows="5" placeholder="请输入备注..." type="textarea" />
		</el-form-item>
	  </el-form>
	   <template #footer>
	     <span class="dialog-footer">
	       <el-button @click.stop="cancel">取消</el-button>
	       <el-button type="primary" @click.stop="submitForm">
	         提交
	       </el-button>
	     </span>
	   </template>
	 </el-dialog>

</template>
<script setup>
    import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
    import {Search,ArrowDown,} from '@element-plus/icons-vue'
	import { ElMessage, ElMessageBox,ElForm } from 'element-plus'
	import {ref,reactive,toRefs,onMounted}from"vue";
	import AdGroup from '@/components/header/ad_group.vue';
</script>
<style>
</style>