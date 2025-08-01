<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1400px"
    @closed="resetForm"
  >
    <!-- 生产订单信息区域 -->
    <div class="order-section">
      <div class="section-header">
        <h3>生产订单信息</h3>
        <el-button type="primary" @click="saveOrderInfo" :loading="orderSaving">
          保存订单信息
        </el-button>
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
              <el-form-item label="订单类型" prop="ipoType">
                <el-select v-model="form.ipoType" placeholder="请选择订单类型" style="width: 100%">
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产订单号" prop="ipoNo">
                <el-input v-model="form.ipoNo" placeholder="请输入生产订单号" readonly  />
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
                <el-input disabled v-model="form.supplierCode" placeholder="请输入供应商编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input disabled v-model="form.supplierName" placeholder="请输入供应商名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input 
                  v-model="form.contractNo" 
                  placeholder="选择合同编号" 
                  readonly 
                  @click.stop="openContractSelector"
                >
                  <template #append>
                    <el-button @click="openContractSelector" size="small">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同名称" prop="contractName">
                <el-input 
                  disabled
                  v-model="form.contractName" 
                  placeholder="合同名称" 
                  readonly 
                  :class="{ 'has-select': !!form.contractNo }"
                  @click.stop
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 其他基本信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
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
              <el-form-item label="生产订单状态" prop="ipoStatus">
                <el-select v-model="form.ipoStatus" placeholder="请选择生产订单状态" style="width: 100%">
                  <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 时间计划 -->
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
      </el-form>
    </div>

    <!-- 物料信息区域 -->
    <div class="material-section">
      <div class="section-header">
        <h3>物料信息</h3>
        <!-- 提示要先保存才能添加物料 -->
         <el-tooltip content="请先保存" placement="top"></el-tooltip>
        <el-button 
          type="success" 
          @click="openMaterialSelector" 
          :disabled="!form.contractNo || !form.ipoNo"
        >
          添加物料
        </el-button>
      </div>

      <!-- 物料列表 -->
      <el-table :data="materialList" border size="small" style="width: 100%">
        <el-table-column prop="itemname" label="物料名称" min-width="120" />
        <el-table-column prop="productModel" label="规格型号" width="100" />
        <el-table-column prop="amount" label="数量" width="80" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="workshopName" label="生产车间" min-width="150" />
        <el-table-column prop="memo" label="备注" min-width="120" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <!-- <el-button type="primary" size="small" @click="editMaterial(row)">编辑</el-button> -->
            <el-button type="danger" size="small" @click="deleteMaterial(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="materialList.length === 0" class="empty-material">
        <p>暂无物料信息，请先保存订单信息后添加物料</p>
      </div>
    </div>
    
    <!-- 合同选择器组件 -->
    <ContractSelector
      v-model:modelValue="contractSelectorVisible"
      :onSelect="handleContractSelect"
    />

    <!-- 物料选择组件 -->
    <MaterialSelector
      v-model:modelValue="materialSelectorVisible"
      :contractNo="form.contractNo"
      :ipoNo="form.ipoNo"
      :onSelect="handleMaterialSelect"
    />

    <template #footer>
      <el-button @click="handleCancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  createPlshengchandingdan, 
  updatePlshengchandingdan,
  getDingdanItemList,
  deleteDingdanItem,
  getItemCountDetail
} from '@/api/plmanage/plshengchandingdan'
import ContractSelector from './components/ContractSelector.vue'
import MaterialSelector from './components/ContracItemSelect.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const getWriterName = () =>{
  console.log("获取登录用户名称",userStore.descr)
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



//生产车间列表对应编号
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

//处理编号对应的名称显示
const getWorkshopName = (codes) => {
  if (!codes) return ''
  const codeArray = codes.split(',')
  const names = codeArray.map(code => {
    const workshop = workshopOptions.value.find(option => option.code === code.trim())
    return workshop ? workshop.name : code
  })
  return names.join(',')
}
// 订单类型选项
const typeOptions = [
  { id: 1, value: '采购订单' },
  { id: 2, value: '生产订单' },
  { id: 3, value: '销售订单' },
  { id: 4, value: '其他订单' }
]

// 订单状态选项
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
const dialogTitle = computed(() => props.type === 'add' ? '新增生产订单' : '编辑生产订单')

// 表单引用
const formRef = ref(null)

// 合同选择器显示状态
const contractSelectorVisible = ref(false)
// 物料选择器显示状态
const materialSelectorVisible = ref(false)

// 订单保存状态
const orderSaving = ref(false)

