<template>
  <div class="sidebar-container">
    <!-- 搜索框和折叠按钮 -->
    <div class="header-container">
      <div v-if="!isCollapse" class="search-wrapper">
        <el-input
          v-model="searchKeyword"
          placeholder="输入名称搜索"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="menu-search"
        />
      </div>
      <div class="menu-toggle" @click="toggleCollapse">
        <el-icon class="toggle-icon">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      ref="menuRef"
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      :collapse="isCollapse"
      :collapse-transition="false"
      class="app-menu"
      background-color="#f8fafc"
      text-color="#475569"
      active-text-color="#1e40af"
      router
    >
      <template v-for="menu in filteredMenuList" :key="menu.id">
        <!-- 没有子菜单的情况 -->
        <el-menu-item 
          v-if="!menu.children || menu.children.length === 0" 
          :index="menu.path"
          class="menu-item"
        >
          <el-icon v-if="menu.icon" class="menu-icon">
            <component :is="menu.icon"></component>
          </el-icon>
          <span class="menu-title" v-html="highlightText(menu.title)"></span>
        </el-menu-item>
             
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="menu.path" class="sub-menu">
          <template #title>
            <el-icon v-if="menu.icon" class="menu-icon">
              <component :is="menu.icon"></component>
            </el-icon>
            <span class="menu-title" v-html="highlightText(menu.title)"></span>
          </template>
                 
          <!-- 渲染子菜单 -->
          <template v-for="child in menu.children" :key="child.id">
            <el-menu-item :index="child.path" class="sub-menu-item">
              <span class="sub-menu-title" v-html="highlightText(child.title)"></span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      
      <!-- 无搜索结果提示 -->
      <div v-if="searchKeyword && filteredMenuList.length === 0" class="no-result">
        <el-icon class="no-result-icon"><Search /></el-icon>
        <p>未找到相关菜单</p>
      </div>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store'
import { useUserStore } from '@/store/user'
import { Search } from '@element-plus/icons-vue'
import { ElMenu } from 'element-plus'

const toggleCollapse = () => {
  appStore.toggleCollapse()
}

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const menuList = computed(() => userStore.menuTree)
const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)

// 搜索相关
const searchKeyword = ref('')
const menuRef = ref(null)

// 需要默认展开的菜单路径
const defaultOpeneds = ref([])

