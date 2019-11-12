<template>
  <el-row class="head-container">
    <!--头部-->

    <el-col class="logo-container"
            :md="6"
            :sm="3"
            :xs="3">
      <div class="topbar-logo topbar-btn"
           @click="toggleLeftNav">

        <img src="@/assets/login-logo.png"
             class="logo">
        <p v-if="pageSize.width>=992">{{companyInfo.company_name}}</p>
        <i v-if="pageSize.width<992"
           class="fa fa-bars"></i>
      </div>
    </el-col>
    <el-col :md="12"
            :sm="12"
            :xs="14">
      <div class="topbar-title">
        <!-- 注意：这里就是topNavState作用之处，根据当前路由所在根路由的type值判断显示不同顶部导航菜单 -->
        <!-- <el-row>
          <el-col :span="24">
            <el-menu :default-active="defaultActiveIndex"
                     class="el-menu-demo"
                     mode="horizontal"
                     @select="handleSelect"
                     :router="false">
              <el-menu-item index="home">首页</el-menu-item>
              <el-menu-item v-for="(item, index) in roleInfo.topNav"
                            :class="item.active?'active':'11'"
                            :key="index"
                            :index="item.menu_id">{{item.menu_name}}</el-menu-item>
            </el-menu>
          </el-col>
        </el-row> -->
        <p>
          当前项目：
          <span @click="toggleProject">{{choosedPro.nickname}}</span>
        </p>
      </div>
    </el-col>

    <el-col :md="6"
            :sm="9"
            :xs="7"
            class="user-icon-col">
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            {{userInfo.user_name || userInfo.phone}}<br>
            {{userInfo.job_name}}
          </span>
          <el-dropdown-menu slot="dropdown">

            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <ProjectListDialog :dialogVisible.sync="projectListDialogVisible"></ProjectListDialog>
    <!-- 修改密码弹窗 -->
    <el-dialog :visible.sync="changePswFormVisible"
               :close-on-click-modal="false"
               @close="closeDialog"
               width="35%">
      <el-form :model="ruleForm"
               ref="ruleForm"
               :rules="rules"
               status-icon
               label-width="80px">
        <el-form-item label="原密码"
                      prop="old_password">
          <el-input v-model="ruleForm.old_password"
                    type="password"
                    class="password-input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="password">
          <el-input v-model="ruleForm.password"
                    class="password-input"
                    type="password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="confirm_password">
          <el-input v-model="ruleForm.confirm_password"
                    type="password"
                    class="password-input"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="changePswFormVisible = false,clearPass('ruleForm')">取 消</el-button>
        <el-button type="primary"
                   @click="changePsw('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import { loginApi } from '@/services/Login'
