<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1400px"
    @closed="resetForm"
  >
    <!-- 生产工单信息区域 -->
    <div class="order-section">
      <div class="section-header">
        <h3>生产工单信息</h3>
        <el-button type="primary" @click="saveWorkOrderInfo" :loading="orderSaving">
          保存工单信息
        </el-button>
      </div>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" size="small">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="生产订单号" prop="ipoNo">
                <el-input 
                  v-model="form.ipoNo" 
                  placeholder="选择生产订单号" 
                  readonly 
                  @click.stop="openOrderSelector"
                >
                  <template #append>
                    <el-button @click="openOrderSelector" size="small">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单编码" prop="woNo">
                <el-input v-model="form.woNo" placeholder="请输入工单编码" readonly />
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
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码" prop="purchaserHqCode">
                <el-input disabled v-model="form.purchaserHqCode" placeholder="采购方总部编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input disabled v-model="form.supplierCode" placeholder="供应商编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input disabled v-model="form.supplierName" placeholder="供应商名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input disabled v-model="form.contractNo" placeholder="合同编号" readonly />
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
                <el-input disabled v-model="form.categoryCode" placeholder="品类编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="种类编码" prop="subclassCode">
                <el-input disabled v-model="form.subclassCode" placeholder="种类编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="厂家物料编码" prop="materialsCode">
                <el-input v-model="form.materialsCode" placeholder="请输入厂家物料编码" />
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

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="实物ID" prop="entityCode">
                <el-input v-model="form.entityCode" placeholder="请输入实物ID" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工艺路线编码" prop="processRouteNo">
                <el-input v-model="form.processRouteNo" placeholder="请输入工艺路线编码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataSource">
                <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
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
        <el-tooltip v-if="!isWorkOrderSaved" content="请先保存工单信息" placement="top">
          <el-button 
            type="success" 
            :disabled="true"
          >
            添加物料
          </el-button>
        </el-tooltip>
        <el-button 
          v-else
          type="success" 
          @click="openMaterialSelector" 
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
            <el-button type="danger" size="small" @click="deleteMaterial(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="materialList.length === 0" class="empty-material">
        <p>暂无物料信息，请先保存工单信息后添加物料</p>
      </div>
    </div>
    
    <!-- 生产订单选择器组件 -->
    <DingdanbianhaoSelector
      v-model:modelValue="orderSelectorVisible"
      :onSelect="handleOrderSelect"
    />

    <!-- 物料选择组件 -->
    <WorkOrderMaterialSelector
      v-model:modelValue="materialSelectorVisible"
      :ipoNo="form.ipoNo"
      :woNo="form.woNo"
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
  createPlshengchangongdan, 
  updatePlshengchangongdan,
  getGongdanItemList,
  deleteGongdanItem
} from '@/api/plmanage/plshengchangongdan'
import DingdanbianhaoSelector from './components/DingdanbianhaoSelector.vue'
import WorkOrderMaterialSelector from './components/DingdanItemSelector.vue'
import { useUserStore } from '@/store/user'
import { getNewNoNyName } from '@/api/system/basno'
import { getBasDepartmentOptions } from '@/api/system/department'

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

// 生产车间列表对应编号
const workshopOptions = ref([])

// 获取车间数据
const loadWorkshopData = async () => {
  try {
    const res = await getBasDepartmentOptions();
    if (!res.success) {
      ElMessage.error(res.msg);
      return;
    }
    workshopOptions.value = res.data.options || [];
  } catch (error) {
    ElMessage.error('加载车间数据失败');
  }
}

// 处理编号对应的名称显示
const getWorkshopName = (codes) => {
  if (!codes) {
    return '';
  }
  
  if (workshopOptions.value.length === 0) {
    return codes; // Fallback to return codes as-is if data isn't loaded
  }
  
  const codeArray = codes.split(',');
  
  const names = codeArray.map(code => {
    const trimmedCode = code.trim();
    
    const workshop = workshopOptions.value.find(option => option.code === trimmedCode);
    
    return workshop ? workshop.name : code;
  });
  
  const result = names.join(',');
  
  return result;
}

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

// 生产订单选择器显示状态
const orderSelectorVisible = ref(false)
// 物料选择器显示状态
const materialSelectorVisible = ref(false)

// 工单保存状态
const orderSaving = ref(false)
// 工单是否已保存（用于控制首次保存）
const isWorkOrderSaved = ref(false)

// 物料列表
const materialList = ref([])

