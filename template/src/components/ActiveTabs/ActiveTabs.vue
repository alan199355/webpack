<template>
  <div class='active-tabs-container'>
    <p>
      <span @click="back"
            class="back">返回</span>
      <i>/</i>
      <span class="parent">{{routeMeta.parName}}</span>
      <i>/</i>
      <span class="now">{{routeMeta.name}}</span>
    </p>
    <!-- <el-tag :type="activeTab==homePage.route_url?'success':''"
            class="active-tabs"
            @click="toggleTabs(homePage)">
      {{homePage.menu_name}}
    </el-tag>

    <el-tag :type="item.route_url.indexOf(activeTab)>=0?'success':''"
            closable
            class="active-tabs"
            @click="toggleTabs(item)"
            @close="closeTabs(item)"
            v-for="(item, index) in activeTabsList"
            :key="index">{{item.menu_name}}</el-tag> -->

  </div>
</template>
<script>

export default {
  data () {
    return {
      // 当前路由名
      routeName: '',
      homePage: {
        route_url: 'home',
        menu_name: '首页'
      },
      // 当滚动一定距离后，为标签栏添加样式
      tabStyle: {},
      // 标签栏的偏移量，以实现左右滑动
      offset: 0,
      // 当前路由名及上级页面名称
      routeMeta: {}
    }
  },
  computed: {
    activeTabsList () {
      let store = this.$store.state.activeTabsList
      let local = JSON.parse(window.localStorage.getItem('platFormActiveTabsList')) || []
      let tabsList = []
      if (store.length === 0) {
        if (local.length !== 0) {
          tabsList = local
          this.$store.dispatch('resetActiveTabsList', local)
        }
      } else {
        tabsList = store
      }
      console.log(store, local, 'computed activetabs')
      // let tabsList = store.length > 0 ? store : local
      return tabsList
    },
    activeTab () {
      let store = this.$store.state.activeTab
      let local = window.localStorage.getItem('platFormActiveTab')
      let name = store === '' ? store : local
      return name
    },
    scrollTop () {
      let store = this.$store.state.scrollTop
      return store
    }

  },
  watch: {
    scrollTop: {
      handler (newval, oldval) {
        if (newval.top < 80) {
          this.tabStyle = {
            position: 'fixed',
            width: newval.width + 30 + 'px'
          }
        } else {
          this.tabStyle = {
            position: 'relative'
          }
        }
        // console.log(newval, 'watch')
      },
      deep: true
    },
    activeTabsList: {
      handler (newval, oldval) {
        console.log(newval, 'watch')
      },
      deep: true
    }
  },
  methods: {
    // 切换标签
    toggleTabs (item) {
      console.log(item)
      this.setTopNavActive(item)
      this.$router.push({ path: '/' + item.route_url })
    },
    // 根据目标标签为顶部菜单设置激活状态
    setTopNavActive (item) {
      let roleInfo = this.$store.state.roleInfo
      let topNav = roleInfo.topNav
      topNav.map((navItem) => {
        if (navItem.menu_no === item.p_menu_no) {
          navItem.active = true

          this.$store.dispatch('sideNav', navItem.children_list)
        } else {
          navItem.active = false
        }
      })
      this.$store.dispatch('addRole', roleInfo)
    },
    // 关闭标签
    closeTabs (item) {
      // 首先判断要关闭的路由是否是最后一个激活状态的路由，是则跳转到home
      // 然后判断要关闭的路由是否是当前路由，是则跳转到左侧的路由

      let store = this.$store.state.activeTabsList
      // 当前页面路由名
      let activeTab = this.$store.state.activeTab
      // 将要关闭的路由所在的index
      let closeTabIndex = -1
      // console.table(store)
      if (store.length === 1) {
        this.$router.push({ path: '/home' })
      } else {
        if (activeTab === item.route_url) {
          store.map((tabItem, index) => {
            if (tabItem.route_url === item.route_url) closeTabIndex = index
          })
          // 关闭当前页面后将要显示的页面的index
          // 如果当前页面index为0，说明为第一个，取第二个路由
          // 否则取左侧的路由
          let showTabIndex = closeTabIndex - 1 >= 0 ? closeTabIndex - 1 : closeTabIndex
          this.$router.push({ path: '/' + store[showTabIndex].route_url })
          // console.log(store, showTabIndex, closeTabIndex, 'remove')
        }
      }
      // this.activeTabsList.splice(closeTabIndex, 1)
      // this.$store.dispatch('resetActiveTabsList', this.activeTabsList)
      console.log(item, 'remove item')
      this.$store.dispatch('removeActiveTabs', item)
    },
    back () {
      this.$router.go(-1)
    }
  },
  created () {
    console.log(this.$route, 'route')
    this.routeMeta = this.$route.meta
  },
  mouted () {

  }
}
</script>
<style scoped lang='scss'>
.active-tabs-container {
  padding: 0;
  display: flex;
  height: 40px;
  // background-color: #fff;
  z-index: 200;
  transition: position ease 2s;
  position: relative;
  i {
    font-style: normal;
  }
  p {
    line-height: 40px;
    padding-left: 20px;
    font-size: 14px;
    color: #999;
    .back {
      cursor: pointer;
    }
    .now {
      color: #333;
    }
  }
  > .fa {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    font-size: 20px;
    line-height: 40px;
    &.icon-left {
      left: 0;
    }
    &.icon-right {
      right: 0;
    }
  }
  .active-tabs {
    cursor: pointer;
    height: 40px;

    line-height: 40px;
    margin-right: 10px;
    background-color: #fff;
    color: #000;
    border: 0;
    font-size: 14px;
    border-radius: 0;
    &.el-tag--success {
      color: #009688;
      border-bottom: 2px solid #009688;
    }
  }
}
</style>