import { _ } from '@/helper'
import ProjectListDialog from '@/components/ProjectList/ProjectListDialog'
export default {
  data () {
    let checkOldPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    let checkPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let checkPassAgain = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      defaultActiveIndex: '/',
      userInfo: {},
      changePswFormVisible: false,
      showBtn: true,
      ruleForm: {
        old_password: '',
        password: '',
        confirm_password: ''
      },
      rules: {
        old_password: [
          { validator: checkOldPass, trigger: 'blur' }
        ],
        password: [
          { validator: checkPass, trigger: 'blur' }
        ],
        confirm_password: [
          { validator: checkPassAgain, trigger: 'blur' }
        ]
      },
      navList: {},
      // 项目列表弹框是否可见
      projectListDialogVisible: false,
      // 单位信息
      companyInfo: {}
    }
  },
  watch: {
    roleInfo: {
      handler (newval, oldval) {
        if (newval.topNav) {
          this.navList = newval
        }
        console.log(this.navList, this.roleInfo, '00000')
      },
      deep: true
    }
  },
  components: {
    ProjectListDialog
  },
  computed: {
    roleInfo () {
      let store = this.$store.state.roleInfo
      let local = JSON.parse(window.localStorage.getItem('roleInfo')) || {}
      let role = store || local

      return role
    },
    pageSize () {
      let store = this.$store.state.pageSize
      return store || {}
    },
    choosedPro () {
      let store = this.$store.state.choosedProject
      return store
    }

  },
  created () {
    if (window.localStorage.userInfo) {
      this.userInfo = JSON.parse(window.localStorage.userInfo)
      if (this.userInfo.job_list.length > 0) {
        this.userInfo.job_name = this.userInfo.job_list[0].job_name
      }
    }
    let companyInfo = window.localStorage.companyInfo
    this.companyInfo = JSON.parse(companyInfo)
  },
  mounted () {
    this.fixedActiveTabs()
  },
  methods: {
    handleSelect (key, keyPath) {
      let activeNav = this.roleInfo.nav[key]
      console.log(key, this.$route, 'top nav select')
      if (activeNav) {
        this.$store.dispatch('sideNav', activeNav)
        window.localStorage.setItem('platFormSideNav', JSON.stringify(activeNav))
      }
      if (this.$route.path === '/home' && key !== 'home') {
        // 当前页面是home时，点击一级菜单会跳转到该菜单下第一个页面
        this.getMenuFirstPage(activeNav)
      }
      if (key === 'home') {
        this.$router.push({
          path: '/home'
        })
      }
    },
    // 获取指定菜单下第一个页面
    getMenuFirstPage (menu) {
      if (menu[0].children_list) {
        this.getMenuFirstPage(menu[0].children_list)
      } else {
        this.$router.push({
          path: '/' + menu[0].route_url
        })
      }
    },
    // 切换左侧菜单折叠状态
    toggleLeftNav (e) {
      e.preventDefault()
      let isCollapse = this.$store.state.isLeftNavCollapse
      this.$store.dispatch('setLeftNavCollapse', !isCollapse)
    },
    // 退出登录
    logout () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // loginApi.logout({
        // }).then(res => {
        //   if (res.msg === 'SUCCESS') {
        //     this.$message({
        //       type: 'success',
        //       message: '已退出登录!'
        //     })
        //     window.sessionStorage.removeItem('token')
        //     window.sessionStorage.removeItem('user_id')
        //     window.sessionStorage.removeItem('userInfo')
        //     this.$router.push('./login')
        //   }
        // })
        this.$router.push({
          path: '/login'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    openDialog () {
      this.changePswFormVisible = true
    },
    // 修改密码
    changePsw (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          loginApi.changePass({
            data: {
              old_password: this.ruleForm.old_password,
              user_id: window.sessionStorage.getItem('user_id'),
              password: this.ruleForm.password,
              confirm_password: this.ruleForm.confirm_password
            }
          }).then(res => {
            if (res.msg === 'SUCCESS') {
              this.$message({
                type: 'success',
                message: '修改成功，请重新登录!'
              })
              window.sessionStorage.removeItem('token')
              window.sessionStorage.removeItem('user_id')
              window.sessionStorage.removeItem('userInfo')
              this.$router.push('./login')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清除密码
    clearPass (ruleForm) {
      this.$refs[ruleForm].resetFields()
    },
    // 修改密码对话框关闭回调
    closeDialog () {
      this.clearPass('ruleForm')
    },
    // 监测页面滚动，在滚动一定距离后让标签栏fixed
    fixedActiveTabs () {
      let container = document.getElementsByClassName('content-container')
      let content = document.getElementsByClassName('grid-content')
      container[0].addEventListener('scroll', _.throttle(() => {
        let clientRect = content[0].getBoundingClientRect()
        let pos = {
          top: clientRect.top,
          width: clientRect.width
        }
        this.$store.dispatch('getScrollTop', pos)
        // console.log(clientRect, 'client rect')
      }, 100))
    },
    // 显示项目列表弹框
    toggleProject () {
      this.projectListDialogVisible = true
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .password-input {
  width: 80%;
}
/deep/ .password-code {
  width: 48%;
}
/deep/ .change-btn {
  width: 31%;
}
.head-container {
  width: 100vw;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f1f2f7;
  padding: 0 15px;
  .el-col {
    height: 65px;
  }
  .logo-container {
    display: flex;
    align-items: center;
    .topbar-logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 28px;
        height: 40px;
        margin-right: 14px;
      }
      p {
        font-size: 18px;
        color: #000;
      }
    }
  }
  .topbar-title {
    text-align: center;
    line-height: 65px;
    p {
      font-size: 14px;
      color: #666;
      span {
        color: #1441b3;
        cursor: pointer;
      }
    }
  }
  .el-menu.el-menu--horizontal {
    height: 65px;
    line-height: 65px;
    display: flex;
    align-items: center;
    border-bottom: 0;

    .el-menu-item {
      height: 39px;
      line-height: 39px;
      border-bottom: 0;
      border-radius: 0;
      padding: 0 10px;
      margin: 0 10px;
      &:hover,
      &:focus {
        color: #333;
        background-color: #eee;
        border-bottom: 0;
      }
      &:focus {
        background: none;
      }
      .is-active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .user-icon-col {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .topbar-account {
      width: 112px;
      height: 43px;
      text-align: center;
    }
  }
}
</style>
