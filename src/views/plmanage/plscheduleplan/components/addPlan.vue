<template>
  <el-dialog
    title="新增排产计划"
    v-model="dialogVisible"
    width="900px"
    :before-close="handleClose"
    class="schedule-plan-dialog"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="140px"
      class="schedule-plan-form"
    >
      <!-- 基本信息 -->
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购方总部编码" prop="purchaserHqCode">
            <el-input v-model="form.purchaserHqCode" placeholder="请输入采购方总部编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" readonly />
          </el-form-item>
        </el-col>
      </el-row> -->
      
      <el-row :gutter="20">
        <!-- <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName" placeholder="请输入供应商名称" readonly />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="订单行项目ID" prop="poItemId">
            <el-input 
                  v-model="form.poItemId" 
                  placeholder="选择合同行项目ID" 
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
          <el-form-item label="产品名称" prop="itemName">
            <el-input v-model="form.itemName" readonly placeholder="请选择产品" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排产计划编码" prop="scheduleCode">
            <el-input v-model="form.scheduleCode" placeholder="请输入排产计划编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划工期(天)" prop="planPeriod">
            <el-input v-model.number="form.planPeriod" readonly placeholder="自动计算" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 公司信息 -->
      <!-- <el-divider content-position="left">公司信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="省公司单位编码" prop="provCoCode">
            <el-input v-model="form.provCoCode" placeholder="请输入省公司单位编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省公司单位名称" prop="provCoName">
            <el-input v-model="form.provCoName" placeholder="请输入省公司单位名称" />
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- 时间信息 -->
      <el-divider content-position="left">时间信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="最晚交付日期" prop="dueDate">
            <el-date-picker
              v-model="form.dueDate"
              type="date"
              placeholder="请选择交付日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
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
      </el-row>
      
      <el-row :gutter="20">
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
      </el-row>
      
      <el-row :gutter="20">
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
        <el-col :span="12">
          <el-form-item label="实际工期" prop="actualPeriod">
            <el-input v-model.number="form.actualPeriod" placeholder="请输入实际工期" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 编码信息
      <el-divider content-position="left">编码信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="品类编码" prop="categoryCode">
            <el-input v-model="form.categoryCode" placeholder="请输入品类编码" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="种类编码" prop="subclassCode">
            <el-input v-model="form.subclassCode" placeholder="请输入种类编码"  readonly/>
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- 数据信息 -->
      <!-- <el-divider content-position="left">数据信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据来源" prop="dataSource">
            <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
          </el-form-item>
        </el-col>
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
      </el-row> -->
      
      <!-- <el-row :gutter="20">
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
      </el-row> -->

      <!-- 其他信息 -->
      <el-divider content-position="left">其他信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="记录创建人" prop="writer">
            <el-input v-model="form.writer" placeholder="请输入记录创建人" readonly />
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


    <ContractMaterialSelector
      v-model:visible="showSelector"
      @select="handleMaterialSelect"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createPlSchedulePlan } from '@/api/plmanage/plscheduleplan'
import { useUserStore } from '@/store/user'
import ContractMaterialSelector from './contractItemSelector.vue'


const itemName = ref('')

const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'success'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  newCode:{
    type: String,
    default: ''
  }
})

const showSelector = ref(false)
const handleMaterialSelect = (data) => {
  console.log("选择的物料数据")
  console.log(data)
  form.poItemId = data.id
  form.itemName = data.itemName
}

const dialogVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    form.scheduleCode = props.newCode
  }
})

const formRef = ref(null)
const form = reactive({
  purchaserHqCode: '',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  poItemId: '',
  itemName: '',
  scheduleCode: '',
  provCoCode: '',
  provCoName: '',
  planPeriod: null,
  actualPeriod: null,
  dueDate: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: '',
  categoryCode: '60', // 默认品类编码
  subclassCode: '60004',
  remark: '',
  dataSource: '供应商侧',
  dataSourceCreateTime: new Date().toISOString(),
  ownerId: '',
  openId: '',
  writer: userStore.realName,
  status: '10' // 默认状态为录入
})

const rules = reactive({
  purchaserHqCode: [{ required: true, message: '请输入采购方总部编码', trigger: 'blur' }],
  supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  poItemId: [{ required: true, message: '请输入采购订单行项目ID', trigger: 'blur' }],
  scheduleCode: [{ required: true, message: '请输入排产计划编码', trigger: 'blur' }],
  planPeriod: [
    { required: true, message: '请输入计划工期', trigger: 'blur' },
    { type: 'number', message: '计划工期必须为数字', trigger: 'blur' }
  ],
  dueDate: [{ required: true, message: '请选择交付日期', trigger: 'change' }],
  planStartDate: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
  planFinishDate: [{ required: true, message: '请选择计划完成日期', trigger: 'change' }],
  categoryCode: [{ required: true, message: '请输入品类编码', trigger: 'blur' }],
  subclassCode: [{ required: true, message: '请输入种类编码', trigger: 'blur' }],
  dataSource: [{ message: '请输入数据来源', trigger: 'blur' }],
  dataSourceCreateTime: [{ required: true, message: '请选择来源数据创建时间', trigger: 'change' }],
  writer: [{ required: true, message: '请输入记录创建人', trigger: 'blur' }]
})

const handleClose = () => {
  dialogVisible.value = false
  emit('update:visible', false)
  formRef.value.resetFields()
}

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await createPlSchedulePlan(form)
        if (response.code === 200) {
          ElMessage.success(response.msg)
          emit('success')
          handleClose()
        }
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}


// 计算计划工期的函数
const calculatePlanPeriod = () => {
  if (form.planStartDate && form.planFinishDate) {
    const startDate = new Date(form.planStartDate)
    const endDate = new Date(form.planFinishDate)
    
    // 计算天数差异
    const timeDiff = endDate.getTime() - startDate.getTime()
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // +1 包含开始日期
    
    // 确保结果为正数
    form.planPeriod = dayDiff > 0 ? dayDiff : null
  } else {
    form.planPeriod = null
  }
}

// 监听计划开始日期变化
watch(() => form.planStartDate, () => {
  calculatePlanPeriod()
})

// 监听计划完成日期变化
watch(() => form.planFinishDate, () => {
  calculatePlanPeriod()
})


</script>

<style scoped>
.schedule-plan-dialog {
  border-radius: 8px;
}

.schedule-plan-form {
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