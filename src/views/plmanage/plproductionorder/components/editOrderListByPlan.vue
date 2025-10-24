<template>
  <CustomDialog
    :visible="visible"
    title="排产计划 - 生产订单分配"
    :close-on-click-modal="false"
    width="95%"
    height="85vh"
    :is-full-screen="isFullscreen"
    @update:is-full-screen="isFullscreen = $event"
    @update:visible="visible = $event"
    @close="handleClose"
    class="schedule-order-dialog"
  >
    <div class="dialog-body">
      <!-- 排产计划信息 -->
      <div class="schedule-info">
        <div class="info-row">
          <span class="label">排产计划号：</span>
          <span class="value">{{ schedulePlanInfo.scheduleCode }}</span>
        </div>
        <div class="info-row">
          <span class="label">物料编号：</span>
          <span class="value">{{ schedulePlanInfo.itemNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">物料名称：</span>
          <span class="value">{{ schedulePlanInfo.itemName }}</span>
        </div>
        <div class="info-row">
          <span class="label">规格型号：</span>
          <span class="value">{{ schedulePlanInfo.itemSpec }}</span>
        </div>
        <div class="info-row">
          <span class="label">计划数量：</span>
          <span class="value plan-qty">{{ schedulePlanInfo.itemnum }}</span>
        </div>
        <div class="info-row">
          <span class="label">已分配：</span>
          <span class="value actual-qty">{{ schedulePlanInfo.allocatedAmount ?? 0 }}</span>
        </div>
      </div>

      <!-- 批量操作 + 添加按钮 -->
      <div class="batch-actions" v-if="!loading">
        <el-button type="primary" @click="handleAddRow" plain>
          <el-icon><Plus /></el-icon> 添加
        </el-button>

        <el-button 
          type="primary" 
          @click="handleBatchConfirm" 
          :disabled="!canBatchConfirm"
        >
          批量确认<span v-if="batchConfirmCount">({{ batchConfirmCount }})</span>
        </el-button>

        <el-button 
          type="success" 
          @click="handleBatchComplete" 
          :disabled="!canBatchComplete"
        >
          批量完成<span v-if="batchCompleteCount">({{ batchCompleteCount }})</span>
        </el-button>
      </div>

      <!-- 表格 -->
      <el-skeleton :loading="loading" animated :count="5" style="width:100%;height:100%">
        <el-table
          v-if="!loading"
          ref="tableRef"
          :data="tableData"
          border
          height="calc(100% - 60px)"
          style="width:100%"
          class="order-table"
          :row-class-name="() => 'order-table-row'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />

          <!-- 序号 -->
          <el-table-column type="index" label="#" width="50" align="center" />

          <!-- 物料信息 -->
          <el-table-column prop="itemNo" label="物料编号" min-width="110" header-align="center" align="center" />
          <el-table-column prop="itemName" label="物料名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="itemSpec" label="规格型号" min-width="130" show-overflow-tooltip />

          <!-- 本次分配数量 -->
          <el-table-column label="本次分配数量" min-width="120" align="center">
            <template #default="{ row }">
              <el-input-number
                v-if="row._editing || row._isNew"
                v-model="row.amount"
                :min="1"
                :max="remainingAmount"
                size="small"
                controls-position="right"
                style="width:100%"
              />
              <span v-else>{{ row.amount }}</span>
            </template>
          </el-table-column>

          <!-- 生产车间 -->
          <el-table-column label="生产车间" min-width="140">
            <template #default="{ row }">
              <el-input
                v-if="row._editing || row._isNew"
                v-model="row.workshopName"
                placeholder="输入车间名称"
                size="small"
                style="width:100%"
              />
              <span v-else>{{ row.workshopName }}</span>
            </template>
          </el-table-column>

          <!-- 计划开始 -->
          <el-table-column label="计划开始" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-if="row._editing || row._isNew"
                v-model="row.planStartDate"
                type="date"
                size="small"
                style="width:100%"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
              <span v-else>{{ row.planStartDate }}</span>
            </template>
          </el-table-column>

          <!-- 计划完成 -->
          <el-table-column label="计划完成" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-if="row._editing || row._isNew"
                v-model="row.planFinishDate"
                type="date"
                size="small"
                style="width:100%"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
              <span v-else>{{ row.planFinishDate }}</span>
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="status" label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="statusTagMap[row.status]?.type">
                {{ statusTagMap[row.status]?.text }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template #default="{ row, $index }">
              <!-- 新增或编辑中 -->
              <template v-if="row._isNew || row._editing">
                <el-button 
                  type="success" 
                  size="small" 
                  @click="row._isNew ? saveNewRow(row) : saveRow(row)" 
                  :loading="row._saving"
                >
                  保存
                </el-button>
                <el-button size="small" @click="cancelRow(row, $index)">取消</el-button>
              </template>

              <!-- 录入状态 -->
              <template v-else-if="row.status === '10'">
                <el-button type="primary" size="small" @click="startEdit(row)">编辑</el-button>
                <el-button type="warning" size="small" @click="handleConfirm(row)" :loading="row._confirming">确认</el-button>
                <el-button type="danger" size="small" @click="removeRow($index)">删除</el-button>
              </template>

              <!-- 确认状态 -->
              <template v-else-if="row.status === '20'">
                <el-button type="info" size="small" @click="handleUnConfirm(row)" :loading="row._unconfirming">反确认</el-button>
                <el-button type="success" size="small" @click="handleComplete(row)" :loading="row._completing">完成</el-button>
              </template>

              <!-- 完成状态 -->
              <span v-else>—</span>
            </template>
          </el-table-column>
        </el-table>
      </el-skeleton>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CustomDialog from '@/components/common/CustomDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import {
  getListAll,
  createPlProductionOrder,
  updatePlProductionOrder,
  deletePlProductionOrder,
  updateOrderStatus
} from '@/api/plmanage/plproductionorder'
import { getNewNoNyName } from '@/api/system/basno'

const userStore = useUserStore()

// ---------- Props ----------
const props = defineProps({
  visible: Boolean,
  schedulePlanInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'success'])

// ---------- 响应式 ----------
const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})
const isFullscreen = ref(true)
const loading = ref(false)
const tableData = ref([])
const tableRef = ref(null)
const selectedRows = ref([])
const editingBackup = ref({})

