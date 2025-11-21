<template>
  <div class="production-work-orders">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">合同号：</span>
          <el-input v-model="filters.contractNo" placeholder="请输入合同号" clearable style="width: 200px;" />
        </div>
        <div class="filter-item">
          <span class="filter-label">合同名称：</span>
          <el-input v-model="filters.contractName" placeholder="请输入合同名称" clearable style="width: 200px;" />
        </div>
        <div class="filter-item">
          <span class="filter-label">生产工单号：</span>
          <el-input v-model="filters.woNo" placeholder="请输入生产工单号" clearable style="width: 200px;" />
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </el-card>

    <!-- 生产工单列表 -->
    <div class="order-list-full">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>生产工单列表</span>
            <el-button type="primary" @click="showSelector = true">制定生产工单</el-button>
          </div>
        </template>

        <el-table
          :data="tableData"
          highlight-current-row
          v-loading="loading"
          height="calc(100vh - 320px)"
        >
          <el-table-column type="index" label="序号" width="60" />
          
          <!-- 工单整体状态 -->
          <el-table-column label="状态" width="140" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small" effect="dark">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="woNo" label="生产工单号" width="100" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link type="primary">{{ row.woNo }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="materialsCode" label="物料编码" width="100" show-overflow-tooltip />
          <el-table-column prop="materialsName" label="物料名称" width="100" show-overflow-tooltip />
          <el-table-column prop="modelSpec" label="规格型号" width="100" show-overflow-tooltip />
          <el-table-column label="生产数量" width="80" align="center">
            <template #default="{ row }">
              {{ row.amount }} {{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column label="计划日期" width="190" align="center">
            <template #default="{ row }">
              {{ row.planStartDate }} ~ {{ row.planFinishDate }}
            </template>
          </el-table-column>

          <!-- 全部工序（纯文字版，无图标） -->
          <el-table-column label="全部工序" width="360" align="left">
            <template #default="{ row }">
              <div class="process-list">
                <div
                  v-for="(proc, idx) in row.processes"
                  :key="idx"
                  class="process-item"
                  :class="{
                    finished: proc.status == 20,
                    doing: proc.status == 10,
                    todo: ![10, 20].includes(proc.status)
                  }"
                >
                  <el-tag
                    :type=" proc.status == 10 ? 'warning' : 'success'"
                    size="small"
                    effect="dark"
                    style="width: 68px; text-align: center"
                  >
                    {{  proc.status == 10 ? '进行中' : '完成' }}
                  </el-tag>
                  <span class="process-name">{{ proc.name }}</span>
                  <span class="workshop">{{ proc.workshop }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="300" fixed="right" align="center">
            <template #default="{ row }">
              <!-- 10 录入 -->
              <template v-if="row.status === '10'">
                <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, '20')">
                  确认开始生产
                </el-button>
                <el-button size="small" @click="openEditDialog(row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteOrder(row)">删除</el-button>
              </template>

              <!-- 20 已确认（生产中） -->
              <template v-if="row.status === '20'">
                <el-button type="primary" size="small" @click="openReportOrderList(row)">
                  更新报工单
                </el-button>
                <el-button type="success" size="small" @click="handleStatusUpdate(row.id, '30')">
                  完成生产
                </el-button>
                <el-button type="warning" size="small" @click="handleStatusUpdate(row.id, '10')">
                  反确认
                </el-button>
              </template>

              <!-- 30 生产完成 → 申请报检 -->
              <template v-if="row.status === '30'">
                <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, '40')">
                  申请报检
                </el-button>
              </template>

              <!-- 40 申请报检 → 报检通过 -->
              <template v-if="row.status === '40'">
                <el-button type="success" size="small" @click="handleStatusUpdate(row.id, '41')">
                  报检通过
                </el-button>
              </template>

              <!-- 41 报检通过 → 开始检验 -->
              <template v-if="row.status === '41'">
                <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, '50')">
                  开始检验
                </el-button>
              </template>

              <!-- 50 开始检验 → 检验完成 -->
              <template v-if="row.status === '50'">
                <el-button type="success" size="small" @click="handleStatusUpdate(row.id, '51')">
                  检验完成
                </el-button>
              </template>

              <!-- 51 检验完成 → 检验审核完成 -->
              <template v-if="row.status === '51'">
                <el-button type="success" size="small" @click="handleStatusUpdate(row.id, '52')">
                  检验审核完成
                </el-button>
              </template>

              <!-- 52 检验审核完成 → 申请入库 -->
              <template v-if="row.status === '52'">
                <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, '60')">
                  申请入库
                </el-button>
              </template>

              <!-- 60 申请入库 → 入库成功 -->
              <template v-if="row.status === '60'">
                <el-button type="success" size="small" @click="handleStatusUpdate(row.id, '61')">
                  入库成功
                </el-button>
              </template>

              <!-- 已完成状态只看报工 -->
              <template v-if="['30','40','41','50','51','52','60','61'].includes(row.status)">
                <el-button type="primary" size="small" @click="openReportOrderList(row.woNo)">
                  查看报工情况
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 弹窗组件 -->
    <editOrder
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleEditSuccess"
    />
    <productionOrderSelector v-model:visible="showSelector" @close="loadData" />
    <reportOrderList v-model:visible="showReportSelector" :woNo="selectWoNo" :ipo-no="selectIpoNo" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Edit, Delete, Document } from '@element-plus/icons-vue'
