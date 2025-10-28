<template>
  <el-skeleton :loading="loading" animated :count="5">
    <!-- 批量操作按钮（移到表格上方） -->
    <div class="batch-actions-top" style="margin-bottom: 12px;">
      <el-button 
        type="primary"
        :disabled="!canBatchConfirm"
        @click="handleBatchConfirm"
      >
        批量确认<span v-if="batchConfirmCount">({{ batchConfirmCount }})</span>
      </el-button>
      <el-button 
        type="success"
        :disabled="!canBatchComplete"
        @click="handleBatchComplete"
      >
        批量完成<span v-if="batchCompleteCount">({{ batchCompleteCount }})</span>
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      height="560"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="itemNo" label="物料编号" min-width="110" align="center" />
      <el-table-column prop="itemName" label="物料名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="itemSpec" label="规格型号" min-width="130" show-overflow-tooltip />

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

      <!-- 生产车间 -->
      <el-table-column label="生产车间" min-width="140">
        <template #default="{ row }">
          <el-input
            v-if="row._editing"
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

      <!-- 计划完成 -->
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
          <!-- 编辑中 -->
          <template v-if="row._editing">
            <el-button type="success" size="small" @click="saveRow(row)" :loading="row._saving">
              保存
            </el-button>
            <el-button size="small" @click="cancelRow(row)">取消</el-button>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  updatePlProductionOrder,
  deletePlProductionOrder,
  updateOrderStatus
} from '@/api/plmanage/plproductionorder'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// Props
const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: Boolean
})
const emit = defineEmits(['refresh'])

// 响应式数据
const tableData = ref([])
const selectedRows = ref([])
const editingBackup = ref({})

// 监听父组件数据
watch(() => props.data, (val) => {
  tableData.value = val.map(item => ({
    ...item,
    _editing: false,
    _saving: false,
    _confirming: false,
    _unconfirming: false,
    _completing: false
  }))
}, { immediate: true })

// 状态映射
const statusMap = {
  '10': { text: '录入', type: 'info' },
  '20': { text: '确认', type: 'warning' },
  '30': { text: '完成', type: 'success' }
}
const statusTagMap = computed(() => statusMap)

// 多选
const handleSelectionChange = val => {
  selectedRows.value = val
}
const canBatchConfirm = computed(() => selectedRows.value.some(r => r.status === '10'))
const canBatchComplete = computed(() => selectedRows.value.some(r => r.status === '20'))
const batchConfirmCount = computed(() => selectedRows.value.filter(r => r.status === '10').length)
const batchCompleteCount = computed(() => selectedRows.value.filter(r => r.status === '20').length)

// 编辑开始
const startEdit = row => {
  editingBackup.value[row.id] = {
    amount: row.amount,
    workshopName: row.workshopName,
    planStartDate: row.planStartDate,
    planFinishDate: row.planFinishDate
  }
  row._editing = true
}

// 取消编辑
const cancelRow = row => {
  const backup = editingBackup.value[row.id]
  if (backup) {
    row.amount = backup.amount
    row.workshopName = backup.workshopName
    row.planStartDate = backup.planStartDate
    row.planFinishDate = backup.planFinishDate
  }
  row._editing = false
  delete editingBackup.value[row.id]
}

// 保存编辑
const saveRow = async row => {
  if (!row.amount || !row.workshopName || !row.planStartDate || !row.planFinishDate || row.planStartDate > row.planFinishDate) {
    ElMessage.warning('请检查必填项及日期顺序')
    return
  }

  row._saving = true
  try {
    const payload = {
      id: row.id,
      amount: Number(row.amount),
      workshopName: row.workshopName,
      planStartDate: row.planStartDate,
      planFinishDate: row.planFinishDate
    }
    const res = await updatePlProductionOrder(payload)
    if (res.code === 200) {
      row._editing = false
      delete editingBackup.value[row.id]
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存异常')
  } finally {
    row._saving = false
  }
}

// 状态变更
const changeStatus = async (row, target, loadingKey, msg) => {
  row[loadingKey] = true
  try {
    const res = await updateOrderStatus({ id: row.id, status: target })
    if (res.code === 200) {
      row.status = target
      ElMessage.success(msg)
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } finally {
    row[loadingKey] = false
  }
}
const handleConfirm = row => changeStatus(row, '20', '_confirming', '确认成功')
const handleUnConfirm = row => changeStatus(row, '10', '_unconfirming', '已反确认')
const handleComplete = row => changeStatus(row, '30', '_completing', '已完成')

// 批量操作
const batchChange = async (target, filter, msg) => {
  const rows = selectedRows.value.filter(r => r.status === filter)
  if (!rows.length) return

  ElMessageBox.confirm(`确定${msg} ${rows.length} 条记录？`, '提示', { type: 'warning' })
    .then(async () => {
      const results = await Promise.all(
        rows.map(r => updateOrderStatus({ id: r.id, status: target })
          .then(res => ({ id: r.id, ok: res.code === 200 })))
      )
      const success = results.filter(r => r.ok).length
      results.filter(r => r.ok).forEach(r => {
        const row = tableData.value.find(t => t.id === r.id)
        if (row) row.status = target
      })
      ElMessage.success(`${msg}，成功 ${success} 条`)
      if (success > 0) emit('refresh')
    })
}
const handleBatchConfirm = () => batchChange('20', '10', '批量确认完成')
const handleBatchComplete = () => batchChange('30', '20', '批量完成成功')

// 删除
const removeRow = async index => {
  const row = tableData.value[index]
  ElMessageBox.confirm('确定删除该生产订单？', '提示', { type: 'warning' })
    .then(async () => {
      const res = await deletePlProductionOrder({ id: row.id })
      if (res.code === 200) {
        tableData.value.splice(index, 1)
        ElMessage.success('删除成功')
        emit('refresh')
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    })
}
</script>

<style scoped>
.batch-actions-top {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}
</style>