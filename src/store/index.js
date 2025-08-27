import { defineStore } from 'pinia'
import { useUserStore } from './user' // 引入 useUserStore

// 定义并导出store
export const useAppStore = defineStore('app', {
  // 状态
  state: () => ({
    // 已打开的标签页
    tabsList: [],
    refreshKeys: {}, // 存储每个路由的刷新key
    // 菜单是否折叠
    isCollapse: false
  }),

  // getters相当于vuex的计算属性
  getters: {
    // 获取用户信息（从 useUserStore 获取）
    userInfo: () => {
      const userStore = useUserStore()
      return {
        username: userStore.username,
        avatar: userStore.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' // 默认头像
      }
    }
  },

  // actions相当于vuex的mutations和actions的结合
  actions: {
    // 添加标签页
    addTab(tab) {
      // tab 应包含 path 和 title，与 menuTree 的结构一致
      const isExist = this.tabsList.some(item => item.path === tab.path)
      if (!isExist) {
        this.tabsList.push({
          path: tab.path,
          title: tab.title || tab.meta?.title || '未命名页面' // 优先使用 menuTree 的 title
        })
        // 初始化或更新刷新key
        this.refreshKeys[tab.path] = Date.now()
      }
    },

    // 删除标签页
    delTab(tabPath) {
      this.tabsList = this.tabsList.filter(item => item.path !== tabPath)
      // 删除对应的刷新key，确保缓存清理
      delete this.refreshKeys[tabPath]
    },

    // 切换菜单折叠状态
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
})