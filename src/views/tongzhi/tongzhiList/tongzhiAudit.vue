<template>
  <div class="notice-management">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 筛选项：通知编号 -->
        <div class="filter-item">
          <span class="filter-label">通知编号：</span>
          <el-input v-model="filters.noticeid" placeholder="请输入通知编号" clearable style="width: 200px;"
            @clear="getNoticeListData" @keyup.enter="getNoticeListData" />
        </div>
        <!-- 筛选项：通知名称 -->
        <div class="filter-item">
          <span class="filter-label">通知名称：</span>
          <el-input v-model="filters.noticename" placeholder="请输入通知名称" clearable style="width: 200px;"
            @clear="getNoticeListData" @keyup.enter="getNoticeListData" />
        </div>
      </div>
      <!-- 筛选操作 -->
      <div class="filter-actions">
        <el-button type="primary" @click="getNoticeListData">
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

    <!-- 主要内容区：通知列表 -->
    <div class="main-content">
      <div class="contract-list">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>通知审核列表</span>
            </div>
          </template>
          
          <el-table :data="noticeList" :highlight-current-row="true" v-loading="loading" height="600" border>
            <el-table-column type="index" label="序号" width="60" align="center" />
            
            <!-- 状态列 -->
            <el-table-column label="审核状态" width="130" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.noticestatus)" size="small" effect="light">
                  <el-icon class="mr-1">
                    <component :is="getStatusIcon(row.noticestatus)" />
                  </el-icon>
                  {{ getStatusText(row.noticestatus) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="noticeid" label="通知编号" width="160" show-overflow-tooltip sortable />
            <el-table-column prop="noticename" label="通知名称" width="200" show-overflow-tooltip />
            <el-table-column prop="contractNo" label="关联合同号" width="140" show-overflow-tooltip />
            <el-table-column prop="contractName" label="合同名称" width="200" show-overflow-tooltip />
            <el-table-column prop="customerName" label="客户名称" width="180" show-overflow-tooltip />
            <el-table-column prop="salesmanName" label="业务员" width="100" show-overflow-tooltip />

            <!-- 操作列 -->
            <el-table-column label="操作" width="380" fixed="right">
              <template #default="{ row }">
                <!-- 原有操作：保留 -->
                <el-button type="primary" link size="small" @click="openContractInfoDialog(row)">
                  查看通知列表
                </el-button>
                <el-button type="warning" link size="small" @click="openMaterialPlan(row)">
                  查看备料计划
                </el-button>

                <!-- 审核操作：仅在状态为30（待审核）时显示 -->
                <template v-if="row.noticestatus === 30">
                  <el-divider direction="vertical" />
                  <el-button type="success" size="small" @click="handleAudit(row, 31)">
                    审核通过
                  </el-button>
                  <el-button type="danger" size="small" @click="handleAudit(row, 32)">
                    审核驳回
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

    <!-- 弹窗组件引用 (保持原有逻辑) -->
    <tongzhiDetail :visible="showContractInfoDialog" :initial-data="selectedContract" @update:visible="showContractInfoDialog = $event" :noticeid="selectedNoticeid" />
    <MaterialPlan :visible="showMaterialPlanDialog" :contract-no="selectedContractNo" @update:visible="showMaterialPlanDialog = $event" />
    <!-- <MaterialList :visible="showMaterialListDialog" :contract-no="selectedContractNo" :contract-name="selectedContractName" @update:visible="showMaterialListDialog = $event" /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Timer, Check, Close, CircleCheckFilled } from '@element-plus/icons-vue';
// 引入接口
import { getNoticeGroup, updateNoticeStatusByNoticeId } from '@/api/tongzhi/tongzhi';
import { getContractByNo } from '@/api/contract/bascontract.js'; // 假设用于获取合同详情

// 引入子组件
import tongzhiDetail from './tongzhiDetail.vue';
import MaterialPlan from '../components/materialPlan.vue';
// import MaterialList from './contractMaterial.vue';

// 状态管理
const loading = ref(false);
const noticeList = ref([]);
const total = ref(0);

// 弹窗相关状态
const showContractInfoDialog = ref(false);
const selectedContract = ref(null);
const showMaterialPlanDialog = ref(false);
const selectedContractNo = ref('');
const selectedContractName = ref('');
// const showMaterialListDialog = ref(false);
const selectedNoticeid = ref('');
// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 20,
  noticeid: '',   // 通知编号
  noticename: '', // 通知名称
});

