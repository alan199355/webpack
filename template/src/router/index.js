import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import Login from '@/pages/Login/Login'
import LeftNav from '@/components/Nav/LeftNav'
import TopNav from '@/components/Nav/TopNav'
import ActiveTabs from '@/components/ActiveTabs/ActiveTabs'

export const Home = [
  {
    path: '/home',
    name: 'home',
    component: {
      default: () => import('@/pages/WisdomBalance/Dashboard'),
      top: TopNav,
      aside: LeftNav,
      activeTabs: ActiveTabs
    }
  }
]

// 施工段管理

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/',
      name: 'root',
      component: index,
      redirect: '/home',
      children: [

        ...Home

      ]
    }]
})
