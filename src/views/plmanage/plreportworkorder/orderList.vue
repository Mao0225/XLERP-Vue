<template>
  <div class="work-orders">
    <!-- 顶部筛选区（参考模板样式） -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">合同编号：</span>
          <el-input v-model="filters.contractNo" placeholder="请输入合同编号" clearable style="width: 200px;" />
        </div>
        <div class="filter-item">
          <span class="filter-label">合同名称：</span>
          <el-input v-model="filters.contractName" placeholder="请输入合同名称" clearable style="width: 200px;" />
        </div>
        <div class="filter-item">
          <span class="filter-label">报工单编号：</span>
          <el-input v-model="filters.reportNo" placeholder="请输入报工单编号" clearable style="width: 200px;" />
        </div>
      </div>

      <!-- 状态筛选（改为RadioGroup，参考模板） -->
      <!-- <div class="filter-row">
        <div class="status-filter">
          <span class="filter-label">订单状态：</span>
          <el-radio-group v-model="filters.status">
            <el-radio-button
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.value"
              :class="getStatusClass(status.value)"
            >
              <el-icon><component :is="status.icon" /></el-icon>
              {{ status.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div> -->

      <!-- 筛选操作 -->
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

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧报工单列表 -->
      <div class="order-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>报工单列表</span>
              <el-button type="primary" @click="showSelector = true">创建报工单</el-button>
            </div>
          </template>

          <el-table
            :data="tableData"
            :highlight-current-row="true"
            @current-change="selectOrder"
            v-loading="loading"
            height="600"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="woNo" label="报工单编号" width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectOrder(row)">{{ row.reportNo }}</el-link>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="woNo" label="生产工单号" width="180" show-overflow-tooltip />
            <el-table-column prop="ipoNo" label="生产订单号" width="180" show-overflow-tooltip /> -->
            <el-table-column prop="itemName" label="产品名称" width="100" show-overflow-tooltip />
            <el-table-column prop="itemSpec" label="规格型号" width="100" show-overflow-tooltip />
            <el-table-column prop="processName" label="工序名称" width="100" show-overflow-tooltip />
            <el-table-column prop="processCode" label="工序编码" width="100" show-overflow-tooltip />
            <!-- <el-table-column label="计划时间" width="200">
              <template #default="{ row }">
                <div class="date-range">
                  <div>{{ row.planStartTime }}</div>
                  <div class="date-end">~ {{ row.planEndTime }}</div>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="auto" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === '10'" size="small" @click="openEditDialog(row.id)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button v-if="row.status === '10'" size="small" type="danger" @click="deleteOrder(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
                <el-button v-if="row.status === '10'" size="small" type="primary" @click="handleStatusUpdate(row.id, '20')">
                  <el-icon><CircleCheck /></el-icon>
                  确认
                </el-button>
                <el-button v-if="row.status === '20'" size="small" type="primary" @click="handleStatusUpdate(row.id, '30')">
                  <el-icon><VideoPlay /></el-icon>
                  开始计划
                </el-button>
                <el-button v-if="row.status === '20'" size="small" type="warning" @click="handleStatusUpdate(row.id, '10')">
                  <el-icon><CircleCloseFilled /></el-icon>
                  反确认
                </el-button>
                <el-button v-if="row.status === '30'" size="small" type="success" @click="handleStatusUpdate(row.id, '40')">
                  <el-icon><Check /></el-icon>
                  完成计划
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
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

      <!-- 右侧报工单详情 -->
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
            <!-- 基础信息 -->
            <div class="detail-section">
              <h4>基础信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产工单号：</span>
                  <span class="value">{{ selectedOrder.woNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产订单号：</span>
                  <span class="value">{{ selectedOrder.ipoNo }}</span>
                </div>
                <!-- <div class="info-item">
                  <span class="label">供应商编码：</span>
                  <span class="value">{{ selectedOrder.supplierCode }}</span>
                </div> -->
             
                <div class="info-item">
                  <span class="label">生产批次号：</span>
                  <span class="value">{{ selectedOrder.productBatchNo }}</span>
                </div>
                <!-- <div class="info-item">
                  <span class="label">客户省份：</span>
                  <span class="value">{{ selectedOrder.buyerProvince }}</span>
                </div> -->
                <div class="info-item">
                  <span class="label">报工单编号：</span>
                  <span class="value">{{ selectedOrder.reportNo }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>产品信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">物料编码：</span>
                  <span class="value">{{ selectedOrder.itemCode }}</span>
                </div>
                   <div class="info-item">
                  <span class="label">物料名称：</span>
                  <span class="value">{{ selectedOrder.itemName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">规格型号：</span>
                  <span class="value">{{ selectedOrder.itemSpec || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联工单数量：</span>
                  <span class="value">{{ selectedOrder.amount }}</span>
                </div>
              </div>
            </div>
            <!-- 工序信息 -->
            <div class="detail-section">
              <h4>工序信息</h4>
              <div class="info-grid">
                <!-- <div class="info-item">
                  <span class="label">品类编码：</span>
                  <span class="value">{{ selectedOrder.categoryCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">种类编码：</span>
                  <span class="value">{{ selectedOrder.subclassCode }}</span>
                </div> -->
                <div class="info-item">
                  <span class="label">工序编码：</span>
                  <span class="value">{{ selectedOrder.processCode }}</span>
                </div>
                   <div class="info-item">
                  <span class="label">工序名称：</span>
                  <span class="value">{{ selectedOrder.processName }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">生产工艺路线：</span>
                  <span class="value">{{ selectedOrder.processNo || '无' }}</span>
                </div>
              </div>
            </div>

            <!-- 时间信息 -->
            <div class="detail-section">
              <h4>时间信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">计划时间：</span>
                  <span class="value">{{ selectedOrder.planStartTime || '未设定' }} ~ {{ selectedOrder.planEndTime || '未设定' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">实际时间：</span>
                  <span class="value">{{ selectedOrder.actualStartDate || '未开始' }} ~ {{ selectedOrder.actualFinishDate || '未完成' }}</span>
                </div>
                <!-- <div class="info-item">
                  <span class="label">数据来源创建时间：</span>
                  <span class="value">{{ selectedOrder.dataSourceCreateTime }}</span>
                </div> -->
              </div>
            </div>

            <!-- 生产信息 -->
            <div class="detail-section">
              <h4>生产信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产车间：</span>
                  <span class="value">{{ selectedOrder.workshopName || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">设备编号：</span>
                  <span class="value">{{ selectedOrder.deviceNo || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">产品内部ID：</span>
                  <span class="value">{{ selectedOrder.insideNo || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">实物ID：</span>
                  <span class="value">{{ selectedOrder.entityId || '无' }}</span>
                </div>
              </div>
            </div>
          </div>

          <el-empty v-else description="请选择一个报工单查看详情" />
        </el-card>
      </div>
    </div>

    <editOrder
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleEditSuccess"
    />
        <work-order-selector v-model:visible="showSelector" @close="loadData" />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Search, Refresh, Clock, CircleCheck, VideoPlay, Check, Edit, Delete, Close, CircleCloseFilled
} from '@element-plus/icons-vue';
import {
  getPlReportWorkOrderList,
  getPlReportWorkOrderById,
  deletePlReportWorkOrder,
  updateStatus
} from '@/api/plmanage/plreportworkorder';
import addOrder from './components/addOrder.vue';
import editOrder from './components/editOrder.vue';
import workOrderSelector from './components/workOrderSelector.vue';

// 状态变量
const tableData = ref([]);
const formData = ref({});
const editDialogVisible = ref(false);
const loading = ref(false);
const selectedOrder = ref(null);
const showSelector = ref(false);
// 筛选条件（改为单选状态）
const filters = reactive({
  contractNo: '',
  contractName: '',
  reportNo: '',
  status: '' // 单选状态
});

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// 状态选项
const statusOptions = ref([
  { value: '', label: '全部', icon: 'Refresh' },
  { value: '10', label: '录入', icon: 'Clock' },
  { value: '20', label: '确认', icon: 'CircleCheck' },
  { value: '30', label: '进行中', icon: 'VideoPlay' },
  { value: '40', label: '已完成', icon: 'Check' }
]);

// 加载数据（后端查询）
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.contractNo || undefined,
      contractName: filters.contractName || undefined,
      reportNo: filters.reportNo || undefined,
      status: filters.status || undefined
    };

    const res = await getPlReportWorkOrderList(params);

    if (res.code === 200 && res.success) {
      const data = res.data.page.list.map(item => ({
        id: item.id,
        purchaserHqCode: item.purchaserHqCode,
        supplierCode: item.supplierCode,
        ipoNo: item.ipoNo,
        woNo: item.woNo,
        productBatchNo: item.productBatchNo,
        processName: item.processName,
        categoryCode: item.categoryCode,
        subclassCode: item.subclassCode,
        processCode: item.processCode,
        dataSource: item.dataSource,
        dataSourceCreateTime: item.dataSourceCreateTime ? item.dataSourceCreateTime.split(' ')[0] : '',
        buyerProvince: item.buyerProvince,
        insideNo: item.insideNo || '无',
        deviceNo: item.deviceNo || '无',
        processNo: item.processNo || '无',
        workshopId: item.workshopId || '无',
        workshopCode: item.workshopCode || '无',
        workshopName: item.workshopName || '无',
        entityId: item.entityId || '无',
        planStartTime: item.planStartTime ? item.planStartTime.split(' ')[0] : '',
        planEndTime: item.planEndTime ? item.planEndTime.split(' ')[0] : '',
        actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
        actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
        orderStatus: item.orderStatus || '未开始',
        status: item.status || '10',
        writer: item.writer || '未知',
        itemCode:item.itemCode,
        itemName:item.itemName,
        itemSpec:item.itemSpec,
        amount: item.woAmount,
        createdTime: item.createdTime ? item.createdTime.split(' ')[0] : '',
        updatedTime: item.updatedTime ? item.updatedTime.split(' ')[0] : '',
        reportNo: item.reportNo
      }));
      tableData.value = data;
      pagination.total = res.data.page.totalRow;
    } else {
      throw new Error(res.msg || '获取数据失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败');
    tableData.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};



const openEditDialog = async (id) => {
  const res = await getPlReportWorkOrderById({ id });
  formData.value = res.data.order;
  editDialogVisible.value = true;
};

const handleEditSuccess = () => {
  editDialogVisible.value = false;
  ElMessage.success('报工单修改成功');
  loadData();
};

// 状态更新
const handleStatusUpdate = async (id, newStatus) => {
  try {
    const statusMessages = {
      '10': '反确认',
      '20': '确认',
      '30': '开始计划',
      '40': '完成计划'
    };
    const actionMessage = statusMessages[newStatus] || '更新状态';

    await ElMessageBox.confirm(
      `确定要${actionMessage}报工单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const res = await updateStatus({ id, status: newStatus });
    if (res.code === 200) {
      ElMessage.success(`${actionMessage}成功`);
      loadData();
      if (selectedOrder.value?.id === id) {
        selectedOrder.value.status = newStatus;
      }
    } else {
      ElMessage.error(res.msg || '修改失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试');
    }
  }
};

// 分页操作
const handleSizeChange = (size) => {
  pagination.size = size;
  pagination.current = 1;
  loadData();
};

const handleCurrentChange = (page) => {
  pagination.current = page;
  loadData();
};

// 状态样式映射
const getStatusClass = (status) => {
  const classes = {
    '10': 'status-entered',
    '20': 'status-confirmed',
    '30': 'status-in-progress',
    '40': 'status-completed'
  };
  return classes[status] || '';
};

const getStatusTagType = (status) => {
  const types = {
    '10': 'info',
    '20': 'primary',
    '30': 'warning',
    '40': 'success'
  };
  return types[status] || 'info';
};

const getStatusIcon = (status) => {
  const icons = {
    '10': 'Clock',
    '20': 'CircleCheck',
    '30': 'VideoPlay',
    '40': 'Check'
  };
  return icons[status] || 'Clock';
};

const getStatusLabel = (status) => {
  const labels = {
    '10': '录入',
    '20': '确认',
    '30': '进行中',
    '40': '已完成'
  };
  return labels[status] || '未知';
};

// 选中工单
const selectOrder = (order) => {
  selectedOrder.value = order;
};

// 搜索/重置
const handleSearch = () => {
  pagination.current = 1;
  loadData();
  ElMessage.success('查询成功');
};

const handleReset = () => {
  Object.assign(filters, {
    contractNo: '',
    contractName: '',
    reportNo: '',
    status: ''
  });
  pagination.current = 1;
  selectedOrder.value = null;
  loadData();
  ElMessage.success('筛选条件已重置');
};

// 删除操作
const deleteOrder = async (order) => {
  try {
    await ElMessageBox.confirm(`确认删除报工单 ${order.woNo}？`, '提示', {
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

// 初始化加载
onMounted(() => {
  loadData();
});
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

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
  text-align: left;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.status-filter {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-filter .filter-label {
  min-width: auto;
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

.order-list,
.order-detail {
  min-height: 600px;
  overflow: auto;
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

:deep(.el-radio-button__inner) {
  border-radius: 4px;
  padding: 6px 16px;
}

:deep(.el-radio-button.is-checked .el-radio-button__inner) {
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
    grid-template-columns: 1fr;
  }

  .filter-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .filter-label {
    text-align: left;
    min-width: auto;
  }

  .filter-item .el-input {
    width: 100% !important;
  }

  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>