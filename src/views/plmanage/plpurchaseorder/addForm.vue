<template>
  <CustomDialog
    :visible="dialogVisible"
    title="新增采购计划"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <!-- 采购计划主信息表单 -->
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="130px"
      class="main-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购计划编号" prop="purchaseOrderNo">
            <el-input v-model="form.purchaseOrderNo" placeholder="系统自动生成" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购计划名称" prop="orderName">
            <el-input v-model="form.orderName" placeholder="请输入采购计划名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单人" prop="writer">
            <el-input v-model="form.writer" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制单日期">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              :disabled-date="disabledDate"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input
              v-model="form.memo"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 材料列表区域 -->
    <div class="material-section">
      <div class="section-header">
        <h4 class="section-title">采购材料列表</h4>
        <el-button type="primary" size="small" @click="openMaterialSelector">
          <el-icon><Plus /></el-icon>
          添加材料
        </el-button>
      </div>

      <!-- 材料表格 -->
      <el-table
        :data="materialList"
        border
        style="width: 100%"
        v-if="materialList.length > 0"
        class="material-table"
      >
        <el-table-column label="物料编号" prop="itemNo"  />
        <el-table-column label="物料名称" prop="itemName"  />
        <el-table-column label="规格型号" prop="itemSpec"  />
        <el-table-column label="物料分类" prop="inclass"  />
        <el-table-column label="单位" prop="unit" width="60" />
        <el-table-column label="计划数量" prop="planQuantity" width="100" align="center" />
        <el-table-column label="执行标准" >
          <template #default="scope">
            <el-input
              v-model="scope.row.standard"
              placeholder="请输入"
              size="small"
              @change="handleMaterialEdit"
            />
          </template>
        </el-table-column>
        <el-table-column label="材质" width="110">
          <template #default="scope">
            <el-input
              v-model="scope.row.material"
              placeholder="请输入"
              size="small"
              @change="handleMaterialEdit"
            />
          </template>
        </el-table-column>
        <el-table-column label="采购数量" width="110">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.actualQuantity"
              :min="0"
              :precision="2"
              size="small"
              style="width: 100%"
              @change="handleMaterialEdit"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注" width="140">
          <template #default="scope">
            <el-input
              v-model="scope.row.orderMemo"
              placeholder="请输入"
              size="small"
              @change="handleMaterialEdit"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button
              type="danger"
              link
              size="small"
              @click="deleteMaterial(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-empty description="暂无采购材料">
          <el-button type="primary" @click="openMaterialSelector">
            <el-icon><Plus /></el-icon>
            去添加
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认新增
      </el-button>
    </template>

    <!-- 材料选择器 -->
    <MaterialSelector
      v-model:visible="isSelectorOpen"
      :default-contract-no="''"
      @select="handleMaterialSelect"
    />
  </CustomDialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 引入组件
import CustomDialog from '@/components/common/CustomDialog.vue' // 请根据实际路径调整
import MaterialSelector from './materialSelector.vue'

// 引入接口
import { savePurchaseOrder } from '@/api/plmanage/plpurchaseorder'
import { updateContractMaterial } from '@/api/contract/bascontractmaterial'

// 引入用户存储
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  newCode: { type: String, default: '' } // 采购计划编号
})

const emit = defineEmits(['update:modelValue', 'success'])

// ==================== 弹窗状态 ====================
const dialogVisible = ref(props.modelValue)
const isFullscreen = ref(true)
const isSelectorOpen = ref(false)
const loading = ref(false)

// ==================== 表单相关 ====================
const formRef = ref(null)
const form = ref({
  purchaseOrderNo: '',
  orderName: '',
  writer: '',
  createTime: '',
  status: 10,//10录入草稿状态
  memo: ''
})

const rules = {
  purchaseOrderNo: [{ required: true, message: '采购计划编号不能为空', trigger: 'blur' }],
  orderName: [{ required: true, message: '采购计划名称不能为空', trigger: 'blur' }],
  writer: [{ required: true, message: '制单人不能为空', trigger: 'blur' }]
}

