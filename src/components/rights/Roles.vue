<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
                    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-button type="success" plain @click="dialogVisibleAdd = true">添加用户</el-button>

        <!-- 添加用户弹出框 -->
        <el-dialog
        title="添加用户"
        @close="closeDialogRoles('add')"
        :visible.sync="dialogVisibleAdd"
        width="40%"  class="demo-ruleForm">
            <el-form ref="addRolesForm" :rules="rules" :model="rolesAdd" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolesAdd.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="rolesAdd.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="AddRulesSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户弹出框 -->
        <el-dialog
        title="编辑用户"
        @close="closeDialogRoles('edit')"
        :visible.sync="dialogVisibleEdit"
        width="40%"  class="demo-ruleForm">
            <el-form ref="editRolesForm" :rules="rules" :model="rolesEdit" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolesEdit.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="rolesEdit.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="EditRulesSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户权限框 -->
        <el-dialog
        title="角色授权"
        @close="closeDialogRoles('change')"
        :visible.sync="dialogVisibleChange"
        width="40%"  class="demo-ruleForm">
            <el-tree
            ref="tree"
            :props="propsTree"
            :data="dataTree"
            node-key="id"
            show-checkbox
            :default-checked-keys="selectTree"
            default-expand-all>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleChange = false">取 消</el-button>
                <el-button type="primary" @click="ChangeRulesSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 角色列表 -->
        <el-table
        border
        :data="tableData"
        @expand-change="expandChange"
        style="width: 100%">
            <el-table-column type="expand" label="点击展开" width="80">
                <template slot-scope="scope">
                    <el-row :key="item.id" v-for="item in scope.row.children">
                        <el-col :span="3">
                            <el-tag @close="deleteRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
                            <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
                        </el-col>
                        <el-col :span="21">
                            <el-row class="authlist" :key="tag.id" v-for="tag in item.children">
                                <el-col :span="4">
                                    <el-tag @close="deleteRight(scope.row, tag.id)" type="success" closable>{{tag.authName}}</el-tag>
                                    <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleteRight(scope.row, btn.id)" :key="btn.id" type="warning" closable v-for="btn in tag.children">{{btn.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column
                type="index"
                label="#"
                width="50">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="描述"
                width="500">
            </el-table-column>
            <el-table-column
                label="操作"
                width="250">
                <!-- 使用作用域插槽来定制数据的显示 -->
                <template slot-scope="scope">
                    <el-button  @click='editDialog(scope.row)' size='small' plain type="primary" icon="el-icon-edit"></el-button>
                    <el-button  @click="removeDialog(scope.row)" size='small' plain type="danger" icon="el-icon-delete"></el-button>
                    <el-button  @click="changeDialog(scope.row)" size='small' plain type="success" icon="el-icon-check"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { Roles, addRoles, getRolesById, editRoles, deleteRoles, deleteRolesRight, Rights, submitAuth } from '../../api/api'
    export default {
        data(){
            return {
                selectTree: [105,106],
                dialogVisibleAdd: false,
                dialogVisibleEdit: false,
                dialogVisibleChange: false,
                tableData: [],
                rules: {
                    roleName: [
                        { required: true, message: '请输入您要添加的角色', tigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: false, message: '', tigger: 'blur' }
                    ]
                },
                rolesAdd: {
                    roleName: '',
                    roleDesc: ''
                },
                rolesEdit: {
                    roleName: '',
                    roleDesc: '',
                    id: ''
                },
                currentRoles: {},
                propsTree: {
                    label: 'authName',
                    children: 'children'
                },
                dataTree: [],
                currentRoleId: ''
            }
        },
        methods: {
            rolesList(){
                Roles().then(res => {
                    // console.log(res);
                    if(res.meta.status === 200){
                        this.tableData = res.data;
                    }
                })
            },
            // 关闭 dialog
            closeDialogRoles(flag){
                // 关闭弹窗
                if (flag === 'add') {
                    this.dialogVisibleAdd = false
                } else if (flag === 'edit') {
                    this.dialogVisibleEdit = false
                } else {
                    this.dialogVisibleChange = false
                }
            },
            // 添加角色
            AddRulesSubmit(){
                this.$refs.addRolesForm.validate(valid => {
                    if(valid) {
                        addRoles(this.roles ).then(res => {
                            if (res.meta.status === 201) {
                                // 关闭弹窗
                                this.dialogVisibleAdd = false
                                // 刷新列表
                                this.rolesList()
                            }
                        })
                    }
                })
                
            },
            // 编辑角色
            editDialog(row){
                getRolesById({ id: row.id }).then(res => {
                    if (res.meta.status === 200) {
                        this.rolesEdit.id = res.data.roleId
                        this.rolesEdit.roleName = res.data.roleName
                        this.rolesEdit.roleDesc = res.data.roleDesc
                        // 显示弹窗
                        this.dialogVisibleEdit = true
                    }
                })
            },
            // 编辑之后提交
            EditRulesSubmit(row){
                this.$refs.editRolesForm.validate(valid => {
                    if(valid) {
                        editRoles(this.rolesEdit).then(res => {
                            if (res.meta.status === 200) {
                                // 刷新页面
                                this.rolesList()
                                // 关闭窗口
                                this.dialogVisibleEdit = false
                            }
                        })
                    }
                })
            },
            removeDialog(row){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除角色
                    deleteRoles({id: row.id}).then(res => {
                        if (res.meta.status === 200) {
                            // 刷新列表
                            this.rolesList()
                            this.$message({
                                message: res.meta.msg,
                                type: 'success'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                })
            },
            // 获取角色id
            expandChange(row){
                // console.log(row);
                this.currentRoles = row
            },
            // 删除权限
            deleteRight(row, rightId){
                // console.log(row);
                // 删除指定角色的权限
                deleteRolesRight({roleId: row.id, rightId: rightId}).then(res => {
                    if (res.meta.status === 200) {
                        // 删除成功，把新数据重新赋值
                        row.children = res.data
                    }
                })
            },
            // 点击显示设置权限界面
            changeDialog(row){
                Rights({ type: 'tree' }).then(res => {
                    // console.log(res);
                    if(res.meta.status === 200) {
                        this.dataTree = res.data;
                        // console.log(this.dataTree);
                        this.selectTree = []
                        // console.log(row.children);
                        this._getThirdRightId(row.children, this.selectTree)
                        this.dialogVisibleChange = true;
                        // 设置当前角色
                        this.currentRoleId = row.id;
                    }
                })
            },
            // 确定用户的权限界面
            ChangeRulesSubmit(){
                // 获取所有选中节点的数据对象列表
                let list = this.$refs['tree'].getCheckedNodes()
                let ids = list.map(item => {
                    return item.id + ',' + item.pid;
                })
                // 调用 set 构造函数对数组去重
                let retTmp = new Set(ids.join(',').split(','))
                let retStr = [...retTmp].join(',');

                submitAuth({ roleId: this.currentRoleId, rids: retStr }).then(res => {
                    if(res.meta.status === 200) {
                        this.rolesList();
                        this.dialogVisibleChange = false;
                        this.$message({
                            message: res.meta.msg,
                            type: 'success'
                        })
                    }
                })
            },
            handleCheckChange(){},
            _getThirdRightId (data, arr) {
                // 获取三级权限id
                data.forEach((item) => {
                    // console.log(item.children);
                    if (!item.children) {
                        arr.push(item.id)
                        // console.log(arr);
                    } else {
                        console.log(arr);
                        this._getThirdRightId(item.children, arr)
                    }
                })
            }
        },
        mounted(){
            this.rolesList()
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
    .rightBtn{
        margin: 10px 0px;
    }
    .el-tag  {
        margin-left: 5px;
    }
    .authlist {
        border-top: solid 1px #D3DCE6;
        padding-bottom: 5px;
    }
    .arrow {
        font-size: 18px;
        font-weight: bold;
    }
    .el-button--success.is-plain{
        margin: 10px 0px;
    }
</style>


