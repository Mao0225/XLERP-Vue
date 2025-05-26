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

// 改进的路由守卫 - 处理刷新页面时的路由重新加载
router.beforeEach(async (to, from, next) => {
  // console.log(`路由导航: 从 ${from.path} 到 ${to.path}`)
  const userStore = useUserStore()
  
  // 设置网页标题
  const pageTitle = to.meta?.title ? `${to.meta.title} - 企业ERP管理系统` : '企业ERP管理系统'
  document.title = pageTitle
  
  // 判断该路由是否需要登录权限
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  console.log(`路由 ${to.path} 需要认证: ${requiresAuth}`)
  
  // 检查token有效性
  const storageToken = localStorage.getItem('token')
  const isTokenValid = checkTokenValidity(storageToken || userStore.token)
  
  // 如果用户有有效token但动态路由未初始化，先初始化动态路由
  if (isTokenValid && !dynamicRoutesInitialized) {
    // console.log('刷新页面或首次访问，初始化动态路由...')
    try {
      // 如果store中没有token但localStorage中有，先恢复状态
      if (!userStore.token && storageToken) {
        // console.log('从localStorage恢复用户状态并重新获取菜单...')
        await userStore.restoreUserState()
      } else {
        // console.log('用户已登录，重新获取菜单并初始化路由...')
        // 确保获取最新的菜单数据
        await userStore.fetchMenuTree(userStore.userId)
        await userStore.initializeRoutes()
      }
      
      dynamicRoutesInitialized = true
      
      // 重定向到同一路由，以使新添加的路由匹配生效
      return next({ path: to.fullPath, replace: true })
    } catch (error) {
      // console.error('初始化动态路由失败:', error)
      // 清除可能错误的状态
      clearDynamicRoutes()
      userStore.logout()
      return next('/login')
    }
  }

  if (requiresAuth) {
    if (!isTokenValid) {
      // console.log('token无效或已过期，跳转到登录页')
      ElMessage.error('登录已过期，请重新登录')
      userStore.logout() // 确保清除无效的token
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // console.log('token有效，放行路由')
      return next()
    }
  } else {
    // 不需要登录权限的路由
    if (to.path === '/login' && isTokenValid) {
      // console.log('用户已登录但访问登录页，重定向到仪表盘')
      return next('/dashboard')
    } else {
      return next()
    }
  }
})

// 路由后置钩子 - 处理路由切换完成后的逻辑
router.afterEach((to, from) => {
  // console.log(`路由导航完成: ${from.path} -> ${to.path}`)
})

// 导出路由和动态路由状态重置函数
export const resetDynamicRoutesState = () => {
  dynamicRoutesInitialized = false
}

export default router