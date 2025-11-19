<template>
  <CustomDialog
    :visible="dialogVisible"
    title="采购计划详情"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <!-- 主信息表单（全只读） -->
    <el-form
      :model="form"
      ref="formRef"
      label-width="130px"
      class="main-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购计划编号">
            <el-input v-model="form.purchaseOrderNo" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购计划名称">
            <el-input v-model="form.orderName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单人">
            <el-input v-model="form.writer" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单日期">
            <el-input v-model="form.createTime" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="form.memo"
              type="textarea"
              :rows="3"
              readonly
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 材料区域（隐藏编辑/添加按钮，纯展示） -->
    <div class="material-section">
      <div class="section-header">
        <h4 class="section-title">采购材料列表</h4>
        <!-- 隐藏添加材料按钮 -->
      </div>

      <!-- 已确认材料（合并原已确认+待确认，统一展示） -->
      <div v-if="allMaterials.length > 0" class="confirmed-table mb-6">
        <el-table :data="allMaterials" border class="material-table">
          <el-table-column label="序号" type="index" width="80" align="center" fixed="left" />
          <el-table-column label="合同编号" prop="contractNo" width="150" align="center" />
          <el-table-column label="合同名称" prop="contractName" show-overflow-tooltip width="160" />
          <el-table-column label="物料编号" prop="itemNo" show-overflow-tooltip width="150" />
          <el-table-column label="物料名称" prop="itemName" width="160" />
          <el-table-column label="规格型号" prop="itemSpec" show-overflow-tooltip width="140" />
          <el-table-column label="分类" prop="inclass" width="160" />
          <el-table-column label="单位" prop="unit" width="70" />
          <el-table-column label="计划数量" prop="planQuantity" width="90" align="center" />
          <el-table-column label="采购数量" prop="actualQuantity" width="110" align="center" />
          <el-table-column label="执行标准" prop="standard" width="130">
            <template #default="scope">{{ scope.row.standard || '—' }}</template>
          </el-table-column>
          <el-table-column label="材质" prop="material" width="110">
            <template #default="scope">{{ scope.row.material || '—' }}</template>
          </el-table-column>
          <el-table-column label="备注" prop="orderMemo" width="140">
            <template #default="scope">{{ scope.row.orderMemo || '—' }}</template>
          </el-table-column>
          <!-- 隐藏操作列 -->
        </el-table>
      </div>

      <!-- 空状态 -->
      <div v-if="allMaterials.length === 0" class="empty-state">
        <el-empty description="暂无采购材料" />
      </div>
    </div>

    <!-- 底部按钮（仅保留关闭） -->
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>

    <!-- 隐藏材料选择器 -->
    <MaterialSelector
      v-model:visible="isSelectorOpen"
      :default-contract-no="form.contractNo || ''"
      @select="handleMaterialSelect"
      v-show="false"
    />
  </CustomDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 组件
import CustomDialog from '@/components/common/CustomDialog.vue'
import MaterialSelector from './materialSelector.vue'

// 接口
import { getPurchaseOrderMaterialList } from '@/api/plmanage/plpurchaseorder'

// 用户
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  orderInfo: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

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

// 材料列表（合并所有材料，无需区分状态）
const existingMaterials = ref([])
const addedMaterials = ref([])
const pendingMaterials = ref([])

// 合并所有材料为展示列表
const allMaterials = computed(() => {
  return [
    ...addedMaterials.value,
    ...existingMaterials.value,
    ...pendingMaterials.value
  ].map(item => ({
    ...item,
    actualQuantity: item.actualQuantity || item.planQuantity || 0
  }))
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

// ==================== 冗余方法保留（避免报错，无实际功能） ====================
const handleMaterialSelect = () => {}
const startEdit = () => {}
const cancelEdit = () => {}
const saveRow = () => {}
const savePendingRow = () => {}
const removePending = () => {}
const deleteMaterial = () => {}
const handleSubmit = () => {}

// ==================== 关闭 ====================
const handleClose = () => {
  emit('update:modelValue', false)
  isSelectorOpen.value = false
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

.confirmed-table {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

.material-table :deep(.el-input__inner) {
  background-color: #f5f5f5;
  cursor: default;
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