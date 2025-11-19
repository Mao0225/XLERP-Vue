<template>
  <el-dialog
    title="新增入库记录"
    v-model="props.visible"
    width="800px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="110px"
      class="compact-form"
    >
      <div class="form-row">
        <el-form-item label="存放位置" prop="warehouse">
          <el-input v-model="form.warehouse" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="请输入"  readonly size="small" />
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="form.contractName" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="检验单据号" prop="inspOrderNo">
          <el-input v-model="form.inspOrderNo" placeholder="请输入" readonly size="small" />
        </el-form-item>
        <el-form-item label="炉批号" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="物料编号" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入"  readonly size="small" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="规格型号" prop="materialSpec">
          <el-input v-model="form.materialSpec" placeholder="请输入" readonly size="small" />
        </el-form-item>
        <el-form-item label="计量单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="物料类别" prop="inclass">
          <el-input v-model="form.inclass" placeholder="请输入" readonly size="small" />
        </el-form-item>
        <el-form-item label="到货材质" prop="material">
          <el-input v-model="form.material" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="计划规格" prop="planSpec">
          <el-input v-model="form.planSpec" placeholder="请输入" readonly size="small" />
        </el-form-item>
        <el-form-item label="计划材质" prop="planMaterial">
          <el-input v-model="form.planMaterial" placeholder="请输入" readonly size="small" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="计划数量" prop="planQuantity">
          <el-input
            v-model.number="form.planQuantity"
            type="number"
            placeholder="请输入"
            size="small"
            readonly
            min="0"
          />
        </el-form-item>
        <el-form-item label="计划重量" prop="planWeight">
          <el-input
            v-model.number="form.planWeight"
            type="number"
            placeholder="请输入"
            size="small"
            readonly
            min="0"
          />
        </el-form-item>
      </div>


    <div class="form-row">

        <el-form-item label="重量单位" prop="weightUnit">
          <el-input v-model="form.weightUnit" placeholder="请输入"  size="small" />
        </el-form-item>
                 <el-form-item label="库保员" prop="writer">
          <el-input
            v-model="form.writer"
            placeholder="请输入库保员"
            readonly
            size="small"
          />
        </el-form-item>
      </div>

      



      <div class="form-row">
        <el-form-item label="实际数量" prop="actualQuantity">
          <el-input
            v-model.number="form.actualQuantity"
            type="number"
            placeholder="必填"
            size="small"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="实际重量" prop="actualWeight">
          <el-input
            v-model.number="form.actualWeight"
            type="number"
            placeholder="必填"
            size="small"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="单价" prop="price">
          <el-input
            v-model.number="form.price"
            type="number"
            placeholder="必填"
            size="small"
            min="0.01"
            step="0.01"
          />
        </el-form-item>
        <el-form-item label="金额" prop="totalPrice">
          <el-input
            v-model.number="form.totalPrice"
            type="number"
            placeholder="自动计算"
            size="small"
            readonly
          />
        </el-form-item>
      </div>

      <div class="form-row">
<el-form-item label="入库时间" prop="operateTime">
  <el-date-picker
    v-model="form.operateTime"
    type="datetime"                 
    placeholder="请选择入库时间"
    size="small"
    value-format="YYYY-MM-DD HH:mm:ss" 
    :default-value="now"              
    style="width: 100%"
  />
</el-form-item>
        <el-form-item label="期间" prop="term">
          <el-input v-model="form.term" placeholder="例如：202501" size="small" />
        </el-form-item>
      </div>


      <div class="form-row full-width">
        <el-form-item label="备注" prop="memo">
          <el-input
            v-model="form.memo"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            size="small"
          />
        </el-form-item>

      </div>
    </el-form>

    <template #footer>
      <el-button size="small" @click="props.visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit">提交入库</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted,nextTick,computed  } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { createPlMatInout } from '@/api/plstoreinout/matinout.js';
import { getContractMaterial } from '@/api/contract/bascontractmaterial'  // 确保路径正确
import { useUserStore } from '@/store/user'
const userStore = useUserStore()


// 定义props
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


const emit = defineEmits(['success', 'close']);

// 定义表单引用
const formRef = ref(null);

