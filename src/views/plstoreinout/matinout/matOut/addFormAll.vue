<template>
  <CustomDialog
    :visible="dialogVisible"
    title="新增入库单"
    :close-on-click-modal="false"
    :header-height="60"
    height="900px"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="add-form">
      <!-- 基本信息 -->
      <div class="form-row">
        <el-form-item label="单据编号" prop="docNo">
          <el-input v-model="form.docNo" placeholder="请输入单据编号" readonly />
        </el-form-item>
        <el-form-item label="入库日期" prop="transactionDate">
          <el-date-picker
            v-model="form.transactionDate"
            type="date"
            placeholder="请选择入库日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </div>

      <!-- 人员信息 -->
      <div class="form-row">
        <el-form-item label="经手人" prop="handler">
          <el-input v-model="form.handler" placeholder="请输入经手人" />
        </el-form-item>
        <el-form-item label="库管员" prop="storekeeper">
          <el-input v-model="form.storekeeper" placeholder="请输入库管员" />
        </el-form-item>
      </div>

      <el-form-item label="单据备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入单据备注"
        />
      </el-form-item>
    </el-form>

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
      <!-- <el-table-column prop="planSpec" label="计划规格" width="120" show-overflow-tooltip /> -->
      <el-table-column prop="material" label="材质" width="120" show-overflow-tooltip />
      <!-- <el-table-column prop="planMaterial" label="计划材质" width="150" show-overflow-tooltip /> -->
      <el-table-column prop="quantity" label="出库数量" width="100">
        <template #default="{ row }">
          <span :class="row.quantity < 0 ? 'negative-qty' : 'positive-qty'">
            {{ row.quantity }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="planQuantity" label="计划数量" width="100" /> -->
      <el-table-column prop="materialUnit" label="计量单位" width="100" />
      <el-table-column prop="unitWeight" label="单重" width="80" />
      <!-- <el-table-column prop="planWeight" label="计划重量" width="100" /> -->
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

    <!-- 新增/编辑明细弹窗 -->
    <AddItemForm
      :visible="showAddItemDialog"
      :doc-no="form.docNo"
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
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="loading">保存</el-button>
      </div>
    </template>

    <supplierSelector
      v-model="showSupplierSelector"
      @select="selectSupplier"
    />
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { createPlMatInout, getPlMatInoutItemList, deletePlMatInoutItem, getPlMatInoutItemById } from '@/api/plstoreinout/matinout.js';
import { useTermStore } from '@/store/term.js';
import { useUserStore } from '@/store/user.js';
import supplierSelector from '../../components/supplierSelector.vue';
import CustomDialog from '@/components/common/CustomDialog.vue';
import AddItemForm from './matItem/addItemForm.vue';
import EditItemForm from './matItem/editItemForm.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  newCode: {
    type: String,
    default: ''
  }
});

const showSupplierSelector = ref(false);
const isFullscreen = ref(false);
const showAddItemDialog = ref(false);
const showEditItemDialog = ref(false);
const selectedItem = ref(null);
const detailList = ref([]);
const total = ref(0);
const loading = ref(false);

// 筛选条件
const filters = reactive({
  pageNumber: 1,
  pageSize: 10,
  docNo: '',
  materialName: '',
  materialSpec: ''
});

const selectSupplier = (supplier) => {
  form.deliveryOrg = supplier.descr;
  showSupplierSelector.value = false;
};

const emit = defineEmits(['update:visible', 'success']);

const termStore = useTermStore();
const userStore = useUserStore();
const currentTerm = computed(() => termStore.currentTerm);

const formRef = ref();

// 计算属性处理弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 表单数据
const form = reactive({
  docNo: '',
  inOutType: 2, // 1=入库，2=出库
  transactionDate: new Date().toISOString().split('T')[0], // 默认当前日期
  deliveryOrg: '',
  receiveOrg: '', // 保留但不展示
  handler: '',
  storekeeper: userStore.realName || '', // 默认当前用户
  manager: '', // 保留但不展示
  status: 10, // 固定为录入状态
  requester: '',
  hasInvoice: 0,
  term: currentTerm.value || null,
  remark: '',
  isDeleted: 0 // 默认为0
});

// 表单验证规则
const rules = {
  docNo: [
    { required: true, message: '请输入单据编号', trigger: 'blur' },
    { max: 40, message: '单据编号不能超过40个字符', trigger: 'blur' }
  ],
  transactionDate: [
    { required: true, message: '请选择单据日期', trigger: 'change' }
  ],
  deliveryOrg: [
    { max: 200, message: '发货单位不能超过200个字符', trigger: 'blur' }
  ],
  receiveOrg: [
    { max: 200, message: '收货单位不能超过200个字符', trigger: 'blur' }
  ],
  handler: [
    { required: true, message: '请输入经手人', trigger: 'blur' },
    { max: 50, message: '经手人不能超过50个字符', trigger: 'blur' }
  ],
  storekeeper: [
    { required: true, message: '请输入库管员', trigger: 'blur' },
    { max: 50, message: '库管员不能超过50个字符', trigger: 'blur' }
  ],
  manager: [
    { max: 50, message: '负责人不能超过50个字符', trigger: 'blur' }
  ],
  status: [
    { max: 50, message: '状态不能超过50个字符', trigger: 'blur' }
  ],
  requester: [
    { max: 50, message: '申请人不能超过50个字符', trigger: 'blur' }
  ],
  remark: [
    { max: 500, message: '备注不能超过500个字符', trigger: 'blur' }
  ]
};

// 监听期间变化
watch(() => termStore.currentTerm, (newTerm) => {
  form.term = newTerm || null;
});

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    form.docNo = props.newCode;
    filters.docNo = form.docNo; // 初始化时同步 docNo
    getDetailListData(); // 尝试加载明细
  }
});

// 监听 form.docNo 变化，同步到 filters.docNo
watch(() => form.docNo, (newVal) => {
  filters.docNo = newVal;
  getDetailListData(); // 每次 docNo 变化时刷新明细
});

// 监听 dialogVisible 变化以替代 @closed 事件
watch(() => dialogVisible.value, (newVal) => {
  if (!newVal) {
    resetForm();
    filters.docNo = '';
    detailList.value = [];
    total.value = 0;
  }
});

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(form, {
    docNo: '',
    inOutType: 2,
    transactionDate: '',
    deliveryOrg: '',
    receiveOrg: '',
    handler: '',
    storekeeper: userStore.realName || '',
    manager: '',
    status: 10,
    requester: '',
    hasInvoice: 0,
    term: currentTerm.value || null,
    remark: '',
    isDeleted: 0
  });
};

// 保存表单
const handleSave = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    const submitData = {
      ...form,
      operateTime: new Date().toISOString()
    };

    await createPlMatInout(submitData);
    ElMessage.success('入库单保存成功');
    emit('update:visible', false)
    emit('success');
  } catch (error) {
    console.error('保存失败', error);
    if (error.message && error.message !== 'Validation failed') {
      ElMessage.error('保存失败：' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

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
const handleItemSuccess = async () => {
  // 假设 AddItemForm 和 EditItemForm 的 success 事件已调用保存接口
  ElMessage.success('物料明细保存成功');
  await getDetailListData(); // 刷新明细列表
};

// 关闭弹窗
const handleClose = () => {
  resetForm();
  emit('update:visible', false);
};
</script>

<style scoped>
.add-form, .filter-card, .el-table, .pagination-container {
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .add-form, .filter-card, .el-table, .pagination-container {
    padding: 12px;
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

  :deep(.custom-dialog-body) {
    padding: 12px;
  }
}
</style>