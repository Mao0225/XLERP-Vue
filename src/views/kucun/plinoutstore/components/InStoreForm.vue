<template>
  <div class="compact-form-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="compact-form">
      <!-- 入库主要信息 -->
      <div class="form-section">
        <div class="section-title">入库主要信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="单据号" prop="orderno">
              <el-input v-model="form.orderno" placeholder="单据号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收发日期" prop="receivedate">
              <el-date-picker v-model="form.receivedate" type="datetime" placeholder="选择日期" value-format="YYYY-MM-DD HH:mm:ss" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送货单位" prop="deliverunit">
              <el-input 
                v-model="form.deliverunit" 
                placeholder="送货单位" 
                readonly 
                @click="openSupplierSelector"
              >
                <template #append>
                  <el-button @click="openSupplierSelector" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="仓库" prop="store">
              <el-select v-model="form.store" placeholder="选择仓库" clearable size="small" style="width: 100%">
                <el-option v-for="store in storeOptions" :key="store" :label="store" :value="store" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="flag">
              <el-select v-model="form.flag" placeholder="业务类型" clearable size="small" style="width: 100%">
                <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input 
                v-model="form.contractNo" 
                placeholder="选择合同编号" 
                readonly 
                @click="openContractSelector"
              >
                <template #append>
                  <el-button @click="openContractSelector" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期间" prop="term">
              <el-input v-model="form.term" placeholder="期间" clearable size="small" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 物料信息 -->
      <div class="form-section">
        <div class="section-title-btn">
          <span>物料信息</span>
          <el-button type="primary" @click="addMaterial">添加物料</el-button>
        </div>
        
        <el-form ref="materialFormRef" :model="currentMaterial" :rules="materialRules" label-width="100px">
          <el-row :gutter="16">
            <el-col :span="8">
            <el-form-item label="生产订单号" prop="ipoNo">
              <el-input v-model="currentMaterial.ipoNo" placeholder="生产订单号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单号" prop="woNo">
              <el-input v-model="currentMaterial.woNo" placeholder="生产工单号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排产计划编号" prop="scheduleCode">
              <el-input 
                v-model="currentMaterial.scheduleCode" 
                placeholder="选择排产计划编号" 
                readonly 
                @click="openPaichanjihuaSelector"
              >
                <template #append>
                  <el-button @click="openPaichanjihuaSelector" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
              <el-form-item label="物料名称" prop="materialname">
                <el-input v-model="currentMaterial.materialname" placeholder="点击选择物料" readonly @click="selectProduct">
                  <template #append>
                    <el-button @click="selectProduct">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物料编号" prop="materialno">
                <el-input v-model="currentMaterial.materialno" placeholder="物料编号" clearable size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格型号" prop="spec">
                <el-input v-model="currentMaterial.spec" placeholder="规格型号" clearable size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="计量单位" prop="unit">
                <el-select v-model="currentMaterial.unit" placeholder="单位" clearable size="small" style="width: 100%" allow-create filterable>
                  <el-option v-for="unit in unitOptions" :key="unit" :label="unit" :value="unit" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数量" prop="quantity">
                <el-input-number v-model="currentMaterial.quantity" :min="0.01" :precision="2" controls-position="right" size="small" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划单价" prop="price">
                <el-input-number v-model="currentMaterial.price" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划总金额" prop="totalmoney">
                <el-input-number v-model="currentMaterial.totalmoney" :min="0" :precision="2" controls-position="right" disabled size="small" style="width: 100%" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="销售单价" prop="realprice">
                <el-input-number v-model="currentMaterial.realprice" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售总金额" prop="realTotalMoney">
                <el-input-number v-model="currentMaterial.realTotalMoney" :min="0" :precision="2" controls-position="right" disabled size="small" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 物料列表 -->
      <div class="form-section">
        <div class="section-title">物料列表</div>
        <el-table :data="form.materials || []" border style="width: 100%">
          <!-- 序号 -->
           <el-table-column type="index" label="序号" width="50"/>
          <el-table-column prop="woNo" label="生产工单号" width="120" />
          <el-table-column prop="ipoNo" label="生产订单号" width="120" />
          <el-table-column prop="scheduleCode" label="排产计划号" width="120" />
          
          <el-table-column prop="materialno" label="物料编号" width="120" />
          <el-table-column prop="materialname" label="物料名称" width="150" />
          <el-table-column prop="spec" label="规格型号" width="120" />
          <el-table-column prop="unit" label="计量单位" width="100" />
