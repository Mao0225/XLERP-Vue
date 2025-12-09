<template>
  <el-dialog
    v-model="visible"
    title="发起工序报检"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    class="report-custom-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="inspFormRef" 
      :model="inspForm" 
      :rules="inspRules" 
      label-width="100px"
      class="styled-form"
    >
      <div class="info-block" style="border-left-color: #E6A23C;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单号" style="margin-bottom: 0;">
              <span class="info-text">{{ inspForm.woNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" style="margin-bottom: 0;">
              <span class="info-text">{{ inspForm.ipoNo || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" style="margin-bottom: 0;">
              <span class="info-text">{{ inspForm.contractNo || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" style="margin-bottom: 0;">
              <span class="info-text">{{ inspForm.contractName || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-divider">填写报检信息</div>

      <el-row :gutter="20">
          <el-col :span="12">
              <el-form-item label="报检人" prop="reporter">
                <el-input v-model="inspForm.reporter" placeholder="请输入姓名">
                  <template #prefix><el-icon><User /></el-icon></template>
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="报检数量" prop="amount">
                <el-input-number 
                  v-model="inspForm.amount" 
                  :min="1" 
                  style="width: 100%" 
                  controls-position="right"
                  placeholder="请输入"
                />
              </el-form-item>
          </el-col>
      </el-row>

      <el-row :gutter="20">
          <el-col :span="12">
               <el-form-item label="申请时间" prop="reportApplyTime">
                  <el-date-picker
                      v-model="inspForm.reportApplyTime"
                      type="datetime"
                      disabled
                      placeholder="当前时间"
                      style="width: 100%"
                  />
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="送货单位" prop="deliveryUnit">
                <el-input v-model="inspForm.deliveryUnit" placeholder="请输入单位名称">
                   <template #prefix><el-icon><House /></el-icon></template>
                </el-input>
              </el-form-item>
          </el-col>
      </el-row>

      <el-form-item label="备注说明" prop="remark">
        <el-input 
          v-model="inspForm.remark" 
          type="textarea" 
          :rows="3" 
          placeholder="请填写备注信息" 
        />
      </el-form-item>

    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="warning" @click="submitInsp" :loading="inspSubmitLoading">确 定 发 起</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { createInspWorkOrder } from '@/api/plinspection/inspWorkOrder';
import { User, House } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model
  formData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'success']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const inspSubmitLoading = ref(false);
const inspFormRef = ref(null);

const inspForm = reactive({
  woNo: '',
  ipoNo: '',
  itemId: '',
  contractNo: '',
  contractName: '',
  reporter: '',
  reportApplyTime: '',
  amount: undefined,
  deliveryUnit: '',
  remark: '',
  status: '0' 
});

const inspRules = {
  reporter: [{ required: true, message: '请输入报检人', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入报检数量', trigger: 'blur' }],
  deliveryUnit: [{ required: true, message: '请输入送货单位', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
};

// 监听弹窗打开
watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => {
      if (inspFormRef.value) inspFormRef.value.resetFields();
      
      // 填充基础信息
      inspForm.woNo = props.formData.woNo;
      inspForm.ipoNo = props.formData.ipoNo;
      inspForm.itemId = props.formData.itemId;
      inspForm.contractNo = props.formData.contractNo || '';
      inspForm.contractName = props.formData.contractName || '';
      
      inspForm.status = '0';
      inspForm.reportApplyTime = new Date(); // 当前时间
    });
  }
});

const handleClose = () => {
  visible.value = false;
};

const submitInsp = async () => {
  if (!inspFormRef.value) return;
  
  await inspFormRef.value.validate(async (valid) => {
    if (valid) {
      inspSubmitLoading.value = true;
      try {
        const params = { ...inspForm };
        
        const res = await createInspWorkOrder(params);
        if (res.code === 200) {
          ElMessage.success('发起报检成功');
          emit('success');
          handleClose();
        } else {
          ElMessage.error(res.msg || '发起报检失败');
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('系统异常，请稍后重试');
      } finally {
        inspSubmitLoading.value = false;
      }
    }
  });
};
</script>

<style scoped lang="scss">
.info-block {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-left: 3px solid #E6A23C; 
  
  .info-text {
    font-weight: bold;
    color: #303133;
    font-size: 14px;
  }
}

.form-divider {
  font-size: 13px;
  color: #909399;
  margin: 15px 0;
  display: flex;
  align-items: center;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e4e7ed;
  }
  &::before { margin-right: 10px; }
  &::after { margin-left: 10px; }
}
</style>