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
        <el-table
        border
        :data="tableData"
        style="width: 100%">
            <el-table-column type="expand">
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
                width="600">
            </el-table-column>
            <el-table-column
                label="操作"
                width="250">
                <!-- 使用作用域插槽来定制数据的显示 -->
                <template slot-scope="scope">
                    <el-button  @click='editDialog(scope.row)' size='small' plain type="primary" icon="el-icon-edit"></el-button>
                    <el-button  @click="removeDialog(scope.row)" size='small' plain type="danger" icon="el-icon-delete"></el-button>
                    <el-button size='small' plain type="success" icon="el-icon-check"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { Roles } from '../../api/api'
    export default {
        data(){
            return {
                tableData: []
            }
        },
        methods: {
            rolesList(){
                Roles().then(res => {
                    console.log(res);
                    if(res.meta.status === 200){
                        this.tableData = res.data;
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
</style>


