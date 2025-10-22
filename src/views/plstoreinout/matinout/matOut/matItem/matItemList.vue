<template>
  <CustomDialog
    :visible="dialogVisible"
    title="出库单明细列表"
    :close-on-click-modal="false"
      height="900px"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <!-- 单据信息 -->
    <div class="doc-info">
      <el-tag type="primary" size="large">单据编号：{{ inboundInfo?.docNo }}</el-tag>
      <el-tag type="warning" size="large">经手人：{{ inboundInfo?.handler }}</el-tag>
      <el-tag type="warning" size="large">库管员：{{ inboundInfo?.storekeeper }}</el-tag>
      <el-tag type="info" size="large">出库时间：{{ inboundInfo?.transactionDate }}</el-tag>
    </div>

    <!-- 搜索区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">物料名称：</span>
          <el-input
            v-model="filters.materialName"
            placeholder="请输入物料名称"
            clearable
            style="width: 200px;"
            @clear="getDetailListData"
            @keyup.enter="getDetailListData"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">规格型号：</span>
          <el-input
            v-model="filters.materialSpec"
            placeholder="请输入规格型号"
            clearable
            style="width: 200px;"
            @clear="getDetailListData"
            @keyup.enter="getDetailListData"
          />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="getDetailListData">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
          <el-button type="success" @click="showAddItemDialog = true">
            <el-icon><Plus /></el-icon> 新增明细
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 明细列表 -->
    <el-table :data="detailList" v-loading="loading" border max-height="500">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="materialCode" label="物料编号" width="120" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" width="150" show-overflow-tooltip />
      <el-table-column prop="materialSpec" label="规格型号" width="120" show-overflow-tooltip />
      <el-table-column prop="quantity" label="数量" width="100">
        <template #default="{ row }">
          <span :class="row.quantity < 0 ? 'negative-qty' : 'positive-qty'">
            {{ row.quantity }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="materialUnit" label="计量单位" width="100" />
      <el-table-column prop="unitWeight" label="单重" width="80" />
      <el-table-column prop="contractNo" label="关联合同编号" width="120" show-overflow-tooltip />
      <el-table-column prop="contractName" label="关联合同名称" width="150" show-overflow-tooltip />
      <el-table-column prop="warehouse" label="存放位置" width="100" show-overflow-tooltip />
      <el-table-column prop="supplierName" label="供应商名称" width="150" show-overflow-tooltip />
      <el-table-column prop="memo" label="备注" width="120" show-overflow-tooltip />
      <el-table-column prop="operateTime" label="录入时间" width="140" show-overflow-tooltip />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEditItemDialog(row.id)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDeleteItem(row)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->


    <!-- 新增/编辑明细弹窗 -->
    <AddItemForm
      :visible="showAddItemDialog"
      :doc-no="inboundInfo?.docNo"
      @update:visible="showAddItemDialog = $event"
      @success="handleItemSuccess"
    />
    <EditItemForm
      :visible="showEditItemDialog"
      :initial-data="selectedItem"
      @update:visible="showEditItemDialog = $event"
      @success="handleItemSuccess"
    />

    <template #footer>
         <div class="pagination-container">
      <el-pagination
        v-model:current-page="filters.pageNumber"
        v-model:page-size="filters.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getPlMatInoutItemList, deletePlMatInoutItem, getPlMatInoutItemById } from '@/api/plstoreinout/matinout.js';
import AddItemForm from './addItemForm.vue';
import EditItemForm from './editItemForm.vue';
import CustomDialog from '@/components/common/CustomDialog.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  inboundInfo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible']);

const isFullscreen = ref(false);
const loading = ref(false);
const showAddItemDialog = ref(false);
const showEditItemDialog = ref(false);
const selectedItem = ref(null);
const detailList = ref([]);
const total = ref(0);

// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  docNo: '',
  materialName: '',
  materialSpec: ''
});

// 计算属性处理弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 监听出库单信息变化，更新docNo
watch(() => props.inboundInfo, (newInfo) => {
  if (newInfo?.docNo) {
    filters.docNo = newInfo.docNo;
    if (props.visible) {
      getDetailListData();
    }
  }
}, { immediate: true });

// 监听弹窗显示状态
watch(() => props.visible, (visible) => {
  if (visible && props.inboundInfo?.docNo) {
    getDetailListData();
  }
});

// 获取明细列表
const getDetailListData = async () => {
  if (!filters.docNo) {
    detailList.value = [];
    total.value = 0;
    return;
  }

  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      docNo: filters.docNo,
      materialName: filters.materialName || undefined,
      materialSpec: filters.materialSpec || undefined
    };

    const res = await getPlMatInoutItemList(params);
    detailList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取明细列表失败', error);
    ElMessage.error('获取明细列表失败');
  } finally {
    loading.value = false;
  }
};

// 分页操作
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1;
  getDetailListData();
};

const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getDetailListData();
};

// 重置筛选
const handleReset = () => {
  filters.materialName = '';
  filters.materialSpec = '';
  filters.pageNumber = 1;
  getDetailListData();
  ElMessage.success('筛选条件已重置');
};

// 删除明细
const handleDeleteItem = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除物料"${row.materialName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deletePlMatInoutItem({ id: row.id });
    ElMessage.success('删除成功');
    getDetailListData();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除明细失败', error);
      ElMessage.error('删除明细失败');
    }
  }
};

// 打开编辑弹窗
const openEditItemDialog = async (id) => {
  try {
    const res = await getPlMatInoutItemById({ id });
    selectedItem.value = res.data.item;
    showEditItemDialog.value = true;
  } catch (error) {
    console.error('获取物料详情失败', error);
    ElMessage.error('获取物料详情失败');
  }
};

// 新增/编辑明细成功回调
const handleItemSuccess = () => {
  ElMessage.success('物料明细保存成功');
  getDetailListData();
};

// 关闭弹窗
const handleClose = () => {
  filters.materialName = '';
  filters.materialSpec = '';
  filters.pageNumber = 1;
  detailList.value = [];
  total.value = 0;
  emit('update:visible', false);
};
</script>

<style scoped>
.doc-info, .filter-card, .el-table, .pagination-container {
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.doc-info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
  min-width: 80px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.custom-dialog-body) {
  padding: 16px;
  background-color: #f5f7fa;
}

:deep(.custom-dialog-footer) {
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  background-color: #ffffff;
}

.positive-qty {
  color: #67c23a;
  font-weight: 600;
}

.negative-qty {
  color: #f56c6c;
  font-weight: 600;
}

@media (max-width: 768px) {
  .doc-info {
    flex-direction: column;
    gap: 8px;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .doc-info, .filter-card, .el-table, .pagination-container {
    padding: 12px;
  }

  :deep(.custom-dialog-body) {
    padding: 12px;
  }
}
</style>