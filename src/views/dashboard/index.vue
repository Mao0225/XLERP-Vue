<template>
  <div class="dashboard-container">
    <h1>仪表盘</h1>
    <el-row :gutter="20">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-card shadow="hover" class="dashboard-card">
          <div class="dashboard-card-content">
            <h2>{{ cardTitles[i-1] }}</h2>
            <div class="dashboard-card-value">{{ i * 123 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cardTitles = ref(['用户总数', '今日访问', '订单数量', '本月销售额'])
</script>

<style lang="scss" scoped>
.dashboard-container {
  .dashboard-card {
    margin-bottom: 20px;
    
    .dashboard-card-content {
      text-align: center;
      
      h2 {
        font-size: 16px;
        color: #606266;
      }
      
      .dashboard-card-value {
        font-size: 28px;
        font-weight: bold;
        color: #409EFF;
      }
    }
  }
}
</style>