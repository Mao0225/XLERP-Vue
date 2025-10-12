<template>
  <el-dialog
    title="查看镀锌螺栓检验数据"
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
            <el-divider content-position="left">化学性能 (%)</el-divider>
          </el-col>
          <el-col :span="24">
            <h4 class="text-lg font-medium mb-2">C元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="(item, index) in [
                { key: 'chemC1', label: 'C的实测值一' },  
                { key: 'chemC2', label: 'C的实测值二' },  
                { key: 'chemC3', label: 'C的实测值三' } 
              ]" :key="index">  
                <el-form-item :label="item.label">
                  <span>{{ initialData[item.key] || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="C的要求值">
                  <span>{{ initialData.chemCRequired || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        <!-- Si元素 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">Si元素</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'chemSi1', label: 'Si的实测值一' },  
              { key: 'chemSi2', label: 'Si的实测值二' },  
              { key: 'chemSi3', label: 'Si的实测值三' } 
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Si的要求值">
                <span>{{ initialData.chemSiRequired || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- Mn元素 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">Mn元素</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'chemMn1', label: 'Mn的实测值一' },  
              { key: 'chemMn2', label: 'Mn的实测值二' },  
              { key: 'chemMn3', label: 'Mn的实测值三' } 
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Mn的要求值">
                <span>{{ initialData.chemMnRequired || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- P元素 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">P元素</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'chemP1', label: 'P的实测值一' },  
              { key: 'chemP2', label: 'P的实测值二' },  
              { key: 'chemP3', label: 'P的实测值三' } 
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="P的要求值">
                <span>{{ initialData.chemPRequired || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- S元素 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">S元素</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'chemS1', label: 'S的实测值一' },  
              { key: 'chemS2', label: 'S的实测值二' },  
              { key: 'chemS3', label: 'S的实测值三' } 
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="S的要求值">
                <span>{{ initialData.chemSRequired || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 硬度 -->
        <el-col :span="24">
            <el-divider content-position="left">硬度</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="16">
              <el-col :span="6" v-for="(item, index) in [
                { key: 'hardness1', label: '硬度的实测值一' },  
                { key: 'hardness2', label: '硬度的实测值二' },  
                { key: 'hardness3', label: '硬度的实测值三' },  
                { key: 'hardness4', label: '硬度的实测值四' },  
                { key: 'hardness5', label: '硬度的实测值五' },  
              ]" :key="index">  
                <el-form-item :label="item.label">
                  <span>{{ initialData[item.key] || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="硬度的要求值">
                  <span>{{ initialData.hardnessRequired || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        <!-- 锌层厚度 -->
         <el-col :span="24">
            <el-divider content-position="left">锌层厚度</el-divider>
          </el-col>
        <el-col :span="24">
            <h4 class="text-lg font-medium mb-2">单体锌层厚度</h4>
            <el-row :gutter="16">
              <el-col :span="12" v-for="(item, index) in [
                { key: 'zincLayerThicknessSingle1', label: '单体锌层厚度的实测值一' },  
                { key: 'zincLayerThicknessSingle2', label: '单体锌层厚度的实测值二' },  
                { key: 'zincLayerThicknessSingle3', label: '单体锌层厚度的实测值三' },
                { key: 'zincLayerThicknessSingle4', label: '单体锌层厚度的实测值四' },
                { key: 'zincLayerThicknessSingle5', label: '单体锌层厚度的实测值五' },
              ]" :key="index">  
                <el-form-item :label="item.label">
                  <span>{{ initialData[item.key] || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单体锌层厚度的要求值">
                  <span>{{ initialData.zincLayerThicknessSingleRequired || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

        <!-- Total部分 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">总体锌层厚度</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'zincLayerThicknessTotal', label: '实测值' }
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求值">
                <span>{{ initialData.zincLayerThicknessTotalRequired || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!--机械性能 -->
          <el-col :span="24">
            <el-divider content-position="left">机械性能</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="16">
              <el-col :span="6" v-for="(item, index) in [
                { key: 'mechanicalProperties1', label: '机械性能实测值一' },  
                { key: 'mechanicalProperties2', label: '机械性能实测值二' },  
                { key: 'mechanicalProperties3', label: '机械性能实测值三' } 
              ]" :key="index">  
                <el-form-item :label="item.label">
                  <span>{{ initialData[item.key] || '-' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="机械性能要求值">
                  <span>{{ initialData.mechanicalPropertiesRequired || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        <!-- 尺寸 -->
        <el-col :span="24">
          <el-divider content-position="left">尺寸</el-divider>
        </el-col>
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">d</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'sized1', label: 'd的实测值一' },  
              { key: 'sized2', label: 'd的实测值二' },  
              { key: 'sized3', label: 'd的实测值三' }, 
              { key: 'sized4', label: 'd的实测值四' },
              { key: 'sized5', label: 'd的实测值五' }
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- L部分 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">L</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'sizeL1', label: 'L的实测值一' },  
              { key: 'sizeL2', label: 'L的实测值二' },  
              { key: 'sizeL3', label: 'L的实测值三' }, 
              { key: 'sizeL4', label: 'L的实测值四' },
              { key: 'sizeL5', label: 'L的实测值五' }
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- b部分 -->
        <el-col :span="24">
          <h4 class="text-lg font-medium mb-2">b</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="(item, index) in [
              { key: 'sizeb1', label: 'b的实测值一' },  
              { key: 'sizeb2', label: 'b的实测值二' },  
              { key: 'sizeb3', label: 'b的实测值三' }, 
              { key: 'sizeb4', label: 'b的实测值四' },
              { key: 'sizeb5', label: 'b的实测值五' }
            ]" :key="index">  
              <el-form-item :label="item.label">
                <span>{{ initialData[item.key] || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
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