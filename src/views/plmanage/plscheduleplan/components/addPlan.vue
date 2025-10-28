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

    <!-- 加载转圈动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <el-spinner type="line" size="48" />
        <p class="loading-text">正在加载排产数据...</p>
      </div>
    </div>

    <!-- 合同信息 -->
    <el-card v-if="contractInfo" class="contract-card" shadow="never">
  <template #header>
    <div class="card-header">
      <span class="card-title">合同信息</span>
    </div>
  </template>

  <el-descriptions
    :column="3"
    border
    size="small"
    class="contract-descriptions"
  >
    <el-descriptions-item
      v-for="item in contractFields"
      :key="item.field"
      :label="item.label"
      :span="1"
    >
      <el-tooltip
        v-if="contractInfo[item.field]"
        :content="contractInfo[item.field]"
        placement="top"
        effect="dark"
      >
        <span class="readonly-text ellipsis">{{ contractInfo[item.field] }}</span>
      </el-tooltip>
      <span v-else class="readonly-text">—</span>
    </el-descriptions-item>
  </el-descriptions>
</el-card>

    <!-- 排产计划表格 -->
    <el-card class="material-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            排产计划明细 ({{ materialList.length }} 项)
          </span>
         <span class="header-button">
  <!-- 新增：选中未录入 + 选中录入 -->
  <el-button
    type="info"
    size="small"
    :disabled="!unenteredCount"
    @click="selectUnentered"
  >
    选中未录入 ({{ unenteredCount }})
  </el-button>
  <el-button
    type="warning"
    size="small"
    :disabled="!enteredCount"
    @click="selectEntered"
  >
    选中录入 ({{ enteredCount }})
  </el-button>

  <!-- 原有按钮 -->
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
    :disabled="!editableSelectedCount"
    @click="batchConfirm"
  >
    批量确认 ({{ editableSelectedCount }})
  </el-button>
</span>
        </div>
      </template>

      <el-table
        :data="materialList"
        border
        style="width: 100%"
        max-height="700px"
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
        <el-button type="primary" @click="applyAndAutoSave" :loading="isBatchSaving">应用并保存</el-button>
      </template>
    </el-dialog>

    <!-- 单行编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editRow?.status == null ? '录入排产计划' : '编辑排产计划'"
      width="500px"
    >
      <el-form :model="editForm" label-width="110px">
        <!-- <el-form-item label="排产计划编码">
          <el-input v-model="editForm.scheduleCode" placeholder="请输入" />
        </el-form-item> -->
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
const isFullscreen = ref(true)
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const materialList = ref([])
const batchDateDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editRow = ref(null)
const editIndex = ref(-1)
const selectedRows = ref([]) // 当前勾选的行（仅 status !== '20'）
const tableRef = ref(null)
const isLoading = ref(false)

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

// ==================== 计算属性：可确认的选中行数 ====================
const editableSelectedCount = computed(() => {
  return selectedRows.value.filter(row => row.status === '10').length
})

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
  isLoading.value = true
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
    selectedRows.value = []
    await nextTick()
    tableRef.value?.clearSelection()
  } catch (err) {
    console.error(err)
    ElMessage.error('加载排产计划失败')
    materialList.value = []
  } finally {
    isLoading.value = false
  }
}

// 多选：只允许 status !== '20' 的行被勾选
const isRowSelectable = (row) => {
  return row.status !== '20'
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 状态判断
const isConfirmed = (row) => row && row.status === '20'

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
// 状态（新增如下代码）
const isBatchSaving = ref(false); // 批量保存的加载状态
// 批量设置日期
const applyAndAutoSave = async () => {
  if (!selectedRows.value.length) return

  // 安全校验：不能修改已确认的
  const confirmedRows = selectedRows.value.filter(row => row.status === '20')
  if (confirmedRows.length > 0) {
    ElMessage.warning('已确认的排产计划无法修改')
    return
  }
  isBatchSaving.value = true
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
  }finally {
    isBatchSaving.value = false;
  }
}

const resetBatchDates = () => {
  Object.keys(batchDates).forEach(k => batchDates[k] = '')
}

// 批量确认
const batchConfirm = async () => {
  if (!editableSelectedCount.value) return

  ElMessageBox.confirm(
    `确认后不可编辑，是否继续确认 ${editableSelectedCount.value} 条？`,
    '批量确认',
    { type: 'warning' }
  )
    .then(async () => {
      const confirmableRows = selectedRows.value.filter(row => row.status === '10')
      const promises = confirmableRows.map(row => 
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


// ==================== 新增：统计未录入、已录入数量 ====================
const unenteredCount = computed(() => {
  return materialList.value.filter(row => row.status == null).length
})

const enteredCount = computed(() => {
  return materialList.value.filter(row => row.status === '10').length
})

// ==================== 新增：选中未录入行 ====================
// 在 script setup 中替换这两个方法
const selectUnentered = async () => {
  await nextTick()
  const rowsToSelect = materialList.value.filter(row => row.status == null)
  setTableSelection(rowsToSelect)
}

const selectEntered = async () => {
  await nextTick()
  const rowsToSelect = materialList.value.filter(row => row.status === '10')
  setTableSelection(rowsToSelect)
}

// 辅助函数
const setTableSelection = (rows) => {
  selectedRows.value.forEach(row => {
    tableRef.value.toggleRowSelection(row, false)
  })
  rows.forEach(row => {
    tableRef.value.toggleRowSelection(row, true)
  })
}

// 反确认
const unconfirmRow = async (row) => {
  if (!row?.id) return
  await updatePlanStatus({ id: row.id, status: '10' })
  ElMessage.success('已回退到录入')
  await loadPlanItems()
}
</script>

<style scoped>
.editable-row .cell { color: #f56c6c !important; }
.confirmed-text { color: #67c23a !important; }


.contract-card {
  margin-bottom: 10px;
}

/* 控制 el-descriptions 内的布局 */
.contract-descriptions ::v-deep(.el-descriptions__label) {
  width: 120px; /* 固定 label 宽度，保证一排对齐 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

/* 控制内容的显示省略 */
.readonly-text {
  display: inline-block;
  max-width: 220px; /* 控制内容列宽度，可按需求调整 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* 增加细微对齐感 */
.ellipsis {
  cursor: pointer;
  color: #333;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: auto;
}
.loading-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.loading-text {
  font-size: 14px;
  color: #666;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-button {
  display: flex;
  gap: 8px;
}
</style>