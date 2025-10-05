<template>
    <el-dialog title="编辑请检单" :model-value="visible" width="800px" :center="true" :close-on-click-modal="false"
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
  
          <el-col :span="24">
            <el-form-item label="供应商名称" prop="mafactoryname">
              <el-input v-model="form.mafactoryname" placeholder="选择供应商" readonly clearable="" @click="selectManufacturer"
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
            <el-form-item label="规格" prop="mattype">
              <el-autocomplete v-model="form.mattype" :fetch-suggestions="queryTypeSuggestions"
                placeholder="请选择或输入规格" clearable="" size="small">
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
            <el-form-item label="送货数量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="请输入送货数量" type="number" clearable=""
                size="small" step="0.01" @input="calculateTotal">
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
            <el-form-item label="总价" prop="shijiamount">
              <el-input v-model.number="form.shijiamount" placeholder="自动计算" type="number" clearable=""
                size="small" readonly>
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
            <el-form-item label="总重" prop="zongzhong">
              <el-input v-model.number="form.zongzhong" placeholder="自动计算" type="number" clearable=""
                size="small" readonly>
              </el-input>
            </el-form-item>
          </el-col>
  
          <el-col :span="24">
            <el-form-item label="质量证明书" prop="certificate">
              <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-success="handleUploadSuccess"
                :file-list="fileList"
                :limit="3"
                :on-exceed="handleExceed"
                :headers="{ 'Authorization': 'Bearer ' + userStore.token }"
                list-type="text"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
  
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注信息" type="textarea" rows="3" clearable="" size="small">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
     
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getXjById, updateXj } from '@/api/clmanage/cl-xj'
  import { useUserStore } from '@/store/user'
  
  const userStore = useUserStore()
  const formRef = ref(null)
  const fileList = ref([])
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  })
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const form = reactive({
    id: undefined,
    basno: '',
    contractno: '',
    contractName: '',
    mafactoryname: '',
    material: '',
    mattype: '',
    unit: '个',
    quantity: '',
    shijidanjia: '',
    shijiamount: '',
    danzhong: '',
    zongzhong: '',
    certificate: '[]',
    writer: userStore.descr || '未知用户',
    writeTime: '',
    status: '10',
    memo: ''
  })
  
  const rules = reactive({
    contractno: [
      { required: true, message: '请输入合同编号', trigger: 'blur' },
      { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
    ],
    mafactoryname: [
      { required: true, message: '请选择供应商名称', trigger: 'blur' },
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ],
    material: [
      { required: true, message: '请输入材质信息', trigger: 'blur' },
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ],
    mattype: [
      { required: true, message: '请输入规格', trigger: 'blur' },
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ],
    quantity: [
      { type: 'number', required: true, message: '请输入送货数量', trigger: 'blur' }
    ],
    shijidanjia: [
      { type: 'number', required: true, message: '请输入单价', trigger: 'blur' }
    ],
    danzhong: [
      { type: 'number', required: true, message: '请输入单重', trigger: 'blur' }
    ]
  })
  
  const materialOptions = [
    { value: '天然橡胶' },
    { value: '丁苯橡胶' },
    { value: '顺丁橡胶' }
  ]
  
  const typeOptions = [
    { value: 'SBR1502' },
    { value: 'BR9000' },
    { value: 'NR' }
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
  
  const calculateTotal = () => {
    if (form.quantity && form.shijidanjia) {
      form.shijiamount = (form.quantity * form.shijidanjia).toFixed(2)
    }
    
    if (form.quantity && form.danzhong) {
      form.zongzhong = (form.quantity * form.danzhong).toFixed(2)
    }
  }
  
  const handleUploadSuccess = (response, file, fileList) => {
    if (response.code === 200) {
      ElMessage.success('上传成功')
      const files = fileList.map(f => ({
        name: f.name,
        url: response.data.url
      }))
      form.certificate = JSON.stringify(files)
    } else {
      ElMessage.error(response.msg || '上传失败')
    }
  }
  
  const handleExceed = (files, fileList) => {
    ElMessage.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  }
  
  const loadData = async (id) => {
    try {
      const res = await getXjById(id)
      if (res?.code === 200) {
        const data = res.data.record
        Object.assign(form, data)
        form.unit = data.unit || '个'
        
        // 处理文件列表
        if (data.certificate) {
          try {
            const files = JSON.parse(data.certificate)
            fileList.value = files.map(f => ({
              name: f.name,
              url: f.url,
              uid: f.url
            }))
          } catch (e) {
            console.error('解析证书文件失败', e)
          }
        }
      } else {
        ElMessage.error(res?.msg || '获取数据失败')
      }
    } catch (error) {
      console.error('获取数据失败', error)
      ElMessage.error('获取数据失败')
    }
  }
  
  const handleSubmit = async () => {
    try {
      await formRef.value.validate()
      const res = await updateXj(form)
      if (res?.code === 200) {
        ElMessage.success('更新成功')
        emit('success')
      } else {
        ElMessage.error(res?.msg || '更新失败')
      }
    } catch (error) {
      if (error.name === 'ValidationError') return
      console.error('更新失败', error)
      ElMessage.error('更新失败')
    }
  }
  
  const selectContract = () => {
    ElMessageBox.alert('合同选择功能待实现', '提示')
  }
  
  const selectManufacturer = () => {
    ElMessageBox.alert('供应商选择功能待实现', '提示')
  }
  
  const resetForm = () => {
    formRef.value?.resetFields()
    fileList.value = []
  }
  
  watch(() => props.visible, (newVal) => {
    if (newVal && props.id) {
      loadData(props.id)
    }
  })
  
  onMounted(() => {
    if (props.visible && props.id) {
      loadData(props.id)
    }
  })
  </script>
  
  <style scoped>
  .custom-form {
    margin-top: 10px;
  }
  
  :deep(.el-upload) {
    margin-top: 10px;
  }
  </style>