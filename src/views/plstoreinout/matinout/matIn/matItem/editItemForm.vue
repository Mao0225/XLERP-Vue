<template>
  <el-dialog 
    v-model="dialogVisible" 
    title="编辑明细" 
    width="900px" 
    :close-on-click-modal="false" 
    @closed="handleClose"
    class="compact-dialog"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-width="90px" 
      class="edit-form"
    >
      <!-- 基础信息 -->
      <div class="section">
        <div class="section-title">基础信息</div>
        <div class="form-row">
          <el-form-item label="物料编号" prop="materialCode">
            <el-input 
              v-model="form.materialCode" 
              placeholder="请输入物料编号" 
              @click="openDialog" 
              readonly
              size="small"
            >
              <template #append>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="openDialog">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="物料名称" prop="materialName">
            <el-input 
              v-model="form.materialName" 
              placeholder="请输入物料名称" 
              size="small"
            />
          </el-form-item>
          <el-form-item label="规格型号" prop="materialSpec">
            <el-input 
              v-model="form.materialSpec" 
              placeholder="请输入规格型号" 
              size="small"
            />
          </el-form-item>
        </div>
        
        <div class="form-row">
          <el-form-item label="计量单位" prop="materialUnit">
            <el-input 
              v-model="form.materialUnit" 
              placeholder="请输入计量单位" 
              size="small"
            />
          </el-form-item>
          <el-form-item label="计划规格" prop="planSpec">
            <el-input 
              v-model="form.planSpec" 
              placeholder="请输入计划规格" 
              maxlength="50" 
              size="small"
            />
          </el-form-item>
          <el-form-item label="计划材质" prop="planMaterial">
            <el-input 
              v-model="form.planMaterial" 
              placeholder="请输入计划材质" 
              maxlength="100" 
              size="small"
            />
          </el-form-item>
        </div>
         <div class="form-row">
          <el-form-item label="材质" prop="material">
            <el-input 
              v-model="form.material" 
              placeholder="请输入材质" 
              maxlength="100" 
              size="small"
            />
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
             <el-input 
              v-model="form.supplierName" 
              placeholder="选择供应商" 
              readonly 
              @click="showSupplierSelector = true"
              size="small"
            >
              <template #append>
                <el-button @click="showSupplierSelector = true" size="mini">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item></el-form-item> <!-- 占位 -->
        </div>
      </div>

      <!-- 库存信息 -->
      <div class="section">
        <div class="section-title">库存信息</div>
        <div class="form-row">
          <el-form-item label="数量" prop="quantity">
            <el-input-number 
              v-model="form.quantity" 
              placeholder="请输入数量" 
              style="width: 100%"
              :precision="2"
              size="small"
            />
          </el-form-item>
          <el-form-item label="计划数量" prop="planQuantity">
            <el-input-number 
              v-model="form.planQuantity" 
              placeholder="请输入计划数量" 
              style="width: 100%"
              :controls="false"
              :precision="2"
              :min="0"
              size="small"
            />
          </el-form-item>
          <el-form-item label="计划重量" prop="planWeight">
            <el-input-number 
              v-model="form.planWeight" 
              placeholder="请输入计划重量" 
              :controls="false"
              style="width: 100%"
              :precision="2"
              :min="0"
              size="small"
            />
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="单重" prop="unitWeight">
            <el-input-number 
              v-model="form.unitWeight" 
              placeholder="请输入单重" 
              style="width: 100%"
              :precision="3"
              :min="0"
              size="small"
            />
          </el-form-item>
          <!-- 总重：自动计算，不可编辑 -->
          <el-form-item label="总重" prop="totalWeight">
            <el-input-number 
              v-model="form.totalWeight" 
              placeholder="自动计算" 
              style="width: 100%"
              :precision="3"
              :min="0"
              :disabled="true"
              size="small"
              class="calc-field"
            />
          </el-form-item>
          <el-form-item label="存放位置" prop="warehouse">
            <el-input 
              v-model="form.warehouse" 
              placeholder="请输入存放位置" 
              size="small"
            />
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="销售单价" prop="salesPrice">
            <el-input-number 
              v-model="form.salesPrice" 
              placeholder="请输入销售单价" 
              style="width: 100%"
              :precision="2"
              :min="0"
              size="small"
            />
          </el-form-item>
          <!-- 销售金额：自动计算，不可编辑 -->
          <el-form-item label="销售金额" prop="salesTotalAmount">
            <el-input-number 
              v-model="form.salesTotalAmount" 
              placeholder="自动计算" 
              style="width: 100%"
              :precision="2"
              :min="0"
              :disabled="true"
              size="small"
              class="calc-field"
            />
          </el-form-item>
          <el-form-item></el-form-item> <!-- 占位 -->
        </div>
      </div>

      <!-- 合同信息 -->
      <div class="section">
        <div class="section-title">合同信息</div>
        <div class="form-row">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input 
              v-model="form.contractNo" 
              placeholder="请选择合同编号" 
              size="small"
            >
              <template #append>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="contractSelectorVisible = true">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="合同名称" prop="contractName">
            <el-input 
              v-model="form.contractName" 
              placeholder="请选择合同" 
              size="small"
            />
          </el-form-item>
          <el-form-item></el-form-item> <!-- 占位 -->
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">备注</div>
        <el-form-item label="明细备注" prop="memo">
          <el-input 
            v-model="form.memo" 
            type="textarea" 
            :rows="2"
            placeholder="请输入明细备注"
            size="small"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button type="primary" size="small" @click="handleSave" :loading="loading">保存</el-button>
      </div>
    </template>

    <itemSelector
      v-model="itemSelectorVisible"
      @select="selectItem"
    />
    <contractSelector 
      v-model:visible="contractSelectorVisible" 
      @select="selectContract" 
    />
    <supplierSelector
      v-model="showSupplierSelector"
      @select="selectSupplier"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { updatePlMatInoutItem } from '@/api/plstoreinout/matinout.js';
