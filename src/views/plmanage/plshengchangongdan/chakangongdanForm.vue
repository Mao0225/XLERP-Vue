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
      </div>
      
      <el-form ref="formRef" :model="form" label-width="120px" size="small">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="生产订单号">
                <el-input v-model="form.ipoNo" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单编码">
                <el-input v-model="form.woNo" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态">
                <el-input :value="getStatusLabel(form.woStatus)" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码">
                <el-input v-model="form.purchaserHqCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码">
                <el-input v-model="form.supplierCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input v-model="form.supplierName" readonly />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="合同编号">
                <el-input v-model="form.contractNo" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 物料信息 -->
        <div class="form-section">
          <div class="section-title">物料信息</div>
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
              <el-form-item label="厂家物料编码">
                <el-input v-model="form.materialsCode" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 时间计划 -->
        <div class="form-section">
          <div class="section-title">时间计划</div>
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
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="实物ID">
                <el-input v-model="form.entityCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工艺路线编码">
                <el-input v-model="form.processRouteNo" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据来源">
                <el-input v-model="form.dataSource" readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="录入人">
                <el-input v-model="form.writer" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入时间">
                <el-input :value="formatDate(form.writetime)" readonly />
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
      </div>

      <!-- 物料列表 -->
      <el-table :data="materialList" border size="small" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="itemname" label="物料名称" min-width="120" />
        <el-table-column prop="productModel" label="规格型号" width="100" />
        <el-table-column prop="amount" label="数量" width="80" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="workshopName" label="生产车间" min-width="150" />
        <el-table-column prop="memo" label="备注" min-width="120" />
      </el-table>

      <div v-if="materialList.length === 0" class="empty-material">
        <p>暂无物料信息</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getGongdanItemListByDepNo } from '@/api/plmanage/plshengchangongdan'
import { getBasDepartmentOptions } from '@/api/system/department'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  depNo: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:visible', 'close'])

// 工单状态选项
const statusOptions = [
  { id: 1, value: '待处理' },
  { id: 2, value: '处理中' },
  { id: 3, value: '已完成' },
  { id: 4, value: '已取消' },
  { id: 5, value: '已过期' }
]

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

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 弹窗标题
const dialogTitle = computed(() => '查看生产工单详情')

// 表单引用
const formRef = ref(null)

// 物料列表
const materialList = ref([])

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
  dataSource: '',
  dataSourceCreateTime: '',
  ownerId: '',
  openId: '',
  writer: '',
  writetime: ''
})

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.value : '未知状态'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.woNo) return
  
  try {
    const res = await getGongdanItemListByDepNo({ woNo: form.woNo , depNo: props.depNo })
    materialList.value = (res.data.itemList || []).map(item => ({
      ...item,
      workshopName: getWorkshopName(item.workshopName || item.workshopCode || '')
    }))
  } catch (error) {
    ElMessage.error('加载物料列表失败')
  }
}

// 重置表单
const resetForm = () => {
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
    dataSource: '',
    dataSourceCreateTime: '',
    ownerId: '',
    openId: '',
    writer: '',
    writetime: ''
  })
  materialList.value = []
}

// 监听表单数据变化
watch(() => props.formData, (newData) => {
  loadWorkshopData();

  if (newData && Object.keys(newData).length > 0) {
    Object.assign(form, newData)
    
    // 如果有工单号，加载物料列表
    if (newData.woNo) {
      loadMaterialList()
    }
    
    // 如果有物料数据，设置物料列表
    if (newData.materialList) {
      materialList.value = newData.materialList
    }
  }
}, { immediate: true, deep: true })

// 关闭按钮处理
const handleClose = () => {
  emit('close')
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
:deep(.el-textarea__inner) {
  border-radius: 4px;
  height: 30px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  color: #606266;
}

:deep(.el-form-item__label) {
  font-weight: 400;
  color: #666;
  font-size: 13px;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
  cursor: not-allowed;
}

.empty-material {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}
</style>