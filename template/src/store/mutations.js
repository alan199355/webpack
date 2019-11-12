export const mutations = {
  count (state, count) {
    state.count = count
  },
  sideNav (state, nav) {
    state.sideNav = nav
  },
  addRole (state, roleInfo) {
    state.roleInfo = roleInfo
  },

  // 刷新页面时从localstorage中取值，并重置activeTabsList
  resetActiveTabsList (state, activeTabsList) {
    state.activeTabsList = activeTabsList
  },
  // 路由跳转时将路由添加到激活页面列表中，需要判断是否存在
  setActiveTabs (state, activeTabs) {
    let flag = true
    if (state.activeTabsList.length > 0) {
      state.activeTabsList.map((item) => {
        if (item.route_url === activeTabs.route_url) flag = false
      })
    }
    if (flag) {
      state.activeTabsList.push(activeTabs)
    }
    window.localStorage.setItem('platFormActiveTabsList', JSON.stringify(state.activeTabsList))
  },
  // 将需要删除的页面从列表中移除
  removeActiveTabs (state, activeTabs) {
    let index = -1
    state.activeTabsList.map((item, i) => {
      if (item.route_url === activeTabs.route_url) index = i
    })
    if (index >= 0) state.activeTabsList.splice(index, 1)
    window.localStorage.setItem('platFormActiveTabsList', JSON.stringify(state.activeTabsList))
  },
  // 当前页面所在路由
  setActiveTab (state, activeTab) {
    state.activeTab = activeTab.substr(1)
    console.log(activeTab.substr(1), 'vuex')
    window.localStorage.setItem('platFormActiveTab', state.activeTab)
  },

  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },

  // 设置左侧菜单是否折叠
  setLeftNavCollapse (state, isCollapse) {
    state.isLeftNavCollapse = isCollapse
  },
  // 设置左侧菜单是否隐藏
  setLeftNavHidden (state, isHidden) {
    state.isLeftNavHidden = isHidden
  },
  // 获取当前页面大小
  getPageSize (state, pageSize) {
    state.pageSize = pageSize
  },
  // 存储用户权限列表
  setUserAuth (state, userAuth) {
    state.userAuth = userAuth
    window.sessionStorage.setItem('industryUserAuth', JSON.stringify(userAuth))
  },
  // 获取当前页面权限
  getPageAuth (state, pageAuth) {
    state.pageAuth = pageAuth
  },
  // 获取主内容区滚动距离
  getScrollTop (state, scrollTop) {
    state.scrollTop = scrollTop
  },


}
