<!-- src/views/plinspection/inspStandard/AddDialog.vue -->
<template>
  <el-dialog
    title="新增检验标准"
    v-model="visible"
    width="1000px"
    @closed="reset"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-card header="标准信息" class="section-card">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准编号" prop="std.standardNo">
              <el-input v-model="form.std.standardNo" placeholder="如 GB/T 228-2022" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用材料" prop="std.materials">
              <el-input v-model="form.std.materials" placeholder="如 钢板 / 钢带" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="材料牌号">
              <el-input v-model="form.std.matNo" placeholder="多个用逗号分隔" />
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
        <span style="margin-left: 10px; color: #999;">已选择 {{ form.items.length }} 项</span>

        <el-table :data="form.items" border style="margin-top: 15px;" v-if="form.items.length">
          <el-table-column label="编码" prop="inspItemCode" width="100" />
          <el-table-column label="名称" prop="inspItemName" min-width="120" />
          <el-table-column label="类别" prop="category" width="100" />
          <el-table-column label="单位" prop="unit" width="80" />
          <el-table-column label="最小值" width="120">
            <template #default="{ row }">
              <el-input v-model.number="row.minValue" size="small" placeholder="≥" />
            </template>
          </el-table-column>
          <el-table-column label="最大值" width="120">
            <template #default="{ row }">
              <el-input v-model.number="row.maxValue" size="small" placeholder="≤" />
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
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="form.items.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定保存</el-button>
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
import { createStdAndItem } from '@/api/plinspection/inspStd'
import ItemSelectorDialog from '../components/ItemSelectorDialog.vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => visible.value = v)
watch(visible, v => emit('update:modelValue', v))

const formRef = ref()
const selectorVisible = ref(false)

const form = reactive({
  std: {
    standardNo: '',
    materials: '',
    matNo: '',
    memo: '',
    status: 1,
    flag: 0
  },
  items: []
})

const rules = {
  'std.standardNo': [{ required: true, message: '请输入标准编号', trigger: 'blur' }],
  'std.materials': [{ required: true, message: '请输入适用材料', trigger: 'blur' }]
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
        memo: ''
      })
    }
  })
}

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await createStdAndItem(form)
      ElMessage.success('新增成功')
      visible.value = false
      emit('success')
    } catch (err) {
      ElMessage.error(err.message || '新增失败')
    }
  })
}

const reset = () => {
  formRef.value?.resetFields()
  Object.assign(form.std, {
    standardNo: '',
    materials: '',
    matNo: '',
    memo: '',
    status: 1,
    flag: 0
  })
  form.items = []
}
</script>

<style scoped>
.section-card { margin-bottom: 20px; }
:deep(.el-dialog__body) { padding: 20px; }
</style>