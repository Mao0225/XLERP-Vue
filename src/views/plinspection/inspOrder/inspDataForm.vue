<template>
  <el-dialog
    v-model="visible"
    title="检验单详情"
    width="1100px"
    class="inspection-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
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
          <el-descriptions-item label="状态">
            <el-tag :type="orderData.status === '已完成' ? 'success' : 'info'">
              {{ orderData.status || '未检验' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="报检人">{{ orderData.reporter || '-' }}</el-descriptions-item>

          <el-descriptions-item label="标准ID">{{ orderData.standardId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="炉批号">{{ orderData.batchNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ orderData.batchNumber || '-' }}</el-descriptions-item>

          <el-descriptions-item label="检验数量">{{ orderData.quantity || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际到货数量">{{ orderData.actualQuantity || '-' }}</el-descriptions-item>
          <el-descriptions-item label="实际到货重量">{{ orderData.actualWeight || '-' }}</el-descriptions-item>

          <el-descriptions-item label="检验日期">{{ formatDate(orderData.inspectDate) }}</el-descriptions-item>
          <el-descriptions-item label="到货日期">{{ formatDate(orderData.deliveryTime) }}</el-descriptions-item>
          <el-descriptions-item label="入库时间">{{ formatDate(orderData.inStockTime) }}</el-descriptions-item>

          <el-descriptions-item label="报检审核人">{{ orderData.reportReviewer || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验人">{{ orderData.inspector || '-' }}</el-descriptions-item>
          <el-descriptions-item label="检验审核人">{{ orderData.inspectReviewer || '-' }}</el-descriptions-item>

          <el-descriptions-item label="质量证明书" :span="3">
            <template v-if="orderData.certificate && JSON.parse(orderData.certificate).length">
              <div class="flex flex-wrap gap-2">
                <el-link
                  v-for="(url, i) in JSON.parse(orderData.certificate)"
                  :key="i"
                  :href="url"
                  target="_blank"
                  type="primary"
                  icon="Link"
                >
                  附件{{ i + 1 }}
                </el-link>
              </div>
            </template>
            <span v-else>-</span>
          </el-descriptions-item>

          <el-descriptions-item label="整单备注" :span="3">
            <span class="text-gray-700">{{ orderData.remark || '-' }}</span>
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

        <!-- 简化后的检验项目表格 - 平行试验直接显示 -->
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
          
          <!-- 平行试验数据列 - 直接显示所有试验记录（移除备注） -->
          <el-table-column label="平行试验" min-width="300">
            <template #default="{ row }">
              <div class="test-records">
                <!-- 现有试验记录 -->
                <div class="test-items flex flex-wrap gap-3 mb-2">
                  <div v-for="(test, index) in row.tests" :key="test.testIndex" class="test-item flex items-center gap-2">
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
                
                <!-- 添加试验按钮 -->
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

    <!-- ========== 底部按钮固定 ========== -->
    <template #footer>
      <div class="footer-bar">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="success" @click="submitInspection">提交检验</el-button>
        <el-button type="info" @click="printReport">打印报告</el-button>
      </div>
    </template>

    <!-- ========== 弹窗组件 ========== -->
    <item-selector-dialog v-model="selectorVisible" @confirm="handleItemsSelected" />
    <stdSelectDialog v-model="stdSelectorVisible" @confirm="handleStdSelected" />
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import ItemSelectorDialog from '../components/ItemSelectorDialog.vue'
import stdSelectDialog  from '../components/stdSelectDialog.vue'
import { 
  saveInspResult,    // 新增接口
  updateInspResult,  // 更新接口
  getInspResultByOrderId,
  deleteInspResult   // 删除接口
} from '@/api/plinspection/inspResult'

const props = defineProps({
  modelValue: Boolean,
  orderData: { type: Object, required: true, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

/* ---------- 日期格式化 ---------- */
const formatDate = date => date ? new Date(date).toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit'
}).replace(/\//g, '-') : '-'

/* ---------- 检验项目 & 平行试验 ---------- */
const items = ref([])               // 主表（每行一个检验项目）

/* ---------- 加载编辑数据 ---------- */
const loadInspectionResult = async () => {
  try {
    const { data } = await getInspResultByOrderId({ orderId: props.orderData.id })
    // data.list 为后端返回的平铺数组
    const list = data?.list || []

    // 按 inspItemId 分组
    const groupMap = {}
    list.forEach(item => {
      const key = item.inspItemId
      if (!groupMap[key]) {
        groupMap[key] = {
          inspItemId: key,
          inspStdItemId: item.inspStdItemId || '',  // 保存标准子项ID
          inspItemCode: item.inspItemCode || '',
          inspItemName: item.inspItemName,
          category: item.category || '',            // 从后端返回
          unit: item.unit || '',                    // 从后端返回
          dataType: item.dataType || '',
          minValue: item.minValue !== undefined ? item.minValue : null,
          maxValue: item.maxValue !== undefined ? item.maxValue : null,
          standardValue: item.standardValue || '',
          tests: []
        }
      }
      groupMap[key].tests.push({
        id: item.id,  // 保存后端返回的记录ID，用于更新/删除
        testIndex: item.testIndex,
        actualValue: item.actualValue || '',
      })
    })

    // 排序 tests（按 testIndex 升序）
    Object.values(groupMap).forEach(g => {
      g.tests.sort((a, b) => a.testIndex - b.testIndex)
    })

    items.value = Object.values(groupMap)

    // 若某项目没有试验记录，默认补一条空记录（保持 UI 一致）
    items.value.forEach(row => {
      if (!row.tests.length) {
        row.tests.push({ 
          id: '',  // 新增记录暂无ID
          testIndex: 1, 
          actualValue: '' 
        })
      }
    })
  } catch (e) {
    console.error('加载检验结果失败', e)
    ElMessage.error('加载数据失败')
  }
}

/* ---------- 监听 orderData 变化（首次打开时加载） ---------- */
watch(
  () => [props.orderData?.id, visible.value],
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
  row.tests.push({ 
    id: '',  // 新增记录暂无ID
    testIndex: nextIndex, 
    actualValue: '' 
  })
}

const removeTest = async (row, index, testId) => {
  // 至少保留一条试验记录
  if (row.tests.length <= 1) {
    ElMessage.warning('至少保留一条试验记录')
    return
  }

  // 确认删除
  try {
    await ElMessageBox.confirm(
      '确定要删除这条平行试验记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 如果是已保存的记录（有ID），调用删除接口
    if (testId) {
      await deleteInspResult({ id: testId })
      ElMessage.success('删除成功')
    }

    // 从列表中移除
    row.tests.splice(index, 1)
    // 重新编号
    row.tests.forEach((t, i) => t.testIndex = i + 1)
  } catch (error) {
    // 取消删除或接口失败
    if (error === 'cancel') {
      ElMessage.info('已取消删除')
      return
    }
    console.error('删除平行试验失败', error)
    ElMessage.error('删除失败，请重试')
  }
}

/* ---------- 主表删除 ---------- */
const removeItem = async (idx) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个检验项目吗？该操作会同时删除相关的平行试验记录',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 获取要删除的项目及其试验记录
    const item = items.value[idx]
    const testIds = item.tests.filter(test => test.id).map(test => test.id)

    // 批量删除已保存的试验记录
    if (testIds.length > 0) {
      await Promise.all(testIds.map(id => deleteInspResult({ id })))
    }

    // 从列表中移除项目
    items.value.splice(idx, 1)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除')
      return
    }
    console.error('删除检验项目失败', error)
    ElMessage.error('删除失败，请重试')
  }
}

/* ---------- 项目选择器 ---------- */
const selectorVisible = ref(false)
const handleItemsSelected = selected => {
  let addCount = 0
  selected.forEach(item => {
    // 通过 inspItemId 去重
    const isExist = items.value.some(i => i.inspItemId === item.id)
    if (!isExist) {
      items.value.push({
        inspItemId: item.id,
        inspStdItemId: '',  // 手动添加的项目暂无标准子项ID
        inspItemCode: item.inspItemCode || '',
        inspItemName: item.inspItemName,
        category: item.category || '',
        unit: item.unit || '',
        dataType: item.dataType || '',
        minValue: null,
        maxValue: null,
        standardValue: '',
        tests: [{ 
          id: '', 
          testIndex: 1, 
          actualValue: '' 
        }]
      })
      addCount++
    }
  })
  selectorVisible.value = false
  if (addCount > 0) {
    ElMessage.success(`成功添加 ${addCount} 个检验项目`)
  } else {
    ElMessage.info('所选项目已全部存在')
  }
}

/* ---------- 标准选择弹窗 ---------- */
const stdSelectorVisible = ref(false)

/**
 * 解析标准值字符串 → minValue / maxValue
 * 支持： ≤1.00%   ≥235   400-500   1.00
 */
function parseStandardValue(str, unit) {
  if (!str) return { minValue: null, maxValue: null, standardValue: '' }

  // 去掉单位（如果有的话，后面会重新拼接）
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
  // 纯数字（如 "1.00"）
  const num = Number(raw)
  if (!isNaN(num)) {
    return { minValue: num, maxValue: num, standardValue: str }
  }
  return { minValue: null, maxValue: null, standardValue: str }
}

/**
 * 标准选择确认回调 - 改为追加项目（去重）
 * @param {Object} payload  { std: {...}, items: [...] }  items中包含标准子项的id
 */
const handleStdSelected = payload => {
  if (!payload || !payload.items?.length) {
    ElMessage.warning('所选标准没有检验项目')
    return
  }

  let addCount = 0
  payload.items.forEach(it => {
    // 通过 inspItemId 去重（判断项目是否已存在）
    const isExist = items.value.some(row => row.inspItemId === it.inspItemId)
    if (!isExist) {
      const { minValue, maxValue, standardValue } = parseStandardValue(it.standardValue, it.unit || '')
      
      items.value.push({
        inspItemId: it.inspItemId,               // 检验项目ID
        inspStdItemId: it.id,                    // 保存标准子项ID（关键修改）
        inspItemCode: it.inspItemCode || '',
        inspItemName: it.inspItemName,
        category: it.category || '',
        unit: it.unit || '',
        dataType: it.dataType || '',
        minValue,
        maxValue,
        standardValue,                           // 原始标准值字符串
        tests: [{ 
          id: '', 
          testIndex: 1, 
          actualValue: '' 
        }]
      })
      addCount++
    }
  })

  stdSelectorVisible.value = false
  if (addCount > 0) {
    ElMessage.success(`已套用标准《${payload.std.standardNo}》，新增 ${addCount} 个检验项目`)
  } else {
    ElMessage.info('该标准的检验项目已全部存在')
  }
}

/* ---------- 提交检验（区分新增/更新，保存inspStdItemId） ---------- */
const submitInspection = async () => {
  // 基本校验
  if (!items.value.length) {
    ElMessage.warning('请至少添加一个检验项目')
    return
  }

  // 校验所有试验记录都有实测值
  const hasEmptyValue = items.value.some(row => 
    row.tests.some(test => !test.actualValue.trim())
  )
  if (hasEmptyValue) {
    ElMessage.warning('请完善所有试验记录的实测值')
    return
  }

  // 显示加载中
  const loading = ElLoading.service({
    lock: true,
    text: '正在提交数据...',
    background: 'rgba(0, 0, 0, 0.1)'
  })

  try {
    const promises = []
    let addCount = 0  // 新增数量
    let updateCount = 0  // 更新数量

    items.value.forEach(row => {
      row.tests.forEach(test => {
        const params = {
          inspOrderId: props.orderData.id,
          inspItemId: row.inspItemId,
          inspStdItemId: row.inspStdItemId || '',  // 提交标准子项ID
          actualValue: test.actualValue.trim(),
          testIndex: test.testIndex,
          // 同步标准相关字段，确保后端数据一致
          standardValue: row.standardValue || '',
          minValue: row.minValue,
          maxValue: row.maxValue,
          unit: row.unit || '',
          category: row.category || '',
          dataType: row.dataType || ''
        }

        // 区分新增和更新
        if (test.id) {
          // 已有ID → 更新，添加id参数
          promises.push(updateInspResult({ ...params, id: test.id }))
          updateCount++
        } else {
          // 无ID → 新增
          promises.push(saveInspResult(params))
          addCount++
        }
      })
    })

    // 批量提交
    await Promise.all(promises)

    // 提交成功后更新父组件状态
    emit('submit', { ...props.orderData, items: items.value })
    visible.value = false

    // 提示信息（区分新增和更新数量）
    if (addCount > 0 && updateCount > 0) {
      ElMessage.success(`成功新增 ${addCount} 条记录，更新 ${updateCount} 条记录`)
    } else if (addCount > 0) {
      ElMessage.success(`成功新增 ${addCount} 条记录`)
    } else {
      ElMessage.success(`成功更新 ${updateCount} 条记录`)
    }
  } catch (e) {
    console.error('提交失败', e)
    ElMessage.error('提交失败，请重试')
  } finally {
    // 关闭加载
    loading.close()
  }
}

/* ---------- 打印 ---------- */
const printReport = () => window.print()
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

/* 平行试验样式优化 */
.test-records {
  padding: 4px 0;
}

.test-items {
  align-items: flex-start;
}

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

.test-input {
  vertical-align: middle;
}

.add-test-btn {
  padding: 4px 12px;
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

/* 适配小屏幕 */
@media (max-width: 1200px) {
  .test-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
  }
  
  .test-input {
    width: 100% !important;
  }
}

/* 禁用状态的删除按钮样式 */
:deep(.el-button--disabled.el-button--text) {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
}
</style>