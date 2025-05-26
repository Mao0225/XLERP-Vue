import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/store/user' // 添加这行

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用Pinia进行状态管理
const pinia = createPinia()
app.use(pinia)

// 在使用路由前恢复用户状态
const userStore = useUserStore()
const restored = await userStore.restoreUserState()
console.log('用户状态恢复结果:', restored)

// 使用路由
app.use(router)

// 使用Element Plus，并设置中文
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue全局错误:', err, info)
}

// 挂载应用
app.mount('#app')