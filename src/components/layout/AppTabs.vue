<!-- AppTabs.vue -->
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
        :closable="item.path !== '/dashboard'"
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
  }
}

const handleTabClick = (tab) => {
  router.push(tab.props.name)
}

const removeTab = (targetPath) => {
  // 防止删除首页
  if (targetPath === '/dashboard') {
    return
  }
  
  // 如果要删除的是当前激活的标签
  if (activeTab.value === targetPath) {
    const currentIndex = tabsList.value.findIndex(tab => tab.path === targetPath)
    
    // 寻找下一个要激活的标签
    let nextTab = null
    
    // 先尝试激活右边的标签
    if (currentIndex < tabsList.value.length - 1) {
      nextTab = tabsList.value[currentIndex + 1]
    } 
    // 再尝试激活左边的标签
    else if (currentIndex > 0) {
      nextTab = tabsList.value[currentIndex - 1]
    }
    
    // 如果有下一个标签，跳转到它；否则跳转到首页
    if (nextTab && nextTab.path !== targetPath) {
      activeTab.value = nextTab.path
      router.push(nextTab.path)
    } else {
      activeTab.value = '/dashboard'
      router.push('/dashboard')
    }
  }
  
  // 删除标签
  store.delTab(targetPath)
  
  // 如果删除完其他标签后只剩首页，确保跳转到首页
  if (tabsList.value.length === 1 && tabsList.value[0].path === '/dashboard') {
    activeTab.value = '/dashboard'
    router.push('/dashboard')
  }
}
</script>

<style lang="scss" scoped>
.app-tabs {
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0;

      .el-tabs__nav {
        border: none;

        .el-tabs__item {
          position: relative;
          border: 1px solid #d0d7de;
          border-radius: 8px 8px 0 0;
          margin-right: 4px;
          padding: 0 16px;
          height: 32px;
          line-height: 30px;
          background: #ffffff;
          color: #57606a;
          transition: all 0.3s ease;
          font-weight: 500;

          &:hover {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            color: #1976d2;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          &.is-active {
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: #ffffff;
            border-color: #1976d2;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);

            &::before {
              content: '';
              position: absolute;
              bottom: -1px;
              left: 0;
              right: 0;
              height: 2px;
              background: #ffffff;
              border-radius: 2px;
            }
          }

          .el-tabs__item__close {
            color: inherit;
            opacity: 0.6;
            transition: all 0.3s ease;

            &:hover {
              opacity: 1;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
            }
          }

          &.is-active .el-tabs__item__close {
            color: #ffffff;

            &:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }

          // 首页标签特殊样式
          &[aria-controls*="dashboard"] {
            .el-tabs__item__close {
              display: none; // 隐藏首页的关闭按钮
            }
            
            // 首页标签添加特殊标识
            &::after {
              content: '🏠';
              margin-left: 4px;
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}
</style>