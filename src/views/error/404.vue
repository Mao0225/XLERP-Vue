<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goHome
    }
  }
})
</script>

<style lang="scss" scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f7fa;
}

.not-found-content {
  text-align: center;
  
  h1 {
    font-size: 120px;
    margin: 0;
    color: #409EFF;
    line-height: 1;
  }
  
  h2 {
    font-size: 30px;
    margin: 20px 0;
    color: #333;
  }
  
  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
  }
}
</style>