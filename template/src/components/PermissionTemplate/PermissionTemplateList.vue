<template>
  <div class='permisiion-list-container'>
    <el-row style="margin-bottom:15px;">
      <el-col :span="24">
        <el-table ref="clearTable"
                  :highlight-current-row="true"
                  @current-change="handleClearChange"
                  :header-cell-style="{background:'#f5f5f5'}"
                  :data="jobPermissionList.list"
                  border
                  height="310"
                  style="width: 100%"
                  class="obs-style">
          <el-table-column prop="auth_template_name"
                           label="模板名称"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="资源数量"
                           align="center"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         style="text-decoration:underline"
                         @click="showPermissionList(scope.row)">{{scope.row.object_num}}</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button width="80px"
                         size="mini"
                         @click="jobPerDeleteConfirm(scope.row)"
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
                       @current-change="handleCurrentChange"
                       :current-page="getJobPermissionListParam.page"
                       :page-size="getJobPermissionListParam.page_size"
                       :page-sizes="[15,20,30,40]"
                       layout="total,sizes,prev, pager, next, jumper"
                       :total="jobPermissionList.total_count">
        </el-pagination>
      </el-col>
    </el-row>
    <PermissionListDialog :dialogVisible.sync="permissionListDialogVisible"
                          :permissionRequestParam.sync="permissionListDialogParams"></PermissionListDialog>
  </div>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
import PermissionListDialog from './PermissionListDialog'
export default {
  data () {
    return {
      getJobPermissionListParam: {
        job_id: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      jobPermissionList: {
        list: [],
        total_count: 0
      },
      // 权限模板-权限列表弹框是否可见
      permissionListDialogVisible: false,
      // 权限模板-权限列表弹框请求参数
      permissionListDialogParams: {

      }
    }
  },
  props: {
    requestParam: Object
  },
  watch: {
    requestParam: {
      handler (newval, oldval) {
        this.getJobPermissionListParam = JSON.parse(JSON.stringify(newval))
        this.getJobPermissionList()
      },
      deep: true
    }
  },
  components: {
    PermissionListDialog
  },
  methods: {
    getJobPermissionList () {
      userPermissionApi.getJobPermissionList({
        data: this.getJobPermissionListParam
      }).then(res => {
        console.log(res, 'get job permission')
        if (res.code === 0) {
          this.jobPermissionList = res.data
        }
      })
    },

    // 删除权限模板确认
    jobPerDeleteConfirm (row) {
      this.$confirm('是否删除该权限清单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.jobPerDeleteApi(row.role_job_rela_id)
      })
    },
    // 删除权限-调用接口
    jobPerDeleteApi (id) {
      userPermissionApi.deleteJobPermission({
        data: {
          role_job_rela_id: id
        }
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除权限清单成功')
          this.getJobPermissionList()
        }
      })
    },
    // 展示资源数量弹框
    showPermissionList (row) {
      this.permissionListDialogVisible = true
      this.permissionListDialogParams.auth_template_id = row.auth_template_id
    },

    handleCurrentChange (page) {

    },
    handleClearChange () {

    },
    handleSizeChange () {

    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang='scss'>
.permission-list-container {
}
</style>
