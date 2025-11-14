<template>
  <CustomDialog
    :visible="dialogVisible"
    title="编辑采购计划"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <!-- 主信息表单 -->
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="130px"
      class="main-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购计划编号" prop="purchaseOrderNo">
            <el-input v-model="form.purchaseOrderNo" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购计划名称" prop="orderName">
            <el-input v-model="form.orderName" placeholder="请输入采购计划名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单人" prop="writer">
            <el-input v-model="form.writer" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单日期">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              :disabled-date="disabledDate"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input
              v-model="form.memo"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 材料区域 -->
    <div class="material-section">
      <div class="section-header">
        <h4 class="section-title">采购材料列表</h4>
        <el-button type="primary" size="small" @click="openMaterialSelector">
          <el-icon><Plus /></el-icon>
          添加材料
        </el-button>
      </div>

      <!-- 已确认材料 -->
      <div v-if="confirmedMaterials.length > 0" class="confirmed-table mb-6">
        <h5 class="mb-3 text-sm font-medium text-gray-700">已确认材料</h5>
        <el-table :data="confirmedMaterials" border class="material-table">
          <el-table-column label="序号" type="index" width="80" align="center" fixed="left" />
          <el-table-column label="合同编号" prop="contractNo" width="150" align="center" />
          <el-table-column label="合同名称" prop="contractName" show-overflow-tooltip width="160" />
          <el-table-column label="物料编号" prop="itemNo" show-overflow-tooltip width="150" />
          <el-table-column label="物料名称" prop="itemName" width="160" />
          <el-table-column label="规格型号" prop="itemSpec" show-overflow-tooltip width="140" />
                    <el-table-column label="分类" prop="inclass" width="160" />

          <el-table-column label="单位" prop="unit" width="70" />
          <el-table-column label="计划数量" prop="planQuantity" width="90" align="center" />
          <el-table-column label="采购数量" width="110">
            <template #default="scope">
              <el-input-number
                v-if="editingRow === scope.row.id"
                v-model="scope.row.actualQuantity"
                :min="0"
                :precision="2"
                size="small"
                style="width: 100%"
              />
              <span v-else>{{ scope.row.actualQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行标准" width="130">
            <template #default="scope">
              <el-input
                v-if="editingRow === scope.row.id"
                v-model="scope.row.standard"
                placeholder="请输入"
                size="small"
              />
              <span v-else>{{ scope.row.standard || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质" width="110">
            <template #default="scope">
              <el-input
                v-if="editingRow === scope.row.id"
                v-model="scope.row.material"
                placeholder="请输入"
                size="small"
              />
              <span v-else>{{ scope.row.material || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="140">
            <template #default="scope">
              <el-input
                v-if="editingRow === scope.row.id"
                v-model="scope.row.orderMemo"
                placeholder="请输入"
                size="small"
              />
              <span v-else>{{ scope.row.orderMemo || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="scope">
              <template v-if="editingRow === scope.row.id">
                <el-button type="primary" size="small" @click="saveRow(scope.row)">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </template>
              <template v-else>
                <el-button size="small" @click="startEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteMaterial(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 待确认材料 -->
      <div v-if="pendingMaterials.length > 0" class="pending-table">
        <h5 class="mb-3 text-sm font-medium text-gray-700">待确认材料（点击保存加入上方）</h5>
        <el-table :data="pendingMaterials" border class="material-table">
            <el-table-column label="序号" type="index" width="80" align="center"  fixed="left" />
            <el-table-column label="合同编号" prop="contractNo" width="150" align="center" />
            <el-table-column label="合同名称" prop="contractName" show-overflow-tooltip width="160" />
          <el-table-column label="物料编号" prop="itemNo" show-overflow-tooltip width="110" />
          <el-table-column label="物料名称" prop="itemName" width="160" />
          <el-table-column label="规格型号" prop="itemSpec" show-overflow-tooltip width="140" />
          <el-table-column label="分类" prop="inclass" width="160" />
          <el-table-column label="单位" prop="unit" width="70" />
          <el-table-column label="计划数量" prop="planQuantity" width="90" align="center" />
          <el-table-column label="采购数量" width="110">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.actualQuantity"
                :min="0"
                :precision="2"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="执行标准" width="130">
            <template #default="scope">
              <el-input v-model="scope.row.standard" placeholder="请输入" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="材质" width="110">
            <template #default="scope">
              <el-input v-model="scope.row.material" placeholder="请输入" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="备注" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.orderMemo" placeholder="请输入" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="savePendingRow(scope.row)">保存</el-button>
              <el-button type="danger" size="small" @click="removePending(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 空状态 -->
      <div v-if="confirmedMaterials.length === 0 && pendingMaterials.length === 0" class="empty-state">
        <el-empty description="暂无采购材料">
          <el-button type="primary" @click="openMaterialSelector">
            <el-icon><Plus /></el-icon>
            去添加
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认保存
      </el-button>
    </template>

    <!-- 材料选择器 -->
    <MaterialSelector
      v-model:visible="isSelectorOpen"
      :default-contract-no="form.contractNo || ''"
      @select="handleMaterialSelect"
    />
  </CustomDialog>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 组件
import CustomDialog from '@/components/common/CustomDialog.vue'
import MaterialSelector from './materialSelector.vue'

// 接口
import { getPurchaseOrderMaterialList, updatePurchaseOrder } from '@/api/plmanage/plpurchaseorder'
import { updateContractMaterial } from '@/api/contract/bascontractmaterial'

// 用户
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  orderInfo: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'success'])

// ==================== 状态 ====================
const dialogVisible = ref(props.modelValue)
const isFullscreen = ref(true)
const isSelectorOpen = ref(false)
const loading = ref(false)

const formRef = ref(null)
const form = ref({
  id: '',
  purchaseOrderNo: '',
  orderName: '',
  writer: '',
  createTime: '',
  status: 1,
  memo: ''
})

const rules = {
  orderName: [{ required: true, message: '采购计划名称不能为空', trigger: 'blur' }]
}

const disabledDate = (time) => time.getTime() > Date.now()

// 材料列表
const existingMaterials = ref([])  // 已有材料（已持久化）
const addedMaterials = ref([])     // 新增材料（已确认但未持久化）
const pendingMaterials = ref([])   // 待确认
const editingRow = ref(null)
const editingBackup = ref({})

// 新增在前，已有在后
const confirmedMaterials = computed(() => {
  return [...addedMaterials.value, ...existingMaterials.value]
})

// ==================== 监听 modelValue ====================
watch(
  () => props.modelValue,
  async (val) => {
    dialogVisible.value = val
    if (val && props.orderInfo?.purchaseOrderNo) {
      await loadOrderData()
    }
  },
  { immediate: true }
)

// ==================== 加载数据 ====================
const loadOrderData = async () => {
  const { id, purchaseOrderNo, orderName, writer, createTime, memo } = props.orderInfo
  form.value = {
    id,
    purchaseOrderNo,
    orderName: orderName || '',
    writer: writer || userStore.realName || '',
    createTime: createTime || '',
    memo: memo || ''
  }

  existingMaterials.value = []
  addedMaterials.value = []
  pendingMaterials.value = []
  editingRow.value = null

  try {
    const res = await getPurchaseOrderMaterialList({ purchaseOrderNo })
    if (res.success && res.code === 200) {
      existingMaterials.value = (res.data?.record || []).map(item => ({
        ...item,
        actualQuantity: item.actualQuantity || item.planQuantity || 0,
        isNew: false
      }))
    }
  } catch (err) {
    ElMessage.error('加载材料列表失败')
    console.error(err)
  }
}

// ==================== 材料选择器 ====================
const openMaterialSelector = () => {
  isSelectorOpen.value = true
}

const handleMaterialSelect = (selected) => {
  if (!Array.isArray(selected) || selected.length === 0) return

  const existingIds = new Set(confirmedMaterials.value.map(m => m.id))
  const newItems = selected.filter(m => !existingIds.has(m.id))

  if (newItems.length === 0) {
    ElMessage.info('所选材料已存在')
    return
  }

  const initItems = newItems.map(m => ({
    ...m,
    // id:,
    standard: '',
    material: '',
    actualQuantity: m.planQuantity || 0,
    orderMemo: '',
    isNew: true
  }))

  pendingMaterials.value = [...pendingMaterials.value, ...initItems]
  ElMessage.success(`已添加 ${initItems.length} 种材料，请填写后保存`)
}

// ==================== 行编辑 ====================
const startEdit = (row) => {
  editingBackup.value = { ...row }
  editingRow.value = row.id
}

const cancelEdit = () => {
  const index = confirmedMaterials.value.findIndex(r => r.id === editingRow.value)
  if (index > -1) {
    Object.assign(confirmedMaterials.value[index], editingBackup.value)
  }
  editingRow.value = null
  editingBackup.value = {}
}

const saveRow = async (row) => {
  if (!row.actualQuantity || row.actualQuantity <= 0) {
    ElMessage.warning('采购数量不能为0')
    return
  }

  try {
    const params = {
      id: row.id,
      purchaseOrderNo: form.value.purchaseOrderNo,
      standard: row.standard || '',
      material: row.material || '',
      actualQuantity: row.actualQuantity,
      orderMemo: row.orderMemo || '',
      contractNo: row.contractNo,
      itemId: row.itemId
    }

    const res = await updateContractMaterial(params)
    if (res.success) {
      ElMessage.success('保存成功')
      editingRow.value = null
      editingBackup.value = {}
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (err) {
    ElMessage.error('网络错误')
  }
}

// ==================== 待确认保存（插入到最前面） ====================
const savePendingRow = async (row) => {
  if (!row.actualQuantity || row.actualQuantity <= 0) {
    ElMessage.warning('请填写采购数量')
    return
  }

  try {
    const params = {
      id: row.id,
      purchaseOrderNo: form.value.purchaseOrderNo,
      standard: row.standard || '',
      material: row.material || '',
      actualQuantity: row.actualQuantity,
      orderMemo: row.orderMemo || '',
      contractNo: row.contractNo,
      itemId: row.itemId
    }

    const res = await updateContractMaterial(params)
    if (res.success) {
      const confirmedItem = {
        ...row,
        isNew: true,
        purchaseOrderNo: form.value.purchaseOrderNo
      }

      addedMaterials.value.unshift(confirmedItem) // 插入到最前面
      pendingMaterials.value = pendingMaterials.value.filter(r => r.id !== row.id)

      ElMessage.success('已确认材料')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (err) {
    ElMessage.error('网络错误')
  }
}

const removePending = (index) => {
  pendingMaterials.value.splice(index, 1)
}

// ==================== 删除：清空字段 + 调用接口 + 移除 ====================
const deleteMaterial = async (row) => {
  ElMessageBox.confirm('确定将此材料从采购计划中移除？（将清空采购信息）', '提示', { 
    type: 'warning' 
  }).then(async () => {
    try {
      const params = {
        id: row.id,
        purchaseOrderNo: '',
        actualQuantity: 0,
        standard: '',
        material: '',
        orderMemo: '',
        contractNo: row.contractNo,
        itemId: row.itemId
      }

      const res = await updateContractMaterial(params)
      if (res.success) {
        // 前端同步移除
        if (row.isNew) {
          addedMaterials.value = addedMaterials.value.filter(r => r.id !== row.id)
        } else {
          existingMaterials.value = existingMaterials.value.filter(r => r.id !== row.id)
        }

        ElMessage.success('已从采购计划中移除')
      } else {
        ElMessage.error(res.msg || '移除失败')
      }
    } catch (err) {
      ElMessage.error('网络错误')
    }
  }).catch(() => {})
}

// ==================== 关闭 ====================
const handleClose = () => {
  emit('update:modelValue', false)
  editingRow.value = null
  isSelectorOpen.value = false
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    if (confirmedMaterials.value.length === 0) {
      ElMessage.warning('请至少保留一种采购材料')
      return
    }

    loading.value = true

    // 1. 更新主表
    const updateRes = await updatePurchaseOrder(form.value)
    if (!updateRes.success) {
      ElMessage.error(updateRes.msg || '更新失败')
      return
    }

    // 2. 更新所有新增材料（仅未持久化的）
    const failList = []
    for (const item of addedMaterials.value) {
      if (!item.isNew) continue

      const params = {
        id: item.id,
        purchaseOrderNo: form.value.purchaseOrderNo,
        standard: item.standard || '',
        material: item.material || '',
        actualQuantity: item.actualQuantity,
        orderMemo: item.orderMemo || '',
        contractNo: item.contractNo,
        itemId: item.itemId
      }
      try {
        const res = await updateContractMaterial(params)
        if (!res.success) failList.push(item.itemName)
      } catch {
        failList.push(item.itemName)
      }
    }

    if (failList.length === 0) {
      ElMessage.success('采购计划更新成功！')
      emit('success')
      handleClose()
    } else {
      ElMessage.warning(`主表更新成功，但 ${failList.length} 项新增材料保存失败`)
    }
  } catch (err) {
    ElMessage.error('表单校验失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.main-form {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.material-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.confirmed-table,
.pending-table {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

.pending-table {
  margin-top: 16px;
  border-style: dotted;
  background: #fff8f0;
}

.material-table :deep(.el-input__inner),
.material-table :deep(.el-input-number) {
  height: 32px;
  font-size: 13px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #909399;
}

@media (max-width: 768px) {
  .main-form,
  .material-section {
    padding: 16px;
  }
}
</style>