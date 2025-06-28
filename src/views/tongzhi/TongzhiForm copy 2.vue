<template>
  <div class="contract-form">
    <!-- 确保 form 数据加载完成后再渲染 -->
    <el-form v-if="formLoaded" ref="formRef" :model="form" :rules="rules" label-width="80px" size="small">
      <!-- 合同信息 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">合同信息</span>
        </template>
        
        <el-row :gutter="12">
          <el-col :span="3">
            <el-form-item label="合同号">
              <el-input v-model="form.no" placeholder="合同号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工程名称">
              <el-input v-model="form.name" placeholder="工程名称" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="电网编号">
              <el-input v-model.number="form.gridno" placeholder="电网编号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="签定时间">
              <el-input v-model="form.signdate" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="销售员">
              <el-input v-model="form.salesmanName" placeholder="销售员" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户">
              <el-input v-model="form.customerName" placeholder="客户" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="客户代理人">
              <el-input v-model="form.agent" placeholder="客户代理人" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="法定代表人">
              <el-input v-model="form.legalrepresent" placeholder="法定代表人" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="税务号">
              <el-input v-model="form.taxnum" placeholder="税务号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="交货时间">
              <el-input v-model="form.itemsenddate" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="到货地点">
              <el-input v-model="form.destination" placeholder="到货地点" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="接货人">
              <el-input v-model="form.receiver" placeholder="接货人" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="3">
            <el-form-item label="运输方式">
              <el-input v-model="form.transtype" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="交提货方式">
              <el-input v-model="form.picktype" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="验收方式">
              <el-input v-model="form.checktype" placeholder="验收方式" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="包装费承担">
              <el-input :value="getCasingCostText(form.casingcost)" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="运费承担">
              <el-input :value="getTransCostText(form.transcost)" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="电压等级">
              <el-input v-model.number="form.pressurestage" placeholder="电压等级(KV)" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3"> 
            <el-form-item label="客户电话">
              <el-input v-model="form.telephone" placeholder="客户电话" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="客户传真">
              <el-input v-model="form.fax" placeholder="客户传真" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="邮政编码">
              <el-input v-model="form.postalcode" placeholder="邮政编码" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开户银行">
              <el-input v-model="form.bank" placeholder="开户银行" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="账号">
              <el-input v-model="form.bankcode" placeholder="账号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="期间">
              <el-input v-model="form.term" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="10" style="text-align: center;">
            <el-form-item label="其他条款">
              <el-input type="textarea" :rows="7" v-model="form.other" placeholder="其他条款" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="closeForm">关闭</el-button>
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
            </div>
          </div>
        </template>

        <el-table :data="productList" border size="small" style="width: 100%">
          <el-table-column prop="id" label="产品id" width="30" />
          <el-table-column prop="itemNo" label="产品编号" width="120" />
          <el-table-column prop="itemName" label="产品名称" min-width="50" />
          <el-table-column prop="itemSpec" label="规格型号" min-width="30" />
          <el-table-column prop="itemnum" label="数量" min-width="30" />
          <el-table-column prop="itemunit" label="单位" min-width="20" />
          <el-table-column prop="noticeid" label="通知编号" min-width="60" />
          <el-table-column prop="noticedrawno" label="图纸编号" min-width="50" />
          <el-table-column prop="noticeinstead" label="替代型号" min-width="30" />
          <el-table-column prop="noticename" label="通知名称" min-width="60" />
          <el-table-column prop="noticeauther" label="作者" min-width="60" />
          <el-table-column 
            prop="noticebuilddate" 
            label="日期" 
            min-width="60"
            :formatter="formatDate" 
          />
          <el-table-column prop="noticecomment" label="通知备注" min-width="60" />
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">制定通知</el-button>
            </template> 
          </el-table-column>
        </el-table>
        
        <div v-if="productList.length === 0" class="empty-product">
          <p>暂无产品信息</p>
        </div>
      </el-card>
    </el-form>

    <!-- 编辑产品对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑产品信息" width="80%">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px" size="small">
        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="产品编号" prop="itemNo">
              <el-input v-model="editForm.itemNo" placeholder="产品编号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品名称" prop="itemName">
              <el-input v-model="editForm.itemName" placeholder="产品名称" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="规格型号" prop="itemSpec">
              <el-input v-model="editForm.itemSpec" placeholder="规格型号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="数量" prop="itemnum">
              <el-input-number v-model.number="editForm.itemnum" placeholder="数量" :min="1" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单位" prop="itemunit">
              <el-input v-model="editForm.itemunit" placeholder="单位" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="12">
          <el-col :span="4">
            <el-form-item label="通知编号" prop="noticeid">
              <el-input v-model="editForm.noticeid" placeholder="通知编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="图纸编号" prop="noticedrawno">
              <el-input v-model="editForm.noticedrawno" placeholder="图纸编号" />
              <el-button type="primary" size="small" @click="openTuzhiDialog">选择图纸</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="替代型号" prop="noticeinstead">
              <el-input v-model="editForm.noticeinstead" placeholder="替代型号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="通知名称" prop="noticename">
              <el-input v-model="editForm.noticename" placeholder="通知名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="通知作者" prop="noticeauther">
              <el-input v-model="editForm.noticeauther" placeholder="通知作者" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="通知制定日期" prop="noticebuilddate">
              <el-date-picker
                v-model="editForm.noticebuilddate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="通知备注" prop="noticecomment">
              <el-input 
                v-model="editForm.noticecomment" 
                type="textarea" 
                :rows="3" 
                placeholder="通知备注" 
              />
           </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择图纸对话框 -->
    <el-dialog v-model="tuzhiDialogVisible" title="选择图纸" width="80%">
      <tongzhituzhi @selectTuzhi="handleSelectTuzhi" />
      <template #footer>
        <el-button @click="tuzhiDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getContractInfoByNo } from '@/api/contract/bascontract.js';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import Tongzhituzhi from './tongzhituzhi.vue'; // 引入选择图纸组件
