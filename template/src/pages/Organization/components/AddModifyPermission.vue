<template>
  <div>
    <el-row>
      <el-form :model="addform"
               ref="addform"
               :rules="addRules"
               label-width="80px">
        <el-form-item label="权限名称"
                      prop="name">
          <el-input class="col-9"
                    v-model="addform.name"></el-input>
        </el-form-item>
      </el-form>
      <el-col :span="24"
              id="bottomBox">
        <el-button type="primary"
                   icon="el-icon-document"
                   @click="saveData('addform')">保 存</el-button>
        <el-button @click="onBack">取 消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { permissionApi } from '@/services/UserPermission'
export default {
  props: {
    todos: Number,
    catchBack: Function,
    catchSave: Function,
    rowObj: Object
  },
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入权限名称'))
      } else if ((/^[\s　]|[ ]$/gi).test(value)) {
        callback(new Error('项目名称首尾不能含有空格！'))
      } else {
        callback()
      }
    }
    return {
      org_no: '',
      comp_id: '',
      addform: {
        name: ''
      },
      addRules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 返回
    onBack () {
      this.addform.name = ''// 清空记忆值
      this.catchBack('SUCCESS')
    },
    // 修改权限的保存按钮
    editData (editform) {
      this.$refs[editform].validate((valid) => {
        if (valid) {
          permissionApi.editPermission({
            data: {
              org_no: this.org_no,
              company_id: this.comp_id,
              auth_template_name: this.addform.name,
              auth_template_id: this.template_id
            }
          }).then(res => {
            if (res.msg === 'SUCCESS') {
              this.$message.success('修改成功')
              this.catchSave('SUCCESS')
            }
          })
        } else {
          return false
        }
      })
    },
    // 添加权限的保存按钮
    saveData (addform) {
      this.$refs[addform].validate((valid) => {
        if (valid) {
          if (this.rowObj.auth_template_id == undefined) {
            permissionApi.addPermission({
              data: {
                auth_template_name: this.addform.name,
                org_no: this.org_no,
                company_id: this.comp_id
              }
            }).then(res => {
              if (res.code === 0) {
                this.$message.success('添加成功')
                this.catchSave('SUCCESS')
                // this.getPermissionList();
                this.addform.name = ''// 清空记忆值
              }
            })
          } else {
            permissionApi.editPermission({
              data: {
                org_no: this.org_no,
                company_id: this.comp_id,
                auth_template_name: this.addform.name,
                auth_template_id: this.rowObj.auth_template_id
              }
            }).then(res => {
              if (res.msg === 'SUCCESS') {
                this.$message.success('修改成功')
                this.catchSave('SUCCESS')
                // this.getPermissionList()
              }
            })
          }
        } else {
          return false
        }
      })
    }
  },
  watch: {
    todos (n, o) {
      if (n == 1) {
        this.org_no = JSON.parse(window.localStorage.userInfo).org_no// 获取组织管理
        this.comp_id = JSON.parse(window.localStorage.userInfo).comp_id// 公司id
        // console.log('org_no=', this.org_no, 'this.comp_id=', this.comp_id)
        // console.log('watch1-rowObj=', this.rowObj)
        if (this.rowObj.auth_template_id == undefined) {
        } else {
          this.addform.name = this.rowObj.auth_template_name
        }
      } else {
        this.addform.name = ''
        // console.log('watch0-rowObj=', this.rowObj)
      };
    }
  },
  created () {
    if (this.todos == 1) {
      this.org_no = JSON.parse(window.localStorage.userInfo).org_no// 获取组织管理
      this.comp_id = JSON.parse(window.localStorage.userInfo).comp_id// 公司id
      // console.log('org_no=', this.org_no, 'this.comp_id=', this.comp_id)
      if (this.rowObj.auth_template_id == undefined) {
      } else {
        this.addform.name = this.rowObj.auth_template_name
      }
    } else {
      this.addform.name = ''
    }
    // console.log('created-rowObj=', this.rowObj)
  }
}
</script>

<style lang="scss" scoped>
#bottomBox {
  text-align: center;
}
</style>
