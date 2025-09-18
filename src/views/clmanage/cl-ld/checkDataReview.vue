<template>
  <div class="aluminum-ingot-management">
    <div class="action-bar">

      <div class="search-inputs">
        <el-input
          v-model="queryParams.mafactory"
          placeholder="请输入原材料制造商查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-input
          v-model="queryParams.inNo"
          placeholder="请输入入库单号查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-input
          v-model="queryParams.matMaterial"
          placeholder="请输入铝锭牌号查询"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-input
          v-model="queryParams.matRecheckNo"
          placeholder="请输入来料检验批次号"
          style="width: 200px; margin-right: 10px;"
          clearable
          @clear="getAluminumIngotList"
          @keyup.enter="getAluminumIngotList"
        />
        <el-button type="primary" @click="getAluminumIngotList">搜索</el-button>
        <el-button type="warning" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon> 刷新
        </el-button>
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
      <el-table-column prop="matRecheckNo" label="检验批次号" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.matRecheckNo" placement="top">
            <span class="truncate">{{ row.matRecheckNo }}</span>
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
      <el-table-column prop="matMaterial" label="铝锭牌号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.matMaterial" placement="top">
            <span class="truncate">{{ row.matMaterial }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="material" label="材料" width="100">
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
      <el-table-column prop="quantity" label="数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.quantity" placement="top">
            <span class="truncate">{{ row.quantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sampleQuantity" label="样品数量" width="90">
        <template #default="{ row }">
          <el-tooltip :content="row.sampleQuantity" placement="top">
            <span class="truncate">{{ row.sampleQuantity }} t</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="inNo" label="入库单号" width="120">
        <template #default="{ row }">
          <el-tooltip :content="row.inNo" placement="top">
            <span class="truncate">{{ row.inNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="检验人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.checker" placement="top">
            <span class="truncate">{{ row.checker }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="auditor" label="审核人" width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.auditor" placement="top">
            <span class="truncate">{{ row.auditor }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="chemAl" label="Al(%)" width="90" />
      <el-table-column prop="chemSi" label="Si(%)" width="90" />
      <el-table-column prop="chemFe" label="Fe(%)" width="90" />
      <el-table-column prop="chemCu" label="Cu(%)" width="90" />
      <el-table-column prop="chemNi" label="Ni(%)" width="90" />
      <el-table-column prop="chemMn" label="Mn(%)" width="90" />
      <el-table-column prop="chemZn" label="Zn(%)" width="90" />
      <el-table-column prop="chemTi" label="Ti(%)" width="90" />
      <el-table-column prop="chemMg" label="Mg(%)" width="90" />
      <el-table-column prop="memo" label="备注" width="140">
        <template #default="{ row }">
          <el-tooltip :content="row.memo" placement="top">
            <span class="truncate">{{ row.memo }}</span>
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
      <el-table-column prop="writeTime" label="录入时间" width="140" >
        <template #default="{ row }">
          <el-tooltip :content="row.writeTime" placement="top">
            <span class="truncate">{{ row.writeTime }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="leavefactoryDate" label="出厂日期" width="120" >
        <template #default="{ row }">
          <el-tooltip :content="row.leavefactoryDate" placement="top">
            <span class="truncate">{{ row.leavefactoryDate }}</span>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, Check, Box, Delete, Edit, CircleCloseFilled } from '@element-plus/icons-vue'
import { getLdPage, deleteLd, getLdById, updateStatus } from '@/api/clmanage/cl-ld'
import { useRouter } from 'vue-router'
import { baseURL } from '@/utils/request'
import { getNewNoNyName } from '@/api/system/basno'

// =============== 状态常量定义 ===============
// 状态值-名称映射表
const STATUS_LABEL_MAP = {
  "40": "待审核",
  "50": "检验完成", 
  DEFAULT: "未知"
}

// 状态值-图标映射表
const STATUS_ICON_MAP = {
  "40": "Edit", // 编辑图标
  "50": "CircleCheck", // 对勾圆图标
  DEFAULT: "Clock"
}

// 状态值-Tag类型映射表
const STATUS_TAG_TYPE_MAP = {
  "40": "warning", // 深蓝色
  "50": "success", // 橙色
  DEFAULT: "info"
}

// 状态值-Radio按钮自定义类映射表
const STATUS_CLASS_MAP = {
  "40": "status-data-entry",
  "50": "status-data-confirmed",
  DEFAULT: ""
}


// 状态操作权限映射（当前状态→可执行操作）
const STATUS_ACTION_MAP = {

  "40": [ // 检验数据录入状态可执行操作
    { action: "auditPass", text: "审核通过", icon: "Check", type: "success", targetStatus: "50" },
    { action: "backToDataEntry", text: "退回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "30" }
  ],
  "50": [ // 检验数据录入确认状态可执行操作
    // { action: "backToDataEntry", text: "返回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "40" }
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
    case "40": return "退回录入"
    case "50": return "确认审核通过"
    default: return "更新状态"
  }
}

// =============== 响应式数据 ===============
const newCode = ref('')
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const formData = ref({})


const queryParams = reactive({
  mafactory: '',
  inNo: '',
  matMaterial: '',
  matRecheckNo: '',
  status: 40,//默认待审核数据从状态40开始
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
    const res = await getNewNoNyName('cl-ld')
    
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
  const res = await getLdById({ id: id })
  formData.value = res.data.record
  editDialogVisible.value = true
}

const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('铝锭记录新增成功')
  getAluminumIngotList()
}

const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('铝锭记录修改成功')
  getAluminumIngotList()
}

const getAluminumIngotList = async () => {
  loading.value = true
  try {
    
    const res = await getLdPage(queryParams)
    aluminumIngotList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取铝锭列表失败', error)
    ElMessage.error('获取铝锭列表失败')
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
  queryParams.mafactory = ''
  queryParams.inNo = ''
  queryParams.matMaterial = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getAluminumIngotList()
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