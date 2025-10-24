<template>
  <CustomDialog
    :visible="dialogVisible"
    title="排产计划管理"
    :close-on-click-modal="false"
    width="95%"
    height="90vh"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    class="schedule-plan-dialog"
  >

    <!-- 新增：加载转圈动画（加载时显示，覆盖所有内容） -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <!-- Element Plus 自带的加载组件 -->
      <el-spinner type="line" size="48" />
      <p class="loading-text">正在加载排产数据...</p>
    </div>
  </div>
    <!-- ==================== 合同信息 ==================== -->
    <el-card v-if="contractInfo" class="contract-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">合同信息</span>
        </div>
      </template>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item
          v-for="item in contractFields"
          :key="item.field"
          :label="item.label"
          :span="1"
        >
          <el-tooltip
            :content="contractInfo[item.field] ?? '—'"
            placement="top"
            effect="dark"
          >
            <span class="readonly-text ellipsis">
              {{ contractInfo[item.field] ?? '—' }}
            </span>
          </el-tooltip>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- ==================== 排产计划表格 ==================== -->
    <el-card class="material-card" shadow="never">
      <template #header>
          <div class="card-header">
            <!-- 标题区域 -->
            <span class="card-title">
              排产计划明细 ({{ materialList.length }} 项)
            </span>
            <!-- 按钮区域 -->
            <span class="header-button">
              <el-button
                type="primary"
                size="small"
                :disabled="!selectedRows.length"
                @click="batchDateDialogVisible = true"
              >
                批量设置日期 ({{ selectedRows.length }})
              </el-button>
              <el-button
                type="success"
                size="small"
                :disabled="!selectedRows.length"
                @click="batchConfirm"
              >
                批量确认 ({{ selectedRows.length }})
              </el-button>
            </span>
          </div>
      </template>

      <el-table
        :data="materialList"
        border
        style="width: 100%"
        max-height="500"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        ref="tableRef"
      >
        <!-- 多选框：只允许 status !== '20' 被勾选 -->
        <el-table-column type="selection" width="55" fixed="left" :selectable="isRowSelectable" />

        <!-- 状态 -->
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small" effect="dark">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 排产计划编码 -->
        <el-table-column label="排产计划编码" width="160">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.scheduleCode || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 计划开始 -->
        <el-table-column label="计划开始" width="120">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.planStartDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 计划完成 -->
        <el-table-column label="计划完成" width="120">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.planFinishDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 最晚交付 -->
        <el-table-column label="最晚交付" width="120">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.dueDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 计划工期 -->
        <el-table-column label="计划工期(天)" width="100" align="center">
          <template #default="{ row }">
            {{ row.planPeriod ?? '-' }}
          </template>
        </el-table-column>

        <!-- 实际开始 -->
        <el-table-column label="实际开始" width="120">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.actualStartDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 实际完成 -->
        <el-table-column label="实际完成" width="120">
          <template #default="{ row }">
            <span :class="{ 'confirmed-text': isConfirmed(row) }">
              {{ row.actualFinishDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <!-- 物料信息 -->
        <el-table-column prop="itemNo" label="物料编号" show-overflow-tooltip />
        <el-table-column prop="itemName" label="物料名称" show-overflow-tooltip />
        <el-table-column prop="itemSpec" label="规格型号" show-overflow-tooltip />
        <el-table-column prop="itemnum" label="数量" width="80" align="center" />
        <el-table-column prop="itemunit" label="单位" width="70" align="center" />
        <el-table-column prop="itemweight" label="单重(kg)" width="90" align="right" />
        <el-table-column label="总重(kg)" width="100" align="right">
          <template #default="{ row }">
            {{ row.itemweight && row.itemnum ? (row.itemweight * row.itemnum).toFixed(2) : '-' }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row, $index }">
            <template v-if="row">
              <el-button
                v-if="row.status == null"
                type="primary"
                size="small"
                @click="openEditDialog(row, $index)"
              >
                录入
              </el-button>

              <template v-else-if="row.status === '10'">
                <el-button type="warning" size="small" @click="openEditDialog(row, $index)">
                  编辑
                </el-button>
                <el-button type="success" size="small" @click="confirmRow(row)">
                  确认
                </el-button>
              </template>

              <el-button
                v-else-if="row.status === '20'"
                type="danger"
                size="small"
                @click="unconfirmRow(row)"
              >
                反确认
              </el-button>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 批量设置日期弹窗 -->
    <el-dialog
      v-model="batchDateDialogVisible"
      title="批量设置日期"
      width="420px"
      :close-on-click-modal="false"
      @close="resetBatchDates"
    >
      <el-form label-width="100px">
        <el-form-item label="最晚交付">
          <el-date-picker v-model="batchDates.dueDate" type="date" placeholder="选择" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划开始">
          <el-date-picker v-model="batchDates.planStartDate" type="date" placeholder="选择" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划完成">
          <el-date-picker v-model="batchDates.planFinishDate" type="date" placeholder="选择" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="实际开始">
          <el-date-picker v-model="batchDates.actualStartDate" type="date" placeholder="选择" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="实际完成">
          <el-date-picker v-model="batchDates.actualFinishDate" type="date" placeholder="选择" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchDateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="applyAndAutoSave">应用并保存</el-button>
      </template>
    </el-dialog>

    <!-- 单行编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editRow?.status == null ? '录入排产计划' : '编辑排产计划'"
      width="500px"
    >
      <el-form :model="editForm" label-width="110px">
        <el-form-item label="排产计划编码">
          <el-input v-model="editForm.scheduleCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="最晚交付">
          <el-date-picker v-model="editForm.dueDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划开始">
          <el-date-picker v-model="editForm.planStartDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划完成">
          <el-date-picker v-model="editForm.planFinishDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="实际开始">
          <el-date-picker v-model="editForm.actualStartDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="实际完成">
          <el-date-picker v-model="editForm.actualFinishDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditRow">保存</el-button>
      </template>
    </el-dialog>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  createPlSchedulePlan, 
  updatePlSchedulePlan, 
  updatePlanStatus 
} from '@/api/plmanage/plscheduleplan'
import { getPlSchedulePlanItemList } from '@/api/plmanage/plscheduleplan'
import { useUserStore } from '@/store/user'
import CustomDialog from '@/components/common/CustomDialog.vue'

const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'success'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  contractInfo: { type: Object, default: null }
})

