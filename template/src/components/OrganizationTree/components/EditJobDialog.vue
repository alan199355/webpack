<template>
  <!-- 新增或修改岗位 -->
  <el-dialog :visible.sync="visible"
             @close="dialogClose"
             :close-on-click-modal="false"
             :title="dialogStatus==='create'?'新增岗位':'修改岗位'"
             width="30%">
    <el-form :model="editJobForm"
             :rules="editJobFormRules"
             ref="editJobForm"
             label-width="90px">
      <el-form-item label="岗位名称"
                    prop="input_name">
        <el-input v-model="editJobForm.input_name"
                  autocomplete="off"
                  placeholder="请输入岗位名称"
                  style="width:100%!important"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    class="add_tips">
        <el-input v-model="editJobForm.input_remark"
                  autocomplete="off"
                  style="width:100%!important"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;">
      <el-button @click="dialogClose"
                 id="back-style">返 回</el-button>
      <el-button type="primary"
                 @click="editJob"
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
      editJobForm: {
        input_name: '',
        input_remark: ''
      },
      editJobFormRules: {
        input_name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
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
        this.editJobForm = Object.assign(this.editJobForm, JSON.parse(JSON.stringify(newval)))
        this.editJobForm.input_node_type = '3'
      },
      deep: true
    },
    dialogStatus (newval, oldval) {
      if (newval === 'update') {
        this.editJobForm.input_name = this.editJobForm.name
        this.editJobForm.input_remark = this.editJobForm.remark
      } else if (newval === 'create') {
        this.editJobForm.input_name = ''
        this.editJobForm.input_remark = ''
      }
    }
  },
  methods: {
    dialogClose () {
      this.$refs.editJobForm.resetFields()
      this.$emit('update:dialogVisible', false)
      this.$emit('update:dialogStatus', '')
    },
    editJob () {
      this.$refs.editJobForm.validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            this.createJob()
          } else if (this.dialogStatus === 'update') {
            this.updateJob()
          }
        }
      })
    },
    createJob () {
      userPermissionApi.createOrg({
        data: this.editJobForm
      }).then(res => {
        console.log(res, 'create job')
        if (res.code === 0) {
          this.$message.success('新增岗位成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
    },
    updateJob () {
      this.editJobForm.job_id = this.editJobForm.id
      this.editJobForm.dept_id = this.editJobForm.p_id
      this.editJobForm.job_name = this.editJobForm.input_name
      this.editJobForm.remark = this.editJobForm.input_remark
      userPermissionApi.updateJob({
        data: this.editJobForm
      }).then(res => {
        console.log(res, 'update job')
        if (res.code === 0) {
          this.$message.success('修改岗位成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
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
