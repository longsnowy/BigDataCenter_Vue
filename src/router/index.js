import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '数据中心', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/datasource',
    children: [
      {
        path: 'datasource',
        component: () => import('@/views/data/datasource'),
        name: 'Dashboard',
        meta: { title: '数据源管理', icon: 'excel', affix: true }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/upload-excel',
    children: [
      {
        path: 'upload-excel',
        component: () => import('@/views/data/upload-excel'),
        name: '从Excel导入数据源',
        meta: { title: '导入数据源', icon: 'excel', affix: true }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/tablerela/:id',
    hidden: true,
    children: [
      {
        path: 'tablerela/:id/:id2',
        component: () => import('@/views/data/tableRela'),
        name: '表关联分析',
        meta: { title: '表关联分析', icon: 'excel', affix: true }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/tablerela',
    children: [
      {
        path: 'tablerela',
        component: () => import('@/views/data/tableRelaSearch'),
        name: '表关联分析',
        meta: { title: '表关联分析', icon: 'excel', affix: true }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/addfromexcel/:id',
    hidden: true,
    children: [
      {
        path: '/addfromexcel/:id',
        component: () => import('@/views/data/addFromExcel'),
        name: '从Excel导入数据',
        meta: { title: '导入数据', icon: 'excel', affix: true }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'Excel',
      icon: 'excel',
    },
    hidden: true,
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/data/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      },
      {
        path: '/upload',
        component: () => import('@/views/data/uploadFile'),
        name: 'UploadExcel',
        meta: { title: 'Upload' }
      },
      {
        path: '/tabledata/:id',
        component: () => import('@/views/data/tableData'),
        name: 'tabledata',
        meta: { title: '表数据管理' }
      },{
        path: '/tabledic/:id',
        component: () => import('@/views/data/tableDic'),
        name: 'tabledic',
        meta: { title: '表字典管理' }
      }
      // {
      //   path: '/datasource',
      //   component: () => import('@/views/data/datasource'),
      //   name: 'DataSource',
      //   meta: { title: 'DataSource' }
      // }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }

      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },


  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'theme',
        meta: { title: '主题', icon: 'theme' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
