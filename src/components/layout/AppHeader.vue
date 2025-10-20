<template>
  <div class="app-header">
    <div class="logo-container">
      <img src="@/assets/logopower.png" class="logo" alt="企业标识" />
      <!-- <h1 class="company-name">四平器材公司ERP</h1> -->
    </div>
    <!-- <div class="menu-toggle" @click="toggleCollapse">
      <el-icon v-if="isCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div> -->
    <div class="term-selector">
      当前期间：
      <el-select
        v-model="currentTerm"
        placeholder="选择当前期间"
        :disabled="termStore.loading || termStore.error"
        @change="handleTermChange"
        size="small"
        style="width: 150px;"
      >
        <el-option
          v-for="term in terms"
          :key="term.id"
          :label="term.term"
          :value="term.term"
        />
        <el-option v-if="!terms.length && !termStore.loading" disabled label="无可用期间" value="" />
      </el-select>
      <el-tooltip v-if="termStore.error" content="期间加载失败，请刷新重试">
        <el-icon style="margin-left: 8px; color: #f56c6c;"><Warning /></el-icon>
      </el-tooltip>
    </div>
    <div class="header-right">
      <el-button
        size="small"
        @click="toggleFullscreen"
        plain
      >
        <el-icon style="margin-right: 4px;">
          <Fullscreen v-if="!isFullscreen" size="20" stroke-width="2" />
          <Minimize2 v-else size="20" stroke-width="2" />
        </el-icon>
        {{ isFullscreen ? '退出全屏' : '全屏显示' }}
      </el-button>
      <el-dropdown trigger="click">
        <div class="user-info">
          <span class="username">{{ userInfo.username || '未登录' }}</span>
          <el-avatar :size="32" :src="userInfo.avatar"></el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUserAction('profile')">修改信息</el-dropdown-item>
            <el-dropdown-item divided @click="handleUserAction('logout')">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <UserProfileDialog ref="userProfileDialog" />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
// import { FullScreen, CloseBold } from '@element-plus/icons-vue'
import { useAppStore } from '@/store'
import { useUserStore } from '@/store/user'
import { useTermStore } from '@/store/term'
import { Fullscreen, Minimize2 } from 'lucide-vue-next'  // 导入具体图标

import { Expand, Fold, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserProfileDialog from '../common/UserProfileDialog.vue'
import { baseURL } from '@/utils/request';

const userProfileDialog = ref(null)

const appStore = useAppStore()
const userStore = useUserStore()
const termStore = useTermStore()

const isCollapse = computed(() => appStore.isCollapse)
const userInfo = computed(() => ({
  username: userStore.username || '未登录',
  avatar: baseURL+userStore.avatar || ''
}))

const currentTerm = computed({
  get: () => {
    console.log('currentTerm getter:', termStore.currentTerm) // 调试日志
    return termStore.currentTerm
  },
  set: (value) => {
    console.log('currentTerm setter:', value) // 调试日志
    termStore.setCurrentTerm(value)
  },
})
const terms = computed(() => termStore.terms)

// 使用 ref 来存储全屏状态，并通过事件监听器更新它
const fullscreenRef = ref(false)
const isFullscreen = computed(() => fullscreenRef.value)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('无法进入全屏模式:', err)
    })
  } else {
    document.exitFullscreen().catch(err => {
      console.error('无法退出全屏模式:', err)
    })
  }
}

// 全屏变化事件处理函数
const handleFullscreenChange = () => {
  fullscreenRef.value = !!document.fullscreenElement
  console.log('全屏状态更新:', fullscreenRef.value) // 调试日志
}

// 挂载和卸载事件监听器
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari 支持
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
  console.log('onMounted: terms', termStore.terms, 'currentTerm', termStore.currentTerm) // 调试日志
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
})

const toggleCollapse = () => {
  appStore.toggleCollapse()
}

const handleUserAction = async (action) => {
  switch (action) {
    case 'profile':
      if (userProfileDialog.value) {
        userProfileDialog.value.open()
      } else {
        console.error('UserProfileDialog 引用未正确初始化')
        ElMessage.error('无法打开用户信息弹窗')
      }
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        userStore.logout()
        ElMessage.success('已成功退出登录')
      } catch (error) {
        console.log('用户取消退出')
      }
      break
  }
}

const handleTermChange = (termValue) => {
  console.log('handleTermChange:', termValue) // 调试日志
  termStore.setCurrentTerm(termValue)
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 15px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .logo-container {
    display: flex;
    align-items: center;

    .logo {
      height: 80px;
      margin-right: 10px;
    }

    .company-name {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }

  .menu-toggle {
    margin-left: 20px;
    font-size: 20px;
    cursor: pointer;
    color: #606266;
  }

  .term-selector {
    margin-left: 20px;
    display: flex;
    align-items: center;
  }

  .header-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .username {
        margin-right: 8px;
        color: #606266;
      }
    }
  }
}
</style>