<template>
  <div class="contract-form">
    <!-- <div class="page-header">
      <h2>{{ isEdit ? '编辑合同' : '新增合同' }}</h2>
    </div> -->

    <!-- 确保 form 数据加载完成后再渲染 -->
    <el-form v-if="formLoaded" ref="formRef" :model="form" :rules="rules" label-width="80px" size="small">
      <!-- 合同信息 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">合同信息</span>
        </template>
        <el-row :gutter="12" >
          <el-col :span="5">
            <el-form-item label="器材合同号" prop="equipno" >
              <el-input v-model="form.equipno" placeholder="器材合同号"  />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="国网经法合同号" prop="ecpno" label-width="100px">
              <el-input v-model="form.ecpno" placeholder="国网经法合同号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="采购方总部编码" prop="purchaserHqCode" label-width="100px">
              <el-input v-model="form.purchaserHqCode" placeholder="采购方总部编码" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" placeholder="供应商编码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="供应商名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="厂内合同号" prop="no" label-width="90px" >
              <el-input v-model="form.no" placeholder="合同号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="工程名称" prop="name">
              <el-input v-model="form.name" placeholder="工程名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="电网编号" prop="gridno">
              <el-input v-model.number="form.gridno" placeholder="电网编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="签定时间" prop="signdate">
              <el-date-picker v-model="form.signdate" type="date" placeholder="签定时间" value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="销售员" prop="salesmanid">
              <el-input v-model="form.salesmanName" placeholder="选择销售员" readonly @click="selectSalesman">
                <template #append>
                  <el-button @click="selectSalesman" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户" prop="customerid">
              <el-input v-model="form.customerName" placeholder="选择客户" readonly @click="selectCustomer">
                <template #append>
                  <el-button @click="selectCustomer" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="客户代理人">
              <el-input v-model="form.agent" placeholder="客户代理人" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="法定代表人">
              <el-input v-model="form.legalrepresent" placeholder="法定代表人" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="税务号">
              <el-input v-model="form.taxnum" placeholder="税务号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="交货时间">
              <el-date-picker v-model="form.itemsenddate" type="date" placeholder="交货时间" value-format="YYYY-MM-DD"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="到货地点">
              <el-input v-model="form.destination" placeholder="到货地点" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="接货人">
              <el-input v-model="form.receiver" placeholder="接货人" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="3">
            <el-form-item label="运输方式">
              <el-select v-model="form.transtype" placeholder="运输方式" style="width: 100%">
                <el-option label="汽运" value="汽运" />
                <el-option label="铁路" value="铁路" />
                <el-option label="空运" value="空运" />
                <el-option label="海运" value="海运" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="交提货方式">
              <el-select v-model="form.picktype" placeholder="交提货方式" style="width: 100%">
                <el-option label="自提" value="自提" />
                <el-option label="送货" value="送货" />
                <el-option label="物流" value="物流" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="验收方式">
              <el-input v-model="form.checktype" placeholder="验收方式" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="包装费承担">
              <el-select v-model="form.casingcost" placeholder="包装费承担" style="width: 100%">
                <el-option label="供方" :value="1" />
                <el-option label="需方" :value="2" />
                <el-option label="各半" :value="3" />
                <el-option label="其他" :value="400" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="运费承担">
              <el-select v-model="form.transcost" placeholder="运费承担" style="width: 100%">
                <el-option label="供方" :value="1" />
                <el-option label="需方" :value="2" />
                <el-option label="各半" :value="3" />
                <el-option label="其他" :value="400" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="电压等级">
              <el-input v-model.number="form.pressurestage" placeholder="电压等级(KV)" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="客户电话">
              <el-input v-model="form.telephone" placeholder="客户电话" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="客户传真">
              <el-input v-model="form.fax" placeholder="客户传真" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="邮政编码">
              <el-input v-model="form.postalcode" placeholder="邮政编码" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开户银行">
              <el-input v-model="form.bank" placeholder="开户银行" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="账号">
              <el-input v-model="form.bankcode" placeholder="账号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="期间">
              <el-select v-model="form.term" placeholder="选择当前期间" size="small" allow-create filterable
                style="width: 100%">
                <el-option v-for="term in terms" :key="term.id" :label="term.term" :value="term.term" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="10" style="text-align: center;">
            <el-form-item label="其他条款">
              <el-input type="textarea" :rows="7" v-model="form.other" placeholder="其他条款" />
            </el-form-item>

          </el-col>

        </el-row>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="submitForm" :disabled="isConfirmed">保存合同信息</el-button>

        </div>
      </el-card>

      <!-- 产品信息 -->
      <el-card v-if="isEdit" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">产品信息</span>
            <div class="summary-info">
              <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
              <span style="margin: 0 20px;">总重量: {{ totalWeight.toFixed(2) }}kg</span>
              <el-button type="primary" size="small" @click="addProduct" :disabled="isConfirmed">添加产品</el-button>
            </div>
          </div>
        </template>

        <el-table :data="productList" border size="small" style="width: 100%">
          <el-table-column prop="itemNo" label="产品编号" width="100" />
          <el-table-column prop="itemName" label="产品名称" min-width="80" />
          <el-table-column prop="itemSpec" label="规格型号" min-width="80" />
          <el-table-column prop="itemnum" label="数量" min-width="80" />
          <el-table-column prop="itemunit" label="单位" min-width="80" />
          <el-table-column prop="itemprice" label="单价" min-width="80" />
          <el-table-column prop="itemsum" label="金额" min-width="80" />
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

        <div v-if="productList.length === 0" class="empty-product">
          <p>暂无产品信息，请点击添加产品</p>
        </div>
      </el-card>
    </el-form>

    <!-- 产品添加/编辑弹窗 -->
    <el-dialog v-model="productDialogVisible" :title="isProductEdit ? '编辑产品' : '添加产品'" width="600px"
      :close-on-click-modal="false">
      <el-form ref="productFormRef" :model="currentProduct" :rules="rules" label-width="100px" size="small">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="currentProduct.itemName" placeholder="点击选择产品" readonly @click="selectProduct">
                <template #append>
                  <el-button @click="selectProduct">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="数量" prop="itemnum">
              <el-input-number v-model="currentProduct.itemnum" :min="1" style="width: 100%"
                @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位" prop="itemunit">
              <el-input v-model="currentProduct.itemunit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="单价(¥)" prop="itemprice">
              <el-input-number v-model="currentProduct.itemprice" :min="0" :precision="2" style="width: 100%"
                @change="updateCalculations" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单重(kg)" prop="itemweight">
              <el-input-number v-model="currentProduct.itemweight" :min="0" :precision="2" style="width: 100%"
                @change="updateCalculations" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总重(kg)">
              <el-input v-model="currentProduct.itemgrossweight" readonly placeholder="自动计算" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="总金额(¥)">
              <el-input v-model="currentProduct.itemsum" readonly placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

    <!-- 销售员选择弹窗 -->
    <SalesmanSelector v-model="salesmanSelectorVisible" @select="handleSalesmanSelect" />

    <!-- 客户选择弹窗 -->
    <CustomerSelector v-model="customerSelectorVisible" @select="handleCustomerSelect" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getContractInfoByNo, updateBasContract, createBasContractItem, deleteBasContractItem, getBasContractItem, updateBasContractItem, createBasContract } from '@/api/contract/bascontract.js';
