<template>
  <el-dialog title="新增请检单" :model-value="visible" width="800px" :center="true" :close-on-click-modal="false"
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
          <el-form-item label="录入人" prop="requestWriter">
            <el-input v-model="form.requestWriter" placeholder="录入人" readonly size="small" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" placeholder="选择合同" readonly clearable="" @click="selectContract"
              size="small">
              <template #append="">
                <el-button @click="selectContract" size="small">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" placeholder="请输入合同名称" readonly clearable="" size="small">
            </el-input></el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="原材料制造商" prop="mafactory">
            <el-input v-model="form.mafactory" placeholder="选择原材料制造商" readonly clearable="" @click="selectManufacturer"
              size="small">
              <template #append="">
                <el-button @click="selectManufacturer" size="small">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="炉批号" prop="batchNo">
            <el-input v-model="form.batchNo" placeholder="请输入炉批号" clearable="" size="small">
            </el-input></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号" prop="batchNum">
            <el-input v-model="form.batchNum" placeholder="请输入批次号" clearable="" size="small">
            </el-input></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质" prop="material">
            <el-autocomplete v-model="form.material" :fetch-suggestions="queryMaterialSuggestions"
              placeholder="请选择或输入材质" clearable="" size="small">
            </el-autocomplete></el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="闭口销牌号" prop="matMaterial">
            <el-input v-model="form.matMaterial" placeholder="请输入闭口销牌号" clearable="" size="small">
            </el-input></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="type">
            <el-autocomplete v-model="form.type" :fetch-suggestions="queryTypeSuggestions" placeholder="请选择或输入型号"
              clearable="" size="small">
            </el-autocomplete></el-form-item>
        </el-col>
      <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" clearable="" size="small">
            </el-input></el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="送货数量" prop="deliveryQuantity">
            <el-input v-model.number="form.deliveryQuantity" placeholder="请输入送货数量" type="number" clearable=""
              size="small" step="0.01">
            </el-input></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收数量" prop="acceptQuantity">
            <el-input v-model.number="form.acceptQuantity" placeholder="请输入验收数量" type="number" clearable="" size="small"
              step="0.01">
            </el-input></el-form-item>
        </el-col>
       
        <el-col :span="24">
          <el-form-item label="质量证明书" prop="certificate">
            <el-upload ref="certificateUpload" :auto-upload="false" :on-change="handleCertificateChange" :limit="10"
              accept=".pdf,.jpg,.jpeg,.png" :file-list="certificateFileList" :show-file-list="false">
              <el-button type="primary" size="small">上传质量证明书</el-button>
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
            <el-input v-model="form.memo" type="textarea" :rows="3" placeholder="请输入备注信息" clearable="" maxlength="200"
              show-word-limit="">
            </el-input></el-form-item>
        </el-col>


        

        <SupplierSelector v-model:visible="supplierSelectorVisible" @select="handleSelect" />
        <ContractSelector v-model:visible="ContractSelectorVisible" @select="handleContractSelect" />
      </el-row>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createBkx } from '@/api/clmanage/cl-bkx'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'
import SupplierSelector from '../../components/SupplierSelector.vue'
import ContractSelector from '../../components/contractSelector.vue'

const props = defineProps({
visible: {
type: Boolean,
required: true
},
newCode: {
type: String,
default: ''
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
const ContractSelectorVisible = ref(false)

const selectManufacturer = () => {
supplierSelectorVisible.value = true
}

const selectContract = () => {
ContractSelectorVisible.value = true
}

const handleSelect = (supplier) => {
console.log("选中的供应商是:", supplier.descr)
form.mafactory = supplier.descr
}

const handleContractSelect = (contract) => {
console.log("选中的合同是:", contract)
form.contractNo = contract.no
form.contractName = contract.name
}

const materialOptions = [
{ value: '06Cr19Ni10' }
]

const typeOptions = [
{ value: '06Cr19Ni10' }
]

const standardOptions = [
{ value: 'GB/T20878-2007' },
{ value: 'GB/T1343-2014' }
]

const queryMaterialSuggestions = (queryString, cb) => {
const results = queryString
? materialOptions.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
: materialOptions
cb(results)
}

const queryTypeSuggestions = (queryString, cb) => {
const results = queryString
? typeOptions.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
: typeOptions
cb(results)
}

const queryStandardSuggestions = (queryString, cb) => {
const results = queryString
? standardOptions.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
: standardOptions
cb(results)
}

const form = reactive({
id: undefined,
basno: '',
contractNo: '',
contractName: '',
material: '',
mafactory: '',
matMaterial: '',
batchNo: '',
batchNum: '',
type: '',
deliveryQuantity: '',
acceptQuantity: '',
unit: 'kg',
certificate: '[]',
requestWriter: userStore.descr || '未知用户',
writeTime: '',
status: '10', // 初始状态为检验单录入
memo: ''
})

const rules = reactive({
basno: [
{ required: true, message: '请获取单据号', trigger: 'blur' }
],
contractNo: [
{ required: true, message: '请输入合同编号', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
contractName: [
{ required: true, message: '请输入合同名称', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
mafactory: [
{ required: true, message: '请选择原材料制造商', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
material: [
{ required: true, message: '请输入材质信息', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
matMaterial: [
{ required: true, message: '请输入牌号', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
batchNo: [
{ required: true, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],
type: [
{ required: true, message: '请输入型号', trigger: 'blur' },
{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
],

deliveryQuantity: [
{ type: 'number', message: '必须为数字', trigger: 'blur' }
],
acceptQuantity: [
{ type: 'number', message: '必须为数字', trigger: 'blur' }
],
requestWriter: [
{ required: true, message: '录入人不能为空', trigger: 'blur' }
],
memo: [
{ max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
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
basno: '',
contractNo: '',
contractName: '',
material: '',
mafactory: '',
matMaterial: '',
batchNo: '',
batchNum: '',
type: '',
deliveryQuantity: '',
acceptQuantity: '',
certificate: '[]',
requestWriter: userStore.descr || '未知用户',
writeTime: '',
status: '10',
memo: ''
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
await createBkx(form)
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

const dialogVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
dialogVisible.value = newVal
if (newVal) {
form.basno = props.newCode
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