<template>
    <div class="main-sty">
        <div class="con-header">
        <el-row>
            <el-space >
                <el-button type="primary" class="im-but-one">
                    <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
                    <span>添加标签</span>
                </el-button>
                <el-dropdown trigger="click">
                    <el-button>
                        更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu >
                            <el-dropdown-item>导入</el-dropdown-item>
                            <el-dropdown-item>导出</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-select v-model="markType"  placeholder="标签类型">
                    <el-option  v-for="item in markData"   :key="item.value"  :label="item.label" :value="item.value"   >
                    </el-option>
                </el-select>
                <el-input  v-model="searchKeywords" placeholder="请输入" class="input-with-select" >
                    <template #prepend>
                        <el-select v-model="selectlabel" placeholder="SKU" style="width: 110px">
                            <el-option label="标签名称" value="1"></el-option>
                            <el-option label="创建人" value="2"></el-option>
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
			<GlobalTable ref="globalTable" :tableData="tableData"  @loadTable="loadTableData" border style="width: 100%;margin-bottom:16px;"
			 @selectionChange = "selectRow">
               <template #field>
                <el-table-column type="selection" width="38" />
                <el-table-column prop="name"  label="标签名称"  />
                <el-table-column prop="types"  label="标签类型"  />
                <el-table-column prop="person"  label="创建人"   />
                <el-table-column prop="time"  label="创建时间"  />
                <el-table-column prop="remaks"  label="备注"   />
                <el-table-column prop="operate"  label="操作" width="140"  >
                    <template #default="scope">
                        <el-button class='el-button--blue' @click="(scope.$index, scope.row)">详情</el-button>
                        <el-button class='el-button--blue' @click="(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </template>
            </GlobalTable>
        </el-row>

    </div>
</template>
<script>
    import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
    import { ref,reactive,onMounted } from 'vue'
    import {Search,ArrowDown,} from '@element-plus/icons-vue'
     import GlobalTable from "@/components/Table/GlobalTable/index";
    export default{
        name: 'Mark',
        components:{
			GlobalTable,
            Help,
            Search,
            Plus,
            ArrowDown
        },
        setup(){
            let markType=ref('')
            let markData = [
                    {label:'节日',value:'1'},{label:'策略',value: '2'},{label:'状态',value: '3'}
                ]
            let tableData=[
                {
                    name:'圣诞节',
                    types:'节日',
                    person:'张三',
                    time:'2020-02-14',
                    remaks:'',
                }
            ]
			let total =ref(1)
            let pagesize=ref(10)
            let currentPage=ref(1)
            //数据接收
                return{
                tableData,
                pagesize,
                currentPage,
				total,
                markType,
                markData,
            }
        }

    }
</script>
<style>
    .con-header .el-row{margin-bottom:16px;}
</style>