// 状态映射
const statusMap = {
  '10': { text: '录入', type: 'info' },
  '20': { text: '确认', type: 'warning' },
  '30': { text: '完成', type: 'success' }
}
const statusTagMap = computed(() => statusMap)

// 剩余可分配数量
const remainingAmount = computed(() => {
  const total = props.schedulePlanInfo.itemnum || 0
  const allocated = tableData.value.reduce((sum, r) => sum + (r.amount || 0), 0)
  return total - allocated
})


/* 生成批次号 */
const generateScheduleCode = async () => {
  try {
    const res = await getNewNoNyName('scdd-batch')
    if (res?.code === 200) return res.data.fullNoNyName
    ElMessage.error(res?.msg || '获取编码失败')
    return ''
  } catch (error) {
    console.error('生成批次号出错:', error)
    ElMessage.error('请求编码服务时发生错误')
    return ''
  }
}

// 当前时间
const now = new Date().toISOString()

// 默认字段（来自你的要求）
const defaultFields = computed(() => ({
  purchaserHqCode: props.schedulePlanInfo.purchaserHqCode || '',
  ipoType: '默认',
  supplierCode: props.schedulePlanInfo.supplierCode || '',
  supplierName: props.schedulePlanInfo.supplierName || '',
  ipoNo: '',
  categoryCode: props.schedulePlanInfo.categoryCode || '',
  subclassCode: props.schedulePlanInfo.subclassCode || '',
  scheduleCode: props.schedulePlanInfo.scheduleCode || '',
  poItemId: props.schedulePlanInfo.poItemId || '',
  dataType: '',
  soItemNo: '',
  materialsCode: props.schedulePlanInfo.itemNo || '',
  materialsName: props.schedulePlanInfo.itemName || '',
  materialsUnit: props.schedulePlanInfo.itemunit || '',
  materialsDesc: '无',
  unit: props.schedulePlanInfo.itemunit || '',
  productIdGrpNo: '',
  productIdType: '',
  productModel: props.schedulePlanInfo.itemSpec || '',
  actualStartDate: '',
  actualFinishDate: '',
  plantName: '',
  ipoStatus: '',
  center: '',
  dataSource: '供应商侧',
  dataSourceCreateTime: now,
  ownerId: '',
  openId: '',
  createdTime: now,
  updatedTime: now,
  status: '10',
  writer: userStore.realName,
  remark: '',
  actualPeriod: null
}))

