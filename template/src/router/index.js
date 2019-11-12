import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import Login from '@/pages/Login/Login'
import LeftNav from '@/components/Nav/LeftNav'
import TopNav from '@/components/Nav/TopNav'
// import home from '@/components/container/home'
import Dashboard from '@/pages/WisdomBalance/Dashboard'
import Systeam from '@/components/container/systeam'

import ActiveTabs from '@/components/ActiveTabs/ActiveTabs'
import ConstructionSection from '@/pages/WBS/ConstructionSection'
import ArrivalRecord from '@/pages/WisdomBalance/ArrivalRecord'
import ArrivalDetail from '@/pages/WisdomBalance/ArrivalDetail'
import MaterialMaintain from '@/pages/WisdomBalance/MaterialMaintain'
import WarningManage from '@/pages/WisdomBalance/WarningManage'

import SupplyManage from '@/pages/SupplyManage/SupplyManage'
import ConversionWeight from '@/pages/SupplyManage/ConversionWeight'
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
        // {
        //   path: '/home',
        //   name: '首页',
        //   components: {
        //     default: home,
        //     top: TopNav
        //   }
        // },
        {
          path: '/home',
          name: '地磅看板',
          components: {
            default: Dashboard,
            top: TopNav,
            aside: LeftNav
          }
        },
        {
          path: '/systeam',
          name: '系统',
          components: {
            default: Systeam,
            top: TopNav,
            aside: LeftNav

          }
        },
        {
          path: '/constructionSection',
          name: '施工段划分',
          components: {
            default: ConstructionSection,
            top: TopNav,
            aside: LeftNav

          }
        },
        {
          path: '/ArrivalRecord',
          name: '进料管理',
          components: {
            default: ArrivalRecord,
            top: TopNav,
            aside: LeftNav

          }
        },
        {
          path: '/supplyManage',
          name: '供应商管理',
          components: {
            default: SupplyManage,
            top: TopNav,
            aside: LeftNav
          }
        },
        {
          path: '/ArrivalDetail',
          name: '进料详情',
          meta: {
            name: '进料管理',
            parName: '详情'
          },
          components: {
            default: ArrivalDetail,
            top: TopNav,
            aside: LeftNav,
            activeTabs: ActiveTabs
          }
        },
        {
          path: '/conversionWeight',
          name: '供应商管理/容重换算',
          meta: {
            name: '容重换算',
            parName: '供应商管理'
          },
          components: {
            default: ConversionWeight,
            top: TopNav,
            aside: LeftNav,
            activeTabs: ActiveTabs
          }
        },
        {
          path: '/MaterialMaintain',
          name: '材料维护',
          components: {
            default: MaterialMaintain,
            top: TopNav,
            aside: LeftNav

          }
        },
        {
          path: '/WarningManage',
          name: '预警管理',
          components: {
            default: WarningManage,
            top: TopNav,
            aside: LeftNav

          }
        }

      ]
    }]
})
