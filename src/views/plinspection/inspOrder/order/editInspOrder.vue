<template>
  <el-dialog
    title="编辑报检单"
    v-model="visible"
    width="1000px"
    @closed="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <!-- 物料选择展示区（必填） -->
      <el-form-item label="已选物料信息" prop="purchaseId" class="material-select-section">
        <div class="material-select-container">
          <el-button type="primary" @click="openContractMatListSelect">选择物料</el-button>
          <!-- 物料信息展示卡片 -->
          <div v-if="selectedMat" class="material-info-card">
            <div class="material-info-grid">
              <div class="material-info-item">
                <span class="label">合同编号：</span>
                <span class="value">{{ selectedMat.contractNo }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">合同名称：</span>
                <span class="value" :title="selectedMat.contractName">{{ selectedMat.contractName }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">物料编号：</span>
                <span class="value">{{ selectedMat.itemNo }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">物料名称：</span>
                <span class="value" :title="selectedMat.itemName">{{ selectedMat.itemName }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">规格型号：</span>
                <span class="value" :title="selectedMat.itemSpec">{{ selectedMat.itemSpec }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">物料分类：</span>
                <span class="value" :title="selectedMat.inclass">{{ selectedMat.inclass }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">采购计划编号：</span>
                <span class="value">{{ selectedMat.purchaseOrderNo }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">采购计划名称：</span>
                <span class="value" :title="selectedMat.orderName">{{ selectedMat.orderName }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">采购计划备注：</span>
                <span class="value" :title="selectedMat.orderFormMemo">{{ selectedMat.orderFormMemo || '无' }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">制单人：</span>
                <span class="value">{{ selectedMat.orderWriter }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">单位：</span>
                <span class="value">{{ selectedMat.unit }}</span>
              </div>
              <div class="material-info-item">
                <span class="label">计划数量：</span>
                <span class="value">{{ selectedMat.planQuantity }}</span>
              </div>
            </div>
          </div>
          <div v-else class="material-placeholder">未选择物料，请点击上方按钮选择</div>
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="检验单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="系统自动生成或手动输入" readonly />
          </el-form-item>

          <el-form-item label="炉批号" prop="batchNo">
            <el-input v-model="form.batchNo" placeholder="如 20251030-001" />
          </el-form-item>

          <el-form-item label="批次号" prop="batchNumber">
            <el-input v-model="form.batchNumber" placeholder="如 BATCH-20251030" />
          </el-form-item>

          <el-form-item label="实际到货数量" prop="actualQuantity">
            <el-input-number v-model="form.actualQuantity" :precision="3" :step="1" style="width: 100%" />
          </el-form-item>

          <el-form-item label="实际到货重量" prop="actualWeight">
            <el-input-number v-model="form.actualWeight" :precision="2" :step="0.01" style="width: 100%" />
          </el-form-item>
        </el-col>

        <!-- 右列 -->
        <el-col :span="12">
          <el-form-item label="送货时间" prop="deliveryTime">
            <el-date-picker
              v-model="form.deliveryTime"
              type="datetime"
              placeholder="请选择送货时间"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>

          <el-form-item label="报检人" prop="reporter">
            <el-input v-model="form.reporter" readonly />
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" readonly />
          </el-form-item>
          <el-form-item label="实际到货材质" prop="actualMaterial">
            <el-input v-model="form.actualMaterial" placeholder="如 Q235B" />
          </el-form-item>

          <el-form-item label="实际到货型号" prop="actualSpec">
            <el-input v-model="form.actualSpec" placeholder="如 100*100*10" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="form.supplierName" placeholder="请选择供应商" readonly>
          <template #prepend>
            <el-button type="primary" @click="openSupplierSelector">{{ '选择供应商' }}</el-button>
          </template>
        </el-input>
      </el-form-item>

      <!-- 整单备注（全宽） -->
      <el-form-item label="整单备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选" />
      </el-form-item>

      <!-- 质量证明书上传（全宽） -->
      <el-form-item label="质量证明书">
        <div
          class="upload-box"
          :class="{ 'is-dragover': isDragover }"
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragover = true"
          @dragleave.prevent="isDragover = false"
        >
          <div class="upload-icon">
            <el-icon><UploadFilled /></el-icon>
          </div>
          <div class="upload-text">
            <p>拖拽文件到此处或 <el-button type="primary" link @click="triggerUpload">点击上传</el-button></p>
            <p class="upload-tip">支持 PDF、JPG、PNG</p>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style="display: none"
            @change="handleFileSelect"
          />

          <!-- 文件列表展示在盒子内 -->
          <div v-if="certificateFileList.length" class="file-list">
            <div v-for="(file, i) in certificateFileList" :key="i" class="file-item">
              <el-icon class="file-icon"><Document /></el-icon>
              <span class="file-name">{{ file.name }}</span>
              <el-button
                type="danger"
                size="small"
                link
                @click="removeFile(i)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">保存修改</el-button>
    </template>

    <contractMatListSelect
      v-model="selectVisible"
      @select="handleContractMatSelect"
    />
    <SupplierSelector v-model:visible="supplierSelectorVisible" @select="handleSupplierSelect" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Delete, UploadFilled } from '@element-plus/icons-vue'
import {
  updateInspOrder,
  getInspOrderById
} from '@/api/plinspection/inspOrder'
import { getContractMaterial } from '@/api/contract/bascontractmaterial'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'
import contractMatListSelect from '../../components/contractMatListSelect.vue'
import SupplierSelector from '../../components/SupplierSelector.vue'

const userStore = useUserStore()

// Props：编辑表单需接收报检单ID
const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    required: true
  },
  newCode: String // 兼容新建场景，编辑时无用但保留避免报错
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)

// 监听弹窗显示状态，加载编辑数据
watch(
  () => visible.value,
  async (isVisible) => {
    if (isVisible && props.id) {
      await loadData()
    }
  },
  { immediate: true }
)

// 监听props.modelValue同步弹窗显示状态
watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
    // 编辑时无需自动填充orderNo，由接口返回
  }
)

watch(visible, v => emit('update:modelValue', v))

// 表单核心变量
const formRef = ref(null)
const certificateFileList = ref([])
const isDragover = ref(false)
const fileInput = ref(null)
const selectVisible = ref(false)
const supplierSelectorVisible = ref(false)
const selectedMat = ref(null)

// 表单数据模型
const form = reactive({
  id: '', // 编辑时存储报检单ID
  purchaseId: '',
  itemId: '',
  orderNo: '',
  batchNo: '',
  batchNumber: '',
  quantity: null,
  actualQuantity: null,
  actualWeight: null,
  actualMaterial: '',
  actualSpec: '',
  deliveryTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
  reporter: userStore.realName || '',
  remark: '',
  certificate: '[]',
  status: 0,
  unit: 'kg',
  supplierName: '',
})

// 表单校验规则（保持不变）
const rules = {
  purchaseId: [{ required: true, message: '请选择材料', trigger: 'change' }],
  orderNo: [{ required: true, message: '请输入检验单号', trigger: 'blur' }],
  batchNo: [{ required: true, message: '请输入炉批号', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
  actualQuantity: [{ required: true, message: '请输入实际到货数量', trigger: 'blur' }],
  actualWeight: [{ required: true, message: '请输入实际到货重量', trigger: 'blur' }],
  actualMaterial: [{ required: true, message: '请输入材质', trigger: 'blur' }],
  actualSpec: [{ required: true, message: '请输入型号', trigger: 'blur' }],
  deliveryTime: [{ required: true, message: '请选择送货时间', trigger: 'change' }],
  reporter: [{ required: true, message: '请输入报检人', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请选择供应商名称', trigger: 'blur' }],
}

// 加载编辑数据（主表单+物料信息）
const loadData = async () => {
  try {
    // 1. 获取主表单数据
    const inspRes = await getInspOrderById({ id: props.id })
    if (!inspRes.success || !inspRes.data?.inspOrder) {
      ElMessage.error(inspRes.msg || '获取报检单数据失败')
      visible.value = false
      return
    }

    const record = inspRes.data.inspOrder
    Object.assign(form, record) // 同步主表单数据

    // 处理时间格式：兼容接口返回的ISO格式（含T分隔符）
    form.deliveryTime = record.deliveryTime
      ? record.deliveryTime.replace('T', ' ')
      : new Date().toISOString().slice(0, 16).replace('T', ' ')

    // 处理文件列表：同步已上传的文件
    form.certificate = record.certificate || '[]'
    const files = JSON.parse(form.certificate)
    certificateFileList.value = files.map(f => ({
      name: f.name,
      url: f.url
    }))

    // 2. 获取物料详情（通过purchaseId）
    if (form.purchaseId) {
      const matRes = await getContractMaterial({ id: form.purchaseId })
      if (matRes.success && matRes.data) {
        selectedMat.value = matRes.data.record // 赋值给已选物料展示
      } else {
        ElMessage.warning('物料信息加载失败，可重新选择')
        selectedMat.value = null
      }
    }
  } catch (err) {
    ElMessage.error('加载数据出错，请刷新重试')
    console.error('编辑数据加载失败：', err)
    visible.value = false
  }
}

// 供应商选择回调
const handleSupplierSelect = (row) => {
  form.supplierName = row.descr
  supplierSelectorVisible.value = false
}

// 打开供应商选择器
const openSupplierSelector = () => {
  supplierSelectorVisible.value = true
}

// 物料选择回调
const handleContractMatSelect = (row) => {
  form.purchaseId = row.id
  form.itemId = row.itemId
  selectedMat.value = row
  selectVisible.value = false
}

// 打开物料选择器
const openContractMatListSelect = () => {
  selectVisible.value = true
}

// 文件上传处理
const handleFileUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await uploadFile(formData)
    if (res.success && res.data?.url) {
      const relativeUrl = res.data.url
      const fileList = JSON.parse(form.certificate)
      fileList.push({ name: file.name, url: relativeUrl })
      form.certificate = JSON.stringify(fileList)
      certificateFileList.value.push({ name: file.name, url: relativeUrl })
      ElMessage.success(`${file.name} 上传成功`)
    } else {
      throw new Error(res.msg || '上传失败')
    }
  } catch (err) {
    ElMessage.error(`${file.name} 上传失败`)
  }
}

// 拖拽上传处理
const handleDrop = (e) => {
  isDragover.value = false
  const files = e.dataTransfer.files
  if (files.length) {
    Array.from(files).forEach(file => {
      if (/\.(pdf|jpe?g|png)$/i.test(file.name)) {
        handleFileUpload(file)
      } else {
        ElMessage.warning(`${file.name} 格式不支持`)
      }
    })
  }
}

// 触发文件选择框
const triggerUpload = () => {
  fileInput.value.click()
}

// 选择文件上传
const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length) {
    Array.from(files).forEach(file => handleFileUpload(file))
  }
  e.target.value = ''
}

// 删除已上传文件
const removeFile = (index) => {
  const fileList = JSON.parse(form.certificate)
  fileList.splice(index, 1)
  form.certificate = JSON.stringify(fileList)
  certificateFileList.value.splice(index, 1)
}

// 提交编辑表单
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      // 调用更新接口，携带报检单ID
      await updateInspOrder({
        ...form,
        id: props.id // 确保接口能识别要更新的记录
      })
      ElMessage.success('保存修改成功')
      visible.value = false
      emit('success') // 通知父组件刷新列表
    } catch (err) {
      ElMessage.error(err.message || '保存失败')
    }
  })
}

// 重置表单（关闭弹窗时触发）
const reset = () => {
  formRef.value?.resetFields()
  certificateFileList.value = []
  selectedMat.value = null
  Object.assign(form, {
    purchaseId: '',
    itemId: '',
    batchNo: '',
    batchNumber: '',
    actualQuantity: null,
    actualWeight: null,
    actualMaterial: '',
    actualSpec: '',
    deliveryTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    remark: '',
    certificate: '[]',
    supplierName: '',
    // 保留不变的字段：orderNo、reporter、unit、status、id
  })
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

/* 物料选择区域样式 */
.material-select-section {
  margin-bottom: 24px;
}

.material-select-container {
  width: 100%;
}

.material-info-card {
  margin-top: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

/* 固定两列布局 */
.material-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.material-info-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.8;
}

.material-info-item .label {
  color: #606266;
  font-size: 13px;
  min-width: 100px;
  font-weight: 500;
}

.material-info-item .value {
  color: #303133;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.material-placeholder {
  margin-top: 12px;
  padding: 24px 16px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  color: #909399;
  text-align: center;
  background: #fefefe;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 上传区域样式 */
.upload-box {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s;
  cursor: pointer;
  min-height: 120px;
}

.upload-box:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.upload-box.is-dragover {
  border-color: #409eff;
  background: #ecf5ff;
  border-style: solid;
}

.upload-icon {
  font-size: 36px;
  color: #c0c4cc;
  margin-bottom: 10px;
}

.upload-text p {
  margin: 6px 0;
  color: #606266;
  font-size: 14px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

/* 文件列表样式 */
.file-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  text-align: left;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
  max-width: 200px;
  min-width: 150px;
}

.file-item:hover {
  background: #f5f7fa;
  border-color: #c6e2ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.file-icon {
  font-size: 18px;
  color: #409eff;
  margin-right: 8px;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 6px;
}
</style>