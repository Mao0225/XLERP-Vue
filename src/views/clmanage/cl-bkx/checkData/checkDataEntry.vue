<template>
  <div class="lockpin-ingot-management">
    <div class="action-bar">

      <div class="search-inputs">
                <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getLockpinIngotList" @keyup.enter="getLockpinIngotList" />
        <el-input v-model="queryParams.contractName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
          clearable @clear="getLockpinIngotList" @keyup.enter="getLockpinIngotList" />
        <el-input
          v-model="queryParams.mafactory"
          placeholder="请输入原材料制造商查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getLockpinIngotList"
          @keyup.enter="getLockpinIngotList"
        />
        <el-input
          v-model="queryParams.matRecheckNo"
          placeholder="请输入复检单号"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getLockpinIngotList"
          @keyup.enter="getLockpinIngotList"
        />
        <el-button type="primary" @click="getLockpinIngotList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
     </div>
    </div>

    <el-table :data="lockpinIngotList" border v-loading="loading" style="width: 100%">
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
      <el-table-column prop="matRecheckNo" label="复检单号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.matRecheckNo" placement="top">
            <span class="truncate">{{ row.matRecheckNo }}</span>
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
      <el-table-column prop="matMaterial" label="闭口销牌号" width="120">
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
      <el-table-column prop="appearanceSize" label="外形" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.appearanceSize" placement="top">
            <span class="truncate">{{ row.appearanceSize }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      
      <el-table-column prop="sampleQuantity" label="样品数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.sampleQuantity" placement="top">
            <span class="truncate">{{ row.sampleQuantity }} 件</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="specs" label="规格" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.specs" placement="top">
            <span class="truncate">{{ row.specs }} </span>
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
      <el-table-column prop="chemC" label="C(%)" width="90" />
      <el-table-column prop="chemSi" label="Si(%)" width="90" />
      <el-table-column prop="chemMn" label="Mn(%)" width="90" />
      <el-table-column prop="chemNi" label="Ni(%)" width="90" />
      <el-table-column prop="chemCr" label="Cr(%)" width="90" />

      <el-table-column prop="sizeS" label="S" width="90">
  <template #default="{ row }">
    <el-tooltip :content="getSizeValues(row, 'sizeS')" placement="top">
      <span class="truncate">{{ getSizeDisplay(row, 'sizeS') }}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="sizeD" label="d" width="90">
  <template #default="{ row }">
    <el-tooltip :content="getSizeValues(row, 'sizeD')" placement="top">
      <span class="truncate">{{ getSizeDisplay(row, 'sizeD') }}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="sizeBigD" label="D" width="90">
  <template #default="{ row }">
    <el-tooltip :content="getSizeValues(row, 'sizeBigD')" placement="top">
      <span class="truncate">{{ getSizeDisplay(row, 'sizeBigD') }}</span>
    </el-tooltip>
  </template>
</el-table-column>
<el-table-column prop="sizeL2" label="L2" width="90">
  <template #default="{ row }">
    <el-tooltip :content="getSizeValues(row, 'sizeL2')" placement="top">
      <span class="truncate">{{ getSizeDisplay(row, 'sizeL2') }}</span>
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
      <el-table-column prop="detectionTime" label="入厂检测日期" width="130" >
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

    <editForm
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit"
    />
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
import { Refresh, Clock, CircleCheck, Check, Box, Delete, Edit, CircleCloseFilled,Document } from '@element-plus/icons-vue'
import { getBkxPage, deleteBkx, getBkxById, updateStatus } from '@/api/clmanage/cl-bkx'
import { useRouter } from 'vue-router'
import editForm from './entryCheckDataForm.vue'
import { baseURL } from '@/utils/request'
import checkDataPreview from './checkDataPreview.vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

const previewDialogVisible = ref(false)

// 用于显示尺寸数据的方法
const getSizeDisplay = (row, prefix) => {
  // 获取前两个实测值用于表格显示
  const values = []
  for (let i = 1; i <= 2; i++) {
    if (row[`${prefix}${i}`]) {
      values.push(row[`${prefix}${i}`])
    }
  }
  return values.length > 0 ? values.join(',') + (values.length < 6 ? '...' : '') : '-'
}

// 用于tooltip显示全部实测值
const getSizeValues = (row, prefix) => {
  const values = []
  for (let i = 1; i <= 6; i++) {
    if (row[`${prefix}${i}`]) {
      values.push(`实测${i}: ${row[`${prefix}${i}`]}`)
    }
  }
  return values.length > 0 ? values.join('; ') : '无数据'
}

const handlePreview = async (id) => {
  const res = await getBkxById({ id: id })
  formData.value = res.data.record
  previewDialogVisible.value = true
}
// =============== 状态常量定义 ===============
// 状态值-名称映射表
const STATUS_LABEL_MAP = {
  "30": "待录入数据",
  "40": "录入确认，待审核",
  "50": "检验完成", 
  DEFAULT: "检验完成"
}

// 状态值-图标映射表
const STATUS_ICON_MAP = {
  "30": "Clock", // 时钟图标
  "40": "Edit", // 编辑图标
  "50": "CircleCheck", // 对勾圆图标
  DEFAULT: "Check"
}

// 状态值-Tag类型映射表
const STATUS_TAG_TYPE_MAP = {
  "30": "info", // 蓝色
  "40": "primary", // 深蓝色
  "50": "success", // 橙色
  DEFAULT: "success"
}

// 状态值-Radio按钮自定义类映射表
const STATUS_CLASS_MAP = {
  "30": "status-pending",
  "40": "status-data-entry",
  "50": "status-data-confirmed",
  DEFAULT: ""
}


// 状态操作权限映射（当前状态→可执行操作）
const STATUS_ACTION_MAP = {
  "30": [ // 待录入数据状态可执行操作
    { action: "edit", text: "录入数据", icon: "Edit", type: "primary" },
    { action: "confirmDataEntry", text: "确认录入", icon: "CircleCheck", type: "warning", targetStatus: "40" },
    { action: "delete", text: "删除", icon: "Delete", type: "danger" },
  ],
  "40": [ // 检验数据录入状态可执行操作
    { action: "backToPending", text: "撤回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "30" },
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }

  ],
  "50": [
            { action: "preview", text: "查看信息", icon: "Document", type: "primary" },
            
  ],
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
    case "30": return "撤回录入"
    case "40": return "确认录入"
    case "50": return "检验完成"
    default: return "更新状态"
  }
}