// 物料列表
const materialList = ref([])
// 生成生产订单号
const generateIpoNo = () => {
  const now = new Date()
  const timestamp = now.getFullYear() + 
    String(now.getMonth() + 1).padStart(2, '0') + 
    String(now.getDate()).padStart(2, '0') + 
    String(now.getHours()).padStart(2, '0') + 
    String(now.getMinutes()).padStart(2, '0') + 
    String(now.getSeconds()).padStart(2, '0')
  
  return `SCDD${timestamp}`
}
// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  ipoType: 2, // 默认生产订单
  supplierCode: '1000014491', // 默认供应商编码
  supplierName: '中国电建集团四平线路器材有限公司', // 默认供应商名称
   ipoNo: generateIpoNo(), 
  categoryCode: '60', // 默认品类编码
  subclassCode: '60004',
  scheduleCode: '',
  poItemId: undefined,
  dataType: undefined,
  soItemNo: undefined,
  materialsCode: '',
  materialsName: '',
  materialsUnit: '',
  materialsDesc: '',
  amount: 0.000,
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
  ipoStatus: 1, // 默认待处理
  center: '',
  dataSource: '',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  contractNo: '',    // 合同编号
  contractName: '',  // 合同名称
  writer:getWriterName() //获取登录用户名称
})

// 表单验证规则
const rules = {
  purchaserHqCode: [
    { required: true, message: '请输入采购方总部编码', trigger: 'blur' },
    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
  ],
  ipoType: [
    { required: true, message: '请选择订单类型', trigger: 'change' },
    { type: 'number', message: '请选择有效的订单类型', trigger: ['blur', 'change'] }
  ],
  supplierCode: [
    { required: true, message: '请输入供应商编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  ipoNo: [
    { required: true, message: '请输入生产订单号', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  categoryCode: [
    { required: true, message: '请输入品类编码', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  contractNo: [
    { required: true, message: '请选择合同编号', trigger: 'blur' }
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
    
    // 如果是编辑模式且有订单号，加载物料列表
    if (props.type === 'edit' && form.ipoNo) {
      loadMaterialList()
    }
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
    ipoType: 2,
    supplierCode: '1000014491',
    supplierName: '中国电建集团四平线路器材有限公司',
     ipoNo: generateIpoNo(), 
    categoryCode: '60',
    subclassCode: '60004',
    scheduleCode: '',
    poItemId: undefined,
    dataType: undefined,
    soItemNo: undefined,
    materialsCode: '',
    materialsName: '',
    materialsUnit: '',
    materialsDesc: '',
    amount: 0.000,
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
    ipoStatus: 1,
    center: '',
    dataSource: '',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    contractNo: '',
    contractName: '',
    writer:getWriterName() //获取登录用户名称

  })
  materialList.value = []
}

// 打开合同选择器
const openContractSelector = (e) => {
  e.stopPropagation() // 阻止事件冒泡
  contractSelectorVisible.value = true
}

// 打开物料选择器
const openMaterialSelector = (e) => {
  e.stopPropagation()
  if (!form.contractNo) {
    ElMessage.error('请先选择合同！')
    return
  }
  if (!form.ipoNo) {
    ElMessage.error('请先保存订单信息！')
    return
  }
  materialSelectorVisible.value = true
}

// 处理合同选择
const handleContractSelect = (contract) => {
  if (contract) {
    form.contractNo = contract.no // 填充合同编号
    form.contractName = contract.name // 填充合同名称
  }
  contractSelectorVisible.value = false
}

// 处理物料选择
const handleMaterialSelect = (materials) => {
  materialSelectorVisible.value = false
  // 刷新物料列表
  loadMaterialList()
}

// 保存订单信息
const saveOrderInfo = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        orderSaving.value = true
        // 移除合同名称字段（根据需求，合同名称不存储）
        const formData = { ...form }
        delete formData.contractName
        
        if (props.type === 'add') {
          await createPlshengchandingdan(formData)
          ElMessage.success('订单信息保存成功')
        } else {
          await updatePlshengchandingdan(formData)
          ElMessage.success('订单信息更新成功')
        }
      } catch (error) {
        console.error('保存生产订单失败', error)
        ElMessage.error('保存生产订单失败')
      } finally {
        orderSaving.value = false
      }
    }
  })
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.ipoNo) return
  
  try {
    const res = await getDingdanItemList({ ipoNo: form.ipoNo })
    // Map workshop codes to names for each material
    materialList.value = (res.data.itemList || []).map(item => ({
      ...item,
      workshopName: getWorkshopName(item.workshopName || item.workshopCode || '')
    }))
  } catch (error) {
    console.error('加载物料列表失败', error)
    ElMessage.error('加载物料列表失败')
  }
}

// 编辑物料
const editMaterial = (material) => {
  // 这里可以实现物料编辑功能
  ElMessage.info('物料编辑功能待实现')
}

// 删除物料
const deleteMaterial = async (material) => {
  try {
    await ElMessageBox.confirm('确定要删除这个物料吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteDingdanItem({ id: material.id })
    ElMessage.success('删除成功')
    loadMaterialList() // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除物料失败', error)
      ElMessage.error('删除物料失败')
    }
  }
}

// 取消按钮处理
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.order-section,
.material-section {
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

.has-select {
  border-right: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

:deep(.el-input--append .el-input__inner) {
  padding-right: 80px;
}

:deep(.el-input__append) {
  background-color: #fff;
  border-left: 1px solid #dcdfe6;
}

:deep(.el-input__append .el-button) {
  border-radius: 0 4px 4px 0;
  height: 30px;
  padding: 0 10px;
  margin: 0;
}

.empty-material {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}
</style>