<!-- 请检数据录入 -->
<template>
  <div class="rubber-inspection-management">
    <div class="action-bar">
      <div class="search-inputs">
        <el-input v-model="queryParams.contractno" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getRubberList" @keyup.enter="getRubberList" />
        <el-input v-model="queryParams.mafactoryname" placeholder="请输入制造商查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getRubberList" @keyup.enter="getRubberList" />
        <el-input v-model="queryParams.basno" placeholder="请输入单据号查询" style="width: 200px; margin-right: 10px;" clearable
          @clear="getRubberList" @keyup.enter="getRubberList" />
        <el-button type="primary" @click="getRubberList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <el-table :data="rubberList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      
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
      
      <el-table-column prop="contractno" label="合同编号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.contractno" placement="top">
            <span class="truncate">{{ row.contractno }}</span>
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
      <el-table-column prop="mafactoryname" label="制造商" width="160">
        <template #default="{ row }">
          <el-tooltip :content="row.mafactoryname" placement="top">
            <span class="truncate">{{ row.mafactoryname }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="material" label="材质" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.material" placement="top">
            <span class="truncate">{{ row.material }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="mattype" label="型号" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.mattype" placement="top">
            <span class="truncate">{{ row.mattype }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="quantity" label="送货数量" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.quantity" placement="top">
            <span class="truncate">{{ row.quantity }} {{ row.unit || '个' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="sampleQuantity" label="验收数量" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.sampleQuantity" placement="top">
            <span class="truncate">{{ row.sampleQuantity }} {{ row.unit || '个' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="shijidanjia" label="单价" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.shijidanjia" placement="top">
            <span class="truncate">{{ row.shijidanjia }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="shijiamount" label="总价" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.shijiamount" placement="top">
            <span class="truncate">{{ row.shijiamount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column prop="writer" label="录入人" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.writer" placement="top">
            <span class="truncate">{{ row.writer }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button 
              v-for="action in getAvailableActions(row.status)" 
              :key="action.action"
              :type="action.type"
              size="small"
              icon="action.icon"
              @click="handleActionClick(action, row)"
            >
              <el-icon><component :is="action.icon" /></el-icon>
              {{ action.text }}
            </el-button>
            <span v-if="getAvailableActions(row.status).length === 0" class="no-operations">
              无操作
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 新增请检单对话框 -->
    <addRequest 
      :visible="addDialogVisible" 
      @update:visible="(val) => addDialogVisible = val"
      @success="handleSuccessAdd"
    />
    
    <!-- 编辑请检单对话框 -->
    <editCheckRequest 
      :visible="editDialogVisible" 
      :id="currentEditId"
      @update:visible="(val) => editDialogVisible = val"
      @success="handleSuccessEdit"
    />
    
    <!-- 预览请检单对话框 -->
    <requestFormPreview 
      :visible="previewDialogVisible" 
      :initial-data="previewData"
      @update:visible="(val) => previewDialogVisible = val"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, DataBoard, Check, Edit, Delete, Document, CircleCloseFilled } from '@element-plus/icons-vue'
import { getXjPage, deleteXj, getXjById, updateXjStatus } from '@/api/clmanage/cl-xj'
import AddRequest from './addRequest.vue'
import EditCheckRequest from './editCheckRequest.vue'
import requestFormPreview from './requestFormPreview.vue'
import { baseURL } from '@/utils/request'
import { getNewNoNyName } from '@/api/system/basno'
import { useUserStore } from '@/store/user' // 新增：导入用户存储


// 预览相关
const previewDialogVisible = ref(false)
const previewData = ref({})

// 新增：获取用户信息
const userStore = useUserStore()

// =============== 状态常量定义 ===============
// 状态值-名称映射表
const STATUS_LABEL_MAP = {
  "10": "请检单录入",
  "20": "录入确认，待审核",
  "30": "审核通过，待检验",
  "40": "检验录入，待审核",
  "50": "检验完成",
  DEFAULT: "未知"
}

// 状态值-图标映射表
const STATUS_ICON_MAP = {
  "10": "Clock",
  "20": "CircleCheck",
  "30": "DataBoard",
  "40": "Check",
  "50": "Check",
  DEFAULT: "Clock"
}

// 状态值-Tag类型映射表
const STATUS_TAG_TYPE_MAP = {
  "10": "info",
  "20": "primary",
  "30": "warning",
  "40": "success",
  "50": "success",
  DEFAULT: "info"
}

// 状态操作权限映射（当前状态→可执行操作）
const STATUS_ACTION_MAP = {
  "10": [ // 录入状态可执行操作
    { action: "edit", text: "编辑", icon: "Edit", type: "primary" },
    { action: "delete", text: "删除", icon: "Delete", type: "danger" },
    { action: "confirm", text: "确认", icon: "CircleCheck", type: "success", targetStatus: "20" },
    { action: "preview", text: "预览", icon: "Document", type: "info" }
  ],
  "20": [ // 待审核状态可执行操作
    { action: "preview", text: "预览", icon: "Document", type: "info" },
    { action: "cancelConfirm", text: "取消确认", icon: "CircleCloseFilled", type: "warning", targetStatus: "10" }
  ],
  "30": [ // 待检验状态可执行操作
    { action: "preview", text: "预览", icon: "Document", type: "info" }
  ],
  "40": [ // 检验待审核状态可执行操作
    { action: "preview", text: "预览", icon: "Document", type: "info" }
  ],
  "50": [ // 检验完成状态可执行操作
    { action: "preview", text: "预览", icon: "Document", type: "info" }
  ],
  DEFAULT: []
}

// =============== 状态相关方法 ===============
// 获取状态显示文本
const getStatusLabel = (status) => {
  return STATUS_LABEL_MAP[status] || STATUS_LABEL_MAP.DEFAULT
}

// 获取状态对应的图标
const getStatusIcon = (status) => {
  return STATUS_ICON_MAP[status] || STATUS_ICON_MAP.DEFAULT
}

// 获取状态对应的Tag类型
const getStatusTagType = (status) => {
  return STATUS_TAG_TYPE_MAP[status] || STATUS_TAG_TYPE_MAP.DEFAULT
}

// 获取状态对应的操作文本
const getStatusActionText = (status) => {
  switch (status) {
    case "20": return "确认"
    case "10": return "取消确认"
    case "30": return "审核通过"
    case "40": return "完成检验"
    case "50": return "入库"
    default: return "更新状态"
  }
}

// 获取当前状态可用的操作
const getAvailableActions = (status) => {
  return STATUS_ACTION_MAP[status] || STATUS_ACTION_MAP.DEFAULT
}

// =============== 响应式数据 ===============
const newCode = ref('')
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentEditId = ref('')
const formData = ref({})

const queryParams = reactive({
  contractno: '',
  mafactoryname: '',
  basno: '',
  status: '',
  pageNumber: 1,
  pageSize: 10
})

const rubberList = ref([])
const total = ref(0)
const loading = ref(false)

// =============== 业务方法 ===============
// 生成新的单据号编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('cl-xj')
    if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName)
      return res.data.fullNoNyName
    }
    ElMessage.error(res?.msg || '获取编码失败')
    return ''
  } catch (error) {
    console.error('生成编码出错:', error)
    ElMessage.error('请求编码服务时发生错误')
    return ''
  }
}

// 统一处理操作按钮点击
const handleActionClick = (action, row) => {
  switch (action.action) {
    case "edit":
      handleEdit(row.id)
      break
    case "delete":
      handleDelete(row)
      break
    case "preview":
      handlePreview(row.id)
      break
    case "confirm":
    case "cancelConfirm":
    case "audit":
      // 状态更新类操作，调用通用状态更新方法
      handleStatusUpdate(row.id, action.targetStatus)
      break
    default:
      console.log("未知操作：", action.action)
  }
}

// 编辑请检单
const handleEdit = async (id) => {
  currentEditId.value = id
  editDialogVisible.value = true
}

// 预览请检单
const handlePreview = async (id) => {
  try {
    const res = await getXjById(id)
    if (res?.code === 200) {
      previewData.value = res.data.record
      previewDialogVisible.value = true
    } else {
      ElMessage.error(res?.msg || "获取请检单详情失败")
    }
  } catch (error) {
    console.error('获取请检单详情失败', error)
    ElMessage.error('获取请检单详情失败')
  }
}

// 新增请检单
const handleAdd = async () => {
  const code = await generateNewCode()
  if (code) {
    addDialogVisible.value = true
  }
}

// 执行状态更新（通用方法）
const handleStatusUpdate = async (orderId, targetStatus) => {
  try {
    await ElMessageBox.confirm(
      `确定要${getStatusActionText(targetStatus)}这条记录吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    // 修复：移除updatePerson参数，与后端接口保持一致
    const response = await updateXjStatus({ 
      id: orderId, 
      status: targetStatus
    })
    
    // 处理结果
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      getRubberList() // 重新加载表格数据
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") { // 排除用户取消操作
      ElMessage.error("操作失败，请重试")
    }
  }
}

// 处理新增成功
const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('请检单记录新增成功')
  getRubberList()
}

// 处理编辑成功
const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('请检单记录修改成功')
  getRubberList()
}

// 获取橡胶检验列表
const getRubberList = async () => {
  loading.value = true
  try {
    const res = await getXjPage(queryParams)
    rubberList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取请检单列表失败', error)
    ElMessage.error('获取请检单列表失败')
  } finally {
    loading.value = false
  }
}

// 分页大小改变
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getRubberList()
}

// 当前页码改变
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getRubberList()
}

// 刷新
const handleRefresh = () => {
  queryParams.contractno = ''
  queryParams.mafactoryname = ''
  queryParams.basno = ''
  queryParams.status = ''
  queryParams.pageNumber = 1
  getRubberList()
}

// 删除请检单
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认删除请检单记录"${row.basno}"吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    // 修复：确保正确传递id参数
    const response = await deleteXj(row.id)
    if (response?.code === 200) {
      ElMessage.success("删除成功")
      getRubberList()
    } else {
      ElMessage.error(response?.msg || "删除失败")
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败")
    }
  }
}

// 打开文件
const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

// 页面挂载时加载数据
onMounted(() => {
  getRubberList()
})
</script>

<style scoped>
.rubber-inspection-management {
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

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
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
</style>