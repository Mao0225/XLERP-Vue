<!-- src/views/plinspection/inspItem/AddDialog.vue -->
<template>
  <el-dialog
    title="新增检验项目"
    v-model="visible"
    width="700px"
    @closed="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="项目编码" prop="inspItemCode">
        <el-input v-model="form.inspItemCode" placeholder="如 TENSILE" />
      </el-form-item>
      <el-form-item label="项目名称" prop="inspItemName">
        <el-input v-model="form.inspItemName" placeholder="如 抗拉强度" />
      </el-form-item>
      <el-form-item label="输入控件类型" prop="dataType">
        <el-select v-model="form.dataType" placeholder="请选择" style="width: 100%">
          <el-option label="数字 (number)" value="number" />
          <el-option label="文本 (text)" value="text" />
          <el-option label="布尔 (bool)" value="bool" />
          <el-option label="下拉 (select)" value="select" />
          <el-option label="日期 (date)" value="date" />
        </el-select>
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-input v-model="form.unit" placeholder="如 MPa、%（可留空）" />
      </el-form-item>

      <!-- 检验类别：写死4个选项 + 支持自定义输入 -->
      <el-form-item label="检验类别" prop="category">
        <el-select
          v-model="form.category"
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入检验类别"
          style="width: 100%"
        >
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
        <el-input v-model="form.memo" type="textarea" :rows="4" placeholder="检验标准、特殊要求等" />
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
import { createInspItem } from '@/api/plinspection/inspItem'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => visible.value = v)
watch(visible, (v) => emit('update:modelValue', v))

const formRef = ref(null)

// 写死的检验类别选项
const fixedCategoryOptions = [
  { label: '化学成分', value: '化学成分' },
  { label: '力学性能', value: '力学性能' },
  { label: '冲击试验', value: '冲击试验' },
  { label: '外观尺寸', value: '外观尺寸' }
]

const form = reactive({
  inspItemCode: '',
  inspItemName: '',
  dataType: '',
  unit: '',
  category: '',
  status: 1,
  memo: ''
})

const rules = {
  inspItemCode: [
    { required: true, message: '请输入项目编码', trigger: 'blur' },
    { max: 50, message: '不超过50字符', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '仅大写字母、数字、下划线', trigger: 'blur' }
  ],
  inspItemName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { max: 100, message: '不超过100字符', trigger: 'blur' }
  ],
  dataType: [{ required: true, message: '请选择输入类型', trigger: 'change' }],
  category: [
    { required: true, message: '请选择或输入检验类别', trigger: 'blur' },
    { max: 100, message: '不超过100字符', trigger: 'blur' }
  ]
}

// 提交
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await createInspItem(form)
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
  Object.assign(form, {
    inspItemCode: '',
    inspItemName: '',
    dataType: '',
    unit: '',
    category: '',
    status: 1,
    memo: ''
  })
}
</script>

<style scoped>
:deep(.el-dialog__body) { padding: 20px; }
</style>