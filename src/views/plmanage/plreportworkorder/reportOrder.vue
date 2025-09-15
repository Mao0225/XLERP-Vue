<template>
  <div class="work-report-entry">
    <!-- 顶部筛选区（简化筛选条件） -->
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

      <!-- 筛选操作 -->
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

    <!-- 主要内容区：左侧列表 + 右侧工序流程 -->
    <div class="main-content">
      <!-- 左侧生产工单列表 -->
      <div class="order-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>生产工单列表</span>
            </div>
          </template>

          <!-- 列表表格（简化显示信息，添加报工按钮） -->
          <el-table :data="tableData" :highlight-current-row="true" @current-change="selectOrder" v-loading="loading"
            height="600">
            <el-table-column type="index" label="序号" width="80" />
            
            <!-- 核心业务列 -->
            <el-table-column prop="woNo" label="生产工单号" width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="selectOrder(row)">{{ row.woNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="materialsName" label="物料名称" width="150" show-overflow-tooltip />
            <el-table-column prop="supplierName" label="供应商" width="120" show-overflow-tooltip />
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

            <!-- 操作列（只保留报工按钮） -->
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openAddDialog(row)">
                  <el-icon>
                    <EditPen />
                  </el-icon>
                  报工
                </el-button>
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

      <!-- 右侧工序流程可视化 -->
      <div class="process-flow">
        <el-card shadow="never" class="flow-card">
          <template #header>
            <div class="card-header">
              <span>工序流程</span>
              <el-button v-if="selectedOrder" size="small" @click="selectedOrder = null">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </template>

          <!-- 工序流程内容 -->
          <div v-if="selectedOrder" class="flow-content">
            <div class="order-info">
              <h4>{{ selectedOrder.woNo }} - {{ selectedOrder.materialsName }}</h4>
              <p>供应商：{{ selectedOrder.supplierName }}</p>
            </div>
            
            <div class="process-timeline">
              <div 
                v-for="(process, index) in processFlow" 
                :key="process.id" 
                class="process-card"
                :class="{ 'completed': process.completed, 'current': process.current }"
                @click="showProcessDetail(process)"
              >
                <div class="process-header">
                  <div class="process-status">
                    <el-icon v-if="process.completed" class="status-icon completed">
                      <CircleCheckFilled />
                    </el-icon>
                    <el-icon v-else-if="process.current" class="status-icon current">
                      <Clock />
                    </el-icon>
                    <el-icon v-else class="status-icon pending">
                      <Clock />
                    </el-icon>
                  </div>
                  <div class="process-info">
                    <h5>{{ process.name }}</h5>
                    <p class="process-meta">
                      <span v-if="process.completed">完成时间：{{ process.completedTime }}</span>
                      <span v-else-if="process.current">进行中</span>
                      <span v-else>待开始</span>
                    </p>
                    <p v-if="process.operator" class="process-operator">
                      录入人：{{ process.operator }}
                    </p>
                  </div>
                </div>
                
                <!-- 连接线 -->
                <div v-if="index < processFlow.length - 1" class="connector">
                  <div class="connector-line" :class="{ 'active': process.completed }"></div>
                  <el-icon class="connector-arrow">
                    <ArrowDown />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>

          <el-empty v-else description="请选择左侧工单查看工序流程" />
        </el-card>
      </div>
    </div>

    <!-- 工序详情弹窗 -->
    <el-dialog v-model="processDetailVisible" :title="`${selectedProcess?.name} - 详细信息`" width="600px">
      <div v-if="selectedProcess" class="process-detail">
        <div class="detail-section">
          <h4>基础信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">工序名称：</span>
              <span class="value">{{ selectedProcess.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">工序编码：</span>
              <span class="value">{{ selectedProcess.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <el-tag :type="selectedProcess.completed ? 'success' : (selectedProcess.current ? 'warning' : 'info')">
                {{ selectedProcess.completed ? '已完成' : (selectedProcess.current ? '进行中' : '待开始') }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="detail-section" v-if="selectedProcess.completed">
          <h4>完成信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">完成时间：</span>
              <span class="value">{{ selectedProcess.completedTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">录入人：</span>
              <span class="value">{{ selectedProcess.operator }}</span>
            </div>
            <div class="info-item">
              <span class="label">实际耗时：</span>
              <span class="value">{{ selectedProcess.duration || '未记录' }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>工序描述</h4>
          <p>{{ selectedProcess.description || '无描述信息' }}</p>
        </div>
      </div>
    </el-dialog>


        <!-- Dialog Components -->
    <addOrder
      :visible="addDialogVisible"
      :new-code="newCode"
      :select-order="selectedOrder"
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// 图标按需引入
import {
  Search, Refresh, Close, EditPen, CircleCheckFilled, Clock, ArrowDown
} from '@element-plus/icons-vue';
// 接口引用
import { getConfirmOrderList } from '@/api/plmanage/plworkorder';

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

// 1. 基础状态
const loading = ref(false);
const selectedOrder = ref(null); // 选中的工单
const processDetailVisible = ref(false); // 工序详情弹窗
const selectedProcess = ref(null); // 选中的工序

// 2. 筛选条件（简化）
const filters = reactive({
  contractNo: '',
  contractName: '',
  woNo: ''
});

// 3. 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});


// 5. 表格数据
const tableData = ref([]);

// 6. 示例工序流程数据
const processFlow = ref([
  {
    id: 1,
    code: 'P001',
    name: '原材料准备',
    completed: true,
    current: false,
    completedTime: '2024-03-15 09:30:00',
    operator: '张三',
    duration: '2小时',
    description: '准备生产所需的原材料，检查质量和数量'
  },
  {
    id: 2,
    code: 'P002',
    name: '机器调试',
    completed: true,
    current: false,
    completedTime: '2024-03-15 11:45:00',
    operator: '李四',
    duration: '1.5小时',
    description: '调试生产设备，确保设备运行正常'
  },
  {
    id: 3,
    code: 'P003',
    name: '生产加工',
    completed: false,
    current: true,
    completedTime: '',
    operator: '',
    duration: '',
    description: '进行产品的主要生产加工工序'
  },
  {
    id: 4,
    code: 'P004',
    name: '质量检验',
    completed: false,
    current: false,
    completedTime: '',
    operator: '',
    duration: '',
    description: '对加工完成的产品进行质量检验'
  },
  {
    id: 5,
    code: 'P005',
    name: '包装入库',
    completed: false,
    current: false,
    completedTime: '',
    operator: '',
    duration: '',
    description: '将检验合格的产品进行包装并入库'
  }
]);

// 7. 核心方法
// 加载列表数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.purchaserHqCode || undefined,
      contractName: filters.supplierCode || undefined,
      woNo: filters.woNo || undefined
    };

    const res = await getConfirmOrderList(params);
    if (res.code === 200 && res.success) {
    //   const data = res.data.page.list.map(item => ({
    //     id: item.id,
    //     purchaserHqCode: item.purchaserHqCode,
    //     supplierCode: item.supplierCode,
    //     ipoNo: item.ipoNo,
    //     woNo: item.woNo,
    //     supplierName: item.supplierName,
    //     materialsName: item.materialsName,
    //     amount: item.amount,
    //     unit: item.unit,
    //     planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
    //     planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : ''
    //   }));
      tableData.value = res.data.page.list;
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

// 搜索/重置
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

// 选中工单
const selectOrder = (order) => {
  selectedOrder.value = order;
};

// 显示工序详情
const showProcessDetail = (process) => {
  selectedProcess.value = process;
  processDetailVisible.value = true;
};

// 初始化加载
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.work-report-entry {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 20px;
}

/* 筛选区域样式 */
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

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 主内容区样式 */
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  min-height: 600px;
}

.order-list,
.process-flow {
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

/* 工序流程样式 */
.flow-card {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.flow-content {
  max-height: 70vh;
  overflow-y: auto;
}

.order-info {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.order-info h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.order-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.process-timeline {
  padding: 0 16px;
}

.process-card {
  position: relative;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.process-card:hover {
  transform: translateY(-2px);
}

.process-card.completed {
  opacity: 1;
}

.process-card.current {
  background-color: #fff7e6;
  border: 2px solid #faad14;
  border-radius: 8px;
  padding: 12px;
}

.process-card:not(.completed):not(.current) {
  opacity: 0.6;
}

.process-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.process-status {
  flex-shrink: 0;
}

.status-icon {
  font-size: 24px;
}

.status-icon.completed {
  color: #52c41a;
}

.status-icon.current {
  color: #faad14;
}

.status-icon.pending {
  color: #d9d9d9;
}

.process-info {
  flex: 1;
}

.process-info h5 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.process-meta {
  margin: 0 0 4px 0;
  color: #606266;
  font-size: 13px;
}

.process-operator {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
}

.connector-line {
  width: 2px;
  height: 16px;
  background-color: #d9d9d9;
  transition: background-color 0.3s ease;
}

.connector-line.active {
  background-color: #52c41a;
}

.connector-arrow {
  color: #d9d9d9;
  font-size: 16px;
  margin-top: 4px;
}

/* 工序详情样式 */
.process-detail .detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.process-detail .detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.process-detail .detail-section h4 {
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .flow-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .work-report-entry {
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
  .filter-item .el-input {
    width: 100% !important;
  }

  .process-header {
    flex-direction: column;
    gap: 8px;
  }

  .process-info h5 {
    font-size: 14px;
  }
}
</style>