import ProductSelector from './components/ProductSelector.vue';
import SalesmanSelector from './components/SalesmanSelector.vue';
import CustomerSelector from './components/CustomerSelector.vue';

// 获取当前的期数term
import { useTermStore } from '@/store/term.js';
const termStore = useTermStore();
const currentTerm = termStore.term;
const terms = termStore.terms;//区间列表
console.log('当前区间为就是iscurrent为1的区间', currentTerm);
// 获取userId
import { useUserStore } from '@/store/user.js';
const userStore = useUserStore();
const userId = computed(() => userStore.userId);
console.log('userId', userId.value);
const props = defineProps({
  contractNo: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close']);

const formLoaded = ref(false);
const isEdit = computed(() => !!props.contractNo);
const isProductEdit = ref(false);
const editingProductIndex = ref(-1);

const formRef = ref(null);
const productFormRef = ref(null);
const productSelectorVisible = ref(false);
const salesmanSelectorVisible = ref(false);
const customerSelectorVisible = ref(false);
const productDialogVisible = ref(false);
const addProductLoading = ref(false);

const isConfirmed = ref(false);
const form = reactive({
  no: '',
  userid: '',
  ecpno: '',
  equipno:'',
  purchaserHqCode:'',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  term: currentTerm,
  salesmanid: null,
  salesmanName: '',
  agent: '',
  other: `提出异议期限：
结算方式及付款期限：
备品、配件、工具供应办法：
违约责任：
因本合同发生纠纷调解不成是，应在（）人民法院进行诉讼
其他违约事项：`,
  casingcost: 1,
  transcost: 1,
  destination: '',
  bank: '',
  checktype: '',
  postalcode: '',
  fax: '',
  bankcode: '',
  pressurestage: 0,
  receiver: '',
  transtype: '',
  picktype: '',
  telephone: '',
  itemsenddate: '',
  contractSum: 0,
  name: '',
  customerid: null,
  customerName: '',
  legalrepresent: '',
  taxnum: '',
  signdate: '',
  status: 10,
});
// form.term = currentTerm.value
console.log('表格区间', form.term);
const currentProduct = reactive({
  id: undefined,
  no: null,
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
  itemsum: 0
});

const productList = ref([]);

const calculateTotal = (key, fallbackKey = null) => {
  return productList.value.reduce((sum, item) => {
    const value = item[key] ?? (fallbackKey ? item[fallbackKey] : 0);
    return sum + (Number(value) || 0);
  }, 0);
};

const totalAmount = computed(() => calculateTotal('itemsum'));
const totalWeight = computed(() => calculateTotal('itemgrossweight'));

const rules = {
  no: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
  gridno: [{ required: true, message: '请输入电网编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入工程名称', trigger: 'blur' }],
  salesmanid: [{ required: true, message: '请选择销售员', trigger: 'change' }],
  customerid: [{ required: true, message: '请选择客户', trigger: 'change' }],
  signdate: [{ required: true, message: '请选择签定时间', trigger: 'change' }],
  term: [{ required: true, message: '请选择合同所属期间', trigger: 'change' }],
};

const loadContractData = async () => {
  if (!props.contractNo) {
    return;
  }
  try {
    const res = await getContractInfoByNo({ contractNo: props.contractNo });
    const { contractInfo, itemList } = res.data;
    Object.assign(form, contractInfo || {});
    if (form.status > 10) {
      isConfirmed.value = true;
    }
    productList.value = itemList || [];
  } catch (error) {
    ElMessage.error('加载合同数据失败');
  } finally {
    formLoaded.value = true;
  }
};

const selectSalesman = () => {
  salesmanSelectorVisible.value = true;
};

const handleSalesmanSelect = (salesman) => {
  form.salesmanid = salesman.id;
  form.salesmanName = salesman.name;
};

const selectCustomer = () => {
  customerSelectorVisible.value = true;
};

const handleCustomerSelect = (customer) => {
  form.customerid = customer.id;
  form.customerName = customer.descr;
  form.fax = customer.fax;
  form.telephone = customer.phone;
  form.postalcode = customer.postalcode;
  form.bank = customer.bank;
  form.bankcode = customer.bankcode;
  form.taxnum = customer.taxcode;

};

const addProduct = () => {
  isProductEdit.value = false;
  editingProductIndex.value = -1;
  Object.assign(currentProduct, {
    id: undefined,
    no: form.no,
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
    itemsum: 0
  });
  productDialogVisible.value = true;
};

const editProduct = async (index, row) => {
  try {
    const res = await getBasContractItem({ itemId: row.id });
    if (res.success) {
      const { item } = res.data;
      Object.assign(currentProduct, {
        id: item.id,
        no: item.no,
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
        itemsum: item.itemsum || 0
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

const selectProduct = () => {
  productSelectorVisible.value = true;
};

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
      productList.value[editingProductIndex.value] = { ...productData };
      ElMessage.success('产品更新成功');
    } else {
      const res = await createBasContractItem(productData);
      productList.value.push({
        id: res.data.itemId,
        itemid: currentProduct.itemid,
        itemNo: currentProduct.itemNo,
        itemName: currentProduct.itemName,
        itemSpec: currentProduct.itemSpec,
        itemnum: currentProduct.itemnum,
        itemunit: currentProduct.itemunit,
        itemprice: currentProduct.itemprice,
        itemsum: currentProduct.itemsum,
        itemweight: currentProduct.itemweight,
        itemgrossweight: currentProduct.itemgrossweight,
        itemmemo: currentProduct.itemmemo
      });
      ElMessage.success('产品添加成功');
    }
    productDialogVisible.value = false;
  } catch (error) {
    ElMessage.error(isProductEdit.value ? '更新产品失败' : '添加产品失败');
  } finally {
    addProductLoading.value = false;
  }
};

const removeProduct = async (index, row) => {
  if (row.id) {
    try {
      await deleteBasContractItem({ itemId: row.id });
      ElMessage.success('产品删除成功');
      productList.value.splice(index, 1);
    } catch (error) {
      ElMessage.error('产品删除失败');
    }
  } else {
    productList.value.splice(index, 1);
  }
};

const submitForm = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData = { ...form };
        if (isEdit.value) {
          await updateBasContract(submitData);
          ElMessage.success('修改成功');
        } else {
          submitData.userid = userId.value;
          submitData.status = 10;
          if (!submitData.userid) {
            ElMessage.error('请选择客户');
            return;
          }
          if (!submitData.term) {
            ElMessage.error('请选择区间');
            return;
          }
          await createBasContract(submitData);
          console.log('提交表单数据:', submitData);
          ElMessage.success('新增成功');
          emit('close');
        }
      } catch (error) {
        ElMessage.error('保存合同失败');
      }
    }
  });
};