// 默认字段
const defaultFields = {
  purchaserHqCode: '',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  provCoCode: '',
  provCoName: '',
  categoryCode: '60',
  subclassCode: '60004',
  dataSource: '供应商侧',
  dataSourceCreateTime: new Date().toISOString(),
  ownerId: '',
  openId: '',
  writer: userStore.realName,
  actualPeriod: null,
  remark: ''
}

// 状态
const isFullscreen = ref(false)
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const materialList = ref([])
const batchDateDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editRow = ref(null)
const editIndex = ref(-1)
const selectedRows = ref([]) // 当前勾选的行（仅 status === '10'）
const tableRef = ref(null)   // 表格引用
const isLoading = ref(false);

const batchDates = reactive({
  dueDate: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: ''
})

const editForm = reactive({
  scheduleCode: '',
  dueDate: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: ''
})

const contractFields = [
  { field: 'no', label: '厂内合同号' },
  { field: 'equipno', label: '器材合同号' },
  { field: 'ecpno', label: '国网经法合同号' },
  { field: 'name', label: '工程名称' },
  { field: 'gridno', label: '电网编号' },
  { field: 'pressurestage', label: '电压等级(KV)' },
  { field: 'purchaserHqCode', label: '采购方总部编码' },
  { field: 'supplierCode', label: '供应商编码' },
  { field: 'supplierName', label: '供应商名称' },
  { field: 'salesmanName', label: '销售员' },
  { field: 'customerName', label: '客户' },
  { field: 'agent', label: '客户代理人' },
  { field: 'legalrepresent', label: '法定代表人' },
  { field: 'taxnum', label: '税务号' },
  { field: 'signdate', label: '签订时间' },
  { field: 'telephone', label: '客户电话' },
  { field: 'fax', label: '客户传真' },
  { field: 'receiver', label: '接货人' },
  { field: 'transtype', label: '运输方式' },
  { field: 'picktype', label: '交提货方式' },
  { field: 'destination', label: '接货地点' },
  { field: 'casingcost', label: '包装费承担' },
  { field: 'transcost', label: '运费承担' },
  { field: 'term', label: '所属期间' },
  { field: 'bank', label: '开户银行' },
  { field: 'bankcode', label: '银行账号' },
  { field: 'other', label: '其他条款' },
  { field: 'memo', label: '备注' }
]

