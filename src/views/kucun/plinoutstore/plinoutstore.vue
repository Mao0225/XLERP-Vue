<template>
  <div class="plinoutstore-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input v-model="queryParams.storeNo" placeholder="仓库编号" style="width: 180px; margin-right: 10px;" 
                clearable @clear="getPlinoutstorePage" @keyup.enter="getPlinoutstorePage" />
      <el-input v-model="queryParams.storeName" placeholder="仓库名称" style="width: 180px; margin-right: 10px;"
                clearable @clear="getPlinoutstorePage" @keyup.enter="getPlinoutstorePage" />
      <el-input v-model="queryParams.type" placeholder="类型" style="width: 180px; margin-right: 10px;"
                clearable @clear="getPlinoutstorePage" @keyup.enter="getPlinoutstorePage" />
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="flex: 0 0 250px;margin-right: 10px;"
      />
      
      <el-button type="primary" @click="getPlinoutstorePage">搜索</el-button>
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
    
    <!-- 数据表格 -->
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
      <el-table-column prop="deliverunit" label="交付单位" width="150" />
      <el-table-column prop="store" label="仓库" width="120" />
      <el-table-column prop="handleperson" label="经办人" width="120" />
      <el-table-column prop="receivedate" label="收发日期" width="120" />
      <el-table-column prop="term" label="期限" width="100" />
      
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button type="info" size="small" @click="handleCheck(row)">查看详细</el-button>

        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
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
    
    <!-- 编辑/新增对话框 -->
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


    <el-dialog
      :title="dialogTitle"
      v-model="checkFormVisible"
      width="1000px"
      @closed="resetForm"
    >
      <chakanForm
        ref="formRef"
        :form-data="form"
        @cancel="checkFormVisible = false"
      />


    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { checkTagEmits, ElMessage, ElMessageBox } from 'element-plus';
import InStoreForm from './components/InStoreForm.vue';
import chakanForm from './components/chakanForm.vue';
import { 
  getPlinoutstoreList, 
  getPlinoutstoreByOrderno, 
  deletePlinoutstoreByOrderNo,
  batchDeletePlinoutstore
} from '@/api/plmanage/plinoutstore';

// 查询参数，匹配后端字段
const queryParams = reactive({
  storeNo: '',
  storeName: '',
  type: '',
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
  handleperson: '',
  contractNo: '',
  term: ''
});

// 处理表格多选
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.orderno); // 使用orderno作为唯一标识
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
      getPlinoutstorePage();
    } catch (error) {
      console.error('批量删除失败', error);
      const errorMsg = error.response?.data?.message || '批量删除失败';
      ElMessage.error(errorMsg);
    }
  }).catch(() => {});
};

// 获取出入库记录列表
const getPlinoutstorePage = async () => {
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
  getPlinoutstorePage();
};

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getPlinoutstorePage();
};

// 刷新
const handleRefresh = () => {
  queryParams.storeNo = '';
  queryParams.storeName = '';
  queryParams.type = '';
  dateRange.value = [];
  queryParams.pageNumber = 1;
  selectedIds.value = [];
  getPlinoutstorePage();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    orderno: '',
    receivedate: '',
    deliverunit: '',
    store: '',
    handleperson: '',
    contractNo: '',
    term: ''
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
/**
 * 处理编辑操作，根据orderno获取记录详情并填充表单
 * @param {Object} row 表格行数据，包含orderno
 */
const handleEdit = async (row) => {
  dialogType.value = 'edit'; // 设置对话框为编辑模式
  isEdit.value = true; // 标记为编辑状态
  try {
    // 调用API获取记录详情
    const res = await getPlinoutstoreByOrderno({ orderNo: row.orderno });
    const { storeInfo, itemList } = res.data; // 解构出storeInfo和itemList
    console.log('获取的信息', res); // 调试：打印返回数据

    // 将API返回的数据填充到表单，添加materials字段
    Object.assign(form, {
      flag:storeInfo.flag,
      orderno: storeInfo.orderno,
      receivedate: storeInfo.receivedate || '',
      deliverunit: storeInfo.deliverunit || '',
      store: storeInfo.store || '',
      handleperson: storeInfo.handleperson || '',
      contractNo: storeInfo.contractNo || '',
      term: storeInfo.term || '',
      materials: itemList || [] // 将itemList赋值给materials，默认为空数组
    });
    
    dialogVisible.value = true; // 显示编辑对话框
  } catch (error) {
    console.error('获取记录详情失败', error); // 打印错误日志
    ElMessage.error('获取记录详情失败'); // 显示错误提示
  }
};

const checkFormVisible = ref(false);

const handleCheck  = async (row) => {
  try {
    // 调用API获取记录详情
    const res = await getPlinoutstoreByOrderno({ orderNo: row.orderno });
    const { storeInfo, itemList } = res.data; // 解构出storeInfo和itemList
    console.log('获取的信息', res); // 调试：打印返回数据

    // 将API返回的数据填充到表单，添加materials字段
    Object.assign(form, {
      flag:storeInfo.flag,
      orderno: storeInfo.orderno,
      receivedate: storeInfo.receivedate || '',
      deliverunit: storeInfo.deliverunit || '',
      store: storeInfo.store || '',
      handleperson: storeInfo.handleperson || '',
      contractNo: storeInfo.contractNo || '',
      term: storeInfo.term || '',
      materials: itemList || [] // 将itemList赋值给materials，默认为空数组
    });
    
    checkFormVisible.value = true; // 显示查看详细弹窗
  } catch (error) {
    console.error('获取记录详情失败', error); // 打印错误日志
    ElMessage.error('获取记录详情失败'); // 显示错误提示
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
      await deletePlinoutstoreByOrderNo({ orderNo: row.orderno });
      ElMessage.success('删除成功');
      getPlinoutstorePage();
    } catch (error) {
      console.error('删除记录失败', error);
      ElMessage.error('删除记录失败');
    }
  }).catch(() => {});
};

// 提交表单
const submitForm = async (formData) => {
  try {
    // 假设存在保存API，需要根据实际后端接口调整
    // if (dialogType.value === 'edit') {
    //   await updatePlinoutstore(formData);
    // } else {
    //   await createPlinoutstore(formData);
    // }
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功');
    dialogVisible.value = false;
    getPlinoutstorePage();
  } catch (error) {
    console.error('保存记录失败', error);
    ElMessage.error('保存记录失败');
  }
};

// 保存草稿
const saveDraft = (formData) => {
  console.log('保存草稿:', formData);
  ElMessage.success('草稿已保存');
  dialogVisible.value = false;
};

// 页面初始化
onMounted(() => {
  getPlinoutstorePage();
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
