<template>
  <el-dialog
    v-model="visible"
    title="检验单详情"
    width="1100px"
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
              <!-- 保持 flex 布局：横向排列 + 换行 + 间距 -->
              <div class="file-container" >
                <div v-for="(f, i) in certificateFiles" :key="i">
                  <el-tooltip :content="f.name">
                    <!-- 关键：添加 inline-block 确保行内排列，同时保留链接样式 -->
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

          <!-- 平行试验数据列 -->
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

          <!-- 如需在表格里也展示质量证明书，可取消下面注释 -->
          <!--
          <el-table-column label="质量证明书" width="180">
            <template #default="{ row }">
              <div v-if="row.certificate && parseCertificate(row.certificate).length">
                <div v-for="(f, i) in parseCertificate(row.certificate)" :key="i" style="margin-bottom:4px">
                  <el-tooltip :content="f.name">
                    <span class="file-link" @click="openFileInNewWindow(f.url)">{{ f.name }}</span>
                  </el-tooltip>
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          -->
        </el-table>
      </el-card>
    </div>

    <!-- 底部按钮 -->
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
import { baseURL } from '@/utils/request'   // <-- 确保这里能导出 baseURL
import PrintModel from '../components/printModel.vue' 
/* ---------- Props & Emits ---------- */
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
const formatDate = date => date
  ? new Date(date).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-')
  : '-'


  /*------------打印-----------------*/
// 新增：新窗口打开打印页
// 主页面 script setup 中的 openPrint 方法
const openPrint = () => {
  if (!items.value.length) {
    ElMessage.warning('请先加载检验项目数据')
    return
  }

  // 1. 准备要传递的数据
  const printData = {
    orderData: props.orderData,
    items: items.value,
    statusLabel: statusInfo.value.label,
    statusType: statusInfo.value.type,
    companyName: '四平器材',
  }

  // 2. 存入 localStorage（用唯一键名，避免和其他数据冲突）
  localStorage.setItem('temp_print_inspection_data', JSON.stringify(printData))

  // 3. 打开打印页（直接用绝对路径，简单粗暴）
  const printUrl = `${window.location.origin}/erp/print-inspection`
  const printWin = window.open(printUrl, '_blank', 'width=1100,height=900')

  if (!printWin) {
    ElMessage.error('请允许弹出窗口')
    // 打开失败时删除 localStorage 数据，避免残留
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

    // 若某项目没有试验记录，默认补一条空记录（保持 UI 一致）
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
  () => [props.orderData?.id, visible.value],
  ([newId, isVisible]) => {
    if (newId && isVisible) {
      loadInspectionResult()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.inspection-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #f5f6fa;
  max-height: 75vh;
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

.section-header {
  display: flex;
  justify-content: flex-start;
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

/* 文件链接 */
/* .file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
.file-link:hover { color: #66b1ff; } */

.file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* 等同于 gap-2（假设 1rem=16px） */
}
.file-link {
  display: inline-block;
  padding: 0 4px;
  color: var(--el-color-primary); /* 模仿 el-link 蓝色 */
  text-decoration: underline;
  cursor: pointer;
}
.file-link:hover {
  color: var(--el-color-primary-light-3); /* hover 效果，可选 */
}

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

/* 小屏幕适配 */
@media (max-width: 1200px) {
  .test-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
  }
  .test-value { width: 100%; box-sizing: border-box; }
}
</style>