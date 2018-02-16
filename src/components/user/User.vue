<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-input placeholder="请输入内容" class="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>成功按钮</el-button>
        <el-table
        border
        :data="tableData"
        style="width: 100%">
            <el-table-column
                type="index"
                label="#"
                width="50">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="用户状态">
                <!-- 使用作用域插槽来定制数据的显示 -->
                <template slot-scope="scope">
                    <el-switch @change='usersToggle(scope.row)' v-model="scope.row.mg_state"></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <!-- 使用作用域插槽来定制数据的显示 -->
                <template slot-scope="scope">
                    <el-button size='small' type="primary" icon="el-icon-edit"></el-button>
                    <el-button size='small' type="danger" icon="el-icon-delete"></el-button>
                    <el-button size='small' type="primary" icon="el-icon-edit"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import { usersData, usersStateChange } from '../../api/api'
    export default {
        data() {
            return {
                pagesize: 5,  // 每页显示多少条数据
                currentPage: 1, // 当前是第几页数据
                total: 0,  // 管理员总条数
                tableData: [] // 管理员实际总条数列表
            }
        },
        mounted() {
            this.initList();
        },
        methods: {
            usersToggle(data){
                usersStateChange({
                    uId: data.id,  // 管理员 id
                    state: data.mg_state // 是否启用管理员状态
                }).then(res => {
                    console.log(data);
                    if(res.data.status === 200) {
                        this.$message({
							message: res.meta.msg,
							type: 'success'
						});
                    }
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize = val;
                this.initList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.initList()
            },
            initList() {
                usersData({
                    query: '',
                    pagenum: this.currentPage,
                    pagesize: this.pagesize
                }).then((res) => {
                    console.log(res);
                    if(res.meta.status === 200) {
                        this.tableData = res.data.users
                        this.total = res.data.total
                        this.currentPage = res.data.pagenum
                    }
                })
            }
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
    .search {
        width: 300px;
    }
</style>


