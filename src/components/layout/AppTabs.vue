<template>
  <div class="app-tabs">
    <el-tabs
      v-model="activeTab"
      type="card"
      closable
      @tab-click="handleTabClick"
      @tab-remove="removeTab"
      class="custom-tabs"
    >
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/dashboard' && item.title !== '首页'"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const tabsList = computed(() => store.tabsList)
const activeTab = ref(route.path)

onMounted(() => {
  // 确保首页标签始终存在
  store.addTab({
    title: '首页',
    path: '/dashboard'
  })
  
  // 如果当前路由不是首页，添加当前路由标签
  if (route.path !== '/dashboard') {
    addTab(route)
  }
})

watch(
  () => route.path,
  () => {
    addTab(route)
    activeTab.value = route.path
  }
)

const addTab = (route) => {
  if (route.meta && route.meta.title) {
    store.addTab({
      title: route.meta.title,
      path: route.path
    })
    store.refreshKeys[route.path] = Date.now()
  }
}

const handleTabClick = (tab) => {
  router.push(tab.props.name)
  store.refreshKeys[tab.props.name] = Date.now()
}

const removeTab = (targetPath) => {
  if (targetPath === '/dashboard') {
    return
  }
  
  if (activeTab.value === targetPath) {
    const currentIndex = tabsList.value.findIndex(tab => tab.path === targetPath)
    let nextTab = null
    
    if (currentIndex < tabsList.value.length - 1) {
      nextTab = tabsList.value[currentIndex + 1]
    } else if (currentIndex > 0) {
      nextTab = tabsList.value[currentIndex - 1]
    }
    
    if (nextTab && nextTab.path !== targetPath) {
      activeTab.value = nextTab.path
      router.push(nextTab.path)
    } else {
      activeTab.value = '/dashboard'
      router.push('/dashboard')
    }
  }
  
  store.delTab(targetPath)
  
  if (tabsList.value.length === 1 && tabsList.value[0].path === '/dashboard') {
    activeTab.value = '/dashboard'
    router.push('/dashboard')
  }
}
</script>

<style lang="scss" scoped>
.app-tabs {
  padding: 4px 8px 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0;
      border-bottom: none;

      .el-tabs__nav {
        border: none;
        display: flex;
        gap: 2px;

        .el-tabs__item {
          position: relative;
          border: none;
          border-radius: 6px 6px 0 0;
          margin: 0;
          padding: 0 12px;
          height: 32px;
          line-height: 32px;
          background: transparent;
          color: #6b7280;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 400;
          min-width: auto;

          // 悬停效果
          &:hover {
            background: #f3f4f6;
            color: #111827;
          }

          // 激活状态
          &.is-active {
            background: #ffffff;
            color: #2563eb;
            font-weight: 500;
            
            // 底部指示线
            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 8px;
              right: 8px;
              height: 2px;
              background: #2563eb;
              border-radius: 2px 2px 0 0;
            }
          }

          // 关闭按钮样式
          .el-icon.is-icon-close {
            width: 14px;
            height: 14px;
            font-size: 12px;
            color: inherit;
            opacity: 0;
            transition: all 0.2s ease;
            margin-left: 4px;
            border-radius: 3px;

            &:hover {
              background-color: rgba(239, 68, 68, 0.1);
              color: #ef4444;
            }
          }

          // 悬停时显示关闭按钮
          &:hover .el-icon.is-icon-close {
            opacity: 0.6;
          }

          &:hover .el-icon.is-icon-close:hover {
            opacity: 1;
          }

          // 激活标签的关闭按钮
          &.is-active .el-icon.is-icon-close {
            opacity: 0.5;
            color: #2563eb;

            &:hover {
              opacity: 1;
              background-color: rgba(37, 99, 235, 0.1);
              color: #1d4ed8;
            }
          }

          // 首页标签样式
          &[aria-controls*="dashboard"] {
            .el-icon.is-icon-close {
              display: none !important;
            }
            
            padding-left: 10px;
            padding-right: 10px;
          }
        }

        // 标签之间的分隔线
        .el-tabs__item:not(:last-child):not(.is-active) {
          &::before {
            content: '';
            position: absolute;
            right: -1px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 14px;
            background: #e5e7eb;
            opacity: 0.5;
          }
        }

        .el-tabs__item.is-active + .el-tabs__item::before,
        .el-tabs__item:has(+ .el-tabs__item.is-active)::before {
          opacity: 0;
        }
      }

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }
      }
    }

    .el-tabs__content {
      display: none;
    }
  }
}

// 标签数量较多时的滚动优化
:deep(.el-tabs__nav-wrap) {
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 0;
  }
}

// 紧凑模式 - 当标签过多时
@media (max-width: 1200px) {
  .app-tabs {
    :deep(.el-tabs__item) {
      padding: 0 10px !important;
      font-size: 12px !important;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>