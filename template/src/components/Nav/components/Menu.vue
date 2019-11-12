<script>
import 'element-ui/lib/theme-chalk/index.css'
import { ThirdPartyLoginApi } from '@/services/Public'
export default {
  data () {
    return {
      data: [
        {
          name: 'parent',
          children: [
            { name: 'children' }
          ]
        }
      ]
    }
  },
  computed: {
    getNavList () {
      let store = this.$store.state.sideNav
      let local = window.localStorage.getItem('platFormSideNav') || '[]'
      local = JSON.parse(local)
      let sideNav = store.length > 0 ? store : local
      sideNav = sideNav.sort((a, b) => {
        return (Number(a.order_no) - Number(b.order_no))
      })
      return sideNav
    },
    activeTab () {
      let store = this.$store.state.activeTab
      let local = window.localStorage.getItem('platFormActiveTab')
      let name = store === '' ? store : local
      return name
    },
    isLeftNavCollapse () {
      let isCollapseState = this.$store.state.isLeftNavCollapse
      return isCollapseState
    },
    isLeftNavHidden () {
      let state = this.$store.state.isLeftNavHidden
      return state || false
    },
    // 通过isCollapse和isHidden判断是否显示左侧菜单
    isLeftNavShow () {
      console.log(this.isLeftNavCollapse, this.isLeftNavHidden)
      if (this.isLeftNavHidden) {
        return !this.isLeftNavCollapse
      } else {
        return this.isLeftNavCollapse
      }
    }
  },
  methods: {
    // 点击左侧菜单时将路由添加到标签栏中
    addActiveTabs (nav, floor, upperMenu) {
      console.log(nav, floor, upperMenu, 'click')
      this.$store.dispatch('setActiveTabs', nav)
      if (nav.menu_type === '1') {
        this.$router.push({
          path: '/' + nav.route_url
        })
      } else {
        this.thirdPartyLogin(nav.outer_url)
      }
    },
    // 跳转到外部子系统
    thirdPartyLogin (platform) {
      ThirdPartyLoginApi.thirdPartyLogin({
        params: {
          platform: platform
        }
      }).then(res => {
        console.log(res, 'third party')
        if (res.code === 1) {
          window.open(res.data.url + '?token=' + res.data.token + '&sid=' + res.data.sid)
        }
      })
    }
  },
  render () {
    // 根据是否有children_list分别生成submenu或者menuitem
    // 渲染时，记录所处的层级及其上级的菜单编号列表
    let renderMenu = (menuList, floor, upperMenuList) => {
      return menuList.map(item => {
        if (item.children_list) {
          return (
            <el-submenu {...{ attrs: { 'index': item.menu_id, 'key': item.menu_id } }}>
              <template slot="title">
                <i {...{ attrs: { 'class': item.menu_css === '' ? 'fa-bars' : item.menu_css + ' fa' } }}></i>
                <span>{item.menu_name}</span>
              </template>
              {
                renderMenu(item.children_list, floor + 1, upperMenuList.push(item.p_menu_no))
              }
            </el-submenu>
          )
        } else {
          return (
            <el-menu-item onClick={() => this.addActiveTabs(item, floor, upperMenuList)}
              {...{ attrs: { 'key': item.menu_id, 'index': item.route_url, 'class': (item.route_url === this.activeTab ? 'is-active' : '') + ' el-menu-item' } }}>
              <i {...{ attrs: { 'class': (item.menu_css === '' ? 'fa-bars' : item.menu_css) + ' fa' } }}></i>
              <span slot="title">{item.menu_name}</span>
            </el-menu-item>
          )
        }
      })
    }
    return (
      <el-menu {...{ attrs: {}, props: { 'router': false, 'collapse': this.isLeftNavCollapse } }}>
        {
          renderMenu(this.getNavList, 1, [])
        }
      </el-menu>
    )
  }
}
</script>
<style scoped lang="scss">
.el-menu-vertical-demo {
  .el-submenu {
    .el-submenu__title {
      .fa {
        margin-right: 4px;
      }
    }
  }
  .el-menu-item {
    .fa {
      margin-right: 4px;
    }
  }
  .el-menu {
    width: 210px;
    .el-menu-item {
      &.is-active {
        color: #303133;
      }
      &.active {
        color: #409eff;
      }
    }
    .fa {
      margin-right: 4px;
    }
  }
}

/deep/.el-menu {
  border: none;
}
.menu {
  width: 100%;
  // width: 210px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
