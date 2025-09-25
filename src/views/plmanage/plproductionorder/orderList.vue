<template>
  <div class="production-orders">
    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">合同号：</span>
          <el-input
            v-model="filters.contractNo"
            placeholder="请输入合同号"
            clearable
            style="width: 200px;"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">合同名称：</span>
          <el-input
            v-model="filters.contractName"
            placeholder="请输入合同名称"
            clearable
            style="width: 200px;"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">排产计划号：</span>
          <el-input
            v-model="filters.scheduleCode"
            placeholder="请输入排产计划号"
            clearable
            style="width: 200px;"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">生产订单号：</span>
          <el-input
            v-model="filters.ipoNo"
            placeholder="请输入生产订单号"
            clearable
            style="width: 200px;"
          />
        </div>
      </div>

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

      <div class="filter-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </el-card>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧订单列表 -->
      <div class="order-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>生产订单列表</span>
              <el-button type="primary" @click="showSelector = true">创建订单</el-button>
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
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ipoNo" label="生产订单号" width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectOrder(row)">{{ row.ipoNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="itemName" label="产品名称" width="100" show-overflow-tooltip />
            <el-table-column prop="itemSpec" label="产品型号" width="100" show-overflow-tooltip />
            <el-table-column label="生产数量" width="120">
              <template #default="{ row }">
                {{ row.amount }} {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column label="计划日期" width="200">
              <template #default="{ row }">
                <div class="date-range">
                  <div>{{ row.planStartDate }}</div>
                  <div class="date-end">~ {{ row.planFinishDate }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240" fixed="right">

              <template #default="{ row }">
                <template v-if="row.status == 20">
                  <el-button type="warning" size="small" @click="handleStatusUpdate(row.id, 10)">
                    <el-icon>
                      <CircleCloseFilled />
                    </el-icon>
                    反确认
                  </el-button>
                   <el-button type="success" size="small" @click="handleStatusUpdate(row.id, 30)">
                    <el-icon>
                      <Select />
                    </el-icon>
                    审核通过
                  </el-button>
                </template>

                <!-- 如果状态是10，显示确认、编辑和删除按钮 -->
                <template v-if="row.status == 10">
                  <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, 20)">
                    <el-icon>
                      <CircleCheckFilled />
                    </el-icon>
                    确认
                  </el-button>
                  <el-button size="small" @click="openEditDialog(row.id)">
                    <el-icon>
                      <Edit />
                    </el-icon>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteOrder(row)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
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

      <!-- 右侧订单详情 -->
      <div class="order-detail">
        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>订单详情</span>
              <el-button v-if="selectedOrder" size="small" @click="selectedOrder = null">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </template>

          <div v-if="selectedOrder" class="detail-content">
            <div class="detail-section">
              <h4>基础信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">合同编号</span>
                  <span class="value">{{ selectedOrder.contractNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">合同名称</span>
                  <span class="value">{{ selectedOrder.contractName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联排产计划号</span>
                  <span class="value">{{ selectedOrder.scheduleCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产订单号：</span>
                  <span class="value">{{ selectedOrder.ipoNo }}</span>
                </div>

                <div class="info-item">
                  <span class="label">供应商：</span>
                  <span class="value">{{ selectedOrder.supplierName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">物料名称：</span>
                  <span class="value">{{ selectedOrder.materialsName }}</span>
                </div>

              </div>
            </div>

                        <div class="detail-section">
              <h4>产品信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">产品名称</span>
                  <span class="value">{{ selectedOrder.itemName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">产品型号</span>
                  <span class="value">{{ selectedOrder.itemSpec }}</span>
                </div>
                <div class="info-item">
                  <span class="label">合同生产数量</span>
                  <span class="value">{{ selectedOrder.contractAmount }} {{ selectedOrder.unit }}</span>
                </div>
                <div class="info-item">
                  <span class="label">本订单生产数量</span>
                  <span class="value">{{ selectedOrder.amount }} {{ selectedOrder.unit }}</span>
                </div>

              </div>
            </div>

            <div class="detail-section">
              <h4>物料信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">厂家物料编码：</span>
                  <span class="value">{{ selectedOrder.materialsCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">厂家物料名称：</span>
                  <span class="value">{{ selectedOrder.materialsName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">厂家物料单位：</span>
                  <span class="value">{{ selectedOrder.materialsUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="label">厂家物料描述：</span>
                  <span class="value">{{ selectedOrder.materialsDesc }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>时间信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">计划时间：</span>
                  <span class="value">{{ selectedOrder.planStartDate }} ~ {{ selectedOrder.planFinishDate }}</span>
                </div>
                <div class="info-item">
                  <span class="label">实际时间：</span>
                  <span class="value">{{ selectedOrder.actualStartDate || '未开始' }} ~ {{ selectedOrder.actualFinishDate || '未完成' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">数据来源创建时间：</span>
                  <span class="value">{{ selectedOrder.dataSourceCreateTime }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>生产信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产工厂：</span>
                  <span class="value">{{ selectedOrder.plantName || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产车间：</span>
                  <span class="value">{{ selectedOrder.workshopName || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产中心：</span>
                  <span class="value">{{ selectedOrder.center || '无' }}</span>
                </div>
              </div>
            </div>

            <!-- <div class="detail-section">
              <h4>状态信息</h4>
              <div class="progress-info">
                <div class="status-info">
                  <el-tag :type="getStatusTagType(selectedOrder.status)">
                    <el-icon><component :is="getStatusIcon(selectedOrder.status)" /></el-icon>
                    {{ getStatusText(selectedOrder.status) }}
                  </el-tag>
                  <span class="schedule-text">{{ selectedOrder.ipoStatus || '无' }}</span>
                </div>
              </div>
            </div> -->
          </div>

          <el-empty v-else description="请选择一个生产订单查看详情" />
        </el-card>
      </div>
    </div>

    <editOrder
      :visible="editDialogVisible"
      :initial-data="formData"
      @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit"
    />

    <schedule-selector v-model:visible="showSelector" @closed="loadData" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Clock, CircleCheck, Edit, Delete, Close,CircleCheckFilled,CircleCloseFilled,Select} from '@element-plus/icons-vue';
import { getPlProductionOrderList, deletePlProductionOrder, getPlProductionOrderById,updateOrderStatus } from '@/api/plmanage/plproductionorder';
import editOrder from './components/editOrder.vue';
import scheduleSelector from './components/scheduleSelector.vue';


// 状态管理
const loading = ref(false); // 表格加载状态
const selectedOrder = ref(null); // 选中的订单
const editDialogVisible = ref(false); // 编辑弹窗显隐
const newCode = ref(''); // 新订单编码
const formData = ref({}); // 编辑表单数据
const tableData = ref([]); // 表格数据
const showSelector = ref(false)

// 筛选条件
const filters = reactive({
  contractNo: '',
  contractName: '',
  scheduleCode: '',
  ipoNo: '',
  status: ''
});

// 状态选项
const statusOptions = ref([
  { value: '10', label: '录入', icon: Clock },
  { value: '20', label: '确认', icon: CircleCheck },
  { value: '30', label: '审核通过', icon: Select },
]);

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  totalPages: 0
});

// 获取订单列表数据
const fetchData = async () => {
  try {
    loading.value = true;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.contractNo,
      contractName: filters.contractName,
      scheduleCode: filters.scheduleCode,
      ipoNo: filters.ipoNo,
      status: filters.status
    };

    const res = await getPlProductionOrderList(params);

    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        id: item.id,
        purchaserHqCode: item.purchaserHqCode,
        ipoType: item.ipoType || '标准订单',
        supplierCode: item.supplierCode,
        supplierName: item.supplierName,
        ipoNo: item.ipoNo,
        categoryCode: item.categoryCode,
        subclassCode: item.subclassCode,
        scheduleCode: item.scheduleCode || '无',
        poItemId: item.poItemId,
        dataType: item.dataType || '无',
        soItemNo: item.soItemNo || '无',
        materialsCode: item.materialsCode,
        materialsName: item.materialsName,
        materialsUnit: item.materialsUnit,
        materialsDesc: item.materialsDesc,

        contractNo: item.contractNo,
        contractName: item.contractName,
        itemName: item.itemName,
        itemSpec: item.itemSpec,
        contractAmount: item.contractAmount,

        amount: item.amount,
        unit: item.unit,
        productIdGrpNo: item.productIdGrpNo || '无',
        productIdType: item.productIdType || '无',
        productModel: item.productModel || '无',
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
        actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
        plantName: item.plantName || '无',
        workshopName: item.workshopName || '无',
        ipoStatus: item.ipoStatus || '未开始',
        center: item.center || '无',
        dataSource: item.dataSource,
        dataSourceCreateTime: item.dataSourceCreateTime ? item.dataSourceCreateTime.split(' ')[0] : '',
        ownerId: item.ownerId || '无',
        openId: item.openId || '无',
        createdTime: item.createdTime ? item.createdTime.split(' ')[0] : '',
        updatedTime: item.updatedTime ? item.updatedTime.split(' ')[0] : '',
        status: item.status || '10',
        writer: item.writer || '未知'
      }));
      pagination.total = res.data.page.totalRow;
      pagination.totalPages = res.data.page.totalPage;
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

// 加载数据
const loadData = async () => {
  await fetchData();
};


// 打开编辑弹窗
const openEditDialog = async (id) => {
  const res = await getPlProductionOrderById({ id });
  formData.value = res.data.order;
  editDialogVisible.value = true;
};


// 编辑成功回调
const handleSuccessEdit = () => {
  editDialogVisible.value = false;
  ElMessage.success('生产订单修改成功');
  loadData();
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  loadData();
  ElMessage.success('查询成功');
};

// 重置筛选条件
const handleReset = () => {
  Object.assign(filters, {
    contractNo: '',
    contractName: '',
    scheduleCode: '',
    ipoNo: '',
    status: ''
  });
  pagination.current = 1;
  selectedOrder.value = null;
  loadData();
  ElMessage.success('筛选条件已重置');
};

// 状态变更

// 处理弹窗确认逻辑
const handleStatusUpdate = async (id, newStatus) => {
  try {
    const statusText = {
      10: '反确认',
      20: '确认', 
      30: '审核通过'
    };
    
    // 弹窗确认
    await ElMessageBox.confirm(
      `确定要${statusText[newStatus] || '修改'}生产订单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户确认后发送请求
    await sendStatusUpdateRequest(id, newStatus);
  } catch (error) {
    // 如果用户取消或发生错误，不做处理
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试');
    }
  }
};

// 发送状态更新请求
const sendStatusUpdateRequest = async (id, newStatus) => {
  try {
    const res = await updateOrderStatus({
      id: id,
      status: newStatus
    });

    if (res.code === 200) {
      ElMessage.success(`${newStatus === 20 ? '确认' : '反确认'}成功`);
      loadData(); // 重新加载数据
    } else {
      ElMessage.error(res.msg || '修改失败');
    }
  } catch (error) {
    ElMessage.error('网络错误，更新失败');
    console.error(error);
  }
};

// 删除订单
const deleteOrder = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除生产订单 ${row.ipoNo}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const res = await deletePlProductionOrder({ id: row.id });
    if (res.code === 200 && res.success) {
      ElMessage.success('删除成功');
      loadData();
      if (selectedOrder.value?.id === row.id) {
        selectedOrder.value = null;
      }
    } else {
      throw new Error(res.msg || '删除失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '删除失败');
  }
};

// 选择订单
const selectOrder = (order) => {
  selectedOrder.value = order;
};

// 分页大小变更
const handleSizeChange = (size) => {
  pagination.size = size;
  pagination.current = 1;
  loadData();
};

// 分页页码变更
const handleCurrentChange = (page) => {
  pagination.current = page;
  loadData();
};

// 状态样式

// 方法
const getStatusClass = (status) => {
  const classes = {
    '10': 'status-entered',
    '20': 'status-confirmed',
    '30': 'status-approved'  // 新增这一行
  };
  return classes[status] || '';
};

const getStatusTagType = (status) => {
  const types = {
    '10': 'info',
    '20': 'primary',
    '30': 'success'  // 新增这一行
  };
  return types[status] || '';
};

const getStatusIcon = (status) => {
  const icons = {
    '10': 'Clock',
    '20': 'CircleCheck',
    '30': 'Select'  // 新增这一行，或者用其他合适的图标
  };
  return icons[status] || 'Clock';
};

const getStatusText = (status) =>{
  const texts = {
    '10': '录入',
    '20': '确认',
    '30': '审核通过'  // 新增这一行
  };
  return texts[status] || '';
}

// 初始化加载
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.production-orders {
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

.order-list {
  min-height: 600px;
  overflow: auto;
}

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
  min-width: 80px;
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

/* 审核通过状态样式 */
.status-approved {
  background-color: #f0f9ff;
  color: #067f46;
}
.schedule-text {
  color: #606266;
  font-size: 12px;
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
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
  .production-orders {
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
