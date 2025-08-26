<template>
  <div class="production-workorder-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input 
        v-model="queryParams.ipoNo" 
        placeholder="请输入供应商生产订单序号查询" 
        style="width: 200px; margin-right: 10px;"
        clearable 
        @clear="handleSearch" 
        @keyup.enter="handleSearch" 
      />
      <el-input 
        v-model="queryParams.woNo" 
        placeholder="请输入生产工单编码查询" 
        style="width: 200px; margin-right: 10px;"
        clearable 
        @clear="handleSearch" 
        @keyup.enter="handleSearch" 
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>


    </div>
    
    <!-- 表格展示 -->
    <el-table 
      :data="workorderList" 
      border 
      v-loading="loading" 
      style="width: 100%"
    >
      <!-- 多选框 -->
      <el-table-column type="selection" width="55" />
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="woNo" label="生产工单号" />

      <el-table-column prop="contractNo" label="合同编号" />
      <el-table-column prop="ipoNo" label="生产订单号" />
      
      <el-table-column prop="planStartDate" label="计划开始日期" width="180">
        <template #default="{ row }">
          {{ formatDate(row.planStartDate) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="planFinishDate" label="计划完成日期" width="180">
        <template #default="{ row }">
          {{ formatDate(row.planFinishDate) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="woStatus" label="工单状态" width="120">
        <template #default="{ row }">
          {{ getStatusLabel(row.woStatus) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="dataSource" label="数据来源" />
      
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleWatch(row)">查看生产工单详情</el-button>
        </template>
      </el-table-column>
    </el-table>



    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 工单表单弹窗 -->
    <WorkorderForm
      v-model:visible="dialogVisible"
      :type="dialogType"
      :form-data="formData"
      :dep-no="userStore.depNo"
      @cancel="handleDialogClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { 
  getPlshengchangongdanById,
  getPlshengchangongdanListByDepNo, 
} from '@/api/plmanage/plshengchangongdan'
import WorkorderForm from './chakangongdanForm.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
// 工单状态配置
const STATUS_CONFIG = {
  1: { label: '待处理', type: 'info' },
  2: { label: '处理中', type: 'warning' },
  3: { label: '已完成', type: 'success' },
  4: { label: '已取消', type: 'danger' },
  5: { label: '已过期', type: 'danger' }
}

// 获取状态标签
const getStatusLabel = (status) => {
  return STATUS_CONFIG[status]?.label || '未知状态'
}



// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 响应式数据
const loading = ref(false)
const workorderList = ref([])
const total = ref(0)
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = ref({})

// 查询参数
const queryParams = reactive({
  ipoNo: '',
  woNo: '',
  pageNumber: 1,
  pageSize: 10,
  depNo: userStore.depNo
})

// 获取工单列表
const getWorkorderList = async () => {
  loading.value = true
  try {
    const res = await getPlshengchangongdanListByDepNo(queryParams)
    workorderList.value = res.data.page.list || []
    total.value = res.data.page.totalRow || 0
  } catch (error) {
    console.error('获取生产工单列表失败:', error)
    ElMessage.error('获取生产工单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  queryParams.pageNumber = 1
  getWorkorderList()
}

// 刷新处理
const handleRefresh = () => {
  queryParams.ipoNo = ''
  queryParams.woNo = ''
  queryParams.pageNumber = 1
  getWorkorderList()
}

// 分页处理
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getWorkorderList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getWorkorderList()
}

// 选择变化处理
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}


// 编辑工单
const handleWatch = async (row) => {
  try {
    const res = await getPlshengchangongdanById({ id: row.id })
    formData.value = res.data.plshengchangongdan || {}
    dialogVisible.value = true
  } catch (error) {
    console.error('获取工单详情失败:', error)
    ElMessage.error('获取工单详情失败')
  }
}


// 弹窗关闭处理
const handleDialogClose = () => {
  dialogVisible.value = false
  formData.value = {}
  // 刷新列表
  getWorkorderList()
}

// 生命周期
onMounted(() => {
  getWorkorderList()
})

// 清理定时器等
onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
.production-workorder-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  margin-bottom: 20px;
}

.batch-actions {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>