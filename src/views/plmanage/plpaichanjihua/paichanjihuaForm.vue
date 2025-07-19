<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1400px"
    @closed="resetForm"
  >
    <!-- 排产计划信息区域 -->
    <div class="plan-section">
      <div class="section-header">
        <h3>排产计划信息</h3>

      </div>
      
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
              <el-form-item label="计划类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择计划类型" style="width: 100%">
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排产计划编码" prop="scheduleCode">
                <el-input v-model="form.scheduleCode" placeholder="请输入排产计划编码" readonly />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="采购订单行ID" prop="poItemId">
                <el-input v-model.number="form.poItemId" placeholder="请输入采购订单行ID" />
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="厂内合同号" prop="contractNo">
                <el-input v-model.number="form.contractNo" placeholder="请输入厂内合同号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产订单号" prop="ipoNo">
                <el-input v-model.number="form.ipoNo" placeholder="选择工单号后自动填充" />
              </el-form-item>
            </el-col>

            <el-form-item label="生产工单号" prop="woNo">
                <el-input 
                  v-model="form.woNo" 
                  placeholder="选择生产工单号" 
                  readonly 
                  @click.stop="openGongdanSelector"
                >
                  <template #append>
                    <el-button @click="openGongdanSelector" size="small">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>

                          <el-col :span="8">
              <el-form-item label="工单物料ID" prop="gdItemId">
                <el-input 
                  v-model="form.gdItemId" 
                  placeholder="选择工单物料ID" 
                  readonly 
                  @click.stop="openGongdanItemSelector"
                >
                  <template #append>
                    <el-button @click="openGongdanItemSelector" size="small">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">物料信息(选择工单物料后自动填充)</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="物料名称"  prop="itemname">
                <el-input v-model="form.itemname" disabled placeholder="请输入物料名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号" prop="productModel">
                <el-input v-model="form.productModel" disabled placeholder="请输入规格型号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量" prop="amount">
                <el-input v-model="form.amount" disabled placeholder="请输入数量" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位" prop="unit">
                <el-input v-model="form.unit" disabled placeholder="请输入单位" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产车间" prop="unit">
                <el-input v-model="form.workshopName" disabled placeholder="请输入车间" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input v-model="form.supplierCode" disabled placeholder="请输入供应商编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" disabled placeholder="请输入供应商名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省公司编码" prop="provCoCode">
                <el-input v-model="form.provCoCode" placeholder="请输入省公司编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省公司名称" prop="provCoName">
                <el-input v-model="form.provCoName" placeholder="请输入省公司名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 进度信息 -->
        <div class="form-section">
          <div class="section-title">进度信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="计划工期" prop="planPeriod">
                <el-input v-model="form.planPeriod" placeholder="请输入计划工期（天数）" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际工期" prop="actualPeriod">
                <el-input v-model="form.actualPeriod" placeholder="请输入实际工期" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进度" prop="schedule">
                <el-input v-model="form.schedule" placeholder="请输入进度" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交付日期" prop="dueDate">
                <el-date-picker
                  v-model="form.dueDate"
                  type="date"
                  placeholder="选择交付日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划开始日期" prop="planStartDate">
                <el-date-picker
                  v-model="form.planStartDate"
                  type="date"
                  placeholder="选择计划开始日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划完成日期" prop="planFinishDate">
                <el-date-picker
                  v-model="form.planFinishDate"
                  type="date"
                  placeholder="选择计划完成日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际开始日期" prop="actualStartDate">
                <el-date-picker
                  v-model="form.actualStartDate"
                  type="date"
                  placeholder="选择实际开始日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
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

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="品类编码"  prop="categoryCode">
                <el-input v-model="form.categoryCode" disabled placeholder="请输入品类编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="种类编码"  prop="subclassCode">
                <el-input v-model="form.subclassCode" disabled placeholder="请输入种类编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择计划状态" style="width: 100%">
                  <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataSource">
                <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源创建时间" prop="dataSourceCreateTime">
                <el-date-picker
                  v-model="form.dataSourceCreateTime"
                  type="date"
                  placeholder="选择来源创建时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="数据拥有方" prop="ownerId">
                <el-input v-model="form.ownerId" placeholder="请输入数据拥有方" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据可见方" prop="openId">
                <el-input v-model="form.openId" placeholder="请输入数据可见方" />
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="8">
              <el-form-item label="标志" prop="flag">
                <el-input v-model="form.flag" placeholder="请输入标志" />
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="录入人" prop="writer">
                <el-input v-model="form.writer" placeholder="请输入录入人" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <template #footer>
              <el-button type="primary" @click="savePlanInfo" :loading="planSaving">
          保存计划信息
        </el-button>
      <el-button @click="handleCancel">关闭</el-button>
    </template>
  </el-dialog>

      <!-- 生产工单选择器组件 -->
    <gongdanSelector
      v-model:modelValue="gongdanSelectorVisible"
      :onSelect="handleGongdanSelect"
    />

    <!-- 工单物料选择器组件 -->
    <gongdanItemSelector
      v-model:modelValue="gongdanItemSelectorVisible"
      :woNo="form.woNo"
      :onSelect="handleGongdanItemSelect"
    />


