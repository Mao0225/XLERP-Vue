<template>
  <!-- 改为抽屉样式：direction="rtl" 从右侧滑出 -->
  <el-drawer
    title="新增物料分类"
    v-model="visible"
    size="500px"
    direction="rtl"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="padding: 20px 0;">
      <!-- 上级分类选择：改为平铺层级显示，非文件夹展开 -->
    <el-form-item label="上级分类" prop="parentId">
      <el-select
        v-model.number="form.parentId"
        placeholder="选择上级分类"
        clearable
        style="width: 100%;"
        filterable
        @change="handleParentChange"
      >
        <!-- 新增默认选项：value=0，显示“无上级（一级分类）” -->
        <el-option label="无上级（一级分类）" :value="0" />
        <!-- 原有二级/三级分类选项 -->
        <el-option
          v-for="item in flattenTreeOptions"
          :key="item.id"
          :label="item.levelLabel"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

      <el-form-item label="分类编码" prop="classcode">
        <el-input v-model="form.classcode" placeholder="如：B01" />
      </el-form-item>

      <el-form-item label="分类名称" prop="classname">
        <el-input v-model="form.classname" placeholder="请输入分类名称" />
      </el-form-item>

      <el-form-item label="分类级别" prop="type">
        <el-radio-group v-model="form.type" :disabled="true">
          <el-radio :label="1">一级</el-radio>
          <el-radio :label="2">二级</el-radio>
          <el-radio :label="3">三级</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">可用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.memo" type="textarea" :rows="3" placeholder="选填" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        确定
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createBasItemClass, getBasItemClassTreeList } from '@/api/item/basitemclass' // 替换为树形接口

const props = defineProps({
  modelValue: Boolean,
  parentId: [Number, String, 0], // 从列表页传递的父ID（添加子分类时）
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const flattenTreeOptions = ref([]) // 平铺后的分类选项（带层级缩进）
const parentLevelMap = ref({}) // 存储每个分类ID对应的级别

const form = reactive({
  parentId: 0,
  classcode: '',
  classname: '',
  type: 1, // 默认一级
  status: '1', // 默认可用（1=可用，0=停用）
  memo: ''
})

const rules = {
  classcode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
  classname: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类级别', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 3. 加载数据时，处理列表页传递的父ID（如果为 0 直接赋值）
const loadData = async () => {
  try {
    const res = await getBasItemClassTreeList()
    const treeData = res.data.list || []
    flattenTreeOptions.value = flattenTree(treeData)
    buildLevelMap(treeData)
    
    // 处理父ID：如果 props.parentId 是 0 或有效ID，直接赋值
    if (props.parentId !== null && props.parentId !== undefined) {
      form.parentId = props.parentId
      const parentLevel = parentLevelMap.value[props.parentId]
      form.type = parentLevel + 1
    } else {
      form.parentId = 0 // 默认一级分类
      form.type = 1
    }
  } catch (err) {
    console.error('加载分类数据失败：', err)
    ElMessage.error('加载分类数据失败')
  }
}

const flattenTree = (tree, level = 0) => {
  const result = []
  tree.forEach(item => {
    const itemClass = item.itemClass
    // 过滤三级分类（type=3 不能作为上级）
    if (itemClass.type === 3) {
      return
    }
    // 层级缩进：一级分类在下拉框里通过默认选项显示，这里只处理二级分类
    const indent = level > 0 ? '  '.repeat(level - 1) + '└─ ' : ''
    result.push({
      id: itemClass.id,
      classname: itemClass.classname,
      type: itemClass.type,
      levelLabel: `${indent}${itemClass.classname}`
    })
    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      result.push(...flattenTree(item.children, level + 1))
    }
  })
  return result
}

// 构建ID-级别映射（从树形结构中提取）
const buildLevelMap = (tree) => {
  tree.forEach(item => {
    const itemClass = item.itemClass
    parentLevelMap.value[itemClass.id] = itemClass.type
    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      buildLevelMap(item.children)
    }
  })
}

const handleParentChange = (parentId) => {
  if (parentId === null || parentId === undefined) {
    form.parentId = 0 // 不选上级 → parentId=0（一级分类）
    form.type = 1
  } else {
    const parentLevel = parentLevelMap.value[parentId]
    if (parentLevel === 1) {
      form.type = 2
    } else if (parentLevel === 2) {
      form.type = 3
    } else {
      ElMessage.warning('不支持选择三级分类作为上级')
      form.parentId = 0 // 恢复为一级分类
      form.type = 1
    }
  }
}


const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const submitForm = {
        ...form,
        status: Number(form.status)
      }
      await createBasItemClass(submitForm)
      ElMessage.success('新增成功')
      visible.value = false
      emit('success')
    } catch (err) {
      ElMessage.error(err.message || '新增失败')
    } finally {
      submitting.value = false
    }
  })
}

// 监听显示状态（修改重置表单部分）
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    // 重置表单：parentId 设为 0（而非 null）
    Object.assign(form, {
      parentId: props.parentId || 0, // 核心修复：默认 0，匹配无上级选项
      classcode: '',
      classname: '',
      type: 1,
      status: '1',
      memo: ''
    })
    loadData()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})
</script>