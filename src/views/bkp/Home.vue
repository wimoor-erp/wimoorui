<template>
  <div class="home main-sty">
      <div >
          <el-button type="primary" @click="add" >新增</el-button>
          <el-button type="info" >导入</el-button>
          <el-button type="info" >导出</el-button>
      </div>
      <div  style="margin: 10px 0;">
          <el-input v-model="search" placeholder="请输入姓名" clearable style="width: 20%;" />
          <el-button type="primary" style="margin-left: 5px;" @click="querySearch">查询</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" sortable />
          <el-table-column prop="username" label="账号"  sortable />
          <el-table-column prop="name" label="名称"  sortable />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="address" label="地址" />
          <el-table-column   label="操作" width="180">
              <template #default="scope">
                  <el-button type="default" size="mini" plain @click="handleEdit(scope.row)">编辑</el-button>
                  <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.id)">
                      <template #reference>
                          <el-button type="danger" size="mini" >删除</el-button>
                      </template>
                  </el-popconfirm>
              </template>
          </el-table-column>
      </el-table>
      <div style="margin:10px 0;">
          <el-pagination 
                  v-model="currentPage"
                  :page-sizes="[5,10, 20, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
          >
          </el-pagination>
          <el-dialog
                  v-model="dialogVisible"
                  title="新增/编辑用户"
                  width="30%"
          >
              <el-form :model="form"   label-width="120px">
                  <el-form-item label="用户名">
                      <el-input v-model="form.username" style="width: 80%;"></el-input>
                  </el-form-item>
                  <el-form-item label="名称">
                      <el-input v-model="form.name" style="width: 80%;"></el-input>
                  </el-form-item>
                  <el-form-item label="年龄">
                      <el-input v-model="form.age" style="width: 80%;"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                      <el-radio v-model="form.sex" label="男">男</el-radio>
                      <el-radio v-model="form.sex" label="女">女</el-radio>
                  </el-form-item>
                  <el-form-item label="地址">
                      <el-input v-model="form.address" style="width: 80%;"></el-input>
                  </el-form-item>

              </el-form>
              <template #footer>
              <span class="dialog-footer">
                <el-button    @click="cancelModal">取消</el-button>
                <el-button type="primary" @click="addusers"
                >确认</el-button>
              </span>
              </template>
          </el-dialog>
          <el-button :plain="true" class="hide"   @click="successMsg">success</el-button>
          <el-button :plain="true" class="hide"   @click="warningMsg">success</el-button>
          <el-button :plain="true" class="hide"    @click="infoMsg">success</el-button>
          <el-button :plain="true" class="hide"   @click="errorMsg">success</el-button>
      </div>
  </div>
</template>

<script>

import request from "@/utils/request";
import {ElMessage} from "element-plus";
//import axios from "axios";


export default {
  name: 'Home',
  components: {

  },
    data() {
        return {
            tableData: [

            ],
            search:'',
            currentPage:1,
            pageSize:10,
            total:0,
            dialogVisible:false,
            form:{},

        }
    },
    created() {
      //  this.loadUserList();
    },
    methods:{
        loadUserList(){
            request.get("/erp/api/v1/purchase_form/list", {
                params:{
                    page:1,
                    limit:10
                }
            }).then(res=>{
                this.tableData=res.data.records;
                this.total=res.data.total;
            });
        },
        add(){
            this.dialogVisible=true;
            this.form={};
        },
        handleEdit(row){
            this.form = JSON.parse(JSON.stringify(row));
            this.dialogVisible=true;
        },
        handleDelete(id){
            this.form.id=id;
            request.post("/api/user/deleteUser",this.form).then(res => {
                if(res.code=="0"){
                    this.loadUserList();
                    this.successMsg();
                }else{
                    this.errorMsg();
                }
            });
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize;
            this.loadUserList();
        },
        handleCurrentChange(pageNum){
            this.currentPage = pageNum;
            this.loadUserList();
        },
        addusers(){
            if(this.form.id){
                //更新
                request.post("/api/user/update",this.form).then(res=>{
                    if(res.code=="0"){
                        this.cancelModal();
                        this.loadUserList();
                        this.successMsg();
                    }else{
                        this.errorMsg();
                    }
                });
            }else{
                //新增
                request.post("/api/user/add",this.form).then(res=>{
                    if(res.code=="0"){
                        this.cancelModal();
                        this.loadUserList();
                        this.successMsg();
                    }else{
                        this.errorMsg();
                    }
                });
            }

        },
        warningMsg(){
            ElMessage({
                message: '请注意!',
                type: 'warning',
            })
        },
        successMsg(){
            ElMessage({
                message: '操作成功!',
                type: 'success',
            })
        },
        infoMsg(){
            ElMessage('消息......')
        },
        errorMsg(){
            ElMessage.error('操作失败!')
        },
        cancelModal(){
            this.dialogVisible = false;
        },
        querySearch(){
            this.currentPage=1;
            this.loadUserList();
        }
    },
}
</script>
