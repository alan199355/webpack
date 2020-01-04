<template>
  <div class="assign-template-container"
       v-if="visible">
    <!-- 分配权限模板弹框 -->
    <el-dialog title="分配模板"
               :close-on-click-modal="false"
               :visible.sync="visible"
               @close="dialogClose">
      <el-form :model="getAssignTemplateListParam"
               label-width="100px">
        <el-row>
          <el-col :span="10"
                  :offset="11">
            <el-form-item label="模板名称"
                          prop="auth_template_name"
                          style="margin-right:10px;">
              <el-input v-model="getAssignTemplateListParam.auth_template_name"
                        placeholder="请输入模板名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3"
                  style="text-align:right;">
            <el-button class="search-btn"
                       @click="getAssignTemplate"
                       type="primary"
                       id="headLeftSelect">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="assignTemplateList.list"
                row-key="auth_template_id"
                height="310px"
                :header-cell-style="{background:'#f5f5f5'}"
                @selection-change="selectTemplate"
                border>
        <el-table-column type="selection"
                         width="50">
        </el-table-column>
        <el-table-column prop="auth_template_name"
                         label="模板名称"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="权限查看"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button width="80px"
                       size="mini"
                       @click="getPermissionList(scope.row)"
                       type="text">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:20px;">
        <el-button @click="dialogClose"
                   id="headLeftSelect">取消</el-button>
        <el-button type="primary"
                   @click="saveAssignTemplate"
                   id="headLeftSelect">确定</el-button>
      </div>

    </el-dialog>
    <PermissionListDialog :dialogVisible.sync="permissionListDialogVisible"
                          :permissionRequestParam.sync="permissionListDialogParams"></PermissionListDialog>
  </div>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
import PermissionListDialog from '@/components/PermissionTemplate/PermissionListDialog'
export default {
  data () {
    return {
      visible: false,
      // 请求分配模板列表参数
      getAssignTemplateListParam: {
        job_id: '',
        is_select: 1,
        auth_template_name: '',
        is_page: 1,
        page: 1,
        page_size: 10
      },
      // 已选择分配模板的列表
      selectedAssignTemplate: [],
      // 分配权限模板列表
      assignTemplateList: {
        list: []
      },
      // 权限模板-权限列表弹框是否可见
      permissionListDialogVisible: false,
      // 权限模板-权限列表弹框请求参数
      permissionListDialogParams: {

      }
    }
  },
  components: {
    PermissionListDialog
  },
  props: {
    dialogVisible: Boolean,
    requestParam: Object
  },
  watch: {
    dialogVisible (newval, oldval) {
      this.visible = newval
      this.getAssignTemplate()
    },
    requestParam: {
      handler (newval, oldval) {
        this.getAssignTemplateListParam = Object.assign(this.getAssignTemplateListParam, JSON.parse(JSON.stringify(newval)))
        this.getAssignTemplateListParam.job_id = this.getAssignTemplateListParam.id
        // this.getAssignTemplate()
      },
      deep: true
    }
  },
  methods: {
    dialogClose () {
      this.$emit('update:dialogVisible', false)
    },
    // 获取分配模板列表
    getAssignTemplate () {
      userPermissionApi.getAssignTemplateList({
        data: this.getAssignTemplateListParam
      }).then(res => {
        if (res.code === 0) {
          this.assignTemplateList = res.data
        }
      })
    },
    // 保存分配模板
    saveAssignTemplate () {
      if (this.selectedAssignTemplate.length === 0) {
        this.$message('请先勾选数据!')
      } else {
        let param = {}
        param.job_id = this.getAssignTemplateListParam.job_id
        param.auth_template_ids = this.selectedAssignTemplate.join(',')
        userPermissionApi.saveAssignTemplate({
          data: param
        }).then(res => {
          // console.log(res, 'save assign template')
          if (res.code === 0) {
            this.$message.success('分配模板成功')
            this.getAssignTemplate()
            this.$emit('callback', 'success')
            this.dialogClose()
          }
        })
      }
    },
    // 获取选中的模板
    selectTemplate (list) {
      this.selectedAssignTemplate = []
      if (list.length > 0) {
        list.map((item) => {
          this.selectedAssignTemplate.push(item.auth_template_id)
        })
      }
    },
    // 查看权限模板中的权限数据
    getPermissionList (row) {
      this.permissionListDialogVisible = true
      this.permissionListDialogParams.auth_template_id = row.auth_template_id
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
