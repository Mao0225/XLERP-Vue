<template>
  <el-dialog v-model="dialogVisible" title="物料列表" width="80%" :close-on-click-modal="false">
    <!-- 合同信息 -->
    <el-card shadow="never" class="contract-info-card">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="合同号">
            <el-input v-model="contractInfo.no" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称">
            <el-input v-model="contractInfo.name" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="国网经法合同号">
            <el-input v-model="contractInfo.ecpno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="器材合同号">
            <el-input v-model="contractInfo.equipno" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <!-- 搜索区域 -->
   <el-form :model="materialSearchForm" inline class="search-form">
  <el-form-item label="物料名称">
    <el-input v-model="materialSearchForm.keyword" placeholder="请输入物料名称" clearable @clear="loadMaterialList" @keyup.enter="loadMaterialList" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="loadMaterialList">搜索</el-button>
    <el-button type="warning" @click="importProduct" :disabled="isConfirmed">导入产品</el-button>
    <el-button type="primary" @click="downloadExsl">下载模板</el-button>
    <el-button type="primary" @click="addProduct" :disabled="isConfirmed">添加产品</el-button>
  </el-form-item>
  <el-form-item class="summary-info">
    <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
    <span style="margin-left: 20px;">总重量: {{ totalWeight.toFixed(2) }}kg</span>
  </el-form-item>
</el-form>

    <!-- 物料列表 -->
    <el-table
      :data="materialList"
      border
      size="small"
      style="width: 100%"
      :row-key="row => row.id"
      v-loading="materialLoading"
    >
    <!-- 在 <el-table> 内添加序号列 -->
<el-table-column label="序号" width="60">
  <template #default="{ $index }">
    {{ (materialPagination.currentPage - 1) * materialPagination.pageSize + $index + 1 }}
  </template>
</el-table-column>
      <el-table-column prop="itemNo" label="产品编号" width="100" />
      <el-table-column prop="itemName" label="产品名称" min-width="80" />
      <el-table-column prop="itemSpec" label="规格型号" min-width="80" />
      <el-table-column prop="poItemNo" label="采购行项目号" width="100" />
      <el-table-column prop="poItemId" label="采购行项目ID" min-width="80" />
      <el-table-column prop="poItemCode" label="国网物料编码" min-width="80" />
      <el-table-column prop="itemnum" label="数量" min-width="80" />
      <el-table-column prop="itemunit" label="单位" min-width="80" />

      <el-table-column prop="itemRealPrice" label="销售单价" min-width="80" />
      <el-table-column prop="itemRealSum" label="销售总金额" min-width="80" />
      <el-table-column prop="itemweight" label="单重(kg)" min-width="80" />
      <el-table-column prop="itemgrossweight" label="总重(kg)" min-width="80" />
      <el-table-column prop="itemmemo" label="备注" min-width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button type="primary" size="small" @click="editProduct($index, row)" :disabled="isConfirmed">编辑</el-button>
          <el-button type="danger" size="small" @click="removeProduct($index, row)" :disabled="isConfirmed">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="materialPagination.currentPage"
      v-model:page-size="materialPagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="materialPagination.total"
      @size-change="loadMaterialList"
      @current-change="loadMaterialList"
      class="pagination"
    />

    <!-- 产品添加/编辑弹窗 -->
    <el-dialog v-model="productDialogVisible" :title="isProductEdit ? '编辑产品' : '添加产品'" width="800px" :close-on-click-modal="false">
      <el-form ref="productFormRef" :model="currentProduct" :rules="productRules" label-width="120px" size="small">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="currentProduct.itemName" placeholder="点击选择产品" readonly @click="selectProduct">
                <template #append>
                  <el-button @click="selectProduct">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="国网物料编码" prop="poItemCode">
              <el-input v-model="currentProduct.poItemCode" placeholder="请输入国网物料编码" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="采购行项目号" prop="poItemNo">
              <el-input v-model="currentProduct.poItemNo" placeholder="请输入采购行项目号" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="采购行项目ID" prop="poItemId">
              <el-input v-model="currentProduct.poItemId" placeholder="请输入采购行项目ID" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="数量" prop="itemnum">
              <el-input-number v-model="currentProduct.itemnum" :min="1" style="width: 100%" @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="单位" prop="itemunit">
              <el-input v-model="currentProduct.itemunit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="销售单价(¥)" prop="itemRealPrice">
              <el-input-number v-model="currentProduct.itemRealPrice" :min="0" :precision="2" style="width: 100%" @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="销售总金额(¥)">
              <el-input v-model="currentProduct.itemRealSum" readonly placeholder="自动计算" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="单重(kg)" prop="itemweight">
              <el-input-number v-model="currentProduct.itemweight" :min="0" :precision="2" style="width: 100%" @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="总重(kg)">
              <el-input v-model="currentProduct.itemgrossweight" readonly placeholder="自动计算" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- <el-col :span="10">
            <el-form-item label="计划单价(¥)" prop="itemprice">
              <el-input-number v-model="currentProduct.itemprice" :min="0" :precision="2" style="width: 100%" @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划总金额(¥)">
              <el-input v-model="currentProduct.itemsum" readonly placeholder="自动计算" />
            </el-form-item>
          </el-col> -->
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input v-model="currentProduct.itemmemo" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmProduct" :loading="addProductLoading">
          {{ isProductEdit ? '确认修改' : '确认添加' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 产品选择弹窗 -->
    <ProductSelector v-model="productSelectorVisible" @select="handleProductSelect" />

    <!-- 导入结果弹窗 -->
    <ImportResultDialog v-model="importResultVisible" :import-data="importResultData" @confirm="handleImportResultConfirm" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import { getContractItemPage, importContractItem, createBasContractItem, updateBasContractItem, deleteBasContractItem, getBasContractItem,getContractItemTotal } from '@/api/contract/bascontract';
import ProductSelector from './components/ProductSelector.vue';
import ImportResultDialog from './components/ImportResultDialog.vue';
import { baseURL } from '@/utils/request';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  contractInfo: {
    type: Object,
    default: () => ({
      no: '',
      name: '',
      ecpno: '',
      equipno: '',
      status: 10
    })
  }
});