// ---------- 加载数据 ----------



async function loadTableData() {
  loading.value = true
  tableData.value = []
  try {
    const res = await getListAll({ scheduleCode: props.schedulePlanInfo.scheduleCode })
    if (res.code === 200 && res.data?.page) {
      tableData.value = res.data.page.map(item => ({
        ...item,
        itemNo: item.materialsCode || item.itemNo,
        itemName: item.materialsName || item.itemName,
        itemSpec: item.productModel || item.itemSpec,
        amount: item.amount,
        workshopName: item.workshopName,
        planStartDate: item.planStartDate?.split(' ')[0],
        planFinishDate: item.planFinishDate?.split(' ')[0],
        _editing: false,
        _isNew: false,
        _saving: false,
        _confirming: false,
        _unconfirming: false,
        _completing: false
      }))
    }
  } catch (e) {
    ElMessage.error('加载订单失败')
    console.error(e)
  } finally {
    loading.value = false
  }
  return tableData.value
}

// 原来的 watch 改成调用方法
watch(
  () => props.visible,
  val => {
    if (val) {
      loadTableData()
    }
  },
  { immediate: false }
)

// ---------- 表格多选 ----------
const handleSelectionChange = val => {
  selectedRows.value = val
}
const canBatchConfirm = computed(() => selectedRows.value.some(r => r.status === '10'))
const canBatchComplete = computed(() => selectedRows.value.some(r => r.status === '20'))
const batchConfirmCount = computed(() => selectedRows.value.filter(r => r.status === '10').length)
const batchCompleteCount = computed(() => selectedRows.value.filter(r => r.status === '20').length)

// ---------- 添加新行 ----------
const handleAddRow = () => {
  if (remainingAmount.value <= 0) {
    ElMessage.warning('已无剩余可分配数量')
    return
  }

  const newRow = {
    id: `temp_${Date.now()}`,
    poItemId: props.schedulePlanInfo.poItemId,
    itemNo: props.schedulePlanInfo.itemNo,
    itemName: props.schedulePlanInfo.itemName,
    itemSpec: props.schedulePlanInfo.itemSpec,
    amount: 1,
    workshopName: '',
    planStartDate: props.schedulePlanInfo.planStartDate,
    planFinishDate: props.schedulePlanInfo.planFinishDate,
    status: '10',
    scheduleCode: props.schedulePlanInfo.scheduleCode,
    _isNew: true,
    _saving: false
  }
  tableData.value.unshift(newRow)
  nextTick(() => {
    tableRef.value?.setCurrentRow(newRow)
  })
}

// 保存新行（完整字段）
const saveNewRow = async row => {
  if (!row.amount || !row.workshopName || !row.planStartDate || !row.planFinishDate || row.planStartDate > row.planFinishDate) {
    ElMessage.warning('请填写完整数量、车间、日期，且开始日期 ≤ 结束日期')
    return
  }
  if (row.amount > remainingAmount.value) {
    ElMessage.warning(`本次分配数量不能超过剩余可分配数量：${remainingAmount.value}`)
    return
  }

  const newCode = await generateScheduleCode()


  row._savingaving = true
  try {
    const payload = {
      ...defaultFields.value,
      amount: Number(row.amount),
      workshopName: row.workshopName,
      planStartDate: row.planStartDate + ' 00:00:00',
      planFinishDate: row.planFinishDate + ' 00:00:00',
      poItemId: row.poItemId,
      ipoBatchNo: newCode,
      scheduleCode: row.scheduleCode,
      materialsCode: row.itemNo,
      materialsName: row.itemName,
      productModel: row.itemSpec,
      unit: props.schedulePlanInfo.itemunit || ''
    }

    const res = await createPlProductionOrder(payload)
    if (res.code == 200) {
      ElMessage.success('添加成功')
      loadTableData()
    } else {
      ElMessage.error(res.msg || '添加失败')
    }
  } catch (e) {
    ElMessage.error('添加异常')
    console.error(e)
  } finally {
    row._saving = false
  }
}

// ---------- 行编辑 ----------
const startEdit = row => {
  editingBackup.value[row.id] = {
    amount: row.amount,
    workshopName: row.workshopName,
    planStartDate: row.planStartDate,
    planFinishDate: row.planFinishDate
  }
  row._editing = true
}

