<template>
  <el-container class="layout-container">
    <el-header class="layout-header" height="60px">
      <app-header />
    </el-header>
    
    <el-container class="layout-content">
      <el-aside :width="isCollapse ? '64px' : '250px'" class="layout-aside">
        <app-menu />
      </el-aside>
      
      <el-container class="layout-main">
        <div class="layout-tabs">
          <app-tabs />
        </div>
        <el-main>
          <!-- 路由页面 -->
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="store.refreshKeys[$route.path] || $route.path" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store' // 引入pinia store
import AppHeader from './AppHeader.vue'
import AppMenu from './AppMenu.vue'
import AppTabs from './AppTabs.vue'

const store = useAppStore() // 使用pinia store
const isCollapse = computed(() => store.isCollapse)
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  
  .layout-header {
    padding: 0;
  }
  
  .layout-content {
    height: calc(100vh - 60px);
    
    .layout-aside {
      background-color: #001529;
      transition: width 0.3s;
      overflow: hidden;
    }
    
    .layout-main {
      display: flex;
      flex-direction: column;
      
      .layout-tabs {
        height: 40px;
      }
      
      .el-main {
        padding: 10px;
        background-color: #f0f2f5;
        height: calc(100% - 40px);
        overflow-y: auto;
      }
    }
  }
}
</style>
