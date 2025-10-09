<template>
  <div class="galvanized-steel-strand-management">
    <div class="action-bar">
      <div class="search-inputs">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="handleRefresh" @keyup.enter="handleSearch" />
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="handleRefresh" @keyup.enter="handleSearch" />
        <el-input v-model="queryParams.basNo" placeholder="请输入单据号查询" style="width: 200px; margin-right: 10px;" clearable
          @clear="handleRefresh" @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <el-table :data="galvanizedSteelStrandList" border v-loading="loading" style="width: 100%">
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
      
      <el-table-column prop="basNo" label="单据号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.basNo" placement="top">
            <span class="truncate">{{ row.basNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="mafactory" label="制造商" width="160">
        <template #default="{ row }">
          <el-tooltip :content="row.mafactory" placement="top">
            <span class="truncate">{{ row.mafactory }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="contractNo" label="合同编号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.contractNo" placement="top">
            <span class="truncate">{{ row.contractNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同名称" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.contractName" placement="top">
            <span class="truncate">{{ row.contractName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="型号" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.type" placement="top">
            <span class="truncate">{{ row.type }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryQuantity" label="送货数量" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.deliveryQuantity" placement="top">
            <span class="truncate">{{ row.deliveryQuantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="acceptQuantity" label="验收数量" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.acceptQuantity" placement="top">
            <span class="truncate">{{ row.acceptQuantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
  
      <el-table-column prop="requestWriter" label="录入人" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.requestWriter" placement="top">
            <span class="truncate">{{ row.requestWriter }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="requestAuditor" label="审核人" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.requestAuditor" placement="top">
            <span class="truncate">{{ row.requestAuditor }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="writeTime" label="录入时间" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.writeTime" placement="top">
            <span class="truncate">{{ row.writeTime }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.memo" placement="top">
            <span class="truncate">{{ row.memo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="certificate" label="质量证明书" width="120">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <el-tooltip :content="file.name" placement="top">
              <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">{{ file.name }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      
      <!-- 操作列使用动态按钮 -->
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button
            v-for="action in getStatusActions(row.status)"
            :key="action.action"
            :size="'small'"
            :type="action.type"
            @click="handleActionClick(action, row)"
          >
            <el-icon><component :is="action.icon" /></el-icon>
            {{ action.text }}
          </el-button>
          <span v-if="getStatusActions(row.status).length === 0" class="no-operations">-</span>
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
        @current-change="handleCurrentChange" />
    </div>

    <!-- 对话框组件 -->
    <addForm 
      :newCode="newCode" 
      :visible="addDialogVisible" 
      @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd" />
      
    <editForm 
      :visible="editDialogVisible" 
      :initial-data="formData" 
      @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit" />
      
    <requestFormPreview 
      :visible="previewDialogVisible" 
      :initial-data="formData" 
      @update:visible="previewDialogVisible = $event"/>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, DataBoard, Check, Edit, Delete, CircleCloseFilled, Document } from '@element-plus/icons-vue'
import { getDxgjxPage, deleteDxgjx, getDxgjxById, updateStatus } from '@/api/clmanage/cl-dxgjx'
import addForm from './addRequest.vue'
import editForm from './editCheckRequest.vue'
import { baseURL } from '@/utils/request'
import { getNewNoNyName } from '@/api/system/basno'
import requestFormPreview from './requestFormPreview.vue'

const previewDialogVisible = ref(false)
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newCode = ref('')
const formData = ref({})

// =============== 状态常量定义 ===============
const STATUS_LABEL_MAP = {
  "10": "请检单录入",
  "20": "录入确认，待审核",
  "30": "审核通过，待检验",
  "40": "检验录入，待审核",
  "50": "检验完成",
  DEFAULT: "未知"
}

const STATUS_ICON_MAP = {
  "10": "Clock",
  "20": "CircleCheck",
  "30": "DataBoard",
  "40": "Check",
  "50": "Check",
  DEFAULT: "Clock"
}

const STATUS_TAG_TYPE_MAP = {
  "10": "info",
  "20": "primary",
  "30": "warning",
  "40": "success",
  "50": "success",
  DEFAULT: "info"
}

const STATUS_ACTION_MAP = {
  "10": [
    { action: "edit", text: "编辑", icon: "Edit", type: "primary" },
    { action: "delete", text: "删除", icon: "Delete", type: "danger" },
    { action: "confirm", text: "确认录入", icon: "CircleCheck", type: "success", targetStatus: "20" }
  ],
  "20": [
    { action: "cancelConfirm", text: "反确认", icon: "CircleCloseFilled", type: "info", targetStatus: "10" }
  ],
  "30": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ],
  "40": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ],
  "50": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ]
}

// =============== 状态工具函数 ===============
const getStatusLabel = (statusValue) => {
  return STATUS_LABEL_MAP[statusValue] ?? STATUS_LABEL_MAP.DEFAULT
}

const getStatusIcon = (statusValue) => {
  return STATUS_ICON_MAP[statusValue] ?? STATUS_ICON_MAP.DEFAULT
}

const getStatusTagType = (statusValue) => {
  return STATUS_TAG_TYPE_MAP[statusValue] ?? STATUS_TAG_TYPE_MAP.DEFAULT
}

const getStatusActions = (statusValue) => {
  return STATUS_ACTION_MAP[statusValue] ?? []
}

const getStatusActionText = (targetStatus) => {
  switch (targetStatus) {
    case "10": return "反确认"
    case "20": return "确认录入"
    case "30": return "审核通过"
    case "40": return "完成检验"
    case "50": return "入库"
    default: return "更新状态"
  }
}

// =============== 响应式数据 ===============
const queryParams = reactive({
  contractNo: '',
  contractName: '',
  basNo: '',
  status: '',
  pageNumber: 1,
  pageSize: 10
})

const galvanizedSteelStrandList = ref([])
const total = ref(0)
const loading = ref(false)

// =============== 业务方法 ===============
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('cl-ld')
    if (res?.code === 200) {
      console.log("获取铝锭编码成功", res.data.fullNoNyName)
      const newCode = res.data.fullNoNyName.replace('cl-ld', 'cl-dxgjx')
      console.log("替换后的镀锌钢绞线编码:", newCode)
      return newCode
    }
    ElMessage.error(res?.msg || '获取编码失败')
    return generateFrontendCode()
  } catch (error) {
    console.error('生成编码出错:', error)
    return generateFrontendCode()
  }
}

const generateFrontendCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  
  const storageKey = 'cl_dxgjx_sequence'
  let sequence = localStorage.getItem(storageKey)
  if (!sequence) {
    sequence = '1'
  } else {
    sequence = (parseInt(sequence) + 1).toString()
  }
  
  localStorage.setItem(storageKey, sequence)
  const formattedSequence = sequence.padStart(4, '0')
  const code = `cl-dxgjx${year}${month}${day}${formattedSequence}`
  console.log("前端生成编码:", code)
  return code
}

// 修复操作按钮点击处理
const handleActionClick = async (action, row) => {
  console.log('执行操作:', action.action, '数据:', row)
  
  try {
    switch (action.action) {
      case "edit":
        await handleEdit(row.id)
        break
      case "delete":
        await handleDelete(row)
        break
      case "preview":
        await handlePreview(row.id)
        break
      case "confirm":
      case "cancelConfirm":
        await handleStatusUpdate(row.id, action.targetStatus)
        break
      default:
        console.log("未知操作：", action.action)
    }
  } catch (error) {
    console.error('操作执行失败:', error)
    ElMessage.error('操作执行失败')
  }
}

// 修复状态更新方法
const handleStatusUpdate = async (orderId, targetStatus) => {
  try {
    await ElMessageBox.confirm(
      `确定要${getStatusActionText(targetStatus)}这条记录吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    const response = await updateStatus({ id: orderId, status: targetStatus })
    
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      await getGalvanizedSteelStrandList()
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败，请重试")
    }
  }
}

// 修复新增方法
const handleAdd = async () => {
  try {
    newCode.value = await generateNewCode()
    console.log("生成的编码:", newCode.value)
    addDialogVisible.value = true
  } catch (error) {
    console.error('新增操作失败:', error)
    ElMessage.error('新增操作失败')
  }
}

// 修复编辑方法
const handleEdit = async (id) => {
  try {
    console.log('开始编辑，ID:', id)
    const res = await getDxgjxById({ id: id })
    if (res?.code === 200 && res.data?.record) {
      formData.value = { ...res.data.record }
      console.log('编辑数据加载成功:', formData.value)
      editDialogVisible.value = true
    } else {
      ElMessage.error('获取数据失败')
    }
  } catch (error) {
    console.error('编辑操作失败:', error)
    ElMessage.error('编辑操作失败')
  }
}

// 修复预览方法
const handlePreview = async (id) => {
  try {
    console.log('开始预览，ID:', id)
    const res = await getDxgjxById({ id: id })
    if (res?.code === 200 && res.data?.record) {
      formData.value = { ...res.data.record }
      console.log('预览数据加载成功:', formData.value)
      previewDialogVisible.value = true
    } else {
      ElMessage.error('获取数据失败')
    }
  } catch (error) {
    console.error('预览操作失败:', error)
    ElMessage.error('预览操作失败')
  }
}

// 修复成功回调
const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('请检单记录新增成功')
  getGalvanizedSteelStrandList()
}

const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('请检单记录修改成功')
  getGalvanizedSteelStrandList()
}

// 修复查询方法
const handleSearch = () => {
  queryParams.pageNumber = 1 // 搜索时重置到第一页
  getGalvanizedSteelStrandList()
}

// 修复获取列表方法
const getGalvanizedSteelStrandList = async () => {
  loading.value = true
  try {
    console.log('查询参数:', queryParams)
    const res = await getDxgjxPage(queryParams)
    if (res?.code === 200) {
      galvanizedSteelStrandList.value = res.data.page?.list || []
      total.value = res.data.page?.totalRow || 0
      console.log('获取数据成功:', galvanizedSteelStrandList.value)
    } else {
      ElMessage.error(res?.msg || '获取数据失败')
      galvanizedSteelStrandList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取请检单列表失败', error)
    ElMessage.error('获取请检单列表失败')
    galvanizedSteelStrandList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 修复分页方法
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1 // 改变页大小时重置到第一页
  getGalvanizedSteelStrandList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getGalvanizedSteelStrandList()
}

// 修复刷新方法
const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.contractName = ''
  queryParams.basNo = ''
  queryParams.status = ''
  queryParams.pageNumber = 1
  getGalvanizedSteelStrandList()
}

// 修复删除方法
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认删除请检单记录"${row.basNo}"吗？此操作不可恢复。`,
      "提示",
      { 
        confirmButtonText: "确定", 
        cancelButtonText: "取消", 
        type: "warning",
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const response = await deleteDxgjx({ id: row.id })
    if (response?.code === 200) {
      ElMessage.success("删除成功")
      await getGalvanizedSteelStrandList()
    } else {
      ElMessage.error(response?.msg || "删除失败")
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error('删除失败:', error)
      ElMessage.error("删除失败")
    }
  }
}

const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

onMounted(() => {
  getGalvanizedSteelStrandList()
})
</script>

<style scoped>
.galvanized-steel-strand-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
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

.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.truncate {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-operations {
  color: #909399;
  font-style: italic;
}

/* 选中状态Radio按钮样式 */
:deep(.el-radio-button.is-checked .el-radio-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* 防止表头换行 */
:deep(.el-table .cell) {
  white-space: nowrap;
}

/* 针对表头单元格 */
:deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>把单据号查询功能删除