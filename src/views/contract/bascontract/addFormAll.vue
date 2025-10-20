<template>
  <CustomDialog 
    :visible="dialogVisible"
    title="新增合同及产品"
    :is-full-screen="isFullscreen"
    :header-height="60"
    width="90%"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <div class="contract-form">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" size="small">
        <!-- 合同基本信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">合同基本信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="厂内合同号" prop="no">
                <el-input v-model="form.no" placeholder="请输入厂内合同号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="器材合同号" prop="equipno">
                <el-input v-model="form.equipno" placeholder="请输入器材合同号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国网经法合同号" prop="ecpno">
                <el-input v-model="form.ecpno" placeholder="请输入国网经法合同号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="工程名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入工程名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电网编号" prop="gridno">
                <el-input v-model.number="form.gridno" placeholder="请输入电网编号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电压等级(KV)" prop="pressurestage">
                <el-input-number v-model="form.pressurestage" placeholder="请输入电压等级" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码" prop="purchaserHqCode">
                <el-input v-model="form.purchaserHqCode" placeholder="请输入采购方总部编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" placeholder="请输入供应商名称" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 客户与销售信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">客户与销售信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="销售员" prop="salesmanid">
                <el-input v-model="form.salesmanName" placeholder="请选择销售员" readonly @click="selectSalesman">
                  <template #append>
                    <el-button @click="selectSalesman" size="small" type="primary">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户" prop="customerid">
                <el-input v-model="form.customerName" placeholder="请选择客户" readonly @click="selectCustomer">
                  <template #append>
                    <el-button @click="selectCustomer" size="small" type="primary">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户代理人" prop="agent">
                <el-input v-model="form.agent" placeholder="请输入客户代理人" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="法定代表人" prop="legalrepresent">
                <el-input v-model="form.legalrepresent" placeholder="请输入法定代表人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税务号" prop="taxnum">
                <el-input v-model="form.taxnum" placeholder="请输入税务号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签订时间" prop="signdate">
                <el-date-picker 
                  v-model="form.signdate" 
                  type="date" 
                  placeholder="请选择签订时间" 
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%" 
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="客户电话" prop="telephone">
                <el-input v-model="form.telephone" placeholder="请输入客户电话" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户传真" prop="fax">
                <el-input v-model="form.fax" placeholder="请输入客户传真" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接货人" prop="receiver">
                <el-input v-model="form.receiver" placeholder="请输入接货人" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="运输方式" prop="transtype">
                <el-select v-model="form.transtype" placeholder="请选择运输方式" style="width: 100%">
                  <el-option label="汽运" value="汽运" />
                  <el-option label="铁路" value="铁路" />
                  <el-option label="空运" value="空运" />
                  <el-option label="海运" value="海运" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交提货方式" prop="picktype">
                <el-select v-model="form.picktype" placeholder="请选择交提货方式" style="width: 100%">
                  <el-option label="自提" value="自提" />
                  <el-option label="送货" value="送货" />
                  <el-option label="物流" value="物流" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接货地点" prop="destination">
                <el-input v-model="form.destination" placeholder="请输入接货地点" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="包装费承担" prop="casingcost">
                <el-select v-model="form.casingcost" placeholder="请选择包装费承担方" style="width: 100%">
                  <el-option label="供方" :value="1" />
                  <el-option label="需方" :value="2" />
                  <el-option label="各半" :value="3" />
                  <el-option label="其他" :value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费承担" prop="transcost">
                <el-select v-model="form.transcost" placeholder="请选择运费承担方" style="width: 100%">
                  <el-option label="供方" :value="1" />
                  <el-option label="需方" :value="2" />
                  <el-option label="各半" :value="3" />
                  <el-option label="其他" :value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属期间" prop="term">
                <el-select v-model="form.term" placeholder="请选择合同所属期间" style="width: 100%">
                  <el-option v-for="term in terms" :key="term.id" :label="term.term" :value="term.term" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 银行与财务信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">银行与财务信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开户银行" prop="bank">
                <el-input v-model="form.bank" placeholder="请输入开户银行" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="bankcode">
                <el-input v-model="form.bankcode" placeholder="请输入银行账号" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 其他信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">其他信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="其他条款">
                <el-input 
                  type="textarea" 
                  :rows="3" 
                  v-model="form.other" 
                  placeholder="请输入其他条款" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input 
                  type="textarea" 
                  :rows="3" 
                  v-model="form.memo" 
                  placeholder="请输入备注" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 合同产品信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">合同产品信息</span>
          </template>

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
        </el-card>
      </el-form>
    </div>

    <!-- 销售员选择弹窗 -->
    <SalesmanSelector v-model="salesmanSelectorVisible" @select="handleSalesmanSelect" />

    <!-- 客户选择弹窗 -->
    <CustomerSelector v-model="customerSelectorVisible" @select="handleCustomerSelect" />

    <!-- 产品添加/编辑弹窗 -->
    <el-dialog v-model="productDialogVisible" :title="isProductEdit ? '编辑产品' : '添加产品'" width="800px" :close-on-click-modal="false">
      <el-form ref="productFormRef" :model="currentProduct" :rules="productRules" label-width="100px" size="small">
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

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">保存合同</el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createBasContract, getContractItemPage, importContractItem, createBasContractItem, updateBasContractItem, deleteBasContractItem, getBasContractItem, getContractItemTotal } from '@/api/contract/bascontract';
import SalesmanSelector from './components/SalesmanSelector.vue';
import CustomerSelector from './components/CustomerSelector.vue';
import ProductSelector from './components/ProductSelector.vue';
import ImportResultDialog from './components/ImportResultDialog.vue';
import CustomDialog from '@/components/common/CustomDialog.vue';
import { useTermStore } from '@/store/term.js';
import { useUserStore } from '@/store/user.js';
import { baseURL } from '@/utils/request';

