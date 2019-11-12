<template>
  <div v-if="!isLeftNavHidden || !isLeftNavCollapse"
       class="left_nav"
       :class="{'hidden':isLeftNavHidden && !isLeftNavCollapse}">
    <div class="mask"
         @click.stop="toggleLeftNav(true)"
         v-if="isLeftNavHidden && !isLeftNavCollapse"></div>
    <!-- <el-menu default-active="1-4-1"
             class="el-menu-vertical-demo"
             @open="handleOpen"
             @close="handleClose"
             :collapse="isLeftNavCollapse"
             :router="true">

      <el-submenu v-for="(item,firstIndex) in getNavList.hasChild"
                  :key="item.menu_id"
                  :index="firstIndex+''">
        <template slot="title">
          <i class="fa"></i>
          <span slot="title">{{item.menu_name}}</span>
        </template>
        <el-menu-item v-for="(secondMenu, index) in item.children_list"
                      :key="index"
                      @click="addActiveTabs(secondMenu)"
                      :index="secondMenu.route_url"
                      :class="secondMenu.route_url===activeTab?'active':''">
          <i :class="secondMenu.menu_css===''?'fa-bars':secondMenu.menu_css"
             class="fa"></i>
          <span slot="title">{{secondMenu.menu_name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-for="(item) in getNavList.noChild"
                    :key="item.menu_id"
                    @click="addActiveTabs(item)"
                    :index="item.route_url"
                    :class="item.route_url===activeTab?'active':''">
        <i :class="item.menu_css===''?'fa-bars':item.menu_css"
           class="fa"></i>
        <span slot="title">{{item.menu_name}}</span>
      </el-menu-item>

    </el-menu> -->
    <Menu></Menu>
  </div>
</template>
<script>
import Menu from './components/Menu'
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    // getNavList () {
    //   let store = this.$store.state.sideNav
    //   let local = JSON.parse(window.localStorage.getItem('sideNav') || [])
    //   let sideNav = store.length > 0 ? store : local
    //   console.log(sideNav, 'side')
    //   return sideNav
    // },
    getNavList () {
      let store = this.$store.state.sideNav
      let local = JSON.parse(window.localStorage.getItem('platFormSideNav')) || []
      let sideNav = store.length > 0 ? store : local
      let navListObj = {
        hasChild: [],
        noChild: []
      }
      console.log(store, local, 'side nav')
      if (sideNav.length > 0) {
        sideNav.map((item) => {
          if (item.children_list) {
            navListObj.hasChild.push(item)
          } else {
            navListObj.noChild.push(item)
          }
        })
      }
      return navListObj
    },
    activeTab () {
      let store = this.$store.state.activeTab
      let local = window.localStorage.getItem('platFormActiveTab')
      let name = store === '' ? store : local
      return name
    },
    isLeftNavCollapse () {
      let isCollapseState = this.$store.state.isLeftNavCollapse
      return isCollapseState || false
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
  components: {
    Menu
  },
  created () { },
  mounted () { },
  methods: {
    handleOpen (key, keyPath) {

    },
    handleClose (key, keyPath) {

    },
    // 点击菜单时将路由加载到激活状态的路由列表中
    addActiveTabs (nav) {
      console.log(nav, 'click')
      this.$store.dispatch('setActiveTabs', nav)
    },
    toggleLeftNav (isCollapse) {
      this.$store.dispatch('setLeftNavCollapse', isCollapse)
    }

  }
}
</script>

<style scoped lang="scss">
.left_nav {
  // width: 220px;
  height: 100%;
  border-right: solid 1px #e6e6e6;
  overflow-x: hidden;
  &.hidden {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    .el-menu {
      z-index: 101;
      height: 100vh;
    }
  }
  .mask {
    width: 100vw;
    height: 100vh;
    background: rgba($color: #000000, $alpha: 0.3);
    z-index: 99;
    position: absolute;
  }
  .el-menu {
    .el-menu-item {
      &.is-active {
        color: #303133;
      }
      &.active {
        color: #409eff;
      }
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

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
