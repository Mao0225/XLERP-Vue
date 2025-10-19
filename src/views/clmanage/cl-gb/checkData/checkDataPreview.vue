<template>
  <el-dialog
    title="查看钢板检验数据"
    :model-value="visible"
    width="1200px"
    :center="true"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form :model="initialData" label-width="120px" class="custom-form">
      <el-row :gutter="16">
        <!-- 基础信息（保持不变） -->
        <el-col :span="24">
          <el-divider content-position="left">基础信息</el-divider>
        </el-col>
        <el-col :span="12"><el-form-item label="单据号"><span>{{ initialData.basno || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="复检单号"><span>{{ initialData.matRecheckNo || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="原材料制造商"><span>{{ initialData.mafactory || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="钢板牌号"><span>{{ initialData.matMaterial || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="材质"><span>{{ initialData.material || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="型号"><span>{{ initialData.type || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="检验标准"><span>{{ initialData.standard || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="外观尺寸"><span>{{ initialData.appearanceSize || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="炉批号"><span>{{ initialData.batchNo || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="批次号"><span>{{ initialData.batchNum || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="成分抽检数(件)"><span>{{ initialData.compInspQty || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="抽检数量(件)"><span>{{ initialData.sampleQuantity || '-' }}</span></el-form-item></el-col>
        <el-col :span="12">
  <el-form-item label="冲击实验">
    <div>
      <span>1#: {{ initialData.impactexp1 || '-' }} </span>
      <span>2#: {{ initialData.impactexp2 || '-' }} </span>
      <span>3#: {{ initialData.impactexp3 || '-' }}</span>
    </div>
  </el-form-item>
</el-col>

        <!-- 2. 化学成分（修复不显示问题） -->
        <el-col :span="24"><el-divider content-position="left">化学成分 (%)</el-divider></el-col>
        <!-- 兜底：无数据时显示提示 -->
        <el-col :span="24" v-if="chemKeys.length === 0 && Object.keys(initialData).length > 0">
          <div style="text-align: center; color: #909399; padding: 10px;">暂无化学成分数据</div>
        </el-col>
        <!-- 有数据时渲染 -->
        <el-col :span="24" v-else-if="chemKeys.length > 0">
          <el-row :gutter="16">
            <el-col :span="8" v-for="chem in chemKeys" :key="chem">
              <el-form-item :label="chem.replace('chem', '')">
                <el-row :gutter="8">
                  <!-- 实测值：确保字段存在 -->
                  <el-col :span="12">
                    <el-form-item :label="chem.replace('chem', '') + '实测值'">
                      <span>{{ initialData[chem] !== undefined ? initialData[chem] : '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <!-- 要求值：确保字段存在（chem + Required） -->
                  <el-col :span="12">
                    <el-form-item :label="chem.replace('chem', '') + '要求值'">
                      <span>{{ initialData[chem + 'Required'] !== undefined ? initialData[chem + 'Required'] : '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 3. 力学性能（保持不变） -->
        <el-col :span="24"><el-divider content-position="left">力学性能</el-divider></el-col>
        <el-col :span="24">
          <el-row :gutter="16" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-form-item label="抗拉强度 实测值">
                <el-row :gutter="8" style="width: 100%;">
                  <el-col :span="8"><el-form-item label="实测值1#" label-width="60px"><span>{{ initialData.mechtensileStrength1 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值2#" label-width="60px"><span>{{ initialData.mechtensileStrength2 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值3#" label-width="60px"><span>{{ initialData.mechtensileStrength3 || '-' }}</span></el-form-item></el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12"><el-form-item label="抗拉强度 要求值"><span>{{ initialData.mechtensileStrengthRequired || '-' }}</span></el-form-item></el-col>
          </el-row>
          <el-row :gutter="16" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-form-item label="屈服强度 实测值">
                <el-row :gutter="8" style="width: 100%;">
                  <el-col :span="8"><el-form-item label="实测值1#" label-width="60px"><span>{{ initialData.mechyieldStrength1 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值2#" label-width="60px"><span>{{ initialData.mechyieldStrength2 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值3#" label-width="60px"><span>{{ initialData.mechyieldStrength3 || '-' }}</span></el-form-item></el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12"><el-form-item label="屈服强度 要求值"><span>{{ initialData.mechyieldStrengthRequired || '-' }}</span></el-form-item></el-col>
          </el-row>
          <el-row :gutter="16" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-form-item label="延伸率 实测值">
                <el-row :gutter="8" style="width: 100%;">
                  <el-col :span="8"><el-form-item label="实测值1#" label-width="60px"><span>{{ initialData.mechelongation1 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值2#" label-width="60px"><span>{{ initialData.mechelongation2 || '-' }}</span></el-form-item></el-col>
                  <el-col :span="8"><el-form-item label="实测值3#" label-width="60px"><span>{{ initialData.mechelongation3 || '-' }}</span></el-form-item></el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12"><el-form-item label="延伸率 要求值"><span>{{ initialData.mechelongationRequired || '-' }}</span></el-form-item></el-col>
          </el-row>
        </el-col>

        <!-- 过程信息、总结论（保持不变） -->
        <el-col :span="24"><el-divider content-position="left">过程信息</el-divider></el-col>
        <el-col :span="12"><el-form-item label="出厂检测日期"><span>{{ initialData.leaveFactoryDate || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="入厂检测日期"><span>{{ initialData.detectionTime || '-' }}</span></el-form-item></el-col>
        <el-col :span="24"><el-divider content-position="left">总结论</el-divider></el-col>
        <el-col :span="12"><el-form-item label="最终检验结论"><span>{{ initialData.finalConclusion || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="检验备注"><span>{{ initialData.checkMemo || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="检验数据录入人"><span>{{ initialData.checkWriter || '-' }}</span></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="检验数据审核人"><span>{{ initialData.checkAuditor || '-' }}</span></el-form-item></el-col>
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
import { defineProps, defineEmits, computed, watch } from 'vue'

// 1. Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// 2. Emits定义
defineEmits(['update:visible'])

// 3. 修复化学成分字段筛选（核心：确保响应式依赖+初始数据判断）
const chemKeys = computed(() => {
  // 仅当initialData有数据时才筛选，避免空对象筛选导致空数组
  if (Object.keys(props.initialData).length === 0) {
    console.log('initialData为空，暂不筛选化学成分字段');
    return [];
  }

  // 筛选规则：以"chem"开头，且不以"Required"结尾（如chemC、chemSi，排除chemCRequired）
  const keys = Object.keys(props.initialData).filter(key => {
    const isChemKey = key.startsWith('chem');
    const isNotRequired = !key.endsWith('Required');
    console.log(`字段${key}：是否为化学成分字段？${isChemKey && isNotRequired}`); // 调试用，可删除
    return isChemKey && isNotRequired;
  });

  console.log('筛选出的化学成分字段：', keys); // 调试用，可删除
  return keys;
})

// 4. 兜底：监听initialData变化，确保chemKeys重新计算（可选，增强稳定性）
watch(
  () => props.initialData,
  (newData) => {
    console.log('initialData更新，重新计算chemKeys', newData);
    // 触发computed重新计算（无需额外操作，watch仅用于调试和确认）
  },
  { deep: true } // 深度监听，确保对象内部字段变化也能触发
)
</script>

<style scoped>
/* 样式保持不变 */
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
.custom-form { padding: 0; }
:deep(.el-form-item) {
  margin-bottom: 12px;
  white-space: nowrap;
}
:deep(.el-form-item__label) {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
  line-height: 30px;
}
:deep(.el-divider--horizontal) { margin: 12px 0; }
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
  :deep(.el-dialog) { width: 95%; }
  .el-col:nth-child(n) { margin-bottom: 0; }
}
</style>