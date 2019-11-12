// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import '@/assets/css/style.css'
import '@/assets/fontAwesome/css/font-awesome.min.css'
import echarts from 'echarts'

import { _ } from '@/helper'

import scroll from 'vue-seamless-scroll'

import { HappyScroll } from 'vue-happy-scroll'
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

import Print from '@/plugs/print'

// console.log(_, 'lodash')

Vue.prototype.$echarts = echarts
// axios.defaults.baseURL = 'http://dev_hzjw.ihibuilding.cn' // 无缝滚动
Vue.use(scroll)
// 自定义组件名
Vue.component('happy-scroll', HappyScroll)

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.use(Print) // 注册

let userAuthStore = store.state.userAuth
let userAuthLocal = JSON.parse(window.sessionStorage.industryUserAuth || '[]')
if (userAuthStore.length === 0) {
  store.dispatch('setUserAuth', userAuthLocal)
}

router.beforeEach((to, from, next) => {
  // console.log(from, store.state.userAuth, 'router')
  store.dispatch('setActiveTab', to.path)
  if (to.path !== '/home') {
    getPageAuth(from)
  }

  next()
})
// 页面跳转时获取目标页面的权限
let getPageAuth = (from) => {
  let userAuth = store.state.userAuth
  let pageAuth = {}
  let targetPage = store.state.activeTab
  userAuth.map((item) => {
    if (item.object_no === targetPage) {
      pageAuth = item
    }
  })
  store.dispatch('getPageAuth', pageAuth)
  // if (Object.keys(pageAuth).length === 0 && from.path !== '/home') {
  //   router.push({
  //     path: '/home'
  //   })
  // }
}
// 页面大小变化时判断是否需要折叠左侧菜单
let appDom = document.getElementsByTagName('body')[0]

let toggleLeftNav = () => {
  let width = appDom.getBoundingClientRect().width
  if (width < 992) {
    store.dispatch('setLeftNavCollapse', true)
  } else {
    store.dispatch('setLeftNavCollapse', false)
  }
  if (width < 768) {
    store.dispatch('setLeftNavHidden', true)
  } else {
    store.dispatch('setLeftNavHidden', false)
  }
  store.dispatch('getPageSize', appDom.getBoundingClientRect())
}
window.addEventListener('resize', _.throttle(() => {
  toggleLeftNav()
}, 100))
toggleLeftNav()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
