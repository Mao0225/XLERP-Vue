<template>
  <div class="app-tabs">
    <el-tabs
      v-model="activeTab"
      type="card"
      closable
      @tab-click="handleTabClick"
      @tab-remove="removeTab"
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
import { useAppStore } from '@/store' // 引入pinia store

const route = useRoute()
const router = useRouter()
const store = useAppStore() // 使用pinia store

const tabsList = computed(() => store.tabsList)
const activeTab = ref(route.path)

// 初始页面添加标签
onMounted(() => {
  addTab(route)
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    addTab(route)
    activeTab.value = route.path
  }
)

// 添加标签
const addTab = (route) => {
  if (route.meta && route.meta.title) {
    store.addTab({ // 直接调用action
      title: route.meta.title,
      path: route.path
    })
  }
}

// 点击标签
const handleTabClick = (tab) => {
  router.push(tab.props.name)
}

// 移除标签
const removeTab = (targetPath) => {
  // 如果关闭的是当前激活的标签页
  if (activeTab.value === targetPath) {
    // 寻找下一个激活的标签
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
  
  // 从pinia中移除标签
  store.delTab(targetPath) // 直接调用action
}
</script>

<style lang="scss" scoped>
.app-tabs {
  padding: 6px 4px;
  background-color: #f0f2f5;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>