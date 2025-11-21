<template>
  <!-- 用v-model绑定modelValue，配合update:modelValue事件 -->
  <el-dialog
    v-model="isOpen"
    title="新增物料"
    width="60%"
    append-to-body
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="compact-form">
      <!-- 上半部分：必填信息（卡片包裹） -->
      <el-card shadow="hover" class="required-card">
        <div class="card-header">必填信息</div>
        <el-row :gutter="16" class="required-content">
          <el-col :span="12">
            <el-form-item label="物料编号" prop="no" class="compact-item">
              <el-input v-model="form.no" placeholder="物料编号" clearable size="small" />
            </el-form-item>

            <el-form-item label="物料名称" prop="name" class="compact-item">
              <el-input v-model="form.name" placeholder="物料名称" clearable size="small" />
            </el-form-item>

            <el-form-item label="所属分类" prop="classId" class="compact-item">
              <el-cascader
                v-model="cascaderValue"
                :options="cascaderOptions"
                :props="cascaderProps"
                placeholder="选择三级分类"
                style="width: 100%"
                @change="handleCascaderChange"
                size="small"
              />
            </el-form-item>

          </el-col>

          <el-col :span="12">
            <el-form-item label="规格型号" prop="spec" class="compact-item">
              <el-input v-model="form.spec" placeholder="规格型号" clearable size="small" />
            </el-form-item>



           

            <el-form-item label="图号/标准号" prop="drawing_standard_no" class="compact-item">
              <el-input v-model="form.drawing_standard_no" readonly placeholder="选择图号" size="small">
                <template #append>
                  <el-button :icon="Search" @click="handleOpenDrawing" size="small" />
                </template>
              </el-input>
            </el-form-item>

            
            <el-form-item label="计量单位" prop="unit" class="compact-item">
              <el-select v-model="form.unit" placeholder="选择/输入单位"
                         allow-create filterable style="width:100%" size="small">
                <el-option v-for="it in unitOptions" :key="it" :label="it" :value="it" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 下半部分：补充信息（卡片包裹） -->
      <el-card shadow="hover" class="supplement-card">
        <div class="card-header">补充信息</div>
        <el-row :gutter="16" class="supplement-content">
          <!-- 左侧列 -->
          <el-col :span="12">
                        <el-form-item label="材质" prop="material" class="compact-item">
              <el-input v-model="form.material" placeholder="材质" clearable size="small" />
            </el-form-item>
            <el-form-item label="技术参数" prop="tech_memo" class="compact-item">
              <el-input v-model="form.tech_memo" placeholder="技术参数" size="small" />
            </el-form-item>

            <el-form-item label="物料描述" prop="description" class="compact-item">
              <el-input v-model="form.description" placeholder="物料描述" clearable size="small" />
            </el-form-item>

            <el-form-item label="存放位置" prop="location" class="compact-item">
              <el-input v-model="form.location" placeholder="存放位置" clearable size="small" />
            </el-form-item>

            <el-form-item label="等级" prop="grade" class="compact-item">
              <el-input v-model="form.grade" placeholder="等级" clearable size="small" />
            </el-form-item>
          </el-col>

          <!-- 右侧列 -->
          <el-col :span="12">
             <el-form-item label="执行标准" prop="standard" class="compact-item">
              <el-input v-model="form.standard" placeholder="执行标准" clearable size="small" />
            </el-form-item>
            <el-form-item label="物料属性" prop="material_attribute" class="compact-item">
              <el-input v-model="form.material_attribute" placeholder="物料属性" clearable size="small" />
            </el-form-item>

            <el-form-item label="辅助属性" prop="auxiliary_attribute" class="compact-item">
              <el-input v-model="form.auxiliary_attribute" placeholder="辅助属性" clearable size="small" />
            </el-form-item>

            <el-form-item label="颜色" prop="color" class="compact-item">
              <el-input v-model="form.color" placeholder="颜色" clearable size="small" />
            </el-form-item>

            <el-form-item label="物料版本" prop="material_version" class="compact-item">
              <el-input v-model="form.material_version" placeholder="物料版本" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 数值类字段：横向紧凑排列 -->
        <el-row :gutter="16" class="number-fields">
          <el-col :span="8">
            <el-form-item label="重量(kg)" prop="weight" class="compact-item">
              <el-input-number v-model="form.weight" :precision="2" :step="0.1"
                                :min="0" controls-position="right" size="small" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划价格" prop="planned_price" class="compact-item">
              <el-input-number v-model="form.planned_price" :precision="2" :step="1"
                                :min="0" controls-position="right" size="small" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平均价格" prop="avg_price" class="compact-item">
              <el-input-number v-model="form.avg_price" :precision="2" :step="1"
                                :min="0" controls-position="right" size="small" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 备注信息：压缩行高 -->
        <el-form-item label="备注" prop="memo" class="memo-item">
          <el-input v-model="form.memo" type="textarea" :rows="2" placeholder="备注信息" size="small" />
        </el-form-item>
      </el-card>

      <!-- 弹窗底部按钮：紧凑排列 -->
      <div class="dialog-footer">
        <el-button @click="handleClose" size="small">取消</el-button>
        <el-button type="primary" @click="submit" size="small">确定</el-button>
      </div>
    </el-form>
  </el-dialog>

  <TuzhiSelectDialog
    v-model="tuzhiDialogVisible"
    @select="onTuzhiSelected"
    @close="tuzhiDialogVisible=false"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'
