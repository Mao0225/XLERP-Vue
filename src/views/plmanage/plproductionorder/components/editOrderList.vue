<template>
  <CustomDialog
    :visible="visible"
    title="生产订单列表"
    :close-on-click-modal="false"
    width="95%"
    height="85vh"
    :is-full-screen="isFullscreen"
    @update:is-full-screen="isFullscreen = $event"
    @update:visible="visible = $event"
    @close="handleClose"
    class="batch-order-dialog"
  >
    <div class="dialog-body">
      <div class="batch-info">
        <h3>批次号：</h3>
        <span class="batch-no">{{ batchNo }}</span>
      </div>

      <!-- 批量操作按钮 -->
      <div class="batch-actions" v-if="!loading">
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
      <el-skeleton :loading="loading" animated :count="5">
        <el-table
          v-if="!loading"
          ref="tableRef"
          :data="tableData"
          border
          height="calc(100% - 60px)"
          style="width:100%"
          class="batch-table"
          :row-class-name="() => 'batch-table-row'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="#" width="50" align="center" />

          <!-- 物料信息 -->
          <el-table-column prop="materialsCode" label="物料编号" min-width="110" header-align="center" align="center" />
          <el-table-column prop="materialsName" label="物料名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="productModel" label="规格型号" min-width="130" show-overflow-tooltip />

          <!-- 计划数量 -->
          <el-table-column label="计划数量" min-width="90" align="center">
            <template #default="{ row }">
              <span class="plan-qty">{{ row.contractAmount }}</span>
            </template>
          </el-table-column>

          <!-- 已分配数量 -->
          <el-table-column label="已分配数量" min-width="90" align="center">
            <template #default="{ row }">
              <span class="actual-qty">{{ row.allocatedAmount ?? row.amount }}</span>
            </template>
          </el-table-column>

          <!-- 本次分配数量 -->
          <el-table-column label="本次分配数量" min-width="120" align="center">
            <template #default="{ row }">
              <el-input-number
                v-if="row._editing"
                v-model="row.amount"
                :min="1"
                size="small"
                controls-position="right"
                style="width:100%"
              />
              <span v-else>{{ row.amount }}</span>
            </template>
          </el-table-column>

          <!-- 订单类型 -->
          <el-table-column label="订单类型" width="110" align="center">
            <template #default="{ row }">
              <el-select
                v-if="row._editing"
                v-model="row.ipotype"
                placeholder="请选择"
                size="small"
                style="width:100%"
              >
                <el-option label="生产" :value="1" />
                <el-option label="库存" :value="2" />
              </el-select>
              <span v-else>{{ row.ipotype === 1 ? '生产' : row.ipotype === 2 ? '库存' : '-' }}</span>
            </template>
          </el-table-column>

          <!-- 生产车间（多选） -->
          <el-table-column label="生产车间">
            <template #default="{ row }">
              <el-select
                v-if="row._editing"
                v-model="row.workshopList"
                multiple
                placeholder="请选择车间"
                size="small"
                style="width:100%"
                clearable
              >
                <el-option label="机锻分厂" value="机锻分厂" />
                <el-option label="铝加工分厂" value="铝加工分厂" />
                <el-option label="中心库" value="中心库" />
              </el-select>
              <span v-else>{{ row.workshopName || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 计划开始 / 完成 -->
          <el-table-column label="计划开始" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-if="row._editing"
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

          <el-table-column label="计划完成" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-if="row._editing"
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
              <template v-if="row.status === '10'">
                <el-button v-if="!row._editing" type="primary" size="small" @click="startEdit(row)">
                  编辑
                </el-button>
                <template v-else>
                  <el-button type="success" size="small" @click="saveRow(row)">保存</el-button>
                  <el-button size="small" @click="cancelEdit(row, $index)">取消</el-button>
                </template>

                <el-button type="warning" size="small" @click="handleConfirm(row)" :loading="row._confirming">
                  确认
                </el-button>
                <el-button type="danger" size="small" @click="removeRow($index)">删除</el-button>
              </template>

              <template v-else-if="row.status === '20'">
                <el-button type="info" size="small" @click="handleUnConfirm(row)" :loading="row._unconfirming">
                  反确认
                </el-button>
                <el-button type="success" size="small" @click="handleComplete(row)" :loading="row._completing">
                  完成
                </el-button>
              </template>

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
import { useUserStore } from '@/store/user'
import {
  getListAll,
  updatePlProductionOrder,
  deletePlProductionOrder,
  updateOrderStatus
} from '@/api/plmanage/plproductionorder'

const userStore = useUserStore()

// ---------- Props ----------
const props = defineProps({
  visible: Boolean,
  ipoBatchNo: String,
  scheduleCode: String
})
const emit = defineEmits(['update:visible', 'success'])

// ---------- 响应式 ----------
const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})
const isFullscreen = ref(true)
const loading = ref(false)
const batchNo = computed(() => props.ipoBatchNo)
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

// 可选车间
const workshopOptions = ['机锻分厂', '铝加工分厂', '中心库']

