import Vue from 'vue'
import Vuex from 'vuex'
import { mutations } from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    sideNav: [],
    roleInfo: {
      nav: {},
      num: 0,
      topNav: {}
    },
    // 激活状态的路由列表
    activeTabsList: [],
    // 所在页面的路由
    activeTab: '',
    menuTree: [],
    userInfo: {},

    // 左侧菜单是否折叠
    isLeftNavCollapse: false,
    // 左侧菜单是否隐藏
    isLeftNavHidden: false,
    // 页面大小
    pageSize: {},
    // 用户权限列表
    userAuth: [],
    // 当前页面权限
    pageAuth: {},
    // 滚动距离
    scrollTop: {},

  },
  getters: {
    countNum: state => {
      return state.count
    },
    topNavList: state => {
      return state.roleInfo
    },
    // 判断按钮/子页面/组件是否有权限
    getComponentAuth: (state) => (name) => {
      let childAuthList = state.pageAuth.child_list || []
      let hasAuth = childAuthList.find((item) => {
        return item.object_no === name
      })
      return Boolean(hasAuth)
    }
  },
  actions,
  mutations
})
