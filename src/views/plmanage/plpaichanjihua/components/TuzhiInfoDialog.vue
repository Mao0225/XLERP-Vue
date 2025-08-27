<!-- 图纸信息预览 -->
<template>
  <el-dialog
    v-model="innerVisible"
    title="图纸信息预览"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form label-width="100px" :model="tuzhiInfo" v-if="tuzhiInfo" class="compact-form">
      <div class="form-row">
        <el-form-item label="图纸名称">
          <span class="value-text highlight">{{ tuzhiInfo.tuzhimingcheng }}</span>
        </el-form-item>
        <el-form-item label="图纸编号">
          <span class="value-text">{{ tuzhiInfo.tuzhibianhao }}</span>
        </el-form-item>
      </div>
      
      <el-form-item label="图纸描述">
        <span class="value-text">{{ tuzhiInfo.tuzhimiaoshu || '-' }}</span>
      </el-form-item>
      
      <div class="form-row">
        <el-form-item label="图纸作者">
          <span class="value-text">{{ tuzhiInfo.tuzhizuozhe }}</span>
        </el-form-item>
        <el-form-item label="创建日期">
          <span class="value-text">{{ tuzhiInfo.chuangzuoriqi }}</span>
        </el-form-item>
      </div>
      
      <div class="form-row">
        <el-form-item label="录入人">
          <span class="value-text">{{ tuzhiInfo.writer }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span class="value-text">{{ tuzhiInfo.memo || '-' }}</span>
        </el-form-item>
      </div>
      
      <el-form-item label="图纸文件" class="file-item">
        <div v-if="fileList.length > 0" class="file-list">
          <a 
            v-for="(file, index) in fileList" 
            :key="index"
            :href="getDownloadUrl(file.url)" 
            :download="file.name" 
            target="_blank" 
            class="file-link"
          >
            📄 {{ file.name }}
          </a>
        </div>
        <span v-else class="no-file">暂无文件</span>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { baseURL } from '@/utils/request';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  tuzhiInfo: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible']);

const innerVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  innerVisible.value = newVal;
});

const fileList = computed(() => {
  if (!props.tuzhiInfo.tuzhiurl) return [];
  try {
    return JSON.parse(props.tuzhiInfo.tuzhiurl);
  } catch (error) {
    console.error('解析图纸URL失败:', error);
    return [];
  }
});

const getDownloadUrl = (url) => {
  return baseURL + url;
};

const handleClose = () => {
  innerVisible.value = false;
  emit('update:visible', false);
};
</script>

<style scoped>
.compact-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 40px;
}

.form-row .el-form-item {
  flex: 1;
}

.value-text {
  color: #303133;
  font-size: 14px;
}

.value-text.highlight {
  color: #409eff;
  font-weight: 600;
}

.file-item {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
  margin-top: 8px;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.file-link {
  display: inline-block;
  padding: 4px 8px;
  background: #f0f9ff;
  color: #409eff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #b3d8ff;
  transition: all 0.2s;
}

.file-link:hover {
  background: #409eff;
  color: white;
}

.no-file {
  color: #909399;
  font-style: italic;
}
</style>