// ---------- 加载数据 ----------
watch(
  () => props.visible,
  async val => {
    if (!val) return
    loading.value = true
    tableData.value = []
    try {
      const res = await getListAll({ 
        ipoBatchNo: props.ipoBatchNo,
        scheduleCode: props.scheduleCode 
      })
      if (res.code === 200 && res.data?.page) {
        tableData.value = res.data.page.map(item => ({
          ...item,
          amount: item.amount || 0,
          ipotype: item.ipotype ?? item.ipoType ?? 1,               // 订单类型，默认生产
          workshopName: item.workshopName || '',
          workshopList: item.workshopName                          // 把逗号分隔的字符串转成数组
            ? item.workshopName.split(',').map(s => s.trim()).filter(Boolean)
            : [],
          planStartDate: item.planStartDate?.split(' ')[0],
          planFinishDate: item.planFinishDate?.split(' ')[0],
          _editing: false,
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
  },
  { immediate: false }
)

// ---------- 表格多选 ----------
const handleSelectionChange = val => { selectedRows.value = val }
const canBatchConfirm = computed(() => selectedRows.value.some(r => r.status === '10'))
const canBatchComplete = computed(() => selectedRows.value.some(r => r.status === '20'))
const batchConfirmCount = computed(() => selectedRows.value.filter(r => r.status === '10').length)
const batchCompleteCount = computed(() => selectedRows.value.filter(r => r.status === '20').length)

// ---------- 行编辑 ----------
const startEdit = row => {
  editingBackup.value[row.id] = {
    amount: row.amount,
    ipotype: row.ipotype,
    workshopList: [...row.workshopList],
    planStartDate: row.planStartDate,
    planFinishDate: row.planFinishDate
  }
  row._editing = true
}

const cancelEdit = (row, index) => {
  const backup = editingBackup.value[row.id]
  if (backup) {
    row.amount = backup.amount
    row.ipotype = backup.ipotype
    row.workshopList = backup.workshopList
    row.workshopName = backup.workshopList.join(',')
    row.planStartDate = backup.planStartDate
    row.planFinishDate = backup.planFinishDate
  }
  row._editing = false
  delete editingBackup.value[row.id]
}

const saveRow = async row => {
// 1. 校验数量
if (!row.amount) {
  ElMessage.warning('请输入数量');
  return;
}

// 2. 校验订单类型
if (!row.ipotype) {
  ElMessage.warning('请选择订单类型');
  return;
}

// 3. 校验计划开始日期
if (!row.planStartDate) {
  ElMessage.warning('请选择计划开始日期');
  return;
}

// 4. 校验计划结束日期
if (!row.planFinishDate) {
  ElMessage.warning('请选择计划结束日期');
  return;
}

// 5. 校验日期逻辑：开始日期不能晚于结束日期
if (row.planStartDate > row.planFinishDate) {
  ElMessage.warning('计划开始日期不能晚于结束日期');
  return;
}

  // 把多选数组转成逗号分隔的字符串
  const workshopName = row.workshopList.join(',')

  try {
    const payload = {
      id: row.id,
      amount: Number(row.amount),
      ipotype: Number(row.ipotype),          // 保存订单类型
      workshopName,                          // 逗号拼接的车间字符串
      planStartDate: row.planStartDate + ' 00:00:00',
      planFinishDate: row.planFinishDate + ' 00:00:00'
    }
    const res = await updatePlProductionOrder(payload)
    if (res.code === 200) {
      row.workshopName = workshopName
      row._editing = false
      delete editingBackup.value[row.id]
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存异常')
    console.error(e)
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
    ElMessage.error('操作异常')
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
      const successCount = results.filter(r => r.success).length
      results.filter(r => r.success).forEach(r => {
        const row = tableData.value.find(t => t.id === r.id)
        if (row) row.status = targetStatus
      })
      ElMessage.success(`${successMsg}，成功 ${successCount} 条`)
    })
}

const handleBatchConfirm = () => batchChangeStatus('20', '10', '批量确认完成')
const handleBatchComplete = () => batchChangeStatus('30', '20', '批量完成成功')

// ---------- 删除 ----------
const removeRow = async index => {
  const row = tableData.value[index]
  ElMessageBox.confirm('确定删除该行？删除后不可恢复', '提示', { type: 'warning' })
    .then(async () => {
      const res = await deletePlProductionOrder({ id: row.id })
      if (res.code === 200) {
        tableData.value.splice(index, 1)
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    })
    .catch(() => {})
}

// ---------- 关闭 ----------
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.batch-order-dialog :deep(.el-dialog__body) {
  padding: 16px !important;
  height: calc(100% - 60px) !important;
  display: flex;
  flex-direction: column;
}
.dialog-body { flex: 1; overflow: hidden; height: 100%; }

.batch-info {
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(90deg, #e0f7fa, #f0faff);
  border: 1px solid #c6e2ff; border-radius: 8px; padding: 10px 16px;
  margin-bottom: 12px; font-size: 16px; font-weight: 600; color: #333;
}
.batch-info h3 { margin: 0; font-size: 16px; color: #409eff; }
.batch-no { margin-left: 6px; color: #67c23a; font-weight: 700; font-size: 18px; }

.batch-table { height: 100% !important; width: 100% !important; }
.batch-table-row { height: 46px !important; }

:deep(.el-input__inner),
:deep(.el-input-number),
:deep(.el-date-editor) { height: 32px; line-height: 32px; }
:deep(.el-input-number .el-input__inner) { text-align: center; }

.plan-qty { font-weight: 600; color: #67c23a; }
.actual-qty { font-weight: 600; color: #409eff; }

.dialog-footer {
  display: flex; justify-content: flex-end; gap: 12px;
  padding-top: 12px; border-top: 1px solid #ebeef5;
}
.batch-actions { margin-bottom: 12px; display: flex; gap: 12px; }
.batch-actions .el-button span { margin-left: 4px; font-weight: 600; }
</style>