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
  addTab(route)
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
  if (activeTab.value === targetPath) {
    tabsList.value.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = tabsList.value[index + 1] || tabsList.value[index - 1]
        if (nextTab) {
          activeTab.value = nextTab.path
          router.push(nextTab.path)
        }
      }
    })
  }
  
  store.delTab(targetPath)
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
        }
      }
    }
  }
}
</style>