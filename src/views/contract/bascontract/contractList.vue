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
              <el-button type="primary" @click="showAddDialog = true">新增合同</el-button>
            </div>
          </template>
          <el-table :data="contractList" :highlight-current-row="true" v-loading="loading"
            height="600" border>
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
            <!-- 操作列 -->
            <el-table-column label="操作" width="350" fixed="right">
              <template #default="{ row }">
                <template v-if="row.status === 10">
                  <el-button type="primary" size="small" @click="openEditDialog(row.no)">
                    <el-icon>
                      <Edit />
                    </el-icon>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="handleDelete(row)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
                  </el-button>
                  <!-- <el-button type="primary" size="small" @click="openItemListDialog(row)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    产品列表
                  </el-button> -->
                  <el-button type="success" size="small" @click="handleConfirm(row)">
                    <el-icon>
                      <CircleCheckFilled />
                    </el-icon>
                    确认
                  </el-button>
                </template>
                <template v-if="row.status === 20">
                  <el-button type="warning" size="small" @click="handleUnconfirm(row)">
                    <el-icon>
                      <CircleCloseFilled />
                    </el-icon>
                    反确认
                  </el-button>
                </template>
                <template v-if="row.status >= 20">
                  <!-- <el-button type="primary" size="small" @click="openItemListReadonlyDialog(row)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    产品列表
                  </el-button> -->
                  <el-button type="primary" size="small" @click="openContractInfoDialog(row.no)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    查看合同信息
                  </el-button>
                  
                </template>
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

    <!-- 弹窗 -->
    <AddForm :visible="showAddDialog" @update:visible="showAddDialog = $event" @success="handleSuccessAdd" />
    <EditForm :visible="showEditDialog" :initial-data="selectedContract" @update:visible="showEditDialog = $event"
      @success="handleSuccessEdit" />

    <ContractInfoReadonlyForm :visible="showContractInfoDialog" :initial-data="selectedContract" @update:visible="showContractInfoDialog = $event" />
    <itemListForm :visible="showItemListDialog" :contract-info="selectedContract" @update:visible="showItemListDialog = $event" />
    <itemListReadonly :visible="showItemListReadonlyDialog" :contract-info="selectedContract" @update:visible="showItemListReadonlyDialog = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Edit, Delete, CircleCheckFilled, CircleCloseFilled, Clock, Document } from '@element-plus/icons-vue';
import { getContractList, deleteBasContract, updateBasContractStatus, getContractByNo } from '@/api/contract/bascontract.js';
import { useTermStore } from '@/store/term.js';
import AddForm from './addFormAll.vue';
import EditForm from './editFormAll.vue';
import itemListForm from './itemListForm.vue';
import itemListReadonly from './itemListReadonly.vue';
import ContractInfoReadonlyForm from './contractInfoReadonlyForm.vue';

const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);

// 状态管理
const loading = ref(false);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showContractInfoDialog = ref(false);
const showItemListDialog = ref(false);
const showItemListReadonlyDialog = ref(false);
const selectedContract = ref(null);
const contractList = ref([]);
const total = ref(0);

// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: '',
  status: '',
});

// 状态选项
const statusOptions = ref([
  { value: '', label: '全部', icon: 'Refresh' },
  { value: '10', label: '录入', icon: 'Clock' },
  { value: '20', label: '确认', icon: 'CircleCheckFilled' },
]);

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
      status: filters.status || undefined,
    };
    const res = await getContractList(params);
    contractList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取合同列表失败', error);
    ElMessage.error('获取合同列表失败');
  } finally {
    loading.value = false;
  }
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

// 删除合同
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除合同"${row.no}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteBasContract({ contractId: row.id });
    ElMessage.success('删除成功');
    getContractListData();
    if (selectedContract.value?.id === row.id) {
      selectedContract.value = null;
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除合同失败', error);
      ElMessage.error('删除合同失败');
    }
  }
};

// 确认合同
const handleConfirm = async (row) => {
  try {
    await ElMessageBox.confirm(`确认合同"${row.no}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await updateBasContractStatus({ contractId: row.id, status: 20 });
    ElMessage.success('确认成功');
    getContractListData();
    if (selectedContract.value?.id === row.id) {
      selectedContract.value.status = '20';
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认合同失败', error);
      ElMessage.error('确认合同失败');
    }
  }
};

// 反确认合同
const handleUnconfirm = async (row) => {
  try {
    await ElMessageBox.confirm(`反确认合同"${row.no}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await updateBasContractStatus({ contractId: row.id, status: 10 });
    ElMessage.success('反确认成功');
    getContractListData();
    if (selectedContract.value?.id === row.id) {
      selectedContract.value.status = '10';
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('反确认合同失败', error);
      ElMessage.error('反确认合同失败');
    }
  }
};

// 打开编辑弹窗
const openEditDialog = async (contractNo) => {
  try {
    const res = await getContractByNo({ contractNo });
    selectedContract.value = res.data.contractInfo;
    showEditDialog.value = true;
  } catch (error) {
    console.error('获取合同详情失败', error);
    ElMessage.error('获取合同详情失败');
  }
};


const openContractInfoDialog = async (contractNo) => {
  try {
    const res = await getContractByNo({ contractNo });
    selectedContract.value = res.data.contractInfo;
    showContractInfoDialog.value = true;
  } catch (error) {
    console.error('获取合同详情失败', error);
    ElMessage.error('获取合同详情失败');
  }
};

// 打开产品列表弹窗
const openItemListDialog = (row) => {
  selectedContract.value = row;
  showItemListDialog.value = true;
};

const openItemListReadonlyDialog = (row) => {
  selectedContract.value = row;
  showItemListReadonlyDialog.value = true;
};

// 新增/编辑成功回调
const handleSuccessAdd = () => {
  ElMessage.success('添加成功');
  getContractListData();
};

const handleSuccessEdit = () => {
  ElMessage.success('修改成功');
  getContractListData();
};

// 选中合同
const selectContractRow = (row) => {
  selectedContract.value = row;
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