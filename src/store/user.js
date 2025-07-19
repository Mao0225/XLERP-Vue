import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/system/login'
import { getUserMenus } from '@/api/system/menu'
import router from '@/router' // 导入路由实例

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('userId') || '')
  const username = ref(localStorage.getItem('username') || '')
  const realName = ref(localStorage.getItem('descr') || '') 
  const avatar = ref(localStorage.getItem('avatar') || '')
  const roles = ref([])
  const permissions = ref([])
  const menuTree = ref([])
  const descr = ref(localStorage.getItem('descr') || '') // 新增 desc 状态

  // 在state部分修改isLoggedIn的初始化
  const isLoggedIn = computed(() => !!token.value) // 改为根据token判断登录状态
  
  // Methods
  // 在login方法中保存登录状态和菜单数据
  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      
      if (response.success) {
        const userData = response.data.user
        const authToken = response.data.token
        console.log('登录返回信息', response)
        
        // Update state
        token.value = authToken
        userId.value = userData.id.toString()
        username.value = userData.username
        avatar.value = userData.avatar
        realName.value = userData.descr // 修正为 realName
        descr.value = userData.descr || '' // 保存 desc 字段
        // 保存token和用户信息到localStorage
        localStorage.setItem('token', authToken)
        localStorage.setItem('userId', userData.id.toString())
        localStorage.setItem('username', userData.username)
        localStorage.setItem('avatar', userData.avatar)
        localStorage.setItem('realName', userData.descr)
        localStorage.setItem('descr', descr.value) // 保存 desc 到 localStorage
        
        // Fetch menu tree data after successful login
        await fetchMenuTree(userId.value)
        console.log('获取菜单树完成')
        
        // 初始化动态路由
        await initializeRoutes()
        console.log('动态路由初始化完成')
        
        return userData
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }
  
  const setUserInfo = (userInfo) => {
    // 更新状态
    if (userInfo.username) {
      username.value = userInfo.username
      localStorage.setItem('username', userInfo.username)
    }
    if (userInfo.avatar) {
      avatar.value = userInfo.avatar
      localStorage.setItem('avatar', userInfo.avatar)
    }
    if (userInfo.descr) {
      realName.value = userInfo.descr
      localStorage.setItem('realName', userInfo.descr)
    }
   
  }
  const fetchMenuTree = async (userIdParam) => {
    try {
      const id = userIdParam || userId.value
      if (!id) {
        console.warn('获取菜单数据失败: 没有用户ID')
        return null
      }
      
      const { data } = await getUserMenus(id)
      console.log('获取到最新菜单数据:', data)
      menuTree.value = data.menuTree || []
      return data
    } catch (error) {
      console.error('获取菜单失败:', error)
      menuTree.value = []
      throw error
    }
  }

  // 初始化动态路由
  const initializeRoutes = async () => {
    try {
      // 确保菜单数据存在
      if (!menuTree.value || menuTree.value.length === 0) {
        console.warn('初始化路由失败: 菜单数据为空')
        return false
      }
      
      // 从路由模块导入路由初始化函数
      const { initDynamicRoutes } = await import('@/router/dynamicRoutes')
      
      // 使用菜单树初始化路由
      await initDynamicRoutes(menuTree.value)
      console.log('动态路由已添加到路由表')
      return true
    } catch (error) {
      console.error('初始化动态路由失败:', error)
      throw error
    }
  }

  // 修改logout方法
  const logout = () => {
    // Clear state
    token.value = ''
    userId.value = ''
    username.value = ''
    realName.value = ''
    avatar.value = ''
    roles.value = []
    permissions.value = []
    menuTree.value = []
    descr.value = '' // 清空 desc 状态
    
    // 清除localStorage数据
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('avatar')
    localStorage.removeItem('realName')
    localStorage.removeItem('descr') // 移除 desc 从 localStorage
    
    // 跳转到登录页
    router.push('/login')
  }

  // 恢复状态 - 修改为每次都从服务器获取最新菜单数据
  const restoreUserState = async () => {
    const storageToken = localStorage.getItem('token')
    const storageUserId = localStorage.getItem('userId')
    const storageUsername = localStorage.getItem('username')
    const storageAvatar = localStorage.getItem('avatar')
    const storageDescr = localStorage.getItem('descr') // 获取 desc 从 localStorage
    
    if (storageToken && storageUserId) {
      // 恢复用户状态
      token.value = storageToken
      userId.value = storageUserId
      username.value = storageUsername
      avatar.value = storageAvatar
      descr.value = storageDescr // 恢复 desc 状态
      
      // 从服务器重新获取最新的菜单数据
      console.log('重新从服务器获取菜单数据...')
      await fetchMenuTree(userId.value)
      
      // 重新初始化路由
      await initializeRoutes()
      console.log('用户状态已恢复，已加载最新的动态路由')
      return true
    }
    return false
  }
  
  // Fetch user info from the server
  const getUserInfo = async () => {
    return {
      userId: userId.value,
      username: username.value,
      realName: realName.value,
      avatar: avatar.value,
      permissions: permissions.value,
      menuTree: menuTree.value,
      descr: descr.value // 返回 desc 字段
    }
  }

  const hasPermission = (permission) => {
    if (permissions.value.includes('*')) {
      return true
    }
    return permissions.value.includes(permission)
  }

  return {
    // State
    token,
    userId,
    username,
    realName,
    avatar,
    roles,
    permissions,
    menuTree,
    descr, // 导出 desc 状态
    
    // Computed properties
    isLoggedIn,
    
    // Methods
    login,
    logout,
    getUserInfo,
    hasPermission,
    fetchMenuTree,
    initializeRoutes,
    restoreUserState,
    setUserInfo
  }
})