<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :collapse-transition="false"
    class="app-menu"
    background-color="#256999"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <template v-for="menu in menuList" :key="menu.id">
      <!-- 没有子菜单的情况 -->
      <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
        <el-icon v-if="menu.icon">
          <component :is="menu.icon"></component>
        </el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
      
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-else :index="menu.path">
        <template #title>
          <el-icon v-if="menu.icon">
            <component :is="menu.icon"></component>
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        
        <!-- 渲染子菜单 -->
        <template v-for="child in menu.children" :key="child.id">
          <el-menu-item :index="child.path">
            {{ child.title }}
          </el-menu-item>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store' // 引入pinia store
import { useUserStore } from '@/store/user' // 引入user store

const route = useRoute()
const appStore = useAppStore() // 使用pinia store
const userStore = useUserStore() // 使用user store

// 从 userStore 的 menuTree 获取菜单数据
const menuList = computed(() => userStore.menuTree)

const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.app-menu {
  height: 100%;
  border-right: none;
  
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>