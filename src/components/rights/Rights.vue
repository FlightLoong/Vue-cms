<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
                    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
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
                prop="authName"
                label="权限名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径"
                width="180">
            </el-table-column>
            <el-table-column
                prop="level"
                label="层级"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-if="scope.row.level === '1'">二级</span>
                    <span v-if="scope.row.level === '2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { Rights } from '../../api/api'
    export default {
        data(){
            return {
                tableData: []
            }
        },
        methods: {
            rightList(){
                Rights({ type: 'list' }).then(res => {
                    // console.log(res);
                    if(res.meta.status === 200) {
                        this.tableData = res.data;
                    }
                })
            }
        },
        mounted(){
            this.rightList()
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
</style>


