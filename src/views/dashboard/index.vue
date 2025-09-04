<template>
  <div class="dashboard-container">
    <!-- 欢迎标题 -->
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用四平线路器材ERP管理系统</h1>
    </div>

    <!-- 时间日历 -->
    <div class="time-calendar">
      <div class="time-display">
        <h2 class="current-time">{{ currentTime }}</h2>
        <p class="current-date">{{ currentDate }}</p>
        <p class="current-weekday">{{ currentWeekday }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentTime = ref('')
const currentDate = ref('')
const currentWeekday = ref('')

// 时间更新函数
const updateTime = () => {
  const now = new Date()
  
  // 格式化时间
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  // 格式化日期
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // 格式化星期
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
}

let timeInterval = null

// 组件挂载时启动时间更新
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 85vh;
  background-color: #f5f5f5;
  background-image: url('@/assets/backgroundimg3.png');
  background-size: cover; 
  background-position: center center; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.welcome-section {
  text-align: center;
  
  .welcome-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.time-calendar {
  background: #a4cde9;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 300px;
  
  .time-display {
    .current-time {
      font-size: 48px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 15px 0;
      font-family: 'Courier New', monospace;
    }
    
    .current-date {
      font-size: 20px;
      color: #4a5568;
      margin: 0 0 10px 0;
      font-weight: 500;
    }
    
    .current-weekday {
      font-size: 16px;
      color: #718096;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .welcome-section {
    .welcome-title {
      font-size: 24px;
    }
  }
  
  .time-calendar {
    padding: 30px 20px;
    min-width: 250px;
    
    .time-display {
      .current-time {
        font-size: 36px;
      }
      
      .current-date {
        font-size: 18px;
      }
    }
  }
}
</style>