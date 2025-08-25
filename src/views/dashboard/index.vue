<template>
  <!-- 背景图容器，占据整个页面 -->
  <div class="dashboard-container"></div>
</template>

<script setup>
// 无需额外逻辑，仅保留基础vue语法
import { ref } from 'vue'
// 若后续需扩展可在此添加逻辑，当前仅作背景图展示
const unused = ref(null)
</script>

<style lang="scss" scoped>
// 容器铺满整个视口
.dashboard-container {
  width: 90%;
  height: 100%;
  // 设置背景图，路径为assets/home.png
  background-image: url('@/assets/home.jpg'); 
  // 背景图自适应容器，保持比例不拉伸
  background-size: cover;
  // 背景图居中显示
  background-position: center center;
  // 背景图不重复
  background-repeat: no-repeat;
  // 防止页面滚动（可选，根据需求调整）
  overflow: hidden;
}
</style>