// 过滤菜单
const filteredMenuList = computed(() => {
  if (!searchKeyword.value.trim()) {
    // 无搜索时，清空默认展开
    defaultOpeneds.value = []
    return menuList.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  const openedPaths = []
  
  const filtered = menuList.value.map(menu => {
    // 检查父菜单是否匹配
    const parentMatch = menu.title.toLowerCase().includes(keyword)
    
    // 如果有子菜单，过滤子菜单
    if (menu.children && menu.children.length > 0) {
      const filteredChildren = menu.children.filter(child => 
        child.title.toLowerCase().includes(keyword)
      )
      
      // 如果父菜单匹配或有子菜单匹配，则返回该菜单
      if (parentMatch || filteredChildren.length > 0) {
        // 如果有子菜单匹配，需要展开该父菜单
        if (filteredChildren.length > 0) {
          openedPaths.push(menu.path)
        }
        return {
          ...menu,
          children: parentMatch ? menu.children : filteredChildren
        }
      }
      return null
    }
    
    // 无子菜单的情况，只检查父菜单
    return parentMatch ? menu : null
  }).filter(Boolean)
  
  // 更新默认展开的菜单
  defaultOpeneds.value = openedPaths
  
  return filtered
})

// 高亮搜索关键词
const highlightText = (text) => {
  if (!searchKeyword.value.trim()) {
    return text
  }
  
  const keyword = searchKeyword.value.trim()
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 搜索处理
const handleSearch = () => {
  // 可以在这里添加搜索防抖等逻辑
}

// 监听搜索结果变化，自动展开父菜单
watch(() => filteredMenuList.value, (newVal) => {
  if (searchKeyword.value.trim() && menuRef.value) {
    nextTick(() => {
      // 遍历所有需要展开的菜单路径
      defaultOpeneds.value.forEach(path => {
        menuRef.value.open(path)
      })
    })
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  width: 230px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

// 顶部容器
.header-container {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  gap: 8px;
}

// 搜索框容器
.search-wrapper {
  flex: 1;
  
  .menu-search {
    :deep(.el-input__wrapper) {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: none;
      transition: all 0.2s ease;
      padding: 0 12px;
      
      &:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
      }
      
      &.is-focus {
        background: #ffffff;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    :deep(.el-input__inner) {
      color: #111827;
      font-size: 13px;
      height: 36px;
      line-height: 36px;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    :deep(.el-input__prefix) {
      color: #6b7280;
    }
  }
}

// 折叠按钮
.menu-toggle {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    
    .toggle-icon {
      color: #111827;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .toggle-icon {
    font-size: 16px;
    color: #6b7280;
    transition: all 0.2s ease;
  }
}

.app-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  padding: 8px 0;
  
  &:not(.el-menu--collapse) {
    width: 230px;
  }
  
  &.el-menu--collapse {
    width: 64px;
  }
  
  // 滚动条样式 - 更细更现代
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
    
    &:hover {
      background: #9ca3af;
    }
  }
  
  // 主菜单项样式 - 扁平化设计
  :deep(.el-menu-item) {
    height: 44px;
    line-height: 44px;
    padding: 0 16px;
    margin: 2px 12px;
    border-radius: 8px;
    transition: all 0.15s ease;
    background: transparent;
    
    &:hover {
      background: #f3f4f6 !important;
      color: #111827 !important;
      
      .menu-icon {
        color: #111827 !important;
      }
    }
    
    &.is-active {
      background: #eff6ff !important;
      color: #2563eb !important;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: #2563eb;
        border-radius: 0 2px 2px 0;
      }
      
      .menu-icon {
        color: #2563eb !important;
      }
    }
  }
  
  // 子菜单样式 - 简洁设计
  :deep(.el-sub-menu) {
    margin: 2px 12px;
    
    .el-sub-menu__title {
      height: 44px;
      line-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      transition: all 0.15s ease;
      
      &:hover {
        background: #f3f4f6 !important;
        color: #111827 !important;
        
        .menu-icon {
          color: #111827 !important;
        }
      }
    }
    
    // 展开时的图标旋转
    &.is-opened {
      > .el-sub-menu__title {
        .el-sub-menu__icon-arrow {
          transform: rotateZ(180deg);
        }
      }
    }
    
    .el-menu {
      background: transparent;
      margin: 0;
      padding: 4px 0;
      
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        padding-left: 48px;
        font-size: 13px;
        margin: 1px 0;
        border-radius: 8px;
        position: relative;
        
        // 子菜单项的圆点指示器
        &::before {
          content: '';
          position: absolute;
          left: 32px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #d1d5db;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        &:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
          
          &::before {
            background: #6b7280;
            transform: translateY(-50%) scale(1.2);
          }
        }
        
        &.is-active {
          background: #eff6ff !important;
          color: #2563eb !important;
          font-weight: 500;
          
          &::before {
            background: #2563eb;
            transform: translateY(-50%) scale(1.5);
          }
        }
      }
    }
  }
}

.menu-icon {
  font-size: 18px;
  margin-right: 10px;
  transition: all 0.15s ease;
  color: #6b7280;
}

.menu-title {
  font-size: 14px;
  font-weight: 400;
  color: inherit;
}

.sub-menu-title {
  font-size: 13px;
  font-weight: 400;
  color: inherit;
}

// 高亮样式 - 更醒目
:deep(.highlight) {
  color: #dc2626;
  font-weight: 600;
  background: #fef2f2;
  padding: 2px 6px;
  border-radius: 4px;
}

// 无结果提示
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
  
  .no-result-icon {
    font-size: 56px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  p {
    font-size: 14px;
    margin: 0;
    color: #6b7280;
  }
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
    
    &.is-active::before {
      left: 0;
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
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}
</style>