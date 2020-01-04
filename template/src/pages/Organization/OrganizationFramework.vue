<template>
  <div class='organization-container'>
    <OrganizationTree class="organization-tree"
                      :assignedNode.sync="assignNode"
                      :assignedTemplateNode.sync="assignTemplateNode"
                      :curMenu.sync="curNode"></OrganizationTree>
    <div class="table">
      <el-tabs type="border-card"
               class="unit_tabs">
        <el-tab-pane label="权限清单">
          <el-tabs type="card"
                   class="Permiss">
            <PermissionTemplateList ref="permissionList"
                                    :requestParam="getJobPermissionListParam"></PermissionTemplateList>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="人员列表">
          <JobUserList ref="jobUserList"
                       :checkbox="false"
                       :showEditRow="false"
                       :nodeData="curNode"
                       :requestParam="getJobUserListParam"></JobUserList>
        </el-tab-pane>
      </el-tabs>

    </div>
    <!-- 分配人员列表弹框 -->
    <AssignUserListDialog @callback="assignUserCallback"
                          :dialogVisible.sync="assignUserDialogVisible"
                          :requestParam.sync="assignUserDialogParams"></AssignUserListDialog>
    <!-- 分配模板列表弹框 -->
    <AssignTemplateDialog @callback="assignTemplateCallback"
                          :dialogVisible.sync="assignTemplateDialogVisible"
                          :requestParam.sync="assignTemplageDialogParams"></AssignTemplateDialog>
  </div>
</template>
<script>
import OrganizationTree from '@/components/OrganizationTree/OrganizationTree'
import JobUserList from '@/components/JobUserList/JobUserList'
import PermissionTemplateList from '@/components/PermissionTemplate/PermissionTemplateList'
import { userPermissionApi } from '@/services/UserPermission'
import AssignUserListDialog from './components/AssignUserListDialog'
import AssignTemplateDialog from './components/AssignTemplateDialog'
export default {
  data () {
    return {
      requestParam: {
        node_no: '',
        node_type: ''
      },
      curNode: {},

      // 选择组织树时的类型，如归属公司，部门，存放地点
      chooseOrgType: 'company',
      // 获取人员列表请求参数
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
      // 获取岗位权限清单列表参数
      getJobPermissionListParam: {

        job_id: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      // 分配人员列表弹框请求参数
      assignUserDialogParams: {

      },
      // 分配人员列表弹框是否可见
      assignUserDialogVisible: false,
      // 右键分配人员时选中的节点
      assignNode: {},
      // 右键分配模板时选中的节点
      assignTemplateNode: {},
      // 分配权限模板弹框请求参数
      assignTemplageDialogParams: {

      },
      // 分配权限模板弹框是否可见
      assignTemplateDialogVisible: false
    }
  },
  components: {
    OrganizationTree,
    JobUserList,
    PermissionTemplateList,
    AssignUserListDialog,
    AssignTemplateDialog
  },
  watch: {
    curNode: {
      handler (newval) {
        let tempData = {}
        tempData.node_type = newval.node_type
        tempData.user_name = ''
        if (newval.node_type === '1') {
          tempData.org_no = newval.org_no
        } else if (newval.node_type === '2') {
          tempData.dept_no = newval.no
        } else if (newval.node_type === '3') {
          tempData.job_id = newval.id
          this.getJobPermissionListParam.job_id = newval.id
        }
        this.getJobUserListParam = Object.assign(this.getJobUserListParam, tempData)
      },
      deep: true
    },
    // 在岗位节点上选择分配人员菜单时，触发分配人员弹框
    assignNode: {
      handler (newval, oldval) {
        console.log(newval, 'assign node')
        if (newval.id) {
          this.assignUserDialogParams = newval
          this.assignUserDialogVisible = true
        }
      },
      deep: true
    },
    assignUserDialogVisible (newval, oldval) {
      if (!newval) {
        this.assignNode = {}
      }
    },
    // 在岗位节点上分配人员权限时，出发分配权限弹框
    assignTemplateNode: {
      handler (newval, oldval) {
        console.log(newval, 'assign template node')
        if (newval.id) {
          this.assignTemplageDialogParams = newval
          this.assignTemplateDialogVisible = true
        }
      },
      deep: true
    },
    assignTemplateDialogVisible (newval, oldval) {
      if (!newval) {
        this.assignTemplateNode = {}
      }
    }
  },
  methods: {
    // 获取组织树
    getOrganizationTree () {
      this.requestParam.node_no = this.nodeNo
      userPermissionApi.getOrganizationTree({
        data: this.requestParam
      }).then(res => {
        if (res.code === 0) {
          this.$store.dispatch('setOrgainzationTree', res.data)
          window.localStorage.setItem('platformOrganizationTree', JSON.stringify(res.data))
        }
      })
    },
    // 分配人员列表成功回调
    assignUserCallback () {
      this.$refs.jobUserList.getUserList()
    },
    // 分配模板列表成功回调
    assignTemplateCallback () {
      this.$refs.permissionList.getJobPermissionList()
    }
  },
  created () {
  },
  mounted () {
    let store = this.$store.state.orgainzationTree
    let storage = JSON.parse(window.localStorage.getItem('platformOrganizationTree')) || []

    if (!store.length && !storage.length) {
      this.getOrganizationTree()
    }
  }
}
</script>
<style scoped lang='scss'>
.organization-container {
  padding: 20px;
  display: flex;
  .organization-tree {
    width: 300px;
  }
  .table {
    flex: 1;
    margin-left: 20px;
  }
}
</style>
