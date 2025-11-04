<!-- src/views/plinspection/components/ItemSelectorDialog.vue -->
<template>
  <el-dialog
    title="选择检验项目"
    v-model="visible"
    width="1000px"
    @closed="reset"
    :close-on-click-modal="false"
  >
    <!-- 搜索区域（保留，但仅作为接口参数传递，不做前端筛选） -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目编码">
          <el-input
            v-model="searchForm.inspItemCode"
            placeholder="请输入编码"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input
            v-model="searchForm.inspItemName"
            placeholder="请输入名称"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="检验类别">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择类别"
            clearable
            style="width: 150px"
          >
            <el-option label="化学成分" value="化学成分" />
            <el-option label="力学性能" value="力学性能" />
            <el-option label="冲击试验" value="冲击试验" />
            <el-option label="外观尺寸" value="外观尺寸" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域（无分页、无前端筛选） -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <span class="selected-info">
          已选择 <strong>{{ selectedItems.length }}</strong> 项 / 共 <strong>{{ tableData.length }}</strong> 项
        </span>
        <el-button
          type="danger"
          size="small"
          plain
          :disabled="selectedItems.length === 0"
          @click="clearSelection"
        >
          清空选择
        </el-button>
      </div>

      <el-table
        ref="tableRef"
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
        style="width: 100%"
        max-height="550"
      >
        <el-table-column type="selection" width="55" :selectable="checkSelectable" />
        <el-table-column label="项目编码" prop="inspItemCode" width="120" />
        <el-table-column label="项目名称" prop="inspItemName" min-width="150" />
        <el-table-column label="检验类别" prop="category" width="100" />
        <el-table-column label="数据类型" prop="dataType" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getDataTypeTag(row.dataType)">
              {{ getDataTypeLabel(row.dataType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" width="80">
          <template #default="{ row }">
            {{ row.unit || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="memo" min-width="120" show-overflow-tooltip />
      </el-table>
    </el-card>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="selectedItems.length === 0"
      >
        确定选择 ({{ selectedItems.length }})
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getInspItemList } from '@/api/plinspection/inspItem'

//  props 定义（语法正确，无多余符号）
const props = defineProps({
  modelValue: Boolean,
  excludeIds: {
    type: Array,
    default: () => []
  }
})

//  emits 定义（语法正确）
const emit = defineEmits(['update:modelValue', 'confirm'])

// 弹窗显示状态
const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => {
  visible.value = v
  if (v) {
    handleSearch() // 打开弹窗加载数据
  }
})
watch(visible, (v) => emit('update:modelValue', v))

// 表格引用、数据、选中项
const tableRef = ref(null)
const tableData = ref([])
const selectedItems = ref([])

// 搜索表单（仅传递给接口，不做前端筛选）
const searchForm = reactive({
  inspItemCode: '',
  inspItemName: '',
  category: ''
})

// 数据类型标签颜色（纯映射，无语法错误）
const getDataTypeTag = (type) => {
  const map = {
    number: 'success',
    text: '',
    bool: 'warning',
    select: 'primary',
    date: 'info'
  }
  return map[type] || ''
}

// 数据类型显示文本（纯映射，无语法错误）
const getDataTypeLabel = (type) => {
  const map = {
    number: '数字',
    text: '文本',
    bool: '布尔',
    select: '下拉',
    date: '日期'
  }
  return map[type] || type
}

// 查询（核心：仅调用接口，不做任何前端筛选，直接赋值数据）
const handleSearch = async () => {
  const loading = ElLoading.service({ text: '加载中...' })
  try {
    // 仅传递搜索参数给接口，不添加额外筛选条件
    const params = {
      inspItemCode: searchForm.inspItemCode,
      inspItemName: searchForm.inspItemName,
      category: searchForm.category,
      status: 1 // 接口需要的启用状态参数（不需要可删除）
    }

    const res = await getInspItemList(params)
    // 直接使用接口返回的 list，不做任何前端过滤
    tableData.value = res.data.list || []

    // 恢复选中状态
    nextTick(() => {
      tableData.value.forEach(row => {
        if (selectedItems.value.some(item => item.id === row.id)) {
          tableRef.value.toggleRowSelection(row, true)
        }
      })
    })
  } catch (err) {
    ElMessage.error('查询失败：' + (err.message || '网络异常'))
    tableData.value = []
  } finally {
    loading.close()
  }
}

// 重置搜索（清空表单并重新查询）
const handleReset = () => {
  searchForm.inspItemCode = ''
  searchForm.inspItemName = ''
  searchForm.category = ''
  handleSearch()
}

// 选择变化（直接赋值选中项）
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
}

// 清空选择
const clearSelection = () => {
  tableRef.value.clearSelection()
  selectedItems.value = []
}

// 检查是否可选（排除已添加的项目）
const checkSelectable = (row) => {
  return !props.excludeIds.includes(row.id)
}

// 确认选择
const handleConfirm = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请至少选择一个检验项目')
    return
  }
  emit('confirm', selectedItems.value)
  visible.value = false
}

// 重置（关闭弹窗清空状态）
const reset = () => {
  selectedItems.value = []
  searchForm.inspItemCode = ''
  searchForm.inspItemName = ''
  searchForm.category = ''
  tableData.value = []
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}
</script>

<style scoped>
.search-card {
  margin-bottom: 15px;
}

.search-card :deep(.el-card__body) {
  padding: 15px;
}

.table-card :deep(.el-card__body) {
  padding: 15px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.selected-info {
  font-size: 14px;
  color: #606266;
}

.selected-info strong {
  color: #409eff;
  font-size: 16px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>