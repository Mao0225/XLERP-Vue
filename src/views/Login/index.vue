<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <img src="@/assets/sipinglogo.jpg" alt="系统Logo" class="system-logo">
        </div>
      </div>
      <div class="login-form">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="user"
              clearable
              autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              prefix-icon="lock"
              show-password
              clearable
              type="password"
              autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loginFormRef = ref(null)

    const state = reactive({
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false,
      rememberMe: false
    })

    // 页面挂载时：加载本地保存的用户名
    const loadSavedUsername = () => {
      const savedUsername = localStorage.getItem('rememberedUsername')
      if (savedUsername) {
        state.loginForm.username = savedUsername
        state.rememberMe = true
      }
    }

    // 登录成功后：根据 rememberMe 保存或清除用户名
    const saveUsernameIfNeeded = () => {
      if (state.rememberMe && state.loginForm.username) {
        localStorage.setItem('rememberedUsername', state.loginForm.username)
      } else {
        localStorage.removeItem('rememberedUsername')
      }
    }

    const handleLogin = () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) return

        state.loading = true
        try {
          await userStore.login({
            username: state.loginForm.username,
            password: state.loginForm.password
          })

          // 保存用户名（仅用户名，不保存密码）
          saveUsernameIfNeeded()

          ElMessage.success('登录成功')

          const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
          await router.push(redirectPath)
        } catch (error) {
          console.error('登录失败:', error)
          ElMessage.error(error.message || '登录失败，请检查用户名和密码')
        } finally {
          state.loading = false
        }
      })
    }

    // 组件挂载后加载保存的用户名
    onMounted(() => {
      loadSavedUsername()
    })

    return {
      loginFormRef,
      ...toRefs(state),
      handleLogin
    }
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(@/assets/backgroundimg2.png);
  background-size: cover;
  overflow: hidden;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.system-logo {
  height: 80px;
}

.login-form {
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login-button {
    width: 100%;
    padding: 12px 0;
  }
}
</style>