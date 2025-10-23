<template>
  <el-container class="layout-container">
    <el-header class="layout-header" height="60px">
      <app-header />
    </el-header>
    
    <el-container class="layout-content">
      <el-aside :width="asideWidth" class="layout-aside">
        <app-menu />
      </el-aside>
      
      <el-container class="layout-main">
        <div class="layout-tabs">
          <app-tabs />
        </div>
        <el-main>
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="cachedViews">
              <component 
                :is="Component" 
                :key="getRouteKey(route)"
                v-if="isRouterAlive"
              />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'
import AppHeader from './AppHeader.vue'
import AppMenu from './AppMenu.vue'
import AppTabs from './AppTabs.vue'

const route = useRoute()
const store = useAppStore()

// 路由存活状态，用于解决切换卡住问题
const isRouterAlive = ref(true)

// 侧边栏宽度
const asideWidth = computed(() => store.isCollapse ? '60px' : '230px')

// 缓存的视图组件名称列表
const cachedViews = computed(() => store.cachedViews || [])

// 获取路由key,支持刷新
const getRouteKey = (route) => {
  return store.refreshKeys?.[route.path] || route.path
}

// 监听路由变化，防止切换卡住
let routeChangeTimer = null
watch(
  () => route.path,
  () => {
    // 清除之前的定时器
    if (routeChangeTimer) {
      clearTimeout(routeChangeTimer)
    }
    
    // 确保路由组件正常渲染
    isRouterAlive.value = true
    
    // 设置超时保护，如果5秒内没有成功渲染，强制重置
    routeChangeTimer = setTimeout(() => {
      if (!isRouterAlive.value) {
        console.warn('路由渲染超时，强制重置')
        isRouterAlive.value = true
      }
    }, 5000)
  },
  { immediate: true }
)

// 提供刷新方法给子组件
const reload = async () => {
  isRouterAlive.value = false
  await nextTick()
  isRouterAlive.value = true
}

// 暴露刷新方法
defineExpose({
  reload
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
  
  .layout-header {
    padding: 0;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  
  .layout-content {
    height: calc(100vh - 60px);
    
    .layout-aside {
      background-color: #001529;
      transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      
      // 优化侧边栏内容过渡
      :deep(.el-menu) {
        border-right: none;
      }
      
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        transition: all 0.2s ease;
      }
    }
    
    .layout-main {
      display: flex;
      flex-direction: column;
      background: #f0f2f5;
      
      .layout-tabs {
        flex-shrink: 0;
        height: 40px;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .el-main {
        flex: 1;
        padding: 10px;
        background-color: #f0f2f5;
        height: calc(100% - 40px);
        overflow-x: hidden;
        overflow-y: auto;
        
        // 优化滚动条样式
        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
          transition: background 0.2s ease;
          
          &:hover {
            background: #a8a8a8;
          }
        }
        
        // Firefox滚动条
        scrollbar-width: thin;
        scrollbar-color: #c1c1c1 #f1f1f1;
        
        // 加载占位动画
        &:empty::before {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #409eff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }
  }
}

// 路由切换淡入动画
:deep(.router-view) {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

// 响应式布局
@media (max-width: 768px) {
  .layout-container {
    .layout-header {
      height: 56px;
    }
    
    .layout-content {
      height: calc(100vh - 56px);
      
      .layout-aside {
        position: fixed;
        left: 0;
        top: 56px;
        height: calc(100vh - 56px);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        z-index: 100;
        
        // 折叠时部分隐藏
        &:not(:hover) {
          transform: translateX(calc(-100% + 60px));
        }
      }
      
      .layout-main {
        .el-main {
          padding: 8px;
        }
      }
    }
  }
}

// 平板设备优化
@media (min-width: 769px) and (max-width: 1024px) {
  .layout-container {
    .layout-content {
      .el-main {
        padding: 12px;
      }
    }
  }
}

// 大屏幕优化
@media (min-width: 1920px) {
  .layout-container {
    .layout-content {
      .el-main {
        padding: 16px;
        max-width: 1800px;
        margin: 0 auto;
      }
    }
  }
}

// 打印样式优化
@media print {
  .layout-header,
  .layout-aside,
  .layout-tabs {
    display: none !important;
  }
  
  .layout-main {
    .el-main {
      padding: 0;
      overflow: visible;
      height: auto !important;
    }
  }
  
  // 隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }
}

// 暗黑模式支持（可选）
@media (prefers-color-scheme: dark) {
  .layout-container {
    .layout-header {
      background: #1f1f1f;
      border-bottom-color: #333;
    }
    
    .layout-content {
      .layout-main {
        background: #141414;
        
        .layout-tabs {
          background: #1f1f1f;
          border-bottom-color: #333;
        }
        
        .el-main {
          background-color: #141414;
          
          &::-webkit-scrollbar-track {
            background: #2a2a2a;
          }
          
          &::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            
            &:hover {
              background: #5a5a5a;
            }
          }
        }
      }
    }
  }
}

// 减少动画（尊重用户偏好）
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .layout-container {
    .layout-header {
      border-bottom: 2px solid #000;
    }
    
    .layout-content {
      .layout-aside {
        border-right: 2px solid #000;
      }
      
      .layout-main {
        .layout-tabs {
          border-bottom: 2px solid #000;
        }
      }
    }
  }
}
</style>