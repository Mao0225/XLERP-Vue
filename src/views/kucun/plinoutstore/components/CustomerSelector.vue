<template>
  <el-dialog
    title="选择客户"
    v-model="visible"
    width="70%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.descr"
            placeholder="请输入客户名称"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchForm.no"
            placeholder="请输入客户编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="customerList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="no" label="编号" width="100" />
      <el-table-column prop="descr" label="客户名称" />
      <el-table-column prop="contactname" label="联系人" width="100" />
      <el-table-column prop="phone" label="联系电话" width="130" />
      <el-table-column prop="province" label="所在省份" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectCustomer(row)">
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
import { getBasOrgs } from '@/api/system/basorg'

// 定义组件的 props，接收父组件传递的弹窗显示状态
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 定义组件发出的事件，用于更新弹窗状态和通知父组件选中客户
const emit = defineEmits(['update:modelValue', 'select'])

// 控制弹窗的显示状态（响应式）
const visible = ref(false)

// 监听父组件传入的 modelValue，同步弹窗显示状态并在打开时获取客户列表
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getCustomerList()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 搜索表单数据，包含客户名称和编号
const searchForm = reactive({
  no: '',
  descr: ''
})

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  no: '',
  descr: ''
})

// 客户列表数据（响应式），用于表格显示
const customerList = ref([])
// 总记录数（响应式），用于分页组件
const total = ref(0)
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false)

// 获取客户类型颜色
// 功能：根据客户类型返回对应的 Element Plus 标签颜色
const getCustomerTypeColor = (type) => {
  const typeMap = {
    1: 'primary', // 企业客户
    2: 'success', // 政府机构
    3: 'warning'  // 个人客户
  }
  return typeMap[type] || 'info'
}

// 获取客户类型文本
// 功能：根据客户类型返回对应的中文描述
const getCustomerTypeText = (type) => {
  const typeMap = {
    1: '企业客户',
    2: '政府机构',
    3: '个人客户'
  }
  return typeMap[type] || '未知'
}

// 获取客户列表
// 功能：调用后端 API 获取分页后的客户列表，基于查询参数（包括 descr 和 no）
const getCustomerList = async () => {
  loading.value = true // 开始加载，显示加载动画
  try {
    // 同步搜索表单的 descr 和 no 到查询参数
    queryParams.descr = searchForm.descr
    queryParams.no = searchForm.no
    // 调用后端 API 获取分页数据
    const res = await getBasOrgs(queryParams)
    // 设置表格数据为后端返回的分页列表
    customerList.value = res.data.page.list
    // 设置总记录数为后端返回的总条数
    total.value = res.data.page.totalRow
  } catch (error) {
    // 显示错误提示
    ElMessage.error('获取客户列表失败: ' + error.message)
  } finally {
    // 结束加载，关闭加载动画
    loading.value = false
  }
}

// 处理搜索操作
// 功能：将搜索条件应用到查询参数，重置页码为 1，并重新获取客户列表
const handleSearch = () => {
  queryParams.pageNumber = 1 // 重置到第一页
  getCustomerList() // 触发数据获取
}

// 重置搜索条件
// 功能：清空搜索表单的 descr 和 no，重置页码为 1，并重新获取客户列表
const resetSearch = () => {
  searchForm.descr = '' // 清空客户名称搜索条件
  searchForm.no = '' // 清空客户编号搜索条件
  queryParams.pageNumber = 1 // 重置到第一页
  getCustomerList() // 触发数据获取
}

// 处理分页大小变化
// 功能：当用户更改每页显示条数时，更新 pageSize，重置页码为 1，并重新获取数据
const handleSizeChange = (size) => {
  queryParams.pageSize = size // 更新每页条数
  queryParams.pageNumber = 1 // 重置到第一页
  getCustomerList() // 触发数据获取
}

// 处理当前页变化
// 功能：当用户切换页码时，更新 pageNumber，并重新获取数据
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page // 更新当前页码
  getCustomerList() // 触发数据获取
}

// 处理表格行点击事件
// 功能：当点击表格行时，如果客户状态正常（status === 1），触发选择操作
const handleRowClick = (row) => {
  if (row.status === 1) {
    selectCustomer(row) // 调用选择客户方法
  }
}

// 选择客户
// 功能：验证客户状态并触发 select 事件，关闭弹窗
const selectCustomer = (customer) => {
  // 通知父组件选中了客户
  emit('select', customer)
  // 关闭弹窗
  visible.value = false
}

// 处理弹窗关闭事件
// 功能：清空搜索条件，重置页码为 1，并触发重置搜索
const handleClose = () => {
  resetSearch() // 调用重置搜索方法
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