// 禁用未来日期
const disabledDate = (time) => time.getTime() > Date.now()

// ==================== 材料列表 ====================
const materialList = ref([])

// ==================== 监听弹窗显示 ====================
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      nextTick(() => {
        const now = new Date().toISOString().slice(0, 10)
        form.value = {
          purchaseOrderNo: props.newCode,
          orderName: '',
          writer: userStore.realName || '',
          createTime: now,
          status: 10,
          memo: ''
        }
        console.log('form', form.value)
        formRef.value?.resetFields()
        materialList.value = []
      })
    }
  }
)

// ==================== 材料选择器 ====================
const openMaterialSelector = () => {
  isSelectorOpen.value = true
}

const handleMaterialSelect = (selectedMaterials) => {
  if (!Array.isArray(selectedMaterials) || selectedMaterials.length === 0) return

  const existingIds = new Set(materialList.value.map(m => m.id))
  const newMaterials = selectedMaterials.filter(m => !existingIds.has(m.id))

  if (newMaterials.length === 0) {
    ElMessage.info('所选材料已全部添加')
    return
  }

  const initMaterials = newMaterials.map(m => ({
    ...m,
    standard: '',
    material: '',
    actualQuantity: m.planQuantity || 0,
    orderMemo: ''
  }))

  materialList.value = [...materialList.value, ...initMaterials]
  ElMessage.success(`成功添加 ${initMaterials.length} 种材料`)
}

// ==================== 材料操作 ====================
const handleMaterialEdit = () => {
  // v-model 已实时更新，无需额外处理
}

const deleteMaterial = (index) => {
  materialList.value.splice(index, 1)
  ElMessage.success('删除成功')
}

// ==================== 关闭弹窗 ====================
const handleClose = () => {
  emit('update:modelValue', false)
  materialList.value = []
  isSelectorOpen.value = false
  isFullscreen.value = false
}

// ==================== 提交保存 ====================
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    if (materialList.value.length === 0) {
      ElMessage.warning('请至少添加一种采购材料')
      return
    }

    loading.value = true

    // 1. 保存主表
    const mainRes = await savePurchaseOrder(form.value)
    if (!mainRes.success) {
      ElMessage.error(mainRes.msg || '保存失败')
      return
    }

    // 2. 批量更新材料
    const purchaseOrderNo = form.value.purchaseOrderNo
    const failList = []

    for (const item of materialList.value) {
      const params = {
        id: item.id,
        purchaseOrderNo,
        standard: item.standard,
        material: item.material,
        actualQuantity: item.actualQuantity,
        orderMemo: item.orderMemo,
        contractNo: item.contractNo,
        itemId: item.itemId
      }

      try {
        const res = await updateContractMaterial(params)
        if (!res.success) {
          failList.push({ name: item.itemName, msg: res.msg })
        }
      } catch (err) {
        failList.push({ name: item.itemName, msg: '网络错误' })
      }
    }

    // 3. 结果反馈
    if (failList.length === 0) {
      ElMessage.success('采购计划新增成功！')
      emit('success')
      handleClose()
    } else {
      ElMessage.warning(
        `主信息保存成功，但 ${failList.length} 项材料更新失败，请检查后重试`
      )
      console.warn('失败项：', failList)
    }
  } catch (err) {
    ElMessage.error('表单校验失败或保存出错')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 主表单卡片风格 */
.main-form {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

/* 材料区域 */
.material-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

/* 表格输入框优化 */
.material-table :deep(.el-input__inner),
.material-table :deep(.el-input-number) {
  height: 32px;
}

.material-table :deep(.el-input__inner) {
  font-size: 13px;
}

/* 空状态美化 */
.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #909399;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-form,
  .material-section {
    padding: 16px;
  }
}
</style>