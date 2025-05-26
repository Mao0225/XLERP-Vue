<template>
  <el-dialog
    title="选择销售员"
    v-model="visible"
    width="60%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入销售员姓名"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchForm.no"
            placeholder="请输入编号"
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
      :data="salesmanList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="no" label="编号" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="sex" label="性别" />
      <!-- <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '在职' : '离职' }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectSalesman(row)">
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
import { getHruserList } from '@/api/hruser/hruser'
import { ElMessage } from 'element-plus'

// 定义组件的 props，接收父组件传递的弹窗显示状态
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 定义组件发出的事件，用于更新弹窗状态和通知父组件选中销售员
const emit = defineEmits(['update:modelValue', 'select'])

// 控制弹窗的显示状态（响应式）
const visible = ref(false)

// 监听父组件传入的 modelValue，同步弹窗显示状态并在打开时获取销售员列表
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getSalesmanList()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 搜索表单数据，包含姓名和编号
const searchForm = reactive({
  name: '',
  no: ''
})

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  name: '',
  no: ''
})

// 销售员列表数据（响应式），用于表格显示
const salesmanList = ref([])
// 总记录数（响应式），用于分页组件
const total = ref(0)
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false)

// 获取销售员列表
// 功能：调用后端 API 获取分页后的销售员列表，基于查询参数（包括 name 和 no）
const getSalesmanList = async () => {
  loading.value = true // 开始加载，显示加载动画
  try {
    // 同步搜索表单的 name 和 no 到查询参数
    queryParams.name = searchForm.name
    queryParams.no = searchForm.no
    // 调用后端 API 获取分页数据
    const res = await getHruserList(queryParams)
    // 设置表格数据为后端返回的分页列表
    salesmanList.value = res.data.page.list
    // 设置总记录数为后端返回的总条数
    total.value = res.data.page.totalRow
  } catch (error) {
    // 显示错误提示
    ElMessage.error('获取销售员列表失败: ' + error.message)
  } finally {
    // 结束加载，关闭加载动画
    loading.value = false
  }
}

// 处理搜索操作
// 功能：将搜索条件应用到查询参数，重置页码为 1，并重新获取销售员列表
const handleSearch = () => {
  queryParams.pageNumber = 1 // 重置到第一页
  getSalesmanList() // 触发数据获取
}

// 重置搜索条件
// 功能：清空搜索表单的 name 和 no，重置页码为 1，并重新获取销售员列表
const resetSearch = () => {
  searchForm.name = '' // 清空姓名搜索条件
  searchForm.no = '' // 清空编号搜索条件
  queryParams.pageNumber = 1 // 重置到第一页
  getSalesmanList() // 触发数据获取
}

// 处理分页大小变化
// 功能：当用户更改每页显示条数时，更新 pageSize，重置页码为 1，并重新获取数据
const handleSizeChange = (size) => {
  queryParams.pageSize = size // 更新每页条数
  queryParams.pageNumber = 1 // 重置到第一页
  getSalesmanList() // 触发数据获取
}

// 处理当前页变化
// 功能：当用户切换页码时，更新 pageNumber，并重新获取数据
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page // 更新当前页码
  getSalesmanList() // 触发数据获取
}

// 处理表格行点击事件
// 功能：当点击表格行时，如果销售员在职（status === 1），触发选择操作
const handleRowClick = (row) => {
  if (row.status === 1) {
    selectSalesman(row) // 调用选择销售员方法
  }
}

// 选择销售员
// 功能：验证销售员状态并触发 select 事件，关闭弹窗
const selectSalesman = (salesman) => {
  // 通知父组件选中了销售员
  emit('select', salesman)
  // 关闭弹窗
  visible.value = false
}

// 处理弹窗关闭事件
// 功能：清空搜索条件，重置页码为 1
const handleClose = () => {
  searchForm.name = '' // 清空姓名搜索条件
  searchForm.no = '' // 清空编号搜索条件
  queryParams.pageNumber = 1 // 重置到第一页
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