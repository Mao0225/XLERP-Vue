<template>
  <el-drawer
    title="编辑物料分类"
    v-model="visible"
    size="500px"
    direction="rtl"
    :close-on-click-modal="false"
    :append-to-body="true"
    :before-close="handleBeforeClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="padding: 20px 0;">
      <!-- 上级分类：平铺层级选择（带缩进） -->
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
        <!-- 级别根据上级分类自动设置，不可手动修改 -->
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateBasItemClass, getBasItemClassTreeList } from '@/api/item/basitemclass' // 替换为树形接口

const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
    required: true,
    validator: (value) => {
      // 校验row必须包含id、parentId、type等核心字段（适配平铺的itemClass数据）
      return ['id', 'parentId', 'type', 'status', 'classcode', 'classname'].every(key => key in value)
    }
  }
})
const emit = defineEmits(['update:modelValue', 'success'])

// 状态管理
const visible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const flattenTreeOptions = ref([]) // 平铺后的分类选项（带层级缩进）
const parentLevelMap = ref({}) // 分类ID-级别映射
const originalForm = ref({}) // 存储原始数据，用于取消编辑时恢复

const form = reactive({
  id: null,
  parentId: null,
  classcode: '',
  classname: '',
  type: 1,
  status: '1', // 默认为可用（字符串类型适配radio-group）
  memo: ''
})

// 表单校验规则（不变）
const rules = {
  classcode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
  classname: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类级别', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 1. 初始化表单时，parentId 为 0 则保留 0（而非 null）
const loadData = async () => {
  try {
    const res = await getBasItemClassTreeList()
    const treeData = res.data.list || []
    buildLevelMap(treeData)
    
    // 获取排除ID（自身及子节点）
    const excludeIds = new Set()
    excludeIds.add(props.row.id)
    getChildIdsFromTree(treeData, props.row.id, excludeIds)
    
    // 过滤+平铺树形
    const filteredTree = filterTree(treeData, excludeIds)
    flattenTreeOptions.value = flattenTree(filteredTree)
    
    // 回显数据：parentId 为 0 则保留 0
    const row = JSON.parse(JSON.stringify(props.row))
    Object.assign(form, {
      ...row,
      parentId: row.parentId || 0, // 防止 parentId 为 null，强制设为 0
      status: row.status.toString()
    })
    
    originalForm.value = JSON.parse(JSON.stringify(form))
  } catch (err) {
    console.error('加载分类数据失败：', err)
    ElMessage.error('加载上级分类失败，请重试')
  }
}

// 2. 处理上级分类变化（不选时设为 0）
const handleParentChange = (parentId) => {
  if (parentId == 0) { // 选择“无上级（一级分类）”
    form.type = 1
  } else {
    const parentLevel = parentLevelMap.value[parentId]
    if (parentLevel == 1) {
      form.type = 2 // 上级是一级 → 本级二级
    } else if (parentLevel == 2) {
      form.type = 3 // 上级是二级 → 本级三级
    } else {
      ElMessage.warning('不支持选择三级分类作为上级')
      form.parentId = 0 // 恢复为一级分类
      form.type = 1
    }
  }
}

// 从树形结构中递归获取子节点ID（替代原getAllChildIds，无需扁平列表）
const getChildIdsFromTree = (tree, parentId, excludeIds) => {
  tree.forEach(item => {
    const itemClass = item.itemClass
    // 找到当前节点的子节点，加入排除列表
    if (itemClass.parentId == parentId) {
      excludeIds.add(itemClass.id)
      // 递归查找子节点的子节点
      getChildIdsFromTree(tree, itemClass.id, excludeIds)
    }
    // 递归处理当前节点的子节点（后端树形已包含children）
    if (item.children && item.children.length > 0) {
      getChildIdsFromTree(item.children, parentId, excludeIds)
    }
  })
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

// 过滤树形结构（排除指定ID的节点及子节点）
const filterTree = (tree, excludeIds) => {
  return tree.filter(item => {
    const itemClass = item.itemClass
    // 排除指定ID的节点
    if (excludeIds.has(itemClass.id)) return false
    // 递归过滤子节点
    if (item.children && item.children.length > 0) {
      item.children = filterTree(item.children, excludeIds)
    }
    return true
  })
}

// 平铺树形结构（带层级缩进，直接处理后端树形）
const flattenTree = (tree, level = 0) => {
  const result = []
  tree.forEach(item => {
    const itemClass = item.itemClass
    // 只过滤三级分类（三级不能当上级），保留二级分类作为选项
    if (itemClass.type == 3) {
      return // 跳过三级分类，不允许作为上级
    }
    
    // 层级缩进：二级加"└─ "，一级已通过默认选项处理，这里只显示二级
    const indent = level > 0 ? '  '.repeat(level - 1) + '└─ ' : ''
    result.push({
      id: itemClass.id,
      classname: itemClass.classname,
      type: itemClass.type,
      levelLabel: `${indent}${itemClass.classname}`
    })
    
    // 递归处理子节点（只处理二级的子节点，但三级已过滤，实际不会执行）
    if (item.children && item.children.length > 0) {
      result.push(...flattenTree(item.children, level + 1))
    }
  })
  return result
}

// 提交编辑（逻辑不变）
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      // 转换状态为数字类型（适配后端存储）
      const submitForm = {
        ...form,
        status: Number(form.status)
      }
      await updateBasItemClass(submitForm)
      ElMessage.success('修改成功')
      visible.value = false
      emit('success') // 通知父组件刷新列表
    } catch (err) {
      ElMessage.error(err.message || '修改失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

// 关闭抽屉前的回调（确认是否放弃修改，逻辑不变）
const handleBeforeClose = (done) => {
  // 比较当前表单与原始数据是否一致
  const isChanged = JSON.stringify(form) !== JSON.stringify(originalForm.value)
  if (isChanged) {
    ElMessageBox.confirm(
      '当前编辑内容未保存，是否放弃修改？',
      '提示',
      {
        type: 'warning',
        confirmButtonText: '确认放弃',
        cancelButtonText: '继续编辑'
      }
    ).then(() => {
      done() // 确认放弃，关闭抽屉
    }).catch(() => {
      // 取消关闭，继续编辑
    })
  } else {
    done() // 无修改，直接关闭
  }
}

// 监听modelValue变化（控制抽屉显示/隐藏，逻辑不变）
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loadData() // 显示时加载数据
  } else {
    // 隐藏时重置表单引用
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }
}, { immediate: true })

// 监听visible变化，同步给父组件（逻辑不变）
watch(visible, (val) => {
  emit('update:modelValue', val)
})
</script>