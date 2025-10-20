<template>
  <CustomDialog
    :visible="dialogVisible"
    title="编辑合同"
    :close-on-click-modal="false"
    :header-height="60"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <div class="contract-form">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" size="default">
        <!-- 合同基本信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">合同基本信息</span>
          </template>
          
          <!-- 第一行：合同编号相关 -->
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

          <!-- 第二行：工程信息 -->
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

          <!-- 第三行：供应商信息 -->
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码" prop="purchaserHqCode">
                <el-input v-model="form.purchaserHqCode" placeholder="请输入采购方总部编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 客户与销售信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">客户与销售信息</span>
          </template>
          
          <!-- 第一行：销售员和客户 -->
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

          <!-- 第二行：法定代表人等 -->
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

          <!-- 第三行：联系方式 -->
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
              <el-form-item label="邮政编码" prop="postalcode">
                <el-input v-model="form.postalcode" placeholder="请输入邮政编码" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 交货与运输信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">交货与运输信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="交货时间" prop="itemsenddate">
                <el-date-picker 
                  v-model="form.itemsenddate" 
                  type="date" 
                  placeholder="请选择交货时间" 
                  value-format="YYYY-MM-DD"
                  style="width: 100%" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到货地点" prop="destination">
                <el-input v-model="form.destination" placeholder="请输入到货地点" />
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
              <el-form-item label="验收方式" prop="checktype">
                <el-input v-model="form.checktype" placeholder="请输入验收方式" />
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
                  <el-option label="其他" :value="400" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费承担" prop="transcost">
                <el-select v-model="form.transcost" placeholder="请选择运费承担方" style="width: 100%">
                  <el-option label="供方" :value="1" />
                  <el-option label="需方" :value="2" />
                  <el-option label="各半" :value="3" />
                  <el-option label="其他" :value="400" />
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
                  :rows="4" 
                  v-model="form.other" 
                  placeholder="请输入其他条款" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input 
                  type="textarea" 
                  :rows="4" 
                  v-model="form.memo" 
                  placeholder="请输入备注" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>

    <!-- 销售员选择弹窗 -->
    <SalesmanSelector v-model="salesmanSelectorVisible" @select="handleSalesmanSelect" />

    <!-- 客户选择弹窗 -->
    <CustomerSelector v-model="customerSelectorVisible" @select="handleCustomerSelect" />

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">更新合同</el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { updateBasContract } from '@/api/contract/bascontract.js';
import SalesmanSelector from './components/SalesmanSelector.vue';
import CustomerSelector from './components/CustomerSelector.vue';
import CustomDialog from '@/components/common/CustomDialog.vue'; // 添加导入

// 获取当前的期数term
import { useTermStore } from '@/store/term.js';
const termStore = useTermStore();
const currentTerm = termStore.term;
const terms = termStore.terms;

// 获取userId
import { useUserStore } from '@/store/user.js';
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

// Props 和 Emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
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
const submitLoading = ref(false);
const salesmanSelectorVisible = ref(false);
const customerSelectorVisible = ref(false);
const isFullscreen = ref(false); // 添加全屏状态

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
  gridno: '',
  ...props.initialData // Merge initialData to populate form
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

// 提交表单
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

        await updateBasContract(submitData);
        ElMessage.success('合同更新成功');
        emit('success', submitData);
        dialogVisible.value = false;
      } catch (error) {
        console.error('更新合同失败:', error);
        ElMessage.error('更新合同失败，请稍后重试');
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
  // 重新设置默认值
  Object.assign(form, getInitialFormData());
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  emit('update:visible', false);
};

// 弹窗关闭时的回调
const handleDialogClosed = () => {
  resetForm();
  salesmanSelectorVisible.value = false;
  customerSelectorVisible.value = false;
  submitLoading.value = false;
};

// 监听弹窗显示状态，每次打开时重置表单
watch(dialogVisible, (newVal) => {
  if (newVal) {
    resetForm();
  }
});
</script>

<style scoped>
.contract-form {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 10px;
}

.form-card {
  margin-bottom: 8px;
  border-radius: 4px;
}

.form-card :deep(.el-card__header) {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.form-card :deep(.el-card__body) {
  padding: 10px;
}

.card-title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 15px;
  line-height: 32px;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  font-size: 15px;
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
  padding: 0 10px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  border-radius: 4px;
  font-size: 15px;
}

:deep(.custom-dialog-body) { /* 更新为 custom-dialog-body */
  padding: 10px 15px 0;
}

:deep(.custom-dialog-footer) { /* 更新为 custom-dialog-footer */
  padding: 0 15px 15px;
  border-top: 1px solid #ebeef5;
  margin-top: 10px;
  padding-top: 10px;
}

:deep(.el-button) {
  font-size: 15px;
  padding: 8px 16px;
}

/* 移除滚动条 */
.contract-form::-webkit-scrollbar {
  display: none;
}

.contract-form {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  :deep(.custom-dialog) { /* 更新为 custom-dialog */
    width: 98% !important;
  }
  :deep(.el-form-item__label) {
    font-size: 14px;
  }
  :deep(.el-input__inner),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .contract-form {
    padding: 0 5px;
  }
  
  .form-card :deep(.el-card__body) {
    padding: 8px;
  }
  
  :deep(.el-col) {
    margin-bottom: 6px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }

  :deep(.el-input__inner),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 13px;
    height: 28px;
    line-height: 28px;
  }
}
</style>