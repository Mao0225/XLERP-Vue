<template>
  <el-dialog v-model="dialogVisible" title="新增入库单" width="800px" :close-on-click-modal="false" @closed="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="add-form">
      <!-- 基本信息 -->
      <div class="form-row">
        <el-form-item label="单据编号" prop="docNo">
          <el-input v-model="form.docNo" placeholder="请输入单据编号" />
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
      
      <!-- <div class="form-row">
        <el-form-item label="发货单位" prop="deliveryOrg">
          <el-input 
                  v-model="form.deliveryOrg" 
                  placeholder="选择发货单位" 
                  readonly 
                  @click="showSupplierSelector = true"
                >
                  <template #append>
                    <el-button @click="showSupplierSelector = true" size="small">选择</el-button>
                  </template>
            </el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="requester">
          <el-input v-model="form.requester" placeholder="请输入申请人" />
        </el-form-item>
      </div> -->

      <!-- 人员信息 -->
      <div class="form-row">
        <el-form-item label="经手人" prop="handler">
          <el-input v-model="form.handler" placeholder="请输入经手人" />
        </el-form-item>
        <el-form-item label="库管员" prop="storekeeper">
          <el-input v-model="form.storekeeper" placeholder="请输入库管员" />
        </el-form-item>
      </div>

      <!-- 其他信息 -->
      <!-- <div class="form-row">
        <el-form-item label="是否有发票" prop="hasInvoice">
          <el-radio-group v-model="form.hasInvoice">
            <el-radio :label="1">有</el-radio>
            <el-radio :label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务期间" prop="term">
          <el-input 
          v-model="form.term" 
          :rows="3"
          placeholder="请输入业务期间"
        />
        </el-form-item>
      </div> -->
      
      <el-form-item label="单据备注" prop="remark">
        <el-input 
          v-model="form.remark" 
          type="textarea" 
          :rows="3"
          placeholder="请输入单据备注"
        />
      </el-form-item>
    </el-form>

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

  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { createPlMatInout } from '@/api/plstoreinout/matinout.js';
import { useTermStore } from '@/store/term.js';
import { useUserStore } from '@/store/user.js';
import supplierSelector from '../components/supplierSelector.vue';



const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  newCode:{
    type: String,
    default: ''
  }
});

const showSupplierSelector = ref(false);

const selectSupplier = (supplier) => {
  form.deliveryOrg = supplier.descr;
  showSupplierSelector.value = false;
};

const emit = defineEmits(['update:visible', 'success']);

const termStore = useTermStore();
const userStore = useUserStore();
const currentTerm = computed(() => termStore.currentTerm);

const formRef = ref();
const loading = ref(false);

// 计算属性处理弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 表单数据
const form = reactive({
  docNo: '',
  inOutType: 1, // 1=入库，2=出库
  transactionDate: new Date().toISOString().split('T')[0], // 默认当前日期
  deliveryOrg: '',
  receiveOrg: '', // 保留但不展示
  handler: userStore.realName || '', // 默认当前用户
  storekeeper: '',
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
  dialogVisible.value = newVal
  if (newVal) {
    form.docNo = props.newCode
  }
})

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(form, {
    docNo: '',
    inOutType: 1,
    transactionDate: '',
    deliveryOrg: '',
    receiveOrg: '',
    handler: '',
    storekeeper: '',
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
    emit('success');
    handleClose();
  } catch (error) {
    console.error('保存失败', error);
    if (error.message && error.message !== 'Validation failed') {
      ElMessage.error('保存失败：' + error.message);
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
</script>

<style scoped>
.add-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .add-form {
    max-height: 50vh;
    padding: 0 10px;
  }
}
</style>