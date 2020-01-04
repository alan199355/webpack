<template>
  <!-- 新增或修改部门 -->
  <el-dialog :visible.sync="visible"
             @close="dialogClose"
             @open="dialogOpen"
             :close-on-click-modal="false"
             :title="dialogStatus==='create'?'新增部门名称':'修改部门名称'"
             width="30%">
    <el-form :model="editDeptForm"
             :rules="editDeptFormRules"
             ref="editDeptForm"
             label-width="80px">
      <el-form-item label="部门名称"
                    prop="input_name">
        <el-input v-model="editDeptForm.input_name"
                  autocomplete="off"
                  placeholder="请输入部门名称"
                  style="width:100%!important"></el-input>
      </el-form-item>
      <el-form-item label="部门类型"
                    prop="dept_type">
        <el-select v-model="editDeptForm.dept_type"
                   style="width:100%!important"
                   placeholder="请选择">
          <el-option v-for="item in deptTypeList"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注"
                    class="add_tips">
        <el-input v-model="editDeptForm.input_remark"
                  autocomplete="off"
                  style="width:100%!important"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;">
      <el-button @click="dialogClose"
                 id="back-style">返 回</el-button>
      <el-button @click="editDept"
                 type="primary"
                 id="save-style">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { standardCodeApi } from '@/services/StandardCode'
import { userPermissionApi } from '@/services/UserPermission'
export default {
  data () {
    return {
      visible: false,
      editDeptForm: {
        input_name: '',
        input_remark: '',
        dept_type: ''
      },
      // 部门类型标准码列表
      deptTypeList: [],
      editDeptFormRules: {
        input_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        dept_type: [
          { required: true, message: '请选择部门类型', trigger: 'blur' }
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
        this.editDeptForm = Object.assign(this.editDeptForm, JSON.parse(JSON.stringify(newval)))
        this.editDeptForm.input_node_type = '2'
      },
      deep: true
    },
    dialogStatus (newval, oldval) {
      if (newval === 'update') {
        this.editDeptForm.input_name = this.editDeptForm.name
        this.editDeptForm.input_remark = this.editDeptForm.remark
      } else if (newval === 'create') {
        this.editDeptForm.input_name = ''
        this.editDeptForm.dept_type = ''
        this.editDeptForm.input_remark = ''
      }
    }
  },
  methods: {
    dialogOpen () {
      // this.$refs.editDeptForm.resetFields()
    },
    dialogClose () {
      this.$refs.editDeptForm.resetFields()
      this.$emit('update:dialogVisible', false)
      this.$emit('update:dialogStatus', '')
    },
    editDept () {
      this.$refs.editDeptForm.validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            this.createDept()
          } else if (this.dialogStatus === 'update') {
            this.updateDept()
          }
        }
      })
    },
    // 新增部门
    createDept () {
      userPermissionApi.createOrg({
        data: this.editDeptForm
      }).then(res => {
        console.log(res, 'create dept')
        if (res.code === 0) {
          this.$message.success('新增部门成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
    },
    // 修改部门
    updateDept () {
      this.editDeptForm.dept_id = this.editDeptForm.id
      this.editDeptForm.dept_name = this.editDeptForm.input_name
      this.editDeptForm.remark = this.editDeptForm.input_remark
      userPermissionApi.updateDept({
        data: this.editDeptForm
      }).then(res => {
        console.log(res, 'update dept')
        if (res.code === 0) {
          this.$message.success('修改部门成功')
          this.dialogClose()
          this.$emit('callback', 'success')
        }
      })
    },
    // 获取部门类型
    getDeptType () {
      standardCodeApi.getStandardCodeData({
        data: {
          code_type: 'deptType'
        }
      }).then(res => {
        this.deptTypeList = res.data.list
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.getDeptType()
  },
  mounted () {
  }
}
</script>
<style scoped lang='scss'>
</style>