// 表单字段定义
const form = reactive({
  inspOrderNo: '',
  warehouse: '',
  contractNo: '',
  contractName: '',
  supplierName: '',
  materialCode: '',
  materialName: '',
  materialSpec: '',
  materialUnit: '',
  weightUnit:'',
  actualQuantity: 0,
  actualWeight: 0,
  batchNo: '',
  inclass: '',
  material: '',
  planMaterial: '',
  planSpec: '',
  planQuantity: 0,
  planWeight: 0,
  price: 0,
  totalPrice: 0,
  memo: '',
    operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 1, 
  inventoryCheckType: '',
  type: 1, // 固定为入库类型
  writer: userStore.realName, // 后续可从登录信息中获取
  term: ''
});


const selectedMat = ref(null)// 新增：selectedMat 与表单的字段映射关系（可根据实际字段名调整）
const selectedMatFieldMap = reactive({
  // key: 表单字段名, value: selectedMat中的对应字段名
  contractNo: 'contractNo', // 示例：selectedMat中的合同编号字段
  contractName: 'contractName', // 示例：selectedMat中的合同名字段
  materialUnit: 'unit', // 示例：selectedMat中的计量单位字段
  inclass: 'inclass', // 示例：selectedMat中的物料类别字段
  planSpec: 'itemSpec', // 示例：selectedMat中的计划规格字段
  planMaterial: 'material', // 示例：selectedMat中的计划材质字段
  planQuantity: 'planQuantity', // 示例：selectedMat中的计划数量字段
  planWeight: 'planWeight', // 示例：selectedMat中的计划重量字段
  price: 'unitPrice' // 示例：selectedMat中的单价字段
});

const fieldMap = reactive({

  inspOrderNo: 'orderNo', // 保持一致可不改
  supplierName: 'supplierName', // 示例：selectedMat中的供应商名字段

  materialCode: 'itemCode',
  materialName: 'itemName',
  materialSpec: 'itemSpec',
  weightUnit: 'unit',
  material: 'actualMaterial',
  actualQuantity: 'actualQuantity',
  actualWeight: 'actualWeight',
  batchNo: 'batchNo',
  price: 'price'
  // 可根据实际需求扩展更多映射
});

// 修改：加载采购物料方法（修复props.orderData错误）
const loadPurchaseMaterial = async () => {
  // 改为从props.formData中获取purchaseId（根据实际字段名调整）
  if (!props.formData?.purchaseId) {
    selectedMat.value = null;
    return;
  }
  try {
    const res = await getContractMaterial({ id: props.formData.purchaseId });
    if (res.success && res.data?.record) {
      selectedMat.value = res.data.record;
      // 新增：加载成功后填充表单
      fillFormFromSelectedMat();
    } else {
      selectedMat.value = null;
    }
  } catch (e) {
    console.error('加载采购物料失败', e);
    selectedMat.value = null;
  }
};

// 新增：从selectedMat填充表单的方法
const fillFormFromSelectedMat = () => {
  if (!selectedMat.value) return;

  Object.keys(selectedMatFieldMap).forEach(formKey => {
    const matKey = selectedMatFieldMap[formKey];
    // 如果selectedMat中存在该字段且值不为undefined，填充到表单
    if (selectedMat.value.hasOwnProperty(matKey) && selectedMat.value[matKey] !== undefined) {
      form[formKey] = selectedMat.value[matKey];
    }
  });

  // 填充后重新计算金额
  calculateTotalPrice();
};


