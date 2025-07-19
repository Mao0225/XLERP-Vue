<template>
  <el-dialog
    title="选择排产计划"
    v-model="visible"
    width="90%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.planNo"
            placeholder="请输入排产计划号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-input 
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-input 
            v-model="searchForm.orderNo"
            placeholder="请输入生产订单号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-input 
            v-model="searchForm.workOrderNo"
            placeholder="请输入生产工单号"
            @keyup.enter="handleSearch"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="plpaichanjihuaList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" min-width="80" />
      <el-table-column prop="scheduleCode" label="排产计划号" min-width="200" />
      <el-table-column prop="contractNo" label="合同编号" min-width="120" />
      <el-table-column prop="conamount" label="合同订货数" min-width="100" />
      <el-table-column prop="ddamount" label="关联订单货数" min-width="120" />
      <el-table-column prop="gdamount" label="关联工单货数" min-width="120" />
      <el-table-column prop="itemName" label="物料名称" min-width="150" />
      <el-table-column prop="itemNo" label="物料编号" min-width="120" />
      <el-table-column prop="spec" label="物料型号" min-width="120" />
      <el-table-column prop="planStartDate" label="计划开始日期" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.planStartDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="planFinishDate" label="计划完成日期" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.planFinishDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="计划状态" min-width="120">
        <template #default="{ row }">
          {{ getStatusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="writer" label="录入人" min-width="100" />
      <el-table-column prop="writetime" label="录入时间" min-width="120" />
      <el-table-column label="操作" min-width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectPlan(row)">
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
import { getPlpaichanjihuaList } from '@/api/plmanage/plpaichanjihua'

// 定义组件的 props，接收父组件传递的弹窗显示状态和回调函数
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 接收父组件的回调函数，用于传递选中的排产计划数据
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
    getPlpaichanjihuaPage()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 计划状态选项
const statusOptions = [
  { id: 1, value: '待处理' },
  { id: 2, value: '处理中' },
  { id: 3, value: '已完成' },
  { id: 4, value: '已取消' },
  { id: 5, value: '已过期' }
]

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.value : '未知状态'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 搜索表单数据
const searchForm = reactive({
  planNo: '',
  contractNo: '',
  orderNo: '',
  workOrderNo: ''
})

// 查询参数
const queryParams = reactive({
  planNo: '',
  contractNo: '',
  orderNo: '',
  workOrderNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 排产计划列表数据
const plpaichanjihuaList = ref([])
const total = ref(0)
const loading = ref(false)

// 获取排产计划列表
const getPlpaichanjihuaPage = async () => {
  loading.value = true
  try {
    queryParams.planNo = searchForm.planNo
    queryParams.contractNo = searchForm.contractNo
    queryParams.orderNo = searchForm.orderNo
    queryParams.workOrderNo = searchForm.workOrderNo
    
    const res = await getPlpaichanjihuaList(queryParams)
    console.log('获取排产计划列表响应:', res)
    plpaichanjihuaList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取排产计划列表失败:', error)
    ElMessage.error('获取排产计划列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理搜索操作
const handleSearch = () => {
  queryParams.pageNumber = 1
  getPlpaichanjihuaPage()
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.planNo = ''
  searchForm.contractNo = ''
  searchForm.orderNo = ''
  searchForm.workOrderNo = ''
  queryParams.pageNumber = 1
  getPlpaichanjihuaPage()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getPlpaichanjihuaPage()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getPlpaichanjihuaPage()
}

// 选择排产计划
const selectPlan = (plan) => {
  // 调用父组件的回调函数，传递选中的排产计划数据
  props.onSelect(plan)
  // 关闭弹窗
  visible.value = false
}

// 处理表格行点击事件
const handleRowClick = (row) => {
  selectPlan(row)
}

// 处理弹窗关闭事件
const handleClose = () => {
  searchForm.planNo = ''
  searchForm.contractNo = ''
  searchForm.orderNo = ''
  searchForm.workOrderNo = ''
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

/* 表格单元格样式 */
.el-table .cell {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 溢出时显示省略号 */
}
</style>