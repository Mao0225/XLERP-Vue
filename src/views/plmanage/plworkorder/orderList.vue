<template>
  <div class="production-work-orders">
    <!-- 顶部筛选区（按模板样式统一） -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 筛选项：统一标签+输入框布局 -->
        <div class="filter-item">
          <span class="filter-label">合同号：</span>
          <el-input v-model="filters.contractNo" placeholder="请输入合同号" clearable style="width: 200px;" />
        </div>

        <div class="filter-item">
          <span class="filter-label">合同名称号：</span>
          <el-input v-model="filters.contractName" placeholder="请输入合同名称" clearable style="width: 200px;" />
        </div>

        <div class="filter-item">
          <span class="filter-label">生产工单号：</span>
          <el-input v-model="filters.woNo" placeholder="请输入生产工单号" clearable style="width: 200px;" />
        </div>
      </div>

      <!-- 状态筛选（改为RadioGroup，与模板一致） -->
      <!-- <div class="filter-row">
        <div class="status-filter">
          <span class="filter-label">工单状态：</span>
          <el-radio-group v-model="filters.status">
            <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value"
              :class="getStatusClass(item.value)">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div> -->

      <!-- 筛选操作（保持模板样式） -->
      <div class="filter-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon>
            <Refresh />
          </el-icon> 重置
        </el-button>
      </div>
    </el-card>

    <!-- 主要内容区：左侧列表 + 右侧详情（与模板结构一致） -->
    <div class="main-content">
      <!-- 左侧生产工单列表 -->
      <div class="order-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>生产工单列表</span>
              <el-button type="primary" @click="showSelector = true">制定生产工单</el-button>
            </div>
          </template>

          <!-- 列表表格（增加确认/反确认按钮，移除前端筛选） -->
          <el-table :data="tableData" :highlight-current-row="true" @current-change="selectOrder" v-loading="loading"
            height="600">
            <el-table-column type="index" label="序号" width="60" />
            <!-- 状态列（与模板样式统一） -->
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon>
                    <component :is="getStatusIcon(row.status)" />
                  </el-icon>
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 核心业务列 -->
            <el-table-column prop="woNo" label="生产工单号" width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectOrder(row)">{{ row.woNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="materialsCode" label="物料编码" width="100" show-overflow-tooltip />
            <el-table-column prop="materialsName" label="物料名称" width="100" show-overflow-tooltip />
            <el-table-column prop="modelSpec" label="规格型号" width="100" show-overflow-tooltip />

            <el-table-column label="生产数量" width="100">
              <template #default="{ row }">
                {{ row.amount }} {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column label="计划日期" width="100">
              <template #default="{ row }">
                <div class="date-range">
                  <div>{{ row.planStartDate }}</div>
                  <div class="date-end">~ {{ row.planFinishDate }}</div>
                </div>
              </template>
            </el-table-column>

            <!-- 操作列（增加确认/反确认功能） -->
            <el-table-column label="操作" width="280" fixed="right">
              <template #default="{ row }">
                <!-- 状态=20（确认）：显示反确认按钮 -->
                <template v-if="row.status === '20'">
                  <el-button type="warning" size="small" @click="handleStatusUpdate(row.id, '10')">
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

                <template v-if="row.status === '30'">
                  <el-button type="warning" size="small" @click="handleStatusUpdate(row.id, 40)">
                    <el-icon>
                      <Select />
                    </el-icon>
                    确认工单完成
                  </el-button>
                    <el-button type="primary" size="small" @click="openReportOrderList(row.woNo)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    查看报工情况
                  </el-button>
                </template>

                <!-- 状态=10（录入）：显示确认、编辑按钮 -->
                <template v-if="row.status === '10'">
                  <el-button type="primary" size="small" @click="handleStatusUpdate(row.id, '20')">
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

          <!-- 分页（保持模板结构） -->
          <div class="pagination-container">
            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
              :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="pagination.total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-card>
      </div>

      <!-- 右侧工单详情（与模板样式统一） -->
      <div class="order-detail">
        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>工单详情</span>
              <el-button v-if="selectedOrder" size="small" @click="selectedOrder = null">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </template>

          <!-- 详情内容（保持原数据，优化样式结构） -->
          <div v-if="selectedOrder" class="detail-content">
            <div class="detail-section">
              <h4>基础信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">生产工单号：</span>
                  <span class="value">{{ selectedOrder.woNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">供应商：</span>
                  <span class="value">{{ selectedOrder.supplierName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">物料名称：</span>
                  <span class="value">{{ selectedOrder.materialsName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生产数量：</span>
                  <span class="value">{{ selectedOrder.amount }} {{ selectedOrder.materialsUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="label">物料批次：</span>
                  <span class="value">{{ selectedOrder.materialsBatch || '无' }}</span>
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
                  <span class="value">{{ selectedOrder.materialsDescription }}</span>
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
                  <span class="value">{{ selectedOrder.actualStartDate || '未开始' }} ~ {{ selectedOrder.actualFinishDate
                    ||
                    '未完成' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">数据来源创建时间：</span>
                  <span class="value">{{ selectedOrder.dataSourceCreateTime }}</span>
                </div>
              </div>
            </div>

            <!-- <div class="detail-section">
              <h4>状态信息</h4>
              <div class="progress-info">
                <div class="status-info">
                  <el-tag :type="getStatusTagType(selectedOrder.status)">
                    <el-icon>
                      <component :is="getStatusIcon(selectedOrder.status)" />
                    </el-icon>
                    {{ getStatusText(selectedOrder.status) }}
                  </el-tag>
                  <span class="schedule-text">{{ selectedOrder.woStatus || '无' }}</span>
                </div>
              </div>
            </div> -->
          </div>

          <el-empty v-else description="请选择列表中的生产工单查看详情" />
        </el-card>
      </div>
    </div>


    <editOrder :visible="editDialogVisible" :initial-data="formData" @update:visible="editDialogVisible = $event"
      @success="handleEditSuccess" />


    <productionOrderSelector v-model:visible="showSelector" @close="loadData" />
    <reportOrderList v-model:visible="showReportSelector" :woNo = "selectWoNo" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 图标按需引入（补充反确认所需图标）
import {
  Search, Refresh, Close, Edit, Delete, CircleCheck,
  CircleCheckFilled, CircleCloseFilled, Clock,Select,
  Document
} from '@element-plus/icons-vue';
// 接口与组件引用（保持原逻辑）
import { getPlWorkOrderList, deletePlWorkOrder, getPlWorkOrderById, updateOrderStatus } from '@/api/plmanage/plworkorder';
import editOrder from './components/editOrder.vue';
import productionOrderSelector from './components/productionOrderSelector.vue';
import reportOrderList from './components/reportOrderList.vue';

// 1. 基础状态（与模板结构对齐）
const loading = ref(false);
const selectedOrder = ref(null); // 选中的工单详情
const editDialogVisible = ref(false); // 编辑弹窗显隐
const formData = ref({}); // 编辑表单数据
const showSelector = ref(false);
const showReportSelector = ref(false);
const selectWoNo = ref('');

const openReportOrderList = (woNo) => {
  selectWoNo.value = woNo;
  showReportSelector.value = true;
};

// 2. 筛选条件（改为单选状态，移除前端筛选字段）
const filters = reactive({
  contractNo: '',
  contractName: '',
  woNo: '',
  status: '' // 改为单选，与模板RadioGroup匹配
});

// 3. 分页（保持模板固定结构）
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// 4. 状态配置（与模板一致，补充图标映射）
const statusOptions = ref([
  { value: '', label: '全部', icon: 'Refresh' },
  { value: '10', label: '录入', icon: Clock },
  { value: '20', label: '确认', icon: CircleCheck }
]);

// 6. 表格数据（纯后端返回，无前端筛选）
const tableData = ref([]);


// 加载列表数据（改为纯后端查询，移除前端筛选）
const loadData = async () => {
  loading.value = true;
  try {
    // 构造后端查询参数（包含状态单选条件）
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.contractNo || undefined,
      contractName: filters.contractName || undefined,
      woNo: filters.woNo || undefined,
      // 状态：空表示查全部，否则查指定状态
      status: filters.status || undefined,
    };

    const res = await getPlWorkOrderList(params);
    if (res.code === 200 && res.success) {
      const data = res.data.page.list.map(item => ({
        id: item.id,
        purchaserHqCode: item.purchaserHqCode,
        supplierCode: item.supplierCode,
        supplierName: item.supplierName,
        woNo: item.woNo,
        categoryCode: item.categoryCode,
        materialsCode: item.materialsCode,
        materialsName: item.materialsName,
        materialsDescription: item.materialsDescription || '无',
        materialsBatch: item.materialsBatch || '无',
        amount: item.amount,
        materialsUnit: item.unit,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
        actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
        woStatus: item.woStatus || '未开始',
        entityCode: item.entityCode || '无',
        processRouteNo: item.processRouteNo || '无',
        voltageLevel: item.voltageLevel || '无',
        dataSource: item.dataSource,
        dataSourceCreateTime: item.dataSourceCreateTime ? item.dataSourceCreateTime.split(' ')[0] : '',
        modelSpec: item.modelSpec || '无',
        status: item.status || '10', // 状态默认设为"录入"
        writer: item.writer || '未知'
      }));
      tableData.value = data;
      pagination.total = res.data.page.totalRow;
    } else {
      throw new Error(res.msg || '获取数据失败');
    }
  } catch (err) {
    ElMessage.error(err.message || '数据加载失败');
  } finally {
    loading.value = false;
  }
};

// 搜索/重置（与模板逻辑一致）
const handleSearch = () => {
  pagination.current = 1;
  loadData();
};
const handleReset = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = '';
  });
  pagination.current = 1;
  selectedOrder.value = null;
  loadData();
  ElMessage.success('筛选条件已重置');
};

// 分页操作（保持模板结构）
const handleSizeChange = (size) => {
  pagination.size = size;
  pagination.current = 1;
  loadData();
};
const handleCurrentChange = (page) => {
  pagination.current = page;
  loadData();
};


const openEditDialog = async (id) => {
  const res = await getPlWorkOrderById({ id });
  formData.value = res.data.order;
  editDialogVisible.value = true;
};

const handleEditSuccess = () => {
  editDialogVisible.value = false;
  ElMessage.success('编辑成功');
  loadData();
};

// 状态变更（确认/反确认功能）
const handleStatusUpdate = async (id, newStatus) => {
  try {

    // 调试：打印 id 和 newStatus
    console.log('id:', id, 'newStatus:', newStatus);

    // 验证 id 和 newStatus 是否有效
    if (!id || !newStatus) {
      ElMessage.error('无效的工单ID或状态');
      return;
    }
    const statusText = {
      10: '反确认',
      20: '确认', 
      30: '审核通过',
      40: '已完成',
    };
    
    // 弹窗确认
    await ElMessageBox.confirm(
      `确定${statusText[newStatus] || '修改'}该生产工单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户确认后发送请求
   const res = await updateOrderStatus({
      id: id,
      status: newStatus
    });;
    if (res.code === 200) {
      ElMessage.success(`状态更新成功`);
      loadData(); // 重新加载数据
    } else {
      ElMessage.error(res.msg || '修改失败');
    }
  } catch (error) {
    // 如果用户取消或发生错误，不做处理
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试');
    }
  }
};


// 删除操作（保持原逻辑）
const deleteOrder = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除生产工单 ${row.woNo}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const res = await deletePlWorkOrder({ id: row.id });
    if (res.code === 200 && res.success) {
      ElMessage.success('删除成功');
      await loadData();
      if (selectedOrder.value?.id === row.id) {
        selectedOrder.value = null;
      }
    } else {
      throw new Error(res.msg || '删除失败');
    }
  } catch (err) {
    if (err !== 'cancel') ElMessage.error(err.message || '删除失败');
  }
};


// 方法
const getStatusClass = (status) => {
  const classes = {
    '10': 'status-entered',
    '20': 'status-confirmed',
    '30': 'status-approved',  // 新增这一行
    '40': 'status-approved'  // 新增这一行
  };
  return classes[status] || '';
};

const getStatusTagType = (status) => {
  const types = {
    '10': 'info',
    '20': 'primary',
    '30': 'success',  // 新增这一行
    '40': 'success',  // 新增这一行

  };
  return types[status] || '';
};

const getStatusIcon = (status) => {
  const icons = {
    '10': 'Clock',
    '20': 'CircleCheck',
    '30': 'Select', // 新增这一行，或者用其他合适的图标
    '40': 'Select'
  };
  return icons[status] || 'Clock';
};

const getStatusText = (status) => {
  const texts = {
    '10': '录入',
    '20': '确认',
    '30': '审核通过',  // 新增这一行
    '40': '已完成'
  };
  return texts[status] || '';
}
// 选中工单
const selectOrder = (order) => {
  selectedOrder.value = order;
};

// 初始化加载
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 统一使用模板样式，优化响应式布局 */
.production-work-orders {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 20px;
}

/* 筛选区域样式（与模板完全一致） */
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

/* 主内容区样式（与模板一致） */
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

/* 详情区域样式（与模板一致） */
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

/* 审核通过状态样式 */
.status-approved {
  background-color: #f0f9ff;
  color: #067f46;
}

/* 状态按钮样式（与模板一致） */
:deep(.el-radio-button__inner) {
  border-radius: 4px;
  padding: 6px 16px;
}

:deep(.el-radio-button.is-checked .el-radio-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* 响应式设计（与模板一致） */
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
  .production-work-orders {
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

  .filter-item .el-select,
  .filter-item .el-cascader,
  .filter-item .el-input {
    width: 100% !important;
  }

  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