// 获取通知列表数据
const getNoticeListData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      noticeid: filters.noticeid || undefined,
      noticename: filters.noticename || undefined
    };
    
    const res = await getNoticeGroup(params);
    if (res.code === 200 && res.success) {
      noticeList.value = res.data.page.list;
      total.value = res.data.page.totalRow;
    } else {
      ElMessage.warning(res.msg || '查询列表失败');
    }
  } catch (error) {
    console.error('获取通知列表失败', error);
    ElMessage.error('获取通知列表异常');
  } finally {
    loading.value = false;
  }
};

// 审核操作处理
const handleAudit = (row, status) => {
  const actionText = status === 31 ? '通过' : '驳回';
  const type = status === 31 ? 'success' : 'warning';

  ElMessageBox.confirm(
    `确定要${actionText}编号为【${row.noticeid}】的通知吗？`,
    '审核确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type,
    }
  ).then(async () => {
    try {
      const res = await updateNoticeStatusByNoticeId({
        noticeid: row.noticeid,
        status: status
      });
      
      if (res && (res.success || res.code === 200)) { // 兼容常见返回格式
        ElMessage.success(`审核${actionText}成功`);
        getNoticeListData(); // 刷新列表
      } else {
        ElMessage.error(res.msg || `审核${actionText}失败`);
      }
    } catch (error) {
      console.error('审核接口调用异常', error);
      ElMessage.error('操作异常');
    }
  }).catch(() => {
    // 取消操作
  });
};

// 保留的原有操作：打开制定通知（查看合同详情）
const openContractInfoDialog = async (row) => {
  if (!row.contractNo) return;
  try {
    const res = await getContractByNo({ contractNo:row.contractNo });
    selectedContract.value = res.data.contractInfo;
    selectedNoticeid.value = row.noticeid;
    showContractInfoDialog.value = true;
  } catch (error) {
    console.error('获取合同详情失败', error);
    ElMessage.error('获取合同详情失败');
  }
};

// 保留的原有操作：查看备料计划
const openMaterialPlan = (row) => { 
  selectedContractNo.value = row.contractNo; // 注意：根据新JSON结构，字段名为 contractNo
  selectedContractName.value = row.contractName;
  showMaterialPlanDialog.value = true;
};

// 状态样式映射
const getStatusTagType = (status) => {
  const map = {
    30: 'warning', // 待审核
    31: 'success', // 审核通过
    32: 'danger'   // 审核不通过
  };
  // 其他状态默认显示为 success (根据需求描述)
  return map[status] || 'success';
};

const getStatusIcon = (status) => {
  const map = {
    30: 'Timer',
    31: 'Check',
    32: 'Close'
  };
  return map[status] || 'CircleCheckFilled';
};

const getStatusText = (status) => {
  const map = {
    30: '待审核',
    31: '审核通过',
    32: '审核驳回'
  };
  return map[status] || '审核通过';
};

// 分页操作
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1; // 切换页大小重置为第一页
  getNoticeListData();
};

const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getNoticeListData();
};

// 重置筛选
const handleReset = () => {
  filters.noticeid = '';
  filters.noticename = '';
  filters.pageNumber = 1;
  getNoticeListData();
  ElMessage.success('筛选条件已重置');
};

// 初始化加载
onMounted(() => {
  getNoticeListData();
});
</script>

<style scoped>
/* 样式保持原文件一致，仅修改最外层类名以匹配语境 */
.notice-management {
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

.mr-1 {
  margin-right: 4px;
}

@media (max-width: 768px) {
  .notice-management {
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