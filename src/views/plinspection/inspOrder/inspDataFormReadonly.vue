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
            <!-- 移除添加项目和套用标准按钮 -->
          </div>
        </template>

        <!-- 只读版本检验项目表格 -->
        <el-table
          :data="items"
          border
          stripe
          size="small"
          row-key="inspItemId"
          class="insp-table"
          :show-header="true"
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
          
          <!-- 平行试验数据列 - 只读展示 -->
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
          
          <!-- 移除操作列 -->
        </el-table>
      </el-card>
    </div>

    <!-- ========== 底部按钮 - 只保留关闭按钮 ========== -->
    <template #footer>
      <div class="footer-bar">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>

    <!-- 移除所有弹窗组件 -->
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getInspResultByOrderId } from '@/api/plinspection/inspResult'

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
          id: '',
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

// 移除所有编辑相关方法（addTest、removeTest、removeItem、handleItemsSelected、handleStdSelected、submitInspection、printReport）
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
  justify-content: flex-start; /* 改为左对齐 */
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

/* 平行试验样式优化（只读版本） */
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
  
  .test-value {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>