import { useUserStore } from '@/store/user'

// 获取当前的期数term
import { useTermStore } from '@/store/term.js';
const termStore = useTermStore();
const currentTerm = termStore.term;
const terms = termStore.terms; // 区间列表
console.log('当前区间为就是iscurrent为1的区间', currentTerm);

const props = defineProps({
  contractNo: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close']);

const formLoaded = ref(false);
const isEdit = computed(() => !!props.contractNo);

const formRef = ref(null);

const form = reactive({
  no: '',
  userid: '',
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
  signdate: ''
});

const productList = ref([]);

// 编辑对话框相关
const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editForm = reactive({
  itemNo: '',
  itemName: '',
  itemSpec: '',
  itemnum: 0,
  itemunit: '',
  noticeid: '',
  noticedrawno: '',
  noticeinstead: '',
  noticename: '',
  noticecomment: '',
  noticeauther: '',
  noticebuilddate: ''
});
const currentEditIndex = ref(-1); // 当前编辑的产品在列表中的索引

const editRules = {
  noticeid: [{ required: true, message: '请输入通知编号', trigger: 'blur' }],
  noticedrawno: [{ required: true, message: '请选择图纸编号', trigger: 'blur' }],
  noticeinstead: [{ required: true, message: '请输入替代型号', trigger: 'blur' }],
  noticename: [{ required: true, message: '请输入通知名称', trigger: 'blur' }],
  noticecomment: [{ required: true, message: '请输入通知备注', trigger: 'blur' }],
  noticeauther: [{ required: true, message: '请输入通知作者', trigger: 'blur' }],
  noticebuilddate: [{ required: true, message: '请选择通知制定日期', trigger: 'change' }]
};

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
//转换日期
// 格式化日期为 yyyy-mm-dd 格式
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return '';
  
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const loadContractData = async () => {
  if (!props.contractNo) {
    return;
  }
  try {
    const res = await getContractInfoByNo({ contractNo: props.contractNo });
    const { contractInfo, itemList } = res.data;
    Object.assign(form, contractInfo || {});
    productList.value = itemList || [];
  } catch (error) {
    ElMessage.error('加载合同数据失败');
    console.error('加载合同数据失败', error);
  } finally {
    formLoaded.value = true;
  }
};

const getCasingCostText = (value) => {
  const map = {
    1: '供方',
    2: '需方',
    3: '各半',
    400: '其他'
  };
  return map[value] || value;
};

const getTransCostText = (value) => {
  const map = {
    1: '供方',
    2: '需方',
    3: '各半',
    400: '其他'
  };
  return map[value] || value;
};

const closeForm = () => {
  emit('close');
};

// 获取当前日期，格式为YYYY-MM-DD
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 打开编辑对话框
// 打开编辑对话框
const openEditDialog = (row) => {
  console.log('打开编辑对话框', row);
  
  // 复制数据到编辑表单
  Object.assign(editForm, row);
  
  // 设置通知编号默认值为合同号
  if (!editForm.noticeid || editForm.noticeid === 'N/A') {
    editForm.noticeid = props.contractNo;
  } 
  
  // 设置通知名称默认值为工程名称
  if (!editForm.noticename || editForm.noticename === 'N/A') {
    editForm.noticename = form.name;
  }
  
  const userStore = useUserStore()
  const userDesc = userStore.desc || ''
  
  // 设置通知作者的默认值
  if (!editForm.noticeauther || editForm.noticeauther === 'N/A') {
    editForm.noticeauther = userDesc // 使用用户信息中的desc字段
  }
  
  // 设置通知制定日期的默认值
  if (!editForm.noticebuilddate) {
    editForm.noticebuilddate = getCurrentDate();
  }
  
  // 记录当前编辑的行索引
  currentEditIndex.value = productList.value.findIndex(item => item.id === row.id);
  
  // 显示对话框
  editDialogVisible.value = true;
  
  // 添加日志以确认对话框状态
  console.log('对话框状态:', editDialogVisible.value);
  
  // 延迟执行，确保DOM更新完成
  setTimeout(() => {
    const dialogElement = document.querySelector('.el-dialog');
    if (dialogElement) {
      console.log('对话框元素存在');
    } else {
      console.log('对话框元素不存在');
      
      // 尝试强制显示对话框
      editDialogVisible.value = false;
      setTimeout(() => {
        editDialogVisible.value = true;
      }, 100);
    }
  }, 0);
};

// 保存产品信息
// 引入更新物料的API
import { updatetuzhiItem } from '@/api/tongzhi/tongzhi.js';

// 保存产品信息
const saveProduct = async () => {
  // 表单验证
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      let loading = null; // 声明loading变量
      try {
        // 使用ElLoadingService显示加载状态
        loading = ElLoading.service({
          lock: true,
          text: '正在保存产品信息...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 准备要更新的数据
        const updatedItem = {
          ...productList.value[currentEditIndex.value],
          ...editForm,
          noticestatus: 10 // 添加通知状态参数，值为10
        };
        
        // 调用API更新数据
        await updatetuzhiItem(updatedItem);
        
        // 更新成功后，更新本地数据
        //Object.assign(productList.value[currentEditIndex.value], editForm);
        Object.assign(productList.value[currentEditIndex.value], updatedItem);
        ElMessage.success('产品信息更新成功');
        editDialogVisible.value = false;
      } catch (error) {
        ElMessage.error('更新产品信息失败: ' + error.message);
        console.error('更新产品信息失败', error);
      } finally {
        // 关闭加载状态
        if (loading) loading.close(); // 确保loading已定义
      }
    } else {
      ElMessage.error('请检查表单信息');
      return false;
    }
  });
};

const tuzhiDialogVisible = ref(false);

// 打开选择图纸对话框
const openTuzhiDialog = () => {
  tuzhiDialogVisible.value = true;
};

// 处理选择图纸事件
const handleSelectTuzhi = (tuzhi) => {
  editForm.noticedrawno = tuzhi.tuzhibianhao;
  tuzhiDialogVisible.value = false;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* 确保对话框显示 */
:deep(.el-dialog) {
  display: block !important;
}
</style>    