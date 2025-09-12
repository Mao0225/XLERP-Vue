<template>
  <el-dialog title="新增铝锭数据" :model-value="visible" width="800px" :center="true" :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)" @closed="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="custom-form">
      <el-row :gutter="20">
        <!-- 基础信息 -->
        <el-col :span="12">
          <el-form-item label="单据号" prop="basno">
            <el-input v-model="form.basno" placeholder="自动生成" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录入人" prop="writer">
            <el-input v-model="form.writer" placeholder="录入人" readonly size="small" />
          </el-form-item>
        </el-col>


        <!-- 制造商信息 -->
        <el-col :span="24">
          <el-form-item label="原材料制造商" prop="mafactory">
            <el-input v-model="form.mafactory" placeholder="选择原材料制造商" readonly clearable @click="selectManufacturer"
              size="small">
              <template #append>
                <el-button @click="selectManufacturer" size="small">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <!-- 批次和单号信息 -->
        <el-col :span="12">
          <el-form-item label="检验批次号" prop="matRecheckNo">
            <el-input v-model="form.matRecheckNo" placeholder="请输入批次号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库单号" prop="inNo">
            <el-input v-model="form.inNo" placeholder="请输入入库单号" clearable size="small" />
          </el-form-item>
        </el-col>

        <!-- 材料和规格信息 -->
        <el-col :span="12">
          <el-form-item label="牌号" prop="matMaterial">
            <el-input v-model="form.matMaterial" placeholder="请输入牌号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质" prop="material">
            <el-input v-model="form.material" placeholder="请输入材质" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验标准" prop="standard">
            <el-input v-model="form.standard" placeholder="请输入检验标准" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="type">
            <el-input v-model="form.type" placeholder="请输入型号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观尺寸检验" prop="appearanceSize">
            <el-select v-model="form.appearanceSize" placeholder="请选择检验结果" clearable size="small" :disabled="false">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="炉批号" prop="batchNo">
            <el-input v-model="form.batchNo" placeholder="请输入炉批号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量(t)" prop="quantity">

              <el-input v-model.number="form.quantity" placeholder="请输入数量" type="number" clearable size="small" step="0.01" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品数量(t)" prop="sampleQuantity">

              <el-input v-model.number="form.sampleQuantity" placeholder="请输入样品数量" type="number" clearable size="small" step="0.01" />

          </el-form-item>
        </el-col>

        <!-- 人员信息 -->
        <el-col :span="12">
          <el-form-item label="检查员" prop="checker">
            <el-input v-model="form.checker" placeholder="请输入检查员" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核人" prop="auditor">
            <el-input v-model="form.auditor" placeholder="请输入审核人" clearable size="small" />
          </el-form-item>
        </el-col>

        <!-- 化学成分含量 -->
        <el-col :span="24">
          <el-divider content-position="left">化学成分含量 (%)</el-divider>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Al" prop="chemAl">
            <el-input v-model.number="form.chemAl" placeholder="Al含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Si" prop="chemSi">
            <el-input v-model.number="form.chemSi" placeholder="Si含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Fe" prop="chemFe">
            <el-input v-model.number="form.chemFe" placeholder="Fe含量" clearable size="small" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Cu" prop="chemCu">
            <el-input v-model.number="form.chemCu" placeholder="Cu含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Mn" prop="chemMn">
            <el-input v-model.number="form.chemMn" placeholder="Mn含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Mg" prop="chemMg">
            <el-input v-model.number="form.chemMg" placeholder="Mg含量" clearable size="small" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Zn" prop="chemZn">
            <el-input v-model.number="form.chemZn" placeholder="Zn含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Ni" prop="chemNi">
            <el-input v-model.number="form.chemNi" placeholder="Ni含量" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Ti" prop="chemTi">
            <el-input v-model.number="form.chemTi" placeholder="Ti含量" clearable size="small" />
          </el-form-item>
        </el-col>

        <!-- 检测日期 -->
        <el-col :span="12">
          <el-form-item label="出厂检测日期" prop="leavefactoryDate">
            <el-date-picker v-model="form.leavefactoryDate" type="date" placeholder="选择出厂日期" value-format="YYYY-MM-DD"
              size="small" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入厂检测日期" prop="detectionTime">
            <el-date-picker v-model="form.detectionTime" type="date" placeholder="选择入厂日期" value-format="YYYY-MM-DD"
              size="small" style="width: 100%" />
          </el-form-item>
        </el-col>

        <!-- 文件上传和备注 -->
        <el-col :span="24">
          <el-form-item label="质量证明书" prop="certificate">
            <el-upload ref="certificateUpload" :auto-upload="false" :on-change="handleCertificateChange" :limit="10"
              accept=".pdf,.jpg,.jpeg,.png" :file-list="certificateFileList" :show-file-list="false">
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

        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input v-model="form.memo" type="textarea" :rows="3" placeholder="请输入备注信息" clearable maxlength="200"
              show-word-limit />
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
    <SupplierSelector v-model:visible="supplierSelectorVisible" @select="handleSelect" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { createLd } from '@/api/clmanage/cl-ld'
