<template>
  <el-dialog
    title="新增生产订单"
    v-model="dialogVisible"
    width="900px"
    :before-close="handleClose"
    class="production-order-dialog"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="140px"
      class="production-order-form"
    >
      <!-- 基本信息 -->
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="20">
        <!-- <el-col :span="12">
          <el-form-item label="采购方总部编码" prop="purchaserHqCode">
            <el-input v-model="form.purchaserHqCode" placeholder="选择排产计划后自动填入" readonly />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="排产计划编码" prop="scheduleCode">
            <el-input 
                  v-model="form.scheduleCode" 
                  placeholder="选择排产计划" 
                  readonly 
                  @click="showSelector = true"
                >
                  <template #append>
                    <el-button @click="showSelector = true"size="small">选择</el-button>
                  </template>
            </el-input>
          </el-form-item>
        </el-col>
                <el-col :span="12">
          <el-form-item label="生产订单号" prop="ipoNo">
            <el-input v-model="form.ipoNo" placeholder="请输入生产订单号" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input v-model="form.supplierCode" placeholder="选择排产计划后自动填入" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName" placeholder="选择排产计划后自动填入" readonly/>
          </el-form-item>
        </el-col>
      </el-row> -->
      
      <el-row :gutter="20">

        <!-- <el-col :span="12">
          <el-form-item label="采购订单行项目ID" prop="poItemId">
            <el-input v-model="form.poItemId" placeholder="选择排产计划后自动填入" readonly/>
          </el-form-item>
        </el-col> -->
      </el-row>

      <!-- 物料信息 -->
      <!-- <el-divider content-position="left">物料信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="品类编码" prop="categoryCode">
            <el-input v-model="form.categoryCode" placeholder="选择排产计划后自动填入" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="种类编码" prop="subclassCode">
            <el-input v-model="form.subclassCode" placeholder="选择排产计划后自动填入" readonly />
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="厂家物料编码" prop="materialsCode">
            <el-input v-model="form.materialsCode" placeholder="请输入厂家物料编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂家物料名称" prop="materialsName">
            <el-input v-model="form.materialsName" placeholder="请输入厂家物料名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="厂家物资单位" prop="materialsUnit">
            <el-input v-model="form.materialsUnit" placeholder="请输入厂家物资单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产数量" prop="amount">
            <el-input v-model.number="form.amount" placeholder="请输入生产数量" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入计量单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品型号" prop="productModel">
            <el-input v-model="form.productModel" placeholder="请输入产品型号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="厂家物料描述" prop="materialsDesc">
        <el-input v-model="form.materialsDesc" type="textarea" placeholder="请输入厂家物料描述" :rows="3" />
      </el-form-item>

      <!-- 时间信息 -->
      <el-divider content-position="left">时间信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划开始日期" prop="planStartDate">
            <el-date-picker
              v-model="form.planStartDate"
              type="date"
              placeholder="请选择计划开始日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完成日期" prop="planFinishDate">
            <el-date-picker
              v-model="form.planFinishDate"
              type="date"
              placeholder="请选择计划完成日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实际开始日期" prop="actualStartDate">
            <el-date-picker
              v-model="form.actualStartDate"
              type="date"
              placeholder="请选择实际开始日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际完成日期" prop="actualFinishDate">
            <el-date-picker
              v-model="form.actualFinishDate"
              type="date"
              placeholder="请选择实际完成日期"
              value-format="YYYY-MM-DD"
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
        <!-- <el-col :span="12">
          <el-form-item label="生产工厂名称" prop="plantName">
            <el-input v-model="form.plantName" placeholder="请输入生产工厂名称" />
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="生产中心" prop="center">
            <el-input v-model="form.center" placeholder="请输入生产中心" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="生产车间名称" prop="workshopName">
            <el-input v-model="form.workshopName" placeholder="请输入生产车间名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">

        <!-- <el-col :span="12">
          <el-form-item label="生产订单状态" prop="ipoStatus">
            <el-input v-model="form.ipoStatus" placeholder="请输入生产订单状态" />
          </el-form-item>
        </el-col> -->
      </el-row>

      <!-- 数据信息 -->
      <!-- <el-divider content-position="left">数据信息</el-divider>
      <el-row :gutter="20">

        <el-col :span="12">
          <el-form-item label="数据拥有方" prop="ownerId">
            <el-input v-model="form.ownerId" placeholder="请输入数据拥有方" />
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据可见方" prop="openId">
            <el-input v-model="form.openId" placeholder="请输入数据可见方" />
          </el-form-item>
        </el-col>
        
      </el-row> -->

      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物资ID分组" prop="productIdGrpNo">
            <el-input v-model="form.productIdGrpNo" placeholder="请输入物资ID分组" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资ID类型" prop="productIdType">
            <el-input v-model="form.productIdType" placeholder="请输入物资ID类型" />
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="销售订单行项目号" prop="soItemNo">
            <el-input v-model="form.soItemNo" placeholder="请输入销售订单行项目号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据关联类型" prop="dataType">
            <el-input v-model="form.dataType" placeholder="请输入数据关联类型" />
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- 其他信息 -->
      <el-divider content-position="left">其他信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="记录创建人" prop="writer">
            <el-input v-model="form.writer" placeholder="请输入记录创建人" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单类型" prop="ipoType">
            <el-input v-model="form.ipoType" placeholder="请输入订单类型" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="3" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>

    <schedule-selector
      v-model:visible="showSelector"
      @select="handleSelect"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { createPlProductionOrder } from '@/api/plmanage/plproductionorder';
