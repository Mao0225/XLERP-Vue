<template>
  <div class="rubber-management">
    <div class="action-bar">
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
        <el-input
          v-model="queryParams.matname"
          placeholder="请输入材料名称查询"
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
        <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
      </div>
    </div>

    <!-- 添加滚动容器处理多列 -->
    <div class="table-container">
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
            <el-tooltip :content="String(row.basno)" placement="top">
              <span class="truncate">{{ row.basno }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        
        
        <el-table-column prop="mafactoryname" label="供应商名称" width="180">
          <template #default="{ row }">
            <el-tooltip :content="String(row.mafactoryname)" placement="top">
              <span class="truncate">{{ row.mafactoryname }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="matname" label="材料名称" width="120">
          <template #default="{ row }">
            <el-tooltip :content="String(row.matname)" placement="top">
              <span class="truncate">{{ row.matname }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="material" label="材质" width="100">
          <template #default="{ row }">
            <el-tooltip :content="String(row.material)" placement="top">
              <span class="truncate">{{ row.material }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="mattype" label="规格" width="100">
          <template #default="{ row }">
            <el-tooltip :content="String(row.mattype)" placement="top">
              <span class="truncate">{{ row.mattype }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="来料数量" width="100">
          <template #default="{ row }">
            <el-tooltip :content="String(row.quantity)" placement="top"> <!-- 转换为字符串 -->
              <span class="truncate">{{ row.quantity }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="sampleQuantity" label="抽检数量" width="100">
          <template #default="{ row }">
            <el-tooltip :content="String(row.sampleQuantity)" placement="top">
              <span class="truncate">{{ row.sampleQuantity }} 件</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="matdepartment" label="使用单位" width="120">
          <template #default="{ row }">
            <el-tooltip :content="String(row.matdepartment)" placement="top">
              <span class="truncate">{{ row.matdepartment }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="standard" label="执行标准" width="120">
          <template #default="{ row }">
            <el-tooltip :content="String(row.standard)" placement="top">
              <span class="truncate">{{ row.standard }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="leavefactoryDate" label="出厂日期" width="120">
          <template #default="{ row }">
            <el-tooltip :content="row.leavefactoryDate" placement="top">
              <span class="truncate">{{ row.leavefactoryDate }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="detectionTime" label="检验日期" width="120" />
        
        <el-table-column prop="appearanceResult" label="外形检测结果" width="120">
          <template #default="{ row }">
            <el-tag :type="row.appearanceResult === '合格' ? 'success' : 'danger'" size="small">
              {{ row.appearanceResult || '-' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="matjixiexingnengresult" label="硬度检测结果" width="120">
          <template #default="{ row }">
            <el-tooltip :content="String(row.matjixiexingnengresult)" placement="top">
              <span class="truncate">{{ row.matjixiexingnengresult || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="certificate" label="质量证明" width="100">
          <template #default="{ row }">
            <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
              <el-tooltip :content="file.name" placement="top">
                <span class="file-link" @click="openFileInNewWindow(file.url)">{{ file.name }}</span>
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
    </div>
    
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
    
    <!-- 新增表单对话框 -->
    <addForm
      :newCode="newCode"
      :visible="addDialogVisible"
      @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd"
    />
    
    <!-- 编辑表单对话框 -->
    <entry-check-data-form
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="(val) => (editDialogVisible = val)"
      @success="handleSuccessEdit"
    />
    
    <!-- 预览对话框 -->
    <check-data-preview
      :visible="previewDialogVisible"
      :initial-data="previewData"
      @update:visible="(val) => (previewDialogVisible = val)"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Clock, CircleCheck, Check, Delete, Edit, CircleCloseFilled, Document, Close } from '@element-plus/icons-vue'
import EntryCheckDataForm from './entryCheckDataForm.vue'
import CheckDataPreview from './checkDataPreview.vue'
 
import { getXjPage, getXjById, deleteXj, updateXjStatus } from '@/api/clmanage/cl-xj'
import { useUserStore } from '@/store/user'
import { getNewNoNyName } from '@/api/system/basno'
import { baseURL } from '@/utils/request'

const userStore = useUserStore()

// =============== 状态常量定义 ===============
// 状态值-名称映射表
const STATUS_LABEL_MAP = {
  "10": "检验单录入",
  "20": "待审核",
  "30": "待录入检验数据",
  "40": "待审核",
  "50": "检验完成",
  "60": "已驳回",
  DEFAULT: "未知状态"
}

// 状态值-图标映射表
const STATUS_ICON_MAP = {
  "10": "Clock",
  "20": "Clock",
  "30": "Edit",
  "40": "Clock",
  "50": "CircleCheck",
  "60": "Close",
  DEFAULT: "CircleCloseFilled"
}

// 状态值-Tag类型映射表
const STATUS_TAG_TYPE_MAP = {
  "10": "info",
  "20": "warning",
  "30": "primary",
  "40": "warning",
  "50": "success",
  "60": "danger",
  DEFAULT: "default"
}

// 状态操作权限映射（当前状态→可执行操作）
const STATUS_ACTION_MAP = {
  "30": [ // 待录入数据状态可执行操作
    { action: "edit", text: "录入数据", icon: "Edit", type: "primary" },
    { action: "confirmDataEntry", text: "确认录入", icon: "CircleCheck", type: "warning", targetStatus: "40" },
     
  ],
  "40": [ // 检验数据录入状态可执行操作
    { action: "backToPending", text: "撤回录入", icon: "CircleCloseFilled", type: "info", targetStatus: "30" },
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" }

  ],
  "50": [
    { action: "preview", text: "查看信息", icon: "Document", type: "primary" },
            
  ],
  "60": [
    { action: "edit", text: "录入数据", icon: "Edit", type: "primary" },
    { action: "confirmDataEntry", text: "确认录入", icon: "CircleCheck", type: "warning", targetStatus: "40" },
     
  ],
  default:[]
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
    case "10": return "退回编辑"
    case "30": return "审核通过"
    case "40": return "确认录入"
    case "50": return "审核通过"
    default: return "更新状态"
  }
}

// =============== 响应式数据 ===============
// 新增相关变量
const newCode = ref('')
const addDialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  contractno: '',
  mafactoryname: '',
  matRecheckNo: '',
  inNo: '',
  matname: '',
  status: ''  // 可根据需要添加默认状态筛选
})

// 橡胶列表数据
const rubberList = ref([])
const total = ref(0)
const loading = ref(false)

// 编辑/预览对话框数据
const editDialogVisible = ref(false)
const formData = ref({})
const previewDialogVisible = ref(false)
const previewData = ref({})

// =============== 业务方法 ===============
// 生成新的单据号
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('cl-xj')
    if (res?.code === 200) {
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

// 新增按钮点击事件
const handleAdd = async () => {
  newCode.value = await generateNewCode()
  addDialogVisible.value = true
}

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

// 处理编辑
const handleEdit = async (id) => {
  const res = await getXjById(id)
  formData.value = res.data.record
  editDialogVisible.value = true
}

// 处理预览
const handlePreview = async (id) => {
  const res = await getXjById(id)
  previewData.value = res.data.record
  previewDialogVisible.value = true
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除橡胶检验记录"${row.basno}"吗？`,
      "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    )
    
    await deleteXj(row.id)
    ElMessage.success('橡胶检验记录删除成功')
    getRubberList()
  } catch (error) {
    if (error !== "cancel") {
      console.error('删除橡胶检验记录失败', error)
      ElMessage.error('删除橡胶检验记录失败')
    }
  }
}

// 统一处理操作按钮点击
const handleActionClick = (action, row) => {
  switch (action.action) {
    case "edit":
      handleEdit(row.id)
      break
    case "preview":
      handlePreview(row.id)
      break
    case "delete":
      handleDelete(row)
      break
    case "confirmDataEntry":
    case "auditPass":
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
    const response = await updateXjStatus({ 
      id: orderId, 
      status: targetStatus,
      updatePerson: userStore.realName 
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

// 新增成功回调
const handleSuccessAdd = () => {
  addDialogVisible.value = false
  ElMessage.success('橡胶检验记录新增成功')
  getRubberList()
}

// 编辑成功回调
const handleSuccessEdit = () => {
  editDialogVisible.value = false
  ElMessage.success('橡胶检验记录修改成功')
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
  queryParams.matname = ''
  queryParams.pageNumber = 1
  getRubberList()
}

// 打开质量证明文件
const openFileInNewWindow = (url) => {
  window.open(baseURL + url, '_blank')
}

// 页面挂载时获取列表
onMounted(() => {
  getRubberList()
})
</script>

<style scoped>
.rubber-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap; /* 允许搜索栏在小屏幕换行 */
  gap: 10px;
}

.search-inputs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.table-container {
  overflow-x: auto; /* 允许表格水平滚动 */
  margin-bottom: 16px;
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

.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}

.no-operations {
  color: #909399;
  font-style: italic;
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