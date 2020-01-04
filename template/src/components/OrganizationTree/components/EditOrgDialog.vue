<template>
  <!-- 新增子或修改子单位 -->
  <el-dialog :visible.sync="visible"
             :close-on-click-modal="false"
             @close="dialogClose"
             :title="dialogStatus==='create'?'新增子单位':'修改子单位'"
             width="30%">
    <el-form :model="editOrgForm"
             :rules="formRules"
             ref="editOrgForm"
             label-width="80px">
      <el-form-item label="单位编号">
        <el-input v-model="editOrgForm.p_org_no"
                  autocomplete="off"
                  style="width:100%!important"
                  :disabled="true"
                  placeholder="请输入组织编号">
        </el-input>
      </el-form-item>
      <el-form-item label="单位名称"
                    prop="input_name">
        <el-input v-model="editOrgForm.input_name"
                  autocomplete="off"
                  style="width:100%!important"
                  placeholder="请输入单位名称"></el-input>
      </el-form-item>
      <el-form-item label="单位类型"
                    prop="input_org_type">
        <el-select v-model="editOrgForm.input_org_type"
                   placeholder="请选择组织类型"
                   style="width:100%!important">
          <el-option label="第一级组织"
                     value="1">
          </el-option>
          <el-option label="第二级组织"
                     value="2">
          </el-option>
          <el-option label="第三级组织"
                     value="3">
          </el-option>
          <el-option label="第四级组织"
                     value="4">
          </el-option>
          <el-option label="第五级组织"
                     value="5">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注"
                    prop="input_remark"
                    class="add_tips">
        <el-input v-model="editOrgForm.input_remark"
                  autocomplete="off"
                  style="width:100%!important"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;">
      <el-button @click="dialogClose"
                 id="back-style">返 回</el-button>
      <el-button type="primary"
                 @click="editOrg"
                 id="save-style">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      visible: false,
      editOrgForm: {
        p_org_no: '',
        name: '',
        org_type: '',
        remark: '',
        input_name: '',
        input_org_type: '',
        input_remark: '',
        input_node_type: ''
      },
      formRules: {
        input_name: [
          { required: true, message: '请输入单位名称', trigger: 'change' }
        ],
        input_org_type: [
          { required: true, message: '请选择单位类型', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    dialogVisible: Boolean,
    dialogForm: Object,
    dialogStatus: String,
    callback: Function
  },
  watch: {
    dialogVisible (newval, oldval) {
      this.visible = newval
    },
    dialogForm: {
      handler (newval, oldval) {
        this.editOrgForm = Object.assign(this.editOrgForm, JSON.parse(JSON.stringify(newval)))
        this.editOrgForm.input_node_type = '1'
        this.editOrgForm.p_org_no = this.editOrgForm.no
        if (this.dialogStatus === 'update') {
          this.editOrgForm.input_name = this.editOrgForm.name
          this.editOrgForm.input_org_type = this.editOrgForm.org_type
          this.editOrgForm.input_remark = this.editOrgForm.remark
        } else if (this.dialogStatus === 'create') {
          this.editOrgForm.input_name = ''
          this.editOrgForm.input_org_type = ''
          this.editOrgForm.input_remark = ''
        }
        delete this.editOrgForm.children
        delete this.editOrgForm.children_list
        console.log(this.editOrgForm)
      },
      deep: true
    },
    dialogStatus (newval, oldval) {
      // if (newval === 'update') {
      //   this.editOrgForm.input_name = this.editOrgForm.name
      //   this.editOrgForm.input_org_type = this.editOrgForm.org_type
      //   this.editOrgForm.input_remark = this.editOrgForm.remark
      // } else if (newval === 'create') {
      //   this.editOrgForm.input_name = ''
      //   this.editOrgForm.input_org_type = ''
      //   this.editOrgForm.input_remark = ''
      // }
    }
  },
  methods: {
    editOrg () {
      this.$refs.editOrgForm.validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            this.createOrg()
          } else if (this.dialogStatus === 'update') {
            this.updateOrg()
          }
        }
      })
    },
    // 新增单位
    createOrg () {
      userPermissionApi.createOrg({
        data: this.editOrgForm
      }).then(res => {
        console.log(res, 'create org')
        if (res.code === 0) {
          this.$message.success('新增单位成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
    },
    // 修改单位
    updateOrg () {
      this.editOrgForm.org_id = this.editOrgForm.id
      this.editOrgForm.remark = this.editOrgForm.input_remark
      this.editOrgForm.org_name = this.editOrgForm.input_name
      userPermissionApi.updateOrg({
        data: this.editOrgForm
      }).then(res => {
        console.log(res, 'update org')
        if (res.code === 0) {
          this.$message.success('修改单位成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
    },
    dialogClose () {
      this.$refs.editOrgForm.resetFields()
      this.$emit('update:dialogVisible', false)
      this.$emit('update:dialogStatus', '')
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