import { getNewNoNyName } from '@/api/system/basno'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'
import SupplierSelector from '../components/SupplierSelector.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const supplierSelectorVisible = ref(false)
const emit = defineEmits(['update:visible', 'success'])
const userStore = useUserStore()
const baseUrl = baseURL
const formRef = ref(null)
const certificateUpload = ref(null)
const certificateFileList = ref([])
const submitting = ref(false)

const selectManufacturer = () => {
  supplierSelectorVisible.value = true
}

const handleSelect = (supplier) => {
  console.log("选中的供应商是:", supplier.descr)
  form.mafactory = supplier.descr
}

const form = reactive({
  id: undefined,
  matRecheckNo: '',
  mafactory: '',
  matMaterial: '',
  inNo: '',
  chemAl: '',
  chemSi: '',
  chemFe: '',
  chemCu: '',
  chemMn: '',
  chemMg: '',
  chemZn: '',
  chemNi: '',
  chemTi: '',
  leavefactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  writeTime: '',
  writer: userStore.descr || '未知用户',
  status: '0',
  memo: '',
  basno: '',
  standard: '',
  appearanceSize: '合格',
  type: '',
  batchNo: '',
  quantity: '',
  sampleQuantity: '',
  checker: '',
  auditor: '',
  material: ''
})

const rules = reactive({
  mafactory: [
    { required: true, message: '请选择原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matRecheckNo: [
    { required: true, message: '请输入来料检验批次号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matMaterial: [
    { required: true, message: '请输入牌号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  inNo: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemAl: [
    { required: true, message: '请输入Al含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemSi: [
    { required: true, message: '请输入Si含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemFe: [
    { required: true, message: '请输入Fe含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemCu: [
    { required: true, message: '请输入Cu含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemMn: [
    { required: true, message: '请输入Mn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemMg: [
    { required: true, message: '请输入Mg含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemZn: [
    { required: true, message: '请输入Zn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemNi: [
    { required: true, message: '请输入Ni含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  chemTi: [
    { required: true, message: '请输入Ti含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  detectionTime: [
    { required: true, message: '请选择入厂检测日期', trigger: 'change' }
  ],
  certificate: [
    { required: true, message: '请上传质量证明书', trigger: 'change' }
  ],
  writer: [
    { required: true, message: '录入人不能为空', trigger: 'blur' }
  ],
  basno: [
    { required: true, message: '请获取单据号', trigger: 'blur' }
  ],
  memo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  standard: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  appearanceSize: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
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
  checker: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  auditor: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  material: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ]
})

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
    inNo: '',
    chemAl: '',
    chemSi: '',
    chemFe: '',
    chemCu: '',
    chemMn: '',
    chemMg: '',
    chemZn: '',
    chemNi: '',
    chemTi: '',
    leavefactoryDate: '',
    detectionTime: '',
    certificate: '[]',
    writeTime: '',
    writer: userStore.descr || '未知用户',
    status: '0',
    memo: '',
    basno: '',
    standard: '',
    appearanceSize: '',
    type: '',
    batchNo: '',
    quantity: '',
    sampleQuantity: '',
    checker: '',
    auditor: '',
    material: ''
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
    if (!form.basno) {
      ElMessage.error('单据号未生成，请刷新重试')
      return
    }
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    form.writeTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    await createLd(form)
    emit('success')
    emit('update:visible', false)
    ElMessage.success('新增成功')
  } catch (error) {
    console.error('保存数据失败', error)
    ElMessage.error('保存数据失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getNewNoNyName('cl-ld')
    if (res.code === 200) {
      form.basno = res.data.fullNoNyName
    } else {
      ElMessage.warning('获取单据号失败，可手动填写')
    }
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    form.writeTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    console.error('获取单据号异常', e)
    ElMessage.error('获取单据号失败')
  }
})
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-dialog__header) {
  background: #f5f7fa;
  padding: 14px 16px;
  border-bottom: 1px solid #e8ecef;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 16px 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.custom-form {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 14px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
}

:deep(.el-divider--horizontal) {
  margin: 12px 0;
}

:deep(.el-divider__text) {
  font-size: 13px;
  color: #409eff;
  font-weight: 500;
}

:deep(.el-input--small .el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-date-editor--date) {
  width: 100%;
}

:deep(.el-upload) {
  display: inline-block;
}

:deep(.el-button--small) {
  padding: 6px 12px;
  font-size: 12px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.uploaded-files {
  margin-top: 8px;
  max-height: 100px;
  overflow-y: auto;
  border: 1px solid #e8ecef;
  border-radius: 4px;
  padding: 8px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
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
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-dialog__footer) {
  padding: 12px 20px;
  border-top: 1px solid #e8ecef;
  background: #f5f7fa;
}

:deep(.el-textarea__inner) {
  resize: vertical;
  font-size: 13px;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95%;
  }

  .el-col:nth-child(n) {
    margin-bottom: 0;
  }
}
</style>