<template>
  <el-dialog
    title="选择产品"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.itemNo"
            placeholder="请输入产品编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchForm.itemName"
            placeholder="请输入产品名称"
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
      :data="productList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="no" label="产品编号" width="120" />
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="spec" label="规格型号" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="planned_price" label="单价" width="100">
        <template #default="{ row }">
          ¥{{ row.planned_price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="单重" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectProduct(row)">
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
import { getBasItems } from '@/api/item/basitem'

// 定义组件的 props，接收父组件传递的弹窗显示状态
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// 定义组件发出的事件，用于更新弹窗状态和通知父组件选中产品
const emit = defineEmits(['update:modelValue', 'select'])

// 控制弹窗的显示状态（响应式）
const visible = ref(false)

// 监听父组件传入的 modelValue，同步弹窗显示状态并在打开时获取产品列表
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getProductList()
  }
})

// 监听弹窗显示状态的变化，通知父组件更新 modelValue
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 搜索表单数据，包含产品编号和名称
const searchForm = reactive({
  itemNo: '',
  itemName: ''
})

// 查询参数，包含分页信息和搜索条件
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemNo: '',
  itemName: ''
})

// 产品列表数据（响应式），用于表格显示
const productList = ref([])
// 总记录数（响应式），用于分页组件
const total = ref(0)
// 加载状态（响应式），控制表格的加载动画
const loading = ref(false)

// 获取产品列表
// 功能：调用后端 API 获取分页后的产品列表，基于查询参数（包括 itemNo 和 itemName）
const getProductList = async () => {
  loading.value = true // 开始加载，显示加载动画
  try {
    // 同步搜索表单的 itemNo 和 itemName 到查询参数
    queryParams.itemNo = searchForm.itemNo
    queryParams.itemName = searchForm.itemName
    // 调用后端 API 获取分页数据
    const res = await getBasItems(queryParams)
    // 设置表格数据为后端返回的分页列表
    productList.value = res.data.page.list
    // 设置总记录数为后端返回的总条数
    total.value = res.data.page.totalRow
  } catch (error) {
    // 显示错误提示
    ElMessage.error('获取产品列表失败: ' + error.message)
  } finally {
    // 结束加载，关闭加载动画
    loading.value = false
  }
}

// 处理搜索操作
// 功能：将搜索条件应用到查询参数，重置页码为 1，并重新获取产品列表
const handleSearch = () => {
  queryParams.pageNumber = 1 // 重置到第一页
  getProductList() // 触发数据获取
}

// 重置搜索条件
// 功能：清空搜索表单的 itemNo 和 itemName，重置页码为 1，并重新获取产品列表
const resetSearch = () => {
  searchForm.itemNo = '' // 清空产品编号搜索条件
  searchForm.itemName = '' // 清空产品名称搜索条件
  queryParams.pageNumber = 1 // 重置到第一页
  getProductList() // 触发数据获取
}

// 处理分页大小变化
// 功能：当用户更改每页显示条数时，更新 pageSize，重置页码为 1，并重新获取数据
const handleSizeChange = (size) => {
  queryParams.pageSize = size // 更新每页条数
  queryParams.pageNumber = 1 // 重置到第一页
  getProductList() // 触发数据获取
}

// 处理当前页变化
// 功能：当用户切换页码时，更新 pageNumber，并重新获取数据
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page // 更新当前页码
  getProductList() // 触发数据获取
}

// 处理表格行点击事件
// 功能：当点击表格行时，触发选择产品操作
const handleRowClick = (row) => {
  selectProduct(row) // 调用选择产品方法
}

// 选择产品
// 功能：触发 select 事件，关闭弹窗
const selectProduct = (product) => {
  // 通知父组件选中了产品
  emit('select', product)
  // 关闭弹窗
  visible.value = false
}

// 处理弹窗关闭事件
// 功能：清空搜索条件，重置页码为 1
const handleClose = () => {
  searchForm.itemNo = '' // 清空产品编号搜索条件
  searchForm.itemName = '' // 清空产品名称搜索条件
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