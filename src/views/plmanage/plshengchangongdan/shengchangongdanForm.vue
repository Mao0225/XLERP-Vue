<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1400px"
    @closed="resetForm"
    destroy-on-close
  >
    <!-- 生产工单信息区域 -->
    <div class="order-section">
      <div class="section-header">
        <h3>生产工单信息</h3>
        <el-button 
          type="primary" 
          @click="saveWorkOrderInfo" 
          :loading="orderSaving"
        >
          保存工单信息
        </el-button>
      </div>
      
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px" 
        size="small"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="生产订单号" prop="ipoNo">
                <el-input 
                  v-model="form.ipoNo" 
                  placeholder="选择生产订单号" 
                  readonly 
                  @click="openOrderSelector"
                >
                  <template #append>
                    <el-button @click="openOrderSelector" size="small">
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单编码" prop="woNo">
                <el-input 
                  v-model="form.woNo" 
                  placeholder="请输入工单编码" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态" prop="woStatus">
                <el-select 
                  v-model="form.woStatus" 
                  placeholder="请选择工单状态" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="item in statusOptions" 
                    :key="item.id" 
                    :label="item.value" 
                    :value="item.id" 
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="采购方总部编码" prop="purchaserHqCode">
                <el-input 
                  v-model="form.purchaserHqCode" 
                  placeholder="采购方总部编码" 
                  disabled 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input 
                  v-model="form.supplierCode" 
                  placeholder="供应商编码" 
                  disabled 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input 
                  v-model="form.supplierName" 
                  placeholder="供应商名称" 
                  disabled 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input 
                  v-model="form.contractNo" 
                  placeholder="合同编号" 
                  disabled 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 物料信息 -->
        <div class="form-section">
          <div class="section-title">物料信息</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="品类编码" prop="categoryCode">
                <el-input 
                  v-model="form.categoryCode" 
                  placeholder="品类编码"
                  disabled 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="种类编码" prop="subclassCode">
                <el-input 
                  v-model="form.subclassCode" 
                  placeholder="种类编码"
                  disabled 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="厂家物料编码" prop="materialsCode">
                <el-input 
                  v-model="form.materialsCode" 
                  placeholder="请输入厂家物料编码" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 时间计划 -->
        <div class="form-section">
          <div class="section-title">时间计划</div>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="计划开始日期" prop="planStartDate">
                <el-date-picker
                  v-model="form.planStartDate"
                  type="date"
                  placeholder="选择计划开始日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
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
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
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
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
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
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="实物ID" prop="entityCode">
                <el-input 
                  v-model="form.entityCode" 
                  placeholder="请输入实物ID" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工艺路线编码" prop="processRouteNo">
                <el-input 
                  v-model="form.processRouteNo" 
                  placeholder="请输入工艺路线编码" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源" prop="dataSource">
                <el-input 
                  v-model="form.dataSource" 
                  placeholder="请输入数据来源" 
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
        <el-tooltip 
          :content="!form.ipoNo || !form.woNo ? '请先保存工单信息' : ''" 
          placement="top"
        >
          <el-button 
            type="success" 
            @click="openMaterialSelector" 
            :disabled="!form.ipoNo || !form.woNo"
          >
            添加物料
          </el-button>
        </el-tooltip>
      </div>

      <!-- 物料列表 -->
      <el-table 
        :data="materialList" 
        border 
        size="small" 
        style="width: 100%"
        max-height="400"
      >
        <el-table-column 
          prop="itemname" 
          label="物料名称" 
          min-width="120" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="productModel" 
          label="规格型号" 
          width="120" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="amount" 
          label="数量" 
          width="80" 
          align="center"
        />
        <el-table-column 
          prop="unit" 
          label="单位" 
          width="80" 
          align="center"
        />
        <el-table-column 
          prop="workshopName" 
          label="生产车间" 
          min-width="150" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="memo" 
          label="备注" 
          min-width="120" 
          show-overflow-tooltip
        />
        <el-table-column 
          label="操作" 
          width="100" 
          align="center"
        >
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteMaterial(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { ref, reactive, computed, watch, nextTick } from 'vue'
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

const userStore = useUserStore()

// 获取登录用户名称
const getWriterName = () => {
  return userStore.descr || '系统用户'
}

// Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value)
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

// Emits定义
const emit = defineEmits(['update:visible', 'cancel'])

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
const dialogTitle = computed(() => {
  return props.type === 'add' ? '新增生产工单' : '编辑生产工单'
})

// 响应式数据
const formRef = ref(null)
const orderSelectorVisible = ref(false)
const materialSelectorVisible = ref(false)
const orderSaving = ref(false)
const materialList = ref([])

// 生成工单编码
const generateWoNo = () => {
  const now = new Date()
  const timestamp = now.getFullYear() + 
    String(now.getMonth() + 1).padStart(2, '0') + 
    String(now.getDate()).padStart(2, '0') + 
    String(now.getHours()).padStart(2, '0') + 
    String(now.getMinutes()).padStart(2, '0') + 
    String(now.getSeconds()).padStart(2, '0')
  
  return `SCGD${timestamp}`
}

// 表单数据
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  ipoNo: '',
  supplierCode: '',
  supplierName: '',
  contractNo: '',
  woNo: generateWoNo(),
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
  dataSourceCreateTime: new Date(),
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
  planStartDate: [
    { required: true, message: '请选择计划开始日期', trigger: 'blur' }
  ],
  planFinishDate: [
    { required: true, message: '请选择计划完成日期', trigger: 'blur' }
  ],
  woStatus: [
    { required: true, message: '请选择工单状态', trigger: 'change' }
  ],
  dataSource: [
    { required: true, message: '请输入数据来源', trigger: 'blur' }
  ]
}

