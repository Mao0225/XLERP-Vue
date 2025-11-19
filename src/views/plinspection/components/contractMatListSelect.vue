<template>
<el-dialog
  title="选择备料"
  v-model="isDialogOpen"
  width="80%"
  :append-to-body="true"
  :close-on-click-modal="false"
  @close="handleClose"
  class="material-selector-dialog"
>
    <!-- 搜索区域：移除关联状态筛选，保留合同编号搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.contractNo"
        placeholder="请输入合同编号搜索"
        clearable
        style="width: 320px"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #append>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
        </template>
      </el-input>
<!-- 分页 -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pageNumber"
        v-model:page-size="pageSz"
        :total="totalRow"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        small
        background
      />
    </div>

    </div>

    

    <!-- 表格区域：新增操作列（选择按钮） -->
    <div class="table-container">
      <el-table
        ref="tableRef"
        :data="tableData"
        :loading="loading"
        border
        stripe
        style="width: 100%"
        max-height="80vh"
        min-height="70vh"
        class="material-table"
      >
        <el-table-column type="index" width="55" fixed="left" label="#" />
        <el-table-column label="合同编号" prop="contractNo" width="130" />
        <el-table-column label="合同名称" prop="contractName" width="180" show-overflow-tooltip />
        <el-table-column label="物料编号" prop="itemNo" show-overflow-tooltip width="150" />
        <el-table-column label="物料名称" prop="itemName" width="180" show-overflow-tooltip />
        <el-table-column label="规格型号" prop="itemSpec" width="150" show-overflow-tooltip />
        <el-table-column label="物料分类" prop="inclass" width="180" show-overflow-tooltip />
        <el-table-column label="采购计划编号" prop="purchaseOrderNo" width="140" />
        <el-table-column label="采购计划名称" prop="orderName" width="180" show-overflow-tooltip />
        <el-table-column label="采购计划备注" prop="orderFormMemo" width="200" show-overflow-tooltip />
        <el-table-column label="制单人" prop="orderWriter" width="120" align="center" />
        <el-table-column label="单位" prop="unit" width="80" align="center" />
        <el-table-column label="计划数量" prop="planQuantity" width="100" align="center" />
        <el-table-column label="关联成品" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.contractItemNames" class="contract-items">
              {{ parseJsonArray(scope.row.contractItemNames).join('、') }}
            </span>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <!-- 新增操作列：直接选择按钮 -->
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleDirectSelect(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 移除底部确认/取消按钮 -->
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getContractMaterialPageForInsp } from '@/api/contract/bascontractmaterial'

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'update:modelValue'])

// ==================== 状态 ====================
const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const isDialogOpen = ref(props.modelValue)

const pageNumber = ref(1)
const pageSz = ref(20)
const totalRow = ref(0)

// 搜索表单：移除relationStatus字段
const searchForm = ref({
  contractNo: ''
})

// ==================== JSON 解析 ====================
const parseJsonArray = (jsonStr) => {
  try {
    const arr = JSON.parse(jsonStr)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

// ==================== 搜索防抖 ====================
let searchTimer = null
const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pageNumber.value = 1
    fetchData(1)
  }, 300)
}

// ==================== 数据加载 ====================
const fetchData = async (currentPage = 1) => {
  try {
    loading.value = true
    pageNumber.value = currentPage

    const params = {
      pageNumber: pageNumber.value,
      pageSize: pageSz.value
    }

    // 合同编号筛选
    if (searchForm.value.contractNo?.trim()) {
      params.contractNo = searchForm.value.contractNo.trim()
    }

    console.log('【备料查询】请求参数：', params)
    const res = await getContractMaterialPageForInsp(params)
    console.log('【备料查询】接口返回：', res)

    if (res.success && res.code == 200) {
      const page = res.data?.page || {}
      tableData.value = page.list || []
      totalRow.value = page.totalRow || 0
      pageNumber.value = page.pageNumber || 1
      pageSz.value = page.pageSize || 20
    } else {
      ElMessage.error(res.msg || '查询失败')
      tableData.value = []
      totalRow.value = 0
    }
  } catch (error) {
    console.error('【备料查询】异常：', error)
    ElMessage.error('网络异常，请重试')
    tableData.value = []
    totalRow.value = 0
  } finally {
    loading.value = false
  }
}

