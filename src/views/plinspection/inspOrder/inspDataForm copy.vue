<template>
  <CustomDialog
    :visible="dialogVisible"
    title="检验单详情"
    :is-full-screen="isFullscreen"
    :close-on-click-modal="false"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <div class="dialog-body">
      <!-- ========== 基本信息 ========== -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header">
            <span class="title">基本信息</span>
          </div>
        </template>

        <el-descriptions :column="3" border size="small" class="info-desc">
          <el-descriptions-item label="检验单号">
            <strong>{{ orderData.orderNo || '-' }}</strong>
          </el-descriptions-item>

          <!-- 状态：使用映射表 -->
          <el-descriptions-item label="状态">
            <el-tag :type="statusInfo.type">
              {{ statusInfo.label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="到货时间">{{ formatDate(orderData.deliveryTime) }}</el-descriptions-item>

          <el-descriptions-item label="物料名称">{{ orderData.itemName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ orderData.itemCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物料型号">{{ orderData.itemSpec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="标准ID">{{ orderData.standardId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="炉批号">{{ orderData.batchNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ orderData.batchNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="到货型号">{{ orderData.actualSpec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验数量">{{ orderData.quantity || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际到货数量">{{ orderData.actualQuantity || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际到货重量">{{ orderData.actualWeight || '-' }}</el-descriptions-item>

          <el-descriptions-item label="检验录入时间">{{ formatDate(orderData.inspectTime) }}</el-descriptions-item>
          <el-descriptions-item label="检验完成时间">{{ formatDate(orderData.inspectFinishTime) }}</el-descriptions-item>
          <el-descriptions-item label="报检人">{{ orderData.reporter || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验人">{{ orderData.inspector || '-' }}</el-descriptions-item>

          <el-descriptions-item label="入库审核人">{{ orderData.storageReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="报检审核人">{{ orderData.reportReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验审核人">{{ orderData.inspectReviewer || '-' }}</el-descriptions-item>

          <el-descriptions-item label="入库时间">{{ formatDate(orderData.inStockTime) }}</el-descriptions-item>

          <!-- 质量证明书：可点击打开 -->
          <el-descriptions-item label="质量证明书" :span="3">
            <template v-if="certificateFiles.length">
              <div class="file-container">
                <div v-for="(f, i) in certificateFiles" :key="i">
                  <el-tooltip :content="f.name">
                    <span class="file-link inline-block px-1" @click="openFileInNewWindow(f.url)">
                      {{ f.name }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <span v-else>-</span>
          </el-descriptions-item>

          <el-descriptions-item label="整单备注" :span="3">
            <span class="text-gray-700">{{ orderData.remark || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="检验备注" :span="3">
            <span class="text-gray-700">{{ orderData.inspRemark || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="入库备注" :span="3">
            <span class="text-gray-700">{{ orderData.stockRemark || '-' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- ========== 检验项目部分 ========== -->
      <el-card shadow="never" class="section-card mt-4">
        <template #header>
          <div class="section-header">
            <span class="title">检验项目</span>
            <div class="actions">
              <el-button type="primary" size="small" @click="selectorVisible = true">+ 添加项目</el-button>
              <el-button type="success" size="small" class="ml-2" @click="stdSelectorVisible = true">
                套用标准
              </el-button>
            </div>
          </div>
        </template>

        <el-table
          :data="items"
          border
          stripe
          size="small"
          row-key="inspItemId"
          class="insp-table"
        >
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="inspItemName" label="项目名称" min-width="150" />
          <el-table-column prop="category" label="类别" width="100" />
          <el-table-column prop="unit" label="单位" width="80" />
          <el-table-column label="标准值" min-width="150">
            <template #default="{ row }">
              <span v-if="row.minValue !== null && row.maxValue !== null">{{ row.minValue }} - {{ row.maxValue }}</span>
              <span v-else-if="row.minValue !== null">≥ {{ row.minValue }}</span>
              <span v-else-if="row.maxValue !== null">≤ {{ row.maxValue }}</span>
              <span v-else>{{ row.standardValue || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 平行试验（编辑模式） -->
          <el-table-column label="平行试验" min-width="300">
            <template #default="{ row }">
              <div class="test-records">
                <div class="test-items flex flex-wrap gap-3 mb-2">
                  <div
                    v-for="(test, index) in row.tests"
                    :key="test.testIndex"
                    class="test-item flex items-center gap-2"
                  >
                    <span class="test-label">试验{{ index + 1 }}:</span>
                    <el-input
                      v-model="test.actualValue"
                      size="small"
                      placeholder="输入实测值"
                      class="test-input"
                      :style="{ width: '150px' }"
                    />
                    <el-button
                      icon="Delete"
                      size="mini"
                      type="danger"
                      link
                      @click="removeTest(row, index, test.id)"
                      circle
                      :disabled="row.tests.length <= 1"
                    />
                  </div>
                </div>

                <el-button
                  type="primary"
                  size="small"
                  icon="Plus"
                  @click="addTest(row)"
                  class="add-test-btn"
                >
                  添加平行试验
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="试验次数" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.tests.length > 0 ? 'primary' : 'warning'">
                {{ row.tests.length }} 次
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" @click="removeItem($index)">删除项目</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 底部按钮：使用 #footer 插槽 -->
    <template #footer>
      <div class="footer-bar">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="success" @click="submitInspection">提交检验</el-button>
        <el-button type="info" @click="printReport">打印报告</el-button>
      </div>
    </template>
  </CustomDialog>

  <!-- 弹窗组件 -->
  <item-selector-dialog v-model="selectorVisible" @confirm="handleItemsSelected" />
  <stdSelectDialog v-model="stdSelectorVisible" @confirm="handleStdSelected" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import CustomDialog from '@/components/common/CustomDialog.vue'
import ItemSelectorDialog from '../components/ItemSelectorDialog.vue'
import stdSelectDialog from '../components/stdSelectDialog.vue'
import {
  saveInspResult,
  updateInspResult,
  getInspResultByOrderId,
  deleteInspResult
} from '@/api/plinspection/inspResult'
import { baseURL } from '@/utils/request'

/* ---------- Props & Emits ---------- */
const props = defineProps({
  modelValue: Boolean,
  orderData: { type: Object, required: true, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue', 'submit'])

// 使用内部状态管理弹窗显示和全屏状态
const dialogVisible = ref(false)
const isFullscreen = ref(true)

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
}, { immediate: true })

// 监听 dialogVisible 变化，同步到父组件
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 关闭弹窗处理
const handleClose = () => {
  dialogVisible.value = false
}

/* ---------- 日期格式化 ---------- */
const formatDate = date => date
  ? new Date(date).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-')
  : '-'

/* ---------- 状态映射 ---------- */
const statusOptions = [
  { label: '草稿', value: 0 },
  { label: '报检确认，待审核', value: 10 },
  { label: '报检通过', value: 11 },
  { label: '报检拒绝', value: 12 },
  { label: '检验中', value: 20 },
  { label: '检验完成，待审核', value: 21 },
  { label: '检验合格，待入库', value: 22 },
  { label: '检验不合格', value: 23 },
  { label: '入库中', value: 30 },
  { label: '已入库', value: 31 },
  { label: '入库拒绝', value: 32 }
]

const getStatusInfo = (val) => {
  const item = statusOptions.find(o => o.value == val)
  if (!item) return { label: '未知', type: 'info' }

  const typeMap = {
    0: 'info', 10: 'warning', 11: 'success', 12: 'danger',
    20: 'primary', 21: 'warning', 22: 'success', 23: 'danger',
    30: 'primary', 31: 'success', 32: 'danger'
  }
  return { label: item.label, type: typeMap[val] || 'info' }
}
const statusInfo = computed(() => getStatusInfo(props.orderData.status))

/* ---------- 质量证明书解析 & 打开 ---------- */
const parseCertificate = (s) => {
  if (!s) return []
  try {
    const arr = JSON.parse(s)
    if (Array.isArray(arr) && arr.every(i => typeof i === 'string')) {
      return arr.map(url => ({
        name: url.split('/').pop() || '未知文件',
        url
      }))
    }
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
const certificateFiles = computed(() => parseCertificate(props.orderData.certificate))

const openFileInNewWindow = (url) => {
  if (!url) return
  const full = url.startsWith('http') ? url : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  window.open(full, '_blank')
}

/* ---------- 检验项目数据 ---------- */
const items = ref([])

const loadInspectionResult = async () => {
  if (!props.orderData?.id) return
  try {
    const { data } = await getInspResultByOrderId({ orderId: props.orderData.id })
    const list = data?.list || []

    const groupMap = {}
    list.forEach(item => {
      const key = item.inspItemId
      if (!groupMap[key]) {
        groupMap[key] = {
          inspItemId: key,
          inspStdItemId: item.inspStdItemId || '',
          inspItemCode: item.inspItemCode || '',
          inspItemName: item.inspItemName,
          category: item.category || '',
          unit: item.unit || '',
          dataType: item.dataType || '',
          minValue: item.minValue !== undefined ? item.minValue : null,
          maxValue: item.maxValue !== undefined ? item.maxValue : null,
          standardValue: item.standardValue || '',
          tests: []
        }
      }
      groupMap[key].tests.push({
        id: item.id,
        testIndex: item.testIndex,
        actualValue: item.actualValue || ''
      })
    })

    Object.values(groupMap).forEach(g => {
      g.tests.sort((a, b) => a.testIndex - b.testIndex)
    })

    items.value = Object.values(groupMap)

    // 若某项目没有试验记录，默认补一条空记录
    items.value.forEach(row => {
      if (!row.tests.length) {
        row.tests.push({ id: '', testIndex: 1, actualValue: '' })
      }
    })
  } catch (e) {
    console.error('加载检验结果失败', e)
    ElMessage.error('加载数据失败')
  }
}

/* ---------- 监听打开/切换 orderData ---------- */
watch(
  () => [props.orderData?.id, dialogVisible.value],
  ([newId, isVisible]) => {
    if (newId && isVisible) {
      loadInspectionResult()
    }
  },
  { immediate: true }
)

/* ---------- 平行试验增删 ---------- */
const addTest = (row) => {
  const nextIndex = Math.max(...row.tests.map(t => t.testIndex), 0) + 1
  row.tests.push({ id: '', testIndex: nextIndex, actualValue: '' })
}

const removeTest = async (row, index, testId) => {
  if (row.tests.length <= 1) {
    ElMessage.warning('至少保留一条试验记录')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除这条平行试验记录吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (testId) await deleteInspResult({ id: testId })
    row.tests.splice(index, 1)
    row.tests.forEach((t, i) => (t.testIndex = i + 1))
  } catch (error) {
    if (error === 'cancel') return
    ElMessage.error('删除失败，请重试')
  }
}

/* ---------- 主表删除 ---------- */
const removeItem = async (idx) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个检验项目吗？该操作会同时删除相关的平行试验记录',
      '删除确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const item = items.value[idx]
    const testIds = item.tests.filter(t => t.id).map(t => t.id)
    if (testIds.length) await Promise.all(testIds.map(id => deleteInspResult({ id })))
    items.value.splice(idx, 1)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error === 'cancel') return
    ElMessage.error('删除失败，请重试')
  }
}

/* ---------- 项目选择器 ---------- */
const selectorVisible = ref(false)
const handleItemsSelected = selected => {
  let addCount = 0
  selected.forEach(item => {
    const isExist = items.value.some(i => i.inspItemId === item.id)
    if (!isExist) {
      items.value.push({
        inspItemId: item.id,
        inspStdItemId: '',
        inspItemCode: item.inspItemCode || '',
        inspItemName: item.inspItemName,
        category: item.category || '',
        unit: item.unit || '',
        dataType: item.dataType || '',
        minValue: null,
        maxValue: null,
        standardValue: '',
        tests: [{ id: '', testIndex: 1, actualValue: '' }]
      })
      addCount++
    }
  })
  selectorVisible.value = false
  addCount
    ? ElMessage.success(`成功添加 ${addCount} 个检验项目`)
    : ElMessage.info('所选项目已全部存在')
}

/* ---------- 标准选择弹窗 ---------- */
const stdSelectorVisible = ref(false)

function parseStandardValue(str, unit) {
  if (!str) return { minValue: null, maxValue: null, standardValue: '' }
  const raw = str.replace(new RegExp(`\\s*${unit}\\s*$`), '').trim()
  const rangeRE = /^(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)$/
  const geRE = /^≥\s*(\d+(\.\d+)?)$/
  const leRE = /^≤\s*(\d+(\.\d+)?)$/
  if (rangeRE.test(raw)) {
    const [, min, , max] = raw.match(rangeRE)
    return { minValue: Number(min), maxValue: Number(max), standardValue: str }
  }
  if (geRE.test(raw)) {
    const [, val] = raw.match(geRE)
    return { minValue: Number(val), maxValue: null, standardValue: str }
  }
  if (leRE.test(raw)) {
    const [, val] = raw.match(leRE)
    return { minValue: null, maxValue: Number(val), standardValue: str }
  }
  const num = Number(raw)
  if (!isNaN(num)) return { minValue: num, maxValue: num, standardValue: str }
  return { minValue: null, maxValue: null, standardValue: str }
}

const handleStdSelected = payload => {
  if (!payload?.items?.length) {
    ElMessage.warning('所选标准没有检验项目')
    return
  }
  let addCount = 0
  payload.items.forEach(it => {
    const isExist = items.value.some(row => row.inspItemId === it.inspItemId)
    if (!isExist) {
      const { minValue, maxValue, standardValue } = parseStandardValue(it.standardValue, it.unit || '')
      items.value.push({
        inspItemId: it.inspItemId,
        inspStdItemId: it.id,
        inspItemCode: it.inspItemCode || '',
        inspItemName: it.inspItemName,
        category: it.category || '',
        unit: it.unit || '',
        dataType: it.dataType || '',
        minValue,
        maxValue,
        standardValue,
        tests: [{ id: '', testIndex: 1, actualValue: '' }]
      })
      addCount++
    }
  })
  stdSelectorVisible.value = false
  addCount
    ? ElMessage.success(`已套用标准《${payload.std.standardNo}》，新增 ${addCount} 个检验项目`)
    : ElMessage.info('该标准的检验项目已全部存在')
}

/* ---------- 提交检验 ---------- */
const submitInspection = async () => {
  if (!items.value.length) {
    ElMessage.warning('请至少添加一个检验项目')
    return
  }
  const hasEmpty = items.value.some(row =>
    row.tests.some(t => !t.actualValue.trim())
  )
  if (hasEmpty) {
    ElMessage.warning('请完善所有试验记录的实测值')
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: '正在提交数据...',
    background: 'rgba(0, 0, 0, 0.1)'
  })

  try {
    const promises = []
    let addCount = 0, updateCount = 0

    items.value.forEach(row => {
      row.tests.forEach(test => {
        const params = {
          inspOrderId: props.orderData.id,
          inspItemId: row.inspItemId,
          inspStdItemId: row.inspStdItemId || '',
          actualValue: test.actualValue.trim(),
          testIndex: test.testIndex,
          standardValue: row.standardValue || '',
          minValue: row.minValue,
          maxValue: row.maxValue,
          unit: row.unit || '',
          category: row.category || '',
          dataType: row.dataType || ''
        }
        if (test.id) {
          promises.push(updateInspResult({ ...params, id: test.id }))
          updateCount++
        } else {
          promises.push(saveInspResult(params))
          addCount++
        }
      })
    })

    await Promise.all(promises)
    emit('submit', { ...props.orderData, items: items.value })
    dialogVisible.value = false

    if (addCount && updateCount)
      ElMessage.success(`成功新增 ${addCount} 条，更新 ${updateCount} 条记录`)
    else if (addCount)
      ElMessage.success(`成功新增 ${addCount} 条记录`)
    else
      ElMessage.success(`成功更新 ${updateCount} 条记录`)
  } catch (e) {
    console.error('提交失败', e)
    ElMessage.error('提交失败，请重试')
  } finally {
    loading.close()
  }
}

/* ---------- 打印 ---------- */
const printReport = () => window.print()
</script>

<style scoped>
.dialog-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f5f6fa;
  min-height: 400px;
}

.section-card {
  background: #fff;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header .title {
  font-weight: 600;
  font-size: 16px;
}

.info-desc {
  background: #fafafa;
}

.insp-table {
  border-radius: 6px;
  overflow: hidden;
}

/* 平行试验样式 */
.test-records { padding: 4px 0; }
.test-items { align-items: flex-start; }
.test-item {
  padding: 4px;
  background: #f8f9fa;
  border-radius: 4px;
  align-items: center;
}
.test-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}
.test-value {
  font-size: 14px;
  color: #333;
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  min-width: 150px;
  display: inline-block;
}
.test-input {
  vertical-align: middle;
}
.add-test-btn {
  padding: 4px 12px;
}

/* 文件链接 */
.file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.file-link {
  display: inline-block;
  padding: 0 4px;
  color: var(--el-color-primary);
  text-decoration: underline;
  cursor: pointer;
}
.file-link:hover {
  color: var(--el-color-primary-light-3);
}

.footer-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
}

/* 小屏幕适配 */
@media (max-width: 1200px) {
  .test-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
  }
  .test-input { width: 100% !important; }
}
</style>