<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-cascader
                :options="paramsList"
                v-model="selectedOptions"
                :props='propsDefine'
                @change="handleChange"
                :show-all-levels="false">
            </el-cascader>
        </div>
        <el-tabs type="border-card" :value="nowTab" @tab-click="tabToggle">
            <el-tab-pane  type="expand" label="动态参数" name="rundata">
                <div>
                    <el-button size='small' type="success" plain>添加参数名称</el-button>
                    <el-table
                    border
                    :data="dtableData"
                    style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- <div>{{ scope.row }}</div> -->
                                <div>
                                    <el-tag
                                    :key="index"
                                    v-for="(tag, index) in scope.row.attr_vals"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)">
                                        {{tag}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    autofocus
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="#"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <!-- 使用作用域插槽来定制数据的显示 -->
                            <template slot-scope="scope">
                                <el-button size='small' plain type="primary" icon="el-icon-edit"></el-button>
                                <el-button size='small' plain type="danger" icon="el-icon-delete"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="static">
                <div>
                    <el-button size='small' type="success" plain>添加静态属性</el-button>
                    <el-table
                    border
                    :data="stableData"
                    style="width: 100%">
                        <el-table-column
                            type="index"
                            label="#"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <!-- 使用作用域插槽来定制数据的显示 -->
                            <template slot-scope="scope">
                                <el-button size='small' plain type="primary" icon="el-icon-edit"></el-button>
                                <el-button size='small' plain type="danger" icon="el-icon-delete"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getCateLsit, addParams, getParams } from '../../api/api';
    export default {
        data() {
            return {
                nowTab: 'rundata',
                dtableData: [],
                stableData: [],
                paramsList: [],
                selectedOptions: [],
                propsDefine: {
                    value: 'cat_id',
                    label: 'cat_name'
                }
            }
        },
        methods: {
            packageChange(type){
                let paramsLen = this.selectedOptions.length;
                if(paramsLen !== 3) {
                    this.$message({
                        type: 'warning',
                        message: '必须选择三级分类'
                    });
                    return
                }
                let cid = parseInt(this.selectedOptions[2]);
                console.log(typeof cid);
                let flag = this.nowTab === 'rundata' ? 'many' : 'only';
                getParams({ id: cid, sel: flag }).then(res => {
                    // console.log(res);
                    if(res.meta.status === 200) {
                        // this[type] = res.data
                        this[type] = res.data.map(item => {
                            // 每行添加两个属性，用于控制输入框的显示和输入的值
                            this.$set(item, 'inputVisible', false)
                            this.$set(item, 'inputValue', '')
                            // 把字符串参数转换成数据
                            item.attr_vals = item.attr_vals.split(',')
                            return item
                        })
                    }
                })
            },
            // 选择框发生改变时候触发
            handleChange(){
                this.packageChange('dtableData')
            },
            // tab 栏切换发送请求
            tabToggle(tabObj){
                this.nowTab = tabObj.name
                // let str = this.nowTab;
                let str = this.nowTab === 'rundata' ? 'dtableData' : 'stableData'
                this.packageChange(str)
            },
            // 初始化数据，用于在选择框显示
            paramsInit(){
                getCateLsit({ type: 3 }).then(res => {
                    if(res.meta.status === 200) {
                        this.paramsList = res.data;
                    }
                })
            },
            // 每个标签点击删除
            handleClose(){},
            // 保存标签输入的内容
            handleInputConfirm(row){
                console.log(row.inputValue);
                row.attr_vals.push(row.inputValue);
                addParams({
                    aId: row.cat_id,
                    pId: row.attr_id,
                    attr_sel: 'many',
                    attr_name: row.attr_name,
                    attr_vals: row.attr_vals.join(',')
                }).then(res => {
                    // console.log(res)
                    // 设置输入域隐藏，按钮显示
                    row.inputVisible = false
                })
            },
            // 点击的时候显示输入框
            showInput(row){
                row.inputVisible = true
            }
        },
        mounted() {
            this.paramsInit();
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
</style>


