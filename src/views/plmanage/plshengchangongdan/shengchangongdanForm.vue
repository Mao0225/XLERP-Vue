<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1200px"
    @closed="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" size="small">
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="section-title">基本信息</div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购方总部编码" prop="purchaserHqCode">
              <el-input v-model="form.purchaserHqCode" placeholder="请输入采购方总部编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商生产订单序号" prop="ipoNo">
              <el-input v-model="form.ipoNo" placeholder="请输入供应商生产订单序号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产工单编码" prop="woNo">
              <el-input v-model="form.woNo" placeholder="请输入生产工单编码" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 供应商信息 -->
      <div class="form-section">
        <div class="section-title">供应商信息</div>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 物料信息 -->
      <div class="form-section">
        <div class="section-title">物料信息</div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="品类编码" prop="categoryCode">
              <el-input v-model="form.categoryCode" placeholder="请输入品类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种类编码" prop="subclassCode">
              <el-input v-model="form.subclassCode" placeholder="请输入种类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂家物料编码" prop="materialsCode">
              <el-input v-model="form.materialsCode" placeholder="请输入厂家物料编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="厂家物料描述" prop="materialsDescription">
              <el-input v-model="form.materialsDescription" placeholder="请输入厂家物料描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料批次" prop="materialsBatch">
              <el-input v-model="form.materialsBatch" placeholder="请输入物料批次" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 生产信息 -->
      <div class="form-section">
        <div class="section-title">生产信息</div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="生产数量" prop="amount">
              <el-input v-model.number="form.amount" placeholder="请输入生产数量" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入计量单位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工单状态" prop="woStatus">
              <el-select v-model="form.woStatus" placeholder="请选择工单状态" style="width: 100%">
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="产品型号规格" prop="modelSpec">
              <el-input v-model="form.modelSpec" placeholder="请输入产品型号规格" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电压等级" prop="voltageLevel">
              <el-input v-model="form.voltageLevel" placeholder="请输入电压等级" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工艺路线编码" prop="processRouteNo">
              <el-input v-model="form.processRouteNo" placeholder="请输入工艺路线编码" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 时间计划 -->
      <div class="form-section">
        <div class="section-title">时间计划</div>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="计划开始日期" prop="planStartDate">
              <el-date-picker
                v-model="form.planStartDate"
                type="date"
                placeholder="选择计划开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划完成日期" prop="planFinishDate">
              <el-date-picker
                v-model="form.planFinishDate"
                type="date"
                placeholder="选择计划完成日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际开始日期" prop="actualStartDate">
              <el-date-picker
                v-model="form.actualStartDate"
                type="date"
                placeholder="选择实际开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际完成日期" prop="actualFinishDate">
              <el-date-picker
                v-model="form.actualFinishDate"
                type="date"
                placeholder="选择实际完成日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 扩展信息 -->
      <div class="form-section">
        <div class="section-title">扩展信息</div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="实物ID" prop="entityCode">
              <el-input v-model="form.entityCode" placeholder="请输入实物ID" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据来源" prop="dataSource">
              <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源数据创建时间" prop="dataSourceCreateTime">
              <el-date-picker
                v-model="form.dataSourceCreateTime"
                type="datetime"
                placeholder="选择来源数据创建时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="数据拥有方" prop="ownerId">
              <el-input v-model="form.ownerId" placeholder="请输入数据拥有方" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据可见方" prop="openId">
              <el-input v-model="form.openId" placeholder="请输入数据可见方" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>



<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  createPlshengchangongdan, 
  updatePlshengchangongdan 
} from '@/api/plmanage/plshengchangongdan'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'add'
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:visible', 'submit', 'cancel'])

// 工单状态选项
const statusOptions = [
  { id: 1, value: '待处理' },
  { id: 2, value: '处理中' },
  { id: 3, value: '已完成' },
  { id: 4, value: '已取消' },
  { id: 5, value: '已过期' }
]

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 弹窗标题
const dialogTitle = computed(() => props.type === 'add' ? '新增生产工单' : '编辑生产工单')

// 表单引用
const formRef = ref(null)

// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  ipoNo: '',
  supplierCode: '',
  supplierName: '',
  woNo: '',
  categoryCode: '',
  subclassCode: '',
  materialsCode: '',
  materialsDescription: '',
  materialsBatch: '',
  amount: 0.000,
  unit: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: '',
  woStatus: 1, // 默认待处理
  entityCode: '',
  processRouteNo: '',
  voltageLevel: '',
  dataSource: '',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  modelSpec: ''
})

