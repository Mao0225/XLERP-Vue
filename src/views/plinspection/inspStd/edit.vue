<!-- src/views/plinspection/inspStandard/EditDialog.vue -->
<template>
  <el-dialog
    title="编辑检验标准"
    v-model="visible"
    width="1000px"
    @closed="reset"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-card header="标准信息" class="section-card">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准编号">
              <el-input v-model="form.std.standardNo" disabled />
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
          <el-table-column label="最小值" width="120">
            <template #default="{ row }">
              <el-input v-model.number="row.minValue" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="最大值" width="120">
            <template #default="{ row }">
              <el-input v-model.number="row.maxValue" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="标准值" width="150">
            <template #default="{ row }">
              <el-input v-model="row.standardValue" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row.memo" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row, $index }">
              <el-button type="primary" size="small" @click="saveItem(row)">保存</el-button>
              <el-button type="danger" size="small" @click="deleteItem(row, $index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveStd">保存标准</el-button>
    </template>

    <item-selector-dialog
      v-model="selectorVisible"
      @confirm="handleItemsSelected"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getInspStandardAndItem,
  updateInspStandard
} from '@/api/plinspection/inspStd'
import {
  saveInspStandardItem,
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

const loadData = async () => {
  if (!props.row?.id) return
  try {
    const res = await getInspStandardAndItem({ stdId: props.row.id })
    const { std, items } = res.data.record
    Object.assign(form.std, std)
    form.items = items.map(i => ({
      ...i,
      _origin: { ...i }
    }))
  } catch (err) {
    ElMessage.error('加载失败')
  }
}

const handleItemsSelected = (selected) => {
  selected.forEach(item => {
    if (!form.items.some(i => i.inspItemId === item.id)) {
      form.items.push({
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
        _isNew: true
      })
    }
  })
}

const saveItem = async (row) => {
  try {
    if (row._isNew) {
      delete row._isNew
      delete row._origin
      await saveInspStandardItem(row)
    } else if (hasChanged(row)) {
      await updateInspStandardItem(row)
    }
    ElMessage.success('保存成功')
    row._origin = { ...row }
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

const hasChanged = (row) => {
  const o = row._origin
  return ['minValue', 'maxValue', 'standardValue', 'memo'].some(k => row[k] !== o[k])
}

const deleteItem = async (row, index) => {
  if (!row.id) {
    form.items.splice(index, 1)
    return
  }
  try {
    await deleteInspStandardItem({ id: row.id })
    form.items.splice(index, 1)
    ElMessage.success('删除成功')
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

const saveStd = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
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

const reset = () => {
  formRef.value?.resetFields()
}

// 监听 row 变化
watch(() => props.row, (row) => {
  if (row) loadData()
}, { immediate: true })
</script>

<style scoped>
.section-card { margin-bottom: 20px; }
:deep(.el-dialog__body) { padding: 20px; }
</style>