<template>
  <el-dialog
    v-model="visible"
    title="检验单详情"
    width="1200px"
    class="inspection-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :show-close="true"
  >
    <div class="dialog-body">
      <!-- ========== 基本信息 ========== -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header">
            <span class="title">基本信息</span>
          </div>
        </template>

        <!-- ============ 物料选择展示区（必填） - 使用 el-descriptions ============ -->
        <div class="mb-6">
          <div class="text-lg font-semibold mb-3 text-gray-800">
            采购计划信息
          </div>

          <el-descriptions
            v-if="selectedMat"
            :column="3"
            border
            size="small"
            class="info-desc"
          >
            <el-descriptions-item label="合同编号">
              {{ selectedMat.contractNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="合同名称">
              <el-tooltip :content="selectedMat.contractName" placement="top">
                <span class="truncate-line">{{ selectedMat.contractName || '-' }}</span>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="物料编号">
              {{ selectedMat.itemNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="物料名称">
              <el-tooltip :content="selectedMat.itemName" placement="top">
                <span class="truncate-line">{{ selectedMat.itemName || '-' }}</span>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="规格型号">
              <el-tooltip :content="selectedMat.itemSpec" placement="top">
                <span class="truncate-line">{{ selectedMat.itemSpec || '-' }}</span>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="物料分类">
              {{ selectedMat.inclass || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="采购计划编号">
              {{ selectedMat.purchaseOrderNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="采购计划名称">
              <el-tooltip :content="selectedMat.orderName" placement="top">
                <span class="truncate-line">{{ selectedMat.orderName || '-' }}</span>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="采购计划备注" :span="2">
              <el-tooltip :content="selectedMat.orderFormMemo" placement="top">
                <span class="truncate-line">{{ selectedMat.orderFormMemo || '无' }}</span>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="制定人">
              {{ selectedMat.orderWriter || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="单位">
              {{ selectedMat.unit || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="计划数量">
              {{ selectedMat.planQuantity || '-' }}
            </el-descriptions-item>
          </el-descriptions>

          <div v-else-if="props.orderData.purchaseId" class="text-gray-500 text-sm pl-4 mt-2">
            采购物料信息加载中或暂无数据
          </div>
        </div>

        <!-- ============ 原有检验单基本信息 ============ -->
          <div class="text-lg font-semibold mb-3 text-gray-800">
            检验单信息
          </div>
        <el-descriptions :column="3" border size="small" class="info-desc">
          <el-descriptions-item label="检验单号">
            <strong>{{ orderData.orderNo || '-' }}</strong>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="状态">
            <el-tag :type="statusInfo.type">{{ statusInfo.label }}</el-tag>
          </el-descriptions-item> -->
                    <el-descriptions-item label="牌号">{{ orderData.matNo || '-' }}</el-descriptions-item>

          <el-descriptions-item label="到货时间">{{ formatDate(orderData.deliveryTime) }}</el-descriptions-item>
          <el-descriptions-item label="物料名称">{{ orderData.itemName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ orderData.itemCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物料型号">{{ orderData.itemSpec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验标准">{{ orderData.inspStandard || '-' }}</el-descriptions-item>
          <el-descriptions-item label="炉批号">{{ orderData.batchNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ orderData.batchNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="到货型号">{{ orderData.actualSpec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际到货数量">{{ orderData.actualQuantity || '-' }} </el-descriptions-item>
          <el-descriptions-item label="实际到货重量">{{ orderData.actualWeight || '-' }}  {{orderData.unit}}</el-descriptions-item>
          <el-descriptions-item label="检验数量">{{ orderData.inspQuantity || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验录入时间">{{ formatDate(orderData.inspectTime) }}</el-descriptions-item>
          <el-descriptions-item label="检验完成时间">{{ formatDate(orderData.inspectFinishTime) }}</el-descriptions-item>
          <el-descriptions-item label="报检人">{{ orderData.reporter || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验人">{{ orderData.inspector || '-' }}</el-descriptions-item>
          <el-descriptions-item label="入库审核人">{{ orderData.storageReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="报检审核人">{{ orderData.reportReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验审核人">{{ orderData.inspectReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="入库时间">{{ formatDate(orderData.inStockTime) }}</el-descriptions-item>

          <!-- 质量证明书 -->
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

      <!-- ========== 检验项目部分（保持不变）========== -->
      <el-card shadow="never" class="section-card mt-4">
        <template #header>
          <div class="section-header">
            <span class="title">检验项目</span>
          </div>
        </template>
        <el-table :data="items" border stripe size="small" row-key="inspItemId" class="insp-table">
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
          <el-table-column label="平行试验" min-width="300">
            <template #default="{ row }">
              <div class="test-records">
                <div class="test-items flex flex-wrap gap-3">
                  <div v-for="(test, index) in row.tests" :key="test.testIndex" class="test-item flex items-center gap-2">
                    <span class="test-label">试验{{ index + 1 }}:</span>
                    <span class="test-value">{{ test.actualValue || '-' }}</span>
                  </div>
                </div>
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
        </el-table>
      </el-card>
    </div>

    <template #footer>
      <div class="footer-bar">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="openPrint">打印检验单</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getInspResultByOrderId } from '@/api/plinspection/inspResult'
import { getContractMaterial } from '@/api/contract/bascontractmaterial'  // 确保路径正确
import { baseURL } from '@/utils/request'

const props = defineProps({
  modelValue: Boolean,
  orderData: { type: Object, required: true, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

/* ---------- 日期格式化 ---------- */
const formatDate = date =>
  date
    ? new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    : '-'

/* ---------- 打印 ---------- */
const openPrint = () => {
  if (!items.value.length) {
    ElMessage.warning('请先加载检验项目数据')
    return
  }
  const printData = {
    orderData: props.orderData,
    items: items.value,
    statusLabel: statusInfo.value.label,
    statusType: statusInfo.value.type,
    companyName: '四平器材'
  }
  localStorage.setItem('temp_print_inspection_data', JSON.stringify(printData))
  const printUrl = `${window.location.origin}/erp/print-inspection`
  const printWin = window.open(printUrl, '_blank', 'width=1100,height=900')
  if (!printWin) {
    ElMessage.error('请允许弹出窗口')
    localStorage.removeItem('temp_print_inspection_data')
  }
}

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

/* ---------- 质量证明书 ---------- */
const parseCertificate = s => {
  if (!s) return []
  try {
    const arr = JSON.parse(s)
    return Array.isArray(arr) ? arr.map(url => ({
      name: url.split('/').pop() || '未知文件',
      url
    })) : []
  } catch { return [] }
}
const certificateFiles = computed(() => parseCertificate(props.orderData.certificate))
const openFileInNewWindow = url => {
  if (!url) return
  const full = url.startsWith('http') ? url : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  window.open(full, '_blank')
}

/* ---------- 采购物料信息加载 ---------- */
const selectedMat = ref(null)
const loadPurchaseMaterial = async () => {
  if (!props.orderData?.purchaseId) {
    selectedMat.value = null
    return
  }
  try {
    const res = await getContractMaterial({ id: props.orderData.purchaseId })
    if (res.success && res.data?.record) {
      selectedMat.value = res.data.record
    } else {
      selectedMat.value = null
    }
  } catch (e) {
    console.error('加载采购物料失败', e)
    selectedMat.value = null
  }
}

/* ---------- 检验项目加载 ---------- */
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
    Object.values(groupMap).forEach(g => g.tests.sort((a, b) => a.testIndex - b.testIndex))
    items.value = Object.values(groupMap)
    items.value.forEach(row => {
      if (!row.tests.length) row.tests.push({ id: '', testIndex: 1, actualValue: '' })
    })
  } catch (e) {
    console.error('加载检验结果失败', e)
    ElMessage.error('加载数据失败')
  }
}

/* ---------- 监听打开与数据变化 ---------- */
watch(
  () => [props.orderData?.id, props.orderData?.purchaseId, visible.value],
  ([newId, newPurchaseId, isVisible]) => {
    if (isVisible) {
      if (newId) loadInspectionResult()
      if (newPurchaseId) loadPurchaseMaterial()
    }
  },
  { immediate: true }
)
</script>

<style scoped>

/* 新增：长文本截断 + 鼠标悬停完整显示（配合 el-tooltip） */
.truncate-line {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inspection-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #f5f6fa;
  max-height: 80vh;
  overflow-y: auto;
}
.dialog-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section-card {
  background: #fff;
  border-radius: 8px;
}
.section-header .title {
  font-weight: 600;
  font-size: 16px;
}

/* ============ 新的物料信息卡片样式 ============ */
.material-info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}
.material-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.material-info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.material-info-item .label {
  color: #646c7d;
  width: 110px;
  flex-shrink: 0;
}
.material-info-item .value {
  color: #2d3748;
  flex: 1;
  word-break: break-all;
}

/* 原有样式保持不变 */
.info-desc { background: #fafafa; }
.insp-table { border-radius: 6px; overflow: hidden; }
.test-item { padding: 4px; background: #f8f9fa; border-radius: 4px; }
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
.file-container { display: flex; flex-wrap: wrap; gap: 8px; }
.file-link {
  color: var(--el-color-primary);
  text-decoration: underline;
  cursor: pointer;
}
.file-link:hover { color: var(--el-color-primary-light-3); }
.footer-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
</style>