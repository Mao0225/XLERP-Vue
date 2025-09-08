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
  history: createWebHistory(),
  routes
})

// 添加一个记录动态路由是否已初始化的标志
let dynamicRoutesInitialized = false

// 检查token是否有效
function checkTokenValidity(token) {
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp && Date.now() < payload.exp * 1000
  } catch (e) {
    console.error('解析token失败:', e)
    return false
  }
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
  
  // 检查token有效性
  const storageToken = localStorage.getItem('token')
  const isTokenValid = checkTokenValidity(storageToken || userStore.token)
  
  // 如果用户有有效token但动态路由未初始化，先初始化动态路由
  if (isTokenValid && !dynamicRoutesInitialized) {
    try {
      // 如果store中没有token但localStorage中有，先恢复状态
      if (!userStore.token && storageToken) {
        await userStore.restoreUserState()
      } else {
        // 确保获取最新的菜单数据
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
      console.error('初始化动态路由失败:', error)
      clearDynamicRoutes()
      userStore.logout()
      ElMessage.error('初始化路由失败，请重新登录')
      return next('/login')
    }
  }

  if (requiresAuth) {
    if (!isTokenValid) {
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
    // 不需要登录权限的路由
    if (to.path === '/login' && isTokenValid) {
      return next('/dashboard')
    } else {
      return next()
    }
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