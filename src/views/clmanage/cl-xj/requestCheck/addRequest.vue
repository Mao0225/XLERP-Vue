<template>
    <el-dialog 
    title="新增请检单" 
    :model-value="visible" 
    width="800px" 
    :center="true" 
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)" 
    @closed="resetForm"
  >
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
  
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractno">
              <el-input v-model="form.contractno" placeholder="选择合同" readonly clearable="" @click="selectContract"
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
              </el-input>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="制造商" prop="mafactoryname">
              <el-input v-model="form.mafactoryname" placeholder="选择制造商" readonly clearable="" @click="selectManufacturer"
                size="small">
                <template #append="">
                  <el-button @click="selectManufacturer" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="材质" prop="material">
              <el-autocomplete v-model="form.material" :fetch-suggestions="queryMaterialSuggestions"
                placeholder="请选择或输入材质" clearable="" size="small">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="mattype">
              <el-autocomplete v-model="form.mattype" :fetch-suggestions="queryTypeSuggestions"
                placeholder="请选择或输入型号" clearable="" size="small">
              </el-autocomplete>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" clearable="" size="small" readonly>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="shijidanjia">
              <el-input v-model.number="form.shijidanjia" placeholder="请输入单价" type="number" clearable=""
                size="small" step="0.01" @input="calculateTotal">
              </el-input>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="单重" prop="danzhong">
              <el-input v-model.number="form.danzhong" placeholder="请输入单重" type="number" clearable=""
                size="small" step="0.01" @input="calculateTotal">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送货数量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="请输入送货数量" type="number" clearable=""
                size="small" step="0.01" @input="calculateTotal">
              </el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="检验数量" prop="sampleQuantity">
              <el-input v-model.number="form.sampleQuantity" placeholder="请输检验数量" type="number" clearable=""
                size="small" step="0.01"  >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总价" prop="shijiamount">
              <el-input v-model.number="form.shijiamount" placeholder="自动计算" type="number" clearable=""
                size="small" readonly>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总重" prop="zongzhong">
              <el-input v-model.number="form.zongzhong" placeholder="自动计算" type="number" clearable=""
                size="small" readonly>
              </el-input>
            </el-form-item>
          </el-col>
  
          <el-col :span="24">
            <el-form-item label="质量证明书" prop="certificate">
              <el-upload ref="certificateUpload" :auto-upload="false" :on-change="handleCertificateChange" :limit="3"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" :file-list="certificateFileList" :show-file-list="false">
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传.pdf,.doc,.docx,.jpg,.jpeg,.png文件，且不超过500kb
                  </div>
                </template>
              </el-upload>
              <div class="uploaded-files" v-if="certificateFileList.length > 0">
                <div v-for="(file, index) in certificateFileList" :key="index" class="uploaded-file">
                  <span class="file-name" @click="openFileInNewWindow(file.url)">
                    {{ file.name }}
                  </span>
                  <el-button type="text" size="small" @click="deleteCertificateFile(index)">删除</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
  
          <!-- 备注 -->
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注信息" type="textarea" rows="3" clearable="" size="small"
                maxlength="200" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
        <!-- 选择器组件 -->
        <SupplierSelector v-model:visible="supplierSelectorVisible" @select="handleSelect" />
        <ContractSelector v-model:visible="contractSelectorVisible" @select="handleContractSelect" />
  
        <template v-slot:footer> <!-- 显式指定插槽名称 -->
      <div class="dialog-footer"> <!-- 使用div而非span，确保块级显示 -->
        <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting" size="small">确定</el-button>
      </div>
    </template>
      
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { createXj } from '@/api/clmanage/cl-xj'
  import { getNewNoNyName } from '@/api/system/basno'
  import { uploadFile } from '@/api/file/file'
  import { baseURL } from '@/utils/request'
  import { useUserStore } from '@/store/user'
  import SupplierSelector from '../../components/SupplierSelector.vue'
  import ContractSelector from '../../components/contractSelector.vue'
  
  const userStore = useUserStore()
  
  // 定义组件属性和事件
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
  
  const emit = defineEmits(['update:visible', 'success'])
  
  // 表单引用
  const formRef = ref(null)
  const certificateUpload = ref(null)
  
  // 选择器显示状态
  const supplierSelectorVisible = ref(false)
  const contractSelectorVisible = ref(false)
  
  // 文件上传相关
  const certificateFileList = ref([])
  const uploadedFiles = ref([])
  const submitting = ref(false)
  
  // 材质和型号选项
  const materialOptions = [
    { value: '天然橡胶' },
    { value: '丁苯橡胶' },
    { value: '顺丁橡胶' },
    { value: '氯丁橡胶' }
  ]
  
  const typeOptions = [
    { value: 'SBR1502' },
    { value: 'BR9000' },
    { value: 'CR121' },
    { value: 'NR' }
  ]
  
  // 表单数据
  const form = reactive({
    id: undefined,
    basno: '',
    contractno: '',
    contractName: '',
    mafactoryname: '',
    material: '',
    mattype: '',
    unit: '个', // 单位默认为"个"
    shijidanjia: '', // 单价
    danzhong: '', // 单重
    quantity: '', // 送货数量
    sampleQuantity: '', // 验收数量
    shijiamount: '', // 总价
    zongzhong: '', // 总重
    certificate: '[]', // 质量证明书
    writer: userStore.descr || '未知用户', // 录入人
    writeTime: '',
    status: '10', // 初始状态为检验单录入
    memo: ''
  })
  
  // 表单验证规则
  const rules = reactive({
    basno: [
      { required: true, message: '请获取单据号', trigger: 'blur' }
    ],
    contractno: [
      { required: true, message: '请输入合同编号', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    contractName: [
      { required: true, message: '请输入合同名称', trigger: 'blur' },
      { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
    ],
    mafactoryname: [
      { required: true, message: '请选择制造商', trigger: 'blur' },
      { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
    ],
    material: [
      { required: true, message: '请输入材质信息', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    mattype: [
      { required: true, message: '请输入型号', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    shijidanjia: [
      { required: true, type: 'number', message: '请输入单价', trigger: 'blur' }
    ],
    danzhong: [
      { required: true, type: 'number', message: '请输入单重', trigger: 'blur' }
    ],
    quantity: [
      { required: true, type: 'number', message: '请输入送货数量', trigger: 'blur' }
    ],
    sampleQuantity: [
      { required: true, type: 'number', message: '请输入验收数量', trigger: 'blur' }
    ],
    writer: [
      { required: true, message: '录入人不能为空', trigger: 'blur' }
    ],
    memo: [
      { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
    ]
  })
  
  // 计算总价和总重
  const calculateTotal = () => {
    // 总价 = 单价 * 数量
    if (form.shijidanjia && form.quantity) {
      form.shijiamount = (form.shijidanjia * form.quantity).toFixed(2)
    }
    
    // 总重 = 单重 * 数量
    if (form.danzhong && form.quantity) {
      form.zongzhong = (form.danzhong * form.quantity).toFixed(2)
    }
  }
  
  // 材质自动完成建议
  const queryMaterialSuggestions = (queryString, cb) => {
    const results = queryString
      ? materialOptions.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
      : materialOptions
    cb(results)
  }
  
  // 型号自动完成建议
  const queryTypeSuggestions = (queryString, cb) => {
    const results = queryString
      ? typeOptions.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
      : typeOptions
    cb(results)
  }
  
  // 选择合同
  const selectContract = () => {
    contractSelectorVisible.value = true
  }
  
  // 选择制造商
  const selectManufacturer = () => {
    supplierSelectorVisible.value = true
  }
  
  // 处理供应商选择
  const handleSelect = (supplier) => {
    form.mafactoryname = supplier.descr
  }
  
  // 处理合同选择
  const handleContractSelect = (contract) => {
    form.contractno = contract.no
    form.contractName = contract.name
  }
  
  // 文件上传处理
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
      if (certificateUpload.value) {
        certificateUpload.value.clearFiles()
      }
    }
  }
  
  // 删除上传文件
  const deleteCertificateFile = (index) => {
    const fileList = JSON.parse(form.certificate)
    fileList.splice(index, 1)
    form.certificate = JSON.stringify(fileList)
    certificateFileList.value.splice(index, 1)
  }
  
  // 打开文件
  const openFileInNewWindow = (url) => {
    window.open(baseURL + url, '_blank')
  }
  
  // 表单提交
  const handleSubmit = async () => {
    if (!formRef.value) return
    submitting.value = true
    try {
      await formRef.value.validate()
      
      if (!form.basno) {
        ElMessage.error('单据号未生成，请刷新重试')
        return
      }
      
      // 格式化时间
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      form.writeTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      
      // 准备提交数据
      const submitData = { ...form }
      
      // 提交表单
      const response = await createXj(submitData)
      if (response?.code === 200) {
        ElMessage.success('新增请检单成功')
        emit('success')
        emit('update:visible', false)
      } else {
        ElMessage.error(response?.msg || '新增请检单失败')
      }
    } catch (error) {
      console.error('提交失败', error)
      if (error.name !== 'ValidationError') {
        ElMessage.error('提交失败，请重试')
      }
    } finally {
      submitting.value = false
    }
  }
  
  // 重置表单
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    if (certificateUpload.value) {
      certificateUpload.value.clearFiles()
    }
    certificateFileList.value = []
    uploadedFiles.value = []
    form.certificate = '[]'
    form.contractName = ''
    // 重新获取单据号
    getBasNo()
  }
  
  // 获取单据号
  const getBasNo = async () => {
    try {
      const res = await getNewNoNyName('cl-xj')
      if (res?.code === 200) {
        form.basno = res.data.fullNoNyName
      } else {
        ElMessage.error(res?.msg || '获取单据号失败')
      }
    } catch (error) {
      console.error('获取单据号失败', error)
      ElMessage.error('获取单据号失败')
    }
  }
  
  // 监听visible变化
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      form.basno = props.newCode || form.basno
    }
  })
  
  // 组件挂载时获取单据号
  onMounted(() => {
    getBasNo()
    form.writer = userStore.descr || '未知用户'
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

          :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #e8ecef;
    background: #f5f7fa;
    /* 确保footer不被截断 */
    overflow: visible;
    display: block;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    width: 100%; /* 确保占满底部宽度 */
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