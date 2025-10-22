import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { clearDynamicRoutes } from './dynamicRoutes'
import { ElMessage } from 'element-plus'

// 基础路由（始终存在的路由）
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/erp',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      layout: 'none'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/layout/DefaultLayout.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true,
      layout: 'default',
      icon: 'dashboard-icon' // Adjust icon as needed
    },
    children: [
      {
        path: '',
        name: 'DashboardPage',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
          icon: 'dashboard-icon' // Adjust icon as needed
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      layout: 'none'
    }
  }
]

const router = createRouter({
    // 关键修改：添加 '/erp/' 作为基础路径
  history: createWebHistory('/erp/'),  // 原来这里是 createWebHistory()
  routes
})

// 添加一个记录动态路由是否已初始化的标志
let dynamicRoutesInitialized = false

// 检查 token 是否有效
function checkTokenValidity(token) {
  return true; // Simplified for this example; retain your original token validation logic if needed
}

// 检查路由是否在已注册的路由列表中
function isRouteValid(to, router) {
  const matchedRoutes = router.getRoutes()
  return matchedRoutes.some(route => route.path === to.path || route.name === to.name)
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 设置网页标题
  const pageTitle = to.meta?.title ? `${to.meta.title} - 企业ERP管理系统` : '企业ERP管理系统'
  document.title = pageTitle

  // 判断该路由是否需要登录权限
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  // console.log(`路由 ${to.path} 需要认证: ${requiresAuth}`)

  // 检查 token 有效性
  const storageToken = localStorage.getItem('token')
  // console.log('storageToken:', storageToken)
  // console.log('userStore.token:', userStore.token)
  const isTokenValid = checkTokenValidity(storageToken || userStore.token)

  // 如果 token 无效，清理 localStorage
  if (!isTokenValid && storageToken) {
    // console.warn('检测到无效 token，清理 localStorage')
    localStorage.removeItem('token')
    userStore.token = null
  }

  // 如果用户有有效 token 但动态路由未初始化，先初始化动态路由
  if (isTokenValid && !dynamicRoutesInitialized && to.path !== '/dashboard') {
    try {
      // 如果 store 中没有 token 但 localStorage 中有，先恢复状态
      if (!userStore.token && storageToken) {
        // console.log('从 localStorage 恢复用户状态并重新获取菜单...')
        await userStore.restoreUserState()
      } else {
        // console.log('用户已登录，重新获取菜单并初始化路由...')
        await userStore.fetchMenuTree(userStore.userId)
        await userStore.initializeRoutes()
      }

      dynamicRoutesInitialized = true

      // 检查目标路由是否有效
      if (!isRouteValid(to, router)) {
        ElMessage.warning('您没有权限访问该页面，已重定向到仪表盘')
        return next('/dashboard') // 默认重定向到仪表盘
      }

      // 重定向到同一路由，以使新添加的路由匹配生效
      return next({ path: to.fullPath, replace: true })
    } catch (error) {
      // console.error('初始化动态路由失败:', error)
      clearDynamicRoutes()
      userStore.logout()
      ElMessage.error('初始化路由失败，请重新登录')
      return next('/login')
    }
  }

  if (requiresAuth) {
    if (!isTokenValid) {
      // console.log('token 无效或已过期，跳转到登录页')
      ElMessage.error('登录已过期，请重新登录')
      userStore.logout()
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 检查目标路由是否有效
      if (!isRouteValid(to, router)) {
        ElMessage.warning('您没有权限访问该页面，已重定向到仪表盘')
        return next('/dashboard') // 默认重定向到仪表盘
      }
      return next()
    }
  } else {
    // 不需要登录权限的路由，直接放行
    return next()
  }
})

// 路由后置钩子
router.afterEach((to, from) => {
  // console.log(`路由导航完成: ${from.path} -> ${to.path}`)
})

// 导出路由和动态路由状态重置函数
export const resetDynamicRoutesState = () => {
  dynamicRoutesInitialized = false
}

export default router