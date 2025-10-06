<template>
    <div class="rubber-review-management">
      <div class="action-bar">
        <div class="status-filter">
          <el-radio-group v-model="queryParams.status" @change="handleStatusChange">
            <el-radio-button value="">全部状态</el-radio-button>
            <el-radio-button value="40">待审核</el-radio-button>
            <el-radio-button value="50">已审核</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="search-inputs">
          <el-input 
            v-model="queryParams.contractno" 
            placeholder="请输入合同编号查询" 
            style="width: 200px; margin-right: 10px;"
            clearable 
            @clear="getRubberList" 
            @keyup.enter="getRubberList" 
          />
          <el-input 
            v-model="queryParams.mafactoryname" 
            placeholder="请输入供应商名称查询" 
            style="width: 200px; margin-right: 10px;"
            clearable 
            @clear="getRubberList" 
            @keyup.enter="getRubberList" 
          />
          <el-input
            v-model="queryParams.matRecheckNo"
            placeholder="请输入来料检验批次号"
            style="width: 200px; margin-right: 10px;"
            clearable
            @clear="getRubberList"
            @keyup.enter="getRubberList"
          />
          <el-input
            v-model="queryParams.inNo"
            placeholder="请输入检验单号"
            style="width: 200px; margin-right: 10px;"
            clearable
            @clear="getRubberList"
            @keyup.enter="getRubberList"
          />
          <el-button type="primary" @click="getRubberList">搜索</el-button>
          <el-button type="warning" @click="handleRefresh">
            <el-icon>
              <Refresh />
            </el-icon> 刷新
          </el-button>
        </div>
      </div>
  
      <el-table :data="rubberList" border v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        
        <!-- 状态列使用 Tag 显示 -->
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="basno" label="单据号" width="140">
          <template #default="{ row }">
            <el-tooltip :content="row.basno" placement="top">
              <span class="truncate">{{ row.basno }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="inNo" label="检验单号" width="140">
          <template #default="{ row }">
            <el-tooltip :content="row.inNo" placement="top">
              <span class="truncate">{{ row.inNo }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="mafactoryname" label="供应商名称" width="180">
          <template #default="{ row }">
            <el-tooltip :content="row.mafactoryname" placement="top">
              <span class="truncate">{{ row.mafactoryname }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="matname" label="材料名称" width="120" />
        
        <el-table-column prop="detectionTime" label="检验日期" width="120" />
        
        <el-table-column prop="checker" label="检验人" width="100" />
        
        <el-table-column prop="writer" label="录入人" width="100" />
        
        <el-table-column label="操作" width="240">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="info" 
              @click="handlePreview(row.id)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="success" 
              @click="handleApprove(row.id)"
              v-if="row.status === '40'"
            >
              审核通过
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleReject(row.id)"
              v-if="row.status === '40'"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pageNumber"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
      
      <!-- 预览对话框 -->
      <check-data-preview
        :visible="previewDialogVisible"
        :initial-data="previewData"
        @update:visible="(val) => (previewDialogVisible = val)"
      />
      
      <!-- 驳回原因对话框 -->
      <el-dialog
        title="驳回原因"
        :model-value="rejectDialogVisible"
        width="400px"
        @update:model-value="(val) => rejectDialogVisible = val"
      >
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectReason"
            type="textarea"
            rows="4"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <template #footer>
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReject">确认驳回</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElTag, ElIcon } from 'element-plus'
  import { Refresh, Check, Clock, CircleClose, Close } from '@element-plus/icons-vue'
  import CheckDataPreview from './checkDataPreview.vue'
  import { getXjPage,updateXj, getXjById, updateXjStatus } from '@/api/clmanage/cl-xj'
  import { useUserStore } from '@/store/user'
  
  const userStore = useUserStore()
  
  // 状态映射关系
  const statusMap = {
    '10': { label: '检验单录入', icon: Clock, type: 'info' },
    '20': { label: '待审核', icon: Clock, type: 'warning' },
    '30': { label: '待录入检验数据', icon: Clock, type: 'primary' },
    '40': { label: '待审核', icon: Clock, type: 'warning' },
    '50': { label: '检验完成', icon: Check, type: 'success' },
    '60': { label: '已驳回', icon: Close, type: 'danger' }
  }
  
  // 获取状态标签类型
  const getStatusTagType = (status) => {
    return statusMap[status]?.type || 'default'
  }
  
  // 获取状态图标
  const getStatusIcon = (status) => {
    return statusMap[status]?.icon || CircleClose
  }
  
  // 获取状态文本
  const getStatusLabel = (status) => {
    return statusMap[status]?.label || '未知状态'
  }
  
  // 查询参数
  const queryParams = reactive({
    pageNumber: 1,
    pageSize: 10,
    contractno: '',
    mafactoryname: '',
    matRecheckNo: '',
    inNo: '',
    status: ''
  })
  
  // 橡胶列表数据
  const rubberList = ref([])
  const total = ref(0)
  const loading = ref(false)
  
  // 预览对话框
  const previewDialogVisible = ref(false)
  const previewData = ref({})
  
  // 驳回相关
  const rejectDialogVisible = ref(false)
  const rejectReason = ref('')
  const currentRejectId = ref('')
  
  // 获取橡胶检验列表
  const getRubberList = async () => {
    loading.value = true
    try {
      const res = await getXjPage(queryParams)
      rubberList.value = res.data.page.list
      total.value = res.data.page.totalRow
    } catch (error) {
      console.error('获取橡胶检验列表失败', error)
      ElMessage.error('获取橡胶检验列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 处理预览
  const handlePreview = async (id) => {
    const res = await getXjById(id)
    previewData.value = res.data.record
    previewDialogVisible.value = true
  }
  
  // 处理审核通过
  const handleApprove = async (id) => {
    try {
      await updateXjStatus({
        id,
        status: '50',
        updatePerson: userStore.realName
      })
      ElMessage.success('审核通过成功')
      getRubberList()
    } catch (error) {
      console.error('审核通过失败', error)
      ElMessage.error('审核通过失败')
    }
  }
  
  // 处理驳回
  const handleReject = (id) => {
    currentRejectId.value = id
    rejectReason.value = ''
    rejectDialogVisible.value = true
  }
  
  // 确认驳回
  const confirmReject = async () => {
    if (!rejectReason.value.trim()) {
      ElMessage.warning('请输入驳回原因')
      return
    }
    
    try {
      // 先获取当前记录
      const res = await getXjById(currentRejectId.value)
      const record = res.data.record
      
      // 更新状态和备注
      record.status = '60'
      record.memo = (record.memo ? record.memo + '；' : '') + `被${userStore.realName}驳回：${rejectReason.value}`
      
      await updateXj(record)
      ElMessage.success('驳回成功')
      rejectDialogVisible.value = false
      getRubberList()
    } catch (error) {
      console.error('驳回失败', error)
      ElMessage.error('驳回失败')
    }
  }
  
  // 状态变更
  const handleStatusChange = () => {
    queryParams.pageNumber = 1
    getRubberList()
  }
  
  // 分页大小变更
  const handleSizeChange = (size) => {
    queryParams.pageSize = size
    getRubberList()
  }
  
  // 当前页变更
  const handleCurrentChange = (page) => {
    queryParams.pageNumber = page
    getRubberList()
  }
  
  // 刷新
  const handleRefresh = () => {
    queryParams.contractno = ''
    queryParams.mafactoryname = ''
    queryParams.matRecheckNo = ''
    queryParams.inNo = ''
    queryParams.status = ''
    queryParams.pageNumber = 1
    getRubberList()
  }
  
  // 页面挂载时获取列表
  onMounted(() => {
    getRubberList()
  })
  </script>
  
  <style scoped>
  .rubber-review-management {
    padding: 20px;
  }
  
  .action-bar {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .status-filter {
    align-self: flex-start;
  }
  
  .search-inputs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  
  .truncate {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  :deep(.el-table .cell) {
    white-space: nowrap;
  }
  
  :deep(.el-radio-button__inner) {
    border-radius: 4px;
    padding: 6px 16px;
  }
  
  :deep(.el-radio-button.is-checked .el-radio-button__inner) {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
  </style>