import { getPlWorkOrderList, deletePlWorkOrder, getPlWorkOrderById, updateOrderStatus } from '@/api/plmanage/plworkorder'

import editOrder from './components/editOrder.vue'
import productionOrderSelector from './components/productionOrderSelector.vue'
import reportOrderList from './components/reportOrderList.vue'

const loading = ref(false)
const editDialogVisible = ref(false)
const formData = ref({})
const showSelector = ref(false)
const showReportSelector = ref(false)
const selectWoNo = ref('')
const selectIpoNo = ref('')
const openReportOrderList = (row) => {
  selectWoNo.value = row.woNo,
  selectIpoNo.value = row.ipoNo
  showReportSelector.value = true
}

const filters = reactive({ contractNo: '', contractName: '', woNo: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })
const tableData = ref([])

// 加载数据（含模拟工序数据，实际使用时删掉 processes 部分即可）
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.contractNo || undefined,
      contractName: filters.contractName || undefined,
      woNo: filters.woNo || undefined
    }

    const res = await getPlWorkOrderList(params)
    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        id: item.id,
        woNo: item.woNo,
        ipoNo: item.ipoNo,
        materialsCode: item.materialsCode,
        materialsName: item.materialsName,
        modelSpec: item.modelSpec || '无',
        amount: item.amount,
        unit: item.unit,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        status: item.status || '10',

       processes: item.processes
      ? item.processes.split(';').map(procStr => {
          const [name, workshop, status, writer] = procStr.split('|')
          return {
            name,
            workshop,
            status: Number(status),
            writer
          }
        })
      : []
        
      }))
      pagination.total = res.data.page.totalRow
    }
  } catch (err) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 状态映射（统一维护）
const getStatusText = (status) => ({
  '10': '录入',
  '20': '已确认',
  '30': '生产完成',
  '40': '申请报检',
  '41': '报检通过',
  '50': '开始检验',
  '51': '检验完成',
  '52': '检验审核完成',
  '60': '申请入库',
  '61': '入库成功'
}[status] || '未知状态')

const getStatusTagType = (status) => ({
  '10': 'info',
  '20': 'primary',
  '30': 'success',
  '40': 'warning',
  '41': 'success',
  '50': 'warning',
  '51': 'success',
  '52': 'success',
  '60': 'warning',
  '61': 'success'
}[status] || 'info')

// 其余函数（查询、重置、分页、编辑、删除、状态更新）保持不变
const handleSearch = () => { pagination.current = 1; loadData() }
const handleReset = () => {
  Object.keys(filters).forEach(k => filters[k] = '')
  pagination.current = 1
  loadData()
}
const handleSizeChange = (val) => { pagination.size = val; pagination.current = 1; loadData() }
const handleCurrentChange = (val) => { pagination.current = val; loadData() }

const openEditDialog = async (id) => {
  const res = await getPlWorkOrderById({ id })
  formData.value = res.data.order
  editDialogVisible.value = true
}
const handleEditSuccess = () => {
  editDialogVisible.value = false
  ElMessage.success('编辑成功')
  loadData()
}

const handleStatusUpdate = async (id, newStatus) => {
  const texts = {
    '20': '确认开始生产', '30': '标记生产完成', '40': '申请报检',
    '41': '标记报检通过', '50': '开始检验', '51': '标记检验完成',
    '52': '检验审核完成', '60': '申请入库', '61': '入库成功', '10': '反确认'
  }
  try {
    await ElMessageBox.confirm(`确定要“${texts[newStatus]}”吗？`, '操作确认', { type: 'warning' })
    const res = await updateOrderStatus({ id, status: newStatus })
    if (res.code === 200) {
      ElMessage.success('操作成功')
      loadData()
    } else ElMessage.error(res.msg || '操作失败')
  } catch { /* 取消不提示 */ }
}

const deleteOrder = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除工单 ${row.woNo} 吗？`, '删除确认', { type: 'warning' })
    const res = await deletePlWorkOrder({ id: row.id })
    if (res.code === 200 && res.success) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch { }
}

onMounted(loadData)
</script>

<style scoped>
.production-work-orders { padding: 20px; background: #f5f5f5; min-height: 100vh; }
.filter-card { margin-bottom: 20px; }
.filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-label { font-size: 13px; font-weight: 500; color: #606266; white-space: nowrap; }
.filter-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.pagination-container { margin-top: 16px; text-align: right; }

/* 工序列表样式（纯文字） */
.process-list { display: flex; flex-direction: column; gap: 7px; font-size: 13px; }
.process-item { display: flex; align-items: center; gap: 10px; }
.process-item.finished { color: #67c23a; }
.process-item.doing    { color: #e6a23c; font-weight: 500; }
.process-item.todo     { color: #909399; }
.process-name { min-width: 50px; font-weight: 500; }
.workshop { color: #999; font-size: 12px; }
</style>