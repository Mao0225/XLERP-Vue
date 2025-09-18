<template>
  <el-dialog
    title="录入铝锭检验数据"
    :model-value="visible"
    width="1200px"
    :center="true"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @closed="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="custom-form">
      <el-row :gutter="24">
        <!-- 基础信息 -->
        <el-col :span="24">
          <el-divider content-position="left">基础信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据号" prop="basNo">
            <el-input v-model="form.basNo" placeholder="单据号" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复检单号" prop="matRecheckNo">
            <el-input v-model="form.matRecheckNo" placeholder="请输入复检单号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原材料制造商" prop="mafactory">
            <el-input
              v-model="form.mafactory"
              placeholder="选择原材料制造商"
              readonly
              clearable
            >

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="牌号" prop="matMaterial">
            <el-input v-model="form.matMaterial" placeholder="请输入牌号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质" prop="material">
            <el-input v-model="form.material" placeholder="请输入材质" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="type">
            <el-input v-model="form.type" placeholder="请输入型号" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验标准" prop="standard">
            <el-input v-model="form.standard" placeholder="请输入检验标准" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观尺寸" prop="appearanceSize">
            <el-select v-model="form.appearanceSize" placeholder="请选择检验结果" clearable size="small">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="炉批号" prop="batchNo">
            <el-input v-model="form.batchNo" placeholder="请输入炉批号" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际来货数量(件)" prop="quantity">
            <el-input v-model.number="form.quantity" placeholder="请输入数量" clearable size="small" step="0.01" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽检数量(件)" prop="sampleQuantity">
            <el-input v-model.number="form.sampleQuantity" placeholder="请输入抽检数量" type="number" clearable size="small" step="0.01" />
          </el-form-item>
        </el-col>

        <!-- 化学成分 -->
        <el-col :span="24">
          <el-divider content-position="left">化学成分 (%)</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="24">
            <el-col :span="8" v-for="chem in chemicals" :key="chem.key">
              <el-form-item :label="chem.label">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model.number="form[chem.actualProp]" :placeholder="chem.label + '实测值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="chem.requiredProp" :rules="rules[chem.requiredProp]">
                      <el-input v-model.number="form[chem.requiredProp]" :placeholder="chem.label + '要求值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 过程信息 -->
        <el-col :span="24">
          <el-divider content-position="left">过程信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂检测日期" prop="leaveFactoryDate">
            <el-date-picker
              v-model="form.leaveFactoryDate"
              type="date"
              placeholder="选择出厂日期"
              value-format="YYYY-MM-DD"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入厂检测日期" prop="detectionTime">
            <el-date-picker
              v-model="form.detectionTime"
              type="date"
              placeholder="选择入厂日期"
              value-format="YYYY-MM-DD"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <!-- 总结论 -->
        <el-col :span="24">
          <el-divider content-position="left">总结论</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最终检验结论" prop="finalConclusion">
            <el-select v-model="form.finalConclusion" placeholder="请选择检验结论" clearable size="small">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
              <el-option label="复检" value="复检"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 文件上传和备注 -->
        <el-col :span="24">
          <el-form-item label="质量证明书" prop="certificate">
            <el-upload
              ref="certificateUpload"
              :auto-upload="false"
              :on-change="handleCertificateChange"
              :limit="10"
              accept=".pdf,.jpg,.jpeg,.png"
              :file-list="certificateFileList"
              :show-file-list="false"
            >
              <el-button type="primary" size="small">上传文件</el-button>
            </el-upload>
            <div class="uploaded-files" v-if="form.certificate && JSON.parse(form.certificate).length > 0">
              <div v-for="(file, index) in JSON.parse(form.certificate)" :key="index" class="uploaded-file">
                <span class="file-name" @click="openFileInNewWindow(file.url, file.name)">
                  {{ file.name }}
                </span>
                <el-button type="text" size="small" @click="deleteCertificateFile(index)">删除</el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
      </span>
    </template>

    <!-- 供应商选择弹窗 -->
    <SupplierSelector
      v-model:visible="supplierSelectorVisible"
      @select="handleSelect"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateLd } from '@/api/clmanage/cl-ld'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'
import SupplierSelector from '../components/SupplierSelector.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const chemicals = [
  { key: 'Al', label: 'Al', actualProp: 'chemAl', requiredProp: 'chemAlRequired' },
  { key: 'Si', label: 'Si', actualProp: 'chemSi', requiredProp: 'chemSiRequired' },
  { key: 'Fe', label: 'Fe', actualProp: 'chemFe', requiredProp: 'chemFeRequired' },
  { key: 'Cu', label: 'Cu', actualProp: 'chemCu', requiredProp: 'chemCuRequired' },
  { key: 'Mn', label: 'Mn', actualProp: 'chemMn', requiredProp: 'chemMnRequired' },
  { key: 'Mg', label: 'Mg', actualProp: 'chemMg', requiredProp: 'chemMgRequired' },
  { key: 'Zn', label: 'Zn', actualProp: 'chemZn', requiredProp: 'chemZnRequired' },
  { key: 'Ni', label: 'Ni', actualProp: 'chemNi', requiredProp: 'chemNiRequired' },
  { key: 'Ti', label: 'Ti', actualProp: 'chemTi', requiredProp: 'chemTiRequired' }
]

