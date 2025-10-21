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
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  border-right: 1px solid #cbd5e1;
}

// 顶部容器
.header-container {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  gap: 8px;
}

// 搜索框容器
.search-wrapper {
  flex: 1;
  
  .menu-search {
    :deep(.el-input__wrapper) {
      background: #f8fafc;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      
      &:hover {
        background: #f1f5f9;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);
      }
      
      &.is-focus {
        background: #ffffff;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }
    }
    
    :deep(.el-input__inner) {
      color: #1e293b;
      font-size: 14px;
      
      &::placeholder {
        color: #94a3b8;
      }
    }
    
    :deep(.el-input__prefix) {
      color: #64748b;
    }
  }
}

// 折叠按钮
.menu-toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #3b82f6;
    border-color: #3b82f6;
    
    .toggle-icon {
      color: #ffffff;
    }
  }
  
  .toggle-icon {
    font-size: 16px;
    color: #64748b;
    transition: all 0.2s ease;
  }
}

.app-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  
  &:not(.el-menu--collapse) {
    width: 250px;
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

// 高亮样式
:deep(.highlight) {
  color: #f59e0b;
  font-weight: 600;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 2px 4px;
  border-radius: 3px;
}

// 无结果提示
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #94a3b8;
  
  .no-result-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  p {
    font-size: 14px;
    margin: 0;
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