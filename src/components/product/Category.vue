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
        <el-button class="el-btn" type="success" plain @click="addCate">添加分类</el-button>

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
        width="40%">
            <div>
                <span>分类名称</span>
                <el-input class="cateWidth" v-model="cate.cat_name"></el-input>
            </div>
            <div>
                <span>父级分类</span>
                <el-cascader
                    :options="cateLists"
                    v-model="selectedOptions"
                    :props="options"
                    @change="handleChange"
                    :show-all-levels="false">
                </el-cascader>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCategory = false">取 消</el-button>
                <el-button type="primary" @click="AddCateSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import TreeGrid from './TreeGrid.vue'
    import { getCateLsit, addCateapi } from "../../api/api";
    export default {
        data(){
            return {
                options: {
                    value: 'cat_id',
                    label: 'cat_name'
                },
                currentPage: 1,
                pagesize: 5,
                total: 10,
                addCategory: false,
                cate: {
                    cat_pid: '',
                    cat_name: ''
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
               dataSource: [],
               selectedOptions: [],
               cateLists: []
            }
        },
        methods: {
            cateList(){
                getCateLsit({ type: 3, pagenum: this.currentPage, pagesize: this.pagesize }).then(res => {
                    if(res.meta.status === 200) {
                        this.dataSource = res.data.result
                        // console.log(this.dataSource);
                        this.pagesize = res.data.pagesize;
                        this.total = res.data.total;
                    }
                    
                })
            },
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
            // 添加分类
            addCate(){
                getCateLsit({type: 2}).then(res => {
                    if (res.meta.status === 200) {
                        this.cateLists = res.data
                        this.addCategory = true
                    }
                })
            },
            // 点击更改分类
            handleChange(){

            },
            closeDialogCate(){},
            AddCateSubmit(){
                if (this.selectedOptions.length === 0) {
                    this.cate.cat_pid = 0
                } else {
                    this.cate.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
                }

                addCateapi(this.cate).then(res => {
                    if(res.meta.status === 201) {
                        this.cateList();
                        this.addCategory = false;
                        this.$message({
                            type: 'success',
                            message: res.meta.msg
                        })
                    }
                })
            },
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
    .cateWidth{
        width: 150px;
    }
</style>