import { createBasItem } from '@/api/item/basitem'
import TuzhiSelectDialog from '../components/tuzhiSelector.vue'

// ---------- 外部参数（只保留必需） ----------
const props = defineProps({
  modelValue: { type: Boolean, default: false }, // 弹窗显示控制（v-model绑定）
  unitOptions: { type: Array, default: () => [] } // 单位选项
})

// ---------- 事件派发（只保留两个核心事件） ----------
const emit = defineEmits(['update:modelValue', 'success'])

// ---------- 内部状态 ----------
const formRef = ref(null)
// 关联modelValue，实现v-model双向绑定
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val) // 触发更新事件
})
const cascaderOptions = ref([])
const cascaderValue = ref([])
const tuzhiDialogVisible = ref(false)
// 级联选择器配置
const cascaderProps = {
  children: 'children',
  label: 'classname',
  value: 'id',
  leaf: (node) => node.type === 3, // 仅允许选择第三级
  showAllLevels: false
}

// ---------- 图号选择（如需保留可留着，不影响核心事件） ----------
const handleOpenDrawing = () => {
  tuzhiDialogVisible.value = true
}

const onTuzhiSelected = (tuzhi) => {
  form.drawing_standard_no = tuzhi.tuzhibianhao
  tuzhiDialogVisible.value = false
}

// ---------- 表单数据（新增material和standard字段） ----------
const initialForm = {
  no: '',
  name: '',
  classId: '', // 存储第三级分类ID（核心）
  inclass: '', // 显示拼接后的分类名称
  unit: '',
  spec: '',
  material: '', // 新增：材质
  standard: '', // 新增：执行标准
  drawing_standard_no: '',
  color: '',
  location: '',
  description: '',
  grade: '',
  material_version: '',
  material_attribute: '',
  auxiliary_attribute: '',
  weight: 0,
  planned_price: 0,
  avg_price: 0,
  tech_memo: '',
  memo: '',
  status: 0,
  isdelete: 0,
  keeper_rule: ''
}

const form = reactive({ ...initialForm })