// 加载数据
watch(dialogVisible, async (val) => {
  if (val && props.contractInfo?.no) {
    await loadPlanItems()
  } else {
    materialList.value = []
    selectedRows.value = []
  }
}, { immediate: true })

const loadPlanItems = async () => {
  isLoading.value = true; // 新增：开始加载，显示转圈
  try {
    const res = await getPlSchedulePlanItemList({ contractNo: props.contractInfo.no })
    if (res.code === 200 && Array.isArray(res.data?.itemList)) {
      materialList.value = res.data.itemList
        .filter(item => item && item.itemNo)
        .map(item => ({
          ...defaultFields,
          poItemId: item.contractItemId || null,
          itemName: item.itemName || '',
          itemNo: item.itemNo || '',
          itemSpec: item.itemSpec || '',
          itemnum: item.itemnum || 0,
          itemunit: item.itemunit || '',
          itemweight: item.itemweight || 0,
          itemgrossweight: item.itemgrossweight || 0,
          itemRealPrice: item.itemRealPrice || 0,
          itemRealSum: item.itemRealSum || 0,
          itemmemo: item.itemmemo || '',
          scheduleCode: item.scheduleCode || '',
          planPeriod: item.planPeriod ? Number(item.planPeriod) : null,
          actualPeriod: item.actualPeriod ? Number(item.actualPeriod) : null,
          dueDate: item.dueDate ? item.dueDate.split(' ')[0] : '',
          planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
          planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
          actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
          actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
          remark: item.remark || '',
          id: item.id || null,
          status: item.status ?? null
        }))
    } else {
      materialList.value = []
    }
    selectedRows.value = [] // 重置勾选
    await nextTick()
    tableRef.value?.clearSelection()
  } catch (err) {
    console.error(err)
    ElMessage.error('加载排产计划失败')
    materialList.value = []
  }finally {
    isLoading.value = false; // 新增：无论成功/失败，结束加载，隐藏转圈
  }
}

// 多选：只允许 status !== '20' 的行被勾选
const isRowSelectable = (row) => {
  return row.status !== '20'
}

const handleSelectionChange = (val) => {
  selectedRows.value = val // 由 :selectable 保证只选 status !== '20'
}

// 状态判断
const isConfirmed = (row) => row && row.status === '20'

// 状态标签
const getStatusText = (status) => {
  if (status == null) return '未录入'
  if (status === '10') return '录入'
  if (status === '20') return '确认'
  return '未知'
}

const getStatusType = (status) => {
  if (status == null) return 'danger'
  if (status === '10') return 'primary'
  if (status === '20') return 'success'
  return 'info'
}

const tableRowClassName = ({ row }) => {
  return row && row.status !== '20' ? 'editable-row' : ''
}

// 计算工期
const calculatePeriod = (item) => {
  if (item && item.planStartDate && item.planFinishDate) {
    const start = new Date(item.planStartDate)
    const end = new Date(item.planFinishDate)
    if (!isNaN(start) && !isNaN(end)) {
      item.planPeriod = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1
    }
  }
}

