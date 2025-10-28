<template>
  <div class="contract-management">
    <!-- 顶部筛选区（与模板一致，使用卡片布局） -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 筛选项：合同编号 -->
        <div class="filter-item">
          <span class="filter-label">合同编号：</span>
          <el-input v-model="filters.contractNo" placeholder="请输入合同编号" clearable style="width: 200px;"
            @clear="getContractListData" @keyup.enter="getContractListData" />
        </div>
        <!-- 筛选项：合同名称 -->
        <div class="filter-item">
          <span class="filter-label">合同名称：</span>
          <el-input v-model="filters.projectName" placeholder="请输入合同名称" clearable style="width: 200px;"
            @clear="getContractListData" @keyup.enter="getContractListData" />
        </div>
      </div>
      <!-- 筛选操作 -->
      <div class="filter-actions">
        <el-button type="primary" @click="getContractListData">
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

    <!-- 主要内容区：合同列表 -->
    <div class="main-content">
      <!-- 左侧合同列表 -->
      <div class="contract-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>合同列表</span>
            </div>
          </template>
          <el-table :data="contractList" :highlight-current-row="true" v-loading="loading" height="600" border>
            <el-table-column type="index" label="序号" width="80" />
            <!-- 状态列 -->
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
            <el-table-column prop="no" label="厂内合同号" width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="openContractInfoDialog(row.no)">{{ row.no }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="合同名称" width="120" show-overflow-tooltip />
            <el-table-column prop="customerName" label="客户名称" width="120" show-overflow-tooltip />
            <!-- <el-table-column prop="contractSum" label="合同金额" width="120">
              <template #default="{ row }">
                ¥{{ (row.contractSum?.toFixed(2)) ?? '0.00' }}
              </template>
            </el-table-column> -->
            <el-table-column prop="gridno" label="电网编号" width="120" show-overflow-tooltip />
            <el-table-column prop="ecpno" label="国网经法合同号" width="130" show-overflow-tooltip />
            <el-table-column prop="equipno" label="器材合同号" width="120" show-overflow-tooltip />
            <el-table-column prop="signDate" label="签订时间" width="120" show-overflow-tooltip />
            <el-table-column prop="term" label="期间" width="120" show-overflow-tooltip />
            <!-- 操作列 -->
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openAddDialog(row.no)">
                  <el-icon><Edit /></el-icon>
                  制定排产计划
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination v-model:current-page="filters.pageNumber" v-model:page-size="filters.pageSize"
              :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <addPlan 
    v-model:visible="addDialogVisible" 
    :newCode="newCode" 
    :contractInfo="selectedContract"
    @update:visible="addDialogVisible = $event"/>

</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Edit, Clock, CircleCheckFilled } from '@element-plus/icons-vue';
import { getConfirmContract,getContractByNo } from '@/api/contract/bascontract.js';
import { useTermStore } from '@/store/term.js';
import addPlan from './components/addPlan.vue';
import { getNewNoNyName } from '@/api/system/basno'




const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);
const newCode = ref('');
// 状态管理
const loading = ref(false);
const selectedContract = ref(null);
const contractList = ref([]);
const total = ref(0);
const addDialogVisible = ref(false);
const contractPlanListVisible = ref(false);
// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: '',
});
// 获取合同列表
const getContractListData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      term: filters.term || undefined,
      contractNo: filters.contractNo || undefined,
      projectName: filters.projectName || undefined,
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


// 生成排产计划编码
const generateScheduleCode = async () => {
  try {
    const res = await getNewNoNyName('pcjh');

    if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName);
      return res.data.fullNoNyName;
    }

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

// 监听期间变化
watch(() => termStore.currentTerm, (newTerm) => {
  filters.term = newTerm || '';
  getContractListData();
}, { immediate: true });

// 分页操作
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1;
  getContractListData();
};

const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getContractListData();
};

// 重置筛选
const handleReset = () => {
  filters.contractNo = '';
  filters.projectName = '';
  filters.status = '';
  filters.pageNumber = 1;
  selectedContract.value = null;
  getContractListData();
  ElMessage.success('筛选条件已重置');
};

// 状态样式映射
const getStatusTagType = (status) => {
  const statusMap = {
    10: 'info',
    20: 'success',
  };
  return statusMap[status] || 'info';
};

const getStatusIcon = (status) => {
  const iconMap = {
    10: 'Clock',
    20: 'CircleCheckFilled',
  };
  return iconMap[status] || 'Clock';
};

const getStatusText = (status) => {
  const statusMap = {
    10: '录入',
    20: '确认',
  };
  return statusMap[status] || '未知';
};

// 初始化加载
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms();
  }
  getContractListData();
});
</script>

<style scoped>
.contract-management {
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

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  min-height: 600px;
}

.contract-list {
  min-height: 600px;
  overflow: auto;
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
}

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
    text-align: left;
    min-width: auto;
  }

  .filter-item .el-input {
    width: 100% !important;
  }
}
</style>