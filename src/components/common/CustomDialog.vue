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
              <button class="icon-btn" @click="toggleFullScreen" :title="isFullScreen ? '退出全屏' : '全屏'">
                <el-icon>
                  <Maximize2 v-if="!isFullScreen" />
                  <Minimize2 v-else />
                </el-icon>
              </button>
              <button class="icon-btn close-btn" @click="close" title="关闭">
                <el-icon><X /></el-icon>
              </button>
            </div>
          </div>

          <!-- 内容插槽 -->
          <div class="custom-dialog-body" :style="bodyStyle">
            <slot></slot>
          </div>

          <!-- 底部插槽 -->
          <div class="custom-dialog-footer" v-if="$slots.footer">
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
  headerHeight: { type: Number, default: 60 },
  height: { type: String, default: '' }, // 自定义高度，如 '500px' 或 '60vh'
  width: { type: String, default: '80%' }, // 自定义宽度
  maxWidth: { type: String, default: '1200px' } // 最大宽度
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
      transform: 'none',
      margin: '0',
      borderRadius: '0',
      zIndex: 2000
    };
  } else {
    const style = {
      width: props.width,
      maxWidth: props.maxWidth,
      top: '8vh',
      left: '50%',
      transform: 'translateX(-50%)',
      position: 'fixed',
      zIndex: 2000
    };
    
    // 如果传入了自定义高度，使用自定义高度，否则使用 maxHeight
    if (props.height) {
      style.height = props.height;
    } else {
      style.maxHeight = '90vh';
    }
    
    return style;
  }
});

const bodyStyle = computed(() => {
  const footerHeight = 70;
  const headerHeightVal = 70; // 实际header高度
  
  if (props.isFullScreen) {
    return {
      flex: '1',
      overflowY: 'auto',
      padding: '24px 32px'
    };
  } else {
    // 如果设置了固定高度，body需要自适应
    if (props.height) {
      return {
        flex: '1',
        overflowY: 'auto',
        padding: '24px 32px'
      };
    } else {
      return {
        maxHeight: `calc(82vh - ${headerHeightVal + footerHeight}px)`,
        overflowY: 'auto',
        padding: '24px 32px'
      };
    }
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
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-dialog {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-dialog.full-screen {
  border-radius: 0;
  left: 0 !important;
  transform: none !important;
}

.custom-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #f8f9fa;
  height: 30px;
  flex-shrink: 0;
  border-bottom: 1px solid #e9ecef;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.2px;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  padding: 0;
  border: 1px solid #e5e7eb;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.icon-btn:active {
  transform: scale(0.95);
}

.icon-btn.close-btn:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.custom-dialog-body {
  overflow-y: auto;
  flex: 1;
  background: #ffffff;
}

/* 自定义滚动条 */
.custom-dialog-body::-webkit-scrollbar {
  width: 6px;
}

.custom-dialog-body::-webkit-scrollbar-track {
  background: transparent;
}

.custom-dialog-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
  transition: background 0.2s;
}

.custom-dialog-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.custom-dialog-footer {
  padding: 16px 32px;
  background: #fafbfc;
  border-top: 1px solid #e9ecef;
  min-height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 简化动画 */
.dialog-fade-enter-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from {
  opacity: 0;
}

.dialog-fade-leave-active {
  transition: none;
}

.dialog-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-dialog {
    width: 95% !important;
    max-width: 95% !important;
  }
  
  .custom-dialog-header {
    padding: 16px 20px;
    height: 60px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .custom-dialog-body {
    padding: 20px !important;
  }
  
  .custom-dialog-footer {
    padding: 12px 20px;
    min-height: 60px;
  }
  
  .icon-btn {
    width: 32px;
    height: 32px;
  }
}
</style>