const cancelRow = (row, index) => {
  if (row._isNew) {
    tableData.value.splice(index, 1)
  } else {
    const backup = editingBackup.value[row.id]
    if (backup) Object.assign(row, backup)
    row._editing = false
    delete editingBackup.value[row.id]
  }
}

const saveRow = async row => {
  if (!row.amount || !row.workshopName || !row.planStartDate || !row.planFinishDate || row.planStartDate > row.planFinishDate) {
    ElMessage.warning('请检查数量、车间、日期是否完整且开始≤结束')
    return
  }

  try {
    const payload = {
      id: row.id,
      amount: Number(row.amount),
      workshopName: row.workshopName,
      planStartDate: row.planStartDate + ' 00:00:00',
      planFinishDate: row.planFinishDate + ' 00:00:00'
    }
    const res = await updatePlProductionOrder(payload)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      row._editing = false
      delete editingBackup.value[row.id]
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存异常')
  }
}

// ---------- 状态变更 ----------
const changeStatus = async (row, targetStatus, loadingKey, successMsg) => {
  row[loadingKey] = true
  try {
    const res = await updateOrderStatus({ id: row.id, status: targetStatus })
    if (res.code === 200) {
      row.status = targetStatus
      ElMessage.success(successMsg)
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    ElMessage.error(' 操作异常')
  } finally {
    row[loadingKey] = false
  }
}

const handleConfirm = row => changeStatus(row, '20', '_confirming', '确认成功')
const handleUnConfirm = row => changeStatus(row, '10', '_unconfirming', '已反确认')
const handleComplete = row => changeStatus(row, '30', '_completing', '已完成')

// ---------- 批量操作 ----------
const batchChangeStatus = async (targetStatus, filterStatus, successMsg) => {
  const rows = selectedRows.value.filter(r => r.status === filterStatus)
  if (!rows.length) return

  ElMessageBox.confirm(`确定${successMsg.includes('确认') ? '确认' : '完成'} ${rows.length} 条记录？`, '提示', { type: 'warning' })
    .then(async () => {
      const promises = rows.map(r => 
        updateOrderStatus({ id: r.id, status: targetStatus })
          .then(res => ({ id: r.id, success: res.code === 200 }))
      )
      const results = await Promise.all(promises)
      const success = results.filter(r => r.success).length
      results.filter(r => r.success).forEach(r => {
        const row = tableData.value.find(t => t.id === r.id)
        if (row) row.status = targetStatus
      })
      ElMessage.success(`${successMsg}，成功 ${success} 条`)
    })
}

const handleBatchConfirm = () => batchChangeStatus('20', '10', '批量确认完成')
const handleBatchComplete = () => batchChangeStatus('30', '20', '批量完成成功')

// ---------- 删除 ----------
const removeRow = async index => {
  const row = tableData.value[index]
  ElMessageBox.confirm('确定删除该行？删除后不可恢复', '提示', { type: 'warning' })
    .then(async () => {
      try {
        const res = await deletePlProductionOrder({ id: row.id })
        if (res.code === 200) {
          tableData.value.splice(index, 1)
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      } catch (e) {
        ElMessage.error('删除异常')
      }
    })
}

// ---------- 关闭 ----------
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.schedule-order-dialog :deep(.el-dialog__body) {
  padding: 16px !important;
  height: calc(100% - 60px) !important;
  display: flex;
  flex-direction: column;
}

.dialog-body {
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.schedule-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  background: linear-gradient(90deg, #f8fffe, #f0faff);
  border: 1px solid #c6e2ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-row .label {
  color: #409eff;
  font-weight: 600;
  margin-right: 6px;
  min-width: 80px;
}

.info-row .value {
  color: #333;
  font-weight: 500;
}

.info-row .plan-qty {
  color: #67c23a;
  font-weight: 600;
}

.info-row .actual-qty {
  color: #409eff;
  font-weight: 600;
}

.order-table {
  height: 100% !important;
  width: 100% !important;
}

.order-table-row {
  height: 46px !important;
}

:deep(.el-input__inner),
:deep(.el-input-number),
:deep(.el-date-editor) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.batch-actions {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.batch-actions .el-button span {
  margin-left: 4px;
  font-weight: 600;
}
</style>