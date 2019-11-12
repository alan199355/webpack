<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24">
      <router-view name="top"></router-view>
    </el-col>
    <el-col :span="24"
            class="main">
      <!--左侧导航-->
      <router-view name="aside"></router-view>
      <!--右侧内容区-->
      <section class="content-container">
        <router-view name="activeTabs"></router-view>
        <div class="grid-content bg-purple-light">
          <keep-alive>
            <transition name="fade"
                        mode="out-in">
              <router-view></router-view>
            </transition>
          </keep-alive>
        </div>
      </section>
    </el-col>

  </el-row>
</template>
<script>
// import { userInfoApi } from '@/services/user'
import { userPermissionApi } from '@/services/UserPermission'
import { DashboardApi } from '@/services/Dashboard'
export default {
  name: 'home',
  data () {
    return {
      loading: false,
      requestParams: {
        id: 1
      },
      userMenu: [],
      // 完善用户资料弹框是否可见
      editUserInfoDialogVisible: false,
      // 项目列表弹框是否可见
      projectListDialogVisible: false,
      // 项目列表
      projectList: {},
      projectListParam: {

      }
    }
  },
  components: {

  },
  computed: {
    userInfoDialogVisible () {
      let store = this.$store.state.userInfoDialogVisible
      return store
    }
  },
  methods: {
    // 显示项目列表弹框
    showProjectList () {
      this.projectListDialogVisible = true
    },
    setUserMenu () {
      let roleInfo = {
        nav: {

        },
        topNav: [

        ]
      }
      this.$store.dispatch('addRole', roleInfo)
      let first = ''
      this.userMenu.map(item => {
        roleInfo.nav[item.menu_id] = item.children_list
        roleInfo.topNav.push(item)
      })
      first = roleInfo.topNav[0].menu_id
      window.localStorage.setItem('platFormRoleInfo', JSON.stringify(roleInfo))
      if (window.localStorage.getItem('platFormSideNav') === 'undefined' || window.localStorage.getItem('platFormSideNav') === null) {
        this.$store.dispatch('sideNav', roleInfo.nav[first])
        window.localStorage.setItem('platFormSideNav', JSON.stringify(roleInfo.nav[first]))
      }
    },  
    login () {
      userPermissionApi.login({
        data: {
          user_no: '18200283200',
          password: 'hz123456',
          login_type: '1'
        }
      })
    },
    // 获取菜单
    getMenuTree () {
      let userId = window.localStorage.getItem('user_id')
      userPermissionApi.getMenuTree({
        data: {
          user_id: userId
        }
      }).then(res => {
        console.log(res, 'menu tree')
        if (res.data.list.length > 0) {
          this.userMenu = res.data.list
          this.setUserMenu()
        }
      })
    },
    // 获取项目列表
    getProjectList () {
      DashboardApi.getProjectList({
        params: this.projectListParam
      }).then(res => {
        console.log(res, 'get project list')
        if (res.code === 0) {
          this.projectList = res.data
          if (this.projectList.list.length > 0) {
            this.projectList.list.map((item) => {
              this.$set(item, 'checked', false)
            })
            this.$store.dispatch('setProjectList', this.projectList)
            this.$store.dispatch('setProject', this.projectList.list[0])
          } else {
            this.$store.dispatch('setProjectList', [])
            this.$store.dispatch('setProject', {})
          }
        }
      })
      // this.projectList = {
      //   data: [
      //     { id: 1, project_name: '北大桥', address: '北大桥123', company_name: '建工' },
      //     { id: 2, project_name: '大江东', address: '大江东123', company_name: '建委' }
      //   ],
      //   total: 2,
      //   total_count: 2
      // }
    },
    // 存入用户数据
    autoLogin (info) {
      window.sessionStorage.setItem(
        'access_token',
        info.access_token
      )
      window.localStorage.setItem(
        'userInfo',
        JSON.stringify(info)
      )
    }

  },
  created () {
    let autoLoginInfo = this.$route.query.autologin

    if (autoLoginInfo) {
      let obj = JSON.parse(JSON.parse(decodeURI(autoLoginInfo)))
      console.log(obj, 'index query')
      if (obj.code === 0) {
        this.autoLogin(obj.data)
      }
    }
    this.getMenuTree()
    this.getProjectList()
  }
}
</script>
<style lang="scss" scoped>
.main {
  min-height: 500px;
  height: auto;
  overflow-y: auto;
}
/deep/ .left_nav {
  width: auto;
  height: 100vh;
  border-right: solid 1px #e6e6e6;
  overflow-y: auto;
}
.container {
  .project-icon {
    width: 52px;
    height: 60px;
    position: fixed;
    top: 30%;
    right: 0;
    cursor: pointer;
  }
}
</style>
