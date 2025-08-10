<template>
  <div class="plinoutstore-management">
    <div class="action-bar">
      <el-input v-model="queryParams.materialno" placeholder="物料编号" style="width: 180px; margin-right: 10px;" 
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      <el-input v-model="queryParams.materialname" placeholder="物料名称" style="width: 180px; margin-right: 10px;"
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      <el-input v-model="queryParams.orderno" placeholder="单据号" style="width: 180px; margin-right: 10px;"
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      
      <el-select v-model="queryParams.isin" placeholder="出入库类型" style="width: 150px; margin-right: 10px;">
        <el-option label="全部" value="" />
        <el-option label="入库" :value="1" />
        <el-option label="出库" :value="2" />
      </el-select>
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="flex: 0 0 250px;margin-right: 10px;"
      />
      
      <el-button type="primary" @click="getPlinoutstoreListpage">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
      
      <!-- 批量删除按钮 -->
      <el-button 
        type="danger" 
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
        style="margin-left: 10px;"
      >
        批量删除
      </el-button>
      
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增记录</el-button>
    </div>
    
    <el-table 
      :data="plinoutstoreList" 
      border 
      v-loading="loading" 
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="orderno" label="收发单号" width="150" />
      <el-table-column prop="contractNo" label="合同号" width="150" />
      <el-table-column prop="contractName" label="工程名称" width="180" show-overflow-tooltip />
      <el-table-column prop="materialno" label="物料编号" width="120" />
      <el-table-column prop="materialname" label="物料名称" width="150" />
      <el-table-column prop="spec" label="规格型号" width="120" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="quantity" label="数量" width="100" align="right">
        <template #default="{row}">{{ row.quantity.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="right">
        <template #default="{row}">{{ row.price.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="totalmoney" label="金额" width="120" align="right">
        <template #default="{row}">{{ row.totalmoney.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="store" label="仓库" width="120" />
      <el-table-column prop="isin" label="类型" width="80">
        <template #default="{row}">{{ row.isin === 1 ? '出库' : '入库' }}</template>
      </el-table-column>
      <el-table-column prop="receivedate" label="收发日期" width="120" />

      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="1000px"
      @closed="resetForm"
    >
      <InStoreForm
        ref="formRef"
        :form-data="form"
        :edit="isEdit"
        :show-save-as-draft="true"
        @submit="submitForm"
        @cancel="dialogVisible = false"
        @save-draft="saveDraft"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import InStoreForm from './components/InStoreForm.vue';
import { 
  getPlinoutstoreList, 
  getPlinoutstoreByOrderno, 
  createPlinoutstore, 
  updatePlinoutstore, 
  deletePlinoutstore,
  batchDeletePlinoutstore
} from '@/api/plmanage/plinoutstore';

// 查询参数
const queryParams = reactive({
  materialno: '',
  materialname: '',
  orderno: '',
  isin: '',
  pageNumber: 1,
  pageSize: 10
});

const isEdit = ref(false);
const dateRange = ref([]);
const plinoutstoreList = ref([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref([]);
const dialogVisible = ref(false);
const dialogType = ref('add');
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增入库记录' : '编辑入库记录');
const formRef = ref(null);
const form = reactive({
  orderno: '',
  receivedate: '',
  deliverunit: '',
  store: '',
  flag: '',
  handleperson: '',
  contractNo: '',
  scheduleCode: '',
  woNo: '',
  materials: []
});

// 处理表格多选
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  
  ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await batchDeletePlinoutstore(selectedIds.value);
      ElMessage.success('批量删除成功');
      selectedIds.value = [];
      getPlinoutstoreListpage();
    } catch (error) {
      console.error('批量删除失败', error);
      const errorMsg = error.response?.data?.message || '批量删除失败';
      ElMessage.error(errorMsg);
    }
  }).catch(() => {});
};

// 获取出入库记录列表
const getPlinoutstoreListpage = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
      startDate: dateRange.value?.[0] || '',
      endDate: dateRange.value?.[1] || ''
    };
    
    const res = await getPlinoutstoreList(params);
    plinoutstoreList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取出入库记录失败', error);
    ElMessage.error('获取出入库记录失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getPlinoutstoreListpage();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getPlinoutstoreListpage();
};

// 刷新
const handleRefresh = () => {
  queryParams.materialno = '';
  queryParams.materialname = '';
  queryParams.orderno = '';
  queryParams.isin = '';
  dateRange.value = [];
  queryParams.pageNumber = 1;
  selectedIds.value = [];
  getPlinoutstoreListpage();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    orderno: '',
    receivedate: '',
    deliverunit: '',
    store: '',
    flag: '',
    handleperson: '',
    contractNo: '',
    scheduleCode: '',
    woNo: '',
    materials: []
  });
};

// 新增记录
const handleAdd = () => {
  isEdit.value = false;
  dialogType.value = 'add';
  resetForm();
  form.receivedate = new Date().toISOString().split('T')[0];
  dialogVisible.value = true;
};

// 编辑记录
const handleEdit = async (row) => {
  dialogType.value = 'edit';
  isEdit.value = true;
  try {
    const res = await getPlinoutstoreByOrderno({ orderNo: row.orderno });
    const { storeInfo, plinoutstore } = res.data;
    Object.assign(form, {
      ...storeInfo,
      orderno: row.orderno,
      contractNo: storeInfo.contractNo || '',

      materials: plinoutstore.map(item => ({
        id: item.id,
        scheduleCode: item.scheduleCode || '',
        woNo: item.woNo || '',
        ipoNo:item.ipoNo,
        materialno: item.materialno,
        materialname: item.materialname,
        spec: item.spec || '',
        unit: item.unit || '',
        quantity: item.quantity || 0,
        price: item.price || 0,
        totalmoney: item.totalmoney || 0
      }))
    });
    dialogVisible.value = true;
  } catch (error) {
    console.error('获取记录详情失败', error);
    ElMessage.error('获取记录详情失败');
  }
};

// 删除记录
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除记录"${row.orderno}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePlinoutstore({ id: row.id });
      ElMessage.success('删除成功');
      getPlinoutstoreListpage();
    } catch (error) {
      console.error('删除记录失败', error);
      ElMessage.error('删除记录失败');
    }
  }).catch(() => {});
};

// 提交表单
const submitForm = async (formData) => {
  try {
    // for (const material of formData.materials) {
    //   const saveData = {
    //     ...formData,
    //     id: material.id,
    //     materialno: material.materialno,
    //     materialname: material.materialname,
    //     spec: material.spec,
    //     unit: material.unit,
    //     quantity: material.quantity,
    //     price: material.price,
    //     totalmoney: material.totalmoney
    //   };
    //   delete saveData.materials;
    //   if (dialogType.value === 'edit' && material.id) {
    //     await updatePlinoutstore(saveData);
    //   } else {
    //     await createPlinoutstore(saveData);
    //   }
    // }
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功');
    dialogVisible.value = false;
    getPlinoutstoreListpage();
  } catch (error) {
    console.error('保存记录失败', error);
    ElMessage.error('保存记录失败');
  }
};

// 保存草稿
const saveDraft = (formData) => {
  // 这里可以实现保存草稿的逻辑，例如调用 API 或存储到本地
  console.log('保存草稿:', formData);
  ElMessage.success('草稿已保存');
  dialogVisible.value = false;
};

// 页面初始化
onMounted(() => {
  getPlinoutstoreListpage();
});
</script>

<style scoped>
.plinoutstore-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>