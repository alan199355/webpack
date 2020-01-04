<template>
  <div class='permissiontemplate-container'>
    <div class="table-header">
      <el-row>
        <el-col :lg="{span:15,offset:9}"
                :md="{span:17,offset:7}"
                :sm="{span:20,offset:4}"
                :xs="{span:22,offset:2}"
                class="pull-right"
                align="right">
          <el-input class="col-8"
                    placeholder="权限名称"
                    v-model="template_name"></el-input>
          <el-button type="primary"
                     class="search"
                     @click="serach()">查询</el-button>
          <el-button type="primary"
                     @click="addPermission">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :highlight-current-row='true'
              class="permission-template-table"
              height="650"
              :header-cell-style="{background:'#f5f5f5'}"
              :data='permissionTemplateData.list'
              border>

      <el-table-column prop='auth_template_id'
                       label='编号ID'
                       align='center'
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop='auth_template_name'
                       label='权限名称'
                       align='center'
                       show-overflow-tooltip>
      </el-table-column>

      <el-table-column label='操作'
                       align='center'
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="showPermissionList(scope.row)"
                     type="text">查看</el-button>
          <el-button @click="editPermissionTemplate(scope.row)"
                     type="text">编辑</el-button>
          <el-button type="text"
                     @click="assignPermission(scope.row)">权限分配</el-button>
          <el-button type="text"
                     @click="deletePermission(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change='handlePageChange'
                   :current-page='requestParam.page'
                   @size-change="handleSizeChange"
                   :page-size='requestParam.page_size'
                   layout='total,sizes,prev, pager, next, jumper'
                   background
                   :total='permissionTemplateData.total_count'
                   align='center'>
    </el-pagination>
    <!-- 添加/修改权限 -->
    <el-dialog title="添加管理组"
               width="35%"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible">
      <AddModifyPermission :todos="todos"
                           :rowObj="rowObj"
                           :catchBack="catchBack"
                           :catchSave="catchSave">
      </AddModifyPermission>
    </el-dialog>
    <el-dialog title="分配权限"
               :visible.sync="assignPermissionDialogVisible">
      <PermissionTree ref="permissionTree"
                      :showCheckbox="true"
                      :isVisible="assignPermissionDialogVisible"
                      :curPermissionIds.sync="assignPermissionIds"></PermissionTree>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   icon="el-icon-document"
                   @click="getPermissionIds">保 存</el-button>
        <el-button @click="assignPermissionDialogVisible = false">取 消</el-button>

      </div>
    </el-dialog>
    <PermissionListDialog :dialogVisible.sync="permissionListDialogVisible"
                          :permissionRequestParam.sync="permissionListDialogParams"></PermissionListDialog>
  </div>
