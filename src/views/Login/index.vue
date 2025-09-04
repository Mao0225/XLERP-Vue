<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <!-- <h1>四平器材公司ERP管理系统</h1> -->
        <div class="logo-container">
          <img src="@/assets/sipinglogo.jpg" alt="系统Logo" class="system-logo">
        </div>
      </div>
      <div class="login-form">
        <!-- <h2>用户登录</h2> -->
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
              <!-- <span class="forget-password">忘记密码?</span> -->
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
// import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
// 修改导入语句
import { defineComponent, reactive, ref, toRefs, nextTick } from 'vue'
export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loginFormRef = ref(null)

    const state = reactive({
      loginForm: {
        //username: 'liuguoqi',
        //password: '123456'
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

 const handleLogin = () => {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
        state.loading = true
        try {
            // 登录和路由初始化都在 store 中完成
            await userStore.login({
            username: state.loginForm.username,
            password: state.loginForm.password
            })
            
            ElMessage.success('登录成功')
            
            // 获取重定向路径
            const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
            
            // 直接跳转，路由已经在 store 中初始化完成
            await router.push(redirectPath)
            
        } catch (error) {
            console.error('登录失败:', error)
            ElMessage.error(error.message || '登录失败，请检查用户名和密码')
        } finally {
            state.loading = false
        }
        }
    })
}

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
  // background: linear-gradient(135deg, #3a8ee6, #c8e0e0);
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
  
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  
  .system-logo {
    height: 80px;
  }
}

.login-form {
  h2 {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .forget-password {
      color: #409EFF;
      cursor: pointer;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .login-button {
    width: 100%;
    padding: 12px 0;
  }
}
</style>