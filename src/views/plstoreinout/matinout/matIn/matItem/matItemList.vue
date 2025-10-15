<template>
  <el-dialog v-model="dialogVisible" title="入库单明细列表" width="1200px" :close-on-click-modal="false" @closed="handleClose">
    <!-- 单据信息 -->
    <div class="doc-info">
      <el-tag type="primary" size="large">单据编号：{{ inboundInfo?.docNo }}</el-tag>
      <!-- <el-tag type="info" size="large">发货单位：{{ inboundInfo?.deliveryOrg }}</el-tag> -->
      <el-tag type="warning" size="large">经手人：{{ inboundInfo?.handler }}</el-tag>
      <el-tag type="warning" size="large">库管员：{{ inboundInfo?.storekeeper }}</el-tag>
      <el-tag type="info" size="large">入库时间：{{ inboundInfo?.transactionDate }}</el-tag>

    </div>

    <!-- 搜索区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">物料名称：</span>
          <el-input v-model="filters.materialName" placeholder="请输入物料名称" clearable style="width: 200px;"
            @clear="getDetailListData" @keyup.enter="getDetailListData" />
        </div>
        <div class="filter-item">
          <span class="filter-label">规格型号：</span>
          <el-input v-model="filters.materialSpec" placeholder="请输入规格型号" clearable style="width: 200px;"
            @clear="getDetailListData" @keyup.enter="getDetailListData" />
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
      <el-table-column prop="planSpec" label="计划规格" width="120" show-overflow-tooltip />
      <el-table-column prop="material" label="材质" width="120" show-overflow-tooltip />
      <el-table-column prop="planMaterial" label="计划材质" width="150" show-overflow-tooltip />
      <el-table-column prop="quantity" label="数量" width="100">
        <template #default="{ row }">
          <span :class="row.quantity < 0 ? 'negative-qty' : 'positive-qty'">
            {{ row.quantity }}
          </span>
        </template>
      </el-table-column>
            <el-table-column prop="planQuantity" label="计划数量" width="100" />

            <el-table-column prop="materialUnit" label="计量单位" width="100" />

      <el-table-column prop="unitWeight" label="单重" width="80" />
      <el-table-column prop="planWeight" label="计划重量" width="100" />
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

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>

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
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getPlMatInoutItemList, deletePlMatInoutItem,getPlMatInoutItemById } from '@/api/plstoreinout/matinout.js';
import AddItemForm from './addItemForm.vue';
import EditItemForm from './editItemForm.vue';

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

// 计算属性处理弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 状态管理
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

// 监听入库单信息变化，更新docNo
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
  if (!props.inboundInfo?.docNo) {
    return;
  }
  
  loading.value = true;
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      docNo: props.inboundInfo.docNo,
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

// // 打开编辑明细弹窗
// const openEditItemDialog = (row) => {
//   selectedItem.value = row;
//   showEditItemDialog.value = true;
// };

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
  getDetailListData();
};

// 关闭弹窗
const handleClose = () => {
  // 重置筛选条件
  filters.materialName = '';
  filters.materialSpec = '';
  filters.pageNumber = 1;
  emit('update:visible', false);
};

// 状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    '正常': 'success',
    '异常': 'danger',
    '待检': 'warning'
  };
  return statusMap[status] || 'info';
};
</script>

<style scoped>
.doc-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.filter-card {
  margin-bottom: 16px;
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
  font-size: 13px;
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
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.positive-qty {
  color: #67c23a;
  font-weight: bold;
}

.negative-qty {
  color: #f56c6c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }
  
  .doc-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>