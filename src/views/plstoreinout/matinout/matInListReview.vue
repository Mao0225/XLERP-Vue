<template>
  <div class="inbound-management">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 筛选项：单据编号 -->
        <div class="filter-item">
          <span class="filter-label">单据编号：</span>
          <el-input v-model="filters.docNo" placeholder="请输入单据编号" clearable style="width: 200px;"
            @clear="getInboundListData" @keyup.enter="getInboundListData" />
        </div>
        <!-- 筛选项：发货单位 -->
        <div class="filter-item">
          <span class="filter-label">发货单位：</span>
          <el-input v-model="filters.deliveryOrg" placeholder="请输入发货单位" clearable style="width: 200px;"
            @clear="getInboundListData" @keyup.enter="getInboundListData" />
        </div>
        <!-- 筛选项：经手人 -->
        <div class="filter-item">
          <span class="filter-label">经手人：</span>
          <el-input v-model="filters.handler" placeholder="请输入经手人" clearable style="width: 200px;"
            @clear="getInboundListData" @keyup.enter="getInboundListData" />
        </div>
      </div>
      <!-- 筛选操作 -->
      <div class="filter-actions">
        <el-button type="primary" @click="getInboundListData">
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

    <!-- 主要内容区：入库单列表 -->
    <div class="main-content">
      <div class="inbound-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>入库单列表</span>
              <el-button type="primary" @click="showAddForm">
                <el-icon>
                  <Plus />
                </el-icon>
                新增入库
              </el-button>
            </div>
          </template>
          <el-table :data="inboundList" v-loading="loading" height="600" border>
            <el-table-column type="index" label="序号" width="80" />
            <!-- 状态列 -->
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  <el-icon>
                    <component :is="getStatusIcon(row.status)" />
                  </el-icon>
 
                {{row.status == 20 ? '待审核' : '入库完成'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="docNo" label="单据编号" width="140" show-overflow-tooltip />
            <el-table-column prop="transactionDate" label="单据日期" width="120" show-overflow-tooltip />
            <el-table-column prop="deliveryOrg" label="发货单位" width="180" show-overflow-tooltip />
            <el-table-column prop="handler" label="经手人" width="100" show-overflow-tooltip />
            <el-table-column prop="storekeeper" label="库管员" width="100" show-overflow-tooltip />
            <el-table-column label="是否有发票" width="100">
              <template #default="{ row }">
                <el-tag :type="row.hasInvoice ? 'success' : 'info'" size="small">
                  {{ row.hasInvoice ? '有' : '无' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="term" label="业务期间" width="100" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" width="150" show-overflow-tooltip />
            <el-table-column prop="operateTime" label="录入时间" width="140" show-overflow-tooltip />
            <!-- 操作列 -->
            <el-table-column label="操作" width="350" fixed="right">
              <template #default="{ row }">
                <el-space>
                  <template v-if="row.status == 20">
              
                    <el-button type="info" size="small" @click="openDetailReadonlyDialog(row)">
                      <el-icon><Document /></el-icon> 查看明细
                    </el-button>
                    <el-button type="warning" size="small" @click="updateStatus(row.id, 30)">
                      <el-icon><CircleCheckFilled /></el-icon> 确认入库
                    </el-button>
                    <el-button type="danger" size="small" @click="updateStatus(row.id, 10)">
                      <el-icon><CircleCloseFilled /></el-icon> 退回录入
                    </el-button>
                  </template>

                  <template v-else-if="row.status == 30">
                    <el-button type="info" size="small" @click="openDetailReadonlyDialog(row)">
                      <el-icon><Document /></el-icon> 查看明细
                    </el-button>
                  </template>
                </el-space>
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

    <DetailReadonlyForm :visible="showDetailReadonlyDialog" :inbound-info="selectedInbound" @update:visible="showDetailReadonlyDialog = $event" />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Edit, Delete, Document, Plus, Clock, CircleCheckFilled, CircleCloseFilled, CircleCheck } from '@element-plus/icons-vue';
import { getPlMatInoutList,updatePlMatInoutStatus} from '@/api/plstoreinout/matinout.js';
import { useTermStore } from '@/store/term.js';

import DetailReadonlyForm from './matItem/matItemListReadonly.vue';
	
	



const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);

// 状态管理
const loading = ref(false);
const selectedInbound = ref(null);
const inboundList = ref([]);
const total = ref(0);

// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  docNo: '',
  deliveryOrg: '',
  handler: '',
  status: 20,
  inOutType: 1, // 1=入库，2=出库
});

// 获取入库单列表
const getInboundListData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      term: filters.term || undefined,
      docNo: filters.docNo || undefined,
      deliveryOrg: filters.deliveryOrg || undefined,
      handler: filters.handler || undefined,
      status: filters.status || undefined,
      inOutType: filters.inOutType,
    };
    const res = await getPlMatInoutList(params);
    inboundList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取入库单列表失败', error);
    ElMessage.error('获取入库单列表失败');
  } finally {
    loading.value = false;
  }
};

// 监听期间变化
watch(() => termStore.currentTerm, (newTerm) => {
  filters.term = newTerm || '';
  getInboundListData();
}, { immediate: true });

// 分页操作
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1;
  getInboundListData();
};


const updateStatus = async (id, status) => {
  // 根据状态值确定确认消息
  const confirmMessage = status === 20 
    ? '确定入库吗？' 
    : '确定要退回录入状态吗？';
  
  try {
    // 显示确认弹窗
    const confirmed = await ElMessageBox.confirm(
      confirmMessage,
      '操作确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    // 如果用户确认操作
    if (confirmed) {
      await updatePlMatInoutStatus({ id, status });
      ElMessage.success(status === 30 ? '确认入库成功' : '退回录入成功');
      getInboundListData();
    }
  } catch (error) {
    // 如果是用户取消操作，不显示错误信息
    if (error === 'cancel') {
      return;
    }
    
    console.error('更新状态失败', error);
    ElMessage.error('更新状态失败');
  }
};
const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getInboundListData();
};

// 重置筛选
const handleReset = () => {
  filters.docNo = '';
  filters.deliveryOrg = '';
  filters.handler = '';
  filters.status = 20;
  filters.pageNumber = 1;
  getInboundListData();
  ElMessage.success('筛选条件已重置');
};



const showDetailReadonlyDialog = ref(false);
const openDetailReadonlyDialog = (row) => {
  selectedInbound.value = row;
  showDetailReadonlyDialog.value = true;
};







const getStatusTagType = (status) => {
  const statusMap = {
    '20': 'warning',
    '30': 'success',
  };
  return statusMap[status] || 'info';
};

const getStatusIcon = (status) => {
  const iconMap = {
    '20': 'CircleCheckFilled',
    '30': 'CircleCloseFilled',
  };
  return iconMap[status] || 'Clock';
};

// 初始化加载
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms();
  }
  getInboundListData();
});
</script>

<style scoped>
.inbound-management {
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
  min-width: 80px;
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
  min-height: 600px;
}

.inbound-list {
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

:deep(.el-radio-button__inner) {
  border-radius: 4px;
  padding: 6px 16px;
}

:deep(.el-radio-button.is-checked .el-radio-button__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.status-entered {
  --el-radio-button-checked-bg-color: #909399;
  --el-radio-button-checked-border-color: #909399;
}

.status-audited {
  --el-radio-button-checked-bg-color: #e6a23c;
  --el-radio-button-checked-border-color: #e6a23c;
}

.status-completed {
  --el-radio-button-checked-bg-color: #67c23a;
  --el-radio-button-checked-border-color: #67c23a;
}

@media (max-width: 768px) {
  .inbound-management {
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