import { useUserStore } from '@/store/user';
import scheduleSelector from './scheduleSelector.vue';

const userStore = useUserStore();
const emit = defineEmits(['update:visible', 'success']);

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

const dialogVisible = ref(props.visible);
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    form.ipoNo = props.newCode
  }
});


const showSelector = ref(false)
const handleSelect = (data) => {
  console.log("选择的物料数据")
  console.log(data)
  form.scheduleCode = data.scheduleCode
  form.purchaserHqCode = data.purchaserHqCode
  form.supplierCode = data.supplierCode
  form.supplierName = data.supplierName
  form.categoryCode = data.categoryCode
  form.subclassCode = data.subclassCode
  form.poItemId = data.poItemId
  form.productModel = data.itemSpec
  form.unit = data.itemUnit
}

const formRef = ref(null);
const form = reactive({
  purchaserHqCode: '',
  ipoType: '默认',
  supplierCode: '',
  supplierName: '',
  ipoNo: '',
  categoryCode: '',
  subclassCode: '',
  scheduleCode: '',
  poItemId: '',
  dataType: '',
  soItemNo: '',
  materialsCode: '',
  materialsName: '',
  materialsUnit: '',
  materialsDesc: '',
  amount: null,
  unit: '',
  productIdGrpNo: '',
  productIdType: '',
  productModel: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: '',
  plantName: '',
  workshopName: '',
  ipoStatus: '',
  center: '',
  dataSource: '手工录入',
  dataSourceCreateTime: new Date().toISOString(),
  ownerId: '',
  openId: '',
  createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  status: '10',
  writer: userStore.realName,
  remark: ''
});

const rules = reactive({
  purchaserHqCode: [{ required: true, message: '请输入采购方总部编码', trigger: 'blur' }],
  ipoType: [{ required: true, message: '请输入订单类型', trigger: 'blur' }],
  supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  ipoNo: [{ required: true, message: '请输入生产订单号', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '请输入品类编码', trigger: 'blur' }],
  subclassCode: [{ required: true, message: '请输入种类编码', trigger: 'blur' }],
  poItemId: [{ required: true, message: '请输入采购订单行项目ID', trigger: 'blur' }],
  materialsCode: [{ required: true, message: '请输入厂家物料编码', trigger: 'blur' }],
  materialsName: [{ required: true, message: '请输入厂家物料名称', trigger: 'blur' }],
  materialsUnit: [{ required: true, message: '请输入厂家物资单位', trigger: 'blur' }],
  materialsDesc: [{ required: true, message: '请输入厂家物料描述', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入生产数量', trigger: 'blur' },
    { type: 'number', message: '生产数量必须为数字', trigger: 'blur' }
  ],
  unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
  planStartDate: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
  planFinishDate: [{ required: true, message: '请选择计划完成日期', trigger: 'change' }],
  dataSource: [{  message: '请输入数据来源', trigger: 'blur' }],
  dataSourceCreateTime: [{ required: true, message: '请选择来源数据创建时间', trigger: 'change' }],
  writer: [{ required: true, message: '请输入记录创建人', trigger: 'blur' }]
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
        const response = await createPlProductionOrder(form);
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
.production-order-dialog {
  border-radius: 8px;
}

.production-order-form {
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
.el-date-picker {
  width: 100%;
}

.el-textarea {
  width: 100%;
}
</style>