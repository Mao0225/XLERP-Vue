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
      <!-- 状态筛选（使用RadioGroup） -->
      <div class="filter-row">
        <div class="status-filter">
          <span class="filter-label">合同状态：</span>
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

    <!-- 主要内容区：左侧列表 + 右侧详情 -->
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
          <el-table :data="contractList" :highlight-current-row="true" @current-change="selectContractRow" v-loading="loading"
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
                <el-link type="primary" @click="selectContractRow(row)">{{ row.no }}</el-link>
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
            <!-- <el-table-column prop="salesmanName" label="销售员" width="100" show-overflow-tooltip /> -->

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
                  <el-button type="primary" size="small" @click="openItemListDialog(row)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    产品列表
                  </el-button>
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
                  <el-button type="primary" size="small" @click="openItemListReadonlyDialog(row)">
                    <el-icon>
                      <Document />
                    </el-icon>
                    产品列表
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

      <!-- 右侧合同详情 -->
      <!-- 右侧合同详情 -->
  <div class="contract-detail">
    <el-card shadow="never" class="detail-card">
      <template #header>
        <div class="card-header">
          <span>合同详情</span>
          <el-button v-if="selectedContract" size="small" @click="selectedContract = null">
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </div>
      </template>
      <div v-if="selectedContract" class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">厂内合同号：</span>
              <span class="value">{{ selectedContract.no || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">器材合同号：</span>
              <span class="value">{{ selectedContract.equipno || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">国网经法合同号：</span>
              <span class="value">{{ selectedContract.ecpno || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">工程名称：</span>
              <span class="value">{{ selectedContract.name || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">电网编号：</span>
              <span class="value">{{ selectedContract.gridno || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">电压等级(KV)：</span>
              <span class="value">{{ selectedContract.pressurestage || '无' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>供应商信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">采购方总部编码：</span>
              <span class="value">{{ selectedContract.purchaserHqCode || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">供应商编码：</span>
              <span class="value">{{ selectedContract.supplierCode || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">供应商名称：</span>
              <span class="value">{{ selectedContract.supplierName || '无' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>销售与客户信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">销售员名称：</span>
              <span class="value">{{ selectedContract.salesmanName || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户名称：</span>
              <span class="value">{{ selectedContract.customerName || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户代理人：</span>
              <span class="value">{{ selectedContract.agent || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">法定代表人：</span>
              <span class="value">{{ selectedContract.legalrepresent || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">税务号：</span>
              <span class="value">{{ selectedContract.taxnum || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户电话：</span>
              <span class="value">{{ selectedContract.telephone || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">客户传真：</span>
              <span class="value">{{ selectedContract.fax || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮政编码：</span>
              <span class="value">{{ selectedContract.postalcode || '无' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>交付信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">交货时间：</span>
              <span class="value">{{ selectedContract.itemsenddate || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">到货地点：</span>
              <span class="value">{{ selectedContract.destination || '无' }}</span>
            </div>

            <div class="info-item">
              <span class="label">包装费承担：</span>
              <span class="value">{{ selectedContract.casingcost || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">运费承担：</span>
              <span class="value">{{ selectedContract.transcost || '无' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>财务信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">合同金额：</span>
              <span class="value">¥{{ (selectedContract.contractSum?.toFixed(2)) ?? '0.00' }}</span>
            </div>
            <div class="info-item">
              <span class="label">开户银行：</span>
              <span class="value">{{ selectedContract.bank || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">银行账号：</span>
              <span class="value">{{ selectedContract.bankcode || '无' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>其他信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">所属期间：</span>
              <span class="value">{{ selectedContract.term || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">签订时间：</span>
              <span class="value">{{ selectedContract.signDate || selectedContract.signdate || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">其他条款：</span>
              <span class="value">{{ selectedContract.other || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">备注：</span>
              <span class="value">{{ selectedContract.memo || '无' }}</span>
            </div>
            <!-- <div class="info-item">
              <span class="label">用户ID（创建人）：</span>
              <span class="value">{{ selectedContract.userid || '无' }}</span>
            </div> -->
          </div>
        </div>
        <div class="detail-section">
          <h4>状态信息</h4>
          <div class="status-info">
            <el-tag :type="getStatusTagType(selectedContract.status)">
              <el-icon>
                <component :is="getStatusIcon(selectedContract.status)" />
              </el-icon>
              {{ getStatusText(selectedContract.status) }}
            </el-tag>
          </div>
        </div>
      </div>
      <el-empty v-else description="请选择列表中的合同查看详情" />
    </el-card>
  </div>
    </div>

    <!-- 弹窗 -->
    <AddForm :visible="showAddDialog" @update:visible="showAddDialog = $event" @success="handleSuccessAdd" />
    <EditForm :visible="showEditDialog" :initial-data="selectedContract" @update:visible="showEditDialog = $event"
      @success="handleSuccessEdit" />
    <itemListForm :visible="showItemListDialog" :contract-info="selectedContract" @update:visible="showItemListDialog = $event" />
    <itemListReadonly :visible="showItemListReadonlyDialog" :contract-info="selectedContract"@update:visible="showItemListReadonlyDialog = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Close, Edit, Delete, CircleCheckFilled, CircleCloseFilled, Clock, Document } from '@element-plus/icons-vue';
import { getContractList, deleteBasContract, updateBasContractStatus, getContractByNo } from '@/api/contract/bascontract.js';
import { useTermStore } from '@/store/term.js';
import AddForm from './addForm.vue';
import EditForm from './editForm.vue';
import itemListForm from './itemListForm.vue';
import itemListReadonly from './itemListReadonly.vue';
import { getPlMatInoutList,deletePlMatInout,getPlMatInoutById} from '@/api/plstoreinout/matinout.js';

const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);

// 状态管理
const loading = ref(false);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showItemListDialog = ref(false);
const showItemListReadonlyDialog = ref(false);
const selectedContract = ref(null);
const contractList = ref([]);
const total = ref(0);

// 筛选条件（与模板一致）
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: '',
  status: '',
});

// 状态选项
// const statusOptions = ref([
//   { value: '', label: '全部', icon: 'Refresh' },
//   { value: '10', label: '录入', icon: 'Clock' },
//   { value: '20', label: '确认', icon: 'CircleCheckFilled' },
//   { value: '30', label: '下计划', icon: 'Clock' },
//   { value: '40', label: '生产中', icon: 'Clock' },
//   { value: '50', label: '发货', icon: 'Clock' },
//   { value: '60', label: '完成', icon: 'CircleCheckFilled' },
// ]);

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
const getStatusClass = (status) => {
  return status === '10' ? 'status-entered' :
    status === '20' ? 'status-confirmed' :
    status === '30' ? 'status-planned' :
    status === '40' ? 'status-producing' :
    status === '50' ? 'status-shipped' :
    status === '60' ? 'status-completed' : '';
};

const getStatusTagType = (status) => {
  const statusMap = {
    10: 'info',
    20: 'success',
    30: 'warning',
    40: 'danger',
    50: 'danger',
    60: 'primary',
  };
  return statusMap[status] || 'info';
};

const getStatusIcon = (status) => {
  const iconMap = {
    10: 'Clock',
    20: 'CircleCheckFilled',
    30: 'Clock',
    40: 'Clock',
    50: 'Clock',
    60: 'CircleCheckFilled',
  };
  return iconMap[status] || 'Clock';
};

const getStatusText = (status) => {
  const statusMap = {
    10: '录入',
    20: '确认',
    30: '下计划',
    40: '生产中',
    50: '发货',
    60: '完成',
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
/* 样式与模板一致 */
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

.contract-list,
.contract-detail {
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

  .status-filter {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>