</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createPlpaichanjihua, updatePlpaichanjihua } from '@/api/plmanage/plpaichanjihua'
import { useUserStore } from '@/store/user'
import  gongdanSelector  from './components/gongdanSelector.vue'
import  gongdanItemSelector  from './components/gongdanItemSelector.vue'


const userStore = useUserStore()

const getWriterName = () => {
  console.log("获取登录用户名称", userStore.descr)
  return userStore.descr
}

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

// 弹窗标题
const dialogTitle = computed(() => props.type === 'add' ? '新增排产计划' : '编辑排产计划')

// 表单引用
const formRef = ref(null)

// 计划保存状态
const planSaving = ref(false)

// 车间选项
const workshopOptions = ref([
  { code: 'fc009', name: '外购' },
  { code: 'fc008', name: '外协单位' },
  { code: 'fc007', name: '铁塔分厂' },
  { code: 'fc006', name: '机加分厂' },
  { code: 'fc005', name: '铆焊分厂' },
  { code: 'fc004', name: '锻造分厂' },
  { code: 'fc003', name: '铝管分厂' },
  { code: 'fc002', name: '铸铝分厂' },
  { code: 'fc001', name: '铸造分厂' },
  { code: 'scylb', name: '市场营销部' }
])

// 获取车间名称
const getWorkshopName = (codes) => {
  if (!codes) return ''
  const codeArray = codes.split(',')
  const names = codeArray.map(code => {
    const workshop = workshopOptions.value.find(option => option.code === code.trim())
    return workshop ? workshop.name : code
  })
  return names.join(',')
}

// 生成排产计划编码
const generateScheduleCode = () => {
  const now = new Date()
  const timestamp = now.getFullYear() + 
    String(now.getMonth() + 1).padStart(2, '0') + 
    String(now.getDate()).padStart(2, '0') + 
    String(now.getHours()).padStart(2, '0') + 
    String(now.getMinutes()).padStart(2, '0') + 
    String(now.getSeconds()).padStart(2, '0')
  
  return `PCJH${timestamp}`
}

// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  poItemId: undefined, //采购行订单ID
  scheduleCode: generateScheduleCode(),
  gdItemId: undefined,
  woNo: '',
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
  categoryCode: '60',
  subclassCode: '6004',
  remark: '',
  dataSource: '',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  type: '',
  status: 1, // 默认待处理
  flag: '',
  writer: getWriterName(),
  isdelete: 0 // 默认正常
})

