<template>
  <div class="material-management">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 筛选项：物料编号 -->
        <div class="filter-item">
          <span class="filter-label">物料编号：</span>
          <el-input v-model="filters.materialCode" placeholder="请输入物料编号" clearable style="width: 200px;"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>
        <!-- 筛选项：物料型号 -->
        <div class="filter-item">
          <span class="filter-label">物料型号：</span>
          <el-input v-model="filters.materialSpec" placeholder="请输入物料型号" clearable style="width: 200px;"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>
        <!-- 筛选项：物料名称 -->
        <div class="filter-item">
          <span class="filter-label">物料名称：</span>
          <el-input v-model="filters.materialName" placeholder="请输入物料名称" clearable style="width: 200px;"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>
        <!-- 筛选项：出入库类型 -->
        <div class="filter-item">
          <span class="filter-label">出入库类型：</span>
          <el-select v-model="filters.inOutType" placeholder="请选择出入库类型" clearable style="width: 200px;"
            @change="getMaterialListData">
            <el-option label="全部" value="" />
            <el-option label="入库" value="1" />
            <el-option label="出库" value="2" />
          </el-select>
        </div>
      </div>
      <!-- 筛选操作 -->
      <div class="filter-actions">
        <el-button type="primary" @click="getMaterialListData">
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

    <!-- 主要内容区：物料列表 -->
    <div class="main-content">
      <div class="material-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>物料列表</span>
            </div>
          </template>
          <el-table :data="materialList" v-loading="loading" height="600" border>
            <el-table-column type="index" label="序号" width="80" />
            <!-- 状态列 -->
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.docStatus)" size="small">
                  <el-icon>
                    <component :is="getStatusIcon(row.docStatus)" />
                  </el-icon>
                  {{ getStatusText(row.docStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="出入库类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.inOutType === 1 ? 'success' : 'warning'" size="small">
                  {{ row.inOutType === 1 ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="docNo" label="单据编号" width="140" show-overflow-tooltip />
            <el-table-column prop="materialCode" label="物料编号" width="180" show-overflow-tooltip />
            <el-table-column prop="materialName" label="物料名称" width="150" show-overflow-tooltip />
            <el-table-column prop="materialSpec" label="规格型号" width="180" show-overflow-tooltip />
            <el-table-column prop="materialUnit" label="单位" width="80" show-overflow-tooltip />
            <el-table-column prop="planSpec" label="计划规格" width="120" show-overflow-tooltip />
            <el-table-column prop="planMaterial" label="计划材质" width="150" show-overflow-tooltip />
            <el-table-column prop="quantity" label="数量" width="100" show-overflow-tooltip />
            <el-table-column prop="planQuantity" label="计划数量" width="100" show-overflow-tooltip />
            <el-table-column prop="unitWeight" label="单重(kg)" width="100" show-overflow-tooltip />
            <el-table-column prop="planWeight" label="计划重量(kg)" width="120" show-overflow-tooltip />
            <el-table-column prop="totalWeight" label="总重(kg)" width="100" show-overflow-tooltip />
            <el-table-column prop="salesPrice" label="单价(元)" width="120" show-overflow-tooltip />
            <el-table-column prop="salesTotalAmount" label="总金额(元)" width="120" show-overflow-tooltip />
            <el-table-column prop="deliveryOrg" label="发货单位" width="180" show-overflow-tooltip />
            <el-table-column prop="handler" label="经手人" width="100" show-overflow-tooltip />
            <el-table-column prop="warehouse" label="存放位置" width="120" show-overflow-tooltip />
            <el-table-column prop="supplierName" label="供应商名称" width="150" show-overflow-tooltip />
            <el-table-column prop="contractNo" label="合同编号" width="140" show-overflow-tooltip />
            <el-table-column prop="contractName" label="合同名称" width="200" show-overflow-tooltip />
            <el-table-column prop="memo" label="备注" width="150" show-overflow-tooltip />
            <el-table-column prop="operateTime" label="录入时间" width="140" show-overflow-tooltip />
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
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Clock, CircleCheckFilled, CircleCheck } from '@element-plus/icons-vue';
import { getPlMatInoutItemList } from '@/api/plstoreinout/matinout.js';
import { useTermStore } from '@/store/term.js';

// 状态管理
const loading = ref(false);
const materialList = ref([]);
const total = ref(0);

// 筛选条件
const termStore = useTermStore();
const currentTerm = computed(() => termStore.currentTerm);
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  materialCode: '',
  materialSpec: '',
  materialName: '',
  inOutType: '', // Empty string for "all" by default
});

// 获取物料列表
const getMaterialListData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      term: filters.term || undefined,
      materialCode: filters.materialCode || undefined,
      materialSpec: filters.materialSpec || undefined,
      materialName: filters.materialName || undefined,
      inOutType: filters.inOutType || undefined, // Send undefined for "all"
    };
    const res = await getPlMatInoutItemList(params);
    if (res.code === 200) {
      materialList.value = res.data.page.list;
      total.value = res.data.page.totalRow;
    } else {
      ElMessage.error(res.msg || '获取物料列表失败');
    }
  } catch (error) {
    console.error('获取物料列表失败', error);
    ElMessage.error('获取物料列表失败');
  } finally {
    loading.value = false;
  }
};

// 监听期间变化
watch(() => termStore.currentTerm, (newTerm) => {
  filters.term = newTerm || '';
  getMaterialListData();
}, { immediate: true });

// 分页操作
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1;
  getMaterialListData();
};

const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getMaterialListData();
};

// 重置筛选
const handleReset = () => {
  filters.materialCode = '';
  filters.materialSpec = '';
  filters.materialName = '';
  filters.inOutType = '';
  filters.pageNumber = 1;
  getMaterialListData();
  ElMessage.success('筛选条件已重置');
};

// 状态相关方法
const getStatusTagType = (docStatus) => {
  const statusMap = {
    '10': 'info', // 录入
    '20': 'warning', // 待审核
    '30': 'success', // 已入库
  };
  return statusMap[docStatus] || 'info';
};

const getStatusIcon = (docStatus) => {
  const iconMap = {
    '10': 'Clock',
    '20': 'CircleCheckFilled',
    '30': 'CircleCheck',
  };
  return iconMap[docStatus] || 'Clock';
};

const getStatusText = (docStatus) => {
  const statusMap = {
    '10': '录入',
    '20': '待审核',
    '30': '已入库',
  };
  return statusMap[docStatus] || '未知';
};

// 初始化加载
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms();
  }
  getMaterialListData();
});
</script>

<style scoped>
.material-management {
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

.material-list {
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
  .material-management {
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
  .filter-item .el-select {
    width: 100% !important;
  }
}
</style>