// =============== 响应式数据 ===============

const editDialogVisible = ref(false)
const formData = ref({})

const router = useRouter()

const queryParams = reactive({
  contractNo:'',
  contractName: '',
  mafactory: '',
  matRecheckNo: '',
  status: 30,//默认待录入数据从状态30开始
  pageNumber: 1,
  pageSize: 10
})

const lockpinIngotList = ref([])
const total = ref(0)
const loading = ref(false)

// 统一处理操作按钮点击
const handleActionClick = (action, row) => {
  switch (action.action) {
    case "edit":
      handleEdit(row.id)
      break
    case "preview":
      handlePreview(row.id)
      break
    case "startDataEntry":
    case "confirmDataEntry":
    case "auditPass":
    case "completeStorage":
    case "backToPending":
    case "backToDataEntry":
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
    const response = await updateStatus({ id: orderId, status: targetStatus,updatePerson:userStore.realName })
    
    // 处理结果
    if (response?.code === 200) {
      ElMessage.success(`${getStatusActionText(targetStatus)}成功`)
      getLockpinIngotList() // 重新加载表格数据
    } else {
      ElMessage.error(response?.msg || "状态更新失败")
    }
  } catch (error) {
    if (error !== "cancel") { // 排除用户取消操作
      ElMessage.error("操作失败，请重试")
    }
  }
}


const handleEdit = async (id) => {
  const res = await getBkxById({ id: id })
  formData.value = res.data.record
  editDialogVisible.value = true
}


const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('闭口销记录修改成功')
  getLockpinIngotList()
}

const getLockpinIngotList = async () => {
  loading.value = true
  try {
    
    const res = await getBkxPage(queryParams)
    lockpinIngotList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取闭口销列表失败', error)
    ElMessage.error('获取闭口销列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getLockpinIngotList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getLockpinIngotList()
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.contractName = ''
  queryParams.mafactory = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getLockpinIngotList()
}

const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

onMounted(() => {
  getLockpinIngotList()
})
</script>

<style scoped>
.lockpin-ingot-management {
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