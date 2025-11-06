<template>
  <el-dialog
    title="编辑检验标准"
    v-model="visible"
    width="60%"
    @closed="onDialogClosed"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-card header="标准信息" class="section-card">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准编号">
              <el-input v-model="form.std.standardNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用材料" prop="std.materials">
              <el-input v-model="form.std.materials" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="材料牌号">
              <el-input v-model="form.std.matNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.std.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.std.memo" type="textarea" :rows="2" />
        </el-form-item>
      </el-card>

      <el-card header="检验项目明细" class="section-card">
        <el-button type="primary" size="small" @click="selectorVisible = true">
          增加检验项
        </el-button>

        <el-table :data="form.items" border style="margin-top: 15px;">
          <el-table-column label="编码" prop="inspItemCode" width="100" />
          <el-table-column label="名称" prop="inspItemName" min-width="120" />
          <el-table-column label="类别" prop="category" width="100" />
          <el-table-column label="单位" prop="unit" width="80" />

          <!-- 最小值 -->
          <el-table-column label="最小值" width="120">
            <template #default="{ row }">
              <el-input
                v-model.number="row.minValue"
                size="small"
                type="number"
                step="any"
                placeholder="如 0.01"
                :disabled="!row._editing"
                @input="onMinMaxChange(row)"
              />
            </template>
          </el-table-column>

          <!-- 最大值 -->
          <el-table-column label="最大值" width="120">
            <template #default="{ row }">
              <el-input
                v-model.number="row.maxValue"
                size="small"
                type="number"
                step="any"
                placeholder="如 99.99"
                :disabled="!row._editing"
                @input="onMinMaxChange(row)"
              />
            </template>
          </el-table-column>

          <!-- 标准值：只读 + 可编辑 -->
          <el-table-column label="标准值" width="200">
            <template #default="{ row }">
              <div v-if="!row._editing" class="standard-display">
                {{ row.standardValue || '—' }}
              </div>
              <el-input
                v-else
                v-model="row.standardValue"
                size="small"
                :placeholder="请输入标准值"
              />
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="120">
            <template #default="{ row }">
              <el-input
                v-model="row.memo"
                size="small"
                :disabled="!row._editing"
              />
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row, $index }">
              <el-button
                v-if="!row._editing"
                type="primary"
                size="small"
                @click="startEdit(row)"
              >
                编辑
              </el-button>
              <template v-else>
                <el-button type="success" size="small" @click="saveItem(row)">
                  保存
                </el-button>
                <el-button size="small" @click="cancelEdit(row, $index)">
                  取消
                </el-button>
              </template>
              <el-button
                type="danger"
                size="small"
                @click="deleteItem(row, $index)"
                :disabled="row._editing"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="tryClose">取消</el-button>
      <el-button type="primary" @click="saveStd">保存标准</el-button>
    </template>

    <item-selector-dialog
      v-model="selectorVisible"
      :exclude-ids="existingItemIds"
      @confirm="handleItemsSelected"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getInspStandardAndItem,
  updateInspStandard
} from '@/api/plinspection/inspStd'
import {
  saveInspStandardItem, // 导入新增接口
  updateInspStandardItem,
  deleteInspStandardItem
} from '@/api/plinspection/inspStdItem'
import ItemSelectorDialog from '../components/ItemSelectorDialog.vue'
const props = defineProps({
  modelValue: Boolean,
  row: Object
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => visible.value = v)
watch(visible, v => emit('update:modelValue', v))

const formRef = ref()
const selectorVisible = ref(false)
const form = reactive({ std: {}, items: [] })
const rules = { 'std.materials': [{ required: true, message: '请输入适用材料' }] }

// 记录是否有未保存的编辑
const hasUnsavedChanges = ref(false)

// 已存在的检验项ID列表（用于排除）
const existingItemIds = computed(() => 
  form.items.map(i => i.inspItemId).filter(Boolean)
)

/**
 * 生成标准值（自动模式）
 * 规则：只有最小值 → ≥1%，只有最大值 → ≤2%，都有 → 1%~2%
 */
const generateStandardValue = (row) => {
  const min = row.minValue
  const max = row.maxValue
  const unit = row.unit || ''

  // 处理空值和空字符串的情况
  const hasMin = min !== null && min !== undefined && min !== ''
  const hasMax = max !== null && max !== undefined && max !== ''

  if (!hasMin && !hasMax) return ''
  if (hasMin && !hasMax) return `≥ ${min}${unit}`
  if (!hasMin && hasMax) return `≤ ${max}${unit}`
  if (hasMin && hasMax) return `${min}${unit} ~ ${max}${unit}`
  return ''
}

/**
 * min/max 变化时触发（自动模式下更新标准值）
 */
const onMinMaxChange = (row) => {
    row.standardValue = generateStandardValue(row)
}

/**
 * 开始编辑
 */
const startEdit = (row) => {
  row._editing = true
  row._backup = { ...row }
  hasUnsavedChanges.value = true
}

/**
 * 取消编辑
 */
const cancelEdit = (row, index) => {
  if (row._isNew) {
    // 新增的项目直接删除
    form.items.splice(index, 1)
  } else {
    // 恢复备份数据
    Object.assign(row, row._backup)
    delete row._editing
    delete row._backup
  }
  hasUnsavedChanges.value = form.items.some(r => r._editing)
}

/**
 * 保存单项（核心修改：区分新增/更新）
 */
const saveItem = async (row) => {
  try {
    // 验证核心数据（根据实际需求调整）
    // if (!row.standardValue && (!row.minValue && !row.maxValue)) {
    //   ElMessage.warning('请填写标准值或最小/最大值')
    //   return
    // }

        if (!row.standardValue ) {
      ElMessage.warning('请填写标准值')
      return
    }

    // 准备提交数据
    const saveData = {
      ...row,
      standardId: props.row.id, // 关联标准ID（必传）
      inspItemId: row.inspItemId, // 检验项目基础ID
      inspItemCode: row.inspItemCode,
      inspItemName: row.inspItemName,
      category: row.category,
      unit: row.unit,
      dataType: row.dataType,
      minValue: row.minValue ?? null, // 空值处理为null
      maxValue: row.maxValue ?? null,
      standardValue: row.standardValue || '',
      memo: row.memo || ''
    }

    // 删除临时属性
    delete saveData._editing
    delete saveData._backup
    delete saveData._isNew
    delete saveData._origin

    let response
    // 区分新增和更新：无id则新增，有id则更新
    if (!row.id) {
      // 新增项目：调用保存接口，删掉id字段
      delete saveData.id
      response = await saveInspStandardItem(saveData)
    } else {
      // 已有项目：调用更新接口（需携带id）
      response = await updateInspStandardItem({ ...saveData, id: row.id })
    }

    if (response.success && response.code === 200) {
      // 保存成功后更新行数据（关键：保存新增项目的id）
      row.id = response.data || row.id // 新增项目接收返回的id
      row._origin = { ...row } // 更新原始数据备份
      row._isNew = false // 标记为非新增项目
      cleanupEditState(row)
      ElMessage.success(row.id ? '更新成功' : '新增成功')
      hasUnsavedChanges.value = true // 标记有未保存的标准变更
    } else {
      ElMessage.error(response.msg || '保存失败')
    }
  } catch (err) {
    ElMessage.error('保存失败：' + (err.message || '网络异常'))
  }
}

/**
 * 统一清理编辑状态
 */
const cleanupEditState = (row) => {
  delete row._editing
  delete row._backup
  delete row._backupStd
  hasUnsavedChanges.value = form.items.some(r => r._editing)
}

/**
 * 判断数据是否变化
 */
const hasChanged = (row) => {
  const o = row._origin; // 原始数据备份
  // 检查最小值、最大值、标准值、备注是否有变动
  return ['minValue', 'maxValue', 'standardValue', 'memo'].some(k => row[k] !== o[k]);
};

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.row?.id) return
  try {
    const res = await getInspStandardAndItem({ stdId: props.row.id })
    const { std, items } = res.data.record
    Object.assign(form.std, std)
    form.items = items.map(i => ({
      ...i,
      _origin: { ...i },
      _editing: false,
      _isNew: false // 加载的项目标记为非新增
    }))
    hasUnsavedChanges.value = false
  } catch (err) {
    ElMessage.error('加载失败')
  }
}