const emit = defineEmits(['update:visible']);

const dialogVisible = ref(false);
const materialLoading = ref(false);
const materialList = ref([]);
const materialSearchForm = reactive({
  keyword: ''
});
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const productDialogVisible = ref(false);
const isProductEdit = ref(false);
const editingProductIndex = ref(-1);
const addProductLoading = ref(false);
const productSelectorVisible = ref(false);
const importResultVisible = ref(false);
const importResultData = ref({});

const isConfirmed = computed(() => props.contractInfo.status > 10);

const currentProduct = reactive({
  id: undefined,
  no: null,
  poItemId: null,
  poItemCode: null,
  poItemNo: null,
  itemid: null,
  itemNo: '',
  itemName: '',
  itemSpec: '',
  itemnum: 1,
  itemunit: '个',
  itemprice: 0,
  itemweight: 0,
  itemmemo: '',
  itemgrossweight: 0,
  itemsum: 0,
  itemRealPrice: 0,
  itemRealSum: 0
});

const productRules = {
  itemName: [{ required: true, message: '请选择产品', trigger: 'change' }],
  itemnum: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  itemunit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  itemRealPrice: [{ required: true, message: '请输入销售单价', trigger: 'blur' }],
  itemprice: [{ required: true, message: '请输入计划单价', trigger: 'blur' }],
  itemweight: [{ required: true, message: '请输入单重', trigger: 'blur' }]
};

// 同步 dialogVisible
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal && props.contractInfo.no) {
      loadMaterialList();
    }
  }
);

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

// 加载物料列表
const loadMaterialList = async () => {
  if (!props.contractInfo.no) return;

  materialLoading.value = true;
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: props.contractInfo.no,
      itemName: materialSearchForm.keyword
    };

    const response = await getContractItemPage(params);
    if (response.success) {
      const itemData = response.data.itemList;
      materialList.value = itemData.list || [];
      materialPagination.total = itemData.totalRow || 0;
      
      // 确保加载列表后更新总金额和总重量
      await getContractTotal();
    } else {
      ElMessage.error(response.msg || '加载物料列表失败');
    }
  } catch (error) {
    ElMessage.error('加载物料列表失败');
  } finally {
    materialLoading.value = false;
  }
};

// 导入产品
const importProduct = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xls,.xlsx';
  input.style.display = 'none';

  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
      ElMessage.error('未选择文件');
      return;
    }

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/)) {
      ElMessage.error('请选择 Excel 文件 (.xls 或 .xlsx)');
      return;
    }

    const formData = new FormData();
    formData.append('itemListFile', file);
    formData.append('contractNo', props.contractInfo.no);

    try {
      const res = await importContractItem(formData);
      if (res.code === 200 && res.data) {
        importResultData.value = res.data;
        importResultVisible.value = true;
        ElMessage.success(`文件导入完成，总计 ${res.data.totalRows} 条，成功 ${res.data.successCount} 条`);
      } else {
        ElMessage.error('导入失败：' + (res.msg || '未知错误'));
      }
    } catch (error) {
      ElMessage.error('导入物料失败');
    } finally {
      document.body.removeChild(input);
    }
  });

  document.body.appendChild(input);
  input.click();
};

const totalAmount = ref(0);

const totalWeight= ref(0);

// 获取合同总金额和总重量
const getContractTotal = async () => { 
  try {
    const res = await getContractItemTotal({ contractNo: props.contractInfo.no });
    if (res.success) {
      totalAmount.value = res.data.sumData.totalItemRealSum || 0;
      totalWeight.value = res.data.sumData.totalGrossWeight || 0;
    } else {
      console.error('获取合同总计失败:', res.msg);
    }
  } catch (error) {
    console.error('获取合同总计失败:', error);
    ElMessage.error('获取合同总计失败');
  }
};
// 导入结果确认
const handleImportResultConfirm = () => {
  loadMaterialList(); // 这会触发 getContractTotal()
  // 不需要再单独调用 getContractTotal()
};

