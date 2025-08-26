<template>
  <el-dialog
    :model-value="modelValue"
    title="选择物料"
    width="90%"
    @update:modelValue="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="material-selector">
      <el-card class="contract-info-card" shadow="never">
        <template #header>
          <span class="card-title">合同信息</span>
        </template>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form label-width="100px" size="small">
              <el-form-item label="合同编号">
                <span>{{ contractInfo.no }}</span>
              </el-form-item>
              <el-form-item label="合同名称">
                <span>{{ contractInfo.name }}</span>
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
              <el-button type="primary" @click="batchAdd" :disabled="!hasValidMaterials">
                批量添加物料
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="materialList" 
          border 
          size="small" 
          style="width: 100%"
        >
          <el-table-column prop="itemName" label="物料名称" min-width="120" />
          <el-table-column prop="itemSpec" label="规格型号" min-width="100" />
          <el-table-column prop="itemunit" label="单位" width="80" />
          <el-table-column prop="itemnum" label="合同数量" width="100" />
          <el-table-column prop="allocatedOrderAmount" label="已分配数量" width="100" />

          
          <!-- 生产数量输入 -->
          <el-table-column label="生产数量" width="120">
            <template #default="{ row }">
              <el-input 
                v-model.number="row.productionAmount" 
                type="number" 
                :min="0"
                :max="row.itemnum - row.allocatedOrderAmount"
                placeholder="生产数量"
                size="small"
              />
            </template>
          </el-table-column>
          
          <!-- 生产车间选择 -->
          <el-table-column label="生产车间" min-width="200">
            <template #default="{ row }">
              <el-select 
                v-model="row.selectedWorkshops" 
                multiple
                placeholder="选择生产车间"
                size="small"
                style="width: 100%"
              >
                <el-option 
                  v-for="workshop in workshopOptions" 
                  :key="workshop.code" 
                  :label="workshop.name" 
                  :value="workshop.code"
                />
              </el-select>
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
          
          <el-table-column prop="itemmemo" label="合同备注" min-width="100" />
          
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small" 
                @click="openItemCountDetail(row.id)"
              >
                查看分配详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div v-if="materialList.length === 0" class="empty-material">
          <p>暂无物料信息</p>
        </div>
      </el-card>
    </div>
    <ConItemCountDetail
      :visible="showTreeDialog"
      :conItemId="selectedConItemId"
      @update:visible="showTreeDialog = $event"
    />
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getContractInfoByNo } from '@/api/contract/bascontract.js'
import { saveDingdanItem } from '@/api/plmanage/plshengchandingdan'
import ConItemCountDetail from './ConItemCountDetail.vue'
import { getBasDepartmentOptions } from '@/api/system/department'

const props = defineProps({
  contractNo: {
    type: String,
    default: ''
  },
  ipoNo: {
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

const showTreeDialog = ref(false)
const selectedConItemId = ref('') // 从其他地方获取的conItemId

// 示例：点击按钮显示弹窗
const openItemCountDetail = (id) => {
  selectedConItemId.value = id
  showTreeDialog.value = true
}
const emit = defineEmits(['update:modelValue'])

// 合同信息
const contractInfo = ref({
  no: '',
  name: ''
})

// 物料列表
const materialList = ref([])

// 车间数据
const workshopOptions = ref([])

// 获取车间数据
const loadWorkshopData = async () => {
  const res = await getBasDepartmentOptions()
  if (!res.success) {
    ElMessage.error(res.msg)
    return
  }
  
  workshopOptions.value = res.data.options
}

// 是否有有效的物料
const hasValidMaterials = computed(() => {
  return materialList.value.some(row => canAddMaterial(row))
})

// 加载合同物料数据
const loadContractData = async () => {
  if (!props.contractNo) {
    ElMessage.error('未提供合同编号')
    materialList.value = []
    return
  }
  
  try {
    const res = await getContractInfoByNo({ contractNo: props.contractNo })
    const { contractInfo: contract, itemList } = res.data
    
    contractInfo.value.no = contract?.no || ''
    contractInfo.value.name = contract?.name || ''
    
    // 处理物料列表，添加额外字段
    materialList.value = itemList?.map(item => ({
      id: item.id,
      conitemId: item.id, // 合同物料ID
      itemName: item.itemName || '',
      allocatedOrderAmount: item.allocatedOrderAmount || 0,
      itemSpec: item.itemSpec || '',
      itemnum: item.itemnum || 0,
      itemunit: item.itemunit || '',
      itemmemo: item.itemmemo || '',
      // 新增字段
      productionAmount: 0, // 生产数量
      selectedWorkshops: [], // 选中的车间
      memo: '' // 备注
    })) || []
  } catch (error) {
    console.error('加载合同数据失败:', error)
    ElMessage.error('加载合同数据失败')
    materialList.value = []
  }
}

// 检查是否可以添加物料
const canAddMaterial = (row) => {
  return row.productionAmount > 0 && 
         row.selectedWorkshops.length > 0
}

// 重置物料输入字段
const resetMaterialInputs = (row) => {
  row.productionAmount = 0
  row.selectedWorkshops = []
  row.memo = ''
}

// 批量添加物料
const batchAdd = async () => {
  const validMaterials = materialList.value.filter(item => canAddMaterial(item))
  
  if (validMaterials.length === 0) {
    ElMessage.warning('请为物料设置有效的生产数量和生产车间')
    return
  }
  
  try {
    const materialData = validMaterials.map(item => ({
      ipoNo : props.ipoNo,
      conitemId: item.conitemId,
      itemname: item.itemName,
      allocatedOrderAmount: item.allocatedOrderAmount,
      productModel: item.itemSpec,
      amount: item.productionAmount.toString(),
      unit: item.itemunit,
      memo: item.memo,
      workshopName: item.selectedWorkshops.join(',') // 车间编号用逗号分隔
    }))
    
    // 批量保存物料
    for (const material of materialData) {
      await saveDingdanItem(material)
    }
    
    ElMessage.success(`成功添加${validMaterials.length}个物料`)
    
    // 刷新列表以更新已分配数量
    await loadContractData()
    
    // 清空输入
    materialList.value.forEach(resetMaterialInputs)
    
    // 通知父组件
    props.onSelect(validMaterials)
  } catch (error) {
    console.error('批量添加物料失败:', error)
    ElMessage.error('批量添加物料失败')
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:modelValue', false)
}

// 监听弹窗显示状态和合同编号变化
watch(
  () => [props.modelValue, props.contractNo],
  ([newVisible, newContractNo]) => {
    if (newVisible && newContractNo) {
      loadContractData()
      loadWorkshopData()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.material-selector {
  padding: 12px;
}

.contract-info-card,
.material-list-card {
  margin-bottom: 16px;
}

.contract-info-card :deep(.el-card__header),
.material-list-card :deep(.el-card__header) {
  padding: 12px 16px;
  background-color: #f5f7fa;
}

.contract-info-card :deep(.el-card__body),
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