import itemSelector from '../../../components/itemSelector.vue';
import contractSelector from '../../../components/contractSelector.vue';
import supplierSelector from '../../../components/supplierSelector.vue';


const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  docNo: {
    type: String,
    default: ''
  },
  inOutType: {
    type: Number,
    default: 1 // 1=入库，2=出库
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'success']);

// 计算属性处理弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const contractSelectorVisible = ref(false);

const selectContract = (contract) => {  
  form.contractNo = contract.no;
  form.contractName = contract.name;
  contractSelectorVisible.value = false;
};

const showSupplierSelector = ref(false);

const selectSupplier = (supplier) => {
  form.supplierName = supplier.descr;
  showSupplierSelector.value = false;
};

const openDialog = () => { 
  itemSelectorVisible.value = true;
};

const itemSelectorVisible = ref(false);
const selectItem = (item) => {
  form.materialCode = item.no;
  form.materialName = item.name;
  form.materialSpec = item.spec;
  form.materialUnit = item.unit;
  form.salesPrice = item.planned_price;
  form.unitWeight = item.weight;
  itemSelectorVisible.value = false; 
};

// 是否显示出库相关字段
const showOutboundFields = computed(() => props.inOutType === 2);

const formRef = ref();
const loading = ref(false);

// 表单数据
const form = reactive({
  id: null,
  docNo: '',
  materialCode: '',
  materialName: '',
  materialSpec: '',
  materialUnit: '',
  planSpec: '',
  planMaterial: '',
  material: '',
  supplierName: '',
  planQuantity: null,
  planWeight: null,
  quantity: null,
  unitWeight: null,
  totalWeight: null,
  salesPrice: null,
  salesTotalAmount: null,
  category: '',
  contractNo: '',
  contractName: '',
  requestQuantity: null,
  batchNo: '',
  warehouse: '',
  memo: '',
  status: '正常'
});