// 打开编辑弹窗
const openEditDialog = (row, index) => {
  if (!row) return
  editRow.value = row
  editIndex.value = index
  Object.assign(editForm, {
    scheduleCode: row.scheduleCode || '',
    dueDate: row.dueDate || '',
    planStartDate: row.planStartDate || '',
    planFinishDate: row.planFinishDate || '',
    actualStartDate: row.actualStartDate || '',
    actualFinishDate: row.actualFinishDate || ''
  })
  editDialogVisible.value = true
}

// 保存单行
const saveEditRow = async () => {
  if (!editRow.value) return
  const data = { ...editRow.value, ...editForm }
  calculatePeriod(data)
  data.status = '10'

  try {
    if (data.id) {
      await updatePlSchedulePlan(data)
    } else {
      delete data.id
      await createPlSchedulePlan(data)
    }
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    await loadPlanItems()
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

// 批量设置日期：只对 selectedRows 操作
const applyAndAutoSave = async () => {
  if (!selectedRows.value.length) return

  const promises = selectedRows.value.map(async (row) => {
    const data = { ...row }
    if (batchDates.dueDate) data.dueDate = batchDates.dueDate
    if (batchDates.planStartDate) data.planStartDate = batchDates.planStartDate
    if (batchDates.planFinishDate) data.planFinishDate = batchDates.planFinishDate
    if (batchDates.actualStartDate) data.actualStartDate = batchDates.actualStartDate
    if (batchDates.actualFinishDate) data.actualFinishDate = batchDates.actualFinishDate
    calculatePeriod(data)
    data.status = '10'

    if (data.id) {
      return updatePlSchedulePlan(data)
    } else {
      delete data.id
      return createPlSchedulePlan(data)
    }
  })

  try {
    await Promise.all(promises)
    ElMessage.success(`已自动保存 ${selectedRows.value.length} 条`)
    batchDateDialogVisible.value = false
    await loadPlanItems()
  } catch (err) {
    ElMessage.error('自动保存失败')
  }
}

const resetBatchDates = () => {
  Object.keys(batchDates).forEach(k => batchDates[k] = '')
}

// 批量确认
const batchConfirm = async () => {
  if (!selectedRows.value.length) return
  ElMessageBox.confirm(`确认后不可编辑，是否继续确认 ${selectedRows.value.length} 条？`, '批量确认', { type: 'warning' })
    .then(async () => {
      const promises = selectedRows.value.map(row => 
        updatePlanStatus({ id: row.id, status: '20' })
      )
      await Promise.all(promises)
      ElMessage.success('批量确认成功')
      await loadPlanItems()
    })
    .catch(() => {})
}

// 单行确认
const confirmRow = async (row) => {
  if (!row?.id) return
  ElMessageBox.confirm('确认后不可编辑，是否继续？', '确认排产', { type: 'warning' })
    .then(async () => {
      await updatePlanStatus({ id: row.id, status: '20' })
      ElMessage.success('确认成功')
      await loadPlanItems()
    })
}

// 反确认
const unconfirmRow = async (row) => {
  if (!row?.id) return
  await updatePlanStatus({ id: row.id, status: '10' })
  ElMessage.success('已回退到录入')
  await loadPlanItems()
}

const handleClose = () => {
  emit('update:visible', false)
  resetBatchDates()
}
</script>

<style scoped>
/* 原有样式（保留） */
.editable-row .cell { color: #f56c6c !important; }
.confirmed-text { color: #67c23a !important; }

/* 新增：加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* 确保在内容上方 */
  pointer-events: auto; /* 阻止加载时点击内容 */
}
.loading-content {
  display: flex;
  flex-direction: column;
  gap: 16px; /* 图标和文字间距 */
  align-items: center;
}
.loading-text {
  font-size: 14px;
  color: #666;
}


/* 新增：卡片头部布局 */
.card-header {
  display: flex; /* 启用Flex布局 */
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  width: 100%; /* 占满父容器宽度 */
}

/* 可选：调整按钮间距 */
.header-button {
  display: flex;
  gap: 8px; /* 按钮之间的间距 */
}
</style>