// 获取当前的期数term
const termStore = useTermStore();
const currentTerm = termStore.term;
const terms = termStore.terms;

// 获取userId
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

// Props 和 Emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'success']);

// 弹窗显示控制
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  }
});

// 组件状态
const formRef = ref(null);
const productFormRef = ref(null);
const submitLoading = ref(false);
const salesmanSelectorVisible = ref(false);
const customerSelectorVisible = ref(false);
const isFullscreen = ref(false);
const materialLoading = ref(false);
const productDialogVisible = ref(false);
const isProductEdit = ref(false);
const editingProductIndex = ref(-1);
const addProductLoading = ref(false);
const productSelectorVisible = ref(false);
const importResultVisible = ref(false);
const importResultData = ref({});
const totalAmount = ref(0);
const totalWeight = ref(0);

// 初始表单数据
const getInitialFormData = () => ({
  no: '',
  userid: '',
  ecpno: '',
  equipno: '',
  purchaserHqCode: '',
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
  memo: '',
  gridno: ''
});

// 表单数据
const form = reactive(getInitialFormData());

// 验证规则
const rules = {
  no: [{ required: true, message: '请输入厂内合同号', trigger: 'blur' }],
  gridno: [{ required: true, message: '请输入电网编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入工程名称', trigger: 'blur' }],
  salesmanid: [{ required: true, message: '请选择销售员', trigger: 'change' }],
  customerid: [{ required: true, message: '请选择客户', trigger: 'change' }],
  signdate: [{ required: true, message: '请选择签订时间', trigger: 'change' }],
  term: [{ required: true, message: '请选择合同所属期间', trigger: 'change' }],
  supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }]
};

// 物料搜索表单
const materialSearchForm = reactive({
  keyword: ''
});

// 物料分页
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 物料列表
const materialList = ref([]);

// 当前产品数据
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

// 产品验证规则
const productRules = {
  itemName: [{ required: true, message: '请选择产品', trigger: 'change' }],
  itemnum: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  itemunit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  itemRealPrice: [{ required: true, message: '请输入销售单价', trigger: 'blur' }],
  itemweight: [{ required: true, message: '请输入单重', trigger: 'blur' }]
};

// 是否已确认
const isConfirmed = computed(() => form.status > 10);

// 选择销售员
const selectSalesman = () => {
  salesmanSelectorVisible.value = true;
};

const handleSalesmanSelect = (salesman) => {
  form.salesmanid = salesman.id;
  form.salesmanName = salesman.name;
};

// 选择客户
const selectCustomer = () => {
  customerSelectorVisible.value = true;
};

const handleCustomerSelect = (customer) => {
  form.customerid = customer.id;
  form.customerName = customer.descr;
  form.fax = customer.fax || '';
  form.telephone = customer.phone || '';
  form.postalcode = customer.postalcode || '';
  form.bank = customer.bank || '';
  form.bankcode = customer.bankcode || '';
  form.taxnum = customer.taxcode || '';
};

