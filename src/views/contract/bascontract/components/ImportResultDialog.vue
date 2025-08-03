// ImportResultDialog.vue - 导入结果弹窗组件
<template>
  <el-dialog
    v-model="visible"
    title="导入结果"
    width="600px"
    :close-on-click-modal="false"
    @closed="handleClose"
  >
    <div class="import-result">
      <!-- 统计信息 -->
      <div class="result-summary">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ importData.totalRows || 0 }}</div>
              <div class="stat-label">导入总数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item success">
              <div class="stat-value">{{ importData.successCount || 0 }}</div>
              <div class="stat-label">成功导入</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item error">
              <div class="stat-value">{{ importData.failedCount || 0 }}</div>
              <div class="stat-label">失败数量</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ successRate }}%</div>
              <div class="stat-label">成功率</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 失败详情 -->
      <div v-if="importData.failedRows && importData.failedRows.length > 0" class="failed-details">
        <h4>失败详情：</h4>
        <div class="failed-list">
          <el-scrollbar max-height="300px">
            <div
              v-for="(row, index) in importData.failedRows"
              :key="index"
              class="failed-item"
            >
              <el-tag type="danger" size="small">第 {{ row.rowNumber }} 行</el-tag>
              <span class="error-message">{{ row.error }}</span>
            </div>
          </el-scrollbar>
        </div>
        
        <!-- 导出失败数据按钮 -->
        <div class="export-actions">
          <el-button size="small" @click="exportFailedData">
            <el-icon><Download /></el-icon>
            导出失败数据
          </el-button>
        </div>
      </div>

      <!-- 无失败情况 -->
      <div v-else class="no-failed">
        <el-result icon="success" title="导入成功" sub-title="所有数据都已成功导入">
        </el-result>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Download } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  importData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 计算成功率
const successRate = computed(() => {
  const total = props.importData.totalRows || 0
  const success = props.importData.successCount || 0
  return total > 0 ? Math.round((success / total) * 100) : 0
})

// 导出失败数据
const exportFailedData = () => {
  const failedData = props.importData.failedRows || []
  const csvContent = [
    '行号,错误信息',
    ...failedData.map(row => `${row.rowNumber},"${row.error}"`)
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `导入失败数据_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}
</script>

<style scoped>
.import-result {
  padding: 20px 0;
}

.result-summary {
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
}

.stat-item.success {
  background-color: #f0f9ff;
  color: #67c23a;
}

.stat-item.error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.failed-details h4 {
  margin-bottom: 15px;
  color: #303133;
}

.failed-list {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.failed-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
}

.failed-item:last-child {
  margin-bottom: 0;
}

.error-message {
  margin-left: 10px;
  flex: 1;
  color: #606266;
}

.export-actions {
  text-align: right;
}

.no-failed {
  text-align: center;
  padding: 20px 0;
}
</style>