// 表单验证规则
const rules = {
  purchaserHqCode: [
    { required: true, message: '请输入采购方总部编码', trigger: 'blur' },
    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
  ],
  supplierCode: [
    { required: true, message: '请输入供应商编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  poItemId: [
    { required: true, message: '请输入采购订单行ID', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' }
  ],
  scheduleCode: [
    { required: true, message: '请输入排产计划编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  planPeriod: [
    { required: true, message: '请输入计划工期', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  dueDate: [
    { required: true, message: '请选择交付日期', trigger: 'change' }
  ],
  planStartDate: [
    { required: true, message: '请选择计划开始日期', trigger: 'change' }
  ],
  planFinishDate: [
    { required: true, message: '请选择计划完成日期', trigger: 'change' }
  ],
  categoryCode: [
    { required: true, message: '请输入品类编码', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  subclassCode: [
    { required: true, message: '请输入种类编码', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  dataSource: [
    { required: true, message: '请输入数据来源', trigger: 'blur' },
    { max: 60, message: '长度不能超过60个字符', trigger: 'blur' }
  ],
  dataSourceCreateTime: [
    { required: true, message: '请选择来源创建时间', trigger: 'change' }
  ]
}

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    // 处理日期格式
    const processedData = { ...newData }
    if (processedData.dueDate) {
      processedData.dueDate = new Date(processedData.dueDate)
    }
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





// 生产工单选择器显示状态
const gongdanSelectorVisible = ref(false)
//生产工单物料列表选择器
const gongdanItemSelectorVisible = ref(false)


// 打开生产工单选择器
const openGongdanSelector = (e) => {
  e.stopPropagation()
  gongdanSelectorVisible.value = true
}
//打开生产工单物料列表选择器
const openGongdanItemSelector = (e) => {
  if(form.woNo == ''){
    ElMessage.error('请先选择生产工单！')
    return
  }
  e.stopPropagation()
  gongdanItemSelectorVisible.value = true
}


// 处理生产工单选择
const handleGongdanSelect = (res) => {
  if (res) {
    form.woNo = res.woNo
    form.purchaserHqCode = res.purchaserHqCode
    form.supplierCode = res.supplierCode
    form.supplierName = res.supplierName
    form.categoryCode = res.categoryCode
    form.subclassCode = res.subclassCode
    form.contractNo = res.contractNo
    form.ipoNo = res.ipoNo
  }
  gongdanSelectorVisible.value = false
}

// 处理生产工单物料列表选择
const handleGongdanItemSelect = (res) => {
  if (res) {
    form.gdItemId = res.id
    form.amount = res.amount
    form.itemname = res.itemname
    form.productModel = res.productModel
    form.unit = res.unit
    form.workshopName = getWorkshopName(res.workshopName)
  }
}




// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    purchaserHqCode: '',
    supplierCode: '1000014491',
    supplierName: '中国电建集团四平线路器材有限公司',
    poItemId: undefined,
    scheduleCode: generateScheduleCode(),
    gdItemId: undefined,
    woNo: '',
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
    categoryCode: '60',
    subclassCode: '6004',
    remark: '',
    dataSource: '',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    type: '',
    status: 1,
    flag: '',
    writer: getWriterName(),
    isdelete: 0
  })
}

// 保存计划信息
const savePlanInfo = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        planSaving.value = true
        const formData = { ...form }
        
        if (props.type === 'add') {
          await createPlpaichanjihua(formData)
          ElMessage.success('计划信息保存成功')
        } else {
          await updatePlpaichanjihua(formData)
          ElMessage.success('计划信息更新成功')
        }
        emit('submit')
        dialogVisible.value = false
      } catch (error) {
        console.error('保存排产计划失败', error)
        ElMessage.error('保存排产计划失败')
      } finally {
        planSaving.value = false
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

:deep(.el-form-item) {
  margin-bottom: 8px;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  border-radius: 4px;
  height: 30px;
}

:deep(.el-form-item__label) {
  font-weight: 400;
  color: #666;
  font-size: 13px;
}
</style>