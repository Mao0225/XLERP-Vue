<!-- MaterialEditDialog.vue（纯编辑表单） -->
<template>
  <el-dialog
    v-model="isOpen"
    title="编辑物料"
    width="60%"
    append-to-body
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-row :gutter="16">
        <!-- 左侧 -->
        <el-col :span="12">
          <!-- 物料编号禁用，不允许修改 -->
          <el-form-item label="物料编号" prop="no">
            <el-input 
              v-model="form.no" 
              placeholder="物料编号" 
              clearable 
              disabled 
            />
          </el-form-item>

          <el-form-item label="物料名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入物料名称" clearable />
          </el-form-item>

          <!-- 级联选择器（回显已选分类） -->
          <el-form-item label="所属分类" prop="classId">
            <el-cascader
              v-model="cascaderValue"
              :options="cascaderOptions"
              :props="cascaderProps"
              placeholder="请选择三级分类"
              style="width: 100%"
              @change="handleCascaderChange"
            />
          </el-form-item>

          <el-form-item label="计量单位" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择或输入单位"
                       allow-create filterable style="width:100%">
              <el-option v-for="it in unitOptions" :key="it" :label="it" :value="it" />
            </el-select>
          </el-form-item>

          <el-form-item label="规格型号" prop="spec">
            <el-input v-model="form.spec" placeholder="请输入规格型号" clearable />
          </el-form-item>

          <el-form-item label="图号/标准号" prop="drawing_standard_no">
            <el-input v-model="form.drawing_standard_no" readonly placeholder="请选择图号/标准号">
              <template #append>
                <el-button :icon="Search" @click="handleOpenDrawing" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="物料描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入物料描述" clearable />
          </el-form-item>
                    <el-form-item label="技术参数" prop="tech_memo">
            <el-input v-model="form.tech_memo" 
                      placeholder="请输入技术参数" />
          </el-form-item>
        </el-col>

        <!-- 右侧 -->
        <el-col :span="12">


          <el-form-item label="颜色" prop="color">
            <el-input v-model="form.color" placeholder="请输入颜色" clearable />
          </el-form-item>

          <el-form-item label="存放位置" prop="location">
            <el-input v-model="form.location" placeholder="请输入存放位置" clearable />
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
            <el-input-number v-model="form.weight" :precision="2" :step="0.1"
                              :min="0" controls-position="right" style="width:100%" />
          </el-form-item>

          <el-form-item label="计划价格" prop="planned_price">
            <el-input-number v-model="form.planned_price" :precision="2" :step="1"
                              :min="0" controls-position="right" style="width:100%" />
          </el-form-item>

          <el-form-item label="平均价格" prop="avg_price">
            <el-input-number v-model="form.avg_price" :precision="2" :step="1"
                              :min="0" controls-position="right" style="width:100%" />
          </el-form-item>


        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="memo">
            <el-input v-model="form.memo" type="textarea" :rows="3"
                      placeholder="请输入备注信息" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 弹窗底部按钮 -->
      <div style="text-align: right; margin-top: 20px;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'
import { updateBasItem } from '@/api/item/basitem' // 仅引入编辑接口

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

// 级联选择器配置
const cascaderProps = {
  children: 'children',
  label: 'classname',
  value: 'id',
  leaf: (node) => node.type === 3, // 仅允许选择第三级
  showAllLevels: false
}

// ---------- 表单数据（基于父组件传入的initialData初始化） ----------
const form = reactive({
  id: '', // 物料ID（必传）
  no: '', // 物料编号（禁用）
  name: '',
  classId: '', // 第三级分类ID（核心，回显用）
  inclass: '', // 拼接后的分类名称（回显用）
  unit: '',
  spec: '',
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
})

// ---------- 表单规则（编辑场景适配） ----------
const rules = {
  no: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  name: [{ required: true, message: '请输入物料名称', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择三级分类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择计量单位', trigger: 'change' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格型号', trigger: 'blur' }, { max: 50, message: '不超过50字符', trigger: 'blur' }],
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

// ---------- 提交编辑（仅调用编辑接口） ----------
const submit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await updateBasItem(form) // 仅调用编辑接口，传入含id的完整表单
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

// ---------- 重置表单（避免编辑数据残留） ----------
const resetForm = () => {
  formRef.value?.resetFields()
  // 重置为初始空状态
  Object.keys(form).forEach(key => {
    form[key] = key === 'weight' || key === 'planned_price' || key === 'avg_price' ? 0 : ''
  })
  cascaderValue.value = []
}

// ---------- 监听弹窗显示/隐藏 + initialData变化（确保数据同步） ----------
watch([() => props.modelValue, () => props.initialData], ([isVisible, initialData]) => {
  if (isVisible && initialData.id) {
    // 弹窗打开时，同步父组件传入的最新编辑数据
    Object.assign(form, initialData)
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
.el-form-item { margin-bottom: 18px; }
.el-input-number, .el-select, .el-cascader { width: 100%; }
.el-cascader-panel .el-cascader-node__label { white-space: nowrap; }
/* 禁用输入框样式优化 */
.el-input.is-disabled .el-input__inner { background-color: #f5f7fa; cursor: not-allowed; }
</style>