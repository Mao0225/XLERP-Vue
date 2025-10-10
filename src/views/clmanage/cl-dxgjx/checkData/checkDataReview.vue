<template>
  <div class="galvanized-steel-strand-management">
    <div class="action-bar">
      <div class="search-inputs">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getGalvanizedSteelStrandList" @keyup.enter="getGalvanizedSteelStrandList" />
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getGalvanizedSteelStrandList" @keyup.enter="getGalvanizedSteelStrandList" />
        <el-input
          v-model="queryParams.mafactory"
          placeholder="请输入原材料制造商查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getGalvanizedSteelStrandList"
          @keyup.enter="getGalvanizedSteelStrandList"
        />
        <el-input
          v-model="queryParams.matRecheckNo"
          placeholder="请输入复检单号"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getGalvanizedSteelStrandList"
          @keyup.enter="getGalvanizedSteelStrandList"
        />
        <el-button type="primary" @click="getGalvanizedSteelStrandList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
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
      <el-table-column prop="matRecheckNo" label="复检单号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.matRecheckNo" placement="top">
            <span class="truncate">{{ row.matRecheckNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="batchNum" label="批次号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.batchNum" placement="top">
            <span class="truncate">{{ row.batchNum }}</span>
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
      <el-table-column prop="matMaterial" label="牌号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.matMaterial" placement="top">
            <span class="truncate">{{ row.matMaterial }}</span>
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
      <el-table-column prop="standard" label="检验标准" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.standard" placement="top">
            <span class="truncate">{{ row.standard }}</span>
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
      <el-table-column prop="appearanceSize" label="外观尺寸" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.appearanceSize" placement="top">
            <span class="truncate">{{ row.appearanceSize }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="mechInspQty" label="力学性能抽检数" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.mechInspQty" placement="top">
            <span class="truncate">{{ row.mechInspQty }} 件</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <!-- 力学性能字段 -->
      <el-table-column prop="monoStrengthRequired" label="单丝强度要求值(MPa)" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.monoStrengthRequired" placement="top">
            <span class="truncate">{{ row.monoStrengthRequired }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="monoStrengthA" label="单丝强度A(MPa)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.monoStrengthA" placement="top">
            <span class="truncate">{{ row.monoStrengthA }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="monoStrengthB" label="单丝强度B(MPa)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.monoStrengthB" placement="top">
            <span class="truncate">{{ row.monoStrengthB }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="monoStrengthC" label="单丝强度C(MPa)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.monoStrengthC" placement="top">
            <span class="truncate">{{ row.monoStrengthC }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="breakingForceRequired" label="破断拉力要求值(kN)" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.breakingForceRequired" placement="top">
            <span class="truncate">{{ row.breakingForceRequired }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="breakingForceA" label="破断拉力A(kN)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.breakingForceA" placement="top">
            <span class="truncate">{{ row.breakingForceA }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="breakingForceB" label="破断拉力B(kN)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.breakingForceB" placement="top">
            <span class="truncate">{{ row.breakingForceB }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="breakingForceC" label="破断拉力C(kN)" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.breakingForceC" placement="top">
            <span class="truncate">{{ row.breakingForceC }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="checkWriter" label="检验人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checkWriter" placement="top">
            <span class="truncate">{{ row.checkWriter }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checkAuditor" label="审核人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checkAuditor" placement="top">
            <span class="truncate">{{ row.checkAuditor }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="请检单备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.memo" placement="top">
            <span class="truncate">{{ row.memo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checkMemo" label="复检备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.checkMemo" placement="top">
            <span class="truncate">{{ row.checkMemo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="detectionTime" label="入厂检测日期" width="130">
        <template #default="{ row }">
          <el-tooltip :content="row.detectionTime" placement="top">
            <span class="truncate">{{ row.detectionTime }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="certificate" label="质量证明" width="100">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <el-tooltip :content="file.name" placement="top">
              <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">{{ file.name }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      
      <!-- 操作列使用动态按钮 -->
      <el-table-column label="操作" width="300" fixed="right">
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
        @current-change="handleCurrentChange"
      />
    </div>

    <checkDataPreview
      :visible="previewDialogVisible"
      :initial-data="formData"
      @update:visible="previewDialogVisible = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, Check, Box, Delete, Edit, CircleCloseFilled, Document } from '@element-plus/icons-vue'
import { getDxgjxPage, getDxgjxById, updateStatus } from '@/api/clmanage/cl-dxgjx'
import { baseURL } from '@/utils/request'
import checkDataPreview from './checkDataPreview.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const previewDialogVisible = ref(false)
const handlePreview = async (id) => {
  const res = await getDxgjxById({ id: id })
  formData.value = res.data.record
  previewDialogVisible.value = true
}

// =============== 状态常量定义 ===============
const STATUS_LABEL_MAP = {
  "40": "待审核",
  "50": "检验完成", 
  DEFAULT: "未知"
}

const STATUS_ICON_MAP = {
  "40": "Edit",
  "50": "CircleCheck",
  DEFAULT: "Clock"
}

const STATUS_TAG_TYPE_MAP = {
  "40": "warning",
  "50": "success",
  DEFAULT: "info"
}

const STATUS_ACTION_MAP = {
  "40": [
    { action: "auditPass", text: "审核通过", icon: "Check", type: "success", targetStatus: "50" },
    { action: "backToDataEntry", text: "退回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "30" },
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ],
  "50": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }
  ],
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
    case "40": return "退回录入"
    case "50": return "确认审核通过"
    default: return "更新状态"
  }
}

const formData = ref({})

const queryParams = reactive({
  contractNo: '',
  contractName: '',
  mafactory: '',
  matRecheckNo: '',
  status: 40,
  pageNumber: 1,
  pageSize: 10
})

const galvanizedSteelStrandList = ref([])
const total = ref(0)
const loading = ref(false)

// =============== 业务方法 ===============
const handleActionClick = (action, row) => {
  switch (action.action) {
    case "preview":
      handlePreview(row.id)
      break
    case "auditPass":
    case "backToDataEntry":
      handleStatusUpdate(row.id, action.targetStatus)
      break
    default:
      console.log("未知操作：", action.action)
  }
}

const handleStatusUpdate = async (orderId, targetStatus) => {
  try {
    await ElMessageBox.confirm(
      `确定要${getStatusActionText(targetStatus)}这条记录吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    const response = await updateStatus({ id: orderId, status: targetStatus, updatePerson: userStore.realName })
    
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      getGalvanizedSteelStrandList()
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("操作失败，请重试")
    }
  }
}

const getGalvanizedSteelStrandList = async () => {
  loading.value = true
  try {
    const res = await getDxgjxPage(queryParams)
    galvanizedSteelStrandList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取镀锌钢绞线列表失败', error)
    ElMessage.error('获取镀锌钢绞线列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getGalvanizedSteelStrandList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getGalvanizedSteelStrandList()
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.contractName = ''
  queryParams.mafactory = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getGalvanizedSteelStrandList()
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

/* 状态Radio按钮基础样式 */
:deep(.el-radio-button__inner) {
  border-radius: 4px;
  padding: 6px 16px;
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