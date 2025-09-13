<template>
  <div class="work-orders">
    <!-- Filter Section -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <el-select v-model="filters.purchaserHqCode" placeholder="采购方总部" clearable style="width: 200px;">
          <el-option
            v-for="item in purchaserOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-select v-model="filters.supplierCode" placeholder="供应商" filterable clearable style="width: 200px;">
          <el-option
            v-for="item in supplierOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-input
          v-model="filters.productionOrderNo"
          placeholder="生产订单号"
          clearable
          style="width: 200px;"
        />

        <el-input
          v-model="filters.workOrderNo"
          placeholder="生产工单号"
          clearable
          style="width: 200px;"
        />
      </div>

      <div class="filter-row">
        <div class="status-filter">
          <span class="filter-label">订单状态：</span>
          <el-checkbox-group v-model="filters.statuses">
            <el-checkbox-button
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.value"
              :class="getStatusClass(status.value)"
            >
              <el-icon><component :is="getStatusIcon(status.value)" /></el-icon>
              {{ status.label }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </el-card>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left: Work Orders List -->
      <div class="order-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>报工单列表</span>
              <el-button type="primary" @click="openAddDialog">创建报工单</el-button>
            </div>
          </template>

          <el-table
            :data="displayOrders"
            :highlight-current-row="true"
            @current-change="selectOrder"
            v-loading="loading"
            height="600"
          >
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
                  {{ row.status === '10' ? '录入' : '确认' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="workOrderNo" label="生产工单号" width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectOrder(row)">{{ row.workOrderNo }}</el-link>
              </template>
            </el-table-column>

            <el-table-column prop="productionOrderNo" label="生产订单号" width="180" show-overflow-tooltip />
            <el-table-column prop="supplierCode" label="供应商编码" width="150" show-overflow-tooltip />
            <el-table-column prop="processName" label="工序名称" width="150" show-overflow-tooltip />

            <el-table-column label="计划时间" width="200">
              <template #default="{ row }">
                <div class="date-range">
                  <div>{{ row.planStartTime }}</div>
                  <div class="date-end">~ {{ row.planEndTime }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button @click="openEditDialog(row.id)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="danger" @click="deleteOrder(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- Pagination -->
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

      <!-- Right: Work Order Details Panel -->
      <div class="order-detail">
        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>报工单详情</span>
              <el-button v-if="selectedOrder" size="small" @click="selectedOrder = null">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </template>

          <div v-if="selectedOrder" class="detail-content">
            <!-- Basic Information -->
            <div class="detail-section">
              <h4>基础信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产工单号:</span>
                  <span class="value">{{ selectedOrder.workOrderNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产订单号:</span>
                  <span class="value">{{ selectedOrder.productionOrderNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">供应商编码:</span>
                  <span class="value">{{ selectedOrder.supplierCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工序名称:</span>
                  <span class="value">{{ selectedOrder.processName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产批次号:</span>
                  <span class="value">{{ selectedOrder.productionBatchNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">客户省份:</span>
                  <span class="value">{{ selectedOrder.customerProvince }}</span>
                </div>
              </div>
            </div>

            <!-- Process Information -->
            <div class="detail-section">
              <h4>工序信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">品类编码:</span>
                  <span class="value">{{ selectedOrder.categoryCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">种类编码:</span>
                  <span class="value">{{ selectedOrder.subclassCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工序编码:</span>
                  <span class="value">{{ selectedOrder.processCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产工艺路线:</span>
                  <span class="value">{{ selectedOrder.productionRouteCode || '无' }}</span>
                </div>
              </div>
            </div>

            <!-- Time Information -->
            <div class="detail-section">
              <h4>时间信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">计划时间:</span>
                  <span class="value">{{ selectedOrder.planStartTime || '未设定' }} ~ {{ selectedOrder.planEndTime || '未设定' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">实际时间:</span>
                  <span class="value">{{ selectedOrder.actualStartTime || '未开始' }} ~ {{ selectedOrder.actualEndTime || '未完成' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">数据来源创建时间:</span>
                  <span class="value">{{ selectedOrder.sourceCreateTime }}</span>
                </div>
              </div>
            </div>

            <!-- Production Information -->
            <div class="detail-section">
              <h4>生产信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产车间:</span>
                  <span class="value">{{ selectedOrder.workshopName || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">设备编号:</span>
                  <span class="value">{{ selectedOrder.equipmentNo || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">产品内部ID:</span>
                  <span class="value">{{ selectedOrder.productInternalId || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">实物ID:</span>
                  <span class="value">{{ selectedOrder.entityId || '无' }}</span>
                </div>
              </div>
            </div>

            <!-- Status Information -->
            <div class="detail-section">
              <h4>状态信息</h4>
              <div class="progress-info">
                <div class="status-info">
                  <el-tag :type="getStatusTagType(selectedOrder.status)">
                    <el-icon><component :is="getStatusIcon(selectedOrder.status)" /></el-icon>
                    {{ selectedOrder.status === '10' ? '录入' : '确认' }}
                  </el-tag>
                  <span class="schedule-text">{{ selectedOrder.orderStatus || '无' }}</span>
                </div>
              </div>
            </div>
          </div>

          <el-empty v-else description="请选择一个报工单查看详情" />
        </el-card>
      </div>
    </div>

    <!-- Dialog Components -->
    <addOrder
      :visible="addDialogVisible"
      :new-code="newCode"
      @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd"
    />

    <editOrder
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Search, Refresh, Calendar, VideoPlay, CircleCheck,
  Plus, Edit, Delete, Close
} from '@element-plus/icons-vue';
import {
  getPlReportWorkOrderList,
  getPlReportWorkOrderById,
  deletePlReportWorkOrder
} from '@/api/plmanage/plreportworkorder';
import addOrder from './components/addOrder.vue';
import editOrder from './components/editOrder.vue';


import { getNewNoNyName } from '@/api/system/basno'

const newCode = ref('');
// 生成新的编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('bgd');//报工单
    
    if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName);
      return res.data.fullNoNyName;
    }
    
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
    
  } catch (error) {
    console.error('生成编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};


const tableData = ref([]);
const formData = ref({});

// Dialog visibility
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);

// Open dialogs
const openAddDialog = async () => {
    newCode.value = await generateNewCode();
  addDialogVisible.value = true;
};

const openEditDialog = async (id) => {
  const res = await getPlReportWorkOrderById({ id });
  formData.value = res.data.order;
  editDialogVisible.value = true;
};

// Success callbacks
const handleSuccessAdd = () => {
  ElMessage.success('报工单添加成功');
  loadData();
};

const handleSuccessEdit = () => {
  ElMessage.success('报工单修改成功');
  loadData();
};

// Fetch data
const fetchData = async (queryParams = {}) => {
  try {
    loading.value = true;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      purchaserHqCode: filters.purchaserHqCode,
      supplierCode: filters.supplierCode,
      productionOrderNo: filters.productionOrderNo,
      workOrderNo: filters.workOrderNo,
      statuses: filters.statuses.join(',')
    };

    const res = await getPlReportWorkOrderList(params);

    if (res.code === 200 && res.success) {
      const data = res.data.page.list.map(item => ({
        id: item.id,
        purchaserHqCode: item.purchaserHqCode,
        supplierCode: item.supplierCode,
        productionOrderNo: item.productionOrderNo,
        workOrderNo: item.workOrderNo,
        productionBatchNo: item.productionBatchNo,
        processName: item.processName,
        categoryCode: item.categoryCode,
        subclassCode: item.subclassCode,
        processCode: item.processCode,
        dataSource: item.dataSource,
        sourceCreateTime: item.sourceCreateTime ? item.sourceCreateTime.split(' ')[0] : '',
        customerProvince: item.customerProvince,
        productInternalId: item.productInternalId || '无',
        equipmentNo: item.equipmentNo || '无',
        productionRouteCode: item.productionRouteCode || '无',
        workshopId: item.workshopId || '无',
        workshopCode: item.workshopCode || '无',
        workshopName: item.workshopName || '无',
        entityId: item.entityId || '无',
        planStartTime: item.planStartTime ? item.planStartTime.split(' ')[0] : '',
        planEndTime: item.planEndTime ? item.planEndTime.split(' ')[0] : '',
        actualStartTime: item.actualStartTime ? item.actualStartTime.split(' ')[0] : '',
        actualEndTime: item.actualEndTime ? item.actualEndTime.split(' ')[0] : '',
        orderStatus: item.orderStatus || '未开始',
        status: item.status || '10',
        writer: item.writer || '未知',
        createdTime: item.createdTime ? item.createdTime.split(' ')[0] : '',
        updatedTime: item.updatedTime ? item.updatedTime.split(' ')[0] : ''
      }));

      return {
        data,
        pagination: {
          current: res.data.page.pageNumber,
          pageSize: res.data.page.pageSize,
          total: res.data.page.totalRow,
          totalPages: res.data.page.totalPage
        }
      };
    } else {
      throw new Error(res.msg || '获取数据失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败');
    return { data: [], pagination: { total: 0, totalPages: 0 } };
  } finally {
    loading.value = false;
  }
};

// Load data
const loadData = async () => {
  const result = await fetchData();
  tableData.value = result.data;
  pagination.total = result.pagination.total;
  pagination.totalPages = result.pagination.totalPages;
};

// Data states
const loading = ref(false);
const selectedOrder = ref(null);

// Filters
const filters = reactive({
  purchaserHqCode: '',
  supplierCode: '',
  productionOrderNo: '',
  workOrderNo: '',
  statuses: []
});

// Pagination
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  totalPages: 0
});

// Options
const purchaserOptions = ref([
  { code: 'HQ001', name: '华东总部' },
  { code: 'HQ002', name: '华南总部' },
  { code: 'HQ003', name: '华北总部' }
]);

const supplierOptions = ref([
  { code: 'SUP001', name: '深圳制造有限公司' },
  { code: 'SUP002', name: '上海精密工业' },
  { code: 'SUP003', name: '广州电子科技' },
  { code: 'SUP004', name: '北京自动化设备' }
]);

const statusOptions = [
  { value: '10', label: '录入' },
  { value: '20', label: '确认' }
];

// Computed
const displayOrders = computed(() => {
  let filtered = [...tableData.value];

  if (filters.purchaserHqCode) {
    filtered = filtered.filter(item => item.purchaserHqCode === filters.purchaserHqCode);
  }

  if (filters.supplierCode) {
    filtered = filtered.filter(item => item.supplierCode === filters.supplierCode);
  }

  if (filters.productionOrderNo) {
    filtered = filtered.filter(item =>
      item.productionOrderNo.toLowerCase().includes(filters.productionOrderNo.toLowerCase())
    );
  }

  if (filters.workOrderNo) {
    filtered = filtered.filter(item =>
      item.workOrderNo.toLowerCase().includes(filters.workOrderNo.toLowerCase())
    );
  }

  if (filters.statuses.length > 0) {
    filtered = filtered.filter(item => filters.statuses.includes(item.status));
  }

  return filtered;
});

// Pagination handlers
const handleSizeChange = (val) => {
  pagination.size = val;
  pagination.current = 1;
  loadData();
};

const handleCurrentChange = (val) => {
  pagination.current = val;
  loadData();
};

// Methods
const getStatusClass = (status) => {
  const classes = {
    '10': 'status-entered',
    '20': 'status-confirmed'
  };
  return classes[status] || '';
};

const getStatusTagType = (status) => {
  const types = {
    '10': 'info',
    '20': 'primary'
  };
  return types[status] || 'info';
};

const getStatusIcon = (status) => {
  const icons = {
    '10': 'Clock',
    '20': 'CircleCheck'
  };
  return icons[status] || 'Clock';
};

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const handleSearch = () => {
  pagination.current = 1;
  loadData();
  ElMessage.success('查询成功');
};

const handleReset = () => {
  Object.assign(filters, {
    purchaserHqCode: '',
    supplierCode: '',
    productionOrderNo: '',
    workOrderNo: '',
    statuses: []
  });
  pagination.current = 1;
  selectedOrder.value = null;
  loadData();
  ElMessage.success('筛选条件已重置');
};

const deleteOrder = async (order) => {
  try {
    await ElMessageBox.confirm(`确认删除报工单 ${order.workOrderNo}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const res = await deletePlReportWorkOrder({ id: order.id });
    if (res.code === 200 && res.success) {
      ElMessage.success('删除成功');
      await loadData();
      if (selectedOrder.value?.id === order.id) {
        selectedOrder.value = null;
      }
    } else {
      throw new Error(res.msg || '删除失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '删除失败');
  }
};

// Lifecycle
onMounted(() => {
  loadData();
});

// Watch filters and pagination
watch(() => [filters, pagination.current, pagination.size], () => {
  loadData();
  if (selectedOrder.value && !tableData.value.find(item => item.id === selectedOrder.value.id)) {
    selectedOrder.value = null;
  }
}, { deep: true });
</script>

<style scoped>
.work-orders {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  min-height: 600px;
}

.order-list {
  min-height: 600px;
  max-width: 1200px;
}

.order-detail {
  min-height: 600px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.date-range .date-end {
  color: #909399;
  font-size: 12px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.detail-card {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-section h4 {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.info-grid {
  display: grid;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 0;
}

.info-item .label {
  color: #909399;
  font-size: 13px;
  min-width: 100px;
  flex-shrink: 0;
}

.info-item .value {
  color: #303133;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}

.progress-info {
  space-y: 12px;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.schedule-text {
  color: #606266;
  font-size: 12px;
}

:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .detail-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .work-orders {
    padding: 12px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-row > * {
    width: 100% !important;
  }
  
  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>