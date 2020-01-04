import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import Login from '@/pages/Login/Login'
import LeftNav from '@/components/Nav/LeftNav'
import TopNav from '@/components/Nav/TopNav'
import ActiveTabs from '@/components/ActiveTabs/ActiveTabs'

// 组织架构
export const Organization = [
  {
    path: '/organizationFramework',
    name: '组织架构',
    components: {
      default: () => import('@/pages/Organization/OrganizationFramework'),
      top: TopNav,
      aside: LeftNav,
      activeTabs: ActiveTabs
    }
  },
  {
    path: '/permissionManage',
    name: '权限管理',
    components: {
      default: () => import('@/pages/Organization/PermissionManage'),
      top: TopNav,
      aside: LeftNav,
      activeTabs: ActiveTabs
    }
  },
  {
    path: '/menuManage',
    name: '菜单管理',
    components: {
      default: () => import('@/pages/Organization/MenuManage'),
      top: TopNav,
      aside: LeftNav,
      activeTabs: ActiveTabs
    }
  },
  {
    path: '/permissionTemplate',
    name: '权限模板管理',
    components: {
      default: () => import('@/pages/Organization/PermissionTemplate'),
      top: TopNav,
      aside: LeftNav,
      activeTabs: ActiveTabs
    }
  }
]

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
        ...Organization

      ]
    }]
})
