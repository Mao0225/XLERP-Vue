<template>
  <div class="nzxjFc-management">
        <div class="action-bar">
      <el-input v-model="queryParams.mafactory" placeholder="请输入原材料制造商查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjFcList" @keyup.enter="getNzxjFcList" />
      <el-input v-model="queryParams.maQuality" placeholder="请输入辅材类型" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjFcList" @keyup.enter="getNzxjFcList" />
        <el-input v-model="queryParams.orderno" placeholder="请输入入库单号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjFcList" @keyup.enter="getNzxjFcList" />
    <el-input v-model="queryParams.matRecheckNo" placeholder="请输入来料检验批次号" style="width: 200px; margin-right: 10px;"
        clearable @clear="getNzxjFcList" @keyup.enter="getNzxjFcList" />
       


      <el-button type="primary" @click="getNzxjFcList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
    </div>
    
    <el-table :data="nzxjFcList" border v-loading="loading" style="width: 100%">
      <!-- 序号 -->
       <el-table-column type="index" label="序号" width="80" />
       <!-- <el-table-column prop="id" label="ID" width="80" /> -->
<el-table-column prop="contractNo" label="合同编号" />
<el-table-column prop="woNo" label="生产工单号" />
<el-table-column prop="ipoNo" label="生产订单号" />
<el-table-column prop="writer" label="录入人" />
<el-table-column prop="writeTime" label="录入时间" />

      <el-table-column prop="mafactory" label="原材料制造商" />
      <el-table-column prop="maQuality" label="辅材类型" />
      <el-table-column prop="orderno" label="入库单号" />
      <el-table-column prop="matRecheckNo" label="来料检验批次号" />
      <el-table-column prop="sampleNumber" label="样品编号" />
      <el-table-column prop="testResult" label="检测结果" />
     
      <el-table-column prop="leavefactoryDate" label="原材料出厂检测日期" width="120" />
      <el-table-column prop="detectionTime" label="原材料入厂检测日期" width="120"/>
      <el-table-column prop="certificate" label="质量证明书">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.certificate || '[]')" :key="index">
            <!-- 新增el-tooltip显示原文件名，文本固定为"打开文件" -->
      <el-tooltip :content="file.name" placement="top">
        <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">
          打开文件
        </span>
      </el-tooltip>
          </div>
        </template>
      </el-table-column>


      

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">

        
            <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" placeholder="合同编号" readonly />
        </el-form-item>

            <el-form-item label="生产工单号" prop="woNo">
              <el-input v-model="form.woNo" placeholder="选择生产工单号" readonly @click="selectWoNo">
                <template #append>
                  <el-button @click="selectWoNo" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>

             <el-form-item label="生产订单号" prop="ipoNo">
            <el-input v-model="form.ipoNo" placeholder="生产订单号" readonly />
        </el-form-item>

        <el-form-item label="录入人" prop="writer">
            <el-input v-model="form.writer" placeholder="录入人" readonly />
        </el-form-item>

           

            <el-form-item label="原材料制造商" prop="mafactory">
              <el-input v-model="form.mafactory" placeholder="请输入原材料制造商" />
            </el-form-item>
            <el-form-item label="辅材类型" prop="maQuality">
              <el-input v-model="form.maQuality" placeholder="请输入辅材类型" />
            </el-form-item>
            <el-form-item label="入库单号" prop="orderno">
              <el-input v-model="form.orderno" placeholder="请输入入库单号" />
            </el-form-item>
            <el-form-item label="来料检验批次号" prop="matRecheckNo">
              <el-input v-model="form.matRecheckNo" placeholder="请输入来料检验批次号" />
            </el-form-item>
            <el-form-item label="样品编号" prop="sampleNumber">
              <el-input v-model="form.sampleNumber" placeholder="请输入样品编号" />
            </el-form-item>
            <el-form-item label="检测结果" prop="testResult">
              <el-input v-model="form.testResult" placeholder="请输入检测结果" />
            </el-form-item>
            
            <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">             
              <el-date-picker
                v-model="form.leavefactoryDate"
                type="date"
                placeholder="请选择原材料出厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%" />  
            </el-form-item>
            <el-form-item label="原材料入厂检测日期" prop="detectionTime">             
              <el-date-picker
                v-model="form.detectionTime"
                type="date"
                placeholder="请选择原材料入厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%"/>
            </el-form-item>

            <el-form-item label="质量证明书" prop="certificate">
                <el-upload
            ref="certificateUpload"
            :auto-upload="false"
            :on-change="handleCertificateChange"
            :limit="10"
            accept=".pdf,.jpg,.jpeg,.png"
            :file-list="[]"  
            :show-file-list="false"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
          <div class="uploaded-files" v-if="form.certificate">
            <div v-for="(file, index) in JSON.parse(form.certificate)" :key="index" class="uploaded-file">
              
              <!-- 新增el-tooltip显示原文件名，文本固定为"打开文件" -->
    <el-tooltip :content="file.name" placement="top">
      <span class="file-link" @click="openFileInNewWindow(file.url, file.name)">
        {{ file.name }}
      </span>
    </el-tooltip>
              <el-button type="danger" size="mini" @click="deleteCertificateFile(index)">删除</el-button>
            </div>
          </div>
            </el-form-item>

          </el-col>
          
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>


    <!-- 生产工单号选择弹窗 -->
     <WoNoSelector v-model="woNoSelectorVisible" @select="handleWoNoSelectorSelect" 
     :woNoList="woNoList" 
      :totalWoNo="totalWoNo" 
      :loadingWoNo="loadingWoNo" 
      @search="searchWoNo" 
      />

    
 </div> 