// 生成工单编码
const generateWoNo = async () => {
  try {
    const res = await getNewNoNyName('scgd');
    
    if (res?.code === 200) {
      console.log("获取编码成功", res.data.fullNoNyName);
      return res.data.fullNoNyName;
    }
    
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
    
  } catch (error) {
    console.error('生成生产工单编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};

// 监听对话框打开
watch(dialogVisible, async (visible) => {
  if (visible) {
    if (props.type === 'add') {
      form.woNo = await generateWoNo();
      isWorkOrderSaved.value = false;
    } else {
      isWorkOrderSaved.value = true;
    }
  }
})

// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  ipoNo: '',
  supplierCode: '',
  supplierName: '',
  contractNo: '',
  woNo: '',
  categoryCode: '',
  subclassCode: '',
  materialsCode: '',
  planStartDate: '',
  planFinishDate: '',
  actualStartDate: '',
  actualFinishDate: '',
  woStatus: 1,
  entityCode: '',
  processRouteNo: '',
  dataSource: '手工录入',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  writer: getWriterName()
})

// 表单验证规则
const rules = {
  ipoNo: [
    { required: true, message: '请选择生产订单号', trigger: 'blur' }
  ],
  woNo: [
    { required: true, message: '请输入工单编码', trigger: 'blur' },
    { max: 48, message: '长度不能超过48个字符', trigger: 'blur' }
  ],
  purchaserHqCode: [
    { required: true, message: '采购方总部编码不能为空', trigger: 'blur' }
  ],
  supplierCode: [
    { required: true, message: '供应商编码不能为空', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '供应商名称不能为空', trigger: 'blur' }
  ],
  categoryCode: [
    { required: true, message: '请输入品类编码', trigger: 'blur' }
  ],
  subclassCode: [
    { required: true, message: '请输入种类编码', trigger: 'blur' }
  ],
  woStatus: [
    { required: true, message: '请选择工单状态', trigger: 'change' }
  ]
}

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
    contractNo: '',
    woNo: '',
    categoryCode: '',
    subclassCode: '',
    materialsCode: '',
    planStartDate: '',
    planFinishDate: '',
    actualStartDate: '',
    actualFinishDate: '',
    woStatus: 1,
    entityCode: '',
    processRouteNo: '',
    dataSource: '手工录入',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    writer: getWriterName()
  })
  materialList.value = []
  isWorkOrderSaved.value = false
}

// 打开生产订单选择器
const openOrderSelector = (e) => {
  e.stopPropagation() // 阻止事件冒泡
  orderSelectorVisible.value = true
}

// 打开物料选择器
const openMaterialSelector = async (e) => {
  e?.stopPropagation()
  if (!isWorkOrderSaved.value) {
    // 如果尚未保存，先验证并保存
    if (!formRef.value) return
    let valid = false
    try {
      await formRef.value.validate((isValid) => {
        valid = isValid
      })
    } catch (error) {
      valid = false
    }
    if (valid) {
      await saveWorkOrderInfo()
    } else {
      ElMessage.warning('请先完善工单信息并保存')
      return
    }
  }
  // 已保存或编辑模式，直接打开
  materialSelectorVisible.value = true
}

// 处理生产订单选择
const handleOrderSelect = (order) => {
  if (order) {
    form.ipoNo = order.ipoNo
    form.purchaserHqCode = order.purchaserHqCode
    form.supplierCode = order.supplierCode
    form.supplierName = order.supplierName
    form.categoryCode = order.categoryCode
    form.subclassCode = order.subclassCode
    form.contractNo = order.contractNo
  }
  orderSelectorVisible.value = false
}

// 处理物料选择
const handleMaterialSelect = (materials) => {
  // 刷新物料列表
  loadMaterialList()
}

// 保存工单信息
const saveWorkOrderInfo = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        orderSaving.value = true
        
        let res
        if (form.id) {
          // 已存在ID，使用更新
          res = await updatePlshengchangongdan(form)
          ElMessage.success('工单信息更新成功')
        } else {
          // 无ID，使用创建
          res = await createPlshengchangongdan(form)
          // 假设创建接口返回了完整的工单数据，包括ID
          if (res?.data?.id) {
            form.id = res.data.id
          }
          ElMessage.success('工单信息保存成功')
        }
        // 保存成功后设置标志
        isWorkOrderSaved.value = true
        // 如果是新增模式，保存后加载物料列表（如果需要）
        if (props.type === 'add' && form.woNo) {
          loadMaterialList()
        }
      } catch (error) {
        console.error('保存生产工单失败', error)
        ElMessage.error('保存生产工单失败')
      } finally {
        orderSaving.value = false
      }
    }
  })
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.woNo) return
  
  try {
    const res = await getGongdanItemList({ woNo: form.woNo })
    materialList.value = (res.data.itemList || []).map(item => ({
      ...item,
      workshopName: getWorkshopName(item.workshopName || item.workshopCode || '')
    }))
  } catch (error) {
    ElMessage.error('加载物料列表失败')
  }
}

// 删除物料
const deleteMaterial = async (material) => {
  try {
    await ElMessageBox.confirm('确定要删除这个物料吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteGongdanItem({ id: material.id })
    ElMessage.success('删除成功')
    loadMaterialList() // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除物料失败', error)
      ElMessage.error('删除物料失败')
    }
  }
}

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  loadWorkshopData();

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
    
    // 如果是编辑模式且有工单号，加载物料列表
    if (props.type === 'edit' && form.woNo) {
      loadMaterialList()
    }
  }
}, { immediate: true, deep: true })

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