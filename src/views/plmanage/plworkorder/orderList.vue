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
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small" effect="dark">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="woNo" label="生产工单号" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link type="primary">{{ row.woNo }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="materialsCode" label="物料编码" width="100" show-overflow-tooltip />
          <el-table-column prop="materialsName" label="物料名称" width="150" show-overflow-tooltip />
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

          <!-- 【修改】生产工序流程列 -->
          <el-table-column label="生产工序流程" min-width="380">
            <template #default="{ row }">
              <div class="process-container">
                <template v-if="row.processRoutes && row.processRoutes.length">
                  <div 
                    v-for="(proc, index) in row.processRoutes" 
                    :key="proc.id || index" 
                    class="process-node"
                  >
                    <!-- 工序胶囊 -->
                    <div class="process-capsule">
                      <span class="proc-code">{{ proc.processCode }}</span>
                      <span class="proc-name">{{ proc.processName }}</span>
                    </div>
                    
                    <!-- 连接箭头 (不是最后一个时显示) -->
                    <el-icon v-if="index < row.processRoutes.length - 1" class="proc-arrow">
                      <Right />
                    </el-icon>
                  </div>
                </template>
                
                <span v-else class="no-process-text">暂无工序</span>
              </div>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="110" fixed="right" align="center">
            <template #default="{ row }">
              <!-- 10 录入 -->
              <template v-if="row.status === '10'">
                <el-button type="primary" link size="small" @click="handleStatusUpdate(row.id, '20')">
                  确认生产
                </el-button>
                <el-button link size="small" @click="openEditDialog(row.id)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteOrder(row)">删除</el-button>
              </template>

              <!-- 20 已确认（生产中） -->
              <template v-if="row.status === '20'">
                <el-button type="primary" link size="small" @click="openProcessDialog(row)">
                  查看进度
                </el-button>
              </template>

              <!-- 其他状态根据实际需求保留按钮，此处简化展示逻辑，避免按钮过多挤压 -->
              <template v-if="!['10', '20'].includes(row.status)">
                 <el-button type="primary" link size="small" @click="openProcessDialog(row)">
                  查看进度
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
     <!-- 修改工单弹窗 -->
    <editOrder
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleEditSuccess"
    />
    <!-- 制定工单选择弹窗 -->
    <productionOrderSelector v-model:visible="showSelector" @close="loadData" />
    <!-- 生产进度弹窗 -->
    <WorkOrderProcessDialog
      v-model:visible="processDialogVisible"
      :form-data="selectRow"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Edit, Delete, Document, Right } from '@element-plus/icons-vue' // 引入 Right 图标
import { getPlWorkOrderList, deletePlWorkOrder, getPlWorkOrderById, updateOrderStatus } from '@/api/plmanage/plworkorder'
import WorkOrderProcessDialog from './components/WorkOrderProcessDialog.vue'; 

import editOrder from './components/editOrder.vue'
import productionOrderSelector from './components/productionOrderSelector.vue'

const loading = ref(false)
const editDialogVisible = ref(false)
const formData = ref({})
const showSelector = ref(false)
const selectRow = ref('')
const processDialogVisible = ref(false)



const openProcessDialog = (row) => {
  selectRow.value = row;
  processDialogVisible.value = true;
}

const filters = reactive({ contractNo: '', contractName: '', woNo: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })
const tableData = ref([])

// 加载数据
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
      // 数据映射
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
        itemId: item.itemId,
        // 【修改】直接获取后端传回来的 processRoutes 列表
        processRoutes: item.processRoutes || [] 
      }))
      pagination.total = res.data.page.totalRow
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 状态映射
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

// 查询与操作
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

/* 工序容器：允许换行，垂直居中 */
.process-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px; /* 行间距 */
  padding: 4px 0;
}

/* 单个节点：包含胶囊和箭头 */
.process-node {
  display: flex;
  align-items: center;
}

/* 胶囊样式主体 */
.process-capsule {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  height: 24px;
  line-height: 22px; /* 减去边框高度 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* 左侧编号：绿色背景 */
.proc-code {
  background-color: #00d31c; 
  color: #fff;
  padding: 0 6px;
  font-family: monospace;
  font-weight: bold;
}

/* 右侧名称：浅灰背景 */
.proc-name {
  background-color: #f4f5f5;
  color: #606665;
  padding: 0 8px;
  font-weight: 500;
}

/* 箭头样式 */
.proc-arrow {
  margin-left: 6px;
  color: #c0c4cc;
  font-size: 14px;
}

/* 空状态文字 */
.no-process-text {
  color: #909399;
  font-size: 12px;
  font-style: italic;
}
</style>