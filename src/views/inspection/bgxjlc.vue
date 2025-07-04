<template>
  <div class="bgxjlc-management">
    <div class="action-bar">
      <el-input v-model="queryParams.contractNo" placeholder="请选择合同编号" readonly style="width: 200px; margin-right: 10px; cursor: pointer;" @focus="showContractDialog = true" :suffix-icon="'el-icon-search'" clearable @clear="clearContractNo" />
      <el-input v-model="queryParams.supplier" placeholder="请选择原材料制造商" readonly style="width: 200px; margin-right: 10px; cursor: pointer;" @focus="showSupplierDialog = true" :suffix-icon="'el-icon-search'" clearable @clear="clearSupplier" />
      <el-input v-model="queryParams.inspectionNo" placeholder="请输入来料检验批次号" style="width: 200px; margin-right: 10px;" clearable @clear="getListData" @keyup.enter="getListData" />
      <el-input v-model="queryParams.paiId" placeholder="请输入牌号" style="width: 200px; margin-right: 10px;" clearable @clear="getListData" @keyup.enter="getListData" />
      <el-button type="primary" @click="getListData">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon>
        刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="tableList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="contractNo" label="合同编号" width="140" />
      <el-table-column prop="supplier" label="原材料制造商" width="140" />
      <el-table-column prop="paiId" label="牌号" width="100" />
      <el-table-column prop="inspectionNo" label="来料检验批次号" width="140" />
      <el-table-column prop="Al" label="Al(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Al) }}</template>
      </el-table-column>
      <el-table-column prop="Si" label="Si(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Si) }}</template>
      </el-table-column>
      <el-table-column prop="Fe" label="Fe(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Fe) }}</template>
      </el-table-column>
      <el-table-column prop="Cu" label="Cu(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Cu) }}</template>
      </el-table-column>
      <el-table-column prop="Mg" label="Mg(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Mg) }}</template>
      </el-table-column>
      <el-table-column prop="Mn" label="Mn(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Mn) }}</template>
      </el-table-column>
      <el-table-column prop="Zn" label="Zn(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Zn) }}</template>
      </el-table-column>
      <el-table-column prop="Ti" label="Ti(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Ti) }}</template>
      </el-table-column>
      <el-table-column prop="Cr" label="Cr(%)" width="90">
        <template #default="{ row }">{{ formatPercent(row.Cr) }}</template>
      </el-table-column>
      <el-table-column prop="lstrength" label="拉伸强度(MPa)" width="120">
        <template #default="{ row }">{{ formatLstrength(row.lstrength) }}</template>
      </el-table-column>
      <el-table-column prop="elongation" label="延伸率(%)" width="100">
        <template #default="{ row }">{{ formatElongation(row.elongation) }}</template>
      </el-table-column>
      <el-table-column prop="outDate" label="原材料出厂检测日期" width="140" />
      <el-table-column prop="inDate" label="原材料入厂检测日期" width="140" />
      <el-table-column prop="certificate" label="质量证明书" width="160">
        <template #default="{ row }">
          <a v-if="row.certificate" :href="getCertificateUrl(row.certificate)" target="_blank">查看</a>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showForm" :title="isEdit ? '编辑并沟线夹铝材' : '新增并沟线夹铝材'" width="700px" top="5vh" destroy-on-close>
      <el-form :model="formData" ref="formRef" label-width="130px" :rules="rules">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="formData.contractNo" readonly @focus="showContractDialog = true" placeholder="请选择合同编号" style="cursor:pointer;">
            <template #append>
              <el-button @click="showContractDialog = true" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="原材料制造商" prop="supplier">
          <el-input v-model="formData.supplier" readonly @focus="showSupplierDialog = true" placeholder="请选择供应商" style="cursor:pointer;">
            <template #append>
              <el-button @click="showSupplierDialog = true" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="牌号" prop="paiId">
          <el-input v-model="formData.paiId" maxlength="50" />
        </el-form-item>
        <el-form-item label="来料检验批次号" prop="inspectionNo">
          <el-input v-model="formData.inspectionNo" maxlength="50" />
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Al(%)" prop="Al">
              <el-input v-model="formData.Al" maxlength="7" @input="onPercentInput('Al', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Si(%)" prop="Si">
              <el-input v-model="formData.Si" maxlength="7" @input="onPercentInput('Si', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fe(%)" prop="Fe">
              <el-input v-model="formData.Fe" maxlength="7" @input="onPercentInput('Fe', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Cu(%)" prop="Cu">
              <el-input v-model="formData.Cu" maxlength="7" @input="onPercentInput('Cu', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mg(%)" prop="Mg">
              <el-input v-model="formData.Mg" maxlength="7" @input="onPercentInput('Mg', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mn(%)" prop="Mn">
              <el-input v-model="formData.Mn" maxlength="7" @input="onPercentInput('Mn', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Zn(%)" prop="Zn">
              <el-input v-model="formData.Zn" maxlength="7" @input="onPercentInput('Zn', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ti(%)" prop="Ti">
              <el-input v-model="formData.Ti" maxlength="7" @input="onPercentInput('Ti', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Cr(%)" prop="Cr">
              <el-input v-model="formData.Cr" maxlength="7" @input="onPercentInput('Cr', $event)" placeholder="精度为3位小数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="拉伸强度(MPa)" prop="lstrength">
              <el-input v-model="formData.lstrength" maxlength="10" @input="onLstrengthInput($event)" placeholder="精度为1位小数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="延伸率(%)" prop="elongation">
              <el-input v-model="formData.elongation" maxlength="10" @input="onElongationInput($event)" placeholder="精度为0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="原材料出厂检测日期" prop="outDate">
          <el-date-picker v-model="formData.outDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="原材料入厂检测日期" prop="inDate">
          <el-date-picker v-model="formData.inDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="质量证明书" prop="certificate">
          <el-upload :http-request="customUpload" :file-list="uploadFileList" :limit="1" :on-remove="handleRemove" :show-file-list="true" list-type="text">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">支持任意类型文件，最大10M</div>
            </template>
          </el-upload>
          <a v-if="formData.certificate" :href="getCertificateUrl(formData.certificate)" target="_blank" style="margin-left:10px;">已上传，点击查看</a>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>

    <ContractItemDialog v-model="showContractDialog" @select="handleContractSelect" />
    <SupplierDialog v-model="showSupplierDialog" @select="handleSupplierSelect" />

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBgxjlcs, createBgxjlc, updateBgxjlc, deleteBgxjlc } from '@/api/inspection/bgxjlc'
import { uploadFile } from '@/api/file/file'
import ContractItemDialog from '@/views/inspection/components/ContractItemDialog.vue'
import SupplierDialog from '@/views/inspection/components/SupplierDialog.vue'
import { Refresh } from '@element-plus/icons-vue'

