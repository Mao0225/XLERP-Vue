<template>
  <div class="production-order-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input v-model="queryParams.ipoNo" placeholder="请输入生产订单号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlshengchandingdanList" @keyup.enter="getshengchandingdanList" />
      <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlshengchandingdanList" @keyup.enter="getshengchandingdanList" />
      <el-input v-model="queryParams.materialsName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getPlshengchandingdanList" @keyup.enter="getshengchandingdanList" />
      <el-select v-model="queryParams.ipoStatus" placeholder="选择订单状态" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>

      <el-button type="primary" @click="getshengchandingdanList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增订单</el-button>
    </div>
    
    <!-- 表格展示 -->
    <el-table :data="plshengchandingdanList" border v-loading="loading" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="ipoNo" label="生产订单号" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="materialsName" label="物料名称" />
      <el-table-column prop="amount" label="生产数量" />
      <el-table-column prop="unit" label="计量单位" />
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
      <el-table-column prop="ipoStatus" label="订单状态" width="120">
        <template #default="{ row }">
          {{ getStatusLabel(row.ipoStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="数据来源" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 表单弹窗 -->
    <ProductionOrderForm
      v-model:visible="dialogVisible"
      :type="dialogType"
      :form-data="formData"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlshengchandingdanList, getPlshengchandingdanById, deletePlshengchandingdan } from '@/api/plmanage/plshengchandingdan'
import ProductionOrderForm from './shengchandingdanForm.vue'

// 订单状态选项
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

// 查询参数
const queryParams = reactive({
  ipoNo: '',
  supplierName: '',
  materialsName: '',
  ipoStatus: '',
  pageNumber: 1,
  pageSize: 10
})

// 生产订单列表数据
const plshengchandingdanList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = ref({})

// 获取生产订单列表
const getshengchandingdanList = async () => {
  loading.value = true
  try {
    const res = await getPlshengchandingdanList(queryParams)
    plshengchandingdanList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取生产订单列表失败', error)
    ElMessage.error('获取生产订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getshengchandingdanList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getshengchandingdanList()
}

// 刷新
const handleRefresh = () => {
  queryParams.ipoNo = ''
  queryParams.supplierName = ''
  queryParams.materialsName = ''
  queryParams.ipoStatus = ''
  queryParams.pageNumber = 1
  getshengchandingdanList()
}

// 新增生产订单
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {}
  dialogVisible.value = true
}

// 编辑生产订单
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getPlshengchandingdanById({ id: row.id })
  formData.value = res.data.plshengchandingdan
  dialogVisible.value = true
}

// 删除生产订单
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除生产订单"${row.ipoNo}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePlshengchandingdan({ id: row.id })
      ElMessage.success('删除成功')
      getshengchandingdanList()
    } catch (error) {
      console.error('删除生产订单失败', error)
      ElMessage.error('删除生产订单失败')
    }
  }).catch(() => {})
}

// 处理表单提交
const handleFormSubmit = () => {
  ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
  dialogVisible.value = false
  getshengchandingdanList()
}

// 处理表单取消
const handleFormCancel = () => {
  dialogVisible.value = false
}

// 页面初始化
onMounted(() => {
  getshengchandingdanList()
})
</script>

<style scoped>
.production-order-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>