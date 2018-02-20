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
        <el-input v-model="query" placeholder="请输入内容" class="search">
            <el-button @click="findMan" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="dialogVisibleAdd = true">添加用户</el-button>
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
                prop="role_name"
                label="角色">
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
                    <el-button @click='editDialog(scope.row)' size='small' plain type="primary" icon="el-icon-edit"></el-button>
                    <el-button @click="removeDialog(scope.row)" size='small' plain type="danger" icon="el-icon-delete"></el-button>
                    <el-button @click="setUserRoles(scope.row)" size='small' plain type="success" icon="el-icon-check"></el-button>
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

        <!-- 添加用户弹出框 -->
        <el-dialog
        title="添加用户"
        @close="closeDialogUser('add')"
        :visible.sync="dialogVisibleAdd"
        width="40%"  class="demo-ruleForm">
            <el-form ref="addUserForm" :rules="rules" :model="auser" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="auser.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="auser.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="auser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="auser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="AddUserSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户弹出框 -->
        <el-dialog
        title="编辑用户"
        @close="closeDialogUser('edit')"
        :visible.sync="dialogVisibleEdit"
        width="40%"  class="demo-ruleForm">
            <el-form ref="editUserForm" :rules="rules" :model="euser" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-button type="success" plain disabled>{{ euser.username }}</el-button>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="euser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="euser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="EddUserSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 设置用户的权限 -->
        <el-dialog
        title="请选择"
        @close="closeDialogUser('setRoles')"
        :visible.sync="dialogVisibleSetRoles"
        width="40%"  class="demo-ruleForm">
            <div>
                <p>当前的用户名: {{ RolesName.username }}</p>
                <span>请选择角色：</span><el-select v-model="RolesValue" placeholder="请选择岗位权限">
                    <el-option
                    v-for="item in RolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleSetRoles = false">取 消</el-button>
                <el-button type="primary" @click="SetRolesSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { usersData, usersStateChange, addUser, getUserById, editUser, deleteUser, findUser, RolesList, getRoles } from '../../api/api'
    export default {
        data() {
            return {
                auser: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                euser: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    id: ''
                },
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
                pagesize: 5,  // 每页显示多少条数据
                currentPage: 1, // 当前是第几页数据
                total: 0,  // 管理员总条数
                tableData: [], // 管理员实际总条数列表
                dialogVisibleAdd: false,  // 添加用户
                dialogVisibleEdit: false, // 编辑用户
                dialogVisibleSetRoles: false,
                RolesName: {}, // 设置权限时获取用户名
                RolesValue: '', // 选择框 RolesValue
                query: '',
                RolesList: [] // 所要设置的成员列表
            }
        },
        mounted() {
            this.initList();
        },
        methods: {
            // 设置权限弹框
            setUserRoles(row){
                this.RolesName = row;
                RolesList().then(res => {
                    if(res.meta.status === 200) {
                        this.RolesList = res.data
                    }
                })
                // console.log(RoleList);
                this.dialogVisibleSetRoles = true;
            },
            // 设置权限确定按钮
            SetRolesSubmit(){
                getRoles({ id: this.RolesName.id, rid: this.RolesValue }).then(res => {
                    if (res.meta.status === 200) {
                        // 隐藏弹窗
                        this.dialogVisibleSetRoles = false
                        // 提示
                        this.$message({
                            type: 'success',
                            message: res.meta.msg
                        })
                        this.initList()
                    }
                })
            },
            // 添加管理员
            AddUserSubmit(){
                this.$refs['addUserForm'].validate(valid => {
                    if(valid) {
                        addUser(this.user).then(res => {
                            console.log(res);
                            if(res.meta.status === 201) {
                                this.dialogVisibleAdd = false;
                                this.initList();
                            }
                        })
                    }
                })
            },
            // 关闭 dialog
            closeDialogUser(flag){
                if(flag === "add"){
                    this.dialogVisibleAdd = false;                    
                }else if(flag === 'edit'){
                    this.dialogVisibleEdit = false; 
                }else{
                    this.dialogVisibleSetRoles = false; 
                }
            },
            // 管理员使用状态的切换
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
            // -------------------------------- 编辑列表 ------------------------------------
            // 编辑弹框,获取最新的数据库，添加到弹出框
            editDialog(row){
                getUserById({ id: row.id }).then(res => {
                    if(res.meta.status === 200) {
                        // 填充表单
                        this.euser.id = res.data.id
                        this.euser.username = res.data.username
                        this.euser.email = res.data.email
                        this.euser.mobile = res.data.mobile
                        // 显示弹窗
                        this.dialogVisibleEdit = true
                    }
                })
            },
            EddUserSubmit(){
                this.$refs['editUserForm'].validate(valid => {
                    if(valid) {
                        editUser(this.euser).then(res => {
                            if (res.meta.status === 200) {
                                // 关闭窗口
                                this.dialogVisibleEdit = false
                                // 刷新列表
                                this.initList()
                            }
                        })
                    }
                })
            },
            // --------------------------------- 删除列表 ------------------------------------
            removeDialog(row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUser({ id: row.id }).then(res => {
                        if(res.meta.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.initList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },

            // --------------------------------- 查询管理员 ----------------------------------
            findMan(){
                this.initList()
            },

            // 提交编辑，已经编辑好图书，点击确定，把编辑好的图书同步到数据库
            // 分页每页条数
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize = val;
                this.initList()
            },
            // 分页当前页码数
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.initList()
            },
            // 初始化数据 ：页面打开，请求数据，对页面进行渲染
            initList() {
                usersData({
                    query: this.query,
                    pagenum: this.currentPage,
                    pagesize: this.pagesize
                }).then((res) => {
                    // console.log(res);
                    if(res.meta.status === 200) {
                        this.tableData = res.data.users
                        this.total = res.data.total
                        this.currentPage = res.data.pagenum
                    }
                })
            },
            handleClose(){}
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


