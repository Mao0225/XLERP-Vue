<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择排产计划"
    width="1300px"
    :before-close="handleClose"
    destroy-on-close
  >
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :model="filters" inline>
        <el-form-item label="排产计划编码：">
          <el-input 
            v-model="filters.scheduleCode" 
            placeholder="请输入排产计划编码" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="合同名称：">
          <el-input 
            v-model="filters.contractName" 
            placeholder="请输入合同名称" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input 
            v-model="filters.contractNo" 
            placeholder="请输入合同编号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
       
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table 
      :data="tableData" 
      v-loading="loading"
      height="400"
      stripe
      @selection-change="handleSelectionChange"
    >
        <el-table-column type="index" label="序号" width="80" />
      
      <el-table-column 
        prop="scheduleCode" 
        label="排产计划编码" 
        width="180" 
        show-overflow-tooltip
      />
    <el-table-column 
        prop="contractNo" 
        label="合同编号" 
        width="180" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="contractName" 
        label="合同名称" 
        width="180" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="itemName" 
        label="物料名称" 
        width="180" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="itemSpec" 
        label="规格型号" 
        width="180" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="amount" 
        label="数量" 
        width="80" 
        align="center"
      />
      
      
      <el-table-column 
        label="计划开始时间" 
        width="120"
      >
        <template #default="{ row }">
          {{ row.planStartDate }}
        </template>
      </el-table-column>
      
      <el-table-column 
        label="计划结束时间" 
        width="120"
      >
        <template #default="{ row }">
          {{ row.planFinishDate }}
        </template>
      </el-table-column>
      
      <el-table-column 
        label="交付工期" 
        width="100"
      >
        <template #default="{ row }">
          {{ row.planPeriod }} 天
        </template>
      </el-table-column>


      
      <el-table-column 
        label="操作" 
        width="100" 
        fixed="right"
      >
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
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getConfirmPlSchedulePlan } from '@/api/plmanage/plscheduleplan'

// Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
})

// Emits定义
const emits = defineEmits(['update:visible', 'select'])

// 响应式数据
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})

const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

// 搜索条件
const filters = reactive({
  scheduleCode: '',
  contractName: '',
  contractNo: '',
  purchaserHqCode: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})


// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      purchaserHqCode : filters.purchaserHqCode,
      scheduleCode: filters.scheduleCode,
      contractNo: filters.contractNo,
      contractName: filters.contractName,
    }

    // 过滤空值参数
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    )

    const res = await getConfirmPlSchedulePlan(filteredParams)

    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        id: item.id,
        scheduleCode: item.scheduleCode,
        contractNo: item.contractNo,
        contractName: item.contractName,
        itemName : item.itemName,
        itemSpec : item.itemSpec,
        amount: item.amount,
        unit: item.itemUnit,
        planPeriod: typeof item.planPeriod === 'string' ? 
          parseInt(item.planPeriod.replace('天', '')) || 0 : item.planPeriod || 0,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        // 保留完整数据以便选择时传递
        ...item
      }))
      
      pagination.total = res.data.page.totalRow
    } else {
      throw new Error(res.msg || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 处理重置
const handleReset = () => {
  Object.assign(filters, {
    scheduleCode: '',
    poItemId: '',
    supplier: ''
  })
  pagination.current = 1
  selectedRows.value = []
  fetchData()
}

// 处理分页
const handleSizeChange = (val) => {
  pagination.size = val
  pagination.current = 1
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.current = val
  fetchData()
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理单行选择
const handleSelect = (row) => {

  emits('select', row)
  handleClose()
}


// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  selectedRows.value = []
}

// 监听弹窗显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    // 弹窗打开时加载数据
    fetchData()
  } else {
    // 弹窗关闭时重置数据
    Object.assign(filters, {
      scheduleCode: '',
      contractNo: '',
      contractName: '',
      purchaserHqCode: ''

    })
    pagination.current = 1
  }
})
</script>

<style scoped>
.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.search-section .el-form-item {
  margin-bottom: 0;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表格样式优化 */
:deep(.el-table .el-table__row:hover > td) {
  background-color: #f5f7fa;
}

:deep(.el-table .current-row > td) {
  background-color: #ecf5ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section .el-form {
    display: block;
  }
  
  .search-section .el-form-item {
    display: block;
    margin-bottom: 12px;
  }
  
  .search-section .el-form-item:last-child {
    margin-bottom: 0;
  }
  
  .search-section .el-input {
    width: 100% !important;
  }
}
</style>