// 监听表单数据变化
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      // 处理日期格式
      const processedData = { ...newData }
      const dateFields = ['planStartDate', 'planFinishDate', 'actualStartDate', 'actualFinishDate']
      dateFields.forEach(field => {
        if (processedData[field]) {
          processedData[field] = new Date(processedData[field]).toISOString().split('T')[0]
        }
      })
      
      Object.assign(form, processedData)
      
      // 如果是编辑模式且有工单号，加载物料列表
      if (props.type === 'edit' && form.woNo) {
        nextTick(() => {
          loadMaterialList()
        })
      }
    }
  },
  { immediate: true, deep: true }
)

// 监听弹窗显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible && props.type === 'add') {
      form.woNo = generateWoNo()
    }
  }
)

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
    woNo: generateWoNo(),
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
    dataSourceCreateTime: new Date(),
    ownerId: '',
    openId: '',
    writer: getWriterName()
  })
  
  materialList.value = []
  orderSelectorVisible.value = false
  materialSelectorVisible.value = false
}

// 打开生产订单选择器
const openOrderSelector = () => {
  orderSelectorVisible.value = true
}

// 打开物料选择器
const openMaterialSelector = () => {
  if (!form.ipoNo) {
    ElMessage.error('请先选择生产订单！')
    return
  }
  if (!form.woNo) {
    ElMessage.error('请先保存工单信息！')
    return
  }
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
  materialSelectorVisible.value = false
  // 刷新物料列表
  loadMaterialList()
}

// 保存工单信息
const saveWorkOrderInfo = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    orderSaving.value = true
    
    const formData = { ...form }
    
    if (props.type === 'add') {
      await createPlshengchangongdan(formData)
      ElMessage.success('工单信息保存成功')
    } else {
      await updatePlshengchangongdan(formData)
      ElMessage.success('工单信息更新成功')
    }
  } catch (error) {
    console.error('保存生产工单失败:', error)
    ElMessage.error('保存生产工单失败')
  } finally {
    orderSaving.value = false
  }
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.woNo) return
  
  try {
    const res = await getGongdanItemList({ woNo: form.woNo })
    materialList.value = res.data?.itemList || []
  } catch (error) {
    console.error('加载物料列表失败:', error)
    ElMessage.error('加载物料列表失败')
  }
}

// 删除物料
const deleteMaterial = async (material) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个物料吗？', 
      '确认删除', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteGongdanItem({ id: material.id })
    ElMessage.success('删除成功')
    loadMaterialList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除物料失败:', error)
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
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.form-section {
  margin-bottom: 0%;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 0px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}


/* 表单样式优化 */
:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 13px;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  border-radius: 4px;
  height: 32px;
}

:deep(.el-input--append .el-input__inner) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.el-input__append) {
  background-color: #f5f7fa;
  border-left: 1px solid #dcdfe6;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

:deep(.el-input__append .el-button) {
  height: 30px;
  padding: 0 12px;
  margin: 0;
  border: none;
  background: transparent;
  color: #409eff;
}

:deep(.el-input__append .el-button:hover) {
  color: #66b1ff;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--border th) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table--border td) {
  border-right: 1px solid #ebeef5;
}

/* 按钮样式优化 */
:deep(.el-button--small) {
  padding: 5px 12px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .order-section,
  .material-section {
    margin-bottom: 16px;
    padding: 12px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .section-header h3 {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  :deep(.el-col) {
    width: 100%;
    margin-bottom: 8px;
  }
  
  :deep(.el-form-item__label) {
    width: 100px !important;
  }
}
</style>