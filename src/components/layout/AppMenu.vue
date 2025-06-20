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
      class="app-menu"
      background-color="#f8fafc"
      text-color="#475569"
      active-text-color="#1e40af"
      router
    >
      <template v-for="menu in menuList" :key="menu.id">
        <!-- 没有子菜单的情况 -->
        <el-menu-item 
          v-if="!menu.children || menu.children.length === 0" 
          :index="menu.path"
          class="menu-item"
        >
          <el-icon v-if="menu.icon" class="menu-icon">
            <component :is="menu.icon"></component>
          </el-icon>
          <span class="menu-title">{{ menu.title }}</span>
        </el-menu-item>
             
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="menu.path" class="sub-menu">
          <template #title>
            <el-icon v-if="menu.icon" class="menu-icon">
              <component :is="menu.icon"></component>
            </el-icon>
            <span class="menu-title">{{ menu.title }}</span>
          </template>
                 
          <!-- 渲染子菜单 -->
          <template v-for="child in menu.children" :key="child.id">
            <el-menu-item :index="child.path" class="sub-menu-item">
              <span class="sub-menu-title">{{ child.title }}</span>
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
import { useAppStore } from '@/store'
import { useUserStore } from '@/store/user'

const toggleCollapse = () => {
  appStore.toggleCollapse()
}

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const menuList = computed(() => userStore.menuTree)
const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  border-right: 1px solid #cbd5e1;
}

.menu-toggle {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  cursor: pointer;
  // border-bottom: 1px solid #2563eb;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #6c748b 100%);
    transform: translateY(-1px);
    // box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  .toggle-icon {
    font-size: 16px;
    color: #000000;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

.app-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  
  &:not(.el-menu--collapse) {
    width: 200px;
  }
  
  &.el-menu--collapse {
    width: 64px;
  }
  
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #64748b 0%, #475569 100%);
    border-radius: 3px;
    
    &:hover {
      background: linear-gradient(180deg, #475569 0%, #334155 100%);
    }
  }
  
  // 主菜单项样式
  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    margin: 2px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
      color: #1e40af !important;
      transform: translateX(2px);
      box-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
      
      .menu-icon {
        color: #1e40af !important;
      }
    }
    
    &.is-active {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      color: #ffffff !important;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      
      .menu-icon {
        color: #ffffff !important;
      }
    }
  }
  
  // 子菜单样式
  :deep(.el-sub-menu) {
    margin: 2px 8px;
    border-radius: 6px;
    
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      padding: 0 20px;
      border-radius: 6px;
      transition: all 0.2s ease;
      
      &:hover {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        color: #1e40af !important;
        transform: translateX(2px);
        
        .menu-icon {
          color: #1e40af !important;
        }
      }
    }
    
    .el-menu {
      background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
      margin: 4px 0;
      border-radius: 6px;
      padding: 4px 0;
      
      .el-menu-item {
        height: 42px;
        line-height: 42px;
        padding-left: 52px;
        font-size: 14px;
        margin: 1px 4px;
        border-radius: 4px;
        
        &:hover {
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%) !important;
          color: #1e40af !important;
          transform: translateX(4px);
        }
        
        &.is-active {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
        }
      }
    }
  }
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  transition: all 0.2s ease;
  color: #64748b;
}

.menu-title {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
}

.sub-menu-title {
  font-size: 14px;
  font-weight: 400;
  color: inherit;
}

// 折叠状态样式
.app-menu.el-menu--collapse {
  :deep(.el-menu-item) {
    padding: 0;
    justify-content: center;
    
    .menu-icon {
      margin-right: 0;
      font-size: 20px;
    }
  }
  
  :deep(.el-sub-menu__title) {
    padding: 0;
    justify-content: center;
    
    .menu-icon {
      margin-right: 0;
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
    box-shadow: 4px 0 20px rgba(30, 64, 175, 0.15);
  }
}
</style>