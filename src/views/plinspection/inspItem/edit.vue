<!-- src/views/plinspection/inspItem/EditDialog.vue -->
<template>
  <el-dialog
    title="编辑检验项目"
    v-model="visible"
    width="700px"
    @closed="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="项目编码" prop="inspItemCode">
        <el-input v-model="form.inspItemCode" disabled />
      </el-form-item>
      <el-form-item label="项目名称" prop="inspItemName">
        <el-input v-model="form.inspItemName" />
      </el-form-item>
      <el-form-item label="输入控件类型" prop="dataType">
        <el-select v-model="form.dataType" style="width: 100%">
          <el-option label="数字 (number)" value="number" />
          <el-option label="文本 (text)" value="text" />
          <el-option label="布尔 (bool)" value="bool" />
          <el-option label="下拉 (select)" value="select" />
          <el-option label="日期 (date)" value="date" />
        </el-select>
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-input v-model="form.unit" />
      </el-form-item>
      <el-form-item label="检验类别" prop="category">
        <el-select v-model="form.category" filterable allow-create default-first-option style="width: 100%">
          <el-option
                v-for="item in fixedCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注说明" prop="memo">
        <el-input v-model="form.memo" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getInspItemById, updateInspItem, getInspItemPage } from '@/api/plinspection/inspItem'

const props = defineProps({
  modelValue: Boolean,
  row: Object
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => visible.value = v)
watch(visible, (v) => emit('update:modelValue', v))


const fixedCategoryOptions = [
  { label: '化学成分', value: '化学成分' },
  { label: '力学性能', value: '力学性能' },
  { label: '冲击试验', value: '冲击试验' },
  { label: '外观尺寸', value: '外观尺寸' }
]

const formRef = ref(null)
const form = reactive({
  id: undefined,
  inspItemCode: '',
  inspItemName: '',
  dataType: '',
  unit: '',
  category: '',
  status: 1,
  memo: ''
})

const rules = {
  inspItemName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { max: 100, message: '不超过100字符', trigger: 'blur' }
  ],
  dataType: [{ required: true, message: '请选择输入类型', trigger: 'change' }],
  category: [
    { required: true, message: '请选择或输入类别', trigger: 'blur' },
    { max: 100, message: '不超过100字符', trigger: 'blur' }
  ]
}

// 加载详情
const loadDetail = async () => {
  if (!props.row?.id) return
  try {
    const res = await getInspItemById({ id: props.row.id })
    const data = res.data.inspItem || res.data
    Object.assign(form, data)
  } catch (err) {
    ElMessage.error('加载详情失败')
  }
}


// 提交
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await updateInspItem(form)
      ElMessage.success('修改成功')
      visible.value = false
      emit('success')
    } catch (err) {
      ElMessage.error(err.message || '修改失败')
    }
  })
}

const reset = () => {
  formRef.value?.resetFields()
}

// 监听 row 变化
watch(() => props.row, (row) => {
  if (row) {
    loadDetail()
  }
}, { immediate: true })
</script>

<style scoped>
:deep(.el-dialog__body) { padding: 20px; }
</style>