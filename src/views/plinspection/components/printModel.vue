<template>
  <div class="print-page" ref="printRef">
    <!-- 页眉：公司 + 标题 -->
    <div class="print-header">
      <div class="company-block">
        <img v-if="logo" :src="logo" class="company-logo" alt="logo" />
        <div class="company-info">
          <div class="company-name">{{ companyName }}</div>
          <div class="company-sub">检验单（Inspection Report）</div>
        </div>
      </div>

      <div class="title-block">
        <div class="report-title">检 验 单</div>
        <div class="order-no">检验单号：{{ orderData.orderNo || '-' }}</div>
      </div>
    </div>

    <!-- 基本信息 -->
    <section class="section info-section">
      <table class="info-table">
        <tbody>
          <tr>
            <!-- <td class="label">状态</td>
            <td>
              <el-tag :type="statusInfo.type" size="small">{{ statusInfo.label }}</el-tag>
            </td> -->
            <td class="label">牌号</td><td>{{ orderData.matNo || '-' }}</td>
            <td class="label">到货时间</td><td>{{ formatDate(orderData.deliveryTime) }}</td>
          </tr>
          <tr>
            <td class="label">物料名称</td><td>{{ orderData.itemName || '-' }}</td>
            <td class="label">物料编码</td><td>{{ orderData.itemCode || '-' }}</td>
          </tr>
          <tr>
            <td class="label">物料型号</td><td>{{ orderData.itemSpec || '-' }}</td>
            <td class="label">到货型号</td><td>{{ orderData.actualSpec || '-' }}</td>
          </tr>
          <tr>
            <td class="label">检验标准</td><td>{{ orderData.inspStandard || '-' }}</td>
            <td class="label">炉批号</td><td>{{ orderData.batchNo || '-' }}</td>
          </tr>
          <tr>
            <td class="label">批次号</td><td>{{ orderData.batchNumber || '-' }}</td>
            <td class="label">检验数量</td><td>{{ orderData.inspQuantity || '-' }}</td>
          </tr>
          <tr>
            <td class="label">实际到货数量</td><td>{{ orderData.actualQuantity || '-' }}</td>
            <td class="label">实际到货重量</td><td>{{ orderData.actualWeight || '-' }}   {{orderData.unit}}</td>
          </tr>
          <tr>
            <td class="label">检验录入时间</td><td>{{ formatDate(orderData.inspectTime) }}</td>
            <td class="label">检验完成时间</td><td>{{ formatDate(orderData.inspectFinishTime) }}</td>
          </tr>
          <tr>
            <td class="label">报检人</td><td>{{ orderData.reporter || '-' }}</td>
            <td class="label">检验人</td><td>{{ orderData.inspector || '-' }}</td>
          </tr>
          <tr>
            <td class="label">入库审核人</td><td>{{ orderData.storageReviewer || '-' }}</td>
            <td class="label">报检审核人</td><td>{{ orderData.reportReviewer || '-' }}</td>
          </tr>
          <tr>
            <td class="label">检验审核人</td><td>{{ orderData.inspectReviewer || '-' }}</td>
            <td class="label">入库时间</td><td>{{ formatDate(orderData.inStockTime) }}</td>
          </tr>

          <!-- 质量证明书 -->
          <tr>
            <td class="label">质量证明书</td>
            <td colspan="3">
              <div v-if="certificateFiles.length" class="cert-list">
                <span v-for="(f, i) in certificateFiles" :key="i" class="cert-item">
                  <template v-if="!isPrintMode && f.url">
                    <a :href="fullUrl(f.url)" target="_blank" rel="noopener">{{ f.name }}</a>
                  </template>
                  <template v-else>
                    {{ f.name }}
                  </template>
                  <!-- 新增：多个文件换行显示更清晰 -->
                  <span v-if="i < certificateFiles.length - 1">、</span>
                </span>
              </div>
              <span v-else>-</span>
            </td>
          </tr>

          <!-- 备注（只有有内容才显示） -->
          <tr v-if="orderData.remark">
            <td class="label">整单备注</td><td colspan="3">{{ orderData.remark }}</td>
          </tr>
          <tr v-if="orderData.inspRemark">
            <td class="label">检验备注</td><td colspan="3">{{ orderData.inspRemark }}</td>
          </tr>
          <tr v-if="orderData.stockRemark">
            <td class="label">入库备注</td><td colspan="3">{{ orderData.stockRemark }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 检验项目 -->
    <section class="section item-section">
      <h3 class="section-title">检验项目</h3>
      <table class="item-table">
        <thead>
          <tr>
            <th width="40">#</th>
            <th>项目名称</th>
            <th width="80">类别</th>
            <th width="60">单位</th>
            <th width="130">标准值</th>
            <th width="280">平行试验（实测值）</th>
            <th width="80">试验次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in items" :key="row.inspItemId || idx">
            <td>{{ idx + 1 }}</td>
            <td class="left">{{ row.inspItemName || '-' }}</td>
            <td>{{ row.category || '-' }}</td>
            <td>{{ row.unit || '-' }}</td>
            <td class="left">
              <template v-if="row.minValue !== null && row.maxValue !== null">{{ row.minValue }} - {{ row.maxValue }}</template>
              <template v-else-if="row.minValue !== null">≥ {{ row.minValue }}</template>
              <template v-else-if="row.maxValue !== null">≤ {{ row.maxValue }}</template>
              <template v-else>{{ row.standardValue || '-' }}</template>
            </td>
            <td class="left">
              <div class="test-values">
                <span v-for="(t, i) in row.tests" :key="i" class="test-chip">
                  试{{ i + 1 }}: {{ t.actualValue || '-' }}
                </span>
              </div>
            </td>
            <td>{{ (row.tests && row.tests.length) || 0 }}</td>
          </tr>
          <tr v-if="!items || items.length === 0">
            <td colspan="7">无检验项目</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 签名区（自动填充姓名 + 打印时间） -->
    <!-- <section class="section sign-section">
      <div class="sign-grid">
        <div class="sign-item">
          <div>报检人：</div>
          <div class="sign-line"></div>
          <div class="sign-name">{{ orderData.reporter || '' }}</div>
        </div>
        <div class="sign-item">
          <div>检验人：</div>
          <div class="sign-line"></div>
          <div class="sign-name">{{ orderData.inspector || '' }}</div>
        </div>
        <div class="sign-item">
          <div>审核人：</div>
          <div class="sign-line"></div>
          <div class="sign-name">{{ orderData.inspectReviewer || '' }}</div>
        </div>
        <div class="sign-item">
          <div>打印日期：</div>
          <div class="sign-line"></div>
          <div class="sign-name">{{ printDate }}</div>
        </div>
      </div>
    </section> -->

    <!-- 页脚 -->
    <div class="print-footer">
      打印时间：{{ printDateTime }}　　系统生成，禁止手工修改
    </div>

    <!-- 预览时的打印按钮 -->
    <div class="action-bar" v-if="!isPrintMode">
      <el-button type="primary" size="large" @click="handlePrint">打印检验单</el-button>
      <!-- <el-button @click="$emit('close')">关闭</el-button> -->
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'

const orderData = ref({})
const items = ref([])
const statusLabel = ref('加载中...')
const statusType = ref('info')
const companyName = ref('四平器材')
const logo = ref('')

onMounted(() => {
  try {
    // 1. 从 localStorage 读取数据
    const tempData = localStorage.getItem('temp_print_inspection_data')
    
    if (!tempData) {
      statusLabel.value = '无打印数据'
      return
    }

    // 2. 解析数据
    const parsed = JSON.parse(tempData)
    
    // 3. 赋值给页面变量
    orderData.value = parsed.orderData || {}
    items.value = parsed.items || []
    statusLabel.value = parsed.statusLabel || '未知'
    statusType.value = parsed.statusType || 'info'
    if (parsed.companyName) companyName.value = parsed.companyName

    console.log('打印数据读取成功！', parsed)

    // 4. 关键：读取后立即删除，避免数据残留（安全+干净）
    localStorage.removeItem('temp_print_inspection_data')

  } catch (e) {
    console.error('读取打印数据失败', e)
    statusLabel.value = '数据解析错误'
    // 出错也删除残留数据
    localStorage.removeItem('temp_print_inspection_data')
  }
})


const statusInfo = computed(() => ({
  label: statusLabel.value,
  type: statusType.value
}))

const now = new Date()
const printDate = now.toLocaleDateString('zh-CN')
const printDateTime = now.toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit'
}).replace(/\//g, '-')

const formatDate = (date) =>
  date ? new Date(date).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(/\//g, '-') : '-'

const parseCertificate = (s) => {
  if (!s) return []
  try {
    const arr = JSON.parse(s)
    return (Array.isArray(arr) ? arr : [arr]).map(i => ({
      name: (typeof i === 'string' ? i : i.url || '').split('/').pop() || '文件',
      url: typeof i === 'string' ? i : i.url || ''
    }))
  } catch {
    return s ? [{ name: s.split('/').pop(), url: s }] : []
  }
}
const certificateFiles = computed(() => parseCertificate(orderData.value?.certificate))

const fullUrl = (url) => url ? (/^https?:\/\//i.test(url) ? url : `/erp${url.startsWith('/') ? '' : '/'}${url}`) : ''

const isPrintMode = ref(false)
const handlePrint = () => {
  isPrintMode.value = true
  setTimeout(() => {
    window.print()
    setTimeout(() => isPrintMode.value = false, 600)
  }, 150)
}
</script>

<style scoped>
/* A4 尺寸布局 */
.print-page {
  width: 210mm;
  min-height: 297mm;
  margin: 12mm auto;
  padding: 16mm;
  box-sizing: border-box;
  background: #fff;
  color: #000;
  font-family: "SimSun", "Microsoft Yahei", Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
}

/* 页眉 */
.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 2px solid #333;
  padding-bottom: 8px;
}
.company-block { display:flex; align-items:center; gap:12px; }
.company-logo { width:64px; height:64px; object-fit:contain; }
.company-name { font-weight:700; font-size:16px; }
.company-sub { font-size:12px; color:#666; }

.title-block { text-align:right; }
.report-title { font-size:24px; font-weight:900; letter-spacing: 6px; }
.order-no { font-size:13px; color:#333; }

/* 表格 */
.section { margin-top: 16px; }
.info-table, .item-table {
  width: 100%;
  border-collapse: collapse;
}
.info-table td {
  border: 1px solid #333;
  padding: 7px 10px;
  vertical-align: middle;
}
.label {
  background: #f5f7fa;
  font-weight: 600;
  width: 110px;
  text-align: right;
}

.item-table th, .item-table td {
  border: 1px solid #333;
  padding: 7px 8px;
  text-align: center;
}
.item-table th { background: #f2f2f2; font-weight:600; }
.left { text-align: left; }

.test-values { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  justify-content: center; 
  padding: 4px 0;
}
.test-chip {
  padding: 4px 10px;
  border: 1px solid #999;
  border-radius: 4px;
  font-size: 12px;
  min-width: 66px;
}

.cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  line-height: 1.8;
}
.cert-item a {
  color: #409eff;
  text-decoration: underline;
}

/* 签名区网格布局 */
.sign-section {
  margin-top: 30px;
}
.sign-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.sign-item {
  text-align: center;
}
.sign-line {
  border-bottom: 1px solid #333;
  margin: 20px 0 6px;
  height: 30px;
}
.sign-name {
  font-size: 12px;
  color: #666;
}

/* 页脚 */
.print-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #888;
  border-top: 1px dashed #ccc;
  padding-top: 10px;
}

/* 操作按钮 */
.action-bar {
  margin-top: 25px;
  text-align: center;
}

/* 打印优化 */
@media print {
  .action-bar { display: none !important; }
  body { background: #fff; margin: 0; }
  .print-page {
    margin: 0;
    padding: 12mm;
    box-shadow: none;
  }
  @page { margin: 10mm; }
  .print-page { page-break-after: always; }
}
</style>