// 表单验证规则
const rules = {
  purchaserHqCode: [
    { required: true, message: '请输入采购方总部编码', trigger: 'blur' },
    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
  ],
  ipoNo: [
    { required: true, message: '请输入供应商生产订单序号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  supplierCode: [
    { required: true, message: '请输入供应商编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  woNo: [
    { required: true, message: '请输入生产工单编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  categoryCode: [
    { required: true, message: '请输入品类编码', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  subclassCode: [
    { required: true, message: '请输入种类编码', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  materialsCode: [
    { required: true, message: '请输入厂家物料编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入生产数量', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  unit: [
    { required: true, message: '请输入计量单位', trigger: 'blur' },
    { max: 5, message: '长度不能超过5个字符', trigger: 'blur' }
  ],
  planStartDate: [
    { required: true, message: '请选择计划开始日期', trigger: 'change' }
  ],
  planFinishDate: [
    { required: true, message: '请选择计划完成日期', trigger: 'change' }
  ],
  woStatus: [
    { required: true, message: '请选择工单状态', trigger: 'change' },
    { type: 'number', message: '请选择有效的工单状态', trigger: ['blur', 'change'] }
  ],
  dataSource: [
    { required: true, message: '请输入数据来源', trigger: 'blur' },
    { max: 60, message: '长度不能超过60个字符', trigger: 'blur' }
  ],
  dataSourceCreateTime: [
    { required: true, message: '请选择来源数据创建时间', trigger: 'change' }
  ]
}

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    // 处理日期格式
    const processedData = { ...newData }
    if (processedData.planStartDate) {
      processedData.planStartDate = new Date(processedData.planStartDate)
    }
    if (processedData.planFinishDate) {
      processedData.planFinishDate = new Date(processedData.planFinishDate)
    }
    if (processedData.actualStartDate) {
      processedData.actualStartDate = new Date(processedData.actualStartDate)
    }
    if (processedData.actualFinishDate) {
      processedData.actualFinishDate = new Date(processedData.actualFinishDate)
    }
    if (processedData.dataSourceCreateTime) {
      processedData.dataSourceCreateTime = new Date(processedData.dataSourceCreateTime)
    }
    Object.assign(form, processedData)
  }
}, { immediate: true, deep: true })

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    purchaserHqCode: '',
    ipoNo: '',
    supplierCode: '',
    supplierName: '',
    woNo: '',
    categoryCode: '',
    subclassCode: '',
    materialsCode: '',
    materialsDescription: '',
    materialsBatch: '',
    amount: 0.000,
    unit: '',
    planStartDate: '',
    planFinishDate: '',
    actualStartDate: '',
    actualFinishDate: '',
    woStatus: 1, // 默认待处理
    entityCode: '',
    processRouteNo: '',
    voltageLevel: '',
    dataSource: '',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    modelSpec: ''
  })
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 处理日期格式，转换为字符串
        const formData = { ...form }
        if (formData.planStartDate instanceof Date) {
          formData.planStartDate = formData.planStartDate.toISOString()
        }
        if (formData.planFinishDate instanceof Date) {
          formData.planFinishDate = formData.planFinishDate.toISOString()
        }
        if (formData.actualStartDate instanceof Date) {
          formData.actualStartDate = formData.actualStartDate.toISOString()
        }
        if (formData.actualFinishDate instanceof Date) {
          formData.actualFinishDate = formData.actualFinishDate.toISOString()
        }
        if (formData.dataSourceCreateTime instanceof Date) {
          formData.dataSourceCreateTime = formData.dataSourceCreateTime.toISOString()
        }
        
        if (props.type === 'add') {
          await createPlshengchangongdan(formData)
        } else {
          await updatePlshengchangongdan(formData)
        }
        emit('submit')
        ElMessage.success(props.type === 'add' ? '新增成功' : '更新成功')
      } catch (error) {
        console.error(props.type === 'add' ? '新增失败' : '更新失败', error)
        ElMessage.error(props.type === 'add' ? '新增失败' : '更新失败')
      }
    }
  })
}

// 取消按钮处理
const handleCancel = () => {
  emit('cancel')
}

</script>



<style scoped>
/* 简化后的样式 */
.form-section {
  margin-bottom: 5px; /* 减少底部间距 */
  padding: 8px;       /* 减少内边距 */
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px; /* 减少标题底部间距 */
  border-bottom: none; /* 去掉底部边框 */
}

/* 去掉标题的伪元素装饰 */
.section-title::before {
  display: none;
}

/* 调整表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 8px; /* 减少表单项底部间距 */
}

/* 简化输入框样式 */
:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  border-radius: 4px;
  height: 30px; /* 稍减小高度 */
}

/* 统一字体和颜色 */
:deep(.el-form-item__label) {
  font-weight: 400; /* 降低标题字体权重 */
  color: #666;
  font-size: 13px;
}
</style>