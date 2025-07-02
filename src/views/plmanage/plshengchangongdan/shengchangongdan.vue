<template>
  <div class="production-workorder-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input v-model="queryParams.purchaserHqCode" placeholder="请输入采购方总部编码查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getWorkorderList" @keyup.enter="getWorkorderList" />
      <el-input v-model="queryParams.ipoNo" placeholder="请输入供应商生产订单序号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getWorkorderList" @keyup.enter="getWorkorderList" />
      <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getWorkorderList" @keyup.enter="getWorkorderList" />
      <el-input v-model="queryParams.woNo" placeholder="请输入生产工单编码查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getWorkorderList" @keyup.enter="getWorkorderList" />
      <el-select v-model="queryParams.woStatus" placeholder="选择工单状态" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>

      <el-button type="primary" @click="getWorkorderList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增工单</el-button>
    </div>
    
    <!-- 表格展示 -->
    <el-table :data="workorderList" border v-loading="loading" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="purchaserHqCode" label="采购方总部编码" />
      <el-table-column prop="ipoNo" label="供应商生产订单序号" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="woNo" label="生产工单编码" />
      <el-table-column prop="categoryCode" label="品类编码" />
      <el-table-column prop="subclassCode" label="种类编码" />
      <el-table-column prop="materialsCode" label="厂家物料编码" />
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
      <el-table-column prop="woStatus" label="工单状态" width="120">
        <template #default="{ row }">
          {{ getStatusLabel(row.woStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="数据来源" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          <!-- 新增批量操作按钮 -->
          <el-button type="danger" size="small" @click="handleBatchDelete([row.id])">批量删除</el-button>
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
    <WorkorderForm
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
import { 
  getPlshengchangongdanList, 
  getPlshengchangongdanById, 
  createPlshengchangongdan,
  updatePlshengchangongdan,
  deletePlshengchangongdan,
  batchDeletePlshengchangongdan
} from '@/api/plmanage/plshengchangongdan'
import WorkorderForm from './shengchangongdanForm.vue'

// 工单状态选项
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
  purchaserHqCode: '',
  ipoNo: '',
  supplierName: '',
  woNo: '',
  woStatus: '',
  pageNumber: 1,
  pageSize: 10
})

// 生产工单列表数据
const workorderList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = ref({})

// 获取生产工单列表
const getWorkorderList = async () => {
  loading.value = true
  try {
    const res = await getPlshengchangongdanList(queryParams)
    // 假设接口返回格式为 {rows: list, total: total}
    // 这里根据实际接口返回数据结构调整
    workorderList.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取生产工单列表失败', error)
    ElMessage.error('获取生产工单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getWorkorderList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getWorkorderList()
}

// 刷新
const handleRefresh = () => {
  queryParams.purchaserHqCode = ''
  queryParams.ipoNo = ''
  queryParams.supplierName = ''
  queryParams.woNo = ''
  queryParams.woStatus = ''
  queryParams.pageNumber = 1
  getWorkorderList()
}

// 新增生产工单
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {}
  dialogVisible.value = true
}

// 编辑生产工单
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getPlshengchangongdanById({ id: row.id })
  formData.value = res.data || {}
  dialogVisible.value = true
}

// 删除生产工单
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除生产工单"${row.woNo}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePlshengchangongdan({ id: row.id })
      ElMessage.success('删除成功')
      getWorkorderList()
    } catch (error) {
      console.error('删除生产工单失败', error)
      ElMessage.error('删除生产工单失败')
    }
  }).catch(() => {})
}

// 批量删除生产工单
const handleBatchDelete = async (ids) => {
  if (ids.length === 0) {
    ElMessage.warning('请选择要删除的工单')
    return
  }
  
  ElMessageBox.confirm(`确认删除选中的${ids.length}条生产工单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeletePlshengchangongdan(ids)
      ElMessage.success('批量删除成功')
      getWorkorderList()
    } catch (error) {
      console.error('批量删除生产工单失败', error)
      ElMessage.error('批量删除生产工单失败')
    }
  }).catch(() => {})
}

// 处理表单提交
const handleFormSubmit = async () => {
  try {
    let res
    if (dialogType.value === 'add') {
      res = await createPlshengchangongdan(formData.value)
      ElMessage.success('新增成功')
    } else {
      res = await updatePlshengchangongdan(formData.value)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    getWorkorderList()
  } catch (error) {
    console.error(dialogType.value === 'add' ? '新增失败' : '修改失败', error)
    ElMessage.error(dialogType.value === 'add' ? '新增失败' : '修改失败')
  }
}

// 处理表单取消
const handleFormCancel = () => {
  dialogVisible.value = false
}

// 页面初始化
onMounted(() => {
  getWorkorderList()
})
</script>

<style scoped>
.production-workorder-management {
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