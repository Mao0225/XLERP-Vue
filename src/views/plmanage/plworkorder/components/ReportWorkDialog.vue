<template>
  <el-dialog
    v-model="visible"
    title="新增工序报工"
    width="550px"
    append-to-body
    :close-on-click-modal="false"
    class="report-custom-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="reportFormRef" 
      :model="reportForm" 
      :rules="reportRules" 
      label-width="90px"
      class="styled-form"
    >
      <div class="info-block">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单号" style="margin-bottom: 0;">
              <span class="info-text">{{ formData.woNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" style="margin-bottom: 0;">
              <span class="info-text">{{ formData.ipoNo || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-divider">填写报工信息</div>

      <el-form-item label="选择工序" prop="processCode">
        <el-select 
          v-model="reportForm.processCode" 
          placeholder="请选择工序" 
          style="width: 100%"
          @change="handleReportProcessChange"
        >
          <template #prefix><el-icon><Operation /></el-icon></template>
          <!-- 过滤下拉框，只允许选择生产工序 (type=1) -->
          <el-option
            v-for="item in processList.filter(p => p.processType == 1)"
            :key="item.processCode"
            :label="item.processName"
            :value="item.processCode"
          >
            <span style="float: left">{{ item.processName }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px">{{ item.processCode }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-row :gutter="20">
          <el-col :span="12">
              <el-form-item label="工序编号">
                  <el-input v-model="reportForm.processCode" disabled placeholder="自动显示">
                      <template #prefix><el-icon><CollectionTag /></el-icon></template>
                  </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="报工数量" prop="amount">
                <el-input-number 
                  v-model="reportForm.amount" 
                  :min="1" 
                  style="width: 100%" 
                  controls-position="right"
                  placeholder="请输入"
                />
              </el-form-item>
          </el-col>
      </el-row>

      <el-form-item label="报工人员" prop="writer">
        <el-input v-model="reportForm.writer" placeholder="请输入报工人员姓名">
          <template #prefix><el-icon><User /></el-icon></template>
        </el-input>
      </el-form-item>

      <el-form-item label="生产车间" prop="workshopName">
        <el-input v-model="reportForm.workshopName" placeholder="请输入车间名称">
          <template #prefix><el-icon><House /></el-icon></template>
        </el-input>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitReport" :loading="submitLoading">确 定 提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { createPlReportWorkOrder } from '@/api/plmanage/plreportworkorder';
import { Operation, CollectionTag, User, House } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model
  formData: { type: Object, default: () => ({}) },
  processList: { type: Array, default: () => [] },
  defaultProcessCode: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'success']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const submitLoading = ref(false);
const reportFormRef = ref(null);

const reportForm = reactive({
  processCode: '',
  processName: '',
  amount: undefined,
  writer: '',
  workshopName: ''
});

const reportRules = {
  processCode: [{ required: true, message: '请选择工序', trigger: 'change' }],
  amount: [{ required: true, message: '请输入报工数量', trigger: 'blur' }],
  writer: [{ required: true, message: '请输入报工人员', trigger: 'blur' }],
  workshopName: [{ required: true, message: '请输入车间名称', trigger: 'blur' }]
};

// 监听弹窗打开，初始化数据
watch(() => props.modelValue, (val) => {
  if (val) {
    if (reportFormRef.value) reportFormRef.value.resetFields();
    reportForm.amount = undefined;
    reportForm.processName = '';
    
    // 如果外部传入了默认工序
    if (props.defaultProcessCode) {
      // 检查该工序是否在列表里且是生产工序
      const exists = props.processList.find(p => p.processCode === props.defaultProcessCode && p.processType == 1);
      if (exists) {
        reportForm.processCode = props.defaultProcessCode;
        handleReportProcessChange(props.defaultProcessCode);
      }
    }
  }
});

const handleReportProcessChange = (val) => {
  const selectedProcess = props.processList.find(item => item.processCode === val);
  reportForm.processName = selectedProcess ? selectedProcess.processName : '';
};

const handleClose = () => {
  visible.value = false;
};

const submitReport = async () => {
  if (!reportFormRef.value) return;
  
  await reportFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        const params = {
          woNo: props.formData.woNo,
          ipoNo: props.formData.ipoNo, 
          itemId: props.formData.itemId,
          processCode: reportForm.processCode,
          processName: reportForm.processName,
          amount: reportForm.amount,
          writer: reportForm.writer,
          workshopName: reportForm.workshopName
        };

        const res = await createPlReportWorkOrder(params);
        if (res.code === 200) {
          ElMessage.success('报工成功');
          emit('success');
          handleClose();
        } else {
          ElMessage.error(res.msg || '报工失败');
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('系统异常，请稍后重试');
      } finally {
        submitLoading.value = false;
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
  border-left: 3px solid #67C23A; 
  
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