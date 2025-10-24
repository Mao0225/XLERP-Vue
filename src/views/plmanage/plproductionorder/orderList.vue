<template>
  <div class="contract-management">
    <!-- ==================== 合同列表 ==================== -->
    <div class="main-content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>合同列表</span>
          </div>
        </template>

        <!-- 合同搜索框 -->
        <div class="tab-filter">
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">合同编号：</span>
              <el-input
                v-model="contractFilters.contractNo"
                placeholder="请输入合同编号"
                clearable
                style="width: 200px"
                @clear="getContractListData"
                @keyup.enter="getContractListData"
              />
            </div>
            <div class="filter-item">
              <span class="filter-label">合同名称：</span>
              <el-input
                v-model="contractFilters.projectName"
                placeholder="请输入合同名称"
                clearable
                style="width: 200px"
                @clear="getContractListData"
                @keyup.enter="getContractListData"
              />
            </div>
          </div>
          <div class="filter-actions">
            <el-button type="primary" @click="getContractListData">
              <el-icon><Search /></el-icon> 查询
            </el-button>
            <el-button @click="resetContractFilter">
              <el-icon><Refresh /></el-icon> 重置
            </el-button>
          </div>
        </div>

        <!-- 表格 -->
        <el-table
          :data="contractList"
          :highlight-current-row="true"
          v-loading="loading"
          height="560"
          border
        >
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                <el-icon><component :is="getStatusIcon(row.status)" /></el-icon>
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="no" label="厂内合同号" width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link type="primary" @click="openContractInfoDialog(row.no)">{{ row.no }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="合同名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" width="120" show-overflow-tooltip />
          <el-table-column prop="contractSum" label="合同金额" width="120">
            <template #default="{ row }">
              ¥{{ (row.contractSum?.toFixed(2)) ?? '0.00' }}
            </template>
          </el-table-column>
          <el-table-column prop="gridno" label="电网编号" width="120" show-overflow-tooltip />
          <el-table-column prop="ecpno" label="国网经法合同号" width="130" show-overflow-tooltip />
          <el-table-column prop="equipno" label="器材合同号" width="120" show-overflow-tooltip />
          <el-table-column prop="signDate" label="签订时间" width="120" show-overflow-tooltip />
          <el-table-column prop="term" label="期间" width="120" show-overflow-tooltip />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="openAddDialog(row.no)">
                <el-icon><Edit /></el-icon> 制定生产订单
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="contractFilters.pageNumber"
            v-model:page-size="contractFilters.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleContractSizeChange"
            @current-change="handleContractCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 生产订单弹窗 -->
    <addPlan
      v-model:visible="addDialogVisible"
      :newCode="newCode"
      :contractInfo="selectedContract"
      @update:visible="addDialogVisible = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Edit, Clock, CircleCheckFilled } from '@element-plus/icons-vue';
import { getConfirmContract, getContractByNo } from '@/api/contract/bascontract.js';
import { getNewNoNyName } from '@/api/system/basno';
import { useTermStore } from '@/store/term.js';
import addPlan from './components/addOrder.vue';

const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);
const newCode = ref('');

// ==================== 合同列表 ====================
const loading = ref(false);
const selectedContract = ref(null);
const contractList = ref([]);
const total = ref(0);
const addDialogVisible = ref(false);

const contractFilters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: '',
});

// ==================== 获取合同列表 ====================
const getContractListData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: contractFilters.pageNumber,
      pageSize: contractFilters.pageSize,
      term: contractFilters.term || undefined,
      contractNo: contractFilters.contractNo || undefined,
      projectName: contractFilters.projectName || undefined,
    };
    const res = await getConfirmContract(params);
    contractList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取合同列表失败', error);
    ElMessage.error('获取合同列表失败');
  } finally {
    loading.value = false;
  }
};

// ==================== 生成编码 ====================
const generateScheduleCode = async () => {
  try {
    const res = await getNewNoNyName('pcjh');
    if (res?.code === 200) return res.data.fullNoNyName;
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
  } catch (error) {
    console.error('生成排产计划编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};

const openAddDialog = async (contractNo) => {
  newCode.value = await generateScheduleCode();
  const res = await getContractByNo({ contractNo });
  selectedContract.value = res.data.contractInfo;
  addDialogVisible.value = true;
};

const openContractInfoDialog = (contractNo) => {
  // 这里保留原来的打开详情逻辑（如果有的话），或自行实现
  ElMessage.info(`查看合同详情：${contractNo}`);
};

// ==================== 合同分页 ====================
const handleContractSizeChange = (size) => {
  contractFilters.pageSize = size;
  contractFilters.pageNumber = 1;
  getContractListData();
};

const handleContractCurrentChange = (page) => {
  contractFilters.pageNumber = page;
  getContractListData();
};

// ==================== 重置 ====================
const resetContractFilter = () => {
  contractFilters.contractNo = '';
  contractFilters.projectName = '';
  contractFilters.pageNumber = 1;
  getContractListData();
  ElMessage.success('合同筛选已重置');
};

// ==================== 状态映射 ====================
const getStatusTagType = (status) => ({ 10: 'info', 20: 'success' }[status] || 'info');
const getStatusIcon = (status) => ({ 10: 'Clock', 20: 'CircleCheckFilled' }[status] || 'Clock');
const getStatusText = (status) => ({ 10: '录入', 20: '确认' }[status] || '未知');

// ==================== 监听期间 ====================
watch(
  () => termStore.currentTerm,
  (newTerm) => {
    contractFilters.term = newTerm || '';
    getContractListData();
  },
  { immediate: true }
);

// ==================== 初始化 ====================
onMounted(() => {
  if (!termStore.terms.length) termStore.fetchTerms();
  getContractListData();
});
</script>

<style scoped>
.contract-management {
  padding: 5px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 搜索框样式 */
.tab-filter {
  padding: 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.main-content .el-card {
  margin-bottom: 0;
}

.main-content .el-card .el-card__body {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .contract-management {
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
    min-width: auto;
  }

  .filter-item .el-input {
    width: 100% !important;
  }
}
</style>