// 下载模板
const downloadExsl = () => {
  try {
    const url = `${baseURL}/xlsxTemplates/物料导入示例模板.xlsx`;
    window.open(url, '_blank');
  } catch (error) {
    ElMessage.error('下载模板失败，请检查网络或联系管理员');
  }
};

// 添加产品
const addProduct = () => {
  isProductEdit.value = false;
  editingProductIndex.value = -1;
  Object.assign(currentProduct, {
    id: undefined,
    no: props.contractInfo.no,
    poItemId: null,
    poItemCode: null,
    poItemNo: null,
    itemid: null,
    itemNo: '',
    itemName: '',
    itemSpec: '',
    itemnum: 1,
    itemunit: '个',
    itemprice: 0,
    itemweight: 0,
    itemmemo: '',
    itemgrossweight: 0,
    itemsum: 0,
    itemRealPrice: 0,
    itemRealSum: 0
  });
  productDialogVisible.value = true;
};

// 编辑产品
const editProduct = async (index, row) => {
  try {
    const res = await getBasContractItem({ itemId: row.id });
    if (res.success) {
      const { item } = res.data;
      Object.assign(currentProduct, {
        id: item.id,
        no: item.no,
        poItemNo: item.poItemNo || '',
        poItemId: item.poItemId || '',
        poItemCode: item.poItemCode || '',
        itemid: item.itemid,
        itemNo: item.itemNo || '',
        itemName: item.itemName || '',
        itemSpec: item.itemSpec || '',
        itemnum: item.itemnum || 1,
        itemunit: item.itemunit || '个',
        itemprice: item.itemprice || 0,
        itemweight: item.itemweight || 0,
        itemmemo: item.itemmemo || '',
        itemgrossweight: item.itemgrossweight || 0,
        itemsum: item.itemsum || 0,
        itemRealPrice: item.itemRealPrice || 0,
        itemRealSum: item.itemRealSum || 0
      });
      isProductEdit.value = true;
      editingProductIndex.value = index;
      productDialogVisible.value = true;
    } else {
      ElMessage.error('获取产品信息失败');
    }
  } catch (error) {
    ElMessage.error('获取产品信息失败');
  }
};

// 选择产品
const selectProduct = () => {
  productSelectorVisible.value = true;
};

// 处理产品选择
const handleProductSelect = (product) => {
  Object.assign(currentProduct, {
    itemid: product.id,
    itemNo: product.no,
    itemName: product.name,
    itemSpec: product.spec || '',
    itemunit: product.unit || '个',
    itemprice: product.planned_price || 0,
    itemweight: product.weight || 0
  });
  updateCalculations();
};


// 确认产品
const confirmProduct = async () => {
  if (!currentProduct.itemid) {
    ElMessage.warning('请选择产品');
    return;
  }
  if (!currentProduct.itemnum || currentProduct.itemnum <= 0) {
    ElMessage.warning('请输入正确的数量');
    return;
  }

  addProductLoading.value = true;
  try {
    const productData = { ...currentProduct };
    if (isProductEdit.value) {
      await updateBasContractItem(productData);
      ElMessage.success('产品更新成功');
    } else {
      await createBasContractItem(productData);
      ElMessage.success('产品添加成功');
    }

    await loadMaterialList();
    // 这里已经调用了 loadMaterialList，它内部会调用 getContractTotal
    // 所以不需要再单独调用 getContractTotal()
    
    productDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(isProductEdit.value ? '更新产品失败' : '添加产品失败');
  } finally {
    addProductLoading.value = false;
  }
};


// 删除产品
const removeProduct = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此产品吗？此操作不可撤销。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await deleteBasContractItem({ itemId: row.id });
    ElMessage.success('产品删除成功');
    // 删除后需要重新计算总金额和总重量
    await getContractTotal();
    // 同时更新本地列表
    materialList.value.splice(index, 1);
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除操作');
    } else {
      ElMessage.error('产品删除失败');
    }
  }
};

// 更新计算
const updateCalculations = () => {
  currentProduct.itemgrossweight = (currentProduct.itemnum * currentProduct.itemweight).toFixed(2);
  currentProduct.itemsum = (currentProduct.itemnum * currentProduct.itemprice).toFixed(2);
  currentProduct.itemRealSum = (currentProduct.itemnum * currentProduct.itemRealPrice).toFixed(2);
};
</script>

<style scoped>
.contract-info-card {
  margin-bottom: 12px;
}

.summary-info {
  float: right;
  font-size: 13px;
  color: #606266;
}

.contract-info-card :deep(.el-card__body) {
  padding: 12px;
}

.search-form {
  margin-bottom: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  font-size: 12px;
}

:deep(.el-input--small) {
  font-size: 12px;
}

:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  background-color: #fafafa;
}

.pagination {
  margin-top: 12px;
  text-align: right;
}
</style>