tt          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="price" label="计划单价" width="100" />
          <el-table-column prop="totalmoney" label="计划总金额" width="100" />
          <el-table-column prop="realprice" label="销售单价" width="100" />
          <el-table-column prop="realTotalMoney" label="销售总金额" width="100" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ $index, row }">
              <el-button type="danger" size="small" @click="removeMaterial($index, row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 居中显示-->
      <div style="text-align: center;">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>

      </div>
    </el-form>

    <ProductSelector v-model="productSelectorVisible" @select="handleProductSelect" />
    <ContractSelector
      v-model="contractSelectorVisible"
      :onSelect="handleContractSelect"
    />
    <PaichanjihuaSelector
      v-model="paichanjihuaSelectorVisible"
      :onSelect="handlePaichanjihuaSelect"
    />

    <SupplierSelector
      v-model="supplierSelectorVisible"
      :onSelect="handleSupplierSelect"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { cloneDeep } from 'lodash';
import { createPlinoutstore, updatePlinoutstore, deletePlinoutstore } from '@/api/plmanage/plinoutstore.js';
import ProductSelector from './ProductSelector.vue';
import ContractSelector from './ContractSelector.vue';
import PaichanjihuaSelector from './paichanjihuaSelector.vue';
import SupplierSelector from './gongyingshangSelector.vue';
import { useUserStore } from '@/store/user';
// 获取当前的期数term
import { useTermStore } from '@/store/term.js';
import { getNewNoNyName } from '@/api/system/basno'

const termStore = useTermStore();
const currentTerm = termStore.term;
const terms = termStore.terms;//区间列表
console.log('当前区间为就是iscurrent为1的区间', currentTerm);
// 获取用户存储
const userStore = useUserStore();

// 获取用户真实姓名
const getRealName = () => {
  return userStore.realName; 
};

// 定义组件的属性
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({
      orderno: '',
      receivedate: '',
      deliverunit: '',
      store: '',
      flag: '',
      handleperson: '',
      contractNo: '',
      isin: 1,
      materials: []
    })
  },
  showSaveAsDraft: {
    type: Boolean,
    default: false
  },
  edit: {
    type: Boolean,
    default: false
  }
});

// 定义组件发出的事件
const emit = defineEmits(['submit', 'cancel', 'save-draft']);

// 定义表单和物料表单的引用
const formRef = ref(null);
const materialFormRef = ref(null);
const contractSelectorVisible = ref(false); // 合同选择器显示状态
const productSelectorVisible = ref(false); // 产品选择器显示状态
const paichanjihuaSelectorVisible = ref(false); // 排产计划选择器显示状态
const supplierSelectorVisible = ref(false);
// 响应式表单数据
const form = reactive({
  orderno: '',
  receivedate: '',
  deliverunit: '',
  store: '',
  flag: '',
  handleperson: '',
  contractNo: '',
  isin: 1,
  term: currentTerm,
  materials: []
});

// 响应式当前物料数据
const currentMaterial = reactive({
  id: undefined,
  scheduleCode: '',
  ipoNo: '',
  woNo: '',
  materialno: '',
  materialname: '',
  spec: '',
  unit: '',
  quantity: 0,
  price: 0,
  realprice: 0,
  totalmoney: 0,
  realTotalMoney:0
});

// 选项数据
const unitOptions = ref(['件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱']); // 计量单位选项
const storeOptions = ref(['原材料库', '成品库', '半成品库', '废品库', '其他库']); // 仓库选项
const flagOptions = ref([
  { value: 1, label: '采购入库' },
  { value: 2, label: '调拨入库' },
  { value: 3, label: '其他入库' }
]); // 业务类型选项

// 表单验证规则
const rules = reactive({
  orderno: [{ required: true, message: '单据号不能为空', trigger: 'blur' }],
  receivedate: [{ required: true, message: '收发日期不能为空', trigger: 'change' }],
  deliverunit: [{ required: true, message: '送货单位不能为空', trigger: 'blur' }],
  store: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  flag: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
  contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
});