</template> 






<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox,ElTooltip } from 'element-plus'
import { getNzxjFc, getNzxjFcById, createNzxjFc, updateNzxjFc, deleteNzxjFc , getWoNoList} from '@/api/clmanage/nzxjfc'
import { useUserStore } from '@/store/user'
import { Refresh } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/file/file'


import WoNoSelector from '@/views/clmanage/tqy/WoNoSelector.vue'

const baseUrl = 'http://127.0.0.1:8099'

const userStore = useUserStore()

const getWriterName = () =>{
  console.log("获取登录用户名称",userStore.descr)
  return userStore.descr
}

// 查询参数
const queryParams = reactive({
  mafactory: '',
  maQuality: '',
  orderno: '',
  matRecheckNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 数据列表数据
const nzxjFcList = ref([])
const total = ref(0)
const loading = ref(false)

// 生产工单号选择弹窗显示状态
const woNoSelectorVisible = ref(false)
// 生产工单号列表
const woNoList = ref([])
// 生产工单号总数
const totalWoNo = ref(0)
// 生产工单号列表加载状态
const loadingWoNo = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增数据' : '编辑数据')
const formRef = ref(null)
const certificateUpload = ref(null)
const certificateFileList = ref([])
const form = reactive({
  id: undefined,
  contractNo: '',
  woNo: '',
  ipoNo: '',
  mafactory: '',
  maQuality: '',
  orderno: '',
  matRecheckNo: '',
  sampleNumber: '',
  testResult: '',
  leavefactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  writeTime: '',
  writer: getWriterName(),
  status: 0,
  isdelete: 0
})

// 表单验证规则
const rules = {
  mafactory: [
    { required: true, message: '请输入原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  maQuality: [
    { required: true, message: '请输入辅材类型', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  orderno: [
    { required: true, message: '请输入入库单号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matRecheckNo: [
    { required: true, message: '请输入来料检测批测号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  sampleNumber: [
    { required: true, message: '请输入样品编号', trigger: 'blur' }
  ],
  testResult: [
    { required: true, message: '请输入检测结果', trigger: 'blur' }
  ],
  leavefactoryDate: [
    { required: true, message: '请输入出厂日期', trigger: 'change' }
  ],
  detectionTime: [
    { required: true, message: '请输入入厂日期', trigger: 'change' }
  ],
  
  contractNo: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  woNo: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  ipoNo: [
    { required: true, message: '长度不能超过50个字符', trigger: 'blur' }
  ],

}


// 选择生产工单号
const selectWoNo = () => {
  woNoSelectorVisible.value = true
  searchWoNo() // 确保函数被调用
};


// 处理生产工单号选择事件
const handleWoNoSelectorSelect = (woNoInfo) => {
  queryParams.woNo = woNoInfo.woNo;
  form.woNo = woNoInfo.woNo;
  woNoSelectorVisible.value = false;

  // 直接从选择的工单信息中获取ipoNo和contractNo
  if (woNoInfo.ipoNo) {
    form.ipoNo = woNoInfo.ipoNo;
    console.log('设置生产订单号:', form.ipoNo); // 打印设置的生产订单号
  } else {
    ElMessage.warning('未找到对应的生产订单号');
  }

  if (woNoInfo.contractNo) {
    form.contractNo = woNoInfo.contractNo;
    console.log('设置合同号:', form.contractNo); // 打印设置的合同号

    // 检查ipoNo和contractNo是否相同
    if (form.ipoNo && form.ipoNo === form.contractNo) {
      ElMessage.info('生产订单号与合同号相同');
    }
  } else {
    ElMessage.warning('未找到对应的合同号');
  }
};

// 获取生产工单号列表
const searchWoNo = async (woNo = '') => {
  loadingWoNo.value = true
  try {
    const res = await getWoNoList({
      pageNumber: 1,
      pageSize: 10,
      woNo
    })
    woNoList.value = res.data.page.list
    totalWoNo.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同号列表失败', error)
    ElMessage.error('获取合同号列表失败')
  } finally {
    loadingWoNo.value = false
  }
}

// 获取数据列表
const getNzxjFcList = async () => {
  loading.value = true
  try {
    const res = await getNzxjFc(queryParams)
    nzxjFcList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取数据列表失败', error)
    ElMessage.error('获取数据列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getNzxjFcList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getNzxjFcList()
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
  Object.assign(form, {
    id: undefined,
    contractNo: '',
    woNo: '',
   ipoNo: '',
  mafactory: '',
  maQuality: '',
  orderno: '',
  matRecheckNo: '',
  sampleNumber: '',
  testResult: '',
  leavefactoryDate: '',
  detectionTime: '',
  certificate: '[]',
  writeTime: '',
  writer:getWriterName(),
  status: 0,
  isdelete: 0
  })
}

//刷新
const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.woNo = ''
  queryParams.ipoNo = ''
  queryParams.mafactory = ''
  queryParams.maQuality = ''
  queryParams.orderno = ''
  queryParams.matRecheckNo = ''
  queryParams.pageNumber = 1
  getNzxjFcList()
}

// 新增数据
const handleAdd = () => {
  dialogType.value = 'add'
  
  resetForm()
  // 确保新增时使用当前用户信息
  form.writer = userStore.descr || '未知用户'

  dialogVisible.value = true
}

// 编辑数据
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getNzxjFcById({ id: row.id })
  Object.assign(form, res.data.nzxjFc)
   if (!form.writer) {
    form.writer = userStore.descr || '未知用户'
  }
  try {
    JSON.parse(form.certificate)
  } catch (e) {
    if (form.certificate) {
      const urls = form.certificate.split('-')
      form.certificate = JSON.stringify(urls.map(url => ({ name: url.split('/').pop(), url: `/api/upload/${url}` })))
    } else {
      form.certificate = '[]'
    }
  }
  certificateFileList.value = JSON.parse(form.certificate)
  dialogVisible.value = true
}

// 删除数据
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除数据"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteNzxjFc({ id: row.id })
      ElMessage.success('删除成功')
      getNzxjFcList()
    } catch (error) {
      console.error('删除数据失败', error)
      ElMessage.error('删除数据失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 自动生成当前时间
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        form.writeTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        if (dialogType.value === 'add') {
          await createNzxjFc(form);
          ElMessage.success('新增成功');
        } else {
          await updateNzxjFc(form);
          ElMessage.success('修改成功');
        }
        dialogVisible.value = false;
        getNzxjFcList();
      } catch (error) {
        console.error('保存数据失败', error);
        ElMessage.error('保存数据失败');
      }
    }
  })
}

// 处理质量证明书上传
const handleCertificateChange = async (file) => {
  const formData = new FormData()
  formData.append('file', file.raw)
  

  try {
    const res = await uploadFile(formData)
    if (res.success && res.data && res.data.url) {
      const newUrl = baseUrl + res.data.url
      const fileList = JSON.parse(form.certificate)
      fileList.push({ name: file.name, url: newUrl })
      form.certificate = JSON.stringify(fileList)
      certificateFileList.value.push({ name: file.name, url: newUrl })
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

// 删除已上传的质量证明书文件
const deleteCertificateFile = (index) => {
  const fileList = JSON.parse(form.certificate)
  fileList.splice(index, 1)
  form.certificate = JSON.stringify(fileList)
  certificateFileList.value.splice(index, 1)
}

// 下载文件
const openFileInNewWindow = (url) => {
  window.open(url, '_blank');
}

// 页面初始化
onMounted(() => {
  getNzxjFcList()
})
</script>

<style scoped>
.nzxjFc-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.uploaded-files {
  margin-top: 10px;
}
.uploaded-file {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.uploaded-file .el-button {
  margin-left: 10px;
}
.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}
.file-link:hover {
  text-decoration: underline;
}
</style>