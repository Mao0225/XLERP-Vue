<template>
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <app-header />
    </el-header>
    
    <el-container class="layout-content">
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth" class="layout-aside">
        <app-menu />
      </el-aside>
      
      <!-- 主内容区域 -->
      <el-container class="layout-main">
        <!-- 标签栏 -->
        <div class="layout-tabs">
          <app-tabs />
        </div>
        
        <!-- 主体内容 -->
        <el-main class="layout-main-content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-slide" mode="out-in">
              <keep-alive :include="cachedViews">
                <component 
                  :is="Component" 
                  :key="getRouteKey(route)" 
                />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'
import AppHeader from './AppHeader.vue'
import AppMenu from './AppMenu.vue'
import AppTabs from './AppTabs.vue'

const route = useRoute()
const store = useAppStore()

// 侧边栏宽度
const asideWidth = computed(() => store.isCollapse ? '64px' : '230px')

// 缓存的视图组件名称列表
const cachedViews = computed(() => store.cachedViews || [])

// 获取路由key,支持刷新
const getRouteKey = (route) => {
  return store.refreshKeys?.[route.path] || route.path
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// 顶部导航栏
.layout-header {
  height: 60px;
  padding: 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 9999!important;
  position: relative;
}

// 内容区域容器
.layout-content {
  height: calc(100vh - 60px);
  position: relative;
}

// 侧边栏
.layout-aside {
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 999;
  
  // 防止内容溢出
  :deep(*) {
    transition: opacity 0.2s ease;
  }
}

// 主内容区域
.layout-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

// 标签栏
.layout-tabs {
  flex-shrink: 0;
  height: 40px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 998;
}

// 主体内容
.layout-main-content {
  flex: 1;
  padding: 10px;
  background: #f5f5f5;
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
}

// 页面切换动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 响应式布局
@media (max-width: 768px) {
  .layout-header {
    height: 56px;
  }
  
  .layout-content {
    height: calc(100vh - 56px);
  }
  
  .layout-aside {
    position: fixed;
    left: 0;
    top: 56px;
    height: calc(100vh - 56px);
    z-index: 1001;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    
    // 折叠时隐藏
    &:not(:hover) {
      transform: translateX(calc(-100% + 64px));
    }
  }
  
  .layout-main-content {
    padding: 8px;
  }
}

// 打印样式优化
@media print {
  .layout-header,
  .layout-aside,
  .layout-tabs {
    display: none !important;
  }
  
  .layout-main-content {
    padding: 0;
    overflow: visible;
  }
}

// 性能优化 - 减少重绘
.layout-container,
.layout-content,
.layout-main {
  will-change: auto;
}

// 加载占位
.layout-main-content:empty::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>