// 表单验证规则
const rules = {
  materialCode: [
    { required: true, message: '请输入物料编号', trigger: 'blur' }
  ],
  materialName: [
    { required: true, message: '请输入物料名称', trigger: 'blur' }
  ],
  materialSpec: [
    { required: true, message: '请输入规格型号', trigger: 'blur' }
  ],
  materialUnit: [
    { required: true, message: '请输入计量单位', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', message: '数量必须为数字', trigger: 'blur' }
  ],
  warehouse: [
    { required: true, message: '请输入存放位置', trigger: 'blur' }
  ],
  planSpec: [ { required: false, message: '请输入计划规格', trigger: 'blur' } ],
  planMaterial: [ { required: false, message: '请输入计划材质', trigger: 'blur' } ],
  supplierName: [ { required: false, message: '请输入供应商名称', trigger: 'blur' } ],
  planQuantity: [
    { required: false, message: '请输入计划数量', trigger: 'blur' },
    { type: 'number', message: '计划数量必须为数字', trigger: 'blur' }
  ],
  planWeight: [
    { required: false, message: '请输入计划重量', trigger: 'blur' },
    { type: 'number', message: '计划重量必须为数字', trigger: 'blur' }
  ]
};

// 初始化表单数据
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(form, {
      id: newData.id || null,
      docNo: props.docNo || newData.docNo || '',
      materialCode: newData.materialCode || '',
      materialName: newData.materialName || '',
      materialSpec: newData.materialSpec || '',
      materialUnit: newData.materialUnit || '',
      planSpec: newData.planSpec || '',
      planMaterial: newData.planMaterial || '',
      material: newData.material || '',
      supplierName: newData.supplierName || '',
      planQuantity: newData.planQuantity || null,
      planWeight: newData.planWeight || null,
      quantity: newData.quantity || null,
      unitWeight: newData.unitWeight || null,
      totalWeight: newData.totalWeight || null,
      salesPrice: newData.salesPrice || null,
      salesTotalAmount: newData.salesTotalAmount || null,
      category: newData.category || '',
      contractNo: newData.contractNo || '',
      contractName: newData.contractName || '',
      requestQuantity: newData.requestQuantity || null,
      batchNo: newData.batchNo || '',
      warehouse: newData.warehouse || '',
      memo: newData.memo || '',
      status: newData.status || '正常'
    });
  }
}, { immediate: true });

// 监听docNo变化
watch(() => props.docNo, (newDocNo) => {
  form.docNo = newDocNo;
}, { immediate: true });

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(form, {
    id: null,
    docNo: props.docNo || '',
    materialCode: '',
    materialName: '',
    materialSpec: '',
    materialUnit: '',
    planSpec: '',
    planMaterial: '',
    material: '',
    supplierName: '',
    planQuantity: null,
    planWeight: null,
    quantity: null,
    unitWeight: null,
    totalWeight: null,
    salesPrice: null,
    salesTotalAmount: null,
    category: '',
    contractNo: '',
    contractName: '',
    requestQuantity: null,
    batchNo: '',
    warehouse: '',
    memo: '',
    status: '正常'
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
    
    await updatePlMatInoutItem(submitData);
    emit('success');
    ElMessage.success('更新明细成功');
    handleClose();
  } catch (error) {
    console.error('更新失败', error);
    if (error.message && error.message !== 'Validation failed') {
      ElMessage.error('更新失败：' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

// 关闭弹窗
const handleClose = () => {
  resetForm();
  emit('update:visible', false);
};

// 监听数量和单价变化，自动计算销售金额
watch([() => form.quantity, () => form.salesPrice], () => {
  if (form.quantity && form.salesPrice) {
    form.salesTotalAmount = parseFloat((form.quantity * form.salesPrice).toFixed(2));
  }
});

// 监听数量和单重变化，自动计算总重
watch([() => form.quantity, () => form.unitWeight], () => {
  if (form.quantity && form.unitWeight) {
    form.totalWeight = parseFloat((form.quantity * form.unitWeight).toFixed(3));
  }
});
</script>

<style scoped>
/* 紧凑布局样式 */
.compact-dialog {
  --el-dialog-content-padding: 12px;
}

.edit-form {
  max-height: 75vh;
  overflow-y: auto;
  padding: 0 4px;
  margin: 0;
}

.section {
  margin-bottom: 8px;
  padding: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 6px;
  padding-left: 4px;
  border-left: 2px solid #409eff;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}

/* 自动计算字段样式 */
.calc-field {
  background-color: #f5f5f5;
}

/* 统一输入框高度 */
:deep(.el-input__wrapper),
:deep(.el-input-number__wrapper) {
  height: 28px !important;
}

:deep(.el-textarea__wrapper) {
  min-height: 60px !important;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .compact-dialog {
    width: 95vw !important;
  }
}
</style>