<template>
    <el-dialog
      title="查看请检单"
      :model-value="visible"
      width="800px"
      :center="true"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
    >
      <div class="view-form">
        <el-row :gutter="20">
          <!-- 基础信息 -->
          <el-col :span="12">
            <div class="form-item">
              <span class="label">单据号:</span>
              <span class="value">{{ initialData.basno || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">制造商:</span>
              <span class="value">{{ initialData.mafactoryname || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">录入人:</span>
              <span class="value">{{ initialData.writer || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">审核人:</span>
              <span class="value">{{ initialData.auditor || '无' }}</span>
            </div>
          </el-col>
  
          <!-- 合同信息 -->
          <el-col :span="12">
            <div class="form-item">
              <span class="label">合同编号:</span>
              <span class="value">{{ initialData.contractno || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">录入时间:</span>
              <span class="value">{{ initialData.writeTime || '无' }}</span>
            </div>
          </el-col>
  
          <!-- 材料信息 -->
          <el-col :span="12">
            <div class="form-item">
              <span class="label">材质:</span>
              <span class="value">{{ initialData.material || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">型号:</span>
              <span class="value">{{ initialData.mattype || '无' }}</span>
            </div>
          </el-col>
  
          <!-- 数量和重量信息 -->
          <el-col :span="12">
            <div class="form-item">
              <span class="label">单位:</span>
              <span class="value">{{ initialData.unit || '个' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">单价:</span>
              <span class="value">{{ initialData.shijidanjia || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">单重:</span>
              <span class="value">{{ initialData.danzhong || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">送货数量:</span>
              <span class="value">{{ initialData.quantity || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">验收数量:</span>
              <span class="value">{{ initialData.sampleQuantity || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">总价:</span>
              <span class="value">{{ initialData.shijiamount || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <span class="label">总重:</span>
              <span class="value">{{ initialData.zongzhong || '无' }}</span>
            </div>
          </el-col>
  
          <!-- 质量证明书 -->
          <el-col :span="24">
            <div class="form-item">
              <span class="label">质量证明书:</span>
              <div class="value uploaded-files" v-if="initialData.certificate && JSON.parse(initialData.certificate).length > 0">
                <div v-for="(file, index) in JSON.parse(initialData.certificate)" :key="index" class="uploaded-file">
                  <span class="file-name" @click="openFileInNewWindow(file.url, file.name)">
                    {{ file.name }}
                  </span>
                </div>
              </div>
              <span v-else class="value">无</span>
            </div>
          </el-col>
  
          <!-- 备注 -->
          <el-col :span="24">
            <div class="form-item">
              <span class="label">备注:</span>
              <span class="value">{{ initialData.memo || '无' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
  
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('update:visible', false)" size="small">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  import { baseURL } from '@/utils/request'
  
  // 定义组件属性和事件
  defineProps({
    visible: {
      type: Boolean,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  })
  
  defineEmits(['update:visible'])
  
  // 打开文件
  const openFileInNewWindow = (url) => {
    window.open(baseURL + url, '_blank')
  }
  </script>
  
  <style scoped>
  :deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-dialog__header) {
    background: #f5f7fa;
    padding: 14px 16px;
    border-bottom: 1px solid #e8ecef;
  }
  
  :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
  
  :deep(.el-dialog__body) {
    padding: 16px 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .view-form {
    padding: 0;
  }
  
  .form-item {
    margin-bottom: 14px;
    display: flex;
    align-items: flex-start;
  }
  
  .label {
    width: 100px;
    color: #606266;
    font-size: 13px;
    font-weight: 500;
    line-height: 32px;
  }
  
  .value {
    flex: 1;
    font-size: 13px;
    color: #303133;
    line-height: 32px;
  }
  
  .uploaded-files {
    max-height: 100px;
    overflow-y: auto;
    border: 1px solid #e8ecef;
    border-radius: 4px;
    padding: 8px;
  }
  
  .uploaded-file {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    padding: 4px 8px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  
  .file-name {
    color: #409eff;
    cursor: pointer;
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .file-name:hover {
    text-decoration: underline;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #e8ecef;
    background: #f5f7fa;
  }
  
  :deep(.el-button--small) {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    :deep(.el-dialog) {
      width: 95%;
    }
  
    .form-item {
      margin-bottom: 10px;
    }
  }
  </style>