// ==================== 分页 ====================
const handleSizeChange = (size) => {
  pageSz.value = size
  fetchData(1)
}

const handleCurrentChange = (current) => {
  fetchData(current)
}

// ==================== 直接选择（核心修改） ====================
const handleDirectSelect = (row) => {
  // 格式化返回数据（保留原有字段）
  const formattedData = {
    id: row.id,
    contractNo: row.contractNo,
    contractName: row.contractName,
    itemId: row.itemId,
    itemNo: row.itemNo,
    itemName: row.itemName,
    itemSpec: row.itemSpec,
    inclass: row.inclass,
    unit: row.unit,
    planQuantity: row.planQuantity,
    contractItemIds: row.contractItemIds ? parseJsonArray(row.contractItemIds) : [],
    contractItemNames: row.contractItemNames ? parseJsonArray(row.contractItemNames) : [],
    purchaseOrderNo: row.purchaseOrderNo,
    orderName: row.orderName || '',
    orderStatus: row.orderStatus || '',
    orderFormMemo: row.orderFormMemo || '',
    orderWriter: row.orderWriter || ''
  }

  console.log('【备料选择】返回数据：', formattedData)
  emit('select', formattedData) // 直接触发选择事件
  isDialogOpen.value = false // 选择后关闭弹窗
}

// ==================== 关闭 & 重置 ====================
const handleClose = () => {
  isDialogOpen.value = false
  resetSelect()
}

const resetSelect = () => {
  nextTick(() => {
    tableRef.value?.clearSelection()
  })
}

// ==================== 监听 ====================
watch(
  () => props.modelValue,
  (newVal) => {
    isDialogOpen.value = newVal
    if (newVal) {
      searchForm.value.contractNo = ''
      pageNumber.value = 1
      fetchData(1)
    }
  },
  { immediate: true }
)

watch(isDialogOpen, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', false)
    // 重置搜索条件
    searchForm.value = {
      contractNo: ''
    }
    pageNumber.value = 1
    pageSz.value = 20
    totalRow.value = 0
    resetSelect()
  }
})

// ==================== 挂载 ====================
onMounted(() => {
  if (props.modelValue ) {
    fetchData(1)
  }
})
</script>

<style scoped>
/* 弹窗整体容器 */
.material-selector-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-height: 75vh;
  overflow: auto;
}

.material-selector-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  margin: 0;
  padding: 16px 24px;
  font-weight: 600;
}

.material-selector-dialog :deep(.el-dialog__title) {
  color: #fff;
  font-size: 18px;
}

.material-selector-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.search-bar :deep(.el-input__inner) {
  border-radius: 8px 0 0 8px;
}

.search-bar :deep(.el-button) {
  border-radius: 0 8px 8px 0;
  height: 40px;
}

/* 表格容器 */
.table-container {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 16px;
}

.material-table :deep(.el-table__header-wrapper) {
  background: #f8f9fc;
}

.material-table :deep(.el-table__header th) {
  background: #f8f9fc;
  color: #5a5e66;
  font-weight: 600;
}

/* 表格行hover样式 */
.material-table :deep(.el-table__row:hover) {
  background: #f5f7fa;
}

/* 关联成品文字 */
.contract-items {
  color: #409eff;
  font-size: 13px;
}

.text-muted {
  color: #c0c4cc;
  font-style: italic;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 分页栏 */
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}

/* 响应式：适配小屏幕 */
@media (max-width: 768px) {
  .material-selector-dialog {
    width: 95% !important;
  }
  
  .search-bar :deep(.el-input) {
    width: 100% !important;
  }
  
  .material-table {
    font-size: 13px;
  }
}
</style>