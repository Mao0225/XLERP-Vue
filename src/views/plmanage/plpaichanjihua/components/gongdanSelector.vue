<template>
  <el-dialog
    title="选择生产工单"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.woNo"
            placeholder="请输入生产工单号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input 
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="orderList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="woNo" label="生产工单号" width="150" />
      <el-table-column prop="contractNo" label="合同编号" width="120" />
      <el-table-column prop="contractName" label="合同名称" />
      <el-table-column prop="planStartDate" label="计划开始日期" width="120">
        <template #default="{ row }">
          {{ formatDate(row.planStartDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="planFinishDate" label="计划完成日期" width="120">
        <template #default="{ row }">
          {{ formatDate(row.planFinishDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="ipoStatus" label="工单状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.ipoStatus)">
            {{ getStatusLabel(row.ipoStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="writer" label="录入人" width="100" />
      <el-table-column prop="writetime" label="录入时间" width="120" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectOrder(row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlshengchangongdanList } from '@/api/plmanage/plshengchangongdan'

// 定义组件的 props，接收父组件传递的弹窗显示状态和回调函数
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 接收父组件的回调函数，用于传递选中的生产工单数据
  onSelect: {
    type: Function,
    default: () => {}
  }
})

// 定义组件发出的事件，用于更新弹窗状态
const emit = defineEmits(['update:modelValue'])

// 控制弹窗的显示状态（响应式）
const visible = ref(false)

// 监听父组件传入的 modelValue，同步弹窗显示状态
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getGongdanListData()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 搜索表单数据
const searchForm = reactive({
  woNo: '',
  contractNo: ''
})

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  woNo: '',
  contractNo: ''
})

// 生产工单列表数据（响应式），用于表格显示
const orderList = ref([])
// 总记录数（响应式），用于分页组件
const total = ref(0)
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false)

// 工单状态配置
const statusOptions = [
  { id: 1, value: '待处理', type: 'info' },
  { id: 2, value: '处理中', type: 'warning' },
  { id: 3, value: '已完成', type: 'success' },
  { id: 4, value: '已取消', type: 'danger' },
  { id: 5, value: '已过期', type: 'danger' }
]

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.value : '未知状态'
}

// 获取状态类型
const getStatusType = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.type : 'info'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 获取生产工单列表
const getGongdanListData = async () => {
  loading.value = true
  try {
    queryParams.woNo = searchForm.woNo
    queryParams.contractNo = searchForm.contractNo
    
    const res = await getPlshengchangongdanList(queryParams)
    orderList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    ElMessage.error('获取生产工单列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索操作
const handleSearch = () => {
  queryParams.pageNumber = 1
  getGongdanListData()
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.woNo = ''
  searchForm.contractNo = ''
  queryParams.pageNumber = 1
  getGongdanListData()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getGongdanListData()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getGongdanListData()
}

// 选择生产工单
const selectOrder = (order) => {
  // 调用父组件的回调函数，传递选中的生产工单数据
  props.onSelect(order)
  // 关闭弹窗
  visible.value = false
}

// 处理表格行点击事件
const handleRowClick = (row) => {
  selectOrder(row)
}

// 处理弹窗关闭事件
const handleClose = () => {
  searchForm.woNo = ''
  searchForm.contractNo = ''
  queryParams.pageNumber = 1
}
</script>

<style scoped>
/* 搜索栏样式 */
.search-bar {
  margin-bottom: 20px;
}

/* 分页容器样式 */
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 表格行鼠标悬停样式 */
:deep(.el-table__row) {
  cursor: pointer;
}

/* 表格行悬停背景色 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>