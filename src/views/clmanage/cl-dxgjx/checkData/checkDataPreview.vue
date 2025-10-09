
<template>
  <el-dialog
    title="查看镀锌钢绞线检验数据"
    :model-value="visible"
    width="1200px"
    :center="true"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form :model="initialData" label-width="120px" class="custom-form">
      <el-row :gutter="16">
        <!-- 基础信息 -->
        <el-col :span="24">
          <el-divider content-position="left">基础信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据号">
            <span>{{ initialData.basNo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复检单号">
            <span>{{ initialData.matRecheckNo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号">
            <span>{{ initialData.contractNo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称">
            <span>{{ initialData.contractName || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原材料制造商">
            <span>{{ initialData.mafactory || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="牌号">
            <span>{{ initialData.matMaterial || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号">
            <span>{{ initialData.type || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验标准">
            <span>{{ initialData.standard || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观尺寸">
            <span>{{ initialData.appearanceSize || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号">
            <span>{{ initialData.batchNum || '-' }}</span>
          </el-form-item>
        </el-col>
          <el-form-item label="力学性能检验抽检数(件)">
            <span>{{ initialData.mechlnspQty || '-' }}</span>
          </el-form-item>
        <el-col :span="12">
          <el-form-item label="抽检数量(件)">
            <span>{{ initialData.sampleQuantity || '-' }}</span>
          </el-form-item>
        </el-col>

        <!-- 力学性能 -->
        <el-col :span="24">
          <el-divider content-position="left">力学性能</el-divider>
        </el-col>
        
        <!-- 单丝强度 -->
        <el-col :span="24">
          <el-divider content-position="left" style="margin-left: -120px;">单丝强度 (MPa)</el-divider>
        </el-col>
        <el-col :span="8">
          <el-form-item label="要求值">
            <span>{{ initialData.monoStrengthRequired || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值A">
            <span>{{ initialData.monoStrengthA || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值B">
            <span>{{ initialData.monoStrengthB || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值C">
            <span>{{ initialData.monoStrengthC || '-' }}</span>
          </el-form-item>
        </el-col>

        <!-- 破断拉力 -->
        <el-col :span="24">
          <el-divider content-position="left" style="margin-left: -120px;">破断拉力总和 (kN)</el-divider>
        </el-col>
        <el-col :span="8">
          <el-form-item label="要求值">
            <span>{{ initialData.breakingForceRequired || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值A">
            <span>{{ initialData.breakingForceA || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值B">
            <span>{{ initialData.breakingForceB || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实测值C">
            <span>{{ initialData.breakingForceC || '-' }}</span>
          </el-form-item>
        </el-col>

        <!-- 过程信息 -->
        <el-col :span="24">
          <el-divider content-position="left">过程信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂检测日期">
            <span>{{ initialData.leaveFactoryDate || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入厂检测日期">
            <span>{{ initialData.detectionTime || '-' }}</span>
          </el-form-item>
        </el-col>

        <!-- 总结论 -->
        <el-col :span="24">
          <el-divider content-position="left">总结论</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最终检验结论">
            <span>{{ initialData.finalConclusion || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验备注">
            <span>{{ initialData.checkMemo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验数据录入人">
            <span>{{ initialData.checkWriter || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验数据审核人">
            <span>{{ initialData.checkAuditor || '-' }}</span>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)" size="small">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

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
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
}

:deep(.el-dialog__header) {
  background: #f5f7fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e8ecef;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 12px 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.custom-form {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
  line-height: 30px;
}

:deep(.el-divider--horizontal) {
  margin: 12px 0;
}

:deep(.el-divider__text) {
  font-size: 13px;
  color: #409eff;
  font-weight: 600;
  background: #fff;
  padding: 0 8px;
}

:deep(.el-form-item__content span) {
  font-size: 13px;
  color: #303133;
  line-height: 30px;
}

:deep(.el-button--small) {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-dialog__footer) {
  padding: 10px 16px;
  border-top: 1px solid #e8ecef;
  background: #f5f7fa;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95%;
  }

  .el-col:nth-child(n) {
    margin-bottom: 0;
  }
}
</style>