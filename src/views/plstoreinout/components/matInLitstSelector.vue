<template>
  <el-dialog
    title="选择物料"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="filters.materialCode"
            placeholder="请输入物料编号"
            clearable
            @clear="getMaterialListData"
            @keyup.enter="getMaterialListData"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="filters.materialSpec"
            placeholder="请输入物料型号"
            clearable
            @clear="getMaterialListData"
            @keyup.enter="getMaterialListData"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="filters.materialName"
            placeholder="请输入物料名称"
            clearable
            @clear="getMaterialListData"
            @keyup.enter="getMaterialListData"
          />
        </el-col>
        <!-- <el-col :span="6">
          <el-select
            v-model="filters.inOutType"
            placeholder="请选择出入库类型"
            clearable
            @change="getMaterialListData"
          >
            <el-option label="全部" value="" />
            <el-option label="入库" value="1" />
            <el-option label="出库" value="2" />
          </el-select>
        </el-col> -->
        <el-col :span="6">
          <el-button type="primary" @click="getMaterialListData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="materialList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="80" />
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
      <!-- <el-table-column prop="planSpec" label="计划规格" width="120" show-overflow-tooltip /> -->
      <!-- <el-table-column prop="planMaterial" label="计划材质" width="150" show-overflow-tooltip /> -->
      <el-table-column prop="quantity" label="数量" width="100" show-overflow-tooltip />
      <!-- <el-table-column prop="planQuantity" label="计划数量" width="100" show-overflow-tooltip /> -->
      <el-table-column prop="unitWeight" label="单重(kg)" width="100" show-overflow-tooltip />
      <el-table-column prop="planWeight" label="计划重量(kg)" width="120" show-overflow-tooltip />
      <el-table-column prop="totalWeight" label="总重(kg)" width="100" show-overflow-tooltip />
      <el-table-column prop="salesPrice" label="单价(元)" width="120" show-overflow-tooltip>
        <template #default="{ row }">
          ¥{{ row.salesPrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="salesTotalAmount" label="总金额(元)" width="120" show-overflow-tooltip>
        <template #default="{ row }">
          ¥{{ row.salesTotalAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="deliveryOrg" label="发货单位" width="180" show-overflow-tooltip />
      <el-table-column prop="handler" label="经手人" width="100" show-overflow-tooltip />
      <el-table-column prop="warehouse" label="存放位置" width="120" show-overflow-tooltip />
      <el-table-column prop="supplierName" label="供应商名称" width="150" show-overflow-tooltip />
      <el-table-column prop="contractNo" label="合同编号" width="140" show-overflow-tooltip />
      <el-table-column prop="contractName" label="合同名称" width="200" show-overflow-tooltip />
      <el-table-column prop="memo" label="备注" width="150" show-overflow-tooltip />
      <el-table-column prop="operateTime" label="录入时间" width="140" show-overflow-tooltip />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectMaterial(row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="filters.pageNumber"
        v-model:page-size="filters.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Clock, CircleCheckFilled, CircleCheck } from '@element-plus/icons-vue';
import { getPlMatInoutItemList } from '@/api/plstoreinout/matinout.js';
import { useTermStore } from '@/store/term.js';

// Define props for dialog visibility
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// Define emits for updating dialog state and notifying parent of selection
const emit = defineEmits(['update:modelValue', 'select']);

// Control dialog visibility
const visible = ref(false);

// Sync dialog visibility with parent modelValue and fetch data when opened
watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val) {
    getMaterialListData();
  }
});

// Update parent when dialog visibility changes
watch(visible, (val) => {
  emit('update:modelValue', val);
});

// Filter conditions
const termStore = useTermStore();
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: termStore.currentTerm || '',
  materialCode: '',
  materialSpec: '',
  materialName: '',
  inOutType: 1
});

// Material list data
const materialList = ref([]);
const total = ref(0);
const loading = ref(false);

// Fetch material list
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
      inOutType: filters.inOutType || undefined,
      status:30//已入库的
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

// Handle search
const handleSearch = () => {
  filters.pageNumber = 1;
  getMaterialListData();
};

// Handle reset
const handleReset = () => {
  filters.materialCode = '';
  filters.materialSpec = '';
  filters.materialName = '';
  filters.inOutType = 1;
  filters.pageNumber = 1;
  getMaterialListData();
  ElMessage.success('筛选条件已重置');
};

// Handle pagination size change
const handleSizeChange = (size) => {
  filters.pageSize = size;
  filters.pageNumber = 1;
  getMaterialListData();
};

// Handle pagination current page change
const handleCurrentChange = (page) => {
  filters.pageNumber = page;
  getMaterialListData();
};

// Handle row click
const handleRowClick = (row) => {
  selectMaterial(row);
};

// Select material
const selectMaterial = (material) => {
  emit('select', material);
  visible.value = false;
};

// Handle dialog close
const handleClose = () => {
  filters.materialCode = '';
  filters.materialSpec = '';
  filters.materialName = '';
  filters.inOutType = 1;
  filters.pageNumber = 1;
};

// Watch term changes
watch(() => termStore.currentTerm, (newTerm) => {
  filters.term = newTerm || '';
  if (visible.value) {
    getMaterialListData();
  }
});

// Initialize terms
onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms();
  }
});

// Status-related methods
const getStatusTagType = (docStatus) => {
  const statusMap = {
    '10': 'info',
    '20': 'warning',
    '30': 'success'
  };
  return statusMap[docStatus] || 'info';
};

const getStatusIcon = (docStatus) => {
  const iconMap = {
    '10': 'Clock',
    '20': 'CircleCheckFilled',
    '30': 'CircleCheck'
  };
  return iconMap[docStatus] || 'Clock';
};

const getStatusText = (docStatus) => {
  const statusMap = {
    '10': '录入',
    '20': '待审核',
    '30': '已入库'
  };
  return statusMap[docStatus] || '未知';
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>