<template>
  <div class="production-overview">

    <!-- 顶部筛选区 -->

    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">合同/项目号：</span>
          <el-input v-model="filters.contractNo" placeholder="请输入合同/项目号" clearable style="width: 200px;" />
        </div>

        <div class="filter-item">
          <span class="filter-label">合同/项目名称：</span>
          <el-input v-model="filters.contractName" placeholder="请输入合同/项目名称" clearable style="width: 200px;" />
        </div>

        <div class="filter-item">
          <span class="filter-label">采购方总部：</span>
          <el-input v-model="filters.purchaserHq" placeholder="请输入采购方总部" clearable style="width: 200px;" />
        </div>

        <div class="filter-item">
          <span class="filter-label">排产计划编码：</span>
          <el-input v-model="filters.scheduleCode" placeholder="请输入排产计划编码" clearable style="width: 200px;" />
        </div>
      </div>



      <div class="filter-row">
        <div class="status-filter">
          <span class="filter-label">计划状态：</span>
          <el-radio-group v-model="filters.status"> <!-- 注意这里v-model绑定改为单个值 -->
            <el-radio-button v-for="status in statusOptions" :key="status.value" :label="status.value"
              :class="getStatusClass(status.value)">
              <el-icon>
                <component :is="getStatusIcon(status.value)" />
              </el-icon>
              {{ status.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon>
          查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon>
            <Refresh />
          </el-icon>
          重置
        </el-button>
      </div>
    </el-card>
    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧：排产计划列表 -->
      <div class="plan-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>排产计划列表</span>
              <!-- <span class="count-badge">共 {{ displayPlans.length }} 条</span> -->
              <el-button type="primary" @click="openAddDialog">创建计划</el-button>
            </div>
          </template>

          <el-table :data="displayPlans" :highlight-current-row="true" @current-change="selectPlan" v-loading="loading"
            height="600">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon>
                    <component :is="getStatusIcon(row.status)" />
                  </el-icon>
                  {{ row.status == 10 ? '录入' : '确认' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="scheduleCode" label="排产计划编码" width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectPlan(row)">{{ row.scheduleCode }}</el-link>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="poItemId" label="采购项ID" width="120" /> -->
             <el-table-column prop="contractNo" label="合同号" width="100" show-overflow-tooltip />
             <el-table-column prop="contractName" label="合同名称" width="100" show-overflow-tooltip />
             <el-table-column prop="itemName" label="产品名称" width="100" show-overflow-tooltip />
             <el-table-column prop="itemSpec" label="产品型号" width="100" show-overflow-tooltip />



            <!-- <el-table-column label="计划数量" width="120">
              <template #default="{ row }">
                {{ row.amount }} {{ row.unit }}
              </template>
            </el-table-column> -->

            <el-table-column label="计划日期" width="200">
              <template #default="{ row }">
                <div class="date-range">
                  <div>{{ row.planStartDate }}</div>
                  <div class="date-end">~ {{ row.planFinishDate }}</div>
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="schedule" label="进度" width="120" /> -->

            <el-table-column label="操作" width="300" fixed="right">
              <template #default="{ row }">
                <!-- 如果状态是20，只显示反确认按钮 -->
                <template v-if="row.status == 20">
                  <el-button type="warning" size="small" @click="handleStatusUpdate(row.id, 10)">
                    <el-icon>
                      <CircleCloseFilled />
                    </el-icon>
                    反确认
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
                  <el-button type="danger" size="small" @click="deletePlan(row)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
              :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="pagination.total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-card>
      </div>

      <!-- 右侧：排产计划详情面板 -->
      <div class="plan-detail">
        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>计划详情</span>
              <el-button v-if="selectedPlan" size="small" @click="selectedPlan = null">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </template>

          <div v-if="selectedPlan" class="detail-content">
            <!-- 基础信息 -->

            <div class="detail-section">
              <h4>合同信息</h4>
              <div class="info-grid">
                
                <div class="info-item">
                  <span class="label">合同编号:</span>
                  <span class="value">{{ selectedPlan.contractNo }}</span>
                </div>
                <div class="info-item">
                  <span class="label">合同名称:</span>
                  <span class="value">{{ selectedPlan.contractName }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>基础信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">排产计划编码:</span>
                  <span class="value">{{ selectedPlan.scheduleCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">采购订单行项目ID:</span>
                  <span class="value">{{ selectedPlan.poItemId }}</span>
                </div>
                <div class="info-item">
                  <span class="label">供应商:</span>
                  <span class="value">{{ selectedPlan.supplierName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">物料名称:</span>
                  <span class="value">{{ selectedPlan.itemName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">产品型号:</span>
                  <span class="value">{{ selectedPlan.itemSpec }}</span>
                </div>
                <div class="info-item">
                  <span class="label">计划数量:</span>
                  <span class="value">{{ selectedPlan.amount }} {{ selectedPlan.unit }}</span>
                </div>
              </div>
            </div>

            <!-- 时间信息 -->
            <div class="detail-section">
              <h4>时间信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">计划工期:</span>
                  <span class="value">{{ selectedPlan.planPeriod }} 天</span>
                </div>
                <div class="info-item">
                  <span class="label">计划时间:</span>
                  <span class="value">{{ selectedPlan.planStartDate }} ~ {{ selectedPlan.planFinishDate }}</span>
                </div>
                <div class="info-item">
                  <span class="label">交付日期:</span>
                  <span class="value">{{ selectedPlan.dueDate }}</span>
                </div>
              </div>
            </div>
            <!-- 关联信息 -->
            <div class="detail-section">
              <h4>关联信息</h4>
              <div class="info-item">
                <span class="label">生产订单数量:</span>
                <span class="value">{{ selectedPlan.productionOrders }} 个</span>
              </div>
              <div class="info-item full-width">
                <span class="label">备注:</span>
                <span class="value">{{ selectedPlan.remark }}</span>
              </div>
            </div>
          </div>

          <el-empty v-else description="请选择一个排产计划查看详情" />
        </el-card>
      </div>
    </div>

    <!-- 引用弹窗组件 -->
    <addPlan :visible="addDialogVisible" :new-code="newCode" @update:visible="addDialogVisible = $event"
      @success="handleSuccessAdd" />

    <editPlan :visible="editDialogVisible" :initial-data="formData" @update:visible="editDialogVisible = $event"
      @success="handleSuccessEdit" />
  </div>

</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, CircleCheckFilled, CircleCloseFilled, Close, Edit, Delete } from '@element-plus/icons-vue';
import { getPlSchedulePlanList, deletePlSchedulePlan, getPlSchedulePlanById, updatePlanStatus } from '@/api/plmanage/plscheduleplan';
import addPlan from './components/addPlan.vue';
import editPlan from './components/editPlan.vue';


import { getNewNoNyName } from '@/api/system/basno'

const newCode = ref('');
// 生成新的排产计划编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('pcjh');

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


// 控制新增弹窗显示
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)


// 打开弹窗
const openAddDialog = async () => {
  newCode.value = await generateNewCode();
  addDialogVisible.value = true
}
const openEditDialog = async (id) => {
  const res = await getPlSchedulePlanById({ id: id })
  formData.value = res.data.schedulePlan;
  editDialogVisible.value = true
}

// 保存成功后的回调
const handleSuccessAdd = () => {
  ElMessage.success('排产计划添加成功')
  loadData();
}

// 保存成功后的回调
const handleSuccessEdit = () => {
  ElMessage.success('排产计划修改成功')
  loadData();
}


// 处理弹窗确认逻辑
const handleStatusUpdate = async (id, newStatus) => {
  try {
    // 弹窗确认
    await ElMessageBox.confirm(
      `确定要${newStatus === 20 ? '确认' : '反确认'}排产计划吗？`,
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
    const res = await updatePlanStatus({
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

// 获取分页数据
const fetchData = async (queryParams = {}) => {
  try {
    loading.value = true;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      purchaserHqCode: filters.purchaserHq,
      contractNo: filters.contractNo,
      contractName: filters.contractName,
      scheduleCode: filters.scheduleCode,
      planStartDate: filters.planStartDate,
      planFinishDate: filters.planFinishDate,
      status: filters.status,
    };

    // 过滤空值参数
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );

    const res = await getPlSchedulePlanList(filteredParams);

    if (res.code === 200 && res.success) {
      const data = res.data.page.list.map(item => ({
        id: item.id,
        scheduleCode: item.scheduleCode,
        poItemId: item.poItemId,
        contractNo: item.contractNo,
        contractName: item.contractName,
        purchaserHqCode: item.purchaserHqCode,
        provCoName: item.provCoName || '未知',
        provCoCode: item.provCoCode || '未知',
        supplierCode: item.supplierCode,
        supplierName: item.supplierName,
        categoryCode: item.categoryCode,
        subclassCode: item.subclassCode,
        itemName: item.itemName,
        itemSpec: item.itemSpec,
        amount: item.amount,
        unit: item.itemUnit || '件',
        planPeriod: typeof item.planPeriod === 'string' ?
          parseInt(item.planPeriod.replace('天', '')) || 0 : item.planPeriod || 0,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        dueDate: item.dueDate ? item.dueDate.split(' ')[0] : '',
        schedule: ['未开始', '进行中', '已完成'].includes(item.schedule) ? item.schedule : '未开始',
        status: item.status,
        remark: item.remark || '无',
        productionOrders: item.productionOrders || Math.floor(Math.random() * 3) + 1
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

// 加载数据
const loadData = async () => {
  const result = await fetchData();
  tableData.value = result.data;
  pagination.total = result.pagination.total;
  pagination.totalPages = result.pagination.totalPages; // Store totalPages
};

// 数据状态
const loading = ref(false);
const selectedPlan = ref(null);

// 筛选条件

// 筛选条件 - 修改后的版本
const filters = reactive({
  purchaserHq: '',
  contractNo: '',
  contractName: '',
  scheduleCode: '',
  planStartDate: '',
  planFinishDate: '',
  status: ''
});


// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  totalPages: 0 // Added to track total pages
});

const statusOptions = [
  { value: '10', label: '录入' },
  { value: '20', label: '确认' }
];

// 移除前端过滤逻辑，直接使用后端数据
const displayPlans = computed(() => {
  return tableData.value;
});



const handleSizeChange = (val) => {
  pagination.size = val;
  pagination.current = 1; // Reset to first page when size changes
  loadData();
};

const handleCurrentChange = (val) => {
  pagination.current = val;
  loadData();
};

// 方法
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
  return types[status] || '';
};

const getStatusIcon = (status) => {
  const icons = {
    '10': 'Clock',
    '20': 'CircleCheck'
  };
  return icons[status] || 'Clock';
};

const selectPlan = (plan) => {
  selectedPlan.value = plan;
};

const handleSearch = () => {
  pagination.current = 1; // Reset to first page on search
  loadData();
  ElMessage.success('查询成功');
};

// 重置方法 - 修改后的版本
const handleReset = () => {
  Object.assign(filters, {
    purchaserHq: '',
    contractNo: '',
    contractName: '',
    scheduleCode: '',
    planStartDate: '',
    planFinishDate: '',
    status: ''
  });
  pagination.current = 1;
  selectedPlan.value = null;
  loadData();
  ElMessage.success('筛选条件已重置');
};

// 删除计划
const deletePlan = async (plan) => {
  try {
    await ElMessageBox.confirm(`确认删除排产计划 ${plan.scheduleCode}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const res = await deletePlSchedulePlan({ id: plan.id });
    if (res.code === 200 && res.success) {
      ElMessage.success('删除成功');
      await loadData(); // 重新加载数据
      if (selectedPlan.value?.id === plan.id) {
        selectedPlan.value = null; // 清空选中状态
      }
    } else {
      throw new Error(res.msg || '删除失败');
    }
  } catch (error) {
    ElMessage.error(error.message || '删除失败');
  }
};

// 生命周期
onMounted(() => {
  loadData();
});

</script>

<style scoped>
/* 完整的CSS样式 */
.production-overview {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 20px;
}

/* 筛选区域样式 - 修改后的版本 */
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
  /* min-width: 120px; */
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
  /* max-width: 100%;  */
}

.plan-list {
  min-height: 600px;
  overflow: auto; /* 内容溢出时显示滚动条 */
}

.plan-detail {
  min-height: 600px;
  overflow: auto; /* 内容溢出时显示滚动条 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.count-badge {
  background-color: #f0f2f5;
  color: #606266;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
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

.info-item.full-width {
  flex-direction: column;
  gap: 4px;
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

.info-item.full-width .value {
  text-align: left;
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

.detail-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.detail-actions .el-button {
  flex: 1;
  min-width: 100px;
}

/* 状态筛选按钮样式 */
:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* 响应式设计 */
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
  .production-overview {
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

  .filter-item .el-input,
  .filter-item .el-date-picker {
    width: 100% !important;
  }

  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .el-button {
    width: 100%;
  }
}
</style>