// 提交合同表单
const submitForm = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        const submitData = { ...form };
        submitData.userid = userId.value;
        submitData.status = 10;

        if (!submitData.userid) {
          ElMessage.error('用户信息异常，请重新登录');
          return;
        }

        await createBasContract(submitData);
        ElMessage.success('合同创建成功');
        emit('success', submitData);
        dialogVisible.value = false;
      } catch (error) {
        console.error('保存合同失败:', error);
        ElMessage.error('保存合同失败，请稍后重试');
      } finally {
        submitLoading.value = false;
      }
    } else {
      ElMessage.warning('请完善必填信息');
    }
  });
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(form, getInitialFormData());
  materialList.value = [];
  materialPagination.currentPage = 1;
  materialPagination.total = 0;
  materialSearchForm.keyword = '';
  totalAmount.value = 0;
  totalWeight.value = 0;
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  emit('update:visible', false);
};

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.no) return;

  materialLoading.value = true;
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: form.no,
      itemName: materialSearchForm.keyword
    };

    const response = await getContractItemPage(params);
    if (response.success) {
      const itemData = response.data.itemList;
      materialList.value = itemData.list || [];
      materialPagination.total = itemData.totalRow || 0;
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
    formData.append('contractNo', form.no);

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

// 获取合同总金额和总重量
const getContractTotal = async () => {
  try {
    const res = await getContractItemTotal({ contractNo: form.no });
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
  loadMaterialList();
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
  if (!form.no) {
    ElMessage.warning('请先填写厂内合同号');
    return;
  }
  isProductEdit.value = false;
  editingProductIndex.value = -1;
  Object.assign(currentProduct, {
    id: undefined,
    no: form.no,
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
  if (!productFormRef.value) return;

  productFormRef.value.validate(async (valid) => {
    if (valid) {
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
        productDialogVisible.value = false;
      } catch (error) {
        ElMessage.error(isProductEdit.value ? '更新产品失败' : '添加产品失败');
      } finally {
        addProductLoading.value = false;
      }
    } else {
      ElMessage.warning('请完善产品信息');
    }
  });
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
    await loadMaterialList();
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

// 监听弹窗显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    resetForm();
  } else {
    resetForm();
    salesmanSelectorVisible.value = false;
    customerSelectorVisible.value = false;
    productSelectorVisible.value = false;
    importResultVisible.value = false;
    submitLoading.value = false;
    addProductLoading.value = false;
  }
});

// 监听合同号变化
watch(() => form.no, () => {
  materialList.value = [];
  materialPagination.currentPage = 1;
  materialPagination.total = 0;
  totalAmount.value = 0;
  totalWeight.value = 0;
  loadMaterialList();
});
</script>

<style scoped>
.contract-form {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 8px;
}

.form-card {
  margin-bottom: 6px;
  border-radius: 4px;
}

.form-card :deep(.el-card__header) {
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.form-card :deep(.el-card__body) {
  padding: 8px;
}

.card-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.summary-info {
  float: right;
  font-size: 12px;
  color: #606266;
}

:deep(.el-form-item) {
  margin-bottom: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 12px;
  line-height: 28px;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  font-size: 12px;
  height: 28px;
  line-height: 28px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
  padding: 0 8px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  border-radius: 4px;
  font-size: 12px;
}

:deep(.el-dialog__body) {
  padding: 10px 15px 0;
}

:deep(.el-dialog__footer) {
  padding: 0 15px 15px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
  padding-top: 8px;
}

:deep(.el-button) {
  font-size: 12px;
  padding: 6px 12px;
}

:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  background-color: #fafafa;
}

.pagination {
  margin-top: 8px;
  text-align: right;
}

.contract-form::-webkit-scrollbar {
  display: none;
}

.contract-form {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 1200px) {
  :deep(.el-dialog) {
    width: 98% !important;
  }
  :deep(.el-form-item__label) {
    font-size: 11px;
  }
  :deep(.el-input__inner),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .contract-form {
    padding: 0 5px;
  }
  
  .form-card :deep(.el-card__body) {
    padding: 6px;
  }
  
  :deep(.el-col) {
    margin-bottom: 4px;
  }

  :deep(.el-form-item__label) {
    font-size: 10px;
  }

  :deep(.el-input__inner),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 10px;
    height: 24px;
    line-height: 24px;
  }
}
</style>