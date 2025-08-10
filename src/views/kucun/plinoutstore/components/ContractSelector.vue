<template>
  <el-dialog
    title="选择合同"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input 
            
            v-model="searchForm.projectName"
            placeholder="请输入合同名称"
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
      :data="contractList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="no" label="合同号" width="120" />
      <el-table-column prop="gridno" label="电网编号" width="120" />
      <el-table-column prop="name" label="工程名称" />
      <el-table-column prop="salesmanName" label="销售员" width="100" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="contractSum" label="合同金额" width="120">
        <template #default="{ row }">
          ¥{{ (row.contractSum?.toFixed(2)) ?? '0.00' }}
        </template>
      </el-table-column> 
      <el-table-column prop="signDate" label="签定时间" width="120" />
      <el-table-column prop="term" label="期间" width="120" />
      <el-table-column prop="status" label="合同状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectContract(row)">
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
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getContractList } from '@/api/tongzhi/tongzhi.js'
import { useTermStore } from '@/store/term.js'

// 定义组件的 props，接收父组件传递的弹窗显示状态和回调函数
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 新增：接收父组件的回调函数，用于传递选中的合同数据
  onSelect: {
    type: Function,
    default: () => {}
  }
})

// 定义组件发出的事件，用于更新弹窗状态
const emit = defineEmits(['update:modelValue'])

// 控制弹窗的显示状态（响应式）
const visible = ref(false)
const termStore = useTermStore()
const currentTerm = ref(termStore.currentTerm)

// 监听父组件传入的 modelValue，同步弹窗显示状态
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    currentTerm.value = termStore.currentTerm || ''
    getContractListData()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 监听当前期间变化，更新查询条件
watch(() => termStore.currentTerm, (newTerm) => {
  currentTerm.value = newTerm || ''
  if (visible.value) {
    getContractListData()
  }
}, { immediate: true })

// 搜索表单数据，包含合同编号和名称
const searchForm = reactive({
  contractNo: '',
  projectName: ''
})

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: ''
})

// 合同列表数据（响应式），用于表格显示
const contractList = ref([])
// 总记录数（响应式），用于分页组件
const total = ref(0)
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false)

// 获取合同列表
const getContractListData = async () => {
  loading.value = true
  try {
    queryParams.contractNo = searchForm.contractNo
    queryParams.projectName = searchForm.projectName
    queryParams.term = currentTerm.value
    
    const res = await getContractList(queryParams)
    contractList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    ElMessage.error('获取合同列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}


// 新增：合同状态处理方法

const getStatusType = (status) => {
  const statusMap = {
    10: 'info',
    20: 'success',
    30: 'warning',
    40: 'danger',
    50: 'danger',
    60: 'primary'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    10: '录入',
    20: '确认',
    30: '下计划',
    40: '生产中',
    50: '发货',
    60: '完成'
  }
  return statusMap[status] || '未知'
}

// 处理搜索操作
const handleSearch = () => {
  queryParams.pageNumber = 1
  getContractListData()
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.contractNo = ''
  searchForm.projectName = ''
  queryParams.pageNumber = 1
  getContractListData()
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

// 选择合同
const selectContract = (contract) => {
  // 调用父组件的回调函数，传递选中的合同数据
  props.onSelect(contract)
  // 关闭弹窗
  visible.value = false
}

// 处理表格行点击事件
const handleRowClick = (row) => {
  selectContract(row)
}

// 处理弹窗关闭事件
const handleClose = () => {
  searchForm.contractNo = ''
  searchForm.projectName = ''
  queryParams.pageNumber = 1
}

// 组件挂载时初始化
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
})
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