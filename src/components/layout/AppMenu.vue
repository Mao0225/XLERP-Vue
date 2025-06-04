<template>
  <div class="sidebar-container">
    <!-- 折叠按钮 -->
    <div class="menu-toggle" @click="toggleCollapse">
      <el-icon class="toggle-icon">
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :collapse-transition="false"
      class="app-menu vertical-menu"
      background-color="#f8fafc"
      text-color="#64748b"
      active-text-color="#0ea5e9"
      router
    >
      <template v-for="menu in menuList" :key="menu.id">
        <!-- 没有子菜单的情况 -->
        <el-menu-item 
          v-if="!menu.children || menu.children.length === 0" 
          :index="menu.path"
          class="vertical-menu-item"
        >
          <div class="menu-item-content">
            <el-icon v-if="menu.icon" class="menu-icon">
              <component :is="menu.icon"></component>
            </el-icon>
            <span class="menu-title" v-if="!isCollapse">{{ menu.title }}</span>
          </div>
          <!-- 占位符，保持对齐 -->
          <div class="menu-arrow-placeholder"></div>
        </el-menu-item>
             
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="menu.path" class="vertical-sub-menu">
          <template #title>
            <div class="menu-item-content">
              <el-icon v-if="menu.icon" class="menu-icon">
                <component :is="menu.icon"></component>
              </el-icon>
              <span class="menu-title" v-if="!isCollapse">{{ menu.title }}</span>
            </div>
          </template>
                 
          <!-- 渲染子菜单 -->
          <template v-for="child in menu.children" :key="child.id">
            <el-menu-item :index="child.path" class="sub-menu-item">
              <div class="sub-menu-content">
                <span class="sub-menu-title">{{ child.title }}</span>
              </div>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store' // 引入pinia store
import { useUserStore } from '@/store/user' // 引入user store

const toggleCollapse = () => {
  appStore.toggleCollapse()
}

const route = useRoute()
const appStore = useAppStore() // 使用pinia store
const userStore = useUserStore() // 使用user store

// 从 userStore 的 menuTree 获取菜单数据
const menuList = computed(() => userStore.menuTree)

const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.menu-toggle {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  .toggle-icon {
    font-size: 18px;
    color: #64748b;
    transition: all 0.3s ease;
    
    &:hover {
      color: #0ea5e9;
      transform: scale(1.1);
    }
  }
}

.app-menu {
  flex: 1;
  height: calc(100% - 50px);
  border-right: none;
  overflow-y: auto;
  
  &:not(.el-menu--collapse) {
    width: 120px;
  }
  
  &.el-menu--collapse {
    width: 80px;
  }
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
    
    &:hover {
      background: #94a3b8;
    }
  }
  
  // 垂直菜单项样式
  :deep(.el-menu-item) {
    height: auto;
    min-height: 80px;
    line-height: 1.2;
    border-radius: 0;
    margin: 4px 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    
    &:hover {
      background-color: #e0f2fe !important;
      color: #0ea5e9 !important;
      
      .menu-icon {
        color: #0ea5e9 !important;
        transform: scale(1.1);
      }
    }
    
    &.is-active {
      background-color: #0ea5e9 !important;
      color: #fff !important;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
      
      .menu-icon {
        color: #fff !important;
      }
      
      .menu-title {
        color: #fff !important;
      }
    }
  }
  
  // 子菜单样式
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      height: auto;
      min-height: 80px;
      line-height: 1.2;
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
      padding: 12px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      
      &:hover {
        background-color: #e0f2fe !important;
        color: #0ea5e9 !important;
        
        .menu-icon {
          color: #0ea5e9 !important;
          transform: scale(1.1);
        }
      }
      
      // 自定义下拉箭头位置
      .el-sub-menu__icon-arrow {
        position: absolute;
        right: 8px;
        top: 12px;
        margin: 0;
        font-size: 12px;
        transition: all 0.3s ease;
      }
    }
    
    .el-menu {
      background-color: #f1f5f9;
      margin: 0 8px 8px 8px;
      border-radius: 8px;
      
      .el-menu-item {
        min-height: 40px;
        padding: 8px 16px;
        margin: 2px 4px;
        font-size: 12px;
        
        &:hover {
          background-color: #e0f2fe !important;
          color: #0ea5e9 !important;
        }
        
        &.is-active {
          background-color: #0ea5e9 !important;
          color: #fff !important;
          position: relative;
        }
      }
    }
  }
}

// 菜单项内容布局
.menu-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  
  .menu-icon {
    font-size: 24px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }
  
  .menu-title {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    word-break: break-all;
    max-width: 100%;
    transition: all 0.3s ease;
  }
}

// 箭头占位符
.menu-arrow-placeholder {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 8px;
  top: 12px;
}

.sub-menu-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  
  .sub-menu-title {
    font-size: 12px;
    font-weight: 400;
  }
}

// 折叠状态下隐藏文字
.app-menu.el-menu--collapse {
  .menu-title {
    display: none;
  }
  
  .menu-item-content {
    .menu-icon {
      margin-bottom: 0;
      font-size: 20px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100vh;
    
    &:not(:has(.app-menu.el-menu--collapse)) {
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>