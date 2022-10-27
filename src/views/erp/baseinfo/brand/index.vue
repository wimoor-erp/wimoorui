<template>
    <div class="main-sty">
        <div class="con-header">
            <el-row>
                <el-space >
                    <el-button type="primary" class="im-but-one">
                        <plus theme="outline" size="18" fill="#fff" :strokeWidth="4"/>
                        <span>添加品牌</span>
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
                    <el-input  v-model="searchKeywords" placeholder="请输入" class="input-with-select" >
                        <template #prepend>
                            <el-select v-model="selectlabel" placeholder="品牌名称" style="width: 110px">
                                <el-option label="品牌名称" value="1"></el-option>
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
            <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%;margin-bottom:16px;">
                <el-table-column type="selection" width="38" />
                <el-table-column prop="name"  label="品牌名称" sortable />
                <el-table-column prop="person"  label="创建人"  sortable />
                <el-table-column prop="time"  label="创建时间" sortable />
                <el-table-column prop="remaks"  label="备注"  sortable />
                <el-table-column prop="operate"  label="操作" width="140" sortable >
                    <template #default="scope">
                        <el-button class='el-button--blue' @click="(scope.$index, scope.row)">详情</el-button>
                        <el-button class='el-button--blue' @click="(scope.$index, scope.row)">编辑</el-button>
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
    import {MenuUnfold,Plus,SettingTwo,Help,Copy,MoreOne} from '@icon-park/vue-next';
    import { ref,reactive,onMounted } from 'vue'
    import {Search,ArrowDown,} from '@element-plus/icons-vue'
    export default{
        name: 'Mark',
        components:{
            Help,
            Search,
            Plus,
            ArrowDown
        },
        setup(){
            let selectlabel =ref('')
            let tableData=[
                {
                    name:'kuuqa',
                    person:'张三',
                    time:'2020-02-14',
                    remaks:'',
                }
            ]
            let pagesize=10
            let currentPage=1
            //方法
            function handleSizeChange(size){
                pagesize = size
            }
            function handleCurrentChange(currentPage){
                currentPage = currentPage;
            }
            //数据接收
            return{
                selectlabel,
                tableData,
                pagesize,
                currentPage,
            }
        }

    }
</script>
<style>
    .con-header .el-row{margin-bottom:16px;}
</style>