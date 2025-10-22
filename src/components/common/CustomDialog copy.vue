<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div v-if="visible" class="custom-dialog-overlay" @click="handleOverlayClick">
        <div 
          class="custom-dialog" 
          :class="{ 'full-screen': isFullScreen }"
          :style="dialogStyle"
          v-bind="$attrs"
          @click.stop
        >
          <!-- 标题栏 -->
          <div class="custom-dialog-header">
            <span class="title">{{ title }}</span>
            <div class="actions">
              <el-button circle size="small" @click="toggleFullScreen" title="切换全屏">
                <el-icon>
                  <Maximize2 v-if="!isFullScreen" />
                  <Minimize2 v-else />
                </el-icon>
              </el-button>
              <el-button circle size="small" @click="close" title="关闭">
                <el-icon><X /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 内容插槽 -->
          <div class="custom-dialog-body" :style="bodyStyle">
            <slot></slot>
          </div>

          <!-- 底部插槽 -->
          <div class="custom-dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
});

import { computed } from 'vue';
import { Maximize2, Minimize2, X } from 'lucide-vue-next';

const props = defineProps({
  visible: Boolean,
  title: String,
  isFullScreen: { type: Boolean, default: false },
  closeOnClickModal: { type: Boolean, default: true },
  headerHeight: { type: Number, default: 60 }
});

const emit = defineEmits(['update:visible', 'update:isFullScreen']);

const isFullScreen = computed({
  get() { return props.isFullScreen; },
  set(val) { emit('update:isFullScreen', val); }
});

const dialogStyle = computed(() => {
  if (props.isFullScreen) {
    return {
      top: `${props.headerHeight}px`,
      height: `calc(100vh - ${props.headerHeight}px)`,
      width: '100vw',
      position: 'fixed',
      left: '0',
      margin: '0',
      borderRadius: '0',
      zIndex: 2000
    };
  } else {
    return {
      width: '60%',
      top: '8vh',
      left: '50%',
      transform: 'translateX(-50%)',
      position: 'fixed',
      zIndex: 2000,
      maxHeight: '90vh'
    };
  }
});

const bodyStyle = computed(() => {
  const footerHeight = 50; // 固定footer高度
  if (props.isFullScreen) {
    return {
      flex: '1', // 使用flex让body自动填充剩余空间
      overflowY: 'auto',
      padding: '20px'
    };
  } else {
    return {
      maxHeight: `calc(80vh - ${props.headerHeight + footerHeight}px)`, // 动态计算body最大高度
      overflowY: 'auto',
      padding: '20px'
    };
  }
});

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
};

const close = () => {
  emit('update:visible', false);
};

const handleOverlayClick = () => {
  if (props.closeOnClickModal) {
    close();
  }
};
</script>

<style scoped>
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-dialog {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保在全屏模式下填充高度 */
}

.custom-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  flex-shrink: 0; /* 防止header收缩 */
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 8px;
}

.custom-dialog-body {
  overflow-y: auto;
  flex: 1; /* 让body填充剩余空间 */
}

.custom-dialog-footer {
  padding: 10px 20px;
  border-top: 1px solid #dcdfe6;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0; /* 防止footer收缩 */
}

/* 动画 */
.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity 0.3s;
}
.dialog-fade-enter-from, .dialog-fade-leave-to {
  opacity: 0;
}
</style>