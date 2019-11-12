export default {
  addCount ({ commit }, count) {
    commit('count', count)
  },
  // 侧边栏数据
  sideNav ({ commit }, nav) {
    commit('sideNav', nav)
  },
  // 用户权限及可访问路由数据
  addRole ({ commit }, roleInfo) {
    commit('addRole', roleInfo)
  },

  // 将目标路由添加到激活状态路由列表
  setActiveTabs ({ commit }, activeTabs) {
    commit('setActiveTabs', activeTabs)
  },
  // 将目标路由从激活状态路由列表中移除
  removeActiveTabs ({ commit }, activeTabs) {
    commit('removeActiveTabs', activeTabs)
  },
  // 以当前页面路由名为激活状态路由
  setActiveTab ({ commit }, activeTab) {
    commit('setActiveTab', activeTab)
  },
  // 重置激活状态路由列表
  resetActiveTabsList ({ commit }, activeTabsList) {
    commit('resetActiveTabsList', activeTabsList)
  },

  // 用户信息
  setUserInfo ({ commit }, userInfo) {
    commit('setUserInfo', userInfo)
  },

  // 设置左侧菜单是否折叠
  setLeftNavCollapse ({ commit }, isCollapse) {
    commit('setLeftNavCollapse', isCollapse)
  },
  // 设置左侧菜单是否隐藏
  setLeftNavHidden ({ commit }, isHidden) {
    commit('setLeftNavHidden', isHidden)
  },
  // 存储当前页面的大小
  getPageSize ({ commit }, pageSize) {
    commit('getPageSize', pageSize)
  },
  // 存储用户权限
  setUserAuth ({ commit }, userAuth) {
    commit('setUserAuth', userAuth)
  },
  // 获取当前页面权限
  getPageAuth ({ commit }, auth) {
    commit('getPageAuth', auth)
  },
  // 获取主内容区滚动距离
  getScrollTop ({ commit }, scrollTop) {
    commit('getScrollTop', scrollTop)
  },


}
