<!-- BasItemForm.vue -->
<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-row :gutter="16">
        <!-- 左侧列 -->
        <el-col :span="12">
          <el-form-item label="物料编号" prop="no">
            <el-input v-model="form.no" placeholder="请输入物料编号" clearable />
          </el-form-item>
          
          <el-form-item label="物料名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入物料名称" clearable />
          </el-form-item>
          
          <el-form-item label="物料类型" prop="type">
            <el-select 
              v-model="form.type" 
              placeholder="请选择物料类型" 
              @change="handleFormTypeChange"
              style="width: 100%"
            >
              <el-option 
                v-for="item in typeLabelOptions" 
                :key="item.id" 
                :label="item.value" 
                :value="item.id" 
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="所属分类" prop="inclass">
            <el-select 
              v-model="form.inclass" 
              placeholder="请选择或输入分类" 
              allow-create 
              filterable 
              :disabled="isInclassDisabled"
              style="width: 100%"
            >
              <el-option 
                v-for="item in filteredInclassOptions" 
                :key="item" 
                :label="item" 
                :value="item" 
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="计量单位" prop="unit">
            <el-select 
              v-model="form.unit" 
              placeholder="请选择或输入单位" 
              allow-create 
              filterable
              style="width: 100%"
            >
              <el-option v-for="item in unitOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="规格型号" prop="spec">
            <el-input v-model="form.spec" placeholder="请输入规格型号" clearable />
          </el-form-item>
          
          <el-form-item label="图号/标准号" prop="drawing_standard_no">
            <el-input v-model="form.drawing_standard_no" placeholder="请选择图号/标准号" readonly>
              <template #append>
                <el-button @click="openDrawingSelectDialog" :icon="Search">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="颜色" prop="color">
            <el-input v-model="form.color" placeholder="请输入颜色" clearable />
          </el-form-item>
          
          <el-form-item label="存放位置" prop="location">
            <el-input v-model="form.location" placeholder="请输入存放位置" clearable />
          </el-form-item>
        </el-col>
        
        <!-- 右侧列 -->
        <el-col :span="12">
          <el-form-item label="物料描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入物料描述" clearable />
          </el-form-item>
          
          <el-form-item label="等级" prop="grade">
            <el-input v-model="form.grade" placeholder="请输入等级" clearable />
          </el-form-item>
          
          <el-form-item label="物料版本" prop="material_version">
            <el-input v-model="form.material_version" placeholder="请输入物料版本" clearable />
          </el-form-item>
          
          <el-form-item label="物料属性" prop="material_attribute">
            <el-input v-model="form.material_attribute" placeholder="请输入物料属性" clearable />
          </el-form-item>
          
          <el-form-item label="辅助属性" prop="auxiliary_attribute">
            <el-input v-model="form.auxiliary_attribute" placeholder="请输入辅助属性" clearable />
          </el-form-item>
          
          <el-form-item label="重量(kg)" prop="weight">
            <el-input-number 
              v-model="form.weight" 
              :precision="2" 
              :step="0.1" 
              :min="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="计划价格" prop="planned_price">
            <el-input-number 
              v-model="form.planned_price" 
              :precision="2" 
              :step="1" 
              :min="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="平均价格" prop="avg_price">
            <el-input-number 
              v-model="form.avg_price" 
              :precision="2" 
              :step="1" 
              :min="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="技术参数" prop="tech_memo">
            <el-input 
              v-model="form.tech_memo" 
              type="textarea" 
              :rows="2"
              placeholder="请输入技术参数" 
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 备注信息占满一行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="memo">
            <el-input 
              v-model="form.memo" 
              type="textarea" 
              :rows="3"
              placeholder="请输入备注信息" 
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
    </template>
  </el-dialog>

  <!-- 选择图纸对话框 -->
  <el-dialog
    title="选择图纸"
    v-model="selectDrawingDialogVisible"
    width="80%"
    :close-on-click-modal="false"
  >
    <basitemtuzhi @selectTuzhi="handleSelectDrawing" />
    <template #footer>
      <el-button @click="selectDrawingDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getBasItemById, createBasItem, updateBasItem } from '@/api/item/basitem'
import basitemtuzhi from './basitemtuzhi.vue'

const props = defineProps({
  visible: Boolean,
  dialogType: String,
  editItemId: Number,
  typeLabelOptions: {
    type: Array,
    default: () => []
  },
  unitOptions: {
    type: Array,
    default: () => []
  },
  rawMaterialInclassOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

// 响应式数据
const dialogVisible = ref(false)
const selectDrawingDialogVisible = ref(false)
const formRef = ref(null)
const loading = ref(false)

const dialogTitle = computed(() => props.dialogType === 'add' ? '新增物料' : '编辑物料')

// 初始表单数据
const initialFormData = {
  id: undefined,
  no: '',
  name: '',
  unit: '',
  spec: '',
  description: '',
  color: '',
  memo: '',
  type: 10,
  weight: 0,
  keeper_rule: '',
  planned_price: 0,
  avg_price: 0,
  location: '',
  tech_memo: '',
  status: 0,
  inclass: '',
  isdelete: 0,
  grade: '',
  material_version: '',
  auxiliary_attribute: '',
  material_attribute: '',
  drawing_standard_no: ''
}

// 表单数据
const form = reactive({ ...initialFormData })

// 动态计算 inclass 选项
const filteredInclassOptions = computed(() => {
  const selectedType = props.typeLabelOptions.find(option => option.id === form.type)
  if (selectedType?.id === 10) {
    return props.rawMaterialInclassOptions
  }
  return selectedType ? [selectedType.value] : []
})

// inclass 是否禁用
const isInclassDisabled = computed(() => form.type !== 10)

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入物料编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入物料名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择物料类型', trigger: 'change' }
  ],
  inclass: [
    { required: true, message: '请选择或输入分类', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  unit: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  spec: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ]
}

// 监听父组件传递的 visible 属性
watch(() => props.visible, async (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.dialogType === 'edit' && props.editItemId) {
    await loadItemData(props.editItemId)
  }
})

// 监听对话框可见性变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 加载物料数据
const loadItemData = async (id) => {
  try {
    loading.value = true
    const res = await getBasItemById({ id })
    Object.assign(form, res.data.basItem)
  } catch (error) {
    console.error('获取物料数据失败:', error)
    ElMessage.error('获取物料数据失败')
  } finally {
    loading.value = false
  }
}

// 处理表单类型变化
const handleFormTypeChange = () => {
  const selectedType = props.typeLabelOptions.find(option => option.id === form.type)
  if (selectedType?.id !== 10) {
    form.inclass = selectedType.value
  } else {
    form.inclass = ''
  }
}

// 打开选择图纸对话框
const openDrawingSelectDialog = () => {
  selectDrawingDialogVisible.value = true
}

// 处理选择图纸
const handleSelectDrawing = (tuzhi) => {
  form.drawing_standard_no = tuzhi.tuzhibianhao
  selectDrawingDialogVisible.value = false
  ElMessage.success(`已选择图纸: ${tuzhi.tuzhimingcheng}`)
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, initialFormData)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true
    
    if (props.dialogType === 'add') {
      await createBasItem(form)
      ElMessage.success('新增成功')
    } else {
      await updateBasItem(form)
      ElMessage.success('修改成功')
    }
    
    dialogVisible.value = false
    emit('refresh')
  } catch (error) {
    console.error('保存物料失败:', error)
    ElMessage.error(error.message || '保存物料失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}
</style>