const supplierSelectorVisible = ref(false)
const emit = defineEmits(['update:visible', 'success'])
const userStore = useUserStore()
const baseUrl = baseURL
const formRef = ref(null)
const certificateUpload = ref(null)
const certificateFileList = ref([])
const submitting = ref(false)

const form = reactive({
  id: undefined,
  matRecheckNo: '',
  mafactory: '',
  matMaterial: '',
  chemAl: '',
  chemSi: '',
  chemFe: '',
  chemCu: '',
  chemMn: '',
  chemMg: '',
  chemZn: '',
  chemNi: '',
  chemTi: '',
  chemAlRequired: '',
  chemSiRequired: '',
  chemFeRequired: '',
  chemCuRequired: '',
  chemMnRequired: '',
  chemMgRequired: '',
  chemZnRequired: '',
  chemNiRequired: '',
  chemTiRequired: '',
  leaveFactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  status: '40',
  memo: '',
  basNo: '',
  batchNo: '',
  quantity: '',
  sampleQuantity: '',
  material: '',
  type: '',
  standard: '',
  appearanceSize: '',
  auditor: '',
  checker: '',
  checkFinishTime: '',
  contractNo: '',
  contractName: '',
  acceptQuantity: '',
  finalConclusion: ''
})

const rules = reactive({
  matRecheckNo: [
    { required: true, message: '请输入复检单号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  mafactory: [
    { required: true, message: '请选择原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matMaterial: [
    { required: true, message: '请输入牌号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemAl: [
    { required: true, message: '请输入Al含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSi: [
    { required: true, message: '请输入Si含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemFe: [
    { required: true, message: '请输入Fe含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemCu: [
    { required: true, message: '请输入Cu含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn: [
    { required: true, message: '请输入Mn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMg: [
    { required: true, message: '请输入Mg含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemZn: [
    { required: true, message: '请输入Zn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemNi: [
    { required: true, message: '请输入Ni含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemTi: [
    { required: true, message: '请输入Ti含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemAlRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSiRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemFeRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemCuRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMnRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMgRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemZnRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemNiRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemTiRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  detectionTime: [
    { required: true, message: '请选择入厂检测日期', trigger: 'change' }
  ],
  certificate: [
    { required: true, message: '请上传质量证明书', trigger: 'change' }
  ],
  basNo: [
    { required: true, message: '单据号不能为空', trigger: 'blur' }
  ],
  memo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  batchNo: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  quantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sampleQuantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  material: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  standard: [
    { required: true, message: '请输入检验标准', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  appearanceSize: [
    { required: true, message: '请选择外观是否合格', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  auditor: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  checker: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  contractNo: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  contractName: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  acceptQuantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  finalConclusion: [
    { required: true, message: '请选择最终检验结论', trigger: 'change' }
  ]
})

watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(form, {
      id: newData.id || undefined,
      matRecheckNo: newData.matRecheckNo || '',
      mafactory: newData.mafactory || '',
      matMaterial: newData.matMaterial || '',
      chemAl: newData.chemAl || '',
      chemSi: newData.chemSi || '',
      chemFe: newData.chemFe || '',
      chemCu: newData.chemCu || '',
      chemMn: newData.chemMn || '',
      chemMg: newData.chemMg || '',
      chemZn: newData.chemZn || '',
      chemNi: newData.chemNi || '',
      chemTi: newData.chemTi || '',
      chemAlRequired: newData.chemAlRequired || '',
      chemSiRequired: newData.chemSiRequired || '',
      chemFeRequired: newData.chemFeRequired || '',
      chemCuRequired: newData.chemCuRequired || '',
      chemMnRequired: newData.chemMnRequired || '',
      chemMgRequired: newData.chemMgRequired || '',
      chemZnRequired: newData.chemZnRequired || '',
      chemNiRequired: newData.chemNiRequired || '',
      chemTiRequired: newData.chemTiRequired || '',
      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      certificate: newData.certificate || '[]',
      status: newData.status || '40',
      memo: newData.memo || '',
      basNo: newData.basNo || '',
      batchNo: newData.batchNo || '',
      quantity: newData.quantity || '',
      sampleQuantity: newData.sampleQuantity || '',
      material: newData.material || '',
      type: newData.type || '',
      standard: newData.standard || '',
      appearanceSize: newData.appearanceSize || '',
      auditor: newData.auditor || '',
      checker: newData.checker || '',
      checkFinishTime: newData.checkFinishTime || '',
      contractNo: newData.contractNo || '',
      contractName: newData.contractName || '',
      acceptQuantity: newData.acceptQuantity || '',
      finalConclusion: newData.finalConclusion || ''
    })
    certificateFileList.value = JSON.parse(form.certificate)
  }
}, { immediate: true })

const selectManufacturer = () => {
  supplierSelectorVisible.value = true
}

const handleSelect = (supplier) => {
  form.mafactory = supplier.descr
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (certificateUpload.value) {
    certificateUpload.value.clearFiles()
  }
  certificateFileList.value = []
  Object.assign(form, {
    id: undefined,
    matRecheckNo: '',
    mafactory: '',
    matMaterial: '',
    chemAl: '',
    chemSi: '',
    chemFe: '',
    chemCu: '',
    chemMn: '',
    chemMg: '',
    chemZn: '',
    chemNi: '',
    chemTi: '',
    chemAlRequired: '',
    chemSiRequired: '',
    chemFeRequired: '',
    chemCuRequired: '',
    chemMnRequired: '',
    chemMgRequired: '',
    chemZnRequired: '',
    chemNiRequired: '',
    chemTiRequired: '',
    leaveFactoryDate: '',
    detectionTime: '',
    certificate: '[]',
    status: '40',
    memo: '',
    basNo: '',
    batchNo: '',
    quantity: '',
    sampleQuantity: '',
    material: '',
    type: '',
    standard: '',
    appearanceSize: '',
    auditor: '',
    checker: '',
    checkFinishTime: '',
    contractNo: '',
    contractName: '',
    acceptQuantity: '',
    finalConclusion: ''
  })
}

const handleCertificateChange = async (file) => {
  const formData = new FormData()
  formData.append('file', file.raw)
  try {
    const res = await uploadFile(formData)
    if (res.success && res.data && res.data.url) {
      const relativeUrl = res.data.url
      const fileList = JSON.parse(form.certificate)
      fileList.push({ name: file.name, url: relativeUrl })
      form.certificate = JSON.stringify(fileList)
      certificateFileList.value.push({ name: file.name, url: relativeUrl })
      ElMessage.success(`${file.name} 上传成功`)
    } else {
      throw new Error(res.msg || '文件上传失败')
    }
  } catch (error) {
    console.error('文件上传失败', error)
    ElMessage.error(`${file.name} 上传失败`)
    certificateUpload.value.clearFiles()
  }
}

const deleteCertificateFile = (index) => {
  const fileList = JSON.parse(form.certificate)
  fileList.splice(index, 1)
  form.certificate = JSON.stringify(fileList)
  certificateFileList.value.splice(index, 1)
}

const openFileInNewWindow = (url) => {
  window.open(baseUrl + url, '_blank')
}

const submitForm = async () => {
  if (!formRef.value) return
  submitting.value = true
  try {
    await formRef.value.validate()
    if (!form.basNo) {
      ElMessage.error('单据号不能为空，请检查')
      return
    }
    await updateLd(form)
    emit('success')
    emit('update:visible', false)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新数据失败', error)
    ElMessage.error('更新数据失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
}

:deep(.el-dialog__header) {
  background: #f5f7fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecef;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 20px 24px;
  max-height: 75vh;
  overflow-y: auto;
}

.custom-form {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
}

:deep(.el-divider--horizontal) {
  margin: 16px 0;
}

:deep(.el-divider__text) {
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
  background: #fff;
  padding: 0 12px;
}

:deep(.el-input--small .el-input__inner) {
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
}

:deep(.el-date-editor--date) {
  width: 100%;
}

:deep(.el-upload) {
  display: inline-block;
}

:deep(.el-button--small) {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 6px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.uploaded-files {
  margin-top: 10px;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #e8ecef;
  border-radius: 6px;
  padding: 10px;
  background: #fafafa;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  padding: 6px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  color: #409eff;
  cursor: pointer;
  font-size: 13px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name:hover {
  text-decoration: underline;
}

:deep(.el-button--text) {
  color: #f56c6c;
  padding: 0;
  font-size: 13px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog__footer) {
  padding: 14px 24px;
  border-top: 1px solid #e8ecef;
  background: #f5f7fa;
}

:deep(.el-textarea__inner) {
  resize: vertical;
  font-size: 13px;
  border-radius: 6px;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90%;
  }

  .el-col:nth-child(n) {
    margin-bottom: 0;
  }
}
</style>