<template>
  <div class="sidebar-container" :class="{ 'collapsed': isCollapse }">
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
      :unique-opened="false"
      class="app-menu"
      background-color="transparent"
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
          <template #title>
            <span class="menu-title" v-html="highlightText(menu.title)"></span>
          </template>
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
              <template #title>
                <span class="sub-menu-title" v-html="highlightText(child.title)"></span>
              </template>
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
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
  
  &.collapsed {
    width: 64px;
  }
}

// 顶部容器
.header-container {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  gap: 8px;
  flex-shrink: 0;
}

// 搜索框容器
.search-wrapper {
  flex: 1;
  overflow: hidden;
  
  .menu-search {
    :deep(.el-input__wrapper) {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.app-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  background: transparent;
  
  &:not(.el-menu--collapse) {
    width: 230px;
  }
  
  &.el-menu--collapse {
    width: 64px;
  }
  
  // 滚动条样式
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
  
  // 关键优化：禁用所有默认过渡动画
  * {
    transition-property: background-color, color, transform, opacity !important;
    transition-duration: 0.2s !important;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  // 强制禁用高度过渡
  :deep(.el-menu),
  :deep(.el-menu--inline),
  :deep(.el-sub-menu__wrap) {
    transition: none !important;
  }
  
  // 主菜单项样式
  :deep(.el-menu-item) {
    height: 44px;
    line-height: 44px;
    padding: 0 16px !important;
    margin: 2px 12px;
    border-radius: 8px;
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
  
  // 子菜单样式
  :deep(.el-sub-menu) {
    margin: 2px 12px;
    
    .el-sub-menu__title {
      height: 44px;
      line-height: 44px;
      padding: 0 16px !important;
      border-radius: 8px;
      
      &:hover {
        background: #f3f4f6 !important;
        color: #111827 !important;
        
        .menu-icon {
          color: #111827 !important;
        }
      }
      
      // 箭头图标
      .el-sub-menu__icon-arrow {
        right: 16px;
        margin-top: -4px;
      }
    }
    
    // 展开动画优化
    &.is-opened {
      > .el-sub-menu__title {
        .el-sub-menu__icon-arrow {
          transform: rotateZ(180deg);
        }
      }
    }
    
    // 子菜单容器 - 关键优化
    .el-menu {
      background: transparent;
      margin: 0;
      padding: 0;
      
      // 关键：使用 max-height 而不是 height 来实现平滑展开
      &.el-menu--inline {
        overflow: hidden;
      }
      
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        padding-left: 48px !important;
        font-size: 13px;
        margin: 1px 12px 1px 0;
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
  color: #6b7280;
  flex-shrink: 0;
}


.menu-title {
  font-size: 14px;
  font-weight: 400;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-menu-title {
  font-size: 13px;
  font-weight: 400;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 高亮样式
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
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    
    // 重置 tooltip 容器的样式
    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .el-icon {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }
    
    .menu-icon {
      margin-right: 0 !important;
      margin-left: 0 !important;
      font-size: 20px;
    }
    
    &.is-active::before {
      left: 0;
    }
  }
  
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      
      // 重置所有子元素
      > * {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .el-icon {
        margin-right: 0 !important;
        margin-left: 0 !important;
      }
      
      .menu-icon {
        margin-right: 0 !important;
        margin-left: 0 !important;
        font-size: 20px;
      }
      
      .el-sub-menu__icon-arrow {
        display: none;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}

// 性能优化：使用 GPU 加速
.sidebar-container,
.app-menu,
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>