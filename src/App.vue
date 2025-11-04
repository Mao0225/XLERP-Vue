<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
// @import "assets/glabal.css";
.app-container {
  height: 100vh;
  width: 100vw;
}

/* 全局提高 ElMessage 的层级，超过 9999 */
.el-message {
  z-index: 10000 !important; /* 比 Header 的 9999 大 1 即可 */
}

/* 注意：如果是 ElMessageBox（弹窗），需要单独设置（可选） */
.el-message-box {
  z-index: 10001 !important;
}
</style>