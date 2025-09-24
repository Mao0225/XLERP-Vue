<template>
  <el-dialog
    title="新增报工单"
    v-model="dialogVisible"
    width="900px"
    :before-close="handleClose"
    class="work-order-dialog"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="140px"
      class="work-order-form"
    >
      <!-- 基本信息 -->
      <el-divider content-position="left">基本信息</el-divider>
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购方总部编码" prop="purchaserHqCode">
            <el-input v-model="form.purchaserHqCode" placeholder="选择工单后自动填充"  readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input v-model="form.supplierCode" placeholder="选择工单后自动填充" readonly />
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产订单编号" prop="ipoNo">
            <el-input v-model="form.ipoNo" placeholder="选择工单后自动填充" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产工单编号" prop="woNo">
            <el-input 
                  v-model="form.woNo" 
                  placeholder="选择生产工单号" 
                  readonly 
                  @click="showSelector = true"
                >
                  <template #append>
                    <el-button @click="showSelector = true"size="small">选择</el-button>
                  </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产批次号" prop="productBatchNo">
            <el-input v-model="form.productBatchNo" placeholder="请输入生产批次号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序名称" prop="processName">
            <el-input v-model="form.processName" placeholder="请输入工序名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- <el-col :span="12">
          <el-form-item label="客户所属省份" prop="buyerProvince">
            <el-input v-model="form.buyerProvince" placeholder="请输入客户所属省份" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="报工单编号" prop="reportNo">
            <el-input v-model="form.reportNo" placeholder="请输入报工单编号" readonly />
          </el-form-item>
        </el-col>
                <el-col :span="12">
          <el-form-item label="工序编码" prop="processCode">
            <el-input v-model="form.processCode" placeholder="请输入工序编码" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工序信息 -->
      <!-- <el-divider content-position="left">工序信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="品类编码" prop="categoryCode">
            <el-input v-model="form.categoryCode" placeholder="选择工单后自动填充"  readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="种类编码" prop="subclassCode">
            <el-input v-model="form.subclassCode" placeholder="选择工单后自动填充" readonly/>
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- 时间信息 -->
      <el-divider content-position="left">时间信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划开始时间" prop="planStartTime">
            <el-date-picker
              v-model="form.planStartTime"
              type="datetime"
              placeholder="请选择计划开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束时间" prop="planEndTime">
            <el-date-picker
              v-model="form.planEndTime"
              type="datetime"
              placeholder="请选择计划结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实际开始时间" prop="actualStartDate">
            <el-date-picker
              v-model="form.actualStartDate"
              type="datetime"
              placeholder="请选择实际开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际结束时间" prop="actualFinishDate">
            <el-date-picker
              v-model="form.actualFinishDate"
              type="datetime"
              placeholder="请选择实际结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="来源数据创建时间" prop="dataSourceCreateTime">
            <el-date-picker
              v-model="form.dataSourceCreateTime"
              type="datetime"
              placeholder="请选择来源数据创建时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
                <el-col :span="12">
          <el-form-item label="数据来源" prop="dataSource">
            <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 生产信息 -->
      <el-divider content-position="left">生产信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产车间编码" prop="workshopCode">
            <el-input v-model="form.workshopCode" placeholder="请输入生产车间编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产车间名称" prop="workshopName">
            <el-input v-model="form.workshopName" placeholder="请输入生产车间名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="form.deviceNo" placeholder="请输入设备编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品内部ID号" prop="insideNo">
            <el-input v-model="form.insideNo" placeholder="请输入产品内部ID号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实物ID" prop="entityId">
            <el-input v-model="form.entityId" placeholder="请输入实物ID" />
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="生产工艺路线编码" prop="processNo">
            <el-input v-model="form.processNo" placeholder="请输入生产工艺路线编码" />
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 其他信息 -->
      <el-divider content-position="left">其他信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="录入人" prop="writer">
            <el-input v-model="form.writer" placeholder="请输入录入人" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>


    <work-order-selector v-model:visible="showSelector" @select="handleSelect" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { createPlReportWorkOrder } from '@/api/plmanage/plreportworkorder';
import { useUserStore } from '@/store/user';
import workOrderSelector from './workOrderSelector.vue';

const userStore = useUserStore();
const emit = defineEmits(['update:visible', 'success']);

const showSelector = ref(false);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  newCode: {
    type: String,
    default: ''
  }
});

const dialogVisible = ref(props.visible);
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    form.reportNo = props.newCode;
  }
});


const handleSelect = (data) => {
  console.log("选择的物料数据")
  console.log(data)
  form.purchaserHqCode = data.purchaserHqCode
  form.supplierCode = data.supplierCode
  form.ipoNo = data.ipoNo
  form.woNo = data.woNo
  form.categoryCode = data.categoryCode
  form.subclassCode = data.subclassCode
}


const formRef = ref(null);
const form = reactive({
  purchaserHqCode: '',
  supplierCode: '',
  ipoNo: '',
  woNo: '',
  productBatchNo: '',
  processName: '',
  categoryCode: '',
  subclassCode: '',
  processCode: '',
  dataSource: '手工录入',
  dataSourceCreateTime: new Date().toISOString(),
  buyerProvince: '',
  insideNo: '',
  deviceNo: '',
  processNo: '',
  workshopId: '',
  workshopCode: '',
  workshopName: '',
  entityId: '',
  planStartTime: '',
  planEndTime: '',
  actualStartDate: '',
  actualFinishDate: '',
  orderStatus: '',
  status: '10',
  writer: userStore.realName,
  createdTime: '',
  updatedTime: '',
  reportNo: ''
});

const rules = reactive({
  purchaserHqCode: [{ required: true, message: '请输入采购方总部编码', trigger: 'blur' }],
  supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  ipoNo: [{ required: true, message: '请输入生产订单编号', trigger: 'blur' }],
  woNo: [{ required: true, message: '请输入生产工单编号', trigger: 'blur' }],
  productBatchNo: [{ required: true, message: '请输入生产批次号', trigger: 'blur' }],
  processName: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '请输入品类编码', trigger: 'blur' }],
  subclassCode: [{ required: true, message: '请输入种类编码', trigger: 'blur' }],
  processCode: [{ required: true, message: '请输入工序编码', trigger: 'blur' }],
  dataSource: [{ message: '请输入数据来源', trigger: 'blur' }],
  dataSourceCreateTime: [{ required: true, message: '请选择来源数据创建时间', trigger: 'change' }],
  buyerProvince: [{  message: '请输入客户所属省份', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
});

const handleClose = () => {
  dialogVisible.value = false;
  emit('update:visible', false);
  formRef.value.resetFields();
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await createPlReportWorkOrder(form);
        if (response.code === 200) {
          ElMessage.success(response.msg);
          emit('success');
          handleClose();
        }
      } catch (error) {
        ElMessage.error('保存失败');
      }
    }
  });
};
</script>

<style scoped>
.work-order-dialog {
  border-radius: 8px;
}

.work-order-form {
  padding: 0 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
}

.el-divider {
  margin: 16px 0;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-input,
.el-date-picker,
.el-select {
  width: 100%;
}
</style>