// 用于日历默认打开到“此刻”
const now = computed(() => new Date())
// 表单校验规则
const formRules = reactive({
  warehouse: [{ required: true, message: '请输入', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入', trigger: 'blur' }],
  materialCode: [{ required: true, message: '请输入', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入', trigger: 'blur' }],
  materialSpec: [{ required: true, message: '请输入', trigger: 'blur' }],
  materialUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
  actualQuantity: [
    { required: true, message: '请输入', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '必须大于0', trigger: 'blur' }
  ],
  actualWeight: [
    { required: true, message: '请输入', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '必须大于0', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '必须大于0', trigger: 'blur' }
  ],
  operateTime: [{ required: true, message: '请选择', trigger: 'change' }],
  batchNo: [{ required: true, message: '请输入', trigger: 'blur' }],
  term: [{ required: true, message: '请输入', trigger: 'blur' }],
  inspOrderNo: [{ required: true, message: '请输入', trigger: 'blur' }],
  contractNo: [{ required: true, message: '请输入', trigger: 'blur' }],
  contractName: [{ required: true, message: '请输入', trigger: 'blur' }],
  writer:[{ required: true, message: '请输入', trigger: 'blur' }],
  inclass:[{ required: true, message: '请输入', trigger: 'blur' }],
  material:[{ required: true, message: '请输入', trigger: 'blur' }],
  weightUnit:[{ required: true, message: '请输入', trigger: 'blur' }],
});

// 生命周期：组件挂载时合并formData
onMounted(() => {
  mergeFormData();
  loadPurchaseMaterial();
});
// 监听formData变化，重新合并
watch(
  () => props.formData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      mergeFormData();
      loadPurchaseMaterial(); // 新增：formData变化时重新加载物料
    }
  },
  { deep: true }
);
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      nextTick(() => {
        // 如果用户之前没选过，或者是新建，就默认填现在的时间
        if (!form.operateTime) {
          form.operateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
  },
  { immediate: true }   // 组件首次挂载时也执行一次
)
// 【修改后】合并传入的formData到表单中（支持自定义字段映射）
const mergeFormData = () => {
  if (!props.formData || Object.keys(props.formData).length === 0) return;

  Object.keys(form).forEach(formKey => {
    // 获取formData中对应的字段名（优先使用映射，没有则用表单字段名）
    const dataKey = fieldMap[formKey] || formKey;
    
    // 如果formData中存在该字段且值不为undefined，则赋值给表单
    if (props.formData.hasOwnProperty(dataKey) && props.formData[dataKey] !== undefined) {
      form[formKey] = props.formData[dataKey];
    }
  });

  // 合并后重新计算金额
  calculateTotalPrice();
};

// 监听单价和数量变化，自动计算金额
watch(
  () => [form.price, form.actualQuantity],
  () => calculateTotalPrice(),
  { deep: true }
);

// 计算金额（单价 * 实际数量）
const calculateTotalPrice = () => {
  form.totalPrice = form.price && form.actualQuantity 
    ? (form.price * form.actualQuantity).toFixed(2) - 0 
    : 0;
};

// 处理表单提交
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    
    // 补充录入人信息（根据项目实际登录状态调整）
    if (!form.writer) {
      // form.writer = useUserStore().username; // 示例：从用户状态获取
      ElMessage.warning('请完善录入人信息');
      return;
    }

    const res = await createPlMatInout(form);
    if (res.code === 200 || res.success) {
      ElMessage.success('入库成功！');
      props.visible = false;
      emit('success'); // 触发父组件刷新列表
    } else {
      ElMessage.error(`失败：${res.msg || '服务器错误'}`);
    }
  } catch (error) {
    ElMessage.error('请完善必填项');
  }
};

// 处理弹窗关闭
const handleDialogClose = () => {
  formRef.value?.resetFields();
  // 重置表单数据
  Object.keys(form).forEach(key => {
    form[key] = typeof form[key] === 'number' ? 0 : '';
  });
  form.status = 1;
  form.type = 1;
  emit('close');
};

// 定义事件
</script>

<style scoped>
/* 紧凑表单样式 */
.compact-form {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 行间距缩小 */
  padding: 5px 0;
}

/* 两列布局行 */
.form-row {
  display: flex;
  gap: 15px; /* 列间距缩小 */
  width: 100%;
}

/* 占满一行 */
.form-row.full-width {
  flex-direction: column;
  gap: 5px;
}

/* 每个表单项占比50% */
.form-row > .el-form-item {
  flex: 1;
  margin-bottom: 0 !important; /* 清除默认间距 */
}

/* 调整输入框高度 */
.el-input--small .el-input__inner,
.el-select--small .el-select__wrapper,
.el-date-picker--small {
  height: 32px !important;
  line-height: 32px !important;
}

/* 文本域紧凑样式 */
.el-textarea--small .el-textarea__inner {
  padding: 6px 12px !important;
}

/* 标签文字紧凑 */
.el-form-item__label {
  padding-right: 8px !important;
  font-size: 13px !important;
}

/* 弹窗底部按钮间距 */
.el-dialog__footer {
  padding: 10px 20px 10px !important;
}
</style>