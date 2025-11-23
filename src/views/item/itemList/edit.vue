<template>
  <el-dialog
    v-model="isOpen"
    title="编辑物料"
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
            <!-- 物料编号禁用，不允许修改 -->
            <el-form-item label="物料编号" prop="no" class="compact-item">
              <el-input 
                v-model="form.no" 
                placeholder="物料编号" 
                clearable 
                disabled 
                size="small"
              />
            </el-form-item>

            <el-form-item label="物料名称" prop="name" class="compact-item">
              <el-input v-model="form.name" placeholder="物料名称" clearable size="small" />
            </el-form-item>

            <!-- 级联选择器（回显已选分类） -->
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



            <el-form-item label="图号" prop="tuzhiNo" class="compact-item">
              <el-input v-model="form.tuzhiNo" readonly placeholder="选择图号" size="small">
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

            
            <!-- 新增：材质字段 -->
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
            
            <!-- 新增：执行标准字段 -->
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
import { updateBasItem } from '@/api/item/basitem' // 仅引入编辑接口
import TuzhiSelectDialog from '../components/tuzhiSelector.vue'

// ---------- 外部参数（纯编辑必需） ----------
const props = defineProps({
  modelValue: { type: Boolean, default: false }, // 控制弹窗显示
  unitOptions: { type: Array, default: () => [] }, // 单位选项
  initialData: { // 父组件传入的编辑初始化数据（必传，含id、classId等）
    type: Object,
    required: true,
    default: () => ({})
  }
})

// ---------- 事件派发（保持两个核心事件） ----------
const emit = defineEmits(['update:modelValue', 'success'])

// ---------- 内部状态 ----------
const formRef = ref(null)
// v-model双向绑定
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const cascaderOptions = ref([])
const cascaderValue = ref([]) // 级联回显值：[一级ID, 二级ID, 三级ID]

const tuzhiDialogVisible = ref(false)
// ---------- 图号选择（如需保留可留着，不影响核心事件） ----------
const handleOpenDrawing = () => {
  tuzhiDialogVisible.value = true
}

const onTuzhiSelected = (tuzhi) => {
  form.tuzhiNo = tuzhi.tuzhibianhao
  tuzhiDialogVisible.value = false
}
// 级联选择器配置
const cascaderProps = {
  children: 'children',
  label: 'classname',
  value: 'id',
  leaf: (node) => node.type === 3, // 仅允许选择第三级
  showAllLevels: false
}

// ---------- 表单数据（新增material和standard字段，基于initialData初始化） ----------
const form = reactive({
  id: '', // 物料ID（必传）
  no: '', // 物料编号（禁用）
  name: '',
  classId: '', // 第三级分类ID（核心，回显用）
  inclass: '', // 拼接后的分类名称（回显用）
  unit: '',
  spec: '',
  material: '', // 新增：材质
  standard: '', // 新增：执行标准
  tuzhiNo: '',
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
})

