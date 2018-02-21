<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>

        <!-- 添加分类按钮 -->
        <el-button class="el-btn" type="success" plain @click="addCategory = true">添加分类</el-button>

        <!-- 树状结构 -->
        <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" @deleteCate="deleteCategory" @showForm="showEditForm" @refresh="initList"></tree-grid>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        <!-- 添加分类弹出框 -->
        <el-dialog
        title="添加用户"
        @close="closeDialogCate('add')"
        :visible.sync="addCategory"
        width="40%"  class="demo-ruleForm">
            <el-form ref="userform" :rules="rules" :model="cate" label-width="80px">
                <el-form-item label="用户名" prop='username'>
                    <el-input v-model="cate.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop='password'>
                    <el-input v-model="cate.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop='email'>
                    <el-input v-model="cate.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop='mobile'>
                    <el-input v-model="cate.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCategory = false">取 消</el-button>
                <el-button type="primary" @click="AddCateSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import TreeGrid from './TreeGrid.vue'
    import { getCateLsit } from "../../api/api";
    export default {
        data(){
            return {
                currentPage: 1,
                pagesize: 5,
                total: 10,
                addCategory: false,
                rules: {
                    username: [
                        { required: true, message: '请输入您的用户名', tigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入您的密码', tigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入您的用户名', tigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入您的密码', tigger: 'blur' }
                    ]
                },
                cate: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    id: ''
                },
                columns: [{
                    text: '分类名称',
                    dataIndex: 'cat_name',
                    width: 500
                }, {
                    text: '是否有效',
                    dataIndex: 'cat_deleted',
                    width: 100
                }, {
                    text: '排序',
                    dataIndex: 'cat_level',
                    width: 100
                }],
               dataSource: []
            }
        },
        methods: {
            cateList(){
                getCateLsit({ type: 3, pagenum: this.currentPage, pagesize: this.pagesize }).then(res => {
                    if(res.meta.status === 200) {
                        this.dataSource = res.data.result
                        // console.log(this.dataSource);
                        this.pagesize = res.data.pagesize;
                        // this.currentPage = res.data.pagenum;
                        this.total = res.data.total;
                    }
                    
                })
            },
            // 提交编辑，已经编辑好图书，点击确定，把编辑好的图书同步到数据库
            // 分页每页条数
            handleSizeChange(val) {
                this.pagesize = val;
                this.cateList()
            },
            // 分页当前页码数
            handleCurrentChange(val) {
                this.currentPage = val
                this.cateList()
            },
            closeDialogCate(){},
            AddCateSubmit(){},
            deleteCategory(){},
            showEditForm(){},
            initList(){}
        },
        mounted(){
            this.cateList();
        },
        components: {
            TreeGrid
        }
    }
</script>

<style scoped>
    .el-breadcrumb {
        background-color: #D3DCE6;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
    }
    .el-pagination {
        background-color: #D3DCE6;
        padding-top: 10px;
        height: 35px;
        line-height: 35px;
    }

    .el-btn{
        margin: 10px 0;
    }
</style>


