<template>
  <el-dialog
    title="选择供应商"
    :model-value="visible"
    width="900px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div class="supplier-selector">
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-input 
          v-model="queryParams.no" 
          placeholder="请输入供应商编号查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="getBasOrgList" 
          @keyup.enter="getBasOrgList"
          size="small"
        />
        <el-input 
          v-model="queryParams.descr" 
          placeholder="请输入供应商名称查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="getBasOrgList" 
          @keyup.enter="getBasOrgList"
          size="small"
        />
        <el-button type="primary" @click="getBasOrgList" size="small">搜索</el-button>
        <el-button @click="handleRefresh" size="small">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
      
      <!-- 供应商列表 -->
      <el-table 
        :data="basOrgList" 
        border 
        v-loading="loading" 
        style="width: 100%; margin-top: 16px;"
        max-height="400px"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        ref="tableRef"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="no" label="供应商编号" width="120" />
        <el-table-column prop="descr" label="供应商名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="contactname" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="area" label="所属区域" width="100" />
        <el-table-column prop="city" label="城市" width="80" />
        <el-table-column prop="status" label="状态" width="70">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'" size="small">
              {{ row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
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
          :disabled="!selectedSupplier"
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
import { getBasOrgs } from '@/api/system/basorg'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'select'])

// 查询参数
const queryParams = reactive({
  no: '',
  descr: '',
  type: 1, // 固定为供应商类型
  pageNumber: 1,
  pageSize: 10
})

// 供应商列表数据
const basOrgList = ref([])
const total = ref(0)
const loading = ref(false)
const tableRef = ref(null)
const selectedSupplier = ref(null)

// 获取供应商列表
const getBasOrgList = async () => {
  loading.value = true
  try {
    const res = await getBasOrgs(queryParams)
    basOrgList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取供应商列表失败', error)
    ElMessage.error('获取供应商列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasOrgList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasOrgList()
}

// 处理表格行选择
const handleCurrentRowChange = (currentRow) => {
  selectedSupplier.value = currentRow
}

// 刷新
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.descr = ''
  queryParams.pageNumber = 1
  selectedSupplier.value = null
  if (tableRef.value) {
    tableRef.value.setCurrentRow()
  }
  getBasOrgList()
}

// 直接选择供应商
const handleSelect = (row) => {
  selectedSupplier.value = row
  confirmSelect()
}

// 确认选择
const confirmSelect = () => {
  if (selectedSupplier.value) {
    emit('select', selectedSupplier.value)
    emit('update:visible', false)
    // 重置选择状态
    selectedSupplier.value = null
    if (tableRef.value) {
      tableRef.value.setCurrentRow()
    }
  }
}

// 监听弹窗显示状态，重置数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时重置状态并加载数据
    selectedSupplier.value = null
    if (tableRef.value) {
      tableRef.value.setCurrentRow()
    }
    getBasOrgList()
  }
})

// 页面初始化
onMounted(() => {
  if (props.visible) {
    getBasOrgList()
  }
})
</script>

<style scoped>
.supplier-selector {
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