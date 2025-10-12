<template>
  <el-dialog
    title="查看锤头检验数据"
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
          <el-form-item label="材质">
            <span>{{ initialData.material || '-' }}</span>
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
          <el-form-item label="炉批号">
            <span>{{ initialData.batchNo || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号">
            <span>{{ initialData.batchNum || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成分抽检数(件)">
            <span>{{ initialData.compInspQty || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽检数量(件)">
            <span>{{ initialData.sampleQuantity || '-' }}</span>
          </el-form-item>
        </el-col>

        <!-- 化学成分 -->
        <el-col :span="24">
          <el-divider content-position="left">化学成分 (%)</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col
              :span="8"
              v-for="chem in Object.keys(initialData).filter(key => key.startsWith('chem') && !key.endsWith('Required'))"
              :key="chem"
            >
              <el-form-item :label="chem.replace('chem', '')">
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item :label="chem.replace('chem', '') + '实测值'">
                      <span>{{ initialData[chem] || '-' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="chem.replace('chem', '') + '要求值'">
                      <span>{{ initialData[chem + 'Required'] || '-' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!-- 力学性能 -->
<el-col :span="24">
  <el-divider content-position="left">力学性能</el-divider>
</el-col>
<el-col :span="12">
  <el-form-item label="屈服强度 (MPa)">
    <span>{{ initialData.yieldStrength || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="抗拉强度 (MPa)">
    <span>{{ initialData.tensileStrength || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="延伸率 (MPa)">
    <span>{{ initialData.elongation || '-' }}</span>
  </el-form-item>
</el-col>
<!-- 尺寸信息 -->
<el-col :span="24">
  <el-divider content-position="left">尺寸信息</el-divider>
</el-col>

<el-col :span="12">
  <el-form-item label="孔">
    <span>{{ initialData.kong1 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="孔">
    <span>{{ initialData.kong2 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="孔">
    <span>{{ initialData.kong3 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="孔">
    <span>{{ initialData.kong4 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="孔">
    <span>{{ initialData.kong5 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.kongJudgmentResult || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="总长 (mm)">
    <span>{{ initialData.zongChang1 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="总长 (mm)">
    <span>{{ initialData.zongChang2 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="总长 (mm)">
    <span>{{ initialData.zongChang3 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="总长 (mm)">
    <span>{{ initialData.zongChang4 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="总长 (mm)">
    <span>{{ initialData.zongChang5 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.zongChangJudgmentResult || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="宽 (mm)">
    <span>{{ initialData.kuan1 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="宽 (mm)">
    <span>{{ initialData.kuan2 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="宽 (mm)">
    <span>{{ initialData.kuan3 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="宽 (mm)">
    <span>{{ initialData.kuan4 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="宽 (mm)">
    <span>{{ initialData.kuan5 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.kuanJudgmentResult || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="头宽 (mm)">
    <span>{{ initialData.touKuan1 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="头宽 (mm)">
    <span>{{ initialData.touKuan2 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="头宽 (mm)">
    <span>{{ initialData.touKuan3 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="头宽 (mm)">
    <span>{{ initialData.touKuan4 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="头宽 (mm)">
    <span>{{ initialData.touKuan5 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.touKuanJudgmentResult || '-' }}</span>
  </el-form-item>
</el-col>
<!-- 外形信息 -->
<el-col :span="24">
  <el-divider content-position="left">外形信息</el-divider>
</el-col>

<el-col :span="12">
  <el-form-item label="规格">
    <span>{{ initialData.type || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="外形">
    <span>{{ initialData.appearance || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.appearanceJudgmentResult || '-' }}</span>
  </el-form-item>
</el-col>
<!-- 机械性能 -->
<el-col :span="24">
  <el-divider content-position="left">机械性能</el-divider>
</el-col>

<el-col :span="12">
  <el-form-item label="规格">
    <span>{{ initialData.type || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="重量">
    <span>{{ initialData.zhongLiang1 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="重量">
    <span>{{ initialData.zhongLiang2 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="重量">
    <span>{{ initialData.zhongLiang3 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="重量">
    <span>{{ initialData.zhongLiang4 || '-' }}</span>
  </el-form-item>
</el-col>
<el-col :span="12">
  <el-form-item label="重量">
    <span>{{ initialData.zhongLiang5 || '-' }}</span>
  </el-form-item>
</el-col>

<el-col :span="12">
  <el-form-item label="判断结果">
    <span>{{ initialData.machineryJudgmentResult || '-' }}</span>
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