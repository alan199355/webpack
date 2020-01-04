<template>
  <div class='staff-list-container'>
    <el-form ref="form"
             :model="getJobUserListParam"
             label-width="100px">
      <el-row style="margin-bottom:20px;margin-top:20px;">
        <el-col :span="12"
                :offset="12"
                class="person-style">
          <el-col :span="24"
                  style="margin-left:1px;overflow:hidden;">
            <el-col :span="19"
                    style="padding-right:27px;">
              <el-input v-model="getJobUserListParam.user_name"
                        placeholder="请输入昵称">
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="primary"
                         icon="el-icon-search"
                         align="right"
                         class="normal_btn"
                         @click="getUserList">搜索</el-button>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:15px">
        <el-col :span="24">
          <el-table ref="obsTable"
                    @current-change="handleObsChange"
                    @selection-change="selectionChange"
                    :highlight-current-row="true"
                    :header-cell-style="{background:'#f5f5f5'}"
                    :data="jobUserList.list"
                    border
                    class="obs-style">
            <el-table-column v-if="checkbox"
                             type="selection">
            </el-table-column>
            <el-table-column prop="user_no"
                             label="系统账号"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="user_name"
                             label="用户姓名"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status_name"
                             label="状态"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="phone"
                             label="手机号"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="create_date"
                             label="加入时间"
                             align="center">
            </el-table-column>
            <el-table-column label="操作"
                             v-if="showEditRow"
                             align="center">
              <template slot-scope="scope">
                <el-button width="80px"
                           size="mini"
                           @click="jobUserDeleteConfirm(scope)"
                           type="text">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"
                align="center"
                style="margin-bottom:20px;">
          <el-pagination background
                         id="obs_page"
                         @size-change="handleSizeChange"
                         @current-change="handleJobUserCurrentChange"
                         :current-page="getJobUserListParam.page"
                         :page-sizes="[10]"
                         layout="total,sizes,prev, pager, next, jumper"
                         :page-size="getJobUserListParam.page_size"
                         :total="jobUserList.total_count">
          </el-pagination>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      getJobUserListParam: {
        org_no: '',
        dept_no: '',
        job_id: '',
        node_type: '',
        user_name: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      jobUserList: {
        list: [],
        total_count: 0
      },
      searchForm: {
        name: ''
      }
    }
  },
  props: {
    requestParam: Object,
    checkbox: {
      type: Boolean,
      default: false
    },
    showEditRow: {
      type: Boolean,
      default: true
    },
    nodeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    requestParam: {
      handler (newval, oldval) {
        this.getJobUserListParam = JSON.parse(JSON.stringify(newval))
        // 当选中的节点是部门时才请求接口
        if (this.getJobUserListParam.node_type === '2' || this.getJobUserListParam.node_type === '3') {
          this.getUserList()
        } else {
          this.jobUserList.list = []
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取人员列表
    getUserList () {
      userPermissionApi.getUserList({
        data: this.getJobUserListParam
      }).then(res => {
        // console.log(res, 'get job user list')
        if (res.code === 0) {
          this.jobUserList = res.data
        }
      })
    },
    // 获取选中列的数据
    getCheckedRow () {
      let data = this.$refs.obsTable.selection
      return data
    },
    // 人员列表-删除-弹框
    jobUserDeleteConfirm (scope) {
      this.$confirm('是否删除该人员？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.jobUserDeleteApi(scope.row)
      })
    },
    // 人员列表-删除-调用api
    jobUserDeleteApi (row) {
      let obj = {}
      obj.node_type = this.getJobUserListParam.node_type
      if (this.getJobUserListParam.node_type === '3') {
        obj.job_user_id = row.job_user_id
      } else {
        obj.user_id = row.user_id
      }

      userPermissionApi.deleteUser({
        data: obj
      }).then(res => {
        // console.log(res, 'delete job user')
        if (res.code === 0) {
          this.$message.success('删除人员成功')
          this.getUserList()
        }
      })
    },
    handleObsChange () {

    },
    handleSizeChange () {

    },
    handleJobUserCurrentChange () {

    },
    getJobUserList () {

    },
    selectionChange (selection) {
      if (selection.length > 1) {
        this.$refs.obsTable.clearSelection()
        this.$refs.obsTable.toggleRowSelection(selection.pop())
      }
    }
  },
  created () {
    this.getJobUserListParam = JSON.parse(JSON.stringify(this.requestParam))
    // 当选中的节点是部门时才请求接口
    if (this.getJobUserListParam.node_type === '2' || this.getJobUserListParam.node_type === '3') {
      // this.getUserList()
    } else {
      this.jobUserList.list = []
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang='scss'>
</style>