// ---------- 表单规则（新增material和standard的验证规则） ----------
const rules = {
  no: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  name: [{ required: true, message: '请输入物料名称', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择三级分类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择计量单位', trigger: 'change' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  // material: [{ required: true, message: '请输入材质', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }], // 新增：材质验证
  // standard: [{ required: true, message: '请输入执行标准', trigger: 'blur' }, { max: 100, message: '不超过100字符', trigger: 'blur' }], // 新增：执行标准验证
  memo: [{ max: 200, message: '不超过200字符', trigger: 'blur' }]
}

// ---------- 数据转换（适配后端嵌套结构） ----------
const transformTreeData = (tree) => {
  return tree.map(node => ({
    id: node.itemClass.id,
    classname: node.itemClass.classname,
    type: node.itemClass.type,
    children: node.children ? transformTreeData(node.children) : []
  }))
}

// ---------- 加载分类数据 + 级联选择器回显 ----------
const loadClassTree = async () => {
  try {
    const res = await getBasItemClassTreeList('')
    cascaderOptions.value = transformTreeData(res.data.list || [])
    
    // 关键：根据initialData中的classId，查找完整三级路径并回显
    if (form.classId) {
      const cascaderPath = findCascaderPath(cascaderOptions.value, form.classId)
      if (cascaderPath.length === 3) {
        cascaderValue.value = cascaderPath // 回显级联选择（如：[234, 263, 266]）
        // 拼接分类名称回显
        const level1 = getLabelByPath(cascaderOptions.value, cascaderPath[0])
        const level2 = getLabelByPath(cascaderOptions.value, cascaderPath[1])
        const level3 = getLabelByPath(cascaderOptions.value, cascaderPath[2])
        form.inclass = `${level1}/${level2}/${level3}`
      }
    }
  } catch (err) {
    ElMessage.error('分类加载失败')
    console.error(err)
  }
}

// ---------- 辅助：根据ID查找分类名称（用于回显） ----------
const getLabelByPath = (nodes, targetId) => {
  for (const node of nodes) {
    if (node.id === targetId) return node.classname
    if (node.children && node.children.length) {
      const label = getLabelByPath(node.children, targetId)
      if (label) return label
    }
  }
  return ''
}

// ---------- 核心：根据第三级classId查找完整路径（用于级联回显） ----------
const findCascaderPath = (tree, targetId, currentPath = []) => {
  for (const node of tree) {
    const newPath = [...currentPath, node.id]
    // 找到目标第三级节点，返回完整路径
    if (node.id === targetId && node.type === 3) {
      return newPath
    }
    // 递归查找子节点
    if (node.children && node.children.length) {
      const result = findCascaderPath(node.children, targetId, newPath)
      if (result.length === 3) {
        return result
      }
    }
  }
  return []
}

// ---------- 级联选择变化（更新classId和分类名称） ----------
const handleCascaderChange = (value) => {
  if (Array.isArray(value) && value.length === 3) {
    form.classId = value[2] // 更新第三级ID
    const level1 = getLabelByPath(cascaderOptions.value, value[0])
    const level2 = getLabelByPath(cascaderOptions.value, value[1])
    const level3 = getLabelByPath(cascaderOptions.value, value[2])
    form.inclass = `${level1}/${level2}/${level3}` // 更新拼接名称
  } else {
    form.classId = ''
    form.inclass = ''
  }
}

// ---------- 提交编辑（仅调用编辑接口，自动携带新增字段） ----------
const submit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await updateBasItem(form) // 仅调用编辑接口，传入含id和新增字段的完整表单
    ElMessage.success('编辑成功')
    emit('success', form) // 触发成功事件，返回更新后的数据
    handleClose() // 关闭弹窗
  } catch (err) {
    const errMsg = err?.message || '编辑失败'
    ElMessage.error(errMsg.includes('validation') ? '请完善必填项' : errMsg)
  }
}

// ---------- 关闭弹窗（重置表单） ----------
const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

// ---------- 重置表单（包含新增字段的重置） ----------
const resetForm = () => {
  formRef.value?.resetFields()
  // 重置为初始空状态
  Object.keys(form).forEach(key => {
    form[key] = key === 'weight' || key === 'planned_price' || key === 'avg_price' ? 0 : ''
  })
  cascaderValue.value = []
}

// ---------- 监听弹窗显示/隐藏 + initialData变化（确保数据同步，包含新增字段） ----------
watch([() => props.modelValue, () => props.initialData], ([isVisible, initialData]) => {
  if (isVisible && initialData.id) {
    // 弹窗打开时，同步父组件传入的最新编辑数据（包含新增字段）
    Object.assign(form, initialData)
    // 兼容旧数据：如果initialData中没有新增字段，设置为空字符串
    if (form.material === undefined) form.material = ''
    if (form.standard === undefined) form.standard = ''
    loadClassTree() // 加载分类并回显级联
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

// ---------- 初始化 ----------
onMounted(() => {
  if (props.modelValue && props.initialData.id) {
    loadClassTree()
  }
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

/* 禁用输入框样式优化 */
.el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  cursor: not-allowed;
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