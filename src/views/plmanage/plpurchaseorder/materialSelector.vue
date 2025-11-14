<template>
  <el-dialog
    title="选择备料"
    v-model="isDialogOpen"
    width="70%"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
    class="material-selector-dialog"
  >
    <!-- 搜索区域 -->
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
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        ref="tableRef"
        :data="tableData"
        :loading="loading"
        border
        stripe
        style="width: 100%"
        height="420"
        @selection-change="handleSelectionChange"
        class="material-table"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="合同编号" prop="contractNo" width="130" />
        <el-table-column label="合同名称" prop="contractName" width="180" show-overflow-tooltip />
        <el-table-column label="物料编号" prop="itemNo" show-overflow-tooltip width="150" />
        <el-table-column label="物料名称" prop="itemName" width="180" show-overflow-tooltip />
        <el-table-column label="规格型号" prop="itemSpec" width="150" show-overflow-tooltip />
        <el-table-column label="物料分类" prop="inclass" width="180" show-overflow-tooltip />
        <el-table-column label="单位" prop="unit" width="80" align="center" />
        <el-table-column label="计划数量" prop="planQuantity" width="100" align="center" />
        <el-table-column label="关联成品" min-width="220" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.contractItemNames" class="contract-items">
              {{ parseJsonArray(scope.row.contractItemNames).join('、') }}
            </span>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="!loading && tableData.length === 0" class="empty-state">
        <el-empty description="暂无备料数据">
          <template #description>
            <p style="margin: 8px 0 0; color: #909399; font-size: 14px;">
              可尝试 <strong>搜索合同编号</strong> 或检查网络
            </p>
          </template>
        </el-empty>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pageNum"
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

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isDialogOpen = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="selectedRows.length === 0"
          @click="handleConfirm"
        >
          确认选择（{{ selectedRows.length }}）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getContractMaterialPage } from '@/api/contract/bascontractmaterial'

// ==================== Props & Emits ====================
const props = defineProps({
  visible: { type: Boolean, default: false },
  defaultContractNo: { type: String, default: '' }
})

const emit = defineEmits(['select', 'update:visible'])

// ==================== 状态 ====================
const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const isDialogOpen = ref(props.visible)

const pageNum = ref(1)
const pageSz = ref(10)
const totalRow = ref(0)

const searchForm = ref({
  contractNo: props.defaultContractNo
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
    pageNum.value = 1
    fetchData(1)
  }, 300)
}

// ==================== 数据加载（增强容错） ====================
const fetchData = async (currentPage = 1) => {
  try {
    loading.value = true
    pageNum.value = currentPage

    const params = {
      pageNum: pageNum.value,
      pageSize: pageSz.value
    }

    if (searchForm.value.contractNo?.trim()) {
      params.contractNo = searchForm.value.contractNo.trim()
    }

    console.log('【备料查询】请求参数：', params) // 调试

    const res = await getContractMaterialPage(params)

    console.log('【备料查询】接口返回：', res) // 调试

    if (res.success && res.code === 200) {
      const page = res.data?.page || {}
      tableData.value = page.list || []
      totalRow.value = page.totalRow || 0
      pageNum.value = page.pageNumber || 1
      pageSz.value = page.pageSize || 10
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

// ==================== 选择处理 ====================
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleConfirm = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条数据')
    return
  }

  const formattedData = selectedRows.value.map(item => ({
    id: item.id,
    contractNo: item.contractNo,
    contractName:item.contractName,
    itemId: item.itemId,
    itemNo: item.itemNo,
    itemName: item.itemName,
    itemSpec: item.itemSpec,
    inclass: item.inclass,
    unit: item.unit,
    planQuantity: item.planQuantity,
    contractItemIds: item.contractItemIds ? parseJsonArray(item.contractItemIds) : [],
    contractItemNames: item.contractItemNames ? parseJsonArray(item.contractItemNames) : []
  }))

  console.log('【备料选择】返回数据：', formattedData)

  emit('select', formattedData)
  isDialogOpen.value = false
}

// ==================== 关闭 & 重置 ====================
const handleClose = () => {
  isDialogOpen.value = false
  resetSelect()
}

const resetSelect = () => {
  selectedRows.value = []
  nextTick(() => {
    tableRef.value?.clearSelection()
  })
}

// ==================== 监听：打开弹窗自动查询 ====================
watch(
  () => props.visible,
  (newVal) => {
    isDialogOpen.value = newVal
    if (newVal) {
      // 每次打开都恢复默认合同编号并查询
      searchForm.value.contractNo = props.defaultContractNo || ''
      pageNum.value = 1
      fetchData(1)
    }
  },
  { immediate: true } // 关键！确保首次 visible=true 时触发
)

// 监听关闭：通知父组件 + 重置状态
watch(isDialogOpen, (newVal) => {
  if (!newVal) {
    emit('update:visible', false)
    // 重置搜索条件和分页，防止下次打开残留
    searchForm.value.contractNo = ''
    pageNum.value = 1
    pageSz.value = 10
    totalRow.value = 0
    resetSelect()
  }
})

// ==================== 挂载（备用）===================
onMounted(() => {
  if (props.visible && props.defaultContractNo) {
    searchForm.value.contractNo = props.defaultContractNo
    fetchData(1)
  }
})
</script>

<style scoped>
/* 弹窗整体容器 */
.material-selector-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
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

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 响应式 */
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