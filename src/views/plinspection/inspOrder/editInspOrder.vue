<template>
  <el-dialog
    title="编辑报检单"
    v-model="visible"
    width="1000px"
    @closed="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="检验单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="系统自动生成" readonly/>
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
          <el-form-item label="实际到货材质" prop="actualMaterial">
            <el-input v-model="form.actualMaterial" placeholder="如 Q235B" />
          </el-form-item>

          <el-form-item label="实际到货型号" prop="actualSpec">
            <el-input v-model="form.actualSpec" placeholder="如 100*100*10" />
          </el-form-item>

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
            <el-input v-model="form.reporter" readonly/>
          </el-form-item>
        </el-col>
      </el-row>

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
              <a
                :href="file.url.startsWith('http') ? file.url : baseURL + file.url"
                target="_blank"
                class="file-name"
              >{{ file.name }}</a>
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
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Delete, UploadFilled } from '@element-plus/icons-vue'
import {
  updateInspOrder,
  getInspOrderById
} from '@/api/plinspection/inspOrder'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const props = defineProps({
  modelValue: Boolean,
  id: [String, Number]
})
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(
  () => props.modelValue,
  async (newVal) => {
    visible.value = newVal
    if (newVal && props.id) {
      await loadData()
    }
  }
)
watch(visible, (v) => emit('update:modelValue', v))

const formRef = ref(null)
const certificateFileList = ref([])
const isDragover = ref(false)
const fileInput = ref(null)

const form = reactive({
  id: null,
  orderNo: '',
  batchNo: '',
  batchNumber: '',
  quantity: null,
  actualQuantity: null,
  actualWeight: null,
  actualMaterial: '',
  actualSpec: '',
  deliveryTime: '',
  reporter: '',
  remark: '',
  certificate: '[]',
  status: 0
})

const rules = {
  orderNo: [{ required: true, message: '请输入检验单号', trigger: 'blur' }],
  batchNo: [{ required: true, message: '请输入炉批号', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
  actualQuantity: [
    { required: true, message: '请输入实际到货数量', trigger: 'blur' }
  ],
  actualWeight: [
    { required: true, message: '请输入实际到货重量', trigger: 'blur' }
  ],
  actualMaterial: [
    { required: true, message: '请输入材质', trigger: 'blur' }
  ],
  actualSpec: [{ required: true, message: '请输入型号', trigger: 'blur' }],
  deliveryTime: [
    { required: true, message: '请选择送货时间', trigger: 'change' }
  ],
  reporter: [{ required: true, message: '请输入报检人', trigger: 'blur' }]
}

// 加载表单数据
const loadData = async () => {
  try {
    const res = await getInspOrderById({id: props.id})
    if (res.success && res.data) {
      const record = res.data.inspOrder
      Object.assign(form, record)
      // 处理时间格式（确保和组件格式一致）
      form.deliveryTime = record.deliveryTime ? record.deliveryTime : new Date().toISOString().slice(0, 16).replace('T', ' ')
      form.certificate = record.certificate || '[]'

      // 同步文件列表
      const files = JSON.parse(form.certificate || '[]')
      certificateFileList.value = files.map((f) => ({
        name: f.name,
        url: f.url
      }))
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (err) {
    ElMessage.error('加载数据出错')
  }
}

const handleFileUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await uploadFile(formData)
    if (res.success && res.data?.url) {
      const relativeUrl = res.data.url
      const fileList = JSON.parse(form.certificate || '[]')
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

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length) {
    Array.from(files).forEach(file => handleFileUpload(file))
  }
  e.target.value = ''
}

const removeFile = (index) => {
  const fileList = JSON.parse(form.certificate)
  fileList.splice(index, 1)
  form.certificate = JSON.stringify(fileList)
  certificateFileList.value.splice(index, 1)
}

// 提交修改
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await updateInspOrder(form)
      ElMessage.success('修改成功')
      visible.value = false
      emit('success')
    } catch (err) {
      ElMessage.error(err.message || '保存失败')
    }
  })
}

// 重置表单
const reset = () => {
  formRef.value?.resetFields()
  certificateFileList.value = []
  Object.assign(form, {
    id: null,
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
    status: 0
  })
}
</script>

<style scoped>
:deep(.el-dialog__body) { 
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

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

/* 文件列表 - 横向排列 */
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
  color: #409eff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 6px;
  text-decoration: underline;
}
</style>