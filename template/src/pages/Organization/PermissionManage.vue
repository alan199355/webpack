<template>
  <div class="permission-container">

    <div class="content">
      <el-col :span="24">
        <el-col :span="5">
          <el-col :span="24">
            <div class="permission-tree"
                 style="margin-top:60px;">
              <!-- 左边树形 -->
              <PermissionTree :curPermissionNo.sync="permissionNo"></PermissionTree>
            </div>
          </el-col>

        </el-col>
        <el-col :span="19">
          <div class="permission-list">
            <el-row class="permission-header">
              <el-col :span="10">
                &nbsp;
              </el-col>
              <el-col :span="12">
                <span style="margin-right:12px;">权限项名称</span>
                <el-input class="col-9"
                          v-model="requestParam.object_name"
                          placeholder="请输入权限项名称">

                </el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary"
                           class="search_button pull-right"
                           id="search-style"
                           @click="getPermissionList">搜索</el-button>

              </el-col>
            </el-row>
            <el-table ref="perTable"
                      @current-change="handleTemplateChange"
                      class="permission-table"
                      :data="permissionData.list"
                      row-key="object_no"
                      height="310"
                      :highlight-current-row="true"
                      :header-cell-style="{background:'#f5f5f5'}"
                      border>
              <el-table-column prop="object_sort_name"
                               label="类型"
                               width="80"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="object_name"
                               label="权限项名称"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="object_no"
                               label="权限编号"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="object_module"
                               label="module"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="object_method"
                               label="method"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="object_para"
                               label="参数"
                               width="50"
                               align="center"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="is_menu"
                               label="菜单项"
                               width="70"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_menu==1?'success':'danger'">
                    {{scope.row.is_menu==1?'是':'否'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="is_priv"
                               label="授权项"
                               width="70"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_priv==1?'success':'danger'">
                    {{scope.row.is_priv==1?'是':'否'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="is_flow"
                               label="流程项"
                               width="70"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_flow==1?'success':'danger'">
                    {{scope.row.is_flow==1?'是':'否'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="is_samp"
                               label="普通项"
                               width="70"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_samp==1?'success':'danger'">
                    {{scope.row.is_samp==1?'是':'否'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             @click="handleEdit(scope,'edit')">
                    修改
                  </el-button>
                  <el-button size="mini"
                             type="text"
                             v-if="scope.row.object_sort=='1'"
                             @click="handleEdit(scope,'add')">
                    添加子权限项
                  </el-button>
                  <el-button size="mini"
                             type="text"
                             @click="handleDelete(scope)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- @size-change="handleSizeChange" -->
            <!-- <el-col :span="24"
                    style="text-align:center;margin-top:20px;"> -->
            <div style="margin-bottom:0px;">&nbsp;</div>
            <el-pagination id="pagination"
                           @current-change="handleCurrentChange"
                           :current-page="requestParam.page"
                           :page-sizes="[10]"
                           :page-size="requestParam.page_size"
                           layout="total,sizes,prev, pager, next, jumper"
                           background
                           :total="permissionData.total_count"
                           align="center">
            </el-pagination>
            <!-- </el-col> -->

            <el-row>
              <el-col :span="3"
                      :offset="21"
                      style="margin-top:10px;">
                <el-button type="primary"
                           @click="addMainPermission"
                           class="create-button pull-right"
                           id="search-style">
                  新增主权限项
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-col>

    </div>

    <el-dialog :title="addOrEditStatus=='add'?'新增权限项':'修改权限项'"
               @close="resetPermissionForm"
               width="50%"
               :visible.sync="addOrEditDialogVisible">
      <el-form :model="addOrEditForm"
               :rules="formRules"
               ref="editPermissionForm"
               label-width="100px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所属分类"
                          prop="subType">
              <el-input v-model="permissionNo.object_name"
                        :disabled="true">
              </el-input>
            </el-form-item>

          </el-col>
          <el-col :span="11"
                  :offset="1">

            <el-form-item label="上级权限"
                          prop="upperPermission">
              <el-input v-model="upperPermission"
                        :disabled="true">
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="权限项分类"
                          prop="object_sort">
              <el-select v-model="addOrEditForm.object_sort">
                <el-option label="页面"
                           value="1">
                </el-option>
                <el-option label="子页面"
                           value="2">
                </el-option>
                <el-option label="按钮"
                           value="3">
                </el-option>
                <el-option label="组件"
                           value="4">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="11"
                  :offset="1">
            <el-form-item label="权限项编号"
                          prop="object_no">
              <el-input v-model="addOrEditForm.object_no"
                        :disabled="addOrEditStatus=='add'?false:true"
                        placeholder="请输入权限项编号">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="权限项名称"
                          prop="object_name">
              <el-input v-model="addOrEditForm.object_name"
                        placeholder="请输入权限项名称">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="控制器名称">
              <!-- prop="object_module" -->
              <el-input v-model="addOrEditForm.object_module"
                        placeholder="请输入控制器名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="1">
            <el-form-item label="方法名">
              <!-- prop="object_method" -->
              <el-input v-model="addOrEditForm.object_method"
                        placeholder="请输入方法名">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="参数"
                          prop="object_para">
              <el-input v-model="addOrEditForm.object_para"
                        placeholder="请输入参数">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11"
                  :offset="1">
            <el-col :span="24">
              <el-col :span="7">
                &nbsp;
              </el-col>
              <el-col :span="17">
                <el-checkbox v-show="addOrEditForm.object_sort=='1'"
                             true-label="1"
                             false-label="0"
                             :checked="addOrEditForm.is_menu==='1'"
                             v-model="addOrEditForm.is_menu"
                             style="margin-left:18px;">
                  菜单项
                </el-checkbox>
                <el-checkbox v-model="addOrEditForm.is_priv"
                             true-label="1"
                             false-label="0"
                             :checked="addOrEditForm.is_priv==='1'"
                             style="float:right;">
                  授权项
                </el-checkbox>
              </el-col>

            </el-col>
            <el-col :span="24">
              <el-col :span="7">
                &nbsp;
              </el-col>
              <el-col :span="17">
                <el-checkbox v-show="addOrEditForm.object_sort=='1'"
                             true-label="1"
                             false-label="0"
                             :checked="addOrEditForm.is_flow==='1'"
                             v-model="addOrEditForm.is_flow"
                             style="margin-left:18px;">
                  流程项
                </el-checkbox>
                <el-checkbox v-model="addOrEditForm.is_samp"
                             true-label="1"
                             false-label="0"
                             :checked="addOrEditForm.is_samp==='1'"
                             style="float:right;">
                  普通项
                </el-checkbox>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="text-align:center;margin-top:-30px;">
        <el-button @click="addOrEditDialogVisible=false"
                   id="back-style"
                   style="margin-right:15px;">取消</el-button>
        <el-button type="primary"
                   @click="editForm"
                   id="search-style">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { permissionApi } from '@/services/UserPermission'
import PermissionTree from '@/components/PermissionTree/PermissionTree'
export default {
  data () {
    return {
      currentRowRight: null,
      ontype: '', // 判断是新增还是修改
      requestParam: {
        object_no: '',
        object_name: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      // 权限列表数据
      permissionData: {
        total_count: 0,
        total_page: 0
      },
      // 新增或编辑权限状态
      addOrEditStatus: 'add',
      // 新增或编辑权限弹框状态
      addOrEditDialogVisible: false,
      // 新增或编辑权限表单数据
      addOrEditForm: {
        is_flow: '0',
        is_menu: '0',
        is_priv: '0',
        is_samp: '0',
        object_sort: '1',
        object_name: '',
        object_method: '',
        object_module: '',
        object_para: '',
        object_no: ''
      },
      resetForm: {
        is_flow: '0',
        is_menu: '0',
        is_priv: '0',
        is_samp: '0',
        object_sort: '1',
        object_name: '',
        object_method: '',
        object_module: '',
        object_para: '',
        object_no: ''
      },
      formRules: {
        object_sort: [
          { required: true, message: '请选择权限项分类', trigger: 'change' }
        ],
        object_name: [
          { required: true, message: '请输入权限项名称', trigger: 'change' }
        ],
        object_no: [
          { required: true, message: '请输入权限项编号', trigger: 'change' }
        ],
        object_module: [
          { required: true, message: '请输入控制器名称', trigger: 'change' }
        ],
        object_method: [
          { required: true, message: '请输入方法名', trigger: 'change' }
        ]
      },
      // 上级权限
      upperPermission: '',
      // 权限树数据
      permissionTreeData: [],
      // 权限树请求参数
      permissionTreeParam: {
        type: 'dir'
      },
      // 选中的权限编号
      permissionNo: {},
      // 单位类型列表
      companyTypeList: []
    }
  },
  components: {
    PermissionTree
  },
  watch: {
    // permissionNo (newval, oldval) {
    //   this.requestParam.object_no = newval
    //   this.getPermissionList()
    // }
    permissionNo: {
      handler (newval, oldval) {
        // console.log(newval, 'watch');
        this.requestParam.object_no = newval.object_no
        this.requestParam.system_no = newval.system_no
        this.getPermissionList()
      },
      deep: true
    }
  },
  methods: {
    handleTemplateChange (val) {
      this.currentRowRight = val
    },
    // 当前表格第一行数据的背景色
    setCurrent (row) {
      this.$refs.perTable.setCurrentRow(row)
    },
    // 列表编辑
    handleEdit (scope, type) {
      this.addOrEditDialogVisible = true
      this.addOrEditStatus = type
      this.addOrEditForm = Object.assign(this.addOrEditForm, this.resetForm)
      if (type === 'add') {
        this.addOrEditForm.p_object_no = scope.row.object_no
      } else {
        this.addOrEditForm = JSON.parse(JSON.stringify(scope.row))
        delete this.addOrEditForm.children
        delete this.addOrEditForm.children_list
      }
      // this.addOrEditForm = type === 'add' ? { p_object_no: scope.row.object_no } : scope.row
      this.upperPermission = type === 'add' ? scope.row.object_name : scope.row.p_object_no
      // console.log(scope.row, 'row')
    },
    // 编辑或新增表单提交操作
    editForm () {
      this.addOrEditForm.system_no = this.requestParam.system_no
      // this.addOrEditForm.is_flow = this.addOrEditForm.is_flow || '0'
      // this.addOrEditForm.is_menu = this.addOrEditForm.is_menu || '0'
      // this.addOrEditForm.is_priv = this.addOrEditForm.is_priv || '0'
      // this.addOrEditForm.is_samp = this.addOrEditForm.is_samp || '0'
      this.$refs.editPermissionForm.validate((valid) => {
        if (valid) {
          if (this.addOrEditStatus === 'add') {
            permissionApi.createPermission({
              data: this.addOrEditForm
            }).then(res => {
              // console.log(res, 'add')
              if (res.code === 0) {
                this.$message.success('新增权限项成功')
                this.addOrEditDialogVisible = false
                this.getPermissionList()
              }
            })
          } else {
            delete this.addOrEditForm.object_sort_name
            permissionApi.updatePermission({
              data: this.addOrEditForm
            }).then(res => {
              // console.log(res, 'edit')
              if (res.code === 0) {
                this.$message.success('修改权限项成功')
                this.addOrEditDialogVisible = false
                this.getPermissionList()
              } else {

              }
            })
          }
        }
      })
    },
    // 关闭弹框时重置表单
    resetPermissionForm () {
      this.$refs.editPermissionForm.resetFields()
    },
    // 获取页面的权限列表
    getPermissionList () {
      permissionApi.getPermissionList({
        data: this.requestParam
      }).then(res => {
        this.permissionData = res.data
        if (this.permissionData.list.length > 0) {
          this.permissionData.list.map((item) => {
            item.children = item.children_list || []
            item.children.map((childItem) => {
              childItem.p_object_name = item.object_name
            })
          })
        }

        // console.log('length=', this.permissionData.list.length);
        if (this.permissionData.list.length != 0) {
          this.setCurrent(this.permissionData.list[0])
        }

        // console.log(this.permissionData, '222')
      })
    },
    // 删除权限-确认
    handleDelete (scope) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePermission(scope.row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      })
    },
    // 删除权限-调用接口
    deletePermission (row) {
      permissionApi.deletePermission({
        data: {
          object_id: row.object_id,
          object_no: row.object_no,
          system_no: row.system_no
        }
      }).then(res => {
        // console.log(res, 'delete')
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPermissionList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取权限树数据
    getPermissionTreeData () {
      permissionApi.getPermissionTree({
        data: {
          type: 'dir'
        }
      }).then(res => {
        this.permissionTreeData = res.data
        this.$store.dispatch('setPermissionTree', this.permissionTreeData)
        window.localStorage.setItem('permissionTree', JSON.stringify(this.permissionTreeData))
      })
    },
    // 新增主权限项
    addMainPermission () {
      console.log(this.addOrEditForm, 'add main')
      this.upperPermission = ''
      this.addOrEditDialogVisible = true
      this.addOrEditForm = Object.assign(this.addOrEditForm, this.resetForm)
      this.addOrEditStatus = 'add'
      this.addOrEditForm.p_object_no = this.requestParam.object_no
    },
    handleSizeChange (size) {
      // console.log(size, 'size')
    },
    handleCurrentChange (current) {
      // console.log(current, 'current')
      this.requestParam.page = current
      this.getPermissionList()
    }
  },
  created () {
    this.getPermissionTreeData()
    // this.getPermissionList()
  },
  mouted () { }
}
</script>
<style scoped lang='scss'>
.col-9 {
  margin-right: 1%;
}
/deep/ #pagination .el-pager .active {
  // background: #1abc9c;
  // color: white;
}
/deep/ #pagination .el-pager .active:hover {
  color: #fff;
}
/deep/ #pagination .el-pager li:hover {
  // color: #1abc9c;
}
#back-style {
  // color: white;
  // background: rgba(26, 188, 156, 1);
}
#search-style {
  // background: rgba(26, 188, 156, 1);
  // margin: 0px;
  // padding: 0px;
  // width: 96px;
  // height: 40px;
  // line-height: 40px;
}
/deep/ .el-table__body tr.current-row > td {
  background: #1890ff;
  color: #fff;
}
/deep/ .el-table__body tr.current-row > td .el-button {
  color: #fff;
}
/deep/ .el-table__body tr.current-row > td .el-tag--success {
  color: #ffffff;
}
/deep/ .el-table__body tr.current-row > td .el-tag--danger {
  color: #ffffff;
}
.permission-container {
  background: #ffffff;
  padding: 20px;
  .el-form-item__content {
    display: flex;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .content {
    display: flex;

    .permission-tree {
      width: 300px;
    }
    .permission-list {
      flex-grow: 1;
      margin: 0 0px;
      .permission-header {
        margin-bottom: 20px;
      }
      .permission-table {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
