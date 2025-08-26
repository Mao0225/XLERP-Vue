<template>
  <el-dialog
    title="查看排产计划"
    v-model="dialogVisible"
    width="1400px"
    @closed="resetForm"
  >
    <!-- 排产计划信息区域 -->
    <div class="plan-section">
      <div class="section-header">
        <h3>排产计划信息</h3>
      </div>
      
      <el-form :model="form" label-width="120px" size="small" class="readonly-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码">
                <el-input v-model="form.purchaserHqCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划类型">
                <el-input :value="getTypeLabel(form.type)" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排产计划编码">
                <el-input v-model="form.scheduleCode" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="生产工单号">
                <el-input v-model="form.woNo" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="厂内合同号">
                <el-input v-model="form.contractNo" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产订单号">
                <el-input v-model="form.ipoNo" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 物料信息 -->
        <div class="form-section">
          <div class="section-title">物料信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="物料名称">
                <el-input v-model="form.itemname" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号">
                <el-input v-model="form.productModel" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量">
                <el-input v-model="form.amount" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="单位">
                <el-input v-model="form.unit" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产车间">
                <el-input v-model="form.workshopName" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="供应商编码">
                <el-input v-model="form.supplierCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商名称">
                <el-input v-model="form.supplierName" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="省公司编码">
                <el-input v-model="form.provCoCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省公司名称">
                <el-input v-model="form.provCoName" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 进度信息 -->
        <div class="form-section">
          <div class="section-title">进度信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="计划工期">
                <el-input v-model="form.planPeriod" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际工期">
                <el-input v-model="form.actualPeriod" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交付日期">
                <el-input :value="formatDate(form.dueDate)" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 时间计划 -->
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="计划开始日期">
                <el-input :value="formatDate(form.planStartDate)" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划完成日期">
                <el-input :value="formatDate(form.planFinishDate)" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际开始日期">
                <el-input :value="formatDate(form.actualStartDate)" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际完成日期">
                <el-input :value="formatDate(form.actualFinishDate)" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 进度描述 -->
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="进度">
                <el-input v-model="form.schedule" type="textarea" :rows="3" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="品类编码">
                <el-input v-model="form.categoryCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="种类编码">
                <el-input v-model="form.subclassCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划状态">
                <el-input :value="getStatusLabel(form.status)" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="数据来源">
                <el-input v-model="form.dataSource" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源创建时间">
                <el-input :value="formatDate(form.dataSourceCreateTime)" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 创建人和创建时间 -->
          <el-row :gutter="10" v-if="form.writer">
            <el-col :span="12">
              <el-form-item label="录入人">
                <el-input v-model="form.writer" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 备注 -->
          <el-row :gutter="10" v-if="form.remark">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" :rows="3" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:visible', 'close'])

// 计划类型选项
const typeOptions = [
  { id: 1, value: '生产计划' },
  { id: 2, value: '采购计划' },
  { id: 3, value: '销售计划' },
  { id: 4, value: '其他计划' }
]

// 计划状态选项
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

// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  supplierCode: '',
  supplierName: '',
  poItemId: undefined,
  scheduleCode: '',
  gdItemId: undefined,
  woNo: '',
  ipoNo: '',
  contractNo: '',
  itemname: '',
  productModel: '',
  amount: '',
  unit: '',
  workshopName: '',
  provCoCode: '',
  provCoName: '',
  planPeriod: '',
  actualPeriod: '',
  schedule: '',
  dueDate: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: '',
  categoryCode: '',
  subclassCode: '',
  remark: '',
  dataSource: '',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  type: '',
  status: '',
  flag: '',
  writer: '',
  isdelete: 0
})

// 获取计划类型标签
const getTypeLabel = (typeId) => {
  const type = typeOptions.find(item => item.id === typeId)
  return type ? type.value : ''
}

// 获取计划状态标签
const getStatusLabel = (statusId) => {
  const status = statusOptions.find(item => item.id === statusId)
  return status ? status.value : ''
}

// 格式化日期
const formatDate = (dateValue) => {
  if (!dateValue) return ''
  
  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return ''
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    purchaserHqCode: '',
    supplierCode: '',
    supplierName: '',
    poItemId: undefined,
    scheduleCode: '',
    gdItemId: undefined,
    woNo: '',
    ipoNo: '',
    contractNo: '',
    itemname: '',
    productModel: '',
    amount: '',
    unit: '',
    workshopName: '',
    provCoCode: '',
    provCoName: '',
    planPeriod: '',
    actualPeriod: '',
    schedule: '',
    dueDate: '',
    planStartDate: '',
    planFinishDate: '',
    actualStartDate: '',
    actualFinishDate: '',
    categoryCode: '',
    subclassCode: '',
    remark: '',
    dataSource: '',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    type: '',
    status: '',
    flag: '',
    writer: '',
    isdelete: 0
  })
}

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(form, newData)
  }
}, { immediate: true, deep: true })

// 关闭按钮处理
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.plan-section {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.form-section {
  margin-bottom: 0px;
  padding: 0px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.readonly-form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.readonly-form :deep(.el-input__inner) {
  border-radius: 4px;
  height: 30px;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: default;
}

.readonly-form :deep(.el-textarea__inner) {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: default;
}

.readonly-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  font-size: 13px;
}
</style>