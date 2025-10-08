<!-- 请检数据录入 -->
<template>
  <div class="aluminum-ingot-management">
    <div class="action-bar">

      <div class="search-inputs">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getAluminumIngotList" @keyup.enter="getAluminumIngotList" />
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getAluminumIngotList" @keyup.enter="getAluminumIngotList" />
        <el-input v-model="queryParams.basNo" placeholder="请输入单据号查询" style="width: 200px; margin-right: 10px;" clearable
          @clear="getAluminumIngotList" @keyup.enter="getAluminumIngotList" />
        <el-button type="primary" @click="getAluminumIngotList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <el-table :data="aluminumIngotList" border v-loading="loading" style="width: 100%">
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
            <el-table-column prop="batchNo" label="炉批号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.batchNo" placement="top">
            <span class="truncate">{{ row.batchNo }}</span>
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
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <addForm :newCode="newCode" :visible="addDialogVisible" @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd" />
    <editForm :visible="editDialogVisible" :initial-data="formData" @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit" />
    <requestFormPreview :visible="previewDialogVisible" :initial-data="formData" @update:visible="previewDialogVisible = $event"/>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, DataBoard, Check, Edit, Delete, CircleCloseFilled,Document} from '@element-plus/icons-vue'
import { getTbPage, deleteTb, getTbById, updateStatus } from '@/api/clmanage/cl-tb'
import addForm from './addRequest.vue'
import editForm from './editCheckRequest.vue'
import { baseURL } from '@/utils/request'
import { getNewNoNyName } from '@/api/system/basno'
import requestFormPreview from './requestFormPreview.vue'



const previewDialogVisible = ref(false)
// =============== 状态常量定义 ===============
// 状态值-名称映射表
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
    { action: "confirm", text: "确认录入", icon: "CircleCheck", type: "success", targetStatus: "20" }
  ],
  "20": [ // 确认状态可执行操作
    { action: "cancelConfirm", text: "反确认", icon: "CircleCloseFilled", type: "info", targetStatus: "10" }
  ],
  "30": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ], // 检验录入完成状态无操作
  "40": [
        { action: "preview", text: "查看信息", icon: "Document", type: "primary" }

  ], // 检验审核完成状态无操作
  "50": [
        { action: "preview", text: "查看信息", icon: "Document", type: "primary" }

  ]  // 已入库状态无操作
}

// =============== 状态工具函数 ===============
// 获取状态名称
const getStatusLabel = (statusValue) => {
  return STATUS_LABEL_MAP[statusValue] ?? STATUS_LABEL_MAP.DEFAULT
}

// 获取状态对应图标
const getStatusIcon = (statusValue) => {
  return STATUS_ICON_MAP[statusValue] ?? STATUS_ICON_MAP.DEFAULT
}

// 获取状态Tag组件类型
const getStatusTagType = (statusValue) => {
  return STATUS_TAG_TYPE_MAP[statusValue] ?? STATUS_TAG_TYPE_MAP.DEFAULT
}



// 获取当前状态可执行操作列表
const getStatusActions = (statusValue) => {
  return STATUS_ACTION_MAP[statusValue] ?? []
}

// 根据目标状态获取操作文本
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
const newCode = ref('')
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const formData = ref({})

const queryParams = reactive({
  contractNo: '',
  contractName: '',
  basNo: '',
  status: '', // 添加状态筛选参数
  pageNumber: 1,
  pageSize: 10
})

const aluminumIngotList = ref([])
const total = ref(0)
const loading = ref(false)

// =============== 业务方法 ===============
// 生成新的单据号编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('cl-tb')
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
    case "audit":
    case "cancelConfirm":
      // 状态更新类操作，调用通用状态更新方法
      handleStatusUpdate(row.id, action.targetStatus)
      break
    default:
      console.log("未知操作：", action.action)
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
    
    // 调用接口更新状态
    const response = await updateStatus({ id: orderId, status: targetStatus })
    
    // 处理结果
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      getAluminumIngotList() // 重新加载表格数据
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") { // 排除用户取消操作
      ElMessage.error("操作失败，请重试")
    }
  }
}

const handleAdd = async () => {
  newCode.value = await generateNewCode()
  console.log("newCode.value", newCode.value)
  addDialogVisible.value = true
}

const handleEdit = async (id) => {
  const res = await getTbById({ id: id })
  formData.value = res.data.record
  editDialogVisible.value = true
}

const handlePreview = async (id) => {
  const res = await getTbById({ id: id })
  formData.value = res.data.record
  previewDialogVisible.value = true
}

const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('请检单记录新增成功')
  getAluminumIngotList()
}

const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('请检单记录修改成功')
  getAluminumIngotList()
}

const getAluminumIngotList = async () => {
  loading.value = true
  try {
    const res = await getTbPage(queryParams)
    aluminumIngotList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取请检单列表失败', error)
    ElMessage.error('获取请检单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getAluminumIngotList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getAluminumIngotList()
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.contractName = ''
  queryParams.basNo = ''
  queryParams.status = ''
  queryParams.pageNumber = 1
  getAluminumIngotList()
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认删除请检单记录"${row.basNo}"吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    const response = await deleteTb({ id: row.id })
    if (response?.code === 200) {
      ElMessage.success("删除成功")
      getAluminumIngotList()
    } else {
      ElMessage.error(response?.msg || "删除失败")
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败")
    }
  }
}

const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

onMounted(() => {
  getAluminumIngotList()
})
</script>

<style scoped>
.aluminum-ingot-management {
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
</style>