// ---------- 表单规则（新增material和standard的验证规则） ----------
const rules = {
  no: [{ required: true, message: '请输入物料编号', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  name: [{ required: true, message: '请输入物料名称', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择三级分类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择计量单位', trigger: 'change' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  // material: [{ required: true, message: '请输入材质', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }], // 新增：材质验证
  // standard: [{ required: true, message: '请输入执行标准', trigger: 'blur' }, { max: 100, message: '不超过100字符', trigger: 'blur' }], // 新增：执行标准验证
  memo: [{ max: 200, message: '不超过200字符', trigger: 'blur' }]
}

// ---------- 数据转换 ----------
const transformTreeData = (tree) => {
  return tree.map(node => ({
    id: node.itemClass.id,
    classname: node.itemClass.classname,
    type: node.itemClass.type,
    children: node.children ? transformTreeData(node.children) : []
  }))
}

// ---------- 加载分类数据 ----------
const loadClassTree = async () => {
  try {
    const res = await getBasItemClassTreeList('')
    cascaderOptions.value = transformTreeData(res.data.list || [])
  } catch (err) {
    ElMessage.error('分类加载失败')
    console.error(err)
  }
}

// ---------- 级联选择变化（确保classId赋值） ----------
const handleCascaderChange = (value) => {
  if (Array.isArray(value) && value.length === 3) {
    form.classId = value[2] // 存储第三级ID
    // 拼接分类名称
    const getLabel = (nodes, targetId) => {
      for (const node of nodes) {
        if (node.id === targetId) return node.classname
        if (node.children && node.children.length) {
          const label = getLabel(node.children, targetId)
          if (label) return label
        }
      }
      return ''
    }
    const level1 = getLabel(cascaderOptions.value, value[0])
    const level2 = getLabel(cascaderOptions.value, value[1])
    const level3 = getLabel(cascaderOptions.value, value[2])
    form.inclass = `${level1}/${level2}/${level3}`
  } else {
    form.classId = ''
    form.inclass = ''
  }
}

// ---------- 提交表单（触发success事件，自动携带新增字段） ----------
const submit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await createBasItem(form) // 新增字段自动提交到后端
    ElMessage.success('新增成功')
    emit('success', form) // 新增成功，触发success事件，返回包含新字段的表单数据
    handleClose() // 关闭弹窗
  } catch (err) {
    const errMsg = err?.message || '新增失败'
    ElMessage.error(errMsg.includes('validation') ? '请完善必填项' : errMsg)
  }
}

// ---------- 关闭弹窗（触发update:modelValue事件） ----------
const handleClose = () => {
  emit('update:modelValue', false) // 通知父组件关闭弹窗
  resetForm() // 重置表单
}

// ---------- 重置表单（新增字段的重置） ----------
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, initialForm) // 直接使用初始表单重置，包含新增字段
  cascaderValue.value = []
}

// ---------- 监听弹窗显示状态，加载分类数据 ----------
watch(() => props.modelValue, (newVal) => {
  if (newVal) loadClassTree()
}, { immediate: true })

// ---------- 初始化 ----------
onMounted(() => {
  props.modelValue && loadClassTree()
})
</script>
<style scoped>
/* 紧凑表单基础样式 */
.compact-form {
  width: 100%;
}

/* 表单项紧凑样式 */
.compact-item {
  margin-bottom: 8px !important; /* 大幅减小表单项间距 */
}

.el-input-number,
.el-select,
.el-cascader,
.el-input {
  width: 100%;
}

/* 卡片样式优化：减小内边距 */
.el-card {
  border-radius: 6px;
  margin-bottom: 12px; /* 减小卡片间距 */
  overflow: hidden;
  border: 1px solid #e8f4f8;
}

/* 卡片标题：紧凑样式 */
.card-header {
  font-size: 14px;
  font-weight: 600;
  color: #1989fa;
  padding: 8px 16px; /* 减小标题内边距 */
  background-color: #f5fafe;
  border-bottom: 1px solid #e8f4f8;
  margin-bottom: 8px;
}

/* 卡片内容：减小内边距 */
.required-content,
.supplement-content {
  padding: 12px 16px; /* 减小内容内边距 */
}

/* 数值字段行：紧凑布局 */
.number-fields {
  padding: 0 16px 8px;
}

/* 备注项：紧凑样式 */
.memo-item {
  margin: 8px 16px 12px !important;
}

/* 底部按钮区域：紧凑排列 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* 减小按钮间距 */
  padding: 12px 0 0;
  border-top: 1px solid #f0f2f5;
  margin-top: 4px;
}

/* 级联选择器优化 */
.el-cascader-panel .el-cascader-node__label {
  white-space: nowrap;
  font-size: 13px;
}

/* 输入框占位符样式优化 */
.el-input__placeholder,
.el-select__placeholder,
.el-cascader__placeholder {
  font-size: 12px !important;
}

/* 响应式适配：保持紧凑 */
@media (max-width: 768px) {
  .required-content .el-col,
  .supplement-content .el-col,
  .number-fields .el-col {
    span: 24 !important;
    margin-bottom: 4px;
  }

  .el-dialog {
    width: 98% !important;
  }

  .compact-item {
    margin-bottom: 6px !important;
  }
}

/* 优化hover效果，不增加额外空间 */
.el-input:hover,
.el-select:hover,
.el-cascader:hover,
.el-input-number:hover {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.1);
}
</style>