<template>
  <el-dialog
    title="新增入库记录"
    v-model="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
    class="custom-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      size="default"
    >
      <!-- 第一部分：单据与合同信息 (只读为主) -->
      <div class="section-container">
        <div class="section-title">来源信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="检验单号" prop="inspOrderNo">
              <el-input v-model="form.inspOrderNo" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="form.contractNo" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送货单位" prop="deliveryUnit">
              <el-input v-model="form.deliveryUnit" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单编号" prop="woNo">
              <el-input v-model="form.woNo" readonly class="is-readonly" />
            </el-form-item>
          </el-col>

           <el-col :span="12">
            <el-form-item label="物料类别" prop="inclass">
              <el-input v-model="form.inclass" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 第二部分：物料详情 (只读) -->
      <div class="section-container">
        <div class="section-title">物料详情</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物料编号" prop="itemCode">
              <el-input v-model="form.itemCode" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="form.itemName" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="itemSpec">
              <el-input v-model="form.itemSpec" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="计量单位" prop="itemUnit">
              <el-input v-model="form.itemUnit" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量单位" prop="weightUnit">
              <el-input v-model="form.weightUnit" placeholder="如: kg" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 第三部分：入库作业数据 (核心填写区) -->
      <div class="section-container highlight-section">
        <div class="section-title primary-text">入库录入</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="存放位置" prop="warehouse">
              <el-input v-model="form.warehouse" placeholder="请输入库位" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库时间" prop="operateTime">
              <el-date-picker
                v-model="form.operateTime"
                type="datetime"
                placeholder="选择时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="实际数量" prop="actualQuantity">
              <el-input
                v-model.number="form.actualQuantity"
                type="number"
                placeholder="0.00"
              >
                <template #append>{{ form.itemUnit }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际重量" prop="actualWeight">
              <el-input
                v-model.number="form.actualWeight"
                type="number"
                placeholder="0.00"
              >
                <template #append>{{ form.weightUnit || 'kg' }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="price">
              <el-input
                v-model.number="form.price"
                type="number"
                placeholder="0.00"
              >
                <template #prefix>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
           <el-col :span="8">
            <el-form-item label="总金额" prop="totalPrice">
              <el-input v-model="form.totalPrice" readonly class="is-readonly total-price-input" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期间" prop="term">
              <el-input v-model="form.term" placeholder="例如：202501" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库保员" prop="writer">
              <el-input v-model="form.writer" readonly class="is-readonly" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input
                v-model="form.memo"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确认入库</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { saveFinishInout } from '@/api/plstoreinout/finishInout';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['success', 'close', 'update:visible']);

// 使用计算属性处理 v-model，避免直接修改 props 的警告
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const formRef = ref(null);
const now = new Date();

// 表单数据
const form = reactive({
  inspOrderNo: '',
  warehouse: '',
  contractNo: '',
  contractName: '',
  deliveryUnit: '',
  itemCode: '',
  itemName: '',
  itemSpec: '',
  itemUnit: '',
  weightUnit: 'kg',
  actualQuantity: undefined, // 改为undefined避免显示0
  actualWeight: undefined,
  inclass: '',
  price: undefined,
  totalPrice: 0,
  memo: '',
  operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  status: 1,
  type: 1,
  writer: userStore.realName || '',
  term: '',
  woNo: '',
});

// 字段映射
const fieldMap = {
  inspOrderNo: 'orderNo',
  deliveryUnit: 'deliveryUnit',
  itemCode: 'itemCode',
  itemName: 'itemName',
  itemSpec: 'itemSpec',
  itemUnit: 'itemUnit',
  actualQuantity: 'amount',
  actualWeight: 'actualWeight',
  price: 'price',
  inclass: 'inclass',
  woNo: 'woNo',
};

// 校验规则
const formRules = {
  warehouse: [{ required: true, message: '请输入存放位置', trigger: 'blur' }],
  actualQuantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  actualWeight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  operateTime: [{ required: true, message: '请选择入库时间', trigger: 'change' }],
  term: [{ required: true, message: '请输入期间', trigger: 'blur' }],
  weightUnit: [{ required: true, message: '请输入重量单位', trigger: 'blur' }],
  woNo: [{ required: true, message: '请输入工单编号', trigger: 'blur' }],
};

onMounted(() => {
  mergeFormData();
});

watch(() => props.formData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) mergeFormData();
}, { deep: true });

watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      if (!form.operateTime) form.operateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      // 计算一次总价
      calculateTotalPrice();
    });
  }
});

const mergeFormData = () => {
  if (!props.formData) return;
  console.log('mergeFormData', props.formData);
  Object.keys(form).forEach(formKey => {
    const dataKey = fieldMap[formKey] || formKey;
    if (props.formData[dataKey] !== undefined) {
      form[formKey] = props.formData[dataKey];
    }
  });
  calculateTotalPrice();
};

watch(() => [form.price, form.actualQuantity], calculateTotalPrice);

function calculateTotalPrice() {
  const p = parseFloat(form.price) || 0;
  const q = parseFloat(form.actualQuantity) || 0;
  form.totalPrice = (p * q).toFixed(2);
}

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (!form.writer) {
        ElMessage.warning('请完善录入人信息');
        return;
      }
      try {
        const res = await saveFinishInout(form);
        if (res.code === 200 || res.success) {
          ElMessage.success('入库成功！');
          dialogVisible.value = false;
          emit('success');
        } else {
          ElMessage.error(res.msg || '操作失败');
        }
      } catch (e) {
        ElMessage.error('网络请求异常');
      }
    }
  });
};

const handleDialogClose = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
  emit('close');
};
</script>

<style scoped>
/* 弹窗整体微调 */
.custom-dialog {
  border-radius: 8px;
}

/* 区域容器 */
.section-container {
  margin-bottom: 18px;
  padding: 0 10px;
}

/* 区域标题 */
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #dcdfe6;
  line-height: 1;
}

/* 重点区域（入库录入）样式增强 */
.highlight-section {
  background-color: #f9fafc;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.primary-text {
  color: #409eff;
  border-left-color: #409eff;
}

/* 只读输入框样式 - 看起来像背景 */
:deep(.is-readonly .el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: none !important;
  border: 1px solid #e4e7ed;
}

/* 强调总金额 */
:deep(.total-price-input .el-input__inner) {
  color: #f56c6c;
  font-weight: bold;
}

/* 底部按钮居中或靠右 */
.dialog-footer {
  text-align: right;
  padding-top: 10px;
}

/* 输入框内文字对齐 */
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>