const BASE_FILE_URL = 'http://localhost:8099'

function getCertificateUrl(val) {
  if (!val) return ''
  return val.startsWith('http') ? val : BASE_FILE_URL + val
}

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  contractNo: '',
  supplier: '',
  inspectionNo: '',
  paiId: ''
})

const tableList = ref([])
const total = ref(0)
const loading = ref(false)

const getListData = async () => {
  loading.value = true
  try {
    const res = await getBgxjlcs(queryParams)
    tableList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    ElMessage.error('获取并沟线夹铝材检测列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getListData()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getListData()
}

const showForm = ref(false)
const isEdit = ref(false)
const formData = reactive({
  contractNo: '',
  supplier: '',
  paiId: '',
  inspectionNo: '',
  Al: '',
  Si: '',
  Fe: '',
  Cu: '',
  Mg: '',
  Mn: '',
  Zn: '',
  Ti: '',
  Cr: '',
  lstrength: '',
  elongation: '',
  outDate: '',
  inDate: '',
  certificate: ''
})
const formRef = ref(null)

const rules = {
  contractNo: [{ required: true, message: '请选择合同编号', trigger: 'blur' }],
  supplier: [{ required: true, message: '请选择原材料制造商', trigger: 'blur' }],
  paiId: [{ required: true, message: '请输入牌号', trigger: 'blur' }],
  inspectionNo: [{ required: true, message: '请输入来料检验批次号', trigger: 'blur' }],
  Al: [{ required: true, message: '请输入Al含量', trigger: 'blur' }],
  Si: [{ required: true, message: '请输入Si含量', trigger: 'blur' }],
  Fe: [{ required: true, message: '请输入Fe含量', trigger: 'blur' }],
  Cu: [{ required: true, message: '请输入Cu含量', trigger: 'blur' }],
  Mg: [{ required: true, message: '请输入Mg含量', trigger: 'blur' }],
  Mn: [{ required: true, message: '请输入Mn含量', trigger: 'blur' }],
  Zn: [{ required: true, message: '请输入Zn含量', trigger: 'blur' }],
  Ti: [{ required: true, message: '请输入Ti含量', trigger: 'blur' }],
  // Cr为可选字段
  lstrength: [{ required: true, message: '请输入拉伸强度', trigger: 'blur' }],
  elongation: [{ required: true, message: '请输入延伸率', trigger: 'blur' }],
  outDate: [{ required: true, message: '请选择原材料出厂检测日期', trigger: 'change' }],
  inDate: [{ required: true, message: '请选择原材料入厂检测日期', trigger: 'change' }],
  certificate: [{ required: true, message: '请上传质量证明书', trigger: 'change' }]
}

const showContractDialog = ref(false)
const showSupplierDialog = ref(false)

const uploadFileList = ref([])

watch(
  () => formData.certificate,
  (val) => {
    if (val) {
      uploadFileList.value = [{ name: val.split('/').pop(), url: getCertificateUrl(val) }]
    } else {
      uploadFileList.value = []
    }
  }
)

// 化学成分输入精度处理（3位小数）
function onPercentInput(key, val) {
  val = val.replace(/[^\d.]/g, '')
  val = val.replace(/^\./, '')
  val = val.replace(/\.{2,}/g, '.')
  val = val.replace('.', '#').replace(/\./g, '').replace('#', '.')
  if (val.indexOf('.') >= 0) {
    const parts = val.split('.')
    if (parts[1].length > 3) {
      val = parts[0] + '.' + parts[1].slice(0, 3)
      ElMessage.warning('化学成分精度为3位小数')
    }
  }
  formData[key] = val
}

function formatPercent(val) {
  if (val === undefined || val === null || val === '') return ''
  const num = parseFloat(val)
  if (isNaN(num)) return ''
  return num.toFixed(3)
}

// 拉伸强度精度为1位小数
function onLstrengthInput(val) {
  val = val.replace(/[^\d.]/g, '')
  val = val.replace(/^\./, '')
  val = val.replace(/\.{2,}/g, '.')
  val = val.replace('.', '#').replace(/\./g, '').replace('#', '.')
  if (val.indexOf('.') >= 0) {
    const parts = val.split('.')
    if (parts[1].length > 1) {
      val = parts[0] + '.' + parts[1].slice(0, 1)
      ElMessage.warning('拉伸强度精度为1位小数')
    }
  }
  formData.lstrength = val
}
function formatLstrength(val) {
  if (val === undefined || val === null || val === '') return ''
  const num = parseFloat(val)
  if (isNaN(num)) return ''
  return num.toFixed(1)
}

// 延伸率精度为0（整数）
function onElongationInput(val) {
  val = val.replace(/[^\d]/g, '')
  formData.elongation = val
}
function formatElongation(val) {
  if (val === undefined || val === null || val === '') return ''
  const num = parseInt(val)
  if (isNaN(num)) return ''
  return num
}

const customUpload = async (option) => {
  const formDataUpload = new FormData()
  formDataUpload.append('file', option.file)
  try {
    const res = await uploadFile(formDataUpload)
    let url = ''
    if (res.url) {
      url = res.url
    } else if (res.data && res.data.url) {
      url = res.data.url
    } else if (res.data && res.data.data && res.data.data.url) {
      url = res.data.data.url
    }
    if (url) {
      formData.certificate = url
      uploadFileList.value = [{ name: option.file.name, url: getCertificateUrl(url) }]
      option.onSuccess(res, option.file)
    } else {
      option.onError(new Error('上传失败'))
    }
  } catch (e) {
    option.onError(e)
  }
}

const handleRemove = () => {
  formData.certificate = ''
  uploadFileList.value = []
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    contractNo: '',
    supplier: '',
    paiId: '',
    inspectionNo: '',
    Al: '',
    Si: '',
    Fe: '',
    Cu: '',
    Mg: '',
    Mn: '',
    Zn: '',
    Ti: '',
    Cr: '',
    lstrength: '',
    elongation: '',
    outDate: '',
    inDate: '',
    certificate: ''
  })
  showForm.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  showForm.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该并沟线夹铝材检测记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteBgxjlc({ id: row.id })
    ElMessage.success('删除成功')
    handleRefresh()
  }).catch(() => {})
}

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const submitData = { ...formData }
      if (!isEdit.value) {
        await createBgxjlc(submitData)
        ElMessage.success('新增成功')
        handleRefresh()
      } else {
        await updateBgxjlc(submitData)
        ElMessage.success('更新成功')
        handleRefresh()
      }
      showForm.value = false
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
    }
  })
}

const handleContractSelect = (row) => {
  formData.contractNo = row.no
  queryParams.contractNo = row.no
  showContractDialog.value = false
}
const handleSupplierSelect = (descr) => {
  formData.supplier = descr
  queryParams.supplier = descr
  showSupplierDialog.value = false
}

const clearContractNo = () => {
  queryParams.contractNo = ''
}
const clearSupplier = () => {
  queryParams.supplier = ''
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.supplier = ''
  queryParams.inspectionNo = ''
  queryParams.paiId = ''
  queryParams.pageNumber = 1
  getListData()
}

onMounted(() => {
  getListData()
})
</script>

<style scoped>
.bgxjlc-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  margin-bottom: 20px;
}
.action-bar .el-button + .el-button {
  margin-left: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>