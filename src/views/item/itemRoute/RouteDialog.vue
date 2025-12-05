<template>
  <el-dialog 
    v-model="visible" 
    title="工艺路线管理" 
    width="800px" 
    @open="fetchData"
    :close-on-click-modal="false"
  >
    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 15px;">
      <el-button type="primary" icon="Plus" @click="handleAdd">新增工序</el-button>
    </div>

    <!-- 工艺路线列表 -->
    <el-table :data="tableData" border v-loading="loading" row-key="id">
      <el-table-column prop="sort" label="排序" width="80" align="center" />
      <el-table-column prop="processCode" label="工序编号" width="120" />
      <el-table-column prop="processName" label="工序名称" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 内嵌弹窗：新增/编辑工序 -->
    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="500px"
      append-to-body
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="工序编号" prop="processCode">
          <el-input v-model="formData.processCode" placeholder="请输入编号（如：10）" />
        </el-form-item>
        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="formData.processName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getProcessRoutesByItemId, 
  saveProcessRoute, 
  updateProcessRoute, 
  deleteProcessRoute 
} from '@/api/basprocessroute/processroute'

const props = defineProps({
  modelValue: Boolean,
  itemId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 弹窗显隐控制
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const tableData = ref([])

// 表单相关
const formVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const formData = reactive({
  id: null,
  itemId: null,
  processCode: '',
  processName: '',
  sort: 1
})

const rules = {
  processCode: [{ required: true, message: '请输入工序编号', trigger: 'blur' }],
  processName: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

const formTitle = computed(() => isEdit.value ? '编辑工序' : '新增工序')

// 获取列表数据
const fetchData = async () => {
  if (!props.itemId) return
  loading.value = true
  try {
    const res = await getProcessRoutesByItemId({ itemId: props.itemId })
    if (res.code === 200 && res.data && res.data.list) {
      // 按照 sort 排序
      tableData.value = res.data.list.sort((a, b) => a.sort - b.sort)
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取工艺路线失败')
  } finally {
    loading.value = false
  }
}

// 新增点击
const handleAdd = () => {
  isEdit.value = false
  formData.id = null
  formData.itemId = props.itemId // 绑定当前物料ID
  formData.processCode = ''
  formData.processName = ''
  // 自动计算下一个排序值
  const maxSort = tableData.value.length > 0 ? Math.max(...tableData.value.map(i => i.sort)) : 0
  formData.sort = maxSort + 1
  
  formVisible.value = true
}

// 编辑点击
const handleEdit = (row) => {
  isEdit.value = true
  formData.id = row.id
  formData.itemId = row.itemId
  formData.processCode = row.processCode
  formData.processName = row.processName
  formData.sort = row.sort
  formVisible.value = true
}

// 删除点击
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除工序 "${row.processName}" 吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteProcessRoute({ id: row.id })
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateProcessRoute(formData)
          ElMessage.success('更新成功')
        } else {
          //去掉id字段
          delete formData.id
          await saveProcessRoute(formData)
          ElMessage.success('新增成功')
        }
        formVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
      }
    }
  })
}
</script>