// 物料表单验证规则
const materialRules = reactive({
  materialno: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  materialname: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
  quantity: [
    { required: true, message: '数量不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '数量必须大于0', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '单价不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价不能为负数', trigger: 'blur' }
  ]
});

// 生成单据号
const generateOrderNo = async  () => {
  try{
  const res = await getNewNoNyName('sfdh');
   if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName);
      return res.data.fullNoNyName;
    }
    
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
    
  } catch (error) {
    console.error('生成排产计划编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};


const getCurrentDateTime= () =>{
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    console.log('当前时间为：${year}-${month}-${day} ${hours}:${minutes}:${seconds}');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
// 获取默认表单数据
const getDefaultForm = () => {
  return {
    orderno: generateOrderNo(),
    receivedate: getCurrentDateTime(),
    deliverunit: '',
    store: '',
    flag: '',
    handleperson: getRealName(),
    contractNo: '',
    scheduleCode: '',
    isin: 1,
    term: currentTerm,
    woNo: '',
    materials: []
  };
};

// 初始化表单数据
const initFormData = (data) => {
  const defaultForm = getDefaultForm();
  if (props.edit && data && Object.keys(data).length > 0) {
    console.log('原料列表', data.materials);
    Object.assign(form, { ...defaultForm, ...cloneDeep(data), materials: data.materials || [] });
  } else {
    Object.assign(form, defaultForm);
  }
  nextTick(() => {
    formRef.value?.clearValidate();
    materialFormRef.value?.clearValidate();
  });
};

// 打开合同选择器
const openContractSelector = () => {
  contractSelectorVisible.value = true;
};

// 打开排产计划选择器
const openPaichanjihuaSelector = () => { 
  console.log('打开排产计划选择器');
  paichanjihuaSelectorVisible.value = true;
};

// 打开供应商选择器
const openSupplierSelector = () => {
  supplierSelectorVisible.value = true;
};

// 处理合同选择
const handleContractSelect = (contract) => {
  if (contract) {
    form.contractNo = contract.no;
  }
  contractSelectorVisible.value = false;
};

// 打开产品选择器
const selectProduct = () => {
  productSelectorVisible.value = true;
};

// 处理产品选择
const handleProductSelect = (product) => {
  currentMaterial.materialno = product.no;
  currentMaterial.materialname = product.name;
  currentMaterial.spec = product.spec || '';
  currentMaterial.price = product.planned_price || 0;
  currentMaterial.unit = product.unit || '';
  nextTick(() => {
    materialFormRef.value?.clearValidate(['materialno', 'materialname']);
  });
};

// 处理排产计划选择
const handlePaichanjihuaSelect = (plan) => { 
  currentMaterial.ipoNo = plan.ipoNo;
  currentMaterial.woNo = plan.woNo;
  form.contractNo = plan.contractNo;
  currentMaterial.scheduleCode = plan.scheduleCode;
  currentMaterial.materialno = plan.itemNo;
  currentMaterial.materialname = plan.itemName;
  currentMaterial.spec = plan.spec;
  currentMaterial.unit = plan.unit;
  currentMaterial.price = plan.itemprice;
  currentMaterial.realprice = plan.itemRealPrice 
  currentMaterial.quantity = parseFloat(plan.gdamount); // 转换为浮点数
};

const handleSupplierSelect = (supplier) => {
  form.deliverunit = supplier.descr;
  supplierSelectorVisible.value = false;
};

// 添加或更新物料
const addMaterial = async () => {
  try {
    const [mainFormValid, materialFormValid] = await Promise.all([
      new Promise(resolve => formRef.value?.validate(resolve)),
      new Promise(resolve => materialFormRef.value?.validate(resolve))
    ]);

    if (mainFormValid && materialFormValid) {
      currentMaterial.totalmoney = parseFloat((currentMaterial.quantity * currentMaterial.price).toFixed(2)) || 0;
      currentMaterial.realTotalMoney = parseFloat((currentMaterial.quantity * currentMaterial.realprice).toFixed(2)) || 0;

      const saveData = {
        ...cloneDeep(form),
        ...cloneDeep(currentMaterial)

      };
      delete saveData.materials;

      if (currentMaterial.id) {
        // 更新已有物料
        await updatePlinoutstore(saveData);
        ElMessage.success('物料更新成功');
        const index = form.materials.findIndex(m => m.id === currentMaterial.id);
        if (index !== -1) {
          form.materials[index] = cloneDeep(currentMaterial);
        }
      } else {
        // 添加新物料并获取返回的 storeId
        const response = await createPlinoutstore(saveData);
        if (response.success && response.data.storeId) {
          currentMaterial.id = response.data.storeId; // 将返回的 storeId 赋值给 currentMaterial.id
          ElMessage.success('物料添加成功');
          form.materials.push(cloneDeep(currentMaterial));
        } else {
          throw new Error('未返回有效的 storeId');
        }
      }

      resetCurrentMaterial();

    } else {
      ElMessage.error('请填写完整的表单和物料信息');
    }
  } catch (error) {
    ElMessage.error('保存失败：' + error.message);
  }
};

// 删除物料
const removeMaterial = async (index, row) => {
  ElMessageBox.confirm(`确认删除物料 "${row.materialname}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      if (row.id) {
        // 调用 API 删除物料
        await deletePlinoutstore({ id: row.id });
        ElMessage.success('删除物料成功');
      }
      // 从本地物料列表中移除
      form.materials.splice(index, 1);
    } catch (error) {
      console.error('删除物料失败', error);
      ElMessage.error('删除物料失败');
    }
  }).catch(() => {});
};

// 重置当前物料数据
const resetCurrentMaterial = () => {
  Object.assign(currentMaterial, {
    id: undefined,
      scheduleCode: '',
      ipoNo: '',
      woNo: '',
      materialno: '',
      materialname: '',
      spec: '',
      unit: '',
      quantity: 0,
      price: 0,
      realprice: 0,
      totalmoney: 0,
      realTotalMoney:0

  });
  nextTick(() => {
    materialFormRef.value?.clearValidate();
  });
};

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await new Promise(resolve => formRef.value?.validate(resolve));
    if (valid && form.materials.length > 0) {
      // emit('submit', cloneDeep(form));
    emit('cancel');

    } else {
      ElMessage.error('请填写完整表单内容并添加至少一个物料');
    }
  } catch (error) {
    ElMessage.error('提交失败：' + error.message);
  }
};

// 取消表单
const handleCancel = () => {
  emit('cancel');
};


// 计算计划总金额
const totalMoney = computed(() => {
  return parseFloat((currentMaterial.quantity * currentMaterial.price).toFixed(2)) || 0;
});

const realTotal = computed(() => {
  return parseFloat((currentMaterial.quantity * currentMaterial.realprice).toFixed(2)) || 0;
});

// 监听表单数据变化
watch(() => props.formData, (newVal) => {
  initFormData(newVal);
}, { deep: true, immediate: true });

// 监听物料数量变化
watch(() => currentMaterial.quantity, () => {
  currentMaterial.totalmoney = totalMoney.value;
  currentMaterial.realTotalMoney = realTotal.value;
});

// 监听物料单价变化
watch(() => currentMaterial.price, () => {
  currentMaterial.totalmoney = totalMoney.value;
  currentMaterial.realTotalMoney = realTotal.value;
});

watch(() => currentMaterial.realprice, () => {
  currentMaterial.totalmoney = totalMoney.value;
  currentMaterial.realTotalMoney = realTotal.value;
});

// 页面初始化
onMounted(() => {
  initFormData(props.formData);
});
</script>

<style scoped>
.compact-form-container {
  max-width: 1000px;
  padding: 16px;
  background: #fff;
}

.compact-form {
  background: #fff;
}

.form-section {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fafafa;
}

.section-title-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.form-actions {
  margin-top: 20px;
  padding: 16px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 4px;
}

.form-actions .el-button {
  margin: 0 6px;
  min-width: 80px;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-size: 13px;
  color: #606266;
}

.el-input--small .el-input__inner,
.el-select--small .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.el-input-number--small {
  width: 100%;
}

@media (max-width: 768px) {
  .compact-form-container {
    padding: 12px;
  }
  
  .form-actions .el-button {
    margin: 4px 2px;
    min-width: 70px;
  }
  
  .form-section {
    padding: 12px;
  }
}
</style>