/**
 * 新增检验项
 */
const handleItemsSelected = (selected) => {
  selected.forEach(item => {
    if (!form.items.some(i => i.inspItemId === item.id)) {
      const newItem = {
        inspItemId: item.id,
        inspItemCode: item.inspItemCode,
        inspItemName: item.inspItemName,
        category: item.category,
        unit: item.unit,
        dataType: item.dataType,
        minValue: null,
        maxValue: null,
        standardValue: '',
        memo: '',
        standardId: props.row.id,
        _isNew: true, // 标记为新增项目
        _editing: true,
        _backup: {},
        id: '' // 新增项目初始id为空
      }
      form.items.push(newItem)
    }
  })
  hasUnsavedChanges.value = true
}

/**
 * 删除
 */
const deleteItem = async (row, index) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除检验项"${row.inspItemName}"吗？`,
      '删除确认',
      { type: 'warning' }
    )
    
    if (!row.id) {
      // 未保存的新项目直接删除
      form.items.splice(index, 1)
      ElMessage.success('已移除')
      return
    }
    
    // 已保存的项目调用删除接口
    await deleteInspStandardItem({ id: row.id })
    form.items.splice(index, 1)
    ElMessage.success('删除成功')
    hasUnsavedChanges.value = true
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 保存标准
 */
const saveStd = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    
    // 检查是否有正在编辑的项目
    const editingItems = form.items.filter(i => i._editing)
    if (editingItems.length > 0) {
      ElMessage.warning(`还有 ${editingItems.length} 个检验项正在编辑中，请先保存或取消`)
      return
    }
    
    try {
      await updateInspStandard(form.std)
      ElMessage.success('标准保存成功')
      visible.value = false
      emit('success')
    } catch (err) {
      ElMessage.error('保存失败')
    }
  })
}

/**
 * 尝试关闭：有未保存则提示
 */
const tryClose = async () => {
  if (hasUnsavedChanges.value) {
    try {
      await ElMessageBox.confirm(
        '检测到有未保存的修改，是否确认关闭？未保存的数据将丢失。',
        '关闭确认',
        { 
          type: 'warning',
          confirmButtonText: '确认关闭',
          cancelButtonText: '继续编辑'
        }
      )
      visible.value = false
    } catch {
      // 用户取消关闭
    }
  } else {
    visible.value = false
  }
}

const onDialogClosed = () => {
  reset()
}

/**
 * 重置
 */
const reset = () => {
  formRef.value?.resetFields()
  form.items = []
  hasUnsavedChanges.value = false
}

watch(() => props.row, (row) => {
  if (row) loadData()
}, { immediate: true })
</script>

<style scoped>
.section-card { margin-bottom: 20px; }
:deep(.el-dialog__body) { padding: 20px; }
.standard-display {
  font-weight: 500;
  color: #409eff;
  padding: 0 8px;
  line-height: 32px;
}
</style>