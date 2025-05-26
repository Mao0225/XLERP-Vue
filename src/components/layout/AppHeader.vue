<template>
  <div class="app-header">
    <div class="logo-container">
      <img src="@/assets/XLerplogo.png" class="logo" alt="企业标识" />
      <!-- <h1 class="company-name">四平器材公司ERP</h1> -->
    </div>
    <div class="menu-toggle" @click="toggleCollapse">
      <el-icon v-if="isCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
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
      <el-dropdown trigger="click">
        <div class="user-info">
          <span class="username">{{ userInfo.username || '未登录' }}</span>
          <el-avatar :size="32" :src="'http://127.0.0.1:8099'+userInfo.avatar"></el-avatar>
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
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/store'
import { useUserStore } from '@/store/user'
import { useTermStore } from '@/store/term'
import { Expand, Fold, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserProfileDialog from '../common/UserProfileDialog.vue'

const userProfileDialog = ref(null)

const appStore = useAppStore()
const userStore = useUserStore()
const termStore = useTermStore()

const isCollapse = computed(() => appStore.isCollapse)
const userInfo = computed(() => ({
  username: userStore.username || '未登录',
  avatar: userStore.avatar || ''
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

onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
  console.log('onMounted: terms', termStore.terms, 'currentTerm', termStore.currentTerm) // 调试日志
})
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
      height: 50px;
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