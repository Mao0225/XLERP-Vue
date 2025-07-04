<template>
  <el-dialog
    :model-value="modelValue"
    title="选择物料"
    width="90%"
    @update:modelValue="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="material-selector">
      <el-card class="order-info-card" shadow="never">
        <template #header>
          <span class="card-title">生产订单信息</span>
        </template>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form label-width="100px" size="small">
              <el-form-item label="订单编号">
                <span>{{ orderInfo.ipoNo }}</span>
              </el-form-item>
              <el-form-item label="工单编号">
                <span>{{ woNo }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="material-list-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">物料信息</span>
            <div class="action-buttons">
              <el-button type="primary" @click="batchAdd" :disabled="!hasSelection">
                批量添加选中物料
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="materialList" 
          border 
          size="small" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="itemname" label="物料名称" min-width="120" />
          <el-table-column prop="productModel" label="规格型号" min-width="100" />
          <el-table-column prop="unit" label="单位" width="80" />
          <el-table-column prop="amount" label="订单数量" width="100" />
          
          <!-- 生产数量输入 -->
          <el-table-column label="生产数量" width="120">
            <template #default="{ row }">
              <el-input 
                v-model.number="row.productionAmount" 
                type="number" 
                placeholder="生产数量"
                size="small"
                :min="0"
                :max="row.amount"
                @change="validateProductionAmount(row)"
              />
            </template>
          </el-table-column>
          
          <!-- 生产车间（直接显示，不允许修改） -->
          <el-table-column label="生产车间" min-width="150">
            <template #default="{ row }">
              <span>{{ row.workshopName }}</span>
            </template>
          </el-table-column>
          
          <!-- 备注 -->
          <el-table-column label="备注" min-width="150">
            <template #default="{ row }">
              <el-input 
                v-model="row.memo" 
                placeholder="备注信息"
                size="small"
              />
            </template>
          </el-table-column>
          
          <el-table-column prop="originalMemo" label="原始备注" min-width="100" />
          
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small" 
                @click="addSingleMaterial(row)"
                :disabled="!canAddMaterial(row)"
              >
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div v-if="materialList.length === 0" class="empty-material">
          <p>暂无物料信息</p>
        </div>
      </el-card>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getDingdanItemList } from '@/api/plmanage/plshengchandingdan'
import { saveGongdanItem } from '@/api/plmanage/plshengchangongdan'

const props = defineProps({
  ipoNo: {
    type: String,
    default: ''
  },
  woNo: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['update:modelValue'])

// 订单信息
const orderInfo = ref({
  ipoNo: ''
})

// 物料列表
const materialList = ref([])

// 选中的物料
const selectedMaterials = ref([])

// 是否有选中的物料
const hasSelection = computed(() => selectedMaterials.value.length > 0)

// 加载生产订单物料数据
const loadOrderMaterialData = async () => {
  if (!props.ipoNo) {
    ElMessage.error('未提供生产订单编号')
    materialList.value = []
    return
  }
  
  try {
    const res = await getDingdanItemList({ ipoNo: props.ipoNo })
    const itemList = res.data.itemList || []
    
    orderInfo.value.ipoNo = props.ipoNo
    
    // 处理物料列表，添加额外字段
    materialList.value = itemList.map(item => ({
      id: item.id,
      dingdanitemId: item.id, // 订单物料ID
      itemname: item.itemname || '',
      productModel: item.productModel || '',
      amount: item.amount || 0,
      unit: item.unit || '',
      workshopName: item.workshopName || '', // 生产车间直接从订单物料获取
      originalMemo: item.memo || '',
      // 新增字段
      productionAmount: 0, // 生产数量
      memo: '' // 备注
    }))
  } catch (error) {
    console.error('加载生产订单物料数据失败:', error)
    ElMessage.error('加载生产订单物料数据失败')
    materialList.value = []
  }
}

// 验证生产数量
const validateProductionAmount = (row) => {
  if (row.productionAmount > row.amount) {
    ElMessage.warning('生产数量不能超过订单数量')
    row.productionAmount = row.amount
  }
  if (row.productionAmount < 0) {
    row.productionAmount = 0
  }
}

// 检查是否可以添加物料
const canAddMaterial = (row) => {
  return row.productionAmount > 0
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedMaterials.value = selection
}

// 批量添加物料
const batchAdd = async () => {
  if (!hasSelection.value) {
    ElMessage.warning('请选择要添加的物料')
    return
  }
  
  const validMaterials = selectedMaterials.value.filter(item => canAddMaterial(item))
  
  if (validMaterials.length === 0) {
    ElMessage.warning('请为选中的物料设置生产数量')
    return
  }
  
  try {
    const materialData = validMaterials.map(item => ({
      woNo: props.woNo,
      dingdanitemId: item.dingdanitemId,
      itemname: item.itemname,
      productModel: item.productModel,
      amount: item.productionAmount.toString(),
      unit: item.unit,
      memo: item.memo,
      workshopName: item.workshopName
    }))
    
    // 批量保存物料
    for (const material of materialData) {
      await saveGongdanItem(material)
    }
    
    ElMessage.success(`成功添加${validMaterials.length}个物料`)
    props.onSelect(validMaterials)
    handleClose()
  } catch (error) {
    console.error('批量添加物料失败:', error)
    ElMessage.error('批量添加物料失败')
  }
}

// 添加单个物料
const addSingleMaterial = async (row) => {
  if (!canAddMaterial(row)) {
    ElMessage.warning('请设置生产数量')
    return
  }
  
  try {
    const materialData = {
      woNo: props.woNo,
      dingdanitemId: row.dingdanitemId,
      itemname: row.itemname,
      productModel: row.productModel,
      amount: row.productionAmount.toString(),
      unit: row.unit,
      memo: row.memo,
      workshopName: row.workshopName
    }
    
    await saveGongdanItem(materialData)
    ElMessage.success('物料添加成功')
    props.onSelect([row])
    handleClose()
  } catch (error) {
    console.error('添加物料失败:', error)
    ElMessage.error('添加物料失败')
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:modelValue', false)
}

// 监听弹窗显示状态和订单编号变化
watch(
  () => [props.modelValue, props.ipoNo],
  ([newVisible, newIpoNo]) => {
    if (newVisible && newIpoNo) {
      loadOrderMaterialData()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.material-selector {
  padding: 12px;
}

.order-info-card,
.material-list-card {
  margin-bottom: 16px;
}

.order-info-card :deep(.el-card__header),
.material-list-card :deep(.el-card__header) {
  padding: 12px 16px;
  background-color: #f5f7fa;
}

.order-info-card :deep(.el-card__body),
.material-list-card :deep(.el-card__body) {
  padding: 16px;
}

.card-title {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.empty-material {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  font-size: 13px;
  color: #666;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.el-input__inner) {
  height: 28px;
  line-height: 28px;
}

:deep(.el-select .el-input__inner) {
  height: 28px;
  line-height: 28px;
}

:deep(.el-button--small) {
  height: 28px;
  padding: 5px 10px;
  font-size: 12px;
}
</style>