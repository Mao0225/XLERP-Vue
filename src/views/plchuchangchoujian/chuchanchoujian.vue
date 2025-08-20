<template>
    <div class="chuchan-inspection-management">
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-input 
          v-model="queryParams.guowanghetonghao" 
          placeholder="请输入国网合同号查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="handleSearch" 
          @keyup.enter="handleSearch" 
        />
        <el-input 
          v-model="queryParams.spotcheckbatch" 
          placeholder="请输入抽检批次号查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="handleSearch" 
          @keyup.enter="handleSearch" 
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
  
        <el-button type="primary" style="margin-left: auto;" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增抽检记录
        </el-button>
      </div>
      
      <!-- 表格展示 -->
      <el-table 
        :data="inspectionList" 
        border 
        v-loading="loading" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55" />
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="80" />
        
        <el-table-column prop="guowanghetonghao" label="国网采购订单号" />
        <el-table-column prop="poitemid" label="行项目ID" />
        <el-table-column prop="prodworkorder" label="生产工单号" />
        <el-table-column prop="tracecode" label="质量追溯码" />
        <el-table-column prop="partname" label="产品名称" />
        <el-table-column prop="partcode" label="产品型号" />
        <el-table-column prop="batch" label="生产批次号" />
        <el-table-column prop="spotcheckbatch" label="抽检批次号" />
        <el-table-column label="检验时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.generalchecktime || row.galvanizingchecktime || '-') }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedRows.length > 0">
        <el-button type="danger" @click="handleBatchDelete">
          批量删除 ({{ selectedRows.length }})
        </el-button>
      </div>
  
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
  
      <!-- 抽检表单弹窗 -->
      <InspectionForm
        v-model:visible="dialogVisible"
        :type="dialogType"
        :form-data="formData"
        @cancel="handleDialogClose"
        @refreshData="handleRefresh"   
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Refresh } from '@element-plus/icons-vue'
  import { 
    getchuchangchoujianlist, 
    getchuchangchoujianById, 
    deletechuchangchoujian,
    batchDeletechuchangchoujian
  } from '@/api/plchuchangchoujian/plchuchangchoujian'
  import InspectionForm from './chuchangchoujianForm.vue'
  
  // 格式化日期时间
  const formatDateTime = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  }
  
  // 响应式数据
  const loading = ref(false)
  const inspectionList = ref([])
  const total = ref(0)
  const selectedRows = ref([])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const formData = ref({})
  
  // 查询参数
  const queryParams = reactive({
    guowanghetonghao: '',
    spotcheckbatch: '',
    pageNumber: 1,
    pageSize: 10
  })
  
  // 获取抽检列表
  const getInspectionList = async () => {
    loading.value = true
    try {
      const res = await getchuchangchoujianlist(queryParams)
      inspectionList.value = res.data.page.list || []
      total.value = res.data.page.totalRow || 0
    } catch (error) {
      console.error('获取出厂抽检列表失败:', error)
      ElMessage.error('获取出厂抽检列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 搜索处理
  const handleSearch = () => {
    queryParams.pageNumber = 1
    getInspectionList()
  }
  
  // 刷新处理
  const handleRefresh = () => {
    queryParams.guowanghetonghao = ''
    queryParams.spotcheckbatch = ''
    queryParams.pageNumber = 1
    getInspectionList()
  }
  
  // 分页处理
  const handleSizeChange = (size) => {
    queryParams.pageSize = size
    queryParams.pageNumber = 1
    getInspectionList()
  }
  
  const handleCurrentChange = (page) => {
    queryParams.pageNumber = page
    getInspectionList()
  }
  
  // 选择变化处理
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  
  // 新增抽检记录
  const handleAdd = () => {
    dialogType.value = 'add'
    formData.value = {}
    dialogVisible.value = true
  }
  
  // 编辑抽检记录
  // 编辑抽检记录（优化数据加载逻辑）
  // 编辑抽检记录
const handleEdit = async (row) => {
  try {
    dialogType.value = 'edit'
    const res = await getchuchangchoujianById({ id: row.id })
    // 修复：接口返回数据在 record 字段中，而非 plchuchangchoujian
    formData.value = res.data.record || {}
    dialogVisible.value = true
  } catch (error) {
    console.error('获取抽检记录详情失败:', error)
    ElMessage.error('获取抽检记录详情失败')
  }
}
  
  // 删除抽检记录
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认删除抽检记录"${row.spotcheckbatch}"吗？`, 
        '删除确认', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      await deletechuchangchoujian({ id: row.id })
      ElMessage.success('删除成功')
      
      // 如果当前页没有数据了，回到上一页
      if (inspectionList.value.length === 1 && queryParams.pageNumber > 1) {
        queryParams.pageNumber -= 1
      }
      
      getInspectionList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除抽检记录失败:', error)
        ElMessage.error('删除抽检记录失败')
      }
    }
  }
  
  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择要删除的抽检记录')
      return
    }
    
    try {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedRows.value.length} 条抽检记录吗？`, 
        '批量删除确认', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      const ids = selectedRows.value.map(item => item.id)
      await batchDeletechuchangchoujian(ids)
      
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      
      // 如果当前页没有数据了，回到上一页
      if (inspectionList.value.length === selectedRows.value.length && queryParams.pageNumber > 1) {
        queryParams.pageNumber -= 1
      }
      
      getInspectionList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败:', error)
        ElMessage.error('批量删除失败')
      }
    }
  }
  
  // 弹窗关闭处理
  const handleDialogClose = () => {
    dialogVisible.value = false
    formData.value = {}
  }
  
  // 生命周期
  onMounted(() => {
    getInspectionList()
  })
  </script>
  
  <style scoped>
  .chuchan-inspection-management {
    padding: 20px;
  }
  
  .action-bar {
    display: flex;
    justify-content: space-between;
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