</template>
<script>
import { permissionApi } from '@/services/UserPermission'
import PermissionTree from '@/components/PermissionTree/PermissionTree'
import PermissionListDialog from '@/components/PermissionTemplate/PermissionListDialog'
import AddModifyPermission from './components/AddModifyPermission'
export default {
  components: {
    PermissionTree,
    PermissionListDialog,
    AddModifyPermission
  },
  data () {
    return {
      rowObj: {},
      todos: 0,
      org_no: '', // 组织编号
      comp_id: '', // 公司id
      template_name: '', // 查询字段名称
      requestParam: {
        page: 1,
        page_size: 10
      },
      dialogFormVisible: false,
      template_id: '',
      permissionTemplateData: {
        list: [],
        total_page: 0,
        total_count: 0
      },
      // 分配权限模板弹框是否可见
      assignPermissionDialogVisible: false,
      // 选中的权限id
      assignPermissionIds: [],
      // 接口是否处于请求中的标志
      pending: false,
      // 权限模板-权限列表弹框是否可见
      permissionListDialogVisible: false,
      // 权限模板-权限列表弹框请求参数
      permissionListDialogParams: {
      }
    }
  },
  methods: {
    // 新增
    addPermission () {
      this.todos = 1
      this.rowObj = {}
      this.dialogFormVisible = true
    },
    // 新增、编辑权限弹框
    handleClose (done) {
      this.todos = 0
      this.rowObj = {}
      this.dialogFormVisible = false
      done()
    },
    // 返回
    catchBack (val) {
      if (val == 'SUCCESS') {
        this.todos = 0
        this.rowObj = {}
        this.dialogFormVisible = false
      }
    },
    // 确认
    catchSave (val) {
      if (val == 'SUCCESS') {
        this.todos = 0
        this.rowObj = {}
        this.dialogFormVisible = false
        this.requestParam.page = 1
        this.getPermissionList()
      }
    },
    // 每页显示条数
    handleSizeChange (val) {
      this.requestParam.page = 1
      this.requestParam.page_size = val
      this.getPermissionList()
      // console.log('每页显示的条数=', val)
    },
    // 权限分配
    onAllocationPrivileges () {
      this.$message('权限分配')
    },
    getPermissionList () {
      permissionApi.getTemplateList({
        params: {
          company_id: this.comp_id,
          org_no: this.org_no,
          auth_template_name: this.template_name,
          is_page: 1,
          page: this.requestParam.page,
          page_size: this.requestParam.page_size
        }
      }).then((res) => {
        this.permissionTemplateData.list = res.data.list
        this.permissionTemplateData.total_count = res.data.total_count
      })
    },
    // 分页
    handlePageChange (page) {
      this.requestParam.page = page
      this.getPermissionList()
    },
    // 查询功能
    serach () {
      this.requestParam.page = 1
      this.handlePageChange(this.requestParam.page)
    },
    editPermissionTemplate (row) {
      this.todos = 1
      this.rowObj = row
      this.dialogFormVisible = true
    },
    // 删除权限
    deletePermission (row) {
      this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        permissionApi.deletePermissionTemplate({
          data: {
            auth_template_id: row.auth_template_id
          }
        }).then(res => {
          if (res.msg === 'SUCCESS') {
            this.$message.success('删除成功')
            this.getPermissionList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击权限分配按钮，弹出权限树弹框
    assignPermission (row) {
      this.template_id = row.auth_template_id
      this.getPermissionTreeData()
      this.assignPermissionDialogVisible = true
    },
    // 为当前权限模板分配权限
    getPermissionIds () {
      console.log(this.assignPermissionIds, 'assign permission id')
      let idsArray = []
      let ids = ''
      if (this.assignPermissionIds.length === 0) {
        this.$message.warning('请选择权限项')
      } else {
        this.assignPermissionIds.map((item) => {
          idsArray.push(item.object_id)
        })
        ids = idsArray.join(',')
        this.assignTemplatePermission(ids)
      }
    },
    // 调用分配权限接口
    assignTemplatePermission (ids) {
      if (!this.pending) {
        this.pending = true
        permissionApi.assignTemplatePermission({
          data: {
            auth_template_id: this.template_id,
            object_ids: ids
          }
        }).then(res => {
          console.log(res, 'assign template permission')
          if (res.code === 0) {
            this.$message.success('权限分配成功')
            this.assignPermissionDialogVisible = false
            this.$refs.permissionTree.getPermissionTreeData()
          }
          this.pending = false
        }, err => {
          console.log(err)
          this.pending = false
        })
      }
    },

    // 获取权限树数据
    getPermissionTreeData () {
      permissionApi.getPermissionTree({
        data: {
          type: 'all',
          is_assign: '1',
          assign_id: this.template_id
        }
      }).then(res => {
        if (res.code === 0) {
          this.permissionTreeData = res.data
          this.$store.dispatch('setPermissionTree', this.permissionTreeData)
          window.localStorage.setItem('industryPermissionTree', JSON.stringify(this.permissionTreeData))
        }
      })
    },
    // 展示资源数量弹框
    showPermissionList (row) {
      this.permissionListDialogVisible = true
      this.permissionListDialogParams.auth_template_id = row.auth_template_id
    }
  },
  created () {
    this.org_no = JSON.parse(window.localStorage.userInfo).org_no// 获取组织管理
    this.comp_id = JSON.parse(window.localStorage.userInfo).comp_id// 公司id
    console.log('org_no=', this.org_no, 'this.comp_id=', this.comp_id)
    // 权限列表数据
    this.getPermissionList()
  },
  mouted () {

  }
}
</script>
<style scoped lang='scss'>
.permissiontemplate-container {
  padding: 20px;
  .table-header {
    width: 100%;
    height: 64px;
    background-color: #fff;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    .search {
      margin-left: 10px;
    }
  }
  .permission-template-table {
    margin-bottom: 20px;
    height: 650px;
    overflow: auto !important;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