const updateCalculations = () => {
  currentProduct.itemgrossweight = (currentProduct.itemnum * currentProduct.itemweight).toFixed(2);
  currentProduct.itemsum = (currentProduct.itemnum * currentProduct.itemprice).toFixed(2);
};

watch(
  () => props.contractNo,
  (newVal) => {
    if (newVal) {
      loadContractData();
    } else {
      formLoaded.value = true;
    }
  },
  { immediate: true }
);

watch(
  () => [currentProduct.itemnum, currentProduct.itemprice, currentProduct.itemweight],
  () => {
    updateCalculations();
  }
);

onMounted(() => {
  if (!props.contractNo) {
    formLoaded.value = true;
  }
});
</script>

<style scoped>
.contract-form {
  padding: 12px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.page-header h2 {
  margin: 0 0 0 12px;
  color: #303133;
  font-size: 16px;
}

.form-card {
  margin-bottom: 12px;
}

.form-card :deep(.el-card__header) {
  padding: 8px 12px;
  background-color: #f5f7fa;
}

.form-card :deep(.el-card__body) {
  padding: 12px;
}

.card-title {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #606266;
}

.form-actions {
  text-align: center;
  margin-top: 16px;
}

.form-actions .el-button {
  margin: 0 8px;
  min-width: 80px;
}

.empty-product {
  text-align: center;
  padding: 24px 0;
  color: #909399;
  font-size: 13px;
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

</style>