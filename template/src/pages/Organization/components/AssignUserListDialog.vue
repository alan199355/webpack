<template>
  <!-- 分配人员弹框 -->
  <el-dialog title="分配人员"
             @close="dialogClose"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="getAssignUserListParam"
             label-width="50px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="账号"
                        prop="user_no">
            <el-input v-model="getAssignUserListParam.user_no"
                      placeholder="请输入账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="姓名"
                        prop="user_name">
            <el-input v-model="getAssignUserListParam.user_name"
                      placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机"
                        prop="phone">
            <el-input v-model="getAssignUserListParam.phone"
                      placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button class="search-btn"
                     @click="getAssignUserList"
                     type="primary"
                     id="headLeftSelect">搜索</el-button>
        </el-col>
      </el-row>

    </el-form>
    <el-table :data="assignUserList.list"
              row-key="user_id"
              height="310"
              :header-cell-style="{background:'#f5f5f5'}"
              @selection-change="selectUser"
              border>
      <el-table-column type="selection"
                       width="50">
      </el-table-column>
      <el-table-column prop="user_no"
                       label="系统账号">
      </el-table-column>
      <el-table-column prop="user_name"
                       label="用户姓名">
      </el-table-column>
      <el-table-column prop="status_name"
                       label="状态">
      </el-table-column>
      <el-table-column prop="phone"
                       label="手机号">
      </el-table-column>
      <el-table-column prop="create_date"
                       label="创建日期">
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px;">
      <el-button @click="dialogClose"
                 id="headLeftSelect">取消</el-button>
      <el-button type="primary"
                 @click="batchAssignUser"
                 id="headLeftSelect">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      visible: false,
      assignUserList: {
        list: [],
        total_page: 0,
        total_count: 0
      },
      // 请求分配人员列表参数
      getAssignUserListParam: {
        job_id: '',
        user_no: '',
        user_name: '',
        phone: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      // 已选择分配人员的列表
      selectedAssignUser: []
    }
  },
  props: {
    requestParam: Object,
    dialogVisible: Boolean,
    callback: Function
  },
  watch: {
    requestParam: {
      handler (newval, oldval) {
        console.log(newval, 'requestparam')
        this.getAssignUserListParam = Object.assign(this.getAssignUserListParam, JSON.parse(JSON.stringify(newval)))
        this.getAssignUserListParam.job_id = this.getAssignUserListParam.id
        this.getAssignUserList()
      },
      deep: true
    },
    dialogVisible (newval, oldval) {
      this.visible = newval
    }
  },
  methods: {
    dialogClose () {
      this.$emit('update:dialogVisible', false)
    },
    // 获取分配人员列表
    getAssignUserList () {
      // 这里清空assignNode是为了关闭弹框再次点击分配人员时能够触发watch
      // 因此在watch时需要判断assignNode是否为空，否则会无限循环
      userPermissionApi.getAssignUserList({
        data: this.getAssignUserListParam
      }).then(res => {
        // console.log(res, 'get assign user list')
        if (res.code === 0) {
          this.assignUserList = res.data
        }
      })
    },
    // 保存分配人员
    batchAssignUser () {
      if (this.selectedAssignUser.length === 0) {
        this.$message('请先选中数据!')
      } else {
        let param = {}
        param.job_id = this.getAssignUserListParam.job_id
        param.user_ids = this.selectedAssignUser.join(',')
        userPermissionApi.batchAssignUser({
          data: param
        }).then(res => {
          // console.log(res, 'batch assign user')
          if (res.code === 0) {
            this.$message.success('分配人员成功')
            this.$emit('callback', 'success')
            this.dialogClose()
          }
        })
      }
    },
    // 选择分配人员
    selectUser (list) {
      this.selectedAssignUser = []
      if (list.length > 0) {
        list.map((item) => {
          this.selectedAssignUser.push(item.user_id)
        })
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang='scss'>
</style>
