<template>
  <el-dialog
    title="选择合同"
    :model-value="visible"
    width="900px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div class="contract-selector">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入合同编号查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getContractListData"
          @keyup.enter="getContractListData"
          size="small"
        />
        <el-input
          v-model="queryParams.descr"
          placeholder="请输入合同名称查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getContractListData"
          @keyup.enter="getContractListData"
          size="small"
        />
        <el-button type="primary" @click="getContractListData" size="small">搜索</el-button>
        <el-button @click="handleRefresh" size="small">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>

      <!-- 合同列表 -->
      <el-table
        :data="contractList"
        border
        v-loading="loading"
        style="width: 100%; margin-top: 16px;"
        max-height="400px"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        ref="tableRef"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="no" label="合同编号" width="120" />
        <el-table-column prop="gridno" label="电网编号" width="120" />
        <el-table-column prop="descr" label="合同名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="salesmanName" label="销售员" width="100" />
        <el-table-column prop="customerName" label="客户名称" min-width="150" show-overflow-tooltip />
        <!-- <el-table-column prop="contractSum" label="合同金额" width="120">
          <template #default="{ row }">
            ¥{{ row.contractSum ? row.contractSum.toFixed(2) : '0.00' }}
          </template>
        </el-table-column> -->
        <el-table-column prop="signDate" label="签订时间" width="120" />
        <el-table-column prop="term" label="期间" width="100" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleSelect(row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNumber"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          size="small"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
        <el-button
          type="primary"
          @click="confirmSelect"
          :disabled="!selectedContract"
          size="small"
        >
          确定选择
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getConfirmContract } from '@/api/contract/bascontract'
import { useTermStore } from '@/store/term.js'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'select'])

const termStore = useTermStore()
const currentTerm = ref(termStore.currentTerm)

// 查询参数
const queryParams = reactive({
  no: '',
  descr: '',
  term: '',
  pageNumber: 1,
  pageSize: 10
})

// 合同列表数据
const contractList = ref([])
const total = ref(0)
const loading = ref(false)
const tableRef = ref(null)
const selectedContract = ref(null)

// 获取合同列表
const getContractListData = async () => {
  loading.value = true
  try {
    queryParams.term = currentTerm.value || ''
    const res = await getConfirmContract(queryParams)
    contractList.value = res.data.page.list.map(item => ({
      ...item,
      descr: item.name // Map 'name' to 'descr' for consistency
    }))
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同列表失败', error)
    ElMessage.error('获取合同列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getContractListData()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getContractListData()
}

// 处理表格行选择
const handleCurrentRowChange = (currentRow) => {
  selectedContract.value = currentRow
}

// 刷新
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.descr = ''
  queryParams.pageNumber = 1
  selectedContract.value = null
  if (tableRef.value) {
    tableRef.value.setCurrentRow()
  }
  getContractListData()
}

// 直接选择合同
const handleSelect = (row) => {
  selectedContract.value = row
  confirmSelect()
}

// 确认选择
const confirmSelect = () => {
  if (selectedContract.value) {
    emit('select', selectedContract.value)
    emit('update:visible', false)
    selectedContract.value = null
    if (tableRef.value) {
      tableRef.value.setCurrentRow()
    }
  }
}

// 监听弹窗显示状态，重置数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentTerm.value = termStore.currentTerm || ''
    selectedContract.value = null
    if (tableRef.value) {
      tableRef.value.setCurrentRow()
    }
    getContractListData()
  }
})

// 监听当前期间变化
watch(() => termStore.currentTerm, (newTerm) => {
  currentTerm.value = newTerm || ''
  if (props.visible) {
    getContractListData()
  }
}, { immediate: true })

// 页面初始化
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
  if (props.visible) {
    getContractListData()
  }
})
</script>

<style scoped>
.contract-selector {
  padding: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-dialog__body) {
  padding: 16px 20px;
}

:deep(.el-dialog__footer) {
  padding: 12px 20px;
  border-top: 1px solid #e8ecef;
}

:deep(.el-table .el-table__row) {
  cursor: pointer;
}

:deep(.el-table .el-table__row.current-row) {
  background-color: #ecf5ff;
}

:deep(.el-table .el-table__row:hover) {
  background-color: #f5f7fa;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar .el-input {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 8px;
  }
}
</style>